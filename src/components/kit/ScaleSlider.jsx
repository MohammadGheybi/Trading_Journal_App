import React from 'react';
import { Slider } from '@/components/ui/slider';

export default function ScaleSlider({ label, value, onChange, hint, low = 'Low', high = 'High' }) {
  return (
    <div className="rounded-xl border border-border bg-surface-2 p-4">
      <div className="mb-4 flex items-baseline justify-between">
        <div>
          <div className="text-sm font-medium text-pearl">{label}</div>
          {hint && <div className="text-xs text-muted-foreground">{hint}</div>}
        </div>
        <div className="num text-2xl text-pearl">{value}<span className="text-sm text-muted-foreground">/10</span></div>
      </div>
      <Slider min={1} max={10} step={1} value={[value]} onValueChange={([v]) => onChange(v)} aria-label={label} />
      <div className="mt-2 flex justify-between text-xs text-muted-foreground"><span>1 · {low}</span><span>{high} · 10</span></div>
    </div>
  );
}