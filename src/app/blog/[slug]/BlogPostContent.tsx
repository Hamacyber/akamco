'use client';

import Link from 'next/link';
import Image from 'next/image';
import { type BlogPost } from '@/data/blog';
import { FadeIn } from '@/components/ui/FadeIn';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

const categoryColors: Record<string, string> = {
  'Cybersecurity': 'bg-red-500/10 text-red-500 dark:text-red-400',
  'IT Infrastructure': 'bg-blue-500/10 text-blue-500 dark:text-blue-400',
  'AI & Innovation': 'bg-purple-500/10 text-purple-500 dark:text-purple-400',
  'Government Tech': 'bg-amber-500/10 text-amber-500 dark:text-amber-400',
  'Project': 'bg-accent/10 text-accent',
  'Industry News': 'bg-teal-500/10 text-teal-500 dark:text-teal-400',
};

const SERVICE_SLUG_TO_TITLE: Record<string, string> = {
  'consultancy-advisory': 'Consultancy & Advisory',
  'system-design-engineering': 'System Design & Engineering',
  'supply-procurement': 'Supply & Procurement',
  'installation-deployment': 'Installation & Deployment',
  'system-integration-commissioning': 'System Integration & Commissioning',
  'managed-services-monitoring': 'Managed Services & Monitoring',
  'annual-maintenance-contracts': 'Annual Maintenance Contracts',
  'it-outsourcing-staffing': 'IT Outsourcing & Staffing',
  'training-knowledge-transfer': 'Training & Knowledge Transfer',
  'datacenter-solutions': 'Datacenter Solutions',
  'network-infrastructure': 'Network Infrastructure',
  'fiber-measurement': 'Fiber Measurement',
  'cybersecurity': 'Cybersecurity',
  'software-development': 'Software Development',
  'software-licensing': 'Software Licensing',
  'it-supply-hardware': 'IT Supply & Hardware',
  'low-current-systems': 'Low Current Systems',
  'physical-security': 'Physical Security',
  'fire-life-safety': 'Fire & Life Safety',
  'gate-perimeter-security': 'Gate & Perimeter Security',
  'control-room-command': 'Control Room & Command Center',
  'av-systems': 'AV Systems',
  'renewable-energy': 'Renewable Energy',
  'ups-critical-power': 'UPS & Critical Power',
};

const SOLUTION_SLUGS = new Set([
  'datacenter-solutions', 'network-infrastructure', 'fiber-measurement', 'cybersecurity',
  'software-development', 'software-licensing', 'it-supply-hardware', 'low-current-systems',
  'physical-security', 'fire-life-safety', 'gate-perimeter-security', 'control-room-command',
  'av-systems', 'renewable-energy', 'ups-critical-power',
]);

/* ── YouTube embed helper ─────────────────────────────────────── */
function getYouTubeId(url: string): string | null {
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/))([^?&\s]{11})/);
  return m?.[1] ?? null;
}

/* ── Extra image type ─────────────────────────────────────────── */
type ExtraImage = NonNullable<BlogPost['extraImages']>[number];

/* ── Inline image ─────────────────────────────────────────────── */
function InlineImage({ img }: { img: ExtraImage }) {
  return (
    <figure className="my-6">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={img.url}
        alt={img.caption ?? 'Article image'}
        className="w-full rounded-2xl object-cover max-h-[480px]"
      />
      {img.caption && (
        <figcaption className="text-center text-xs text-light-muted dark:text-dark-muted mt-2 italic">
          {img.caption}
        </figcaption>
      )}
    </figure>
  );
}

/* ── Rich content renderer ────────────────────────────────────── */
function renderContent(content: string, extraImages: ExtraImage[]) {
  const paragraphs = content.split(/\n\n+/).filter((p) => p.trim());
  const elements: React.ReactNode[] = [];

  // Position-0 images appear before the body text
  extraImages.filter((img) => img.position === 0).forEach((img, i) => {
    elements.push(<InlineImage key={`img-pre-${i}`} img={img} />);
  });

  paragraphs.forEach((para, idx) => {
    const trimmed = para.trim();
    if (trimmed.startsWith('# ')) {
      elements.push(
        <h2 key={idx} className="font-heading text-2xl font-bold text-light-text dark:text-dark-text mt-10 mb-4">
          {trimmed.slice(2)}
        </h2>
      );
    } else if (trimmed.startsWith('## ')) {
      elements.push(
        <h3 key={idx} className="font-heading text-xl font-bold text-light-text dark:text-dark-text mt-8 mb-3">
          {trimmed.slice(3)}
        </h3>
      );
    } else if (trimmed.startsWith('> ')) {
      elements.push(
        <blockquote key={idx} className="pl-4 border-l-2 border-accent italic text-light-muted dark:text-dark-muted my-4">
          {trimmed.slice(2)}
        </blockquote>
      );
    } else {
      elements.push(
        <p key={idx} className="text-light-muted dark:text-dark-muted leading-loose text-base">
          {trimmed}
        </p>
      );
    }
    // Images inserted after paragraph idx+1
    extraImages.filter((img) => img.position === idx + 1).forEach((img, i) => {
      elements.push(<InlineImage key={`img-${idx}-${i}`} img={img} />);
    });
  });

  return elements;
}

/* ── Main component ───────────────────────────────────────────── */
export default function BlogPostContent({ post, related }: { post: BlogPost; related: BlogPost[] }) {
  const hasYoutube = (post.youtubeUrls?.length ?? 0) > 0;
  const hasVideo = !!post.videoUrl;
  const hasExtra = (post.extraImages?.length ?? 0) > 0;
  const hasContent = !!(post.content?.trim());

  return (
    <main className="relative min-h-screen pt-24 md:pt-28 pb-24">
      <div className="container-max px-4 sm:px-6 lg:px-8">

        {/* Back */}
        <FadeIn>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-light-muted dark:text-dark-muted hover:text-accent transition-colors mb-10 group"
          >
            <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Back to Blog
          </Link>
        </FadeIn>

        <div className="grid lg:grid-cols-[1fr_320px] gap-12 xl:gap-16">
          {/* ── Main content ── */}
          <div>
            <FadeIn>
              {/* Header */}
              <div className="mb-10">
                <div className="flex flex-wrap items-center gap-3 mb-6">
                  <span className={`text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full ${categoryColors[post.category]}`}>
                    {post.category}
                  </span>
                  <span className="text-xs text-light-muted dark:text-dark-muted">{formatDate(post.publishedAt)}</span>
                  <span className="flex items-center gap-1 text-xs text-light-muted dark:text-dark-muted">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {post.readingTime} min read
                  </span>
                  {(hasYoutube || hasVideo) && (
                    <span className="inline-flex items-center gap-1 text-xs text-red-500 dark:text-red-400">
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                      </svg>
                      Video
                    </span>
                  )}
                  {post.relatedService && (
                    <Link
                      href={SOLUTION_SLUGS.has(post.relatedService) ? `/solutions/${post.relatedService}` : `/services/${post.relatedService}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-accent bg-accent/10 px-2.5 py-1 rounded-full hover:bg-accent/20 transition-colors"
                    >
                      <svg className="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                      </svg>
                      {SERVICE_SLUG_TO_TITLE[post.relatedService] ?? post.relatedService}
                    </Link>
                  )}
                </div>
                <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-light-text dark:text-dark-text leading-tight mb-6">
                  {post.title}
                </h1>
                <p className="text-lg text-light-muted dark:text-dark-muted leading-relaxed border-l-2 border-accent pl-4">
                  {post.excerpt}
                </p>
              </div>

              {/* Cover image */}
              {post.coverImage && (
                <div className="relative w-full rounded-2xl overflow-hidden my-8" style={{ height: 'clamp(220px, 45vw, 420px)' }}>
                  <Image src={post.coverImage} alt={post.title} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 65vw" priority />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                </div>
              )}

              {/* Author */}
              <div className="flex items-center gap-4 py-6 border-y border-light-border dark:border-dark-border mb-10">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent text-lg font-bold">
                  {post.author.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-light-text dark:text-dark-text">{post.author.name}</p>
                  <p className="text-sm text-light-muted dark:text-dark-muted">{post.author.role}</p>
                </div>
              </div>
            </FadeIn>

            {/* Article body */}
            <FadeIn delay={0.1}>
              {!hasContent && (
                <p className="text-sm text-light-muted/60 dark:text-dark-muted/60 italic border border-dashed border-light-border dark:border-dark-border rounded-xl p-6 text-center">
                  Full article content has not been added yet.
                </p>
              )}

              {/* Rich HTML content (TipTap editor output) */}
              {hasContent && post.content!.trimStart().startsWith('<') && (
                <div
                  className="blog-content"
                  dangerouslySetInnerHTML={{ __html: post.content! }}
                />
              )}

              {/* Legacy plain-text / markdown content */}
              {hasContent && !post.content!.trimStart().startsWith('<') && (
                <div className="blog-content space-y-4">
                  {renderContent(post.content!, post.extraImages ?? [])}
                </div>
              )}
            </FadeIn>

            {/* Extra images gallery (when no article content positions them inline) */}
            {hasExtra && !hasContent && (
              <FadeIn delay={0.12}>
                <div className="mt-10">
                  <p className="text-xs font-bold uppercase tracking-wider text-light-muted dark:text-dark-muted mb-4">Gallery</p>
                  <div className="grid grid-cols-2 gap-3">
                    {(post.extraImages ?? []).filter(img => (img.position ?? 99) > 1).map((img, i) => (
                      <InlineImage key={i} img={img} />
                    ))}
                  </div>
                </div>
              </FadeIn>
            )}

            {/* Video (direct file) */}
            {hasVideo && (
              <FadeIn delay={0.13}>
                <div className="mt-10">
                  <p className="text-xs font-bold uppercase tracking-wider text-light-muted dark:text-dark-muted mb-4">Video</p>
                  <div className="rounded-2xl overflow-hidden bg-black">
                    <video src={post.videoUrl} controls className="w-full max-h-[520px]" preload="metadata" />
                  </div>
                </div>
              </FadeIn>
            )}

            {/* YouTube embeds */}
            {hasYoutube && (
              <FadeIn delay={0.14}>
                <div className="mt-10 space-y-6">
                  <p className="text-xs font-bold uppercase tracking-wider text-light-muted dark:text-dark-muted">
                    {post.youtubeUrls!.length === 1 ? 'Watch' : 'Videos'}
                  </p>
                  {post.youtubeUrls!.map((url, i) => {
                    const id = getYouTubeId(url);
                    if (!id) return null;
                    return (
                      <div key={i} className="relative w-full rounded-2xl overflow-hidden bg-black" style={{ paddingTop: '56.25%' }}>
                        <iframe
                          className="absolute inset-0 w-full h-full"
                          src={`https://www.youtube.com/embed/${id}?rel=0`}
                          title={`Video ${i + 1}`}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                        />
                      </div>
                    );
                  })}
                </div>
              </FadeIn>
            )}

            {/* Tags */}
            <FadeIn delay={0.15}>
              <div className="mt-10 pt-8 border-t border-light-border dark:border-dark-border">
                <p className="text-xs font-bold uppercase tracking-wider text-light-muted dark:text-dark-muted mb-3">Tags</p>
                <div className="flex flex-wrap gap-2">
                  {(post.tags ?? []).map((tag) => (
                    <span key={tag} className="px-3 py-1 rounded-lg text-xs bg-light-border/70 dark:bg-dark-border/60 text-light-muted dark:text-dark-muted font-medium hover:text-accent hover:bg-accent/10 transition-colors cursor-default">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>

          {/* ── Sidebar ── */}
          <aside className="space-y-8">
            {/* About the author */}
            <FadeIn direction="right" delay={0.1}>
              <div className="rounded-2xl border border-light-border dark:border-dark-border bg-white/80 dark:bg-dark-surface/60 backdrop-blur-sm p-6">
                <p className="text-xs font-bold uppercase tracking-wider text-light-muted dark:text-dark-muted mb-4">About the Author</p>
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-accent font-bold">
                    {post.author.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-light-text dark:text-dark-text leading-none">{post.author.name}</p>
                    <p className="text-xs text-light-muted dark:text-dark-muted mt-0.5">{post.author.role}</p>
                  </div>
                </div>
                <p className="text-xs text-light-muted dark:text-dark-muted leading-relaxed">
                  {post.author.bio?.trim()
                    ? post.author.bio
                    : 'Specialist team at Akamco Technologies delivering expert insights across IT infrastructure, cybersecurity, and digital transformation.'}
                </p>
              </div>
            </FadeIn>

            {/* Media info */}
            {(hasYoutube || hasVideo || hasExtra) && (
              <FadeIn direction="right" delay={0.15}>
                <div className="rounded-2xl border border-light-border dark:border-dark-border bg-white/80 dark:bg-dark-surface/60 backdrop-blur-sm p-6">
                  <p className="text-xs font-bold uppercase tracking-wider text-light-muted dark:text-dark-muted mb-4">Media</p>
                  <div className="space-y-2">
                    {hasYoutube && (
                      <div className="flex items-center gap-2 text-sm text-light-muted dark:text-dark-muted">
                        <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                        </svg>
                        {post.youtubeUrls!.length} YouTube video{post.youtubeUrls!.length > 1 ? 's' : ''}
                      </div>
                    )}
                    {hasVideo && (
                      <div className="flex items-center gap-2 text-sm text-light-muted dark:text-dark-muted">
                        <svg className="w-4 h-4 text-accent flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
                        </svg>
                        Video included
                      </div>
                    )}
                    {hasExtra && (
                      <div className="flex items-center gap-2 text-sm text-light-muted dark:text-dark-muted">
                        <svg className="w-4 h-4 text-accent flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                        </svg>
                        {post.extraImages!.length} image{post.extraImages!.length > 1 ? 's' : ''}
                      </div>
                    )}
                  </div>
                </div>
              </FadeIn>
            )}

            {/* Related posts */}
            {related.length > 0 && (
              <FadeIn direction="right" delay={0.2}>
                <div className="rounded-2xl border border-light-border dark:border-dark-border bg-white/80 dark:bg-dark-surface/60 backdrop-blur-sm p-6">
                  <p className="text-xs font-bold uppercase tracking-wider text-light-muted dark:text-dark-muted mb-4">Related Articles</p>
                  <div className="space-y-4">
                    {related.map((r) => (
                      <Link key={r.slug} href={`/blog/${r.slug}`} className="group block">
                        <div className="flex gap-3">
                          <div className="mt-1 h-1.5 w-1.5 rounded-full bg-accent flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-light-text dark:text-dark-text group-hover:text-accent transition-colors leading-snug">
                              {r.title}
                            </p>
                            <p className="text-xs text-light-muted dark:text-dark-muted mt-1">{r.readingTime} min read</p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </FadeIn>
            )}

            {/* CTA */}
            <FadeIn direction="right" delay={0.25}>
              <div className="rounded-2xl bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20 p-6 text-center">
                <p className="text-xs font-bold uppercase tracking-wider text-accent mb-3">Need Expert Advice?</p>
                <p className="text-sm text-light-muted dark:text-dark-muted mb-4 leading-relaxed">
                  Our team is ready to help you implement the right solution for your organisation.
                </p>
                <Link href="/contact" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-accent text-white text-sm font-semibold shadow-md shadow-accent/25 hover:bg-accent-dark transition-colors">
                  Talk to Us
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
              </div>
            </FadeIn>
          </aside>
        </div>
      </div>
    </main>
  );
}
