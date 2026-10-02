import React from 'react';
import { Wallet } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { useJournal } from '@/lib/journal/JournalContext';

export default function AccountSelect({ className }) {
  const { settings } = useJournal();
  return (
    <Select value="manual">
      <SelectTrigger aria-label="Account" className={cn('h-10 w-auto gap-2 rounded-xl border-border bg-surface text-sm text-pearl', className)}>
        <Wallet className="h-4 w-4 text-sand" aria-hidden />
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="rounded-xl border-border bg-surface-2">
        <SelectItem value="manual">{settings.accountName}</SelectItem>
        <SelectItem value="api" disabled>Connected accounts — coming later</SelectItem>
      </SelectContent>
    </Select>
  );
}