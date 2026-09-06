import { NextRequest, NextResponse } from 'next/server';
import { verifyStep1Token, createSession, SESSION_COOKIE, STEP1_COOKIE } from '@/lib/adminAuth';
import { getUserById, getUserTOTPSecret, verifyUserTOTP, updateUser } from '@/lib/userStorage';
import { checkRateLimit, recordFailure, resetLimit, getIpFromRequest } from '@/lib/rateLimit';
import { appendLog } from '@/lib/activityLog';

export const dynamic = 'force-dynamic';

// POST /api/admin/verify-otp — step 2: TOTP code
export async function POST(req: NextRequest) {
  const ip = getIpFromRequest(req);

  // Must have completed step 1
  const step1Token = req.cookies.get(STEP1_COOKIE)?.value;
  const userId = step1Token ? await verifyStep1Token(step1Token) : null;
  if (!userId) {
    return NextResponse.json({ error: 'Session expired. Please sign in again.' }, { status: 401 });
  }

  const user = getUserById(userId);
  if (!user || !user.active) {
    return NextResponse.json({ error: 'Account not found or disabled.' }, { status: 401 });
  }

  const rl = checkRateLimit(`otp:${ip}`);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: `Too many attempts. Try again in ${rl.retryAfter}s.` },
      { status: 429 }
    );
  }

  let body: { code?: string };
  try { body = await req.json(); } catch { return NextResponse.json({ error: 'Invalid request.' }, { status: 400 }); }

  const code = (body.code ?? '').replace(/\s/g, '');

  // Ensure TOTP secret exists (generates one if not yet set)
  getUserTOTPSecret(user);

  if (!verifyUserTOTP(user, code)) {
    recordFailure(`otp:${ip}`);
    const rlAfter = checkRateLimit(`otp:${ip}`);
    appendLog({ userId: user.id, username: user.username, role: user.role, action: 'login_failed', detail: 'Incorrect TOTP code', ip });
    return NextResponse.json(
      { error: 'Invalid code. Check your authenticator app.', remaining: rlAfter.remaining },
      { status: 401 }
    );
  }

  // Mark TOTP as configured if this was first setup
  if (!user.totpConfigured) {
    updateUser(user.id, { totpConfigured: true });
    appendLog({ userId: user.id, username: user.username, role: user.role, action: 'totp_setup', detail: 'TOTP authenticator configured', ip });
  }

  resetLimit(`otp:${ip}`);

  const sessionToken = await createSession({ userId: user.id, username: user.username, role: user.role });

  appendLog({ userId: user.id, username: user.username, role: user.role, action: 'login', detail: 'Logged in successfully', ip });

  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, sessionToken, {
    httpOnly: true,
    sameSite: 'lax',
    secure:   process.env.NODE_ENV === 'production',
    maxAge:   1 * 60 * 60,
    path:     '/',
  });
  res.cookies.set(STEP1_COOKIE, '', { maxAge: 0, path: '/' });
  return res;
}
