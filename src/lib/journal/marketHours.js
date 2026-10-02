// Real-world market hours (UTC, approximate, no DST adjustment).
// The Sessions page shifts these into the display timezone.
export const MARKETS = [
  { name: 'Sydney', open: 21 * 60, close: 6 * 60, opacity: 0.35 },
  { name: 'Tokyo', open: 0, close: 9 * 60, opacity: 0.5 },
  { name: 'London', open: 8 * 60, close: 17 * 60, opacity: 0.7 },
  { name: 'New York', open: 13 * 60, close: 22 * 60, opacity: 0.92 },
];

export const isOpen = (mk, m) => (mk.open < mk.close ? m >= mk.open && m < mk.close : m >= mk.open || m < mk.close);
export const until = (target, m) => (target - m + 1440) % 1440;
export const hhmm = (min) => `${String(Math.floor(min / 60) % 24).padStart(2, '0')}:${String(min % 60).padStart(2, '0')}`;
export const inWords = (min) => (min >= 60 ? `${Math.floor(min / 60)}h ${min % 60}m` : `${min}m`);
export const shiftMinutes = (min, offset) => ((min + offset) % 1440 + 1440) % 1440;

function parseGmtOffset(name) {
  if (!name || name === 'GMT' || name === 'UTC') return 0;
  const match = name.match(/([+-])(\d{1,2})(?::(\d{2}))?/);
  if (!match) return 0;
  const sign = match[1] === '-' ? -1 : 1;
  return sign * (Number(match[2]) * 60 + Number(match[3] || 0));
}

/** Minutes east of UTC for an IANA timezone at a given instant. */
export function timezoneOffsetMinutes(timeZone, date = new Date()) {
  try {
    const name = new Intl.DateTimeFormat('en-US', { timeZone, timeZoneName: 'longOffset', hour: '2-digit' })
      .formatToParts(date)
      .find((part) => part.type === 'timeZoneName')?.value;
    return parseGmtOffset(name);
  } catch {
    return 0;
  }
}

/** Minutes since local midnight in the display timezone. */
export function zonedMinute(timeZone, date = new Date()) {
  try {
    const parts = new Intl.DateTimeFormat('en-US', { timeZone, hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(date);
    const hour = Number(parts.find((part) => part.type === 'hour')?.value ?? 0) % 24;
    const minute = Number(parts.find((part) => part.type === 'minute')?.value ?? 0);
    return hour * 60 + minute;
  } catch {
    return date.getUTCHours() * 60 + date.getUTCMinutes();
  }
}

export function zoneLabel(timeZone, date = new Date()) {
  if (!timeZone || timeZone === 'UTC') return 'UTC';
  const offset = timezoneOffsetMinutes(timeZone, date);
  const city = timeZone.split('/').pop().replaceAll('_', ' ');
  const sign = offset < 0 ? '-' : '+';
  const abs = Math.abs(offset);
  return `${city} (UTC${sign}${Math.floor(abs / 60)}:${String(abs % 60).padStart(2, '0')})`;
}

export function marketsInZone(offset) {
  return MARKETS.map((market) => ({
    ...market,
    open: shiftMinutes(market.open, offset),
    close: shiftMinutes(market.close, offset),
  }));
}

/** Exclusive performance windows, in the same clock as the timeline bars. */
export function performanceWindows(markets) {
  const sydney = markets.find((market) => market.name === 'Sydney');
  const tokyo = markets.find((market) => market.name === 'Tokyo');
  const london = markets.find((market) => market.name === 'London');
  const ny = markets.find((market) => market.name === 'New York');
  return [
    { name: 'Sydney', open: sydney.open, close: tokyo.open },
    { name: 'Sydney–Tokyo', open: tokyo.open, close: sydney.close },
    { name: 'Tokyo/Asia', open: sydney.close, close: london.open },
    { name: 'London', open: london.open, close: ny.open },
    { name: 'London–New York overlap', open: ny.open, close: london.close },
    { name: 'New York', open: london.close, close: sydney.open },
  ].map((window) => ({ ...window, range: `${hhmm(window.open)}–${hhmm(window.close)}` }));
}

export function segments(mk) {
  return mk.open < mk.close ? [[mk.open, mk.close]] : [[mk.open, 1440], [0, mk.close]];
}