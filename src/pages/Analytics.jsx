import React, { useMemo, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useJournal } from '@/lib/journal/JournalContext';
import { filterTrades, EMPTY_FILTERS } from '@/lib/journal/filters';
import { computeStats, groupStats, equitySeries } from '@/lib/journal/stats';
import { SESSIONS, TIMEFRAMES } from '@/lib/journal/constants';
import PageHeader from '@/components/kit/PageHeader';
import PageSkeleton from '@/components/kit/PageSkeleton';
import FilterBar from '@/components/kit/FilterBar';
import SessionBadge from '@/components/kit/SessionBadge';
import OverviewTab from '@/components/analytics/OverviewTab';
import BreakdownView from '@/components/analytics/BreakdownView';
import PsychologyTab from '@/components/analytics/PsychologyTab';
import MistakesTab from '@/components/analytics/MistakesTab';

const TABS = ['Overview', 'Symbols', 'Sessions', 'Timeframes', 'Psychology', 'Mistakes'];

export default function Analytics() {
  const { ready, rangeTrades, settings, currentBalance } = useJournal();
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const trades = useMemo(() => filterTrades(rangeTrades, filters), [rangeTrades, filters]);
  const stats = useMemo(() => computeStats(trades, { initialBalance: settings.initialBalance, currentBalance }), [trades, settings.initialBalance, currentBalance]);

  if (!ready) return <PageSkeleton />;
  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Analytics" title="Find your edge" subtitle={`${stats.totalTrades} closed trades match the current filters`} />
      <FilterBar filters={filters} onChange={setFilters} trades={rangeTrades} fields={['date', 'symbol', 'direction', 'timeframe', 'session']} />
      <Tabs defaultValue="Overview">
        <TabsList className="scrollbar-none flex h-auto w-full justify-start gap-1 overflow-x-auto rounded-2xl border border-border bg-surface p-1">
          {TABS.map((t) => (
            <TabsTrigger key={t} value={t} className="shrink-0 rounded-xl px-4 py-2 text-sm data-[state=active]:bg-crimson data-[state=active]:text-pearl">{t}</TabsTrigger>
          ))}
        </TabsList>
        <div className="mt-5">
          <TabsContent value="Overview"><OverviewTab stats={stats} equity={equitySeries(trades, settings.initialBalance)} /></TabsContent>
          <TabsContent value="Symbols"><BreakdownView title="Performance by symbol" tooltip="Every symbol in the filtered set." rows={groupStats(trades, (t) => t.symbol)} keyLabel="Symbol" labelWidth={80} /></TabsContent>
          <TabsContent value="Sessions"><BreakdownView title="Performance by market session" tooltip="Same market-hour windows as the Sessions page, from the entry time in your display timezone." rows={groupStats(trades, (t) => t.marketSession, SESSIONS)} keyLabel="Session" labelWidth={170} renderKey={(k) => <SessionBadge session={k} />} /></TabsContent>
          <TabsContent value="Timeframes"><BreakdownView title="Performance by timeframe" tooltip="Chart timeframe used for the entry." rows={groupStats(trades, (t) => t.timeframe, TIMEFRAMES)} keyLabel="Timeframe" labelWidth={70} /></TabsContent>
          <TabsContent value="Psychology"><PsychologyTab trades={trades} /></TabsContent>
          <TabsContent value="Mistakes"><MistakesTab trades={trades} /></TabsContent>
        </div>
      </Tabs>
    </div>
  );
}