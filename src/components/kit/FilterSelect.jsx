import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

const ALL = '__all';

export default function FilterSelect({ label, value, options, onChange }) {
  return (
    <Select value={value || ALL} onValueChange={(v) => onChange(v === ALL ? '' : v)}>
      <SelectTrigger aria-label={label} className={cn('h-10 w-auto min-w-[120px] shrink-0 gap-2 rounded-xl border-border bg-surface text-sm', value ? 'border-sand/50 text-pearl' : 'text-muted-foreground')}>
        <SelectValue placeholder={label} />
      </SelectTrigger>
      <SelectContent className="rounded-xl border-border bg-surface-2">
        <SelectItem value={ALL}>All {label.toLowerCase()}</SelectItem>
        {options.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
      </SelectContent>
    </Select>
  );
}