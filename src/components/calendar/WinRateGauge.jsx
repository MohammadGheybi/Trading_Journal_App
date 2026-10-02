import React from 'react';
import { C } from '@/lib/journal/chartTheme';
import { fmtPct } from '@/lib/journal/format';

export default function WinRateGauge({ winRate, wins, total }) {
  const pct = winRate ?? 0;
  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 200 110" className="w-full max-w-[220px]" role="img" aria-label={`Monthly win rate ${fmtPct(winRate)}`}>
        <path d="M 16 100 A 84 84 0 0 1 184 100" fill="none" stroke="#2C2C2C" strokeWidth="14" strokeLinecap="round" />
        <path d="M 16 100 A 84 84 0 0 1 184 100" fill="none" stroke={C.profit} strokeWidth="14" strokeLinecap="round" pathLength="100"
          strokeDasharray={`${pct} 100`} style={{ transition: 'stroke-dasharray 700ms ease' }} />
        <text x="100" y="88" textAnchor="middle" className="num" fill={C.pearl} fontSize="28" fontFamily="JetBrains Mono">{winRate === null ? '—' : `${Math.round(pct)}%`}</text>
      </svg>
      <div className="mt-1 text-xs text-muted-foreground">{wins} wins of {total} trades</div>
    </div>
  );
}