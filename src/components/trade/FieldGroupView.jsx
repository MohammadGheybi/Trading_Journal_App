import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import FieldValue from './FieldValue';

export default function FieldGroupView({ group, trade }) {
  return (
    <div className="space-y-5">
      {group.flagGroups?.map((fg) => {
        const selected = Array.isArray(trade[fg.selectedKey]) ? trade[fg.selectedKey] : null;
        const active = (item) => (selected ? selected.includes(item.label) : Boolean(trade[item.key]));
        const extras = selected ? selected.filter((label) => !fg.items.some((item) => item.label === label)) : [];
        const count = fg.items.filter(active).length + extras.length;
        return (
          <div key={fg.title}>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{fg.title} · {count} selected</div>
            <div className="flex flex-wrap gap-1.5">
              {fg.items.map((item) => (
                <span key={item.key} className={cn('inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs',
                  active(item) ? (fg.tone === 'loss' ? 'border-loss/40 bg-loss/10 text-pearl' : 'border-sand/40 bg-sand/10 text-pearl') : 'border-border text-muted-foreground/70 line-through decoration-white/20')}>
                  {active(item) && <Check className="h-3 w-3" aria-hidden />}{item.label}
                </span>
              ))}
              {extras.map((label) => (
                <span key={label} className={cn('inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs text-pearl', fg.tone === 'loss' ? 'border-loss/40 bg-loss/10' : 'border-sand/40 bg-sand/10')}><Check className="h-3 w-3" aria-hidden />{label}</span>
              ))}
            </div>
          </div>
        );
      })}
      <dl className="grid gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
        {group.fields.map((f) => (
          <div key={f.key} className={cn(f.wide && 'sm:col-span-2 lg:col-span-3')}>
            <dt className="text-xs font-medium text-muted-foreground">{f.labelKey ? `Motivation: ${trade[f.labelKey] || 'Custom signal'}` : f.label}</dt>
            <dd className="mt-1 text-sm text-pearl"><FieldValue type={f.type} value={trade[f.key]} /></dd>
          </div>
        ))}
      </dl>
    </div>
  );
}