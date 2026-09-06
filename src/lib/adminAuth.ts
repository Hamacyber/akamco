// ─── Admin Auth Utilities (server-only) ───────────────────────
import { SignJWT, jwtVerify } from 'jose';

const SESSION_SECRET_STR = process.env.ADMIN_SESSION_SECRET ?? 'akamco-secret-please-change-in-production';
const SESSION_SECRET     = new TextEncoder().encode(SESSION_SECRET_STR);

export const SESSION_COOKIE = 'akamco_admin_session';
export const STEP1_COOKIE   = 'akamco_admin_step1';

export interface SessionPayload {
  userId:   string;
  username: string;
  role:     string;
}

// ─── Full session (8h) ─────────────────────────────────────────
export async function createSession(user: SessionPayload): Promise<string> {
  return new SignJWT({ admin: true, v: 3, ...user })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1h')
    .sign(SESSION_SECRET);
}

export async function verifySession(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SESSION_SECRET);
    if (payload.admin !== true || !payload.userId) return null;
    return {
      userId:   payload.userId as string,
      username: payload.username as string,
      role:     payload.role    as string,
    };
  } catch {
    return null;
  }
}

// ─── Step-1 token (5m) — carries userId so step-2 knows who ───
export async function createStep1Token(userId: string): Promise<string> {
  return new SignJWT({ step: 1, userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('5m')
    .sign(SESSION_SECRET);
}

export async function verifyStep1Token(token: string): Promise<string | null> {
  try {
    const { payload } = await jwtVerify(token, SESSION_SECRET);
    if (payload.step !== 1 || !payload.userId) return null;
    return payload.userId as string;
  } catch {
    return null;
  }
}

// ─── Auth guard for API routes ─────────────────────────────────
import { NextRequest, NextResponse } from 'next/server';

export async function requireAuth(req: NextRequest): Promise<SessionPayload | null> {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySession(token);
}

export function unauthorizedResponse() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
