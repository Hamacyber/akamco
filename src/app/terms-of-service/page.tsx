import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms of service for Akamco Technologies website and services.',
};

export default function TermsOfServicePage() {
  return (
    <div className="pt-24 md:pt-28">
      <section className="section-padding">
        <div className="container-max max-w-3xl">
          <h1 className="font-heading text-3xl font-bold text-light-text dark:text-dark-text sm:text-4xl mb-2">
            Terms of Service
          </h1>
          <p className="text-sm text-light-muted dark:text-dark-muted mb-10">
            Last updated: February 2026
          </p>

          <div className="prose prose-sm dark:prose-invert max-w-none space-y-8 text-light-muted dark:text-dark-muted leading-relaxed">
            <section>
              <h2 className="font-heading text-xl font-semibold text-light-text dark:text-dark-text mb-3">
                1. Acceptance of Terms
              </h2>
              <p>
                By accessing and using the Akamco Technologies website, you accept and agree to be
                bound by the terms and provisions of this agreement. If you do not agree to abide
                by these terms, please do not use this website.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-light-text dark:text-dark-text mb-3">
                2. Services Description
              </h2>
              <p>
                Akamco Technologies provides IT infrastructure, cybersecurity, AI solutions, and
                data center services to government agencies, enterprise organizations, and critical
                infrastructure operators. Service engagements are governed by separate agreements
                specific to each project.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-light-text dark:text-dark-text mb-3">
                3. Intellectual Property
              </h2>
              <p>
                All content on this website, including text, graphics, logos, and software, is the
                property of Akamco Technologies and is protected by applicable intellectual
                property laws. Unauthorized reproduction, distribution, or modification is
                prohibited.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-light-text dark:text-dark-text mb-3">
                4. Confidentiality
              </h2>
              <p>
                All information shared through this website, including proposal requests and project
                details, is treated as confidential. Specific confidentiality terms are established
                through formal engagement agreements.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-light-text dark:text-dark-text mb-3">
                5. Limitation of Liability
              </h2>
              <p>
                Akamco Technologies shall not be liable for any indirect, incidental, special,
                consequential, or punitive damages arising from your use of this website or our
                services, except as explicitly stated in a formal service agreement.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-light-text dark:text-dark-text mb-3">
                6. Disclaimer
              </h2>
              <p>
                Information presented on this website is for general informational purposes only.
                It does not constitute professional advice. Specific recommendations and solutions
                are provided through formal engagements following due diligence and requirements
                analysis.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-light-text dark:text-dark-text mb-3">
                7. Governing Law
              </h2>
              <p>
                These terms shall be governed by and construed in accordance with applicable laws,
                without regard to conflict of law provisions.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-light-text dark:text-dark-text mb-3">
                8. Modifications
              </h2>
              <p>
                Akamco Technologies reserves the right to modify these terms at any time. Changes
                will be effective upon posting to this website. Continued use of the website after
                modifications constitutes acceptance of the updated terms.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-light-text dark:text-dark-text mb-3">
                9. Contact
              </h2>
              <p>
                For questions about these terms, contact us at{' '}
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
