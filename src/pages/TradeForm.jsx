import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight, FileQuestion } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { useJournal } from '@/lib/journal/JournalContext';
import { emptyTrade } from '@/lib/journal/constants';
import { deriveTrades } from '@/lib/journal/calculations';
import { toForm, fromForm, validateForm, sectionCompletion, FINANCIAL_KEYS } from '@/lib/journal/formModel';
import PageSkeleton from '@/components/kit/PageSkeleton';
import EmptyState from '@/components/kit/EmptyState';
import FormHeader from '@/components/trade/FormHeader';
import StepTabs from '@/components/trade/StepTabs';
import FinancialStep from '@/components/trade/steps/FinancialStep';
import RiskStep from '@/components/trade/steps/RiskStep';
import ReasoningStep from '@/components/trade/steps/ReasoningStep';
import BeforeStep from '@/components/trade/steps/BeforeStep';
import AfterStep from '@/components/trade/steps/AfterStep';
import EvidenceStep from '@/components/trade/steps/EvidenceStep';
import ReviewStep from '@/components/trade/steps/ReviewStep';

const STEPS = [
  { id: 'financial', label: 'Trade & Financial', C: FinancialStep }, { id: 'risk', label: 'Risk Management', C: RiskStep },
  { id: 'reasoning', label: 'Reasoning', C: ReasoningStep }, { id: 'before', label: 'Before Trade', C: BeforeStep },
  { id: 'after', label: 'After Trade', C: AfterStep }, { id: 'evidence', label: 'Evidence & Tags', C: EvidenceStep },
  { id: 'review', label: 'Review', C: ReviewStep },
];

export default function TradeForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { ready, rawTrade, rawTrades, trades, settings, saveTrade } = useJournal();
  const [form, setForm] = useState(null);
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!ready) return;
    const src = id ? rawTrade(id) : emptyTrade(settings);
    setForm(src ? toForm(src) : false);
    setStep(0);
    setErrors({});
  }, [ready, id]); // eslint-disable-line react-hooks/exhaustive-deps

  const set = useCallback((patch) => {
    setForm((f) => ({ ...f, ...patch }));
    setErrors((e) => { const n = { ...e }; Object.keys(patch).forEach((k) => delete n[k]); return n; });
  }, []);

  const preview = useMemo(() => {
    if (!form) return null;
    const tmp = form.id || '__preview';
    const others = rawTrades.filter((t) => t.id !== form.id);
    return deriveTrades([...others, { ...fromForm(form), id: tmp, createdAt: form.createdAt || Date.now() }], settings).find((t) => t.id === tmp);
  }, [form, rawTrades, settings]);

  const symbols = useMemo(() => [...new Set([...trades].reverse().map((t) => t.symbol).filter(Boolean))].slice(0, 6), [trades]);
  const tagSuggestions = useMemo(() => [...new Set(trades.flatMap((t) => t.tags || []))], [trades]);

  if (!ready || form === null) return <PageSkeleton />;
  if (form === false) return <EmptyState icon={FileQuestion} title="Trade not found" description="This trade may have been deleted." action={<Button asChild variant="outline" className="rounded-xl border-border"><Link to="/journal">Back to journal</Link></Button>} />;

  const completion = sectionCompletion(form);
  const done = Object.values(completion).filter(Boolean).length;
  const hasFinancialError = Object.keys(errors).some((k) => FINANCIAL_KEYS.includes(k));

  const save = (draft) => {
    const e = validateForm(form, { draft });
    setErrors(e);
    if (Object.keys(e).length) {
      if (Object.keys(e).some((k) => FINANCIAL_KEYS.includes(k))) setStep(0);
      toast({ title: 'Please fix the highlighted fields', description: Object.values(e)[0], variant: 'destructive' });
      return;
    }
    const savedId = saveTrade({ ...fromForm(form), status: draft ? 'draft' : 'complete' });
    toast({ title: draft ? 'Draft saved' : 'Trade saved', description: draft ? 'You can finish it any time from the journal.' : `${form.symbol} was added to your journal.` });
    navigate(draft ? '/journal' : `/journal/${savedId}`);
  };

  const Step = STEPS[step].C;
  return (
    <div className="-mt-6 lg:-mt-8">
      <FormHeader title={id ? `${form.status === 'incomplete' ? 'Complete' : 'Edit'} ${form.symbol || 'trade'}` : 'New trade'} done={done} total={6} onBack={() => navigate(-1)} onDraft={() => save(true)} onSave={() => save(false)} />
      <div className="mx-auto max-w-5xl pt-5">
        <StepTabs steps={STEPS} active={step} onChange={setStep} completion={completion} errorStep={hasFinancialError ? 0 : null} />
        <div key={step} className="mt-5 animate-fade-up">
          <Step form={form} set={set} settings={settings} errors={errors} preview={preview} symbols={symbols} tagSuggestions={tagSuggestions} onJump={setStep} />
        </div>
        <div className="mt-6 flex items-center justify-between">
          <Button variant="ghost" disabled={step === 0} onClick={() => setStep(step - 1)} className="rounded-xl"><ChevronLeft className="h-4 w-4" /> Previous</Button>
          {step < STEPS.length - 1
            ? <Button variant="outline" onClick={() => setStep(step + 1)} className="rounded-xl border-border bg-surface">{STEPS[step + 1].label} <ChevronRight className="h-4 w-4" /></Button>
            : <Button onClick={() => save(false)} className="rounded-xl bg-crimson text-pearl hover:bg-crimson-hover">Save trade</Button>}
        </div>
      </div>
    </div>
  );
}