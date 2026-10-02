import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import ChartTooltip from '@/components/kit/ChartTooltip';
import PnlValue from '@/components/kit/PnlValue';

// Muted, separated hues. Neighbors are not the same brown, and none is a bright profit/loss color.
const SHADES = ['#C4A484', '#7E8FA3', '#C4847A', '#7F9A86', '#B089B0', '#C6B07A', '#8A7568', '#6E9AA0', '#A6846A', '#8E8A78'];

export default function SymbolDistribution({ rows }) {
  const total = rows.reduce((a, r) => a + r.count, 0);
  return (
    <div className="flex flex-col items-center gap-5 sm:flex-row">
      <div className="h-44 w-44 shrink-0">
        <ResponsiveContainer>
          <PieChart>
            <Pie data={rows} dataKey="count" nameKey="key" innerRadius={48} outerRadius={80} paddingAngle={2} stroke="none" animationDuration={700}>
              {rows.map((r, i) => <Cell key={r.key} fill={SHADES[i % SHADES.length]} />)}
            </Pie>
            <Tooltip content={<ChartTooltip render={(p) => <span className="text-pearl">{p.key}: <span className="num">{p.count}</span> trades</span>} />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <ul className="w-full space-y-2">
        {rows.map((r, i) => (
          <li key={r.key} className="flex items-center gap-3 text-sm">
            <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: SHADES[i % SHADES.length] }} />
            <span className="font-medium text-pearl">{r.key}</span>
            <span className="num text-xs text-muted-foreground">{Math.round((r.count / total) * 100)}%</span>
            <span className="ml-auto"><PnlValue value={r.net} icon={false} /></span>
          </li>
        ))}
      </ul>
    </div>
  );
}