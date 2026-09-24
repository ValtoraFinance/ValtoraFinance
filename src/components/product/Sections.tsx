import Link from "next/link";
import { ArrowUpRight, BadgeCheck, Building2, Clock, Coins, FileText, Globe, Layers, Link2, ListChecks, Lock, Network, Scale, ShieldCheck, Sparkles, Wallet } from "lucide-react";
import { BRAND, CHAIN, shortAddress, isAddress, explorerToken } from "@/config/brand";
import { ARTICLES, formatDate, type Product } from "@/data/site";
import { GlassStack } from "@/components/art/GlassStack";
import { ArticleArt } from "@/components/art/ArticleArt";
import { BarsRise } from "@/components/art/charts";
import { LaunchButton } from "@/components/wallet/WalletButton";
import { AccrualPanel, ContactForm, Faq, TypedWord } from "@/components/product/Interactive";
import { NavIcon } from "@/components/icons";

const FEATURE_ICONS = [Globe, Sparkles, Link2, Clock, ShieldCheck, Lock];
const DETAIL_ICONS = [BadgeCheck, Layers, Clock, Link2, Scale, Wallet, Network, Building2, FileText];

export function ProductHero({ product }: { product: Product }) {
  return (
    <section className="relative overflow-hidden pt-32 pb-16 md:pt-40 md:pb-24" style={{ background: product.tint }}>
      <div className="wrap grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl text-white" style={{ background: product.deep }}>
              <NavIcon name={product.key} className="size-5" />
            </span>
            <span>
              <span className="block text-[16px] leading-tight font-medium">{product.name}</span>
              <span className="block text-[12px] text-mute">{product.full} · {product.badge}</span>
            </span>
          </div>
          <h1 className="mt-8 text-[40px] leading-[1.03] font-medium tracking-[-0.035em] md:text-[56px]">
            {product.typedLead}
            <br />
            <TypedWord words={product.typed} className="" />
          </h1>
          <p className="mt-6 max-w-[520px] font-serif text-[18px] leading-snug md:text-[19px]">{product.heroCopy}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <LaunchButton className="btn-dark px-4 py-3 text-[15px]" label={product.primaryCta} />
            <button type="button" disabled className="btn btn-ghost px-4 py-3 text-[15px]" title="Opens at launch">
              {product.secondaryCta}
            </button>
          </div>
          <dl className="mt-12 grid max-w-[520px] grid-cols-3 gap-4">
            {product.stats.map((s) => (
              <div key={s.label} className="min-w-0">
                <dt className="text-[13px] text-mute">{s.label}</dt>
                <dd className="mt-1 truncate font-serif text-[24px] leading-tight md:text-[30px]">{s.value}</dd>
                {s.note ? <dd className="font-mono text-[11px] text-mute">{s.note}</dd> : null}
              </div>
            ))}
          </dl>
          <div className="mt-8">
            <p className="text-[13px] text-mute">Available on</p>
            <p className="mt-2 flex items-center gap-2 text-[14px] font-medium">
              <img src="/brand/valtora-plate.webp" alt="" className="size-6 rounded-full" /> {CHAIN.name}
            </p>
          </div>
        </div>
        <div className="min-w-0">
          <GlassStack accent={product.accent} soft={product.accentSoft} plates={product.key === "treasury" ? 4 : 8} shape={product.key === "equities" ? "round" : "square"} />
        </div>
      </div>
    </section>
  );
}

export function Performance({ product }: { product: Product }) {
  return (
    <section className="bg-white py-20 md:py-28">
      <div className="wrap grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] lg:gap-20">
        <div className="reveal">
          <h2 className="text-[36px] leading-[1.05] font-medium tracking-[-0.035em] md:text-[44px]">{product.performance.title}</h2>
          <p className="mt-5 max-w-[440px] font-serif text-[18px] leading-snug">{product.performance.body}</p>
          <div className="mt-8">
            <LaunchButton className="btn-dark px-3 py-2.5 text-[15px]" label={product.primaryCta} />
          </div>
        </div>
        <AccrualPanel accent={product.accent} name={product.name} />
      </div>
    </section>
  );
}

export function Details({ product }: { product: Product }) {
  const live = isAddress(BRAND.ca);
  return (
    <section className="bg-mist py-20 md:py-28">
      <div className="wrap grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-20">
        <div className="reveal">
          <h2 className="text-[36px] leading-[1.05] font-medium tracking-[-0.035em] md:text-[44px]">{product.name} In Detail.</h2>
          <p className="mt-5 max-w-[440px] font-serif text-[18px] leading-snug">
            How {product.name} is designed to work. Every line here is a plan, and each will be confirmed in writing
            before anything is issued.
          </p>
        </div>
        <dl className="min-w-0 divide-y divide-line border-y border-line">
          {product.details.map((d, i) => {
            const Icon = DETAIL_ICONS[i % DETAIL_ICONS.length];
            return (
              <div key={d.label} className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] gap-4 py-3.5 text-[14px]">
                <dt className="flex items-center gap-2.5 font-medium">
                  <Icon className="size-4 shrink-0 text-mute" strokeWidth={1.6} /> {d.label}
                </dt>
                <dd className="text-ink/75">{d.value}</dd>
              </div>
            );
          })}
          <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] gap-4 py-3.5 text-[14px]">
            <dt className="flex items-center gap-2.5 font-medium">
              <ListChecks className="size-4 shrink-0 text-mute" strokeWidth={1.6} /> Project token
            </dt>
            <dd className="text-ink/75">
              {live ? (
                <a href={explorerToken(BRAND.ca)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-mono underline">
                  {BRAND.symbol} {shortAddress(BRAND.ca)} <ArrowUpRight className="size-3.5" />
                </a>
              ) : (
                <span>
                  {BRAND.symbol}, address published at launch
                </span>
              )}
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}

export function Features({ product, title = ["Security, Utility & Liquidity", "In One Token."] }: { product: Product; title?: [string, string] }) {
  return (
    <section className="py-20 text-white md:py-28" style={{ background: product.deep }}>
      <div className="wrap">
        <h2 className="reveal text-[36px] leading-[1.05] font-medium tracking-[-0.035em] md:text-[44px]">
          {title[0]}
          <br />
          {title[1]}
        </h2>
        <div className="mt-12 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {product.features.map((f, i) => {
            const Icon = FEATURE_ICONS[i % FEATURE_ICONS.length];
            return (
              <div key={f.title} className="reveal flex min-h-[210px] flex-col rounded-[18px] bg-white p-6 text-ink">
                <Icon className="size-6" strokeWidth={1.5} />
                <p className="mt-auto pt-8 text-[16px] font-medium">{f.title}</p>
                <p className="mt-1.5 text-[14px] leading-snug text-ink/70">{f.body}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function Variants({ product }: { product: Product }) {
  if (!product.variants) return null;
  return (
    <section className="bg-white py-20 md:py-28">
      <div className="wrap">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div>
            <p className="text-[13px] font-medium text-mute">Assets</p>
            <h2 className="mt-3 text-[36px] leading-[1.05] font-medium tracking-[-0.035em] md:text-[44px]">
              Yield. However
              <br />
              You Want It.
            </h2>
          </div>
          <div className="lg:pt-8">
            <p className="max-w-[420px] font-serif text-[17px] leading-snug">
              Pick the version that suits how you account for yield, then switch between them at the current rate
              whenever you like.
            </p>
            <div className="mt-5 flex gap-3">
              <Link href="/app?tab=convert" className="btn btn-dark px-3 py-2.5 text-[14px]">
                Convert
              </Link>
              <Link href="/insights/accruing-vs-rebasing" className="btn btn-ghost px-3 py-2.5 text-[14px]">
                Learn More
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-2">
          {product.variants.map((v, i) => (
            <div key={v.name} className="reveal flex flex-col rounded-[22px] bg-mist p-6">
              <p className="flex items-center gap-2 text-[15px] font-medium">
                <Coins className="size-4" style={{ color: product.accent }} /> {v.name}
              </p>
              <div className="mt-6 h-40">
                {i === 0 ? (
                  <BarsRise accent={product.accent} soft={product.accentSoft} count={26} />
                ) : (
                  <div className="flex h-full items-end gap-[5px]">
                    {Array.from({ length: 26 }, (_, k) => (
                      <span key={k} className="flex min-w-0 flex-1 flex-col-reverse gap-[3px]">
                        {Array.from({ length: 2 + Math.floor(k / 3) }, (_, j) => (
                          <span key={j} className="block aspect-square w-full rounded-full" style={{ background: j > 3 ? product.accent : product.accentSoft }} />
                        ))}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <p className="mt-6 text-[24px] font-medium tracking-[-0.02em]">{v.kind}</p>
              <p className="mt-1.5 max-w-[420px] font-serif text-[15px] leading-snug text-ink/75">{v.body}</p>
              <div className="mt-6 border-t border-line pt-3">
                <p className="text-[12px] font-medium">Example</p>
                <p className="mt-1 font-serif text-[13px] text-ink/65">{v.example}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function UseCases({ product }: { product: Product }) {
  return (
    <section className="bg-mist py-20 md:py-28">
      <div className="wrap">
        <p className="text-[13px] font-medium text-mute">Use Cases</p>
        <div className="mt-3 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <h2 className="text-[36px] leading-[1.05] font-medium tracking-[-0.035em] md:text-[44px]">
            Useful Everywhere,
            <br />
            From Protocols to Payroll.
          </h2>
          <p className="max-w-[440px] font-serif text-[17px] leading-snug lg:pt-3">
            {product.name} is designed to be a building block: something to hold, spend, lend or settle with,
            wherever it is supported.
          </p>
        </div>
        <div className={`mt-12 grid grid-cols-1 gap-3 sm:grid-cols-2 ${product.useCases.length === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}>
          {product.useCases.map((u, i) => {
            const Icon = FEATURE_ICONS[(i + 2) % FEATURE_ICONS.length];
            return (
              <div key={u.title} className="reveal flex min-h-[200px] flex-col rounded-[18px] bg-white p-6">
                <Icon className="size-6" strokeWidth={1.5} />
                <p className="mt-auto pt-6 text-[15px] font-medium">{u.title}</p>
                <p className="mt-1.5 text-[14px] leading-snug text-ink/70">{u.body}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function Holdings({ product }: { product: Product }) {
  return (
    <section className="bg-white py-20 md:py-28">
      <div className="wrap">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <h2 className="text-[30px] font-medium tracking-[-0.03em] md:text-[36px]">Portfolio Overview</h2>
            <p className="mt-1 font-mono text-[12px] text-mute">Published daily once {product.name} is live</p>
          </div>
          <dl className="grid grid-cols-3 gap-6 text-right">
            {["Tokens outstanding", "Value of reserves", "Collateral ratio"].map((l) => (
              <div key={l}>
                <dt className="text-[12px] text-mute">{l}</dt>
                <dd className="font-serif text-[24px]">—</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="mt-8 overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-[14px]">
            <thead className="font-mono text-[12px] text-mute">
              <tr className="border-y border-line">
                <th className="py-3 pr-4 font-normal">%</th>
                <th className="py-3 pr-4 font-normal">Position</th>
                <th className="py-3 pr-4 text-right font-normal">Current value</th>
                <th className="py-3 pr-4 text-right font-normal">Maturity</th>
                <th className="py-3 text-right font-normal">Yield</th>
              </tr>
            </thead>
            <tbody>
              {product.holdings.map((h) => (
                <tr key={h.position} className="border-b border-line">
                  <td className="py-4 pr-4 font-mono">{h.share}</td>
                  <td className="py-4 pr-4">{h.position}</td>
                  <td className="py-4 pr-4 text-right font-mono">{h.weight}</td>
                  <td className="py-4 pr-4 text-right font-mono">{h.maturity}</td>
                  <td className="py-4 text-right font-mono">{h.yield}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 font-serif text-[14px] text-mute">
          Planned composition only. Dashes stay until real, independently checked figures exist.
        </p>
      </div>
    </section>
  );
}

export function ContactSection({ title = "Contact Us." }: { title?: string }) {
  return (
    <section className="bg-white py-20 md:py-28">
      <div className="wrap grid grid-cols-1 gap-12 lg:grid-cols-2">
        <div>
          <h2 className="text-[40px] leading-none font-medium tracking-[-0.035em] md:text-[56px]">{title}</h2>
          <p className="mt-6 max-w-[440px] font-serif text-[17px] leading-snug text-ink/75">
            Questions about a product, an integration or the {BRAND.symbol} token? Send a note and a contributor will
            reply. Media requests are welcome too.
          </p>
          <p className="mt-4 max-w-[440px] font-serif text-[17px] leading-snug text-ink/75">
            Prefer email? Write to{" "}
            <a className="underline" href={`mailto:${BRAND.email}`}>
              {BRAND.email}
            </a>
            .
          </p>
        </div>
        <ContactForm />
      </div>
    </section>
  );
}

export function FaqSection({ items, title = "FAQ" }: { items: { q: string; a: string }[]; title?: string }) {
  return (
    <section className="bg-white pb-20 md:pb-28">
      <div className="wrap grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
        <h2 className="text-[30px] font-medium tracking-[-0.03em] md:text-[36px]">{title}</h2>
        <div className="min-w-0">
          <Faq items={items} />
          <Link href="/docs" className="mt-5 inline-flex items-center gap-1 text-[13px] underline">
            See the full FAQ <ArrowUpRight className="size-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export function LatestDark({ topic }: { topic?: string }) {
  const items = [...ARTICLES.filter((a) => a.topic === topic), ...ARTICLES.filter((a) => a.topic !== topic)].slice(0, 3);
  return (
    <section className="bg-[#1a1a1f] py-20 text-white md:py-28">
      <div className="wrap">
        <p className="text-center text-[13px] text-white/60">Resources</p>
        <h2 className="mt-2 text-center text-[30px] font-medium tracking-[-0.02em] md:text-[36px]">See the Latest from Valtora</h2>
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {items.map((a) => (
            <Link key={a.slug} href={`/insights/${a.slug}`} className="group block min-w-0">
              <div className="aspect-[16/9.6] overflow-hidden rounded-[10px]">
                <div className="h-full w-full transition-transform duration-500 group-hover:scale-[1.03]">
                  <ArticleArt variant={a.art} />
                </div>
              </div>
              <p className="mt-4 text-[13px] text-white/55">
                {a.kind} <span className="mx-1.5">•</span> {formatDate(a.date)}
              </p>
              <h3 className="mt-1.5 text-[15px] leading-snug font-medium">{a.title}</h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
