import React from 'react';
import { BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';
import InfoTip from './InfoTip';
import EmptyState from './EmptyState';

export default function ChartCard({ title, subtitle, tooltip, action, empty, emptyText, children, className, bodyClass }) {
  return (
    <section className={cn('flex flex-col rounded-2xl border border-border bg-surface p-5', className)}>
      <header className="mb-4 flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5">
            <h3 className="text-[15px] font-semibold text-pearl">{title}</h3>
            <InfoTip>{tooltip}</InfoTip>
          </div>
          {subtitle && <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>}
        </div>
        {action}
      </header>
      <div className={cn('min-h-0 flex-1', bodyClass)}>
        {empty ? <EmptyState compact icon={BarChart3} title="Nothing to chart yet" description={emptyText || 'Log trades in this range to see this view.'} /> : children}
      </div>
    </section>
  );
}