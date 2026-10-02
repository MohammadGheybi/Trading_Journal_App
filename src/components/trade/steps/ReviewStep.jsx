import React from 'react';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import FormSection from '@/components/kit/FormSection';
import SessionBadge from '@/components/kit/SessionBadge';
import { FIELD_GROUPS } from '@/lib/journal/fieldGroups';
import { formWarnings } from '@/lib/journal/formModel';
import { fmtUsd, fmtDuration, fmtRR, pnlTone } from '@/lib/journal/format';
import { isNum } from '@/lib/journal/calculations';
import FieldGroupView from '../FieldGroupView';
import DerivedCard from '../DerivedCard';

export default function ReviewStep({ form, preview, errors, onJump }) {
  const warnings = formWarnings(form);
  const errs = Object.values(errors);
  return (
    <div className="space-y-5">
      <div className={`rounded-2xl border p-5 ${errs.length ? 'border-loss/40 bg-loss/[0.06]' : warnings.length ? 'border-sand/30 bg-sand/[0.05]' : 'border-profit/30 bg-profit/[0.06]'}`}>
        <div className="flex items-center gap-2 font-medium text-pearl">
          {errs.length || warnings.length ? <AlertTriangle className="h-4 w-4 text-sand" /> : <CheckCircle2 className="h-4 w-4 text-profit" />}
          {errs.length ? `${errs.length} issue${errs.length > 1 ? 's' : ''} to fix before saving` : warnings.length ? 'Ready to save — a few things to check' : 'Everything looks complete'}
        </div>
        <ul className="mt-3 space-y-1.5 text-sm">
          {errs.map((e) => <li key={e} className="text-loss">• {e}</li>)}
          {warnings.map((w) => <li key={w} className="text-pearl/80">• {w}</li>)}
        </ul>
      </div>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
        <DerivedCard label="Holding duration" value={<span className="num">{fmtDuration(preview?.holdingDuration)}</span>} formula="Close time minus open time." />
        <DerivedCard label="Realized R/R" value={<span className={`num ${pnlTone(preview?.realizedRR)}`}>{fmtRR(preview?.realizedRR)}</span>} formula="Net P&L ÷ stop size. A profit is positive." />
        <DerivedCard label="Risk" value={<span className="num">{isNum(form.stopAmountUsd) ? fmtUsd(Math.abs(Number(form.stopAmountUsd))) : '—'}</span>} formula="The stop amount, as a positive dollar risk." />
        <DerivedCard label="Session" value={<SessionBadge session={preview?.marketSession} />} formula="Market session from the entry time in your display timezone." />
        <DerivedCard label="Balance after" value={<span className="num">{fmtUsd(preview?.accountBalanceAfterTrade)}</span>} formula="Initial balance + cumulative Net P&L − commissions + swaps." />
        <DerivedCard label="Mistakes" value={<span className="num">{preview?.behavioralMistakeCount ?? 0}</span>} formula="Number of behavioral mistake flags selected." />
      </div>
      {preview && FIELD_GROUPS.filter((g) => g.id !== 'derived').map((g, i) => (
        <FormSection key={g.id} title={g.title} className="relative">
          <button type="button" onClick={() => onJump(i)} className="absolute right-5 top-5 text-xs font-medium text-sand hover:text-pearl">Edit</button>
          <FieldGroupView group={g} trade={preview} />
        </FormSection>
      ))}
    </div>
  );
}