import React from 'react';
import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function SessionBadge({ session, className }) {
  if (!session) return <span className="text-muted-foreground">—</span>;
  return (
    <span className={cn('inline-flex items-center gap-1 whitespace-nowrap rounded-full border border-sand/25 bg-sand/[0.08] px-2 py-0.5 text-xs font-medium text-sand', className)}>
      <Clock className="h-3 w-3" aria-hidden />
      {session}
    </span>
  );
}