"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";

export function Faq({ items, dark = false }: { items: { q: string; a: string }[]; dark?: boolean }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <ul className={`divide-y ${dark ? "divide-white/10 border-white/10" : "divide-line border-line"} border-t border-b`}>
      {items.map((it, i) => (
        <li key={it.q}>
          <button
            type="button"
            onClick={() => setOpen((v) => (v === i ? null : i))}
            aria-expanded={open === i}
            className="flex w-full cursor-pointer items-center justify-between gap-4 py-4 text-left text-[16px] font-medium"
          >
            {it.q}
            {open === i ? <Minus className="size-4 shrink-0" /> : <Plus className="size-4 shrink-0" />}
          </button>
          {open === i ? (
            <p className={`animate-[rise_0.4s_var(--ease-soft)] pb-5 font-serif text-[17px] leading-snug ${dark ? "text-white/70" : "text-ink/75"}`}>{it.a}</p>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
