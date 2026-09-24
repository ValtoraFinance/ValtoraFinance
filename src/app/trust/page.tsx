import type { Metadata } from "next";
import { BRAND } from "@/config/brand";
import { PageHead, Prose } from "@/components/legal/PageHead";

export const metadata: Metadata = {
  title: "Trust & Security",
  description: `How ${BRAND.name} plans to protect assets, keys and code, and how to report a vulnerability.`,
};

export default function TrustPage() {
  return (
    <>
      <PageHead kicker="Trust & Security" title="Security Is a Feature," sub="Not a Footnote." lead="What we commit to before any product holds value, and how to reach us if you find a problem." />
      <Prose
        sections={[
          { h: "Contracts", p: ["Every contract will be reviewed by at least one independent auditor before it holds value. Reports will be linked here, including any open findings.", "Upgrade and admin keys will be held in multi-signature wallets, with the signer policy published."] },
          { h: "Reference assets", p: ["Assets behind each product are to be held by licensed third parties, apart from operating funds, with holdings reported daily and checked by an independent party."] },
          { h: "This website", p: ["The site never asks for a signature or a seed phrase. Connecting a wallet shares only your address. If any page ever asks for your recovery phrase, it is not us."] },
          { id: "bounty", h: "Bug bounty", p: [`Found a vulnerability in the site or, later, in a contract? Email ${BRAND.email} with the subject "Security report". Please give us reasonable time to fix it before disclosure. Reward sizes will be published with the first audited deployment.`] },
          { h: "Impersonation", p: [`The only official channels are ${BRAND.domain} and ${BRAND.xHandle} on X. Contributors never message first, never offer private sales and never ask you to send funds.`] },
        ]}
      />
    </>
  );
}
