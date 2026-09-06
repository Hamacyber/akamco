import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, unauthorizedResponse } from '@/lib/adminAuth';
import { getCategories, addCategory } from '@/lib/partnerStorage';
import { appendLog } from '@/lib/activityLog';
import { getIpFromRequest } from '@/lib/rateLimit';

export const dynamic = 'force-dynamic';

// GET /api/admin/partners/categories
export async function GET(req: NextRequest) {
  const session = await requireAuth(req);
  if (!session) return unauthorizedResponse();

  return NextResponse.json({ categories: getCategories() });
}

// POST /api/admin/partners/categories
export async function POST(req: NextRequest) {
  const session = await requireAuth(req);
  if (!session) return unauthorizedResponse();

  let body: { name?: string };
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }); }

  const { name = '' } = body;
  if (!name.trim()) return NextResponse.json({ error: 'Name is required.' }, { status: 400 });
  if (name.length > 80) return NextResponse.json({ error: 'Name too long (max 80).' }, { status: 400 });

  const ok = addCategory(name.trim());
  if (!ok) return NextResponse.json({ error: 'Category already exists.' }, { status: 409 });

  appendLog({
    userId: session.userId, username: session.username, role: session.role,
    action: 'category_create', detail: `Created partner category "${name}"`,
    ip: getIpFromRequest(req),
  });

  return NextResponse.json({ success: true }, { status: 201 });
}
