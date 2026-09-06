import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPost, getRelatedPosts } from '@/lib/blogStorage';
import { SITE_URL, SITE_NAME, SITE_OG_IMAGE } from '@/lib/constants';
import BlogPostContent from './BlogPostContent';

export const dynamic = 'force-dynamic';

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getPost(params.slug);
  if (!post) return {};

  const url = `${SITE_URL}/blog/${post.slug}`;
  const image = post.coverImage
    ? (post.coverImage.startsWith('http') ? post.coverImage : `${SITE_URL}${post.coverImage}`)
    : `${SITE_URL}${SITE_OG_IMAGE}`;

  return {
    title: post.title,
    description: post.excerpt,
    authors: [{ name: post.author.name }],
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      url,
      title: post.title,
      description: post.excerpt,
      siteName: SITE_NAME,
      publishedTime: post.publishedAt,
      authors: [post.author.name],
      tags: post.tags ?? [],
      images: [{ url: image, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [image],
    },
  };
}

export default function BlogPostPage({ params }: Props) {
  const post = getPost(params.slug);
  if (!post) notFound();
  const related = getRelatedPosts(params.slug);

  const url = `${SITE_URL}/blog/${post.slug}`;
  const image = post.coverImage
    ? (post.coverImage.startsWith('http') ? post.coverImage : `${SITE_URL}${post.coverImage}`)
    : `${SITE_URL}${SITE_OG_IMAGE}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    url,
    image,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    author: {
      '@type': 'Person',
      name: post.author.name,
      jobTitle: post.author.role,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
    keywords: (post.tags ?? []).join(', '),
    articleSection: post.category,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BlogPostContent post={post} related={related} />
    </>
  );
}
