import { NextRequest, NextResponse } from 'next/server';
import { deleteCategory, updateCategory } from '@/lib/blogStorage';
import { requireAuth, unauthorizedResponse } from '@/lib/adminAuth';

export const dynamic = 'force-dynamic';

// DELETE /api/blog/categories/[name] — remove a category
export async function DELETE(
    req: NextRequest,
    { params }: { params: { name: string } }
) {
    const session = await requireAuth(req);
    if (!session) return unauthorizedResponse();
    try {
        const name = decodeURIComponent(params.name);
        const cats = deleteCategory(name);
        return NextResponse.json(cats);
    } catch {
        return NextResponse.json({ error: 'Failed to delete category.' }, { status: 500 });
    }
}

// PATCH /api/blog/categories/[name] — rename a category
export async function PATCH(
    req: NextRequest,
    { params }: { params: { name: string } }
) {
    const session = await requireAuth(req);
    if (!session) return unauthorizedResponse();
    try {
        const oldName = decodeURIComponent(params.name);
        const { name: newName } = await req.json();
        if (!newName || typeof newName !== 'string' || !newName.trim()) {
            return NextResponse.json({ error: 'New name is required.' }, { status: 400 });
        }
        const cats = updateCategory(oldName, newName);
        return NextResponse.json(cats);
    } catch {
        return NextResponse.json({ error: 'Failed to rename category.' }, { status: 500 });
    }
}
