"use client";

import { useEffect, useState } from "react";
import { BRAND } from "@/config/brand";

const KEY = "valtora.notice.v1";

/** First-visit notice about what this site is, dismissed with OK. */
export function Notice() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    let seen = false;
    try {
      seen = window.localStorage.getItem(KEY) === "1";
    } catch {
      seen = false;
    }
    if (!seen) {
      const t = window.setTimeout(() => setShow(true), 900);
      return () => window.clearTimeout(t);
    }
  }, []);
  if (!show) return null;
  return (
    <div
      role="dialog"
      aria-label="Important notice"
      className="fixed right-3 bottom-3 left-3 z-[60] max-w-[464px] rounded-xl bg-[#3a3942]/95 p-4 text-[12.5px] leading-[1.5] text-white shadow-2xl backdrop-blur-md sm:right-auto sm:bottom-5 sm:left-5"
    >
      <p>
        This is the website of {BRAND.name}, a crypto token project on Robinhood Chain run by an anonymous team.{" "}
        {BRAND.symbol} is a crypto token, not a security, deposit or fund unit. Market data here is read from public
        sources; roadmap products do not exist yet. Nothing here is investment advice or an offer to buy or sell
        anything. Crypto assets can lose all of their value.
      </p>
      <div className="mt-3 flex justify-end">
        <button
          type="button"
          onClick={() => {
            try {
              window.localStorage.setItem(KEY, "1");
            } catch {
              // Private windows may refuse storage; the notice just returns next time.
            }
            setShow(false);
          }}
          className="cursor-pointer rounded-md bg-white/15 px-3.5 py-2 text-[14px] font-medium transition-colors hover:bg-white/25"
        >
          OK
        </button>
      </div>
    </div>
  );
}
