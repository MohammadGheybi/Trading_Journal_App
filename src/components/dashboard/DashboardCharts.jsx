import React from 'react';
import ChartCard from '@/components/kit/ChartCard';
import BreakdownTable from '@/components/kit/BreakdownTable';
import SessionBadge from '@/components/kit/SessionBadge';
import EquityCurveChart from '@/components/charts/EquityCurveChart';
import DailyPnlChart from '@/components/charts/DailyPnlChart';
import OutcomeDonut from '@/components/charts/OutcomeDonut';
import PnlBarChart from '@/components/charts/PnlBarChart';
import SymbolDistribution from '@/components/charts/SymbolDistribution';

export default function DashboardCharts({ data, initialBalance }) {
  const { stats, equity, daily, direction, session, symbol } = data;
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-5">
      <ChartCard className="lg:col-span-8" title="Equity curve" subtitle="Account balance after each closed trade" tooltip="Step line of Balance after trade. The dashed line marks your initial balance.">
        <EquityCurveChart data={equity} baseline={initialBalance} />
      </ChartCard>
      <ChartCard className="lg:col-span-4" title="Outcomes" tooltip="Distribution of workbook Result values for trades with P&L.">
        <OutcomeDonut wins={stats.wins} losses={stats.losses} breakeven={stats.breakeven} winRate={stats.winRate} />
      </ChartCard>
      <ChartCard className="lg:col-span-8" title="Daily net P&L" subtitle="Grouped by entry date" tooltip="Bars above zero are profitable days, below zero are losing days." empty={!daily.length}>
        <DailyPnlChart data={daily} />
      </ChartCard>
      <ChartCard className="lg:col-span-4" title="Net P&L by direction" tooltip="Sum of Net P&L for Buy vs Sell trades.">
        <PnlBarChart rows={direction} horizontal={false} height={200} />
        <div className="mt-4"><BreakdownTable rows={direction} keyLabel="Direction" /></div>
      </ChartCard>
      <ChartCard className="lg:col-span-7" title="Net P&L by market session" tooltip="Sessions use the same market hours as the Sessions page, based on the entry time in your display timezone.">
        <PnlBarChart rows={session} labelWidth={170} />
      </ChartCard>
      <ChartCard className="lg:col-span-5" title="Session breakdown" tooltip="Count, net P&L and win rate per workbook session bucket.">
        <BreakdownTable rows={session} keyLabel="Session" renderKey={(k) => <SessionBadge session={k} />} />
      </ChartCard>
      <ChartCard className="lg:col-span-6" title="Symbol distribution" tooltip="Share of closed trades per symbol, with net P&L on the right.">
        <SymbolDistribution rows={symbol} />
      </ChartCard>
      <ChartCard className="lg:col-span-6" title="Symbol performance" tooltip="Dynamic list of every symbol you have traded in this range.">
        <BreakdownTable rows={symbol} keyLabel="Symbol" />
      </ChartCard>
    </div>
  );
}