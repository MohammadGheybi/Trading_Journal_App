import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { Check, X, Minus } from 'lucide-react';
import { C } from '@/lib/journal/chartTheme';
import { fmtPct } from '@/lib/journal/format';
import ChartTooltip from '@/components/kit/ChartTooltip';

export default function OutcomeDonut({ wins, losses, breakeven, winRate }) {
  const total = wins + losses + breakeven;
  const data = [
    { name: 'Win', value: wins, color: C.profit, Icon: Check },
    { name: 'Loss', value: losses, color: C.loss, Icon: X },
    { name: 'Breakeven', value: breakeven, color: C.sand, Icon: Minus },
  ];
  return (
    <div className="flex h-full flex-col items-center justify-center gap-5">
      <div className="relative h-48 w-48">
        <ResponsiveContainer>
          <PieChart>
            <Pie data={data} dataKey="value" innerRadius={62} outerRadius={88} paddingAngle={3} stroke="none" animationDuration={700}>
              {data.map((d) => <Cell key={d.name} fill={d.color} />)}
            </Pie>
            <Tooltip content={<ChartTooltip render={(p) => <span className="text-pearl">{p.name}: <span className="num">{p.value}</span> ({fmtPct((p.value / total) * 100, { decimals: 0 })})</span>} />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <div className="num text-2xl text-pearl">{fmtPct(winRate, { decimals: 0 })}</div>
          <div className="text-xs text-muted-foreground">win rate</div>
        </div>
      </div>
      <div className="grid w-full grid-cols-3 gap-2">
        {data.map(({ name, value, color, Icon }) => (
          <div key={name} className="rounded-xl bg-surface-2 px-2 py-2.5 text-center">
            <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground"><Icon className="h-3 w-3" style={{ color }} aria-hidden />{name}</div>
            <div className="num mt-0.5 text-base text-pearl">{value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}