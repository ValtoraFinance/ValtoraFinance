// Treasury Route (milestone M1). Every address below was checked on-chain on
// 25 Sep 2026: the router and quoter report the same Uniswap v3 factory and
// WETH as the SGOV pools, and match Uniswap's published Robinhood Chain list.

import { ASSETS } from "@/config/assets.generated";
import { ETH_USD_FEED } from "@/config/treasury";

export const UNISWAP = {
  factory: "0x1f7d7550b1b028f7571e69a784071f0205fd2efa",
  swapRouter02: "0xcaf681a66d020601342297493863e78c959e5cb2",
  quoterV2: "0x33e885ed0ec9bf04ecfb19341582aadcb4c8a9e7",
} as const;

const sgov = ASSETS.find((a) => a.symbol === "SGOV")!;

export const TOKENS = {
  USDG: { symbol: "USDG", address: "0x5fc5360D0400a0Fd4f2af552ADD042D716F1d168", decimals: 6 },
  SGOV: { symbol: "SGOV", address: sgov.address, decimals: 18 },
  WETH: { symbol: "WETH", address: "0x0Bd7D308f8E1639FAb988df18A8011f41EAcAD73", decimals: 18 },
} as const;

export const FEEDS = {
  sgovUsd: { address: sgov.feed, decimals: sgov.feedDecimals },
  ethUsd: { address: ETH_USD_FEED, decimals: 8 },
} as const;

/** Fee tiers with live pools, per pair. The quoter picks the best route. */
export const POOL_FEES = {
  usdgSgov: [500, 3000],
  wethUsdg: [100, 500],
  wethSgov: [10000],
} as const;

/** A swap is refused when its price is this much worse than the oracle. */
export const MAX_ORACLE_GAP = 0.01;

export const SLIPPAGE_CHOICES = [0.001, 0.005, 0.01] as const;
export const DEFAULT_SLIPPAGE = 0.005;
