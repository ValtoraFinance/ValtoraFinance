import type { Metadata } from "next";
import { BRAND } from "@/config/brand";
import { PageHead, Prose } from "@/components/legal/PageHead";

export const metadata: Metadata = {
  title: "Trust & Security",
  description: `What ${BRAND.name} commits to before any contract holds value, and how to report a vulnerability.`,
};

export default function TrustPage() {
  return (
    <>
      <PageHead
        kicker="Trust & Security"
        title="Trust the Code,"
        sub="Not the Team."
        lead="The team is anonymous on purpose. That only works if everything that matters can be checked without knowing who we are."
      />
      <Prose
        sections={[
          {
            h: "Build on audited protocols",
            p: [
              "Valtora does not rebuild what already exists. Prices come from Chainlink, lending from Morpho and swaps from Uniswap, all of them already deployed and audited on Robinhood Chain.",
              "Valtora writes its own contracts only where nothing suitable exists, starting with the Index at milestone M3.",
            ],
          },
          {
            h: "Our own contracts",
            p: [
              "Every Valtora contract will be verified on the explorer and published in the public repository before it takes deposits.",
              "Contracts ship without an owner where possible. Where a parameter must change, the change goes through a timelock so anyone can see it coming.",
              "The Index opens with a deposit cap and an independent audit is funded from the treasury before that cap is raised. The report will be linked here, including open findings.",
            ],
          },
          {
            h: "Stock token risk",
            p: [
              "Robinhood stock tokens are issued by Robinhood. Their contracts let the issuer pause transfers, block addresses and burn balances, and that applies to any contract holding them, including a Valtora one. We cannot remove that risk, so we state it.",
            ],
          },
          {
            h: "This website",
            p: [
              "The site never asks for a seed phrase and never asks you to sign a message. The only transactions it requests are on the Treasury Route: an approval of the exact amount for Uniswap's SwapRouter02, and the swap sent to that router. Your wallet shows both before you confirm. If any page ever asks for your recovery phrase, it is not us.",
            ],
          },
          {
            id: "bounty",
            h: "Reporting a vulnerability",
            p: [
              `Found a problem in the site or, later, in a contract? Send a direct message to ${BRAND.xHandle} on X saying you have a security report, without details, and we will agree a private channel. Please give us reasonable time to fix it before disclosure. Rewards will be paid on-chain from the treasury, with sizes published alongside the first audited contract.`,
            ],
          },
          {
            h: "Impersonation",
            p: [
              `The only official channels are ${BRAND.domain} and ${BRAND.xHandle} on X. Contributors never message first, never offer private sales and never ask you to send funds.`,
            ],
          },
        ]}
      />
    </>
  );
}
