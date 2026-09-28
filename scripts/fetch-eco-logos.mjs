/* Downloads site icons for the ecosystem directory and renders them as
 * 112px tiles in public/eco/<slug>.webp.
 *
 *   node scripts/fetch-eco-logos.mjs
 *
 * Source: Google's public favicon service (no key), or a direct image URL
 * where the favicon is too small. An icon smaller than 64px means the site has
 * no proper icon; it is reported instead of upscaled.
 */
import { mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const SITES = {
  "robinhood-chain": "robinhood.com",
  etherscan: "https://etherscan.io/images/brandassets/etherscan-logo-circle.png",
  chainlink: "chain.link",
  morpho: "morpho.org",
  uniswap: "uniswap.org",
  dexscreener: "dexscreener.com",
  pons: "pons.family",
  hoodlock: "hoodlock.tech",
  lighter: "lighter.xyz",
  metamask: "metamask.io",
  okx: "okx.com",
  brave: "brave.com",
  alchemy: "alchemy.com",
};

const LIGHT = { r: 242, g: 242, b: 244, alpha: 1 };
const DARK = { r: 35, g: 27, b: 55, alpha: 1 };
const out = fileURLToPath(new URL("../public/eco/", import.meta.url));
mkdirSync(out, { recursive: true });

async function luminance(buffer) {
  const { data, info } = await sharp(buffer).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  let sum = 0;
  let count = 0;
  for (let i = 0; i < data.length; i += info.channels) {
    if (data[i + 3] < 128) continue;
    sum += 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
    count++;
  }
  return count ? sum / count : 0;
}

for (const [slug, domain] of Object.entries(SITES)) {
  const url = domain.startsWith("https://") ? domain : `https://www.google.com/s2/favicons?domain=${domain}&sz=256`;
  const res = await fetch(url, { redirect: "follow", signal: AbortSignal.timeout(20000) });
  if (!res.ok) {
    console.log(`${slug.padEnd(16)} HTTP ${res.status}`);
    continue;
  }
  const input = Buffer.from(await res.arrayBuffer());
  const meta = await sharp(input).metadata();
  if ((meta.width ?? 0) < 64) {
    console.log(`${slug.padEnd(16)} only ${meta.width}px, skipped`);
    continue;
  }
  const lum = await luminance(input);
  const logo = await sharp(input).resize(80, 80, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).toBuffer();
  await sharp({ create: { width: 112, height: 112, channels: 4, background: lum > 200 ? DARK : LIGHT } })
    .composite([{ input: logo, gravity: "centre" }])
    .webp({ quality: 90 })
    .toFile(`${out}${slug}.webp`);
  console.log(`${slug.padEnd(16)} ${meta.width}px${lum > 200 ? ", dark tile" : ""}`);
}

// Round token marks supplied by the owner. They already fill a circle, so they
// are scaled to the full tile on a transparent canvas instead of being padded.
const LOCAL = {
  usdg: "./usdg-source.webp",
};

for (const [slug, file] of Object.entries(LOCAL)) {
  await sharp(fileURLToPath(new URL(file, import.meta.url)))
    .resize(112, 112, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .webp({ quality: 90 })
    .toFile(`${out}${slug}.webp`);
  console.log(`${slug.padEnd(16)} local`);
}
