import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, unauthorizedResponse } from '@/lib/adminAuth';
import { getAllJobs, createJob } from '@/lib/jobsStorage';
import { appendLog } from '@/lib/activityLog';
import { getIpFromRequest } from '@/lib/rateLimit';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const session = await requireAuth(req);
  if (!session) return unauthorizedResponse();
  return NextResponse.json({ jobs: getAllJobs() });
}

export async function POST(req: NextRequest) {
  const session = await requireAuth(req);
  if (!session) return unauthorizedResponse();

  let body: Record<string, unknown>;
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }); }

  const { id, title, department, location, type, description, requirements, active } = body as Record<string, unknown>;
  if (!String(id ?? '').trim())    return NextResponse.json({ error: 'ID is required'    }, { status: 400 });
  if (!String(title ?? '').trim()) return NextResponse.json({ error: 'Title is required' }, { status: 400 });

  try {
    const job = createJob({
      id:           String(id).trim().toLowerCase().replace(/\s+/g, '-'),
      title:        String(title).trim(),
      department:   String(department ?? '').trim(),
      location:     String(location ?? '').trim(),
      type:         String(type ?? 'Full-time').trim(),
      description:  String(description ?? '').trim(),
      requirements: Array.isArray(requirements) ? (requirements as string[]).filter(Boolean) : [],
      active:       active !== false,
    });
    appendLog({
      userId: session.userId, username: session.username, role: session.role,
      action: 'job_create', detail: `Created job "${job.title}"`, ip: getIpFromRequest(req),
    });
    return NextResponse.json({ job }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 409 });
  }
}
