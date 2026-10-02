import React from 'react';
import StatCard from '@/components/kit/StatCard';
import ChartCard from '@/components/kit/ChartCard';
import PnlValue from '@/components/kit/PnlValue';
import EquityCurveChart from '@/components/charts/EquityCurveChart';
import OutcomeDonut from '@/components/charts/OutcomeDonut';
import { fmtPct, fmtRR, fmtDuration } from '@/lib/journal/format';

export default function OverviewTab({ stats, equity }) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Net P&L" value={<PnlValue value={stats.netProfit} icon={false} />} tooltip="Sum of Net P&L for the filtered trades." />
        <StatCard label="Win rate" value={fmtPct(stats.winRate)} tooltip="Wins ÷ trades with P&L." sub={`${stats.totalTrades} trades`} />
        <StatCard label="Average R/R" value={fmtRR(stats.avgRR)} tooltip="Mean of Net P&L ÷ stop size. A profit is positive." />
        <StatCard label="Avg holding" value={fmtDuration(stats.avgHolding)} tooltip="Mean holding duration for completed trades." />
      </div>
      <div className="grid gap-5 lg:grid-cols-12">
        <ChartCard className="lg:col-span-8" title="Equity (filtered trades)" tooltip="Account balance after each trade in this filtered view." empty={equity.length < 2}>
          <EquityCurveChart data={equity} />
        </ChartCard>
        <ChartCard className="lg:col-span-4" title="Outcomes" empty={!stats.totalTrades}>
          <OutcomeDonut wins={stats.wins} losses={stats.losses} breakeven={stats.breakeven} winRate={stats.winRate} />
        </ChartCard>
      </div>
    </div>
  );
}