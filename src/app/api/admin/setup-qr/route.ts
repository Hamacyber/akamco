import { NextRequest, NextResponse } from 'next/server';
import { verifyStep1Token, verifySession, STEP1_COOKIE, SESSION_COOKIE } from '@/lib/adminAuth';
import { getUserById, getTOTPUri } from '@/lib/userStorage';
import QRCode from 'qrcode';

export const dynamic = 'force-dynamic';

// GET /api/admin/setup-qr — returns QR code data URL + secret
// Requires either a valid session OR a valid step1 token
export async function GET(req: NextRequest) {
  const sessionToken = req.cookies.get(SESSION_COOKIE)?.value;
  const step1Token   = req.cookies.get(STEP1_COOKIE)?.value;

  let userId: string | null = null;

  if (sessionToken) {
    const s = await verifySession(sessionToken);
    if (s) userId = s.userId;
  }
  if (!userId && step1Token) {
    userId = await verifyStep1Token(step1Token);
  }

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = getUserById(userId);
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  const uri       = getTOTPUri(user);
  const secret    = user.totpSecret ?? '';
  const qrDataUrl = await QRCode.toDataURL(uri, { width: 280, margin: 2 });

  return NextResponse.json({ qrDataUrl, secret, uri });
}
