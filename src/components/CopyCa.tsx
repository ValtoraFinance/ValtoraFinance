"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";
import { BRAND, shortAddress } from "@/config/brand";

function useCopy() {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(BRAND.ca);
    } catch {
      // Older browsers and some embedded views refuse the async clipboard.
      const area = document.createElement("textarea");
      area.value = BRAND.ca;
      document.body.appendChild(area);
      area.select();
      document.execCommand("copy");
      document.body.removeChild(area);
    }
    setCopied(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 1600);
  };
  return { copied, copy };
}

/** Compact pill for the navbar: "CA" + short address + copy icon. */
export function CopyCaPill({ tone = "dark", className = "" }: { tone?: "dark" | "light"; className?: string }) {
  const { copied, copy } = useCopy();
  const skin =
    tone === "dark"
      ? "bg-white/10 text-white/85 hover:bg-white/15"
      : "bg-ink/[0.06] text-ink/80 hover:bg-ink/10";
  return (
    <button
      type="button"
      onClick={copy}
      title={`Copy ${BRAND.ca}`}
      aria-label="Copy contract address"
      data-copy-ca
      className={`flex h-9 shrink-0 cursor-pointer items-center gap-1.5 rounded-md px-2.5 font-mono text-[11.5px] transition-colors ${skin} ${className}`}
    >
      <span className="font-sans text-[10px] font-semibold tracking-wider opacity-60">CA</span>
      <span className={copied ? "text-up" : ""}>{copied ? "Copied" : shortAddress(BRAND.ca, 5, 4)}</span>
      {copied ? <Check className="size-3.5 text-up" /> : <Copy className="size-3.5 opacity-70" />}
    </button>
  );
}

/** Full-width contract block, used in the footer and on the token page. */
export function CopyCaBlock({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const { copied, copy } = useCopy();
  const dark = tone === "dark";
  return (
    <div className="w-full min-w-0">
      <p className={`mb-2 text-[13px] ${dark ? "text-white/55" : "text-mute"}`}>
        Contract address · {BRAND.symbol} on Robinhood Chain
      </p>
      <button
        type="button"
        onClick={copy}
        aria-label="Copy contract address"
        data-copy-ca
        className={`group flex w-full cursor-pointer items-center gap-3 rounded-lg px-4 py-3 text-left transition-colors ${
          dark ? "bg-white/[0.07] hover:bg-white/[0.12]" : "bg-mist hover:bg-cloud"
        }`}
      >
        <span className={`min-w-0 flex-1 font-mono text-[12.5px] break-all ${dark ? "text-white/85" : "text-ink"}`}>{BRAND.ca}</span>
        <span className={`flex shrink-0 items-center gap-1.5 text-[13px] font-medium ${copied ? "text-up" : dark ? "text-white" : "text-ink"}`}>
          {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
          {copied ? "Copied" : "Copy"}
        </span>
      </button>
    </div>
  );
}
