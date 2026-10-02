import React from 'react';
import { NavLink } from 'react-router-dom';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NAV } from '@/lib/nav';
import { useJournal } from '@/lib/journal/JournalContext';
import { fmtUsd } from '@/lib/journal/format';
import BrandMark from './BrandMark';

export default function Sidebar({ collapsed = false, onToggle }) {
  const { currentBalance, settings } = useJournal();
  return (
    <div className="flex h-full flex-col bg-obsidian">
      <div className={cn('flex h-16 items-center', collapsed ? 'justify-center' : 'px-5')}>
        <BrandMark compact={collapsed} />
      </div>
      <nav aria-label="Main" className="mt-4 flex-1 space-y-1 px-3">
        {NAV.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} title={collapsed ? label : undefined}
            className={({ isActive }) => cn(
              'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all',
              collapsed && 'justify-center px-0',
              isActive ? 'bg-crimson text-pearl shadow-[0_8px_24px_-12px_rgba(113,0,20,1)]' : 'text-pearl/70 hover:bg-white/[0.04] hover:text-pearl',
            )}>
            <Icon className="h-[18px] w-[18px] shrink-0" aria-hidden />
            {!collapsed && label}
          </NavLink>
        ))}
      </nav>
      {!collapsed && (
        <div className="mx-3 mb-3 rounded-2xl border border-border bg-surface p-4">
          <div className="text-xs text-muted-foreground">{settings.accountName}</div>
          <div className="num mt-1 text-lg text-pearl">{fmtUsd(currentBalance)}</div>
          <div className="mt-2 inline-flex items-center gap-1.5 text-[11px] text-sand">
            <span className="h-1.5 w-1.5 rounded-full bg-sand" /> Saved on this computer
          </div>
        </div>
      )}
      {onToggle && (
        <button type="button" onClick={onToggle} aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className={cn('mx-3 mb-4 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted-foreground hover:bg-white/[0.04] hover:text-pearl', collapsed && 'justify-center px-0')}>
          {collapsed ? <PanelLeftOpen className="h-[18px] w-[18px]" /> : <><PanelLeftClose className="h-[18px] w-[18px]" /> Collapse</>}
        </button>
      )}
    </div>
  );
}