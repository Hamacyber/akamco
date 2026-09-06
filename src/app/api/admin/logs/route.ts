import { NextRequest, NextResponse } from 'next/server';
import { verifySession, SESSION_COOKIE } from '@/lib/adminAuth';
import { getLogs } from '@/lib/activityLog';

export const dynamic = 'force-dynamic';

// GET /api/admin/logs?limit=50&offset=0&userId=...&action=...
export async function GET(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const session = await verifySession(token);
  if (!session || session.role !== 'superadmin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const limit  = Math.min(parseInt(searchParams.get('limit')  ?? '50'),  200);
  const offset = parseInt(searchParams.get('offset') ?? '0');
  const userId = searchParams.get('userId') ?? undefined;
  const action = searchParams.get('action')  ?? undefined;

  const result = getLogs({ limit, offset, userId, action: action as never });
  return NextResponse.json(result);
}
