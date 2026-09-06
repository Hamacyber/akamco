import { NextRequest, NextResponse } from 'next/server';
import { verifySession, SESSION_COOKIE } from '@/lib/adminAuth';
import { getAllUsers, createUser, UserRole } from '@/lib/userStorage';
import { appendLog } from '@/lib/activityLog';
import { getIpFromRequest } from '@/lib/rateLimit';

export const dynamic = 'force-dynamic';

async function requireSuperadmin(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const s = await verifySession(token);
  if (!s || s.role !== 'superadmin') return null;
  return s;
}

// GET /api/admin/users — list all users
export async function GET(req: NextRequest) {
  const session = await requireSuperadmin(req);
  if (!session) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const users = getAllUsers().map(({ password: _p, totpSecret: _t, ...u }) => u);
  return NextResponse.json({ users });
}

// POST /api/admin/users — create a new editor
export async function POST(req: NextRequest) {
  const session = await requireSuperadmin(req);
  if (!session) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  let body: { username?: string; password?: string; role?: UserRole };
  try { body = await req.json(); } catch { return NextResponse.json({ error: 'Invalid request.' }, { status: 400 }); }

  const { username = '', password = '', role = 'editor' } = body;

  if (!username.trim() || !password.trim()) {
    return NextResponse.json({ error: 'Username and password are required.' }, { status: 400 });
  }
  if (!['editor', 'superadmin'].includes(role)) {
    return NextResponse.json({ error: 'Invalid role.' }, { status: 400 });
  }

  try {
    const user = createUser({ username, password, role, createdBy: session.username });
    appendLog({ userId: session.userId, username: session.username, role: session.role, action: 'user_create', detail: `Created user "${username}" (${role})`, ip: getIpFromRequest(req) });
    const { password: _p, totpSecret: _t, ...safe } = user;
    return NextResponse.json({ user: safe }, { status: 201 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to create user.';
    return NextResponse.json({ error: msg }, { status: 409 });
  }
}
