import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Social Responsibility — Coming Soon | Akamco Technologies',
  description: 'Our Social Responsibility page is coming soon.',
};

export default function SocialResponsibilityPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        {/* Icon */}
        <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full border border-accent/30 bg-accent/10">
          <svg className="h-9 w-9 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
          </svg>
        </div>

        {/* Badge */}
        <span className="mb-4 inline-block rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-accent">
          Coming Soon
        </span>

        <h1 className="mt-4 font-heading text-4xl font-bold text-light-text dark:text-dark-text sm:text-5xl">
          Social Responsibility
        </h1>
        <p className="mt-5 text-lg text-light-muted dark:text-dark-muted leading-relaxed">
          We&apos;re working on something meaningful. Our commitment to community, education,
          and sustainability will be shared here soon.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/" className="btn-primary px-8 py-3">
            Back to Home
          </Link>
          <Link href="/contact" className="inline-flex items-center gap-2 rounded-xl border border-light-border dark:border-dark-border px-8 py-3 text-sm font-semibold text-light-text dark:text-dark-text hover:border-accent hover:text-accent transition-colors">
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}
