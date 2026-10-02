import React from 'react';
import { Wallet, Hash, Target, TrendingUp } from 'lucide-react';
import StatCard from '@/components/kit/StatCard';
import PnlValue from '@/components/kit/PnlValue';
import { fmtUsd, fmtPct, fmtDuration, fmtRR, pnlTone } from '@/lib/journal/format';

export default function KpiGrid({ s }) {
  const secondary = [
    { label: 'Best trade', value: <PnlValue value={s.bestTrade} />, tooltip: 'Largest single Net P&L in the selected range.' },
    { label: 'Worst trade', value: <PnlValue value={s.worstTrade} />, tooltip: 'Smallest single Net P&L in the selected range.' },
    { label: 'Gross profit', value: <PnlValue value={s.grossProfit} />, tooltip: 'Sum of all positive Net P&L values.' },
    { label: 'Gross loss', value: <PnlValue value={s.grossLoss} />, tooltip: 'Sum of all negative Net P&L values.' },
    { label: 'Total commissions', value: fmtUsd(s.commissions), tooltip: 'Sum of Commission (USD). Subtracted from balance.' },
    { label: 'Total swaps', value: <span className={pnlTone(s.swaps)}>{fmtUsd(s.swaps, { sign: true })}</span>, tooltip: 'Sum of Swap (USD). Added to balance (can be negative).' },
    { label: 'Total return', value: <span className={pnlTone(s.totalReturnPct)}>{fmtPct(s.totalReturnPct, { sign: true, decimals: 2 })}</span>, tooltip: '(Net P&L − commissions + swaps) ÷ initial balance.' },
    { label: 'Avg holding time', value: fmtDuration(s.avgHolding), tooltip: 'Mean of exit minus entry, for trades with complete exit date and time.' },
    { label: 'Average R/R', value: <span className={pnlTone(s.avgRR)}>{fmtRR(s.avgRR)}</span>, tooltip: 'Mean of Net P&L ÷ stop size. A profit is positive.' },
  ];
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <StatCard hero icon={Wallet} label="Current balance" value={fmtUsd(s.currentBalance)} tooltip="Initial balance + cumulative Net P&L − commissions + swaps, across all trades." sub="Manual account" />
        <StatCard hero icon={TrendingUp} label="Net profit" value={<PnlValue value={s.netProfit} icon={false} />} tooltip="Sum of Net P&L in the selected range." sub={`${fmtPct(s.totalReturnPct, { sign: true, decimals: 2 })} return`} />
        <StatCard hero icon={Target} label="Win rate" value={fmtPct(s.winRate)} tooltip="Wins ÷ total trades. Breakeven counts as a non-win." sub={`${s.wins} W · ${s.losses} L · ${s.breakeven} BE`} />
        <StatCard hero icon={Hash} label="Total trades" value={s.totalTrades} tooltip="Trades with a Net P&L value, including an entered zero — matching the workbook." sub="Closed with P&L" />
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
        {secondary.map((k) => <StatCard key={k.label} {...k} className="p-4" />)}
      </div>
    </div>
  );
}