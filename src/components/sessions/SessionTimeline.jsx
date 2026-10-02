import React from 'react';
import { segments, isOpen, hhmm } from '@/lib/journal/marketHours';

export default function SessionTimeline({ minute, markets, zoneLabel }) {
  const pos = (m) => `${(m / 1440) * 100}%`;
  return (
    <div className="overflow-x-auto">
      <div className="relative min-w-[640px] pb-2">
        <div className="relative ml-24 h-6 text-[11px] text-muted-foreground">
          {[0, 3, 6, 9, 12, 15, 18, 21, 24].map((h) => (
            <span key={h} className="num absolute -translate-x-1/2" style={{ left: pos(h * 60) }}>{String(h).padStart(2, '0')}:00</span>
          ))}
        </div>
        <div className="space-y-3">
          {markets.map((mk) => {
            const open = isOpen(mk, minute);
            return (
              <div key={mk.name} className="flex items-center">
                <div className="flex w-24 shrink-0 items-center gap-2 text-sm font-medium text-pearl">
                  <span className={`h-2 w-2 rounded-full ${open ? 'bg-sand' : 'bg-white/15'}`} aria-hidden />{mk.name}
                </div>
                <div className="relative h-9 flex-1 rounded-lg bg-surface-2">
                  {segments(mk).map(([a, b]) => (
                    <div key={a} className="absolute inset-y-1 rounded-md border border-sand/40" style={{ left: pos(a), width: pos(b - a), background: `rgba(179,143,111,${mk.opacity})` }}
                      title={`${mk.name}: ${hhmm(mk.open)}–${hhmm(mk.close)} ${zoneLabel}`} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        <div className="pointer-events-none absolute bottom-0 top-6 ml-24" style={{ left: 0, right: 0 }}>
          <div className="absolute inset-y-0 w-0.5 bg-pearl shadow-[0_0_12px_rgba(242,241,237,0.5)]" style={{ left: pos(minute) }}>
            <span className="num absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-pearl px-1.5 py-0.5 text-[10px] font-semibold text-obsidian">{hhmm(minute)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}