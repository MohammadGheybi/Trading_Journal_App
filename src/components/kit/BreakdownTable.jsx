import React from 'react';
import PnlValue from './PnlValue';
import { fmtPct } from '@/lib/journal/format';

export default function BreakdownTable({ rows, keyLabel = 'Group', renderKey }) {
  if (!rows.length) return <p className="py-6 text-center text-sm text-muted-foreground">No closed trades in this view.</p>;
  return (
    <div className="-mx-1 overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs uppercase tracking-wide text-muted-foreground">
            <th className="px-1 pb-2 font-medium">{keyLabel}</th>
            <th className="px-1 pb-2 text-right font-medium">Trades</th>
            <th className="px-1 pb-2 text-right font-medium">Net P&L</th>
            <th className="px-1 pb-2 text-right font-medium">Win rate</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.key} className="border-t border-border/70">
              <td className="px-1 py-2.5 font-medium text-pearl">{renderKey ? renderKey(r.key) : r.key}</td>
              <td className="num px-1 py-2.5 text-right text-pearl/85">{r.count}</td>
              <td className="px-1 py-2.5 text-right"><PnlValue value={r.net} icon={false} /></td>
              <td className="px-1 py-2.5 text-right">
                <div className="flex items-center justify-end gap-2">
                  <div className="hidden h-1.5 w-12 overflow-hidden rounded-full bg-white/10 sm:block">
                    <div className="h-full rounded-full bg-sand" style={{ width: `${r.winRate}%` }} />
                  </div>
                  <span className="num text-pearl/85">{fmtPct(r.winRate, { decimals: 0 })}</span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}