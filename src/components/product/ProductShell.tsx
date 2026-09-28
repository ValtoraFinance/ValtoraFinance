import Link from "next/link";
import { Check } from "lucide-react";
import { MILESTONES } from "@/config/treasury";
import { eth, pct, usd } from "@/lib/format";
import { Faq } from "@/components/product/Faq";

/* Shared building blocks for the three roadmap product pages. */

export function ProductHead({ id, status, name, title, sub, lead, children }: { id: string; status: string; name: string; title: string; sub: string; lead: string; children?: React.ReactNode }) {
  return (
    <section className="bg-night pt-36 pb-14 text-white md:pt-44">
      <div className="wrap">
        <p className="flex items-center gap-2 text-[15px] font-medium text-white/55">
          {name}
          <span className="rounded-full bg-white/10 px-2.5 py-0.5 font-mono text-[12px] text-white/75">
            {id} · {status}
          </span>
        </p>
        <h1 className="mt-3 max-w-[900px] text-[42px] leading-[1.02] font-medium tracking-[-0.035em] md:text-[60px]">
          {title}
          <br />
          <span className="text-white/50">{sub}</span>
        </h1>
        <p className="mt-6 max-w-[640px] font-serif text-[18px] leading-snug text-white/75">{lead}</p>
        {children}
      </div>
    </section>
  );
}

export function Steps({ title, steps }: { title: string; steps: { h: string; p: string }[] }) {
  return (
    <section className="bg-white py-14 md:py-20">
      <div className="wrap">
        <h2 className="text-[28px] font-medium tracking-[-0.025em] md:text-[36px]">{title}</h2>
        <ol className="mt-8 grid grid-cols-1 gap-3 md:grid-cols-3">
          {steps.map((s, i) => (
            <li key={s.h} className="rounded-[18px] bg-mist p-6">
              <span className="font-mono text-[13px] text-mute">{String(i + 1).padStart(2, "0")}</span>
              <p className="mt-4 text-[19px] font-medium tracking-[-0.01em]">{s.h}</p>
              <p className="mt-2 font-serif text-[16px] leading-snug text-ink/75">{s.p}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function MilestoneBox({ id, cumulative, ethUsd }: { id: string; cumulative: number | null; ethUsd: number | null }) {
  const m = MILESTONES.find((x) => x.id === id)!;
  const share = m.targetEth === 0 ? 1 : cumulative === null ? 0 : Math.min(1, cumulative / m.targetEth);
  return (
    <section className="bg-mist py-14 md:py-20">
      <div className="wrap grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div>
          <p className="text-[15px] font-medium text-mute">Milestone {m.id}</p>
          <h2 className="mt-3 text-[28px] font-medium tracking-[-0.025em] md:text-[36px]">What ships, and what it costs</h2>
          <ul className="mt-6 space-y-3 text-[15px]">
            {m.deliverables.map((d) => (
              <li key={d} className="flex gap-2">
                <Check className="mt-0.5 size-4 shrink-0 text-violet" /> {d}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-[20px] bg-white p-6 md:p-8">
          <p className="text-[12px] text-mute">Unlocks at</p>
          <p className="mt-1 text-[32px] font-medium tracking-[-0.02em] tabular-nums">{m.targetEth === 0 ? "No funding needed" : eth(m.targetEth, 2)}</p>
          {m.targetEth > 0 && ethUsd ? <p className="text-[13px] text-mute">≈ {usd(m.targetEth * ethUsd, 0)} at today&apos;s ETH price</p> : null}
          {m.targetEth > 0 ? (
            <>
              <div className="mt-6 h-2 overflow-hidden rounded-full bg-mist">
                <div className="h-full rounded-full bg-violet" style={{ width: `${Math.max(share * 100, share > 0 ? 2 : 0)}%` }} />
              </div>
              <p className="mt-2 text-[13px] text-mute">{cumulative === null ? "Reading the treasury…" : `${pct(share, 1)} funded, ${eth(cumulative)} received so far`}</p>
            </>
          ) : null}
          <p className="mt-6 text-[14px] leading-snug text-ink/70">{m.budget}</p>
          <Link href="/roadmap" className="btn btn-ghost mt-6 px-3 py-2.5 text-[14px]">
            Full roadmap
          </Link>
        </div>
      </div>
    </section>
  );
}

export function Risks({ items }: { items: string[] }) {
  return (
    <section className="bg-white py-14 md:py-20">
      <div className="wrap grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)]">
        <h2 className="text-[28px] font-medium tracking-[-0.025em] md:text-[36px]">Risks, plainly</h2>
        <ul className="space-y-4 font-serif text-[17px] leading-snug text-ink/80">
          {items.map((r) => (
            <li key={r} className="border-b border-line pb-4">
              {r}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function FaqBlock({ items }: { items: { q: string; a: string }[] }) {
  return (
    <section className="bg-white pb-20">
      <div className="wrap grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)]">
        <h2 className="text-[28px] font-medium tracking-[-0.025em] md:text-[36px]">FAQ</h2>
        <Faq items={items} />
      </div>
    </section>
  );
}
