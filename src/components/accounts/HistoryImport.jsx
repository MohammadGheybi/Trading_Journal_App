import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { useJournal } from '@/lib/journal/JournalContext';
import { localizeTrades, parseMetaTraderReport, parseMetaTraderWorkbook, readReportText } from '@/lib/journal/mtReport';
import { timezoneOffsetMinutes, zoneLabel } from '@/lib/journal/marketHours';

export default function HistoryImport() {
  const input = useRef(null);
  const navigate = useNavigate();
  const { importTrades, settings } = useJournal();
  const [busy, setBusy] = useState(false);

  const onFile = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    setBusy(true);
    try {
      const excel = /\.xlsx?$/i.test(file.name);
      const parsed = excel ? parseMetaTraderWorkbook(await file.arrayBuffer()) : parseMetaTraderReport(await readReportText(file));
      if (!parsed.trades.length) {
        toast({ title: 'Nothing to import', description: parsed.error, variant: 'destructive' });
        return;
      }
      const zone = zoneLabel(settings.timezone);
      const trades = localizeTrades(parsed.trades, timezoneOffsetMinutes(settings.timezone), zone);
      const result = await importTrades(trades);
      toast({
        title: result.added ? `${result.added} incomplete trade${result.added === 1 ? '' : 's'} added` : 'No new trades',
        description: result.skipped
          ? `${result.skipped} matched a trade already in the journal (same symbol, date, and time) and were left out.`
          : `Times are in ${zone}. Fill the empty journal fields on each one.`,
      });
      if (result.added) navigate('/journal');
    } catch (error) {
      toast({ title: 'Import failed', description: error.message || 'The report could not be read.', variant: 'destructive' });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mt-5 max-w-2xl rounded-2xl border border-border bg-surface p-5">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sand/15 text-sand"><FileUp className="h-5 w-5" /></div>
        <div>
          <h2 className="font-heading text-2xl text-pearl">Import MetaTrader history</h2>
          <p className="mt-1 text-sm text-muted-foreground">In MetaTrader, open the account history, right-click it, and save the report as Excel. Each position becomes one incomplete trade. Clocks are shifted into your display timezone, a trailing .X is removed from the symbol, and a position you already logged — even by hand — is skipped when the symbol, date, and time match.</p>
          <input ref={input} type="file" accept=".xlsx,.xls,.htm,.html,.csv,.txt" className="hidden" onChange={onFile} />
          <Button type="button" disabled={busy} onClick={() => input.current?.click()} className="mt-4 rounded-xl bg-crimson text-pearl hover:bg-crimson-hover">
            <FileUp className="h-4 w-4" /> {busy ? 'Reading report…' : 'Choose report'}
          </Button>
        </div>
      </div>
    </div>
  );
}
