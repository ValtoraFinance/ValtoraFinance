import type { Metadata } from "next";
import Link from "next/link";
import { BRAND } from "@/config/brand";
import { XIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Contact",
  description: `${BRAND.name} speaks through one channel: ${BRAND.xHandle} on X.`,
};

export default function ContactPage() {
  return (
    <section className="bg-white pt-32 pb-24 md:pt-44">
      <div className="wrap grid grid-cols-1 gap-12 lg:grid-cols-2">
        <div>
          <h1 className="text-[48px] leading-none font-medium tracking-[-0.04em] md:text-[60px]">One channel.</h1>
          <div className="mt-8 max-w-[460px] space-y-5 font-serif text-[17px] leading-snug text-ink/70">
            <p>
              {BRAND.name} is run by an anonymous team. We speak through {BRAND.xHandle} on X and nowhere else, so there is only one account
              to check when something claims to be us.
            </p>
            <p>
              Questions, integration ideas and press requests are welcome there by direct message. Security reports follow the process on
              the <Link href="/trust#bounty" className="underline underline-offset-4">Trust & Security</Link> page.
            </p>
            <p>We never message first, never offer private sales and never ask for a seed phrase or for funds.</p>
          </div>
        </div>
        <div className="flex flex-col justify-center rounded-[20px] bg-night p-8 text-white md:p-10">
          <XIcon className="size-8" />
          <p className="mt-6 text-[32px] font-medium tracking-[-0.03em]">{BRAND.xHandle}</p>
          <p className="mt-2 font-serif text-[17px] text-white/70">Announcements, milestone updates and replies.</p>
          <a href={BRAND.x} target="_blank" rel="noreferrer" className="btn btn-light mt-8 self-start px-4 py-3 text-[15px]">
            Open on X
          </a>
        </div>
      </div>
    </section>
  );
}
