import { isNum, tradeCashChange } from './calculations';

const sum = (arr) => arr.reduce((a, b) => a + b, 0);
const mean = (arr) => (arr.length ? sum(arr) / arr.length : null);

/** KPI block matching workbook logic. totalTrades counts trades with a P&L value (including 0). */
export function computeStats(trades, { initialBalance, currentBalance }) {
  const pnl = trades.filter((t) => isNum(t.netPnlUsd));
  const nets = pnl.map((t) => Number(t.netPnlUsd));
  const wins = pnl.filter((t) => t.result === 'Win').length;
  const losses = pnl.filter((t) => t.result === 'Loss').length;
  const breakeven = pnl.filter((t) => t.result === 'Breakeven').length;
  const commissions = sum(trades.map((t) => Number(t.commissionUsd) || 0));
  const swaps = sum(trades.map((t) => Number(t.swapUsd) || 0));
  const netProfit = sum(nets);
  const change = sum(trades.map(tradeCashChange));
  return {
    totalTrades: pnl.length,
    wins, losses, breakeven,
    winRate: pnl.length ? (wins / pnl.length) * 100 : null,
    bestTrade: nets.length ? Math.max(...nets) : null,
    worstTrade: nets.length ? Math.min(...nets) : null,
    netProfit,
    grossProfit: sum(nets.filter((v) => v > 0)),
    grossLoss: sum(nets.filter((v) => v < 0)),
    commissions, swaps,
    currentBalance,
    totalReturnPct: initialBalance ? (change / initialBalance) * 100 : null,
    avgHolding: mean(trades.map((t) => t.holdingDuration).filter((v) => v !== null)),
    avgRR: mean(trades.map((t) => t.realizedRR).filter((v) => v !== null)),
  };
}

/** Generic breakdown. keyFn may return one key or an array (multi-select flags). */
export function groupStats(trades, keyFn, order) {
  const map = new Map();
  trades.filter((t) => isNum(t.netPnlUsd)).forEach((t) => {
    [].concat(keyFn(t)).filter((k) => k !== '' && k !== null && k !== undefined && k !== false).forEach((k) => {
      const row = map.get(k) || { key: k, count: 0, net: 0, wins: 0 };
      row.count += 1;
      row.net += Number(t.netPnlUsd);
      if (t.result === 'Win') row.wins += 1;
      map.set(k, row);
    });
  });
  let rows = [...map.values()].map((r) => ({ ...r, winRate: (r.wins / r.count) * 100, avg: r.net / r.count }));
  if (order) rows = order.map((k) => rows.find((r) => r.key === k)).filter(Boolean);
  else rows.sort((a, b) => b.count - a.count || b.net - a.net);
  return rows;
}

/** Daily aggregation keyed by entry date. pct uses the balance at the start of that day. */
export function dailyMap(trades) {
  const map = new Map();
  trades.filter((t) => t.entryDate && isNum(t.netPnlUsd)).forEach((t) => {
    const d = map.get(t.entryDate) || { date: t.entryDate, net: 0, count: 0, wins: 0, startBalance: null, trades: [] };
    if (d.startBalance === null) d.startBalance = t.accountBalanceAfterTrade - tradeCashChange(t);
    d.net += Number(t.netPnlUsd);
    d.count += 1;
    if (t.result === 'Win') d.wins += 1;
    d.trades.push(t);
    map.set(t.entryDate, d);
  });
  map.forEach((d) => { d.pct = d.startBalance ? (d.net / d.startBalance) * 100 : null; });
  return map;
}

export function equitySeries(trades, initialBalance) {
  const closed = trades.filter((t) => isNum(t.netPnlUsd) && t.accountBalanceAfterTrade !== null);
  const startBal = closed.length ? closed[0].accountBalanceAfterTrade - tradeCashChange(closed[0]) : initialBalance;
  return [
    { idx: 0, balance: startBal, label: 'Start' },
    ...closed.map((t, i) => ({ idx: i + 1, balance: t.accountBalanceAfterTrade, label: `#${t.tradeNumber} ${t.symbol}`, date: t.entryDate, net: Number(t.netPnlUsd) })),
  ];
}

export const rangeBucket = (v, buckets) => buckets.find((b) => v >= b.min && v <= b.max)?.label || '';