import React from 'react';
import { Info } from 'lucide-react';

export default function DescriptiveNote() {
  return (
    <div className="flex gap-3 rounded-2xl border border-sand/25 bg-sand/[0.06] p-4 text-sm text-pearl/85">
      <Info className="mt-0.5 h-4 w-4 shrink-0 text-sand" aria-hidden />
      <p>These are descriptive summaries of your own journal — they show what happened alongside each state, not what caused it. Small samples can be misleading; a trade can appear in several emotion rows.</p>
    </div>
  );
}