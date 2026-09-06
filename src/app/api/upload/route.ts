import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { requireAuth, unauthorizedResponse } from '@/lib/adminAuth';

export const dynamic = 'force-dynamic';

// Strict MIME → allowed extensions map (prevents extension spoofing)
const ALLOWED: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/jpg':  'jpg',
  'image/png':  'png',
  'image/webp': 'webp',
  'image/gif':  'gif',
};

// POST /api/upload
export async function POST(req: NextRequest) {
  const session = await requireAuth(req);
  if (!session) return unauthorizedResponse();

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided.' }, { status: 400 });
    }

    const ext = ALLOWED[file.type];
    if (!ext) {
      return NextResponse.json(
        { error: 'Only JPEG, PNG, WebP, and GIF images are allowed.' },
        { status: 400 }
      );
    }

    // Max 5 MB
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size must be under 5 MB.' }, { status: 400 });
    }

    // Use our own safe extension — never trust client filename extension
    const safeBase = file.name
      .replace(/\.[^.]+$/, '')
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '-')
      .slice(0, 60);
    const filename = `${safeBase}-${Date.now()}.${ext}`;

    const uploadDir = path.join(process.cwd(), 'public', 'images', 'blog');
    await mkdir(uploadDir, { recursive: true });

    const bytes = await file.arrayBuffer();
    await writeFile(path.join(uploadDir, filename), Buffer.from(bytes));

    return NextResponse.json({ url: `/images/blog/${filename}` }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Upload failed.' }, { status: 500 });
  }
}
