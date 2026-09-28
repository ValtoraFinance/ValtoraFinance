/* Simulates Treasury Route swaps exactly as the widget builds them, with
 * eth_call and state overrides on a throwaway address. Nothing is sent.
 *
 *   npx tsx scripts/simulate-swap.mts
 */
import { createPublicClient, decodeFunctionResult, encodeAbiParameters, encodeFunctionData, formatUnits, http, keccak256, parseAbi, parseUnits, toHex, type Hex } from "viem";
import { TOKENS, UNISWAP } from "@/config/swap";
import { approveTx, bestQuote, swapTx, type Side } from "@/lib/swap";

const client = createPublicClient({ transport: http("https://robinhood-rpc.publicnode.com") });
const ME: Hex = "0x000000000000000000000000000000000000bEEF";
const erc20 = parseAbi(["function balanceOf(address) view returns (uint256)", "function allowance(address,address) view returns (uint256)"]);
const router = parseAbi(["function multicall(uint256,bytes[]) payable returns (bytes[])"]);

const OZ5 = BigInt("0x52c63247e1f47db19d5ce0460030c497f067ca4cebf71ba98eeadabe20bace00");
const mapSlot = (key: Hex, slot: bigint) => keccak256(encodeAbiParameters([{ type: "address" }, { type: "uint256" }], [key, slot]));
const nestedSlot = (a: Hex, b: Hex, slot: bigint) => keccak256(encodeAbiParameters([{ type: "address" }, { type: "bytes32" }], [b, mapSlot(a, slot)]));

/** Finds the balances mapping slot by writing a marker and reading balanceOf. */
async function findBalanceSlot(token: Hex) {
  const marker = 123456789n;
  for (const slot of [...Array.from({ length: 60 }, (_, i) => BigInt(i)), OZ5]) {
    const data = encodeFunctionData({ abi: erc20, functionName: "balanceOf", args: [ME] });
    const res = await client.call({ to: token, data, stateOverride: [{ address: token, stateDiff: [{ slot: mapSlot(ME, slot), value: toHex(marker, { size: 32 }) }] }] }).catch(() => null);
    if (res?.data && BigInt(res.data) === marker) return slot;
  }
  return null;
}
/** Same idea for the allowances mapping (owner => spender => amount). */
async function findAllowanceSlot(token: Hex) {
  const marker = 987654321n;
  for (const slot of [...Array.from({ length: 60 }, (_, i) => BigInt(i)), OZ5 + 1n]) {
    const data = encodeFunctionData({ abi: erc20, functionName: "allowance", args: [ME, UNISWAP.swapRouter02] });
    const res = await client.call({ to: token, data, stateOverride: [{ address: token, stateDiff: [{ slot: nestedSlot(ME, UNISWAP.swapRouter02, slot), value: toHex(marker, { size: 32 }) }] }] }).catch(() => null);
    if (res?.data && BigInt(res.data) === marker) return slot;
  }
  return null;
}

async function simulate(side: Side, amountText: string) {
  const from = side === "buy-eth" ? "ETH" : side === "buy-usdg" ? "USDG" : "SGOV";
  const decimals = from === "USDG" ? 6 : 18;
  const amountIn = parseUnits(amountText, decimals);
  const quote = await bestQuote(side, amountIn);
  if (!quote) throw new Error(`${side}: no quote`);
  const minOut = (quote.amountOut * 995n) / 1000n;
  const tx = swapTx(side, quote, amountIn, minOut, ME);
  const overrides: { address: Hex; balance?: bigint; stateDiff?: { slot: Hex; value: Hex }[] }[] = [{ address: ME, balance: parseUnits("10", 18) }];
  if (from !== "ETH") {
    const token = TOKENS[from].address as Hex;
    const slot = await findBalanceSlot(token);
    const allowanceSlot = await findAllowanceSlot(token);
    if (slot === null || allowanceSlot === null) throw new Error(`${from}: storage slots not found`);
    const approval = approveTx(token, amountIn);
    overrides.push({
      address: token,
      stateDiff: [
        { slot: mapSlot(ME, slot), value: toHex(amountIn, { size: 32 }) },
        { slot: nestedSlot(ME, UNISWAP.swapRouter02, allowanceSlot), value: toHex(amountIn, { size: 32 }) },
      ],
    });
    const allowance = await client.call({ to: token, data: encodeFunctionData({ abi: erc20, functionName: "allowance", args: [ME, UNISWAP.swapRouter02] }), stateOverride: overrides.slice(1) });
    console.log(`  ${from} slot ${slot === OZ5 ? "OZ v5 namespace" : slot}; allowance override reads ${BigInt(allowance.data ?? "0x0") === amountIn ? "ok" : "WRONG"}; approve calldata to ${approval.to}`);
  }
  const res = await client.call({ account: ME, to: tx.to, data: tx.data, value: tx.value, stateOverride: overrides });
  const [inner] = decodeFunctionResult({ abi: router, functionName: "multicall", data: res.data! });
  const out = BigInt(inner);
  const to = side === "sell" ? "USDG" : "SGOV";
  const outDecimals = to === "USDG" ? 6 : 18;
  console.log(`${side}: ${amountText} ${from} -> quote ${formatUnits(quote.amountOut, outDecimals)} ${to}, simulated ${formatUnits(out, outDecimals)} ${to} via ${quote.route.label} ${out === quote.amountOut ? "(exact match)" : ""}`);
}

for (const [side, amount] of [["buy-eth", "0.1"], ["buy-usdg", "1000"], ["sell", "10"]] as const) {
  try {
    await simulate(side, amount);
  } catch (e) {
    console.log(`${side}: FAILED ${(e as Error).message.slice(0, 300)}`);
  }
}
