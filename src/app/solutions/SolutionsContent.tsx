'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { FadeIn } from '@/components/ui/FadeIn';
import type { SolutionDetail } from '@/data/solutions';

interface SolutionsContentProps {
  solutions: SolutionDetail[];
}

const ICONS: Record<string, string> = {
  'datacenter-solutions': 'M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3m3 3a3 3 0 100 6h13.5a3 3 0 100-6m-16.5-3a3 3 0 013-3h13.5a3 3 0 013 3m-19.5 0a3 3 0 003 3m16.5-3a3 3 0 01-3 3',
  'network-infrastructure': 'M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3',
  'cybersecurity': 'M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z',
  'physical-security': 'M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z M15 12a3 3 0 11-6 0 3 3 0 016 0z',
  'fire-life-safety': 'M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z',
  'renewable-energy': 'M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z',
  'control-room-command': 'M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0H3',
  'software-development': 'M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5',
  'av-systems': 'M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z',
  'fiber-measurement': 'M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5',
  'gate-perimeter-security': 'M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z',
  'software-licensing': 'M9 12.75l3 3m0 0l3-3m-3 3v-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  'ups-critical-power': 'M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z',
  'it-supply-hardware': 'M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18',
  'low-current-systems': 'M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244',
};
const DEFAULT_PATH = 'M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z';

const CATEGORY_MAP: Record<string, string> = {
  'datacenter-solutions': 'Infrastructure',
  'network-infrastructure': 'Infrastructure',
  'low-current-systems': 'Infrastructure',
  'fiber-measurement': 'Infrastructure',
  'cybersecurity': 'Security',
  'physical-security': 'Security',
  'fire-life-safety': 'Security',
  'gate-perimeter-security': 'Security',
  'software-development': 'Technology',
  'av-systems': 'Technology',
  'control-room-command': 'Technology',
  'software-licensing': 'Technology',
  'ups-critical-power': 'Power & Energy',
  'renewable-energy': 'Power & Energy',
  'it-supply-hardware': 'Power & Energy',
};

const CATS = ['All', 'Infrastructure', 'Security', 'Technology', 'Power & Energy'] as const;

const CAT_COLORS: Record<string, string> = {
  'Infrastructure': '#0EA5E9',
  'Security': '#F59E0B',
  'Technology': '#8B5CF6',
  'Power & Energy': '#00C46A',
};

const STATS = [
  { value: '14+', label: 'Solution Areas' },
  { value: '500+', label: 'Projects Delivered' },
  { value: '25+', label: 'Years Experience' },
  { value: '300+', label: 'Clients Served' },
];

function ServiceCard({ solution, index }: { solution: SolutionDetail; index: number }) {
  const isFeatured = index === 0 || index === 7;
  const iconPath = ICONS[solution.id] ?? DEFAULT_PATH;
  const cat = CATEGORY_MAP[solution.id];
  const catColor = cat ? CAT_COLORS[cat] : '#00C46A';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.08 }}
      className={isFeatured ? 'sm:col-span-2' : ''}
    >
      <Link
        href={`/solutions/${solution.id}`}
        className={`group relative flex flex-col justify-end overflow-hidden rounded-2xl border border-white/10 shadow-lg transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl block${isFeatured ? ' min-h-[400px]' : ' min-h-[280px]'
          }`}
      >
        {/* Background image */}
        {solution.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={solution.image}
            alt={solution.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0" style={{ background: solution.gradient || 'linear-gradient(135deg,#00C46A,#0EA5E9)' }} />
        )}

        {/* Permanent dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10" />

        {/* Category pill */}
        {cat && (
          <div
            className="absolute top-4 right-4 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white z-10"
            style={{ background: `${catColor}cc` }}
          >
            {cat}
          </div>
        )}

        {/* Hover color tint */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-25 transition-opacity duration-500"
          style={{ background: solution.gradient || 'linear-gradient(135deg,#00C46A,#0EA5E9)' }}
        />

        {/* Icon */}
        <div className="absolute top-5 left-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm text-white border border-white/20 group-hover:bg-accent group-hover:border-accent transition-all duration-300">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d={iconPath} />
            </svg>
          </div>
        </div>

        {/* Arrow badge top-right */}
        <div className="absolute top-5 right-5 flex h-9 w-9 items-center justify-center rounded-full bg-white/0 border border-transparent text-transparent group-hover:bg-white/20 group-hover:border-white/30 group-hover:text-white transition-all duration-300">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
          </svg>
        </div>

        {/* Bottom text */}
        <div className="relative p-6">
          <h3 className="font-heading text-lg font-bold text-white leading-tight mb-0 group-hover:text-accent transition-colors duration-200 group-hover:mb-2">
            {solution.title}
          </h3>
          <p className="text-sm text-white/0 group-hover:text-white/75 leading-relaxed line-clamp-2 max-h-0 group-hover:max-h-16 overflow-hidden transition-all duration-500">
            {solution.description}
          </p>
          <div className="mt-0 group-hover:mt-3 flex items-center gap-1.5 text-xs font-semibold text-accent translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
            Explore service
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export function SolutionsContent({ solutions }: SolutionsContentProps) {
  const [activeTab, setActiveTab] = useState<string>('All');
  const filtered = activeTab === 'All' ? solutions : solutions.filter(s => CATEGORY_MAP[s.id] === activeTab);

  return (
    <div className="pt-24 md:pt-28">

      {/* Hero */}
      <section className="section-padding pb-12">
        <div className="container-max px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="max-w-3xl">
              <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-accent">
                <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
                What We Offer
              </span>
              <h1 className="font-heading text-4xl font-bold tracking-tight text-light-text dark:text-dark-text sm:text-5xl md:text-6xl mt-3 mb-6">
                Our <span className="text-accent">Solutions</span>
              </h1>
              <p className="text-lg text-light-muted dark:text-dark-muted leading-relaxed max-w-2xl">
                End-to-end technology solutions engineered for enterprise and government
                organizations across Iraq and the Middle East — from infrastructure to security,
                power, and software.
              </p>
            </div>
          </FadeIn>
          <FadeIn delay={0.15}>
            <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4">
              {STATS.map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-light-border dark:border-dark-border bg-light-card/60 dark:bg-dark-card/60 backdrop-blur-sm px-5 py-4">
                  <p className="font-heading text-2xl font-bold text-accent">{stat.value}</p>
                  <p className="text-xs text-light-muted dark:text-dark-muted mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Category Tabs */}
      <section className="sticky top-16 z-30 border-b border-light-border dark:border-dark-border bg-light-bg/80 dark:bg-dark-bg/80 backdrop-blur-md">
        <div className="container-max px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1 overflow-x-auto py-3">
            {CATS.map((cat) => {
              const isActive = activeTab === cat;
              const color = cat !== 'All' ? CAT_COLORS[cat] : undefined;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveTab(cat)}
                  className={`relative shrink-0 rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200 ${isActive
                    ? 'text-white shadow-md'
                    : 'text-light-muted dark:text-dark-muted hover:text-light-text dark:hover:text-dark-text hover:bg-light-border/50 dark:hover:bg-dark-border/50'
                    }`}
                  style={isActive ? { background: color ?? '#00C46A' } : {}}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Solutions Grid */}
      <section className="section-padding pt-8">
        <div className="container-max px-4 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
            >
              {filtered.map((solution, index) => (
                <ServiceCard key={solution.id} solution={solution} index={index} />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding">
        <div className="container-max px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="relative rounded-3xl overflow-hidden border border-accent/20 bg-accent/5 dark:bg-accent/10 p-10 md:p-14 text-center selection:bg-black/20 selection:text-light-text dark:selection:bg-white/20 dark:selection:text-dark-text">
              <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, rgba(0,196,106,0.08), transparent 70%)' }} />
              <span className="relative mb-3 inline-block rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-accent">
                Get Started
              </span>
              <h2 className="relative font-heading text-3xl font-bold text-light-text dark:text-dark-text sm:text-4xl mt-2 mb-4">
                Not sure which solution you need?
              </h2>
              <p className="relative text-base text-light-muted dark:text-dark-muted max-w-xl mx-auto mb-8">
                Our team will assess your requirements and recommend the right combination of
                solutions for your organization.
              </p>
              <div className="relative flex items-center justify-center">
                <Link href="/contact" className="btn-primary px-8 py-3 text-base">
                  Schedule a Consultation
                </Link>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}