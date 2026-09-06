'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FadeIn } from '@/components/ui/FadeIn';
import { SectionHeader } from '@/components/ui/SectionHeader';
import type { CSRData } from '@/lib/csrStorage';

function getInitiativeIcon(name: string) {
  switch (name) {
    case 'book':
      return (<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>);
    case 'computer':
      return (<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M20.893 13.393l-1.135-1.135a2.252 2.252 0 01-.421-.585l-1.08-2.16a.414.414 0 00-.663-.107.827.827 0 01-.812.21l-1.273-.363a.89.89 0 00-.738 1.595l.587.39c.59.395.674 1.23.172 1.732l-.2.2c-.212.212-.33.498-.33.796v.41c0 .409-.11.809-.32 1.158l-1.315 2.191a2.11 2.11 0 01-1.81 1.025 1.055 1.055 0 01-1.055-1.055v-1.172c0-.92-.58-1.747-1.445-2.083l-1.056-.394a2.25 2.25 0 01-1.452-2.106V6.26c0-.563.226-1.102.627-1.503l.757-.757c.55-.55 1.296-.855 2.075-.855h.354a.75.75 0 00.53-.22l1.056-1.055a3 3 0 012.122-.879h.014a3 3 0 012.122.879l1.056 1.055a.75.75 0 00.53.22h.354c.779 0 1.525.305 2.075.855l.757.757c.401.401.627.94.627 1.503v4.24a3 3 0 01-1.107 2.353z" /></svg>);
    case 'users':
      return (<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" /></svg>);
    case 'lightning':
      return (<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>);
    case 'globe':
      return (<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253M3.157 7.582A8.959 8.959 0 003 12c0 .778.099 1.533.284 2.253" /></svg>);
    case 'building':
    default:
      return (<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>);
  }
}

export function SocialResponsibilityContent({ data }: { data: CSRData }) {
  return (
    <div className="pt-24 md:pt-28">

      {/* ── Hero ──────────────────────────────────────────── */}
      <section className="section-padding pb-10">
        <div className="container-max">
          <FadeIn>
            <div className="mx-auto max-w-4xl text-center space-y-5">
              <span className="inline-block text-sm font-semibold uppercase tracking-wider text-accent bg-accent/10 px-4 py-2 rounded-full">
                {data.hero.badge}
              </span>
              <h1 className="font-heading text-3xl font-bold tracking-tight text-light-text dark:text-dark-text sm:text-4xl md:text-5xl">
                {data.hero.title}
              </h1>
              <p className="text-base sm:text-lg text-light-muted dark:text-dark-muted leading-relaxed max-w-3xl mx-auto">
                {data.hero.subtitle}
              </p>
            </div>
          </FadeIn>

          {/* Hero image */}
          <FadeIn delay={0.15}>
            <div className="mt-14 relative rounded-3xl overflow-hidden h-[340px] sm:h-[420px] md:h-[500px] shadow-xl">
              <Image
                src={data.hero.heroImage}
                alt="Akamco team volunteering and supporting the community"
                fill
                priority
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 1280px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-8 right-8">
                <p className="text-white font-semibold text-lg drop-shadow">
                    {data.hero.quoteText}
                  </p>
                  <p className="text-white/70 text-sm mt-1 drop-shadow">{data.hero.quoteAuthor}</p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Impact Numbers ────────────────────────────────── */}
      <section className="section-padding py-14 bg-accent">
        <div className="container-max">
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {data.impactStats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="font-heading text-3xl sm:text-4xl font-bold text-white">{stat.value}</p>
                <p className="mt-1 text-sm text-white/80 leading-snug">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Four Pillars ──────────────────────────────────── */}
      <section className="section-padding">
        <div className="container-max">
          <SectionHeader
            label="Our Pillars"
            title="Where We Focus"
            description="Our CSR strategy is built around four interconnected pillars that reflect our values and the needs of the communities we operate in."
          />

          <div className="space-y-24 mt-16">
            {data.pillars.map((pillar, i) => (
              <FadeIn key={pillar.title} delay={0.1}>
                <div className={`flex flex-col gap-12 lg:flex-row lg:items-center ${pillar.reverse ? 'lg:flex-row-reverse' : ''}`}>
                  {/* Image */}
                  <div className="lg:w-1/2">
                    <div className="relative h-72 sm:h-80 lg:h-96 rounded-2xl overflow-hidden shadow-lg">
                      <Image
                        src={pillar.image}
                        alt={pillar.alt}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                      />
                    </div>
                  </div>
                  {/* Text */}
                  <div className="lg:w-1/2 space-y-5">
                    <span className="inline-block text-xs font-bold uppercase tracking-widest text-accent bg-accent/10 px-3 py-1.5 rounded-full">
                      {pillar.tag}
                    </span>
                    <h2 className="font-heading text-2xl sm:text-3xl font-bold text-light-text dark:text-dark-text">
                      {pillar.title}
                    </h2>
                    <p className="text-base text-light-muted dark:text-dark-muted leading-relaxed">
                      {pillar.body}
                    </p>
                    {/* Mini stats */}
                    <div className="grid grid-cols-3 gap-4 pt-2">
                      {pillar.stats.map((s) => (
                        <div key={s.label} className="text-center rounded-xl border border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surface p-4">
                          <p className="font-heading text-xl font-bold text-accent">{s.value}</p>
                          <p className="text-xs text-light-muted dark:text-dark-muted mt-0.5 leading-tight">{s.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Initiatives Grid ──────────────────────────────── */}
      <section className="section-padding bg-light-surface dark:bg-dark-surface">
        <div className="container-max">
          <SectionHeader
            label="Our Initiatives"
            title="Actions, Not Just Words"
            description="Beyond our four pillars, we run a range of targeted programmes that create tangible change in our communities."
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data.initiatives.map((item, i) => (
              <FadeIn key={item.title} delay={i * 0.07}>
                <div className="flex gap-4 rounded-2xl border border-light-border dark:border-dark-border bg-white dark:bg-dark-card p-6 h-full hover:border-accent/30 hover:shadow-glow transition-all duration-200">
                  <div className="flex-shrink-0 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent">
                    {getInitiativeIcon(item.iconName)}
                  </div>
                  <div>
                    <h3 className="font-heading text-base font-semibold text-light-text dark:text-dark-text mb-1">
                      {item.title}
                    </h3>
                    <p className="text-sm text-light-muted dark:text-dark-muted leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Photo Gallery ─────────────────────────────────── */}
      <section className="section-padding">
        <div className="container-max">
          <SectionHeader
            label="In the Field"
            title="Our Work in Action"
            description="A glimpse of our community programmes, volunteering days, and technology initiatives across Iraq."
          />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8">
            {data.gallery.map((img) => (
                <FadeIn key={img.id ?? img.src} delay={0.05}>
                <div className={`relative rounded-2xl overflow-hidden h-52 sm:h-60 ${img.span}`}>
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 50vw, 33vw"
                  />
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────── */}
      <section className="section-padding bg-light-surface dark:bg-dark-surface">
        <div className="container-max">
          <FadeIn>
            <div className="mx-auto max-w-3xl text-center rounded-2xl border border-accent/20 bg-accent/5 dark:bg-accent/10 p-10 md:p-14">
              <div className="flex justify-center mb-6">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                  </svg>
                </div>
              </div>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-light-text dark:text-dark-text mb-4">
                {data.cta.title}
              </h2>
              <p className="text-base text-light-muted dark:text-dark-muted leading-relaxed mb-8">
                {data.cta.description}
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/contact" className="btn-primary px-10 py-3 text-base">
                  Get in Touch
                </Link>
                <Link href="/about" className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-accent/60 px-10 py-3 text-base font-semibold text-accent transition-all duration-200 hover:border-accent hover:bg-accent/10">
                  Learn About Us
                </Link>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

    </div>
  );
}
