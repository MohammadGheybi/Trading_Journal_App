import React from 'react';
import { Plus, Sparkles, TrendingUp, TrendingDown, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Field, { inputCls } from '@/components/kit/Field';
import FormSection from '@/components/kit/FormSection';
import FormSelect from '@/components/kit/FormSelect';
import SegmentedControl from '@/components/kit/SegmentedControl';
import { TIMEFRAMES, RESULTS, normalizeSymbol } from '@/lib/journal/constants';
import { suggestResult } from '@/lib/journal/calculations';
import { zoneLabel } from '@/lib/journal/marketHours';

export default function FinancialStep({ form, set, errors, preview, symbols, settings }) {
  const zone = zoneLabel(settings?.timezone);
  const text = (k, label, props = {}) => (
    <Field label={label} htmlFor={k} error={errors[k]} required={props.required} hint={props.hint}>
      <Input id={k} type={props.type || 'text'} step={props.type === 'time' ? '1' : undefined} inputMode={props.inputMode} placeholder={props.placeholder} value={form[k] ?? ''}
        aria-invalid={Boolean(errors[k])} onChange={(e) => (props.onChange || ((v) => set({ [k]: v })))(e.target.value)}
        className={`${inputCls} ${errors[k] ? 'border-loss' : ''} ${props.mono ? 'num' : ''}`} />
    </Field>
  );
  const money = (k, label, hint) => text(k, label, { inputMode: 'decimal', placeholder: '0.00', mono: true, hint });
  const suggestion = suggestResult(form.netPnlUsd);
  const updateClose = (index, patch) => {
    const closes = (form.closes || []).slice();
    closes[index] = { ...closes[index], ...patch };
    set({ closes });
  };
  const onPnl = (v) => {
    const prev = suggestResult(form.netPnlUsd);
    set({ netPnlUsd: v, ...(!form.result || form.result === prev ? { result: suggestResult(v) } : {}) });
  };

  return (
    <div className="space-y-5">
      <FormSection title="Trade identity" description={`Times are recorded in ${zone}. Sessions are calculated from the entry time.`}>
        <div className="grid gap-5 sm:grid-cols-2">
          {text('entryDate', 'Entry date', { type: 'date', required: true, hint: preview?.tradeNumber ? `Will be trade #${preview.tradeNumber} in chronological order.` : 'Trade number is assigned once an entry date exists.' })}
          {text('entryTime', `Entry time (${zone})`, { type: 'time' })}
          <div className="space-y-2">
            {text('symbol', 'Symbol', { required: true, placeholder: 'e.g. EURUSD', onChange: (v) => set({ symbol: normalizeSymbol(v) }) })}
            {symbols.length > 0 && (
              <div className="flex flex-wrap gap-1.5" aria-label="Recent symbols">
                {symbols.map((s) => (
                  <button key={s} type="button" onClick={() => set({ symbol: s })} className={`rounded-full border px-2.5 py-0.5 text-xs transition-colors ${form.symbol === s ? 'border-sand bg-sand/15 text-pearl' : 'border-border text-muted-foreground hover:text-pearl'}`}>{s}</button>
                ))}
              </div>
            )}
          </div>
          <Field label="Direction" required error={errors.direction}>
            <SegmentedControl label="Direction" value={form.direction} onChange={(v) => set({ direction: v })} className="flex w-full"
              options={[{ value: 'Buy', label: 'Buy', icon: TrendingUp }, { value: 'Sell', label: 'Sell', icon: TrendingDown }]} />
          </Field>
          <Field label="Entry timeframe" htmlFor="timeframe" required error={errors.timeframe} hint="The chart that gave you the entry.">
            <FormSelect id="timeframe" value={form.timeframe} onChange={(v) => set({ timeframe: v })} options={TIMEFRAMES} invalid={Boolean(errors.timeframe)} />
          </Field>
          <Field label="Management timeframe" htmlFor="manageTf" hint="Optional. The chart you used while the trade was open.">
            <FormSelect id="manageTf" value={form.managementTimeframe} onChange={(v) => set({ managementTimeframe: v })} options={TIMEFRAMES} placeholder="None" />
            {form.managementTimeframe && <button type="button" onClick={() => set({ managementTimeframe: '' })} className="mt-2 text-xs text-sand hover:text-pearl">Clear management timeframe</button>}
          </Field>
          {text('volumeLots', 'Volume (lots)', { inputMode: 'decimal', placeholder: '0.10', mono: true })}
          {text('exitDate', 'Exit date', { type: 'date' })}
          {text('exitTime', `Exit time (${zone})`, { type: 'time' })}
        </div>
        <div className="mt-5 space-y-3">
          {(form.extraTimeframes || []).map((row, index) => (
            <div key={index} className="grid gap-3 sm:grid-cols-[1fr_180px_auto] sm:items-end">
              <Field label={index === 0 ? 'Other timeframe label' : 'Label'} htmlFor={`tf-label-${index}`}>
                <Input id={`tf-label-${index}`} value={row.label} placeholder="Higher timeframe" onChange={(e) => {
                  const extraTimeframes = form.extraTimeframes.slice();
                  extraTimeframes[index] = { ...row, label: e.target.value };
                  set({ extraTimeframes });
                }} className={inputCls} />
              </Field>
              <Field label="Timeframe" htmlFor={`tf-value-${index}`}>
                <FormSelect id={`tf-value-${index}`} value={row.value} onChange={(v) => {
                  const extraTimeframes = form.extraTimeframes.slice();
                  extraTimeframes[index] = { ...row, value: v };
                  set({ extraTimeframes });
                }} options={TIMEFRAMES} />
              </Field>
              <Button type="button" variant="ghost" className="rounded-xl text-muted-foreground" onClick={() => set({ extraTimeframes: form.extraTimeframes.filter((_, i) => i !== index) })}><X className="h-4 w-4" /> Remove</Button>
            </div>
          ))}
          <Button type="button" variant="outline" className="rounded-xl border-border" onClick={() => set({ extraTimeframes: [...(form.extraTimeframes || []), { label: '', value: '' }] })}><Plus className="h-4 w-4" /> Add timeframe</Button>
        </div>
      </FormSection>
      <FormSection title="Financials" description="All amounts in USD.">
        <div className="grid gap-5 sm:grid-cols-2">
          {money('commissionUsd', 'Commission (USD)', 'Positive value — subtracted from balance.')}
          {money('swapUsd', 'Swap (USD)', 'Signed — negative swap reduces balance.')}
          {text('entryPrice', 'Entry price', { inputMode: 'decimal', mono: true })}
          {text('exitPrice', 'Exit price', { inputMode: 'decimal', mono: true })}
          {text('stopLossPrice', 'Stop loss price', { inputMode: 'decimal', mono: true })}
          {text('takeProfitPrice', 'Take profit price', { inputMode: 'decimal', mono: true })}
          {money('stopAmountUsd', 'Stop amount (USD)', 'Dollar risk of the stop. Positive or negative both count as that size. Used for R/R.')}
          {text('netPnlUsd', 'Net P&L (USD)', { inputMode: 'decimal', placeholder: '0.00', mono: true, onChange: onPnl })}
          <Field label="Result" htmlFor="result" className="sm:col-span-2">
            <FormSelect id="result" value={form.result} onChange={(v) => set({ result: v })} options={RESULTS} placeholder="Win, Loss or Breakeven" />
            {suggestion && suggestion !== form.result && (
              <button type="button" onClick={() => set({ result: suggestion })} className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-sand hover:text-pearl">
                <Sparkles className="h-3.5 w-3.5" /> P&L suggests “{suggestion}” — apply
              </button>
            )}
          </Field>
        </div>
        {(form.closes || []).length > 0 && (
          <div className="mt-5 space-y-3">
            <div className="text-sm font-medium text-pearl">Closes</div>
            <p className="text-xs text-muted-foreground">Each time volume was closed, including partial profit-taking. Edit anything the report got wrong.</p>
            {form.closes.map((close, index) => (
              <div key={index} className="grid gap-3 rounded-xl border border-border p-3 sm:grid-cols-4">
                <Field label="Date"><Input type="date" value={close.date || ''} onChange={(e) => updateClose(index, { date: e.target.value })} className={`${inputCls} num`} /></Field>
                <Field label="Time"><Input type="time" step="1" value={close.time || ''} onChange={(e) => updateClose(index, { time: e.target.value })} className={`${inputCls} num`} /></Field>
                <Field label="Volume"><Input inputMode="decimal" value={close.volume ?? ''} onChange={(e) => updateClose(index, { volume: e.target.value })} className={`${inputCls} num`} /></Field>
                <Field label="Price"><Input inputMode="decimal" value={close.price ?? ''} onChange={(e) => updateClose(index, { price: e.target.value })} className={`${inputCls} num`} /></Field>
                <Field label="Profit (USD)"><Input inputMode="decimal" value={close.profit ?? ''} onChange={(e) => updateClose(index, { profit: e.target.value })} className={`${inputCls} num`} /></Field>
                {close.comment && <p className="sm:col-span-4 text-xs text-muted-foreground">{close.comment}</p>}
              </div>
            ))}
          </div>
        )}
      </FormSection>
    </div>
  );
}