"use client";

import { useEffect, useRef } from "react";
import { ArrowDown } from "lucide-react";
import { ASSET_CLASSES } from "@/data/site";

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const ease = (t: number) => 1 - Math.pow(1 - t, 3);

/**
 * Full-bleed skyline that folds into a rounded frame as the page scrolls,
 * while the headline splits to either side of it.
 */
export function Hero() {
  const section = useRef<HTMLElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const ghostA = useRef<HTMLDivElement>(null);
  const ghostB = useRef<HTMLDivElement>(null);
  const left = useRef<HTMLSpanElement>(null);
  const right = useRef<HTMLSpanElement>(null);
  const headline = useRef<HTMLHeadingElement>(null);
  const foot = useRef<HTMLDivElement>(null);
  const shade = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = section.current;
      if (!el) return;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const total = el.offsetHeight - vh;
      const p = clamp(-el.getBoundingClientRect().top / Math.max(1, total));
      const t = ease(clamp(p / 0.7));
      const mobile = vw < 768;

      const target = mobile ? Math.min(vw - 64, 300) : Math.min(454, vh * 0.52);
      const w = vw + (target - vw) * t;
      const h = vh + (target - vh) * t;
      const radius = 32 * t;
      if (frame.current) {
        frame.current.style.width = `${w}px`;
        frame.current.style.height = `${h}px`;
        frame.current.style.borderRadius = `${radius}px`;
      }
      const ghost = (node: HTMLDivElement | null, scale: number, alpha: number) => {
        if (!node) return;
        node.style.width = `${w * scale}px`;
        node.style.height = `${h * scale}px`;
        node.style.borderRadius = `${radius * scale}px`;
        node.style.opacity = `${alpha * t}`;
      };
      ghost(ghostA.current, 0.84, 0.55);
      ghost(ghostB.current, 0.6, 0.9);

      if (shade.current) shade.current.style.opacity = `${0.35 * (1 - t)}`;

      // Move each half so it sits just outside the frame: beside it on wide
      // screens, above and below it on narrow ones.
      const L = left.current;
      const R = right.current;
      const H1 = headline.current;
      if (L && R && H1) {
        const base = H1.getBoundingClientRect().left;
        const gap = 44;
        if (mobile) {
          const lift = (target / 2 + 64) * t;
          L.style.transform = `translate(0px, ${-lift}px)`;
          R.style.transform = `translate(0px, ${lift}px)`;
        } else {
          const lRight = base + L.offsetLeft + L.offsetWidth;
          const rLeft = base + R.offsetLeft;
          const dl = vw / 2 - target / 2 - gap - lRight;
          const dr = vw / 2 + target / 2 + gap - rLeft;
          L.style.transform = `translate(${dl * t}px, 0px)`;
          R.style.transform = `translate(${dr * t}px, 0px)`;
        }
      }
      if (headline.current) headline.current.dataset.dark = t > 0.45 ? "1" : "0";
      if (foot.current) foot.current.style.opacity = `${1 - clamp(p / 0.18)}`;
    };
    const onScroll = () => {
      if (!raf) raf = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section ref={section} className="relative h-[240vh] bg-white" aria-label="Introduction">
      <div className="sticky top-0 flex h-dvh items-center justify-center overflow-hidden">
        <div ref={ghostA} className="absolute overflow-hidden opacity-0" style={{ backgroundImage: "url(/art/skyline.webp)", backgroundSize: "cover", backgroundPosition: "50% 70%" }} />
        <div ref={frame} className="absolute overflow-hidden" style={{ width: "100vw", height: "100dvh" }}>
          <div className="absolute inset-0 bg-cover bg-[position:50%_70%]" style={{ backgroundImage: "url(/art/skyline.webp)" }} />
          <div ref={shade} className="absolute inset-0 bg-black" style={{ opacity: 0.35 }} />
        </div>
        <div ref={ghostB} className="absolute overflow-hidden opacity-0 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.5)]" style={{ backgroundImage: "url(/art/skyline.webp)", backgroundSize: "cover", backgroundPosition: "50% 72%" }} />

        <h1
          ref={headline}
          data-dark="0"
          className="group pointer-events-none relative z-10 flex flex-col items-center gap-0 px-4 text-center text-[40px] leading-[1.05] font-medium tracking-[-0.035em] text-white transition-colors duration-500 data-[dark=1]:text-ink sm:text-[48px] md:flex-row md:gap-4 md:text-[46px] lg:text-[56px]"
        >
          <span ref={left} className="block whitespace-nowrap will-change-transform">
            A New Chapter for
          </span>
          <span ref={right} className="block whitespace-nowrap will-change-transform">
            Global Finance
          </span>
        </h1>

        <div ref={foot} className="absolute inset-x-0 bottom-0 z-10 text-white">
          <p className="mb-8 flex items-center justify-center gap-2 text-[14.5px] font-medium">
            Scroll to explore <ArrowDown className="size-4" />
          </p>
          <div className="overflow-hidden pb-8">
            <div className="marquee-track flex gap-16 pr-16 md:gap-24 md:pr-24">
              {[...ASSET_CLASSES, ...ASSET_CLASSES].map((name, i) => (
                <span key={i} className="flex items-center gap-2.5 text-[22px] font-semibold tracking-[-0.02em] whitespace-nowrap opacity-90 md:text-[26px]">
                  <span className="grid size-6 place-items-center rounded-full border-2 border-white/80 text-[11px]">{name[0]}</span>
                  {name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
