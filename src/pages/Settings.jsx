import React, { useEffect, useRef, useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { useJournal } from '@/lib/journal/JournalContext';
import { repository } from '@/lib/journal/repository';
import PageHeader from '@/components/kit/PageHeader';
import FormSection from '@/components/kit/FormSection';
import Field, { inputCls } from '@/components/kit/Field';
import ConfirmDialog from '@/components/kit/ConfirmDialog';
import ThemePreview from '@/components/settings/ThemePreview';
import OptionListEditor from '@/components/settings/OptionListEditor';

const TIMEZONES = [
  { value: 'UTC', label: 'UTC' },
  { value: 'Asia/Tehran', label: 'Tehran (UTC+3:30)' },
  { value: 'Europe/London', label: 'Europe/London' },
  { value: 'America/New_York', label: 'America/New_York' },
  { value: 'Asia/Tokyo', label: 'Asia/Tokyo' },
  { value: 'Australia/Sydney', label: 'Australia/Sydney' },
  { value: 'Asia/Dubai', label: 'Asia/Dubai' },
  { value: 'Europe/Berlin', label: 'Europe/Berlin' },
];
const selCls = 'h-11 rounded-xl border-border bg-surface-2 text-pearl';

export default function Settings() {
  const { ready, settings, updateSettings, clearJournal } = useJournal();
  const [balance, setBalance] = useState(String(settings.initialBalance));
  const [confirm, setConfirm] = useState(false);
  const seeded = useRef(false);
  useEffect(() => {
    if (!ready || seeded.current) return;
    seeded.current = true;
    setBalance(String(settings.initialBalance));
  }, [ready, settings.initialBalance]);
  const balanceError = !(Number(balance) > 0) ? 'Enter a balance greater than zero' : '';

  const onBalance = (v) => { setBalance(v); if (Number(v) > 0) updateSettings({ initialBalance: Number(v) }); };
  const reset = () => {
    clearJournal();
    setBalance('10000');
    toast({ title: 'Journal cleared', description: 'Trades and screenshots were removed. Settings are back to their defaults.' });
  };

  return (
    <div className="max-w-4xl space-y-5">
      <PageHeader eyebrow="Settings" title="Preferences" subtitle={repository.persistent ? 'Changes save to the local database on this computer.' : 'The local database is unavailable — changes last until you close the tab.'} />
      <FormSection title="Account" description="Every balance, return and calendar percentage is calculated from the initial balance.">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Initial account balance (USD)" htmlFor="bal" error={balanceError}>
            <Input id="bal" inputMode="decimal" value={balance} onChange={(e) => onBalance(e.target.value)} className={`${inputCls} num`} />
          </Field>
          <Field label="Base currency" hint="USD is the only functional currency in this version.">
            <Select value="USD"><SelectTrigger className={selCls}><SelectValue /></SelectTrigger>
              <SelectContent className="rounded-xl border-border bg-surface-2">
                <SelectItem value="USD">USD — US Dollar</SelectItem>
                {['EUR', 'GBP', 'JPY'].map((c) => <SelectItem key={c} value={c} disabled>{c} — future</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>
        </div>
      </FormSection>
      <FormSection title="Time & calendar">
        <div className="grid gap-5 sm:grid-cols-3">
          <Field label="Display timezone" hint="Sessions, imported history, and trade clocks use this timezone.">
            <Select value={settings.timezone} onValueChange={(v) => updateSettings({ timezone: v })}>
              <SelectTrigger className={selCls}><SelectValue /></SelectTrigger>
              <SelectContent className="rounded-xl border-border bg-surface-2">{TIMEZONES.map((z) => <SelectItem key={z.value} value={z.value}>{z.label}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
          <Field label="Calendar year" htmlFor="yr">
            <Input id="yr" type="number" value={settings.calendarYear} onChange={(e) => updateSettings({ calendarYear: Number(e.target.value) })} className={`${inputCls} num`} />
          </Field>
          <Field label="Max daily percentage" htmlFor="mdp" hint="Heatmap reaches full intensity here. Default 20%.">
            <Input id="mdp" type="number" min={1} value={settings.maxDailyPct} onChange={(e) => updateSettings({ maxDailyPct: Math.max(1, Number(e.target.value) || 1) })} className={`${inputCls} num`} />
          </Field>
        </div>
      </FormSection>
      <FormSection title="Lists" description="These options appear on the trade form. Add, rename, or delete them. Trades you already saved keep the words they were saved with.">
        <div className="grid gap-8 lg:grid-cols-2">
          <OptionListEditor label="Entry reasons" description="Why you entered." items={settings.entryReasons} onChange={(entryReasons) => updateSettings({ entryReasons })} />
          <OptionListEditor label="Exit reasons" description="Why you closed." items={settings.exitReasons} onChange={(exitReasons) => updateSettings({ exitReasons })} />
          <OptionListEditor label="Feelings before the trade" description="Shown as checkboxes on Before Trade." items={settings.feelingsBefore} onChange={(feelingsBefore) => updateSettings({ feelingsBefore })} />
          <OptionListEditor label="Feelings after the trade" description="Shown as checkboxes on After Trade." items={settings.feelingsAfter} onChange={(feelingsAfter) => updateSettings({ feelingsAfter })} />
          <OptionListEditor label="Motivation" description="What made you take the trade." items={settings.motivations} onChange={(motivations) => updateSettings({ motivations })} />
          <OptionListEditor label="Behavioral mistakes" description="Shown as checkboxes on After Trade." items={settings.mistakes} onChange={(mistakes) => updateSettings({ mistakes })} />
        </div>
      </FormSection>
      <FormSection title="Clear journal" description="Remove every trade and screenshot. Settings return to their defaults. This cannot be undone.">
        <Button variant="outline" onClick={() => setConfirm(true)} className="rounded-xl border-loss/30 text-loss hover:bg-loss/10 hover:text-loss"><RotateCcw className="h-4 w-4" /> Clear all trades</Button>
      </FormSection>
      <FormSection title="Theme tokens" description="Brand colors are kept separate from profit/loss semantics.">
        <ThemePreview />
      </FormSection>
      <ConfirmDialog open={confirm} onOpenChange={setConfirm} title="Clear the journal?" description="Every trade and screenshot on this computer will be deleted. Settings return to their defaults." confirmLabel="Clear journal" onConfirm={reset} />
    </div>
  );
}