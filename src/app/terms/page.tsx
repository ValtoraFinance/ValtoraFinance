import type { Metadata } from "next";
import { BRAND, CHAIN } from "@/config/brand";
import { PageHead, Prose } from "@/components/legal/PageHead";

export const metadata: Metadata = { title: "Terms of Service", description: `Terms for using the ${BRAND.name} website.` };

export default function TermsPage() {
  return (
    <>
      <PageHead kicker="Legal" title="Terms of Service" lead="Last updated 25 September 2026. By using this website you accept these terms." />
      <Prose
        sections={[
          { h: "What this site is", p: [`${BRAND.domain} is an information website for ${BRAND.name} and the ${BRAND.symbol} token on ${CHAIN.name}. It shows public market data and describes roadmap products that do not exist yet and take no deposits.`] },
          { h: "No offer, no advice", p: ["Nothing on this site is an offer to sell, a solicitation to buy, or investment, legal, tax or financial advice. We are not a broker, bank or investment adviser."] },
          { h: "Crypto risk", p: [`${BRAND.symbol} is a crypto token. Its price can fall to zero. You are responsible for your own decisions, your wallet and your keys, and for following the rules where you live.`] },
          { h: "Wallet connection", p: ["Connecting a wallet shares your public address with the page in your browser. We do not custody funds or hold keys. The only transactions the site requests are approvals and swaps on the Treasury Route, which you review and sign in your own wallet and which go directly to Uniswap's contracts."] },
          { h: "Third-party services", p: ["The site reads public data from blockchain RPC endpoints, Chainlink price feeds, Dexscreener and Morpho, and links to a block explorer. We do not control them and are not responsible for their availability or accuracy."] },
          { h: "Changes", p: ["We may update the site and these terms at any time. The date above shows the latest version."] },
        ]}
      />
    </>
  );
}
