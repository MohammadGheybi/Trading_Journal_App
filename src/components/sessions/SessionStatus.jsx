import React from 'react';
import { isOpen, until, hhmm, inWords } from '@/lib/journal/marketHours';

export default function SessionStatus({ minute, markets }) {
  const rows = markets.map((mk) => {
    const active = isOpen(mk, minute);
    const next = active ? until(mk.close, minute) : until(mk.open, minute);
    return { ...mk, active, next };
  }).sort((a, b) => Number(b.open) - Number(a.open) || a.next - b.next);
  return (
    <ul className="divide-y divide-border/70">
      {rows.map((r) => (
        <li key={r.name} className="flex items-center justify-between gap-3 py-3">
          <div>
            <div className="font-medium text-pearl">{r.name}</div>
            <div className="num text-xs text-muted-foreground">{hhmm(r.active ? r.close : r.open)}</div>
          </div>
          <div className="text-right">
            <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${r.active ? 'bg-sand text-obsidian' : 'border border-border text-muted-foreground'}`}>{r.active ? 'Open now' : 'Closed'}</span>
            <div className="mt-1 text-xs text-muted-foreground">{r.active ? 'Closes' : 'Opens'} in <span className="num text-pearl">{inWords(r.next)}</span></div>
          </div>
        </li>
      ))}
    </ul>
  );
}