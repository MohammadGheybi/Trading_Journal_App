import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, Cell } from 'recharts';
import { C, axisProps, pnlColor } from '@/lib/journal/chartTheme';
import { fmtAxisUsd, fmtDate, fmtPct } from '@/lib/journal/format';
import ChartTooltip from '@/components/kit/ChartTooltip';
import PnlValue from '@/components/kit/PnlValue';

export default function DailyPnlChart({ data, height = 260 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid stroke={C.grid} vertical={false} />
        <XAxis dataKey="date" {...axisProps} tickFormatter={(d) => fmtDate(d, { year: undefined })} minTickGap={20} />
        <YAxis {...axisProps} width={56} tickFormatter={fmtAxisUsd} />
        <ReferenceLine y={0} stroke={C.muted} strokeOpacity={0.6} />
        <Tooltip cursor={{ fill: 'rgba(255,255,255,0.03)' }} content={<ChartTooltip render={(p) => (
          <div className="space-y-0.5">
            <div className="text-muted-foreground">{fmtDate(p.date)} · {p.count} trade{p.count === 1 ? '' : 's'}</div>
            <PnlValue value={p.net} className="text-sm" />
            {p.pct !== null && p.pct !== undefined && <div className="num text-muted-foreground">{fmtPct(p.pct, { sign: true, decimals: 2 })} of balance</div>}
          </div>
        )} />} />
        <Bar dataKey="net" radius={[4, 4, 4, 4]} maxBarSize={22} animationDuration={600}>
          {data.map((d) => <Cell key={d.date} fill={pnlColor(d.net)} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}