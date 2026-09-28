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
        label: "Live now",
        items: [
          { label: "Valtora Terminal", tag: "Live", href: "/terminal", blurb: "Every official stock token, verified on-chain and priced two ways.", icon: "rails" },
          { label: "Lookalike Checker", tag: "Live", href: "/terminal#verify", blurb: "Paste any address. The chain says if it is the real token.", icon: "trust" },
          { label: `${BRAND.symbol}`, href: "/token", blurb: "The project token on Robinhood Chain.", icon: "token" },
        ],
      },
      {
        label: "On the roadmap",
        items: [
          { label: "Treasury Route", tag: "Live", href: "/treasury", blurb: "Swap into SGOV, the verified treasury bill token.", icon: "treasury" },
          { label: "Yield Vault", tag: "M2", href: "/yield", blurb: "A USDG vault on Morpho, curated in public.", icon: "yield" },
          { label: "Valtora Index", tag: "M3", href: "/equities", blurb: "A basket of verified stock tokens, priced by Chainlink.", icon: "equities" },
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
          { label: "Insights", href: "/insights", blurb: "Research notes on tokenized assets.", icon: "insights" },
          { label: "Blog", href: "/blog", blurb: "Product news and release notes.", icon: "blog" },
          { label: "Valtora Learn", href: "/learn", blurb: "Plain-language lessons on tokenized assets.", icon: "learn" },
          { label: "Docs & FAQs", href: "/docs", blurb: "How the products, token and app work.", icon: "docs" },
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
          { label: "Valtora Ecosystem", href: "/ecosystem", blurb: "Chains, wallets and protocols Valtora builds on.", icon: "ecosystem" },
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
          { label: "Transparency", href: "/transparency", blurb: "Every project address and live balance.", icon: "network" },
          { label: "Roadmap", href: "/roadmap", blurb: "Milestones and the treasury that funds them.", icon: "grants" },
          { label: "Trust & Security", href: "/trust", blurb: "What we commit to before anything holds value.", icon: "trust" },
          { label: "Contact", href: "/contact", blurb: `Reach the team on X at ${BRAND.xHandle}.`, icon: "contact" },
        ],
      },
    ],
  },
];

export const FOOTER_COLUMNS: { title: string; links: { label: string; href: string; external?: boolean }[] }[] = [
  {
    title: "Products",
    links: [
      { label: "Terminal", href: "/terminal" },
      { label: "Lookalike Checker", href: "/terminal#verify" },
      { label: "Treasury Route", href: "/treasury" },
      { label: "Yield Vault", href: "/yield" },
      { label: "Valtora Index", href: "/equities" },
    ],
  },
  {
    title: "Project",
    links: [
      { label: `${BRAND.symbol} Token`, href: "/token" },
      { label: "Transparency", href: "/transparency" },
      { label: "Roadmap", href: "/roadmap" },
      { label: "Ecosystem", href: "/ecosystem" },
    ],
  },
  {
    title: "Explore",
    links: [
      { label: "Insights", href: "/insights" },
      { label: "Docs", href: "/docs" },
      { label: "Trust & Security", href: "/trust" },
      { label: "Bug Reports", href: "/trust#bounty" },
    ],
  },
  {
    title: "Contact",
    links: [
      { label: `X ${BRAND.xHandle}`, href: BRAND.x, external: true },
      { label: "Media Kit", href: "/media" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

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
    slug: "introducing-valtora",
    title: "Introducing Valtora: Built First, Funded by Use",
    kind: "Update",
    topic: "Valtora",
    date: "2026-09-25",
    excerpt:
      "What Valtora is, what already works on launch day, and why every later milestone waits for the treasury instead of a promise.",
    art: 0,
    featured: true,
    blog: true,
    body: [
      "Robinhood Chain already carries real stock tokens, Chainlink price feeds for them, Uniswap pools that trade them around the clock and Morpho markets that lend against them. What it lacks is a clear, trustworthy view of all of that in one place. Valtora starts there.",
      "On launch day the Valtora Terminal is live. It lists every official stock token that has a Chainlink feed on Robinhood Chain, checks each contract against Robinhood's own token contract, and prices every asset twice: once by its oracle and once by its deepest pool. Next to it sits a lookalike checker, because dozens of tokens borrow famous tickers and some of them look more convincing than the real ones.",
      "Everything after that is on the roadmap, and every milestone has a price. A treasury route into short-dated treasury exposure, a USDG vault on Morpho, and a basket index of verified stock tokens each unlock when the treasury has received enough creator fees to pay for them. Progress is read from the chain, so nobody has to take our word for it.",
      "Valtora is run by an anonymous team that speaks only through its X account. That is why the Transparency page lists every address the project controls, with balances read live from Robinhood Chain. You should not need to know who we are to check what we do.",
    ],
  },
  {
    slug: "real-stock-token-or-lookalike",
    title: "How to Tell a Real Stock Token From a Lookalike",
    kind: "Explainer",
    topic: "Terminal",
    date: "2026-09-25",
    excerpt:
      "A ticker is not an identity. Three checks, all readable on-chain, separate an official Robinhood stock token from a copy.",
    art: 1,
    featured: true,
    blog: true,
    body: [
      "Anyone can deploy a token called NVDA. On Robinhood Chain, many people have. When we last resolved our asset list, the search results for our 36 tickers contained 38 other tokens trading under the same names, from near-empty pools to tokens with polished logos and whole communities behind them.",
      "Official Robinhood stock tokens share one piece of code. Each one is a small proxy that points at the same Robinhood-controlled contract, called a beacon. A copy can use the same name and symbol, but it cannot point at that beacon and still be a Robinhood token, because only Robinhood can issue through it.",
      "So the check has three parts. First, the contract's own code must reference Robinhood's beacon. Second, its symbol must be exactly the ticker. Third, its name must end in \"Robinhood Token\", the suffix every official token carries. The terminal applies all three to every asset it lists.",
      "The lookalike checker on the terminal page runs the same test on any address you paste. It reads the answer from the contract itself on Robinhood Chain, not from a list we maintain, so it works for tokens we have never seen.",
    ],
  },
  {
    slug: "oracle-price-vs-market-price",
    title: "Oracle Price, Market Price and the Gap Between Them",
    kind: "Explainer",
    topic: "Terminal",
    date: "2026-09-25",
    excerpt:
      "Why the terminal shows two prices for every stock token, and what it means when they drift apart on a Sunday.",
    art: 2,
    featured: true,
    body: [
      "Every asset in the terminal has two prices. The oracle price comes from a Chainlink feed on Robinhood Chain. It follows the listed share during US market hours, five days a week, and updates when the price moves by half a percent or once a day at the latest.",
      "The market price comes from the deepest Uniswap pool for that token. Pools trade every hour of every day, including weekends and holidays, when the listed market is closed and the oracle stands still.",
      "The gap between the two is information. During market hours it is usually a fraction of a percent. Over a weekend it can widen as on-chain traders react to news the listed market has not priced yet, and it tends to close again when trading resumes.",
      "A wide gap is not automatically an opportunity. Thin pools move easily, and a stale oracle can be the side that is wrong. The terminal shows how old each oracle reading is and how deep each pool is, so you can judge which number to trust.",
    ],
  },
  {
    slug: "distribution-multiplier",
    title: "Dividends Without Transfers: The Distribution Multiplier",
    kind: "Research",
    topic: "Terminal",
    date: "2026-09-25",
    excerpt:
      "Robinhood stock tokens credit dividends by raising an on-chain multiplier, not by sending tokens. Here is how to read it.",
    art: 3,
    body: [
      "When a listed company pays a dividend, holders of the matching Robinhood stock token do not receive new tokens or a cash transfer. Instead, the token contract raises a number called the UI multiplier. The balance stored on-chain stays the same, and the multiplier scales what that balance is worth.",
      "A multiplier of 1.0 means nothing has been distributed since the token was created. A multiplier of 1.0008 means distributions so far are worth 0.08% of a position. The terminal shows this as the Distributions column.",
      "This matters for anyone building on top of stock tokens. A contract that only counts raw balances will slowly understate what it holds. Valtora's index, planned for milestone M3, values each position with the multiplier applied, and its price oracle will do the same.",
      "The same contract also lets its issuer pause transfers, block addresses and burn balances. Those powers sit with Robinhood, not with Valtora, and they apply to every holder, including any contract that holds the tokens.",
    ],
  },
  {
    slug: "sgov-on-chain",
    title: "Treasury Exposure Without a New Token: SGOV On-chain",
    kind: "Research",
    topic: "Treasury Route",
    date: "2026-09-25",
    excerpt:
      "An official token for a 0–3 month treasury bill ETF already trades on Robinhood Chain. Valtora's first product routes to it instead of issuing its own.",
    art: 4,
    blog: true,
    body: [
      "Tokenized treasuries usually mean a new issuer, a custodian, a legal wrapper and a promise that the bills exist. An anonymous team cannot credibly offer any of that, so we will not try.",
      "Robinhood Chain already has an official stock token for SGOV, an exchange-traded fund that holds US treasury bills maturing within three months. It has a Chainlink feed, Uniswap pools with millions of dollars of liquidity, and its distributions arrive through the same on-chain multiplier as every other Robinhood stock token.",
      "The Treasury Route, milestone M1, is a direct path from USDG into that token through existing pools. No Valtora contract holds your funds at any point: the swap settles straight into your wallet, and you can leave the same way.",
      "SGOV is still an ETF share wrapped in a token. Its price moves, its issuer can freeze it, and it is only available in supported regions. The route makes it easier to reach. It does not make it risk-free.",
    ],
  },
  {
    slug: "where-the-money-goes",
    title: "Where the Money Goes: Treasury, Dev Wallet and Milestones",
    kind: "Update",
    topic: "Transparency",
    date: "2026-09-25",
    excerpt:
      "How creator fees and dev wallet sales fund Valtora, and how anyone can follow every payment on-chain.",
    art: 5,
    blog: true,
    body: [
      "Valtora has two sources of money. The launchpad sends a creator fee on every trade of the project token to the treasury address. And the dev wallet, which made a single 0.05 ETH buy at launch, sells from that position to pay for early work.",
      "Both addresses are listed on the Transparency page with balances read live from Robinhood Chain. Once the token is live, the page links straight to every transfer out of the dev wallet.",
      "The treasury pays for the roadmap and nothing else. Each milestone has a target in ETH, measured against everything the treasury has received, including what it has already spent. Every payment is added to a public ledger with its transaction, so paying for an audit never looks like money disappearing.",
      "If trading slows down, so does the roadmap. We would rather publish that plainly than promise dates we cannot fund.",
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
  { label: "Thesis 02", role: "Transparency", quote: "A project should not ask to be trusted. Every address public, every payment on-chain, every rule written down where anyone can read it." },
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
  { title: "Verified Contracts", body: "Every asset in the terminal is checked against Robinhood's own token contract. Every Valtora contract will be verified and published before it takes deposits." },
  { title: "Public Addresses", body: "The token contract, treasury and dev wallet are listed on the transparency page, with balances read live from the chain." },
  { title: "Audited Protocols", body: "Prices come from Chainlink, lending from Morpho and swaps from Uniswap. Valtora only writes code where nothing suitable exists." },
  { title: "Funded in the Open", body: "Milestones unlock from creator fees paid into the treasury. Every payment out of it is listed with its transaction." },
  { title: "No Owner Keys", body: "Valtora contracts ship without an owner where possible. Anything that must change goes through a timelock anyone can watch." },
];

/** Assets shown on the home rail. Tiles are real issuer logos in public/tiles. */
export const RAILS_TOKENS = [
  { name: "NVDA", tile: "nvda", label: "Equities" },
  { name: "SGOV", tile: "sgov", label: "Treasury bills" },
  { name: "GLD", tile: "gld", label: "Gold" },
  { name: "SPY", tile: "spy", label: "Index funds" },
  { name: "SLV", tile: "slv", label: "Silver" },
  { name: "TSLA", tile: "tsla", label: "Equities" },
  { name: "USO", tile: "uso", label: "Oil" },
];

export const ASSET_CLASSES = ["Equities", "ETFs", "Treasuries", "Gold", "Silver", "Oil", "Indexes", "Semiconductors"];

/* ------------------------------------------------------------------ */
/* Ecosystem                                                           */
/* ------------------------------------------------------------------ */

export type EcoStatus = "Used by Valtora" | "Works today";

/** Logos live in public/eco/<logo>.webp (scripts/fetch-eco-logos.mjs). */
export type EcoEntry = { name: string; category: string; blurb: string; href: string; logo: string; status: EcoStatus };

export const ECOSYSTEM: EcoEntry[] = [
  { name: "Robinhood Chain", category: "Chain", blurb: `Ethereum-compatible network where the stock tokens, Valtora and ${BRAND.symbol} live.`, href: "https://robinhood.com", logo: "robinhood-chain", status: "Used by Valtora" },
  { name: "Chainlink", category: "Oracle", blurb: "Price feeds for every asset in the terminal, and the ETH / USD rate used to value the treasury.", href: "https://chain.link", logo: "chainlink", status: "Used by Valtora" },
  { name: "Morpho", category: "Lending", blurb: "Lending markets shown in the terminal, and the vault factory behind the planned Yield Vault.", href: "https://morpho.org", logo: "morpho", status: "Used by Valtora" },
  { name: "Uniswap", category: "Exchange", blurb: "Pools that price the stock tokens around the clock, and the route for the Treasury Route.", href: "https://uniswap.org", logo: "uniswap", status: "Used by Valtora" },
  { name: "Dexscreener", category: "Market data", blurb: "Pool prices, liquidity and volume in the terminal.", href: "https://dexscreener.com", logo: "dexscreener", status: "Used by Valtora" },
  { name: "Robin Etherscan", category: "Explorer", blurb: "Every contract, wallet and transaction link on this site opens here.", href: "https://robin.etherscan.io", logo: "etherscan", status: "Used by Valtora" },
  { name: "pons", category: "Launchpad", blurb: `Where ${BRAND.symbol} launches, and where its creator fees are sent to the treasury.`, href: "https://pons.family", logo: "pons", status: "Used by Valtora" },
  { name: "Hoodlock", category: "Liquidity lock", blurb: "Holds the locked liquidity position, with a public proof page.", href: "https://hoodlock.tech", logo: "hoodlock", status: "Used by Valtora" },
  { name: "Alchemy", category: "Infrastructure", blurb: "RPC provider for the site's chain reads.", href: "https://alchemy.com", logo: "alchemy", status: "Used by Valtora" },
  { name: "USDG", category: "Stablecoin", blurb: "The dollar most stock token pools and lending markets on Robinhood Chain are priced in.", href: "https://paxos.com", logo: "usdg", status: "Works today" },
  { name: "Lighter", category: "Perpetuals", blurb: "Perpetual futures venue on Robinhood Chain.", href: "https://lighter.xyz", logo: "lighter", status: "Works today" },
  { name: "MetaMask", category: "Wallet", blurb: "Browser wallet that can add Robinhood Chain as a custom network.", href: "https://metamask.io", logo: "metamask", status: "Works today" },
  { name: "OKX Wallet", category: "Wallet", blurb: "Browser wallet that announces itself to this site over EIP-6963.", href: "https://okx.com", logo: "okx", status: "Works today" },
  { name: "Brave Wallet", category: "Wallet", blurb: "Built-in browser wallet that supports custom EVM networks.", href: "https://brave.com", logo: "brave", status: "Works today" },
];
