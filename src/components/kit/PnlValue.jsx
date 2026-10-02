import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { fmtUsd, pnlTone } from '@/lib/journal/format';
import { isNum } from '@/lib/journal/calculations';

export default function PnlValue({ value, className, icon = true, decimals = 2 }) {
  if (!isNum(value)) return <span className={cn('num text-muted-foreground', className)}>—</span>;
  const v = Number(value);
  const Icon = v > 0 ? ArrowUpRight : v < 0 ? ArrowDownRight : Minus;
  return (
    <span className={cn('num inline-flex items-center gap-1 font-medium', pnlTone(v), className)}>
      {icon && <Icon className="h-[1em] w-[1em] shrink-0" aria-hidden />}
      {fmtUsd(v, { sign: true, decimals })}
    </span>
  );
}