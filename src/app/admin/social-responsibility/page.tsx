'use client';
import { useEffect, useState, useCallback, useRef } from 'react';
import type {
  CSRData, CSRHero, CSRStat, CSRPillar, CSRPillarStat,
  CSRInitiative, CSRGalleryImage, CSRCta,
} from '@/lib/csrStorage';

/* ─────────────────────────── helpers ────────────────────────── */
function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2); }

const ICON_OPTIONS = ['book', 'computer', 'users', 'lightning', 'globe', 'building', 'heart', 'shield', 'leaf', 'sun'];
const SPAN_OPTIONS = ['row-span-1', 'md:row-span-2', 'row-span-2'];
const TABS = ['Hero & CTA', 'Impact Stats', 'Pillars', 'Initiatives', 'Gallery'] as const;
type Tab = typeof TABS[number];

/* ─────────────────────────── Toast ──────────────────────────── */
function Toast({ msg, type }: { msg: string; type: 'success' | 'error' | 'pending' }) {
  const colors = type === 'success' ? 'bg-green-600' : type === 'error' ? 'bg-red-600' : 'bg-yellow-500';
  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl px-5 py-3 text-white shadow-lg ${colors}`}>
      {type === 'pending' && <span className="text-lg">⏳</span>}
      {type === 'success' && <span className="text-lg">✓</span>}
      {type === 'error' && <span className="text-lg">✗</span>}
      <span className="text-sm font-medium">{msg}</span>
    </div>
  );
}

/* ────────────────────── ImageField ─────────────────────────── */
function ImageField({ label, value, onChange, folder = 'csr', preview = true }: {
  label: string; value: string;
  onChange: (url: string) => void;
  folder?: string; preview?: boolean;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setError('');
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('folder', folder);
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
      const json = await res.json();
      if (!res.ok) { setError(json.error || 'Upload failed'); return; }
      onChange(json.url);
    } catch { setError('Upload failed'); }
    finally { setUploading(false); }
  };

  return (
    <div>
      <label className="block text-xs font-semibold text-light-muted dark:text-dark-muted uppercase tracking-wide mb-1">{label}</label>
      <div className="flex gap-2">
        <input
          className="admin-input flex-1"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="Paste URL or upload →"
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-1.5 rounded-lg border border-gray-600 bg-gray-700 px-3 py-2 text-xs font-medium text-white hover:bg-gray-600 disabled:opacity-50 shrink-0"
        >
          {uploading
            ? <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            : <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>}
          {uploading ? 'Uploading…' : 'Upload'}
        </button>
        <input
          ref={fileRef} type="file" accept="image/*" className="hidden"
          onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ''; }}
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
      {preview && value && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={value} alt="preview" className="mt-2 h-32 w-full object-cover rounded-lg border border-gray-700" />
      )}
    </div>
  );
}

/* ───────────────────── Hero & CTA Tab ───────────────────────── */
function HeroCtaTab({ hero, cta, onChange }: {
  hero: CSRHero; cta: CSRCta;
  onChange: (hero: CSRHero, cta: CSRCta) => void;
}) {
  const [h, setH] = useState(hero);
  const [c, setC] = useState(cta);
  useEffect(() => { setH(hero); setC(cta); }, [hero, cta]);
  const update = (newH: CSRHero, newC: CSRCta) => { setH(newH); setC(newC); onChange(newH, newC); };

  const field = (label: string, value: string, key: keyof CSRHero, multiline = false) => (
    <div key={key}>
      <label className="block text-xs font-semibold text-light-muted dark:text-dark-muted uppercase tracking-wide mb-1">{label}</label>
      {multiline
        ? <textarea rows={3} className="admin-input w-full resize-y" value={value} onChange={e => update({ ...h, [key]: e.target.value }, c)} />
        : <input className="admin-input w-full" value={value} onChange={e => update({ ...h, [key]: e.target.value }, c)} />}
    </div>
  );

  return (
    <div className="space-y-8">
      <section>
        <h3 className="text-base font-bold text-light-text dark:text-dark-text mb-4">Hero Section</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          {field('Badge Text', h.badge, 'badge')}
          {field('Title', h.title, 'title')}
        </div>
        {field('Subtitle', h.subtitle, 'subtitle', true)}
        <div className="mt-4">
          <ImageField label="Hero Image" value={h.heroImage} onChange={v => update({ ...h, heroImage: v }, c)} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 mt-4">
          {field('Quote Text', h.quoteText, 'quoteText')}
          {field('Quote Author', h.quoteAuthor, 'quoteAuthor')}
        </div>
      </section>

      <section className="border-t border-light-border dark:border-dark-border pt-6">
        <h3 className="text-base font-bold text-light-text dark:text-dark-text mb-4">CTA Section</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-light-muted dark:text-dark-muted uppercase tracking-wide mb-1">CTA Title</label>
            <input className="admin-input w-full" value={c.title} onChange={e => update(h, { ...c, title: e.target.value })} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-light-muted dark:text-dark-muted uppercase tracking-wide mb-1">CTA Description</label>
            <textarea rows={3} className="admin-input w-full resize-y" value={c.description} onChange={e => update(h, { ...c, description: e.target.value })} />
          </div>
        </div>
      </section>
    </div>
  );
}

/* ──────────────────── Impact Stats Tab ─────────────────────── */
function ImpactStatsTab({ stats, onChange }: { stats: CSRStat[]; onChange: (s: CSRStat[]) => void }) {
  const [items, setItems] = useState(stats);
  useEffect(() => { setItems(stats); }, [stats]);
  const sync = (next: CSRStat[]) => { setItems(next); onChange(next); };
  const add = () => sync([...items, { id: uid(), value: '', label: '' }]);
  const remove = (id: string) => sync(items.filter(s => s.id !== id));
  const change = (id: string, key: keyof CSRStat, val: string) =>
    sync(items.map(s => s.id === id ? { ...s, [key]: val } : s));

  return (
    <div className="space-y-4">
      {items.map((stat, i) => (
        <div key={stat.id} className="flex gap-3 items-start p-4 rounded-xl border border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surface">
          <span className="text-xs text-light-muted dark:text-dark-muted font-mono w-5 mt-2">{i + 1}</span>
          <div className="flex-1 grid gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-light-muted dark:text-dark-muted mb-1">Value</label>
              <input className="admin-input w-full" value={stat.value} onChange={e => change(stat.id, 'value', e.target.value)} placeholder="e.g. 5,000+" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-light-muted dark:text-dark-muted mb-1">Label</label>
              <input className="admin-input w-full" value={stat.label} onChange={e => change(stat.id, 'label', e.target.value)} placeholder="e.g. Lives Impacted" />
            </div>
          </div>
          <button onClick={() => remove(stat.id)} className="mt-1 text-red-500 hover:text-red-700 p-1" title="Remove">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      ))}
      <button onClick={add} className="flex items-center gap-2 text-sm font-medium text-accent hover:text-accent/80">
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
        Add Stat
      </button>
    </div>
  );
}

/* ──────────────────────── Pillars Tab ──────────────────────── */
function PillarsTab({ pillars, onChange }: { pillars: CSRPillar[]; onChange: (p: CSRPillar[]) => void }) {
  const [items, setItems] = useState(pillars);
  const [open, setOpen] = useState<string | null>(pillars[0]?.id ?? null);
  useEffect(() => { setItems(pillars); }, [pillars]);
  const sync = (next: CSRPillar[]) => { setItems(next); onChange(next); };
  const update = (id: string, partial: Partial<CSRPillar>) =>
    sync(items.map(p => p.id === id ? { ...p, ...partial } : p));
  const remove = (id: string) => sync(items.filter(p => p.id !== id));
  const add = () => {
    const n: CSRPillar = { id: uid(), tag: '', title: '', body: '', image: '', alt: '', reverse: false, stats: [] };
    sync([...items, n]);
    setOpen(n.id);
  };
  const addStat = (id: string) => {
    const p = items.find(x => x.id === id)!;
    update(id, { stats: [...p.stats, { value: '', label: '' }] });
  };
  const removeStat = (id: string, i: number) => {
    const p = items.find(x => x.id === id)!;
    update(id, { stats: p.stats.filter((_, j) => j !== i) });
  };
  const updateStat = (id: string, i: number, key: keyof CSRPillarStat, val: string) => {
    const p = items.find(x => x.id === id)!;
    update(id, { stats: p.stats.map((s, j) => j === i ? { ...s, [key]: val } : s) });
  };

  return (
    <div className="space-y-3">
      {items.map((pillar, idx) => (
        <div key={pillar.id} className="rounded-xl border border-light-border dark:border-dark-border overflow-hidden">
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 bg-light-surface dark:bg-dark-surface cursor-pointer" onClick={() => setOpen(open === pillar.id ? null : pillar.id)}>
            <span className="text-xs text-light-muted dark:text-dark-muted font-mono w-5">{idx + 1}</span>
            <span className="flex-1 font-semibold text-sm text-light-text dark:text-dark-text truncate">{pillar.title || '(untitled pillar)'}</span>
            <span className="text-xs text-accent font-medium">{pillar.tag}</span>
            <button onClick={e => { e.stopPropagation(); remove(pillar.id); }} className="text-red-500 hover:text-red-700 p-1">
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <svg className={`h-4 w-4 text-light-muted transition-transform ${open === pillar.id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </div>
          {/* Body */}
          {open === pillar.id && (
            <div className="p-4 space-y-4 bg-white dark:bg-dark-card border-t border-light-border dark:border-dark-border">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-light-muted dark:text-dark-muted mb-1">Tag / Category</label>
                  <input className="admin-input w-full" value={pillar.tag} onChange={e => update(pillar.id, { tag: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-light-muted dark:text-dark-muted mb-1">Title</label>
                  <input className="admin-input w-full" value={pillar.title} onChange={e => update(pillar.id, { title: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-light-muted dark:text-dark-muted mb-1">Body Text</label>
                <textarea rows={4} className="admin-input w-full resize-y" value={pillar.body} onChange={e => update(pillar.id, { body: e.target.value })} />
              </div>
              <ImageField label="Image" value={pillar.image} onChange={v => update(pillar.id, { image: v })} />
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-light-muted dark:text-dark-muted mb-1">Alt Text</label>
                  <input className="admin-input w-full" value={pillar.alt} onChange={e => update(pillar.id, { alt: e.target.value })} />
                </div>
                <div className="flex items-end gap-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="h-4 w-4 rounded accent-[var(--color-accent)]" checked={pillar.reverse} onChange={e => update(pillar.id, { reverse: e.target.checked })} />
                    <span className="text-xs font-semibold text-light-muted dark:text-dark-muted uppercase tracking-wide">Reverse layout</span>
                  </label>
                </div>
              </div>
              {/* Mini stats */}
              <div>
                <p className="text-xs font-semibold text-light-muted dark:text-dark-muted uppercase tracking-wide mb-2">Stats (up to 3)</p>
                <div className="space-y-2">
                  {pillar.stats.map((s, si) => (
                    <div key={si} className="flex gap-2 items-center">
                      <input className="admin-input flex-1" placeholder="Value (e.g. 400+)" value={s.value} onChange={e => updateStat(pillar.id, si, 'value', e.target.value)} />
                      <input className="admin-input flex-1" placeholder="Label" value={s.label} onChange={e => updateStat(pillar.id, si, 'label', e.target.value)} />
                      <button onClick={() => removeStat(pillar.id, si)} className="text-red-500 hover:text-red-700 p-1">
                        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>
                  ))}
                  {pillar.stats.length < 3 && (
                    <button onClick={() => addStat(pillar.id)} className="flex items-center gap-1 text-xs text-accent hover:text-accent/80">
                      <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                      Add Stat
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
      <button onClick={add} className="flex items-center gap-2 text-sm font-medium text-accent hover:text-accent/80">
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
        Add Pillar
      </button>
    </div>
  );
}

/* ─────────────────────── Initiatives Tab ───────────────────── */
function InitiativesTab({ initiatives, onChange }: { initiatives: CSRInitiative[]; onChange: (i: CSRInitiative[]) => void }) {
  const [items, setItems] = useState(initiatives);
  useEffect(() => { setItems(initiatives); }, [initiatives]);
  const sync = (next: CSRInitiative[]) => { setItems(next); onChange(next); };
  const add = () => sync([...items, { id: uid(), iconName: 'book', title: '', desc: '' }]);
  const remove = (id: string) => sync(items.filter(i => i.id !== id));
  const change = (id: string, key: keyof CSRInitiative, val: string) =>
    sync(items.map(i => i.id === id ? { ...i, [key]: val } : i));

  return (
    <div className="space-y-4">
      {items.map((item, i) => (
        <div key={item.id} className="p-4 rounded-xl border border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surface space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-light-muted dark:text-dark-muted font-mono">{i + 1}</span>
            <button onClick={() => remove(item.id)} className="text-red-500 hover:text-red-700 p-1">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-light-muted dark:text-dark-muted mb-1">Icon</label>
              <select className="admin-input w-full" value={item.iconName} onChange={e => change(item.id, 'iconName', e.target.value)}>
                {ICON_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-light-muted dark:text-dark-muted mb-1">Title</label>
              <input className="admin-input w-full" value={item.title} onChange={e => change(item.id, 'title', e.target.value)} />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-light-muted dark:text-dark-muted mb-1">Description</label>
            <textarea rows={2} className="admin-input w-full resize-y" value={item.desc} onChange={e => change(item.id, 'desc', e.target.value)} />
          </div>
        </div>
      ))}
      <button onClick={add} className="flex items-center gap-2 text-sm font-medium text-accent hover:text-accent/80">
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
        Add Initiative
      </button>
    </div>
  );
}

/* ────────────────────────── Gallery Tab ────────────────────── */
function GalleryTab({ gallery, onChange }: { gallery: CSRGalleryImage[]; onChange: (g: CSRGalleryImage[]) => void }) {
  const [items, setItems] = useState(gallery);
  useEffect(() => { setItems(gallery); }, [gallery]);
  const sync = (next: CSRGalleryImage[]) => { setItems(next); onChange(next); };
  const add = () => sync([...items, { id: uid(), src: '', alt: '', span: 'row-span-1' }]);
  const remove = (id: string) => sync(items.filter(g => g.id !== id));
  const change = (id: string, key: keyof CSRGalleryImage, val: string) =>
    sync(items.map(g => g.id === id ? { ...g, [key]: val } : g));

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        {items.map((img, i) => (
          <div key={img.id} className="rounded-xl border border-light-border dark:border-dark-border overflow-hidden bg-light-surface dark:bg-dark-surface">
            {img.src && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={img.src} alt={img.alt} className="w-full h-32 object-cover" />
            )}
            {!img.src && (
              <div className="w-full h-32 bg-light-border dark:bg-dark-border flex items-center justify-center text-light-muted text-sm">No image</div>
            )}
            <div className="p-3 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-light-muted font-mono">{i + 1}</span>
                <button onClick={() => remove(img.id)} className="text-red-500 hover:text-red-700">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <ImageField label="" value={img.src} onChange={v => change(img.id, 'src', v)} preview={false} />
              <input className="admin-input w-full text-xs" placeholder="Alt text" value={img.alt} onChange={e => change(img.id, 'alt', e.target.value)} />
              <select className="admin-input w-full text-xs" value={img.span} onChange={e => change(img.id, 'span', e.target.value)}>
                {SPAN_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
        ))}
      </div>
      <button onClick={add} className="flex items-center gap-2 text-sm font-medium text-accent hover:text-accent/80">
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
        Add Image
      </button>
    </div>
  );
}

/* ──────────────────────── Main Page ────────────────────────── */
export default function AdminCSRPage() {
  const [data, setData] = useState<CSRData | null>(null);
  const [draft, setDraft] = useState<CSRData | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('Hero & CTA');
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' | 'pending' } | null>(null);

  const showToast = (msg: string, type: 'success' | 'error' | 'pending') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    fetch('/api/admin/csr')
      .then(r => r.json())
      .then(({ csr }) => { setData(csr); setDraft(csr); })
      .catch(() => showToast('Failed to load CSR data', 'error'));
  }, []);

  const save = useCallback(async () => {
    if (!draft) return;
    setSaving(true);
    try {
      const res = await fetch('/api/admin/csr', {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(draft),
      });
      if (!res.ok) { showToast('Save failed', 'error'); return; }
      const json = await res.json();
      if (json.pending) {
        showToast('Submitted for superadmin approval', 'pending');
      } else {
        setData(json.csr); setDraft(json.csr);
        showToast('Saved successfully', 'success');
      }
    } catch { showToast('Save failed', 'error'); }
    finally { setSaving(false); }
  }, [draft]);

  if (!draft) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-light-text dark:text-dark-text">Social Responsibility</h1>
          <p className="text-sm text-light-muted dark:text-dark-muted mt-0.5">Manage all content for the /social-responsibility page</p>
        </div>
        <div className="flex items-center gap-3">
          <a href="/social-responsibility" target="_blank" rel="noopener noreferrer" className="text-xs text-accent underline underline-offset-2">View live page ↗</a>
          <button
            onClick={save}
            disabled={saving}
            className="flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-white shadow hover:bg-accent/90 disabled:opacity-60"
          >
            {saving ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> : null}
            {saving ? 'Saving…' : 'Save All Changes'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-xl bg-light-surface dark:bg-dark-surface p-1 border border-light-border dark:border-dark-border">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 rounded-lg px-3 py-2 text-xs sm:text-sm font-medium transition-all ${activeTab === tab
                ? 'bg-accent text-white shadow'
                : 'text-light-muted dark:text-dark-muted hover:text-light-text dark:hover:text-dark-text'
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="rounded-xl border border-light-border dark:border-dark-border bg-white dark:bg-dark-card p-6">
        {activeTab === 'Hero & CTA' && (
          <HeroCtaTab
            hero={draft.hero} cta={draft.cta}
            onChange={(hero, cta) => setDraft(d => d ? { ...d, hero, cta } : d)}
          />
        )}
        {activeTab === 'Impact Stats' && (
          <ImpactStatsTab
            stats={draft.impactStats}
            onChange={impactStats => setDraft(d => d ? { ...d, impactStats } : d)}
          />
        )}
        {activeTab === 'Pillars' && (
          <PillarsTab
            pillars={draft.pillars}
            onChange={pillars => setDraft(d => d ? { ...d, pillars } : d)}
          />
        )}
        {activeTab === 'Initiatives' && (
          <InitiativesTab
            initiatives={draft.initiatives}
            onChange={initiatives => setDraft(d => d ? { ...d, initiatives } : d)}
          />
        )}
        {activeTab === 'Gallery' && (
          <GalleryTab
            gallery={draft.gallery}
            onChange={gallery => setDraft(d => d ? { ...d, gallery } : d)}
          />
        )}
      </div>

      {toast && <Toast {...toast} />}
    </div>
  );
}
