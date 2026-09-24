/* Renders the site's scenic artwork procedurally, so no photography is used.
 *
 *   node scripts/make-art.mjs
 *
 * Writes public/art/{skyline.webp, hall.webp, facade.webp}.
 */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const OUT = fileURLToPath(new URL("../public/art/", import.meta.url));
await mkdir(OUT, { recursive: true });

let seed = 7;
const rand = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
const pick = (a, b) => a + rand() * (b - a);

/* ---------------------------------------------------------------- */
/* Skyline at dusk: sky, sun, towers with lit windows, water.        */
/* ---------------------------------------------------------------- */
function skyline() {
  const W = 2400;
  const H = 1400;
  const horizon = 1060;
  const parts = [];
  parts.push(`<defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#1d2a4a"/>
      <stop offset="0.38" stop-color="#46547a"/>
      <stop offset="0.62" stop-color="#8a7f98"/>
      <stop offset="0.8" stop-color="#d69a6a"/>
      <stop offset="0.9" stop-color="#f3b25f"/>
    </linearGradient>
    <radialGradient id="sun" cx="0.24" cy="0.7" r="0.5">
      <stop offset="0" stop-color="#fff2c8" stop-opacity="1"/>
      <stop offset="0.08" stop-color="#ffd27a" stop-opacity="0.95"/>
      <stop offset="0.35" stop-color="#f59a45" stop-opacity="0.35"/>
      <stop offset="1" stop-color="#f59a45" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="water" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#3a3140"/>
      <stop offset="1" stop-color="#0d0c14"/>
    </linearGradient>
    <linearGradient id="tower" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#2a2d40"/>
      <stop offset="1" stop-color="#0b0a12"/>
    </linearGradient>
    <linearGradient id="far" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#5b5670" stop-opacity="0.9"/>
      <stop offset="1" stop-color="#2c2838"/>
    </linearGradient>
  </defs>`);
  parts.push(`<rect width="${W}" height="${H}" fill="url(#sky)"/>`);
  parts.push(`<rect width="${W}" height="${H}" fill="url(#sun)"/>`);
  // faint clouds
  for (let i = 0; i < 9; i++) {
    const y = pick(120, 620);
    parts.push(`<ellipse cx="${pick(0, W)}" cy="${y}" rx="${pick(160, 420)}" ry="${pick(8, 22)}" fill="#ffffff" fill-opacity="${pick(0.04, 0.1).toFixed(2)}"/>`);
  }

  // far layer
  let x = -20;
  while (x < W) {
    const w = pick(50, 130);
    const h = pick(80, 220);
    parts.push(`<rect x="${x}" y="${horizon - h}" width="${w}" height="${h}" fill="url(#far)"/>`);
    x += w - 4;
  }

  // near layer with a tall centre tower
  const windows = [];
  x = -30;
  while (x < W) {
    const centre = Math.abs(x - 1180) < 260;
    const nearSun = Math.abs(x - 560) < 170;
    const w = pick(60, 160);
    let h = centre ? pick(260, 460) : nearSun ? pick(60, 130) : pick(120, 380);
    if (!nearSun && rand() < 0.12) h += pick(80, 180);
    const top = horizon - h;
    parts.push(`<rect x="${x}" y="${top}" width="${w}" height="${h}" fill="url(#tower)"/>`);
    if (rand() < 0.3) parts.push(`<rect x="${x + w / 2 - 3}" y="${top - pick(20, 60)}" width="6" height="60" fill="#10101a"/>`);
    for (let wy = top + 16; wy < horizon - 12; wy += 14) {
      for (let wx = x + 8; wx < x + w - 8; wx += 12) {
        if (rand() < 0.1) windows.push(`<rect x="${wx.toFixed(1)}" y="${wy}" width="5" height="6" fill="#ffd489" fill-opacity="${pick(0.35, 0.9).toFixed(2)}"/>`);
      }
    }
    x += w + pick(-6, 10);
  }
  // landmark tower with spire, the tallest element in frame
  const tx = 1150;
  const tTop = 330;
  parts.push(`<path d="M${tx} ${horizon} L${tx} ${tTop + 60} L${tx + 45} ${tTop} L${tx + 90} ${tTop} L${tx + 135} ${tTop + 60} L${tx + 135} ${horizon} Z" fill="url(#tower)"/>`);
  parts.push(`<rect x="${tx + 64}" y="${tTop - 150}" width="7" height="150" fill="#15151f"/>`);
  for (let wy = tTop + 70; wy < horizon - 10; wy += 16) {
    if (rand() < 0.5) windows.push(`<rect x="${tx + pick(10, 110)}" y="${wy}" width="6" height="7" fill="#ffd489" fill-opacity="0.7"/>`);
  }
  parts.push(...windows);

  parts.push(`<circle cx="576" cy="1040" r="46" fill="#fff4d2"/>`);
  parts.push(`<rect width="${W}" height="${H}" fill="url(#sun)" opacity="0.45"/>`);
  // water and reflections
  parts.push(`<rect x="0" y="${horizon}" width="${W}" height="${H - horizon}" fill="url(#water)"/>`);
  for (let i = 0; i < 160; i++) {
    const y = pick(horizon + 6, H);
    const nearSun = rand() < 0.45;
    const cx = nearSun ? pick(420, 760) : pick(0, W);
    const w = pick(20, nearSun ? 180 : 90);
    const colour = nearSun ? "#ffcf7a" : "#c8b8d8";
    parts.push(`<rect x="${cx}" y="${y.toFixed(0)}" width="${w.toFixed(0)}" height="2" fill="${colour}" fill-opacity="${pick(0.08, nearSun ? 0.55 : 0.18).toFixed(2)}"/>`);
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${parts.join("")}</svg>`;
}

/* ---------------------------------------------------------------- */
/* Dark hall with hanging lights and an LED band.                    */
/* ---------------------------------------------------------------- */
function hall() {
  const W = 2400;
  const H = 1300;
  const parts = [`<defs>
    <radialGradient id="glow" cx="0.72" cy="0.28" r="0.6">
      <stop offset="0" stop-color="#3a2b52"/>
      <stop offset="1" stop-color="#07060d"/>
    </radialGradient>
    <radialGradient id="bulb"><stop offset="0" stop-color="#fff3d6"/><stop offset="0.35" stop-color="#ffc98a" stop-opacity="0.6"/><stop offset="1" stop-color="#ffc98a" stop-opacity="0"/></radialGradient>
    <radialGradient id="warm" cx="0.9" cy="0.95" r="0.5"><stop offset="0" stop-color="#b8662e" stop-opacity="0.55"/><stop offset="1" stop-color="#b8662e" stop-opacity="0"/></radialGradient>
    <filter id="blur"><feGaussianBlur stdDeviation="6"/></filter>
    <filter id="soft"><feGaussianBlur stdDeviation="2"/></filter>
  </defs>`];
  parts.push(`<rect width="${W}" height="${H}" fill="url(#glow)"/>`);
  parts.push(`<rect width="${W}" height="${H}" fill="url(#warm)"/>`);
  for (let i = 0; i < 46; i++) {
    const cx = pick(0, W);
    const cy = pick(40, 520);
    const r = pick(10, 34);
    parts.push(`<line x1="${cx}" y1="0" x2="${cx}" y2="${cy}" stroke="#2a2733" stroke-width="1.5"/>`);
    parts.push(`<circle cx="${cx}" cy="${cy}" r="${r * 2.6}" fill="url(#bulb)" filter="url(#blur)"/>`);
    parts.push(`<ellipse cx="${cx}" cy="${cy}" rx="${r}" ry="${r * 0.45}" fill="#fff0cf" fill-opacity="0.85"/>`);
  }
  // LED band in perspective
  const band = [];
  band.push(`<path d="M1000 380 L2400 250 L2400 470 L1000 520 Z" fill="#0d1224" stroke="#1e2744" stroke-width="3"/>`);
  const text = "A NEW CHAPTER FOR GLOBAL FINANCE";
  let cx = 1060;
  for (const ch of text) {
    const t = (cx - 1000) / 1400;
    const top = 380 - 130 * t + 18;
    const bottom = 520 - 50 * t - 18;
    const size = (bottom - top) * 0.72;
    band.push(`<text x="${cx}" y="${bottom - (bottom - top) * 0.2}" font-family="Helvetica, Arial, sans-serif" font-weight="700" font-size="${size.toFixed(0)}" fill="#8fb6ff" fill-opacity="0.85" filter="url(#soft)">${ch === " " ? "&#160;" : ch}</text>`);
    cx += ch === " " ? size * 0.35 : size * 0.62;
    if (cx > 2380) break;
  }
  parts.push(...band);
  parts.push(`<rect y="${H * 0.62}" width="${W}" height="${H * 0.38}" fill="#07060d" fill-opacity="0.85"/>`);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${parts.join("")}</svg>`;
}

/* ---------------------------------------------------------------- */
/* Facade: vertical fins in copper and glass.                        */
/* ---------------------------------------------------------------- */
function facade() {
  const W = 2400;
  const H = 1000;
  const parts = [`<defs>
    <linearGradient id="fin" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#6b3d1f"/><stop offset="0.45" stop-color="#c77a3e"/><stop offset="1" stop-color="#7a4522"/>
    </linearGradient>
    <linearGradient id="glass" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#8ea4bf"/><stop offset="1" stop-color="#3b4658"/>
    </linearGradient>
    <linearGradient id="shade" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#000" stop-opacity="0.55"/><stop offset="0.5" stop-color="#000" stop-opacity="0.15"/><stop offset="1" stop-color="#000" stop-opacity="0.6"/>
    </linearGradient>
  </defs>`];
  parts.push(`<rect width="${W}" height="${H}" fill="url(#glass)"/>`);
  for (let y = 0; y < H; y += 120) parts.push(`<rect x="0" y="${y}" width="${W}" height="6" fill="#2a2f3a" fill-opacity="0.6"/>`);
  let x = 0;
  let step = 40;
  while (x < W) {
    const w = step * 0.55;
    parts.push(`<rect x="${x}" y="0" width="${w.toFixed(1)}" height="${H}" fill="url(#fin)"/>`);
    parts.push(`<rect x="${(x + w).toFixed(1)}" y="0" width="3" height="${H}" fill="#1c1f27" fill-opacity="0.8"/>`);
    x += step;
    step *= 1.045;
  }
  for (let i = 0; i < 40; i++) {
    parts.push(`<rect x="${pick(0, W)}" y="${pick(0, H)}" width="${pick(40, 140)}" height="2" fill="#dfe9f5" fill-opacity="${pick(0.05, 0.25).toFixed(2)}" transform="rotate(-18)"/>`);
  }
  parts.push(`<rect width="${W}" height="${H}" fill="url(#shade)"/>`);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${parts.join("")}</svg>`;
}

await sharp(Buffer.from(skyline())).webp({ quality: 82 }).toFile(`${OUT}skyline.webp`);
await sharp(Buffer.from(hall())).webp({ quality: 80 }).toFile(`${OUT}hall.webp`);
await sharp(Buffer.from(facade())).blur(1.2).webp({ quality: 80 }).toFile(`${OUT}facade.webp`);
console.log("art written");
