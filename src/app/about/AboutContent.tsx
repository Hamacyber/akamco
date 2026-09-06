'use client';

import { SectionHeader } from '@/components/ui/SectionHeader';
import { Card } from '@/components/ui/Card';
import { FadeIn } from '@/components/ui/FadeIn';
import { AkamcoLogo } from '@/components/ui/AkamcoLogo';
import { timeline } from '@/data/about';
import type { SolutionDetail } from '@/data/solutions';
import Link from 'next/link';

const ICON_PATHS: Record<string, string> = {
  server: 'M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18',
  shield: 'M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z',
  globe: 'M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9',
  cpu: 'M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18',
  cloud: 'M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z',
  layers: 'M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0l4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0l-5.571 3-5.571-3',
  zap: 'M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z',
  chartbar: 'M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z',
  alert: 'M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z',
  building: 'M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z',
  monitor: 'M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0H3',
  tv: 'M6 20.25h12m-7.5-3v3m3-3v3m-10.125-3h17.25c.621 0 1.125-.504 1.125-1.125V4.875c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125z',
};

const coreValues = [
  {
    title: 'Integrity',
    description: 'We operate with transparency and accountability in every engagement, maintaining the trust our clients place in us.',
  },
  {
    title: 'Excellence',
    description: 'We pursue the highest standards of technical execution, continuous improvement, and professional development.',
  },
  {
    title: 'Security',
    description: 'Security is not a feature â€” it is the foundation of everything we design, build, and operate.',
  },
  {
    title: 'Reliability',
    description: 'Our clients depend on us for mission-critical systems. We deliver solutions that perform when it matters most.',
  },
];

interface AboutContentProps {
  solutions?: SolutionDetail[];
}

export function AboutContent({ solutions = [] }: AboutContentProps) {
  return (
    <div className="pt-24 md:pt-28">

      {/* Hero */}
      <section className="px-4 pt-8 pb-20 sm:px-6 md:pt-10 md:pb-28 lg:px-8">
        <div className="container-max">
          <FadeIn>
            <div className="flex flex-col items-center text-center">
              {/* Logo */}
              <div className="mb-10">
                <AkamcoLogo height={110} />
              </div>
              {/* Label */}
              <span className="mb-4 inline-block rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-accent">
                About Us
              </span>
              {/* Body text */}
              <p className="mx-auto max-w-3xl text-lg leading-relaxed text-light-muted dark:text-dark-muted">
                Since our establishment in 2001, Akam Company (Akamco) has been a trusted leader in
                Information Technology, Security Systems, Application Development, Power Solutions,
                and general trading services across Iraq and the Middle East. With over two decades
                of experience, we have built a reputation for delivering reliable, innovative, and
                cost-effective solutions to both private enterprises and public sector organizations.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Mission & Vision â€” full-width split banner */}
      <section className="border-y border-light-border dark:border-dark-border overflow-hidden">
        <div className="grid md:grid-cols-2">
          {/* Mission */}
          <FadeIn direction="left" className="h-full">
            <div className="relative flex flex-col justify-center h-full px-10 py-16 md:px-16 md:py-20 bg-accent [&_*::selection]:bg-white/30 [&_*::selection]:text-white">
              <span className="mb-4 inline-block text-xs font-bold uppercase tracking-widest text-white/60 selection:bg-white/30 selection:text-white">
                Our Mission
              </span>
              <p className="font-heading text-2xl font-bold text-white leading-snug sm:text-3xl">
                To deliver reliable IT, security, and power solutions that help businesses and
                communities thrive through quality, innovation, and lasting partnerships.
              </p>
              <div className="mt-8 h-1 w-16 rounded bg-white/30" />
            </div>
          </FadeIn>

          {/* Vision */}
          <FadeIn direction="right" delay={0.1} className="h-full">
            <div className="relative flex flex-col justify-center h-full px-10 py-16 md:px-16 md:py-20 bg-light-surface dark:bg-dark-surface">
              <span className="mb-4 inline-block text-xs font-bold uppercase tracking-widest text-accent">
                Our Vision
              </span>
              <p className="font-heading text-2xl font-bold text-light-text dark:text-dark-text leading-snug sm:text-3xl">
                To be the trusted partner of choice across Iraq and the Middle East, driving
                progress through technology, security, and sustainable solutions.
              </p>
              <div className="mt-8 h-1 w-16 rounded bg-accent/40" />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* What We Do */}
      {solutions.length > 0 && (
        <section className="section-padding border-b border-light-border dark:border-dark-border">
          <div className="container-max">
            <FadeIn>
              <div className="text-center mb-14">
                <span className="mb-3 inline-block rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-accent">
                  Our Core Areas
                </span>
                <h2 className="font-heading text-3xl font-bold text-light-text dark:text-dark-text sm:text-4xl mt-3">
                  What We Do
                </h2>
              </div>
            </FadeIn>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {solutions.map((s, i) => {
                const iconPath = ICON_PATHS[s.icon ?? ''] ?? ICON_PATHS['server'];
                return (
                  <FadeIn key={s.id} delay={i * 0.07}>
                    <Link
                      href={`/solutions/${s.id}`}
                      className="group relative flex flex-col h-full rounded-2xl border border-light-border dark:border-dark-border bg-light-card dark:bg-dark-card p-7 overflow-hidden transition-all duration-300 hover:border-accent/60 hover:shadow-glow hover:-translate-y-1"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 group-hover:bg-accent/20 transition-colors duration-300">
                        <svg className="h-6 w-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={iconPath} />
                        </svg>
                      </div>
                      <div className="mb-1 text-xs font-bold uppercase tracking-widest text-accent">
                        {String(i + 1).padStart(2, '0')}
                      </div>
                      <h3 className="font-heading text-lg font-bold text-light-text dark:text-dark-text mb-2 group-hover:text-accent transition-colors duration-200">
                        {s.title}
                      </h3>
                      <p className="text-sm text-light-muted dark:text-dark-muted leading-relaxed flex-1">
                        {s.tagline ?? s.description}
                      </p>
                      <div className="mt-5 flex items-center gap-1.5 text-xs font-semibold text-accent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        Learn more <span>→</span>
                      </div>
                    </Link>
                  </FadeIn>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Core Values */}
      <section className="section-padding">
        <div className="container-max">
          <SectionHeader
            label="Principles"
            title="Core Values"
            description="The principles that guide our work and define our relationship with every client."
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {coreValues.map((value, i) => (
              <Card key={value.title} delay={i * 0.1}>
                <h3 className="font-heading text-lg font-semibold text-accent mb-3">
                  {value.title}
                </h3>
                <p className="text-sm text-light-muted dark:text-dark-muted leading-relaxed">
                  {value.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section-padding border-y border-light-border dark:border-dark-border">
        <div className="container-max">
          <SectionHeader
            label="Our Journey"
            title="Company Timeline"
            description="Key milestones in Akamco Technologies' growth and evolution."
          />
          <div className="mx-auto max-w-3xl">
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-4 top-0 bottom-0 w-px bg-accent/20 sm:left-1/2 sm:-translate-x-px" />
              {timeline.map((event, i) => (
                <FadeIn key={event.year} delay={i * 0.1}>
                  <div
                    className={`relative mb-10 pl-12 sm:pl-0 sm:w-1/2 ${i % 2 === 0 ? 'sm:pr-12 sm:text-right' : 'sm:ml-auto sm:pl-12'
                      }`}
                  >
                    <div
                      className={`absolute left-2.5 top-1.5 h-3 w-3 rounded-full border-2 border-accent bg-light-bg dark:bg-dark-bg sm:top-1.5 ${i % 2 === 0 ? 'sm:left-auto sm:-right-1.5' : 'sm:-left-1.5'
                        }`}
                    />
                    <span className="text-sm font-bold text-accent">{event.year}</span>
                    <h3 className="mt-1 font-heading text-base font-semibold text-light-text dark:text-dark-text">
                      {event.title}
                    </h3>
                    <p className="mt-1 text-sm text-light-muted dark:text-dark-muted leading-relaxed">
                      {event.description}
                    </p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding">
        <div className="container-max text-center">
          <FadeIn>
            <h2 className="font-heading text-3xl font-bold text-light-text dark:text-dark-text mb-4 sm:text-4xl">
              Ready to Work Together?
            </h2>
            <p className="mx-auto max-w-xl text-light-muted dark:text-dark-muted mb-8">
              Let&apos;s discuss how Akamco can help secure and modernize your infrastructure.
            </p>
            <Link
              href="/contact"
              className="btn-primary"
            >
              Get in Touch
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </FadeIn>
        </div>
      </section>

    </div>
  );
}


