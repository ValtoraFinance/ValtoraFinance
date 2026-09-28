import type { Metadata } from "next";
import { Directory } from "@/components/ecosystem/Directory";

export const metadata: Metadata = {
  title: "Ecosystem",
  description: "The protocols, tools and wallets Valtora Finance builds on, all already live on Robinhood Chain.",
};

export default function EcosystemPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-[#140c33] pt-36 text-white md:pt-44">
        <div className="wrap text-center">
          <h1 className="text-[44px] font-medium tracking-[-0.035em] md:text-[56px]">Valtora Ecosystem</h1>
          <p className="mx-auto mt-5 max-w-[560px] text-[15px] leading-relaxed text-white/75">
            Valtora builds on protocols that are already live and audited on Robinhood Chain, instead of rebuilding them.
            Here is every one the site and the roadmap depend on.
          </p>
        </div>
        <div className="mt-24 grid grid-cols-4 gap-2 px-2 pb-2 md:grid-cols-8 md:gap-3 md:px-3 md:pb-3">
          {Array.from({ length: 24 }, (_, i) => {
            const row = Math.floor(i / 8);
            return (
              <div
                key={i}
                className={`h-10 rounded-[8px] md:h-14 ${i >= 16 ? "" : i >= 8 ? "hidden md:block" : "hidden md:block"}`}
                style={{ background: ["#3a2a8a", "#5a43c9", "#8b74ff"][row], opacity: 0.9 }}
              />
            );
          })}
        </div>
      </section>
      <section className="bg-white py-16 md:py-24">
        <div className="wrap">
          <Directory />
        </div>
      </section>
    </>
  );
}
