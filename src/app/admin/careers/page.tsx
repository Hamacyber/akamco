'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import type { Job } from '@/lib/jobsStorage';

// ─── styles ──────────────────────────────────────────────────────
const inputCls = 'w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-[#00C46A] focus:outline-none focus:ring-1 focus:ring-[#00C46A]/40 transition-colors';
const labelCls = 'block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5';

const DEPT_OPTIONS = ['Engineering', 'Security', 'Technology', 'Operations', 'Sales & Advisory', 'Finance', 'HR', 'Other'];
const TYPE_OPTIONS = ['Full-time', 'Part-time', 'Contract', 'Internship'];

const DEPT_COLORS: Record<string, string> = {
  Engineering:       'bg-blue-900/40 text-blue-300',
  Security:          'bg-red-900/40 text-red-300',
  Technology:        'bg-purple-900/40 text-purple-300',
  Operations:        'bg-orange-900/40 text-orange-300',
  'Sales & Advisory':'bg-teal-900/40 text-teal-300',
};

// ─── Toast ───────────────────────────────────────────────────────
function Toast({ msg, type }: { msg: string; type: 'success' | 'error' }) {
  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl px-5 py-3 text-white shadow-lg ${type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
      <span>{type === 'success' ? '✓' : '✗'}</span>
      <span className="text-sm font-medium">{msg}</span>
    </div>
  );
}

// ─── Requirements editor ─────────────────────────────────────────
function ReqsEditor({ items, onChange }: { items: string[]; onChange: (v: string[]) => void }) {
  const add = () => onChange([...items, '']);
  const remove = (i: number) => onChange(items.filter((_, j) => j !== i));
  const update = (i: number, v: string) => onChange(items.map((x, j) => j === i ? v : x));
  return (
    <div className="space-y-2">
      {items.map((req, i) => (
        <div key={i} className="flex gap-2">
          <input className={inputCls} value={req} placeholder={`Requirement ${i + 1}`}
            onChange={e => update(i, e.target.value)} />
          <button type="button" onClick={() => remove(i)} className="text-gray-500 hover:text-red-400 p-1">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      ))}
      <button type="button" onClick={add} className="flex items-center gap-1.5 text-xs text-[#00C46A] hover:text-[#00C46A]/80">
        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
        Add Requirement
      </button>
    </div>
  );
}

// ─── Empty form ──────────────────────────────────────────────────
function emptyForm(): Omit<Job, 'postedAt'> {
  return { id: '', title: '', department: 'Engineering', location: 'Baghdad, Iraq', type: 'Full-time', description: '', requirements: [], active: true };
}

// ─── Main ────────────────────────────────────────────────────────
export default function AdminCareersPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [panelOpen, setPanelOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm());
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [deleting, setDeleting] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const showToast = (msg: string, type: 'success' | 'error') => {
    setToast({ msg, type }); setTimeout(() => setToast(null), 3500);
  };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/jobs', { cache: 'no-store' });
      const data = await res.json();
      setJobs(data.jobs ?? []);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  function setField<K extends keyof typeof form>(k: K, v: (typeof form)[K]) {
    setForm(f => ({ ...f, [k]: v }));
  }

  function openAdd() {
    setEditingId(null); setForm(emptyForm()); setFormError(''); setPanelOpen(true);
  }
  function openEdit(j: Job) {
    setEditingId(j.id);
    setForm({ id: j.id, title: j.title, department: j.department, location: j.location, type: j.type, description: j.description, requirements: [...j.requirements], active: j.active });
    setFormError(''); setPanelOpen(true);
  }

  async function save() {
    if (!form.title.trim()) { setFormError('Title is required'); return; }
    if (!editingId && !form.id.trim()) { setFormError('ID / slug is required'); return; }
    setSaving(true); setFormError('');
    try {
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId ? `/api/admin/jobs/${editingId}` : '/api/admin/jobs';
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const data = await res.json();
      if (!res.ok) { setFormError(data.error ?? 'Save failed'); return; }
      setPanelOpen(false);
      showToast(editingId ? 'Job updated' : 'Job created', 'success');
      await load();
    } catch { setFormError('Network error'); }
    finally { setSaving(false); }
  }

  async function doDelete(id: string) {
    if (!confirm('Delete this job posting? This cannot be undone.')) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/jobs/${id}`, { method: 'DELETE' });
      if (!res.ok) { showToast('Delete failed', 'error'); return; }
      showToast('Job deleted', 'success');
      await load();
    } finally { setDeleting(null); }
  }

  async function toggleActive(job: Job) {
    await fetch(`/api/admin/jobs/${job.id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: !job.active }),
    });
    await load();
  }

  const filtered = jobs.filter(j =>
    j.title.toLowerCase().includes(search.toLowerCase()) ||
    j.department.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-gray-950 border-b border-gray-800 px-6 py-4 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold">Open Positions</h1>
          <p className="text-xs text-gray-400 mt-0.5">Manage job listings shown on the /careers page</p>
        </div>
        <div className="flex items-center gap-3">
          <a href="/careers" target="_blank" rel="noopener noreferrer" className="text-xs text-[#00C46A] underline underline-offset-2">View live ↗</a>
          <button onClick={openAdd} className="flex items-center gap-2 rounded-lg bg-[#00C46A] px-4 py-2 text-sm font-semibold text-white hover:bg-[#00C46A]/80">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            Add Job
          </button>
        </div>
      </div>

      {/* Search + list */}
      <div className="p-6 space-y-4">
        <input className={inputCls} placeholder="Search by title or department…" value={search} onChange={e => setSearch(e.target.value)} />

        {loading ? (
          <div className="flex justify-center py-16"><div className="h-8 w-8 animate-spin rounded-full border-2 border-[#00C46A] border-t-transparent" /></div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-500">No jobs found.{search && ' Try clearing the search.'}</div>
        ) : (
          <div className="space-y-3">
            {filtered.map(job => (
              <div key={job.id} className="rounded-xl border border-gray-800 bg-gray-900 p-5 flex flex-col sm:flex-row sm:items-start gap-4">
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <h3 className="font-semibold text-base text-white">{job.title}</h3>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${DEPT_COLORS[job.department] ?? 'bg-gray-700 text-gray-300'}`}>{job.department}</span>
                    {!job.active && <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-700 text-gray-400">Hidden</span>}
                  </div>
                  <p className="text-xs text-gray-400 mb-1">{job.location} · {job.type} · Posted {job.postedAt}</p>
                  <p className="text-sm text-gray-400 line-clamp-2">{job.description}</p>
                </div>
                {/* Actions */}
                <div className="flex shrink-0 gap-2">
                  <button onClick={() => toggleActive(job)} title={job.active ? 'Hide from public' : 'Show on public page'}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium border transition-colors ${job.active ? 'border-green-700 text-green-400 hover:bg-green-900/30' : 'border-gray-700 text-gray-400 hover:bg-gray-800'}`}>
                    {job.active ? 'Live' : 'Hidden'}
                  </button>
                  <button onClick={() => openEdit(job)} className="rounded-lg border border-gray-700 px-3 py-1.5 text-xs font-medium text-gray-300 hover:bg-gray-800">Edit</button>
                  <button onClick={() => doDelete(job.id)} disabled={deleting === job.id}
                    className="rounded-lg border border-red-800 px-3 py-1.5 text-xs font-medium text-red-400 hover:bg-red-900/30 disabled:opacity-50">
                    {deleting === job.id ? '…' : 'Delete'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Side panel */}
      {panelOpen && (
        <div className="fixed inset-0 z-40 flex">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setPanelOpen(false)} />
          <div className="relative ml-auto z-50 h-full w-full max-w-lg bg-gray-900 border-l border-gray-800 flex flex-col overflow-hidden">
            {/* Panel header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 shrink-0">
              <h2 className="font-bold text-lg">{editingId ? 'Edit Job' : 'New Job'}</h2>
              <button onClick={() => setPanelOpen(false)} className="text-gray-400 hover:text-white">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            {/* Panel body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className={labelCls}>Title *</label>
                  <input className={inputCls} value={form.title} onChange={e => setField('title', e.target.value)} placeholder="e.g. Network Engineer" />
                </div>
                {!editingId && (
                  <div className="col-span-2">
                    <label className={labelCls}>ID / Slug *</label>
                    <input className={inputCls} value={form.id} onChange={e => setField('id', e.target.value.toLowerCase().replace(/\s+/g, '-'))} placeholder="e.g. network-engineer" />
                    <p className="text-xs text-gray-500 mt-1">Lowercase, hyphens only. Auto-filled from title if left blank on save.</p>
                  </div>
                )}
                <div>
                  <label className={labelCls}>Department</label>
                  <select className={inputCls} value={form.department} onChange={e => setField('department', e.target.value)}>
                    {DEPT_OPTIONS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Type</label>
                  <select className={inputCls} value={form.type} onChange={e => setField('type', e.target.value)}>
                    {TYPE_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className={labelCls}>Location</label>
                  <input className={inputCls} value={form.location} onChange={e => setField('location', e.target.value)} placeholder="e.g. Baghdad, Iraq" />
                </div>
              </div>
              <div>
                <label className={labelCls}>Description</label>
                <textarea className={inputCls} rows={4} value={form.description} onChange={e => setField('description', e.target.value)} placeholder="Short job summary shown on the careers page…" />
              </div>
              <div>
                <label className={labelCls}>Requirements</label>
                <ReqsEditor items={form.requirements} onChange={v => setField('requirements', v)} />
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" id="activeToggle" className="h-4 w-4 rounded accent-[#00C46A]" checked={form.active} onChange={e => setField('active', e.target.checked)} />
                <label htmlFor="activeToggle" className="text-sm text-gray-300 cursor-pointer">Visible on public /careers page</label>
              </div>
              {formError && <p className="text-sm text-red-400">{formError}</p>}
            </div>
            {/* Panel footer */}
            <div className="shrink-0 px-6 py-4 border-t border-gray-800 flex gap-3">
              <button onClick={() => setPanelOpen(false)} className="flex-1 rounded-lg border border-gray-700 py-2.5 text-sm font-medium text-gray-300 hover:bg-gray-800">Cancel</button>
              <button onClick={save} disabled={saving} className="flex-1 rounded-lg bg-[#00C46A] py-2.5 text-sm font-semibold text-white hover:bg-[#00C46A]/80 disabled:opacity-60 flex items-center justify-center gap-2">
                {saving && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />}
                {saving ? 'Saving…' : editingId ? 'Save Changes' : 'Create Job'}
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && <Toast {...toast} />}
    </div>
  );
}
