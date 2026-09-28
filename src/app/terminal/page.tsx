import type { Metadata } from "next";
import { Suspense } from "react";
import { ShieldAlert } from "lucide-react";
import { BRAND, CHAIN } from "@/config/brand";
import { RESOLVED_AT } from "@/config/assets.generated";
import { getTerminal } from "@/lib/onchain";
import { usdCompact } from "@/lib/format";
import { TerminalTable } from "@/components/terminal/TerminalTable";
import { VerifyToken } from "@/components/terminal/VerifyToken";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Terminal",
  description: `Every official stock token on ${CHAIN.name} with a Chainlink feed, verified on-chain: oracle and market prices, distributions, liquidity and lending markets.`,
};

async function Stats() {
  const t = await getTerminal();
  const items = [
    { k: "Verified assets", v: String(t.totals.assets) },
    { k: "Lookalike tokens seen", v: String(t.totals.lookalikes) },
    { k: "Liquidity, deepest pools", v: usdCompact(t.totals.liquidityUsd) },
    { k: "24h volume, deepest pools", v: usdCompact(t.totals.volume24hUsd) },
  ];
  return (
    <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-[16px] bg-white/10 md:grid-cols-4">
      {items.map((i) => (
        <div key={i.k} className="bg-night p-5">
          <dt className="text-[12px] text-white/55">{i.k}</dt>
          <dd className="mt-2 text-[28px] font-medium tracking-[-0.02em] tabular-nums">{i.v}</dd>
        </div>
      ))}
    </dl>
  );
}

function StatsSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-px overflow-hidden rounded-[16px] bg-white/10 md:grid-cols-4">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="h-[98px] animate-pulse bg-night" />
      ))}
    </div>
  );
}

async function Table() {
  const t = await getTerminal();
  const down = Object.entries(t.sources)
    .filter(([, ok]) => !ok)
    .map(([k]) => ({ chain: "chain reads", dex: "market prices", lending: "lending markets" })[k as "chain" | "dex" | "lending"]);
  return (
    <>
      {down.length ? (
        <p className="mb-4 rounded-[12px] bg-ember/10 px-4 py-3 text-[13px] text-ink/80">
          Some sources did not answer on this read ({down.join(", ")}). Those columns show “—” until the next refresh.
        </p>
      ) : null}
      <TerminalTable rows={t.rows} readAt={t.readAt} />
    </>
  );
}

function TableSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 8 }, (_, i) => (
        <div key={i} className="h-14 animate-pulse rounded-[12px] bg-mist" />
      ))}
    </div>
  );
}

export default function TerminalPage() {
  return (
    <>
      <section className="bg-night pt-36 pb-14 text-white md:pt-44">
        <div className="wrap">
          <p className="text-[15px] font-medium text-white/55">Valtora Terminal</p>
          <h1 className="mt-3 max-w-[900px] text-[42px] leading-[1.02] font-medium tracking-[-0.035em] md:text-[60px]">
            Every Official Stock Token.
            <br />
            <span className="text-white/50">Verified on-chain.</span>
          </h1>
          <p className="mt-6 max-w-[640px] font-serif text-[18px] leading-snug text-white/75">
            Tickers can be copied by anyone. Each asset below was checked against Robinhood&apos;s token contract, then priced two ways:
            by its Chainlink feed and by its deepest pool. The gap between them is the first thing to read.
          </p>
          <div className="mt-10">
            <Suspense fallback={<StatsSkeleton />}>
              <Stats />
            </Suspense>
          </div>
        </div>
      </section>

      <section className="bg-white py-14 md:py-20">
        <div className="wrap">
          <Suspense fallback={<TableSkeleton />}>
            <Table />
          </Suspense>
          <p className="mt-6 max-w-[860px] text-[12px] leading-relaxed text-mute">
            Sources: contract checks and Chainlink feeds read from {CHAIN.name}; market prices and pools from Dexscreener; lending
            markets from Morpho. “Distributions” is the token&apos;s on-chain multiplier above 1.0: dividends are credited by raising it,
            not by sending tokens. “Lookalikes” counts other tokens trading under the same ticker when the list was last resolved
            ({RESOLVED_AT}). Data refreshes every minute.
          </p>
        </div>
      </section>

      <section id="verify" className="scroll-mt-24 border-t border-line bg-white py-14 md:py-20">
        <div className="wrap grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
          <div>
            <p className="text-[15px] font-medium text-mute">Lookalike checker</p>
            <h2 className="mt-3 text-[32px] leading-[1.05] font-medium tracking-[-0.03em] md:text-[40px]">Check any token before you buy it.</h2>
            <p className="mt-4 max-w-[480px] font-serif text-[17px] leading-snug text-ink/75">
              Paste a contract address. The answer comes from the contract&apos;s own code on {CHAIN.name}, not from a list we keep.
            </p>
          </div>
          <VerifyToken />
        </div>
      </section>

      <section className="bg-white pb-20">
        <div className="wrap">
          <div className="flex items-start gap-3 rounded-[16px] border border-line p-5 text-[13px] leading-relaxed text-ink/70">
            <ShieldAlert className="mt-0.5 size-5 shrink-0 text-ember" />
            <p>
              Robinhood stock tokens are issued by Robinhood, not by {BRAND.name}. Their issuer can pause them, block addresses and burn
              balances, and they are available only in supported jurisdictions. This page reads public data and is not investment advice.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
