'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import type { StoredPartner } from '@/types';

const EMPTY_FORM = {
  name: '', description: '', category: '', logo: '', logoDark: '', url: '',
};

// ─── Icon helpers ───────────────────────────────────────────────
const IconUp = () => (
  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
  </svg>
);
const IconDown = () => (
  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
  </svg>
);
const IconTop = () => (
  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l7.5-7.5 7.5 7.5M4.5 19.5l7.5-7.5 7.5 7.5" />
  </svg>
);
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
const IconX = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);
const IconUpload = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
  </svg>
);
const IconPlus = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
);
const IconTag = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
  </svg>
);

// ─── Input / label styles ────────────────────────────────────────
const inputCls = 'w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-[#00C46A] focus:outline-none focus:ring-1 focus:ring-[#00C46A]/40 transition-colors';
const labelCls = 'block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5';

// ─── Main component ─────────────────────────────────────────────
export default function AdminPartnersPage() {
  const [partners,   setPartners]   = useState<StoredPartner[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [filter,     setFilter]     = useState('All');
  const [search,     setSearch]     = useState('');

  // Add / Edit panel
  const [panelOpen,  setPanelOpen]  = useState(false);
  const [editingId,  setEditingId]  = useState<string | null>(null);
  const [form,       setForm]       = useState({ ...EMPTY_FORM });
  const [saving,     setSaving]     = useState(false);
  const [formError,  setFormError]  = useState('');

  // Logo upload
  const logoRef     = useRef<HTMLInputElement>(null);
  const logoDarkRef = useRef<HTMLInputElement>(null);
  const [uploadingLogo,     setUploadingLogo]     = useState(false);
  const [uploadingLogoDark, setUploadingLogoDark] = useState(false);

  // Category modal
  const [catModalOpen,  setCatModalOpen]  = useState(false);
  const [newCatName,    setNewCatName]    = useState('');
  const [renamingCat,   setRenamingCat]   = useState<string | null>(null);
  const [renameCatVal,  setRenameCatVal]  = useState('');
  const [catError,      setCatError]      = useState('');
  const [catSaving,     setCatSaving]     = useState(false);

  // Row actions
  const [reordering, setReordering] = useState<string | null>(null);
  const [deleting,   setDeleting]   = useState<string | null>(null);

  // ─── Data loading ──────────────────────────────────────────────
  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res  = await fetch('/api/admin/partners', { cache: 'no-store' });
      const data = await res.json();
      setPartners(data.partners ?? []);
      setCategories(data.categories ?? []);
    } catch { /* silent */ }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  // ─── Panel helpers ─────────────────────────────────────────────
  function openAdd() {
    setEditingId(null);
    setForm({ ...EMPTY_FORM });
    setFormError('');
    setPanelOpen(true);
  }

  function openEdit(p: StoredPartner) {
    setEditingId(p.id);
    setForm({
      name:        p.name,
      description: p.description,
      category:    p.category,
      logo:        p.logo        ?? '',
      logoDark:    p.logoDark    ?? '',
      url:         p.url         ?? '',
    });
    setFormError('');
    setPanelOpen(true);
  }

  function closePanel() {
    setPanelOpen(false);
    setEditingId(null);
    setFormError('');
  }

  // ─── Logo upload ───────────────────────────────────────────────
  async function uploadLogo(file: File, dark: boolean) {
    if (dark) setUploadingLogoDark(true); else setUploadingLogo(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res  = await fetch('/api/upload/partners', { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Upload failed');
      setForm((f) => ({ ...f, [dark ? 'logoDark' : 'logo']: data.url }));
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Upload failed');
    }
    if (dark) setUploadingLogoDark(false); else setUploadingLogo(false);
  }

  // ─── Save partner ──────────────────────────────────────────────
  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim())     { setFormError('Name is required.');     return; }
    if (!form.category.trim()) { setFormError('Category is required.'); return; }
    setSaving(true);
    setFormError('');

    const url    = editingId ? `/api/admin/partners/${editingId}` : '/api/admin/partners';
    const method = editingId ? 'PUT' : 'POST';

    try {
      const res  = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name:        form.name.trim(),
          description: form.description.trim(),
          category:    form.category.trim(),
          logo:        form.logo        || undefined,
          logoDark:    form.logoDark    || undefined,
          url:         form.url         || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Save failed');
      await load();
      closePanel();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Save failed');
    }
    setSaving(false);
  }

  // ─── Delete partner ────────────────────────────────────────────
  async function handleDelete(p: StoredPartner) {
    if (!confirm(`Delete "${p.name}"? This cannot be undone.`)) return;
    setDeleting(p.id);
    await fetch(`/api/admin/partners/${p.id}`, { method: 'DELETE' });
    await load();
    setDeleting(null);
  }

  // ─── Reorder ───────────────────────────────────────────────────
  async function handleReorder(id: string, action: 'move-up' | 'move-down' | 'move-top') {
    setReordering(id + action);
    await fetch(`/api/admin/partners/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action }),
    });
    await load();
    setReordering(null);
  }

  // ─── Categories ────────────────────────────────────────────────
  async function handleAddCategory() {
    if (!newCatName.trim()) { setCatError('Name is required.'); return; }
    setCatSaving(true); setCatError('');
    const res  = await fetch('/api/admin/partners/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newCatName.trim() }),
    });
    const data = await res.json();
    if (!res.ok) { setCatError(data.error ?? 'Failed'); setCatSaving(false); return; }
    setNewCatName('');
    await load();
    setCatSaving(false);
  }

  async function handleRenameCategory(oldName: string) {
    if (!renameCatVal.trim()) { setCatError('Name is required.'); return; }
    setCatSaving(true); setCatError('');
    const res  = await fetch(`/api/admin/partners/categories/${encodeURIComponent(oldName)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: renameCatVal.trim() }),
    });
    const data = await res.json();
    if (!res.ok) { setCatError(data.error ?? 'Failed'); setCatSaving(false); return; }
    setRenamingCat(null);
    setRenameCatVal('');
    await load();
    setCatSaving(false);
  }

  async function handleDeleteCategory(name: string) {
    if (!confirm(`Delete category "${name}"? It must have no partners.`)) return;
    setCatSaving(true); setCatError('');
    const res  = await fetch(`/api/admin/partners/categories/${encodeURIComponent(name)}`, { method: 'DELETE' });
    const data = await res.json();
    if (!res.ok) { setCatError(data.error ?? 'Failed'); setCatSaving(false); return; }
    await load();
    setCatSaving(false);
  }

  // ─── Filtered list ─────────────────────────────────────────────
  const filtered = partners
    .filter((p) => filter === 'All' || p.category === filter)
    .filter((p) => !search || p.name.toLowerCase().includes(search.toLowerCase()));

  // ─── Render ────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col">

      {/* ── Page header ── */}
      <div className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-gray-800 bg-gray-900/95 backdrop-blur px-6 py-4">
        <div>
          <h1 className="text-lg font-bold text-white">Partners</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            {partners.length} partner{partners.length !== 1 ? 's' : ''} · {categories.length} categories
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setCatModalOpen(true); setCatError(''); setNewCatName(''); setRenamingCat(null); }}
            className="flex items-center gap-1.5 rounded-lg border border-gray-700 bg-gray-800 px-3.5 py-2 text-sm text-gray-300 hover:border-gray-600 hover:text-white transition-colors"
          >
            <IconTag />
            Categories
          </button>
          <button
            onClick={openAdd}
            className="flex items-center gap-1.5 rounded-lg bg-[#00C46A] px-3.5 py-2 text-sm font-semibold text-white hover:bg-[#00C46A]/90 transition-colors"
          >
            <IconPlus />
            Add Partner
          </button>
        </div>
      </div>

      {/* ── Filters ── */}
      <div className="border-b border-gray-800 bg-gray-900 px-6 py-3 flex items-center gap-4 flex-wrap">
        {/* Search */}
        <div className="relative">
          <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search partners…"
            className="w-52 rounded-lg border border-gray-700 bg-gray-800 pl-8 pr-3 py-1.5 text-sm text-white placeholder-gray-500 focus:border-[#00C46A] focus:outline-none"
          />
        </div>
        {/* Category tabs */}
        <div className="flex flex-wrap items-center gap-1.5">
          {['All', ...categories].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`rounded-full px-3.5 py-1 text-xs font-semibold transition-colors ${
                filter === cat
                  ? 'bg-[#00C46A]/20 text-[#00C46A] border border-[#00C46A]/40'
                  : 'border border-gray-700 text-gray-400 hover:border-gray-600 hover:text-white'
              }`}
            >
              {cat}
              {cat !== 'All' && (
                <span className="ml-1.5 opacity-60">
                  {partners.filter((p) => p.category === cat).length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── Partner table ── */}
      <div className="flex-1 overflow-auto px-6 py-5">
        {loading ? (
          <div className="flex items-center justify-center py-24 text-gray-500">
            <svg className="w-5 h-5 animate-spin mr-2" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Loading partners…
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="text-gray-600 text-4xl mb-3">🤝</div>
            <p className="text-gray-400 font-medium">No partners found</p>
            <p className="text-gray-600 text-sm mt-1">
              {search ? 'Try a different search term.' : 'Click "Add Partner" to add your first partner.'}
            </p>
          </div>
        ) : (
          <div className="rounded-xl border border-gray-800 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800 bg-gray-800/50">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider w-10">#</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider w-20">Logo</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Category</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider w-10">Dark</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p, idx) => {
                  const isReordering = reordering?.startsWith(p.id);
                  const isDeleting   = deleting === p.id;
                  return (
                    <tr key={p.id} className={`border-b border-gray-800/60 transition-colors ${isDeleting ? 'opacity-40' : 'hover:bg-gray-800/30'}`}>
                      {/* Order # */}
                      <td className="px-4 py-3 text-gray-600 font-mono text-xs">{p.order + 1}</td>

                      {/* Logo */}
                      <td className="px-4 py-3">
                        <div className="w-12 h-8 rounded bg-white flex items-center justify-center overflow-hidden flex-shrink-0">
                          {p.logo ? (
                            <Image src={p.logo} alt={p.name} width={48} height={32} className="object-contain w-full h-full p-1" />
                          ) : (
                            <span className="text-gray-400 text-[10px] font-bold">{p.name.charAt(0)}</span>
                          )}
                        </div>
                      </td>

                      {/* Name + description snippet */}
                      <td className="px-4 py-3">
                        <p className="font-semibold text-white">{p.name}</p>
                        {p.description && (
                          <p className="text-xs text-gray-500 mt-0.5 line-clamp-1 max-w-xs">{p.description}</p>
                        )}
                        {p.url && (
                          <a href={p.url} target="_blank" rel="noopener noreferrer" className="text-xs text-[#00C46A]/70 hover:text-[#00C46A] truncate block max-w-xs">{p.url}</a>
                        )}
                      </td>

                      {/* Category */}
                      <td className="px-4 py-3">
                        <span className="inline-block rounded-full bg-gray-800 border border-gray-700 px-2.5 py-0.5 text-xs text-gray-300">
                          {p.category}
                        </span>
                      </td>

                      {/* Dark logo indicator */}
                      <td className="px-4 py-3">
                        {p.logoDark ? (
                          <div className="w-8 h-6 rounded bg-gray-900 border border-gray-700 flex items-center justify-center overflow-hidden">
                            <Image src={p.logoDark} alt="" width={32} height={24} className="object-contain w-full h-full p-0.5" />
                          </div>
                        ) : (
                          <span className="text-gray-700 text-xs">—</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          {/* Reorder */}
                          <div className="flex items-center gap-0.5 border border-gray-700 rounded-lg overflow-hidden">
                            <button
                              onClick={() => handleReorder(p.id, 'move-top')}
                              disabled={!!isReordering || idx === 0}
                              title="Move to top"
                              className="p-1.5 text-gray-400 hover:bg-gray-700 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            >
                              <IconTop />
                            </button>
                            <button
                              onClick={() => handleReorder(p.id, 'move-up')}
                              disabled={!!isReordering || idx === 0}
                              title="Move up"
                              className="p-1.5 text-gray-400 hover:bg-gray-700 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            >
                              <IconUp />
                            </button>
                            <button
                              onClick={() => handleReorder(p.id, 'move-down')}
                              disabled={!!isReordering || idx === filtered.length - 1}
                              title="Move down"
                              className="p-1.5 text-gray-400 hover:bg-gray-700 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            >
                              <IconDown />
                            </button>
                          </div>

                          {/* Edit */}
                          <button
                            onClick={() => openEdit(p)}
                            title="Edit"
                            className="p-1.5 rounded-lg text-gray-400 hover:bg-blue-500/15 hover:text-blue-400 transition-colors"
                          >
                            <IconEdit />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => handleDelete(p)}
                            disabled={isDeleting}
                            title="Delete"
                            className="p-1.5 rounded-lg text-gray-400 hover:bg-red-500/15 hover:text-red-400 disabled:opacity-40 transition-colors"
                          >
                            <IconTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Add / Edit Slide panel ── */}
      {/* Backdrop */}
      {panelOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={closePanel}
        />
      )}
      {/* Panel */}
      <div className={`fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-gray-950 border-l border-gray-800 shadow-2xl flex flex-col transition-transform duration-300 ${panelOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        {/* Panel header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-800 flex-shrink-0">
          <h2 className="text-base font-bold text-white">{editingId ? 'Edit Partner' : 'Add Partner'}</h2>
          <button onClick={closePanel} className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors">
            <IconX />
          </button>
        </div>

        {/* Panel body */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

          {/* Name */}
          <div>
            <label className={labelCls}>Partner Name *</label>
            <input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="e.g. Dell Technologies"
              maxLength={120}
              className={inputCls}
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className={labelCls}>Category *</label>
            {categories.length > 0 ? (
              <select
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                className={inputCls}
                required
              >
                <option value="">— Select category —</option>
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            ) : (
              <input
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                placeholder="e.g. Technology & Infrastructure"
                className={inputCls}
                required
              />
            )}
            <p className="text-xs text-gray-600 mt-1">
              Manage categories via the &ldquo;Categories&rdquo; button.
            </p>
          </div>

          {/* Description */}
          <div>
            <label className={labelCls}>Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Short description of this partner…"
              rows={4}
              maxLength={2000}
              className={`${inputCls} resize-none`}
            />
            <p className="text-right text-[10px] text-gray-600 mt-0.5">{form.description.length}/2000</p>
          </div>

          {/* Website URL */}
          <div>
            <label className={labelCls}>Website URL (optional)</label>
            <input
              value={form.url}
              onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
              type="url"
              placeholder="https://example.com"
              className={inputCls}
            />
          </div>

          {/* Logo (light mode) */}
          <div>
            <label className={labelCls}>Logo — Light Mode</label>
            <div className="flex items-center gap-3">
              {form.logo ? (
                <div className="w-20 h-14 rounded bg-white flex items-center justify-center overflow-hidden border border-gray-700 flex-shrink-0">
                  <Image src={form.logo} alt="" width={80} height={56} className="object-contain p-1 w-full h-full" />
                </div>
              ) : (
                <div className="w-20 h-14 rounded border-2 border-dashed border-gray-700 flex items-center justify-center text-gray-600 flex-shrink-0">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                  </svg>
                </div>
              )}
              <div className="flex flex-col gap-1.5 flex-1">
                <input ref={logoRef} type="file" accept="image/*" className="hidden"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadLogo(f, false); e.target.value = ''; }}
                />
                <button type="button" onClick={() => logoRef.current?.click()} disabled={uploadingLogo}
                  className="flex items-center justify-center gap-1.5 rounded-lg border border-gray-700 bg-gray-800 px-3 py-1.5 text-xs text-gray-300 hover:border-[#00C46A]/60 hover:text-[#00C46A] disabled:opacity-50 transition-colors">
                  {uploadingLogo ? 'Uploading…' : (<><IconUpload /> Upload Logo</>)}
                </button>
                {form.logo && (
                  <button type="button" onClick={() => setForm((f) => ({ ...f, logo: '' }))}
                    className="rounded-lg border border-gray-700 px-3 py-1.5 text-xs text-gray-500 hover:border-red-500/40 hover:text-red-400 transition-colors">
                    Remove
                  </button>
                )}
              </div>
            </div>
            <p className="text-xs text-gray-600 mt-1.5">For logos visible on white/light backgrounds.</p>
          </div>

          {/* Logo (dark mode) */}
          <div>
            <label className={labelCls}>Logo — Dark Mode (optional)</label>
            <div className="flex items-center gap-3">
              {form.logoDark ? (
                <div className="w-20 h-14 rounded bg-gray-800 border border-gray-700 flex items-center justify-center overflow-hidden flex-shrink-0">
                  <Image src={form.logoDark} alt="" width={80} height={56} className="object-contain p-1 w-full h-full" />
                </div>
              ) : (
                <div className="w-20 h-14 rounded border-2 border-dashed border-gray-700 flex items-center justify-center text-gray-600 flex-shrink-0">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                  </svg>
                </div>
              )}
              <div className="flex flex-col gap-1.5 flex-1">
                <input ref={logoDarkRef} type="file" accept="image/*" className="hidden"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadLogo(f, true); e.target.value = ''; }}
                />
                <button type="button" onClick={() => logoDarkRef.current?.click()} disabled={uploadingLogoDark}
                  className="flex items-center justify-center gap-1.5 rounded-lg border border-gray-700 bg-gray-800 px-3 py-1.5 text-xs text-gray-300 hover:border-[#00C46A]/60 hover:text-[#00C46A] disabled:opacity-50 transition-colors">
                  {uploadingLogoDark ? 'Uploading…' : (<><IconUpload /> Upload Dark Logo</>)}
                </button>
                {form.logoDark && (
                  <button type="button" onClick={() => setForm((f) => ({ ...f, logoDark: '' }))}
                    className="rounded-lg border border-gray-700 px-3 py-1.5 text-xs text-gray-500 hover:border-red-500/40 hover:text-red-400 transition-colors">
                    Remove
                  </button>
                )}
              </div>
            </div>
            <p className="text-xs text-gray-600 mt-1.5">Only needed for logos that are black or invisible on dark backgrounds.</p>
          </div>

          {formError && (
            <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2.5 text-sm text-red-400">
              {formError}
            </div>
          )}
        </form>

        {/* Panel footer */}
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-gray-800 flex-shrink-0">
          <button type="button" onClick={closePanel} className="rounded-lg border border-gray-700 px-4 py-2 text-sm text-gray-400 hover:text-white hover:border-gray-600 transition-colors">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || uploadingLogo || uploadingLogoDark}
            className="flex items-center gap-1.5 rounded-lg bg-[#00C46A] px-4 py-2 text-sm font-semibold text-white hover:bg-[#00C46A]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {saving ? (
              <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg> Saving…</>
            ) : editingId ? 'Save Changes' : 'Add Partner'}
          </button>
        </div>
      </div>

      {/* ── Category Manager Modal ── */}
      {catModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setCatModalOpen(false)} />
          <div className="relative w-full max-w-md rounded-2xl bg-gray-950 border border-gray-800 shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-800">
              <h2 className="text-base font-bold text-white">Manage Categories</h2>
              <button onClick={() => setCatModalOpen(false)} className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors">
                <IconX />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-5 space-y-4 max-h-[60vh] overflow-y-auto">
              {/* Add new */}
              <div>
                <label className={labelCls}>Add New Category</label>
                <div className="flex gap-2">
                  <input
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddCategory(); }}}
                    placeholder="Category name…"
                    maxLength={80}
                    className={`${inputCls} flex-1`}
                  />
                  <button
                    onClick={handleAddCategory}
                    disabled={catSaving}
                    className="flex items-center gap-1 rounded-lg bg-[#00C46A] px-3 py-2 text-sm font-semibold text-white hover:bg-[#00C46A]/90 disabled:opacity-50 transition-colors flex-shrink-0"
                  >
                    <IconPlus /> Add
                  </button>
                </div>
              </div>

              {catError && (
                <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-400">
                  {catError}
                </div>
              )}

              {/* Existing categories */}
              <div>
                <label className={labelCls}>Existing Categories</label>
                <div className="space-y-1.5">
                  {categories.length === 0 && (
                    <p className="text-sm text-gray-600 text-center py-4">No categories yet.</p>
                  )}
                  {categories.map((cat) => {
                    const count = partners.filter((p) => p.category === cat).length;
                    const isRenaming = renamingCat === cat;
                    return (
                      <div key={cat} className="flex items-center gap-2 rounded-lg border border-gray-800 bg-gray-900 px-3 py-2">
                        {isRenaming ? (
                          <>
                            <input
                              value={renameCatVal}
                              onChange={(e) => setRenameCatVal(e.target.value)}
                              onKeyDown={(e) => { if (e.key === 'Enter') handleRenameCategory(cat); if (e.key === 'Escape') { setRenamingCat(null); setRenameCatVal(''); } }}
                              autoFocus
                              className={`${inputCls} flex-1 py-1`}
                            />
                            <button onClick={() => handleRenameCategory(cat)} disabled={catSaving}
                              className="text-xs text-[#00C46A] hover:text-[#00C46A]/80 font-semibold disabled:opacity-50">
                              Save
                            </button>
                            <button onClick={() => { setRenamingCat(null); setRenameCatVal(''); }}
                              className="text-xs text-gray-500 hover:text-white">
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <span className="flex-1 text-sm text-white">{cat}</span>
                            <span className="text-xs text-gray-600 font-mono">{count} partner{count !== 1 ? 's' : ''}</span>
                            <button
                              onClick={() => { setRenamingCat(cat); setRenameCatVal(cat); setCatError(''); }}
                              className="p-1 rounded text-gray-400 hover:text-blue-400 transition-colors"
                              title="Rename"
                            >
                              <IconEdit />
                            </button>
                            <button
                              onClick={() => handleDeleteCategory(cat)}
                              disabled={count > 0}
                              title={count > 0 ? 'Move all partners out first' : 'Delete'}
                              className="p-1 rounded text-gray-400 hover:text-red-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            >
                              <IconTrash />
                            </button>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end px-6 py-4 border-t border-gray-800">
              <button onClick={() => setCatModalOpen(false)} className="rounded-lg bg-gray-800 px-4 py-2 text-sm text-white hover:bg-gray-700 transition-colors">
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
