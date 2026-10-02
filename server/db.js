import fs from 'node:fs';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { DEFAULT_SETTINGS, normalizeSymbol } from '../src/lib/journal/constants.js';

const root = path.resolve(import.meta.dirname, '..');
export const dataDir = path.join(root, 'data');
export const uploadsDir = path.join(dataDir, 'uploads');
const dbPath = path.join(dataDir, 'journal.sqlite');

fs.mkdirSync(uploadsDir, { recursive: true });

const db = new DatabaseSync(dbPath);
db.exec(`
  PRAGMA journal_mode = WAL;
  PRAGMA foreign_keys = ON;
  CREATE TABLE IF NOT EXISTS meta (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS settings (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    data TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS trades (
    id TEXT PRIMARY KEY,
    entry_date TEXT,
    symbol TEXT,
    status TEXT,
    created_at INTEGER,
    updated_at INTEGER,
    data TEXT NOT NULL
  );
`);

const DERIVED = new Set([
  'tradeNumber', 'accountBalanceAfterTrade', 'marketSession', 'behavioralMistakeCount',
  'firstTimeSymbol', 'uniqueSymbolOrder', 'holdingDuration', 'realizedRR',
]);

export function normalizeSettings(input = {}) {
  const settings = { ...DEFAULT_SETTINGS, ...input };
  const balance = Number(settings.initialBalance);
  settings.initialBalance = balance > 0 ? balance : DEFAULT_SETTINGS.initialBalance;
  settings.maxDailyPct = Math.max(1, Number(settings.maxDailyPct) || DEFAULT_SETTINGS.maxDailyPct);
  settings.calendarYear = Number(settings.calendarYear) || DEFAULT_SETTINGS.calendarYear;
  settings.accountName = String(settings.accountName || DEFAULT_SETTINGS.accountName);
  settings.currency = 'USD';
  settings.timezone = String(settings.timezone || DEFAULT_SETTINGS.timezone);
  settings.customSignal1Label = String(settings.customSignal1Label ?? DEFAULT_SETTINGS.customSignal1Label);
  settings.customSignal2Label = String(settings.customSignal2Label ?? DEFAULT_SETTINGS.customSignal2Label);
  for (const key of ['entryReasons', 'exitReasons', 'feelingsBefore', 'feelingsAfter', 'motivations', 'mistakes']) {
    settings[key] = stringList(input[key], DEFAULT_SETTINGS[key]);
  }
  return settings;
}

function stringList(value, fallback) {
  const source = Array.isArray(value) ? value : fallback;
  const seen = new Set();
  const list = [];
  for (const item of source) {
    const label = String(item ?? '').trim();
    if (!label || seen.has(label.toLowerCase())) continue;
    seen.add(label.toLowerCase());
    list.push(label);
  }
  return list.slice(0, 50);
}

export function sanitizeTrade(trade) {
  if (!trade || typeof trade !== 'object') {
    const error = new Error('Trade payload is missing');
    error.status = 400;
    throw error;
  }
  const clean = {};
  for (const [key, value] of Object.entries(trade)) {
    if (!DERIVED.has(key)) clean[key] = value;
  }
  if (!/^[a-zA-Z0-9_-]{1,80}$/.test(String(clean.id || ''))) {
    const error = new Error('Trade id is invalid');
    error.status = 400;
    throw error;
  }
  clean.symbol = normalizeSymbol(clean.symbol);
  clean.tags = Array.isArray(clean.tags) ? clean.tags.map(String).slice(0, 40) : [];
  clean.images = Array.isArray(clean.images)
    ? clean.images.filter((src) => typeof src === 'string' && src.startsWith('/uploads/'))
    : [];
  clean.createdAt = Number(clean.createdAt) || Date.now();
  clean.status = ['draft', 'incomplete', 'complete'].includes(clean.status) ? clean.status : 'complete';
  clean.externalId = String(clean.externalId || '').slice(0, 80);
  return clean;
}

function meta(key) {
  return db.prepare('SELECT value FROM meta WHERE key = ?').get(key)?.value ?? null;
}

function setMeta(key, value) {
  db.prepare('INSERT INTO meta (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value').run(key, value);
}

function readTrades() {
  return db.prepare('SELECT data FROM trades').all().map((row) => JSON.parse(row.data));
}

export function getState() {
  const row = db.prepare('SELECT data FROM settings WHERE id = 1').get();
  return {
    initialized: meta('initialized') === '1',
    settings: normalizeSettings(row ? JSON.parse(row.data) : {}),
    trades: readTrades(),
  };
}

function writeTrade(trade) {
  const clean = sanitizeTrade(trade);
  db.prepare(`
    INSERT INTO trades (id, entry_date, symbol, status, created_at, updated_at, data)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      entry_date = excluded.entry_date,
      symbol = excluded.symbol,
      status = excluded.status,
      created_at = excluded.created_at,
      updated_at = excluded.updated_at,
      data = excluded.data
  `).run(
    clean.id,
    clean.entryDate || '',
    clean.symbol,
    clean.status,
    clean.createdAt,
    Date.now(),
    JSON.stringify(clean),
  );
  return clean;
}

function transaction(work) {
  db.exec('BEGIN');
  try {
    const result = work();
    db.exec('COMMIT');
    return result;
  } catch (error) {
    db.exec('ROLLBACK');
    throw error;
  }
}

export function saveTrade(trade) {
  const previous = typeof trade?.id === 'string'
    ? db.prepare('SELECT data FROM trades WHERE id = ?').get(trade.id)
    : null;
  const clean = transaction(() => writeTrade(trade));
  const oldImages = previous ? (JSON.parse(previous.data).images || []) : [];
  for (const url of oldImages) {
    if (!clean.images.includes(url)) removeUploadIfUnused(url);
  }
  return clean;
}

export function deleteTrade(id) {
  if (!/^[a-zA-Z0-9_-]{1,80}$/.test(id)) {
    const error = new Error('Trade id is invalid');
    error.status = 400;
    throw error;
  }
  const existing = db.prepare('SELECT data FROM trades WHERE id = ?').get(id);
  const removed = db.prepare('DELETE FROM trades WHERE id = ?').run(id);
  if (!removed.changes) {
    const error = new Error('Trade not found');
    error.status = 404;
    throw error;
  }
  const images = existing ? JSON.parse(existing.data).images || [] : [];
  for (const url of images) removeUploadIfUnused(url);
  return { ok: true };
}

export function saveSettings(patch) {
  const current = getState().settings;
  const next = normalizeSettings({ ...current, ...patch });
  db.prepare('INSERT INTO settings (id, data) VALUES (1, ?) ON CONFLICT(id) DO UPDATE SET data = excluded.data').run(JSON.stringify(next));
  if (meta('initialized') !== '1') setMeta('initialized', '1');
  return next;
}

function tradeFingerprint(trade) {
  const symbol = normalizeSymbol(trade?.symbol);
  const time = String(trade?.entryTime || '').slice(0, 5);
  const direction = String(trade?.direction || '');
  if (!symbol || !trade?.entryDate || !time) return '';
  return `${symbol}|${trade.entryDate}|${time}|${direction}`;
}

export function clearTrades() {
  const existing = readTrades();
  db.prepare('DELETE FROM trades').run();
  for (const trade of existing) {
    for (const url of trade.images || []) removeUploadIfUnused(url);
  }
  clearUploads();
  return getState();
}

function replaceAll(trades, settings) {
  transaction(() => {
    db.prepare('DELETE FROM trades').run();
    for (const trade of trades) writeTrade(trade);
    const next = normalizeSettings(settings);
    db.prepare('INSERT INTO settings (id, data) VALUES (1, ?) ON CONFLICT(id) DO UPDATE SET data = excluded.data').run(JSON.stringify(next));
    setMeta('initialized', '1');
  });
}

export function importState({ trades = [], settings = {} } = {}) {
  replaceAll(trades, settings);
  return getState();
}

export function importTrades(trades = []) {
  if (!Array.isArray(trades)) {
    const error = new Error('Trade list is missing');
    error.status = 400;
    throw error;
  }
  const current = readTrades();
  const known = new Set(current.flatMap((trade) => [trade.id, trade.externalId, tradeFingerprint(trade)].filter(Boolean)));
  let added = 0;
  let skipped = 0;
  transaction(() => {
    for (const trade of trades.slice(0, 2000)) {
      const marker = trade?.externalId || trade?.id;
      const fingerprint = tradeFingerprint(trade);
      if ((marker && known.has(marker)) || known.has(fingerprint)) {
        skipped += 1;
        continue;
      }
      const saved = writeTrade(trade);
      known.add(saved.id);
      if (saved.externalId) known.add(saved.externalId);
      known.add(tradeFingerprint(saved));
      added += 1;
    }
  });
  return { ...getState(), added, skipped };
}

export function resetState() {
  clearUploads();
  replaceAll([], DEFAULT_SETTINGS);
  return getState();
}

function filenameFromUrl(url) {
  if (typeof url !== 'string' || !url.startsWith('/uploads/')) return null;
  const name = path.basename(url);
  if (name !== url.slice('/uploads/'.length) || !/^[\w.-]+$/.test(name)) return null;
  const full = path.resolve(uploadsDir, name);
  if (!full.startsWith(path.resolve(uploadsDir) + path.sep)) return null;
  return { name, full };
}

export function removeUploadIfUnused(url) {
  const file = filenameFromUrl(url);
  if (!file) return false;
  const used = readTrades().some((trade) => (trade.images || []).includes(url));
  if (used) return false;
  fs.rmSync(file.full, { force: true });
  return true;
}

function clearUploads() {
  for (const name of fs.readdirSync(uploadsDir)) {
    if (name.startsWith('.')) continue;
    fs.rmSync(path.join(uploadsDir, name), { force: true });
  }
}

export function uploadFilePath(filename) {
  return filenameFromUrl(`/uploads/${filename}`)?.full ?? null;
}
