import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, unauthorizedResponse } from '@/lib/adminAuth';
import { getAllPartners, getCategories, addPartner } from '@/lib/partnerStorage';
import { appendLog } from '@/lib/activityLog';
import { getIpFromRequest } from '@/lib/rateLimit';
import { addPending } from '@/lib/pendingChanges';

export const dynamic = 'force-dynamic';

// GET /api/admin/partners
export async function GET(req: NextRequest) {
  const session = await requireAuth(req);
  if (!session) return unauthorizedResponse();

  return NextResponse.json({
    partners: getAllPartners(),
    categories: getCategories(),
  });
}

// POST /api/admin/partners
export async function POST(req: NextRequest) {
  const session = await requireAuth(req);
  if (!session) return unauthorizedResponse();

  let body: {
    name?: string; description?: string; category?: string;
    logo?: string; logoDark?: string; url?: string;
  };
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }); }

  const { name = '', description = '', category = '', logo, logoDark, url } = body;

  if (!name.trim())     return NextResponse.json({ error: 'Name is required.' }, { status: 400 });
  if (!category.trim()) return NextResponse.json({ error: 'Category is required.' }, { status: 400 });
  if (name.length > 120)        return NextResponse.json({ error: 'Name too long (max 120).' }, { status: 400 });
  if (description.length > 2000) return NextResponse.json({ error: 'Description too long (max 2000).' }, { status: 400 });

  const safeUrl = url ? url.slice(0, 300) : undefined;
  const payload = { name: name.trim(), description: description.trim(), category: category.trim(), logo, logoDark, url: safeUrl };

  // ── editors submit for approval; superadmins write directly ──
  if (session.role !== 'superadmin') {
    const change = addPending({
      resource: 'partner', action: 'create',
      resourceId: name.trim().toLowerCase().replace(/\s+/g, '-'),
      resourceTitle: name.trim(),
      submittedBy: session.username, payload,
    });
    appendLog({
      userId: session.userId, username: session.username, role: session.role,
      action: 'partner_create_pending', detail: `Submitted partner "${name}" for approval`,
      ip: getIpFromRequest(req),
    });
    return NextResponse.json({ pending: true, change }, { status: 202 });
  }

  const partner = addPartner(payload);

  appendLog({
    userId: session.userId, username: session.username, role: session.role,
    action: 'partner_create', detail: `Created partner "${partner.name}"`,
    ip: getIpFromRequest(req),
  });

  return NextResponse.json({ partner }, { status: 201 });
}
