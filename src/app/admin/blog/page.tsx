'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import type { BlogPost } from '@/data/blog';

const categoryColors: Record<string, string> = {
  'Cybersecurity':    'bg-red-500/15 text-red-400',
  'IT Infrastructure':'bg-blue-500/15 text-blue-400',
  'AI & Innovation':  'bg-purple-500/15 text-purple-400',
  'Government Tech':  'bg-amber-500/15 text-amber-400',
  'Project':         'bg-green-500/15 text-green-400',
  'Industry News':    'bg-teal-500/15 text-teal-400',
};

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/blog', { cache: 'no-store' });
      const data = await res.json();
      setPosts(Array.isArray(data) ? data : []);
    } catch {
      setPosts([]);
    }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleDelete(slug: string, title: string) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setDeleting(slug);
    await fetch(`/api/blog/${slug}`, { method: 'DELETE' });
    await load();
    setDeleting(null);
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  const filtered = posts.filter(
    (p) =>
      search === '' ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Blog Posts</h1>
          <p className="text-sm text-gray-400 mt-1">{posts.length} article{posts.length !== 1 ? 's' : ''} total</p>
        </div>
        <Link
          href="/admin/blog/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#00C46A] text-white text-sm font-semibold hover:bg-[#00a858] transition-colors shadow-lg shadow-[#00C46A]/20"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          New Post
        </Link>
      </div>

      {/* Search */}
      <div className="mb-6 relative max-w-xs">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
        <input
          type="text"
          placeholder="Search posts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder:text-gray-500 text-sm focus:outline-none focus:border-[#00C46A]/60 focus:ring-2 focus:ring-[#00C46A]/10 transition-colors"
        />
      </div>

      {/* Posts list */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="w-6 h-6 rounded-full border-2 border-[#00C46A] border-t-transparent animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-24 text-gray-500">
          <p className="mb-2 font-medium">{search ? 'No posts match your search.' : 'No posts yet.'}</p>
          {!search && (
            <Link href="/admin/blog/new" className="text-[#00C46A] text-sm hover:underline">
              Create your first post →
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((post) => (
            <div
              key={post.slug}
              className="flex items-center gap-4 p-4 rounded-2xl bg-gray-800/60 border border-gray-700/60 hover:border-gray-600/80 transition-colors group"
            >
              {/* Thumbnail */}
              <div className="flex-shrink-0 w-20 h-14 rounded-xl overflow-hidden bg-gray-700">
                {post.coverImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${categoryColors[post.category] ?? 'bg-gray-700 text-gray-400'}`}>
                    {post.category}
                  </span>
                  {post.featured && (
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#00C46A]/15 text-[#00C46A]">
                      Featured
                    </span>
                  )}
                </div>
                <p className="font-semibold text-white text-sm truncate group-hover:text-[#00C46A] transition-colors">
                  {post.title}
                </p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-gray-400">{post.author.name}</span>
                  <span className="text-gray-600">·</span>
                  <span className="text-xs text-gray-400">{formatDate(post.publishedAt)}</span>
                  <span className="text-gray-600">·</span>
                  <span className="text-xs text-gray-400">{post.readingTime} min read</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <Link
                  href={`/blog/${post.slug}`}
                  target="_blank"
                  className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
                  title="View post"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                  </svg>
                </Link>
                <Link
                  href={`/admin/blog/${post.slug}/edit`}
                  className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
                  title="Edit post"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                  </svg>
                </Link>
                <button
                  onClick={() => handleDelete(post.slug, post.title)}
                  disabled={deleting === post.slug}
                  className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50"
                  title="Delete post"
                >
                  {deleting === post.slug ? (
                    <div className="w-4 h-4 rounded-full border-2 border-red-400 border-t-transparent animate-spin" />
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
