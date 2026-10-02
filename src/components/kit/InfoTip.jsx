import React from 'react';
import { Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export default function InfoTip({ children, label = 'More information' }) {
  if (!children) return null;
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button type="button" aria-label={label} className="inline-flex h-5 w-5 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-pearl">
          <Info className="h-3.5 w-3.5" />
        </button>
      </TooltipTrigger>
      <TooltipContent className="max-w-xs border-border bg-surface-2 text-xs leading-relaxed text-pearl">{children}</TooltipContent>
    </Tooltip>
  );
}