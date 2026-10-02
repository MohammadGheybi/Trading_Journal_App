import React from 'react';
import { Check, X, Minus, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

const MAP = {
  Win: { cls: 'bg-profit/12 text-profit border-profit/25', Icon: Check },
  Loss: { cls: 'bg-loss/12 text-loss border-loss/25', Icon: X },
  Breakeven: { cls: 'bg-sand/12 text-sand border-sand/25', Icon: Minus },
  Open: { cls: 'bg-white/5 text-muted-foreground border-white/10', Icon: Circle },
};

export default function ResultBadge({ result, className }) {
  const key = result || 'Open';
  const { cls, Icon } = MAP[key] || MAP.Open;
  return (
    <span className={cn('inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold', cls, className)}>
      <Icon className="h-3 w-3" aria-hidden />
      {key}
    </span>
  );
}