import { Suspense } from "react";
import { Hero } from "@/components/home/Hero";
import { Latest } from "@/components/home/Latest";
import { LiveProducts, LiveProductsSkeleton } from "@/components/home/LiveProducts";
import { LiveStats, LiveStatsFallback } from "@/components/home/LiveStats";
import { Believe, InsightsTeaser, Rails, Theses, Trust } from "@/components/home/Carousels";
import { EcosystemArc, Intro, Newsletter } from "@/components/home/Blocks";

// Products and stats are read from the chain on every request.
export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <>
      <Hero />
      <Intro />
      <Latest />
      <Suspense fallback={<LiveProductsSkeleton />}>
        <LiveProducts />
      </Suspense>
      <Suspense fallback={<LiveStatsFallback />}>
        <LiveStats />
      </Suspense>
      <Theses />
      <Believe />
      <Trust />
      <Rails />
      <EcosystemArc />
      <InsightsTeaser />
      <Newsletter />
    </>
  );
}
