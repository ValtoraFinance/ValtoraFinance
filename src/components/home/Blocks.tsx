import Link from "next/link";
import { BRAND } from "@/config/brand";
import { GithubIcon, XIcon } from "@/components/icons";
import { NewsletterForm } from "@/components/home/NewsletterForm";

export function Intro() {
  return (
    <section className="relative z-10 -mt-[16vh] pb-6">
      <p className="reveal wrap mx-auto max-w-[560px] text-center font-serif text-[19px] leading-[1.4] md:text-[20px]">
        At Valtora, we are designing platforms, assets and infrastructure that carry financial markets onto Robinhood
        Chain, starting with {BRAND.symbol}.
      </p>
    </section>
  );
}

export function EcosystemArc() {
  return (
    <section className="relative overflow-hidden bg-black text-white">
      <div className="wrap relative flex min-h-[620px] flex-col items-center justify-center py-24 text-center md:min-h-[780px]">
        <svg viewBox="0 0 1000 520" className="pointer-events-none absolute top-10 left-1/2 w-[1000px] max-w-none -translate-x-1/2 md:top-0 md:w-[1100px]" aria-hidden="true">
          <defs>
            <linearGradient id="arc" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#f07a2e" />
              <stop offset="0.45" stopColor="#ffffff" stopOpacity="0.9" />
              <stop offset="1" stopColor="#7c3aed" />
            </linearGradient>
            <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#fff" />
              <stop offset="0.85" stopColor="#fff" stopOpacity="0.2" />
              <stop offset="1" stopColor="#fff" stopOpacity="0" />
            </linearGradient>
            <mask id="arc-mask">
              <rect width="1000" height="520" fill="url(#fade)" />
            </mask>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="8" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <path d="M40 520 A460 460 0 0 1 960 520" fill="none" stroke="url(#arc)" strokeWidth="1.6" mask="url(#arc-mask)" />
          <rect x="112" y="262" width="30" height="30" rx="6" fill="#f07a2e" filter="url(#glow)" transform="rotate(20 127 277)" />
          <rect x="858" y="262" width="30" height="30" rx="6" fill="#7c3aed" filter="url(#glow)" transform="rotate(20 873 277)" />
        </svg>
        <p className="reveal relative text-[15px] font-medium text-white/70">Valtora Ecosystem</p>
        <h2 className="reveal relative mt-5 text-[40px] leading-[1.02] font-medium tracking-[-0.035em] md:text-[48px]">
          Building the Bridge
          <br />
          <span className="text-white/50">Between Wall Street & Web3</span>
        </h2>
        <p className="reveal relative mt-6 max-w-[560px] font-serif text-[18px] leading-[1.35] text-white/70 md:text-[20px]">
          We want to work with teams who share one goal: making well-built financial products reachable from any
          wallet. See which chains, wallets and tools already work with Valtora, and which seats are still open.
        </p>
        <Link href="/ecosystem" className="btn btn-light relative mt-10">
          Explore the Ecosystem
        </Link>
      </div>
    </section>
  );
}

export function Newsletter() {
  return (
    <section className="bg-white pb-20 md:pb-28">
      <div className="wrap">
        <div className="relative overflow-hidden rounded-[22px] md:rounded-[32px]">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url(/art/facade.webp)" }} />
          <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/35 to-black/60" />
          <div className="relative flex flex-col items-center px-5 py-20 text-center text-white md:py-32">
            <h2 className="text-[36px] leading-[1.05] font-medium tracking-[-0.035em] md:text-[48px]">
              The Future of Finance
              <br />
              <span className="text-white/60">Subscribe for launch news,</span>
              <br />
              <span className="text-white/60">research and releases.</span>
            </h2>
            <NewsletterForm />
            <div className="mt-8 flex items-center gap-5 text-white/80">
              <a href={BRAND.x} target="_blank" rel="noreferrer" aria-label={`${BRAND.name} on X`} className="hover:text-white">
                <XIcon className="size-5" />
              </a>
              <a href={BRAND.github} target="_blank" rel="noreferrer" aria-label={`${BRAND.name} on GitHub`} className="hover:text-white">
                <GithubIcon className="size-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
