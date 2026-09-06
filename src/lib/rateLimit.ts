// ─── In-memory rate limiter ────────────────────────────────────
// Limits failed login attempts per IP. Resets on success.

interface Entry {
  count:     number;
  lockedUntil: number; // epoch ms, 0 = not locked
}

const store = new Map<string, Entry>();

const MAX_ATTEMPTS  = 5;        // before lockout
const LOCKOUT_MS    = 15 * 60 * 1000; // 15 minutes

function getIp(req: Request): string {
  return (
    (req.headers as Headers).get('x-forwarded-for')?.split(',')[0]?.trim() ??
    'unknown'
  );
}

export function checkRateLimit(ip: string): { allowed: boolean; remaining: number; retryAfter?: number } {
  const now  = Date.now();
  const entry = store.get(ip) ?? { count: 0, lockedUntil: 0 };

  if (entry.lockedUntil > now) {
    return { allowed: false, remaining: 0, retryAfter: Math.ceil((entry.lockedUntil - now) / 1000) };
  }

  // Reset stale lock
  if (entry.lockedUntil && entry.lockedUntil <= now) {
    entry.count = 0;
    entry.lockedUntil = 0;
  }

  const remaining = Math.max(0, MAX_ATTEMPTS - entry.count);
  return { allowed: entry.count < MAX_ATTEMPTS, remaining };
}

export function recordFailure(ip: string): void {
  const entry = store.get(ip) ?? { count: 0, lockedUntil: 0 };
  entry.count++;
  if (entry.count >= MAX_ATTEMPTS) {
    entry.lockedUntil = Date.now() + LOCKOUT_MS;
  }
  store.set(ip, entry);
}

export function resetLimit(ip: string): void {
  store.delete(ip);
}

export function getIpFromRequest(req: Request): string {
  return getIp(req);
}

// ─── Public API sliding-window rate limiter ──────────────────────────
// Max 60 requests per 60-second window per IP.
// Used on public read endpoints like GET /api/blog.

interface WindowEntry {
  timestamps: number[];
}

const publicStore = new Map<string, WindowEntry>();
const PUBLIC_MAX     = 60;          // requests
const PUBLIC_WINDOW  = 60 * 1000;   // 60 seconds

export function checkPublicRateLimit(ip: string): { allowed: boolean; retryAfter?: number } {
  const now   = Date.now();
  const entry = publicStore.get(ip) ?? { timestamps: [] };

  // Drop timestamps outside the window
  entry.timestamps = entry.timestamps.filter((t) => now - t < PUBLIC_WINDOW);

  if (entry.timestamps.length >= PUBLIC_MAX) {
    const oldest     = entry.timestamps[0];
    const retryAfter = Math.ceil((PUBLIC_WINDOW - (now - oldest)) / 1000);
    publicStore.set(ip, entry);
    return { allowed: false, retryAfter };
  }

  entry.timestamps.push(now);
  publicStore.set(ip, entry);
  return { allowed: true };
}
