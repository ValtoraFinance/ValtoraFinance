import type { Metadata } from "next";
import Link from "next/link";
import { Check, Minus, X as Cross, ArrowLeftRight, Clock, Link2, Wallet, Layers } from "lucide-react";
import { productByKey, ECOSYSTEM } from "@/data/site";
import { CHAIN } from "@/config/brand";
import { LaunchButton } from "@/components/wallet/WalletButton";
import { TypedWord } from "@/components/product/Interactive";
import { StockGrid, StockTicker } from "@/components/product/Equities";
import { ContactSection, FaqSection, Features, LatestDark } from "@/components/product/Sections";
import { DotGlobe } from "@/components/art/DotGlobe";
import { BarsRise } from "@/components/art/charts";
import { GlassStack } from "@/components/art/GlassStack";

const product = productByKey("equities");

export const metadata: Metadata = {
  title: product.name,
  description: product.summary,
};

const COMPARE: { feature: string; icon: typeof Clock; ours: "yes" | "part" | "no"; other: "yes" | "part" | "no"; broker: "yes" | "part" | "no" }[] = [
  { feature: "Open every day", icon: Clock, ours: "yes", other: "part", broker: "no" },
  { feature: "Wallet to wallet transfers", icon: ArrowLeftRight, ours: "yes", other: "yes", broker: "no" },
  { feature: "Usable in on-chain apps", icon: Link2, ours: "yes", other: "yes", broker: "no" },
  { feature: "Sign up with a wallet", icon: Wallet, ours: "yes", other: "part", broker: "no" },
  { feature: "Published reference holdings", icon: Layers, ours: "yes", other: "part", broker: "yes" },
];

function Mark({ v }: { v: "yes" | "part" | "no" }) {
  if (v === "yes") return <span className="mx-auto grid size-5 place-items-center rounded-full bg-up/15 text-up"><Check className="size-3" /></span>;
  if (v === "part") return <span className="mx-auto grid size-5 place-items-center rounded-full bg-white/10 text-white/60"><Minus className="size-3" /></span>;
  return <span className="mx-auto grid size-5 place-items-center text-down"><Cross className="size-4" /></span>;
}

export default function EquitiesPage() {
  const wallets = ECOSYSTEM.filter((e) => e.status === "Works today");
  return (
    <>
      {/* Hero */}
      <section className="bg-white pt-32 pb-16 text-center md:pt-40">
        <div className="wrap">
          <p className="text-[14px] font-medium">{product.name}</p>
          <span className="chip mt-2">{product.badge}</span>
          <h1 className="mx-auto mt-6 max-w-[760px] text-[40px] leading-[1.03] font-medium tracking-[-0.035em] md:text-[60px]">
            <span className="text-mute">{product.typedLead}</span>
            <br />
            <TypedWord words={product.typed} />
          </h1>
          <p className="mx-auto mt-6 max-w-[560px] font-serif text-[17px] leading-snug">{product.heroCopy}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <LaunchButton className="btn-dark px-3 py-2.5 text-[14px]" label={product.primaryCta} />
            <Link href="/docs" className="btn btn-ghost px-3 py-2.5 text-[14px]">
              {product.secondaryCta}
            </Link>
          </div>
        </div>
        <div className="wrap mt-16 text-left">
          <StockGrid />
        </div>
      </section>

      {/* Where it will live */}
      <section className="bg-black py-20 text-white md:py-28">
        <div className="wrap text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[12px]">
            <span className="size-1.5 rounded-full bg-up" /> Works with the wallets and tools you already use
          </span>
          <h2 className="mt-5 text-[36px] leading-[1.05] font-medium tracking-[-0.035em] md:text-[48px]">
            Share Exposure,
            <br />
            In the Wallet You Already Have
          </h2>
        </div>
        <div className="wrap mt-12 grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
          <div className="relative min-h-[300px] overflow-hidden rounded-[18px] bg-gradient-to-br from-plate via-[#241a5c] to-violet p-6">
            <div className="absolute -right-10 -bottom-16 w-[360px] opacity-80">
              <GlassStack accent="#6d4cf0" soft="#c9bcff" plates={6} shape="round" />
            </div>
            <p className="relative max-w-[260px] text-[22px] leading-tight font-medium">One address. Every planned asset. On {CHAIN.name}.</p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {wallets.map((w) => (
              <div key={w.name} className="flex min-h-[112px] flex-col justify-between rounded-[14px] bg-white/[0.06] p-4">
                <span className="grid size-9 place-items-center rounded-full bg-white/10 text-[13px] font-semibold">{w.name[0]}</span>
                <span className="text-[14px] font-medium">{w.name}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="wrap mt-6 text-center text-[12px] text-white/45">Compatibility only. These are not partners and do not endorse Valtora.</p>
      </section>

      {/* Three pillars */}
      <section className="bg-black pb-20 text-white md:pb-28">
        <div className="wrap grid grid-cols-1 gap-3 md:grid-cols-3">
          <div className="flex min-h-[420px] flex-col overflow-hidden rounded-[18px] bg-[#1e1242] p-6">
            <p className="text-[20px] leading-tight font-medium">Tokenized Shares.<br />Global Reach.</p>
            <p className="mt-3 text-[13px] leading-snug text-white/65">Designed so eligible holders anywhere can reach listed markets from a wallet, any day of the week.</p>
            <div className="mt-auto -mb-24 w-[110%]"><DotGlobe accent="#8b6cff" /></div>
          </div>
          <div className="flex min-h-[420px] flex-col rounded-[18px] bg-[#0f3a27] p-6">
            <p className="text-[20px] leading-tight font-medium">Market Depth.<br />Ledger Access.</p>
            <p className="mt-3 text-[13px] leading-snug text-white/65">Mint and redeem against the reference market, so token supply can follow demand.</p>
            <div className="mt-auto h-40"><BarsRise accent="#3ddc84" soft="#2b6e4c" count={24} /></div>
          </div>
          <div className="flex min-h-[420px] flex-col rounded-[18px] bg-[#16305f] p-6">
            <p className="text-[20px] leading-tight font-medium">Verified. Reported.<br />Enforced.</p>
            <p className="mt-3 text-[13px] leading-snug text-white/65">Reference holdings checked by an independent party and published on a schedule, planned before launch.</p>
            <div className="mt-auto grid place-items-center pt-6">
              <div className="grid size-40 place-items-center rounded-[28px] bg-[#2d58a8]/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.3)]">
                <div className="grid size-24 place-items-center rounded-[20px] bg-[#6f9be6]/70">
                  <div className="size-12 rounded-[12px] bg-[#c6daff]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="bg-black pb-20 text-white md:pb-28">
        <div className="wrap">
          <h2 className="text-center text-[30px] leading-tight font-medium tracking-[-0.03em] md:text-[40px]">
            The Reach of Public Markets. The Speed of a Ledger.
          </h2>
          <div className="mt-12 overflow-x-auto">
            <table className="w-full min-w-[640px] text-[14px]">
              <thead>
                <tr className="text-[12px] text-white/60">
                  <th className="py-3 text-left font-normal">Features</th>
                  <th className="w-[160px] rounded-t-xl border-x border-t border-white/20 py-3 font-medium text-white">Valtora Equities</th>
                  <th className="w-[160px] py-3 font-normal">Other token wrappers</th>
                  <th className="w-[160px] py-3 font-normal">Traditional brokers</th>
                </tr>
              </thead>
              <tbody>
                {COMPARE.map((row, i) => (
                  <tr key={row.feature}>
                    <td className="py-1.5 pr-4">
                      <span className="flex items-center gap-3 rounded-lg bg-white/[0.06] px-4 py-3">
                        <row.icon className="size-4 text-white/60" /> {row.feature}
                      </span>
                    </td>
                    <td className={`border-x border-white/20 ${i === COMPARE.length - 1 ? "rounded-b-xl border-b" : ""}`}>
                      <Mark v={row.ours} />
                    </td>
                    <td><Mark v={row.other} /></td>
                    <td><Mark v={row.broker} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-[12px] text-white/45">Design goals for Valtora Equities at launch, compared in general terms. Not a claim about any named company.</p>
        </div>
      </section>

      {/* Future of portfolios */}
      <section className="bg-white pb-20 md:pb-28">
        <StockTicker />
        <div className="wrap pt-20 text-center">
          <h2 className="text-[36px] leading-[1.05] font-medium tracking-[-0.035em] md:text-[48px]">The Next Portfolio Lives On-chain.</h2>
          <div className="mt-8">
            <LaunchButton className="btn-dark px-3 py-2.5 text-[14px]" label="Launch Valtora Equities" />
          </div>
        </div>
      </section>

      <Features product={product} title={["Built for", "Global Markets."]} />
      <ContactSection />
      <FaqSection items={product.faqs} />
      <LatestDark topic="Markets" />
    </>
  );
}
