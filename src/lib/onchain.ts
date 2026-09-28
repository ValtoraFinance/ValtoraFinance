import { CHAIN, serverRpc } from "@/config/brand";
import { ASSETS, type ResolvedAsset } from "@/config/assets.generated";
import { ETH_USD_FEED, SPENDING, TREASURY_TOKENS, WALLETS } from "@/config/treasury";

const USDG_ADDRESS = TREASURY_TOKENS.find((t) => t.symbol === "USDG")!.address;

/* Server-side reads for the terminal, transparency and roadmap pages. Import
   from server components and route handlers only. Chain data comes from the
   configured RPC (public fallback), market data from Dexscreener and Morpho's
   public API. Nothing here needs a key. */

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Safari/537.36";

/** Robinhood's stock token beacon. Every official stock token proxies to it. */
export const STOCK_BEACON = "0xe10b6f6b275de231345c20d14ab812db62151b00";

const SEL = {
  latestRoundData: "0xfeaf968c",
  uiMultiplier: "0xa60bf13d",
  totalSupply: "0x18160ddd",
  balanceOf: "0x70a08231",
  name: "0x06fdde03",
  symbol: "0x95d89b41",
  decimals: "0x313ce567",
  paused: "0x5c975abb",
};

type RpcCall = { method: string; params: unknown[] };

function endpoints() {
  return [serverRpc(), CHAIN.fallbackRpc].filter((url, i, all) => all.indexOf(url) === i);
}

/** Sends a JSON-RPC batch, trying the configured endpoint then the fallback. */
async function batch(calls: RpcCall[]): Promise<(string | null)[]> {
  if (calls.length === 0) return [];
  let lastError: unknown;
  for (const url of endpoints()) {
    try {
      const out: (string | null)[] = new Array(calls.length).fill(null);
      // Chunked: some providers cap batch size.
      for (let start = 0; start < calls.length; start += 50) {
        const chunk = calls.slice(start, start + 50);
        const res = await fetch(url, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(chunk.map((c, i) => ({ jsonrpc: "2.0", id: start + i, method: c.method, params: c.params }))),
          cache: "no-store",
          signal: AbortSignal.timeout(12000),
        });
        if (!res.ok) throw new Error(`rpc ${res.status}`);
        const body = (await res.json()) as { id: number; result?: string }[];
        if (!Array.isArray(body)) throw new Error("rpc batch unsupported");
        for (const item of body) out[item.id] = item.result ?? null;
      }
      return out;
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError;
}

const ethCall = (to: string, data: string): RpcCall => ({ method: "eth_call", params: [{ to, data }, "latest"] });
const pad = (address: string) => address.toLowerCase().replace(/^0x/, "").padStart(64, "0");

function word(hex: string | null, index: number): bigint | null {
  if (!hex || hex.length < 2 + (index + 1) * 64) return null;
  return BigInt("0x" + hex.slice(2 + index * 64, 2 + (index + 1) * 64));
}

function signed(value: bigint) {
  return value >= 1n << 255n ? value - (1n << 256n) : value;
}

function decodeString(hex: string | null) {
  if (!hex || hex === "0x") return null;
  const data = hex.slice(2);
  if (data.length === 64) {
    return Buffer.from(data, "hex").toString("utf8").replace(/\0+$/, "") || null;
  }
  if (data.length < 128) return null;
  const len = Number.parseInt(data.slice(64, 128), 16);
  return Buffer.from(data.slice(128, 128 + len * 2), "hex").toString("utf8");
}

const toNumber = (value: bigint | null, decimals: number) =>
  value === null ? null : Number(value) / 10 ** decimals;

/* ------------------------------------------------------------------ */
/* Market data                                                         */
/* ------------------------------------------------------------------ */

type DexPair = {
  url: string;
  priceUsd?: string;
  baseToken: { address: string };
  liquidity?: { usd?: number };
  volume?: { h24?: number };
};

async function dexTopPairs(addresses: string[]) {
  const out = new Map<string, DexPair>();
  for (let i = 0; i < addresses.length; i += 30) {
    const slice = addresses.slice(i, i + 30);
    const res = await fetch(`https://api.dexscreener.com/tokens/v1/robinhood/${slice.join(",")}`, {
      headers: { "user-agent": UA },
      cache: "no-store",
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) throw new Error(`dexscreener ${res.status}`);
    for (const pair of (await res.json()) as DexPair[]) {
      const key = pair.baseToken.address.toLowerCase();
      const current = out.get(key);
      if (!current || (pair.liquidity?.usd ?? 0) > (current.liquidity?.usd ?? 0)) out.set(key, pair);
    }
  }
  return out;
}

export type LendingMarket = {
  marketId: string;
  loan: string;
  lltv: number;
  supplyUsd: number;
  borrowUsd: number;
  supplyApy: number;
  borrowApy: number;
};

async function morphoMarkets(collateral: string[]) {
  const query = `{ markets(first: 200, where: { chainId_in: [${CHAIN.id}], collateralAssetAddress_in: ${JSON.stringify(collateral)} }) {
    items { marketId lltv loanAsset { symbol } collateralAsset { address } state { supplyAssetsUsd borrowAssetsUsd supplyApy borrowApy } } } }`;
  const res = await fetch("https://api.morpho.org/graphql", {
    method: "POST",
    headers: { "content-type": "application/json", "user-agent": UA },
    body: JSON.stringify({ query }),
    cache: "no-store",
    signal: AbortSignal.timeout(10000),
  });
  if (!res.ok) throw new Error(`morpho ${res.status}`);
  const body = (await res.json()) as {
    data?: {
      markets?: {
        items: {
          marketId: string;
          lltv: string;
          loanAsset: { symbol: string };
          collateralAsset: { address: string } | null;
          state: { supplyAssetsUsd: number | null; borrowAssetsUsd: number | null; supplyApy: number | null; borrowApy: number | null } | null;
        }[];
      };
    };
  };
  const out = new Map<string, LendingMarket>();
  for (const m of body.data?.markets?.items ?? []) {
    if (!m.collateralAsset || !m.state) continue;
    const market: LendingMarket = {
      marketId: m.marketId,
      loan: m.loanAsset.symbol,
      lltv: Number(BigInt(m.lltv)) / 1e18,
      supplyUsd: m.state.supplyAssetsUsd ?? 0,
      borrowUsd: m.state.borrowAssetsUsd ?? 0,
      supplyApy: m.state.supplyApy ?? 0,
      borrowApy: m.state.borrowApy ?? 0,
    };
    // Keep the deepest market per collateral.
    const key = m.collateralAsset.address.toLowerCase();
    const current = out.get(key);
    if (!current || market.supplyUsd > current.supplyUsd) out.set(key, market);
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* Terminal                                                            */
/* ------------------------------------------------------------------ */

export type TerminalRow = ResolvedAsset & {
  oraclePrice: number | null;
  oracleUpdatedAt: number | null;
  /** Distribution multiplier; 1.0 means nothing has accrued yet. */
  multiplier: number | null;
  paused: boolean | null;
  dexPrice: number | null;
  /** DEX price relative to the oracle, as a fraction. */
  premium: number | null;
  liquidityUsd: number | null;
  volume24hUsd: number | null;
  pairUrl: string | null;
  lending: LendingMarket | null;
};

export type Terminal = {
  rows: TerminalRow[];
  readAt: number;
  sources: { chain: boolean; dex: boolean; lending: boolean };
  totals: { assets: number; lookalikes: number; liquidityUsd: number; volume24hUsd: number; lendingUsd: number };
};

async function readTerminal(): Promise<Terminal> {
  const calls: RpcCall[] = [];
  for (const a of ASSETS) {
    calls.push(ethCall(a.feed, SEL.latestRoundData), ethCall(a.address, SEL.uiMultiplier), ethCall(a.address, SEL.paused));
  }
  const addresses = ASSETS.map((a) => a.address);
  const [chain, dex, lending] = await Promise.allSettled([batch(calls), dexTopPairs(addresses), morphoMarkets(addresses)]);

  const rows = ASSETS.map((asset, i): TerminalRow => {
    const results = chain.status === "fulfilled" ? chain.value.slice(i * 3, i * 3 + 3) : [null, null, null];
    const answer = word(results[0], 1);
    const updatedAt = word(results[0], 3);
    const oraclePrice = answer === null ? null : Number(signed(answer)) / 10 ** asset.feedDecimals;
    const multiplier = toNumber(word(results[1], 0), 18);
    const pausedWord = word(results[2], 0);
    const pair = dex.status === "fulfilled" ? dex.value.get(asset.address.toLowerCase()) : undefined;
    const dexPrice = pair?.priceUsd ? Number(pair.priceUsd) : null;
    return {
      ...asset,
      oraclePrice,
      oracleUpdatedAt: updatedAt === null ? null : Number(updatedAt),
      multiplier,
      paused: pausedWord === null ? null : pausedWord !== 0n,
      dexPrice,
      premium: dexPrice !== null && oraclePrice ? dexPrice / oraclePrice - 1 : null,
      liquidityUsd: pair?.liquidity?.usd ?? null,
      volume24hUsd: pair?.volume?.h24 ?? null,
      pairUrl: pair?.url ?? null,
      lending: lending.status === "fulfilled" ? (lending.value.get(asset.address.toLowerCase()) ?? null) : null,
    };
  });

  const sum = (pick: (r: TerminalRow) => number | null | undefined) => rows.reduce((t, r) => t + (pick(r) ?? 0), 0);
  return {
    rows,
    readAt: Date.now(),
    sources: { chain: chain.status === "fulfilled", dex: dex.status === "fulfilled", lending: lending.status === "fulfilled" },
    totals: {
      assets: rows.length,
      lookalikes: sum((r) => r.lookalikes),
      liquidityUsd: sum((r) => r.liquidityUsd),
      volume24hUsd: sum((r) => r.volume24hUsd),
      lendingUsd: sum((r) => r.lending?.supplyUsd),
    },
  };
}

// Only complete reads are cached, so one failed source never sticks around.
let terminalCache: { at: number; data: Terminal } | null = null;
let terminalInflight: Promise<Terminal> | null = null;

export async function getTerminal(): Promise<Terminal> {
  if (terminalCache && Date.now() - terminalCache.at < 60_000) return terminalCache.data;
  terminalInflight ??= readTerminal().finally(() => {
    terminalInflight = null;
  });
  const data = await terminalInflight;
  if (data.sources.chain && data.sources.dex && data.sources.lending) terminalCache = { at: Date.now(), data };
  return data;
}

/* ------------------------------------------------------------------ */
/* Token verification                                                  */
/* ------------------------------------------------------------------ */

export type Verdict =
  | { kind: "invalid" }
  | { kind: "not-contract" }
  | { kind: "official"; symbol: string; name: string; listed: boolean }
  | { kind: "lookalike"; symbol: string | null; name: string | null; official: ResolvedAsset | null }
  | { kind: "other"; symbol: string | null; name: string | null }
  | { kind: "error" };

export async function verifyToken(input: string): Promise<Verdict> {
  const address = input.trim();
  if (!/^0x[0-9a-fA-F]{40}$/.test(address)) return { kind: "invalid" };
  let code: string | null;
  let symbol: string | null;
  let name: string | null;
  try {
    const [c, s, n] = await batch([
      { method: "eth_getCode", params: [address, "latest"] },
      ethCall(address, SEL.symbol),
      ethCall(address, SEL.name),
    ]);
    code = c;
    symbol = decodeString(s);
    name = decodeString(n);
  } catch {
    return { kind: "error" };
  }
  if (!code || code === "0x") return { kind: "not-contract" };
  const beacon = code.toLowerCase().includes(STOCK_BEACON.slice(2));
  const official = ASSETS.find((a) => a.symbol === symbol?.toUpperCase()) ?? null;
  if (beacon && symbol && /Robinhood Token\s*$/.test(name ?? "")) {
    return { kind: "official", symbol, name: (name ?? "").replace(/\s*•\s*Robinhood Token\s*$/, ""), listed: Boolean(official) };
  }
  if (official || /Robinhood/i.test(name ?? "")) return { kind: "lookalike", symbol, name, official };
  return { kind: "other", symbol, name };
}

/* ------------------------------------------------------------------ */
/* Treasury                                                            */
/* ------------------------------------------------------------------ */

export type WalletBalance = { eth: number | null; tokens: Record<string, number | null> };

export type TreasuryState = {
  ethUsd: number | null;
  treasury: WalletBalance;
  dev: WalletBalance;
  /** Treasury holdings expressed in ETH. */
  treasuryValueEth: number | null;
  spentEth: number;
  /** Holdings plus everything already spent: what the roadmap is measured against. */
  cumulativeEth: number | null;
  readAt: number;
};

async function readTreasury(): Promise<TreasuryState> {
  const wallets = [WALLETS.treasury, WALLETS.dev];
  const calls: RpcCall[] = [ethCall(ETH_USD_FEED, SEL.latestRoundData)];
  for (const w of wallets) {
    calls.push({ method: "eth_getBalance", params: [w, "latest"] });
    for (const t of TREASURY_TOKENS) calls.push(ethCall(t.address, SEL.balanceOf + pad(w)));
  }
  const results = await batch(calls).catch(() => null);
  const ethUsdRaw = results ? word(results[0], 1) : null;
  const ethUsd = ethUsdRaw === null ? null : Number(signed(ethUsdRaw)) / 1e8;

  const per = 1 + TREASURY_TOKENS.length;
  const balances = wallets.map((_, w): WalletBalance => {
    const base = 1 + w * per;
    const eth = results?.[base] ? Number(BigInt(results[base] as string)) / 1e18 : results ? 0 : null;
    const tokens: Record<string, number | null> = {};
    TREASURY_TOKENS.forEach((t, k) => {
      tokens[t.symbol] = results ? (toNumber(word(results[base + 1 + k], 0), t.decimals) ?? 0) : null;
    });
    return { eth, tokens };
  });

  const treasury = balances[0];
  let treasuryValueEth: number | null = null;
  if (treasury.eth !== null && ethUsd) {
    treasuryValueEth = treasury.eth;
    for (const t of TREASURY_TOKENS) {
      const amount = treasury.tokens[t.symbol] ?? 0;
      treasuryValueEth += t.kind === "eth" ? amount : amount / ethUsd;
    }
  }
  const spentEth = SPENDING.reduce((t, s) => t + s.eth, 0);
  return {
    ethUsd,
    treasury,
    dev: balances[1],
    treasuryValueEth,
    spentEth,
    cumulativeEth: treasuryValueEth === null ? null : treasuryValueEth + spentEth,
    readAt: Date.now(),
  };
}

let treasuryCache: { at: number; data: TreasuryState } | null = null;

export async function getTreasury(): Promise<TreasuryState> {
  if (treasuryCache && Date.now() - treasuryCache.at < 30_000) return treasuryCache.data;
  const data = await readTreasury();
  if (data.cumulativeEth !== null) treasuryCache = { at: Date.now(), data };
  return data;
}

/* ------------------------------------------------------------------ */
/* USDG lending landscape (for the Yield Vault)                        */
/* ------------------------------------------------------------------ */

export type UsdgMarket = LendingMarket & { collateral: string };

let usdgCache: { at: number; data: UsdgMarket[] } | null = null;

/** The largest USDG-loan markets on Morpho, Robinhood Chain. Empty on failure. */
export async function getUsdgMarkets(limit = 8): Promise<UsdgMarket[]> {
  if (usdgCache && Date.now() - usdgCache.at < 5 * 60_000) return usdgCache.data.slice(0, limit);
  const query = `{ markets(first: 40, orderBy: SupplyAssetsUsd, orderDirection: Desc, where: { chainId_in: [${CHAIN.id}], loanAssetAddress_in: ["${USDG_ADDRESS}"] }) {
    items { marketId lltv loanAsset { symbol } collateralAsset { symbol } state { supplyAssetsUsd borrowAssetsUsd supplyApy borrowApy } } } }`;
  try {
    const res = await fetch("https://api.morpho.org/graphql", {
      method: "POST",
      headers: { "content-type": "application/json", "user-agent": UA },
      body: JSON.stringify({ query }),
      cache: "no-store",
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) return [];
    const body = (await res.json()) as {
      data?: { markets?: { items: { marketId: string; lltv: string; loanAsset: { symbol: string }; collateralAsset: { symbol: string } | null; state: { supplyAssetsUsd: number | null; borrowAssetsUsd: number | null; supplyApy: number | null; borrowApy: number | null } | null }[] } };
    };
    const data = (body.data?.markets?.items ?? [])
      .filter((m) => m.collateralAsset && m.state)
      .map((m) => ({
        marketId: m.marketId,
        collateral: m.collateralAsset!.symbol,
        loan: m.loanAsset.symbol,
        lltv: Number(BigInt(m.lltv)) / 1e18,
        supplyUsd: m.state!.supplyAssetsUsd ?? 0,
        borrowUsd: m.state!.borrowAssetsUsd ?? 0,
        supplyApy: m.state!.supplyApy ?? 0,
        borrowApy: m.state!.borrowApy ?? 0,
      }));
    if (data.length) usdgCache = { at: Date.now(), data };
    return data.slice(0, limit);
  } catch {
    return [];
  }
}
