import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function Pagination({ page, pages, total, size, onPage, onSize }) {
  const start = total ? (page - 1) * size + 1 : 0;
  const end = Math.min(page * size, total);
  return (
    <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        Rows per page
        <Select value={String(size)} onValueChange={(v) => onSize(Number(v))}>
          <SelectTrigger aria-label="Rows per page" className="h-9 w-20 rounded-lg border-border bg-surface"><SelectValue /></SelectTrigger>
          <SelectContent className="rounded-xl border-border bg-surface-2">
            {[10, 25, 50].map((n) => <SelectItem key={n} value={String(n)}>{n}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center gap-3">
        <span className="num text-sm text-muted-foreground">{start}–{end} of {total}</span>
        <Button variant="outline" size="icon" disabled={page <= 1} onClick={() => onPage(page - 1)} aria-label="Previous page" className="h-9 w-9 rounded-lg border-border bg-surface"><ChevronLeft className="h-4 w-4" /></Button>
        <Button variant="outline" size="icon" disabled={page >= pages} onClick={() => onPage(page + 1)} aria-label="Next page" className="h-9 w-9 rounded-lg border-border bg-surface"><ChevronRight className="h-4 w-4" /></Button>
      </div>
    </div>
  );
}