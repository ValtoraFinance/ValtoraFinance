/* Resolves every Robinhood stock token that has a Chainlink price feed on
 * Robinhood Chain, and writes the result to src/config/assets.generated.ts.
 *
 *   node scripts/resolve-assets.mjs
 *
 * The feed list comes from Chainlink's public feed directory. For each ticker,
 * Dexscreener supplies candidate contracts and the chain decides which one is
 * real. A candidate is accepted only if all three hold:
 *   1. its runtime bytecode embeds Robinhood's token beacon,
 *   2. symbol() is exactly the ticker,
 *   3. name() ends in "Robinhood Token".
 * Everything else that borrows the ticker is counted as a lookalike.
 *
 * Only public endpoints are used, so the script needs no configuration.
 */
import { writeFile } from "node:fs/promises";

const RPCS = ["https://robinhood-rpc.publicnode.com", "https://rpc.mainnet.chain.robinhood.com"];
const FEEDS_URL = "https://reference-data-directory.vercel.app/feeds-robinhood-mainnet.json";
const BEACON = "e10b6f6b275de231345c20d14ab812db62151b00";
// Extra candidates for tickers the search endpoint sometimes misses. They go
// through exactly the same on-chain checks as every other candidate.
const EXTRA_CANDIDATES = {
  SPY: ["0x117cc2133c37B721F49dE2A7a74833232B3B4C0C"],
};
const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Safari/537.36";

let rpcId = 0;
async function rpc(method, params) {
  let last;
  for (const url of RPCS) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ jsonrpc: "2.0", id: ++rpcId, method, params }),
        signal: AbortSignal.timeout(20000),
      });
      if (!res.ok) throw new Error(`rpc HTTP ${res.status}`);
      const body = await res.json();
      if (body.error) throw new Error(`${method}: ${body.error.message}`);
      return body.result;
    } catch (error) {
      last = error;
    }
  }
  throw last;
}

const call = (to, data) => rpc("eth_call", [{ to, data }, "latest"]).catch(() => null);

function decodeString(hex) {
  if (!hex || hex === "0x") return null;
  const buf = Buffer.from(hex.slice(2), "hex");
  if (buf.length === 32) return buf.toString("utf8").replace(/\0+$/, "") || null;
  const len = Number(BigInt("0x" + buf.subarray(32, 64).toString("hex")));
  return buf.subarray(64, 64 + len).toString("utf8");
}

/** "Robinhood AAPL / USD", "Robinhood DELL-USD", "GLD / USD" -> ticker. */
function tickerOf(feedName) {
  const m = feedName.replace(/^Robinhood\s+/, "").match(/^([A-Z.]+)\s*(?:\/|-)\s*USD$/);
  return m ? m[1] : null;
}

async function candidates(ticker) {
  const res = await fetch(`https://api.dexscreener.com/latest/dex/search?q=${ticker}`, {
    headers: { "user-agent": UA },
    signal: AbortSignal.timeout(20000),
  });
  if (!res.ok) throw new Error(`dexscreener HTTP ${res.status}`);
  const seen = new Set();
  for (const pair of (await res.json()).pairs || []) {
    if (pair.chainId !== "robinhood") continue;
    for (const token of [pair.baseToken, pair.quoteToken]) {
      if (token.symbol?.toUpperCase() === ticker) seen.add(token.address);
    }
  }
  for (const address of EXTRA_CANDIDATES[ticker] || []) seen.add(address);
  return [...seen];
}

async function resolve(ticker) {
  const pool = await candidates(ticker);
  const hits = [];
  for (const address of pool) {
    const code = await rpc("eth_getCode", [address, "latest"]);
    if (!code.toLowerCase().includes(BEACON)) continue;
    const [symbol, name] = await Promise.all([call(address, "0x95d89b41"), call(address, "0x06fdde03")].map((p) => p.then(decodeString)));
    if (symbol !== ticker || !/Robinhood Token\s*$/.test(name || "")) continue;
    hits.push({ address, name });
  }
  return { hits, candidates: pool.length };
}

const feeds = await (await fetch(FEEDS_URL, { signal: AbortSignal.timeout(20000) })).json();
const wanted = new Map();
for (const feed of feeds) {
  const cls = feed.docs?.assetClass;
  const ticker = tickerOf(feed.name || "");
  if (!ticker || !feed.proxyAddress) continue;
  if (cls !== "Equity" && !feed.name.startsWith("Robinhood ") && ticker !== "GLD") continue;
  wanted.set(ticker, { feed: feed.proxyAddress, decimals: feed.decimals ?? 8, hours: feed.docs?.marketHours ?? null });
}

const resolved = [];
const skipped = [];
for (const [ticker, info] of [...wanted].sort()) {
  try {
    // One retry: the search endpoint drops the odd request.
    const { hits, candidates: total } = await resolve(ticker).catch(() => resolve(ticker));
    if (hits.length !== 1) {
      skipped.push(`${ticker} (${hits.length} matches of ${total})`);
      continue;
    }
    const lookalikes = total - 1;
    resolved.push({ symbol: ticker, address: hits[0].address, name: hits[0].name.replace(/\s*•\s*Robinhood Token\s*$/, ""), feed: info.feed, feedDecimals: info.decimals, lookalikes });
    console.log(`${ticker.padEnd(6)} ${hits[0].address}  lookalikes ${lookalikes}`);
  } catch (error) {
    skipped.push(`${ticker} (${error.message})`);
  }
}
if (skipped.length) console.log("skipped:", skipped.join(", "));

const body = `// Generated by scripts/resolve-assets.mjs — do not edit by hand.
//
// Every token below has a Chainlink price feed on Robinhood Chain, and its
// contract was verified on-chain: a proxy to Robinhood's token beacon whose
// symbol() matches and whose name() ends in "Robinhood Token". "lookalikes"
// counts other tokens trading under the same ticker at resolve time.
//
// Resolved ${new Date().toISOString().slice(0, 10)}.

export type ResolvedAsset = {
  symbol: string;
  name: string;
  address: \`0x\${string}\`;
  feed: \`0x\${string}\`;
  feedDecimals: number;
  lookalikes: number;
};

export const RESOLVED_AT = "${new Date().toISOString().slice(0, 10)}";

export const ASSETS: ResolvedAsset[] = [
${resolved.map((r) => `  { symbol: "${r.symbol}", name: ${JSON.stringify(r.name)}, address: "${r.address}", feed: "${r.feed}", feedDecimals: ${r.feedDecimals}, lookalikes: ${r.lookalikes} },`).join("\n")}
];
`;

await writeFile(new URL("../src/config/assets.generated.ts", import.meta.url), body);
console.log(`\nwrote src/config/assets.generated.ts — ${resolved.length} assets`);
