import Link from 'next/link';
import { SITE_NAME, FOOTER_LINKS, SOCIAL_LINKS } from '@/lib/constants';
import { AkamcoLogo } from '@/components/ui/AkamcoLogo';
import { IconLinkedIn, IconInstagram, IconFacebook } from '@/components/ui/Icons';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-light-border/50 dark:border-dark-border/50 bg-white/60 dark:bg-[#111827]/50 backdrop-blur-sm">
      <div className="container-max px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center mb-4">
              <AkamcoLogo height={48} />
            </Link>
            <p className="text-sm text-light-muted dark:text-dark-muted leading-relaxed max-w-xs">
              Engineering secure digital infrastructure for government agencies,
              enterprise organizations, and critical infrastructure operators.
            </p>

            {/* Social Links */}
            <div className="flex gap-4 mt-6">
              {SOCIAL_LINKS.map((social) => {
                const IconComponent =
                  social.icon === 'linkedin' ? IconLinkedIn :
                    social.icon === 'instagram' ? IconInstagram :
                      IconFacebook;

                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="text-light-muted dark:text-dark-muted hover:text-accent dark:hover:text-accent transition-colors"
                  >
                    <IconComponent className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-light-text dark:text-dark-text">
              Services
            </h3>
            <ul className="space-y-3">
              {FOOTER_LINKS.services.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-light-muted dark:text-dark-muted hover:text-accent transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Solutions */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-light-text dark:text-dark-text">
              Solutions
            </h3>
            <ul className="space-y-3">
              {FOOTER_LINKS.solutions.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-light-muted dark:text-dark-muted hover:text-accent transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-light-text dark:text-dark-text">
              Company
            </h3>
            <ul className="space-y-3">
              {FOOTER_LINKS.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-light-muted dark:text-dark-muted hover:text-accent transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-light-text dark:text-dark-text">
              Contact
            </h3>
            <ul className="space-y-3 text-sm text-light-muted dark:text-dark-muted">
              <li>
                <a href="mailto:info@akamco.co" className="hover:text-accent transition-colors block">
                  info@akamco.co
                </a>
                <a href="mailto:sales@akamco.co" className="hover:text-accent transition-colors block">
                  sales@akamco.co
                </a>
              </li>
              <li>
                <a href="tel:+9647716414000" className="hover:text-accent transition-colors block">
                  +964 771 641 4000
                </a>
                <a href="tel:+9647736687000" className="hover:text-accent transition-colors block">
                  +964 773 668 7000
                </a>
              </li>
              <li className="leading-relaxed">
                Building 125 — Darwaza Corniche<br />
                Sulaymaniyah, Iraq
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-light-border dark:border-dark-border pt-8 md:flex-row">
          <p className="text-xs text-light-muted dark:text-dark-muted">
            &copy; {currentYear} {SITE_NAME}. All rights reserved. All information is confidential and proprietary.
          </p>
          <div className="flex gap-6">
            {FOOTER_LINKS.legal.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs text-light-muted dark:text-dark-muted hover:text-accent transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
