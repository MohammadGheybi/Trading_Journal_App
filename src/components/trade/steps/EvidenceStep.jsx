import React from 'react';
import FormSection from '@/components/kit/FormSection';
import ImageDropZone from '../ImageDropZone';
import TagInput from '../TagInput';

export default function EvidenceStep({ form, set, tagSuggestions }) {
  return (
    <div className="space-y-5">
      <FormSection title="Screenshots" description="Attach your before/after charts for later review.">
        <ImageDropZone images={form.images || []} onChange={(images) => set({ images })} />
      </FormSection>
      <FormSection title="Tags" description="Group trades by setup, catalyst or condition — tags are filterable in the journal.">
        <TagInput tags={form.tags || []} onChange={(tags) => set({ tags })} suggestions={tagSuggestions} />
      </FormSection>
    </div>
  );
}