import React from 'react';
import ChartCard from '@/components/kit/ChartCard';
import BreakdownTable from '@/components/kit/BreakdownTable';
import PnlBarChart from '@/components/charts/PnlBarChart';

export default function BreakdownView({ title, tooltip, rows, keyLabel, labelWidth = 130, renderKey }) {
  return (
    <ChartCard title={title} tooltip={tooltip} empty={!rows.length}>
      <div className="grid gap-6 lg:grid-cols-2">
        <PnlBarChart rows={rows} labelWidth={labelWidth} />
        <BreakdownTable rows={rows} keyLabel={keyLabel} renderKey={renderKey} />
      </div>
    </ChartCard>
  );
}