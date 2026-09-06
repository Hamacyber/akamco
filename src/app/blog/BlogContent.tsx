'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { type BlogPost } from '@/data/blog';
import { FadeIn } from '@/components/ui/FadeIn';

/* ─── Cover Image helper ─────────────────────────────────────── */
function CoverImg({ src, alt, className = '', priority = false }: { src: string; alt: string; className?: string; priority?: boolean }) {
  return <Image src={src} alt={alt} fill priority={priority} className={`object-cover ${className}`} sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />;
}

/* ─── Helpers ─────────────────────────────────────────────────── */
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

const categoryStripe: Record<string, string> = {
  'Cybersecurity': 'bg-red-500',
  'IT Infrastructure': 'bg-blue-500',
  'AI & Innovation': 'bg-purple-500',
  'Government Tech': 'bg-amber-500',
  'Project': 'bg-accent',
  'Industry News': 'bg-teal-500',
};

/* ─── Service / Solution lookup ─────────────────────────────── */
const SERVICE_SLUG_TO_TITLE: Record<string, string> = {
  // Services
  'consultancy-advisory': 'Consultancy & Advisory',
  'system-design-engineering': 'System Design & Engineering',
  'supply-procurement': 'Supply & Procurement',
  'installation-deployment': 'Installation & Deployment',
  'system-integration-commissioning': 'System Integration & Commissioning',
  'managed-services-monitoring': 'Managed Services & Monitoring',
  'annual-maintenance-contracts': 'Annual Maintenance Contracts',
  'it-outsourcing-staffing': 'IT Outsourcing & Staffing',
  'training-knowledge-transfer': 'Training & Knowledge Transfer',
  // Solutions
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

/* ─── News Hero Slider ───────────────────────────────────────── */
function NewsHeroSlider({ posts }: { posts: BlogPost[] }) {
  const newsItems = posts.filter((p) => p.category === 'Industry News');
  const count = newsItems.length;

  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const next = useCallback(() => setCurrent((c) => (c + 1) % Math.max(count, 1)), [count]);
  const prev = useCallback(() => setCurrent((c) => (c - 1 + Math.max(count, 1)) % Math.max(count, 1)), [count]);

  useEffect(() => {
    if (paused || count <= 1) return;
    const id = setInterval(next, 5000);
    return () => clearInterval(id);
  }, [next, paused, count]);

  if (count === 0) return null;

  const post = newsItems[current];

  return (
    <div
      className="relative w-full rounded-3xl overflow-hidden mb-12 shadow-2xl"
      style={{ height: 'clamp(340px, 52vw, 600px)' }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Slide images — all rendered, only active one visible */}
      {newsItems.map((item, i) => (
        <div
          key={item.slug}
          className="absolute inset-0 transition-opacity duration-700"
          style={{ opacity: i === current ? 1 : 0, zIndex: i === current ? 1 : 0 }}
        >
          {item.coverImage ? (
            <Image src={item.coverImage} alt={item.title} fill className="object-cover" sizes="100vw" priority={i === 0} />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-teal-900 via-gray-900 to-gray-950" />
          )}
          {/* Dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/10" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent" />
        </div>
      ))}

      {/* Content overlay */}
      <div className="absolute inset-0 z-10 flex flex-col justify-end p-8 sm:p-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={post.slug}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {/* Badge */}
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full bg-teal-500 text-white shadow-lg">
                <svg className="w-2.5 h-2.5 animate-pulse" fill="currentColor" viewBox="0 0 8 8">
                  <circle cx="4" cy="4" r="4" />
                </svg>
                Industry News
              </span>
              <span className="text-[11px] text-white/60 font-medium">{formatDate(post.publishedAt)}</span>
            </div>

            {/* Title */}
            <Link href={`/blog/${post.slug}`} className="group block mb-4">
              <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight group-hover:text-teal-300 transition-colors duration-200 max-w-2xl">
                {post.title}
              </h2>
            </Link>

            {/* Excerpt */}
            <p className="text-sm sm:text-base text-white/70 leading-relaxed max-w-xl line-clamp-2 mb-6">
              {post.excerpt}
            </p>

            {/* CTA + author */}
            <div className="flex items-center gap-6">
              <Link
                href={`/blog/${post.slug}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-500 text-white text-sm font-semibold hover:bg-teal-400 transition-colors shadow-lg shadow-teal-500/30"
              >
                Read Article
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
              <span className="flex items-center gap-1 text-xs text-white/50">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {post.readingTime} min read
              </span>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Dot indicators */}
        {count > 1 && (
          <div className="flex gap-2 mt-8">
            {newsItems.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${i === current ? 'w-8 bg-teal-400' : 'w-2 bg-white/30 hover:bg-white/60'
                  }`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Side nav arrows */}
      {count > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm hover:bg-black/65 transition-colors"
            aria-label="Previous"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm hover:bg-black/65 transition-colors"
            aria-label="Next"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </>
      )}

      {/* Counter badge */}
      {count > 1 && (
        <div className="absolute top-4 right-4 z-20 bg-black/50 text-white/70 text-[11px] font-medium px-3 py-1 rounded-full backdrop-blur-sm">
          {current + 1} / {count}
        </div>
      )}
    </div>
  );
}

/* ─── Featured Slider ───────────────────────────────────────── */
function FeaturedSlider({ posts }: { posts: BlogPost[] }) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const next = useCallback(() => setCurrent((c) => (c + 1) % posts.length), [posts.length]);
  const prev = useCallback(() => setCurrent((c) => (c - 1 + posts.length) % posts.length), [posts.length]);
  useEffect(() => {
    if (paused || posts.length <= 1) return;
    const id = setInterval(next, 6000);
    return () => clearInterval(id);
  }, [next, paused, posts.length]);
  const post = posts[current];
  return (
    <div
      className="relative overflow-hidden rounded-3xl border border-light-border dark:border-dark-border bg-white/80 dark:bg-dark-surface/80 mb-14"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent via-accent/70 to-transparent z-10" />
      <AnimatePresence mode="wait">
        <motion.div
          key={post.slug}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <Link href={`/blog/${post.slug}`} className="group block">
            <div className="grid lg:grid-cols-5 gap-0">
              {/* Visual panel */}
              <div className="lg:col-span-2 relative min-h-[260px] lg:min-h-0 overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
                {post.coverImage ? (
                  <>
                    <CoverImg src={post.coverImage} alt={post.title} priority={current === 0} className="group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-900/30 to-gray-900/10" />
                  </>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="absolute inset-0 opacity-20">
                      <svg viewBox="0 0 400 300" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
                        <defs>
                          <radialGradient id="rg-feat" cx="50%" cy="50%">
                            <stop offset="0%" stopColor="#00C46A" stopOpacity="0.6" />
                            <stop offset="100%" stopColor="#00C46A" stopOpacity="0" />
                          </radialGradient>
                        </defs>
                        <circle cx="200" cy="150" r="120" fill="url(#rg-feat)" />
                      </svg>
                    </div>
                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent/80">Featured Article</span>
                  </div>
                )}
                {/* Featured badge */}
                <div className="absolute top-4 left-4 z-20">
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full bg-accent text-white shadow-lg shadow-accent/30">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    Featured
                  </span>
                </div>
                {posts.length > 1 && (
                  <div className="absolute bottom-4 left-4 z-20">
                    <span className="text-[10px] text-white/70 font-medium">{current + 1} / {posts.length}</span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="lg:col-span-3 p-8 sm:p-10 flex flex-col justify-between gap-6">
                <div>
                  <div className="flex flex-wrap items-center gap-3 mb-5">
                    <span className={`text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full ${categoryColors[post.category]}`}>
                      {post.category}
                    </span>
                    <span className="text-[11px] text-light-muted dark:text-dark-muted uppercase tracking-wider">
                      {formatDate(post.publishedAt)}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] text-light-muted dark:text-dark-muted uppercase tracking-wider">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {post.readingTime} min read
                    </span>
                  </div>
                  <h2 className="font-heading text-2xl sm:text-3xl font-bold text-light-text dark:text-dark-text mb-4 leading-tight group-hover:text-accent transition-colors duration-200">
                    {post.title}
                  </h2>
                  <p className="text-light-muted dark:text-dark-muted leading-relaxed text-base">{post.excerpt}</p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/10 text-accent text-sm font-bold">
                      {post.author.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-light-text dark:text-dark-text leading-none">{post.author.name}</p>
                      <p className="text-xs text-light-muted dark:text-dark-muted mt-0.5">{post.author.role}</p>
                    </div>
                  </div>
                  <span className="flex items-center gap-2 text-sm font-semibold text-accent group-hover:gap-3 transition-all duration-200">
                    Read Article
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      </AnimatePresence>

      {/* Slider nav */}
      {posts.length > 1 && (
        <>
          <button onClick={(e) => { e.stopPropagation(); prev(); }}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm hover:bg-black/60 transition-colors"
            aria-label="Previous">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <button onClick={(e) => { e.stopPropagation(); next(); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm hover:bg-black/60 transition-colors"
            aria-label="Next">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
          <div className="absolute bottom-3 right-1/2 translate-x-1/2 z-20 flex gap-1.5">
            {posts.map((_, i) => (
              <button key={i} onClick={() => setCurrent(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${i === current ? 'w-6 bg-accent' : 'w-1.5 bg-white/40 hover:bg-white/70'}`}
                aria-label={`Slide ${i + 1}`} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ─── Post Card ─────────────────────────────────────────────────── */
function PostCard({ post, index }: { post: BlogPost; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.35, delay: index * 0.05, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <Link href={`/blog/${post.slug}`} className="group flex flex-col h-full">
        <article className="flex flex-col h-full rounded-2xl border border-light-border dark:border-dark-border bg-white/80 dark:bg-dark-surface/60 overflow-hidden hover:border-accent/40 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/5 dark:hover:shadow-black/20 transition-all duration-300">

          {/* Cover image or colored stripe */}
          {post.coverImage ? (
            <div className="relative h-48 overflow-hidden">
              <CoverImg src={post.coverImage} alt={post.title} className="group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full backdrop-blur-sm ${categoryColors[post.category]}`}>
                  {post.category}
                </span>
              </div>
            </div>
          ) : (
            <div className={`h-1 w-full ${categoryStripe[post.category]}`} />
          )}

          <div className="flex flex-col flex-1 p-6 sm:p-7 gap-4">
            {/* Meta */}
            <div className="flex items-center gap-2 flex-wrap">
              {!post.coverImage && (
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${categoryColors[post.category]}`}>
                  {post.category}
                </span>
              )}
              <span className="flex items-center gap-1 text-[10px] text-light-muted dark:text-dark-muted">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {post.readingTime} min
              </span>
              {((post.youtubeUrls?.length ?? 0) > 0 || post.videoUrl) && (
                <span className="inline-flex items-center gap-1 text-[10px] text-red-500 dark:text-red-400">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                  Video
                </span>
              )}
            </div>

            {/* Title */}
            <h3 className="font-heading text-lg font-bold text-light-text dark:text-dark-text leading-snug group-hover:text-accent transition-colors duration-200 flex-1">
              {post.title}
            </h3>

            {/* Excerpt */}
            <p className="text-sm text-light-muted dark:text-dark-muted leading-relaxed line-clamp-3">
              {post.excerpt}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5">
              {(post.tags ?? []).slice(0, 3).map((tag) => (
                <span key={tag} className="text-[10px] px-2 py-0.5 rounded-md bg-light-border/70 dark:bg-dark-border/50 text-light-muted dark:text-dark-muted font-medium">
                  #{tag}
                </span>
              ))}
            </div>

            {/* Related Service badge */}
            {post.relatedService && (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-accent bg-accent/10 px-2.5 py-1 rounded-full w-fit">
                <svg className="w-2.5 h-2.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                </svg>
                {SERVICE_SLUG_TO_TITLE[post.relatedService] ?? post.relatedService}
              </span>
            )}

            {/* Footer */}
            <div className="pt-4 border-t border-light-border/60 dark:border-dark-border/60 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-accent/10 text-accent text-[10px] font-bold">
                  {post.author.name.charAt(0)}
                </div>
                <div>
                  <p className="text-xs font-semibold text-light-text dark:text-dark-text leading-none">{post.author.name}</p>
                  <p className="text-[10px] text-light-muted dark:text-dark-muted mt-0.5">{formatDate(post.publishedAt)}</p>
                </div>
              </div>
              <svg className="w-4 h-4 text-light-muted dark:text-dark-muted group-hover:text-accent group-hover:translate-x-1 transition-all duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </div>
          </div>
        </article>
      </Link>
    </motion.div>
  );
}

/* ─── Main Blog Content ─────────────────────────────────────────── */
export default function BlogContent({ posts, serviceFilter }: { posts: BlogPost[]; serviceFilter?: string }) {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [categories, setCategories] = useState<string[]>([]);
  useEffect(() => {
    fetch('/api/blog/categories')
      .then((r) => r.json())
      .then((d) => setCategories(Array.isArray(d) ? d : []))
      .catch(() => { });
  }, []);
  const [search, setSearch] = useState('');

  // When a service filter is active, pre-scope to related posts
  const scopedPosts = serviceFilter
    ? posts.filter((p) => p.relatedService === serviceFilter)
    : posts;

  const featuredPosts = scopedPosts.filter((p) => p.featured);
  const filtered = scopedPosts
    .filter((p) => activeCategory === 'All' || p.category === activeCategory)
    .filter((p) =>
      search === '' ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.excerpt.toLowerCase().includes(search.toLowerCase()) ||
      (p.tags ?? []).some((t) => t.toLowerCase().includes(search.toLowerCase()))
    );

  return (
    <main className="relative min-h-screen pt-24 md:pt-28 pb-24">
      <div className="container-max px-4 sm:px-6 lg:px-8">

        {/* Service Filter Banner */}
        {serviceFilter && (
          <FadeIn>
            <div className="mb-8 flex items-center gap-3 p-4 rounded-2xl bg-accent/5 border border-accent/20">
              <svg className="w-4 h-4 text-accent flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
              </svg>
              <p className="text-sm text-light-text dark:text-dark-text flex-1">
                Showing <span className="font-semibold text-accent">Projects</span> related to{' '}
                <span className="font-semibold">{SERVICE_SLUG_TO_TITLE[serviceFilter] ?? serviceFilter}</span>
                {scopedPosts.length === 0 && ' — none yet'}
              </p>
              <a href="/blog" className="text-xs font-medium text-light-muted dark:text-dark-muted hover:text-accent transition-colors flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
                Clear
              </a>
            </div>
          </FadeIn>
        )}

        {/* Industry News Hero Slider */}
        {!serviceFilter && activeCategory === 'All' && search === '' && (
          <NewsHeroSlider posts={posts} />
        )}

        {/* Featured Posts Slider */}
        {!serviceFilter && featuredPosts.length > 0 && activeCategory === 'All' && search === '' && (
          <FeaturedSlider posts={featuredPosts} />
        )}

        {/* Search + Filter Bar */}
        <FadeIn delay={0.1}>
          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            {/* Search */}
            <div className="relative flex-1 max-w-sm">
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-light-muted dark:text-dark-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <input
                type="text"
                placeholder="Search articles..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-light-border dark:border-dark-border bg-white/80 dark:bg-dark-surface/60 backdrop-blur-sm text-sm text-light-text dark:text-dark-text placeholder:text-light-muted dark:placeholder:text-dark-muted focus:outline-none focus:border-accent/60 focus:ring-2 focus:ring-accent/10 transition-colors"
              />
            </div>

            {/* Category filters */}
            <div className="flex gap-2 flex-wrap">
              {(['All', ...categories]).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${activeCategory === cat
                    ? 'bg-accent text-white shadow-md shadow-accent/25'
                    : 'bg-white/80 dark:bg-dark-surface/60 border border-light-border dark:border-dark-border text-light-muted dark:text-dark-muted hover:border-accent/40 hover:text-accent backdrop-blur-sm'
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </FadeIn>

        {/* Result count */}
        {(activeCategory !== 'All' || search) && (
          <p className="text-sm text-light-muted dark:text-dark-muted mb-6">
            {filtered.length} article{filtered.length !== 1 ? 's' : ''} found
            {activeCategory !== 'All' ? ` in "${activeCategory}"` : ''}
            {search ? ` for "${search}"` : ''}
          </p>
        )}

        {/* Posts Grid */}
        <AnimatePresence mode="wait">
          {filtered.length > 0 ? (
            <motion.div
              key={activeCategory + search}
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {filtered.map((post, i) => (
                <PostCard key={post.slug} post={post} index={i} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-24 text-center"
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-light-border dark:bg-dark-border mb-4">
                <svg className="w-7 h-7 text-light-muted dark:text-dark-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
              </div>
              <p className="text-light-muted dark:text-dark-muted font-medium">No articles found.</p>
              <button onClick={() => { setSearch(''); setActiveCategory('All'); }} className="mt-3 text-sm text-accent hover:underline">
                Clear filters
              </button>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </main>
  );
}
