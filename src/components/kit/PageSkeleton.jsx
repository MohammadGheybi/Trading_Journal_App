import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function PageSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading" className="space-y-6">
      <Skeleton className="h-10 w-64 rounded-xl bg-surface-2" />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-28 rounded-2xl bg-surface" />)}
      </div>
      <div className="grid gap-4 lg:grid-cols-12">
        <Skeleton className="h-80 rounded-2xl bg-surface lg:col-span-8" />
        <Skeleton className="h-80 rounded-2xl bg-surface lg:col-span-4" />
      </div>
    </div>
  );
}