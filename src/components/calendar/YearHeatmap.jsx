import React from 'react';
import { fmtUsd, fmtPct } from '@/lib/journal/format';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** GitHub-style grid. Intensity = |daily %| ÷ max daily %, based on entry date. */
export default function YearHeatmap({ year, days, maxPct }) {
  const start = Date.UTC(year, 0, 1);
  const offset = (new Date(start).getUTCDay() + 6) % 7;
  const total = (Date.UTC(year + 1, 0, 1) - start) / 864e5;
  const cells = [...Array(offset).fill(null), ...Array.from({ length: total }, (_, i) => new Date(start + i * 864e5).toISOString().slice(0, 10))];
  const weeks = Array.from({ length: Math.ceil(cells.length / 7) }, (_, i) => cells.slice(i * 7, i * 7 + 7));

  const style = (d) => {
    if (!d || d.pct === null) return { background: d ? '#B38F6F' : '#232323', opacity: d ? 0.6 : 1 };
    const ratio = Math.min(1, Math.abs(d.pct) / maxPct);
    const color = d.net > 0 ? '#6FA583' : d.net < 0 ? '#E06A6A' : '#B38F6F';
    return { background: color, opacity: 0.3 + 0.7 * ratio };
  };

  return (
    <div className="overflow-x-auto pb-2">
      <div className="inline-flex flex-col gap-1">
        <div className="flex gap-[3px] pl-8 text-[10px] text-muted-foreground">
          {weeks.map((w, i) => {
            const first = w.find(Boolean);
            const label = first && first.slice(8) <= '07' ? MONTHS[Number(first.slice(5, 7)) - 1] : '';
            return <div key={i} className="w-[11px] overflow-visible whitespace-nowrap">{label}</div>;
          })}
        </div>
        <div className="flex gap-[3px]">
          <div className="flex w-7 flex-col gap-[3px] text-[10px] text-muted-foreground">
            {['Mon', '', 'Wed', '', 'Fri', '', ''].map((l, i) => <div key={i} className="h-[11px] leading-[11px]">{l}</div>)}
          </div>
          {weeks.map((w, wi) => (
            <div key={wi} className="flex flex-col gap-[3px]">
              {Array.from({ length: 7 }, (_, di) => {
                const date = w[di];
                const d = date ? days.get(date) : null;
                return (
                  <div key={di} className="h-[11px] w-[11px] rounded-[3px]"
                    style={date ? (d ? style(d) : { background: '#262626' }) : { background: 'transparent' }}
                    title={date ? `${date}: ${d ? `${fmtUsd(d.net, { sign: true })} (${fmtPct(d.pct, { sign: true, decimals: 2 })}), ${d.count} trades` : 'no trades'}` : undefined} />
                );
              })}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-profit" /> Profit day</span>
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-loss" /> Loss day</span>
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-sand" /> Breakeven</span>
        <span>Full intensity at ±{maxPct}% daily return</span>
      </div>
    </div>
  );
}