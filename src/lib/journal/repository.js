// Local API client. The SQLite database and screenshot files live on this computer.
import { DEFAULT_SETTINGS } from './constants';

const KEY = 'crimson-ledger:v1';

async function request(url, options) {
  let response;
  try {
    response = await fetch(url, options);
  } catch {
    throw new Error('The local journal server is not running.');
  }
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || 'The local journal server could not save that change.');
  return data;
}

export const repository = {
  backend: true,
  persistent: true,
  async load() {
    let data = await request('/api/state');
    if (!data.initialized) {
      data = await request('/api/reset', { method: 'POST' });
      try { localStorage.removeItem(KEY); } catch { /* browser storage is optional */ }
    }
    return { trades: data.trades || [], settings: { ...DEFAULT_SETTINGS, ...data.settings } };
  },
  saveTrade(trade) {
    return request(`/api/trades/${encodeURIComponent(trade.id)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(trade),
    });
  },
  deleteTrade(id) {
    return request(`/api/trades/${encodeURIComponent(id)}`, { method: 'DELETE' });
  },
  saveSettings(patch) {
    return request('/api/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
    });
  },
  importTrades(trades) {
    return request('/api/trades/import', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ trades }),
    }).then((data) => ({
      trades: data.trades || [],
      settings: { ...DEFAULT_SETTINGS, ...data.settings },
      added: data.added || 0,
      skipped: data.skipped || 0,
    }));
  },
  reset() {
    return request('/api/reset', { method: 'POST' }).then((data) => ({
      trades: data.trades || [],
      settings: { ...DEFAULT_SETTINGS, ...data.settings },
    }));
  },
  async uploadImages(files) {
    const body = new FormData();
    for (const file of files) body.append('files', file);
    const data = await request('/api/uploads', { method: 'POST', body });
    return data.images || [];
  },
  deleteImage(url) {
    const name = String(url || '').split('/').pop();
    if (!name) return Promise.resolve();
    return request(`/api/uploads/${encodeURIComponent(name)}`, { method: 'DELETE' });
  },
  newId: () => `t_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`,
};
