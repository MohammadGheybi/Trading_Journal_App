import React from 'react';
import { cn } from '@/lib/utils';
import { fmtUsd } from '@/lib/journal/format';
import PnlValue from '@/components/kit/PnlValue';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function YearlyPerformance({ year, days, onMonth }) {
  const months = MONTHS.map((label, m) => {
    const prefix = `${year}-${String(m + 1).padStart(2, '0')}`;
    const ds = [...days.values()].filter((d) => d.date.startsWith(prefix));
    return { label, m, net: ds.reduce((a, d) => a + d.net, 0), count: ds.reduce((a, d) => a + d.count, 0) };
  });
  const ytd = months.reduce((a, m) => a + m.net, 0);
  const ytdCount = months.reduce((a, m) => a + m.count, 0);
  return (
    <div>
      <div className="mb-4 flex items-baseline justify-between">
        <span className="text-sm text-muted-foreground">Year to date · <span className="num">{ytdCount}</span> trades</span>
        <PnlValue value={ytd} className="text-xl" />
      </div>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6">
        {months.map((mo) => (
          <button key={mo.label} type="button" onClick={() => onMonth(mo.m)}
            className={cn('rounded-xl border p-3 text-left transition-colors',
              !mo.count ? 'border-border/60 bg-surface-2/50 hover:bg-surface-2' : mo.net > 0 ? 'border-profit/30 bg-profit/[0.08] hover:bg-profit/[0.14]' : mo.net < 0 ? 'border-loss/30 bg-loss/[0.08] hover:bg-loss/[0.14]' : 'border-sand/30 bg-sand/[0.08]')}>
            <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{mo.label}</div>
            <div className={cn('num mt-1.5 text-sm font-semibold', !mo.count ? 'text-muted-foreground' : mo.net > 0 ? 'text-profit' : mo.net < 0 ? 'text-loss' : 'text-sand')}>
              {mo.count ? fmtUsd(mo.net, { sign: true, decimals: 0 }) : '—'}
            </div>
            <div className="text-[11px] text-muted-foreground">{mo.count} trades</div>
          </button>
        ))}
      </div>
    </div>
  );
}