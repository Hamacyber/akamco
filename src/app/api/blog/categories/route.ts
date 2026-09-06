import { NextRequest, NextResponse } from 'next/server';
import { getAllCategories, addCategory } from '@/lib/blogStorage';
import { requireAuth, unauthorizedResponse } from '@/lib/adminAuth';

export const dynamic = 'force-dynamic';

// GET /api/blog/categories — list all categories (public, used by BlogContent + PostForm)
export async function GET() {
    try {
        return NextResponse.json(getAllCategories());
    } catch {
        return NextResponse.json({ error: 'Failed to load categories.' }, { status: 500 });
    }
}

// POST /api/blog/categories — add a new category
export async function POST(req: NextRequest) {
    const session = await requireAuth(req);
    if (!session) return unauthorizedResponse();
    try {
        const { name } = await req.json();
        if (!name || typeof name !== 'string' || !name.trim()) {
            return NextResponse.json({ error: 'Category name is required.' }, { status: 400 });
        }
        const cats = addCategory(name);
        return NextResponse.json(cats, { status: 201 });
    } catch {
        return NextResponse.json({ error: 'Failed to add category.' }, { status: 500 });
    }
}
