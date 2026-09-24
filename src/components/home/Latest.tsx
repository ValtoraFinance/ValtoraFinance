"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ARTICLES, formatDate } from "@/data/site";
import { ArticleArt } from "@/components/art/ArticleArt";

const DURATION = 7000;

export function Latest() {
  const items = ARTICLES.filter((a) => a.featured);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const t = window.setTimeout(() => setIndex((i) => (i + 1) % items.length), DURATION);
    return () => window.clearTimeout(t);
  }, [index, paused, items.length]);

  return (
    <section className="bg-white pt-24 pb-24 md:pt-36 md:pb-36">
      <h2 className="reveal wrap text-center text-[34px] leading-[1.05] font-medium tracking-[-0.03em] md:text-[48px]">
        See the Latest <span className="text-mute">from Valtora</span>
      </h2>

      <div
        className="relative mt-14 overflow-hidden md:mt-20"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className="wrap relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-12 rounded-r-[22px] bg-mist md:block" />
          <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-12 rounded-l-[22px] bg-mist md:block" />
          <div className="relative md:px-[68px]">
            <div className="overflow-hidden rounded-[22px]">
            <div className="flex transition-transform duration-700 ease-[var(--ease-soft)]" style={{ transform: `translateX(-${index * 100}%)` }}>
              {items.map((a, i) => (
                <article key={a.slug} className="w-full shrink-0 px-0" aria-hidden={i !== index}>
                  <div className="grid grid-cols-1 gap-5 rounded-[22px] bg-[#2d2c33] p-4 text-white md:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] md:gap-4 md:p-6">
                    <div className="aspect-[16/10] overflow-hidden rounded-[16px]">
                      <ArticleArt variant={a.art} />
                    </div>
                    <div className="relative flex min-w-0 flex-col md:py-1">
                      <p className="text-[14px] text-white/60">
                        {a.topic} <span className="mx-1.5">•</span> {formatDate(a.date)}
                      </p>
                      <h3 className="mt-3 text-[22px] leading-[1.08] font-medium tracking-[-0.02em] md:text-[28px]">{a.title}</h3>
                      <p className="mt-5 font-serif text-[16px] leading-[1.35] text-white/80 md:text-[17px]">{a.excerpt}</p>
                      <div className="mt-6 md:mt-auto">
                        <Link href={`/insights/${a.slug}`} tabIndex={i === index ? 0 : -1} className="btn bg-white/15 px-3 py-2.5 text-[15px] text-white hover:bg-white/25">
                          Read More
                        </Link>
                      </div>
                      <Ring key={`${index}-${paused}`} running={!paused && i === index} />
                    </div>
                  </div>
                </article>
              ))}
            </div>
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-center gap-2">
          {items.map((a, i) => (
            <button
              key={a.slug}
              type="button"
              aria-label={`Show story ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-1.5 cursor-pointer rounded-full transition-all ${i === index ? "w-8 bg-ink" : "w-3 bg-cloud"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function Ring({ running }: { running: boolean }) {
  // Start empty, then fill on the next frame so the transition runs.
  const [go, setGo] = useState(false);
  useEffect(() => {
    const r = window.requestAnimationFrame(() => setGo(true));
    return () => window.cancelAnimationFrame(r);
  }, []);
  const on = running && go;
  return (
    <svg viewBox="0 0 20 20" className="absolute top-0 right-0 hidden size-4 -rotate-90 md:block" aria-hidden="true">
      <circle cx="10" cy="10" r="8" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
      <circle
        cx="10"
        cy="10"
        r="8"
        fill="none"
        stroke="rgba(255,255,255,0.7)"
        strokeWidth="2"
        strokeDasharray="50.3"
        strokeDashoffset={on ? 0 : 50.3}
        style={{ transition: on ? `stroke-dashoffset ${DURATION}ms linear` : "none" }}
      />
    </svg>
  );
}
