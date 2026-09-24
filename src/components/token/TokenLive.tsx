"use client";

import { useEffect, useState } from "react";
import { BRAND, CHAIN, TOKEN } from "@/config/brand";
import { rpc } from "@/lib/rpc";

/* Reads the token contract straight from the chain once the real address is
   set in brand.ts. Until then it says so instead of showing numbers. */

const SELECTORS = { name: "0x06fdde03", symbol: "0x95d89b41", decimals: "0x313ce567", totalSupply: "0x18160ddd" };

function decodeString(hex: string) {
  const data = hex.replace(/^0x/, "");
  if (data.length < 128) return "";
  const len = Number.parseInt(data.slice(64, 128), 16);
  const bytes = data.slice(128, 128 + len * 2);
  let out = "";
  for (let i = 0; i < bytes.length; i += 2) out += String.fromCharCode(Number.parseInt(bytes.slice(i, i + 2), 16));
  return out;
}

function formatUnits(raw: bigint, decimals: number) {
  const base = 10n ** BigInt(decimals);
  const whole = raw / base;
  return whole.toLocaleString("en-US");
}

type Info = { name: string; symbol: string; supply: string } | null;

export function TokenLive() {
  const [block, setBlock] = useState<number | null>(null);
  const [info, setInfo] = useState<Info>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const tick = () =>
      rpc<string>("eth_blockNumber")
        .then((h) => !cancelled && setBlock(Number.parseInt(h, 16)))
        .catch(() => {});
    tick();
    const t = window.setInterval(tick, 6000);

    if (TOKEN.isLive) {
      const call = (data: string) => rpc<string>("eth_call", [{ to: BRAND.ca, data }, "latest"]);
      Promise.all([call(SELECTORS.name), call(SELECTORS.symbol), call(SELECTORS.decimals), call(SELECTORS.totalSupply)])
        .then(([n, s, d, ts]) => {
          if (cancelled) return;
          const decimals = Number.parseInt(d, 16);
          setInfo({ name: decodeString(n), symbol: decodeString(s), supply: formatUnits(BigInt(ts), decimals) });
        })
        .catch(() => !cancelled && setError("Could not read the contract from the public RPC right now."));
    }
    return () => {
      cancelled = true;
      window.clearInterval(t);
    };
  }, []);

  const rows: [string, string][] = [
    ["Network", `${CHAIN.name} · chain id ${CHAIN.id}`],
    ["Latest block", block ? block.toLocaleString("en-US") : "reading…"],
    ["Contract", TOKEN.isLive ? "Published" : "Placeholder until launch"],
    ["On-chain name", info?.name || (TOKEN.isLive ? "reading…" : "—")],
    ["On-chain symbol", info?.symbol || (TOKEN.isLive ? "reading…" : "—")],
    ["Total supply", info?.supply || (TOKEN.isLive ? "reading…" : "—")],
  ];

  return (
    <div className="rounded-[18px] bg-white/[0.05] p-5 md:p-6">
      <p className="flex items-center gap-2 text-[13px] text-white/60">
        <span className={`size-2 rounded-full ${block ? "animate-pulse bg-up" : "bg-white/30"}`} /> Read live from {CHAIN.name}
      </p>
      <dl className="mt-4 divide-y divide-white/10">
        {rows.map(([k, v]) => (
          <div key={k} className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] gap-4 py-3 text-[14px]">
            <dt className="text-white/60">{k}</dt>
            <dd className="font-mono text-[13px] break-all">{v}</dd>
          </div>
        ))}
      </dl>
      {error ? <p className="mt-3 text-[13px] text-[#ff9aa0]">{error}</p> : null}
    </div>
  );
}
