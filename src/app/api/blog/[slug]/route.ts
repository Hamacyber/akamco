import { NextRequest, NextResponse } from 'next/server';
import { getPost, updatePost, deletePost } from '@/lib/blogStorage';
import { requireAuth, unauthorizedResponse } from '@/lib/adminAuth';
import { appendLog } from '@/lib/activityLog';
import { getIpFromRequest } from '@/lib/rateLimit';

export const dynamic = 'force-dynamic';

interface Params {
  params: { slug: string };
}

// GET /api/blog/[slug]
export async function GET(_req: NextRequest, { params }: Params) {
  const post = getPost(params.slug);
  if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(post);
}

// PUT /api/blog/[slug]  — update a post
export async function PUT(req: NextRequest, { params }: Params) {
  const session = await requireAuth(req);
  if (!session) return unauthorizedResponse();

  try {
    const body = await req.json();

    // Whitelist category if provided
    const VALID_CATEGORIES = ['Cybersecurity', 'IT Infrastructure', 'AI & Innovation', 'Government Tech', 'Project', 'Industry News'];
    if (body.category !== undefined && !VALID_CATEGORIES.includes(body.category)) {
      return NextResponse.json({ error: 'Invalid category.' }, { status: 400 });
    }

    const updated = updatePost(params.slug, {
      title: body.title,
      excerpt: body.excerpt,
      content: body.content,
      category: body.category,
      author: body.authorName
        ? { name: body.authorName, role: body.authorRole ?? '', bio: body.authorBio ?? '' }
        : undefined,
      publishedAt: body.publishedAt,
      readingTime: body.readingTime ? Number(body.readingTime) : undefined,
      coverImage: body.coverImage,
      featured: body.featured !== undefined ? Boolean(body.featured) : undefined,
      tags: body.tags
        ? Array.isArray(body.tags)
          ? body.tags
          : String(body.tags)
              .split(',')
              .map((t: string) => t.trim())
              .filter(Boolean)
        : undefined,
      youtubeUrls: Array.isArray(body.youtubeUrls) ? body.youtubeUrls.filter(Boolean) : [],
      extraImages: Array.isArray(body.extraImages) ? body.extraImages : [],
      videoUrl: body.videoUrl ?? '',
      relatedService: body.relatedService ?? '',
    });

    if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    appendLog({ userId: session.userId, username: session.username, role: session.role, action: 'blog_update', detail: `Updated post "${updated.title}"`, ip: getIpFromRequest(req) });

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: 'Failed to update post.' }, { status: 500 });
  }
}

// DELETE /api/blog/[slug]
export async function DELETE(req: NextRequest, { params }: Params) {
  const session = await requireAuth(req);
  if (!session) return unauthorizedResponse();

  const post = getPost(params.slug);
  const ok = deletePost(params.slug);
  if (!ok) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  if (post) {
    appendLog({ userId: session.userId, username: session.username, role: session.role, action: 'blog_delete', detail: `Deleted post "${post.title}"`, ip: getIpFromRequest(req) });
  }

  return NextResponse.json({ success: true });
}
