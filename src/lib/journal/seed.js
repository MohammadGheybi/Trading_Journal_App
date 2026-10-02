import { emptyTrade, DEFAULT_SETTINGS, ENTRY_REASONS, SL_METHODS, TP_METHODS, CHANGE_OUTCOMES, MISTAKES } from './constants.js';

// Deterministic PRNG so the demo looks identical after every reset.
function rng(seed) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const SYMBOLS = ['EURUSD', 'EURUSD', 'EURUSD', 'XAUUSD', 'XAUUSD', 'XAUUSD', 'GBPUSD', 'GBPUSD', 'USDJPY', 'NAS100', 'NAS100', 'GBPJPY', 'BTCUSD'];
const HOURS = [1, 2, 4, 6, 8, 10, 11, 13, 13, 14, 14, 16, 16, 17, 18, 20, 21, 23];
const TFS = ['5M', '15M', '15M', '30M', '1H', '1H', '1H', '4H', '4H', 'Daily', '1M'];
const DUR = { '1M': [5, 30], '5M': [15, 90], '15M': [30, 240], '30M': [60, 360], '1H': [90, 600], '4H': [300, 2880], Daily: [1440, 7200] };
const TAGS = ['A+ setup', 'trend', 'reversal', 'news', 'scalp', 'swing', 'breakout', 'range', 'CPI', 'FOMC'];
const WIN_NOTES = ['Clean retest of the level with volume confirmation. Let it run to target.', 'Waited for the candle close before entering — patience paid off.', 'Followed the plan precisely; partials at 1R, runner to target.'];
const LOSS_NOTES = ['Entered before confirmation. Stop was well placed but the setup was premature.', 'News spike took out the stop. Should have been flat before the release.', 'Chased the move after missing the first entry.'];
const LESSONS = ['Wait for the close.', 'Respect the daily bias.', 'Size down around high-impact news.', 'One loss is not a reason to re-enter.', 'Journal right after the exit while it is fresh.'];

export function createSeedTrades() {
  const r = rng(20260923);
  const pick = (a) => a[Math.floor(r() * a.length)];
  const between = (a, b) => a + r() * (b - a);
  const p = (x) => r() < x;
  const round = (v) => Math.round(v * 100) / 100;
  const trades = [];
  const day = new Date(Date.UTC(2026, 3, 6));
  const end = Date.UTC(2026, 8, 22);

  while (day.getTime() <= end) {
    const wd = day.getUTCDay();
    if (wd !== 0 && wd !== 6 && p(0.4)) {
      const count = p(0.2) ? 2 : 1;
      for (let k = 0; k < count; k++) {
        const t = emptyTrade(DEFAULT_SETTINGS);
        const hour = pick(HOURS);
        const entry = new Date(day.getTime() + hour * 3600e3 + pick([0, 15, 30, 45]) * 60e3);
        const tf = pick(TFS);
        const exit = new Date(entry.getTime() + between(...DUR[tf]) * 60e3);
        const roll = r();
        const outcome = roll < 0.53 ? 'Win' : roll < 0.89 ? 'Loss' : 'Breakeven';
        const win = outcome === 'Win', loss = outcome === 'Loss';
        const stop = -Math.round(between(40, 220));
        const vol = round(between(0.1, 1.5));
        Object.assign(t, {
          id: `seed_${trades.length + 1}`,
          createdAt: entry.getTime(),
          entryDate: entry.toISOString().slice(0, 10), entryTime: entry.toISOString().slice(11, 16),
          exitDate: exit.toISOString().slice(0, 10), exitTime: exit.toISOString().slice(11, 16),
          symbol: pick(SYMBOLS), direction: p(0.55) ? 'Buy' : 'Sell', timeframe: tf,
          volumeLots: vol, commissionUsd: round(vol * 7), swapUsd: ['4H', 'Daily'].includes(tf) ? round(between(-9, 3)) : 0,
          stopAmountUsd: stop,
          netPnlUsd: win ? round(-stop * between(0.8, 3)) : loss ? round(stop * between(0.4, 1)) : 0,
          result: outcome,
          entryReason: pick(ENTRY_REASONS.slice(0, 7)),
          exitReason: win ? (p(0.65) ? 'Reached take profit' : pick(['Manual decision', 'Exit signal'])) : loss ? (p(0.7) ? 'Hit stop loss' : pick(['Fear of reversal', 'Manual decision'])) : 'Closed breakeven',
          tradeNotes: win ? pick(WIN_NOTES) : loss ? pick(LOSS_NOTES) : 'Moved to breakeven after 1R; price reversed and closed flat.',
          calmBefore: p(win ? 0.65 : 0.25), confidentBefore: p(win ? 0.6 : 0.3), anxiousBefore: p(loss ? 0.45 : 0.1),
          fearfulBefore: p(loss ? 0.3 : 0.05), greedyBefore: p(loss ? 0.3 : 0.1), excitedBefore: p(0.2),
          hopelessBefore: p(loss ? 0.06 : 0), angerBefore: p(loss ? 0.12 : 0.02), irritatedBefore: p(loss ? 0.25 : 0.05), tiredBefore: p(loss ? 0.25 : 0.08),
          energyReadiness: Math.round(win ? between(6, 9.4) : between(3, 8.4)),
          setupConfidence: Math.round(win ? between(6, 10.4) : between(3, 8.4)),
          motivationAccordingToStrategy: p(win ? 0.85 : 0.5), motivationNews: p(0.2),
          motivationCustomSignal1: p(0.4), motivationCustomSignal2: p(0.45),
          feelingsBeforeTrade: win ? 'Focused and clear on the plan.' : 'A little rushed, wanted to catch the move.',
          feelingsDuringTrade: win ? 'Comfortable holding.' : 'Watching every tick.',
          satisfiedAfter: win && p(0.8), happyAfter: win && p(0.6), euphoricAfter: win && p(0.15), calmAfter: p(win ? 0.4 : 0.25),
          regretfulAfter: loss && p(0.5), upsetAfter: loss && p(0.45), angryAfter: loss && p(0.15), disappointedAfter: loss && p(0.5),
          anxiousAfter: loss && p(0.2), indifferentAfter: outcome === 'Breakeven' || p(0.05),
          executionQuality: Math.round(win ? between(6, 10.4) : between(3, 8.4)),
          lessonsLearned: pick(LESSONS),
          feelingsAfterTrade: win ? 'Proud of the discipline.' : 'Frustrated, but the review helps.',
          tags: [...new Set([pick(TAGS), ...(p(0.5) ? [pick(TAGS)] : [])])],
        });
        MISTAKES.forEach((m) => { t[m.key] = p(loss ? 0.2 : 0.04); });
        if (p(0.3)) Object.assign(t, { stopLossChanged: true, stopLossChangeMethod: pick(SL_METHODS), stopLossChangeOutcome: pick(CHANGE_OUTCOMES) });
        if (p(0.2)) Object.assign(t, { takeProfitChanged: true, takeProfitChangeMethod: pick(TP_METHODS), takeProfitChangeOutcome: pick(CHANGE_OUTCOMES) });
        trades.push(t);
      }
    }
    day.setUTCDate(day.getUTCDate() + 1);
  }

  // An in-progress draft so incomplete states are visible.
  const open = emptyTrade(DEFAULT_SETTINGS);
  Object.assign(open, {
    id: 'seed_open', status: 'draft', createdAt: Date.UTC(2026, 8, 23, 8),
    entryDate: '2026-09-23', entryTime: '08:15', symbol: 'XAUUSD', direction: 'Buy', timeframe: '1H',
    volumeLots: 0.4, commissionUsd: 2.8, stopAmountUsd: -120, entryReason: 'Pullback/Correction',
    tradeNotes: 'Still open — bought the pullback into the Asian range high.', calmBefore: true, setupConfidence: 7, energyReadiness: 7,
    tags: ['trend'],
  });
  trades.push(open);
  return trades;
}