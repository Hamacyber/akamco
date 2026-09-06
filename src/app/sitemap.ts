import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/constants';
import { getAllPosts } from '@/lib/blogStorage';

const SERVICE_SLUGS = [
  'consultancy-advisory',
  'system-design-engineering',
  'supply-procurement',
  'installation-deployment',
  'system-integration-commissioning',
  'managed-services-monitoring',
  'annual-maintenance-contracts',
  'it-outsourcing-staffing',
  'training-knowledge-transfer',
];

const SOLUTION_SLUGS = [
  'datacenter-solutions',
  'network-infrastructure',
  'fiber-measurement',
  'cybersecurity',
  'software-development',
  'software-licensing',
  'it-supply-hardware',
  'low-current-systems',
  'physical-security',
  'fire-life-safety',
  'gate-perimeter-security',
  'control-room-command',
  'av-systems',
  'renewable-energy',
  'ups-critical-power',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages = [
    { path: '', priority: 1.0, freq: 'daily' },
    { path: '/about', priority: 0.9, freq: 'monthly' },
    { path: '/services', priority: 0.9, freq: 'weekly' },
    { path: '/solutions', priority: 0.9, freq: 'weekly' },
    { path: '/partners', priority: 0.7, freq: 'monthly' },
    { path: '/blog', priority: 0.85, freq: 'daily' },
    { path: '/contact', priority: 0.7, freq: 'monthly' },
    { path: '/case-studies', priority: 0.75, freq: 'weekly' },
    { path: '/privacy-policy', priority: 0.3, freq: 'yearly' },
    { path: '/terms-of-service', priority: 0.3, freq: 'yearly' },
  ];

  const blogPosts = getAllPosts().map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.publishedAt),
    changeFrequency: 'monthly' as const,
    priority: post.featured ? 0.9 : 0.75,
  }));

  const servicePages = SERVICE_SLUGS.map((slug) => ({
    url: `${SITE_URL}/services/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  const solutionPages = SOLUTION_SLUGS.map((slug) => ({
    url: `${SITE_URL}/solutions/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  return [
    ...staticPages.map(({ path, priority, freq }) => ({
      url: `${SITE_URL}${path}`,
      lastModified: now,
      changeFrequency: freq as MetadataRoute.Sitemap[number]['changeFrequency'],
      priority,
    })),
    ...servicePages,
    ...solutionPages,
    ...blogPosts,
  ];
}
