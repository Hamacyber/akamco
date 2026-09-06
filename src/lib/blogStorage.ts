// ─── Blog Storage ──────────────────────────────────────────────
// Server-side ONLY. Reads/writes blog-data.json at the project root.
// All blog pages and API routes use this instead of the static seed
// so that admin-created posts are persisted and immediately visible.

import fs from 'fs';
import path from 'path';
import { blogPosts as seedData, DEFAULT_BLOG_CATEGORIES } from '@/data/blog';
import type { BlogPost, BlogCategory } from '@/data/blog';

const DATA_FILE = path.join(process.cwd(), 'blog-data.json');
const CAT_FILE = path.join(process.cwd(), 'blog-categories.json');

// ─── Category Storage ──────────────────────────────────────────
function readCategories(): BlogCategory[] {
  if (!fs.existsSync(CAT_FILE)) {
    fs.writeFileSync(CAT_FILE, JSON.stringify(DEFAULT_BLOG_CATEGORIES, null, 2), 'utf-8');
    return DEFAULT_BLOG_CATEGORIES;
  }
  try {
    return JSON.parse(fs.readFileSync(CAT_FILE, 'utf-8')) as BlogCategory[];
  } catch {
    return DEFAULT_BLOG_CATEGORIES;
  }
}

function writeCategories(cats: BlogCategory[]): void {
  fs.writeFileSync(CAT_FILE, JSON.stringify(cats, null, 2), 'utf-8');
}

export function getAllCategories(): BlogCategory[] {
  return readCategories();
}

export function addCategory(name: string): BlogCategory[] {
  const cats = readCategories();
  const trimmed = name.trim();
  if (!trimmed || cats.includes(trimmed)) return cats;
  cats.push(trimmed);
  writeCategories(cats);
  return cats;
}

export function deleteCategory(name: string): BlogCategory[] {
  const cats = readCategories().filter((c) => c !== name);
  writeCategories(cats);
  return cats;
}

export function updateCategory(oldName: string, newName: string): BlogCategory[] {
  const trimmed = newName.trim();
  if (!trimmed || oldName === trimmed) return readCategories();
  const cats = readCategories().map((c) => (c === oldName ? trimmed : c));
  writeCategories(cats);
  // Also update all posts that used the old category
  const posts = read();
  let changed = false;
  for (const p of posts) {
    if (p.category === oldName) { p.category = trimmed; changed = true; }
  }
  if (changed) write(posts);
  return cats;
}

// ─── Internal Helpers ──────────────────────────────────────────
function read(): BlogPost[] {
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(seedData, null, 2), 'utf-8');
  }
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8')) as BlogPost[];
  } catch {
    return seedData;
  }
}

function write(posts: BlogPost[]): void {
  fs.writeFileSync(DATA_FILE, JSON.stringify(posts, null, 2), 'utf-8');
}

// ─── Public API ────────────────────────────────────────────────
export function getAllPosts(): BlogPost[] {
  return read().sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export function getPost(slug: string): BlogPost | undefined {
  return read().find((p) => p.slug === slug);
}

export function getAllSlugs(): string[] {
  return read().map((p) => p.slug);
}

export function createPost(post: BlogPost): BlogPost {
  const posts = read();
  // Ensure no duplicate slug
  if (posts.some((p) => p.slug === post.slug)) {
    throw new Error(`Post with slug "${post.slug}" already exists.`);
  }
  posts.push(post);
  write(posts);
  return post;
}

export function updatePost(slug: string, updates: Partial<BlogPost>): BlogPost | null {
  const posts = read();
  const idx = posts.findIndex((p) => p.slug === slug);
  if (idx === -1) return null;
  posts[idx] = { ...posts[idx], ...updates };
  write(posts);
  return posts[idx];
}

export function deletePost(slug: string): boolean {
  const posts = read();
  const idx = posts.findIndex((p) => p.slug === slug);
  if (idx === -1) return false;
  posts.splice(idx, 1);
  write(posts);
  return true;
}

export function getRelatedPosts(slug: string, count = 3): BlogPost[] {
  const all = read();
  const post = all.find((p) => p.slug === slug);
  if (!post) return [];
  return all
    .filter((p) => p.slug !== slug && p.category === post.category)
    .slice(0, count);
}

export type { BlogPost, BlogCategory };
