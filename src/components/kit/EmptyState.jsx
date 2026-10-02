import React from 'react';
import { Inbox } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function EmptyState({ icon: Icon = Inbox, title, description, action, compact = false }) {
  return (
    <div className={cn('flex flex-col items-center justify-center text-center', compact ? 'py-10' : 'py-20')}>
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-sand/20 bg-sand/[0.06]">
        <Icon className="h-5 w-5 text-sand" aria-hidden />
      </div>
      <h3 className="font-heading text-lg text-pearl">{title}</h3>
      {description && <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}