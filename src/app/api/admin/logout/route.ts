import { NextRequest, NextResponse } from 'next/server';
import { verifySession, SESSION_COOKIE, STEP1_COOKIE } from '@/lib/adminAuth';
import { appendLog } from '@/lib/activityLog';
import { getIpFromRequest } from '@/lib/rateLimit';

export const dynamic = 'force-dynamic';

// POST /api/admin/logout
export async function POST(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  if (token) {
    const session = await verifySession(token);
    if (session) {
      appendLog({ userId: session.userId, username: session.username, role: session.role, action: 'logout', detail: 'Logged out', ip: getIpFromRequest(req) });
    }
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, '', { maxAge: 0, path: '/' });
  res.cookies.set(STEP1_COOKIE,   '', { maxAge: 0, path: '/' });
  return res;
}
