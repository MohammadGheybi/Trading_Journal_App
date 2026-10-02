import React from 'react';
import { cn } from '@/lib/utils';
import InfoTip from './InfoTip';

export default function StatCard({ label, value, sub, tooltip, icon: Icon, hero = false, className }) {
  return (
    <div className={cn('group rounded-2xl border border-border bg-surface p-5 transition-colors hover:border-sand/25', hero && 'p-6', className)}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-[13px] font-medium text-muted-foreground">
          {Icon && <Icon className="h-4 w-4 text-sand" aria-hidden />}
          {label}
        </div>
        <InfoTip>{tooltip}</InfoTip>
      </div>
      <div className={cn('num mt-3 font-medium tracking-tight text-pearl', hero ? 'text-xl sm:text-3xl' : 'text-lg sm:text-xl')}>{value}</div>
      {sub && <div className="mt-1.5 text-xs text-muted-foreground">{sub}</div>}
    </div>
  );
}