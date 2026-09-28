# VALTORA FINANCE

**A New Chapter for Global Finance.**

Valtora Finance ($VALTORA) builds on-chain access to real-world assets on Robinhood Chain,
using only what is already live there: Robinhood's official stock tokens, Chainlink price
feeds, Morpho and Uniswap. Valtora issues no assets of its own. This repository is the full
Valtora website and app. Anyone can read it, run it, and check how it works.

- Site: https://valtorafinance.xyz
- X: https://x.com/valtorafinance
- GitHub: https://github.com/ValtoraFinance/ValtoraFinance
- Network: Robinhood Chain (chain id 4663)

## The problem

Stock tokens and a tokenized treasury fund already trade on Robinhood Chain, but using them
safely is harder than it looks.

- **Lookalikes are everywhere.** Anyone can deploy a token called "AAPL" or "TSLA". The
  ticker tells you nothing about whether it is the official one.
- **Prices are hard to trust.** A thin pool can quote far away from the real price, and most
  interfaces never compare the quote with an oracle before you sign.
- **Getting into treasuries on-chain takes several hops.** Going from ETH or dollars into the
  treasury token means finding the right pools and routes yourself.
- **Token projects ask for trust they never earn.** Treasury balances, dev wallets and
  spending are usually hidden, and the roadmap is a promise with no numbers behind it.

## The solution

Valtora is a set of tools built on existing contracts, with every address and every coin of
funding in the open.

1. **A verified terminal.** Stock tokens are recognised by the official Robinhood token
   contract they are built from, not by their ticker. Each one shows its Chainlink price next to
   its market price, and a checker tells you whether any address you paste is the real token or
   a lookalike.
2. **A treasury route (live).** Swap USDG or ETH into SGOV, the short-dated treasury token,
   through the best route across existing Uniswap pools. A swap more than 1% worse than
   Chainlink is refused, approvals are for the exact amount, and no Valtora contract ever holds
   your funds.
3. **Full transparency.** The treasury wallet, the dev wallet and every sale from it are
   listed on the site with live balances read from the chain.
4. **A roadmap funded by use.** Launch creator fees flow to the treasury. Each milestone opens
   when the treasury has received its target, and the running total is read on-chain:

| Milestone | What it delivers | Opens at | Status |
| --- | --- | --- | --- |
| M0 Terminal & Transparency | Verified stock token terminal, lookalike checker, treasury pages | built before launch | live |
| M1 Treasury route | USDG / ETH to SGOV swaps with an oracle guard | built before launch | live |
| M2 Yield vault | A USDG vault on Morpho, allocating only to markets it publishes | 0.5 ETH | funding |
| M3 Valtora Index (beta) | A basket of verified stock tokens with in-kind mint and redeem | 4 ETH | queued |
| M4 Staking & governance | Fees shared with stakers, basket changes by on-chain vote | 6 ETH | queued |

## What you can try on this site

| Page | What it does |
| --- | --- |
| `/` | Overview with live figures from the chain |
| `/terminal` | Every verified stock token with oracle and market prices, plus the lookalike checker |
| `/treasury` | The treasury route: swap USDG or ETH into SGOV |
| `/transparency` | Treasury and dev wallets, balances and every dev sale |
| `/roadmap` | Milestones and how much the treasury has received toward each |
| `/yield`, `/equities` | The next milestones: the Morpho vault and the index basket draft |
| `/token` | $VALTORA contract, supply and market links |
| `/insights`, `/blog`, `/learn`, `/docs`, `/ecosystem` | Articles, guides and the protocols Valtora builds on |
| `/api/verify?address=0x…` | The lookalike check as a JSON endpoint |

**Live now:**
- **Connect wallet** works for real: browser wallets are found automatically (MetaMask, Rabby,
  OKX, Coinbase and others), the site switches to Robinhood Chain or adds it, and phones get a
  link that opens the site inside the wallet app.
- The terminal, the lookalike checker and the transparency pages, all reading live from the
  chain.
- Treasury route swaps into SGOV, sent straight to Uniswap's router from your wallet.

**Coming later:**
- The $VALTORA contract address. Until it is published, the address pill reads "soon".
- M2 to M4 open as the treasury reaches each target. Their pages already describe what will
  be built.
- WalletConnect (QR code for mobile wallets) needs a project id; without one it shows as not
  configured.

SGOV and the stock tokens are Robinhood products, not Valtora products. They can be paused or
frozen by their issuer, are only available in supported jurisdictions, and can lose value.

## Run it locally

You need Node.js 20 or newer. Download this repository (Code, Download ZIP) or fork it, then
open a terminal in its folder:

```bash
npm install
npm run build
npm start
```

Open http://localhost:4660. During development use `npm run dev` instead of the last two
steps.

No accounts or API keys are needed. The site uses Robinhood Chain's public RPC.

### Optional settings

Create `.env.local` in the project root with any of these:

| Variable | Used by | Value |
| --- | --- | --- |
| `NEXT_PUBLIC_ROBINHOOD_RPC_URL` | browser and server | Full HTTPS RPC URL for Robinhood Chain mainnet (for example Alchemy). It is visible to visitors, so do not use a secret key here |
| `ROBINHOOD_RPC_URL` | server only | Full HTTPS RPC URL |
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | browser | 32 hex characters, from cloud.reown.com (Create project). Add your site's domain to the project's allowed origins |

If no RPC is set, the site uses `https://rpc.mainnet.chain.robinhood.com`, with
`https://robinhood-rpc.publicnode.com` as a fallback. On Vercel, add the variables under
Project, Settings, Environment Variables, then redeploy.

### Robinhood Chain in your wallet

The site adds the network for you. To add it by hand:

| Field | Value |
| --- | --- |
| Network name | Robinhood Chain |
| Chain ID | 4663 |
| RPC URL | https://rpc.mainnet.chain.robinhood.com |
| Currency | ETH |
| Explorer | https://robin.etherscan.io |

## Project layout

```
src/app/                 pages and the /api/verify endpoint
src/components/          UI, wallet connect, treasury swap widget, terminal
src/config/brand.ts      name, links, network and token contract address
src/config/treasury.ts   treasury and dev wallets, milestones and their targets
src/config/swap.ts       Uniswap and token addresses used by the treasury route
src/lib/onchain.ts       server reads: Chainlink, token checks, treasury balances
src/lib/swap.ts          quotes, oracle guard and swap building
scripts/                 asset lists, logos, brand images, swap simulation
```

Built with Next.js 16, React 19, TypeScript and Tailwind CSS v4. Wallet connect uses the
standard wallet interfaces (EIP-6963, EIP-1193); `viem` is used only to encode and decode contract calls and format amounts.

To check the treasury route without spending anything, run
`npx tsx scripts/simulate-swap.mts`. It simulates all three swap directions against the live
chain and compares them with the quotes.

## Token contract

The $VALTORA contract address is set in one place: `const CA` in `src/config/brand.ts`. The
navbar pill, the footer, the token page and every explorer link read from it. Once it holds a
valid address, the token page also reads name, symbol and supply from the chain.

$VALTORA is a crypto token. It is not a security, a deposit or a fund unit, and gives no claim
on any asset described on the site. Nothing here is investment advice.

## License

MIT
