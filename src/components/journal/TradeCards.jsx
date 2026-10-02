import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Timer } from 'lucide-react';
import { fmtDate, fmtDuration, fmtRR, pnlTone } from '@/lib/journal/format';
import PnlValue from '@/components/kit/PnlValue';
import ResultBadge from '@/components/kit/ResultBadge';
import SessionBadge from '@/components/kit/SessionBadge';
import DirectionBadge from '@/components/kit/DirectionBadge';
import TradeActions from './TradeActions';
import StatusPill from '@/components/kit/StatusPill';

export default function TradeCards({ trades }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {trades.map((t) => (
        <Link key={t.id} to={`/journal/${t.id}`} className="group block rounded-2xl border border-border bg-surface p-5 transition-all hover:-translate-y-0.5 hover:border-sand/30">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold text-pearl">{t.symbol || 'Untitled'}</span>
                <DirectionBadge direction={t.direction} />
              </div>
              <div className="num mt-0.5 text-xs text-muted-foreground">#{t.tradeNumber ?? '—'} · {fmtDate(t.entryDate)} · {t.entryTime || '—'} · {t.timeframe}</div>
            </div>
            <TradeActions trade={t} />
          </div>
          <div className="mt-4 flex items-end justify-between">
            <PnlValue value={t.netPnlUsd} className="text-2xl" />
            <ResultBadge result={t.result} />
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-border/70 pt-3 text-xs">
            <SessionBadge session={t.marketSession} />
            <span className={`num ${pnlTone(t.realizedRR)}`}>{fmtRR(t.realizedRR)}</span>
            <span className="num inline-flex items-center gap-1 text-muted-foreground"><Timer className="h-3.5 w-3.5" aria-hidden />{fmtDuration(t.holdingDuration)}</span>
            {t.behavioralMistakeCount > 0 && <span className="inline-flex items-center gap-1 text-loss"><AlertTriangle className="h-3.5 w-3.5" aria-hidden />{t.behavioralMistakeCount} mistake{t.behavioralMistakeCount > 1 ? 's' : ''}</span>}
            <StatusPill status={t.status} />
          </div>
        </Link>
      ))}
    </div>
  );
}