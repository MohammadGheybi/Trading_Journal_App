import React from 'react';
import { Check, X } from 'lucide-react';
import { fmtDate, fmtUsd, fmtDuration, fmtRR, pnlTone } from '@/lib/journal/format';
import PnlValue from '@/components/kit/PnlValue';
import ResultBadge from '@/components/kit/ResultBadge';
import SessionBadge from '@/components/kit/SessionBadge';

export default function FieldValue({ type, value }) {
  const empty = value === null || value === undefined || value === '';
  switch (type) {
    case 'date': return <span>{fmtDate(value)}</span>;
    case 'usd': return <span className="num">{fmtUsd(value)}</span>;
    case 'pnl': return <PnlValue value={value} />;
    case 'result': return <ResultBadge result={value} />;
    case 'session': return <SessionBadge session={value} />;
    case 'duration': return <span className="num">{fmtDuration(value)}</span>;
    case 'rr': return <span className={`num ${pnlTone(value)}`}>{fmtRR(value)}</span>;
    case 'scale': return <span className="num">{value}<span className="text-muted-foreground">/10</span></span>;
    case 'bool': return value
      ? <span className="inline-flex items-center gap-1 text-pearl"><Check className="h-3.5 w-3.5 text-sand" />Yes</span>
      : <span className="inline-flex items-center gap-1 text-muted-foreground"><X className="h-3.5 w-3.5" />No</span>;
    case 'labels': return value?.length
      ? <span className="flex flex-wrap gap-1.5">{value.map((item) => <span key={item} className="rounded-full border border-sand/30 bg-sand/[0.08] px-2.5 py-0.5 text-xs text-pearl">{item}</span>)}</span>
      : <span className="text-muted-foreground">—</span>;
    case 'timeframes': return value?.length
      ? <span>{value.map((row) => `${row.label || 'Timeframe'}: ${row.value}`).join(' · ')}</span>
      : <span className="text-muted-foreground">—</span>;
    case 'closes': return value?.length
      ? <span className="block space-y-1">{value.map((close, index) => <span key={index} className="num block">{close.date} {close.time} · {close.volume} lots @ {close.price} · {fmtUsd(close.profit)}</span>)}</span>
      : <span className="text-muted-foreground">—</span>;
    case 'tags': return value?.length
      ? <span className="flex flex-wrap gap-1.5">{value.map((t) => <span key={t} className="rounded-full border border-sand/30 bg-sand/[0.08] px-2.5 py-0.5 text-xs text-pearl">#{t}</span>)}</span>
      : <span className="text-muted-foreground">No tags</span>;
    default: return empty ? <span className="text-muted-foreground">—</span> : <span className="whitespace-pre-wrap">{String(value)}</span>;
  }
}