import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, Plus, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { pageTitle } from '@/lib/nav';
import { useJournal } from '@/lib/journal/JournalContext';
import DateRangePicker from '@/components/kit/DateRangePicker';
import AccountSelect from './AccountSelect';

export default function Topbar({ onMenu }) {
  const { pathname } = useLocation();
  const { range, setRange } = useJournal();
  return (
    <header className="sticky top-0 z-20 border-b border-border/70 bg-obsidian/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center gap-3 px-4 sm:px-6 lg:px-10">
        <Button variant="ghost" size="icon" onClick={onMenu} aria-label="Open navigation" className="hidden rounded-xl md:inline-flex lg:hidden">
          <Menu className="h-5 w-5" />
        </Button>
        <h2 className="min-w-0 flex-1 truncate font-heading text-lg text-pearl sm:text-xl">{pageTitle(pathname)}</h2>
        <AccountSelect className="hidden xl:flex" />
        <DateRangePicker value={range} onChange={setRange} className="max-w-[150px] sm:max-w-none" />
        <Button asChild className="h-10 rounded-xl bg-crimson px-3 text-pearl hover:bg-crimson-hover sm:px-4">
          <Link to="/journal/new" aria-label="Add trade"><Plus className="h-4 w-4" /><span className="hidden sm:inline">Add Trade</span></Link>
        </Button>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Theme (light theme coming later)" className="hidden rounded-xl text-muted-foreground sm:inline-flex"><Moon className="h-[18px] w-[18px]" /></Button>
          </TooltipTrigger>
          <TooltipContent className="bg-surface-2 text-pearl">Light theme is coming later</TooltipContent>
        </Tooltip>
        <div aria-label="Profile placeholder" className="hidden h-9 w-9 items-center justify-center rounded-full border border-sand/40 bg-surface-2 text-xs font-semibold text-sand sm:flex">TR</div>
      </div>
    </header>
  );
}