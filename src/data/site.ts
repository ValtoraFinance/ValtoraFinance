import { BRAND } from "@/config/brand";

/* ------------------------------------------------------------------ */
/* Navigation                                                          */
/* ------------------------------------------------------------------ */

export type NavItem = {
  label: string;
  href: string;
  blurb: string;
  tag?: string;
  icon: "equities" | "yield" | "treasury" | "rails" | "network" | "bridge" | "convert" | "insights" | "blog" | "learn" | "ecosystem" | "grants" | "docs" | "trust" | "careers" | "team" | "contact" | "token";
};

export type NavGroup = { label: string; items: NavItem[] };
export type NavMenu = { label: string; groups: NavGroup[]; feature?: boolean };

export const NAV: NavMenu[] = [
  {
    label: "Products",
    feature: true,
    groups: [
      {
        label: "Assets",
        items: [
          { label: "VYLD", tag: "At launch", href: "/yield", blurb: "A dollar yield note that travels like a stablecoin.", icon: "yield" },
          { label: "VTSY", tag: "For treasury desks", href: "/treasury", blurb: "Short-dated government debt, held on-chain.", icon: "treasury" },
        ],
      },
      {
        label: "Platforms & Protocols",
        items: [
          { label: "Valtora Equities", tag: "At launch", href: "/equities", blurb: "Listed-share exposure as transferable tokens.", icon: "equities" },
          { label: "Valtora Rails", tag: "For issuers", href: "/#rails", blurb: "Always-on mint and redeem for tokenized funds.", icon: "rails" },
          { label: `${BRAND.symbol}`, href: "/token", blurb: "The project token on Robinhood Chain.", icon: "token" },
        ],
      },
      {
        label: "Infrastructure",
        items: [
          { label: "Valtora Network", href: "/insights/valtora-network-settlement-layer", blurb: "A settlement layer shaped around market hours that never close.", icon: "network" },
          { label: "Bridge", href: "/app?tab=bridge", blurb: "Move Valtora assets between supported chains.", icon: "bridge" },
          { label: "Converter", href: "/app?tab=convert", blurb: "Switch between accruing and rebasing units.", icon: "convert" },
        ],
      },
    ],
  },
  {
    label: "Resources",
    groups: [
      {
        label: "Resources",
        items: [
          { label: "Insights", href: "/insights", blurb: "Research notes, essays and market commentary.", icon: "insights" },
          { label: "Blog", href: "/blog", blurb: "Product news and release notes.", icon: "blog" },
          { label: "Valtora Learn", href: "/learn", blurb: "Plain-language lessons on tokenized assets.", icon: "learn" },
        ],
      },
    ],
  },
  {
    label: "Ecosystem",
    groups: [
      {
        label: "Ecosystem",
        items: [
          { label: "Valtora Ecosystem", href: "/ecosystem", blurb: "Chains, wallets and tools the platform works with.", icon: "ecosystem" },
          { label: "Builder Grants", href: "/grants", blurb: "Support for teams building on tokenized assets.", icon: "grants" },
        ],
      },
    ],
  },
  {
    label: "About",
    groups: [
      {
        label: "About",
        items: [
          { label: "Docs & FAQs", href: "/docs", blurb: "How the products, token and app work.", icon: "docs" },
          { label: "Trust & Security", href: "/trust", blurb: "How assets, keys and code are protected.", icon: "trust" },
          { label: "Careers", href: "/team#careers", blurb: "Open seats on a small, remote team.", icon: "careers" },
          { label: "Team", href: "/team", blurb: "Why we build and who does the work.", icon: "team" },
          { label: "Contact Us", href: "/contact", blurb: "Questions, partnerships and press.", icon: "contact" },
        ],
      },
    ],
  },
];

export const FOOTER_COLUMNS: { title: string; links: { label: string; href: string; external?: boolean }[] }[] = [
  {
    title: "Invest",
    links: [
      { label: "VYLD", href: "/yield" },
      { label: "VTSY", href: "/treasury" },
      { label: "Bridge", href: "/app?tab=bridge" },
      { label: "Convert", href: "/app?tab=convert" },
      { label: "Valtora Equities", href: "/equities" },
    ],
  },
  {
    title: "Partners",
    links: [
      { label: "Ecosystem", href: "/ecosystem" },
      { label: "Builder Grants", href: "/grants" },
      { label: `${BRAND.symbol} Token`, href: "/token" },
    ],
  },
  {
    title: "Explore",
    links: [
      { label: "Insights", href: "/insights" },
      { label: "Docs", href: "/docs" },
      { label: "Trust & Security", href: "/trust" },
      { label: "Bug Bounty", href: "/trust#bounty" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Team", href: "/team" },
      { label: "Careers", href: "/team#careers" },
      { label: "Media Kit", href: "/media" },
      { label: "Contact Us", href: "/contact" },
      { label: "Media Inquiries", href: `mailto:${BRAND.email}` },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Products                                                            */
/* ------------------------------------------------------------------ */

export type ProductKey = "equities" | "yield" | "treasury";

export type Product = {
  key: ProductKey;
  name: string;
  full: string;
  href: string;
  accent: string;
  accentSoft: string;
  tint: string;
  deep: string;
  summary: string;
  badge?: string;
  typed: string[];
  typedLead: string;
  heroCopy: string;
  primaryCta: string;
  secondaryCta: string;
  /** Headline numbers on the product hero. Nothing here is live yet. */
  stats: { label: string; value: string; note?: string }[];
  performance: { title: string; body: string };
  details: { label: string; value: string }[];
  features: { title: string; body: string }[];
  variants?: { name: string; kind: string; body: string; example: string }[];
  useCases: { title: string; body: string }[];
  holdings: { share: string; position: string; weight: string; maturity: string; yield: string }[];
  faqs: { q: string; a: string }[];
};

export const PRODUCTS: Product[] = [
  {
    key: "equities",
    name: "Valtora Equities",
    full: "Valtora Equities",
    href: "/equities",
    accent: "#6d4cf0",
    accentSoft: "#c9bcff",
    tint: "#efebff",
    deep: "#2a1a6e",
    badge: "At launch",
    summary:
      "Valtora Equities is the planned venue for share exposure on Robinhood Chain: tokens that follow listed companies and can move between wallets and apps like any other asset.",
    typedLead: "The Open Standard for",
    typed: ["Tokenized Shares", "Tokenized Funds", "Global Portfolios"],
    heroCopy:
      "A planned platform that carries listed-share exposure on-chain, as tokens you can hold, send and plug into on-chain apps, subject to eligibility rules at launch.",
    primaryCta: "Join the Launch List",
    secondaryCta: "Read the Docs",
    stats: [
      { label: "Launch basket", value: "12 names", note: "planned" },
      { label: "Network", value: "Robinhood Chain" },
      { label: "Holders", value: "—", note: "at launch" },
    ],
    performance: {
      title: "Markets That Keep Your Hours.",
      body: "Traditional exchanges close at night and on weekends. A token does not. Valtora Equities is designed so positions can be opened, moved and settled when you are ready, with the underlying share market as the reference.",
    },
    details: [
      { label: "Eligibility", value: "Set per jurisdiction at launch" },
      { label: "Reference assets", value: "Listed shares and exchange-traded funds" },
      { label: "Settlement", value: "On-chain, Robinhood Chain" },
      { label: "Transferability", value: "Wallet to wallet, subject to rules" },
      { label: "Corporate actions", value: "Reflected in token supply or price" },
      { label: "Status", value: "In design, not yet issued" },
    ],
    features: [
      { title: "Always Open", body: "Mint and redeem windows planned for every day of the week, not only exchange hours." },
      { title: "Transferable", body: "Send exposure between wallets without a broker transfer form." },
      { title: "Composable", body: "Use positions as collateral or liquidity in on-chain apps that support them." },
      { title: "Clear Backing", body: "Each token maps to a documented reference holding, published on a schedule." },
      { title: "Low Minimums", body: "Fractional units from the first day, sized in dollars rather than shares." },
      { title: "Readable Rules", body: "Eligibility and limits written in plain language before anything goes live." },
    ],
    useCases: [
      { title: "Weekend Rebalancing", body: "Adjust a portfolio when news breaks, not on Monday morning." },
      { title: "Collateral", body: "Post share exposure into lending markets that accept it." },
      { title: "Global Access", body: "Reach listed markets from a wallet, where rules allow." },
      { title: "Treasury Diversification", body: "Hold a slice of equity exposure beside stable assets." },
    ],
    holdings: [
      { share: "—", position: "Reference share basket", weight: "—", maturity: "n/a", yield: "—" },
      { share: "—", position: "Dollar cash buffer", weight: "—", maturity: "1 day", yield: "—" },
    ],
    faqs: [
      { q: "Can I buy Valtora Equities today?", a: "No. The product is in design. Nothing is issued yet, and this page describes the plan." },
      { q: "Is a token the same as owning the share?", a: "No. A token gives economic exposure to a reference asset under the terms published at launch. It does not make you a registered shareholder." },
      { q: "Where will it run?", a: "On Robinhood Chain, an Ethereum-compatible network. You will need a wallet that can add custom networks." },
      { q: "Who will be eligible?", a: "Eligibility depends on where you live. The rules will be published before launch, and some regions will be excluded." },
    ],
  },
  {
    key: "yield",
    name: "VYLD",
    full: "Valtora Yield Note",
    href: "/yield",
    accent: "#4a78d1",
    accentSoft: "#bcd0f2",
    tint: "#e4edfb",
    deep: "#1c3a73",
    badge: "At launch",
    summary:
      "A planned dollar note designed to move like a stablecoin while passing through the return of short-term government debt.",
    typedLead: "The New Standard for",
    typed: ["Idle Dollars", "Payments", "Savings"],
    heroCopy:
      "VYLD is a planned yield-bearing dollar token. It is designed to accrue value every day while staying simple to send, hold and use across on-chain apps.",
    primaryCta: "Join the Launch List",
    secondaryCta: "Redeem (at launch)",
    stats: [
      { label: "Price", value: "—", note: "at launch" },
      { label: "Target yield", value: "—", note: "set at launch" },
      { label: "TVL", value: "—", note: "at launch" },
    ],
    performance: {
      title: "Quiet, Daily Accrual.",
      body: "VYLD is designed so that value builds a little every day, the way a savings balance does, while the token itself stays freely transferable. The chart shows an illustrative path, not a record.",
    },
    details: [
      { label: "Eligibility", value: "Non-restricted regions, confirmed at launch" },
      { label: "Reference assets", value: "Short-term government bills and bank deposits" },
      { label: "Liquidity", value: "Daily mint and redeem, planned" },
      { label: "Transferability", value: "Freely transferable, planned" },
      { label: "Structure", value: "Documented at launch" },
      { label: "Use", value: "Cash management and collateral" },
      { label: "Network", value: "Robinhood Chain" },
    ],
    features: [
      { title: "Widely Usable", body: "Built to plug into wallets, exchanges and on-chain apps that list it." },
      { title: "Yield-Bearing", body: "Designed to pass through the return of the reference assets." },
      { title: "Permissionless Transfers", body: "Move VYLD between wallets and contracts without a gatekeeper." },
      { title: "Daily Liquidity", body: "Mint and redeem windows planned every day, including weekends." },
      { title: "Published Reserves", body: "Reserve reports are planned on a fixed schedule, from a third party." },
      { title: "Ring-Fenced", body: "Reference assets are to be held apart from operating funds." },
    ],
    variants: [
      { name: "VYLD", kind: "Accruing", body: "The unit price rises as yield accrues. Your token count stays the same.", example: "Hold 100 VYLD at $1.00. Later, the same 100 tokens are each worth a little more." },
      { name: "rVYLD", kind: "Rebasing", body: "The unit price stays at $1. Yield arrives as new tokens in your wallet.", example: "Hold 100 rVYLD at $1.00. Later, you hold slightly more than 100 tokens at $1.00." },
    ],
    useCases: [
      { title: "On-chain Savings", body: "Park dollars in a token that is designed to grow." },
      { title: "Collateral", body: "Post a yield-bearing asset into lending markets." },
      { title: "Payments", body: "Pay and settle in a dollar unit that keeps earning." },
      { title: "Treasury", body: "Hold operating cash for a DAO or company on-chain." },
    ],
    holdings: [
      { share: "—", position: "Short-term government bills", weight: "—", maturity: "< 90 days", yield: "—" },
      { share: "—", position: "Bank deposits", weight: "—", maturity: "1 day", yield: "—" },
    ],
    faqs: [
      { q: "What is a yield-bearing dollar token?", a: "A token that tracks the dollar while passing through interest earned on the assets behind it." },
      { q: "Is VYLD live?", a: "No. It is planned. Figures on this page are placeholders until launch." },
      { q: "How will I mint or redeem?", a: "Through the Valtora app on Robinhood Chain, once eligibility checks are in place." },
      { q: "Does VYLD have a fixed yield?", a: "No. Any return depends on the reference assets and will change over time." },
    ],
  },
  {
    key: "treasury",
    name: "VTSY",
    full: "Valtora Treasury Ledger",
    href: "/treasury",
    accent: "#16935b",
    accentSoft: "#bfe3cf",
    tint: "#e3f3ea",
    deep: "#0f4a31",
    badge: "For treasury desks",
    summary:
      "Built for treasury desks, VTSY is a planned token for exposure to short-dated government debt, with minting and redemption around the clock.",
    typedLead: "The Treasury Standard for",
    typed: ["Dollar Yield", "Idle Reserves", "On-chain Desks"],
    heroCopy:
      "VTSY is a planned token for professional holders who want short-dated government debt on-chain, with instant mint and redeem windows and reporting you can check.",
    primaryCta: "Request Access",
    secondaryCta: "Redeem (at launch)",
    stats: [
      { label: "Price", value: "—", note: "at launch" },
      { label: "Target yield", value: "—", note: "set at launch" },
      { label: "TVL", value: "—", note: "at launch" },
    ],
    performance: {
      title: "Steady by Design.",
      body: "VTSY is shaped around the slow, steady return of short-dated government debt. The line below is an illustrative model of how accrual works, not a performance record.",
    },
    details: [
      { label: "Eligibility", value: "Professional holders, confirmed at launch" },
      { label: "Reference assets", value: "Short-dated government bills" },
      { label: "Minimum mint", value: "Set at launch" },
      { label: "Minimum redemption", value: "Set at launch" },
      { label: "Fees", value: "Published before launch" },
      { label: "Liquidity", value: "24/7 mint and redeem, planned" },
      { label: "Network", value: "Robinhood Chain" },
    ],
    features: [
      { title: "Yield-Bearing", body: "Built to track short-dated government debt returns." },
      { title: "Always-On Liquidity", body: "Mint and redeem planned at any hour, any day." },
      { title: "Low Minimums", body: "Entry sizes designed for desks of every size." },
      { title: "Quality Assets", body: "Reference holdings limited to short-dated government paper." },
      { title: "Reported Daily", body: "Holdings and value published every day, planned." },
      { title: "Clear Eligibility", body: "Access rules written out before the first mint." },
    ],
    useCases: [
      { title: "Cash Management", body: "Hold reserves in an asset that keeps working." },
      { title: "Lending", body: "Use VTSY as collateral where it is accepted." },
      { title: "Settlement", body: "Settle between desks without waiting on bank hours." },
    ],
    holdings: [
      { share: "—", position: "Government bills, 1–3 months", weight: "—", maturity: "< 90 days", yield: "—" },
      { share: "—", position: "Government bills, 3–6 months", weight: "—", maturity: "< 180 days", yield: "—" },
      { share: "—", position: "Dollar cash", weight: "—", maturity: "1 day", yield: "—" },
    ],
    faqs: [
      { q: "Who is VTSY for?", a: "Professional holders such as funds, desks and companies. Eligibility will be confirmed at launch." },
      { q: "Is VTSY live?", a: "No. It is planned, and every figure on this page is a placeholder until launch." },
      { q: "What backs VTSY?", a: "The plan is short-dated government bills plus a small cash buffer, reported on a schedule." },
      { q: "What is the minimum?", a: "Minimum sizes will be published before the first mint." },
    ],
  },
];

export const productByKey = (key: ProductKey) => PRODUCTS.find((p) => p.key === key)!;

/* ------------------------------------------------------------------ */
/* Articles (insights, blog, news carousel)                            */
/* ------------------------------------------------------------------ */

export type Article = {
  slug: string;
  title: string;
  kind: "Article" | "Research" | "Update" | "Podcast" | "Explainer";
  topic: string;
  date: string;
  excerpt: string;
  art: number;
  body: string[];
  blog?: boolean;
  featured?: boolean;
};

export const ARTICLES: Article[] = [
  {
    slug: "valtora-network-settlement-layer",
    title: "Introducing the Valtora Network: Settlement Shaped for Markets That Never Close",
    kind: "Update",
    topic: "Valtora Network",
    date: "2026-09-22",
    excerpt:
      "Our plan for a settlement layer that treats nights, weekends and holidays as ordinary trading hours, built on Robinhood Chain.",
    art: 0,
    featured: true,
    blog: true,
    body: [
      "Most of the world's financial plumbing was designed around office hours. Trades clear on business days, money moves when banks are open, and anything that happens on a Saturday waits until Monday. That made sense when every step involved paperwork. It makes less sense when the asset is a token and the ledger is always on.",
      "The Valtora Network is our name for the settlement layer we are designing on Robinhood Chain. Its job is simple to describe: when two parties agree to swap a tokenized asset for dollars, both sides should move together, at any hour, with a record anyone can check.",
      "In practice that means three components. A mint and redeem path that is open every day. A pricing rule that says which reference price applies when the underlying market is closed. And a reporting feed that publishes holdings on a fixed schedule, so the numbers behind each token are not a matter of trust.",
      "None of this is live yet. We are publishing the design early because the rules matter more than the code, and we would rather hear objections now than after launch. The documentation section of this site will be updated as each piece is specified.",
    ],
  },
  {
    slug: "why-robinhood-chain",
    title: "Why We Chose Robinhood Chain for Tokenized Assets",
    kind: "Article",
    topic: "Infrastructure",
    date: "2026-09-18",
    excerpt:
      "An Ethereum-compatible network with a clear focus on real-world assets. Here is what we weighed before committing.",
    art: 1,
    featured: true,
    blog: true,
    body: [
      "Picking a home network for tokenized assets is less about raw speed and more about fit. We looked for three things: compatibility with the tools holders already use, a community that cares about real-world assets, and costs low enough that small positions make sense.",
      "Robinhood Chain is Ethereum-compatible, which means standard wallets such as MetaMask and Rabby can connect with a single network addition. Contracts written for Ethereum run without rewrites, and existing security tooling carries over.",
      "Fees are low enough that daily accrual and small transfers are practical. That matters for a yield-bearing token, where the whole point is that value builds a little at a time.",
      `We will keep the door open to other networks later, through a bridge, but Robinhood Chain is where Valtora starts and where the ${BRAND.symbol} token lives.`,
    ],
  },
  {
    slug: "accruing-vs-rebasing",
    title: "Accruing or Rebasing? Two Ways to Hold a Yield-Bearing Dollar",
    kind: "Explainer",
    topic: "VYLD",
    date: "2026-09-12",
    excerpt:
      "One token grows in price, the other grows in quantity. Both are planned for VYLD, and you can switch between them.",
    art: 2,
    featured: true,
    blog: true,
    body: [
      "A yield-bearing dollar has to show its return somewhere. There are two common answers, and VYLD is planned to support both.",
      "An accruing token keeps your balance fixed and lets the price rise. If you hold 100 units, you still hold 100 units next month, but each is worth slightly more. This is simple for accounting and works well as collateral.",
      "A rebasing token keeps the price pinned to one dollar and adds new units to your wallet instead. You see the return as a growing balance, which feels familiar if you are used to a savings account.",
      "The converter in the Valtora app is designed to switch between the two at the current rate, with no spread. Until launch, the converter is visible but disabled.",
    ],
  },
  {
    slug: "tokenized-treasuries-primer",
    title: "A Primer on Tokenized Government Debt",
    kind: "Research",
    topic: "VTSY",
    date: "2026-09-05",
    excerpt:
      "What a tokenized bill is, what it is not, and the questions every holder should ask before buying one.",
    art: 3,
    body: [
      "Short-dated government bills are one of the plainest assets in finance: a promise to repay a fixed amount on a near date. Tokenizing them does not change that promise. It changes how ownership is recorded and moved.",
      "A tokenized bill product usually holds the bills through a legal entity and issues tokens that represent a share of that entity's assets. The token is only as good as that structure, so the first question is always: who holds the assets, and what happens if the issuer fails?",
      "The second question is reporting. How often are holdings published, and who checks them? Daily reports from an independent party are the standard we are designing VTSY against.",
      "The third is liquidity. Can you redeem at any hour, or only on business days? Always-on redemption is one of the main reasons to hold a tokenized version at all.",
    ],
  },
  {
    slug: "reading-a-reserve-report",
    title: "How to Read a Reserve Report in Five Minutes",
    kind: "Explainer",
    topic: "Trust",
    date: "2026-08-29",
    excerpt:
      "Reserve reports can look dense. Four numbers tell you most of what you need to know.",
    art: 4,
    blog: true,
    body: [
      "A reserve report is a snapshot of what backs a token at a point in time. It can run to many pages, but four numbers carry most of the weight.",
      "Tokens outstanding: how many units exist. Value of reserves: what the assets behind them are worth. Collateral ratio: the second number divided by the first. And weighted maturity: how long, on average, until the assets pay back.",
      "A ratio at or above one means the reserves cover the tokens. A short maturity means the assets can be turned into cash quickly. Beyond that, check the date of the report and who signed it.",
      "Valtora plans to publish these four figures on each product page once products are live. Until then, the tables show dashes rather than invented numbers.",
    ],
  },
  {
    slug: "the-valtora-token",
    title: `${BRAND.symbol}: What the Token Is For`,
    kind: "Update",
    topic: `${BRAND.symbol}`,
    date: "2026-08-24",
    excerpt:
      "A short note on the project token, where it lives, and how to check the contract address.",
    art: 5,
    blog: true,
    body: [
      `${BRAND.symbol} is the project token of Valtora Finance on Robinhood Chain. It is a crypto token, not a share in a company and not a claim on any fund or reserve.`,
      "The only contract address we recognise is the one shown in the header of this site and on the token page. Anyone can deploy a token with the same name, so always compare the full address before you interact with a contract.",
      "Until the address is published, the site shows a placeholder. Nothing is for sale through this website, and no team member will ever message you first asking for funds.",
    ],
  },
  {
    slug: "weekend-markets",
    title: "The Case for Weekend Markets",
    kind: "Article",
    topic: "Markets",
    date: "2026-08-15",
    excerpt:
      "News does not wait for Monday. We look at why always-on access matters for ordinary holders.",
    art: 6,
    body: [
      "Big news often breaks when exchanges are closed. Holders then watch prices gap at the next open with no chance to act in between.",
      "Tokenized exposure can narrow that gap. If a token can be minted and redeemed on a Saturday, holders can at least adjust their exposure, even if the underlying market is closed.",
      "That raises a hard question: what price applies when the reference market is shut? Our design uses the last official close plus a published adjustment rule, and we will document the rule in full before launch.",
    ],
  },
  {
    slug: "podcast-building-in-public",
    title: "Podcast: Building a Tokenized Asset Platform in Public",
    kind: "Podcast",
    topic: "Company",
    date: "2026-08-08",
    excerpt:
      "Two contributors talk through the roadmap, the trade-offs, and why we publish designs before code.",
    art: 7,
    body: [
      "In this episode, two Valtora contributors walk through the roadmap from the first design notes to the planned launch on Robinhood Chain.",
      "They cover why the team publishes designs early, how eligibility rules shape the product, and what a small team can realistically ship in its first year.",
      "A transcript will be added here when the episode is published.",
    ],
  },
  {
    slug: "collateral-that-earns",
    title: "Collateral That Earns: Yield-Bearing Assets in Lending Markets",
    kind: "Research",
    topic: "DeFi",
    date: "2026-07-30",
    excerpt:
      "Posting a yield-bearing token as collateral changes the maths of borrowing. Here is how.",
    art: 8,
    body: [
      "When collateral earns a return, the effective cost of a loan falls by that return. That simple idea is why yield-bearing dollars are attractive in lending markets.",
      "The trade-off is complexity. Lending protocols need a reliable price for the collateral and a clear rule for how accrual is reflected. Accruing tokens are usually easier to integrate than rebasing ones for this reason.",
      "Any integration of Valtora assets into lending markets will be listed on the ecosystem page, with the terms of each market linked from there.",
    ],
  },
  {
    slug: "eligibility-explained",
    title: "Eligibility, Explained Without the Legal Language",
    kind: "Explainer",
    topic: "Compliance",
    date: "2026-07-21",
    excerpt:
      "Why some products are open to everyone, some to professionals only, and some not in certain regions.",
    art: 9,
    body: [
      "Financial products are regulated differently around the world. A product that anyone can hold in one country may be limited to professionals in another, and not allowed at all in a third.",
      "Tokenized products inherit those rules from the assets behind them. That is why each Valtora product page lists eligibility separately, and why some are marked for professional holders only.",
      "The exact rules will be published before launch. Until then, treat every product on this site as not yet available to anyone.",
    ],
  },
];

export const articleBySlug = (slug: string) => ARTICLES.find((a) => a.slug === slug);

export function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

/* ------------------------------------------------------------------ */
/* Home: theses (quote carousel) and principles                       */
/* ------------------------------------------------------------------ */

export const THESES = [
  { label: "Thesis 01", role: "Settlement", quote: "Money should settle when people are ready, not when a back office opens. The ledger never sleeps, so the market should not either." },
  { label: "Thesis 02", role: "Transparency", quote: "Every token should come with a receipt. Holdings, reserves and rules published on a schedule, where anyone can read them." },
  { label: "Thesis 03", role: "Access", quote: "A good asset should not require a private banker. If the rules allow it, a wallet should be enough to hold it." },
  { label: "Thesis 04", role: "Composability", quote: "Assets become more useful when they can meet each other. A yield note that can be collateral is worth more than one that sits still." },
  { label: "Thesis 05", role: "Restraint", quote: "Launch fewer things and explain them well. A small product with clear rules beats a large one nobody can read." },
];

export const BELIEFS = [
  { word: "Open Finance", body: "Today's financial system is powerful but narrow: high fees, closed doors and slow settlement leave billions of people outside it." },
  { word: "Better Systems", body: "Public ledgers can fix what paperwork cannot. We design platforms, assets and infrastructure that carry real markets on-chain." },
  { word: "Fair Access", body: "Combining the discipline of traditional finance with the openness of crypto can make markets fairer, faster and easier to reach." },
];

export const PRINCIPLES = [
  { title: "Quality Reference Assets", body: "Products are designed around plain, liquid reference assets such as short-dated government debt and listed shares." },
  { title: "Regulated Service Providers", body: "Custody, administration and audits are planned with licensed third parties, named before launch." },
  { title: "Experienced Contributors", body: "The team brings years of work across trading, software and compliance." },
  { title: "Audited Contracts", body: "Every contract is to be reviewed by independent auditors before it holds value." },
  { title: "Compliance First", body: "Eligibility rules come before features. If a product cannot be offered properly, it waits." },
];

export const RAILS_TOKENS = [
  { name: "T-BILL", mark: "TB", color: "#3b6fd8" },
  { name: "EQUITY", mark: "EQ", color: "#6d4cf0" },
  { name: "BOND", mark: "BD", color: "#16935b" },
  { name: "GOLD", mark: "AU", color: "#c49a2c" },
  { name: "CREDIT", mark: "CR", color: "#d9573f" },
  { name: "REIT", mark: "RE", color: "#2a9fb0" },
  { name: "CASH", mark: "$", color: "#7a7a88" },
];

export const ASSET_CLASSES = ["Equities", "Treasuries", "Money Markets", "Commodities", "Private Credit", "Real Estate", "Funds", "Bonds"];

/* ------------------------------------------------------------------ */
/* Ecosystem                                                           */
/* ------------------------------------------------------------------ */

export type EcoEntry = { name: string; category: string; blurb: string; href?: string; status: "Works today" | "Open seat" };

export const ECOSYSTEM: EcoEntry[] = [
  { name: "Robinhood Chain", category: "Chain", blurb: `Ethereum-compatible network where Valtora and ${BRAND.symbol} live.`, href: "https://robinhoodchain.blockscout.com", status: "Works today" },
  { name: "Blockscout", category: "Explorer", blurb: "Public block explorer for Robinhood Chain transactions and contracts.", href: "https://robinhoodchain.blockscout.com", status: "Works today" },
  { name: "MetaMask", category: "Wallet", blurb: "Browser wallet that can add Robinhood Chain as a custom network.", status: "Works today" },
  { name: "Rabby", category: "Wallet", blurb: "Multi-chain browser wallet with custom network support.", status: "Works today" },
  { name: "Rainbow", category: "Wallet", blurb: "Wallet with EIP-6963 discovery, detected automatically by the app.", status: "Works today" },
  { name: "OKX Wallet", category: "Wallet", blurb: "Browser wallet that announces itself to the app over EIP-6963.", status: "Works today" },
  { name: "Brave Wallet", category: "Wallet", blurb: "Built-in browser wallet that supports custom EVM networks.", status: "Works today" },
  { name: "PublicNode", category: "Infrastructure", blurb: "Public RPC endpoint used as a read fallback by this site.", status: "Works today" },
  { name: "Lending market", category: "DeFi", blurb: "Seat for a lending protocol that accepts Valtora assets as collateral.", status: "Open seat" },
  { name: "Spot exchange", category: "Exchanges", blurb: `Seat for a venue listing VYLD and ${BRAND.symbol} pairs.`, status: "Open seat" },
  { name: "Custodian", category: "Custody", blurb: "Seat for a licensed custodian holding reference assets.", status: "Open seat" },
  { name: "Fund administrator", category: "Service Provider", blurb: "Seat for daily valuation and reserve reporting.", status: "Open seat" },
  { name: "Auditor", category: "Service Provider", blurb: "Seat for independent contract and reserve audits.", status: "Open seat" },
  { name: "Oracle", category: "Infrastructure", blurb: "Seat for a price feed covering reference assets.", status: "Open seat" },
  { name: "Bridge", category: "Bridges", blurb: "Seat for a cross-chain messaging layer for Valtora assets.", status: "Open seat" },
  { name: "Payments app", category: "Payments", blurb: "Seat for a checkout or payroll tool settling in VYLD.", status: "Open seat" },
  { name: "Portfolio tracker", category: "Service Provider", blurb: "Seat for a dashboard that reads Valtora positions.", status: "Open seat" },
  { name: "Derivatives venue", category: "Derivatives", blurb: "Seat for a market using Valtora assets as margin.", status: "Open seat" },
];

/* ------------------------------------------------------------------ */
/* Team (roles only)                                                   */
/* ------------------------------------------------------------------ */

export const TEAM_ROLES = [
  { role: "Protocol Lead", area: "Contracts & settlement", initials: "PL" },
  { role: "Product Lead", area: "Assets & eligibility", initials: "PR" },
  { role: "Engineering", area: "App & infrastructure", initials: "EN" },
  { role: "Risk & Compliance", area: "Rules & reporting", initials: "RC" },
  { role: "Design", area: "Interface & brand", initials: "DS" },
  { role: "Community", area: "Holders & partners", initials: "CM" },
  { role: "Research", area: "Markets & structure", initials: "RS" },
  { role: "Operations", area: "Vendors & process", initials: "OP" },
];

export const CAREERS = [
  { team: "Engineering", roles: ["Smart Contract Engineer", "Frontend Engineer"] },
  { team: "Product", roles: ["Product Designer"] },
  { team: "Risk & Compliance", roles: ["Compliance Analyst"] },
  { team: "Community", roles: ["Community Lead"] },
];
