import React from 'react';
import { Switch } from '@/components/ui/switch';
import Field from '@/components/kit/Field';
import FormSection from '@/components/kit/FormSection';
import FormSelect from '@/components/kit/FormSelect';
import { SL_METHODS, TP_METHODS, CHANGE_OUTCOMES } from '@/lib/journal/constants';

function ChangeBlock({ title, prefix, methods, form, set }) {
  const on = form[`${prefix}Changed`];
  return (
    <div className="rounded-xl border border-border bg-surface-2 p-4">
      <label className="flex cursor-pointer items-center justify-between gap-4">
        <span>
          <span className="block text-sm font-medium text-pearl">{title}</span>
          <span className="text-xs text-muted-foreground">{on ? 'Yes — describe how and what it did' : 'No'}</span>
        </span>
        <Switch checked={on} onCheckedChange={(v) => set({ [`${prefix}Changed`]: v })} aria-label={title} />
      </label>
      {on && (
        <div className="mt-4 grid animate-fade-up gap-4 sm:grid-cols-2">
          <Field label="Change method"><FormSelect value={form[`${prefix}ChangeMethod`]} onChange={(v) => set({ [`${prefix}ChangeMethod`]: v })} options={methods} /></Field>
          <Field label="Change outcome"><FormSelect value={form[`${prefix}ChangeOutcome`]} onChange={(v) => set({ [`${prefix}ChangeOutcome`]: v })} options={CHANGE_OUTCOMES} /></Field>
        </div>
      )}
    </div>
  );
}

export default function RiskStep({ form, set }) {
  return (
    <div className="space-y-5">
      <FormSection title="Stop-loss & take-profit management" description="Record whether you adjusted your levels after entry.">
        <div className="space-y-3">
          <ChangeBlock title="Stop loss changed?" prefix="stopLoss" methods={SL_METHODS} form={form} set={set} />
          <ChangeBlock title="Take profit changed?" prefix="takeProfit" methods={TP_METHODS} form={form} set={set} />
        </div>
      </FormSection>
    </div>
  );
}