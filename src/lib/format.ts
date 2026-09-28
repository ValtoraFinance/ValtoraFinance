/** Display helpers shared by the terminal, transparency and roadmap pages. */

export function usd(value: number | null | undefined, digits = 2) {
  if (value === null || value === undefined || !Number.isFinite(value)) return "—";
  return value.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: digits, maximumFractionDigits: digits });
}

export function usdCompact(value: number | null | undefined) {
  if (value === null || value === undefined || !Number.isFinite(value)) return "—";
  if (value > 0 && value < 1) return "<$1";
  return value.toLocaleString("en-US", { style: "currency", currency: "USD", notation: "compact", maximumFractionDigits: 1 });
}

export function pct(value: number | null | undefined, digits = 2, signed = false) {
  if (value === null || value === undefined || !Number.isFinite(value)) return "—";
  const text = `${(value * 100).toFixed(digits)}%`;
  return signed && value > 0 ? `+${text}` : text;
}

export function eth(value: number | null | undefined, digits = 4) {
  if (value === null || value === undefined || !Number.isFinite(value)) return "—";
  return `${value.toLocaleString("en-US", { maximumFractionDigits: digits })} ETH`;
}

/** "4m ago", "3h ago", "2d ago" from a unix timestamp in seconds. */
export function ago(unixSeconds: number | null | undefined, now = Date.now()) {
  if (!unixSeconds) return "—";
  const s = Math.max(0, Math.round(now / 1000 - unixSeconds));
  if (s < 90) return `${s}s ago`;
  if (s < 90 * 60) return `${Math.round(s / 60)}m ago`;
  if (s < 36 * 3600) return `${Math.round(s / 3600)}h ago`;
  return `${Math.round(s / 86400)}d ago`;
}
