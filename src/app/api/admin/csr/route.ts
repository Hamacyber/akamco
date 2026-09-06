import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, unauthorizedResponse } from '@/lib/adminAuth';
import { getCSRData, saveCSRData, sanitizeCSRData } from '@/lib/csrStorage';
import { appendLog } from '@/lib/activityLog';
import { getIpFromRequest } from '@/lib/rateLimit';
import { addPending } from '@/lib/pendingChanges';

export const dynamic = 'force-dynamic';

// GET /api/admin/csr  — full document
export async function GET(req: NextRequest) {
  const session = await requireAuth(req);
  if (!session) return unauthorizedResponse();
  return NextResponse.json({ csr: getCSRData() });
}

// PUT /api/admin/csr  — full document replace
export async function PUT(req: NextRequest) {
  const session = await requireAuth(req);
  if (!session) return unauthorizedResponse();

  let body: Record<string, unknown>;
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }); }

  const sanitized = sanitizeCSRData(body);

  // ── editors submit for approval; superadmins write directly ──
  if (session.role !== 'superadmin') {
    const original = getCSRData();
    const change = addPending({
      resource: 'csr', action: 'update',
      resourceId: 'csr-page', resourceTitle: 'Social Responsibility Page',
      submittedBy: session.username,
      payload: sanitized,
      originalData: original,
    });
    appendLog({
      userId: session.userId, username: session.username, role: session.role,
      action: 'csr_update_pending',
      detail: 'Submitted CSR page update for approval',
      ip: getIpFromRequest(req),
    });
    return NextResponse.json({ pending: true, change }, { status: 202 });
  }

  const saved = saveCSRData(sanitized);
  appendLog({
    userId: session.userId, username: session.username, role: session.role,
    action: 'csr_update',
    detail: 'Updated Social Responsibility page',
    ip: getIpFromRequest(req),
  });
  return NextResponse.json({ csr: saved });
}
