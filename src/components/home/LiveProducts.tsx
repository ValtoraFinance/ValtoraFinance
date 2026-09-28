import Link from "next/link";
import { ArrowRight, BadgeCheck } from "lucide-react";
import { INDEX_DRAFT } from "@/config/index-draft";
import { MILESTONES } from "@/config/treasury";
import { getTerminal, getTreasury, getUsdgMarkets } from "@/lib/onchain";
import { eth, pct, usd, usdCompact } from "@/lib/format";

/* Home products: the terminal that is live today, then the three roadmap
   products, each shown with a real on-chain number rather than a mock chart. */

function Progress({ id, cumulative }: { id: string; cumulative: number | null }) {
  const m = MILESTONES.find((x) => x.id === id)!;
  if (m.targetEth === 0) return <p className="text-[12px] text-mute">No funding needed</p>;
  const share = cumulative === null ? 0 : Math.min(1, cumulative / m.targetEth);
  return (
    <div>
      <div className="flex justify-between text-[12px] text-mute">
        <span>Unlocks at {eth(m.targetEth, 2)}</span>
        <span>{pct(share, 0)}</span>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-cloud">
        <div className="h-full rounded-full bg-violet" style={{ width: `${Math.max(share * 100, share > 0 ? 2 : 0)}%` }} />
      </div>
    </div>
  );
}

function RoadCard({ id, name, href, children, footer }: { id: string; name: string; href: string; children: React.ReactNode; footer: React.ReactNode }) {
  return (
    <Link href={href} className="group flex min-w-0 flex-col rounded-[22px] bg-mist p-6 transition-colors hover:bg-cloud">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[12px] text-mute">{id}</span>
        <ArrowRight className="size-4 text-mute transition-transform group-hover:translate-x-0.5" />
      </div>
      <p className="mt-3 text-[22px] font-medium tracking-[-0.02em]">{name}</p>
      <div className="mt-5 flex-1">{children}</div>
      <div className="mt-6">{footer}</div>
    </Link>
  );
}

export async function LiveProducts() {
  const [terminal, treasury, usdg] = await Promise.all([getTerminal(), getTreasury(), getUsdgMarkets(1)]);
  const top = [...terminal.rows].sort((a, b) => (b.liquidityUsd ?? 0) - (a.liquidityUsd ?? 0)).slice(0, 5);
  const sgov = terminal.rows.find((r) => r.symbol === "SGOV");
  const basket = terminal.rows.filter((r) => (INDEX_DRAFT.symbols as readonly string[]).includes(r.symbol));
  const basketLiquidity = basket.reduce((t, r) => t + (r.liquidityUsd ?? 0), 0);
  const bestUsdg = usdg[0];

  return (
    <section className="bg-white pb-20 md:pb-28" id="products">
      <div className="wrap reveal pt-10 pb-12 text-center md:pb-16">
        <p className="text-[15px] font-medium text-mute">Products</p>
        <h2 className="mt-4 text-[38px] leading-[1.05] font-medium tracking-[-0.035em] md:text-[56px]">
          Live on Day One.
          <br />
          <span className="text-mute">Funded from There.</span>
        </h2>
      </div>

      <div className="wrap">
        <div className="grid grid-cols-1 gap-3 rounded-[28px] bg-night p-3 text-white lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
          <div className="flex flex-col p-5 md:p-8">
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-jade/20 px-2.5 py-1 text-[12px] font-medium text-jade-soft">
              <span className="size-1.5 animate-pulse rounded-full bg-jade-soft" /> Live
            </span>
            <p className="mt-5 text-[34px] leading-[1.05] font-medium tracking-[-0.03em] md:text-[44px]">Valtora Terminal</p>
            <p className="mt-4 max-w-[440px] font-serif text-[17px] leading-snug text-white/70">
              Every official stock token on Robinhood Chain, checked against Robinhood&apos;s own contract and priced by its oracle and its
              deepest pool.
            </p>
            <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-[14px] bg-white/10">
              {[
                ["Verified assets", String(terminal.totals.assets)],
                ["Lookalikes seen", String(terminal.totals.lookalikes)],
                ["Pool liquidity", usdCompact(terminal.totals.liquidityUsd)],
                ["24h volume", usdCompact(terminal.totals.volume24hUsd)],
              ].map(([k, v]) => (
                <div key={k} className="bg-night p-4">
                  <dt className="text-[12px] text-white/50">{k}</dt>
                  <dd className="mt-1 text-[24px] font-medium tabular-nums">{v}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-auto flex flex-wrap gap-2 pt-8">
              <Link href="/terminal" className="btn btn-light px-4 py-3 text-[15px]">
                Open the Terminal
              </Link>
              <Link href="/terminal#verify" className="btn bg-white/10 px-4 py-3 text-[15px] text-white hover:bg-white/20">
                Check a token
              </Link>
            </div>
          </div>
          <div className="min-w-0 rounded-[20px] bg-white p-2 text-ink">
            <table className="w-full text-left text-[14px]">
              <thead className="text-[12px] text-mute">
                <tr>
                  <th className="px-3 py-3 font-medium">Asset</th>
                  <th className="px-3 py-3 text-right font-medium">Oracle</th>
                  <th className="hidden px-3 py-3 text-right font-medium sm:table-cell">Market</th>
                  <th className="px-3 py-3 text-right font-medium">Gap</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {top.map((r) => (
                  <tr key={r.address}>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-3">
                        <img src={`/tiles/${r.symbol.toLowerCase()}.webp`} alt="" width={32} height={32} className="size-8 rounded-[9px]" />
                        <div className="min-w-0">
                          <p className="flex items-center gap-1 font-medium">
                            {r.symbol} <BadgeCheck className="size-3.5 text-violet" aria-label="Verified on-chain" />
                          </p>
                          <p className="truncate text-[12px] text-mute">{usdCompact(r.liquidityUsd)} pool</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-right font-mono tabular-nums">{usd(r.oraclePrice)}</td>
                    <td className="hidden px-3 py-3 text-right font-mono tabular-nums sm:table-cell">{usd(r.dexPrice)}</td>
                    <td className="px-3 py-3 text-right font-mono tabular-nums">{pct(r.premium, 2, true)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="px-3 pt-2 pb-3 text-[11px] text-mute">Five deepest pools, read when this page loaded.</p>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-3">
          <RoadCard id="M1 · Live" name="Treasury Route" href="/treasury" footer={<Progress id="M1" cumulative={treasury.cumulativeEth} />}>
            <p className="font-serif text-[16px] leading-snug text-ink/75">Swap USDG or ETH into SGOV, the verified 0–3 month treasury bill token, checked against its oracle.</p>
            <dl className="mt-4 space-y-1.5 text-[13px]">
              <div className="flex justify-between"><dt className="text-mute">SGOV oracle</dt><dd className="font-mono tabular-nums">{usd(sgov?.oraclePrice)}</dd></div>
              <div className="flex justify-between"><dt className="text-mute">Deepest pool</dt><dd className="font-mono tabular-nums">{usdCompact(sgov?.liquidityUsd)}</dd></div>
              <div className="flex justify-between"><dt className="text-mute">Distributions</dt><dd className="font-mono tabular-nums">{sgov?.multiplier ? pct(sgov.multiplier - 1, 2, true) : "—"}</dd></div>
            </dl>
          </RoadCard>
          <RoadCard id="M2 · Funding" name="Yield Vault" href="/yield" footer={<Progress id="M2" cumulative={treasury.cumulativeEth} />}>
            <p className="font-serif text-[16px] leading-snug text-ink/75">A USDG vault on Morpho, curated by the treasury, allocating only to markets it publishes.</p>
            <dl className="mt-4 space-y-1.5 text-[13px]">
              <div className="flex justify-between"><dt className="text-mute">Largest USDG market</dt><dd className="font-mono">{bestUsdg ? `${bestUsdg.collateral} / USDG` : "—"}</dd></div>
              <div className="flex justify-between"><dt className="text-mute">Supplied</dt><dd className="font-mono tabular-nums">{usdCompact(bestUsdg?.supplyUsd)}</dd></div>
              <div className="flex justify-between"><dt className="text-mute">Supply APY today</dt><dd className="font-mono tabular-nums">{pct(bestUsdg?.supplyApy)}</dd></div>
            </dl>
          </RoadCard>
          <RoadCard id="M3 · Queued" name="Valtora Index" href="/equities" footer={<Progress id="M3" cumulative={treasury.cumulativeEth} />}>
            <p className="font-serif text-[16px] leading-snug text-ink/75">A basket token of verified stock tokens with in-kind mint and redeem, priced by Chainlink.</p>
            <div className="mt-4 flex -space-x-2">
              {basket.map((r) => (
                <img key={r.symbol} src={`/tiles/${r.symbol.toLowerCase()}.webp`} alt={r.symbol} title={r.symbol} width={30} height={30} className="size-[30px] rounded-[8px] ring-2 ring-mist" />
              ))}
            </div>
            <p className="mt-3 text-[13px] text-mute">
              Draft basket: {basket.length} names, {usdCompact(basketLiquidity)} of pool liquidity behind them.
            </p>
          </RoadCard>
        </div>
      </div>
    </section>
  );
}

export function LiveProductsSkeleton() {
  return (
    <section className="bg-white pb-20 md:pb-28">
      <div className="wrap pt-10">
        <div className="h-[560px] animate-pulse rounded-[28px] bg-mist" />
        <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-[320px] animate-pulse rounded-[22px] bg-mist" />
          ))}
        </div>
      </div>
    </section>
  );
}
