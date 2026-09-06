// ─── Activity Log (server-only) ───────────────────────────────
// Stores activity in .admin-activity.json at project root
import fs from 'fs';
import path from 'path';

export type LogAction =
  | 'login'
  | 'logout'
  | 'login_failed'
  | 'totp_setup'
  | 'totp_reset'
  | 'blog_create'
  | 'blog_update'
  | 'blog_delete'
  | 'user_create'
  | 'user_update'
  | 'user_delete'
  | 'partner_create'
  | 'partner_update'
  | 'partner_delete'
  | 'partner_create_pending'
  | 'partner_update_pending'
  | 'partner_delete_pending'
  | 'service_create'
  | 'service_update'
  | 'service_delete'
  | 'service_create_pending'
  | 'service_update_pending'
  | 'service_delete_pending'
  | 'solution_create'
  | 'solution_update'
  | 'solution_delete'
  | 'solution_create_pending'
  | 'solution_update_pending'
  | 'solution_delete_pending'
  | 'csr_update'
  | 'csr_update_pending'
  | 'job_create'
  | 'job_update'
  | 'job_delete'
  | 'change_approve'
  | 'change_reject'
  | 'change_dismiss'
  | 'category_create'
  | 'category_rename'
  | 'category_delete';

export interface LogEntry {
  id: string;
  timestamp: string;
  userId: string;
  username: string;
  role: string;
  action: LogAction;
  detail: string;   // human-readable description
  ip: string;
}

const LOG_FILE    = path.join(process.cwd(), '.admin-activity.json');
const MAX_ENTRIES = 1000; // keep last 1000 entries

function readLog(): LogEntry[] {
  if (!fs.existsSync(LOG_FILE)) return [];
  try {
    return JSON.parse(fs.readFileSync(LOG_FILE, 'utf-8')) as LogEntry[];
  } catch {
    return [];
  }
}

export function appendLog(entry: Omit<LogEntry, 'id' | 'timestamp'>) {
  const entries = readLog();
  const newEntry: LogEntry = {
    id:        `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    timestamp: new Date().toISOString(),
    ...entry,
  };
  // Prepend (newest first) and cap at MAX_ENTRIES
  const trimmed = [newEntry, ...entries].slice(0, MAX_ENTRIES);
  fs.writeFileSync(LOG_FILE, JSON.stringify(trimmed, null, 2), 'utf-8');
}

export function getLogs(opts?: {
  userId?: string;
  action?: LogAction;
  limit?: number;
  offset?: number;
}): { entries: LogEntry[]; total: number } {
  let entries = readLog();

  if (opts?.userId) entries = entries.filter((e) => e.userId === opts.userId);
  if (opts?.action)  entries = entries.filter((e) => e.action  === opts.action);

  const total  = entries.length;
  const offset = opts?.offset ?? 0;
  const limit  = opts?.limit  ?? 50;

  return { entries: entries.slice(offset, offset + limit), total };
}
