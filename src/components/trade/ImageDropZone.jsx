import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ImagePlus, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { repository } from '@/lib/journal/repository';

/** Saves chart screenshots on this computer and keeps their addresses on the trade. */
export default function ImageDropZone({ images = [], onChange }) {
  const input = useRef(null);
  const [over, setOver] = useState(false);
  const [busy, setBusy] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const add = useCallback(async (fileList) => {
    const files = [...fileList].filter((file) => file.type.startsWith('image/'));
    if (!files.length) return;
    setBusy(true);
    setUploadError('');
    try {
      const urls = await repository.uploadImages(files);
      if (urls.length) onChange([...images, ...urls]);
    } catch (error) {
      setUploadError(error.message || 'The screenshot could not be saved.');
    } finally {
      setBusy(false);
    }
  }, [images, onChange]);

  const remove = async (src) => {
    onChange(images.filter((item) => item !== src));
    try { await repository.deleteImage(src); } catch { /* saving the trade drops the reference if this file is still stored */ }
  };

  useEffect(() => {
    const onPaste = (event) => {
      const target = event.target;
      if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) return;
      add(event.clipboardData?.files || []);
    };
    window.addEventListener('paste', onPaste);
    return () => window.removeEventListener('paste', onPaste);
  }, [add]);

  return (
    <div className="space-y-3">
      <button type="button" disabled={busy} onClick={() => input.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setOver(true); }} onDragLeave={() => setOver(false)}
        onDrop={(e) => { e.preventDefault(); setOver(false); add(e.dataTransfer.files); }}
        className={cn('flex w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-10 text-center transition-colors disabled:opacity-70', over ? 'border-sand bg-sand/10' : 'border-border bg-surface-2 hover:border-sand/40')}>
        <ImagePlus className="mb-3 h-7 w-7 text-sand" aria-hidden />
        <span className="text-sm font-medium text-pearl">{busy ? 'Saving screenshot…' : 'Click, drag & drop, or paste a chart screenshot'}</span>
        <span className="mt-1 text-xs text-muted-foreground">Saved on this computer with the trade. JPEG, PNG, WebP, or GIF, up to 8 MB.</span>
      </button>
      <input ref={input} type="file" accept="image/jpeg,image/png,image/webp,image/gif" multiple hidden onChange={(e) => { add(e.target.files); e.target.value = ''; }} />
      {uploadError && <p className="text-sm text-loss">{uploadError}</p>}
      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {images.map((src) => (
            <div key={src} className="group relative overflow-hidden rounded-xl border border-border">
              <img src={src} alt="Trade screenshot" className="aspect-video w-full object-cover" />
              <button type="button" aria-label="Remove image" onClick={() => remove(src)}
                className="absolute right-2 top-2 rounded-full bg-obsidian/80 p-1 text-pearl opacity-100 sm:opacity-0 sm:group-hover:opacity-100"><X className="h-3.5 w-3.5" /></button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
