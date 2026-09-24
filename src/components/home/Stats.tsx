"use client";

import { useEffect, useRef, useState } from "react";
import { rpc } from "@/lib/rpc";
import { CHAIN } from "@/config/brand";

/** One rolling digit column. */
function Digit({ value, on }: { value: string; on: boolean }) {
  if (!/\d/.test(value)) return <span className="inline-block h-[1.12em] align-top leading-[1.12em]">{value}</span>;
  const n = on ? Number(value) : 0;
  return (
    <span className="relative inline-block h-[1.12em] overflow-hidden align-top leading-[1.12em]">
      <span className="invisible">0</span>
      <span
        className="absolute inset-x-0 top-0 flex flex-col transition-transform duration-[1400ms] ease-[var(--ease-soft)]"
        style={{ transform: `translateY(-${n * 10}%)` }}
      >
        {Array.from({ length: 10 }, (_, i) => (
          <span key={i} className="block h-[1.12em] leading-[1.12em]">
            {i}
          </span>
        ))}
      </span>
    </span>
  );
}

export function Odometer({ text, on }: { text: string; on: boolean }) {
  return (
    <span className="inline-flex" aria-label={text}>
      {text.split("").map((ch, i) => (
        <Digit key={`${i}-${text.length}`} value={ch} on={on} />
      ))}
    </span>
  );
}

function useInView<T extends Element>() {
  const ref = useRef<T>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setOn(true);
        io.disconnect();
      }
    }, { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, on] as const;
}

function Row({ text, label, big = true }: { text: string; label: React.ReactNode; big?: boolean }) {
  const [ref, on] = useInView<HTMLDivElement>();
  return (
    <div ref={ref} className="flex flex-wrap items-end gap-x-6 gap-y-2 border-b border-line py-10 md:py-14">
      <span
        className={`font-medium tracking-[-0.06em] ${big ? "text-[96px] md:text-[168px]" : "text-[52px] sm:text-[72px] md:text-[104px]"}`}
        style={{ lineHeight: 1.12 }}
      >
        <Odometer text={text} on={on} />
      </span>
      <span className="pb-1 font-serif text-[20px] leading-[1.1] text-mute md:text-[26px]">{label}</span>
    </div>
  );
}

export function Stats() {
  const [block, setBlock] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = () =>
      rpc<string>("eth_blockNumber")
        .then((hex) => {
          if (!cancelled) setBlock(Number.parseInt(hex, 16).toLocaleString("en-US"));
        })
        .catch(() => {
          // Both endpoints unreachable: the row keeps its last value or a dash.
        });
    load();
    const t = window.setInterval(load, 6000);
    return () => {
      cancelled = true;
      window.clearInterval(t);
    };
  }, []);

  return (
    <section className="bg-white py-16 md:py-28">
      <div className="wrap grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-6">
        <div>
          <h2 className="reveal text-[32px] leading-[1.05] font-medium tracking-[-0.03em] md:text-[36px] lg:sticky lg:top-40">
            Valtora is building the foundation
            <br />
            <span className="text-mute">for the next chapter of finance.</span>
          </h2>
        </div>
        <div className="min-w-0 border-t border-line">
          <Row text="01" label={<>Supported<br />Chain</>} />
          <Row text="03" label={<>Planned<br />Products</>} />
          <Row text="24/7" label={<>Mint & Redeem<br />Target</>} />
          <div className="py-10 md:py-14">
            <p className="flex items-center gap-2 text-[14px] font-medium text-mute">
              <span className={`size-2 rounded-full ${block ? "animate-pulse bg-up" : "bg-soft"}`} />
              Live · {CHAIN.name} block height
            </p>
            <p className="mt-4 font-mono text-[44px] leading-none tracking-[-0.04em] sm:text-[64px] md:text-[80px]">
              {block ?? "—"}
            </p>
            <p className="mt-3 font-serif text-[15px] text-mute">Read directly from the public RPC every few seconds.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
