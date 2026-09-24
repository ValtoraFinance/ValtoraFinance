"use client";

import { useEffect, useRef } from "react";

/* A slowly turning globe drawn as a grid of dots. Land is approximated with
   soft blobs placed near the continents, which is enough to read as Earth. */

const BLOBS: [number, number, number][] = [
  // lat, lon, radius (degrees)
  [48, -102, 22], [60, -120, 16], [35, -90, 14], [18, -98, 9], [70, -45, 11],
  [-12, -58, 17], [-30, -64, 11],
  [50, 12, 13], [60, 30, 14], [42, 0, 8],
  [8, 20, 20], [-18, 25, 14], [24, 12, 14],
  [52, 88, 26], [35, 105, 18], [62, 110, 18], [22, 78, 11], [28, 48, 12],
  [2, 112, 10], [-6, 140, 7], [36, 138, 5],
  [-25, 134, 13],
];

function land(lat: number, lon: number) {
  let v = 0;
  for (const [bl, bo, r] of BLOBS) {
    let d = Math.abs(lon - bo);
    if (d > 180) d = 360 - d;
    const dl = lat - bl;
    const dist = Math.sqrt(dl * dl + d * d * Math.cos((lat * Math.PI) / 180) ** 2);
    v += Math.exp(-(dist * dist) / (2 * r * r));
  }
  return v;
}

export function DotGlobe({ accent = "#6d4cf0", className = "" }: { accent?: string; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Precompute the dot field once: lat/lon pairs and a land weight.
    const dots: { lat: number; lon: number; w: number; tone: number }[] = [];
    for (let lat = -80; lat <= 80; lat += 4.2) {
      const ring = Math.max(8, Math.round(86 * Math.cos((lat * Math.PI) / 180)));
      for (let k = 0; k < ring; k++) {
        const lon = -180 + (k / ring) * 360;
        const w = land(lat, lon);
        dots.push({ lat, lon, w, tone: (Math.sin(lat * 0.21) + Math.cos(lon * 0.13)) * 0.5 });
      }
    }

    let raf = 0;
    let rot = 20;
    let visible = true;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const draw = () => {
      const size = canvas.clientWidth;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      if (canvas.width !== Math.round(size * dpr)) {
        canvas.width = Math.round(size * dpr);
        canvas.height = Math.round(size * dpr);
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, size, size);
      const R = size * 0.48;
      const cx = size / 2;
      const cy = size / 2;
      const tilt = (18 * Math.PI) / 180;
      const dot = Math.max(1.6, size / 150);
      for (const d of dots) {
        const la = (d.lat * Math.PI) / 180;
        const lo = ((d.lon + rot) * Math.PI) / 180;
        const x = Math.cos(la) * Math.sin(lo);
        const y0 = Math.sin(la);
        const z0 = Math.cos(la) * Math.cos(lo);
        const y = y0 * Math.cos(tilt) - z0 * Math.sin(tilt);
        const z = y0 * Math.sin(tilt) + z0 * Math.cos(tilt);
        if (z < 0) continue;
        const px = cx + x * R;
        const py = cy - y * R;
        if (d.w > 0.42) {
          ctx.fillStyle = accent;
          ctx.globalAlpha = Math.min(1, 0.45 + d.tone * 0.35 + z * 0.4);
        } else {
          ctx.fillStyle = "#d9d8e0";
          ctx.globalAlpha = 0.25 + z * 0.5;
        }
        ctx.beginPath();
        ctx.arc(px, py, dot * (0.7 + z * 0.3), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    const loop = () => {
      if (visible && !reduce) rot += 0.08;
      draw();
      raf = window.requestAnimationFrame(loop);
    };
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    io.observe(canvas);
    if (reduce) draw();
    else raf = window.requestAnimationFrame(loop);
    const onResize = () => draw();
    window.addEventListener("resize", onResize);
    return () => {
      window.cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", onResize);
    };
  }, [accent]);

  return <canvas ref={ref} className={`aspect-square w-full ${className}`} aria-hidden="true" />;
}
