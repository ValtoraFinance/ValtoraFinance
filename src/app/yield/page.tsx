import type { Metadata } from "next";
import { Suspense } from "react";
import { CHAIN } from "@/config/brand";
import { getTreasury, getUsdgMarkets } from "@/lib/onchain";
import { pct, usdCompact } from "@/lib/format";
import { FaqBlock, MilestoneBox, ProductHead, Risks, Steps } from "@/components/product/ProductShell";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Yield Vault",
  description: `A USDG vault on Morpho, curated in public by the Valtora treasury, on ${CHAIN.name}. Milestone M2.`,
};

async function Markets() {
  const markets = await getUsdgMarkets(8);
  if (!markets.length) {
    return <p className="mt-10 rounded-[18px] bg-white/[0.06] p-6 text-[14px] text-white/70">Morpho did not answer just now. Refresh in a moment.</p>;
  }
  return (
    <div className="mt-10 overflow-x-auto rounded-[18px] bg-white/[0.06]">
      <table className="w-full min-w-[620px] text-left text-[14px]">
        <thead className="text-[12px] text-white/55">
          <tr>
            <th className="px-5 py-4 font-medium">Market (collateral / loan)</th>
            <th className="px-5 py-4 text-right font-medium">Supplied</th>
            <th className="px-5 py-4 text-right font-medium">Borrowed</th>
            <th className="px-5 py-4 text-right font-medium">Supply APY</th>
            <th className="px-5 py-4 text-right font-medium">LLTV</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/10">
          {markets.map((m) => (
            <tr key={m.marketId}>
              <td className="px-5 py-3 font-medium">
                {m.collateral} / {m.loan}
              </td>
              <td className="px-5 py-3 text-right font-mono tabular-nums">{usdCompact(m.supplyUsd)}</td>
              <td className="px-5 py-3 text-right font-mono tabular-nums">{usdCompact(m.borrowUsd)}</td>
              <td className="px-5 py-3 text-right font-mono tabular-nums">{pct(m.supplyApy)}</td>
              <td className="px-5 py-3 text-right font-mono tabular-nums">{pct(m.lltv, 1)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="px-5 pb-4 text-[12px] text-white/50">
        Largest USDG lending markets on Morpho, {CHAIN.name}, read from Morpho&apos;s public API. These are markets the vault could
        allocate to, not a promise that it will.
      </p>
    </div>
  );
}

async function Milestone() {
  const t = await getTreasury();
  return <MilestoneBox id="M2" cumulative={t.cumulativeEth} ethUsd={t.ethUsd} />;
}

export default function YieldPage() {
  return (
    <>
      <ProductHead
        id="M2"
        status="Funding"
        name="Yield Vault"
        title="Idle Dollars, Lent in Public."
        sub="On Morpho, Curated by the Treasury."
        lead="USDG already earns interest on Morpho, but choosing markets and watching their risk is work. The Yield Vault does that work in the open: a standard Morpho vault whose allocations, caps and changes anyone can read."
      >
        <Suspense fallback={<div className="mt-10 h-[420px] animate-pulse rounded-[18px] bg-white/[0.06]" />}>
          <Markets />
        </Suspense>
      </ProductHead>
      <Steps
        title="How the vault will work"
        steps={[
          { h: "Deposit USDG", p: "You receive vault shares. They are a standard vault token that other apps can read, and you can redeem them for USDG whenever the markets have liquidity." },
          { h: "Allocated by a public policy", p: "The treasury, acting as curator, spreads deposits across Morpho markets with published caps per market. Every change passes a timelock before it takes effect." },
          { h: "Interest accrues to shares", p: "Borrowers pay interest to the markets, and the value of each share rises. A performance fee, published before launch, goes to the treasury." },
        ]}
      />
      <Suspense fallback={<div className="h-[420px] animate-pulse bg-mist" />}>
        <Milestone />
      </Suspense>
      <Risks
        items={[
          "Lending carries the risk that collateral loses value faster than it can be liquidated, leaving bad debt in a market.",
          "Morpho is audited and widely used, but no protocol is free of contract risk.",
          "Supply rates change every block with borrowing demand. Past rates say little about future ones.",
          "The curator decides where deposits go. Caps and the timelock limit that power; they do not remove it.",
        ]}
      />
      <FaqBlock
        items={[
          { q: "Is the vault live?", a: "No. It is milestone M2 and opens once the treasury has received its funding target. The markets above are live today on Morpho." },
          { q: "Why not build a new lending protocol?", a: "Morpho is already deployed and audited on Robinhood Chain. Rebuilding it would add risk without adding anything for depositors." },
          { q: "Who is the curator?", a: "The Valtora treasury address, listed on the transparency page. The team is anonymous, so the controls are what you should check: caps, timelock and published allocations." },
          { q: "Why seed it from the treasury?", a: "So the vault opens with liquidity and the first depositors are not alone in it." },
        ]}
      />
    </>
  );
}
