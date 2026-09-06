import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, unauthorizedResponse } from '@/lib/adminAuth';
import { getPendingByStatus, getAllPending } from '@/lib/pendingChanges';

export const dynamic = 'force-dynamic';

// GET /api/admin/pending?status=pending|approved|rejected|all
export async function GET(req: NextRequest) {
  const session = await requireAuth(req);
  if (!session) return unauthorizedResponse();
  if (session.role !== 'superadmin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const status = req.nextUrl.searchParams.get('status') ?? 'pending';
  const changes = status === 'all' ? getAllPending() : getPendingByStatus(status as 'pending' | 'approved' | 'rejected');
  return NextResponse.json({ changes });
}
