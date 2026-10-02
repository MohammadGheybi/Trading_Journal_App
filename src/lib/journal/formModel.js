import { NUMERIC_FIELDS, PRE_EMOTIONS, POST_EMOTIONS, MISTAKES, normalizeSymbol } from './constants';
import { isNum, suggestResult, toTimestamp } from './calculations';

export const PRICE_FIELDS = ['entryPrice', 'exitPrice', 'stopLossPrice', 'takeProfitPrice'];
const NUMBER_FIELDS = [...NUMERIC_FIELDS, ...PRICE_FIELDS];

function numberFields(source, asText) {
  return Object.fromEntries(NUMBER_FIELDS.map((key) => {
    if (asText) return [key, isNum(source[key]) ? String(source[key]) : ''];
    return [key, source[key] === '' || source[key] === null || source[key] === undefined ? null : Number(source[key])];
  }));
}

function selectedOrLegacy(trade, key, legacy) {
  if (Array.isArray(trade[key])) return trade[key];
  return legacy.filter((item) => trade[item.key]).map((item) => item.label);
}

// Numbers are edited as strings so partial input like "-" or "0." is allowed while typing.
export const toForm = (t) => ({
  ...t,
  extraTimeframes: Array.isArray(t.extraTimeframes) ? t.extraTimeframes : [],
  closes: Array.isArray(t.closes) ? t.closes : [],
  managementTimeframe: t.managementTimeframe || '',
  selectedFeelingsBefore: selectedOrLegacy(t, 'selectedFeelingsBefore', PRE_EMOTIONS),
  selectedFeelingsAfter: selectedOrLegacy(t, 'selectedFeelingsAfter', POST_EMOTIONS),
  selectedMistakes: selectedOrLegacy(t, 'selectedMistakes', MISTAKES),
  selectedMotivations: Array.isArray(t.selectedMotivations) ? t.selectedMotivations : [
    t.motivationAccordingToStrategy && 'According to strategy',
    t.motivationNews && 'News',
    t.motivationCustomSignal1 && (t.customSignal1Label || 'Custom signal 1'),
    t.motivationCustomSignal2 && (t.customSignal2Label || 'Custom signal 2'),
  ].filter(Boolean),
  ...numberFields(t, true),
});

export function applySelections(form) {
  const before = form.selectedFeelingsBefore || [];
  const after = form.selectedFeelingsAfter || [];
  const motivations = form.selectedMotivations || [];
  const mistakes = form.selectedMistakes || [];
  const flags = {};
  for (const item of PRE_EMOTIONS) flags[item.key] = before.includes(item.label);
  for (const item of POST_EMOTIONS) flags[item.key] = after.includes(item.label);
  for (const item of MISTAKES) flags[item.key] = mistakes.includes(item.label);
  flags.motivationAccordingToStrategy = motivations.includes('According to strategy');
  flags.motivationNews = motivations.includes('News');
  flags.motivationCustomSignal1 = Boolean(form.customSignal1Label) && motivations.includes(form.customSignal1Label);
  flags.motivationCustomSignal2 = Boolean(form.customSignal2Label) && motivations.includes(form.customSignal2Label);
  return { ...form, ...flags };
}

export const fromForm = (f) => applySelections({
  ...f,
  symbol: normalizeSymbol(f.symbol),
  extraTimeframes: (f.extraTimeframes || []).filter((row) => row.value),
  closes: (f.closes || []).map((close) => ({
    date: close.date || '',
    time: close.time || '',
    volume: close.volume === '' || close.volume == null ? null : Number(close.volume),
    price: close.price === '' || close.price == null ? null : Number(close.price),
    profit: close.profit === '' || close.profit == null ? null : Number(close.profit),
    comment: close.comment || '',
  })),
  ...numberFields(f, false),
});

export const FINANCIAL_KEYS = ['entryDate', 'entryTime', 'exitDate', 'exitTime', 'symbol', 'direction', 'timeframe', ...NUMERIC_FIELDS];

export function validateForm(f, { draft = false } = {}) {
  const e = {};
  NUMERIC_FIELDS.forEach((k) => {
    if (f[k] !== '' && !isNum(f[k])) e[k] = 'Enter a valid number';
  });
  if (isNum(f.volumeLots) && Number(f.volumeLots) < 0) e.volumeLots = 'Volume cannot be negative';
  const entry = toTimestamp(f.entryDate, f.entryTime), exit = toTimestamp(f.exitDate, f.exitTime);
  if (entry && exit && f.exitDate && exit < entry) e.exitDate = 'Exit must be after entry';
  if (draft) return e;
  if (!f.entryDate) e.entryDate = 'Entry date is required';
  if (!f.symbol?.trim()) e.symbol = 'Symbol is required';
  if (!f.direction) e.direction = 'Choose Buy or Sell';
  if (!f.timeframe) e.timeframe = 'Choose an entry timeframe';
  return e;
}

export function formWarnings(f) {
  const w = [];
  if (!isNum(f.netPnlUsd)) w.push('No Net P&L yet — this trade will not count toward Total trades until P&L is entered.');
  if (isNum(f.stopAmountUsd) && Number(f.stopAmountUsd) > 0) w.push('Stop amount is positive. The workbook expects a signed loss value (e.g. −150), otherwise R/R flips sign.');
  if (!isNum(f.stopAmountUsd)) w.push('No stop amount — realized R/R cannot be calculated.');
  const s = suggestResult(f.netPnlUsd);
  if (s && f.result && s !== f.result) w.push(`Result is "${f.result}" but Net P&L suggests "${s}".`);
  if (f.entryDate && (!f.exitDate || !f.exitTime)) w.push('Exit date/time missing — holding duration stays blank.');
  if (!f.entryTime) w.push('No entry time — market session cannot be determined.');
  return w;
}

export function sectionCompletion(f) {
  return {
    financial: Boolean(f.entryDate && f.symbol && isNum(f.netPnlUsd)),
    risk: (!f.stopLossChanged || Boolean(f.stopLossChangeMethod)) && (!f.takeProfitChanged || Boolean(f.takeProfitChangeMethod)),
    reasoning: Boolean(f.entryReason && f.exitReason),
    before: (f.selectedFeelingsBefore || []).length > 0,
    after: (f.selectedFeelingsAfter || []).length > 0,
    evidence: Boolean(f.tags?.length || f.images?.length),
  };
}