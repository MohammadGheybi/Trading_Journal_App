import React from 'react';

const LABEL = { draft: 'Draft', incomplete: 'Incomplete' };

export default function StatusPill({ status }) {
  const label = LABEL[status];
  if (!label) return null;
  return <span className="rounded-md border border-sand/30 px-1.5 text-[10px] font-semibold uppercase text-sand">{label}</span>;
}
