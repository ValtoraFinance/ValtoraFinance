import type { Metadata } from "next";
import Link from "next/link";
import { Faq } from "@/components/product/Faq";
import { BRAND, CHAIN } from "@/config/brand";

export const metadata: Metadata = {
  title: "Valtora Learn",
  description: "Plain-language lessons on tokenized assets, wallets and Robinhood Chain.",
};

const TRACKS: { title: string; blurb: string; lessons: { q: string; a: string }[] }[] = [
  {
    title: "Tokenization basics",
    blurb: "What it means to put an asset on a ledger.",
    lessons: [
      { q: "What is a tokenized asset?", a: "A token on a blockchain that represents exposure to something outside it, such as a government bill or a listed share, under terms set by its issuer." },
      { q: "Why tokenize at all?", a: "Tokens can move at any hour, split into small units, and plug into other on-chain apps. Ownership records are public and easy to check." },
      { q: "What does a token not change?", a: "The risk of the underlying asset. A tokenized bill is still a bill, and a tokenized share still rises and falls with the company." },
    ],
  },
  {
    title: "Wallets and networks",
    blurb: "Getting set up to use Valtora safely.",
    lessons: [
      { q: `How do I add ${CHAIN.name}?`, a: `Press Launch App on this site and connect a wallet. If the network is missing, the site asks your wallet to add it: chain id ${CHAIN.id}, currency ${CHAIN.nativeSymbol}.` },
      { q: "Which wallets work?", a: "Browser wallets that support custom networks, such as MetaMask, Rabby, Rainbow, OKX Wallet or Brave Wallet. Some wallets only support a fixed list of networks and cannot connect." },
      { q: "How do I spot a fake token?", a: `Anyone can create a token with any name. The only ${BRAND.symbol} is the one whose full contract address matches the address in this site's header. For stock tokens, paste the address into the lookalike checker on the terminal page.` },
    ],
  },
  {
    title: "Yield and risk",
    blurb: "How return is made, and how it can be lost.",
    lessons: [
      { q: "Where does yield come from?", a: "From someone paying for something: borrowers paying interest on a lending market, or a fund paying out what its bills earn. It changes over time and is never guaranteed." },
      { q: "How do stock tokens pay dividends?", a: "Robinhood stock tokens raise an on-chain multiplier instead of sending tokens. Your balance stays the same while what it is worth grows. The terminal shows this as Distributions." },
      { q: "What are the main risks?", a: `Smart contract bugs, issuer or custodian failure, pricing errors, regulation, and for crypto tokens like ${BRAND.symbol}, sharp price swings.` },
    ],
  },
];

export default function LearnPage() {
  return (
    <div className="bg-night text-white">
      <section className="wrap pt-36 pb-14 md:pt-44">
        <p className="text-[15px] text-white/60">Valtora Learn</p>
        <h1 className="mt-3 max-w-[760px] text-[44px] leading-[1.02] font-medium tracking-[-0.035em] md:text-[56px]">
          Tokenized Finance,
          <br />
          <span className="text-white/50">Explained Plainly.</span>
        </h1>
      </section>
      <section className="wrap grid grid-cols-1 gap-16 pb-24">
        {TRACKS.map((t, i) => (
          <div key={t.title} className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
            <div>
              <p className="font-mono text-[12px] text-white/45">Track {String(i + 1).padStart(2, "0")}</p>
              <h2 className="mt-2 text-[28px] font-medium tracking-[-0.02em]">{t.title}</h2>
              <p className="mt-2 font-serif text-[16px] text-white/65">{t.blurb}</p>
            </div>
            <div className="min-w-0">
              <Faq items={t.lessons} dark />
            </div>
          </div>
        ))}
        <p className="text-[14px] text-white/60">
          Want to go deeper? Read the <Link href="/docs" className="underline">docs</Link> or browse{" "}
          <Link href="/insights" className="underline">insights</Link>.
        </p>
      </section>
    </div>
  );
}
