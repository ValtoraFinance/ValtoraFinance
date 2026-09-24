"use client";

import { useEffect, useState } from "react";
import { Sparkline } from "@/components/art/charts";
import type { Quote } from "@/lib/quotes";

const FALLBACK: Quote[] = ["AAPL", "MSFT", "NVDA", "AMZN", "TSLA", "GOOGL", "META", "SPY"].map((s) => ({
  symbol: s,
  company: s,
  last: null,
  change: null,
  pct: null,
  asOf: null,
  points: [],
}));

function useQuotes() {
  const [quotes, setQuotes] = useState<Quote[] | null>(null);
  useEffect(() => {
    let cancelled = false;
    fetch("/api/quotes")
      .then((r) => r.json())
      .then((d: { quotes: Quote[] }) => {
        if (!cancelled) setQuotes(d.quotes);
      })
      .catch(() => {
        if (!cancelled) setQuotes(FALLBACK);
      });
    return () => {
      cancelled = true;
    };
  }, []);
  return quotes;
}

const usd = (n: number) => `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

/** Cards showing the reference share each planned token would follow. */
export function StockGrid() {
  const quotes = useQuotes();
  const list = quotes ?? FALLBACK;
  const asOf = list.find((q) => q.asOf)?.asOf;
  return (
    <div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {list.map((q) => {
          const up = (q.change ?? 0) >= 0;
          return (
            <div key={q.symbol} className="min-w-0 rounded-[16px] border border-line bg-white p-4">
              <div className="flex items-center gap-2.5">
                <img src={`/stocks/${q.symbol.toLowerCase()}.webp`} alt="" className="size-8 rounded-full bg-mist object-contain p-1" />
                <div className="min-w-0">
                  <p className="text-[14px] leading-tight font-medium">
                    v{q.symbol}
                    <span className="ml-1.5 text-[11px] font-normal text-mute">planned</span>
                  </p>
                  <p className="truncate text-[11.5px] text-mute">Follows {q.company}</p>
                </div>
              </div>
              <div className={`mt-4 rounded-[10px] px-3 pt-3 ${quotes === null ? "animate-pulse bg-mist" : up ? "bg-up/[0.06]" : "bg-down/[0.07]"}`}>
                <p className="text-[11px] text-mute">Reference share price</p>
                <p className="font-serif text-[26px] leading-tight">{q.last !== null ? usd(q.last) : "—"}</p>
                <p className={`font-mono text-[11px] ${q.change === null ? "text-mute" : up ? "text-up" : "text-down"}`}>
                  {q.change === null ? "unavailable" : `${up ? "▲" : "▼"} ${usd(Math.abs(q.change))} (${q.pct?.replace("-", "")}) 1D`}
                </p>
                <Sparkline points={q.points} up={up} />
              </div>
            </div>
          );
        })}
      </div>
      <p className="mt-4 text-[12px] text-mute">
        Prices are for the listed reference shares from Nasdaq{asOf ? `, as of ${asOf}` : ""}, delayed. They are not
        prices of any Valtora token, and no token is trading yet.
      </p>
    </div>
  );
}

/** Horizontal ticker of the same reference prices. */
export function StockTicker() {
  const quotes = useQuotes() ?? FALLBACK;
  const row = [...quotes, ...quotes];
  return (
    <div className="overflow-hidden border-y border-line bg-white py-3">
      <div className="marquee-track flex gap-8 pr-8">
        {row.map((q, i) => (
          <span key={i} className="flex shrink-0 items-center gap-2 text-[12px] whitespace-nowrap">
            <img src={`/stocks/${q.symbol.toLowerCase()}.webp`} alt="" className="size-5 rounded-full bg-mist object-contain p-0.5" />
            <span className="font-medium">{q.symbol}</span>
            <span className="font-mono text-mute">{q.last !== null ? usd(q.last) : "—"}</span>
            {q.change !== null ? (
              <span className={`font-mono ${q.change >= 0 ? "text-up" : "text-down"}`}>{q.pct}</span>
            ) : null}
          </span>
        ))}
      </div>
    </div>
  );
}
