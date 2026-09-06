import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, unauthorizedResponse } from '@/lib/adminAuth';
import {
  getPendingById, updatePendingStatus, deletePendingById,
  type PendingChange,
} from '@/lib/pendingChanges';
import { appendLog } from '@/lib/activityLog';
import { getIpFromRequest } from '@/lib/rateLimit';

// ─── resource handlers ──────────────────────────────────────────
async function applyChange(change: PendingChange): Promise<{ ok: boolean; error?: string }> {
  const { resource, action, resourceId, payload } = change;

  if (resource === 'service') {
    const { addService, updateService, deleteService } = await import('@/lib/servicesStorage');
    if (action === 'create') {
      try { addService(payload as Parameters<typeof addService>[0]); return { ok: true }; }
      catch (e) { return { ok: false, error: (e as Error).message }; }
    }
    if (action === 'update') {
      const r = updateService(resourceId, payload as Parameters<typeof updateService>[1]);
      return r ? { ok: true } : { ok: false, error: 'Service not found' };
    }
    if (action === 'delete') {
      return deleteService(resourceId) ? { ok: true } : { ok: false, error: 'Service not found' };
    }
  }

  if (resource === 'solution') {
    const { addSolution, updateSolution, deleteSolution } = await import('@/lib/solutionsStorage');
    if (action === 'create') {
      try { addSolution(payload as Parameters<typeof addSolution>[0]); return { ok: true }; }
      catch (e) { return { ok: false, error: (e as Error).message }; }
    }
    if (action === 'update') {
      const r = updateSolution(resourceId, payload as Parameters<typeof updateSolution>[1]);
      return r ? { ok: true } : { ok: false, error: 'Solution not found' };
    }
    if (action === 'delete') {
      return deleteSolution(resourceId) ? { ok: true } : { ok: false, error: 'Solution not found' };
    }
  }

  if (resource === 'partner') {
    const { addPartner, updatePartner, deletePartner } = await import('@/lib/partnerStorage');
    if (action === 'create') {
      addPartner(payload as Parameters<typeof addPartner>[0]);
      return { ok: true };
    }
    if (action === 'update') {
      const r = updatePartner(resourceId, payload as Parameters<typeof updatePartner>[1]);
      return r ? { ok: true } : { ok: false, error: 'Partner not found' };
    }
    if (action === 'delete') {
      return deletePartner(resourceId) ? { ok: true } : { ok: false, error: 'Partner not found' };
    }
  }

  if (resource === 'csr') {
    const { saveCSRData, sanitizeCSRData } = await import('@/lib/csrStorage');
    if (action === 'update') {
      try {
        saveCSRData(sanitizeCSRData(payload as Record<string, unknown>));
        return { ok: true };
      } catch (e) { return { ok: false, error: (e as Error).message }; }
    }
  }

  return { ok: false, error: 'Unknown resource or action' };
}

export const dynamic = 'force-dynamic';

// PUT /api/admin/pending/[id]  body: { decision: 'approve'|'reject', note?: string }
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireAuth(req);
  if (!session) return unauthorizedResponse();
  if (session.role !== 'superadmin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  let body: { decision?: string; note?: string };
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }); }

  const { decision, note } = body;
  if (decision !== 'approve' && decision !== 'reject') {
    return NextResponse.json({ error: "decision must be 'approve' or 'reject'" }, { status: 400 });
  }

  const change = getPendingById(params.id);
  if (!change) return NextResponse.json({ error: 'Change not found' }, { status: 404 });
  if (change.status !== 'pending') return NextResponse.json({ error: 'Already reviewed' }, { status: 409 });

  if (decision === 'approve') {
    const result = await applyChange(change);
    if (!result.ok) {
      return NextResponse.json({ error: `Apply failed: ${result.error}` }, { status: 422 });
    }
  }

  const updated = updatePendingStatus(
    params.id,
    decision === 'approve' ? 'approved' : 'rejected',
    session.username,
    note,
  );

  appendLog({
    userId: session.userId, username: session.username, role: session.role,
    action: decision === 'approve' ? 'change_approve' : 'change_reject',
    detail: `${decision === 'approve' ? 'Approved' : 'Rejected'} ${change.resource} ${change.action} for "${change.resourceTitle}"`,
    ip: getIpFromRequest(req),
  });

  return NextResponse.json({ change: updated });
}

// DELETE /api/admin/pending/[id]  — dismiss / remove from queue
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireAuth(req);
  if (!session) return unauthorizedResponse();
  if (session.role !== 'superadmin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const ok = deletePendingById(params.id);
  if (!ok) return NextResponse.json({ error: 'Change not found' }, { status: 404 });

  appendLog({
    userId: session.userId, username: session.username, role: session.role,
    action: 'change_dismiss', detail: `Dismissed pending change id "${params.id}"`,
    ip: getIpFromRequest(req),
  });

  return NextResponse.json({ success: true });
}
