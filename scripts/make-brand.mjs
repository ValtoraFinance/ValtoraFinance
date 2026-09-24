/* Renders the Valtora brand assets from the owner-supplied mark and banner.
 *
 *   npm run brand
 *
 * Writes public/brand/{valtora-mark.webp, valtora-plate.webp, og.webp} and
 * src/app/{favicon.ico, icon.png, apple-icon.png}. Every image is .webp except
 * the browser icons, which browsers and crawlers read as ICO/PNG.
 */
import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const SRC = fileURLToPath(new URL("./mark-source.webp", import.meta.url));
const BANNER = fileURLToPath(new URL("./banner-source.webp", import.meta.url));
const OUT = fileURLToPath(new URL("../public/brand/", import.meta.url));
const APP = fileURLToPath(new URL("../src/app/", import.meta.url));
const PLATE = { r: 16, g: 8, b: 40, alpha: 1 }; // #100828, the plate colour of the mark

// The source mark sits in a large transparent canvas; trim it so it fills UI slots.
const trimmed = await sharp(SRC).trim().png().toBuffer();

/** Mark centred on the plate colour, filling `fill` of the square. */
async function plate(size, fill, radius = 0) {
  const inner = Math.round(size * fill);
  const mark = await sharp(trimmed).resize(inner, inner, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
  const mask = radius
    ? Buffer.from(`<svg width="${size}" height="${size}"><rect width="${size}" height="${size}" rx="${radius}" fill="#fff"/></svg>`)
    : null;
  let img = sharp({ create: { width: size, height: size, channels: 4, background: PLATE } }).composite([{ input: mark, gravity: "center" }]);
  if (mask) img = sharp(await img.png().toBuffer()).composite([{ input: mask, blend: "dest-in" }]);
  return img.png({ compressionLevel: 9 }).toBuffer();
}

function buildIco(pngs) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(pngs.length, 4);
  let offset = 6 + pngs.length * 16;
  const entries = pngs.map(({ size, data }) => {
    const e = Buffer.alloc(16);
    e.writeUInt8(size >= 256 ? 0 : size, 0);
    e.writeUInt8(size >= 256 ? 0 : size, 1);
    e.writeUInt16LE(1, 4);
    e.writeUInt16LE(32, 6);
    e.writeUInt32LE(data.length, 8);
    e.writeUInt32LE(offset, 12);
    offset += data.length;
    return e;
  });
  return Buffer.concat([header, ...entries, ...pngs.map((p) => p.data)]);
}

await mkdir(OUT, { recursive: true });
await sharp(trimmed).resize(512, 512, { fit: "inside" }).webp({ quality: 95 }).toFile(`${OUT}valtora-mark.webp`);
await sharp(await plate(512, 0.62)).webp({ quality: 95 }).toFile(`${OUT}valtora-plate.webp`);
await sharp(BANNER).resize(1500, 500).webp({ quality: 88 }).toFile(`${OUT}og.webp`);
const ico = await Promise.all([16, 32, 48].map(async (size) => ({ size, data: await plate(size, 0.74, Math.round(size * 0.2)) })));
await writeFile(`${APP}favicon.ico`, buildIco(ico));
await writeFile(`${APP}icon.png`, await plate(192, 0.66, 40));
await writeFile(`${APP}apple-icon.png`, await plate(180, 0.6));
console.log("brand assets written");
