import {
  concatHex,
  decodeFunctionResult,
  encodeFunctionData,
  numberToHex,
  parseAbi,
  type Hex,
} from "viem";
import { FEEDS, POOL_FEES, TOKENS, UNISWAP } from "@/config/swap";
import { rpc } from "@/lib/rpc";

/* Quotes and transactions for the Treasury Route. Everything goes straight to
   Uniswap's own contracts: the quoter for prices, SwapRouter02 for the swap.
   No Valtora contract sits in between and no fee is added. */

const QUOTER_ABI = parseAbi([
  "function quoteExactInputSingle((address tokenIn,address tokenOut,uint256 amountIn,uint24 fee,uint160 sqrtPriceLimitX96)) returns (uint256 amountOut,uint160 sqrtPriceX96After,uint32 initializedTicksCrossed,uint256 gasEstimate)",
  "function quoteExactInput(bytes path,uint256 amountIn) returns (uint256 amountOut,uint160[] sqrtPriceX96AfterList,uint32[] initializedTicksCrossedList,uint256 gasEstimate)",
]);

const ROUTER_ABI = parseAbi([
  "function exactInputSingle((address tokenIn,address tokenOut,uint24 fee,address recipient,uint256 amountIn,uint256 amountOutMinimum,uint160 sqrtPriceLimitX96)) payable returns (uint256 amountOut)",
  "function exactInput((bytes path,address recipient,uint256 amountIn,uint256 amountOutMinimum)) payable returns (uint256 amountOut)",
  "function multicall(uint256 deadline,bytes[] data) payable returns (bytes[] results)",
]);

const ERC20_ABI = parseAbi([
  "function balanceOf(address) view returns (uint256)",
  "function allowance(address,address) view returns (uint256)",
  "function approve(address,uint256) returns (bool)",
]);

const FEED_ABI = parseAbi(["function latestRoundData() view returns (uint80,int256,uint256,uint256,uint80)"]);

export type Side = "buy-usdg" | "buy-eth" | "sell";

export const SIDES: Record<Side, { from: "USDG" | "ETH" | "SGOV"; to: "SGOV" | "USDG"; label: string }> = {
  "buy-usdg": { from: "USDG", to: "SGOV", label: "Buy with USDG" },
  "buy-eth": { from: "ETH", to: "SGOV", label: "Buy with ETH" },
  sell: { from: "SGOV", to: "USDG", label: "Sell for USDG" },
};

export type Route =
  | { kind: "single"; tokenIn: Hex; tokenOut: Hex; fee: number; label: string }
  | { kind: "path"; path: Hex; label: string };

export type Quote = { amountOut: bigint; route: Route };

const call = (to: string, data: Hex) => rpc<Hex>("eth_call", [{ to, data }, "latest"]);

function encodePath(tokens: string[], fees: number[]): Hex {
  const parts: Hex[] = [tokens[0] as Hex];
  fees.forEach((fee, i) => {
    parts.push(numberToHex(fee, { size: 3 }), tokens[i + 1] as Hex);
  });
  return concatHex(parts);
}

function candidates(side: Side): Route[] {
  const U = TOKENS.USDG.address as Hex;
  const S = TOKENS.SGOV.address as Hex;
  const W = TOKENS.WETH.address as Hex;
  if (side === "buy-usdg") return POOL_FEES.usdgSgov.map((fee) => ({ kind: "single", tokenIn: U, tokenOut: S, fee, label: `USDG → SGOV · ${fee / 10000}% pool` }));
  if (side === "sell") return POOL_FEES.usdgSgov.map((fee) => ({ kind: "single", tokenIn: S, tokenOut: U, fee, label: `SGOV → USDG · ${fee / 10000}% pool` }));
  const direct: Route[] = POOL_FEES.wethSgov.map((fee) => ({ kind: "single", tokenIn: W, tokenOut: S, fee, label: `ETH → SGOV · ${fee / 10000}% pool` }));
  const viaUsdg: Route[] = POOL_FEES.wethUsdg.flatMap((f1) =>
    POOL_FEES.usdgSgov.map((f2) => ({ kind: "path" as const, path: encodePath([W, U, S], [f1, f2]), label: `ETH → USDG → SGOV · ${f1 / 10000}% + ${f2 / 10000}% pools` })),
  );
  return [...direct, ...viaUsdg];
}

async function quoteRoute(route: Route, amountIn: bigint): Promise<bigint> {
  const data =
    route.kind === "single"
      ? encodeFunctionData({ abi: QUOTER_ABI, functionName: "quoteExactInputSingle", args: [{ tokenIn: route.tokenIn, tokenOut: route.tokenOut, amountIn, fee: route.fee, sqrtPriceLimitX96: 0n }] })
      : encodeFunctionData({ abi: QUOTER_ABI, functionName: "quoteExactInput", args: [route.path, amountIn] });
  const raw = await call(UNISWAP.quoterV2, data);
  const out =
    route.kind === "single"
      ? decodeFunctionResult({ abi: QUOTER_ABI, functionName: "quoteExactInputSingle", data: raw })
      : decodeFunctionResult({ abi: QUOTER_ABI, functionName: "quoteExactInput", data: raw });
  return out[0];
}

/** Quotes every candidate route and returns the one that pays out most. */
export async function bestQuote(side: Side, amountIn: bigint): Promise<Quote | null> {
  const results = await Promise.allSettled(candidates(side).map(async (route) => ({ route, amountOut: await quoteRoute(route, amountIn) })));
  let best: Quote | null = null;
  for (const r of results) {
    if (r.status === "fulfilled" && r.value.amountOut > 0n && (!best || r.value.amountOut > best.amountOut)) best = r.value;
  }
  return best;
}

export type TxRequest = { to: Hex; data: Hex; value?: bigint };

/** SwapRouter02 call, wrapped in multicall so it expires after 20 minutes. */
export function swapTx(side: Side, quote: Quote, amountIn: bigint, minOut: bigint, recipient: Hex): TxRequest {
  const deadline = BigInt(Math.floor(Date.now() / 1000) + 20 * 60);
  const inner =
    quote.route.kind === "single"
      ? encodeFunctionData({
          abi: ROUTER_ABI,
          functionName: "exactInputSingle",
          args: [{ tokenIn: quote.route.tokenIn, tokenOut: quote.route.tokenOut, fee: quote.route.fee, recipient, amountIn, amountOutMinimum: minOut, sqrtPriceLimitX96: 0n }],
        })
      : encodeFunctionData({ abi: ROUTER_ABI, functionName: "exactInput", args: [{ path: quote.route.path, recipient, amountIn, amountOutMinimum: minOut }] });
  return {
    to: UNISWAP.swapRouter02,
    data: encodeFunctionData({ abi: ROUTER_ABI, functionName: "multicall", args: [deadline, [inner]] }),
    // Paying in ETH: the router wraps exactly this value into WETH.
    value: side === "buy-eth" ? amountIn : 0n,
  };
}

/** Approval for exactly the amount being swapped, never an unlimited one. */
export function approveTx(token: Hex, amount: bigint): TxRequest {
  return { to: token, data: encodeFunctionData({ abi: ERC20_ABI, functionName: "approve", args: [UNISWAP.swapRouter02, amount] }) };
}

export async function allowance(token: Hex, owner: Hex): Promise<bigint> {
  const raw = await call(token, encodeFunctionData({ abi: ERC20_ABI, functionName: "allowance", args: [owner, UNISWAP.swapRouter02] }));
  return decodeFunctionResult({ abi: ERC20_ABI, functionName: "allowance", data: raw });
}

export async function balances(owner: Hex) {
  const read = async (token: Hex) =>
    decodeFunctionResult({ abi: ERC20_ABI, functionName: "balanceOf", data: await call(token, encodeFunctionData({ abi: ERC20_ABI, functionName: "balanceOf", args: [owner] })) });
  const [eth, usdg, sgov] = await Promise.all([
    rpc<Hex>("eth_getBalance", [owner, "latest"]).then((h) => BigInt(h)),
    read(TOKENS.USDG.address as Hex),
    read(TOKENS.SGOV.address as Hex),
  ]);
  return { ETH: eth, USDG: usdg, SGOV: sgov };
}

export type Oracle = { sgovUsd: number; ethUsd: number; sgovUpdatedAt: number };

export async function oracle(): Promise<Oracle> {
  const read = async (feed: { address: string; decimals: number }) => {
    const [, answer, , updatedAt] = decodeFunctionResult({
      abi: FEED_ABI,
      functionName: "latestRoundData",
      data: await call(feed.address, encodeFunctionData({ abi: FEED_ABI, functionName: "latestRoundData" })),
    });
    return { price: Number(answer) / 10 ** feed.decimals, updatedAt: Number(updatedAt) };
  };
  const [sgov, eth] = await Promise.all([read(FEEDS.sgovUsd), read(FEEDS.ethUsd)]);
  return { sgovUsd: sgov.price, ethUsd: eth.price, sgovUpdatedAt: sgov.updatedAt };
}

/**
 * How much worse the quote is than the oracle, as a fraction. Positive means
 * the trader gets less than the oracle price implies.
 */
export function oracleGap(side: Side, amountIn: bigint, amountOut: bigint, o: Oracle): number {
  const sgovOut = Number(amountOut) / 1e18;
  if (side === "sell") {
    const usdOut = Number(amountOut) / 1e6;
    const sgovIn = Number(amountIn) / 1e18;
    return 1 - usdOut / (sgovIn * o.sgovUsd);
  }
  const usdIn = side === "buy-usdg" ? Number(amountIn) / 1e6 : (Number(amountIn) / 1e18) * o.ethUsd;
  return 1 - (sgovOut * o.sgovUsd) / usdIn;
}

/** Polls for the receipt; resolves true on success, false on revert. */
export async function waitForReceipt(hash: Hex, timeoutMs = 120_000): Promise<boolean> {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    const receipt = await rpc<{ status: Hex } | null>("eth_getTransactionReceipt", [hash]).catch(() => null);
    if (receipt) return receipt.status === "0x1";
    await new Promise((resolve) => setTimeout(resolve, 1500));
  }
  throw new Error("The transaction is taking longer than expected. Check it in the explorer.");
}
