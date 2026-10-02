import React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, FileQuestion } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useJournal } from '@/lib/journal/JournalContext';
import { zoneLabel } from '@/lib/journal/marketHours';
import { FIELD_GROUPS } from '@/lib/journal/fieldGroups';
import { fmtDate, fmtUsd, fmtDuration, fmtRR, pnlTone } from '@/lib/journal/format';
import PageSkeleton from '@/components/kit/PageSkeleton';
import EmptyState from '@/components/kit/EmptyState';
import FormSection from '@/components/kit/FormSection';
import PnlValue from '@/components/kit/PnlValue';
import ResultBadge from '@/components/kit/ResultBadge';
import SessionBadge from '@/components/kit/SessionBadge';
import DirectionBadge from '@/components/kit/DirectionBadge';
import TradeActions from '@/components/journal/TradeActions';
import StatusPill from '@/components/kit/StatusPill';
import FieldGroupView from '@/components/trade/FieldGroupView';

export default function TradeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { ready, getTrade, settings } = useJournal();
  const zone = zoneLabel(settings.timezone);
  const t = getTrade(id);
  if (!ready) return <PageSkeleton />;
  if (!t) return <EmptyState icon={FileQuestion} title="Trade not found" description="It may have been deleted or the link is incorrect." action={<Button asChild variant="outline" className="rounded-xl border-border"><Link to="/journal">Back to journal</Link></Button>} />;

  const summary = [
    { label: 'Balance after', value: <span className="num">{fmtUsd(t.accountBalanceAfterTrade)}</span> },
    { label: 'Session', value: <SessionBadge session={t.marketSession} /> },
    { label: 'Realized R/R', value: <span className={`num ${pnlTone(t.realizedRR)}`}>{fmtRR(t.realizedRR)}</span> },
    { label: 'Holding', value: <span className="num">{fmtDuration(t.holdingDuration)}</span> },
    { label: 'Mistakes', value: <span className={`num ${t.behavioralMistakeCount ? 'text-loss' : ''}`}>{t.behavioralMistakeCount}</span> },
  ];

  return (
    <div className="space-y-6">
      <Link to="/journal" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-pearl"><ArrowLeft className="h-4 w-4" /> Journal</Link>
      <div className="flex flex-col gap-5 rounded-2xl border border-border bg-surface p-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-heading text-3xl text-pearl">{t.symbol || 'Untitled'}</h1>
            <DirectionBadge direction={t.direction} />
            <ResultBadge result={t.result} />
            <StatusPill status={t.status} />
          </div>
          <p className="num mt-1.5 text-sm text-muted-foreground">Trade #{t.tradeNumber ?? '—'} · {fmtDate(t.entryDate)} {t.entryTime} {zone} · {t.timeframe || 'No timeframe yet'}</p>
          {t.status === 'incomplete' && <p className="mt-2 text-sm text-sand">Imported from MetaTrader. The broker numbers are filled in — complete the empty journal fields.</p>}
          <PnlValue value={t.netPnlUsd} className="mt-4 text-3xl" />
        </div>
        <TradeActions trade={t} variant="buttons" onDeleted={() => navigate('/journal')} />
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {summary.map((s) => (
          <div key={s.label} className="rounded-2xl border border-border bg-surface p-4">
            <div className="text-xs text-muted-foreground">{s.label}</div>
            <div className="mt-1.5 text-base text-pearl">{s.value}</div>
          </div>
        ))}
      </div>
      {FIELD_GROUPS.map((g) => (
        <FormSection key={g.id} title={g.title}>
          <FieldGroupView group={g} trade={t} />
          {g.id === 'evidence' && t.images?.length > 0 && (
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {t.images.map((src) => <img key={src} src={src} alt="Trade screenshot" className="aspect-video w-full rounded-xl object-cover" />)}
            </div>
          )}
        </FormSection>
      ))}
    </div>
  );
}