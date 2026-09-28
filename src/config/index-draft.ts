// Draft basket for the Valtora Index (milestone M3). Nothing here is
// investable: the list is published early so it can be argued with.

export const INDEX_DRAFT = {
  name: "Valtora AI Leaders",
  ticker: "vAI",
  /** Equal weight, rebalanced quarterly, once the contract exists. */
  symbols: ["NVDA", "MSFT", "GOOGL", "META", "AMZN", "TSM", "AMD", "PLTR"],
  rebalance: "Quarterly",
} as const;
