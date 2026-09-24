/* Reference prices of listed shares, from Nasdaq's public quote endpoint.
   These are prices of the underlying shares, never of any Valtora token. */

export type Quote = {
  symbol: string;
  company: string;
  last: number | null;
  change: number | null;
  pct: string | null;
  asOf: string | null;
  points: number[];
};

export const TICKERS: { symbol: string; name: string; cls: "stocks" | "etf" }[] = [
  { symbol: "AAPL", name: "Apple", cls: "stocks" },
  { symbol: "MSFT", name: "Microsoft", cls: "stocks" },
  { symbol: "NVDA", name: "NVIDIA", cls: "stocks" },
  { symbol: "AMZN", name: "Amazon", cls: "stocks" },
  { symbol: "TSLA", name: "Tesla", cls: "stocks" },
  { symbol: "GOOGL", name: "Alphabet", cls: "stocks" },
  { symbol: "META", name: "Meta Platforms", cls: "stocks" },
  { symbol: "SPY", name: "S&P 500 ETF", cls: "etf" },
];

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Safari/537.36";

const num = (v: unknown) => {
  const n = Number(String(v ?? "").replace(/[$,]/g, ""));
  return Number.isFinite(n) ? n : null;
};

async function fetchOne(t: (typeof TICKERS)[number]): Promise<Quote> {
  const empty: Quote = { symbol: t.symbol, company: t.name, last: null, change: null, pct: null, asOf: null, points: [] };
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await fetch(`https://api.nasdaq.com/api/quote/${t.symbol}/chart?assetclass=${t.cls}`, {
        headers: { "user-agent": UA, accept: "application/json" },
        cache: "no-store",
        signal: AbortSignal.timeout(8000),
      });
      if (!res.ok) continue;
      const body = (await res.json()) as {
        data?: { lastSalePrice?: string; netChange?: string; percentageChange?: string; timeAsOf?: string; chart?: { y: number }[] };
      };
      const d = body.data;
      if (!d) continue;
      const raw = (d.chart ?? []).map((p) => p.y).filter((y) => Number.isFinite(y));
      const step = Math.max(1, Math.floor(raw.length / 60));
      const points = raw.filter((_, i) => i % step === 0);
      return {
        symbol: t.symbol,
        company: t.name,
        last: num(d.lastSalePrice),
        change: num(d.netChange),
        pct: d.percentageChange ?? null,
        asOf: d.timeAsOf ?? null,
        points,
      };
    } catch {
      // Network flake; retry once, then give up for this ticker.
    }
  }
  return empty;
}

let cache: { at: number; ok: boolean; data: Quote[] } | null = null;

/** Hits are kept five minutes; a failed round only 45 seconds. */
export async function getQuotes(): Promise<Quote[]> {
  const ttl = cache?.ok ? 5 * 60_000 : 45_000;
  if (cache && Date.now() - cache.at < ttl) return cache.data;
  const data = await Promise.all(TICKERS.map(fetchOne));
  const ok = data.some((q) => q.last !== null);
  cache = { at: Date.now(), ok, data };
  return data;
}
