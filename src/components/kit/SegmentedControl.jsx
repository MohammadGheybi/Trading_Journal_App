import React from 'react';
import { cn } from '@/lib/utils';

export default function SegmentedControl({ options, value, onChange, label, className }) {
  return (
    <div role="radiogroup" aria-label={label} className={cn('inline-flex rounded-xl border border-border bg-surface-2 p-1', className)}>
      {options.map((o) => {
        const opt = typeof o === 'string' ? { value: o, label: o } : o;
        const active = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(opt.value)}
            className={cn('flex flex-1 items-center justify-center gap-1.5 rounded-lg px-4 py-1.5 text-sm font-medium transition-all', active ? 'bg-crimson text-pearl shadow' : 'text-muted-foreground hover:text-pearl')}
          >
            {opt.icon && <opt.icon className="h-4 w-4" aria-hidden />}
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}