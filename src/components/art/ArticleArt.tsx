/* Cover art for articles, drawn in SVG so no photography or third-party
   imagery is needed. Each variant is a small composition in brand colours. */

const PALETTES = [
  ["#100828", "#2a1a6e", "#6d4cf0", "#c9bcff"],
  ["#0b1a33", "#1c3a73", "#4a78d1", "#bcd0f2"],
  ["#0a2419", "#0f4a31", "#16935b", "#bfe3cf"],
  ["#1a1208", "#4a2f12", "#f07a2e", "#ffd9b8"],
];

export function ArticleArt({ variant, className = "" }: { variant: number; className?: string }) {
  const v = ((variant % 10) + 10) % 10;
  const [bg, mid, accent, soft] = PALETTES[v % PALETTES.length];
  const id = `a${v}`;
  return (
    <svg viewBox="0 0 400 250" className={`block h-full w-full ${className}`} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-bg`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={bg} />
          <stop offset="1" stopColor={mid} />
        </linearGradient>
        <radialGradient id={`${id}-glow`} cx="0.7" cy="0.3" r="0.7">
          <stop offset="0" stopColor={accent} stopOpacity="0.55" />
          <stop offset="1" stopColor={accent} stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="400" height="250" fill={`url(#${id}-bg)`} />
      <rect width="400" height="250" fill={`url(#${id}-glow)`} />
      {v === 0 ? <Network accent={accent} soft={soft} /> : null}
      {v === 1 ? <Blocks accent={accent} soft={soft} /> : null}
      {v === 2 ? <TwoCoins accent={accent} soft={soft} /> : null}
      {v === 3 ? <Bill accent={accent} soft={soft} /> : null}
      {v === 4 ? <Report accent={accent} soft={soft} /> : null}
      {v === 5 ? <Coin accent={accent} soft={soft} /> : null}
      {v === 6 ? <Clock accent={accent} soft={soft} /> : null}
      {v === 7 ? <Wave accent={accent} soft={soft} /> : null}
      {v === 8 ? <Stack accent={accent} soft={soft} /> : null}
      {v === 9 ? <Grid accent={accent} soft={soft} /> : null}
    </svg>
  );
}

type P = { accent: string; soft: string };

function Network({ accent, soft }: P) {
  const nodes = [
    [70, 70], [150, 50], [230, 90], [320, 60], [110, 150], [200, 170], [290, 150], [350, 200], [60, 200],
  ];
  const links = [[0, 1], [1, 2], [2, 3], [0, 4], [4, 5], [5, 6], [6, 3], [6, 7], [4, 8], [2, 5], [1, 5]];
  return (
    <g>
      {links.map(([a, b], i) => (
        <line key={i} x1={nodes[a][0]} y1={nodes[a][1]} x2={nodes[b][0]} y2={nodes[b][1]} stroke={soft} strokeOpacity="0.4" />
      ))}
      {nodes.map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r={i === 5 ? 16 : 7} fill={i === 5 ? accent : soft} fillOpacity={i === 5 ? 1 : 0.85} />
          {i === 5 ? <circle cx={x} cy={y} r="30" fill="none" stroke={accent} strokeOpacity="0.5" /> : null}
        </g>
      ))}
    </g>
  );
}

function Blocks({ accent, soft }: P) {
  return (
    <g>
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i} transform={`translate(${40 + i * 70} ${150 - i * 18})`}>
          <path d="M0 20 L30 5 L60 20 L30 35 Z" fill={soft} fillOpacity="0.9" />
          <path d="M0 20 L30 35 L30 70 L0 55 Z" fill={accent} />
          <path d="M60 20 L30 35 L30 70 L60 55 Z" fill={accent} fillOpacity="0.6" />
        </g>
      ))}
      <path d="M70 185 L380 90" stroke={soft} strokeDasharray="4 6" strokeOpacity="0.5" />
    </g>
  );
}

function TwoCoins({ accent, soft }: P) {
  return (
    <g>
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <rect key={i} x={50 + i * 20} y={190 - i * 16} width="12" height={20 + i * 16} rx="3" fill={soft} fillOpacity={0.35 + i * 0.09} />
      ))}
      {[0, 1, 2, 3, 4, 5, 6].map((i) =>
        [0, 1, 2, 3].slice(0, 1 + Math.floor(i / 2)).map((k) => (
          <circle key={`${i}-${k}`} cx={230 + i * 20} cy={200 - k * 16} r="7" fill={accent} fillOpacity={0.5 + k * 0.15} />
        )),
      )}
      <text x="50" y="60" fill="#fff" fontFamily="system-ui" fontSize="22" fontWeight="600">Accruing</text>
      <text x="230" y="60" fill="#fff" fontFamily="system-ui" fontSize="22" fontWeight="600">Rebasing</text>
    </g>
  );
}

function Bill({ accent, soft }: P) {
  return (
    <g>
      <rect x="110" y="40" width="180" height="170" rx="10" fill={soft} fillOpacity="0.95" transform="rotate(-6 200 125)" />
      <rect x="120" y="50" width="180" height="170" rx="10" fill="#fff" />
      {[0, 1, 2, 3, 4].map((i) => (
        <rect key={i} x="140" y={80 + i * 22} width={i === 0 ? 90 : 140 - i * 12} height="8" rx="4" fill={i === 0 ? accent : "#d9d8e0"} />
      ))}
      <circle cx="265" cy="185" r="18" fill={accent} />
      <path d="M257 185 l6 6 l10 -12" stroke="#fff" strokeWidth="3" fill="none" />
    </g>
  );
}

function Report({ accent, soft }: P) {
  return (
    <g>
      <rect x="60" y="45" width="280" height="160" rx="12" fill="#fff" fillOpacity="0.06" stroke={soft} strokeOpacity="0.3" />
      {[0.4, 0.55, 0.5, 0.7, 0.65, 0.85, 0.8, 0.95].map((h, i) => (
        <rect key={i} x={85 + i * 30} y={185 - h * 110} width="18" height={h * 110} rx="3" fill={i > 5 ? accent : soft} fillOpacity={i > 5 ? 1 : 0.55} />
      ))}
      <line x1="80" y1="186" x2="320" y2="186" stroke={soft} strokeOpacity="0.5" />
    </g>
  );
}

function Coin({ accent, soft }: P) {
  return (
    <g>
      <circle cx="200" cy="125" r="80" fill={accent} />
      <circle cx="200" cy="125" r="80" fill="none" stroke={soft} strokeWidth="3" strokeOpacity="0.8" />
      <circle cx="200" cy="125" r="64" fill="none" stroke="#fff" strokeOpacity="0.35" strokeDasharray="3 5" />
      <path d="M168 98 L186 98 L200 124 L191 124 Z M200 124 L214 98 L232 98 L207 142 Z M191 124 L200 124 L207 142 L200 155 Z" fill="#fff" />
    </g>
  );
}

function Clock({ accent, soft }: P) {
  return (
    <g>
      <circle cx="200" cy="125" r="86" fill="none" stroke={soft} strokeOpacity="0.25" strokeWidth="2" />
      {Array.from({ length: 24 }, (_, i) => {
        const a = (i / 24) * Math.PI * 2;
        return <circle key={i} cx={200 + Math.sin(a) * 86} cy={125 - Math.cos(a) * 86} r={i % 6 === 0 ? 5 : 3} fill={i < 17 ? soft : accent} />;
      })}
      <line x1="200" y1="125" x2="200" y2="62" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
      <line x1="200" y1="125" x2="245" y2="150" stroke={accent} strokeWidth="4" strokeLinecap="round" />
      <circle cx="200" cy="125" r="6" fill="#fff" />
    </g>
  );
}

function Wave({ accent, soft }: P) {
  return (
    <g>
      {Array.from({ length: 36 }, (_, i) => {
        const h = 16 + Math.abs(Math.sin(i * 0.55) * 70) + (i % 3) * 6;
        return <rect key={i} x={40 + i * 9} y={125 - h / 2} width="5" height={h} rx="2.5" fill={i % 5 === 0 ? accent : soft} fillOpacity="0.85" />;
      })}
    </g>
  );
}

function Stack({ accent, soft }: P) {
  return (
    <g>
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <ellipse key={i} cx="200" cy={190 - i * 22} rx="90" ry="22" fill={i === 5 ? accent : soft} fillOpacity={i === 5 ? 1 : 0.35 + i * 0.1} stroke="#fff" strokeOpacity="0.4" />
      ))}
    </g>
  );
}

function Grid({ accent, soft }: P) {
  return (
    <g>
      {Array.from({ length: 11 }, (_, r) =>
        Array.from({ length: 19 }, (_, c) => {
          const on = Math.sin(r * 0.9 + c * 0.5) + Math.cos(c * 0.7 - r * 0.3) > 0.9;
          return <circle key={`${r}-${c}`} cx={30 + c * 19} cy={30 + r * 19} r="3.4" fill={on ? accent : soft} fillOpacity={on ? 1 : 0.18} />;
        }),
      )}
    </g>
  );
}
