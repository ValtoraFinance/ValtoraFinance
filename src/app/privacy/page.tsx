import type { Metadata } from "next";
import { BRAND } from "@/config/brand";
import { PageHead, Prose } from "@/components/legal/PageHead";

export const metadata: Metadata = { title: "Privacy Policy", description: `How the ${BRAND.name} website handles data.` };

export default function PrivacyPage() {
  return (
    <>
      <PageHead kicker="Legal" title="Privacy Policy" lead="Last updated 24 September 2026. Short version: we collect almost nothing." />
      <Prose
        sections={[
          { h: "No accounts", p: ["The site has no sign-up and no database of visitors. The contact and newsletter forms do not send anything to our servers: the contact form opens your own email app, and the newsletter form only shows a message."] },
          { h: "Stored in your browser", p: ["Your browser keeps two small entries in local storage: the wallet you last connected (address and wallet name), and whether you dismissed the first-visit notice. You can clear them at any time."] },
          { h: "Public blockchain data", p: ["When a wallet is connected, your browser asks a public RPC endpoint for your balance. Blockchain data is public by nature."] },
          { h: "Server logs", p: ["Our hosting provider may keep standard request logs, such as IP address and user agent, for security and reliability."] },
          { h: "Contact", p: [`Questions about privacy: ${BRAND.email}.`] },
        ]}
      />
    </>
  );
}
