import type { Metadata } from "next";
import { BRAND } from "@/config/brand";
import { ContactForm } from "@/components/product/Interactive";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Questions, partnerships and press enquiries for Valtora Finance.",
};

export default function ContactPage() {
  return (
    <section className="bg-white pt-32 pb-24 md:pt-44">
      <div className="wrap grid grid-cols-1 gap-12 lg:grid-cols-2">
        <div>
          <h1 className="text-[48px] leading-none font-medium tracking-[-0.04em] md:text-[60px]">Contact us.</h1>
          <div className="mt-8 max-w-[460px] space-y-5 font-serif text-[17px] leading-snug text-ink/70">
            <p>Curious about one of our planned products, or have a question about {BRAND.symbol}? Send a message and a contributor will reply.</p>
            <p>
              Use the form, or email{" "}
              <a className="underline" href={`mailto:${BRAND.email}`}>
                {BRAND.email}
              </a>{" "}
              directly.
            </p>
            <p>
              For news, follow{" "}
              <a className="underline" href={BRAND.x} target="_blank" rel="noreferrer">
                {BRAND.xHandle}
              </a>{" "}
              on X. We never message first asking for funds or keys.
            </p>
          </div>
        </div>
        <ContactForm />
      </div>
    </section>
  );
}
