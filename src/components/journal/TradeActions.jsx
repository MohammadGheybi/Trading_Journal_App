import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MoreHorizontal, Eye, Pencil, Copy, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from '@/components/ui/use-toast';
import { useJournal } from '@/lib/journal/JournalContext';
import ConfirmDialog from '@/components/kit/ConfirmDialog';

export default function TradeActions({ trade, variant = 'menu', onDeleted }) {
  const navigate = useNavigate();
  const { duplicateTrade, deleteTrade } = useJournal();
  const [confirm, setConfirm] = useState(false);
  const label = `${trade.symbol || 'Untitled'}${trade.tradeNumber ? ` #${trade.tradeNumber}` : ''}`;

  const duplicate = () => {
    const id = duplicateTrade(trade.id);
    toast({ title: 'Trade duplicated', description: 'Saved as a draft — edit it to finish.' });
    navigate(`/journal/${id}/edit`);
  };
  const remove = () => {
    deleteTrade(trade.id);
    toast({ title: 'Trade deleted', description: `${label} was removed from your journal.` });
    onDeleted?.();
  };

  const dialog = (
    <ConfirmDialog open={confirm} onOpenChange={setConfirm} title="Delete this trade?"
      description={`${label} and all of its notes, emotions and review data will be permanently removed from this browser.`}
      confirmLabel="Delete trade" onConfirm={remove} />
  );

  if (variant === 'buttons') {
    return (
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" onClick={duplicate} className="rounded-xl border-border bg-surface"><Copy className="h-4 w-4" /> Duplicate</Button>
        <Button variant="outline" onClick={() => setConfirm(true)} className="rounded-xl border-loss/30 bg-surface text-loss hover:bg-loss/10 hover:text-loss"><Trash2 className="h-4 w-4" /> Delete</Button>
        <Button onClick={() => navigate(`/journal/${trade.id}/edit`)} className="rounded-xl bg-crimson text-pearl hover:bg-crimson-hover"><Pencil className="h-4 w-4" /> {trade.status === 'incomplete' ? 'Complete trade' : 'Edit trade'}</Button>
        {dialog}
      </div>
    );
  }

  return (
    <div onClick={(e) => { e.stopPropagation(); e.preventDefault(); }}>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" aria-label={`Actions for ${label}`} className="h-8 w-8 rounded-lg text-muted-foreground hover:text-pearl"><MoreHorizontal className="h-4 w-4" /></Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44 rounded-xl border-border bg-surface-2">
          <DropdownMenuItem onSelect={() => navigate(`/journal/${trade.id}`)}><Eye className="mr-2 h-4 w-4" /> View</DropdownMenuItem>
          <DropdownMenuItem onSelect={() => navigate(`/journal/${trade.id}/edit`)}><Pencil className="mr-2 h-4 w-4" /> {trade.status === 'incomplete' ? 'Complete' : 'Edit'}</DropdownMenuItem>
          <DropdownMenuItem onSelect={duplicate}><Copy className="mr-2 h-4 w-4" /> Duplicate</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => setConfirm(true)} className="text-loss focus:text-loss"><Trash2 className="mr-2 h-4 w-4" /> Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {dialog}
    </div>
  );
}