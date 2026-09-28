import type { Metadata } from "next";
import { Suspense } from "react";
import { ArrowUpRight, BadgeCheck } from "lucide-react";
import { CHAIN, explorerToken } from "@/config/brand";
import { getTerminal, getTreasury } from "@/lib/onchain";
import { ago, pct, usd, usdCompact } from "@/lib/format";
import { FaqBlock, MilestoneBox, ProductHead, Risks, Steps } from "@/components/product/ProductShell";
import { SwapWidget } from "@/components/treasury/SwapWidget";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Treasury Route",
  description: "A direct route from USDG into SGOV, the verified 0–3 month treasury bill token on Robinhood Chain. No Valtora contract holds your funds.",
};

async function SgovLive() {
  const t = await getTerminal();
  const s = t.rows.find((r) => r.symbol === "SGOV");
  if (!s) return null;
  const rows: [string, string][] = [
    ["Oracle price (Chainlink)", `${usd(s.oraclePrice)} · ${ago(s.oracleUpdatedAt, t.readAt)}`],
    ["Market price (deepest pool)", usd(s.dexPrice)],
    ["Gap to oracle", pct(s.premium, 2, true)],
    ["Distributions credited", s.multiplier ? pct(s.multiplier - 1, 2, true) : "—"],
    ["Deepest pool liquidity", usdCompact(s.liquidityUsd)],
    ["24h volume", usdCompact(s.volume24hUsd)],
    ["Morpho market", s.lending ? `SGOV / ${s.lending.loan}, LLTV ${pct(s.lending.lltv, 1)}` : "None"],
  ];
  return (
    <div className="mt-10 grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <SwapWidget />
      <div className="flex min-w-0 flex-col gap-3">
      <div className="flex flex-col rounded-[18px] bg-white/[0.06] p-6">
        <div className="flex items-center gap-3">
          <img src="/tiles/sgov.webp" alt="" width={44} height={44} className="size-11 rounded-[12px]" />
          <div>
            <p className="flex items-center gap-1 text-[17px] font-medium">
              SGOV <BadgeCheck className="size-4 text-violet-soft" aria-label="Verified on-chain" />
            </p>
            <p className="text-[13px] text-white/55">{s.name}</p>
          </div>
        </div>
        <p className="mt-8 text-[44px] font-medium tracking-[-0.03em] tabular-nums">{usd(s.oraclePrice)}</p>
        <p className="text-[13px] text-white/55">Official Robinhood stock token, verified against Robinhood&apos;s token contract</p>
        <div className="mt-auto flex flex-wrap gap-2 pt-8">
          {s.pairUrl ? (
            <a href={s.pairUrl} target="_blank" rel="noreferrer" className="btn bg-white/10 px-4 py-3 text-[15px] text-white hover:bg-white/20">
              Pool on Dexscreener <ArrowUpRight className="size-4" />
            </a>
          ) : null}
          <a href={explorerToken(s.address)} target="_blank" rel="noreferrer" className="btn bg-white/10 px-4 py-3 text-[15px] text-white hover:bg-white/20">
            Contract <ArrowUpRight className="size-4" />
          </a>
        </div>
      </div>
      <dl className="divide-y divide-white/10 rounded-[18px] bg-white/[0.06] px-6 py-2">
        {rows.map(([k, v]) => (
          <div key={k} className="flex justify-between gap-4 py-3 text-[14px]">
            <dt className="text-white/60">{k}</dt>
            <dd className="text-right font-mono text-[13px] tabular-nums">{v}</dd>
          </div>
        ))}
      </dl>
      </div>
    </div>
  );
}

async function Milestone() {
  const t = await getTreasury();
  return <MilestoneBox id="M1" cumulative={t.cumulativeEth} ethUsd={t.ethUsd} />;
}

export default function TreasuryPage() {
  return (
    <>
      <ProductHead
        id="M1"
        status="Live"
        name="Treasury Route"
        title="Treasury Bills On-chain."
        sub="Without a New Token."
        lead={`SGOV, an ETF of US treasury bills maturing within three months, already trades on ${CHAIN.name} as an official stock token. The Treasury Route takes you there from USDG or ETH in one transaction, at the best Uniswap price, checked against the oracle. No Valtora contract ever holds your funds.`}
      >
        <Suspense fallback={<div className="mt-10 h-[340px] animate-pulse rounded-[18px] bg-white/[0.06]" />}>
          <SgovLive />
        </Suspense>
      </ProductHead>
      <Steps
        title="How the route works"
        steps={[
          { h: "Start with USDG", p: "USDG is the dollar most stock token pools on Robinhood Chain are priced in. Hold it in any wallet that supports the network." },
          { h: "Swap into SGOV", p: "The route quotes every Uniswap pool that holds SGOV, picks the one that pays most, and refuses the swap if the price is more than 1% worse than the Chainlink oracle." },
          { h: "Hold, then leave", p: "SGOV settles straight into your wallet. Distributions are credited by the token's on-chain multiplier. Leave the same way, any time the pool is open." },
        ]}
      />
      <Suspense fallback={<div className="h-[420px] animate-pulse bg-mist" />}>
        <Milestone />
      </Suspense>
      <Risks
        items={[
          "SGOV is an exchange-traded fund share wrapped in a token. Its price can fall, and its distributions change with interest rates.",
          "Robinhood issues the token and can pause it, block addresses or burn balances. That applies to every holder.",
          "Stock tokens are only available in supported jurisdictions. Check the rules where you live.",
          "Pool prices can drift from the oracle, especially when US markets are closed. Always compare the two before you swap.",
        ]}
      />
      <FaqBlock
        items={[
          { q: "Is this a Valtora token?", a: "No. SGOV is issued by Robinhood. Valtora only builds the route to it and never takes custody of your funds." },
          { q: "Can I use it today?", a: "Yes. Connect a wallet on Robinhood Chain and swap above. Paying with USDG takes two transactions the first time: an approval for the exact amount, then the swap." },
          { q: "What does my wallet sign?", a: "An approval of the exact USDG or SGOV amount to Uniswap's SwapRouter02, and the swap itself sent to that router. Nothing is ever sent to a Valtora address." },
          { q: "What does it cost?", a: "Only the pool's swap fee and network gas. Valtora adds no fee to the route." },
          { q: "How is yield paid?", a: "Distributions raise the token's on-chain multiplier. Your token balance stays the same while its value grows." },
        ]}
      />
    </>
  );
}
