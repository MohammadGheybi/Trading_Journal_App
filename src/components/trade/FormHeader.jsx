import React from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function FormHeader({ title, done, total, onBack, onDraft, onSave }) {
  return (
    <div className="sticky top-16 z-10 -mx-4 border-b border-border/70 bg-obsidian/90 px-4 py-3 backdrop-blur-xl sm:-mx-6 sm:px-6 lg:-mx-10 lg:px-10">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onBack} aria-label="Back" className="shrink-0 rounded-xl"><ArrowLeft className="h-5 w-5" /></Button>
        <div className="min-w-0 flex-1">
          <div className="truncate font-heading text-lg text-pearl">{title}</div>
          <div className="mt-1 flex items-center gap-2">
            <div className="h-1 w-24 overflow-hidden rounded-full bg-white/10 sm:w-32">
              <div className="h-full rounded-full bg-sand transition-all duration-500" style={{ width: `${(done / total) * 100}%` }} />
            </div>
            <span className="num text-xs text-muted-foreground">{done}/{total} sections</span>
          </div>
        </div>
        <Button variant="outline" onClick={onDraft} className="rounded-xl border-border bg-surface px-3 sm:px-4"><span className="hidden sm:inline">Save </span>Draft</Button>
        <Button onClick={onSave} className="rounded-xl bg-crimson px-3 text-pearl hover:bg-crimson-hover sm:px-4"><Save className="h-4 w-4" /><span className="hidden sm:inline">Save Trade</span></Button>
      </div>
    </div>
  );
}