"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import {
  Check,
  ChevronUp,
  Copy,
  ExternalLink,
  LogOut,
  TriangleAlert,
  Wallet,
  X,
} from "lucide-react";
import { BRAND, CHAIN as chain, explorerAddress, shortAddress } from "@/config/brand";
import { useWallet } from "@/components/wallet/WalletProvider";

/* ------------------------------------------------------------------ */
/* One dialog for the whole site. Every "Launch App" / "Connect" button */
/* opens it through this context instead of owning a copy of it.        */
/* ------------------------------------------------------------------ */

const ModalContext = createContext<{ open: () => void } | null>(null);

export function WalletModalProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const value = useCallback(() => setOpen(true), []);
  return (
    <ModalContext.Provider value={{ open: value }}>
      {children}
      {open ? <WalletDialog onClose={() => setOpen(false)} /> : null}
    </ModalContext.Provider>
  );
}

export function useWalletModal() {
  const context = useContext(ModalContext);
  if (!context) throw new Error("useWalletModal must be used inside WalletModalProvider");
  return context;
}

function WalletDialog({ onClose }: { onClose: () => void }) {
  const { wallets, connect, connecting, error, clearError } = useWallet();

  const close = useCallback(() => {
    onClose();
    clearError();
  }, [onClose, clearError]);

  useEffect(() => {
    // Late-loading extensions announce on request, so ask again on open.
    window.dispatchEvent(new Event("eip6963:requestProvider"));
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [close]);

  // The header blurs what is behind it, and a backdrop filter turns it into
  // the containing block for fixed children. Rendered in place, the dialog
  // would be clipped to the header, so it always goes to <body>.
  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="wallet-dialog-title"
      className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center sm:p-4"
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={close} />
      <div className="relative w-full max-w-sm overflow-hidden rounded-t-2xl bg-ink text-white shadow-2xl sm:rounded-2xl">
        <div className="flex items-center justify-between px-5 pt-5">
          <div className="flex items-center gap-2.5">
            <img src="/brand/valtora-plate.webp" alt="" className="size-7 rounded-md" />
            <h2 id="wallet-dialog-title" className="text-lg font-medium tracking-tight">
              Launch App
            </h2>
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={close}
            className="cursor-pointer rounded-md p-1.5 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X className="size-4" />
          </button>
        </div>

        <p className="px-5 pt-3 font-serif text-[15px] leading-relaxed text-white/65">
          Connect a wallet to open the {BRAND.short} app on {chain.name}. Connecting
          only shares your address. It never asks for a signature, and your keys
          stay in your wallet.
        </p>

        <ul className="flex flex-col gap-2 p-4">
          {wallets.length === 0 ? (
            <li className="rounded-xl border border-dashed border-white/15 px-4 py-6 text-center text-sm leading-relaxed text-white/60">
              <span className="mb-1.5 block font-medium text-white">No wallet detected</span>
              No browser wallet announced itself. Install or unlock one, such as
              MetaMask or Rabby, then open this panel again.
            </li>
          ) : null}
          {wallets.map((wallet) => (
            <li key={wallet.rdns}>
              <button
                type="button"
                disabled={connecting || Boolean(wallet.unsupported)}
                onClick={async () => {
                  if (await connect(wallet)) onClose();
                }}
                className="flex w-full cursor-pointer items-center gap-3 rounded-xl bg-white/[0.06] px-3.5 py-3 text-left text-[15px] transition-colors enabled:hover:bg-white/[0.12] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {wallet.icon ? (
                  <img src={wallet.icon} alt="" className="size-7 rounded-md" />
                ) : (
                  <Wallet className="size-7 rounded-md bg-white/10 p-1.5" />
                )}
                <span className="min-w-0 flex-1">
                  <span className="block font-medium">{wallet.name}</span>
                  {wallet.unsupported ? (
                    <span className="block text-xs text-white/50">
                      Not supported · {wallet.unsupported}
                    </span>
                  ) : null}
                </span>
                {connecting ? <span className="text-xs text-white/50">Check wallet…</span> : null}
              </button>
            </li>
          ))}
        </ul>

        {error ? (
          <p className="mx-4 mb-3 flex items-start gap-2 rounded-lg bg-down/15 px-3 py-2.5 text-[13px] leading-relaxed text-[#ff9aa0]">
            <TriangleAlert className="mt-0.5 size-3.5 shrink-0" />
            <span>{error}</span>
          </p>
        ) : null}

        <p className="border-t border-white/10 px-5 py-3.5 font-mono text-[11px] text-white/45">
          {chain.name} · chain id {chain.id}
        </p>
      </div>
    </div>,
    document.body,
  );
}

/* ------------------------------------------------------------------ */
/* Navbar control                                                      */
/* ------------------------------------------------------------------ */

export function NavWallet({ compact = false }: { compact?: boolean }) {
  const { address } = useWallet();
  const { open } = useWalletModal();
  if (address) return <AccountMenu compact={compact} />;
  return (
    <button
      type="button"
      onClick={open}
      className={`btn btn-light ${compact ? "px-3 py-2.5 text-[14px]" : "px-3 py-2.5 text-[15px]"}`}
    >
      Launch App
    </button>
  );
}

function AccountMenu({ compact }: { compact: boolean }) {
  const {
    address,
    walletName,
    chainId,
    balance,
    onRobinhoodChain,
    switchNetwork,
    switching,
    disconnect,
    error,
  } = useWallet();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [place, setPlace] = useState<{ top: number; left: number } | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const menu = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const WIDTH = 280;
    const position = () => {
      const rect = root.current?.getBoundingClientRect();
      if (!rect) return;
      const left = Math.max(8, Math.min(rect.right - WIDTH, window.innerWidth - WIDTH - 8));
      setPlace({ top: rect.bottom + 8, left });
    };
    position();
    const onPointer = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!root.current?.contains(target) && !menu.current?.contains(target)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    window.addEventListener("keydown", onKey);
    window.addEventListener("scroll", position, true);
    window.addEventListener("resize", position);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", position, true);
      window.removeEventListener("resize", position);
    };
  }, [open]);

  if (!address) return null;
  const wrongNetwork = chainId !== null && !onRobinhoodChain;

  return (
    <div ref={root} className="flex items-center gap-2">
      {/* On narrow bars the red dot on the address chip carries this state. */}
      {wrongNetwork && !compact ? (
        <button
          type="button"
          onClick={switchNetwork}
          disabled={switching}
          title={`Wallet is on chain ${chainId}. Switch to ${chain.name}.`}
          className="flex h-9 cursor-pointer items-center gap-1.5 rounded-md bg-down/20 px-2.5 whitespace-nowrap text-[13px] font-medium text-[#ff9aa0] transition-colors hover:bg-down/30 disabled:opacity-60"
        >
          <TriangleAlert className="size-3.5" />
          {switching ? "Confirm…" : "Network"}
        </button>
      ) : null}
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="flex h-9 cursor-pointer items-center gap-2 rounded-md bg-white/95 px-3 text-[14px] font-medium whitespace-nowrap text-ink ring-1 ring-ink/10 transition-colors hover:bg-white"
      >
        <span className={`size-1.5 rounded-full ${onRobinhoodChain ? "bg-up" : "bg-down"}`} />
        <span className="font-mono text-[12px]">{shortAddress(address, compact ? 4 : 5, 4)}</span>
        <ChevronUp className="size-3 rotate-180 text-mute" />
      </button>

      {open && place
        ? createPortal(
            <div
              ref={menu}
              role="menu"
              style={{ position: "fixed", top: place.top, left: place.left }}
              className="z-[80] w-[280px] overflow-hidden rounded-xl bg-ink text-white shadow-2xl"
            >
              <div className="border-b border-white/10 px-4 py-3.5">
                <p className="text-xs text-white/50">{walletName ?? "Wallet"}</p>
                <p className="mt-1 font-mono text-[13px]">{shortAddress(address, 10, 8)}</p>
                <p className="mt-2 text-xl font-medium tracking-tight">
                  {balance === null ? "…" : `${balance} ${chain.nativeSymbol}`}
                </p>
                <p className={`mt-1 text-xs ${wrongNetwork ? "text-[#ff9aa0]" : "text-white/50"}`}>
                  {chainId === null
                    ? "Reading network…"
                    : onRobinhoodChain
                      ? `On ${chain.name}`
                      : `On chain ${chainId}, not ${chain.name}`}
                </p>
              </div>

              {wrongNetwork ? (
                <div className="border-b border-white/10 p-2">
                  <button
                    type="button"
                    role="menuitem"
                    disabled={switching}
                    onClick={switchNetwork}
                    className="btn btn-light w-full py-2.5 text-[14px]"
                  >
                    {switching ? "Confirm in wallet…" : `Switch to ${chain.name}`}
                  </button>
                  {error ? <p className="mt-2 px-1 text-xs leading-relaxed text-[#ff9aa0]">{error}</p> : null}
                </div>
              ) : null}

              <div className="flex flex-col p-1.5 text-[14px]">
                <a
                  role="menuitem"
                  href="/app"
                  className="flex items-center gap-2.5 rounded-md px-2.5 py-2 text-white/75 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <Wallet className="size-4" />
                  Open app
                </a>
                <button
                  type="button"
                  role="menuitem"
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(address);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 1400);
                    } catch {
                      // Clipboard refused; the address above stays readable.
                    }
                  }}
                  className="flex cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-white/75 transition-colors hover:bg-white/10 hover:text-white"
                >
                  {copied ? <Check className="size-4 text-up" /> : <Copy className="size-4" />}
                  {copied ? "Copied" : "Copy address"}
                </button>
                <a
                  role="menuitem"
                  href={explorerAddress(address)}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2.5 rounded-md px-2.5 py-2 text-white/75 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <ExternalLink className="size-4" />
                  View on explorer
                </a>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setOpen(false);
                    disconnect();
                  }}
                  className="flex cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-[#ff9aa0] transition-colors hover:bg-down/15"
                >
                  <LogOut className="size-4" />
                  Disconnect
                </button>
              </div>
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* In-page call to action: connect, switch network, or open the app.    */
/* ------------------------------------------------------------------ */

export function LaunchButton({
  className = "btn-dark",
  label = "Launch App",
}: {
  className?: string;
  label?: string;
}) {
  const { address, onRobinhoodChain, chainId, switchNetwork, switching } = useWallet();
  const { open } = useWalletModal();

  if (address && chainId !== null && !onRobinhoodChain) {
    return (
      <button type="button" onClick={switchNetwork} disabled={switching} className={`btn ${className}`}>
        {switching ? "Confirm in wallet…" : `Switch to ${chain.name}`}
      </button>
    );
  }
  if (address) {
    return (
      <a href="/app" className={`btn ${className}`}>
        Open app · <span className="font-mono text-[0.85em]">{shortAddress(address, 4, 4)}</span>
      </a>
    );
  }
  return (
    <button type="button" onClick={open} className={`btn ${className}`}>
      {label}
    </button>
  );
}
