import { NextRequest, NextResponse } from 'next/server';
import { verifySession, SESSION_COOKIE } from '@/lib/adminAuth';
import { getUserById, updateUser, deleteUser, hashPassword } from '@/lib/userStorage';
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

// PUT /api/admin/users/[id] — update user (password, role, active)
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireSuperadmin(req);
  if (!session) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const user = getUserById(params.id);
  if (!user) return NextResponse.json({ error: 'User not found.' }, { status: 404 });

  let body: { password?: string; role?: string; active?: boolean };
  try { body = await req.json(); } catch { return NextResponse.json({ error: 'Invalid request.' }, { status: 400 }); }

  const updates: Parameters<typeof updateUser>[1] = {};
  if (body.password !== undefined && body.password.trim()) {
    updates.password = hashPassword(body.password); // always hash before storing
  }
  if (body.role   !== undefined) updates.role   = body.role as 'superadmin' | 'editor';
  if (body.active !== undefined) updates.active = body.active;

  const updated = updateUser(params.id, updates);
  appendLog({ userId: session.userId, username: session.username, role: session.role, action: 'user_update', detail: `Updated user "${user.username}"`, ip: getIpFromRequest(req) });

  const { password: _p, totpSecret: _t, ...safe } = updated;
  return NextResponse.json({ user: safe });
}

// PATCH /api/admin/users/[id] — special actions (reset-2fa)
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireSuperadmin(req);
  if (!session) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const user = getUserById(params.id);
  if (!user) return NextResponse.json({ error: 'User not found.' }, { status: 404 });

  let body: { action?: string };
  try { body = await req.json(); } catch { return NextResponse.json({ error: 'Invalid request.' }, { status: 400 }); }

  if (body.action === 'reset-2fa') {
    // Prevent superadmin from resetting their own 2FA via the panel
    if (user.id === session.userId) {
      return NextResponse.json({ error: 'You cannot reset your own 2FA. Use your authenticator app instead.' }, { status: 400 });
    }
    updateUser(user.id, { totpSecret: undefined, totpConfigured: false });
    appendLog({ userId: session.userId, username: session.username, role: session.role, action: 'totp_reset', detail: `Reset 2FA for user "${user.username}"`, ip: getIpFromRequest(req) });
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: 'Unknown action.' }, { status: 400 });
}

// DELETE /api/admin/users/[id] — delete user
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireSuperadmin(req);
  if (!session) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const user = getUserById(params.id);
  if (!user) return NextResponse.json({ error: 'User not found.' }, { status: 404 });

  try {
    deleteUser(params.id);
    appendLog({ userId: session.userId, username: session.username, role: session.role, action: 'user_delete', detail: `Deleted user "${user.username}"`, ip: getIpFromRequest(req) });
    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed.';
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
