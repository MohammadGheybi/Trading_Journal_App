import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import Field from '@/components/kit/Field';
import FormSection from '@/components/kit/FormSection';
import { LabelChecklist } from '@/components/kit/ChecklistGroup';
import ScaleSlider from '@/components/kit/ScaleSlider';
import { countMistakes } from '@/lib/journal/calculations';

const areaCls = 'rounded-xl border-border bg-surface-2 text-pearl placeholder:text-muted-foreground/70';

export default function AfterStep({ form, set, settings }) {
  const count = (form.selectedMistakes || []).length || countMistakes(form);
  return (
    <div className="space-y-5">
      <FormSection title="Post-trade emotions" description="How did you feel once the trade was closed? The list is edited in Settings.">
        <LabelChecklist options={settings?.feelingsAfter || []} selected={form.selectedFeelingsAfter} onChange={(selectedFeelingsAfter) => set({ selectedFeelingsAfter })} />
      </FormSection>
      <FormSection title="Execution">
        <ScaleSlider label="Execution quality" hint="How well did you follow your process, regardless of outcome?" value={form.executionQuality} onChange={(v) => set({ executionQuality: v })} low="Sloppy" high="Flawless" />
      </FormSection>
      <FormSection title="Behavioral mistakes" description={count ? `${count} mistake${count > 1 ? 's' : ''} flagged — honest tagging makes the Mistakes analytics useful.` : 'No mistakes flagged. The list is edited in Settings.'}>
        <LabelChecklist options={settings?.mistakes || []} selected={form.selectedMistakes} onChange={(selectedMistakes) => set({ selectedMistakes })} tone="loss" variant="card" />
      </FormSection>
      <FormSection title="Reflection">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Lessons learned"><Textarea rows={4} value={form.lessonsLearned} onChange={(e) => set({ lessonsLearned: e.target.value })} placeholder="What would you repeat or change next time?" className={areaCls} /></Field>
          <Field label="Feelings after the trade"><Textarea rows={4} value={form.feelingsAfterTrade} onChange={(e) => set({ feelingsAfterTrade: e.target.value })} placeholder="Relieved, frustrated, proud of the patience…" className={areaCls} /></Field>
        </div>
      </FormSection>
    </div>
  );
}