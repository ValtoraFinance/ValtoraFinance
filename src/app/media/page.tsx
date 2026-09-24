import type { Metadata } from "next";
import { Download } from "lucide-react";
import { BRAND } from "@/config/brand";
import { PageHead } from "@/components/legal/PageHead";

export const metadata: Metadata = {
  title: "Media Kit",
  description: `Logos, banner and colours for ${BRAND.name}.`,
};

const ASSETS = [
  { name: "Mark, transparent", file: "/brand/valtora-mark.webp", bg: "bg-plate" },
  { name: "Mark on plate", file: "/brand/valtora-plate.webp", bg: "bg-mist" },
  { name: "Banner", file: "/brand/og.webp", bg: "bg-mist" },
];

const COLOURS = [
  { name: "Plate", hex: "#100828" },
  { name: "Ink", hex: "#0C0A17" },
  { name: "Violet", hex: "#6D4CF0" },
  { name: "Cobalt", hex: "#4A78D1" },
  { name: "Jade", hex: "#16935B" },
  { name: "Paper", hex: "#FFFFFF" },
];

export default function MediaPage() {
  return (
    <>
      <PageHead kicker="Media Kit" title="Brand Assets" lead={`Use these files when writing about ${BRAND.name}. Please keep the mark unaltered, and send press questions to ${BRAND.email}.`} />
      <section className="bg-white pb-16">
        <div className="wrap grid grid-cols-1 gap-4 md:grid-cols-3">
          {ASSETS.map((a) => (
            <div key={a.file} className="min-w-0">
              <div className={`grid aspect-[4/3] place-items-center overflow-hidden rounded-[16px] p-8 ${a.bg}`}>
                <img src={a.file} alt={a.name} className="max-h-full max-w-full object-contain" />
              </div>
              <div className="mt-3 flex items-center justify-between">
                <p className="text-[15px] font-medium">{a.name}</p>
                <a href={a.file} download className="inline-flex items-center gap-1.5 text-[14px] underline">
                  <Download className="size-4" /> .webp
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="bg-white pb-24">
        <div className="wrap">
          <h2 className="text-[26px] font-medium tracking-[-0.02em]">Colours</h2>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {COLOURS.map((c) => (
              <div key={c.hex} className="overflow-hidden rounded-[12px] border border-line">
                <div className="h-24" style={{ background: c.hex }} />
                <div className="p-3 text-[13px]">
                  <p className="font-medium">{c.name}</p>
                  <p className="font-mono text-mute">{c.hex}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
