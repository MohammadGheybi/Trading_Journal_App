import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Wallet, PlugZap, Settings2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useJournal } from '@/lib/journal/JournalContext';
import { fmtUsd, fmtPct } from '@/lib/journal/format';
import { isNum } from '@/lib/journal/calculations';
import PageHeader from '@/components/kit/PageHeader';
import PageSkeleton from '@/components/kit/PageSkeleton';
import PnlValue from '@/components/kit/PnlValue';
import ConnectAccountDialog from '@/components/accounts/ConnectAccountDialog';
import HistoryImport from '@/components/accounts/HistoryImport';

export default function Accounts() {
  const { ready, trades, settings, currentBalance } = useJournal();
  const [open, setOpen] = useState(false);
  if (!ready) return <PageSkeleton />;
  const change = currentBalance - settings.initialBalance;
  const closed = trades.filter((t) => isNum(t.netPnlUsd)).length;

  return (
    <div>
      <PageHeader eyebrow="Accounts" title="Your accounts" subtitle="Import a MetaTrader history report to create incomplete trades. A live broker login is not connected."
        actions={<Button variant="outline" onClick={() => setOpen(true)} className="rounded-xl border-border bg-surface"><PlugZap className="h-4 w-4" /> Connect trading account</Button>} />
      <div className="max-w-2xl overflow-hidden rounded-2xl border border-border bg-surface">
        <div className="relative bg-gradient-to-br from-crimson/40 via-surface to-surface p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-crimson"><Wallet className="h-5 w-5 text-pearl" /></div>
              <div><div className="font-heading text-xl text-pearl">{settings.accountName}</div><div className="text-xs text-muted-foreground">Manual entry · {settings.currency}</div></div>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-sand px-2.5 py-0.5 text-xs font-semibold text-obsidian"><Check className="h-3 w-3" /> Active</span>
          </div>
          <div className="num mt-8 text-4xl text-pearl">{fmtUsd(currentBalance)}</div>
          <div className="mt-1 flex items-center gap-2 text-sm"><PnlValue value={change} /><span className="text-muted-foreground">({fmtPct((change / settings.initialBalance) * 100, { sign: true, decimals: 2 })}) since start</span></div>
        </div>
        <dl className="grid grid-cols-3 divide-x divide-border border-t border-border">
          {[['Initial balance', fmtUsd(settings.initialBalance)], ['Currency', settings.currency], ['Closed trades', closed]].map(([l, v]) => (
            <div key={l} className="p-4"><dt className="text-xs text-muted-foreground">{l}</dt><dd className="num mt-1 text-pearl">{v}</dd></div>
          ))}
        </dl>
        <div className="border-t border-border p-4">
          <Button asChild variant="ghost" className="rounded-xl text-sand hover:text-pearl"><Link to="/settings"><Settings2 className="h-4 w-4" /> Edit balance & currency</Link></Button>
        </div>
      </div>
      <HistoryImport />
      <ConnectAccountDialog open={open} onOpenChange={setOpen} />
    </div>
  );
}