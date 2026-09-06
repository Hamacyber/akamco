import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, unauthorizedResponse } from '@/lib/adminAuth';
import { updateJob, deleteJob, getJobById } from '@/lib/jobsStorage';
import { appendLog } from '@/lib/activityLog';
import { getIpFromRequest } from '@/lib/rateLimit';

export const dynamic = 'force-dynamic';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireAuth(req);
  if (!session) return unauthorizedResponse();

  let body: Record<string, unknown>;
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }); }

  const { title, department, location, type, description, requirements, active } = body as Record<string, unknown>;
  if (title !== undefined && !String(title).trim()) {
    return NextResponse.json({ error: 'Title cannot be empty' }, { status: 400 });
  }

  const updated = updateJob(params.id, {
    ...(title       !== undefined && { title:        String(title).trim() }),
    ...(department  !== undefined && { department:   String(department).trim() }),
    ...(location    !== undefined && { location:     String(location).trim() }),
    ...(type        !== undefined && { type:         String(type).trim() }),
    ...(description !== undefined && { description:  String(description).trim() }),
    ...(requirements !== undefined && { requirements: Array.isArray(requirements) ? (requirements as string[]).filter(Boolean) : [] }),
    ...(active      !== undefined && { active:       Boolean(active) }),
  });

  if (!updated) return NextResponse.json({ error: 'Job not found' }, { status: 404 });

  appendLog({
    userId: session.userId, username: session.username, role: session.role,
    action: 'job_update', detail: `Updated job "${updated.title}"`, ip: getIpFromRequest(req),
  });
  return NextResponse.json({ job: updated });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireAuth(req);
  if (!session) return unauthorizedResponse();

  const job = getJobById(params.id);
  const ok = deleteJob(params.id);
  if (!ok) return NextResponse.json({ error: 'Job not found' }, { status: 404 });

  appendLog({
    userId: session.userId, username: session.username, role: session.role,
    action: 'job_delete', detail: `Deleted job "${job?.title ?? params.id}"`, ip: getIpFromRequest(req),
  });
  return NextResponse.json({ ok: true });
}
