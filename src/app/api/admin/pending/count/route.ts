import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, unauthorizedResponse } from '@/lib/adminAuth';
import { getPendingCount } from '@/lib/pendingChanges';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const session = await requireAuth(req);
  if (!session) return unauthorizedResponse();
  if (session.role !== 'superadmin') return NextResponse.json({ count: 0 });
  return NextResponse.json({ count: getPendingCount() });
}
