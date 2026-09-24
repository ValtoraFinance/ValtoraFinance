// Single place to change project identity. Everything on the site reads from here.
// To publish the real contract address, replace the value of CA below — the
// navbar pill, token page, footer and explorer links all derive from it.

const CA = "0xxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

export const isAddress = (v: string): v is `0x${string}` =>
  /^0x[0-9a-fA-F]{40}$/.test(v);

export const BRAND = {
  name: "VALTORA FINANCE",
  short: "Valtora",
  ticker: "VALTORA",
  symbol: "$VALTORA",
  domain: "valtorafinance.xyz",
  url: "https://valtorafinance.xyz",
  slogan: "A New Chapter for Global Finance.",
  description:
    "Valtora Finance is a Robinhood Chain token project building toward on-chain access to real-world assets: equities, yield notes and treasury exposure, issued as transparent tokens.",
  x: "https://x.com/valtora",
  xHandle: "@valtora",
  github: "https://github.com/ValtoraFinance/ValtoraFinance",
  email: "team@valtorafinance.xyz",
  ca: CA,
} as const;

// Public endpoints are the default. An operator can point the site at a
// private RPC with ROBINHOOD_RPC_URL (server) / NEXT_PUBLIC_ROBINHOOD_RPC_URL
// (browser). Both are optional.
const PUBLIC_RPC = "https://rpc.mainnet.chain.robinhood.com";

export const CHAIN = {
  id: 4663,
  hex: "0x1237",
  name: "Robinhood Chain",
  nativeSymbol: "ETH",
  decimals: 18,
  publicRpc: PUBLIC_RPC,
  rpc: process.env.NEXT_PUBLIC_ROBINHOOD_RPC_URL || PUBLIC_RPC,
  /** Second public endpoint, used for reads only when the first one fails. */
  fallbackRpc: "https://robinhood-rpc.publicnode.com",
  explorer: "https://robinhoodchain.blockscout.com",
} as const;

/** RPC for server code: the private endpoint when set, else the public one. */
export function serverRpc() {
  return (
    process.env.ROBINHOOD_RPC_URL ||
    process.env.NEXT_PUBLIC_ROBINHOOD_RPC_URL ||
    PUBLIC_RPC
  );
}

export const TOKEN = {
  get isLive() {
    return isAddress(BRAND.ca);
  },
  get explorerUrl() {
    return isAddress(BRAND.ca) ? explorerToken(BRAND.ca) : null;
  },
};

export function explorerAddress(address: string) {
  return `${CHAIN.explorer}/address/${address}`;
}
export function explorerToken(address: string) {
  return `${CHAIN.explorer}/token/${address}`;
}
export function shortAddress(address: string, head = 6, tail = 4) {
  if (address.length <= head + tail + 2) return address;
  return `${address.slice(0, head)}…${address.slice(-tail)}`;
}
