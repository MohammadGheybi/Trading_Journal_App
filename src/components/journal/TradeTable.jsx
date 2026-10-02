import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpDown, ArrowUp, ArrowDown, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { fmtDate, fmtDuration, fmtRR, pnlTone } from '@/lib/journal/format';
import { useJournal } from '@/lib/journal/JournalContext';
import { zoneLabel } from '@/lib/journal/marketHours';
import PnlValue from '@/components/kit/PnlValue';
import ResultBadge from '@/components/kit/ResultBadge';
import SessionBadge from '@/components/kit/SessionBadge';
import DirectionBadge from '@/components/kit/DirectionBadge';
import TradeActions from './TradeActions';
import StatusPill from '@/components/kit/StatusPill';

const COLS = [
  { key: 'tradeNumber', label: '#' }, { key: 'entryDate', label: 'Date / time' }, { key: 'symbol', label: 'Symbol' },
  { key: null, label: 'Direction' }, { key: null, label: 'TF' }, { key: 'netPnlUsd', label: 'Net P&L', right: true },
  { key: null, label: 'Result' }, { key: 'realizedRR', label: 'R/R', right: true }, { key: null, label: 'Session' },
  { key: 'holdingDuration', label: 'Duration', right: true }, { key: 'behavioralMistakeCount', label: 'Mistakes', right: true }, { key: null, label: '' },
];

export default function TradeTable({ trades, sort, onSort }) {
  const { settings } = useJournal();
  const zone = zoneLabel(settings.timezone);
  const navigate = useNavigate();
  const SortIcon = ({ k }) => (sort.key !== k ? <ArrowUpDown className="h-3 w-3 opacity-40" /> : sort.dir === 'asc' ? <ArrowUp className="h-3 w-3 text-sand" /> : <ArrowDown className="h-3 w-3 text-sand" />);
  return (
    <div className="max-h-[70vh] overflow-auto rounded-2xl border border-border bg-surface">
      <table className="w-full min-w-[1080px] text-sm">
        <thead className="sticky top-0 z-10 bg-surface-2">
          <tr>
            {COLS.map((c, i) => (
              <th key={i} scope="col" className={cn('whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground', c.right && 'text-right')}>
                {c.key ? (
                  <button type="button" onClick={() => onSort(c.key)} className={cn('inline-flex items-center gap-1.5 hover:text-pearl', c.right && 'flex-row-reverse')}>{c.label}<SortIcon k={c.key} /></button>
                ) : c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {trades.map((t) => (
            <tr key={t.id} tabIndex={0} onClick={() => navigate(`/journal/${t.id}`)} onKeyDown={(e) => e.key === 'Enter' && navigate(`/journal/${t.id}`)}
              className="cursor-pointer border-t border-border/60 transition-colors hover:bg-white/[0.025] focus-visible:bg-white/[0.04]">
              <td className="num px-4 py-3 text-muted-foreground">{t.tradeNumber ?? '—'}</td>
              <td className="whitespace-nowrap px-4 py-3"><div className="text-pearl">{fmtDate(t.entryDate)}</div><div className="num text-xs text-muted-foreground">{t.entryTime || '—'} {zone}</div></td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2 font-semibold text-pearl">{t.symbol || '—'}
                  <StatusPill status={t.status} />
                </div>
              </td>
              <td className="px-4 py-3"><DirectionBadge direction={t.direction} /></td>
              <td className="num px-4 py-3 text-pearl/80">{t.timeframe}</td>
              <td className="px-4 py-3 text-right"><PnlValue value={t.netPnlUsd} /></td>
              <td className="px-4 py-3"><ResultBadge result={t.result} /></td>
              <td className={cn('num px-4 py-3 text-right', pnlTone(t.realizedRR))}>{fmtRR(t.realizedRR)}</td>
              <td className="px-4 py-3"><SessionBadge session={t.marketSession} /></td>
              <td className="num whitespace-nowrap px-4 py-3 text-right text-pearl/80">{fmtDuration(t.holdingDuration)}</td>
              <td className="px-4 py-3 text-right">
                {t.behavioralMistakeCount ? <span className="num inline-flex items-center gap-1 text-loss"><AlertTriangle className="h-3.5 w-3.5" aria-hidden />{t.behavioralMistakeCount}</span> : <span className="num text-muted-foreground">0</span>}
              </td>
              <td className="px-2 py-3 text-right"><TradeActions trade={t} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}