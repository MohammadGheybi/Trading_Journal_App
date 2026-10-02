export const EMPTY_FILTERS = {
  search: '', from: '', to: '', symbol: '', direction: '', result: '', timeframe: '', session: '', tags: [],
};

export function filterTrades(trades, f = {}) {
  const q = (f.search || '').trim().toLowerCase();
  return trades.filter((t) => {
    if (f.from && (!t.entryDate || t.entryDate < f.from)) return false;
    if (f.to && (!t.entryDate || t.entryDate > f.to)) return false;
    if (f.symbol && t.symbol !== f.symbol) return false;
    if (f.direction && t.direction !== f.direction) return false;
    if (f.result && (t.result || 'Open') !== f.result) return false;
    if (f.timeframe && t.timeframe !== f.timeframe) return false;
    if (f.session && t.marketSession !== f.session) return false;
    if (f.tags?.length && !f.tags.every((tag) => (t.tags || []).includes(tag))) return false;
    if (q) {
      const hay = [t.symbol, t.tradeNotes, t.entryReason, t.exitReason, t.lessonsLearned, ...(t.tags || [])].join(' ').toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

const iso = (d) => d.toISOString().slice(0, 10);

export const RANGE_PRESETS = [
  { id: 'all', label: 'All time' },
  { id: '30d', label: 'Last 30 days' },
  { id: '90d', label: 'Last 90 days' },
  { id: 'ytd', label: 'Year to date' },
  { id: 'custom', label: 'Custom range' },
];

export function presetRange(id) {
  const now = new Date();
  if (id === '30d') return { from: iso(new Date(now - 29 * 864e5)), to: iso(now) };
  if (id === '90d') return { from: iso(new Date(now - 89 * 864e5)), to: iso(now) };
  if (id === 'ytd') return { from: `${now.getUTCFullYear()}-01-01`, to: iso(now) };
  return { from: '', to: '' };
}