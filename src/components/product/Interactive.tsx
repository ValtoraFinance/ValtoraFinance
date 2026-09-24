"use client";

import { useEffect, useState } from "react";
import { Minus, Plus } from "lucide-react";
import { BRAND } from "@/config/brand";
import { AccrualCurve, IllustrativeTag } from "@/components/art/charts";

/* ------------------------------------------------------------------ */
/* Typed headline word with a blinking caret                           */
/* ------------------------------------------------------------------ */

export function TypedWord({ words, className = "" }: { words: string[]; className?: string }) {
  const [wi, setWi] = useState(0);
  const [len, setLen] = useState(words[0].length);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = words[wi];
    let t: number;
    if (!deleting && len === word.length) t = window.setTimeout(() => setDeleting(true), 2400);
    else if (deleting && len === 0) {
      t = window.setTimeout(() => {
        setDeleting(false);
        setWi((v) => (v + 1) % words.length);
      }, 250);
    } else t = window.setTimeout(() => setLen((v) => v + (deleting ? -1 : 1)), deleting ? 40 : 75);
    return () => window.clearTimeout(t);
  }, [len, deleting, wi, words]);

  return (
    <span className={className}>
      {words[wi].slice(0, len)}
      <span className="caret ml-0.5 inline-block h-[0.9em] w-[3px] translate-y-[0.1em] bg-current align-baseline" aria-hidden="true" />
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Illustrative accrual chart with range tabs                          */
/* ------------------------------------------------------------------ */

const RANGES = ["1W", "1M", "1Y", "ALL"] as const;

export function AccrualPanel({ accent, name }: { accent: string; name: string }) {
  const [range, setRange] = useState<(typeof RANGES)[number]>("ALL");
  return (
    <div className="min-w-0">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-mono text-[26px] leading-none">—</p>
          <p className="mt-1.5 font-mono text-[12px] text-mute">{name} price published at launch</p>
        </div>
        <div className="flex gap-1 rounded-md bg-mist p-1 font-mono text-[12px]">
          {RANGES.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRange(r)}
              className={`cursor-pointer rounded px-2.5 py-1 transition-colors ${range === r ? "bg-white shadow-sm" : "text-mute hover:text-ink"}`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>
      <div className="relative mt-6">
        <IllustrativeTag className="absolute top-0 left-0 z-10" />
        <div key={range} className="animate-[rise_0.6s_var(--ease-soft)]">
          <AccrualCurve accent={accent} height={300} />
        </div>
        <p className="mt-2 font-mono text-[11px] text-mute">Shape of daily accrual only. No prices, no history, no forecast.</p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* FAQ accordion                                                       */
/* ------------------------------------------------------------------ */

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

/* ------------------------------------------------------------------ */
/* Contact form: opens the visitor's mail app, stores nothing           */
/* ------------------------------------------------------------------ */

const REASONS = ["Product question", "Partnership", "Listing or integration", "Press", "Security report", "Other"];

export function ContactForm() {
  const [sent, setSent] = useState(false);
  const field = "mt-2 w-full rounded-md bg-cloud px-4 py-3 text-[15px] outline-none focus:ring-2 focus:ring-ink/20";
  return (
    <form
      className="rounded-[22px] bg-mist p-5 md:p-9"
      onSubmit={(e) => {
        e.preventDefault();
        const f = new FormData(e.currentTarget);
        const subject = `[${f.get("reason")}] ${f.get("first")} ${f.get("last")}`;
        const body = `${f.get("message")}\n\n— ${f.get("first")} ${f.get("last")}\n${f.get("email")}\n${f.get("org") || ""}`;
        window.location.href = `mailto:${BRAND.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        setSent(true);
      }}
    >
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <label className="block text-[13px] font-medium text-ink/70">
          First Name *
          <input name="first" required className={field} />
        </label>
        <label className="block text-[13px] font-medium text-ink/70">
          Last Name *
          <input name="last" required className={field} />
        </label>
        <label className="block text-[13px] font-medium text-ink/70">
          Email *
          <input name="email" type="email" required className={field} />
        </label>
        <label className="block text-[13px] font-medium text-ink/70">
          Organization
          <input name="org" className={field} />
        </label>
        <label className="block text-[13px] font-medium text-ink/70 sm:col-span-2">
          Reason *
          <select name="reason" required className={`${field} cursor-pointer appearance-none`} defaultValue="">
            <option value="" disabled>
              Choose one
            </option>
            {REASONS.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
        </label>
        <label className="block text-[13px] font-medium text-ink/70 sm:col-span-2">
          Message *
          <textarea name="message" required rows={4} className={`${field} resize-y`} />
        </label>
      </div>
      <button type="submit" className="btn btn-dark mt-8 px-5 text-[17px]">
        Submit
      </button>
      <p className="mt-6 text-[12.5px] leading-relaxed text-ink/60">
        {sent
          ? "Your email app should have opened with the message ready to send. If it did not, write to us directly at "
          : "Submitting opens your own email app with the message filled in. This site does not store what you type. You can also write to "}
        <a className="underline" href={`mailto:${BRAND.email}`}>
          {BRAND.email}
        </a>
        .
      </p>
    </form>
  );
}
