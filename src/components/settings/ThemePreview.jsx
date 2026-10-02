import React from 'react';

const TOKENS = [
  { name: 'Obsidian Black', hex: '#161616', use: 'Background & navigation' },
  { name: 'Soft Pearl', hex: '#F2F1ED', use: 'Primary text' },
  { name: 'Crimson Depth', hex: '#710014', use: 'Brand, primary actions, selection' },
  { name: 'Warm Sand', hex: '#B38F6F', use: 'Accents, dividers, breakeven' },
  { name: 'Surface', hex: '#1E1E1E', use: 'Cards' },
  { name: 'Surface raised', hex: '#252525', use: 'Inputs, popovers' },
  { name: 'Profit', hex: '#6FA583', use: 'Positive P&L, wins' },
  { name: 'Loss', hex: '#E06A6A', use: 'Negative P&L, losses' },
];

export default function ThemePreview() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {TOKENS.map((t) => (
        <div key={t.hex} className="overflow-hidden rounded-xl border border-border">
          <div className="h-14" style={{ background: t.hex }} />
          <div className="bg-surface-2 p-3">
            <div className="text-sm font-medium text-pearl">{t.name}</div>
            <div className="num text-xs text-sand">{t.hex}</div>
            <div className="mt-0.5 text-[11px] text-muted-foreground">{t.use}</div>
          </div>
        </div>
      ))}
    </div>
  );
}