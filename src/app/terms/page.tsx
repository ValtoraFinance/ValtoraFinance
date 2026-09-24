import type { Metadata } from "next";
import { BRAND, CHAIN } from "@/config/brand";
import { PageHead, Prose } from "@/components/legal/PageHead";

export const metadata: Metadata = { title: "Terms of Service", description: `Terms for using the ${BRAND.name} website.` };

export default function TermsPage() {
  return (
    <>
      <PageHead kicker="Legal" title="Terms of Service" lead="Last updated 24 September 2026. By using this website you accept these terms." />
      <Prose
        sections={[
          { h: "What this site is", p: [`${BRAND.domain} is an information website for ${BRAND.name} and the ${BRAND.symbol} token on ${CHAIN.name}. It describes planned products that are not issued or offered to anyone.`] },
          { h: "No offer, no advice", p: ["Nothing on this site is an offer to sell, a solicitation to buy, or investment, legal, tax or financial advice. We are not a broker, bank or investment adviser."] },
          { h: "Crypto risk", p: [`${BRAND.symbol} is a crypto token. Its price can fall to zero. You are responsible for your own decisions, your wallet and your keys, and for following the rules where you live.`] },
          { h: "Wallet connection", p: ["Connecting a wallet shares your public address with the page in your browser. We do not custody funds, request signatures or hold keys."] },
          { h: "Third-party services", p: ["The site reads public data from blockchain RPC endpoints, a block explorer and a public market data source. We do not control them and are not responsible for their availability or accuracy."] },
          { h: "Changes", p: ["We may update the site and these terms at any time. The date above shows the latest version."] },
        ]}
      />
    </>
  );
}
