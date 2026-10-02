import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function StepTabs({ steps, active, onChange, completion, errorStep }) {
  return (
    <div role="tablist" aria-label="Trade form sections" className="scrollbar-none -mx-4 flex gap-1 overflow-x-auto px-4 sm:mx-0 sm:px-0">
      {steps.map((s, i) => {
        const done = completion[s.id];
        const isActive = i === active;
        return (
          <button key={s.id} type="button" role="tab" aria-selected={isActive} onClick={() => onChange(i)}
            className={cn('relative flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all',
              isActive ? 'bg-surface-2 text-pearl' : 'text-muted-foreground hover:text-pearl')}>
            <span className={cn('num flex h-5 w-5 items-center justify-center rounded-full text-[11px]',
              isActive ? 'bg-crimson text-pearl' : done ? 'bg-sand/20 text-sand' : 'border border-white/15')}>
              {done && !isActive ? <Check className="h-3 w-3" strokeWidth={3} /> : i + 1}
            </span>
            {s.label}
            {errorStep === i && <span className="h-1.5 w-1.5 rounded-full bg-loss" aria-label="Has errors" />}
            {isActive && <span className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-crimson-soft" />}
          </button>
        );
      })}
    </div>
  );
}