import type { Metadata } from "next";
import { ArrowUpRight, ShieldAlert } from "lucide-react";
import { BRAND, CHAIN, TOKEN } from "@/config/brand";
import { CopyCaBlock } from "@/components/CopyCa";
import { TokenLive } from "@/components/token/TokenLive";
import { LaunchButton } from "@/components/wallet/WalletButton";
import { XIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: `${BRAND.symbol} Token`,
  description: `${BRAND.symbol} is the project token of ${BRAND.name} on ${CHAIN.name}. Verify the contract address here.`,
};

export default function TokenPage() {
  return (
    <div className="bg-night text-white">
      <section className="wrap grid grid-cols-1 gap-12 pt-36 pb-20 md:pt-44 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <img src="/brand/valtora-plate.webp" alt="" className="size-12 rounded-xl" />
            <div>
              <p className="text-[18px] font-medium">{BRAND.symbol}</p>
              <p className="text-[13px] text-white/55">{BRAND.name} · {CHAIN.name}</p>
            </div>
          </div>
          <h1 className="mt-8 text-[44px] leading-[1.02] font-medium tracking-[-0.035em] md:text-[60px]">
            {BRAND.slogan.replace(/\.$/, "")}
            <span className="text-white/50">.</span>
          </h1>
          <p className="mt-6 max-w-[560px] font-serif text-[18px] leading-snug text-white/75">
            {BRAND.symbol} is the project token of {BRAND.name}. It lives on {CHAIN.name}, an Ethereum-compatible network.
            It is a crypto token: not a share, not a bond and not a claim on any asset described on this site.
          </p>
          <div className="mt-8 max-w-[560px]">
            <CopyCaBlock tone="dark" />
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <LaunchButton className="btn-light px-4 py-3 text-[15px]" label="Connect wallet" />
            {TOKEN.explorerUrl ? (
              <a href={TOKEN.explorerUrl} target="_blank" rel="noreferrer" className="btn bg-white/10 px-4 py-3 text-[15px] text-white hover:bg-white/20">
                View on explorer <ArrowUpRight className="size-4" />
              </a>
            ) : (
              <span className="btn cursor-default bg-white/10 px-4 py-3 text-[15px] text-white/60">Explorer link at launch</span>
            )}
            <a href={BRAND.x} target="_blank" rel="noreferrer" className="btn bg-white/10 px-4 py-3 text-[15px] text-white hover:bg-white/20">
              <XIcon /> {BRAND.xHandle}
            </a>
          </div>
        </div>
        <div className="min-w-0">
          <TokenLive />
        </div>
      </section>

      <section className="border-t border-white/10">
        <div className="wrap grid grid-cols-1 gap-3 py-20 md:grid-cols-3">
          {[
            { h: "1. Compare the full address", p: "Names and tickers can be copied by anyone. Match every character of the contract address against the one in this site's header." },
            { h: "2. Use the right network", p: `${CHAIN.name} has chain id ${CHAIN.id}. Launch App on this site asks your wallet to add or switch to it for you.` },
            { h: "3. Ignore direct messages", p: "Contributors never message first, never ask for a seed phrase and never ask you to send funds to an address." },
          ].map((s) => (
            <div key={s.h} className="rounded-[18px] bg-white/[0.05] p-6">
              <p className="text-[17px] font-medium">{s.h}</p>
              <p className="mt-2 font-serif text-[16px] leading-snug text-white/70">{s.p}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="wrap pb-24">
        <div className="flex items-start gap-3 rounded-[18px] border border-white/15 p-6 text-[14px] leading-relaxed text-white/70">
          <ShieldAlert className="mt-0.5 size-5 shrink-0 text-ember" />
          <p>
            Crypto tokens are volatile and can lose all of their value. Nothing on this page is investment advice or an
            offer to buy or sell. Check the rules where you live before you take part.
          </p>
        </div>
      </section>
    </div>
  );
}
