import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Field, { inputCls } from '@/components/kit/Field';
import FormSection from '@/components/kit/FormSection';
import FormSelect from '@/components/kit/FormSelect';
import { ENTRY_REASONS, EXIT_REASONS } from '@/lib/journal/constants';

const areaCls = 'rounded-xl border-border bg-surface-2 text-pearl placeholder:text-muted-foreground/70';

export default function ReasoningStep({ form, set, settings }) {
  const entryReasons = (settings?.entryReasons || ENTRY_REASONS).filter(Boolean);
  const exitReasons = (settings?.exitReasons || EXIT_REASONS).filter(Boolean);
  return (
    <div className="space-y-5">
      <FormSection title="Why you entered and exited">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Entry reason" htmlFor="entryReason"><FormSelect id="entryReason" value={form.entryReason} onChange={(v) => set({ entryReason: v })} options={entryReasons} /></Field>
          <Field label="Entry reason note" htmlFor="entryReasonNote">
            <Input id="entryReasonNote" value={form.entryReasonNote} onChange={(e) => set({ entryReasonNote: e.target.value })} placeholder="What exactly triggered the entry?" className={inputCls} />
          </Field>
          <Field label="Exit reason" htmlFor="exitReason"><FormSelect id="exitReason" value={form.exitReason} onChange={(v) => set({ exitReason: v })} options={exitReasons} /></Field>
          <Field label="Exit reason note" htmlFor="exitReasonNote">
            <Input id="exitReasonNote" value={form.exitReasonNote} onChange={(e) => set({ exitReasonNote: e.target.value })} placeholder="Why did you close here?" className={inputCls} />
          </Field>
        </div>
      </FormSection>
      <FormSection title="Trade notes" description="Context, market conditions, what you saw on the chart.">
        <Textarea value={form.tradeNotes} onChange={(e) => set({ tradeNotes: e.target.value })} rows={9} placeholder="Price swept the Asian low, reclaimed the level on the 15M close, entered on the retest…" className={areaCls} />
      </FormSection>
    </div>
  );
}