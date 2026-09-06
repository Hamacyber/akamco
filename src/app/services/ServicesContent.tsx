'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { FadeIn } from '@/components/ui/FadeIn';
import type { ServiceDetail } from '@/data/services';

interface ServicesContentProps {
  services: ServiceDetail[];
}

const ICONS: Record<string, string> = {
  'consultancy-advisory': 'M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z',
  'system-design-engineering': 'M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z',
  'supply-procurement': 'M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12',
  'installation-deployment': 'M21.75 6.75a4.5 4.5 0 01-4.884 4.484c-1.076-.091-2.264.071-2.95.904l-7.152 8.684a2.548 2.548 0 11-3.586-3.585l8.684-7.152c.833-.686.995-1.874.904-2.95a4.5 4.5 0 016.336-4.486l-3.276 3.276a3.004 3.004 0 002.25 2.25l3.276-3.276c.256.565.398 1.192.398 1.852z M4.867 19.125h.008v.008h-.008v-.008z',
  'system-integration-commissioning': 'M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244',
  'managed-services-monitoring': 'M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z M15 12a3 3 0 11-6 0 3 3 0 016 0z',
  'annual-maintenance-contracts': 'M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z',
  'it-outsourcing-staffing': 'M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z',
  'training-knowledge-transfer': 'M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5',
};

const CATEGORY_MAP: Record<string, string> = {
  'consultancy-advisory': 'Advisory',
  'supply-procurement': 'Advisory',
  'system-design-engineering': 'Build',
  'installation-deployment': 'Build',
  'system-integration-commissioning': 'Build',
  'managed-services-monitoring': 'Operate',
  'annual-maintenance-contracts': 'Operate',
  'it-outsourcing-staffing': 'People',
  'training-knowledge-transfer': 'People',
};

const CATS = ['All', 'Advisory', 'Build', 'Operate', 'People'] as const;

const CAT_COLORS: Record<string, string> = {
  'Advisory': '#0EA5E9',
  'Build': '#F59E0B',
  'Operate': '#8B5CF6',
  'People': '#00C46A',
};

const STATS = [
  { value: '9+', label: 'Service Areas' },
  { value: '500+', label: 'Projects Delivered' },
  { value: '25+', label: 'Years Experience' },
  { value: '300+', label: 'Clients Served' },
];

const DEFAULT_ICON = 'M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6z';

function ServiceCard({ service, index }: { service: ServiceDetail; index: number }) {
  const isFeatured = index === 0 || index === 5;
  const iconPath = ICONS[service.id] ?? DEFAULT_ICON;
  const cat = CATEGORY_MAP[service.id];
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
        href={`/services/${service.id}`}
        className={`group relative flex flex-col justify-end overflow-hidden rounded-2xl border border-white/10 shadow-lg transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl block${isFeatured ? ' min-h-[400px]' : ' min-h-[280px]'}`}
      >
        {service.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={service.image}
            alt={service.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0" style={{ background: service.gradient || 'linear-gradient(135deg,#00C46A,#0EA5E9)' }} />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10" />
        {cat && (
          <div
            className="absolute top-4 right-4 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white z-10"
            style={{ background: `${catColor}cc` }}
          >
            {cat}
          </div>
        )}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-25 transition-opacity duration-500"
          style={{ background: service.gradient || 'linear-gradient(135deg,#00C46A,#0EA5E9)' }}
        />
        <div className="absolute top-5 left-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm text-white border border-white/20 group-hover:bg-accent group-hover:border-accent transition-all duration-300">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d={iconPath} />
            </svg>
          </div>
        </div>
        <div className="absolute top-5 right-5 flex h-9 w-9 items-center justify-center rounded-full bg-white/0 border border-transparent text-transparent group-hover:bg-white/20 group-hover:border-white/30 group-hover:text-white transition-all duration-300">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
          </svg>
        </div>
        <div className="relative p-6">
          <h3 className="font-heading text-lg font-bold text-white leading-tight mb-0 group-hover:text-accent transition-colors duration-200 group-hover:mb-2">
            {service.title}
          </h3>
          <p className="text-sm text-white/0 group-hover:text-white/75 leading-relaxed line-clamp-2 max-h-0 group-hover:max-h-16 overflow-hidden transition-all duration-500">
            {service.description}
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

export function ServicesContent({ services }: ServicesContentProps) {
  const [activeTab, setActiveTab] = useState<string>('All');
  const filtered = activeTab === 'All' ? services : services.filter(s => CATEGORY_MAP[s.id] === activeTab);

  return (
    <div className="pt-24 md:pt-28">

      {/* Hero */}
      <section className="section-padding pb-12">
        <div className="container-max px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="max-w-3xl">
              <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-accent">
                <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
                What We Do
              </span>
              <h1 className="font-heading text-4xl font-bold tracking-tight text-light-text dark:text-dark-text sm:text-5xl md:text-6xl mt-3 mb-6">
                Our <span className="text-accent">Services</span>
              </h1>
              <p className="text-lg text-light-muted dark:text-dark-muted leading-relaxed max-w-2xl">
                From initial consultancy to ongoing managed services — we cover the full lifecycle
                of enterprise technology delivery across Iraq and the Middle East.
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

      {/* Services Grid */}
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
              {filtered.map((service, index) => (
                <ServiceCard key={service.id} service={service} index={index} />
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
                Not sure which service you need?
              </h2>
              <p className="relative text-base text-light-muted dark:text-dark-muted max-w-xl mx-auto mb-8">
                Our team will assess your requirements and recommend the right combination of
                services for your organization.
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
