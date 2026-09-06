import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Message Sent — Akamco Technologies',
  description: 'Thank you for contacting Akamco Technologies.',
};

export default function ContactSuccessPage() {
  return (
    <div className="relative flex min-h-[90vh] items-center justify-center pt-20 overflow-hidden">
      {/* Background glow */}
      <div className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-accent/5 blur-[120px]" />

      <div className="container-max px-4 text-center relative z-10">
        <div className="mx-auto max-w-lg">
          {/* Animated success ring */}
          <div className="mx-auto mb-8 relative w-24 h-24">
            <div className="absolute inset-0 rounded-full bg-accent/10 animate-ping opacity-40" />
            <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-accent/10 border border-accent/20">
              <svg className="h-11 w-11 text-accent" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>

          <span className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-accent mb-6">
            Message Received
          </span>

          <h1 className="font-heading text-3xl font-bold text-light-text dark:text-dark-text sm:text-4xl mb-4">
            Thank You for Reaching Out
          </h1>
          <p className="text-light-muted dark:text-dark-muted leading-relaxed mb-10 max-w-sm mx-auto">
            We&apos;ve received your message and will get back to you within one business day. Our team looks forward to speaking with you.
          </p>

          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-xl bg-accent px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-accent/20 hover:bg-accent/90 transition-all hover:-translate-y-0.5"
            >
              Return Home
            </Link>
            <Link
              href="/capabilities"
              className="inline-flex items-center gap-2 rounded-xl border border-light-border dark:border-dark-border px-7 py-3.5 text-sm font-medium text-light-muted dark:text-dark-muted hover:border-accent/40 hover:text-accent transition-all"
            >
              Explore Capabilities
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
