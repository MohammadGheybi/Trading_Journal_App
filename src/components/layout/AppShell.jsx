import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { TooltipProvider } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { useJournal } from '@/lib/journal/JournalContext';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import BottomNav from './BottomNav';

export default function AppShell() {
  const [collapsed, setCollapsed] = useState(() => window.localStorage?.getItem('cl:sidebar') === '1');
  const [drawer, setDrawer] = useState(false);
  const { pathname } = useLocation();
  const { syncError } = useJournal();

  useEffect(() => setDrawer(false), [pathname]);
  useEffect(() => { window.localStorage?.setItem('cl:sidebar', collapsed ? '1' : '0'); }, [collapsed]);

  return (
    <TooltipProvider delayDuration={150}>
      <div className="min-h-screen bg-obsidian">
        <aside className={cn('fixed inset-y-0 left-0 z-30 hidden border-r border-border/70 transition-[width] duration-300 print:hidden lg:block', collapsed ? 'w-[76px]' : 'w-64')}>
          <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
        </aside>
        <Sheet open={drawer} onOpenChange={setDrawer}>
          <SheetContent side="left" className="w-72 border-border bg-obsidian p-0">
            <SheetTitle className="sr-only">Navigation</SheetTitle>
            <Sidebar />
          </SheetContent>
        </Sheet>
        <div className={cn('transition-[padding] duration-300 print:pl-0', collapsed ? 'lg:pl-[76px]' : 'lg:pl-64')}>
          <div className="print:hidden"><Topbar onMenu={() => setDrawer(true)} /></div>
          <main key={pathname} className="mx-auto max-w-[1440px] animate-fade-up px-4 pb-28 pt-6 print:m-0 print:max-w-none print:animate-none print:p-0 sm:px-6 md:pb-14 lg:px-10 lg:pt-8">
            {syncError && <div role="alert" className="mb-4 rounded-xl border border-loss/40 bg-loss/10 px-4 py-3 text-sm text-pearl">{syncError}</div>}
            <Outlet />
          </main>
        </div>
        <div className="print:hidden"><BottomNav onMore={() => setDrawer(true)} /></div>
      </div>
    </TooltipProvider>
  );
}