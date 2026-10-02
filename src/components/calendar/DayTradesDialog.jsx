import React from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { fmtDate, fmtPct } from '@/lib/journal/format';
import { useJournal } from '@/lib/journal/JournalContext';
import { zoneLabel } from '@/lib/journal/marketHours';
import PnlValue from '@/components/kit/PnlValue';
import ResultBadge from '@/components/kit/ResultBadge';
import DirectionBadge from '@/components/kit/DirectionBadge';

export default function DayTradesDialog({ date, day, onClose }) {
  const { settings } = useJournal();
  const zone = zoneLabel(settings.timezone);
  return (
    <Dialog open={Boolean(date)} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg rounded-2xl border-border bg-surface">
        <DialogHeader>
          <DialogTitle className="font-heading text-2xl font-normal">{date && fmtDate(date, { weekday: 'long' })}</DialogTitle>
          <DialogDescription>
            {day ? <>Net <PnlValue value={day.net} icon={false} /> · {day.count} trade{day.count > 1 ? 's' : ''}{day.pct !== null && ` · ${fmtPct(day.pct, { sign: true, decimals: 2 })}`}</> : 'No trades recorded on this day.'}
          </DialogDescription>
        </DialogHeader>
        {day ? (
          <ul className="max-h-[50vh] space-y-2 overflow-y-auto">
            {day.trades.map((t) => (
              <li key={t.id}>
                <Link to={`/journal/${t.id}`} className="flex items-center gap-3 rounded-xl border border-border bg-surface-2 p-3 hover:border-sand/30">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 font-semibold text-pearl">{t.symbol} <DirectionBadge direction={t.direction} /></div>
                    <div className="num text-xs text-muted-foreground">#{t.tradeNumber} · {t.entryTime} {zone} · {t.timeframe}</div>
                  </div>
                  <div className="flex flex-col items-end gap-1"><PnlValue value={t.netPnlUsd} /><ResultBadge result={t.result} /></div>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <Button asChild className="rounded-xl bg-crimson text-pearl hover:bg-crimson-hover"><Link to="/journal/new"><Plus className="h-4 w-4" /> Log a trade</Link></Button>
        )}
      </DialogContent>
    </Dialog>
  );
}