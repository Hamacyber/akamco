import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy policy for Akamco Technologies website and services.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="pt-24 md:pt-28">
      <section className="section-padding">
        <div className="container-max max-w-3xl">
          <h1 className="font-heading text-3xl font-bold text-light-text dark:text-dark-text sm:text-4xl mb-2">
            Privacy Policy
          </h1>
          <p className="text-sm text-light-muted dark:text-dark-muted mb-10">
            Last updated: February 2026
          </p>

          <div className="prose prose-sm dark:prose-invert max-w-none space-y-8 text-light-muted dark:text-dark-muted leading-relaxed">
            <section>
              <h2 className="font-heading text-xl font-semibold text-light-text dark:text-dark-text mb-3">
                1. Information We Collect
              </h2>
              <p>
                Akamco Technologies (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;the Company&rdquo;) collects information
                that you voluntarily provide when using our website, submitting contact forms, or
                engaging with our services. This may include your name, email address, phone number,
                organization name, and project details.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-light-text dark:text-dark-text mb-3">
                2. How We Use Your Information
              </h2>
              <p>We use collected information to:</p>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li>Respond to your inquiries and proposal requests</li>
                <li>Provide and improve our services</li>
                <li>Communicate relevant information about our capabilities</li>
                <li>Comply with legal obligations and regulatory requirements</li>
                <li>Protect the security and integrity of our systems</li>
              </ul>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-light-text dark:text-dark-text mb-3">
                3. Data Protection
              </h2>
              <p>
                We implement industry-standard security measures to protect your personal
                information against unauthorized access, alteration, disclosure, or destruction.
                Our data handling practices align with applicable data protection regulations.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-light-text dark:text-dark-text mb-3">
                4. Information Sharing
              </h2>
              <p>
                We do not sell, trade, or rent your personal information to third parties. We may
                share information with trusted service providers who assist us in operating our
                website and conducting our business, subject to confidentiality agreements.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-light-text dark:text-dark-text mb-3">
                5. Cookies and Analytics
              </h2>
              <p>
                Our website may use cookies and similar technologies to enhance your browsing
                experience and gather usage analytics. You can control cookie preferences through
                your browser settings.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-light-text dark:text-dark-text mb-3">
                6. Your Rights
              </h2>
              <p>
                You may request access to, correction of, or deletion of your personal
                information at any time by contacting us at{' '}
                <a href="mailto:info@akamco.co" className="text-accent hover:underline">
                  info@akamco.co
                </a>
                .
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-light-text dark:text-dark-text mb-3">
                7. Changes to This Policy
              </h2>
              <p>
                We reserve the right to update this privacy policy at any time. Changes will be
                posted on this page with an updated revision date.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-light-text dark:text-dark-text mb-3">
                8. Contact
              </h2>
              <p>
                For questions or concerns regarding this privacy policy, please contact us at{' '}
                <a href="mailto:info@akamco.co" className="text-accent hover:underline">
                  info@akamco.co
                </a>
                .
              </p>
            </section>
          </div>
        </div>
      </section>
    </div>
  );
}
