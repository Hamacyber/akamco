'use client';

import { useState } from 'react';
import { FadeIn } from '@/components/ui/FadeIn';

const inputCls =
  'w-full rounded-xl border border-light-border dark:border-dark-border bg-white dark:bg-dark-surface px-4 py-3 text-sm text-light-text dark:text-dark-text placeholder-light-muted dark:placeholder-dark-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-colors';

const SERVICES = [
  'Cybersecurity',
  'IT Infrastructure',
  'Cloud Solutions',
  'Government Tech',
  'AI & Automation',
  'Other',
];

const CONTACT_CARDS = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
      </svg>
    ),
    label: 'Email',
    lines: [
      { text: 'info@akamco.co', href: 'mailto:info@akamco.co' },
      { text: 'sales@akamco.co', href: 'mailto:sales@akamco.co' },
    ],
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
      </svg>
    ),
    label: 'Phone',
    lines: [
      { text: '+964 771 641 4000', href: 'tel:+9647716414000' },
      { text: '+964 773 668 7000', href: 'tel:+9647736687000' },
    ],
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
      </svg>
    ),
    label: 'Address',
    lines: [
      { text: 'Building 125 — Darwaza Corniche', href: null },
      { text: 'Sulaymaniyah, Iraq', href: null },
    ],
  },
];

export function ContactContent() {
  const [service, setService] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') ?? '';
    const org = formData.get('organization') ?? '';
    const email = formData.get('email') ?? '';
    const phone = formData.get('phone') ?? '';
    const message = formData.get('message') ?? '';

    const subject = encodeURIComponent(`Contact from ${name}${org ? ` – ${org}` : ''}`);
    const body = encodeURIComponent(
      `Name: ${name}\nOrganization: ${org}\nEmail: ${email}\nPhone: ${phone}\nService: ${service}\n\n${message}`
    );
    window.location.href = `mailto:sales@akamco.co?subject=${subject}&body=${body}`;
  };

  return (
    <div className="pt-24 md:pt-28 pb-0">

      {/* ── Hero ──────────────────────────────────────────── */}
      <section className="relative py-16 md:py-20 overflow-hidden">
        {/* Background glow */}
        <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full bg-accent/5 blur-[120px]" />

        <div className="container-max px-4 sm:px-6 lg:px-8 text-center">
          <FadeIn>
            <span className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-accent mb-6">
              <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
              Get in Touch
            </span>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-light-text dark:text-dark-text leading-tight mb-5">
              Let&apos;s Build Something
              <span className="block text-accent">Together</span>
            </h1>
            <p className="mx-auto max-w-xl text-base text-light-muted dark:text-dark-muted leading-relaxed">
              Whether you need cybersecurity, IT infrastructure, or a full digital transformation — our team is ready to help you get there.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ── Contact cards row ─────────────────────────────── */}
      <section className="container-max px-4 sm:px-6 lg:px-8 mb-14">
        <FadeIn>
          <div className="grid sm:grid-cols-3 gap-4">
            {CONTACT_CARDS.map((card) => (
              <div
                key={card.label}
                className="flex items-start gap-4 rounded-2xl border border-light-border dark:border-dark-border bg-white dark:bg-dark-surface/60 backdrop-blur-sm p-5 shadow-sm hover:border-accent/40 transition-colors"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  {card.icon}
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-light-muted dark:text-dark-muted mb-1.5">
                    {card.label}
                  </p>
                  {card.lines.map((l, i) =>
                    l.href ? (
                      <a key={i} href={l.href} className="block text-sm text-light-text dark:text-dark-text hover:text-accent transition-colors">
                        {l.text}
                      </a>
                    ) : (
                      <p key={i} className="text-sm text-light-muted dark:text-dark-muted">{l.text}</p>
                    )
                  )}
                </div>
              </div>
            ))}
          </div>
        </FadeIn>
      </section>

      {/* ── Form ──────────────────────────────────────────── */}
      <section className="container-max px-4 sm:px-6 lg:px-8 mb-0">
        <div className="grid lg:grid-cols-[1fr_380px] gap-10 items-start">

          {/* Left: Form */}
          <FadeIn direction="left">
            <div className="rounded-2xl border border-light-border dark:border-dark-border bg-white dark:bg-dark-surface/60 backdrop-blur-sm shadow-sm overflow-hidden">
              {/* Form header */}
              <div className="px-8 py-6 border-b border-light-border dark:border-dark-border bg-light-bg/50 dark:bg-dark-bg/30">
                <h2 className="font-heading text-xl font-bold text-light-text dark:text-dark-text">Send us a Message</h2>
                <p className="text-sm text-light-muted dark:text-dark-muted mt-1">We typically reply within one business day.</p>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-wider text-light-muted dark:text-dark-muted mb-2">
                      Full Name <span className="text-accent">*</span>
                    </label>
                    <input id="name" name="name" type="text" required placeholder="John Smith" className={inputCls} />
                  </div>
                  <div>
                    <label htmlFor="organization" className="block text-xs font-semibold uppercase tracking-wider text-light-muted dark:text-dark-muted mb-2">
                      Organization <span className="text-accent">*</span>
                    </label>
                    <input id="organization" name="organization" type="text" required placeholder="Your organization" className={inputCls} />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-light-muted dark:text-dark-muted mb-2">
                      Email <span className="text-accent">*</span>
                    </label>
                    <input id="email" name="email" type="email" required placeholder="you@organization.com" className={inputCls} />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-xs font-semibold uppercase tracking-wider text-light-muted dark:text-dark-muted mb-2">
                      Phone
                    </label>
                    <input id="phone" name="phone" type="tel" placeholder="+964 7XX XXX XXXX" className={inputCls} />
                  </div>
                </div>

                {/* Service interest */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-light-muted dark:text-dark-muted mb-2">
                    Service Interest
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {SERVICES.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setService(s === service ? '' : s)}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-colors ${service === s
                            ? 'border-accent bg-accent/10 text-accent'
                            : 'border-light-border dark:border-dark-border text-light-muted dark:text-dark-muted hover:border-accent/50 hover:text-accent'
                          }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-xs font-semibold uppercase tracking-wider text-light-muted dark:text-dark-muted mb-2">
                    Message <span className="text-accent">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    required
                    placeholder="Tell us about your project or requirements..."
                    className={`${inputCls} resize-none`}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-accent px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-accent/20 hover:bg-accent/90 transition-all hover:-translate-y-0.5 active:translate-y-0"
                >
                  Send Message
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                  </svg>
                </button>
              </form>
            </div>
          </FadeIn>

          {/* Right: Why choose us + quick facts */}
          <FadeIn direction="right" delay={0.1}>
            <div className="space-y-5">

              {/* Why work with us */}
              <div className="rounded-2xl border border-light-border dark:border-dark-border bg-white dark:bg-dark-surface/60 backdrop-blur-sm p-6 shadow-sm">
                <h3 className="font-heading text-base font-bold text-light-text dark:text-dark-text mb-4">Why Work With Us?</h3>
                <ul className="space-y-3">
                  {[
                    'Iraq\'s leading IT & cybersecurity integrator',
                    'Government-cleared & certified team',
                    'End-to-end delivery — from design to support',
                    'Local presence, global technology partnerships',
                    'Dedicated account manager for every client',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-light-muted dark:text-dark-muted">
                      <svg className="w-4 h-4 text-accent shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Business hours */}
              <div className="rounded-2xl border border-light-border dark:border-dark-border bg-white dark:bg-dark-surface/60 backdrop-blur-sm p-5 shadow-sm">
                <h3 className="text-xs font-bold uppercase tracking-wider text-light-muted dark:text-dark-muted mb-3">Business Hours</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-light-muted dark:text-dark-muted">Sun – Thu</span>
                    <span className="font-medium text-light-text dark:text-dark-text">9:00 AM – 5:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-light-muted dark:text-dark-muted">Fri</span>
                    <span className="text-light-muted dark:text-dark-muted">Closed</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-light-muted dark:text-dark-muted">Sat</span>
                    <span className="text-light-muted dark:text-dark-muted">Closed</span>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Big Map ───────────────────────────────────────── */}
      <section className="mt-16">
        <FadeIn>
          <div className="container-max px-4 sm:px-6 lg:px-8 mb-4 flex items-center justify-between">
            <div>
              <h2 className="font-heading text-2xl font-bold text-light-text dark:text-dark-text">Our Office</h2>
              <p className="text-sm text-light-muted dark:text-dark-muted mt-1">Building No. 32, Parki Azadi Street, Sulaymaniyah, Iraq</p>
            </div>
            <a
              href="https://maps.google.com/?q=Akam+Company+Sulaymaniyah"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 text-sm text-accent hover:underline font-medium"
            >
              Open in Google Maps
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
            </a>
          </div>

          <div className="w-full h-[480px] md:h-[560px] border-t border-light-border dark:border-dark-border overflow-hidden shadow-inner">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3350.5!2d45.4334432!3d35.5673085!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40002c312f906385%3A0x34868e623cc74c07!2sAkam%20Company!5e0!3m2!1sen!2s!4v1707742800000!5m2!1sen!2s"
              width="100%"
              height="100%"
              style={{ border: 0, filter: 'grayscale(10%)' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Akamco Office Location"
            />
          </div>
        </FadeIn>
      </section>

    </div>
  );
}
