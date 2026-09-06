import { NextRequest, NextResponse } from 'next/server';
import { getAllPosts, createPost } from '@/lib/blogStorage';
import { requireAuth, unauthorizedResponse } from '@/lib/adminAuth';
import { appendLog } from '@/lib/activityLog';
import { getIpFromRequest, checkPublicRateLimit } from '@/lib/rateLimit';

export const dynamic = 'force-dynamic';

// GET  /api/blog  — list all posts
export async function GET(req: NextRequest) {
  const ip = getIpFromRequest(req);
  const rl = checkPublicRateLimit(ip);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: 'Too many requests. Please slow down.' },
      { status: 429, headers: { 'Retry-After': String(rl.retryAfter) } }
    );
  }
  try {
    const posts = getAllPosts();
    return NextResponse.json(posts);
  } catch {
    return NextResponse.json({ error: 'Failed to load posts.' }, { status: 500 });
  }
}

// POST /api/blog  — create a new post
export async function POST(req: NextRequest) {
  const session = await requireAuth(req);
  if (!session) return unauthorizedResponse();

  try {
    const body = await req.json();

    // Minimal validation
    if (!body.slug || !body.title || !body.category) {
      return NextResponse.json(
        { error: 'slug, title, and category are required.' },
        { status: 400 }
      );
    }

    // Server-side slug sanitisation — only allow lowercase alphanum and hyphens
    const safeSlug = String(body.slug)
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 100);

    if (!safeSlug) {
      return NextResponse.json({ error: 'Invalid slug.' }, { status: 400 });
    }

    // Whitelist category
    const VALID_CATEGORIES = ['Cybersecurity', 'IT Infrastructure', 'AI & Innovation', 'Government Tech', 'Project', 'Industry News'];
    if (!VALID_CATEGORIES.includes(body.category)) {
      return NextResponse.json({ error: 'Invalid category.' }, { status: 400 });
    }

    const post = createPost({
      slug: safeSlug,
      title: body.title,
      excerpt: body.excerpt ?? '',
      content: body.content ?? '',
      category: body.category,
      author: {
        name: body.authorName ?? 'Akamco Team',
        role: body.authorRole ?? '',
        bio: body.authorBio ?? '',
      },
      publishedAt: body.publishedAt ?? new Date().toISOString().slice(0, 10),
      readingTime: Number(body.readingTime) || 5,
      coverImage: body.coverImage ?? '',
      featured: Boolean(body.featured),
      tags: Array.isArray(body.tags)
        ? body.tags
        : String(body.tags ?? '')
            .split(',')
            .map((t: string) => t.trim())
            .filter(Boolean),
      youtubeUrls: Array.isArray(body.youtubeUrls) ? body.youtubeUrls.filter(Boolean) : [],
      extraImages: Array.isArray(body.extraImages) ? body.extraImages : [],
      videoUrl: body.videoUrl ?? '',
      relatedService: body.relatedService ?? '',
    });

    // Log the action
    appendLog({ userId: session.userId, username: session.username, role: session.role, action: 'blog_create', detail: `Created post "${post.title}"`, ip: getIpFromRequest(req) });

    return NextResponse.json(post, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create post.' }, { status: 500 });
  }
}
