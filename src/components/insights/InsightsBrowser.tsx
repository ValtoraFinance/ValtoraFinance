"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { ARTICLES, formatDate } from "@/data/site";
import { ArticleCard } from "@/components/insights/ArticleCard";
import { ArticleArt } from "@/components/art/ArticleArt";

const FILTERS = ["All Insights", "Articles", "Research", "Explainers", "Podcasts", "Updates"] as const;
const KIND: Record<(typeof FILTERS)[number], string | null> = {
  "All Insights": null,
  Articles: "Article",
  Research: "Research",
  Explainers: "Explainer",
  Podcasts: "Podcast",
  Updates: "Update",
};

export function InsightsBrowser() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All Insights");
  const [q, setQ] = useState("");
  const [feature, setFeature] = useState(0);
  const featured = ARTICLES.filter((a) => a.featured);
  const list = useMemo(() => {
    const kind = KIND[filter];
    const needle = q.trim().toLowerCase();
    return ARTICLES.filter((a) => (!kind || a.kind === kind) && (!needle || `${a.title} ${a.excerpt} ${a.topic}`.toLowerCase().includes(needle)));
  }, [filter, q]);
  const f = featured[feature];

  return (
    <>
      <div className="wrap">
        <div className="relative flex gap-3">
          <button type="button" aria-label="Previous story" onClick={() => setFeature((v) => (v - 1 + featured.length) % featured.length)} className="hidden w-6 shrink-0 cursor-pointer rounded-[14px] bg-white/[0.07] hover:bg-white/15 md:block" />
          <button type="button" aria-label="Previous story" onClick={() => setFeature((v) => (v - 1 + featured.length) % featured.length)} className="hidden w-6 shrink-0 cursor-pointer rounded-[14px] bg-white/[0.07] hover:bg-white/15 md:block" />
          <div key={f.slug} className="grid min-w-0 flex-1 animate-[rise_0.6s_var(--ease-soft)] grid-cols-1 gap-5 rounded-[18px] bg-[#2d2c33] p-4 md:grid-cols-2 md:p-5">
            <div className="aspect-[16/10] overflow-hidden rounded-[12px]">
              <ArticleArt variant={f.art} />
            </div>
            <div className="flex min-w-0 flex-col">
              <p className="text-[13px] text-white/55">
                {f.kind} <span className="mx-1.5">•</span> {f.topic} <span className="mx-1.5">•</span> {formatDate(f.date)}
              </p>
              <h2 className="mt-3 text-[22px] leading-tight font-medium tracking-[-0.02em] md:text-[26px]">{f.title}</h2>
              <p className="mt-4 font-serif text-[16px] leading-snug text-white/75">{f.excerpt}</p>
              <div className="mt-6 flex items-center justify-between md:mt-auto">
                <Link href={`/insights/${f.slug}`} className="btn bg-white/15 px-3 py-2 text-[14px] text-white hover:bg-white/25">
                  Read More
                </Link>
                <div className="flex gap-1.5">
                  {featured.map((x, i) => (
                    <button key={x.slug} type="button" aria-label={`Story ${i + 1}`} onClick={() => setFeature(i)} className={`h-1.5 cursor-pointer rounded-full ${i === feature ? "w-6 bg-white" : "w-2 bg-white/30"}`} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="wrap mt-20">
        <label className="flex items-center gap-3 border-b border-white/15 pb-3 text-white/70">
          <Search className="size-4" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search" className="w-full bg-transparent text-[16px] text-white outline-none placeholder:text-white/50" />
        </label>
        <div className="mt-8 flex flex-col justify-between gap-5 md:flex-row md:items-center">
          <p className="text-[30px] font-medium tracking-[-0.02em]">
            {list.length} Insight{list.length === 1 ? "" : "s"}
          </p>
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((x) => (
              <button key={x} type="button" onClick={() => setFilter(x)} className={`cursor-pointer rounded-full px-3.5 py-1.5 text-[13px] transition-colors ${filter === x ? "bg-white/15 text-white" : "text-white/60 hover:text-white"}`}>
                {x}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((a) => (
            <ArticleCard key={a.slug} a={a} dark />
          ))}
        </div>
        {list.length === 0 ? <p className="py-16 text-center text-white/60">Nothing matches that search yet.</p> : null}
      </div>
    </>
  );
}
