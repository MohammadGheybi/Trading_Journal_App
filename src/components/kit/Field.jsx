import React from 'react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

export default function Field({ label, htmlFor, required, error, hint, children, className }) {
  return (
    <div className={cn('space-y-1.5', className)}>
      {label && (
        <Label htmlFor={htmlFor} className="text-[13px] font-medium text-pearl/90">
          {label}{required && <span className="ml-0.5 text-loss" aria-hidden>*</span>}
        </Label>
      )}
      {children}
      {error ? <p role="alert" className="text-xs font-medium text-loss">{error}</p> : hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

export const inputCls = 'h-11 rounded-xl border-border bg-surface-2 text-pearl placeholder:text-muted-foreground/70 focus-visible:ring-1 focus-visible:ring-ring';