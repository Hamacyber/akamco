'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import type { BlogPost } from '@/data/blog';

const CATEGORY_COLORS: Record<string, string> = {
    'Cybersecurity': '#0EA5E9',
    'IT Infrastructure': '#00C46A',
    'AI & Innovation': '#8B5CF6',
    'Government Tech': '#F59E0B',
    'Project': '#EC4899',
    'Industry News': '#6366F1',
};

function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });
}

interface IndustryNewsProps {
    posts: BlogPost[];
}

export function IndustryNews({ posts }: IndustryNewsProps) {
    if (!posts || posts.length === 0) return null;

    const featured = posts[0];
    const rest = posts.slice(1, 5);

    return (
        <section className="section-padding relative">
            <div className="container-max px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12"
                >
                    <div>
                        <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-accent">
                            <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
                            Latest Insights
                        </span>
                        <h2 className="font-heading text-3xl font-bold text-light-text dark:text-dark-text sm:text-4xl mt-2">
                            Latest News
                        </h2>
                    </div>
                    <Link
                        href="/blog"
                        className="shrink-0 inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:text-accent/80 transition-colors"
                    >
                        All articles
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </Link>
                </motion.div>

                {/* Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

                    {/* Featured big card */}
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.1 }}
                        transition={{ duration: 0.5 }}
                        className="lg:col-span-3"
                    >
                        <Link
                            href={`/blog/${featured.slug}`}
                            className="group relative flex flex-col justify-end rounded-2xl overflow-hidden border border-light-border dark:border-dark-border bg-light-card dark:bg-dark-card hover:border-accent/40 transition-all duration-300 min-h-[380px] block"
                        >
                            {featured.coverImage && (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={featured.coverImage}
                                    alt={featured.title}
                                    className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-70 transition-opacity duration-500"
                                />
                            )}
                            {/* Dark gradient from bottom for text readability */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
                            {/* Top accent bar */}
                            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                            <div className="relative p-8">
                                <div className="flex items-center gap-3 mb-5">
                                    <span
                                        className="rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-white"
                                        style={{ background: CATEGORY_COLORS[featured.category], boxShadow: `0 0 12px ${CATEGORY_COLORS[featured.category]}80` }}
                                    >
                                        {featured.category}
                                    </span>
                                    <span className="text-xs text-white/90">{formatDate(featured.publishedAt)}</span>
                                    <span className="text-xs text-white/90">·</span>
                                    <span className="text-xs text-white/90">{featured.readingTime} min read</span>
                                </div>
                                <h3 className="font-heading text-xl font-bold text-white leading-snug mb-3 group-hover:text-accent transition-colors duration-200 sm:text-2xl">
                                    {featured.title}
                                </h3>
                                <p className="text-sm text-white/70 leading-relaxed mb-6 max-w-lg">
                                    {featured.excerpt}
                                </p>
                                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent">
                                    Read article
                                    <svg className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </span>
                            </div>
                        </Link>
                    </motion.div>

                    {/* Small cards column */}
                    <div className="lg:col-span-2 flex flex-col gap-5">
                        {rest.map((post, i) => {
                            const color = CATEGORY_COLORS[post.category];
                            return (
                                <motion.div
                                    key={post.slug}
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true, amount: 0.1 }}
                                    transition={{ duration: 0.4, delay: i * 0.08 }}
                                >
                                    <Link
                                        href={`/blog/${post.slug}`}
                                        className="group flex flex-row rounded-2xl border border-light-border dark:border-dark-border bg-light-card dark:bg-dark-card hover:border-accent/40 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md overflow-hidden block"
                                    >
                                        {/* Thumbnail */}
                                        {post.coverImage ? (
                                            <div className="relative w-28 shrink-0 self-stretch overflow-hidden">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img
                                                    src={post.coverImage}
                                                    alt={post.title}
                                                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                            </div>
                                        ) : (
                                            <div
                                                className="w-28 shrink-0 self-stretch flex items-center justify-center"
                                                style={{ background: `${color}18` }}
                                            >
                                                <svg className="w-8 h-8 opacity-40" style={{ color }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5" />
                                                </svg>
                                            </div>
                                        )}
                                        {/* Text */}
                                        <div className="flex flex-col p-4 min-w-0">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span
                                                    className="rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest"
                                                    style={{ background: `${color}18`, color, border: `1px solid ${color}33` }}
                                                >
                                                    {post.category}
                                                </span>
                                                <span className="text-[11px] text-light-muted dark:text-dark-muted ml-auto">{formatDate(post.publishedAt)}</span>
                                            </div>
                                            <h3 className="font-heading text-sm font-bold text-light-text dark:text-dark-text leading-snug group-hover:text-accent transition-colors duration-200 mb-1 line-clamp-2">
                                                {post.title}
                                            </h3>
                                            <p className="text-xs text-light-muted dark:text-dark-muted leading-relaxed line-clamp-2">
                                                {post.excerpt}
                                            </p>
                                        </div>
                                    </Link>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}

