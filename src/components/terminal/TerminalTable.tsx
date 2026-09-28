"use client";

import { useMemo, useState } from "react";
import { ArrowDown, ArrowUpRight, BadgeCheck, Search } from "lucide-react";
import { explorerToken } from "@/config/brand";
import type { TerminalRow } from "@/lib/onchain";
import { ago, pct, usd, usdCompact } from "@/lib/format";

type SortKey = "liquidity" | "volume" | "premium" | "symbol" | "lending";

const SORTS: { key: SortKey; label: string }[] = [
  { key: "liquidity", label: "Liquidity" },
  { key: "volume", label: "24h volume" },
  { key: "premium", label: "Gap to oracle" },
  { key: "lending", label: "Lending" },
  { key: "symbol", label: "A–Z" },
];

function sortValue(row: TerminalRow, key: SortKey): number | string {
  switch (key) {
    case "liquidity":
      return row.liquidityUsd ?? -1;
    case "volume":
      return row.volume24hUsd ?? -1;
    case "premium":
      return row.premium === null ? -1 : Math.abs(row.premium);
    case "lending":
      return row.lending?.supplyUsd ?? -1;
    case "symbol":
      return row.symbol;
  }
}

function Premium({ value }: { value: number | null }) {
  if (value === null) return <span className="text-mute">—</span>;
  const wide = Math.abs(value) >= 0.01;
  const tone = !wide ? "text-ink" : value > 0 ? "text-up" : "text-down";
  return <span className={`font-mono tabular-nums ${tone}`}>{pct(value, 2, true)}</span>;
}

/** Accrued distributions: the multiplier above 1.0, shown as a percentage. */
function Accrued({ multiplier }: { multiplier: number | null }) {
  if (multiplier === null) return <span className="text-mute">—</span>;
  return <span className="font-mono tabular-nums">{multiplier <= 1 ? "0.00%" : pct(multiplier - 1, 2, true)}</span>;
}

function Tile({ symbol }: { symbol: string }) {
  return <img src={`/tiles/${symbol.toLowerCase()}.webp`} alt="" width={36} height={36} className="size-9 shrink-0 rounded-[10px]" />;
}

export function TerminalTable({ rows, readAt }: { rows: TerminalRow[]; readAt: number }) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("liquidity");

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = q
      ? rows.filter((r) => r.symbol.toLowerCase().includes(q) || r.name.toLowerCase().includes(q) || r.address.toLowerCase() === q)
      : rows;
    return [...filtered].sort((a, b) => {
      const va = sortValue(a, sort);
      const vb = sortValue(b, sort);
      if (typeof va === "string" && typeof vb === "string") return va.localeCompare(vb);
      return (vb as number) - (va as number);
    });
  }, [rows, query, sort]);

  return (
    <div>
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <label className="flex w-full items-center gap-2 rounded-[10px] bg-mist px-3 py-2.5 md:max-w-[340px]">
          <Search className="size-4 text-mute" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search ticker, name or address"
            className="w-full bg-transparent text-[14px] outline-none placeholder:text-soft"
          />
        </label>
        <div className="flex flex-wrap gap-1.5">
          {SORTS.map((s) => (
            <button
              key={s.key}
              type="button"
              onClick={() => setSort(s.key)}
              className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-[13px] font-medium transition-colors ${
                sort === s.key ? "bg-ink text-white" : "bg-mist text-ink/70 hover:bg-cloud"
              }`}
            >
              {sort === s.key && s.key !== "symbol" ? <ArrowDown className="size-3" /> : null}
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Desktop table */}
      <div className="mt-6 hidden overflow-x-auto rounded-[16px] border border-line lg:block">
        <table className="w-full min-w-[1080px] text-left text-[14px]">
          <thead className="bg-mist text-[12px] text-mute">
            <tr>
              <th className="px-4 py-3 font-medium">Asset</th>
              <th className="px-4 py-3 text-right font-medium">Oracle price</th>
              <th className="px-4 py-3 text-right font-medium">Market price</th>
              <th className="px-4 py-3 text-right font-medium">Gap</th>
              <th className="px-4 py-3 text-right font-medium">Distributions</th>
              <th className="px-4 py-3 text-right font-medium">Deepest pool</th>
              <th className="px-4 py-3 text-right font-medium">24h volume</th>
              <th className="px-4 py-3 text-right font-medium">Lending market</th>
              <th className="px-4 py-3 text-right font-medium">Lookalikes</th>
              <th className="px-4 py-3 font-medium" />
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {visible.map((r) => (
              <tr key={r.address} className="hover:bg-mist/60">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Tile symbol={r.symbol} />
                    <div className="min-w-0">
                      <p className="flex items-center gap-1 font-medium">
                        {r.symbol} <BadgeCheck className="size-3.5 text-violet" aria-label="Verified on-chain" />
                      </p>
                      <p className="max-w-[220px] truncate text-[12px] text-mute">{r.name}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-right">
                  <p className="font-mono tabular-nums">{usd(r.oraclePrice)}</p>
                  <p className="text-[11px] text-mute">{ago(r.oracleUpdatedAt, readAt)}</p>
                </td>
                <td className="px-4 py-3 text-right font-mono tabular-nums">{usd(r.dexPrice)}</td>
                <td className="px-4 py-3 text-right">
                  <Premium value={r.premium} />
                </td>
                <td className="px-4 py-3 text-right">
                  <Accrued multiplier={r.multiplier} />
                </td>
                <td className="px-4 py-3 text-right font-mono tabular-nums">{usdCompact(r.liquidityUsd)}</td>
                <td className="px-4 py-3 text-right font-mono tabular-nums">{usdCompact(r.volume24hUsd)}</td>
                <td className="px-4 py-3 text-right">
                  {r.lending ? (
                    <>
                      <p className="font-mono tabular-nums">{usdCompact(r.lending.supplyUsd)}</p>
                      <p className="text-[11px] text-mute">
                        {r.lending.loan} · LLTV {pct(r.lending.lltv, 1)}
                      </p>
                    </>
                  ) : (
                    <span className="text-mute">None</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right font-mono tabular-nums">{r.lookalikes || "0"}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1.5">
                    <a href={explorerToken(r.address)} target="_blank" rel="noreferrer" className="chip hover:bg-cloud" title={r.address}>
                      Contract <ArrowUpRight className="size-3" />
                    </a>
                    {r.pairUrl ? (
                      <a href={r.pairUrl} target="_blank" rel="noreferrer" className="chip hover:bg-cloud">
                        Pool <ArrowUpRight className="size-3" />
                      </a>
                    ) : null}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile and tablet cards */}
      <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2 lg:hidden">
        {visible.map((r) => (
          <div key={r.address} className="rounded-[16px] border border-line p-4">
            <div className="flex items-center gap-3">
              <Tile symbol={r.symbol} />
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-1 font-medium">
                  {r.symbol} <BadgeCheck className="size-3.5 text-violet" aria-label="Verified on-chain" />
                </p>
                <p className="truncate text-[12px] text-mute">{r.name}</p>
              </div>
              <div className="text-right">
                <p className="font-mono text-[14px] tabular-nums">{usd(r.oraclePrice)}</p>
                <Premium value={r.premium} />
              </div>
            </div>
            <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-[12px]">
              <dt className="text-mute">Market price</dt>
              <dd className="text-right font-mono tabular-nums">{usd(r.dexPrice)}</dd>
              <dt className="text-mute">Distributions</dt>
              <dd className="text-right">
                <Accrued multiplier={r.multiplier} />
              </dd>
              <dt className="text-mute">Deepest pool</dt>
              <dd className="text-right font-mono tabular-nums">{usdCompact(r.liquidityUsd)}</dd>
              <dt className="text-mute">Lending supplied</dt>
              <dd className="text-right font-mono tabular-nums">{r.lending ? usdCompact(r.lending.supplyUsd) : "None"}</dd>
              <dt className="text-mute">Lookalikes</dt>
              <dd className="text-right font-mono tabular-nums">{r.lookalikes}</dd>
            </dl>
            <div className="mt-4 flex gap-1.5">
              <a href={explorerToken(r.address)} target="_blank" rel="noreferrer" className="chip hover:bg-cloud">
                Contract <ArrowUpRight className="size-3" />
              </a>
              {r.pairUrl ? (
                <a href={r.pairUrl} target="_blank" rel="noreferrer" className="chip hover:bg-cloud">
                  Pool <ArrowUpRight className="size-3" />
                </a>
              ) : null}
            </div>
          </div>
        ))}
      </div>

      {visible.length === 0 ? <p className="mt-10 text-center text-[14px] text-mute">No verified asset matches “{query}”.</p> : null}
    </div>
  );
}
