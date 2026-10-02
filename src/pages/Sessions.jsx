import React, { useEffect, useMemo, useState } from 'react';
import { Clock } from 'lucide-react';
import { useJournal } from '@/lib/journal/JournalContext';
import { groupStats } from '@/lib/journal/stats';
import { marketsInZone, performanceWindows, timezoneOffsetMinutes, zoneLabel, zonedMinute } from '@/lib/journal/marketHours';
import { fmtPct } from '@/lib/journal/format';
import PageHeader from '@/components/kit/PageHeader';
import PageSkeleton from '@/components/kit/PageSkeleton';
import ChartCard from '@/components/kit/ChartCard';
import PnlValue from '@/components/kit/PnlValue';
import SessionTimeline from '@/components/sessions/SessionTimeline';
import SessionStatus from '@/components/sessions/SessionStatus';

export default function Sessions() {
  const { ready, rangeTrades, settings } = useJournal();
  const timeZone = settings.timezone || 'UTC';
  const [minute, setMinute] = useState(() => zonedMinute(timeZone));
  useEffect(() => {
    setMinute(zonedMinute(timeZone));
    const t = setInterval(() => setMinute(zonedMinute(timeZone)), 30000);
    return () => clearInterval(t);
  }, [timeZone]);
  const offset = useMemo(() => timezoneOffsetMinutes(timeZone), [timeZone]);
  const markets = useMemo(() => marketsInZone(offset), [offset]);
  const buckets = useMemo(() => performanceWindows(markets), [markets]);
  const label = useMemo(() => zoneLabel(timeZone), [timeZone]);
  const perf = useMemo(() => groupStats(rangeTrades, (t) => t.marketSession), [rangeTrades]);

  if (!ready) return <PageSkeleton />;
  const local = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZone });

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Sessions" title="The trading day" subtitle={<>{label} <span className="num text-pearl">{local}</span></>} />
      <div className="grid gap-5 xl:grid-cols-12">
        <ChartCard className="xl:col-span-8" title="24-hour market timeline" tooltip={`Approximate major market hours in ${label}. The white line is the current time in that timezone.`}>
          <SessionTimeline minute={minute} markets={markets} zoneLabel={label} />
        </ChartCard>
        <ChartCard className="xl:col-span-4" title="Open now & upcoming" tooltip={`Live status in ${label}, updated every 30 seconds.`}>
          <SessionStatus minute={minute} markets={markets} />
        </ChartCard>
      </div>
      <div>
        <h2 className="mb-1 font-heading text-2xl text-pearl">Your performance by session</h2>
        <p className="mb-4 text-sm text-muted-foreground">Each window is taken from the market timeline above, in {label}.</p>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {buckets.map((b) => {
            const r = perf.find((p) => p.key === b.name);
            return (
              <div key={b.name} className="rounded-2xl border border-border bg-surface p-5">
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-pearl">{b.name}</div>
                  <span className="num inline-flex items-center gap-1 text-xs text-sand"><Clock className="h-3 w-3" />{b.range}</span>
                </div>
                <PnlValue value={r?.net ?? null} className="mt-4 text-2xl" />
                <div className="mt-3 flex gap-4 text-xs text-muted-foreground">
                  <span><span className="num text-pearl">{r?.count ?? 0}</span> trades</span>
                  <span><span className="num text-pearl">{r ? fmtPct(r.winRate, { decimals: 0 }) : '—'}</span> win rate</span>
                </div>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-sand" style={{ width: `${r?.winRate ?? 0}%` }} /></div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}