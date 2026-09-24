import type { Metadata } from "next";
import Link from "next/link";
import { ChevronUp, Mail } from "lucide-react";
import { BRAND } from "@/config/brand";
import { CAREERS, TEAM_ROLES } from "@/data/site";

export const metadata: Metadata = {
  title: "Team",
  description: "Why Valtora Finance exists and how the team is organised.",
};

export default function TeamPage() {
  return (
    <div className="bg-night text-white">
      <section className="wrap pt-36 pb-16 text-center md:pt-44">
        <h1 className="mx-auto max-w-[760px] text-[42px] leading-[1.03] font-medium tracking-[-0.035em] md:text-[56px]">
          We Are Writing the Next Chapter of Finance
        </h1>
        <p className="mx-auto mt-6 max-w-[620px] text-[15px] leading-relaxed text-white/70">
          We think most of the world&apos;s financial assets will end up on public ledgers. Valtora pairs that technology with
          the habits that make traditional finance trustworthy: clear eligibility rules, honest reporting, careful
          product structure and people who answer questions.
        </p>
        <a href="#careers" className="btn btn-light mt-8 px-3 py-2.5 text-[14px]">
          See Open Roles
        </a>
      </section>

      <section className="wrap">
        <div className="relative h-[260px] overflow-hidden rounded-[18px] md:h-[420px]">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url(/art/skyline.webp)" }} />
          <div className="absolute inset-0 bg-gradient-to-t from-night/70 to-transparent" />
          <p className="absolute bottom-6 left-6 max-w-[420px] text-[20px] leading-tight font-medium md:text-[26px]">A remote team, working in public, shipping on Robinhood Chain.</p>
        </div>
      </section>

      <section className="bg-white py-20 text-ink md:py-28">
        <div className="wrap text-center">
          <p className="text-[14px] font-medium text-mute">How We Work</p>
          <h2 className="mt-3 text-[36px] leading-[1.05] font-medium tracking-[-0.035em] md:text-[44px]">
            Roles Over Résumés,
            <br />
            Work Over Words
          </h2>
          <p className="mx-auto mt-4 max-w-[540px] font-serif text-[17px] text-ink/70">
            Contributors are listed by what they own, not by name. What matters is that each area has someone answerable
            for it.
          </p>
        </div>
        <div className="wrap mt-12 grid grid-cols-2 gap-3 md:grid-cols-4">
          {TEAM_ROLES.map((r, i) => (
            <div key={r.role} className="min-w-0">
              <div className="grid aspect-square place-items-center rounded-[12px]" style={{ background: ["#efebff", "#e4edfb", "#e3f3ea", "#f4ecfb"][i % 4] }}>
                <span className="grid size-20 place-items-center rounded-full bg-white font-mono text-[18px] font-medium text-violet shadow-sm md:size-24">
                  {r.initials}
                </span>
              </div>
              <p className="mt-3 text-[15px] font-medium">{r.role}</p>
              <p className="text-[13px] text-mute">{r.area}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="wrap py-20 text-center md:py-28">
        <p className="text-[14px] text-white/60">Mission</p>
        <h2 className="mx-auto mt-3 max-w-[720px] text-[36px] leading-[1.05] font-medium tracking-[-0.035em] md:text-[44px]">
          Build the Platforms, Assets and Rails That Carry Markets On-chain
        </h2>
        <div className="mx-auto mt-8 max-w-[600px] space-y-5 font-serif text-[18px] leading-[1.5] text-white/75">
          <p>Finance still runs on office hours, minimum balances and closed networks. Billions of people are left outside, and those inside pay for the friction.</p>
          <p>
            Public ledgers can change that. Our job is to design products that keep what works in traditional finance
            and drop what does not, then publish the rules so anyone can check them. {BRAND.symbol} is where that
            project starts.
          </p>
        </div>
      </section>

      <section className="border-t border-white/10">
        <div className="wrap py-20 text-center md:py-28">
          <p className="text-[14px] text-white/60">Our Ecosystem</p>
          <h2 className="mx-auto mt-3 max-w-[640px] text-[36px] leading-[1.05] font-medium tracking-[-0.035em] md:text-[44px]">
            Chains, Wallets and Tools We Build Around
          </h2>
          <Link href="/ecosystem" className="btn btn-light mt-8 px-3 py-2.5 text-[14px]">
            Explore Ecosystem
          </Link>
        </div>
      </section>

      <section id="careers" className="scroll-mt-24 bg-white py-20 text-ink md:py-28">
        <div className="wrap">
          <p className="text-[14px] font-medium text-mute">Careers at Valtora</p>
          <h2 className="mt-3 text-[36px] leading-[1.05] font-medium tracking-[-0.035em] md:text-[44px]">Come Build With a Small, Remote Team</h2>
          <div className="mt-10 divide-y divide-line border-y border-line">
            {CAREERS.map((c) => (
              <details key={c.team} className="group">
                <summary className="flex cursor-pointer list-none items-center justify-between py-4 text-[17px] font-medium">
                  {c.team}
                  <ChevronUp className="size-4 rotate-180 transition-transform group-open:rotate-0" />
                </summary>
                <ul className="pb-5">
                  {c.roles.map((r) => (
                    <li key={r} className="flex flex-wrap items-center justify-between gap-3 py-2 text-[15px]">
                      <span>
                        {r} <span className="text-mute">· Remote</span>
                      </span>
                      <a href={`mailto:${BRAND.email}?subject=${encodeURIComponent(`Application: ${r}`)}`} className="inline-flex items-center gap-1.5 text-[14px] underline">
                        <Mail className="size-3.5" /> Apply by email
                      </a>
                    </li>
                  ))}
                </ul>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
