import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

/** Multi-select boolean chips. Each item maps to its own boolean field. */
export default function ChecklistGroup({ items, values, onToggle, tone = 'sand', variant = 'chip' }) {
  const on = tone === 'loss' ? 'border-loss/50 bg-loss/10 text-pearl' : 'border-sand/60 bg-sand/10 text-pearl';
  return (
    <div className={cn(variant === 'card' ? 'grid gap-2 sm:grid-cols-2' : 'flex flex-wrap gap-2')} role="group">
      {items.map((it) => {
        const active = Boolean(values[it.key]);
        return (
          <button
            key={it.key}
            type="button"
            role="checkbox"
            aria-checked={active}
            onClick={() => onToggle(it.key, !active)}
            className={cn(
              'inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 text-sm font-medium transition-all',
              variant === 'card' && 'justify-start py-3 text-left',
              active ? on : 'border-border bg-surface-2 text-muted-foreground hover:border-sand/30 hover:text-pearl',
            )}
          >
            <span className={cn('flex h-4 w-4 shrink-0 items-center justify-center rounded-[5px] border transition-colors', active ? (tone === 'loss' ? 'border-loss bg-loss' : 'border-sand bg-sand') : 'border-white/20')}>
              {active && <Check className="h-3 w-3 text-obsidian" strokeWidth={3} />}
            </span>
            {it.label}
          </button>
        );
      })}
    </div>
  );
}

/** Multi-select chips stored as a list of labels. */
export function LabelChecklist({ options, selected = [], onChange, tone = 'sand', variant = 'chip' }) {
  const on = tone === 'loss' ? 'border-loss/50 bg-loss/10 text-pearl' : 'border-sand/60 bg-sand/10 text-pearl';
  const toggle = (label) => onChange(selected.includes(label) ? selected.filter((item) => item !== label) : [...selected, label]);
  return (
    <div className={cn(variant === 'card' ? 'grid gap-2 sm:grid-cols-2' : 'flex flex-wrap gap-2')} role="group">
      {options.filter(Boolean).map((label) => {
        const active = selected.includes(label);
        return (
          <button key={label} type="button" role="checkbox" aria-checked={active} onClick={() => toggle(label)}
            className={cn('inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 text-sm font-medium transition-all', variant === 'card' && 'justify-start py-3 text-left', active ? on : 'border-border bg-surface-2 text-muted-foreground hover:border-sand/30 hover:text-pearl')}>
            <span className={cn('flex h-4 w-4 shrink-0 items-center justify-center rounded-[5px] border transition-colors', active ? (tone === 'loss' ? 'border-loss bg-loss' : 'border-sand bg-sand') : 'border-white/20')}>
              {active && <Check className="h-3 w-3 text-obsidian" strokeWidth={3} />}
            </span>
            {label}
          </button>
        );
      })}
    </div>
  );
}