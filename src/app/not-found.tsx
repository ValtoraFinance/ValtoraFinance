import Link from "next/link";

export default function NotFound() {
  return (
    <section className="grid min-h-[80dvh] place-items-center bg-white px-4 pt-24 text-center">
      <div>
        <p className="font-mono text-[13px] text-mute">404</p>
        <h1 className="mt-3 text-[44px] leading-none font-medium tracking-[-0.035em] md:text-[56px]">
          This page is <span className="text-mute">not on the ledger.</span>
        </h1>
        <Link href="/" className="btn btn-dark mt-8">
          Back to home
        </Link>
      </div>
    </section>
  );
}
