import type { Metadata } from "next";
import { InsightsBrowser } from "@/components/insights/InsightsBrowser";
import { NewsletterForm } from "@/components/home/NewsletterForm";

export const metadata: Metadata = {
  title: "Insights",
  description: "Research notes, explainers and updates from Valtora Finance on tokenized assets and Robinhood Chain.",
};

export default function InsightsPage() {
  return (
    <div className="bg-night text-white">
      <section className="pt-36 pb-14 text-center md:pt-44">
        <h1 className="text-[44px] font-medium tracking-[-0.035em] md:text-[56px]">Explore Insights</h1>
      </section>
      <InsightsBrowser />
      <section className="relative mt-24 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-40" style={{ backgroundImage: "url(/art/hall.webp)" }} />
        <div className="absolute inset-0 bg-gradient-to-b from-night via-night/50 to-night" />
        <div className="wrap relative flex flex-col items-center py-28 text-center">
          <h2 className="text-[36px] font-medium tracking-[-0.03em] md:text-[44px]">Subscribe to Insights</h2>
          <p className="mt-3 text-[15px] text-white/70">Research and product notes, when there is something worth reading.</p>
          <NewsletterForm />
        </div>
      </section>
    </div>
  );
}
