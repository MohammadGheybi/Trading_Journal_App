import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { inputCls } from '@/components/kit/Field';

export default function TagInput({ tags, onChange, suggestions }) {
  const [text, setText] = useState('');
  const add = (raw) => {
    const t = raw.trim().replace(/^#/, '');
    if (t && !tags.includes(t)) onChange([...tags, t]);
    setText('');
  };
  const unused = suggestions.filter((s) => !tags.includes(s)).slice(0, 10);
  return (
    <div className="space-y-3">
      <Input value={text} onChange={(e) => setText(e.target.value)} placeholder="Type a tag and press Enter" aria-label="Add tag" className={inputCls}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); add(text); } }} />
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((t) => (
            <span key={t} className="inline-flex items-center gap-1.5 rounded-full border border-sand/40 bg-sand/10 px-3 py-1 text-sm text-pearl">
              #{t}
              <button type="button" aria-label={`Remove tag ${t}`} onClick={() => onChange(tags.filter((x) => x !== t))}><X className="h-3.5 w-3.5 text-sand" /></button>
            </span>
          ))}
        </div>
      )}
      {unused.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
          Suggestions:
          {unused.map((s) => <button key={s} type="button" onClick={() => add(s)} className="rounded-full border border-border px-2.5 py-0.5 hover:text-pearl">+ {s}</button>)}
        </div>
      )}
    </div>
  );
}