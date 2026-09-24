/* Stacked translucent plates in isometric view, tinted per product. */
export function GlassStack({
  accent,
  soft,
  plates = 8,
  shape = "square",
}: {
  accent: string;
  soft: string;
  plates?: number;
  shape?: "square" | "round";
}) {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[460px] [perspective:1400px]" aria-hidden="true">
      <div className="absolute inset-0 animate-[float-y_7s_ease-in-out_infinite]">
        {Array.from({ length: plates }, (_, i) => {
          const t = i / Math.max(1, plates - 1);
          return (
            <div
              key={i}
              className="absolute top-1/2 left-1/2 size-[62%] border border-white/70"
              style={{
                borderRadius: shape === "round" ? "999px" : "22%",
                transform: `translate(-50%, -50%) translateY(${(0.5 - t) * 58 + 8}%) rotateX(62deg) rotateZ(-45deg)`,
                background: `linear-gradient(135deg, ${soft}cc, ${accent}${t > 0.5 ? "cc" : "88"})`,
                boxShadow: `0 1px 0 rgba(255,255,255,0.8) inset, 0 18px 40px -18px ${accent}`,
                opacity: 0.55 + t * 0.45,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
