'use client';

import { useState, useEffect, useCallback } from 'react';

interface PendingChange {
  id: string;
  resource: 'service' | 'solution' | 'partner';
  action: 'create' | 'update' | 'delete';
  resourceId: string;
  resourceTitle: string;
  submittedBy: string;
  submittedAt: string;
  payload: unknown;
  originalData?: unknown;
  status: 'pending' | 'approved' | 'rejected';
  reviewedBy?: string;
  reviewedAt?: string;
  reviewNote?: string;
}

// ─── icon helpers ─────────────────────────────────────────────────
const IconCheck = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
  </svg>
);
const IconX = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);
const IconChevron = ({ open }: { open: boolean }) => (
  <svg className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
  </svg>
);

// ─── colour maps ──────────────────────────────────────────────────
const resourceColor: Record<string, string> = {
  service:  'bg-blue-500/20 text-blue-300 border-blue-500/30',
  solution: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  partner:  'bg-orange-500/20 text-orange-300 border-orange-500/30',
};
const actionColor: Record<string, string> = {
  create: 'bg-green-500/20 text-green-300 border-green-500/30',
  update: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  delete: 'bg-red-500/20 text-red-300 border-red-500/30',
};
const statusColor: Record<string, string> = {
  pending:  'bg-yellow-500/20 text-yellow-300',
  approved: 'bg-green-500/20 text-green-300',
  rejected: 'bg-red-500/20 text-red-300',
};

function fmtDate(iso: string) {
  try {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    }).format(new Date(iso));
  } catch { return iso; }
}

// ─── Payload viewer ───────────────────────────────────────────────
function PayloadViewer({ label, data }: { label: string; data: unknown }) {
  if (data === undefined || data === null) return null;
  const json = JSON.stringify(data, null, 2);
  return (
    <div>
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{label}</p>
      <pre className="text-xs text-gray-300 bg-gray-900 rounded-lg p-3 overflow-x-auto max-h-64 border border-gray-700 whitespace-pre-wrap break-words">{json}</pre>
    </div>
  );
}

// ─── Reject modal ─────────────────────────────────────────────────
function RejectModal({
  change, onClose, onReject,
}: { change: PendingChange; onClose: () => void; onReject: (note: string) => void }) {
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit() {
    setLoading(true);
    await onReject(note);
    setLoading(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-gray-700 bg-gray-900 p-6 shadow-2xl">
        <h3 className="text-base font-bold mb-1">Reject Change</h3>
        <p className="text-sm text-gray-400 mb-4">
          Rejecting: <span className="text-white font-medium">{change.resourceTitle}</span>
          {' '}({change.resource} {change.action})
        </p>
        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
          Reason / Note (optional)
        </label>
        <textarea
          className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-red-500 focus:outline-none resize-none"
          rows={3} placeholder="e.g. Missing required fields, incorrect content…"
          value={note} onChange={e => setNote(e.target.value)}
        />
        <div className="flex justify-end gap-3 mt-4">
          <button onClick={onClose} className="rounded-lg border border-gray-700 px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors">
            Cancel
          </button>
          <button onClick={submit} disabled={loading} className="rounded-lg bg-red-500 px-5 py-2 text-sm font-semibold text-white hover:bg-red-400 disabled:opacity-40 transition-colors">
            {loading ? 'Rejecting…' : 'Reject'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Change card ──────────────────────────────────────────────────
function ChangeCard({
  change, onApprove, onReject,
}: {
  change: PendingChange;
  onApprove: (id: string) => void;
  onReject: (change: PendingChange) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const isPending = change.status === 'pending';

  return (
    <div className={`rounded-xl border bg-gray-900/60 ${isPending ? 'border-gray-700' : 'border-gray-800'} overflow-hidden`}>
      {/* Card header */}
      <div className="px-5 py-4 flex items-start gap-4">
        {/* Badges */}
        <div className="flex flex-col gap-1.5 shrink-0 mt-0.5">
          <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold capitalize ${resourceColor[change.resource]}`}>
            {change.resource}
          </span>
          <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold capitalize ${actionColor[change.action]}`}>
            {change.action}
          </span>
        </div>

        {/* Main info */}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-white truncate">{change.resourceTitle}</p>
          <p className="text-xs text-gray-400 mt-0.5">
            ID: <span className="font-mono">{change.resourceId}</span>
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Submitted by <span className="text-gray-300">{change.submittedBy}</span>
            {' · '}{fmtDate(change.submittedAt)}
          </p>
          {!isPending && (
            <p className="text-xs text-gray-500 mt-1">
              <span className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-xs font-semibold ${statusColor[change.status]}`}>
                {change.status}
              </span>
              {' '}by <span className="text-gray-300">{change.reviewedBy}</span>
              {change.reviewedAt && (' · ' + fmtDate(change.reviewedAt))}
            </p>
          )}
          {change.reviewNote && (
            <p className="text-xs text-gray-400 mt-1 italic">Note: {change.reviewNote}</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {isPending && (
            <>
              <button
                onClick={() => onApprove(change.id)}
                className="flex items-center gap-1.5 rounded-lg bg-green-500/10 border border-green-500/30 px-3 py-1.5 text-xs font-semibold text-green-300 hover:bg-green-500/20 transition-colors"
              >
                <IconCheck /> Approve
              </button>
              <button
                onClick={() => onReject(change)}
                className="flex items-center gap-1.5 rounded-lg bg-red-500/10 border border-red-500/30 px-3 py-1.5 text-xs font-semibold text-red-300 hover:bg-red-500/20 transition-colors"
              >
                <IconX /> Reject
              </button>
            </>
          )}
          <button
            onClick={() => setExpanded(v => !v)}
            className="rounded-lg border border-gray-700 p-1.5 text-gray-400 hover:text-white hover:border-gray-500 transition-colors"
          >
            <IconChevron open={expanded} />
          </button>
        </div>
      </div>

      {/* Expanded payload */}
      {expanded && (
        <div className="border-t border-gray-800 px-5 py-4 space-y-4">
          {change.action === 'delete' ? (
            <div>
              <p className="text-sm text-red-400 font-medium mb-2">This request will permanently delete the {change.resource}.</p>
              {!!change.originalData && <PayloadViewer label="Current data (will be deleted)" data={change.originalData} />}
            </div>
          ) : change.action === 'update' && change.originalData ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <PayloadViewer label="Before (current)" data={change.originalData} />
              <PayloadViewer label="After (proposed)" data={change.payload} />
            </div>
          ) : (
            <PayloadViewer label="New data" data={change.payload} />
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────
type TabStatus = 'pending' | 'approved' | 'rejected' | 'all';

export default function AdminApprovalsPage() {
  const [changes, setChanges] = useState<PendingChange[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab,     setTab]     = useState<TabStatus>('pending');
  const [acting,  setActing]  = useState<string | null>(null);

  const [rejectTarget, setRejectTarget] = useState<PendingChange | null>(null);

  const load = useCallback(async (status: TabStatus = tab) => {
    setLoading(true);
    try {
      const res  = await fetch(`/api/admin/pending?status=${status}`, { cache: 'no-store' });
      const data = await res.json();
      if (res.ok) setChanges((data.changes ?? []).reverse());
    } finally { setLoading(false); }
  }, [tab]);

  useEffect(() => { load(tab); }, [tab]); // eslint-disable-line

  async function approve(id: string) {
    setActing(id);
    try {
      const res  = await fetch(`/api/admin/pending/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ decision: 'approve' }),
      });
      if (res.ok) await load(tab);
    } finally { setActing(null); }
  }

  async function reject(change: PendingChange, note: string) {
    setActing(change.id);
    try {
      const res = await fetch(`/api/admin/pending/${change.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ decision: 'reject', note }),
      });
      if (res.ok) { setRejectTarget(null); await load(tab); }
    } finally { setActing(null); }
  }

  const pendingCount = changes.filter(c => c.status === 'pending').length;

  const TABS: { key: TabStatus; label: string }[] = [
    { key: 'pending',  label: 'Pending' },
    { key: 'approved', label: 'Approved' },
    { key: 'rejected', label: 'Rejected' },
    { key: 'all',      label: 'All' },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="sticky top-0 z-30 border-b border-gray-800 bg-gray-950/90 backdrop-blur px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2">
              Approvals
              {tab === 'pending' && pendingCount > 0 && (
                <span className="inline-flex items-center justify-center min-w-[20px] h-5 rounded-full bg-yellow-500 px-1.5 text-xs font-bold text-black">
                  {pendingCount}
                </span>
              )}
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">Review and approve editor-submitted changes</p>
          </div>
          <button onClick={() => load(tab)} className="rounded-lg border border-gray-700 px-3 py-1.5 text-xs text-gray-400 hover:text-white transition-colors">
            Refresh
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mt-4">
          {TABS.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                tab === t.key
                  ? 'bg-[#00C46A] text-black'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="px-6 py-6 space-y-4 max-w-5xl">
        {loading ? (
          <p className="text-gray-500 text-sm">Loading…</p>
        ) : changes.length === 0 ? (
          <div className="rounded-xl border border-gray-800 bg-gray-900/40 px-6 py-12 text-center">
            <p className="text-gray-400 text-sm">
              {tab === 'pending' ? 'No pending changes — all caught up! ✓' : `No ${tab} changes found.`}
            </p>
          </div>
        ) : (
          changes.map(c => (
            <div key={c.id} className={acting === c.id ? 'opacity-50 pointer-events-none' : ''}>
              <ChangeCard
                change={c}
                onApprove={approve}
                onReject={setRejectTarget}
              />
            </div>
          ))
        )}
      </div>

      {/* Reject modal */}
      {rejectTarget && (
        <RejectModal
          change={rejectTarget}
          onClose={() => setRejectTarget(null)}
          onReject={(note) => reject(rejectTarget, note)}
        />
      )}
    </div>
  );
}
