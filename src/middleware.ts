import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const SESSION_COOKIE = 'akamco_admin_session';
const SECRET = new TextEncoder().encode(
  process.env.ADMIN_SESSION_SECRET ?? 'akamco-secret-please-change-in-production'
);

// ─── IP Allowlist ──────────────────────────────────────────────
// Set ADMIN_ALLOWED_IPS in .env as a comma-separated list.
// Supports exact IPs and CIDR notation, e.g.:
//   ADMIN_ALLOWED_IPS=192.168.1.0/24,10.0.0.5,203.0.113.42
// Leave unset to allow all IPs (default / dev mode).

function ipToInt(ip: string): number {
  return ip.split('.').reduce((acc, oct) => ((acc << 8) | parseInt(oct, 10)) >>> 0, 0) >>> 0;
}

function isIpAllowed(raw: string, allowList: string[]): boolean {
  if (!allowList.length) return true; // no restriction configured

  // Normalise: strip IPv4-mapped IPv6 prefix (::ffff:1.2.3.4 → 1.2.3.4)
  let ip = raw.trim();
  if (ip.startsWith('::ffff:')) ip = ip.slice(7);

  // Always allow localhost
  if (ip === '127.0.0.1' || ip === '::1' || ip === 'localhost') return true;

  for (const entry of allowList) {
    const e = entry.trim();
    if (!e) continue;

    if (e.includes('/')) {
      // CIDR — e.g. 192.168.1.0/24
      const [range, bitsStr] = e.split('/');
      const bits = parseInt(bitsStr, 10);
      const mask = bits === 0 ? 0 : (0xffffffff << (32 - bits)) >>> 0;
      try {
        if ((ipToInt(ip) & mask) >>> 0 === (ipToInt(range) & mask) >>> 0) return true;
      } catch { /* malformed entry — skip */ }
    } else {
      // Exact match
      if (ip === e) return true;
    }
  }
  return false;
}

function getClientIp(req: NextRequest): string {
  // SECURITY: Never trust client-sent headers (X-Forwarded-For, X-Real-IP) by default.
  // Clients can forge these to spoof any whitelisted IP and bypass the allowlist.
  //
  // req.ip  = the actual TCP connection IP set by the Next.js server — cannot be
  //           forged by the client.
  //
  // Only set TRUST_PROXY=1 if you have a TRUSTED reverse proxy (nginx / Cloudflare)
  // in front that STRIPS and REWRITES X-Forwarded-For before it reaches Next.js.
  if (process.env.TRUST_PROXY === '1') {
    // Behind a trusted proxy: the proxy appends the real IP as the LAST entry.
    // Take the last entry — NOT the first (which is client-controlled).
    const fwd = req.headers.get('x-forwarded-for');
    if (fwd) {
      const last = fwd.split(',').map((s) => s.trim()).filter(Boolean).pop();
      if (last) return last;
    }
    const realIp = req.headers.get('x-real-ip');
    if (realIp) return realIp.trim();
  }

  // Default: use the actual connection IP — this cannot be spoofed by HTTP headers.
  return req.ip ?? '127.0.0.1';
}

const ALLOWED_IPS: string[] = (process.env.ADMIN_ALLOWED_IPS ?? '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

// ─── Session helper ────────────────────────────────────────────
async function getSessionPayload(token: string) {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    if (payload.admin !== true || !payload.userId) return null;
    return {
      userId:   payload.userId   as string,
      username: payload.username as string,
      role:     payload.role     as string,
    };
  } catch {
    return null;
  }
}

// ─── Blocked response ──────────────────────────────────────────
function blockedResponse() {
  return new NextResponse(
    `<!doctype html><html lang="en"><head><meta charset="utf-8">
<title>Access Restricted</title>
<style>
  body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;
       background:#0a0a0a;font-family:system-ui,sans-serif;color:#fff}
  .box{text-align:center;max-width:400px;padding:2rem}
  h1{font-size:1.25rem;font-weight:700;margin-bottom:.5rem}
  p{color:#6b7280;font-size:.875rem;line-height:1.6}
</style></head>
<body><div class="box">
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ef4444"
       stroke-width="1.5" style="margin:0 auto 1rem"><path stroke-linecap="round"
       stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75
       m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25
       H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"/></svg>
  <h1>Access Restricted</h1>
  <p>This area is only accessible from authorised network locations.</p>
</div></body></html>`,
    {
      status: 403,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    }
  );
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Always inject x-pathname for layout detection
  const reqHeaders = new Headers(request.headers);
  reqHeaders.set('x-pathname', pathname);

  // ─── Protect /admin/* ─────────────────────────────────────────
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    // IP allowlist check — runs before anything else
    if (!isIpAllowed(getClientIp(request), ALLOWED_IPS)) {
      return blockedResponse();
    }

    const isLoginPage = pathname === '/admin/login';
    const isAdminApi  = pathname.startsWith('/api/admin/');

    if (!isLoginPage && !isAdminApi) {
      const token = request.cookies.get(SESSION_COOKIE)?.value;
      const session = token ? await getSessionPayload(token) : null;

      if (!session) {
        return NextResponse.redirect(new URL('/admin/login', request.url));
      }

      // Superadmin-only routes
      const superadminOnly = ['/admin/users', '/admin/logs'];
      if (superadminOnly.some((p) => pathname.startsWith(p)) && session.role !== 'superadmin') {
        return NextResponse.redirect(new URL('/admin/blog', request.url));
      }

      // Forward session info to pages via headers
      reqHeaders.set('x-user-id',   session.userId);
      reqHeaders.set('x-username',  session.username);
      reqHeaders.set('x-user-role', session.role);
    }
  }

  return NextResponse.next({ request: { headers: reqHeaders } });
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|images|.*\\..*).*)'],
};
