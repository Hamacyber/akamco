'use client';

import { FadeIn } from '@/components/ui/FadeIn';
import { SectionHeader } from '@/components/ui/SectionHeader';
import Link from 'next/link';
import type { Job } from '@/lib/jobsStorage';

/* ── Open Positions ─────────────────────────────────────────── */
const openings = [
  {
    title: 'Network Infrastructure Engineer',
    department: 'Engineering',
    location: 'Baghdad, Iraq',
    type: 'Full-time',
    description:
      'Design, deploy and maintain enterprise LAN/WAN, WiFi and datacenter networks for government and private sector clients.',
    requirements: [
      'CCNA/CCNP or equivalent certification',
      '3+ years enterprise networking experience',
      'Hands-on with Cisco, Juniper, or Fortinet equipment',
      'Fluent in Arabic; English proficiency is a plus',
    ],
  },
  {
    title: 'Cybersecurity Analyst',
    department: 'Security',
    location: 'Baghdad, Iraq',
    type: 'Full-time',
    description:
      'Monitor, detect and respond to security threats across client environments. Conduct vulnerability assessments and security audits.',
    requirements: [
      'CEH, CompTIA Security+, or equivalent',
      '2+ years SOC or security operations experience',
      'Experience with SIEM, IDS/IPS, and firewall management',
      'Strong analytical and reporting skills',
    ],
  },
  {
    title: 'Physical Security Systems Technician',
    department: 'Security',
    location: 'Baghdad, Iraq',
    type: 'Full-time',
    description:
      'Install, configure and maintain CCTV, access control, fire detection and alarm systems at government and commercial sites.',
    requirements: [
      '2+ years hands-on experience with security systems',
      'Knowledge of leading brands (Hikvision, Honeywell, Bosch, etc.)',
      'Ability to read technical drawings and project documentation',
      'Valid driving license',
    ],
  },
  {
    title: 'Software Developer',
    department: 'Technology',
    location: 'Baghdad, Iraq',
    type: 'Full-time',
    description:
      'Build custom enterprise applications and internal tools. Work across the full stack to deliver reliable, scalable software.',
    requirements: [
      'Proficiency in React, Next.js, Node.js or .NET',
      '2+ years commercial software development',
      'Experience with REST APIs and relational databases',
      'Strong problem-solving and team collaboration skills',
    ],
  },
  {
    title: 'IT Project Manager',
    department: 'Operations',
    location: 'Baghdad, Iraq',
    type: 'Full-time',
    description:
      'Lead end-to-end delivery of technology projects — from planning and vendor coordination to client handover and post-project support.',
    requirements: [
      'PMP certification preferred',
      '4+ years managing IT infrastructure projects',
      'Strong client-facing communication skills',
      'Experience with project management tools (MS Project, Jira, etc.)',
    ],
  },
  {
    title: 'Pre-Sales Technical Consultant',
    department: 'Sales & Advisory',
    location: 'Baghdad, Iraq',
    type: 'Full-time',
    description:
      'Provide technical expertise during client proposals and tenders. Prepare BOQs, technical specs and solution presentations.',
    requirements: [
      'Strong technical background in IT infrastructure or security',
      '3+ years pre-sales or solutions architect experience',
      'Excellent presentation and proposal writing skills',
      'Arabic required; English strongly preferred',
    ],
  },
];

/* ── Benefits ───────────────────────────────────────────────── */
const benefits = [
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z" />
      </svg>
    ),
    title: 'Competitive Salary',
    desc: 'Market-leading compensation reviewed annually, with performance bonuses tied to results.',
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.906 59.906 0 0112 3.493a59.903 59.903 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
      </svg>
    ),
    title: 'Training & Certifications',
    desc: 'Full sponsorship for industry certifications (CCNP, CEH, PMP, etc.) and access to online learning platforms.',
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
      </svg>
    ),
    title: 'Collaborative Culture',
    desc: 'Work alongside experienced engineers and consultants on large-scale government and enterprise projects.',
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
      </svg>
    ),
    title: 'Impactful Projects',
    desc: 'Deliver technology infrastructure for ministries, critical facilities, and enterprise clients across Iraq.',
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
      </svg>
    ),
    title: 'Career Growth',
    desc: 'Clear progression paths, annual reviews, and internal mobility across departments and specializations.',
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
      </svg>
    ),
    title: 'Supportive Team',
    desc: 'A respectful, inclusive environment where every team member is valued and their contributions matter.',
  },
];

/* ── Department badge colors ───────────────────────────────── */
const deptColor: Record<string, string> = {
  Engineering: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  Security: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  Technology: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  Operations: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
  'Sales & Advisory': 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300',
};

export function CareersContent({ jobs }: { jobs: Job[] }) {
  return (
    <div className="pt-24 md:pt-28">

      {/* ── Hero ──────────────────────────────────────────── */}
      <section className="section-padding pb-10">
        <div className="container-max">
          <FadeIn>
            <div className="mx-auto max-w-4xl text-center space-y-5">
              <span className="inline-block text-sm font-semibold uppercase tracking-wider text-accent bg-accent/10 px-4 py-2 rounded-full">
                Careers at Akamco
              </span>
              <h1 className="font-heading text-3xl font-bold tracking-tight text-light-text dark:text-dark-text sm:text-4xl md:text-5xl">
                Join Our Team
              </h1>
              <p className="text-base sm:text-lg text-light-muted dark:text-dark-muted leading-relaxed max-w-3xl mx-auto">
                For over two decades, Akamco has been building the technology infrastructure that powers Iraq&apos;s most critical institutions. We are looking for talented engineers, consultants, and problem-solvers to grow with us.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                <a
                  href="#openings"
                  className="btn-primary px-8 py-3"
                >
                  View Open Positions
                </a>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-accent/60 px-8 py-3 text-sm font-semibold text-accent transition-all duration-200 hover:border-accent hover:bg-accent/10"
                >
                  Send Your CV
                </Link>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Why Akamco ────────────────────────────────────── */}
      <section className="section-padding bg-light-surface dark:bg-dark-surface">
        <div className="container-max">
          <SectionHeader
            label="Why Akamco"
            title="More Than a Job"
            description="When you join Akamco, you become part of a team that delivers technology solutions for ministries, hospitals, banks, and enterprises across Iraq and the region."
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((b, i) => (
              <FadeIn key={b.title} delay={i * 0.08}>
                <div className="flex gap-4 rounded-2xl border border-light-border dark:border-dark-border bg-white dark:bg-dark-card p-6 h-full">
                  <div className="flex-shrink-0 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent">
                    {b.icon}
                  </div>
                  <div>
                    <h3 className="font-heading text-base font-semibold text-light-text dark:text-dark-text mb-1">
                      {b.title}
                    </h3>
                    <p className="text-sm text-light-muted dark:text-dark-muted leading-relaxed">
                      {b.desc}
                    </p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Open Positions ────────────────────────────────── */}
      <section id="openings" className="section-padding">
        <div className="container-max">
          <SectionHeader
            label="Open Positions"
            title="Current Openings"
            description="We are actively hiring across engineering, security, technology, and operations. Don't see your role? Send us your CV — we're always interested in great people."
          />
          <div className="space-y-5">
            {jobs.map((job, i) => (
              <FadeIn key={job.title} delay={i * 0.07}>
                <div className="rounded-2xl border border-light-border dark:border-dark-border bg-white dark:bg-dark-card p-6 sm:p-8 hover:border-accent/30 hover:shadow-glow transition-all duration-200">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex-1">
                      {/* Title + badges */}
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <h3 className="font-heading text-lg font-semibold text-light-text dark:text-dark-text">
                          {job.title}
                        </h3>
                        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${deptColor[job.department] ?? 'bg-accent/10 text-accent'}`}>
                          {job.department}
                        </span>
                      </div>
                      {/* Meta */}
                      <div className="flex flex-wrap gap-4 mb-4">
                        <span className="flex items-center gap-1.5 text-sm text-light-muted dark:text-dark-muted">
                          <svg className="h-4 w-4 text-accent" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                          </svg>
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1.5 text-sm text-light-muted dark:text-dark-muted">
                          <svg className="h-4 w-4 text-accent" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
                          </svg>
                          {job.type}
                        </span>
                      </div>
                      {/* Description */}
                      <p className="text-sm text-light-muted dark:text-dark-muted leading-relaxed mb-4">
                        {job.description}
                      </p>
                      {/* Requirements */}
                      <ul className="space-y-1.5">
                        {job.requirements.map((req) => (
                          <li key={req} className="flex items-start gap-2 text-sm text-light-muted dark:text-dark-muted">
                            <svg className="h-4 w-4 mt-0.5 flex-shrink-0 text-accent" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>
                    {/* Apply button */}
                    <div className="flex-shrink-0">
                      <Link
                        href={`/contact?subject=${encodeURIComponent('Application: ' + job.title)}`}
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-6 py-2.5 text-sm font-semibold text-white shadow-glow transition-all duration-200 hover:bg-accent-dark hover:shadow-glow-lg hover:-translate-y-0.5 whitespace-nowrap"
                      >
                        Apply Now
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Spontaneous Application CTA ───────────────────── */}
      <section className="section-padding bg-light-surface dark:bg-dark-surface">
        <div className="container-max">
          <FadeIn>
            <div className="mx-auto max-w-3xl text-center rounded-2xl border border-accent/20 bg-accent/5 dark:bg-accent/10 p-10 md:p-14">
              <div className="flex justify-center mb-6">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                </div>
              </div>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-light-text dark:text-dark-text mb-4">
                Don&apos;t See Your Role?
              </h2>
              <p className="text-base text-light-muted dark:text-dark-muted leading-relaxed mb-8">
                We are always open to meeting talented professionals. Send us your CV along with a brief note about what you do and what you&apos;re looking for — we will keep your profile on file for future opportunities.
              </p>
              <Link
                href="/contact"
                className="btn-primary px-10 py-3 text-base"
              >
                Send Your CV
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

    </div>
  );
}
