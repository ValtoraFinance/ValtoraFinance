// Every public address and every funding target lives here, so the
// transparency and roadmap pages can never disagree with each other.

import { CHAIN } from "@/config/brand";

export const WALLETS = {
  /** Receives the launchpad creator fees. Funds the roadmap. */
  treasury: "0x262371909Ed07CB142f2A434DD9507b461921393",
  /** Holds the launch dev buy. Every sale from it is listed on /transparency. */
  dev: "0x1890C448D74297239921f0d2d5B492B783a43557",
} as const;

/** Launch parameters, published once the token is live. */
export const LAUNCH = {
  launchpad: "pons",
  /** Dev buy at launch, in ETH. */
  devBuyEth: 0.05,
  /** Liquidity lock proof. Empty until the lock exists. */
  lockUrl: "",
};

/** Tokens the treasury may hold. Values are converted to ETH with Chainlink. */
export const TREASURY_TOKENS = [
  { symbol: "WETH", address: "0x0Bd7D308f8E1639FAb988df18A8011f41EAcAD73", decimals: 18, kind: "eth" },
  { symbol: "USDG", address: "0x5fc5360D0400a0Fd4f2af552ADD042D716F1d168", decimals: 6, kind: "usd" },
] as const;

/** Chainlink ETH / USD on Robinhood Chain. */
export const ETH_USD_FEED = "0x78F3556b67E17Df817D51Ef5a990cDaF09E8d3A9";

export type MilestoneStatus = "live" | "building" | "funding" | "queued";

export type Milestone = {
  id: string;
  name: string;
  /** Cumulative ETH the treasury must have received to start this milestone. */
  targetEth: number;
  summary: string;
  deliverables: string[];
  /** What the money is for. */
  budget: string;
  status: MilestoneStatus;
};

export const MILESTONES: Milestone[] = [
  {
    id: "M0",
    name: "Terminal & Transparency",
    targetEth: 0,
    summary: "A verified directory of stock tokens on Robinhood Chain, and every project address in one place.",
    deliverables: [
      "Verified stock token terminal with oracle and market prices",
      "Lookalike checker for any token address",
      "Live treasury, dev wallet and roadmap pages",
    ],
    budget: "No spend. Built before launch.",
    status: "live",
  },
  {
    id: "M1",
    name: "Treasury route",
    targetEth: 0,
    summary: "A direct route into SGOV, the verified short-dated treasury token already trading on-chain.",
    deliverables: [
      "USDG or ETH to SGOV swaps, best route across existing Uniswap pools",
      "Oracle guard: swaps more than 1% worse than Chainlink are refused",
      "No Valtora contract holds user funds",
    ],
    budget: "No spend. Uses existing contracts only.",
    status: "live",
  },
  {
    id: "M2",
    name: "Yield vault",
    targetEth: 0.5,
    summary: "A USDG vault on Morpho, curated by the Valtora treasury, allocating only to markets it publishes.",
    deliverables: [
      "Vault deployed through Morpho's official factory",
      "Published allocation policy and caps",
      "Seed deposit from the treasury so the vault opens with liquidity",
    ],
    budget: "Seed deposit of roughly 1,000 USDG, plus gas and operations.",
    status: "funding",
  },
  {
    id: "M3",
    name: "Valtora Index (beta)",
    targetEth: 4,
    summary: "A basket token of verified stock tokens with in-kind mint and redeem, priced by Chainlink.",
    deliverables: [
      "Index contract with no owner and a timelocked basket",
      "NAV oracle that accounts for distribution multipliers",
      "Independent audit before any deposit cap is raised",
    ],
    budget: "Independent audit, NAV oracle work and starting liquidity.",
    status: "queued",
  },
  {
    id: "M4",
    name: "Staking & governance",
    targetEth: 6,
    summary: "Protocol fees shared with stakers, and basket changes decided by on-chain vote.",
    deliverables: [
      "Staking contract that receives vault and index fees",
      "On-chain voting that executes through a timelock",
      "Audit of both contracts",
    ],
    budget: "Second audit and a reserve.",
    status: "queued",
  },
];

/**
 * Money that has left the treasury, each with its transaction. Spent ETH still
 * counts toward the cumulative total, so paying for an audit never moves the
 * roadmap backwards.
 */
export type Spend = { date: string; milestone: string; purpose: string; eth: number; tx: string };

export const SPENDING: Spend[] = [];

export const explorerLabel = CHAIN.explorer.replace(/^https:\/\//, "");
