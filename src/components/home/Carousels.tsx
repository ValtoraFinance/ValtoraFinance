"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, FlaskConical, LayoutGrid, Landmark, Scale, ShieldCheck, Users, Cpu } from "lucide-react";
import { ARTICLES, BELIEFS, PRINCIPLES, RAILS_TOKENS, THESES, formatDate } from "@/data/site";
import { DotGlobe } from "@/components/art/DotGlobe";
import { ArticleArt } from "@/components/art/ArticleArt";

function Arrows({ onPrev, onNext, dark = false }: { onPrev: () => void; onNext: () => void; dark?: boolean }) {
  const skin = dark ? "bg-white/10 text-white hover:bg-white/20" : "bg-mist text-ink hover:bg-cloud";
  return (
    <div className="flex gap-3">
      <button type="button" aria-label="Previous" onClick={onPrev} className={`grid size-9 cursor-pointer place-items-center rounded-md transition-colors ${skin}`}>
        <ChevronLeft className="size-4" />
      </button>
      <button type="button" aria-label="Next" onClick={onNext} className={`grid size-9 cursor-pointer place-items-center rounded-md transition-colors ${skin}`}>
        <ChevronRight className="size-4" />
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Theses: large quote cards                                           */
/* ------------------------------------------------------------------ */

const THESIS_ICONS = [Landmark, ShieldCheck, Users, Cpu, Scale];

export function Theses() {
  const [i, setI] = useState(0);
  const n = THESES.length;
  return (
    <section className="overflow-hidden bg-white py-16 md:py-24">
      <div className="wrap">
        <div className="flex gap-4 transition-transform duration-700 ease-[var(--ease-soft)]" style={{ transform: `translateX(calc(-${i} * (min(1130px, 100%) + 16px)))` }}>
          {THESES.map((t, k) => {
            const Icon = THESIS_ICONS[k % THESIS_ICONS.length];
            const active = k === i;
            return (
              <button
                type="button"
                key={t.label}
                onClick={() => setI(k)}
                className={`flex w-full max-w-[1130px] shrink-0 cursor-pointer flex-col rounded-[18px] p-6 text-left transition-colors duration-500 md:min-h-[532px] md:p-10 ${
                  active ? "bg-ink text-white" : "bg-cloud text-ink/70"
                }`}
                aria-current={active}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <span className={`grid size-24 shrink-0 place-items-center rounded-[14px] md:size-[200px] ${active ? "bg-gradient-to-br from-plate to-violet" : "bg-white"}`}>
                      <Icon className={`size-10 md:size-16 ${active ? "text-white" : "text-violet"}`} strokeWidth={1.2} />
                    </span>
                    <span>
                      <span className="block text-[20px] font-medium md:text-[24px]">{t.label}</span>
                      <span className={`block text-[13px] ${active ? "text-white/55" : "text-mute"}`}>{t.role}</span>
                    </span>
                  </div>
                  <img src="/brand/valtora-mark.webp" alt="" className={`hidden h-7 w-auto md:block ${active ? "" : "invert opacity-40"}`} />
                </div>
                <p className="mt-10 font-serif text-[24px] leading-[1.15] md:mt-auto md:text-[38px]">&ldquo;{t.quote}&rdquo;</p>
              </button>
            );
          })}
        </div>
        <div className="mt-6">
          <Arrows onPrev={() => setI((v) => (v - 1 + n) % n)} onNext={() => setI((v) => (v + 1) % n)} />
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Beliefs: the globe and three cycling words                          */
/* ------------------------------------------------------------------ */

export function Believe() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = window.setTimeout(() => setI((v) => (v + 1) % BELIEFS.length), 5200);
    return () => window.clearTimeout(t);
  }, [i]);
  const b = BELIEFS[i];
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="wrap relative">
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[1fr_minmax(0,460px)_1fr]">
          <div className="lg:pt-24">
            <p className="text-[15px] font-medium text-mute">A message from Valtora</p>
            <h2 className="mt-3 text-[40px] leading-none font-medium tracking-[-0.035em] md:text-[48px]">We Believe In</h2>
          </div>
          <div className="mx-auto w-full max-w-[460px]">
            <DotGlobe accent="#6d4cf0" />
          </div>
          <div className="lg:pt-24 lg:text-right">
            <p key={b.word} className="animate-[rise_0.7s_var(--ease-soft)] text-[40px] leading-none font-medium tracking-[-0.035em] text-violet md:text-[48px]">
              {b.word}
            </p>
          </div>
        </div>
        <div className="mt-10 flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <p key={`p-${i}`} className="max-w-[560px] animate-[rise_0.7s_var(--ease-soft)] font-serif text-[19px] leading-[1.35] md:text-[20px]">
            {b.body}
          </p>
          <div className="flex gap-2">
            {BELIEFS.map((x, k) => (
              <button
                key={x.word}
                type="button"
                onClick={() => setI(k)}
                aria-label={x.word}
                className={`grid size-9 cursor-pointer place-items-center rounded-full border text-[13px] transition-colors ${
                  k === i ? "border-mist bg-mist text-ink" : "border-line text-mute hover:text-ink"
                }`}
              >
                {String(k + 1).padStart(2, "0")}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Trust: dark hall with an expanding card row                          */
/* ------------------------------------------------------------------ */

export function Trust() {
  const [i, setI] = useState(0);
  const n = PRINCIPLES.length;
  useEffect(() => {
    const t = window.setTimeout(() => setI((v) => (v + 1) % n), 6000);
    return () => window.clearTimeout(t);
  }, [i, n]);
  return (
    <section className="relative overflow-hidden bg-night text-white">
      <div className="absolute inset-0 bg-cover bg-center opacity-90" style={{ backgroundImage: "url(/art/hall.webp)" }} />
      <div className="absolute inset-0 bg-gradient-to-b from-night/80 via-night/30 to-night md:from-night/40 md:via-transparent" />
      <div className="wrap relative py-20 md:py-28">
        <p className="text-[15px] font-medium text-white/80">Trust & Transparency</p>
        <h2 className="mt-3 text-[40px] leading-[1.05] font-medium tracking-[-0.035em] md:text-[56px]">
          Trust the Code,
          <br />
          Not the Team
        </h2>
        <div className="mt-14 flex gap-3 overflow-x-auto pb-2 [scrollbar-width:none] md:mt-40">
          {PRINCIPLES.map((p, k) => {
            const active = k === i;
            return (
              <button
                key={p.title}
                type="button"
                onClick={() => setI(k)}
                className={`flex h-[264px] shrink-0 cursor-pointer flex-col rounded-[22px] p-7 text-left transition-all duration-700 ease-[var(--ease-soft)] ${
                  active ? "w-[300px] bg-white text-ink md:w-[488px]" : "w-[200px] border border-white/15 bg-white/[0.04] text-white backdrop-blur-sm md:w-[244px]"
                }`}
              >
                <span className={`grid size-8 place-items-center rounded-full border text-[12px] ${active ? "border-ink/20" : "border-white/30"}`}>
                  {String(k + 1).padStart(2, "0")}
                </span>
                <span className={`mt-auto text-[20px] leading-tight font-medium ${active ? "" : "md:text-[21px]"}`}>{p.title}</span>
                {active ? (
                  <>
                    <span className="mt-2 font-serif text-[16px] leading-snug text-ink/75">{p.body}</span>
                    <span className="mt-4 block border-t border-ink pt-3 text-[13px] font-medium text-mute">Valtora principle {k + 1} of {n}</span>
                  </>
                ) : null}
              </button>
            );
          })}
        </div>
        <div className="mt-5">
          <Arrows dark onPrev={() => setI((v) => (v - 1 + n) % n)} onNext={() => setI((v) => (v + 1) % n)} />
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Rails: token names sliding past a highlighted centre                 */
/* ------------------------------------------------------------------ */

export function Rails() {
  const [i, setI] = useState(0);
  const n = RAILS_TOKENS.length;
  useEffect(() => {
    const t = window.setInterval(() => setI((v) => (v + 1) % n), 2600);
    return () => window.clearInterval(t);
  }, [n]);
  const order = [-2, -1, 0, 1, 2].map((d) => ({ d, t: RAILS_TOKENS[(i + d + n) % n] }));
  return (
    <section id="rails" className="scroll-mt-24 overflow-hidden bg-black py-20 text-white md:py-28">
      <div className="wrap text-center">
        <p className="text-[15px] font-medium text-white/70">Already on-chain</p>
        <h2 className="mt-3 text-[40px] leading-[1.05] font-medium tracking-[-0.035em] md:text-[56px]">
          Real Assets,
          <br />
          <span className="text-white/50">Verified in One Place</span>
        </h2>
      </div>
      <div className="relative mt-14 flex h-[120px] items-center justify-center [--rail-step:88vw] md:mt-20 md:[--rail-step:34vw]">
        {order.map(({ d, t }) => (
          <div
            key={`${t.name}-${d}`}
            className="absolute flex items-center gap-4 whitespace-nowrap transition-all duration-700 ease-[var(--ease-soft)]"
            style={{ transform: `translateX(calc(${d} * var(--rail-step))) scale(${d === 0 ? 1 : 0.62})`, opacity: Math.abs(d) === 2 ? 0.35 : d === 0 ? 1 : 0.55 }}
          >
            <img src={`/tiles/${t.tile}.webp`} alt="" className="size-14 rounded-2xl md:size-[92px] md:rounded-[26px]" />
            <span className={`text-[48px] font-medium tracking-[-0.03em] md:text-[96px] ${d === 0 ? "text-white" : "text-white/45"}`}>{t.name}</span>
          </div>
        ))}
      </div>
      <div className="wrap mt-14 text-center md:mt-20">
        <p className="mx-auto max-w-[440px] font-serif text-[18px] leading-[1.35] text-white/70 md:text-[20px]">
          Equities, treasury bills, gold, silver and oil already trade on Robinhood Chain as official stock tokens. The
          terminal verifies every one and prices it against its Chainlink feed.
        </p>
        <Link href="/terminal" className="btn btn-light mt-8">
          Open the Terminal
        </Link>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Insights teaser                                                     */
/* ------------------------------------------------------------------ */

export function InsightsTeaser({ title = "The Valtora Perspective" }: { title?: string }) {
  const [tab, setTab] = useState<"insights" | "research">("insights");
  const items = ARTICLES.filter((a) => (tab === "research" ? a.kind === "Research" || a.kind === "Explainer" : a.kind !== "Research")).slice(0, 3);
  return (
    <section className="bg-white py-20 md:py-28">
      <div className="wrap">
        <h3 className="reveal text-center text-[30px] font-medium tracking-[-0.02em] md:text-[36px]">{title}</h3>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button type="button" onClick={() => setTab("insights")} className={`flex cursor-pointer items-center gap-2 rounded-full px-4 py-2.5 text-[16px] font-medium transition-colors ${tab === "insights" ? "bg-cloud" : "text-mute hover:text-ink"}`}>
            <LayoutGrid className="size-4" /> Insights & Intelligence
          </button>
          <button type="button" onClick={() => setTab("research")} className={`flex cursor-pointer items-center gap-2 rounded-full px-4 py-2.5 text-[16px] font-medium transition-colors ${tab === "research" ? "bg-cloud" : "text-mute hover:text-ink"}`}>
            <FlaskConical className="size-4" /> Independent Research
          </button>
        </div>
        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
          {items.map((a) => (
            <Link key={a.slug} href={`/insights/${a.slug}`} className="group block min-w-0">
              <div className="aspect-[16/9.6] overflow-hidden rounded-[10px]">
                <div className="h-full w-full transition-transform duration-500 group-hover:scale-[1.03]">
                  <ArticleArt variant={a.art} />
                </div>
              </div>
              <p className="mt-4 text-[14px] text-mute">
                {a.kind} <span className="mx-1.5">•</span> {a.topic} <span className="mx-1.5">•</span> {formatDate(a.date)}
              </p>
              <h4 className="mt-2 text-[16px] leading-snug font-medium">{a.title}</h4>
            </Link>
          ))}
        </div>
        <div className="mt-14 text-center">
          <Link href="/insights" className="btn btn-dark px-3 py-2.5 text-[15px]">
            Explore Insights
          </Link>
        </div>
      </div>
    </section>
  );
}
