/**
 * Pending-changes store — all write mutations from non-superadmin users
 * are held here until a superadmin approves or rejects them.
 */
import fs   from 'fs';
import path from 'path';

const FILE = path.join(process.cwd(), 'pending-changes.json');

export type Resource = 'service' | 'solution' | 'partner' | 'csr';
export type Action   = 'create' | 'update' | 'delete';
export type Status   = 'pending' | 'approved' | 'rejected';

export interface PendingChange {
  id:            string;
  resource:      Resource;
  action:        Action;
  resourceId:    string;       // slug / id of the affected item
  resourceTitle: string;       // human-readable label
  submittedBy:   string;
  submittedAt:   string;       // ISO
  payload:       unknown;      // new data (create/update), undefined for delete
  originalData?: unknown;      // previous data snapshot (update)
  status:        Status;
  reviewedBy?:   string;
  reviewedAt?:   string;
  reviewNote?:   string;
}

// ─── helpers ─────────────────────────────────────────────────────
function read(): PendingChange[] {
  if (!fs.existsSync(FILE)) return [];
  try { return JSON.parse(fs.readFileSync(FILE, 'utf-8')); } catch { return []; }
}
function write(data: PendingChange[]): void {
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2), 'utf-8');
}
function uuid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
}

// ─── public API ──────────────────────────────────────────────────
export function getAllPending(): PendingChange[] {
  return read();
}

export function getPendingByStatus(status: Status): PendingChange[] {
  return read().filter(c => c.status === status);
}

export function getPendingById(id: string): PendingChange | null {
  return read().find(c => c.id === id) ?? null;
}

export function addPending(
  change: Omit<PendingChange, 'id' | 'submittedAt' | 'status'>,
): PendingChange {
  const all  = read();
  const item: PendingChange = {
    ...change,
    id:          uuid(),
    submittedAt: new Date().toISOString(),
    status:      'pending',
  };
  all.push(item);
  write(all);
  return item;
}

export function updatePendingStatus(
  id: string,
  status: Exclude<Status, 'pending'>,
  reviewedBy: string,
  reviewNote?: string,
): PendingChange | null {
  const all = read();
  const idx = all.findIndex(c => c.id === id);
  if (idx === -1) return null;
  all[idx] = {
    ...all[idx],
    status,
    reviewedBy,
    reviewedAt: new Date().toISOString(),
    reviewNote,
  };
  write(all);
  return all[idx];
}

export function deletePendingById(id: string): boolean {
  const all = read();
  const filtered = all.filter(c => c.id !== id);
  if (filtered.length === all.length) return false;
  write(filtered);
  return true;
}

export function getPendingCount(): number {
  return read().filter(c => c.status === 'pending').length;
}
