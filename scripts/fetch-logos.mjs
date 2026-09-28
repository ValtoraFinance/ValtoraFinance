/* Downloads issuer logos for every resolved asset that does not have one yet
 * and writes them to public/stocks/<ticker>.webp (transparent, trimmed,
 * centred on a 128px canvas). Then renders public/tiles/<ticker>.webp for
 * the terminal: the same logo baked onto a square tile whose colour is picked
 * from the logo's measured brightness, so white logos never vanish.
 *
 *   node scripts/fetch-logos.mjs
 *
 * Source: financialmodelingprep.com/image-stock, which needs no key.
 */
import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const generated = readFileSync(new URL("../src/config/assets.generated.ts", import.meta.url), "utf8");
const tickers = [...generated.matchAll(/symbol: "([A-Z.]+)"/g)].map((m) => m[1]);

const SIZE = 128;
const INNER = Math.round(SIZE * 0.72);
const missing = [];

for (const ticker of tickers) {
  const out = new URL(`../public/stocks/${ticker.toLowerCase()}.webp`, import.meta.url);
  if (existsSync(out)) continue;
  const res = await fetch(`https://financialmodelingprep.com/image-stock/${ticker}.png`, { signal: AbortSignal.timeout(20000) });
  if (!res.ok) {
    missing.push(`${ticker} (HTTP ${res.status})`);
    continue;
  }
  const input = Buffer.from(await res.arrayBuffer());
  const trimmed = await sharp(input).trim({ threshold: 1 }).toBuffer();
  const logo = await sharp(trimmed).resize(INNER, INNER, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).toBuffer();
  await sharp({ create: { width: SIZE, height: SIZE, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite([{ input: logo, gravity: "centre" }])
    .webp({ quality: 90 })
    .toFile(fileURLToPath(out));
  console.log(`${ticker.padEnd(6)} saved`);
}
if (missing.length) console.log("missing:", missing.join(", "));

/** Mean luminance of the logo's opaque pixels, 0..255. */
async function luminance(file) {
  const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  let sum = 0;
  let count = 0;
  for (let i = 0; i < data.length; i += info.channels) {
    if (data[i + 3] < 128) continue;
    sum += 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
    count++;
  }
  return count ? sum / count : 0;
}

const LIGHT = { r: 242, g: 242, b: 244, alpha: 1 };
const DARK = { r: 35, g: 27, b: 55, alpha: 1 };
mkdirSync(fileURLToPath(new URL("../public/tiles/", import.meta.url)), { recursive: true });
for (const ticker of tickers) {
  const src = fileURLToPath(new URL(`../public/stocks/${ticker.toLowerCase()}.webp`, import.meta.url));
  if (!existsSync(src)) continue;
  const lum = await luminance(src);
  const logo = await sharp(src).resize(76, 76, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).toBuffer();
  await sharp({ create: { width: 112, height: 112, channels: 4, background: lum > 200 ? DARK : LIGHT } })
    .composite([{ input: logo, gravity: "centre" }])
    .webp({ quality: 90 })
    .toFile(fileURLToPath(new URL(`../public/tiles/${ticker.toLowerCase()}.webp`, import.meta.url)));
  if (lum > 200) console.log(`${ticker.padEnd(6)} light logo, dark tile (${Math.round(lum)})`);
}
