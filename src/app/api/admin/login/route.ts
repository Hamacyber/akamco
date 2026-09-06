import { NextRequest, NextResponse } from 'next/server';
import { createStep1Token, STEP1_COOKIE } from '@/lib/adminAuth';
import { verifyUserCredentials } from '@/lib/userStorage';
import { checkRateLimit, recordFailure, resetLimit, getIpFromRequest } from '@/lib/rateLimit';
import { appendLog } from '@/lib/activityLog';

export const dynamic = 'force-dynamic';

// POST /api/admin/login — step 1: username + password
export async function POST(req: NextRequest) {
  const ip = getIpFromRequest(req);

  const rl = checkRateLimit(ip);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: `Too many attempts. Try again in ${rl.retryAfter}s.` },
      { status: 429 }
    );
  }

  let body: { username?: string; password?: string };
  try { body = await req.json(); } catch { return NextResponse.json({ error: 'Invalid request.' }, { status: 400 }); }

  const { username = '', password = '' } = body;

  const user = verifyUserCredentials(username, password);
  if (!user) {
    recordFailure(ip);
    const rlAfter = checkRateLimit(ip);
    appendLog({ userId: 'unknown', username: username || 'unknown', role: 'unknown', action: 'login_failed', detail: `Failed login attempt for "${username}"`, ip });
    return NextResponse.json(
      { error: 'Invalid username or password.', remaining: rlAfter.remaining },
      { status: 401 }
    );
  }

  resetLimit(ip);

  const step1Token = await createStep1Token(user.id);

  const res = NextResponse.json({ ok: true, totpReady: user.totpConfigured });
  res.cookies.set(STEP1_COOKIE, step1Token, {
    httpOnly: true,
    sameSite: 'lax',
    secure:   process.env.NODE_ENV === 'production',
    maxAge:   5 * 60,
    path:     '/',
  });
  return res;
}
