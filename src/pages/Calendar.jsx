import React, { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useJournal } from '@/lib/journal/JournalContext';
import { dailyMap } from '@/lib/journal/stats';
import PageHeader from '@/components/kit/PageHeader';
import PageSkeleton from '@/components/kit/PageSkeleton';
import ChartCard from '@/components/kit/ChartCard';
import PnlValue from '@/components/kit/PnlValue';
import DailyPnlChart from '@/components/charts/DailyPnlChart';
import MonthCalendar from '@/components/calendar/MonthCalendar';
import DayTradesDialog from '@/components/calendar/DayTradesDialog';
import WinRateGauge from '@/components/calendar/WinRateGauge';
import DistributionChart from '@/components/calendar/DistributionChart';
import YearlyPerformance from '@/components/calendar/YearlyPerformance';
import YearHeatmap from '@/components/calendar/YearHeatmap';

const now = new Date();
const mean = (a) => (a.length ? a.reduce((x, y) => x + y, 0) / a.length : null);

export default function Calendar() {
  const { ready, trades, settings, updateSettings } = useJournal();
  const [cur, setCur] = useState({ y: now.getUTCFullYear(), m: now.getUTCMonth() });
  const [openDay, setOpenDay] = useState(null);
  const days = useMemo(() => dailyMap(trades), [trades]);

  const prefix = `${cur.y}-${String(cur.m + 1).padStart(2, '0')}`;
  const monthDays = useMemo(() => [...days.values()].filter((d) => d.date.startsWith(prefix)).sort((a, b) => a.date.localeCompare(b.date)), [days, prefix]);
  const monthTrades = monthDays.flatMap((d) => d.trades);

  if (!ready) return <PageSkeleton />;
  const wins = monthTrades.filter((t) => t.result === 'Win').length;
  const net = monthDays.reduce((a, d) => a + d.net, 0);
  const shift = (n) => setCur(({ y, m }) => { const d = new Date(Date.UTC(y, m + n, 1)); return { y: d.getUTCFullYear(), m: d.getUTCMonth() }; });
  const title = new Date(Date.UTC(cur.y, cur.m, 1)).toLocaleDateString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' });
  const year = Number(settings.calendarYear);

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Calendar" title={title} subtitle={<>Month net <PnlValue value={net} icon={false} /> · {monthTrades.length} trades · {monthDays.length} trading days</>}
        actions={<>
          <Button variant="outline" size="icon" onClick={() => shift(-1)} aria-label="Previous month" className="rounded-xl border-border bg-surface"><ChevronLeft className="h-4 w-4" /></Button>
          <Button variant="outline" onClick={() => setCur({ y: now.getUTCFullYear(), m: now.getUTCMonth() })} className="rounded-xl border-border bg-surface">Today</Button>
          <Button variant="outline" size="icon" onClick={() => shift(1)} aria-label="Next month" className="rounded-xl border-border bg-surface"><ChevronRight className="h-4 w-4" /></Button>
        </>} />
      <div className="grid gap-5 xl:grid-cols-12">
        <div className="rounded-2xl border border-border bg-surface p-3 sm:p-5 xl:col-span-8">
          <MonthCalendar year={cur.y} month={cur.m} days={days} onDay={setOpenDay} />
        </div>
        <div className="grid gap-5 sm:grid-cols-2 xl:col-span-4 xl:grid-cols-1">
          <ChartCard title="Monthly win rate" tooltip="Wins ÷ trades with P&L entered this month.">
            <WinRateGauge winRate={monthTrades.length ? (wins / monthTrades.length) * 100 : null} wins={wins} total={monthTrades.length} />
          </ChartCard>
          <ChartCard title="Average day" tooltip="Mean daily net P&L across winning days and losing days this month.">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-profit/[0.08] p-4"><div className="text-xs text-muted-foreground">Avg winning day</div><PnlValue value={mean(monthDays.filter((d) => d.net > 0).map((d) => d.net))} className="mt-1 text-lg" /></div>
              <div className="rounded-xl bg-loss/[0.08] p-4"><div className="text-xs text-muted-foreground">Avg losing day</div><PnlValue value={mean(monthDays.filter((d) => d.net < 0).map((d) => d.net))} className="mt-1 text-lg" /></div>
            </div>
          </ChartCard>
        </div>
        <ChartCard className="xl:col-span-6" title="Daily P&L" subtitle={title} empty={!monthDays.length} emptyText="No trades this month."><DailyPnlChart data={monthDays} height={220} /></ChartCard>
        <div className="xl:col-span-6"><DistributionChart trades={monthTrades} /></div>
      </div>

      <ChartCard title="Yearly performance" tooltip="Monthly net P&L and trade count for the selected calendar year. Click a month to open it."
        action={<div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" aria-label="Previous year" onClick={() => updateSettings({ calendarYear: year - 1 })} className="h-8 w-8 rounded-lg"><ChevronLeft className="h-4 w-4" /></Button>
          <span className="num w-12 text-center text-sm text-pearl">{year}</span>
          <Button variant="ghost" size="icon" aria-label="Next year" onClick={() => updateSettings({ calendarYear: year + 1 })} className="h-8 w-8 rounded-lg"><ChevronRight className="h-4 w-4" /></Button>
        </div>}>
        <YearlyPerformance year={year} days={days} onMonth={(m) => { setCur({ y: year, m }); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />
      </ChartCard>
      <ChartCard title={`${year} activity`} subtitle="Daily P&L intensity by entry date" tooltip="Each square is a day. Color shows profit or loss; intensity scales with daily % return up to the max daily percentage."
        action={<label className="flex items-center gap-2 text-xs text-muted-foreground">Max daily %<Input type="number" min={1} value={settings.maxDailyPct} onChange={(e) => updateSettings({ maxDailyPct: Math.max(1, Number(e.target.value) || 20) })} className="num h-9 w-20 rounded-lg border-border bg-surface-2" /></label>}>
        <YearHeatmap year={year} days={days} maxPct={Number(settings.maxDailyPct) || 20} />
      </ChartCard>
      <DayTradesDialog date={openDay} day={openDay ? days.get(openDay) : null} onClose={() => setOpenDay(null)} />
    </div>
  );
}