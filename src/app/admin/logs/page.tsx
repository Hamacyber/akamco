'use client';

import { useState, useEffect, useCallback } from 'react';

interface LogEntry {
  id: string;
  timestamp: string;
  userId: string;
  username: string;
  role: string;
  action: string;
  detail: string;
  ip: string;
}

const ACTION_COLORS: Record<string, string> = {
  login:        'text-green-400 bg-green-400/10',
  logout:       'text-gray-400 bg-gray-400/10',
  login_failed: 'text-red-400 bg-red-400/10',
  totp_setup:   'text-blue-400 bg-blue-400/10',
  totp_reset:   'text-amber-400 bg-amber-400/10',
  blog_create:  'text-emerald-400 bg-emerald-400/10',
  blog_update:  'text-yellow-400 bg-yellow-400/10',
  blog_delete:  'text-red-400 bg-red-400/10',
  user_create:  'text-purple-400 bg-purple-400/10',
  user_update:  'text-purple-400 bg-purple-400/10',
  user_delete:  'text-red-400 bg-red-400/10',
};

const ACTION_LABELS: Record<string, string> = {
  login:        'Login',
  logout:       'Logout',
  login_failed: 'Login Failed',
  totp_setup:   'TOTP Setup',
  totp_reset:   '2FA Reset',
  blog_create:  'Post Created',
  blog_update:  'Post Updated',
  blog_delete:  'Post Deleted',
  user_create:  'User Created',
  user_update:  'User Updated',
  user_delete:  'User Deleted',
};

const PAGE_SIZE = 50;

export default function LogsPage() {
  const [entries, setEntries] = useState<LogEntry[]>([]);
  const [total,   setTotal]   = useState(0);
  const [loading, setLoading] = useState(true);
  const [offset,  setOffset]  = useState(0);
  const [filterAction, setFilterAction] = useState('');
  const [filterUser,   setFilterUser]   = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: String(PAGE_SIZE), offset: String(offset) });
      if (filterAction) params.set('action', filterAction);
      if (filterUser)   params.set('userId', filterUser);
      const r = await fetch(`/api/admin/logs?${params}`);
      const d = await r.json();
      setEntries(d.entries ?? []);
      setTotal(d.total ?? 0);
    } catch {
      setEntries([]);
    } finally {
      setLoading(false);
    }
  }, [offset, filterAction, filterUser]);

  useEffect(() => { load(); }, [load]);

  function applyFilter() {
    setOffset(0);
    load();
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-white">Activity Logs</h1>
        <p className="text-sm text-gray-400 mt-0.5">{total} total entries — showing newest first</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <select
          value={filterAction}
          onChange={(e) => { setFilterAction(e.target.value); setOffset(0); }}
          className="px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#00C46A]/40"
        >
          <option value="">All actions</option>
          {Object.entries(ACTION_LABELS).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>

        <button
          onClick={() => { setFilterAction(''); setFilterUser(''); setOffset(0); }}
          className="px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-gray-400 text-sm hover:text-white hover:bg-gray-700 transition-colors"
        >
          Clear filters
        </button>

        <button
          onClick={load}
          className="ml-auto px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-gray-400 text-sm hover:text-white hover:bg-gray-700 transition-colors flex items-center gap-1.5"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" /></svg>
          Refresh
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-6 h-6 rounded-full border-2 border-[#00C46A] border-t-transparent animate-spin" />
        </div>
      ) : entries.length === 0 ? (
        <div className="text-center py-16 text-gray-500">No log entries found.</div>
      ) : (
        <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left px-4 py-3 text-gray-400 font-medium">Time</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium">User</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium">Action</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium">Detail</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium">IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/50">
              {entries.map((e) => {
                const color = ACTION_COLORS[e.action] ?? 'text-gray-400 bg-gray-400/10';
                const label = ACTION_LABELS[e.action] ?? e.action;
                const date  = new Date(e.timestamp);
                return (
                  <tr key={e.id} className="hover:bg-gray-700/20 transition-colors">
                    <td className="px-4 py-3 text-gray-400 whitespace-nowrap text-xs">
                      <div>{date.toLocaleDateString()}</div>
                      <div className="text-gray-600">{date.toLocaleTimeString()}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#00C46A]/15 text-[#00C46A] text-xs font-bold uppercase flex-shrink-0">
                          {e.username[0]}
                        </div>
                        <div>
                          <p className="text-white text-xs font-medium">{e.username}</p>
                          <p className="text-gray-600 text-[10px] capitalize">{e.role}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${color}`}>
                        {label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-300 text-xs max-w-xs truncate">{e.detail}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs font-mono">{e.ip}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {total > PAGE_SIZE && (
        <div className="flex items-center justify-between mt-4 text-sm text-gray-400">
          <span>Showing {offset + 1}–{Math.min(offset + PAGE_SIZE, total)} of {total}</span>
          <div className="flex gap-2">
            <button
              onClick={() => setOffset(Math.max(0, offset - PAGE_SIZE))}
              disabled={offset === 0}
              className="px-3 py-1.5 rounded-lg bg-gray-800 border border-gray-700 hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <button
              onClick={() => setOffset(offset + PAGE_SIZE)}
              disabled={offset + PAGE_SIZE >= total}
              className="px-3 py-1.5 rounded-lg bg-gray-800 border border-gray-700 hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
