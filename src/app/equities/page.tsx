import type { Metadata } from "next";
import { Suspense } from "react";
import { BadgeCheck } from "lucide-react";
import { CHAIN } from "@/config/brand";
import { INDEX_DRAFT } from "@/config/index-draft";
import { getTerminal, getTreasury } from "@/lib/onchain";
import { pct, usd, usdCompact } from "@/lib/format";
import { FaqBlock, MilestoneBox, ProductHead, Risks, Steps } from "@/components/product/ProductShell";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Valtora Index",
  description: `A basket token of verified stock tokens on ${CHAIN.name}, with in-kind mint and redeem and a Chainlink-priced NAV. Milestone M3.`,
};

async function Basket() {
  const t = await getTerminal();
  const rows = INDEX_DRAFT.symbols.map((s) => t.rows.find((r) => r.symbol === s)).filter((r) => r !== undefined);
  const weight = 1 / rows.length;
  const liquidity = rows.reduce((sum, r) => sum + (r.liquidityUsd ?? 0), 0);
  return (
    <div className="mt-10 rounded-[18px] bg-white/[0.06]">
      <div className="flex flex-col gap-1 px-5 pt-5 md:flex-row md:items-end md:justify-between">
        <p className="text-[17px] font-medium">
          Draft basket · {INDEX_DRAFT.name} <span className="font-mono text-[13px] text-white/55">({INDEX_DRAFT.ticker})</span>
        </p>
        <p className="text-[12px] text-white/55">
          Equal weight · rebalanced {INDEX_DRAFT.rebalance.toLowerCase()} · {usdCompact(liquidity)} of pool liquidity behind it
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="mt-3 w-full min-w-[640px] text-left text-[14px]">
          <thead className="text-[12px] text-white/55">
            <tr>
              <th className="px-5 py-3 font-medium">Asset</th>
              <th className="px-5 py-3 text-right font-medium">Target weight</th>
              <th className="px-5 py-3 text-right font-medium">Oracle price</th>
              <th className="px-5 py-3 text-right font-medium">Distributions</th>
              <th className="px-5 py-3 text-right font-medium">Deepest pool</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {rows.map((r) => (
              <tr key={r.address}>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <img src={`/tiles/${r.symbol.toLowerCase()}.webp`} alt="" width={32} height={32} className="size-8 rounded-[9px]" />
                    <div className="min-w-0">
                      <p className="flex items-center gap-1 font-medium">
                        {r.symbol} <BadgeCheck className="size-3.5 text-violet-soft" aria-label="Verified on-chain" />
                      </p>
                      <p className="truncate text-[12px] text-white/55">{r.name}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3 text-right font-mono tabular-nums">{pct(weight, 1)}</td>
                <td className="px-5 py-3 text-right font-mono tabular-nums">{usd(r.oraclePrice)}</td>
                <td className="px-5 py-3 text-right font-mono tabular-nums">{r.multiplier ? pct(r.multiplier - 1, 2, true) : "—"}</td>
                <td className="px-5 py-3 text-right font-mono tabular-nums">{usdCompact(r.liquidityUsd)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="px-5 pt-2 pb-5 text-[12px] text-white/50">
        A draft published so it can be argued with. The final basket is decided before the contract ships and is locked behind a timelock.
      </p>
    </div>
  );
}

async function Milestone() {
  const t = await getTreasury();
  return <MilestoneBox id="M3" cumulative={t.cumulativeEth} ethUsd={t.ethUsd} />;
}

export default function IndexPage() {
  return (
    <>
      <ProductHead
        id="M3"
        status="Queued"
        name="Valtora Index"
        title="A Whole Theme."
        sub="In One Token."
        lead="Holding eight stock tokens means eight swaps, eight approvals and eight positions to rebalance. The Valtora Index packs a basket of verified stock tokens into one token, backed one-for-one by the tokens themselves and priced by their Chainlink feeds."
      >
        <Suspense fallback={<div className="mt-10 h-[520px] animate-pulse rounded-[18px] bg-white/[0.06]" />}>
          <Basket />
        </Suspense>
      </ProductHead>
      <Steps
        title="How the index will work"
        steps={[
          { h: "Mint in kind", p: "Deposit the basket's stock tokens in their target proportions and receive index tokens. A one-step option will swap USDG into the basket for you through existing pools." },
          { h: "Priced by the chain", p: "The index value is each holding times its Chainlink price, with every token's distribution multiplier applied, so dividends are never lost in the maths." },
          { h: "Redeem in kind", p: "Burn index tokens and receive your share of every holding back, at any time. The contract has no owner, and basket changes wait out a public timelock." },
        ]}
      />
      <Suspense fallback={<div className="h-[420px] animate-pulse bg-mist" />}>
        <Milestone />
      </Suspense>
      <Risks
        items={[
          "The index holds Robinhood stock tokens. Their issuer can pause them, block addresses or burn balances, including those held by the index contract.",
          "Chainlink equity feeds follow US market hours. On weekends the index value stands still while pool prices keep moving.",
          "The contract will be new code. It opens with a deposit cap, and the cap is only raised after an independent audit.",
          "Stock tokens are only available in supported jurisdictions. An index token does not change that.",
        ]}
      />
      <FaqBlock
        items={[
          { q: "Can I buy the index today?", a: "No. It is milestone M3 and needs an independent audit before it takes deposits. The draft basket above is live data, not a product." },
          { q: "Who decides the basket?", a: "The first basket is published before launch. Later changes are proposed in public, and from milestone M4 they are decided by on-chain vote, then delayed by a timelock." },
          { q: "Is there a fee?", a: "A small management fee is planned, paid to the treasury and later to stakers. The exact rate is published with the contract." },
          { q: "Why not just buy the tokens myself?", a: "You can, and the terminal shows you how. The index is for people who want the whole theme in one position that rebalances itself." },
        ]}
      />
    </>
  );
}
