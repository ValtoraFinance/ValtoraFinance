import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Check } from "lucide-react";
import { BRAND, CHAIN } from "@/config/brand";
import { MILESTONES, type Milestone, type MilestoneStatus } from "@/config/treasury";
import { getTreasury } from "@/lib/onchain";
import { eth, pct, usd } from "@/lib/format";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Roadmap",
  description: `${BRAND.name} milestones and what funds them. Progress is read from the treasury on ${CHAIN.name}.`,
};

const STATUS: Record<MilestoneStatus, { label: string; tone: string }> = {
  live: { label: "Live", tone: "bg-jade-soft text-jade" },
  building: { label: "Building", tone: "bg-violet-soft/60 text-violet" },
  funding: { label: "Funding", tone: "bg-ember/15 text-ember" },
  queued: { label: "Queued", tone: "bg-cloud text-mute" },
};

function Card({ m, cumulative, ethUsd }: { m: Milestone; cumulative: number | null; ethUsd: number | null }) {
  const funded = m.targetEth === 0 || (cumulative !== null && cumulative >= m.targetEth);
  const share = m.targetEth === 0 ? 1 : cumulative === null ? 0 : Math.min(1, cumulative / m.targetEth);
  const status = STATUS[m.status];
  return (
    <article className="grid grid-cols-1 gap-6 rounded-[20px] border border-line bg-white p-6 md:grid-cols-[120px_minmax(0,1fr)_minmax(0,300px)] md:p-8">
      <div>
        <p className="font-mono text-[13px] text-mute">{m.id}</p>
        <span className={`mt-2 inline-block rounded-full px-2.5 py-1 text-[12px] font-medium ${status.tone}`}>{status.label}</span>
      </div>
      <div className="min-w-0">
        <h2 className="text-[24px] font-medium tracking-[-0.02em]">{m.name}</h2>
        <p className="mt-2 font-serif text-[17px] leading-snug text-ink/75">{m.summary}</p>
        <ul className="mt-4 space-y-2 text-[14px]">
          {m.deliverables.map((d) => (
            <li key={d} className="flex gap-2">
              <Check className="mt-0.5 size-4 shrink-0 text-violet" /> {d}
            </li>
          ))}
        </ul>
      </div>
      <div className="min-w-0">
        <p className="text-[12px] text-mute">Unlocks at</p>
        <p className="mt-1 text-[22px] font-medium tabular-nums">
          {m.targetEth === 0 ? "No funding needed" : eth(m.targetEth, 2)}
        </p>
        {m.targetEth > 0 && ethUsd ? <p className="text-[12px] text-mute">≈ {usd(m.targetEth * ethUsd, 0)} at today&apos;s price</p> : null}
        {m.targetEth > 0 ? (
          <>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-mist" role="progressbar" aria-valuenow={Math.round(share * 100)} aria-valuemin={0} aria-valuemax={100}>
              <div className={`h-full rounded-full ${funded ? "bg-jade" : "bg-violet"}`} style={{ width: `${Math.max(share * 100, share > 0 ? 2 : 0)}%` }} />
            </div>
            <p className="mt-2 text-[12px] text-mute">{cumulative === null ? "Reading the treasury…" : funded ? "Funded" : `${pct(share, 1)} funded`}</p>
          </>
        ) : null}
        <p className="mt-4 text-[12px] leading-snug text-mute">{m.budget}</p>
      </div>
    </article>
  );
}

async function Milestones() {
  const t = await getTreasury();
  return (
    <>
      <div className="mb-8 grid grid-cols-1 gap-3 md:grid-cols-3">
        {[
          { k: "Treasury today", v: eth(t.treasuryValueEth) },
          { k: "Spent on the roadmap", v: eth(t.spentEth) },
          { k: "Received in total", v: eth(t.cumulativeEth) },
        ].map((s) => (
          <div key={s.k} className="rounded-[16px] bg-white p-5">
            <p className="text-[12px] text-mute">{s.k}</p>
            <p className="mt-2 text-[26px] font-medium tracking-[-0.02em] tabular-nums">{s.v}</p>
          </div>
        ))}
      </div>
      <div className="space-y-3">
        {MILESTONES.map((m) => (
          <Card key={m.id} m={m} cumulative={t.cumulativeEth} ethUsd={t.ethUsd} />
        ))}
      </div>
    </>
  );
}

export default function RoadmapPage() {
  return (
    <>
      <section className="bg-night pt-36 pb-14 text-white md:pt-44">
        <div className="wrap">
          <p className="text-[15px] font-medium text-white/55">Roadmap</p>
          <h1 className="mt-3 max-w-[900px] text-[42px] leading-[1.02] font-medium tracking-[-0.035em] md:text-[60px]">
            Built First.
            <br />
            <span className="text-white/50">Funded by Use.</span>
          </h1>
          <p className="mt-6 max-w-[640px] font-serif text-[18px] leading-snug text-white/75">
            Each milestone has a price, and the price is paid by creator fees flowing into the treasury. Progress below is the treasury&apos;s
            holdings plus everything it has already spent, read from {CHAIN.name}. Milestones unlock when the treasury does, and not before.
          </p>
        </div>
      </section>
      <section className="bg-mist py-14 md:py-20">
        <div className="wrap">
          <Suspense fallback={<div className="space-y-3">{[0, 1, 2].map((i) => <div key={i} className="h-[240px] animate-pulse rounded-[20px] bg-white" />)}</div>}>
            <Milestones />
          </Suspense>
          <p className="mt-8 max-w-[760px] text-[13px] leading-relaxed text-mute">
            Targets are cumulative: money spent on an earlier milestone still counts, so paying for work never moves the roadmap backwards.
            Every payment is listed on the <Link href="/transparency" className="underline underline-offset-4">transparency page</Link>.
            If trading volume stops, so does the roadmap. We would rather say that plainly than promise dates.
          </p>
        </div>
      </section>
    </>
  );
}
