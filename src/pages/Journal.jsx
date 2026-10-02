import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Rows3, LayoutGrid, SearchX, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useJournal } from '@/lib/journal/JournalContext';
import { filterTrades, EMPTY_FILTERS } from '@/lib/journal/filters';
import PageHeader from '@/components/kit/PageHeader';
import PageSkeleton from '@/components/kit/PageSkeleton';
import EmptyState from '@/components/kit/EmptyState';
import FilterBar from '@/components/kit/FilterBar';
import SegmentedControl from '@/components/kit/SegmentedControl';
import TradeTable from '@/components/journal/TradeTable';
import TradeCards from '@/components/journal/TradeCards';
import Pagination from '@/components/journal/Pagination';

const sortVal = (t, k) => (k === 'entryDate' ? `${t.entryDate}T${t.entryTime}` : t[k]);

export default function Journal() {
  const { ready, rangeTrades } = useJournal();
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [view, setView] = useState('table');
  const [sort, setSort] = useState({ key: 'tradeNumber', dir: 'desc' });
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);

  useEffect(() => setPage(1), [filters, size]);

  const rows = useMemo(() => {
    const list = filterTrades(rangeTrades, filters);
    return list.sort((a, b) => {
      const x = sortVal(a, sort.key), y = sortVal(b, sort.key);
      if (x === y) return 0;
      if (x === null || x === undefined || x === '') return 1;
      if (y === null || y === undefined || y === '') return -1;
      return (x > y ? 1 : -1) * (sort.dir === 'asc' ? 1 : -1);
    });
  }, [rangeTrades, filters, sort]);

  if (!ready) return <PageSkeleton />;
  const incomplete = rangeTrades.filter((trade) => trade.status === 'incomplete').length;
  const pages = Math.max(1, Math.ceil(rows.length / size));
  const paged = rows.slice((page - 1) * size, page * size);
  const onSort = (key) => setSort((s) => ({ key, dir: s.key === key && s.dir === 'desc' ? 'asc' : 'desc' }));
  const addBtn = <Button asChild className="rounded-xl bg-crimson text-pearl hover:bg-crimson-hover"><Link to="/journal/new"><Plus className="h-4 w-4" /> Add trade</Link></Button>;

  return (
    <div>
      <PageHeader eyebrow="Journal" title="Every trade, reviewed" subtitle={`${rangeTrades.length} trades in range · ${rows.length} shown`}
        actions={<>
          <SegmentedControl label="View" value={view} onChange={setView} className="hidden md:inline-flex"
            options={[{ value: 'table', label: 'Table', icon: Rows3 }, { value: 'cards', label: 'Cards', icon: LayoutGrid }]} />
          {addBtn}
        </>} />
      {rangeTrades.length === 0 ? (
        <div className="rounded-2xl border border-border bg-surface"><EmptyState icon={BookOpen} title="Your journal is empty" description="Record your first trade to start tracking performance, psychology and execution." action={addBtn} /></div>
      ) : (
        <div className="space-y-5">
          {incomplete > 0 && <p className="rounded-2xl border border-sand/30 bg-sand/10 px-4 py-3 text-sm text-pearl">{incomplete} imported trade{incomplete === 1 ? '' : 's'} still need the rest of the journal. Open one and complete it.</p>}
          <FilterBar filters={filters} onChange={setFilters} trades={rangeTrades} />
          {rows.length === 0 ? (
            <div className="rounded-2xl border border-border bg-surface">
              <EmptyState icon={SearchX} title="No trades match these filters" description="Try removing a filter or widening the date range."
                action={<Button variant="outline" onClick={() => setFilters(EMPTY_FILTERS)} className="rounded-xl border-border">Clear filters</Button>} />
            </div>
          ) : (
            <>
              <div className={view === 'table' ? 'hidden md:block' : 'hidden'}><TradeTable trades={paged} sort={sort} onSort={onSort} /></div>
              <div className={view === 'table' ? 'md:hidden' : ''}><TradeCards trades={paged} /></div>
              <Pagination page={page} pages={pages} total={rows.length} size={size} onPage={setPage} onSize={setSize} />
            </>
          )}
        </div>
      )}
    </div>
  );
}