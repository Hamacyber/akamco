'use client';

import { useState, useEffect, useCallback } from 'react';

interface User {
  id: string;
  username: string;
  role: string;
  totpConfigured: boolean;
  createdAt: string;
  createdBy: string;
  active: boolean;
}

export default function UsersPage() {
  const [users,   setUsers]   = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  // Create form
  const [showCreate, setShowCreate] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState<'editor' | 'superadmin'>('editor');
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState('');

  // Edit modal
  const [editUser, setEditUser] = useState<User | null>(null);
  const [editPassword, setEditPassword] = useState('');
  const [editRole, setEditRole] = useState<'editor' | 'superadmin'>('editor');
  const [editActive, setEditActive] = useState(true);
  const [saving, setSaving] = useState(false);

  // Reset 2FA
  const [resetting2FA, setResetting2FA] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch('/api/admin/users');
      const d = await r.json();
      if (!r.ok) throw new Error(d.error);
      setUsers(d.users);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load users.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    setCreateError('');
    try {
      const r = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: newUsername, password: newPassword, role: newRole }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error);
      setShowCreate(false);
      setNewUsername(''); setNewPassword(''); setNewRole('editor');
      load();
    } catch (e: unknown) {
      setCreateError(e instanceof Error ? e.message : 'Failed to create user.');
    } finally {
      setCreating(false);
    }
  }

  function openEdit(u: User) {
    setEditUser(u);
    setEditPassword('');
    setEditRole(u.role as 'editor' | 'superadmin');
    setEditActive(u.active);
  }

  async function handleEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editUser) return;
    setSaving(true);
    try {
      const body: Record<string, unknown> = { role: editRole, active: editActive };
      if (editPassword) body.password = editPassword;
      const r = await fetch(`/api/admin/users/${editUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error);
      setEditUser(null);
      load();
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : 'Failed to save.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(u: User) {
    if (!confirm(`Delete user "${u.username}"? This cannot be undone.`)) return;
    const r = await fetch(`/api/admin/users/${u.id}`, { method: 'DELETE' });
    if (r.ok) load();
    else {
      const d = await r.json();
      alert(d.error ?? 'Failed to delete.');
    }
  }

  async function handleReset2FA(u: User) {
    if (!confirm(`Reset 2FA for "${u.username}"?\n\nThey will be required to set up their authenticator app again on next login.`)) return;
    setResetting2FA(u.id);
    try {
      const r = await fetch(`/api/admin/users/${u.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reset-2fa' }),
      });
      const d = await r.json();
      if (!r.ok) { alert(d.error ?? 'Failed to reset 2FA.'); return; }
      load();
    } finally {
      setResetting2FA(null);
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-white">Users</h1>
          <p className="text-sm text-gray-400 mt-0.5">Manage admin panel access</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#00C46A] text-white text-sm font-semibold rounded-lg hover:bg-[#00a858] transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
          Add User
        </button>
      </div>

      {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

      {/* Users table */}
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-6 h-6 rounded-full border-2 border-[#00C46A] border-t-transparent animate-spin" />
        </div>
      ) : (
        <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left px-4 py-3 text-gray-400 font-medium">User</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium">Role</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium">2FA</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium">Status</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium">Created</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/50">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-gray-700/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#00C46A]/20 text-[#00C46A] text-xs font-bold uppercase flex-shrink-0">
                        {u.username[0]}
                      </div>
                      <span className="text-white font-medium">{u.username}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      u.role === 'superadmin' ? 'bg-purple-500/15 text-purple-400' : 'bg-blue-500/15 text-blue-400'
                    }`}>
                      {u.role === 'superadmin' ? 'Super Admin' : 'Editor'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {u.totpConfigured ? (
                      <span className="inline-flex items-center gap-1 text-xs text-green-400">
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>
                        Configured
                      </span>
                    ) : (
                      <span className="text-xs text-gray-500">Pending setup</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 text-xs ${u.active ? 'text-green-400' : 'text-gray-500'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${u.active ? 'bg-green-400' : 'bg-gray-600'}`} />
                      {u.active ? 'Active' : 'Disabled'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    {u.role !== 'superadmin' && (
                      <div className="flex items-center justify-end gap-1">
                        {/* Reset 2FA */}
                        {u.totpConfigured && (
                          <button
                            onClick={() => handleReset2FA(u)}
                            disabled={resetting2FA === u.id}
                            title="Reset 2FA"
                            className="p-1.5 text-gray-400 hover:text-amber-400 rounded-lg hover:bg-amber-500/10 transition-colors disabled:opacity-40"
                          >
                            {resetting2FA === u.id ? (
                              <div className="w-4 h-4 rounded-full border-2 border-amber-400/30 border-t-amber-400 animate-spin" />
                            ) : (
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                              </svg>
                            )}
                          </button>
                        )}
                        {/* Edit */}
                        <button onClick={() => openEdit(u)} className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-gray-700 transition-colors">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" /></svg>
                        </button>
                        {/* Delete */}
                        <button onClick={() => handleDelete(u)} className="p-1.5 text-gray-400 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-colors">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create user modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-gray-900 rounded-2xl border border-gray-700 p-6">
            <h2 className="text-lg font-bold text-white mb-4">Create User</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Username</label>
                <input
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  required
                  className="w-full px-3 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#00C46A]/40 focus:border-[#00C46A]/60"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="w-full px-3 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#00C46A]/40 focus:border-[#00C46A]/60"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Role</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as 'editor' | 'superadmin')}
                  className="w-full px-3 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#00C46A]/40"
                >
                  <option value="editor">Editor — can manage blog posts</option>
                  <option value="superadmin">Super Admin — full access</option>
                </select>
              </div>
              {createError && <p className="text-red-400 text-xs">{createError}</p>}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowCreate(false)} className="flex-1 px-4 py-2.5 rounded-lg bg-gray-800 text-gray-300 text-sm hover:bg-gray-700 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={creating} className="flex-1 px-4 py-2.5 rounded-lg bg-[#00C46A] text-white text-sm font-semibold hover:bg-[#00a858] disabled:opacity-50 transition-colors">
                  {creating ? 'Creating…' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit user modal */}
      {editUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-gray-900 rounded-2xl border border-gray-700 p-6">
            <h2 className="text-lg font-bold text-white mb-1">Edit User</h2>
            <p className="text-sm text-gray-400 mb-4">@{editUser.username}</p>
            <form onSubmit={handleEdit} className="space-y-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">New Password <span className="text-gray-600">(leave blank to keep current)</span></label>
                <input
                  type="password"
                  value={editPassword}
                  onChange={(e) => setEditPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#00C46A]/40 focus:border-[#00C46A]/60"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Role</label>
                <select
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value as 'editor' | 'superadmin')}
                  className="w-full px-3 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none"
                >
                  <option value="editor">Editor</option>
                  <option value="superadmin">Super Admin</option>
                </select>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setEditActive(!editActive)}
                  className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${editActive ? 'bg-[#00C46A]' : 'bg-gray-600'}`}
                >
                  <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${editActive ? 'translate-x-4' : 'translate-x-0'}`} />
                </button>
                <span className="text-sm text-gray-300">{editActive ? 'Active' : 'Disabled'}</span>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setEditUser(null)} className="flex-1 px-4 py-2.5 rounded-lg bg-gray-800 text-gray-300 text-sm hover:bg-gray-700 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="flex-1 px-4 py-2.5 rounded-lg bg-[#00C46A] text-white text-sm font-semibold hover:bg-[#00a858] disabled:opacity-50 transition-colors">
                  {saving ? 'Saving…' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
