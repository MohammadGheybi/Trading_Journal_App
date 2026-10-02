import React, { useState } from 'react';
import { CalendarRange, Check } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { RANGE_PRESETS } from '@/lib/journal/filters';
import { fmtDate } from '@/lib/journal/format';

export default function DateRangePicker({ value, onChange, className }) {
  const [open, setOpen] = useState(false);
  const [custom, setCustom] = useState({ from: value.from, to: value.to });
  const label = value.preset === 'custom'
    ? `${fmtDate(value.from, { year: undefined })} – ${fmtDate(value.to, { year: undefined })}`
    : RANGE_PRESETS.find((p) => p.id === value.preset)?.label;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className={cn('h-10 gap-2 rounded-xl border-border bg-surface px-3 text-sm font-medium text-pearl hover:bg-surface-2', className)}>
          <CalendarRange className="h-4 w-4 text-sand" aria-hidden />
          <span className="truncate">{label}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-72 rounded-2xl border-border bg-surface-2 p-2">
        {RANGE_PRESETS.filter((p) => p.id !== 'custom').map((p) => (
          <button key={p.id} type="button" onClick={() => { onChange(p.id); setOpen(false); }}
            className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm text-pearl hover:bg-white/5">
            {p.label}
            {value.preset === p.id && <Check className="h-4 w-4 text-sand" />}
          </button>
        ))}
        <div className="mt-2 border-t border-border p-2 pt-3">
          <div className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">Custom range</div>
          <div className="grid grid-cols-2 gap-2">
            <Input type="date" aria-label="From date" value={custom.from} onChange={(e) => setCustom({ ...custom, from: e.target.value })} className="h-9 rounded-lg border-border bg-surface text-xs" />
            <Input type="date" aria-label="To date" value={custom.to} onChange={(e) => setCustom({ ...custom, to: e.target.value })} className="h-9 rounded-lg border-border bg-surface text-xs" />
          </div>
          <Button size="sm" disabled={!custom.from || !custom.to || custom.from > custom.to}
            onClick={() => { onChange('custom', custom); setOpen(false); }}
            className="mt-2 w-full rounded-lg bg-crimson text-pearl hover:bg-crimson-hover">Apply range</Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}