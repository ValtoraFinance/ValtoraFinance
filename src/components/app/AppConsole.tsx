"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowDown, Lock, TriangleAlert } from "lucide-react";
import { BRAND, CHAIN, explorerAddress, shortAddress } from "@/config/brand";
import { useWallet } from "@/components/wallet/WalletProvider";
import { useWalletModal } from "@/components/wallet/WalletButton";

const TABS = [
  { key: "mint", label: "Mint", from: "USD stablecoin", to: "VYLD", note: "Mint VYLD against dollars once eligibility checks are live." },
  { key: "redeem", label: "Redeem", from: "VYLD", to: "USD stablecoin", note: "Redeem back to dollars, planned every day of the week." },
  { key: "bridge", label: "Bridge", from: `${CHAIN.name}`, to: "Another supported chain", note: "Move Valtora assets between chains once a bridge is chosen." },
  { key: "convert", label: "Convert", from: "VYLD (accruing)", to: "rVYLD (rebasing)", note: "Switch between accruing and rebasing units at the current rate." },
] as const;

type TabKey = (typeof TABS)[number]["key"];

export function AppConsole() {
  const { address, balance, chainId, onRobinhoodChain, switchNetwork, switching, walletName, disconnect } = useWallet();
  const { open } = useWalletModal();
  const param = useSearchParams().get("tab");
  const [picked, setTab] = useState<TabKey | null>(null);
  // A new ?tab= from a menu link wins over an earlier manual pick.
  const [lastParam, setLastParam] = useState(param);
  if (lastParam !== param) {
    setLastParam(param);
    setTab(null);
  }
  const tab: TabKey = picked ?? (TABS.some((x) => x.key === param) ? (param as TabKey) : "mint");

  const current = TABS.find((t) => t.key === tab)!;
  const wrong = address && chainId !== null && !onRobinhoodChain;

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)]">
      <div className="min-w-0 rounded-[22px] bg-white/[0.05] p-4 md:p-6">
        <div className="flex gap-1 overflow-x-auto rounded-lg bg-white/[0.06] p-1">
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => {
                setTab(t.key);
                window.history.replaceState(null, "", `/app?tab=${t.key}`);
              }}
              className={`flex-1 cursor-pointer rounded-md px-3 py-2 text-[14px] font-medium whitespace-nowrap transition-colors ${tab === t.key ? "bg-white text-ink" : "text-white/70 hover:text-white"}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="mt-6 space-y-2">
          <div className="rounded-xl bg-white/[0.06] p-4">
            <p className="text-[12px] text-white/55">From</p>
            <div className="mt-1 flex items-center justify-between gap-3">
              <input disabled placeholder="0.00" className="w-full min-w-0 bg-transparent font-mono text-[28px] text-white/40 outline-none" />
              <span className="shrink-0 rounded-full bg-white/10 px-3 py-1.5 text-[13px]">{current.from}</span>
            </div>
          </div>
          <div className="flex justify-center">
            <span className="grid size-8 place-items-center rounded-full bg-white/10">
              <ArrowDown className="size-4" />
            </span>
          </div>
          <div className="rounded-xl bg-white/[0.06] p-4">
            <p className="text-[12px] text-white/55">To</p>
            <div className="mt-1 flex items-center justify-between gap-3">
              <input disabled placeholder="0.00" className="w-full min-w-0 bg-transparent font-mono text-[28px] text-white/40 outline-none" />
              <span className="shrink-0 rounded-full bg-white/10 px-3 py-1.5 text-[13px]">{current.to}</span>
            </div>
          </div>
        </div>

        <p className="mt-4 text-[13px] text-white/60">{current.note}</p>

        {!address ? (
          <button type="button" onClick={open} className="btn btn-light mt-6 w-full py-4">
            Connect wallet
          </button>
        ) : wrong ? (
          <button type="button" onClick={switchNetwork} disabled={switching} className="btn btn-light mt-6 w-full py-4">
            {switching ? "Confirm in wallet…" : `Switch to ${CHAIN.name}`}
          </button>
        ) : (
          <button type="button" disabled className="btn mt-6 w-full bg-white/10 py-4 text-white">
            <Lock className="size-4" /> {current.label} opens at launch
          </button>
        )}
      </div>

      <aside className="min-w-0 rounded-[22px] bg-white/[0.05] p-5 md:p-6">
        <p className="text-[13px] text-white/55">Wallet</p>
        {address ? (
          <>
            <p className="mt-2 font-mono text-[15px] break-all">{address}</p>
            <p className="mt-1 text-[12px] text-white/50">{walletName}</p>
            <dl className="mt-5 divide-y divide-white/10 text-[14px]">
              <div className="flex justify-between py-3">
                <dt className="text-white/60">Network</dt>
                <dd className={wrong ? "text-[#ff9aa0]" : ""}>{chainId === null ? "reading…" : onRobinhoodChain ? CHAIN.name : `Chain ${chainId}`}</dd>
              </div>
              <div className="flex justify-between py-3">
                <dt className="text-white/60">{CHAIN.nativeSymbol} balance</dt>
                <dd className="font-mono">{balance ?? "…"}</dd>
              </div>
              <div className="flex justify-between py-3">
                <dt className="text-white/60">{BRAND.symbol}</dt>
                <dd className="font-mono text-white/60">at launch</dd>
              </div>
              <div className="flex justify-between py-3">
                <dt className="text-white/60">VYLD / VTSY</dt>
                <dd className="font-mono text-white/60">at launch</dd>
              </div>
            </dl>
            {wrong ? (
              <p className="mt-3 flex items-start gap-2 text-[13px] text-[#ff9aa0]">
                <TriangleAlert className="mt-0.5 size-4 shrink-0" /> Your wallet is on another network.
              </p>
            ) : null}
            <div className="mt-5 flex flex-wrap gap-2">
              <a href={explorerAddress(address)} target="_blank" rel="noreferrer" className="btn bg-white/10 px-3 py-2 text-[13px] text-white hover:bg-white/20">
                Explorer
              </a>
              <button type="button" onClick={disconnect} className="btn bg-white/10 px-3 py-2 text-[13px] text-[#ff9aa0] hover:bg-white/20">
                Disconnect {shortAddress(address, 4, 4)}
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="mt-2 text-[15px] text-white/70">No wallet connected.</p>
            <p className="mt-2 text-[13px] leading-relaxed text-white/50">
              Connecting only shares your address. The app reads your {CHAIN.nativeSymbol} balance on {CHAIN.name} from the
              public RPC and never asks for a signature.
            </p>
            <button type="button" onClick={open} className="btn btn-light mt-5 px-4 py-2.5 text-[14px]">
              Connect wallet
            </button>
          </>
        )}
      </aside>
    </div>
  );
}
