import React, { useEffect, useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { inputCls } from '@/components/kit/Field';

export default function OptionListEditor({ label, description, items = [], onChange }) {
  const [draft, setDraft] = useState('');
  const [rows, setRows] = useState(items);
  useEffect(() => { setRows(items); }, [items.join('\n')]); // eslint-disable-line react-hooks/exhaustive-deps
  const commit = (next) => {
    const clean = [];
    const seen = new Set();
    for (const item of next) {
      const name = item.trim();
      if (!name || seen.has(name.toLowerCase())) continue;
      seen.add(name.toLowerCase());
      clean.push(name);
    }
    setRows(clean);
    onChange(clean);
  };

  return (
    <div>
      <div className="text-sm font-medium text-pearl">{label}</div>
      <p className="mt-1 text-xs text-muted-foreground">{description}</p>
      <ul className="mt-3 space-y-2">
        {rows.map((item, index) => (
          <li key={index} className="flex gap-2">
            <Input value={item} aria-label={`${label} ${index + 1}`} className={inputCls}
              onChange={(e) => setRows(rows.map((row, i) => (i === index ? e.target.value : row)))}
              onBlur={() => commit(rows)} />
            <Button type="button" variant="ghost" className="rounded-xl text-muted-foreground" onClick={() => commit(rows.filter((_, i) => i !== index))}><X className="h-4 w-4" /> Delete</Button>
          </li>
        ))}
      </ul>
      <form className="mt-3 flex gap-2" onSubmit={(e) => { e.preventDefault(); commit([...rows, draft]); setDraft(''); }}>
        <Input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Add an option" aria-label={`Add ${label}`} className={inputCls} />
        <Button type="submit" variant="outline" className="rounded-xl border-border"><Plus className="h-4 w-4" /> Add</Button>
      </form>
    </div>
  );
}
