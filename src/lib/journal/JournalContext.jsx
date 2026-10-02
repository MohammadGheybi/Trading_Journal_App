import React, { createContext, useContext, useEffect, useMemo, useState, useCallback, useRef } from 'react';
import { repository } from './repository';
import { DEFAULT_SETTINGS } from './constants';
import { deriveTrades } from './calculations';
import { filterTrades, presetRange } from './filters';

const JournalCtx = createContext(null);

function LocalServerError({ message, onRetry }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-obsidian px-6 text-center text-pearl">
      <div className="max-w-md">
        <h1 className="font-heading text-3xl">Local journal is offline</h1>
        <p className="mt-3 text-sm text-muted-foreground">{message}</p>
        <p className="mt-2 text-sm text-muted-foreground">In the journal folder, run <span className="text-pearl">npm run dev</span> and open the address it prints.</p>
        <button type="button" onClick={onRetry} className="mt-6 rounded-xl bg-crimson px-4 py-2 text-sm">Try again</button>
      </div>
    </div>
  );
}

export function JournalProvider({ children }) {
  const [state, setState] = useState({ trades: [], settings: { ...DEFAULT_SETTINGS } });
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(null);
  const [syncError, setSyncError] = useState(null);
  const [attempt, setAttempt] = useState(0);
  const [range, setRangeState] = useState({ preset: 'all', from: '', to: '' });
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    let cancelled = false;
    setReady(false);
    repository.load()
      .then((data) => {
        if (cancelled) return;
        setState(data);
        setError(null);
        setReady(true);
      })
      .catch((loadError) => {
        if (cancelled) return;
        setError(loadError.message || 'The local journal server is not running.');
        setReady(true);
      });
    return () => { cancelled = true; };
  }, [attempt]);

  const derived = useMemo(() => deriveTrades(state.trades, state.settings), [state.trades, state.settings]);
  const rangeTrades = useMemo(() => filterTrades(derived, range), [derived, range]);
  const currentBalance = useMemo(() => {
    const dated = derived.filter((t) => t.accountBalanceAfterTrade !== null);
    return dated.length ? dated[dated.length - 1].accountBalanceAfterTrade : Number(state.settings.initialBalance);
  }, [derived, state.settings.initialBalance]);

  const setRange = useCallback((preset, custom) => {
    setRangeState(preset === 'custom' ? { preset, ...custom } : { preset, ...presetRange(preset) });
  }, []);

  const remember = useCallback((promise) => {
    promise.then(() => setSyncError(null)).catch((saveError) => setSyncError(saveError.message || 'Could not save to the local database.'));
    return promise;
  }, []);

  const saveTrade = useCallback((trade) => {
    const id = trade.id || repository.newId();
    const clean = { ...trade, id, createdAt: trade.createdAt || Date.now() };
    setState((s) => {
      const exists = s.trades.some((t) => t.id === id);
      return { ...s, trades: exists ? s.trades.map((t) => (t.id === id ? clean : t)) : [...s.trades, clean] };
    });
    remember(repository.saveTrade(clean));
    return id;
  }, [remember]);

  const deleteTrade = useCallback((id) => {
    setState((s) => ({ ...s, trades: s.trades.filter((t) => t.id !== id) }));
    remember(repository.deleteTrade(id));
  }, [remember]);

  const duplicateTrade = useCallback((id) => {
    const src = stateRef.current.trades.find((t) => t.id === id);
    if (!src) return null;
    const copy = { ...src, id: repository.newId(), createdAt: Date.now(), status: 'draft' };
    setState((s) => ({ ...s, trades: [...s.trades, copy] }));
    remember(repository.saveTrade(copy));
    return copy.id;
  }, [remember]);

  const updateSettings = useCallback((patch) => {
    setState((s) => ({ ...s, settings: { ...s.settings, ...patch } }));
    remember(repository.saveSettings(patch));
  }, [remember]);

  const importTrades = useCallback((trades) => remember(repository.importTrades(trades).then((next) => {
    setState({ trades: next.trades, settings: next.settings });
    return { added: next.added, skipped: next.skipped };
  })), [remember]);

  const clearJournal = useCallback(() => {
    remember(repository.reset().then((next) => setState(next)));
  }, [remember]);

  const value = {
    ready, loadError: error, syncError, settings: state.settings, trades: derived, rawTrades: state.trades, rangeTrades, currentBalance, range, setRange,
    saveTrade, deleteTrade, duplicateTrade, updateSettings, clearJournal, importTrades,
    getTrade: (id) => derived.find((t) => t.id === id),
    rawTrade: (id) => state.trades.find((t) => t.id === id),
  };

  if (error) return <LocalServerError message={error} onRetry={() => setAttempt((n) => n + 1)} />;

  return <JournalCtx.Provider value={value}>{children}</JournalCtx.Provider>;
}

export const useJournal = () => useContext(JournalCtx);