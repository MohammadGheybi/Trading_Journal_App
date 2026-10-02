import { MISTAKES, normalizeSymbol } from './constants';
import { isOpen, performanceWindows, MARKETS, shiftMinutes, timezoneOffsetMinutes } from './marketHours';

export const isNum = (v) => v !== null && v !== undefined && v !== '' && !Number.isNaN(Number(v));
const n = (v) => (isNum(v) ? Number(v) : 0);

const toMinutes = (t) => {
  if (!t) return null;
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
};

function clock(time) {
  const [h = '0', m = '0', s = '0'] = String(time || '00:00').split(':');
  const pad = (part) => String(Math.min(59, Math.max(0, Number(part) || 0))).padStart(2, '0').slice(-2);
  const hour = String(Math.min(23, Math.max(0, Number(h) || 0))).padStart(2, '0');
  return `${hour}:${pad(m)}:${pad(s)}`;
}

export const toTimestamp = (date, time) => {
  if (!date) return null;
  const stamp = Date.parse(`${date}T${clock(time)}Z`);
  return Number.isNaN(stamp) ? null : stamp;
};

const SESSION_WINDOWS = performanceWindows(MARKETS);

/** Session from an entry time stored in the display timezone. */
export function getMarketSession(entryTime, timeZone = 'UTC') {
  const m = toMinutes(entryTime);
  if (m === null) return '';
  const utc = shiftMinutes(m, -timezoneOffsetMinutes(timeZone || 'UTC'));
  return SESSION_WINDOWS.find((window) => isOpen(window, utc))?.name || '';
}

export const countMistakes = (t) => (
  Array.isArray(t.selectedMistakes) && t.selectedMistakes.length
    ? t.selectedMistakes.filter(Boolean).length
    : MISTAKES.filter((f) => t[f.key]).length
);

export function suggestResult(netPnl) {
  if (!isNum(netPnl)) return '';
  const v = Number(netPnl);
  return v > 0 ? 'Win' : v < 0 ? 'Loss' : 'Breakeven';
}

export function holdingMs(t) {
  if (!t.entryDate || !t.entryTime || !t.exitDate || !t.exitTime) return null;
  const d = toTimestamp(t.exitDate, t.exitTime) - toTimestamp(t.entryDate, t.entryTime);
  return d >= 0 ? d : null;
}

/** Net P&L divided by the stop size. The sign follows the trade: profit is positive, loss is negative. */
export function realizedRR(t) {
  if (!isNum(t.netPnlUsd) || !isNum(t.stopAmountUsd) || Number(t.stopAmountUsd) === 0) return null;
  return Number(t.netPnlUsd) / Math.abs(Number(t.stopAmountUsd));
}

export const tradeCashChange = (t) => n(t.netPnlUsd) - n(t.commissionUsd) + n(t.swapUsd);

const sortKey = (t) => `${t.entryDate || '9999-99-99'}T${t.entryTime || '99:99'}`;

export function sortChronological(trades) {
  return [...trades].sort((a, b) => sortKey(a).localeCompare(sortKey(b)) || (a.createdAt || 0) - (b.createdAt || 0));
}

/** Adds every read-only workbook column. Recomputed whenever trades or settings change. */
export function deriveTrades(trades, settings) {
  let number = 0;
  let balance = Number(settings.initialBalance) || 0;
  let symbolOrder = 0;
  const seen = new Set();

  return sortChronological(trades).map((t) => {
    const hasDate = Boolean(t.entryDate);
    if (hasDate) balance += tradeCashChange(t);
    const sym = (t.symbol || '').trim().toUpperCase();
    const first = Boolean(sym) && !seen.has(sym);
    if (first) { seen.add(sym); symbolOrder += 1; }
    return {
      ...t,
      symbol: normalizeSymbol(sym),
      tradeNumber: hasDate ? ++number : null,
      accountBalanceAfterTrade: hasDate ? balance : null,
      marketSession: getMarketSession(t.entryTime, settings.timezone),
      behavioralMistakeCount: countMistakes(t),
      firstTimeSymbol: first,
      uniqueSymbolOrder: first ? symbolOrder : null,
      holdingDuration: holdingMs(t),
      realizedRR: realizedRR(t),
    };
  });
}