import React from 'react';
import { cn } from '@/lib/utils';
import { fmtUsd, fmtAxisUsd, fmtPct } from '@/lib/journal/format';

const WD = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const iso = (y, m, d) => `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
const tone = (v) => (v > 0 ? 'border-profit/30 bg-profit/[0.10] hover:bg-profit/[0.16]' : v < 0 ? 'border-loss/30 bg-loss/[0.10] hover:bg-loss/[0.16]' : 'border-sand/30 bg-sand/[0.10] hover:bg-sand/[0.16]');
const text = (v) => (v > 0 ? 'text-profit' : v < 0 ? 'text-loss' : 'text-sand');

export default function MonthCalendar({ year, month, days, onDay }) {
  const offset = (new Date(Date.UTC(year, month, 1)).getUTCDay() + 6) % 7;
  const count = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const cells = [...Array(offset).fill(null), ...Array.from({ length: count }, (_, i) => i + 1)];
  while (cells.length % 7) cells.push(null);
  const weeks = Array.from({ length: cells.length / 7 }, (_, i) => cells.slice(i * 7, i * 7 + 7));
  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="grid grid-cols-7 gap-1.5 sm:grid-cols-8 sm:gap-2">
      {[...WD, 'Week'].map((d, i) => (
        <div key={d} className={cn('pb-1 text-center text-[11px] font-semibold uppercase tracking-wider text-muted-foreground', i === 7 && 'hidden text-sand sm:block')}>{d}</div>
      ))}
      {weeks.map((w, wi) => {
        const wd = w.filter(Boolean).map((d) => days.get(iso(year, month, d))).filter(Boolean);
        const wNet = wd.reduce((a, d) => a + d.net, 0);
        const wCount = wd.reduce((a, d) => a + d.count, 0);
        return (
          <React.Fragment key={wi}>
            {w.map((d, di) => {
              if (!d) return <div key={di} className="aspect-square rounded-xl sm:aspect-[5/4]" />;
              const key = iso(year, month, d);
              const data = days.get(key);
              return (
                <button key={di} type="button" onClick={() => onDay(key)} aria-label={`${key}${data ? `, ${fmtUsd(data.net, { sign: true })}, ${data.count} trades` : ', no trades'}`}
                  className={cn('flex aspect-square flex-col rounded-xl border p-1.5 text-left transition-colors sm:aspect-[5/4] sm:p-2.5',
                    data ? tone(data.net) : 'border-border/60 bg-surface-2/50 hover:bg-surface-2', key === today && 'ring-1 ring-crimson-soft')}>
                  <span className={cn('num text-[11px] sm:text-xs', key === today ? 'font-bold text-pearl' : 'text-muted-foreground')}>{d}</span>
                  {data && (
                    <span className="mt-auto">
                      <span className={cn('num block text-[10px] font-semibold sm:hidden', text(data.net))}>{data.net > 0 ? '+' : ''}{fmtAxisUsd(data.net)}</span>
                      <span className={cn('num hidden text-sm font-semibold sm:block', text(data.net))}>{fmtUsd(data.net, { sign: true, decimals: 0 })}</span>
                      <span className="hidden text-[11px] text-muted-foreground sm:block">
                        {data.pct !== null && <span className="num">{fmtPct(data.pct, { sign: true, decimals: 2 })} · </span>}{data.count} trade{data.count > 1 ? 's' : ''}
                      </span>
                    </span>
                  )}
                </button>
              );
            })}
            <div className="hidden flex-col justify-center rounded-xl border border-sand/20 bg-surface p-2.5 sm:flex">
              <span className="text-[10px] uppercase tracking-wide text-muted-foreground">W{wi + 1}</span>
              <span className={cn('num text-sm font-semibold', wCount ? text(wNet) : 'text-muted-foreground')}>{wCount ? fmtUsd(wNet, { sign: true, decimals: 0 }) : '—'}</span>
              <span className="text-[11px] text-muted-foreground">{wCount} trades</span>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
}