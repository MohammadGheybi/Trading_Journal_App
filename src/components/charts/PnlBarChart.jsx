import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, Cell } from 'recharts';
import { C, axisProps, pnlColor } from '@/lib/journal/chartTheme';
import { fmtAxisUsd, fmtPct } from '@/lib/journal/format';
import ChartTooltip from '@/components/kit/ChartTooltip';
import PnlValue from '@/components/kit/PnlValue';

/** Net P&L per group, bars extend left/right (or up/down) from zero. */
export default function PnlBarChart({ rows, horizontal = true, height, labelWidth = 150 }) {
  const h = height || (horizontal ? Math.max(160, rows.length * 44) : 240);
  const tip = <ChartTooltip render={(p) => (
    <div className="space-y-0.5">
      <div className="font-medium text-pearl">{p.key}</div>
      <PnlValue value={p.net} />
      <div className="num text-muted-foreground">{p.count} trades · {fmtPct(p.winRate, { decimals: 0 })} win rate</div>
    </div>
  )} />;
  return (
    <ResponsiveContainer width="100%" height={h}>
      {horizontal ? (
        <BarChart data={rows} layout="vertical" margin={{ top: 0, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid stroke={C.grid} horizontal={false} />
          <XAxis type="number" {...axisProps} tickFormatter={fmtAxisUsd} />
          <YAxis type="category" dataKey="key" {...axisProps} width={labelWidth} tick={{ ...axisProps.tick, fontFamily: 'Manrope', fill: '#D9D6CF', fontSize: 12 }} />
          <ReferenceLine x={0} stroke={C.muted} strokeOpacity={0.6} />
          <Tooltip cursor={{ fill: 'rgba(255,255,255,0.03)' }} content={tip} />
          <Bar dataKey="net" radius={4} maxBarSize={22} animationDuration={600}>
            {rows.map((r) => <Cell key={r.key} fill={pnlColor(r.net)} />)}
          </Bar>
        </BarChart>
      ) : (
        <BarChart data={rows} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid stroke={C.grid} vertical={false} />
          <XAxis dataKey="key" {...axisProps} tick={{ ...axisProps.tick, fontFamily: 'Manrope', fill: '#D9D6CF', fontSize: 12 }} />
          <YAxis {...axisProps} width={56} tickFormatter={fmtAxisUsd} />
          <ReferenceLine y={0} stroke={C.muted} strokeOpacity={0.6} />
          <Tooltip cursor={{ fill: 'rgba(255,255,255,0.03)' }} content={tip} />
          <Bar dataKey="net" radius={4} maxBarSize={48} animationDuration={600}>
            {rows.map((r) => <Cell key={r.key} fill={pnlColor(r.net)} />)}
          </Bar>
        </BarChart>
      )}
    </ResponsiveContainer>
  );
}