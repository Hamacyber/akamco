import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, unauthorizedResponse } from '@/lib/adminAuth';
import { updateSolution, deleteSolution, getSolutionById } from '@/lib/solutionsStorage';
import { appendLog } from '@/lib/activityLog';
import { getIpFromRequest } from '@/lib/rateLimit';
import { addPending } from '@/lib/pendingChanges';

export const dynamic = 'force-dynamic';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireAuth(req);
  if (!session) return unauthorizedResponse();

  let body: Record<string, unknown>;
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }); }

  if (session.role !== 'superadmin') {
    const original = getSolutionById(params.id);
    const title = (body.title as string) ?? params.id;
    const change = addPending({
      resource: 'solution', action: 'update',
      resourceId: params.id, resourceTitle: title,
      submittedBy: session.username, payload: body,
      originalData: original ?? undefined,
    });
    appendLog({
      userId: session.userId, username: session.username, role: session.role,
      action: 'solution_update_pending', detail: `Submitted update for solution "${title}" for approval`,
      ip: getIpFromRequest(req),
    });
    return NextResponse.json({ pending: true, change }, { status: 202 });
  }

  const updated = updateSolution(params.id, body as unknown as Parameters<typeof updateSolution>[1]);
  if (!updated) return NextResponse.json({ error: 'Solution not found.' }, { status: 404 });

  appendLog({
    userId: session.userId, username: session.username, role: session.role,
    action: 'solution_update', detail: `Updated solution "${updated.title}"`,
    ip: getIpFromRequest(req),
  });
  return NextResponse.json({ solution: updated });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireAuth(req);
  if (!session) return unauthorizedResponse();

  if (session.role !== 'superadmin') {
    const original = getSolutionById(params.id);
    const title = original?.title ?? params.id;
    const change = addPending({
      resource: 'solution', action: 'delete',
      resourceId: params.id, resourceTitle: title,
      submittedBy: session.username, payload: undefined,
      originalData: original ?? undefined,
    });
    appendLog({
      userId: session.userId, username: session.username, role: session.role,
      action: 'solution_delete_pending', detail: `Submitted delete for solution "${title}" for approval`,
      ip: getIpFromRequest(req),
    });
    return NextResponse.json({ pending: true, change }, { status: 202 });
  }

  const ok = deleteSolution(params.id);
  if (!ok) return NextResponse.json({ error: 'Solution not found.' }, { status: 404 });

  appendLog({
    userId: session.userId, username: session.username, role: session.role,
    action: 'solution_delete', detail: `Deleted solution id "${params.id}"`,
    ip: getIpFromRequest(req),
  });
  return NextResponse.json({ success: true });
}
