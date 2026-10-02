import { read, utils } from 'xlsx';
import { emptyTrade, DEFAULT_SETTINGS, normalizeSymbol } from './constants.js';

function suggestResult(net) {
  if (net == null || Number.isNaN(Number(net))) return '';
  const value = Number(net);
  return value > 0 ? 'Win' : value < 0 ? 'Loss' : 'Breakeven';
}

const SKIP_TYPES = new Set(['balance', 'credit', 'deposit', 'withdrawal', 'correction', 'transfer']);

function decode(value) {
  return String(value ?? '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/\s+/g, ' ')
    .trim();
}

function norm(value) {
  return decode(value).toLowerCase().replace(/[^a-z0-9]+/g, '');
}

function parseNum(value) {
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;
  let text = decode(value).replace(/\s/g, '');
  if (!text || text === '-') return null;
  if (text.includes(',') && text.includes('.')) text = text.replace(/,/g, '');
  else if (text.includes(',')) text = text.replace(',', '.');
  const number = Number(text);
  return Number.isFinite(number) ? number : null;
}

function parseWhen(value) {
  const text = decode(value);
  let match = text.match(/(\d{4})[./-](\d{2})[./-](\d{2})(?:[ T](\d{2}):(\d{2})(?::(\d{2}))?)?/);
  if (match) {
    const time = match[4] ? `${match[4]}:${match[5]}${match[6] ? `:${match[6]}` : ''}` : '';
    return { date: `${match[1]}-${match[2]}-${match[3]}`, time };
  }
  match = text.match(/(\d{2})[./-](\d{2})[./-](\d{4})(?:[ T](\d{2}):(\d{2})(?::(\d{2}))?)?/);
  if (match) {
    const time = match[4] ? `${match[4]}:${match[5]}${match[6] ? `:${match[6]}` : ''}` : '';
    return { date: `${match[3]}-${match[2]}-${match[1]}`, time };
  }
  return { date: '', time: '' };
}

function stamp(when) {
  return `${when?.date || ''}T${when?.time || ''}`;
}

function headerMap(cells) {
  const map = {};
  cells.forEach((item, index) => {
    const key = norm(item);
    if (!key) return;
    if (!map[key]) map[key] = [];
    map[key].push(index);
  });
  return map;
}

function cell(row, map, key, nth = 0) {
  const indexes = map[key];
  if (!indexes || indexes[nth] == null) return '';
  return row[indexes[nth]] ?? '';
}

function directionOf(type) {
  const value = norm(type);
  if (value.startsWith('buy')) return 'Buy';
  if (value.startsWith('sell')) return 'Sell';
  return '';
}

function tradeId(ticket) {
  const safe = String(ticket || '').replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 64);
  return `mt_${safe || Math.random().toString(36).slice(2, 10)}`;
}

function roundLots(value) {
  return Math.round((Number(value) || 0) * 1e8) / 1e8;
}

function near(a, b) {
  if (a == null || b == null) return false;
  const scale = Math.max(1, Math.abs(a), Math.abs(b));
  return Math.abs(a - b) <= scale * 1e-5;
}

function toJournalTrade(position) {
  const entry = position.entry;
  const exit = position.exit;
  const closes = position.closes.length
    ? position.closes
    : (exit.date ? [{ date: exit.date, time: exit.time, volume: position.volume, price: position.exitPrice, profit: position.profit, comment: '' }] : []);
  return {
    ...emptyTrade(DEFAULT_SETTINGS),
    id: tradeId(position.ticket),
    externalId: tradeId(position.ticket),
    source: 'metatrader',
    status: 'incomplete',
    timeframe: '',
    symbol: normalizeSymbol(position.symbol),
    direction: position.direction || 'Buy',
    volumeLots: position.volume,
    entryDate: entry.date,
    entryTime: entry.time,
    exitDate: exit.date,
    exitTime: exit.time,
    entryPrice: position.entryPrice,
    exitPrice: position.exitPrice,
    stopLossPrice: position.stopLossPrice,
    takeProfitPrice: position.takeProfitPrice,
    commissionUsd: position.commission == null ? null : -position.commission,
    swapUsd: position.swap,
    netPnlUsd: position.profit,
    result: suggestResult(position.profit),
    closes,
    tradeNotes: 'Imported from a MetaTrader history report. Each close is listed with its volume and profit. Add the timeframe, the stop amount in dollars, and the rest of the journal.',
    createdAt: Date.parse(`${entry.date}T${(entry.time || '00:00:00').padEnd(8, ':00')}Z`) || Date.now(),
  };
}

function sectionTitle(row) {
  const filled = row.map((item) => decode(item)).filter(Boolean);
  if (filled.length !== 1) return '';
  const name = norm(filled[0]);
  if (name === 'positions' || name === 'orders' || name === 'deals' || name === 'results') return name;
  return '';
}

function splitSections(rows) {
  const sections = { positions: [], orders: [], deals: [], results: [] };
  let current = '';
  let sawTitle = false;
  for (const row of rows) {
    const title = sectionTitle(row);
    if (title) {
      sawTitle = true;
      current = title;
      continue;
    }
    if (current && sections[current]) sections[current].push(row);
  }
  if (!sawTitle) {
    const header = rows.find((row) => !parseWhen(row[0]).date && (headerMap(row).symbol || headerMap(row).item));
    const map = header ? headerMap(header) : {};
    sections[map.direction ? 'deals' : 'positions'] = rows;
  }
  return sections;
}

function bodyAfterHeader(rows) {
  let map = null;
  const body = [];
  for (const row of rows) {
    if (!parseWhen(row[0]).date) {
      const candidate = headerMap(row);
      if ((candidate.symbol || candidate.item) && (candidate.profit || candidate.price || candidate.type)) {
        map = candidate;
        continue;
      }
    }
    if (map && row.some((item) => decode(item))) body.push(row);
  }
  return { map, body };
}

function parsePosition(row, map) {
  const type = cell(row, map, 'type');
  const direction = directionOf(type);
  const symbol = decode(cell(row, map, 'symbol') || cell(row, map, 'item'));
  if (!direction || !symbol || SKIP_TYPES.has(norm(type))) return null;
  const entry = parseWhen(cell(row, map, 'opentime') || cell(row, map, 'time', 0));
  const exit = parseWhen(cell(row, map, 'closetime') || cell(row, map, 'time', 1));
  if (!entry.date) return null;
  return {
    ticket: decode(cell(row, map, 'position') || cell(row, map, 'ticket') || cell(row, map, 'order')),
    symbol,
    direction,
    volume: parseNum(cell(row, map, 'volume') || cell(row, map, 'size')),
    entry,
    exit,
    entryPrice: parseNum(cell(row, map, 'price', 0)),
    exitPrice: parseNum(cell(row, map, 'price', 1)),
    stopLossPrice: parseNum(cell(row, map, 'sl')),
    takeProfitPrice: parseNum(cell(row, map, 'tp')),
    commission: parseNum(cell(row, map, 'commission')),
    swap: parseNum(cell(row, map, 'swap')),
    profit: parseNum(cell(row, map, 'profit')),
    volumeLeft: 0,
    closes: [],
  };
}

function parseDeal(row, map) {
  const type = norm(cell(row, map, 'type'));
  if (!type || SKIP_TYPES.has(type)) return null;
  const direction = directionOf(type);
  if (!direction) return null;
  const when = parseWhen(cell(row, map, 'time', 0));
  if (!when.date) return null;
  return {
    when,
    symbol: decode(cell(row, map, 'symbol')),
    side: direction,
    inOut: norm(cell(row, map, 'direction')),
    volume: parseNum(cell(row, map, 'volume')) || 0,
    price: parseNum(cell(row, map, 'price', 0)),
    order: decode(cell(row, map, 'order') || cell(row, map, 'position') || cell(row, map, 'deal')),
    commission: parseNum(cell(row, map, 'commission')),
    swap: parseNum(cell(row, map, 'swap')),
    profit: parseNum(cell(row, map, 'profit')),
    comment: decode(cell(row, map, 'comment')),
  };
}

function commentPrice(comment, kind) {
  const match = String(comment || '').match(new RegExp(`\\[${kind}\\s+([0-9.]+)\\]`, 'i'));
  return match ? Number(match[1]) : null;
}

function assignClose(deal, positions) {
  const want = deal.side === 'Buy' ? 'Sell' : 'Buy';
  const at = stamp(deal.when);
  let candidates = positions.filter((position) => (
    position.symbol.toUpperCase() === deal.symbol.toUpperCase()
    && position.direction === want
    && position.volumeLeft > 0.0000001
    && stamp(position.entry) <= at
    && (!position.exit.date || at <= stamp(position.exit))
  ));
  if (candidates.length > 1) {
    const finishing = candidates.filter((position) => stamp(position.exit) === at && Math.abs(position.volumeLeft - deal.volume) < 0.0000001);
    if (finishing.length) candidates = finishing;
  }
  if (candidates.length > 1) {
    const sl = commentPrice(deal.comment, 'sl');
    const tp = commentPrice(deal.comment, 'tp');
    const tagged = candidates.filter((position) => (sl != null && near(position.stopLossPrice, sl)) || (tp != null && near(position.takeProfitPrice, tp)));
    if (tagged.length) candidates = tagged;
  }
  candidates.sort((a, b) => stamp(a.exit).localeCompare(stamp(b.exit)) || stamp(a.entry).localeCompare(stamp(b.entry)));
  const position = candidates[0];
  if (!position) return;
  const used = Math.min(position.volumeLeft, deal.volume);
  position.volumeLeft = roundLots(position.volumeLeft - used);
  const share = deal.volume ? used / deal.volume : 1;
  position.closes.push({
    date: deal.when.date,
    time: deal.when.time,
    volume: roundLots(used),
    price: deal.price,
    profit: deal.profit == null ? null : Math.round(deal.profit * share * 100) / 100,
    comment: deal.comment,
  });
}

function assemble(positions, deals) {
  const byOrder = new Map(positions.filter((position) => position.ticket).map((position) => [position.ticket, position]));
  for (const position of positions) position.volumeLeft = position.volume || 0;
  if (!deals.length) return positions.map(toJournalTrade);
  for (const deal of deals) {
    if (deal.inOut === 'in') {
      const position = byOrder.get(deal.order);
      if (position && deal.price != null) position.entryPrice = deal.price;
      continue;
    }
    if (deal.inOut === 'out' || deal.inOut === 'inout') assignClose(deal, positions);
  }
  return positions.map(toJournalTrade);
}

export function parseReportRows(rows) {
  const sections = splitSections(rows.map((row) => (Array.isArray(row) ? row : [row])));
  const positionTable = bodyAfterHeader(sections.positions);
  const dealTable = bodyAfterHeader(sections.deals);
  const positions = positionTable.map
    ? positionTable.body.map((row) => parsePosition(row, positionTable.map)).filter(Boolean)
    : [];
  const deals = dealTable.map
    ? dealTable.body.map((row) => parseDeal(row, dealTable.map)).filter(Boolean)
    : [];
  const trades = (positions.length ? assemble(positions, deals) : []).filter((trade) => trade.symbol && trade.entryDate);
  const seen = new Set();
  return trades.filter((trade) => {
    if (seen.has(trade.externalId)) return false;
    seen.add(trade.externalId);
    return true;
  });
}

function tablesFromHtml(html) {
  const tables = [];
  for (const table of html.match(/<table[\s\S]*?<\/table>/gi) || []) {
    const rows = [];
    for (const raw of table.match(/<tr[\s\S]*?<\/tr>/gi) || []) {
      const cells = [...raw.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)].map((match) => decode(match[1]));
      if (cells.length) rows.push(cells);
    }
    if (rows.length) tables.push(rows);
  }
  return tables;
}

function tablesFromCsv(text) {
  const delimiter = text.includes('\t') ? '\t' : text.includes(';') ? ';' : ',';
  const rows = text.split(/\r?\n/).map((line) => line.split(delimiter).map((item) => item.trim().replace(/^"|"$/g, '')));
  return [rows.filter((row) => row.some(Boolean))];
}

function resultFromTrades(trades) {
  if (!trades.length) return { trades: [], error: 'No closed positions were found. Use the Excel history report MetaTrader saves, with the Positions and Deals tables.' };
  return { trades, error: '' };
}

export function parseMetaTraderReport(text) {
  const source = String(text || '').replace(/^\uFEFF/, '');
  if (!source.trim()) return { trades: [], error: 'That file is empty.' };
  const tables = source.includes('<') ? tablesFromHtml(source) : tablesFromCsv(source);
  return resultFromTrades(tables.flatMap((rows) => parseReportRows(rows)));
}

export function parseMetaTraderWorkbook(buffer) {
  const workbook = read(buffer, { type: 'array' });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  if (!sheet) return { trades: [], error: 'That workbook has no sheet.' };
  const rows = utils.sheet_to_json(sheet, { header: 1, raw: false, defval: '' });
  return resultFromTrades(parseReportRows(rows));
}

function shiftWhen(when, offsetMinutes) {
  if (!when?.date || !offsetMinutes) return { date: when?.date || '', time: when?.time || '' };
  const [year, month, day] = when.date.split('-').map(Number);
  const parts = String(when.time || '00:00:00').split(':').map((part) => Number(part) || 0);
  const utc = Date.UTC(year, (month || 1) - 1, day || 1, parts[0], parts[1], parts[2]);
  if (Number.isNaN(utc)) return { date: when.date, time: when.time || '' };
  const next = new Date(utc + offsetMinutes * 60000);
  const pad = (n) => String(n).padStart(2, '0');
  const seconds = String(when.time || '').split(':').length > 2;
  return {
    date: `${next.getUTCFullYear()}-${pad(next.getUTCMonth() + 1)}-${pad(next.getUTCDate())}`,
    time: `${pad(next.getUTCHours())}:${pad(next.getUTCMinutes())}${seconds ? `:${pad(next.getUTCSeconds())}` : ''}`,
  };
}

/** Broker report clocks are UTC. Store them in the display timezone. */
export function localizeTrades(trades, offsetMinutes, zoneName = 'your timezone') {
  return trades.map((trade) => {
    const entry = shiftWhen({ date: trade.entryDate, time: trade.entryTime }, offsetMinutes);
    const exit = shiftWhen({ date: trade.exitDate, time: trade.exitTime }, offsetMinutes);
    return {
      ...trade,
      entryDate: entry.date,
      entryTime: entry.time,
      exitDate: exit.date,
      exitTime: exit.time,
      closes: (trade.closes || []).map((close) => {
        const shifted = shiftWhen(close, offsetMinutes);
        return { ...close, date: shifted.date, time: shifted.time };
      }),
      createdAt: Date.parse(`${entry.date}T${(entry.time || '00:00:00').padEnd(8, ':00')}Z`) || trade.createdAt,
      tradeNotes: `Imported from a MetaTrader history report. Times are shown in ${zoneName}. Each close is listed with its volume and profit. Add the timeframe, the stop amount in dollars, and the rest of the journal.`,
    };
  });
}

export async function readReportText(file) {
  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  if (bytes[0] === 0xFF && bytes[1] === 0xFE) return new TextDecoder('utf-16le').decode(buffer);
  if (bytes[0] === 0xFE && bytes[1] === 0xFF) return new TextDecoder('utf-16be').decode(buffer);
  return new TextDecoder('utf-8').decode(buffer);
}
