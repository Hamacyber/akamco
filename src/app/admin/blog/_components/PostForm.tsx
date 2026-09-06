'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { BlogPost } from '@/data/blog';
import RichEditor from './RichEditor';

interface PostFormProps {
  initial?: Partial<BlogPost>;
  mode: 'create' | 'edit';
  slug?: string; // needed for edit
}

function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80);
}

export default function PostForm({ initial, mode, slug }: PostFormProps) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const [categories, setCategories] = useState<string[]>([]);
  useEffect(() => {
    fetch('/api/blog/categories')
      .then((r) => r.json())
      .then((d) => setCategories(Array.isArray(d) ? d : []))
      .catch(() => { });
  }, []);

  const [form, setForm] = useState({
    title: initial?.title ?? '',
    slug: initial?.slug ?? '',
    excerpt: initial?.excerpt ?? '',
    content: initial?.content ?? '',
    category: initial?.category ?? '',
    authorName: initial?.author?.name ?? 'Akamco Team',
    authorRole: initial?.author?.role ?? '',
    authorBio: initial?.author?.bio ?? '',
    publishedAt: initial?.publishedAt ?? new Date().toISOString().slice(0, 10),
    readingTime: String(initial?.readingTime ?? 5),
    coverImage: initial?.coverImage ?? '',
    featured: initial?.featured ?? false,
    tags: initial?.tags?.join(', ') ?? '',
    relatedService: initial?.relatedService ?? '',
  });

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState(initial?.coverImage ?? '');

  function set(key: keyof typeof form, value: string | boolean) {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      // Auto-generate slug from title in create mode
      if (key === 'title' && mode === 'create') {
        next.slug = slugify(value as string);
      }
      // Live preview for coverImage URL
      if (key === 'coverImage') {
        setImagePreview(String(value));
      }
      return next;
    });
  }

  async function uploadFile(file: File) {
    setUploading(true);
    setError('');
    const fd = new FormData();
    fd.append('file', file);
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Upload failed');
      set('coverImage', data.url);
      setImagePreview(data.url);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Upload failed');
    }
    setUploading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');

    const payload = {
      ...form,
      readingTime: Number(form.readingTime),
    };

    try {
      const url = mode === 'create' ? '/api/blog' : `/api/blog/${slug}`;
      const method = mode === 'create' ? 'POST' : 'PUT';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Save failed');
      router.push('/admin/blog');
      router.refresh();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Save failed');
    }
    setSaving(false);
  }

  return (
    <form onSubmit={handleSubmit} className="p-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">
            {mode === 'create' ? 'New Post' : 'Edit Post'}
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            {mode === 'create' ? 'Create a new blog article.' : `Editing: /${slug}`}
          </p>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => router.push('/admin/blog')}
            className="px-4 py-2.5 rounded-xl border border-gray-700 text-gray-300 text-sm hover:bg-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00C46A] text-white text-sm font-semibold hover:bg-[#00a858] disabled:opacity-60 transition-colors shadow-lg shadow-[#00C46A]/20"
          >
            {saving && <div className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />}
            {mode === 'create' ? 'Publish Post' : 'Save Changes'}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="grid lg:grid-cols-[1fr_320px] gap-8">
        {/* Left column */}
        <div className="space-y-6">

          {/* Title */}
          <Field label="Title" required>
            <input
              type="text"
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
              placeholder="Enter article title..."
              required
              className={inputCls}
            />
          </Field>

          {/* Slug */}
          <Field label="Slug" hint="URL path: /blog/your-slug-here">
            <input
              type="text"
              value={form.slug}
              onChange={(e) => set('slug', slugify(e.target.value))}
              placeholder="article-slug"
              required
              readOnly={mode === 'edit'}
              className={`${inputCls} ${mode === 'edit' ? 'opacity-60 cursor-not-allowed' : ''}`}
            />
          </Field>

          {/* Excerpt */}
          <Field label="Excerpt" required hint="Short description shown on cards and in meta tags">
            <textarea
              value={form.excerpt}
              onChange={(e) => set('excerpt', e.target.value)}
              placeholder="Brief summary of the article..."
              required
              rows={3}
              className={textareaCls}
            />
          </Field>

          {/* Content */}
          <Field label="Content" hint="Rich text — use toolbar to add headings, images, YouTube videos, links and more">
            <RichEditor value={form.content} onChange={(html) => set('content', html)} />
          </Field>



        </div>

        {/* Right sidebar */}
        <div className="space-y-6">

          {/* Cover Image */}
          <div className="rounded-2xl bg-gray-800/60 border border-gray-700/60 p-5 space-y-4">
            <p className="text-sm font-semibold text-white">Cover Image</p>

            {/* Preview */}
            <div className="relative w-full h-36 rounded-xl overflow-hidden bg-gray-750 border border-gray-700">
              {imagePreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={imagePreview} alt="Cover preview" className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center justify-center h-full gap-2">
                  <svg className="w-8 h-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                  </svg>
                  <p className="text-xs text-gray-500">No image</p>
                </div>
              )}
            </div>

            {/* URL input */}
            <input
              type="text"
              value={form.coverImage}
              onChange={(e) => set('coverImage', e.target.value)}
              placeholder="https://... or leave blank to upload"
              className={inputCls}
            />

            {/* Upload button */}
            <div>
              <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) uploadFile(f);
                }}
              />
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gray-600 text-gray-300 text-sm hover:bg-gray-700 disabled:opacity-60 transition-colors"
              >
                {uploading ? (
                  <div className="w-4 h-4 rounded-full border-2 border-gray-300 border-t-transparent animate-spin" />
                ) : (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                  </svg>
                )}
                {uploading ? 'Uploading...' : 'Upload Image'}
              </button>
              <p className="text-[10px] text-gray-500 mt-2 text-center">JPG, PNG, WebP · Max 5 MB</p>
            </div>
          </div>

          {/* Settings */}
          <div className="rounded-2xl bg-gray-800/60 border border-gray-700/60 p-5 space-y-4">
            <p className="text-sm font-semibold text-white">Settings</p>

            <Field label="Category" required>
              <select
                value={form.category}
                onChange={(e) => set('category', e.target.value)}
                className={selectCls}
                required
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </Field>

            <Field label="Publish Date">
              <input
                type="date"
                value={form.publishedAt}
                onChange={(e) => set('publishedAt', e.target.value)}
                className={inputCls}
              />
            </Field>

            <Field label="Reading Time (minutes)">
              <input
                type="number"
                min={1}
                max={60}
                value={form.readingTime}
                onChange={(e) => set('readingTime', e.target.value)}
                className={inputCls}
              />
            </Field>

            <Field label="Tags" hint="Comma-separated list">
              <input
                type="text"
                value={form.tags}
                onChange={(e) => set('tags', e.target.value)}
                placeholder="Security, Zero Trust, NIST"
                className={inputCls}
              />
            </Field>

            {/* Featured toggle */}
            <label className="flex items-center gap-3 cursor-pointer">
              <div
                onClick={() => set('featured', !form.featured)}
                className={`relative w-10 h-5 rounded-full transition-colors ${form.featured ? 'bg-[#00C46A]' : 'bg-gray-600'}`}
              >
                <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${form.featured ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </div>
              <span className="text-sm text-gray-300">Mark as Featured</span>
            </label>

            {/* Related Service / Solution */}
            <Field label="Related Service / Solution" hint="Links this post to a service or solution page">
              <select
                value={form.relatedService}
                onChange={(e) => set('relatedService', e.target.value)}
                className={selectCls}
              >
                <option value="">— Not linked —</option>
                <optgroup label="Services">
                  <option value="consultancy-advisory">Consultancy &amp; Advisory</option>
                  <option value="system-design-engineering">System Design &amp; Engineering</option>
                  <option value="supply-procurement">Supply &amp; Procurement</option>
                  <option value="installation-deployment">Installation &amp; Deployment</option>
                  <option value="system-integration-commissioning">System Integration &amp; Commissioning</option>
                  <option value="managed-services-monitoring">Managed Services &amp; Monitoring</option>
                  <option value="annual-maintenance-contracts">Annual Maintenance Contracts</option>
                  <option value="it-outsourcing-staffing">IT Outsourcing &amp; Staffing</option>
                  <option value="training-knowledge-transfer">Training &amp; Knowledge Transfer</option>
                </optgroup>
                <optgroup label="Solutions">
                  <option value="datacenter-solutions">Datacenter Solutions</option>
                  <option value="network-infrastructure">Network Infrastructure</option>
                  <option value="fiber-measurement">Fiber Measurement</option>
                  <option value="cybersecurity">Cybersecurity</option>
                  <option value="software-development">Software Development</option>
                  <option value="software-licensing">Software Licensing</option>
                  <option value="it-supply-hardware">IT Supply &amp; Hardware</option>
                  <option value="low-current-systems">Low Current Systems</option>
                  <option value="physical-security">Physical Security</option>
                  <option value="fire-life-safety">Fire &amp; Life Safety</option>
                  <option value="gate-perimeter-security">Gate &amp; Perimeter Security</option>
                  <option value="control-room-command">Control Room &amp; Command Center</option>
                  <option value="av-systems">AV Systems</option>
                  <option value="renewable-energy">Renewable Energy</option>
                  <option value="ups-critical-power">UPS &amp; Critical Power</option>
                </optgroup>
              </select>
            </Field>
          </div>

          {/* Author */}
          <div className="rounded-2xl bg-gray-800/60 border border-gray-700/60 p-5 space-y-4">
            <p className="text-sm font-semibold text-white">Author</p>
            <Field label="Name">
              <input
                type="text"
                value={form.authorName}
                onChange={(e) => set('authorName', e.target.value)}
                placeholder="Author name"
                className={inputCls}
              />
            </Field>
            <Field label="Role / Department">
              <input
                type="text"
                value={form.authorRole}
                onChange={(e) => set('authorRole', e.target.value)}
                placeholder="e.g. Cybersecurity Division"
                className={inputCls}
              />
            </Field>
            <Field label="Bio" hint="Short bio shown in the sidebar of the post">
              <textarea
                value={form.authorBio}
                onChange={(e) => set('authorBio', e.target.value)}
                placeholder="Brief description of the author or team..."
                rows={3}
                className={textareaCls}
              />
            </Field>
          </div>

        </div>
      </div>
    </form>
  );
}

/* ─── Small helpers ──────────────────────────────────────────── */
function Field({ label, children, hint, required }: {
  label: string;
  children: React.ReactNode;
  hint?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider">
        {label}{required && <span className="text-[#00C46A] ml-0.5">*</span>}
      </label>
      {children}
      {hint && <p className="text-[10px] text-gray-500 mt-1">{hint}</p>}
    </div>
  );
}

const inputCls =
  'w-full px-3.5 py-2.5 rounded-xl bg-gray-900 border border-gray-700 text-white placeholder:text-gray-500 text-sm focus:outline-none focus:border-[#00C46A]/60 focus:ring-2 focus:ring-[#00C46A]/10 transition-colors';

const textareaCls =
  'w-full px-3.5 py-2.5 rounded-xl bg-gray-900 border border-gray-700 text-white placeholder:text-gray-500 text-sm focus:outline-none focus:border-[#00C46A]/60 focus:ring-2 focus:ring-[#00C46A]/10 transition-colors resize-y leading-relaxed';

const selectCls =
  'w-full px-3.5 py-2.5 rounded-xl bg-gray-900 border border-gray-700 text-white text-sm focus:outline-none focus:border-[#00C46A]/60 focus:ring-2 focus:ring-[#00C46A]/10 transition-colors appearance-none';
