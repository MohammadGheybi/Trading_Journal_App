import React from 'react';
import { cn } from '@/lib/utils';

export default function FormSection({ title, description, children, className }) {
  return (
    <section className={cn('rounded-2xl border border-border bg-surface p-5 sm:p-6', className)}>
      {title && (
        <header className="mb-5">
          <h3 className="font-heading text-lg text-pearl">{title}</h3>
          {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
        </header>
      )}
      {children}
    </section>
  );
}