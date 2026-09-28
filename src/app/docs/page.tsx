import type { Metadata } from "next";
import { BRAND, CHAIN } from "@/config/brand";
import { LAUNCH } from "@/config/treasury";
import { PageHead, Prose } from "@/components/legal/PageHead";
import { FaqBlock } from "@/components/product/ProductShell";

export const metadata: Metadata = {
  title: "Docs & FAQs",
  description: `How ${BRAND.name}, the terminal, the roadmap and the ${BRAND.symbol} token work.`,
};

export default function DocsPage() {
  return (
    <>
      <PageHead
        kicker="Docs & FAQs"
        title="How Valtora Works"
        sub="In Plain Language."
        lead="A short reference for holders, builders and anyone checking our work. It grows with each milestone."
      />
      <Prose
        sections={[
          {
            h: "Overview",
            p: [
              `${BRAND.name} makes the real assets already on ${CHAIN.name} easy to verify, compare and use. The Valtora Terminal is live today. The Treasury Route, Yield Vault and Valtora Index follow as roadmap milestones, each unlocked when the treasury has received enough creator fees to pay for it.`,
              `${BRAND.symbol} is the project token. It launches on ${LAUNCH.launchpad}, and it gives no claim on any asset shown on this site.`,
            ],
          },
          {
            h: "The terminal",
            p: [
              "The terminal lists every official Robinhood stock token that has a Chainlink price feed on Robinhood Chain. Each contract is checked on-chain: it must proxy to Robinhood's token beacon, its symbol must match the ticker, and its name must end in \"Robinhood Token\".",
              "Each asset is priced twice, by its Chainlink feed and by its deepest Uniswap pool, with the gap between them, the distributions credited through the token's multiplier, pool liquidity, 24-hour volume and any Morpho lending market that accepts it.",
            ],
          },
          {
            h: "Network",
            p: [
              `${CHAIN.name} is Ethereum-compatible. Chain id ${CHAIN.id} (${CHAIN.hex}), native currency ${CHAIN.nativeSymbol}, public RPC ${CHAIN.publicRpc}, explorer ${CHAIN.explorer}.`,
              "Connecting a wallet on this site asks it to add or switch to the network automatically.",
            ],
          },
          {
            h: "Connecting a wallet",
            p: [
              "The site discovers browser wallets that announce themselves (EIP-6963) and falls back to the injected provider. Connecting shares only your address. The site asks for a transaction only when you swap on the Treasury Route, and your wallet shows every one before you sign it.",
            ],
          },
          {
            h: "Funding and transparency",
            p: [
              "Creator fees from the launchpad go to the treasury, which pays for the roadmap. The dev wallet sells from its launch buy to pay for early work. Both addresses, their live balances and every treasury payment are on the transparency page.",
            ],
          },
          {
            h: "Contract address",
            p: [
              `The ${BRAND.symbol} contract address is set in one place in the site's source and appears in the header, footer, token and transparency pages. While it reads as a placeholder, no official contract has been published.`,
            ],
          },
        ]}
      />
      <FaqBlock
        items={[
          { q: `What is ${BRAND.symbol}?`, a: `The project token of ${BRAND.name} on ${CHAIN.name}. It is a crypto token and gives no claim on any product or asset.` },
          { q: "Which address is the real contract?", a: "Only the one shown in this site's header, footer and token page. Compare every character." },
          { q: "Does Valtora issue stock tokens?", a: "No. Stock tokens are issued by Robinhood. Valtora verifies them, prices them and, on the roadmap, builds products on top of them." },
          { q: "Who runs Valtora?", a: `An anonymous team that speaks only through ${BRAND.xHandle} on X. Everything that matters is meant to be checkable without knowing who we are.` },
          { q: "When do roadmap products launch?", a: "When the treasury reaches each milestone's funding target, shown live on the roadmap page. There are no dates, on purpose." },
        ]}
      />
    </>
  );
}
