export function PageHead({ kicker, title, sub, lead }: { kicker?: string; title: string; sub?: string; lead?: string }) {
  return (
    <section className="bg-white pt-36 pb-12 md:pt-44 md:pb-16">
      <div className="wrap">
        {kicker ? <p className="text-[15px] font-medium text-mute">{kicker}</p> : null}
        <h1 className="mt-3 max-w-[860px] text-[42px] leading-[1.02] font-medium tracking-[-0.035em] md:text-[56px]">
          {title}
          {sub ? (
            <>
              <br />
              <span className="text-mute">{sub}</span>
            </>
          ) : null}
        </h1>
        {lead ? <p className="mt-6 max-w-[600px] font-serif text-[18px] leading-snug text-ink/80 md:text-[19px]">{lead}</p> : null}
      </div>
    </section>
  );
}

export function Prose({ sections }: { sections: { h: string; p: string[]; id?: string }[] }) {
  return (
    <section className="bg-white pb-24">
      <div className="wrap grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,240px)_minmax(0,1fr)]">
        <nav className="hidden lg:block">
          <ul className="sticky top-28 space-y-2 text-[14px] text-mute">
            {sections.map((s, i) => (
              <li key={s.h}>
                <a href={`#${s.id ?? `s${i}`}`} className="hover:text-ink">
                  {s.h}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="max-w-[720px] space-y-12">
          {sections.map((s, i) => (
            <div key={s.h} id={s.id ?? `s${i}`} className="scroll-mt-28">
              <h2 className="text-[24px] font-medium tracking-[-0.02em]">{s.h}</h2>
              <div className="mt-4 space-y-4 font-serif text-[17.5px] leading-[1.55] text-ink/80">
                {s.p.map((t, k) => (
                  <p key={k}>{t}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
