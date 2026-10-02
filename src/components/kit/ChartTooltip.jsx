import React from 'react';

export default function ChartTooltip({ active, payload, label, render }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-border bg-surface-2/95 px-3 py-2 text-xs shadow-2xl backdrop-blur">
      {render ? render(payload[0].payload, label) : (
        <>
          <div className="mb-1 text-muted-foreground">{label}</div>
          {payload.map((p) => (
            <div key={p.dataKey} className="num text-pearl">{p.name}: {p.value}</div>
          ))}
        </>
      )}
    </div>
  );
}