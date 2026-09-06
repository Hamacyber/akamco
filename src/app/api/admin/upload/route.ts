import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, unauthorizedResponse } from '@/lib/adminAuth';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

// POST /api/admin/upload
// Body: multipart/form-data  { file: File, folder?: string }
export async function POST(req: NextRequest) {
  const session = await requireAuth(req);
  if (!session) return unauthorizedResponse();

  let formData: FormData;
  try { formData = await req.formData(); }
  catch { return NextResponse.json({ error: 'Invalid form data' }, { status: 400 }); }

  const file = formData.get('file') as File | null;
  if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });

  const folder = (formData.get('folder') as string | null)?.replace(/[^a-z0-9-_]/gi, '') || 'uploads';

  // Validate type
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
  if (!allowed.includes(file.type)) {
    return NextResponse.json({ error: 'Only image files are allowed (jpg, png, webp, gif, svg)' }, { status: 415 });
  }

  // Validate size (5 MB max)
  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: 'File too large (max 5 MB)' }, { status: 413 });
  }

  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const safeName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const dir = path.join(process.cwd(), 'public', 'uploads', folder);
  fs.mkdirSync(dir, { recursive: true });

  const buffer = Buffer.from(await file.arrayBuffer());
  fs.writeFileSync(path.join(dir, safeName), buffer);

  const url = `/uploads/${folder}/${safeName}`;
  return NextResponse.json({ url });
}
