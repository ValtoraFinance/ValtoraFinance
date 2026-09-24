# VALTORA FINANCE

**A New Chapter for Global Finance.**

Website for VALTORA FINANCE ($VALTORA), a token project on Robinhood Chain designing on-chain access to real-world assets: tokenized equities (Valtora Equities), a yield-bearing dollar note (VYLD) and short-dated treasury exposure (VTSY). The products are planned and not yet issued; the site says so everywhere and shows no invented figures.

- Site: https://valtorafinance.xyz
- X: https://x.com/valtora

## Stack

- Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4
- No wallet SDK: EIP-6963 discovery with a `window.ethereum` fallback, `eth_requestAccounts`, switch/add Robinhood Chain (chain id 4663), silent session restore, wrong-network handling and disconnect
- Live reads from the public Robinhood Chain RPC (block height, wallet ETH balance, token contract once published)
- Reference share prices for the equities page from Nasdaq's public quote endpoint, cached in memory (`/api/quotes`)

## Run locally

```bash
npm install
npm run build
npm run start        # http://localhost:4660
```

`npm run dev` also serves on port 4660.

## Routes

`/`, `/equities`, `/yield`, `/treasury`, `/token`, `/app`, `/insights`, `/insights/[slug]`, `/blog`, `/learn`, `/ecosystem`, `/grants`, `/docs`, `/trust`, `/team`, `/contact`, `/media`, `/terms`, `/privacy`, plus `/api/quotes`, `robots.txt` and `sitemap.xml`.

## Change the contract address

Everything reads from one constant in `src/config/brand.ts`:

```ts
const CA = "0x…"; // the real $VALTORA address
```

The navbar copy pill, footer block, token page and explorer links update from it. When the value is a valid `0x` + 40 hex address, the token page also reads name, symbol and supply from the chain.

## Environment variables (all optional)

| Name | Where | Purpose |
|---|---|---|
| `NEXT_PUBLIC_ROBINHOOD_RPC_URL` | browser + server | Private Robinhood Chain RPC URL (for example an Alchemy endpoint). Without it the public RPC is used, with a second public endpoint as read fallback. |
| `ROBINHOOD_RPC_URL` | server only | Private RPC for server-side reads. |

Set them in `.env.local` for local runs, or in Vercel under Project → Settings → Environment Variables, then redeploy. The site works fully without them.

## Brand assets

- `scripts/make-brand.mjs` renders the favicon, app icons, trimmed mark and Open Graph banner from the supplied mark and banner.
- `scripts/make-art.mjs` renders the scenic artwork (skyline, hall, facade) procedurally.

## Disclaimer

$VALTORA is a crypto token. It is not a security, deposit or fund unit, and gives no claim on any asset described on the site. Nothing here is investment advice or an offer to buy or sell anything.
