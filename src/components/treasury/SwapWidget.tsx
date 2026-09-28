"use client";

import { useEffect, useMemo, useState } from "react";
import { formatUnits, parseUnits, type Hex } from "viem";
import { ArrowDown, ArrowUpRight, Loader2, TriangleAlert } from "lucide-react";
import { CHAIN, explorerTx } from "@/config/brand";
import { DEFAULT_SLIPPAGE, MAX_ORACLE_GAP, SLIPPAGE_CHOICES, TOKENS } from "@/config/swap";
import { useWallet } from "@/components/wallet/WalletProvider";
import { useWalletModal } from "@/components/wallet/WalletButton";
import {
  SIDES,
  allowance as readAllowance,
  approveTx,
  balances as readBalances,
  bestQuote,
  oracle as readOracle,
  oracleGap,
  swapTx,
  waitForReceipt,
  type Oracle,
  type Quote,
  type Side,
} from "@/lib/swap";

const DECIMALS = { ETH: 18, USDG: TOKENS.USDG.decimals, SGOV: TOKENS.SGOV.decimals } as const;
const ICON = { ETH: "/eco/robinhood-chain.webp", USDG: "/eco/usdg.webp", SGOV: "/tiles/sgov.webp" } as const;
/** ETH kept back from "Max" so the swap itself can still pay gas. */
const GAS_RESERVE = parseUnits("0.0005", 18);

/** `id` ties a status to the flow that produced it; see `startFlow`. */
type Stage = ({ kind: "idle" } | { kind: "approving" | "swapping"; hash?: Hex } | { kind: "done"; hash: Hex } | { kind: "error"; message: string }) & { id?: number };

let flowSeq = 0;

function fmt(value: bigint, decimals: number, digits = 4) {
  const n = Number(formatUnits(value, decimals));
  return n.toLocaleString("en-US", { maximumFractionDigits: n >= 1000 ? 2 : digits });
}

function parseAmount(text: string, decimals: number): bigint | null {
  if (!/^\d*\.?\d*$/.test(text) || text === "" || text === ".") return null;
  try {
    const v = parseUnits(text, decimals);
    return v > 0n ? v : null;
  } catch {
    return null;
  }
}

export function SwapWidget() {
  const { address, onRobinhoodChain, switchNetwork, switching, sendTransaction } = useWallet();
  const { open } = useWalletModal();
  const [side, setSide] = useState<Side>("buy-usdg");
  const [text, setText] = useState("");
  const [slippage, setSlippage] = useState<number>(DEFAULT_SLIPPAGE);
  // Quotes are stored with the request they answer, so a stale one is never shown.
  const [result, setResult] = useState<{ key: string; quote: Quote | null } | null>(null);
  const [price, setPrice] = useState<Oracle | null>(null);
  const [held, setHeld] = useState<Record<"ETH" | "USDG" | "SGOV", bigint> | null>(null);
  const [approved, setApproved] = useState<bigint>(0n);
  /** Bumped after every confirmed transaction to re-read balances. */
  const [nonce, setNonce] = useState(0);
  const [ack, setAck] = useState(false);
  const [stage, setStage] = useState<Stage>({ kind: "idle" });

  /**
   * Starts a transaction flow. Its updates only apply while the status still
   * belongs to it, so switching tabs mid-flow drops a late result.
   */
  function startFlow(first: Stage) {
    const id = ++flowSeq;
    setStage({ ...first, id });
    return (next: Stage) => setStage((prev) => (prev.id === id ? { ...next, id } : prev));
  }

  const { from, to } = SIDES[side];
  const amountIn = useMemo(() => parseAmount(text, DECIMALS[from]), [text, from]);
  const owner = address as Hex | null;

  const key = amountIn ? `${side}:${amountIn}` : null;
  const quote = result && result.key === key ? result.quote : null;
  const quoting = key !== null && result?.key !== key;
  const noRoute = key !== null && result?.key === key && !result.quote;

  useEffect(() => {
    if (!owner) return;
    let cancelled = false;
    Promise.all([
      readBalances(owner).catch(() => null),
      from === "ETH" ? Promise.resolve(0n) : readAllowance(TOKENS[from].address as Hex, owner).catch(() => 0n),
    ]).then(([b, a]) => {
      if (cancelled) return;
      if (b) setHeld(b);
      setApproved(a);
    });
    return () => {
      cancelled = true;
    };
  }, [owner, from, nonce]);

  useEffect(() => {
    let cancelled = false;
    const load = () => readOracle().then((o) => !cancelled && setPrice(o)).catch(() => {});
    load();
    const t = window.setInterval(load, 30_000);
    return () => {
      cancelled = true;
      window.clearInterval(t);
    };
  }, []);

  // Debounced quote, refreshed every 15 seconds while an amount is entered.
  useEffect(() => {
    if (!amountIn || !key) return;
    let cancelled = false;
    const run = async () => {
      const q = await bestQuote(side, amountIn).catch(() => null);
      if (!cancelled) setResult({ key, quote: q });
    };
    const first = window.setTimeout(run, 350);
    const again = window.setInterval(run, 15_000);
    return () => {
      cancelled = true;
      window.clearTimeout(first);
      window.clearInterval(again);
    };
  }, [side, amountIn, key]);

  const gap = quote && price && amountIn ? oracleGap(side, amountIn, quote.amountOut, price) : null;
  const minOut = quote ? (quote.amountOut * BigInt(Math.round((1 - slippage) * 10_000))) / 10_000n : null;
  const balance = held ? held[from] : null;
  const needsApproval = from !== "ETH" && amountIn !== null && approved < amountIn;
  const busy = stage.kind === "approving" || stage.kind === "swapping";
  // Dollars per SGOV this quote works out to, for comparison with the oracle.
  let effective: number | null = null;
  if (quote && amountIn) {
    if (side === "sell") effective = Number(formatUnits(quote.amountOut, 6)) / Number(formatUnits(amountIn, 18));
    else if (from === "USDG") effective = Number(formatUnits(amountIn, 6)) / Number(formatUnits(quote.amountOut, 18));
    else if (price) effective = (Number(formatUnits(amountIn, 18)) * price.ethUsd) / Number(formatUnits(quote.amountOut, 18));
  }

  function setMax() {
    if (balance === null) return;
    const v = from === "ETH" ? (balance > GAS_RESERVE ? balance - GAS_RESERVE : 0n) : balance;
    setText(formatUnits(v, DECIMALS[from]));
  }

  async function approve() {
    if (!amountIn) return;
    const setStage = startFlow({ kind: "approving" });
    try {
      const hash = await sendTransaction(approveTx(TOKENS[from as "USDG" | "SGOV"].address as Hex, amountIn));
      setStage({ kind: "approving", hash });
      if (!(await waitForReceipt(hash))) throw new Error("The approval was reverted.");
      setNonce((n) => n + 1);
      setStage({ kind: "idle" });
    } catch (e) {
      setStage({ kind: "error", message: (e as Error).message });
    }
  }

  async function swap() {
    if (!amountIn || !quote || !minOut || !owner) return;
    const setStage = startFlow({ kind: "swapping" });
    try {
      // Re-quote right before sending so the minimum is never based on a stale price.
      const fresh = await bestQuote(side, amountIn);
      if (!fresh) throw new Error("No route is available right now.");
      const freshMin = (fresh.amountOut * BigInt(Math.round((1 - slippage) * 10_000))) / 10_000n;
      const hash = await sendTransaction(swapTx(side, fresh, amountIn, freshMin, owner));
      setStage({ kind: "swapping", hash });
      if (!(await waitForReceipt(hash))) throw new Error("The swap was reverted, usually because the price moved past your slippage limit. Nothing was spent except gas.");
      setStage({ kind: "done", hash });
      setText("");
      setNonce((n) => n + 1);
    } catch (e) {
      setStage({ kind: "error", message: (e as Error).message });
    }
  }

  let action: { label: string; onClick?: () => void; disabled?: boolean };
  if (!address) action = { label: "Connect wallet", onClick: open };
  else if (!onRobinhoodChain) action = { label: switching ? "Confirm in wallet…" : `Switch to ${CHAIN.name}`, onClick: switchNetwork, disabled: switching };
  else if (!amountIn) action = { label: "Enter an amount", disabled: true };
  else if (balance !== null && amountIn > balance) action = { label: `Not enough ${from}`, disabled: true };
  else if (quoting && !quote) action = { label: "Finding the best route…", disabled: true };
  else if (noRoute || !quote) action = { label: "No route for this amount", disabled: true };
  else if (gap !== null && gap > MAX_ORACLE_GAP) action = { label: `Price is ${(gap * 100).toFixed(2)}% worse than the oracle`, disabled: true };
  else if (!ack) action = { label: "Confirm the notice above", disabled: true };
  else if (needsApproval) action = { label: stage.kind === "approving" ? "Approving…" : `Approve ${from} (step 1 of 2)`, onClick: approve, disabled: busy };
  else action = { label: stage.kind === "swapping" ? "Swapping…" : from === "ETH" ? "Swap" : "Swap (step 2 of 2)", onClick: swap, disabled: busy };

  return (
    <div className="rounded-[18px] bg-white p-4 text-ink md:p-5">
      <div className="flex flex-wrap gap-1.5">
        {(Object.keys(SIDES) as Side[]).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => {
              setSide(s);
              setText("");
              setStage({ kind: "idle" });
            }}
            className={`rounded-full px-3 py-1.5 text-[13px] font-medium transition-colors ${side === s ? "bg-ink text-white" : "bg-mist text-ink/70 hover:bg-cloud"}`}
          >
            {SIDES[s].label}
          </button>
        ))}
      </div>

      <div className="mt-4 rounded-[14px] bg-mist p-4">
        <div className="flex items-center justify-between text-[12px] text-mute">
          <span>You pay</span>
          {balance !== null ? (
            <button type="button" onClick={setMax} className="hover:text-ink">
              Balance {fmt(balance, DECIMALS[from])} · Max
            </button>
          ) : null}
        </div>
        <div className="mt-2 flex items-center gap-3">
          <input
            inputMode="decimal"
            value={text}
            onChange={(e) => setText(e.target.value.replace(",", "."))}
            placeholder="0.0"
            aria-label={`Amount of ${from}`}
            className="w-full min-w-0 bg-transparent font-mono text-[28px] tabular-nums outline-none placeholder:text-soft"
          />
          <span className="flex shrink-0 items-center gap-2 rounded-full bg-white px-2.5 py-1.5 text-[14px] font-medium">
            <img src={ICON[from]} alt="" className="size-5 rounded-full" /> {from}
          </span>
        </div>
      </div>

      <div className="-my-2 flex justify-center">
        <span className="z-10 grid size-8 place-items-center rounded-full border-4 border-white bg-mist">
          <ArrowDown className="size-4" />
        </span>
      </div>

      <div className="rounded-[14px] bg-mist p-4">
        <div className="text-[12px] text-mute">You receive (estimated)</div>
        <div className="mt-2 flex items-center gap-3">
          <p className="w-full min-w-0 truncate font-mono text-[28px] tabular-nums">
            {quote ? fmt(quote.amountOut, DECIMALS[to]) : quoting ? <Loader2 className="size-5 animate-spin text-mute" /> : <span className="text-soft">0.0</span>}
          </p>
          <span className="flex shrink-0 items-center gap-2 rounded-full bg-white px-2.5 py-1.5 text-[14px] font-medium">
            <img src={ICON[to]} alt="" className="size-5 rounded-full" /> {to}
          </span>
        </div>
      </div>

      <dl className="mt-4 space-y-1.5 text-[13px]">
        <div className="flex justify-between gap-4">
          <dt className="text-mute">Price per SGOV</dt>
          <dd className="font-mono tabular-nums">{effective ? `$${effective.toFixed(3)}` : "—"}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-mute">Chainlink SGOV price</dt>
          <dd className="font-mono tabular-nums">{price ? `$${price.sgovUsd.toFixed(3)}` : "—"}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-mute">Versus oracle</dt>
          <dd className={`font-mono tabular-nums ${gap !== null && gap > MAX_ORACLE_GAP ? "text-down" : gap !== null && gap < 0 ? "text-up" : ""}`}>
            {gap === null ? "—" : gap > 0 ? `${(gap * 100).toFixed(2)}% worse` : `${(-gap * 100).toFixed(2)}% better`}
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-mute">Minimum received</dt>
          <dd className="font-mono tabular-nums">{minOut !== null ? `${fmt(minOut, DECIMALS[to])} ${to}` : "—"}</dd>
        </div>
        <div className="flex items-center justify-between gap-4">
          <dt className="text-mute">Slippage limit</dt>
          <dd className="flex gap-1">
            {SLIPPAGE_CHOICES.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSlippage(s)}
                className={`rounded-md px-2 py-0.5 font-mono text-[12px] ${slippage === s ? "bg-ink text-white" : "bg-mist text-ink/70 hover:bg-cloud"}`}
              >
                {(s * 100).toFixed(1)}%
              </button>
            ))}
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-mute">Route</dt>
          <dd className="text-right text-[12px]">{quote ? quote.route.label : "—"}</dd>
        </div>
      </dl>

      <label className="mt-4 flex cursor-pointer items-start gap-2.5 rounded-[12px] bg-mist p-3 text-[12px] leading-snug text-ink/75">
        <input type="checkbox" checked={ack} onChange={(e) => setAck(e.target.checked)} className="mt-0.5 size-4 shrink-0 accent-[var(--color-violet)]" />
        <span>
          I understand SGOV is a Robinhood stock token, not a Valtora product. Robinhood can pause or freeze it, it is only available in
          supported jurisdictions, and its price can fall.
        </span>
      </label>

      <button
        type="button"
        onClick={action.onClick}
        disabled={action.disabled || !action.onClick}
        className="btn btn-dark mt-3 w-full py-3.5 text-[15px]"
      >
        {busy ? <Loader2 className="size-4 animate-spin" /> : null}
        {action.label}
      </button>

      {stage.kind === "approving" || stage.kind === "swapping" ? (
        <p className="mt-3 text-[12px] text-mute">
          {stage.hash ? (
            <>
              Waiting for confirmation ·{" "}
              <a href={explorerTx(stage.hash)} target="_blank" rel="noreferrer" className="underline">
                view transaction
              </a>
            </>
          ) : (
            "Confirm in your wallet."
          )}
        </p>
      ) : null}
      {stage.kind === "done" ? (
        <p className="mt-3 flex items-center gap-1 text-[13px] text-jade">
          Swap confirmed.{" "}
          <a href={explorerTx(stage.hash)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-0.5 underline">
            View transaction <ArrowUpRight className="size-3" />
          </a>
        </p>
      ) : null}
      {stage.kind === "error" ? (
        <p className="mt-3 flex items-start gap-2 rounded-lg bg-down/10 px-3 py-2.5 text-[12px] leading-relaxed text-down">
          <TriangleAlert className="mt-0.5 size-3.5 shrink-0" />
          <span>{stage.message}</span>
        </p>
      ) : null}

      <p className="mt-3 text-[11px] leading-snug text-mute">
        Swaps go straight to Uniswap&apos;s router on {CHAIN.name}. Valtora adds no fee and never holds your funds. Approvals are for the
        exact amount only.
      </p>
    </div>
  );
}
