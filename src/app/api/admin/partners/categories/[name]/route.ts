import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, unauthorizedResponse } from '@/lib/adminAuth';
import { renameCategory, deleteCategory } from '@/lib/partnerStorage';
import { appendLog } from '@/lib/activityLog';
import { getIpFromRequest } from '@/lib/rateLimit';

export const dynamic = 'force-dynamic';

// PATCH /api/admin/partners/categories/[name]  { name: newName }
export async function PATCH(
  req: NextRequest,
  { params }: { params: { name: string } }
) {
  const session = await requireAuth(req);
  if (!session) return unauthorizedResponse();

  const oldName = decodeURIComponent(params.name);

  let body: { name?: string };
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }); }

  const { name: newName = '' } = body;
  if (!newName.trim()) return NextResponse.json({ error: 'New name is required.' }, { status: 400 });
  if (newName.length > 80) return NextResponse.json({ error: 'Name too long (max 80).' }, { status: 400 });

  const ok = renameCategory(oldName, newName.trim());
  if (!ok) return NextResponse.json({ error: 'Category not found or new name already exists.' }, { status: 400 });

  appendLog({
    userId: session.userId, username: session.username, role: session.role,
    action: 'category_rename', detail: `Renamed partner category "${oldName}" → "${newName}"`,
    ip: getIpFromRequest(req),
  });

  return NextResponse.json({ success: true });
}

// DELETE /api/admin/partners/categories/[name]
export async function DELETE(
  req: NextRequest,
  { params }: { params: { name: string } }
) {
  const session = await requireAuth(req);
  if (!session) return unauthorizedResponse();

  const name = decodeURIComponent(params.name);
  const result = deleteCategory(name);

  if (!result.ok) {
    const status = result.reason === 'Not found' ? 404 : 400;
    return NextResponse.json({ error: result.reason }, { status });
  }

  appendLog({
    userId: session.userId, username: session.username, role: session.role,
    action: 'category_delete', detail: `Deleted partner category "${name}"`,
    ip: getIpFromRequest(req),
  });

  return NextResponse.json({ success: true });
}
