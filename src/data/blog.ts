// ─── Blog Data ─────────────────────────────────────────────────
// Seed data — the live data layer reads from blog-data.json via
// src/lib/blogStorage.ts. This file is used only as the initial
// seed when no blog-data.json exists yet.

// Categories are managed dynamically via /api/blog/categories (blog-categories.json)
// This type stays as string so any admin-created category works without code changes.
export type BlogCategory = string;

export const DEFAULT_BLOG_CATEGORIES: BlogCategory[] = [
  'Cybersecurity',
  'IT Infrastructure',
  'AI & Innovation',
  'Government Tech',
  'Project',
  'Industry News',
];

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content?: string;
  category: BlogCategory;
  author: {
    name: string;
    role: string;
    avatar?: string;
    bio?: string;
  };
  publishedAt: string; // ISO date string
  readingTime: number; // minutes
  coverImage?: string; // URL or /images/blog/filename.jpg
  featured?: boolean;
  tags: string[];
  // Rich media
  youtubeUrls?: string[];          // YouTube video URLs to embed in the post
  extraImages?: {                   // Additional images beyond the cover
    url: string;
    caption?: string;
    position?: number;              // Insert after paragraph N (0 = before body text)
  }[];
  videoUrl?: string;               // Direct video file URL (mp4, etc.)
  relatedService?: string;         // Service or solution slug this post is related to
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'zero-trust-architecture-government-2025',
    title: 'Zero-Trust Architecture: The New Standard for Government Networks',
    excerpt:
      'As cyber threats grow more sophisticated, government agencies across the Middle East are adopting zero-trust frameworks. We outline the critical pillars and implementation roadmap.',
    category: 'Cybersecurity',
    author: { name: 'Akamco Security Team', role: 'Cybersecurity Division' },
    publishedAt: '2025-11-18',
    readingTime: 8,
    featured: true,
    coverImage: 'https://picsum.photos/seed/zerotrust2025/1200/630',
    tags: ['Zero Trust', 'Government', 'Network Security', 'NIST'],
  },
  {
    slug: 'ai-driven-soc-operations',
    title: 'How AI Is Transforming SOC Operations in 2025',
    excerpt:
      'Modern Security Operations Centers are leveraging machine learning for threat detection, reducing MTTD by up to 70%. Here is what deploying AI in your SOC actually looks like.',
    category: 'AI & Innovation',
    author: { name: 'Akamco AI Lab', role: 'Innovation Division' },
    publishedAt: '2025-10-29',
    readingTime: 6,
    coverImage: 'https://picsum.photos/seed/aisocsec/1200/630',
    tags: ['AI', 'SOC', 'Threat Detection', 'Automation'],
  },
  {
    slug: 'data-center-power-efficiency-iraq',
    title: 'Building Energy-Efficient Data Centers in Extreme Climates',
    excerpt:
      'Data center cooling in Iraq presents unique challenges. We explore the hybrid cooling architectures, UPS configurations, and power topologies our engineers deploy.',
    category: 'IT Infrastructure',
    author: { name: 'Infrastructure Team', role: 'Data Center Division' },
    publishedAt: '2025-10-05',
    readingTime: 7,
    coverImage: 'https://picsum.photos/seed/datacenteriq/1200/630',
    tags: ['Data Center', 'Power Solutions', 'Cooling', 'UPS'],
  },
  {
    slug: 'digital-transformation-public-sector',
    title: 'Digital Transformation in the Iraqi Public Sector: Challenges & Opportunities',
    excerpt:
      'Government digitization is accelerating across Iraq. We examine procurement frameworks, connectivity gaps, and the technology stack enabling modern e-government services.',
    category: 'Government Tech',
    author: { name: 'Akamco Consulting', role: 'Government Solutions' },
    publishedAt: '2025-09-14',
    readingTime: 9,
    coverImage: 'https://picsum.photos/seed/govdigital/1200/630',
    tags: ['Digital Government', 'E-Services', 'Iraq', 'Public Sector'],
  },
  {
    slug: 'fiber-network-infrastructure-rollout',
    title: 'Enterprise Fiber Network Rollout: Lessons from 50+ Deployments',
    excerpt:
      'After deploying structured cabling and fiber backbone networks for over 50 enterprises, here are the planning principles, common pitfalls, and best practices we have refined.',
    category: 'IT Infrastructure',
    author: { name: 'Network Engineering', role: 'Infrastructure Division' },
    publishedAt: '2025-08-22',
    readingTime: 5,
    coverImage: 'https://picsum.photos/seed/fibernetwork/1200/630',
    tags: ['Fiber', 'Structured Cabling', 'Network', 'Enterprise'],
  },
  {
    slug: 'ransomware-response-playbook',
    title: 'The Ransomware Response Playbook: Contain, Recover, Prevent',
    excerpt:
      'Ransomware incidents doubled region-wide last year. This step-by-step playbook covers isolation procedures, backup validation, forensic investigation, and hardening measures.',
    category: 'Cybersecurity',
    author: { name: 'Akamco IR Team', role: 'Incident Response' },
    publishedAt: '2025-08-01',
    readingTime: 10,
    coverImage: 'https://picsum.photos/seed/ransomwareir/1200/630',
    tags: ['Ransomware', 'Incident Response', 'Backup', 'Recovery'],
  },
  {
    slug: 'smart-surveillance-case-study-ministry',
    title: 'Case Study: AI-Powered Surveillance for a Government Ministry',
    excerpt:
      'We deployed an integrated IP camera network with AI analytics covering 200+ locations. Discover the architecture, integration challenges, and outcomes achieved.',
    category: 'Project',
    author: { name: 'Akamco Projects', role: 'Security Systems Division' },
    relatedService: 'physical-security',
    publishedAt: '2025-07-10',
    readingTime: 7,
    coverImage: 'https://picsum.photos/seed/surveillance/1200/630',
    tags: ['CCTV', 'AI Analytics', 'Government', 'Case Study'],
  },
  {
    slug: 'middle-east-cybersecurity-landscape-2025',
    title: 'The Middle East Cybersecurity Landscape: 2025 Threat Report',
    excerpt:
      'A summary of the top attack vectors, threat actors, and sectoral vulnerabilities observed across the Gulf and Levant regions, with actionable defense recommendations.',
    category: 'Industry News',
    author: { name: 'Akamco Research', role: 'Threat Intelligence' },
    publishedAt: '2025-06-25',
    readingTime: 11,
    coverImage: 'https://picsum.photos/seed/menacsreport/1200/630',
    tags: ['Threat Intelligence', 'MENA', 'Annual Report', 'Attack Trends'],
  },
  {
    slug: 'iraq-cybersecurity-law-2025-guide',
    title: "Iraq's New Cybersecurity Law 2025: What Every IT Leader Must Know",
    excerpt:
      "Iraq's landmark cybersecurity legislation has entered force, introducing mandatory incident reporting, data residency requirements, and penalties for non-compliant organizations. Here is a plain-language breakdown for IT and security leaders.",
    category: 'Industry News',
    author: { name: 'Akamco Research', role: 'Regulatory Intelligence' },
    publishedAt: '2026-01-14',
    readingTime: 7,
    coverImage: 'https://picsum.photos/seed/iraqlaw2025/1200/630',
    tags: ['Regulation', 'Iraq', 'Compliance', 'Cybersecurity Law'],
  },
  {
    slug: 'ransomware-payments-record-2025',
    title: 'Ransomware Payments Hit Record $2.3 Billion in 2025 — MENA Sees Surge',
    excerpt:
      'New data from leading cybersecurity research firms shows global ransomware payments reached an all-time high in 2025, with Middle East and North Africa organizations among the fastest-growing targets.',
    category: 'Industry News',
    author: { name: 'Akamco Threat Intel', role: 'Threat Intelligence Division' },
    publishedAt: '2026-02-03',
    readingTime: 5,
    coverImage: 'https://picsum.photos/seed/ransompay2025/1200/630',
    tags: ['Ransomware', 'MENA', 'Industry Stats', 'Threat Trends'],
  },
  {
    slug: 'windows-10-eol-migration-guide',
    title: 'Windows 10 End of Life: Your Migration Roadmap Before October 2025',
    excerpt:
      'Microsoft officially ends Windows 10 mainstream support. With millions of enterprise endpoints still running the OS, organizations have a narrow window to plan and execute a safe migration.',
    category: 'Industry News',
    author: { name: 'Akamco Infrastructure', role: 'Systems Division' },
    publishedAt: '2026-02-11',
    readingTime: 6,
    coverImage: 'https://picsum.photos/seed/win10eol2025/1200/630',
    tags: ['Windows 10', 'Migration', 'Microsoft', 'End of Life'],
  },
  {
    slug: 'ot-security-critical-infrastructure',
    title: 'Securing Operational Technology: OT Security for Critical Infrastructure',
    excerpt:
      'Power grids, water treatment facilities, and oil & gas networks face a wave of targeted attacks. This deep-dive covers OT environments, Purdue model segmentation, ICS-specific threat detection, and integrated IT/OT security architecture.',
    category: 'Cybersecurity',
    author: { name: 'Akamco OT Security', role: 'Critical Infrastructure Division' },
    publishedAt: '2026-01-28',
    readingTime: 9,
    featured: true,
    coverImage: 'https://picsum.photos/seed/otsecurity2026/1200/630',
    tags: ['OT Security', 'ICS', 'Critical Infrastructure', 'SCADA'],
  },
  {
    slug: 'cloud-vs-on-premise-iraq-enterprises',
    title: 'Cloud vs. On-Premise: Choosing the Right IT Architecture for Iraqi Enterprises',
    excerpt:
      'The cloud-first narrative does not always apply. For Iraqi enterprises navigating connectivity constraints, data sovereignty regulations, and latency-sensitive workloads, our architects break down the decision framework and cost models.',
    category: 'IT Infrastructure',
    author: { name: 'Akamco Architecture', role: 'Solutions Architecture' },
    publishedAt: '2026-02-08',
    readingTime: 8,
    featured: true,
    coverImage: 'https://picsum.photos/seed/cloudvsonprem/1200/630',
    tags: ['Cloud', 'On-Premise', 'Hybrid IT', 'Iraq', 'Architecture'],
  },
];

export const categories: BlogCategory[] = [
  'Cybersecurity',
  'IT Infrastructure',
  'AI & Innovation',
  'Government Tech',
  'Project',
  'Industry News',
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}

export function getRelatedPosts(slug: string, count = 3): BlogPost[] {
  const post = getPostBySlug(slug);
  if (!post) return [];
  return blogPosts
    .filter((p) => p.slug !== slug && p.category === post.category)
    .slice(0, count);
}
