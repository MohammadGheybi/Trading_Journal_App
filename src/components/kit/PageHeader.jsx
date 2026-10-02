import React from 'react';

export default function PageHeader({ eyebrow, title, subtitle, actions }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow && <div className="mb-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-sand">{eyebrow}</div>}
        <h1 className="font-heading text-3xl font-normal tracking-tight text-pearl sm:text-4xl">{title}</h1>
        {subtitle && <p className="mt-1.5 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}