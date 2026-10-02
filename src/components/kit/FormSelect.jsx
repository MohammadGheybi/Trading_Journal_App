import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

export default function FormSelect({ id, value, onChange, options, placeholder = 'Select…', invalid }) {
  return (
    <Select value={value || undefined} onValueChange={onChange}>
      <SelectTrigger id={id} aria-invalid={invalid} className={cn('h-11 rounded-xl border-border bg-surface-2 text-pearl', invalid && 'border-loss')}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="rounded-xl border-border bg-surface-2">
        {options.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
      </SelectContent>
    </Select>
  );
}