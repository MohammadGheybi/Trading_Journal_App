import React from 'react';
import { NavLink } from 'react-router-dom';
import { MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MOBILE_PRIMARY } from '@/lib/nav';

export default function BottomNav({ onMore }) {
  const item = 'flex flex-1 flex-col items-center gap-1 py-2 text-[11px] font-medium transition-colors';
  return (
    <nav aria-label="Primary" className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-obsidian/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl md:hidden">
      <div className="flex px-2">
        {MOBILE_PRIMARY.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} className={({ isActive }) => cn(item, isActive ? 'text-pearl' : 'text-muted-foreground')}>
            {({ isActive }) => (
              <>
                <span className={cn('flex h-8 w-12 items-center justify-center rounded-full transition-all', isActive && 'bg-crimson')}>
                  <Icon className="h-[18px] w-[18px]" aria-hidden />
                </span>
                {label}
              </>
            )}
          </NavLink>
        ))}
        <button type="button" onClick={onMore} className={cn(item, 'text-muted-foreground')}>
          <span className="flex h-8 w-12 items-center justify-center"><MoreHorizontal className="h-[18px] w-[18px]" aria-hidden /></span>
          More
        </button>
      </div>
    </nav>
  );
}