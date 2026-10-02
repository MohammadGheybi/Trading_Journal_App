import React from 'react';
import { Tag, Check } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function TagFilter({ tags, value, onChange }) {
  const toggle = (t) => onChange(value.includes(t) ? value.filter((x) => x !== t) : [...value, t]);
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className={cn('h-10 shrink-0 gap-2 rounded-xl border-border bg-surface text-sm font-normal', value.length ? 'border-sand/50 text-pearl' : 'text-muted-foreground')}>
          <Tag className="h-4 w-4" aria-hidden /> Tags{value.length ? ` · ${value.length}` : ''}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-56 rounded-2xl border-border bg-surface-2 p-2">
        {tags.length === 0 && <p className="p-2 text-sm text-muted-foreground">No tags yet.</p>}
        {tags.map((t) => (
          <button key={t} type="button" onClick={() => toggle(t)} className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm text-pearl hover:bg-white/5">
            {t}
            {value.includes(t) && <Check className="h-4 w-4 text-sand" />}
          </button>
        ))}
      </PopoverContent>
    </Popover>
  );
}