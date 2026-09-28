import { getTerminal } from "@/lib/onchain";
import { usdCompact } from "@/lib/format";
import { Stats, type StatRow } from "@/components/home/Stats";

const PLACEHOLDER: StatRow[] = [
  { text: "—", label: ["Verified", "stock tokens"] },
  { text: "—", label: ["Lookalike", "tokens seen"] },
  { text: "—", label: ["Liquidity in", "their deepest pools"] },
];

export async function LiveStats() {
  const t = await getTerminal();
  return (
    <Stats
      rows={[
        { text: String(t.totals.assets), label: ["Verified", "stock tokens"] },
        { text: String(t.totals.lookalikes), label: ["Lookalike", "tokens seen"] },
        { text: usdCompact(t.totals.liquidityUsd), label: ["Liquidity in", "their deepest pools"] },
      ]}
    />
  );
}

export function LiveStatsFallback() {
  return <Stats rows={PLACEHOLDER} />;
}
