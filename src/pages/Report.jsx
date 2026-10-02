import React, { useMemo, useState } from 'react';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useJournal } from '@/lib/journal/JournalContext';
import { computeStats, equitySeries, groupStats } from '@/lib/journal/stats';
import { SESSIONS } from '@/lib/journal/constants';
import { fmtDate, fmtPct, fmtUsd, pnlTone } from '@/lib/journal/format';
import { zoneLabel } from '@/lib/journal/marketHours';
import EquityCurveChart from '@/components/charts/EquityCurveChart';
import PageSkeleton from '@/components/kit/PageSkeleton';
import { cn } from '@/lib/utils';

const inputCls = 'h-10 rounded-xl border-border bg-surface text-pearl';

function moneyClass(value) {
  return pnlTone(value);
}

function Bars({ rows }) {
  const peak = Math.max(...rows.map((row) => Math.abs(row.net)), 1);
  if (!rows.length) return <p className="text-sm text-muted-foreground">Nothing in this range.</p>;
  return (
    <ul className="space-y-2.5">
      {rows.map((row) => (
        <li key={row.key}>
          <div className="mb-1 flex items-baseline justify-between gap-3 text-xs">
            <span className="truncate text-pearl">{row.key}</span>
            <span className={cn('num shrink-0', moneyClass(row.net))}>{fmtUsd(row.net, { sign: true })}</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
            <div
              className={cn('h-full rounded-full', row.net > 0 ? 'bg-profit' : row.net < 0 ? 'bg-loss' : 'bg-sand')}
              style={{ width: `${Math.max(6, (Math.abs(row.net) / peak) * 100)}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

export default function Report() {
  const { ready, trades, settings } = useJournal();
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const zone = zoneLabel(settings.timezone);

  const rows = useMemo(() => trades.filter((trade) => {
    if (!trade.entryDate) return false;
    if (from && trade.entryDate < from) return false;
    if (to && trade.entryDate > to) return false;
    return true;
  }), [trades, from, to]);

  const stats = useMemo(() => computeStats(rows, {
    initialBalance: settings.initialBalance,
    currentBalance: rows.length ? rows[rows.length - 1].accountBalanceAfterTrade : settings.initialBalance,
  }), [rows, settings.initialBalance]);
  const equity = useMemo(() => equitySeries(rows, settings.initialBalance), [rows, settings.initialBalance]);
  const sessions = useMemo(() => groupStats(rows, (trade) => trade.marketSession, SESSIONS), [rows]);
  const symbols = useMemo(() => groupStats(rows, (trade) => trade.symbol).slice(0, 6), [rows]);
  const factor = stats.grossLoss ? stats.grossProfit / Math.abs(stats.grossLoss) : null;
  const winSlice = stats.totalTrades ? (stats.wins / stats.totalTrades) * 100 : 0;
  const lossSlice = stats.totalTrades ? (stats.losses / stats.totalTrades) * 100 : 0;
  const rangeText = from || to ? `${from ? fmtDate(from) : 'Start'} — ${to ? fmtDate(to) : 'Today'}` : 'All recorded trades';

  const download = () => {
    const previous = document.title;
    document.title = `Crimson Ledger ${rangeText}`;
    window.print();
    document.title = previous;
  };

  if (!ready) return <PageSkeleton />;

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 print:hidden sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sand">Report</p>
          <h1 className="mt-1 font-heading text-4xl text-pearl">One page of your results</h1>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">Choose the dates, then download a PDF. In the print dialog, pick Save as PDF. The page uses your display timezone, {zone}.</p>
        </div>
        <div className="flex flex-wrap items-end gap-3">
          <label className="text-xs text-muted-foreground">From
            <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className={`${inputCls} mt-1 block`} />
          </label>
          <label className="text-xs text-muted-foreground">To
            <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} className={`${inputCls} mt-1 block`} />
          </label>
          <Button type="button" onClick={download} className="h-10 rounded-xl bg-crimson text-pearl hover:bg-crimson-hover">
            <Download className="h-4 w-4" /> Download PDF
          </Button>
        </div>
      </div>

      <article className="print-sheet mx-auto overflow-hidden rounded-[28px] border border-white/10 bg-[#161616] text-[#F2F1ED] shadow-[0_30px_80px_rgba(0,0,0,0.45)] print:rounded-none print:border-0 print:shadow-none">
        <div className="h-1.5 bg-gradient-to-r from-[#710014] via-[#B38F6F] to-transparent" />
        <div className="grid gap-5 p-6 print:gap-3 print:p-5 sm:p-8">
          <header className="flex items-end justify-between gap-6 border-b border-white/10 pb-5">
            <div>
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#710014] font-heading text-lg text-[#F2F1ED]">C</span>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#B38F6F]">Crimson Ledger</p>
                  <h2 className="font-heading text-3xl leading-none text-[#F2F1ED]">Performance</h2>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="font-heading text-xl text-[#F2F1ED]">{rangeText}</p>
              <p className="num mt-1 text-xs text-[#A9A59C]">{settings.accountName} · {zone}</p>
            </div>
          </header>

          <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {[
              ['Net result', fmtUsd(stats.netProfit, { sign: true }), moneyClass(stats.netProfit)],
              ['Win rate', fmtPct(stats.winRate), 'text-[#F2F1ED]'],
              ['Trades', String(stats.totalTrades), 'text-[#F2F1ED]'],
              ['Profit factor', factor == null ? '—' : factor.toFixed(2), 'text-[#B38F6F]'],
            ].map(([label, value, tone]) => (
              <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
                <p className="text-[11px] uppercase tracking-[0.16em] text-[#A9A59C]">{label}</p>
                <p className={cn('num mt-1 text-2xl', tone)}>{value}</p>
              </div>
            ))}
          </section>

          {stats.totalTrades === 0 ? (
            <p className="rounded-2xl border border-dashed border-white/15 px-5 py-16 text-center text-sm text-[#A9A59C]">No closed trades in this range.</p>
          ) : (
            <div className="grid gap-4 lg:grid-cols-12">
              <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 lg:col-span-8">
                <div className="mb-2 flex items-baseline justify-between">
                  <h3 className="font-heading text-xl text-[#F2F1ED]">Equity</h3>
                  <p className="num text-xs text-[#A9A59C]">Start {fmtUsd(equity[0]?.balance)} · End {fmtUsd(equity[equity.length - 1]?.balance)}</p>
                </div>
                <div className="h-44 w-full print:h-32">
                  <EquityCurveChart data={equity} baseline={settings.initialBalance} height="100%" animate={false} />
                </div>
              </section>
              <section className="flex flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-4 lg:col-span-4">
                <div className="flex items-center gap-4">
                  <div className="relative h-[76px] w-[76px] shrink-0" aria-hidden>
                    <div
                      className="h-full w-full rounded-full"
                      style={{ background: `conic-gradient(#6FA583 0 ${winSlice}%, #E06A6A ${winSlice}% ${winSlice + lossSlice}%, #B38F6F ${winSlice + lossSlice}% 100%)` }}
                    />
                    <div className="absolute inset-[18px] rounded-full bg-[#1c1c1c]" />
                  </div>
                  <div className="text-sm">
                    <p className="text-[#6FA583]">{stats.wins} wins</p>
                    <p className="text-[#E06A6A]">{stats.losses} losses</p>
                    <p className="text-[#B38F6F]">{stats.breakeven} even</p>
                  </div>
                </div>
                <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div><dt className="text-[11px] uppercase tracking-wide text-[#A9A59C]">Best</dt><dd className={cn('num', moneyClass(stats.bestTrade))}>{fmtUsd(stats.bestTrade, { sign: true })}</dd></div>
                  <div><dt className="text-[11px] uppercase tracking-wide text-[#A9A59C]">Worst</dt><dd className={cn('num', moneyClass(stats.worstTrade))}>{fmtUsd(stats.worstTrade, { sign: true })}</dd></div>
                  <div><dt className="text-[11px] uppercase tracking-wide text-[#A9A59C]">Return</dt><dd className={cn('num', moneyClass(stats.totalReturnPct))}>{fmtPct(stats.totalReturnPct, { sign: true, decimals: 2 })}</dd></div>
                  <div><dt className="text-[11px] uppercase tracking-wide text-[#A9A59C]">Balance</dt><dd className="num text-[#F2F1ED]">{fmtUsd(stats.currentBalance)}</dd></div>
                </dl>
              </section>
              <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 lg:col-span-6">
                <h3 className="mb-3 font-heading text-xl text-[#F2F1ED]">Sessions</h3>
                <Bars rows={sessions} />
              </section>
              <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 lg:col-span-6">
                <h3 className="mb-3 font-heading text-xl text-[#F2F1ED]">Symbols</h3>
                <Bars rows={symbols} />
              </section>
            </div>
          )}

          <footer className="flex items-center justify-between border-t border-white/10 pt-4 text-[11px] text-[#A9A59C]">
            <span>Personal trading journal · not a broker statement</span>
            <span className="num">{zone}</span>
          </footer>
        </div>
      </article>
    </div>
  );
}
