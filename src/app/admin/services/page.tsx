'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { ServiceDetail } from '@/data/services';

// ─── icons ───────────────────────────────────────────────────────
const IconEdit = () => (
  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
  </svg>
);
const IconTrash = () => (
  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
  </svg>
);
const IconPlus = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
);
const IconX = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

// ─── image upload helper ─────────────────────────────────────────
function ImageUpload({ value, onChange, folder = 'services' }: { value: string; onChange: (v: string) => void; folder?: string }) {
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState('');
  const ref = useRef<HTMLInputElement>(null);
  const handle = async (file: File) => {
    setErr(''); setUploading(true);
    try {
      const fd = new FormData(); fd.append('file', file); fd.append('folder', folder);
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
      const json = await res.json();
      if (!res.ok) { setErr(json.error || 'Upload failed'); return; }
      onChange(json.url);
    } catch { setErr('Upload failed'); } finally { setUploading(false); }
  };
  return (
    <div>
      <div className="flex gap-2">
        <input className={inputCls + ' flex-1'} value={value} onChange={e => onChange(e.target.value)} placeholder="/images/services/... or upload →" />
        <button type="button" onClick={() => ref.current?.click()} disabled={uploading}
          className="flex items-center gap-1.5 rounded-lg border border-gray-600 bg-gray-700 px-3 py-2 text-xs font-medium text-white hover:bg-gray-600 disabled:opacity-50 shrink-0">
          {uploading ? <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" /> : <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>}
          {uploading ? 'Uploading…' : 'Upload'}
        </button>
        <input ref={ref} type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handle(f); e.target.value = ''; }} />
      </div>
      {err && <p className="mt-1 text-xs text-red-400">{err}</p>}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {value && <img src={value} alt="" className="mt-2 h-24 w-full object-cover rounded-lg border border-gray-700" />}
    </div>
  );
}

// ─── styles ──────────────────────────────────────────────────────
const inputCls = 'w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-[#00C46A] focus:outline-none focus:ring-1 focus:ring-[#00C46A]/40 transition-colors';
const labelCls = 'block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5';
const sectionTitleCls = 'text-xs font-bold text-[#00C46A] uppercase tracking-widest mb-3 mt-5 border-b border-gray-700 pb-1';

function emptyService(): Partial<ServiceDetail> & { heroStat: { value: string; label: string } } {
  return {
    id: '', title: '', tagline: '', description: '', image: '',
    heroStat: { value: '', label: '' },
    gradient: 'from-green-500 to-emerald-600', icon: '',
    outcomes: [], deliverables: [], compliance: [], forWhom: [],
    longDescription: [],
    features: [],
    process: [],
  };
}

// ─── StringListEditor ─────────────────────────────────────────────
function StringListEditor({
  label, items, onChange,
}: { label: string; items: string[]; onChange: (v: string[]) => void }) {
  const update = (idx: number, val: string) => {
    const next = [...items]; next[idx] = val; onChange(next);
  };
  const remove = (idx: number) => onChange(items.filter((_, i) => i !== idx));
  const add = () => onChange([...items, '']);
  return (
    <div>
      <p className={labelCls}>{label}</p>
      <div className="space-y-1.5">
        {items.map((it, i) => (
          <div key={i} className="flex gap-2">
            <input className={inputCls} value={it} onChange={e => update(i, e.target.value)} placeholder={`Item ${i + 1}`} />
            <button type="button" onClick={() => remove(i)} className="text-red-400 hover:text-red-300 shrink-0"><IconX /></button>
          </div>
        ))}
        <button type="button" onClick={add} className="flex items-center gap-1 text-xs text-[#00C46A] hover:text-green-400">
          <IconPlus /> Add item
        </button>
      </div>
    </div>
  );
}

// ─── FeatureEditor ────────────────────────────────────────────────
type Feature = { title: string; description: string };
function FeatureEditor({ items, onChange }: { items: Feature[]; onChange: (v: Feature[]) => void }) {
  const update = (idx: number, field: keyof Feature, val: string) => {
    const next = items.map((it, i) => i === idx ? { ...it, [field]: val } : it);
    onChange(next);
  };
  const remove = (idx: number) => onChange(items.filter((_, i) => i !== idx));
  const add = () => onChange([...items, { title: '', description: '' }]);
  return (
    <div>
      <p className={sectionTitleCls}>Features</p>
      <div className="space-y-3">
        {items.map((it, i) => (
          <div key={i} className="rounded-lg border border-gray-700 bg-gray-800/60 p-3 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-400 font-semibold">Feature {i + 1}</span>
              <button type="button" onClick={() => remove(i)} className="text-red-400 hover:text-red-300 text-xs">Remove</button>
            </div>
            <input className={inputCls} placeholder="Title" value={it.title} onChange={e => update(i, 'title', e.target.value)} />
            <textarea className={inputCls} rows={2} placeholder="Description" value={it.description} onChange={e => update(i, 'description', e.target.value)} />
          </div>
        ))}
        <button type="button" onClick={add} className="flex items-center gap-1 text-xs text-[#00C46A] hover:text-green-400">
          <IconPlus /> Add feature
        </button>
      </div>
    </div>
  );
}

// ─── ProcessEditor ────────────────────────────────────────────────
type ProcessStep = { step: string; title: string; description: string };
function ProcessEditor({ items, onChange }: { items: ProcessStep[]; onChange: (v: ProcessStep[]) => void }) {
  const update = (idx: number, field: keyof ProcessStep, val: string) => {
    const next = items.map((it, i) => i === idx ? { ...it, [field]: val } : it);
    onChange(next);
  };
  const remove = (idx: number) => onChange(items.filter((_, i) => i !== idx));
  const add = () => onChange([...items, { step: String(items.length + 1).padStart(2, '0'), title: '', description: '' }]);
  return (
    <div>
      <p className={sectionTitleCls}>Process Steps</p>
      <div className="space-y-3">
        {items.map((it, i) => (
          <div key={i} className="rounded-lg border border-gray-700 bg-gray-800/60 p-3 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-400 font-semibold">Step {i + 1}</span>
              <button type="button" onClick={() => remove(i)} className="text-red-400 hover:text-red-300 text-xs">Remove</button>
            </div>
            <div className="grid grid-cols-4 gap-2">
              <input className={inputCls} placeholder="Step #" value={it.step} onChange={e => update(i, 'step', e.target.value)} />
              <div className="col-span-3">
                <input className={inputCls} placeholder="Title" value={it.title} onChange={e => update(i, 'title', e.target.value)} />
              </div>
            </div>
            <textarea className={inputCls} rows={2} placeholder="Description" value={it.description} onChange={e => update(i, 'description', e.target.value)} />
          </div>
        ))}
        <button type="button" onClick={add} className="flex items-center gap-1 text-xs text-[#00C46A] hover:text-green-400">
          <IconPlus /> Add step
        </button>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────
export default function AdminServicesPage() {
  const [services, setServices] = useState<ServiceDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const [panelOpen, setPanelOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyService());
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'pending' } | null>(null);

  const [deleting, setDeleting] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/services', { cache: 'no-store' });
      const data = await res.json();
      setServices(data.services ?? []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  function openAdd() {
    setEditingId(null);
    setForm(emptyService());
    setFormError('');
    setPanelOpen(true);
  }
  function openEdit(s: ServiceDetail) {
    setEditingId(s.id);
    setForm({
      ...emptyService(),
      ...s,
      heroStat: s.heroStat ?? { value: '', label: '' },
      outcomes: s.outcomes ?? [],
      deliverables: s.deliverables ?? [],
      compliance: s.compliance ?? [],
      forWhom: s.forWhom ?? [],
      longDescription: s.longDescription ?? [],
      features: s.features ?? [],
      process: s.process ?? [],
    });
    setFormError('');
    setPanelOpen(true);
  }

  function setField<K extends keyof typeof form>(key: K, val: (typeof form)[K]) {
    setForm(f => ({ ...f, [key]: val }));
  }

  async function save() {
    if (!form.title?.trim()) { setFormError('Title is required'); return; }
    if (!editingId && !form.id?.trim()) { setFormError('ID (slug) is required for new services'); return; }
    setSaving(true); setFormError('');
    try {
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId ? `/api/admin/services/${editingId}` : '/api/admin/services';
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const data = await res.json();
      if (!res.ok) { setFormError(data.error ?? 'Save failed'); return; }
      setPanelOpen(false);
      if (data.pending) {
        setToast({ msg: 'Submitted for approval — awaiting superadmin review.', type: 'pending' });
        setTimeout(() => setToast(null), 6000);
      } else {
        setToast({ msg: 'Service saved successfully.', type: 'success' });
        setTimeout(() => setToast(null), 3000);
      }
      await load();
    } catch { setFormError('Network error'); }
    finally { setSaving(false); }
  }

  async function doDelete(id: string) {
    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/services/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.pending) {
        setToast({ msg: 'Delete request submitted for approval.', type: 'pending' });
        setTimeout(() => setToast(null), 6000);
      }
      await load();
    } finally { setDeleting(null); }
  }

  const filtered = services.filter(s =>
    s.title.toLowerCase().includes(search.toLowerCase()) ||
    s.id.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-gray-800 bg-gray-950/90 backdrop-blur px-6 py-4">
        <div>
          <h1 className="text-xl font-bold">Services</h1>
          <p className="text-xs text-gray-400 mt-0.5">{services.length} service{services.length !== 1 && 's'}</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 rounded-lg bg-[#00C46A] px-4 py-2 text-sm font-semibold text-black hover:bg-green-400 transition-colors">
          <IconPlus /> Add Service
        </button>
      </div>

      {/* Toast */}
      {toast && (
        <div className={`mx-6 mt-4 rounded-lg border px-4 py-3 text-sm font-medium ${toast.type === 'pending'
            ? 'border-yellow-500/40 bg-yellow-500/10 text-yellow-300'
            : 'border-green-500/40 bg-green-500/10 text-green-300'
          }`}>
          {toast.type === 'pending' ? '⏳' : '✓'} {toast.msg}
        </div>
      )}

      {/* Search */}
      <div className="px-6 py-4">
        <input
          className="w-full max-w-sm rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-[#00C46A] focus:outline-none"
          placeholder="Search services…" value={search} onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="px-6 pb-12">
        {loading ? (
          <p className="text-gray-500 text-sm">Loading…</p>
        ) : filtered.length === 0 ? (
          <p className="text-gray-500 text-sm">No services found.</p>
        ) : (
          <div className="rounded-xl border border-gray-800 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800 bg-gray-900/60 text-xs text-gray-400 uppercase tracking-wider">
                  <th className="px-4 py-3 text-left">Image</th>
                  <th className="px-4 py-3 text-left">Title</th>
                  <th className="px-4 py-3 text-left">Slug</th>
                  <th className="px-4 py-3 text-left">Tagline</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s, i) => (
                  <tr key={s.id} className={`border-b border-gray-800/60 ${i % 2 === 0 ? 'bg-gray-900/20' : ''} hover:bg-gray-800/40 transition-colors`}>
                    <td className="px-4 py-3">
                      {s.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={s.image} alt="" className="w-12 h-8 object-cover rounded" />
                      ) : (
                        <div className="w-12 h-8 rounded bg-gray-700 flex items-center justify-center text-gray-500 text-xs">–</div>
                      )}
                    </td>
                    <td className="px-4 py-3 font-medium">{s.title}</td>
                    <td className="px-4 py-3 text-gray-400 font-mono text-xs">{s.id}</td>
                    <td className="px-4 py-3 text-gray-400 text-xs max-w-xs truncate">{s.tagline}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openEdit(s)} className="flex items-center gap-1 rounded px-2 py-1 text-xs text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 transition-colors">
                          <IconEdit /> Edit
                        </button>
                        <button
                          onClick={() => { if (window.confirm(`Delete "${s.title}"?`)) doDelete(s.id); }}
                          disabled={deleting === s.id}
                          className="flex items-center gap-1 rounded px-2 py-1 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors disabled:opacity-40"
                        >
                          <IconTrash /> {deleting === s.id ? '…' : 'Delete'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Side panel overlay */}
      {panelOpen && (
        <div className="fixed inset-0 z-40 flex">
          <div className="flex-1 bg-black/60 backdrop-blur-sm" onClick={() => setPanelOpen(false)} />
          <aside className="w-full max-w-2xl bg-gray-900 border-l border-gray-700 flex flex-col overflow-hidden">
            {/* Panel header */}
            <div className="flex items-center justify-between border-b border-gray-800 px-6 py-4 shrink-0">
              <h2 className="text-base font-bold">{editingId ? 'Edit Service' : 'Add Service'}</h2>
              <button onClick={() => setPanelOpen(false)} className="text-gray-400 hover:text-white"><IconX /></button>
            </div>

            {/* Scrollable form */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {formError && (
                <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-400">{formError}</div>
              )}

              {/* ── Basic ── */}
              <p className={sectionTitleCls}>Basic Information</p>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Title *</label>
                  <input className={inputCls} value={form.title ?? ''} onChange={e => setField('title', e.target.value)} placeholder="e.g. Cyber Security" />
                </div>
                <div>
                  <label className={labelCls}>ID / Slug {!editingId && '*'}</label>
                  <input className={inputCls} value={form.id ?? ''} onChange={e => setField('id', e.target.value)} placeholder="e.g. cyber-security" disabled={!!editingId} />
                  {editingId && <p className="text-xs text-gray-500 mt-1">Slug cannot be changed after creation.</p>}
                </div>
              </div>

              <div>
                <label className={labelCls}>Tagline</label>
                <input className={inputCls} value={form.tagline ?? ''} onChange={e => setField('tagline', e.target.value)} placeholder="Short catchy tagline" />
              </div>

              <div>
                <label className={labelCls}>Description</label>
                <textarea className={inputCls} rows={3} value={form.description ?? ''} onChange={e => setField('description', e.target.value)} placeholder="Brief description shown in cards / SEO" />
              </div>

              <div>
                <label className={labelCls}>Image (hero / card)</label>
                <ImageUpload value={form.image ?? ''} onChange={v => setField('image', v)} folder="services" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Hero Stat — Value</label>
                  <input className={inputCls} value={form.heroStat?.value ?? ''} onChange={e => setField('heroStat', { ...form.heroStat, value: e.target.value })} placeholder="e.g. 99.9%" />
                </div>
                <div>
                  <label className={labelCls}>Hero Stat — Label</label>
                  <input className={inputCls} value={form.heroStat?.label ?? ''} onChange={e => setField('heroStat', { ...form.heroStat, label: e.target.value })} placeholder="e.g. Uptime Guarantee" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Gradient (Tailwind classes)</label>
                  <input className={inputCls} value={form.gradient ?? ''} onChange={e => setField('gradient', e.target.value)} placeholder="from-green-500 to-emerald-600" />
                </div>
                <div>
                  <label className={labelCls}>Icon (SVG path / name)</label>
                  <input className={inputCls} value={form.icon ?? ''} onChange={e => setField('icon', e.target.value)} placeholder="icon identifier" />
                </div>
              </div>

              {/* ── Arrays ── */}
              <p className={sectionTitleCls}>Content Lists</p>

              <StringListEditor label="Long Description Paragraphs" items={(form.longDescription as string[]) ?? []} onChange={v => setField('longDescription', v)} />
              <StringListEditor label="Outcomes" items={(form.outcomes as string[]) ?? []} onChange={v => setField('outcomes', v)} />
              <StringListEditor label="Deliverables" items={(form.deliverables as string[]) ?? []} onChange={v => setField('deliverables', v)} />
              <StringListEditor label="Compliance" items={(form.compliance as string[]) ?? []} onChange={v => setField('compliance', v)} />
              <StringListEditor label="For Whom (target audience)" items={(form.forWhom as string[]) ?? []} onChange={v => setField('forWhom', v)} />

              {/* ── Features ── */}
              <FeatureEditor items={(form.features as Feature[]) ?? []} onChange={v => setField('features', v)} />

              {/* ── Process ── */}
              <ProcessEditor items={(form.process as ProcessStep[]) ?? []} onChange={v => setField('process', v)} />
            </div>

            {/* Panel footer */}
            <div className="shrink-0 border-t border-gray-800 px-6 py-4 flex items-center justify-end gap-3">
              <button onClick={() => setPanelOpen(false)} className="rounded-lg border border-gray-700 px-4 py-2 text-sm text-gray-300 hover:text-white hover:border-gray-500 transition-colors">
                Cancel
              </button>
              <button onClick={save} disabled={saving} className="rounded-lg bg-[#00C46A] px-5 py-2 text-sm font-semibold text-black hover:bg-green-400 disabled:opacity-40 transition-colors">
                {saving ? 'Saving…' : editingId ? 'Save Changes' : 'Add Service'}
              </button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
