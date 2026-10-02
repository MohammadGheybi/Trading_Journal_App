import React from 'react';
import { Check, PlugZap } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const PROVIDERS = ['MetaTrader 5', 'MetaTrader 4', 'cTrader', 'MatchTrader', 'Binance', 'Bybit', 'Other brokers'];

export default function ConnectAccountDialog({ open, onOpenChange }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl rounded-2xl border-border bg-surface">
        <DialogHeader>
          <DialogTitle className="font-heading text-2xl font-normal">Connect a trading account</DialogTitle>
          <DialogDescription>A live login to MetaTrader is not available from this app. Save a history report from the terminal and import it on the Accounts page. The broker fields are filled in, and each trade stays incomplete until you finish it.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-2 sm:grid-cols-2">
          <div className="flex items-center justify-between rounded-xl border border-sand/50 bg-sand/10 p-4">
            <div><div className="font-semibold text-pearl">Manual account</div><div className="text-xs text-muted-foreground">Enter trades yourself</div></div>
            <span className="inline-flex items-center gap-1 rounded-full bg-sand px-2 py-0.5 text-xs font-semibold text-obsidian"><Check className="h-3 w-3" /> Active</span>
          </div>
          {PROVIDERS.map((p) => (
            <button key={p} type="button" disabled aria-disabled="true" className="flex cursor-not-allowed items-center justify-between rounded-xl border border-border bg-surface-2 p-4 text-left opacity-70">
              <div className="flex items-center gap-2 font-medium text-pearl/80"><PlugZap className="h-4 w-4 text-muted-foreground" />{p}</div>
              <span className="rounded-full border border-border px-2 py-0.5 text-[11px] text-muted-foreground">Coming later</span>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}