import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, unauthorizedResponse } from '@/lib/adminAuth';
import { getAllSolutions, addSolution } from '@/lib/solutionsStorage';
import { appendLog } from '@/lib/activityLog';
import { getIpFromRequest } from '@/lib/rateLimit';
import { addPending } from '@/lib/pendingChanges';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const session = await requireAuth(req);
  if (!session) return unauthorizedResponse();
  return NextResponse.json({ solutions: getAllSolutions() });
}

export async function POST(req: NextRequest) {
  const session = await requireAuth(req);
  if (!session) return unauthorizedResponse();

  let body: Record<string, unknown>;
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }); }

  const { id, title } = body as { id?: string; title?: string };
  if (!id?.toString().trim()) return NextResponse.json({ error: 'ID is required.' }, { status: 400 });
  if (!title?.toString().trim()) return NextResponse.json({ error: 'Title is required.' }, { status: 400 });

  // ── editors submit for approval; superadmins write directly ──
  if (session.role !== 'superadmin') {
    const change = addPending({
      resource: 'solution', action: 'create',
      resourceId: String(id), resourceTitle: String(title),
      submittedBy: session.username, payload: body,
    });
    appendLog({
      userId: session.userId, username: session.username, role: session.role,
      action: 'solution_create_pending', detail: `Submitted solution "${title}" for approval`,
      ip: getIpFromRequest(req),
    });
    return NextResponse.json({ pending: true, change }, { status: 202 });
  }

  try {
    const solution = addSolution(body as unknown as Parameters<typeof addSolution>[0]);
    appendLog({
      userId: session.userId, username: session.username, role: session.role,
      action: 'solution_create', detail: `Created solution "${solution.title}"`,
      ip: getIpFromRequest(req),
    });
    return NextResponse.json({ solution }, { status: 201 });
  } catch (e: unknown) {
    return NextResponse.json({ error: (e as Error).message }, { status: 409 });
  }
}
