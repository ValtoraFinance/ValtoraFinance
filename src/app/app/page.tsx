import type { Metadata } from "next";
import { Suspense } from "react";
import { CHAIN } from "@/config/brand";
import { AppConsole } from "@/components/app/AppConsole";

export const metadata: Metadata = {
  title: "App",
  description: `Connect a wallet on ${CHAIN.name} to mint, redeem, bridge and convert Valtora assets at launch.`,
};

export default function AppPage() {
  return (
    <div className="min-h-dvh bg-night text-white">
      <section className="wrap pt-32 pb-24 md:pt-40">
        <p className="text-[14px] text-white/55">Valtora App</p>
        <h1 className="mt-2 text-[36px] leading-tight font-medium tracking-[-0.03em] md:text-[48px]">Mint, redeem, bridge, convert.</h1>
        <p className="mt-3 max-w-[560px] font-serif text-[17px] text-white/65">
          The wallet connection works today. Product actions stay locked until contracts are deployed, audited and
          published; no transaction can be sent from here yet.
        </p>
        <div className="mt-10">
          <Suspense fallback={<div className="h-[520px] rounded-[22px] bg-white/[0.05]" />}>
            <AppConsole />
          </Suspense>
        </div>
      </section>
    </div>
  );
}
