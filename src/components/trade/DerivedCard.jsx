import React from 'react';
import { Lock } from 'lucide-react';
import InfoTip from '@/components/kit/InfoTip';

export default function DerivedCard({ label, value, formula, hint }) {
  return (
    <div className="rounded-xl border border-dashed border-sand/25 bg-surface-2 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground"><Lock className="h-3 w-3" aria-hidden />{label}</div>
        <InfoTip>{formula}</InfoTip>
      </div>
      <div className="mt-2 text-lg text-pearl">{value}</div>
      {hint && <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{hint}</p>}
    </div>
  );
}