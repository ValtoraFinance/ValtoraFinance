import type { Metadata } from "next";
import { Blocks, Code2, LineChart, Wallet } from "lucide-react";
import { BRAND } from "@/config/brand";
import { Faq } from "@/components/product/Interactive";

export const metadata: Metadata = {
  title: "Builder Grants",
  description: "Support for teams building apps and tools around tokenized assets on Robinhood Chain.",
};

const TRACKS = [
  { icon: Wallet, title: "Wallets & access", body: "Onboarding, network setup and safety tooling that make custom networks painless." },
  { icon: LineChart, title: "Data & reporting", body: "Dashboards and feeds that make reserves and holdings easy to verify." },
  { icon: Blocks, title: "DeFi integrations", body: "Lending, liquidity and payments built to accept Valtora assets at launch." },
  { icon: Code2, title: "Open-source tools", body: "SDKs, indexers and test kits for Robinhood Chain developers." },
];

export default function GrantsPage() {
  return (
    <div className="bg-night text-white">
      <section className="wrap pt-36 pb-16 md:pt-44">
        <p className="text-[15px] text-white/60">Builder Grants</p>
        <h1 className="mt-3 max-w-[820px] text-[44px] leading-[1.02] font-medium tracking-[-0.035em] md:text-[56px]">
          Backing the Builders
          <br />
          <span className="text-white/50">of On-chain Markets.</span>
        </h1>
        <p className="mt-6 max-w-[580px] font-serif text-[18px] text-white/70">
          A planned programme for small teams whose work makes tokenized assets easier to use, check or build on.
          Applications open at launch; the size and form of support will be published with the call.
        </p>
      </section>
      <section className="wrap grid grid-cols-1 gap-3 pb-20 sm:grid-cols-2 lg:grid-cols-4">
        {TRACKS.map((t) => (
          <div key={t.title} className="flex min-h-[220px] flex-col rounded-[18px] bg-white/[0.06] p-6">
            <t.icon className="size-6 text-violet-soft" strokeWidth={1.5} />
            <p className="mt-auto pt-8 text-[17px] font-medium">{t.title}</p>
            <p className="mt-1.5 text-[14px] leading-snug text-white/65">{t.body}</p>
          </div>
        ))}
      </section>
      <section className="wrap grid grid-cols-1 gap-8 pb-24 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
        <div>
          <h2 className="text-[30px] font-medium tracking-[-0.02em]">Questions</h2>
          <a href={`mailto:${BRAND.email}?subject=Builder%20Grants`} className="btn btn-light mt-6 px-3 py-2.5 text-[14px]">
            Register interest
          </a>
        </div>
        <div className="min-w-0">
          <Faq
            dark
            items={[
              { q: "Is the programme open now?", a: "Not yet. You can register interest by email and we will write when the first call opens." },
              { q: `Are grants paid in ${BRAND.symbol}?`, a: "The form of support will be announced with the first call. Nothing is promised before then." },
              { q: "Who can apply?", a: "Teams and individuals building public tools or apps around tokenized assets on Robinhood Chain." },
            ]}
          />
        </div>
      </section>
    </div>
  );
}
