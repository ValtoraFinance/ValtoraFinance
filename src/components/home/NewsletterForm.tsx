"use client";

import { useState } from "react";
import { BRAND } from "@/config/brand";

/**
 * The mailing list opens at launch. Until then the form says so plainly
 * instead of pretending to store an address.
 */
export function NewsletterForm({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const [sent, setSent] = useState(false);
  const dark = tone === "dark";
  return (
    <form
      className="mt-10 flex w-full max-w-[480px] flex-col gap-3 sm:flex-row"
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
    >
      {sent ? (
        <p className={`w-full rounded-md px-4 py-3.5 text-[15px] ${dark ? "bg-white/15 text-white" : "bg-mist text-ink"}`}>
          The mailing list opens at launch. Until then, follow{" "}
          <a href={BRAND.x} target="_blank" rel="noreferrer" className="underline">
            {BRAND.xHandle}
          </a>{" "}
          for every update. Nothing was stored.
        </p>
      ) : (
        <>
          <label className="sr-only" htmlFor="newsletter-email">
            Email
          </label>
          <input
            id="newsletter-email"
            type="email"
            required
            placeholder="Email"
            className={`min-w-0 flex-1 rounded-md px-4 py-3.5 text-[16px] outline-none ${
              dark ? "border border-white/15 bg-white/10 text-white placeholder:text-white/50 focus:border-white/40" : "bg-cloud text-ink placeholder:text-mute"
            }`}
          />
          <button type="submit" className={`btn ${dark ? "btn-light" : "btn-dark"}`}>
            Sign Up
          </button>
        </>
      )}
    </form>
  );
}
