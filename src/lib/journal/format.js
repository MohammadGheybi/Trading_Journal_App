const usd2 = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 });
const usd0 = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

const bad = (v) => v === null || v === undefined || v === '' || Number.isNaN(Number(v));

export function fmtUsd(v, { sign = false, decimals = 2 } = {}) {
  if (bad(v)) return '—';
  const n = Number(v);
  const s = (decimals === 0 ? usd0 : usd2).format(Math.abs(n));
  if (sign) return `${n > 0 ? '+' : n < 0 ? '−' : ''}${s}`;
  return n < 0 ? `−${s}` : s;
}

export function fmtAxisUsd(v) {
  const a = Math.abs(v);
  const s = a >= 1000 ? `$${(a / 1000).toFixed(a >= 10000 ? 0 : 1)}k` : `$${Math.round(a)}`;
  return v < 0 ? `−${s}` : s;
}

export function fmtPct(v, { sign = false, decimals = 1 } = {}) {
  if (bad(v)) return '—';
  const n = Number(v);
  const s = `${Math.abs(n).toFixed(decimals)}%`;
  if (sign) return `${n > 0 ? '+' : n < 0 ? '−' : ''}${s}`;
  return n < 0 ? `−${s}` : s;
}

export function fmtDuration(ms) {
  if (bad(ms)) return '—';
  const m = Math.round(ms / 60000);
  const d = Math.floor(m / 1440), h = Math.floor((m % 1440) / 60), mm = m % 60;
  if (d) return `${d}d ${h}h`;
  if (h) return `${h}h ${mm}m`;
  return `${mm}m`;
}

export function fmtRR(v) {
  if (bad(v)) return '—';
  const n = Number(v);
  return `${n > 0 ? '+' : n < 0 ? '−' : ''}${Math.abs(n).toFixed(2)}R`;
}

export function fmtDate(d, opts = {}) {
  if (!d) return '—';
  return new Date(`${d}T00:00:00Z`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC', ...opts });
}

export const pnlTone = (v) => (bad(v) ? 'text-muted-foreground' : Number(v) > 0 ? 'text-profit' : Number(v) < 0 ? 'text-loss' : 'text-sand');