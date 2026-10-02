import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Plus, SlidersHorizontal, FileDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useJournal } from '@/lib/journal/JournalContext';
import { computeStats, groupStats, dailyMap, equitySeries } from '@/lib/journal/stats';
import { DIRECTIONS, SESSIONS } from '@/lib/journal/constants';
import { RANGE_PRESETS } from '@/lib/journal/filters';
import { fmtUsd } from '@/lib/journal/format';
import PageHeader from '@/components/kit/PageHeader';
import PageSkeleton from '@/components/kit/PageSkeleton';
import EmptyState from '@/components/kit/EmptyState';
import KpiGrid from '@/components/dashboard/KpiGrid';
import DashboardCharts from '@/components/dashboard/DashboardCharts';

export default function Dashboard() {
  const { ready, rangeTrades, settings, currentBalance, range } = useJournal();
  const data = useMemo(() => ({
    stats: computeStats(rangeTrades, { initialBalance: settings.initialBalance, currentBalance }),
    equity: equitySeries(rangeTrades, settings.initialBalance),
    daily: [...dailyMap(rangeTrades).values()].sort((a, b) => a.date.localeCompare(b.date)),
    direction: groupStats(rangeTrades, (t) => t.direction, DIRECTIONS),
    session: groupStats(rangeTrades, (t) => t.marketSession, SESSIONS),
    symbol: groupStats(rangeTrades, (t) => t.symbol),
  }), [rangeTrades, settings.initialBalance, currentBalance]);

  if (!ready) return <PageSkeleton />;
  const rangeLabel = range.preset === 'custom' ? `${range.from} → ${range.to}` : RANGE_PRESETS.find((p) => p.id === range.preset)?.label;

  return (
    <div>
      <PageHeader
        eyebrow="Overview"
        title="Performance at a glance"
        subtitle={<>Starting balance <span className="num text-pearl">{fmtUsd(settings.initialBalance, { decimals: 0 })}</span> · {settings.accountName} · {rangeLabel}</>}
        actions={(
          <div className="flex gap-2">
            <Button asChild variant="outline" className="rounded-xl border-border bg-surface"><Link to="/report"><FileDown className="h-4 w-4" /> Download report</Link></Button>
            <Button asChild variant="outline" className="rounded-xl border-border bg-surface"><Link to="/settings"><SlidersHorizontal className="h-4 w-4" /> Account settings</Link></Button>
          </div>
        )}
      />
      {data.stats.totalTrades === 0 ? (
        <div className="rounded-2xl border border-border bg-surface">
          <EmptyState title="No closed trades in this range" description="Widen the date range from the top bar, or log your first trade to start building your performance picture."
            action={<Button asChild className="rounded-xl bg-crimson text-pearl hover:bg-crimson-hover"><Link to="/journal/new"><Plus className="h-4 w-4" /> Add trade</Link></Button>} />
        </div>
      ) : (
        <div className="space-y-6">
          <KpiGrid s={data.stats} />
          <DashboardCharts data={data} initialBalance={settings.initialBalance} />
        </div>
      )}
    </div>
  );
}