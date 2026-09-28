"use client";

import { useState } from "react";
import { AlertTriangle, BadgeCheck, CircleHelp, Loader2 } from "lucide-react";
import type { Verdict } from "@/lib/onchain";

/* Paste any address and the server checks it against Robinhood's stock token
   beacon. The verdict is read from the chain, not from a list we maintain. */

function Result({ verdict }: { verdict: Verdict }) {
  switch (verdict.kind) {
    case "official":
      return (
        <div className="flex items-start gap-3 rounded-[12px] bg-jade-soft/40 p-4 text-[14px]">
          <BadgeCheck className="mt-0.5 size-5 shrink-0 text-jade" />
          <p>
            <b>Official Robinhood stock token.</b> {verdict.symbol} · {verdict.name}. The contract proxies to Robinhood&apos;s token
            beacon.{verdict.listed ? " It is listed in the terminal above." : " It has no Chainlink feed yet, so the terminal does not list it."}
          </p>
        </div>
      );
    case "lookalike":
      return (
        <div className="flex items-start gap-3 rounded-[12px] bg-down/10 p-4 text-[14px]">
          <AlertTriangle className="mt-0.5 size-5 shrink-0 text-down" />
          <p>
            <b>Not the official token.</b> It calls itself {verdict.symbol ?? "a stock"}
            {verdict.name ? ` (“${verdict.name}”)` : ""}, but it does not use Robinhood&apos;s token contract.
            {verdict.official ? ` The official ${verdict.official.symbol} is ${verdict.official.address}.` : ""}
          </p>
        </div>
      );
    case "other":
      return (
        <div className="flex items-start gap-3 rounded-[12px] bg-mist p-4 text-[14px]">
          <CircleHelp className="mt-0.5 size-5 shrink-0 text-mute" />
          <p>
            <b>Not a stock token.</b> This contract{verdict.symbol ? ` (${verdict.symbol})` : ""} is not issued through Robinhood&apos;s
            stock token contract. That alone says nothing good or bad about it.
          </p>
        </div>
      );
    case "not-contract":
      return <p className="rounded-[12px] bg-mist p-4 text-[14px]">That address has no contract code. It is a wallet, not a token.</p>;
    case "invalid":
      return <p className="rounded-[12px] bg-mist p-4 text-[14px]">Enter a full address: 0x followed by 40 hex characters.</p>;
    case "error":
      return <p className="rounded-[12px] bg-mist p-4 text-[14px]">The chain could not be reached just now. Try again in a moment.</p>;
  }
}

export function VerifyToken() {
  const [address, setAddress] = useState("");
  const [busy, setBusy] = useState(false);
  const [verdict, setVerdict] = useState<Verdict | null>(null);

  async function check(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setVerdict(null);
    try {
      const res = await fetch(`/api/verify?address=${encodeURIComponent(address.trim())}`);
      setVerdict((await res.json()) as Verdict);
    } catch {
      setVerdict({ kind: "error" });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <form onSubmit={check} className="flex flex-col gap-2 sm:flex-row">
        <input
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="0x… token address"
          spellCheck={false}
          className="w-full min-w-0 rounded-[10px] bg-mist px-3 py-3 font-mono text-[14px] outline-none placeholder:font-sans placeholder:text-soft"
        />
        <button type="submit" disabled={busy || !address.trim()} className="btn btn-dark shrink-0 px-5 py-3 text-[15px]">
          {busy ? <Loader2 className="size-4 animate-spin" /> : null} Check token
        </button>
      </form>
      <div className="mt-3 min-h-[20px]">{verdict ? <Result verdict={verdict} /> : null}</div>
    </div>
  );
}
