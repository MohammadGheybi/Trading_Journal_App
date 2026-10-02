import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import Field from '@/components/kit/Field';
import FormSection from '@/components/kit/FormSection';
import { LabelChecklist } from '@/components/kit/ChecklistGroup';
import ScaleSlider from '@/components/kit/ScaleSlider';

const areaCls = 'rounded-xl border-border bg-surface-2 text-pearl placeholder:text-muted-foreground/70';

export default function BeforeStep({ form, set, settings }) {
  return (
    <div className="space-y-5">
      <FormSection title="Pre-trade emotions" description="Select every feeling that applies. The list itself is edited in Settings.">
        <LabelChecklist options={settings?.feelingsBefore || []} selected={form.selectedFeelingsBefore} onChange={(selectedFeelingsBefore) => set({ selectedFeelingsBefore })} />
      </FormSection>
      <FormSection title="Readiness">
        <div className="grid gap-4 md:grid-cols-2">
          <ScaleSlider label="Energy / readiness" hint="How rested and focused were you?" value={form.energyReadiness} onChange={(v) => set({ energyReadiness: v })} low="Drained" high="Sharp" />
          <ScaleSlider label="Setup confidence" hint="How closely did this match your A+ setup?" value={form.setupConfidence} onChange={(v) => set({ setupConfidence: v })} low="Doubtful" high="Certain" />
        </div>
      </FormSection>
      <FormSection title="Motivation" description="What made you take the trade? Add or rename options in Settings.">
        <LabelChecklist options={settings?.motivations || []} selected={form.selectedMotivations} onChange={(selectedMotivations) => set({ selectedMotivations })} variant="card" />
      </FormSection>
      <FormSection title="Notes">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Feelings before the trade"><Textarea rows={4} value={form.feelingsBeforeTrade} onChange={(e) => set({ feelingsBeforeTrade: e.target.value })} placeholder="Calm, a bit impatient after missing the open…" className={areaCls} /></Field>
          <Field label="Feelings during the trade"><Textarea rows={4} value={form.feelingsDuringTrade} onChange={(e) => set({ feelingsDuringTrade: e.target.value })} placeholder="Wanted to close early when it pulled back…" className={areaCls} /></Field>
        </div>
      </FormSection>
    </div>
  );
}