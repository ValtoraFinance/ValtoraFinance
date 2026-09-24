import type { Metadata } from "next";
import { productByKey } from "@/data/site";
import { ContactSection, Details, FaqSection, Features, Holdings, LatestDark, Performance, ProductHero, UseCases, Variants } from "@/components/product/Sections";

const product = productByKey("yield");

export const metadata: Metadata = {
  title: `${product.name} · ${product.full}`,
  description: product.summary,
};

export default function YieldPage() {
  return (
    <>
      <ProductHero product={product} />
      <Performance product={product} />
      <Details product={product} />
      <Features product={product} />
      <Variants product={product} />
      <UseCases product={product} />
      <Holdings product={product} />
      <ContactSection />
      <FaqSection items={product.faqs} />
      <LatestDark topic="VYLD" />
    </>
  );
}
