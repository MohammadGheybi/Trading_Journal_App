import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine } from 'recharts';
import { C, axisProps } from '@/lib/journal/chartTheme';
import { fmtAxisUsd, fmtUsd, fmtDate } from '@/lib/journal/format';
import ChartTooltip from '@/components/kit/ChartTooltip';
import PnlValue from '@/components/kit/PnlValue';

export default function EquityCurveChart({ data, baseline, height = 280, animate = true }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="eqFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={C.sand} stopOpacity={0.28} />
            <stop offset="100%" stopColor={C.sand} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke={C.grid} vertical={false} />
        <XAxis dataKey="idx" {...axisProps} tickFormatter={(v) => (v === 0 ? 'Start' : `#${v}`)} minTickGap={24} />
        <YAxis {...axisProps} width={56} tickFormatter={fmtAxisUsd} domain={['auto', 'auto']} />
        {baseline && <ReferenceLine y={baseline} stroke={C.muted} strokeDasharray="4 4" strokeOpacity={0.5} />}
        <Tooltip cursor={{ stroke: C.sand, strokeOpacity: 0.3 }} content={<ChartTooltip render={(p) => (
          <div className="space-y-0.5">
            <div className="text-muted-foreground">{p.label}{p.date ? ` · ${fmtDate(p.date)}` : ''}</div>
            <div className="num text-sm text-pearl">{fmtUsd(p.balance)}</div>
            {p.net !== undefined && <PnlValue value={p.net} />}
          </div>
        )} />} />
        <Area type="stepAfter" dataKey="balance" stroke={C.sand} strokeWidth={2} fill="url(#eqFill)" animationDuration={animate ? 700 : 0} />
      </AreaChart>
    </ResponsiveContainer>
  );
}