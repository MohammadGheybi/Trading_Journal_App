import React, { useState } from 'react';
import { groupStats } from '@/lib/journal/stats';
import SegmentedControl from '@/components/kit/SegmentedControl';
import ChartCard from '@/components/kit/ChartCard';
import PnlBarChart from '@/components/charts/PnlBarChart';

const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const dayName = (d) => DAYS[(new Date(`${d}T00:00:00Z`).getUTCDay() + 6) % 7];

export default function DistributionChart({ trades }) {
  const [mode, setMode] = useState('hour');
  const rows = mode === 'hour'
    ? groupStats(trades, (t) => (t.entryTime ? t.entryTime.slice(0, 2) : ''), HOURS).map((r) => ({ ...r, key: `${r.key}h` }))
    : groupStats(trades, (t) => (t.entryDate ? dayName(t.entryDate) : ''), DAYS);
  return (
    <ChartCard title="Distribution" subtitle={mode === 'hour' ? 'Net P&L by entry hour, in your display timezone' : 'Net P&L by weekday'} tooltip="Descriptive only — grouped by entry time of trades in this month." empty={!rows.length}
      action={<SegmentedControl label="Distribution mode" value={mode} onChange={setMode} options={[{ value: 'hour', label: 'Hour' }, { value: 'day', label: 'Day' }]} />}>
      <PnlBarChart rows={rows} horizontal={false} height={220} />
    </ChartCard>
  );
}