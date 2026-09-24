import type { Metadata } from "next";
import { BRAND, CHAIN } from "@/config/brand";
import { PRODUCTS } from "@/data/site";
import { PageHead, Prose } from "@/components/legal/PageHead";
import { FaqSection } from "@/components/product/Sections";

export const metadata: Metadata = {
  title: "Docs & FAQs",
  description: `How ${BRAND.name}, its planned products and the ${BRAND.symbol} token work.`,
};

export default function DocsPage() {
  const faqs = [
    { q: `What is ${BRAND.symbol}?`, a: `The project token of ${BRAND.name} on ${CHAIN.name}. It is a crypto token and gives no claim on any product or reserve.` },
    { q: "Which address is the real contract?", a: "Only the one shown in this site's header, footer and token page. Compare every character." },
    ...PRODUCTS.flatMap((p) => p.faqs.slice(0, 2)),
  ];
  return (
    <>
      <PageHead kicker="Docs & FAQs" title="How Valtora Works" sub="In Plain Language." lead="A short reference for holders, builders and anyone checking our work. It will grow as each part of the design is finalised." />
      <Prose
        sections={[
          { h: "Overview", p: [`${BRAND.name} is a token project on ${CHAIN.name} designing on-chain access to real-world assets. Three products are planned: Valtora Equities, VYLD and VTSY. None of them is issued yet.`, `${BRAND.symbol} is the project token. It exists separately from the products and is not backed by their assets.`] },
          { h: "Network", p: [`${CHAIN.name} is Ethereum-compatible. Chain id ${CHAIN.id} (${CHAIN.hex}), native currency ${CHAIN.nativeSymbol}, public RPC ${CHAIN.publicRpc}, explorer ${CHAIN.explorer}.`, "Launch App on this site asks your wallet to add or switch to the network automatically."] },
          { h: "Connecting a wallet", p: ["The site discovers browser wallets that announce themselves (EIP-6963) and falls back to the injected provider. Connecting shares only your address. The site never requests a signature or a transaction today.", "Your native balance is read from the public RPC, not from the wallet, so it always reflects Robinhood Chain."] },
          { h: "Products", p: PRODUCTS.map((p) => `${p.name} (${p.full}): ${p.summary}`) },
          { h: "Reporting", p: ["Once products are live, each product page will show tokens outstanding, value of reserves, collateral ratio and holdings, updated daily. Until then those tables show dashes, never sample numbers."] },
          { h: "Contract address", p: [`The ${BRAND.symbol} contract address is configured in one place in the site's source and appears in the header, footer and token page. While it reads as a placeholder, no official contract has been published.`] },
        ]}
      />
      <FaqSection items={faqs} title="Frequently Asked" />
    </>
  );
}
