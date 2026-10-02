/**
 * Local API for Crimson Ledger.
 *
 * The database is one SQLite file at data/journal.sqlite. Screenshots live in
 * data/uploads. This process binds to localhost only, so it is a personal app
 * rather than a public server. `npm start` builds the UI and serves it from
 * here — a later desktop shortcut or installer can launch this same process
 * and open the printed address. No Docker and no separate database server.
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import express from 'express';
import multer from 'multer';
import { randomUUID } from 'node:crypto';
import {
  dataDir,
  deleteTrade,
  getState,
  importState,
  importTrades,
  removeUploadIfUnused,
  resetState,
  saveSettings,
  saveTrade,
  uploadsDir,
} from './db.js';

const port = Number(process.env.PORT) || 3001;
const host = '127.0.0.1';
const serveUi = process.argv.includes('--serve-ui');
const desktop = process.argv.includes('--desktop');
const distDir = path.resolve(import.meta.dirname, '../dist');
const clients = new Map();
let exitTimer = null;

function pruneClients() {
  const now = Date.now();
  for (const [id, seen] of clients) {
    if (now - seen > 5 * 60 * 1000) clients.delete(id);
  }
}

function armExit(delay) {
  if (!desktop || exitTimer) return;
  exitTimer = setTimeout(() => {
    exitTimer = null;
    pruneClients();
    if (clients.size === 0) process.exit(0);
  }, delay);
}

function openBrowser(url) {
  spawn('cmd.exe', ['/c', 'start', '', url], { detached: true, stdio: 'ignore', windowsHide: true }).unref();
}

const ALLOWED = new Map([
  ['image/jpeg', '.jpg'],
  ['image/png', '.png'],
  ['image/webp', '.webp'],
  ['image/gif', '.gif'],
]);

const upload = multer({
  storage: multer.diskStorage({
    destination: uploadsDir,
    filename: (req, file, cb) => cb(null, `${randomUUID()}${ALLOWED.get(file.mimetype) || '.img'}`),
  }),
  limits: { fileSize: 8 * 1024 * 1024, files: 8 },
  fileFilter: (req, file, cb) => {
    if (ALLOWED.has(file.mimetype)) cb(null, true);
    else cb(Object.assign(new Error('Only JPEG, PNG, WebP, and GIF screenshots can be saved'), { status: 400 }));
  },
});

const app = express();
app.disable('x-powered-by');
app.use(express.json({ limit: '5mb' }));

app.get('/api/health', (req, res) => {
  res.json({ ok: true, dataDir });
});

app.post('/api/presence', (req, res) => {
  const id = String(req.body?.id || '').slice(0, 80);
  if (id) clients.set(id, Date.now());
  if (exitTimer) {
    clearTimeout(exitTimer);
    exitTimer = null;
  }
  res.json({ ok: true });
});

app.post('/api/leave', (req, res) => {
  const id = String(req.query.id || '').slice(0, 80);
  if (id) clients.delete(id);
  res.json({ ok: true });
  if (clients.size === 0) armExit(4000);
});

app.get('/api/state', (req, res) => {
  res.json(getState());
});

app.post('/api/reset', (req, res) => {
  res.json(resetState());
});

app.post('/api/import', (req, res) => {
  res.json(importState(req.body || {}));
});

app.post('/api/trades/import', (req, res) => {
  res.json(importTrades(req.body?.trades || []));
});

app.put('/api/trades/:id', (req, res) => {
  res.json(saveTrade({ ...req.body, id: req.params.id }));
});

app.delete('/api/trades/:id', (req, res) => {
  res.json(deleteTrade(req.params.id));
});

app.patch('/api/settings', (req, res) => {
  res.json(saveSettings(req.body || {}));
});

app.post('/api/uploads', upload.array('files', 8), (req, res) => {
  const files = req.files || [];
  res.status(201).json({ images: files.map((file) => `/uploads/${file.filename}`) });
});

app.delete('/api/uploads/:filename', (req, res) => {
  const removed = removeUploadIfUnused(`/uploads/${req.params.filename}`);
  res.json({ removed });
});

app.use('/uploads', express.static(uploadsDir, { fallthrough: false, index: false }));

if (serveUi) {
  if (!fs.existsSync(path.join(distDir, 'index.html'))) {
    console.error('The UI has not been built. Run npm start, which builds it first.');
    process.exit(1);
  }
  app.use(express.static(distDir));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) return next();
    res.sendFile(path.join(distDir, 'index.html'));
  });
}

app.use((error, req, res, next) => {
  if (res.headersSent) return next(error);
  const status = error.status || error.statusCode || (error.code === 'LIMIT_FILE_SIZE' ? 400 : 500);
  if (status >= 500) console.error(error);
  const message = error.code === 'LIMIT_FILE_SIZE' ? 'A screenshot must be 8 MB or smaller' : (error.message || 'Server error');
  res.status(status).json({ error: message });
});

const server = app.listen(port, host, () => {
  const ui = serveUi ? `http://${host}:${port}` : `http://${host}:5173  (API http://${host}:${port})`;
  console.log(`Crimson Ledger is ready at ${ui}`);
  console.log(`Database: ${path.join(dataDir, 'journal.sqlite')}`);
  if (desktop) {
    if (!process.env.CRIMSON_NO_OPEN) openBrowser(`http://${host}:${port}/`);
    armExit(45000);
    setInterval(() => {
      pruneClients();
      if (clients.size === 0) armExit(1000);
    }, 60000);
  }
});

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${port} is already in use. Close the other journal window, then start it again.`);
    process.exit(1);
  }
  throw error;
});
