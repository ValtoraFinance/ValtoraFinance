"use client";

import { useMemo, useState } from "react";
import { ArrowUpRight, Search } from "lucide-react";
import { ECOSYSTEM } from "@/data/site";

export function Directory() {
  const categories = ["All Categories", ...Array.from(new Set(ECOSYSTEM.map((e) => e.category)))];
  const [cat, setCat] = useState("All Categories");
  const [status, setStatus] = useState("All");
  const [q, setQ] = useState("");
  const list = useMemo(
    () =>
      ECOSYSTEM.filter(
        (e) =>
          (cat === "All Categories" || e.category === cat) &&
          (status === "All" || e.status === status) &&
          (!q || `${e.name} ${e.blurb}`.toLowerCase().includes(q.toLowerCase())),
      ),
    [cat, status, q],
  );
  const select = "cursor-pointer rounded-md bg-mist px-3 py-2 text-[13px] outline-none";
  return (
    <div>
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <h2 className="text-[26px] font-medium tracking-[-0.02em]">
          {ECOSYSTEM.length} Chains, Tools and Open Seats
        </h2>
      </div>
      <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
        <select aria-label="Category" value={cat} onChange={(e) => setCat(e.target.value)} className={select}>
          {categories.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <select aria-label="Status" value={status} onChange={(e) => setStatus(e.target.value)} className={select}>
          {["All", "Works today", "Open seat"].map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <select aria-label="Network" className={select} defaultValue="Robinhood Chain">
          <option>Robinhood Chain</option>
        </select>
        <label className="flex items-center gap-2 rounded-md bg-mist px-3 py-2 text-[13px]">
          <Search className="size-3.5 text-mute" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search" className="w-full bg-transparent outline-none" />
        </label>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((e) => {
          const Tag = e.href ? "a" : "div";
          return (
            <Tag
              key={e.name}
              {...(e.href ? { href: e.href, target: "_blank", rel: "noreferrer" } : {})}
              className="group relative flex min-h-[150px] flex-col items-center justify-center overflow-hidden rounded-[14px] bg-mist p-5 text-center transition-colors hover:bg-ink hover:text-white"
            >
              <span className={`grid size-10 place-items-center rounded-full text-[14px] font-semibold ${e.status === "Open seat" ? "border border-dashed border-soft text-mute group-hover:border-white/40 group-hover:text-white" : "bg-ink text-white group-hover:bg-white group-hover:text-ink"}`}>
                {e.status === "Open seat" ? "+" : e.name[0]}
              </span>
              <span className="mt-3 text-[15px] font-medium">{e.name}</span>
              <span className="text-[12px] text-mute group-hover:hidden">{e.category} · {e.status}</span>
              <span className="hidden text-[12.5px] leading-snug text-white/75 group-hover:block">{e.blurb}</span>
              {e.href ? <ArrowUpRight className="absolute top-3 right-3 size-4 opacity-0 transition-opacity group-hover:opacity-100" /> : null}
            </Tag>
          );
        })}
      </div>
      <p className="mt-6 text-[12.5px] text-mute">
        &ldquo;Works today&rdquo; means technically compatible with Valtora and this site. It does not mean a partnership or an
        endorsement. &ldquo;Open seat&rdquo; marks a role we want to fill before launch.
      </p>
    </div>
  );
}
