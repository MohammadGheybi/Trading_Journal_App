import React, { useMemo } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { DIRECTIONS, RESULTS, TIMEFRAMES, SESSIONS } from '@/lib/journal/constants';
import { EMPTY_FILTERS } from '@/lib/journal/filters';
import { fmtDate } from '@/lib/journal/format';
import FilterSelect from './FilterSelect';
import TagFilter from './TagFilter';

const LABELS = { symbol: 'Symbols', direction: 'Directions', result: 'Results', timeframe: 'Timeframes', session: 'Sessions' };

export default function FilterBar({ filters, onChange, trades, fields = ['search', 'date', 'symbol', 'direction', 'result', 'timeframe', 'session', 'tags'] }) {
  const symbols = useMemo(() => [...new Set(trades.map((t) => t.symbol).filter(Boolean))].sort(), [trades]);
  const tags = useMemo(() => [...new Set(trades.flatMap((t) => t.tags || []))].sort(), [trades]);
  const options = { symbol: symbols, direction: DIRECTIONS, result: [...RESULTS, 'Open'], timeframe: TIMEFRAMES, session: SESSIONS };
  const set = (k, v) => onChange({ ...filters, [k]: v });
  const has = (k) => fields.includes(k);

  const chips = [
    filters.from && { k: 'from', label: `From ${fmtDate(filters.from)}` },
    filters.to && { k: 'to', label: `To ${fmtDate(filters.to)}` },
    ...Object.keys(LABELS).filter((k) => filters[k]).map((k) => ({ k, label: filters[k] })),
    ...(filters.tags || []).map((t) => ({ k: 'tag', tag: t, label: `#${t}` })),
  ].filter(Boolean);

  const remove = (c) => (c.k === 'tag' ? set('tags', filters.tags.filter((t) => t !== c.tag)) : set(c.k, ''));

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        {has('search') && (
          <div className="relative lg:w-72">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
            <Input value={filters.search} onChange={(e) => set('search', e.target.value)} placeholder="Search symbol, notes, tags…" aria-label="Search trades" className="h-10 rounded-xl border-border bg-surface pl-10" />
          </div>
        )}
        <div className="scrollbar-none -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
          {has('date') && (
            <div className="flex shrink-0 items-center gap-1 rounded-xl border border-border bg-surface px-2">
              <Input type="date" aria-label="From date" value={filters.from} onChange={(e) => set('from', e.target.value)} className="h-9 w-[132px] border-0 bg-transparent px-1 text-xs" />
              <span className="text-muted-foreground">–</span>
              <Input type="date" aria-label="To date" value={filters.to} onChange={(e) => set('to', e.target.value)} className="h-9 w-[132px] border-0 bg-transparent px-1 text-xs" />
            </div>
          )}
          {Object.keys(LABELS).filter(has).map((k) => (
            <FilterSelect key={k} label={LABELS[k]} value={filters[k]} options={options[k]} onChange={(v) => set(k, v)} />
          ))}
          {has('tags') && <TagFilter tags={tags} value={filters.tags || []} onChange={(v) => set('tags', v)} />}
        </div>
      </div>
      {chips.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {chips.map((c) => (
            <button key={c.k + c.label} type="button" onClick={() => remove(c)} className="inline-flex items-center gap-1.5 rounded-full border border-sand/30 bg-sand/[0.08] px-3 py-1 text-xs font-medium text-pearl hover:border-sand/60">
              {c.label} <X className="h-3 w-3 text-sand" aria-label="Remove filter" />
            </button>
          ))}
          <button type="button" onClick={() => onChange({ ...EMPTY_FILTERS, search: filters.search })} className="px-2 text-xs font-medium text-sand hover:text-pearl">Clear all</button>
        </div>
      )}
    </div>
  );
}