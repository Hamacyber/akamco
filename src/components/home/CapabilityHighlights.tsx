'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import type { SolutionDetail } from '@/data/solutions';

// Per-ID metadata (accent colour, tag) â€” layout/style only, content comes from real data
const ITEM_META: Record<string, { accent: string; tag: string; featured?: boolean }> = {
  'datacenter-solutions': { accent: '#00C46A', tag: 'Infrastructure', featured: true },
  'cybersecurity': { accent: '#0EA5E9', tag: 'Security' },
  'network-infrastructure': { accent: '#8B5CF6', tag: 'Networking' },
  'physical-security': { accent: '#EF4444', tag: 'Security' },
  'software-development': { accent: '#F59E0B', tag: 'Digital' },
  'renewable-energy': { accent: '#10B981', tag: 'Energy' },
  'fire-life-safety': { accent: '#F97316', tag: 'Safety' },
  'control-room-command': { accent: '#6366F1', tag: 'Operations' },
  'ups-critical-power': { accent: '#EC4899', tag: 'Power' },
};

type EnrichedItem = SolutionDetail & { accent: string; tag: string; featured: boolean; href: string };

// â”€â”€ Photo card for regular (non-featured) items â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function PhotoCard({ item, delay }: { item: EnrichedItem; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.5, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className="group relative overflow-hidden rounded-2xl"
    >
      <div className="relative h-56 w-full">
        <Image
          src={item.image}
          alt={item.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/60 to-transparent" />
        <div className="absolute top-0 left-0 h-0.5 w-0 group-hover:w-full transition-all duration-500" style={{ background: item.accent }} />
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <span className="mb-2 inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest"
          style={{ background: `${item.accent}22`, color: item.accent, border: `1px solid ${item.accent}44` }}>
          {item.tag}
        </span>
        <h3 className="font-heading text-base font-bold text-white leading-tight mb-1">{item.title}</h3>
        <div className="overflow-hidden transition-all duration-500 max-h-0 group-hover:max-h-24">
          <p className="text-xs text-gray-300 leading-relaxed mb-3 line-clamp-3">{item.description}</p>
        </div>
        <Link href={item.href}
          className="inline-flex items-center gap-1 text-xs font-semibold transition-colors"
          style={{ color: item.accent }}>
          Explore
          <svg className="h-3 w-3 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </motion.div>
  );
}

// â”€â”€ Large featured card â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function FeaturedCard({ item }: { item: EnrichedItem }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -32 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      className="group relative overflow-hidden rounded-2xl row-span-2"
    >
      <div className="relative h-full min-h-[460px] w-full">
        <Image
          src={item.image}
          alt={item.title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-950/60 to-transparent" />
        <div className="absolute inset-0 rounded-2xl ring-1 ring-white/5 group-hover:ring-[#00C46A]/40 transition-all duration-500" />
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-7">
        <span className="mb-3 inline-block rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest"
          style={{ background: `${item.accent}22`, color: item.accent, border: `1px solid ${item.accent}44` }}>
          Featured Â· {item.tag}
        </span>
        <h3 className="font-heading text-2xl font-bold text-white mb-3 leading-tight">{item.title}</h3>
        <p className="text-sm text-gray-300 leading-relaxed mb-5 max-w-sm line-clamp-3">{item.description}</p>
        {item.deliverables?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-5">
            {item.deliverables.slice(0, 4).map(d => (
              <span key={d} className="rounded-lg bg-white/10 px-2.5 py-1 text-[11px] text-gray-300">{d}</span>
            ))}
          </div>
        )}
        <Link href={item.href}
          className="inline-flex items-center gap-2 rounded-xl bg-[#00C46A] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#00C46A]/80 transition-colors">
          Explore Solution
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </motion.div>
  );
}

// â”€â”€ Main export â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export function CapabilityHighlights({ items }: { items: SolutionDetail[] }) {
  // Enrich each item with its accent/tag/href from meta map
  const enriched: EnrichedItem[] = items.map(item => {
    const meta = ITEM_META[item.id] ?? { accent: '#00C46A', tag: 'Solution' };
    return { ...item, accent: meta.accent, tag: meta.tag, featured: !!meta.featured, href: `/solutions/${item.id}` };
  });

  const featured = enriched[0];
  const rest = enriched.slice(1);

  return (
    <section className="section-padding">
      <div className="container-max">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          className="mb-14 text-center"
        >
          <span className="mb-3 inline-block rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-accent">
            What We Deliver
          </span>
          <h2 className="font-heading text-3xl font-bold tracking-tight text-light-text dark:text-dark-text sm:text-4xl lg:text-5xl mb-4">
            Core Services &{' '}
            <span className="text-accent">Solutions</span>
          </h2>
          <p className="mx-auto max-w-2xl text-base text-light-muted dark:text-dark-muted">
            From enterprise infrastructure and critical power to cybersecurity and renewable energy â€” integrated capabilities that keep organisations resilient, connected, and ahead.
          </p>
        </motion.div>

        {/* Top row: Featured (left, tall) + 4 cards (right 2Ã—2) */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 mb-4">
          <div className="lg:col-span-1 lg:row-span-2">
            {featured && <FeaturedCard item={featured} />}
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-2 lg:grid-cols-2">
            {rest.slice(0, 4).map((item, i) => (
              <PhotoCard key={item.id} item={item} delay={0.1 + i * 0.07} />
            ))}
          </div>
        </div>

        {/* Bottom row: remaining cards */}
        {rest.slice(4).length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {rest.slice(4).map((item, i) => (
              <PhotoCard key={item.id} item={item} delay={0.3 + i * 0.07} />
            ))}
          </div>
        )}

        {/* CTA footer */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-12 text-center"
        >
          <p className="text-sm text-light-muted dark:text-dark-muted mb-4">Looking for something specific?</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/capabilities"
              className="inline-flex items-center gap-2 rounded-xl border border-accent text-accent px-5 py-2.5 text-sm font-semibold hover:bg-accent hover:text-white transition-colors">
              All Services
            </Link>
            <Link href="/solutions"
              className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent/80 transition-colors">
              All Solutions
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
