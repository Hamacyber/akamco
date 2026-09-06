import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, unauthorizedResponse } from '@/lib/adminAuth';
import { updatePartner, deletePartner, reorderPartner, getAllPartners } from '@/lib/partnerStorage';
import { appendLog } from '@/lib/activityLog';
import { getIpFromRequest } from '@/lib/rateLimit';
import { addPending } from '@/lib/pendingChanges';

export const dynamic = 'force-dynamic';

// PUT /api/admin/partners/[id]
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireAuth(req);
  if (!session) return unauthorizedResponse();

  const { id } = params;

  let body: {
    name?: string; description?: string; category?: string;
    logo?: string; logoDark?: string; url?: string;
  };
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }); }

  const { name, description, category, logo, logoDark, url } = body;

  if (name !== undefined && !name.trim())
    return NextResponse.json({ error: 'Name cannot be empty.' }, { status: 400 });
  if (name && name.length > 120)
    return NextResponse.json({ error: 'Name too long (max 120).' }, { status: 400 });
  if (description && description.length > 2000)
    return NextResponse.json({ error: 'Description too long (max 2000).' }, { status: 400 });

  if (session.role !== 'superadmin') {
    const original = getAllPartners().find(p => p.id === id);
    const title = name?.trim() ?? original?.name ?? id;
    const change = addPending({
      resource: 'partner', action: 'update',
      resourceId: id, resourceTitle: title,
      submittedBy: session.username, payload: body,
      originalData: original ?? undefined,
    });
    appendLog({
      userId: session.userId, username: session.username, role: session.role,
      action: 'partner_update_pending', detail: `Submitted update for partner "${title}" for approval`,
      ip: getIpFromRequest(req),
    });
    return NextResponse.json({ pending: true, change }, { status: 202 });
  }

  const updated = updatePartner(id, {
    ...(name        !== undefined && { name: name.trim() }),
    ...(description !== undefined && { description: description.trim() }),
    ...(category    !== undefined && { category: category.trim() }),
    ...(logo        !== undefined && { logo }),
    ...(logoDark    !== undefined && { logoDark }),
    ...(url         !== undefined && { url: url ? url.slice(0, 300) : undefined }),
  });

  if (!updated) return NextResponse.json({ error: 'Partner not found.' }, { status: 404 });

  appendLog({
    userId: session.userId, username: session.username, role: session.role,
    action: 'partner_update', detail: `Updated partner "${updated.name}"`,
    ip: getIpFromRequest(req),
  });

  return NextResponse.json({ partner: updated });
}

// DELETE /api/admin/partners/[id]
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireAuth(req);
  if (!session) return unauthorizedResponse();

  const { id } = params;

  if (session.role !== 'superadmin') {
    const original = getAllPartners().find(p => p.id === id);
    const title = original?.name ?? id;
    const change = addPending({
      resource: 'partner', action: 'delete',
      resourceId: id, resourceTitle: title,
      submittedBy: session.username, payload: undefined,
      originalData: original ?? undefined,
    });
    appendLog({
      userId: session.userId, username: session.username, role: session.role,
      action: 'partner_delete_pending', detail: `Submitted delete for partner "${title}" for approval`,
      ip: getIpFromRequest(req),
    });
    return NextResponse.json({ pending: true, change }, { status: 202 });
  }

  const ok = deletePartner(id);
  if (!ok) return NextResponse.json({ error: 'Partner not found.' }, { status: 404 });

  appendLog({
    userId: session.userId, username: session.username, role: session.role,
    action: 'partner_delete', detail: `Deleted partner ID ${id}`,
    ip: getIpFromRequest(req),
  });

  return NextResponse.json({ success: true });
}

// PATCH /api/admin/partners/[id]  { action: 'move-up' | 'move-down' | 'move-top' }
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireAuth(req);
  if (!session) return unauthorizedResponse();

  const { id } = params;

  let body: { action?: string };
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }); }

  const { action } = body;
  if (!['move-up', 'move-down', 'move-top'].includes(action ?? ''))
    return NextResponse.json({ error: 'Invalid action. Use move-up, move-down, or move-top.' }, { status: 400 });

  const ok = reorderPartner(id, action as 'move-up' | 'move-down' | 'move-top');
  if (!ok) return NextResponse.json({ error: 'Partner not found or already at boundary.' }, { status: 404 });

  return NextResponse.json({ success: true });
}
