import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function DirectionBadge({ direction, className }) {
  const buy = direction === 'Buy';
  const Icon = buy ? TrendingUp : TrendingDown;
  return (
    <span className={cn('inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-pearl/85', className)}>
      <Icon className="h-3.5 w-3.5 text-sand" aria-hidden />
      {direction}
    </span>
  );
}