import type { Metadata } from 'next';
import { getAllPosts } from '@/lib/blogStorage';
import BlogContent from './BlogContent';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Blog & Insights — Cybersecurity, IT & Technology',
  description:
    'Expert articles, technical deep-dives, and industry intelligence from the Akamco Technologies engineering and security teams.',
};

export default async function BlogPage({ searchParams }: { searchParams: { service?: string } }) {
  const posts = getAllPosts();
  return <BlogContent posts={posts} serviceFilter={searchParams.service} />;
}
