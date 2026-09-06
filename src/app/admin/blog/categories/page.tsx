'use client';

import { useState, useEffect, useCallback } from 'react';

const DEFAULT_CATS = ['Cybersecurity', 'IT Infrastructure', 'AI & Innovation', 'Government Tech', 'Project', 'Industry News'];

export default function AdminBlogCategoriesPage() {
    const [categories, setCategories] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [newName, setNewName] = useState('');
    const [adding, setAdding] = useState(false);
    const [editingIdx, setEditingIdx] = useState<number | null>(null);
    const [editValue, setEditValue] = useState('');
    const [saving, setSaving] = useState(false);
    const [deletingIdx, setDeletingIdx] = useState<number | null>(null);
    const [toast, setToast] = useState<{ msg: string; type: 'ok' | 'err' } | null>(null);

    const showToast = (msg: string, type: 'ok' | 'err' = 'ok') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/blog/categories', { cache: 'no-store' });
            const data = await res.json();
            setCategories(Array.isArray(data) ? data : DEFAULT_CATS);
        } catch {
            setCategories(DEFAULT_CATS);
        }
        setLoading(false);
    }, []);

    useEffect(() => { load(); }, [load]);

    async function handleAdd(e: React.FormEvent) {
        e.preventDefault();
        const trimmed = newName.trim();
        if (!trimmed) return;
        if (categories.includes(trimmed)) { showToast('Category already exists.', 'err'); return; }
        setAdding(true);
        try {
            const res = await fetch('/api/blog/categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: trimmed }),
            });
            if (res.ok) {
                const updated = await res.json();
                setCategories(updated);
                setNewName('');
                showToast(`"${trimmed}" added.`);
            } else {
                const err = await res.json();
                showToast(err.error ?? 'Failed to add.', 'err');
            }
        } catch {
            showToast('Network error.', 'err');
        }
        setAdding(false);
    }

    async function handleRename(oldName: string) {
        const trimmed = editValue.trim();
        if (!trimmed || trimmed === oldName) { setEditingIdx(null); return; }
        if (categories.includes(trimmed)) { showToast('Name already exists.', 'err'); return; }
        setSaving(true);
        try {
            const res = await fetch(`/api/blog/categories/${encodeURIComponent(oldName)}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: trimmed }),
            });
            if (res.ok) {
                const updated = await res.json();
                setCategories(updated);
                setEditingIdx(null);
                showToast(`Renamed to "${trimmed}".`);
            } else {
                showToast('Failed to rename.', 'err');
            }
        } catch {
            showToast('Network error.', 'err');
        }
        setSaving(false);
    }

    async function handleDelete(name: string, idx: number) {
        if (!confirm(`Delete category "${name}"?\n\nExisting posts using this category will keep it as a label, but it won't appear in filters.`)) return;
        setDeletingIdx(idx);
        try {
            const res = await fetch(`/api/blog/categories/${encodeURIComponent(name)}`, { method: 'DELETE' });
            if (res.ok) {
                const updated = await res.json();
                setCategories(updated);
                showToast(`"${name}" deleted.`);
            } else {
                showToast('Failed to delete.', 'err');
            }
        } catch {
            showToast('Network error.', 'err');
        }
        setDeletingIdx(null);
    }

    const isDefault = (name: string) => DEFAULT_CATS.includes(name);

    return (
        <div className="p-8 max-w-2xl">
            {/* Toast */}
            {toast && (
                <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 rounded-xl px-5 py-3 text-sm font-semibold shadow-xl transition-all
          ${toast.type === 'ok' ? 'bg-[#00C46A] text-white' : 'bg-red-500 text-white'}`}>
                    {toast.type === 'ok'
                        ? <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                        : <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    }
                    {toast.msg}
                </div>
            )}

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-white">Blog Categories</h1>
                <p className="text-sm text-gray-400 mt-1">
                    {categories.length} categor{categories.length !== 1 ? 'ies' : 'y'} — these appear as filter tabs on the blog page and as options when creating posts.
                </p>
            </div>

            {/* Add form */}
            <form onSubmit={handleAdd} className="mb-8 flex gap-3">
                <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="New category name…"
                    maxLength={50}
                    className="flex-1 rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#00C46A] focus:ring-1 focus:ring-[#00C46A] transition"
                />
                <button
                    type="submit"
                    disabled={adding || !newName.trim()}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00C46A] text-white text-sm font-semibold hover:bg-[#00a858] disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                    {adding ? (
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" /></svg>
                    ) : (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                    )}
                    Add
                </button>
            </form>

            {/* Categories list */}
            {loading ? (
                <div className="flex items-center justify-center py-16">
                    <svg className="w-6 h-6 animate-spin text-gray-500" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" /></svg>
                </div>
            ) : (
                <div className="space-y-2">
                    {categories.map((cat, idx) => (
                        <div
                            key={cat}
                            className="flex items-center gap-3 rounded-xl border border-white/8 bg-white/4 px-4 py-3 group"
                        >
                            {/* Drag handle visual */}
                            <svg className="w-4 h-4 text-gray-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                            </svg>

                            {editingIdx === idx ? (
                                /* Rename input */
                                <div className="flex flex-1 items-center gap-2">
                                    <input
                                        autoFocus
                                        value={editValue}
                                        onChange={(e) => setEditValue(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') handleRename(cat);
                                            if (e.key === 'Escape') setEditingIdx(null);
                                        }}
                                        maxLength={50}
                                        className="flex-1 rounded-lg bg-white/10 border border-[#00C46A]/50 px-3 py-1.5 text-sm text-white focus:outline-none focus:border-[#00C46A]"
                                    />
                                    <button
                                        onClick={() => handleRename(cat)}
                                        disabled={saving}
                                        className="px-3 py-1.5 rounded-lg bg-[#00C46A] text-white text-xs font-semibold hover:bg-[#00a858] disabled:opacity-50 transition"
                                    >
                                        {saving ? '…' : 'Save'}
                                    </button>
                                    <button
                                        onClick={() => setEditingIdx(null)}
                                        className="px-3 py-1.5 rounded-lg bg-white/10 text-gray-300 text-xs font-semibold hover:bg-white/20 transition"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <span className="flex-1 text-sm font-medium text-white">{cat}</span>
                                    {isDefault(cat) && (
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#00C46A]/60 bg-[#00C46A]/10 rounded-full px-2 py-0.5">
                                            default
                                        </span>
                                    )}
                                    {/* Actions */}
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => { setEditingIdx(idx); setEditValue(cat); }}
                                            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition"
                                            title="Rename"
                                        >
                                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => handleDelete(cat, idx)}
                                            disabled={deletingIdx === idx}
                                            className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 disabled:opacity-50 transition"
                                            title="Delete"
                                        >
                                            {deletingIdx === idx ? (
                                                <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" /></svg>
                                            ) : (
                                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                    {categories.length === 0 && (
                        <p className="text-sm text-gray-500 py-8 text-center">No categories yet. Add one above.</p>
                    )}
                </div>
            )}

            <p className="mt-6 text-xs text-gray-600">
                Tip: Renaming a category also updates all existing posts that use it.
            </p>
        </div>
    );
}
