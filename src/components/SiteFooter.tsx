import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { BRAND, CHAIN } from "@/config/brand";
import { FOOTER_COLUMNS } from "@/data/site";
import { CopyCaBlock } from "@/components/CopyCa";
import { GithubIcon, XIcon } from "@/components/icons";

export function SiteFooter() {
  return (
    <footer className="bg-night text-white">
      <div className="wrap pt-16 md:pt-20">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_minmax(0,460px)]">
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4 sm:gap-x-16 lg:max-w-[640px]">
            {FOOTER_COLUMNS.map((col) => (
              <div key={col.title}>
                <p className="mb-3 text-[15px] font-medium">{col.title}</p>
                <ul className="flex flex-col gap-1.5">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        {...(link.external ? { target: "_blank", rel: "noreferrer" } : {})}
                        className="inline-flex items-center gap-1 text-[15px] text-white/60 transition-colors hover:text-white"
                      >
                        {link.label}
                        {link.external ? <ArrowUpRight className="size-3.5" /> : null}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="min-w-0">
            <CopyCaBlock tone="dark" />
            <div className="mt-4 flex flex-wrap gap-2 text-[13px]">
              <a
                href={CHAIN.explorer}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 rounded-md bg-white/[0.07] px-3 py-2 text-white/70 hover:text-white"
              >
                {CHAIN.name} explorer <ArrowUpRight className="size-3.5" />
              </a>
              <Link href="/token" className="inline-flex items-center gap-1 rounded-md bg-white/[0.07] px-3 py-2 text-white/70 hover:text-white">
                Token details
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 border-t border-white/10 pt-8 text-[12.5px] leading-relaxed text-white/45 lg:grid-cols-2 lg:gap-20">
          <p>
            <span className="text-white/70">Important:</span> {BRAND.symbol} is a crypto token on {CHAIN.name}. It is not a
            share, a bond, a deposit or a unit in any fund, and it gives no claim on the assets described on this site.
            Market data on this site is read from public sources and can be delayed or wrong. Products marked as roadmap
            milestones do not exist yet and take no deposits.
          </p>
          <p>
            Nothing on this site is an offer to sell, a solicitation to buy, or investment, legal or tax advice. Valtora
            is not a registered broker, investment adviser or bank. Crypto assets are volatile and you can lose all of
            the money you put in. Always verify the contract address shown on this site before interacting with any
            contract, and check your local rules before taking part.
          </p>
        </div>
      </div>

      <div className="wrap overflow-hidden pt-14">
        <p
          aria-hidden="true"
          className="text-center text-[12.4vw] leading-[0.85] font-medium tracking-[-0.05em] whitespace-nowrap text-white xl:text-[178px]"
        >
          Valtora Finance
        </p>
      </div>

      <div className="wrap flex flex-col items-start justify-between gap-4 py-8 text-[13px] text-white/55 sm:flex-row sm:items-center">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <span>Valtora © 2026</span>
          <Link href="/terms" className="hover:text-white">
            Terms of Service
          </Link>
          <Link href="/privacy" className="hover:text-white">
            Privacy Policy
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <a href={BRAND.x} target="_blank" rel="noreferrer" aria-label={`${BRAND.name} on X`} className="hover:text-white">
            <XIcon />
          </a>
          {BRAND.github && (
            <a href={BRAND.github} target="_blank" rel="noreferrer" aria-label={`${BRAND.name} on GitHub`} className="hover:text-white">
              <GithubIcon />
            </a>
          )}
        </div>
      </div>
    </footer>
  );
}
