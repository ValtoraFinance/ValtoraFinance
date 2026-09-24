/* Illustrative charts. They draw deterministic shapes, never data, and every
   one of them is labelled as illustrative wherever it is used. */

function seeded(seed: number) {
  let s = seed;
  return () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
}

export function IllustrativeTag({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center rounded-full bg-mist px-2 py-0.5 font-mono text-[10.5px] tracking-wide text-mute uppercase ${className}`}>
      Illustrative
    </span>
  );
}

/** Scatter of square markers stepping upward, over dotted rows. */
export function DotScatter({ accent, seed = 3, label }: { accent: string; seed?: number; label?: string }) {
  const rand = seeded(seed);
  const n = 28;
  const pts: { x: number; y: number }[] = [];
  let y = 92;
  for (let i = 0; i < n; i++) {
    y -= rand() * 5.2 - 1.4;
    if (i === 17 || i === 22) y -= 14;
    pts.push({ x: 4 + (i / (n - 1)) * 92, y: Math.max(8, Math.min(94, y)) });
  }
  return (
    <div className="dotted-rows relative h-full w-full">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden="true">
        {pts.map((p, i) => (
          <rect key={i} x={p.x - 0.9} y={p.y - 1.6} width={1.8} height={3.2} rx={0.4} fill={accent} />
        ))}
      </svg>
      {label ? (
        <span className="mono-tag absolute top-0 right-0" style={{ color: accent }}>
          {label}
        </span>
      ) : null}
    </div>
  );
}

/** Two rising lines: the product model against a plain reference. */
export function LineCompare({
  accent,
  soft,
  labels = ["Model", "Reference"],
}: {
  accent: string;
  soft: string;
  labels?: [string, string];
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="dotted-rows relative min-h-0 flex-1">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden="true">
          <path d="M0 96 L100 38" stroke={soft} strokeWidth="1.2" fill="none" vectorEffect="non-scaling-stroke" />
          <path d="M0 96 L100 18" stroke={accent} strokeWidth="1.6" fill="none" vectorEffect="non-scaling-stroke" />
        </svg>
      </div>
      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-[12.5px] font-medium">
        <span className="flex items-center gap-2">
          <span className="size-2.5 rounded-[2px]" style={{ background: accent }} /> {labels[0]}
        </span>
        <span className="flex items-center gap-2 text-mute">
          <span className="size-2.5 rounded-[2px]" style={{ background: soft }} /> {labels[1]}
        </span>
      </div>
    </div>
  );
}

/** Bars that brighten from pale to the accent as they rise. */
export function BarsRise({ accent, soft, count = 20 }: { accent: string; soft: string; count?: number }) {
  return (
    <div className="flex h-full items-end gap-[4px] sm:gap-[7px]">
      {Array.from({ length: count }, (_, i) => {
        const t = i / (count - 1);
        return (
          <span
            key={i}
            className="min-w-0 flex-1 rounded-full"
            style={{
              height: `${6 + t * 94}%`,
              background: t > 0.55 ? accent : soft,
              opacity: t > 0.55 ? 0.55 + t * 0.45 : 0.35 + t,
            }}
          />
        );
      })}
    </div>
  );
}

/** Area line used on product pages: a smooth accrual curve. */
export function AccrualCurve({ accent, height = 280 }: { accent: string; height?: number }) {
  const pts = Array.from({ length: 60 }, (_, i) => {
    const x = (i / 59) * 100;
    const y = 92 - Math.pow(i / 59, 1.15) * 80;
    return `${x.toFixed(2)},${y.toFixed(2)}`;
  });
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full" style={{ height }} aria-hidden="true">
      {[20, 40, 60, 80].map((y) => (
        <line key={y} x1="0" x2="100" y1={y} y2={y} stroke="#e6e6ea" strokeWidth="1" vectorEffect="non-scaling-stroke" strokeDasharray="2 3" />
      ))}
      <polyline points={pts.join(" ")} fill="none" stroke={accent} strokeWidth="1.8" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

/** Small sparkline for price cards. Real points when given, else a flat line. */
export function Sparkline({ points, up }: { points: number[]; up: boolean }) {
  const colour = up ? "#0e9f5f" : "#e0484f";
  if (points.length < 2) {
    return (
      <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="h-16 w-full" aria-hidden="true">
        <line x1="0" x2="100" y1="20" y2="20" stroke="#c9c9d0" strokeDasharray="3 3" vectorEffect="non-scaling-stroke" />
      </svg>
    );
  }
  const min = Math.min(...points);
  const max = Math.max(...points);
  const span = max - min || 1;
  const d = points
    .map((p, i) => `${i ? "L" : "M"}${((i / (points.length - 1)) * 100).toFixed(2)} ${(36 - ((p - min) / span) * 32).toFixed(2)}`)
    .join(" ");
  return (
    <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="h-16 w-full" aria-hidden="true">
      <path d={`${d} L100 40 L0 40 Z`} fill={colour} fillOpacity="0.08" />
      <path d={d} fill="none" stroke={colour} strokeWidth="1.4" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
