import React from 'react';

export default function BrandMark({ compact = false }) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-crimson shadow-[0_6px_24px_-8px_rgba(113,0,20,0.9)]">
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
          <path d="M4 17 L9 11 L13 14 L20 6" fill="none" stroke="#F2F1ED" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="20" cy="6" r="1.8" fill="#B38F6F" />
        </svg>
      </div>
      {!compact && (
        <div className="leading-tight">
          <div className="font-heading text-[17px] text-pearl">Crimson Ledger</div>
          <div className="text-[11px] uppercase tracking-[0.16em] text-sand">Trading journal</div>
        </div>
      )}
    </div>
  );
}