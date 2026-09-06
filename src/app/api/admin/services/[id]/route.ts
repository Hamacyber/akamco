import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, unauthorizedResponse } from '@/lib/adminAuth';
import { updateService, deleteService, getServiceById } from '@/lib/servicesStorage';
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
    const original = getServiceById(params.id);
    const title = (body.title as string) ?? params.id;
    const change = addPending({
      resource: 'service', action: 'update',
      resourceId: params.id, resourceTitle: title,
      submittedBy: session.username, payload: body,
      originalData: original ?? undefined,
    });
    appendLog({
      userId: session.userId, username: session.username, role: session.role,
      action: 'service_update_pending', detail: `Submitted update for service "${title}" for approval`,
      ip: getIpFromRequest(req),
    });
    return NextResponse.json({ pending: true, change }, { status: 202 });
  }

  const updated = updateService(params.id, body as unknown as Parameters<typeof updateService>[1]);
  if (!updated) return NextResponse.json({ error: 'Service not found.' }, { status: 404 });

  appendLog({
    userId: session.userId, username: session.username, role: session.role,
    action: 'service_update', detail: `Updated service "${updated.title}"`,
    ip: getIpFromRequest(req),
  });
  return NextResponse.json({ service: updated });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireAuth(req);
  if (!session) return unauthorizedResponse();

  if (session.role !== 'superadmin') {
    const original = getServiceById(params.id);
    const title = original?.title ?? params.id;
    const change = addPending({
      resource: 'service', action: 'delete',
      resourceId: params.id, resourceTitle: title,
      submittedBy: session.username, payload: undefined,
      originalData: original ?? undefined,
    });
    appendLog({
      userId: session.userId, username: session.username, role: session.role,
      action: 'service_delete_pending', detail: `Submitted delete for service "${title}" for approval`,
      ip: getIpFromRequest(req),
    });
    return NextResponse.json({ pending: true, change }, { status: 202 });
  }

  const ok = deleteService(params.id);
  if (!ok) return NextResponse.json({ error: 'Service not found.' }, { status: 404 });

  appendLog({
    userId: session.userId, username: session.username, role: session.role,
    action: 'service_delete', detail: `Deleted service id "${params.id}"`,
    ip: getIpFromRequest(req),
  });
  return NextResponse.json({ success: true });
}
