"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { PRODUCTS, type Product } from "@/data/site";
import { NavIcon } from "@/components/icons";
import { BarsRise, DotScatter, IllustrativeTag, LineCompare } from "@/components/art/charts";

const ICON: Record<Product["key"], "equities" | "yield" | "treasury"> = {
  equities: "equities",
  yield: "yield",
  treasury: "treasury",
};

export function Products() {
  const outer = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const on = () => {
      const el = outer.current;
      if (!el || window.innerWidth < 1024) return;
      const total = el.offsetHeight - window.innerHeight;
      const p = Math.min(0.999, Math.max(0, -el.getBoundingClientRect().top / Math.max(1, total)));
      setActive(Math.floor(p * PRODUCTS.length));
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
    };
  }, []);

  return (
    <section className="bg-white" id="products">
      <div className="wrap reveal pt-10 pb-16 text-center md:pb-24">
        <p className="text-[15px] font-medium text-mute">Our Products</p>
        <h2 className="mt-4 text-[38px] leading-[1.05] font-medium tracking-[-0.035em] md:text-[56px]">
          A New Standard
          <br />
          <span className="text-mute">for Tokenized Finance.</span>
        </h2>
        <p className="mx-auto mt-5 max-w-xl font-serif text-[18px] leading-snug md:text-[20px]">
          Three planned products that carry traditional assets onto an open ledger.
        </p>
      </div>

      {/* Desktop: pinned panel that steps through each product. */}
      <div ref={outer} className="relative hidden h-[300vh] lg:block">
        <div className="sticky top-[84px] pb-6">
          <div className="wrap">
            <div className="grid h-[calc(100dvh-110px)] max-h-[760px] min-h-[600px] grid-cols-[minmax(0,548px)_minmax(0,1fr)] gap-3 rounded-[32px] bg-cloud p-3">
              <div className="flex min-h-0 flex-col gap-3">
                {PRODUCTS.map((p, i) =>
                  i < active ? (
                    <CollapsedCard key={p.key} product={p} />
                  ) : i === active ? (
                    <ProductCard key={p.key} product={p} grow />
                  ) : null,
                )}
              </div>
              <Charts key={PRODUCTS[active].key} product={PRODUCTS[active]} />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile and tablet: a simple stack. */}
      <div className="wrap flex flex-col gap-4 pb-8 lg:hidden">
        {PRODUCTS.map((p) => (
          <div key={p.key} className="flex flex-col gap-2.5 rounded-[26px] bg-cloud p-2.5">
            <ProductCard product={p} />
            <div className="sm:h-[560px]">
              <Charts product={p} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function CollapsedCard({ product }: { product: Product }) {
  return (
    <Link href={product.href} className="block shrink-0 rounded-[22px] bg-white px-6 py-6 transition-colors hover:bg-mist">
      <h3 className="text-[32px] leading-none font-medium tracking-[-0.02em]">{product.name}</h3>
    </Link>
  );
}

function ProductCard({ product, grow = false }: { product: Product; grow?: boolean }) {
  return (
    <div className={`flex flex-col rounded-[22px] bg-white p-6 ${grow ? "min-h-0 flex-1 animate-[rise_0.6s_var(--ease-soft)]" : ""}`}>
      <span className="grid size-[58px] place-items-center rounded-[14px] text-white" style={{ background: product.deep }}>
        <NavIcon name={ICON[product.key]} className="size-8" />
      </span>
      <div className={grow ? "flex-1" : "h-16"} />
      <h3 className="text-[32px] leading-none font-medium tracking-[-0.02em] md:text-[36px]">{product.name}</h3>
      <p className="mt-5 max-w-[470px] font-serif text-[17px] leading-[1.3] md:text-[18px]">{product.summary}</p>
      {product.badge ? <span className="chip mt-4 w-fit">{product.badge}</span> : null}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <span className="flex items-center gap-2 text-[13px] text-mute">
          <img src="/brand/valtora-plate.webp" alt="" className="size-7 rounded-full" />
          Robinhood Chain
        </span>
        <Link href={product.href} className="btn btn-dark px-4 py-3">
          Discover {product.name}
        </Link>
      </div>
    </div>
  );
}

function Charts({ product }: { product: Product }) {
  const equities = product.key === "equities";
  return (
    <div className="grid h-full min-h-0 grid-cols-1 gap-2.5 sm:grid-cols-2 sm:grid-rows-[1fr_1fr] lg:gap-3">
      <div className="flex min-h-0 flex-col rounded-[22px] bg-white p-5 sm:col-span-2 md:grid md:grid-cols-[minmax(0,240px)_minmax(0,1fr)] md:gap-6">
        <div>
          <p className="text-[13px] font-medium">Current TVL</p>
          <p className="mt-2 font-serif text-[36px] leading-none">—</p>
          <p className="mt-2 font-mono text-[12px] text-mute">Reported at launch</p>
          <IllustrativeTag className="mt-4" />
        </div>
        <div className="mt-4 min-h-[120px] flex-1 md:mt-0">
          <DotScatter accent={product.accent} seed={product.key.length * 7} label="shape only" />
        </div>
      </div>
      {equities ? (
        <>
          <div className="flex min-h-0 flex-col rounded-[22px] bg-white p-5">
            <p className="text-[13px] font-medium">Launch basket</p>
            <p className="mt-2 font-serif text-[36px] leading-none">12</p>
            <p className="mt-2 font-mono text-[12px] text-mute">planned reference names</p>
            <div className="mt-auto flex flex-wrap gap-2 pt-4">
              {["AAPL", "MSFT", "NVDA", "AMZN", "TSLA", "SPY"].map((t) => (
                <span key={t} className="grid size-10 place-items-center rounded-full bg-violet/10 font-mono text-[10px] font-medium text-violet">
                  {t}
                </span>
              ))}
            </div>
          </div>
          <div className="flex min-h-0 flex-col rounded-[22px] bg-white p-5">
            <p className="text-[13px] font-medium">Unique Holders</p>
            <p className="mt-2 font-serif text-[36px] leading-none">—</p>
            <p className="mt-2 font-mono text-[12px] text-mute">Read from chain at launch</p>
            <div className="mt-auto h-24 pt-4">
              <BarsRise accent={product.accent} soft={product.accentSoft} count={14} />
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="flex min-h-0 flex-col rounded-[22px] bg-white p-5">
            <p className="text-[13px] font-medium">Target yield</p>
            <p className="mt-2 font-serif text-[36px] leading-none">—</p>
            <p className="mt-2 font-serif text-[13px] text-mute">*Set at launch. The lines show accrual shape only.</p>
            <div className="mt-4 min-h-[140px] flex-1 sm:min-h-0">
              <LineCompare accent={product.accent} soft={product.accentSoft} labels={[`${product.name} model`, "Plain cash"]} />
            </div>
          </div>
          <div className="flex min-h-0 flex-col rounded-[22px] bg-white p-5">
            <p className="text-[13px] font-medium">Price</p>
            <p className="mt-2 font-serif text-[36px] leading-none">—</p>
            <p className="mt-2 font-mono text-[12px] text-mute">Published at launch</p>
            <div className="mt-4 min-h-[140px] flex-1 sm:min-h-0">
              <BarsRise accent={product.accent} soft={product.accentSoft} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
