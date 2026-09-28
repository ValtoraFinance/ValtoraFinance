/* Downloads wallet icons for the connect dialog into public/wallets/<id>.webp
 * (64px, rounded by CSS).
 *
 *   node scripts/fetch-wallet-logos.mjs
 *
 * Source: Google's public favicon service (no key). Icons under 32px are
 * reported and skipped; the dialog then falls back to a generic glyph.
 */
import { mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const WALLETS = {
  metamask: "metamask.io",
  rabby: "rabby.io",
  okx: "okx.com",
  coinbase: "coinbase.com",
  trust: "trustwallet.com",
  rainbow: "rainbow.me",
  bitget: "web3.bitget.com",
  zerion: "zerion.io",
  brave: "brave.com",
  walletconnect: "walletconnect.network",
};

const out = fileURLToPath(new URL("../public/wallets/", import.meta.url));
mkdirSync(out, { recursive: true });

for (const [id, domain] of Object.entries(WALLETS)) {
  const res = await fetch(`https://www.google.com/s2/favicons?domain=${domain}&sz=256`, { redirect: "follow", signal: AbortSignal.timeout(20000) });
  if (!res.ok) {
    console.log(`${id.padEnd(14)} HTTP ${res.status}`);
    continue;
  }
  const input = Buffer.from(await res.arrayBuffer());
  const meta = await sharp(input).metadata();
  if ((meta.width ?? 0) < 32) {
    console.log(`${id.padEnd(14)} only ${meta.width}px, skipped`);
    continue;
  }
  await sharp(input).resize(64, 64, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).webp({ quality: 92 }).toFile(`${out}${id}.webp`);
  console.log(`${id.padEnd(14)} ${meta.width}px`);
}
