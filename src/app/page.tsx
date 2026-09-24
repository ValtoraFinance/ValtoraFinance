import { Hero } from "@/components/home/Hero";
import { Latest } from "@/components/home/Latest";
import { Products } from "@/components/home/Products";
import { Stats } from "@/components/home/Stats";
import { Believe, InsightsTeaser, Rails, Theses, Trust } from "@/components/home/Carousels";
import { EcosystemArc, Intro, Newsletter } from "@/components/home/Blocks";

export default function Home() {
  return (
    <>
      <Hero />
      <Intro />
      <Latest />
      <Products />
      <Stats />
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
