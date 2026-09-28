import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ArrowUpRight } from "lucide-react";
import { BRAND, CHAIN, TOKEN, explorerAddress, explorerToken, explorerTx } from "@/config/brand";
import { LAUNCH, SPENDING, TREASURY_TOKENS, WALLETS } from "@/config/treasury";
import { getTreasury, type WalletBalance } from "@/lib/onchain";
import { eth, usd } from "@/lib/format";
import { CopyAddress } from "@/components/CopyAddress";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Transparency",
  description: `Every ${BRAND.name} address on ${CHAIN.name}, with live balances read from the chain: contract, treasury, dev wallet and spending.`,
};

function AddressRow({ label, note, address, href }: { label: string; note: string; address: string | null; href: string | null }) {
  return (
    <div className="grid grid-cols-1 gap-3 py-5 md:grid-cols-[minmax(0,260px)_minmax(0,1fr)] md:gap-8">
      <div>
        <p className="text-[16px] font-medium">{label}</p>
        <p className="mt-1 text-[13px] leading-snug text-mute">{note}</p>
      </div>
      {address ? (
        <div className="flex min-w-0 items-center gap-2">
          <code className="min-w-0 flex-1 rounded-md bg-mist px-3 py-2 font-mono text-[13px] break-all">{address}</code>
          <CopyAddress value={address} />
          {href ? (
            <a href={href} target="_blank" rel="noreferrer" aria-label="Open in explorer" className="inline-flex size-8 shrink-0 items-center justify-center rounded-md bg-mist text-ink/70 hover:bg-cloud">
              <ArrowUpRight className="size-4" />
            </a>
          ) : null}
        </div>
      ) : (
        <p className="self-center text-[14px] text-mute">Published at launch</p>
      )}
    </div>
  );
}

function Holdings({ title, address, balance, ethUsd }: { title: string; address: string; balance: WalletBalance; ethUsd: number | null }) {
  const rows: [string, string][] = [
    ["ETH", balance.eth === null ? "—" : eth(balance.eth)],
    ...TREASURY_TOKENS.map((t): [string, string] => {
      const v = balance.tokens[t.symbol];
      return [t.symbol, v === null || v === undefined ? "—" : t.kind === "usd" ? usd(v) : eth(v)];
    }),
  ];
  const ethValue = balance.eth === null ? null : balance.eth + (balance.tokens.WETH ?? 0) + (ethUsd ? (balance.tokens.USDG ?? 0) / ethUsd : 0);
  return (
    <div className="rounded-[16px] border border-line p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[16px] font-medium">{title}</p>
        <a href={explorerAddress(address)} target="_blank" rel="noreferrer" className="chip hover:bg-cloud">
          {CHAIN.explorerName} <ArrowUpRight className="size-3" />
        </a>
      </div>
      <p className="mt-4 text-[32px] font-medium tracking-[-0.02em] tabular-nums">{eth(ethValue)}</p>
      <p className="text-[13px] text-mute">{ethValue !== null && ethUsd ? `≈ ${usd(ethValue * ethUsd, 0)}` : "Reading the chain…"}</p>
      <dl className="mt-4 divide-y divide-line text-[14px]">
        {rows.map(([k, v]) => (
          <div key={k} className="flex justify-between py-2">
            <dt className="text-mute">{k}</dt>
            <dd className="font-mono tabular-nums">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

async function LiveHoldings() {
  const t = await getTreasury();
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
      <Holdings title="Treasury" address={WALLETS.treasury} balance={t.treasury} ethUsd={t.ethUsd} />
      <Holdings title="Dev wallet" address={WALLETS.dev} balance={t.dev} ethUsd={t.ethUsd} />
    </div>
  );
}

export default function TransparencyPage() {
  const devTransfers = TOKEN.isLive ? `${explorerToken(BRAND.ca)}?a=${WALLETS.dev}` : null;
  return (
    <>
      <section className="bg-night pt-36 pb-14 text-white md:pt-44">
        <div className="wrap">
          <p className="text-[15px] font-medium text-white/55">Transparency</p>
          <h1 className="mt-3 max-w-[900px] text-[42px] leading-[1.02] font-medium tracking-[-0.035em] md:text-[60px]">
            Anonymous Team.
            <br />
            <span className="text-white/50">Every Address On-chain.</span>
          </h1>
          <p className="mt-6 max-w-[640px] font-serif text-[18px] leading-snug text-white/75">
            {BRAND.name} is built by an anonymous team that speaks only through {BRAND.xHandle}. You should not have to trust who we are.
            Every address the project controls is listed here, and every balance on this page is read from {CHAIN.name} when you open it.
          </p>
        </div>
      </section>

      <section className="bg-white py-14 md:py-20">
        <div className="wrap">
          <h2 className="text-[28px] font-medium tracking-[-0.025em]">Addresses</h2>
          <div className="mt-4 divide-y divide-line border-y border-line">
            <AddressRow label={`${BRAND.symbol} contract`} note={`Launched on ${LAUNCH.launchpad}. Compare every character before you trade.`} address={TOKEN.isLive ? BRAND.ca : null} href={TOKEN.explorerUrl} />
            <AddressRow label="Treasury" note="Receives the launchpad creator fees. Pays for the roadmap, and nothing else." address={WALLETS.treasury} href={explorerAddress(WALLETS.treasury)} />
            <AddressRow label="Dev wallet" note={`Made the ${LAUNCH.devBuyEth} ETH dev buy at launch. Its sales fund the project and stay visible below.`} address={WALLETS.dev} href={explorerAddress(WALLETS.dev)} />
            <AddressRow label="Liquidity lock" note="Proof of the locked liquidity position." address={null} href={LAUNCH.lockUrl || null} />
          </div>
        </div>
      </section>

      <section className="bg-mist py-14 md:py-20">
        <div className="wrap">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <h2 className="text-[28px] font-medium tracking-[-0.025em]">Live balances</h2>
            <p className="text-[13px] text-mute">ETH, WETH and USDG, valued with the Chainlink ETH / USD feed.</p>
          </div>
          <div className="mt-6">
            <Suspense fallback={<div className="grid grid-cols-1 gap-3 md:grid-cols-2">{[0, 1].map((i) => <div key={i} className="h-[300px] animate-pulse rounded-[16px] bg-white" />)}</div>}>
              <LiveHoldings />
            </Suspense>
          </div>
        </div>
      </section>

      <section className="bg-white py-14 md:py-20">
        <div className="wrap grid grid-cols-1 gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-[28px] font-medium tracking-[-0.025em]">How the project is funded</h2>
            <div className="mt-4 space-y-4 font-serif text-[17px] leading-[1.55] text-ink/80">
              <p>
                {BRAND.symbol} launches on {LAUNCH.launchpad} with a single {LAUNCH.devBuyEth} ETH dev buy. The project is funded in two ways,
                both visible on-chain:
              </p>
              <p>
                <b className="font-sans font-medium">Creator fees.</b> The launchpad sends its creator fee on every trade to the treasury.
                The treasury pays for the <Link href="/roadmap" className="underline underline-offset-4">roadmap</Link>, and every payment
                it makes is listed in the ledger on this page.
              </p>
              <p>
                <b className="font-sans font-medium">Dev wallet sales.</b> The dev wallet bought {LAUNCH.devBuyEth} ETH of {BRAND.symbol} at
                launch. Selling from that position pays for early work. Every sale is a public transfer from the address above.
              </p>
            </div>
            {devTransfers ? (
              <a href={devTransfers} target="_blank" rel="noreferrer" className="btn btn-dark mt-6 px-4 py-3 text-[15px]">
                Dev wallet {BRAND.symbol} transfers <ArrowUpRight className="size-4" />
              </a>
            ) : (
              <p className="mt-6 text-[14px] text-mute">A direct link to every dev wallet transfer appears here once the contract is live.</p>
            )}
          </div>
          <div>
            <h2 className="text-[28px] font-medium tracking-[-0.025em]">Spending ledger</h2>
            {SPENDING.length ? (
              <div className="mt-4 divide-y divide-line border-y border-line text-[14px]">
                {SPENDING.map((s) => (
                  <div key={s.tx} className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 py-3">
                    <span className="font-mono text-[12px] text-mute">{s.date}</span>
                    <span>
                      <b className="font-medium">{s.milestone}</b> · {s.purpose}
                    </span>
                    <a href={explorerTx(s.tx)} target="_blank" rel="noreferrer" className="font-mono tabular-nums underline underline-offset-4">
                      {eth(s.eth)}
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-4 rounded-[16px] border border-dashed border-line p-6 text-[14px] text-mute">
                Nothing has been spent from the treasury yet. Each payment will be listed here with its transaction.
              </p>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
