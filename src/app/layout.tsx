import type { Metadata, Viewport } from "next";
import { Figtree, Newsreader, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { BRAND } from "@/config/brand";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { WalletProvider } from "@/components/wallet/WalletProvider";
import { WalletModalProvider } from "@/components/wallet/WalletButton";
import { RevealObserver } from "@/components/Reveal";
import { Notice } from "@/components/Notice";

const sans = Figtree({ subsets: ["latin"], variable: "--font-figtree", display: "swap" });
const serif = Newsreader({ subsets: ["latin"], variable: "--font-newsreader", display: "swap", weight: ["400", "500"] });
const mono = IBM_Plex_Mono({ subsets: ["latin"], variable: "--font-plex-mono", display: "swap", weight: ["400", "500"] });

const title = `${BRAND.name} — ${BRAND.slogan}`;

export const metadata: Metadata = {
  metadataBase: new URL(BRAND.url),
  title: { default: title, template: `%s · ${BRAND.name}` },
  description: BRAND.description,
  keywords: ["tokenized assets", "real-world assets", "RWA", "Robinhood Chain", "tokenized equities", "yield token", BRAND.symbol],
  openGraph: {
    type: "website",
    url: BRAND.url,
    siteName: BRAND.name,
    title,
    description: BRAND.description,
    images: [{ url: "/brand/og.webp", width: 1500, height: 500 }],
  },
  twitter: {
    card: "summary_large_image",
    site: BRAND.xHandle,
    title,
    description: BRAND.description,
    images: ["/brand/og.webp"],
  },
};

export const viewport: Viewport = { themeColor: "#0c0a17" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable} ${mono.variable}`}>
      <body className="min-h-dvh overflow-x-hidden font-sans antialiased">
        <WalletProvider>
          <WalletModalProvider>
            <SiteHeader />
            <main>{children}</main>
            <SiteFooter />
            <Notice />
            <RevealObserver />
          </WalletModalProvider>
        </WalletProvider>
      </body>
    </html>
  );
}
