'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { NAV_LINKS } from '@/lib/constants';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { AkamcoLogo } from '@/components/ui/AkamcoLogo';

/* ─── Data ─────────────────────────────────────────────────────── */
type NavItem = { label: string; href: string };
type MegaItem = NavItem & { desc: string; category?: string };

const SERVICES_DATA: MegaItem[] = [
  { label: 'Consultancy & Advisory', href: '/services/consultancy-advisory', desc: 'IT strategy, risk frameworks & roadmaps', category: 'Advisory' },
  { label: 'Supply & Procurement', href: '/services/supply-procurement', desc: 'Vetted hardware & licensed software supply', category: 'Advisory' },
  { label: 'System Design & Engineering', href: '/services/system-design-engineering', desc: 'Custom architecture & systems engineering', category: 'Build' },
  { label: 'Installation & Deployment', href: '/services/installation-deployment', desc: 'Professional on-site setup & activation', category: 'Build' },
  { label: 'System Integration', href: '/services/system-integration-commissioning', desc: 'End-to-end integration & commissioning', category: 'Build' },
  { label: 'Managed Services & Monitoring', href: '/services/managed-services-monitoring', desc: '24/7 proactive monitoring & support', category: 'Operate' },
  { label: 'Annual Maintenance', href: '/services/annual-maintenance-contracts', desc: 'Comprehensive AMC for all systems', category: 'Operate' },
  { label: 'IT Outsourcing & Staffing', href: '/services/it-outsourcing-staffing', desc: 'Skilled IT professionals on demand', category: 'People' },
  { label: 'Training & Knowledge Transfer', href: '/services/training-knowledge-transfer', desc: 'Hands-on team training programs', category: 'People' },
];

const SERVICE_CATS = ['Advisory', 'Build', 'Operate', 'People'] as const;

const SOLUTIONS_DATA: MegaItem[] = [
  { label: 'Datacenter Solutions', href: '/solutions/datacenter-solutions', desc: 'Design, build & manage data centers', category: 'Infrastructure' },
  { label: 'Network Infrastructure', href: '/solutions/network-infrastructure', desc: 'Enterprise LAN, WAN & WiFi networks', category: 'Infrastructure' },
  { label: 'Low Current Systems', href: '/solutions/low-current-systems', desc: 'Structured cabling & building systems', category: 'Infrastructure' },
  { label: 'Fiber Measurement', href: '/solutions/fiber-measurement', desc: 'OTDR testing & fiber certification', category: 'Infrastructure' },
  { label: 'Cybersecurity', href: '/solutions/cybersecurity', desc: 'Threat protection & compliance', category: 'Security' },
  { label: 'Physical Security', href: '/solutions/physical-security', desc: 'CCTV, access control & intrusion systems', category: 'Security' },
  { label: 'Fire & Life Safety', href: '/solutions/fire-life-safety', desc: 'Detection, suppression & alarm systems', category: 'Security' },
  { label: 'Gate & Perimeter Security', href: '/solutions/gate-perimeter-security', desc: 'Barriers, bollards & perimeter control', category: 'Security' },
  { label: 'Software Development', href: '/solutions/software-development', desc: 'Custom enterprise applications', category: 'Technology' },
  { label: 'AV Systems', href: '/solutions/av-systems', desc: 'Displays, conferencing & AV integration', category: 'Technology' },
  { label: 'Control Room & Command', href: '/solutions/control-room-command', desc: 'Integrated NOC & command center ops', category: 'Technology' },
  { label: 'Software Licensing', href: '/solutions/software-licensing', desc: 'Genuine license supply & management', category: 'Technology' },
  { label: 'UPS & Critical Power', href: '/solutions/ups-critical-power', desc: 'Uninterruptible power & battery backup', category: 'Power & Energy' },
  { label: 'Renewable Energy', href: '/solutions/renewable-energy', desc: 'Solar & clean energy infrastructure', category: 'Power & Energy' },
  { label: 'IT Supply & Hardware', href: '/solutions/it-supply-hardware', desc: 'Enterprise hardware & genuine licenses', category: 'Power & Energy' },
];

const SOLUTION_CATS = ['Infrastructure', 'Security', 'Technology', 'Power & Energy'] as const;

/* ─── Shared primitives ────────────────────────────────────────── */

/** A plain text link row — used identically in every panel */
function PanelLink({ href, label, desc }: { href: string; label: string; desc?: string }) {
  return (
    <Link
      href={href}
      className="group flex flex-col py-2 px-3 rounded-lg hover:bg-light-border/50 dark:hover:bg-dark-border/50 transition-colors duration-150"
    >
      <span className="text-[13px] font-medium text-light-text dark:text-dark-text group-hover:text-accent transition-colors leading-snug">
        {label}
      </span>
      {desc && (
        <span className="text-[11px] text-light-muted dark:text-dark-muted leading-snug mt-0.5 line-clamp-1">
          {desc}
        </span>
      )}
    </Link>
  );
}

/** Category header — identical style for every category label */
function CatLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11.5px] font-bold uppercase tracking-[0.16em] text-accent mb-2 px-3 pb-1.5 border-b border-light-border dark:border-dark-border">
      {children}
    </p>
  );
}

/** Right-side CTA card — same across all three panels */
/* ─── Services panel ───────────────────────────────────────────── */
function ServicesMegaPanel() {
  return (
    <div className="py-6 px-6 lg:px-8">
      <div className="grid grid-cols-4 gap-6">
        {SERVICE_CATS.map((cat) => (
          <div key={cat}>
            <CatLabel>{cat}</CatLabel>
            <div>
              {SERVICES_DATA.filter((i) => i.category === cat).map((item) => (
                <PanelLink key={item.href} href={item.href} label={item.label} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Solutions panel ──────────────────────────────────────────── */
function SolutionsMegaPanel() {
  return (
    <div className="py-6 px-6 lg:px-8">
      <div className="grid grid-cols-4 gap-6">
        {SOLUTION_CATS.map((cat) => (
          <div key={cat}>
            <CatLabel>{cat}</CatLabel>
            <div>
              {SOLUTIONS_DATA.filter((i) => i.category === cat).map((item) => (
                <PanelLink key={item.href} href={item.href} label={item.label} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── About panel ──────────────────────────────────────────────── */
function AboutMegaPanel({ items }: { items: readonly NavItem[] }) {
  return (
    <div className="py-6 px-6 lg:px-8">
      <div className="flex flex-col" style={{ maxWidth: 300 }}>
        <CatLabel>Company</CatLabel>
        <div>
          {items.map((item) => (
            <PanelLink key={item.href} href={item.href} label={item.label} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════ */
export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileDropdown, setMobileDropdown] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => { setScrolled(window.scrollY > 20); ticking = false; });
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); setMobileDropdown(null); }, [pathname]);

  const isMega = (label: string) => label === 'Services' || label === 'Solutions';

  const activeLinkData = openDropdown
    ? NAV_LINKS.find((l) => 'dropdown' in l && l.label === openDropdown)
    : null;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[10000] transition-all duration-300 border-b border-light-border dark:border-dark-border ${scrolled
        ? 'bg-white dark:bg-dark-bg shadow-md shadow-black/5'
        : 'bg-white dark:bg-dark-bg'
        }`}
      onMouseLeave={() => setOpenDropdown(null)}
    >
      {/* ── Main bar ── */}
      <div className="container-max flex h-16 md:h-[72px] items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link href="/" className="flex items-center group flex-shrink-0" aria-label="Akamco Technologies Home">
          <AkamcoLogo height={40} />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Main navigation">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
            const hasDropdown = 'dropdown' in link && link.dropdown;

            return (
              <div
                key={link.label}
                onMouseEnter={() => setOpenDropdown(hasDropdown ? link.label : null)}
              >
                <Link
                  href={link.href}
                  onClick={hasDropdown && link.label !== 'Solutions' && link.label !== 'Services' && link.label !== 'About us' ? (e) => e.preventDefault() : undefined}
                  className={`relative flex items-center gap-1 rounded-lg px-3.5 py-2 text-[13.5px] font-semibold transition-all duration-150 ${isActive
                    ? 'text-accent'
                    : 'text-light-text dark:text-dark-text hover:text-accent'
                    }`}
                >
                  {isActive && (
                    <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-accent" />
                  )}
                  {link.label}
                  {hasDropdown && (
                    <svg
                      className={`w-3 h-3 text-light-muted dark:text-dark-muted transition-transform duration-200 ${openDropdown === link.label ? 'rotate-180 text-accent' : ''}`}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </Link>
              </div>
            );
          })}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            href="/contact"
            className="hidden md:inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-[13px] font-bold text-white shadow-md shadow-accent/20 hover:bg-[#00a859] hover:shadow-lg hover:shadow-accent/25 transition-all duration-200 hover:-translate-y-px"
          >
            Contact Us
          </Link>

          {/* Mobile button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-light-muted dark:text-dark-muted hover:bg-light-border dark:hover:bg-dark-border transition-colors lg:hidden"
            aria-label="Toggle menu"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              {mobileOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />}
            </svg>
          </button>
        </div>
      </div>

      {/* ── Desktop Mega / Dropdown Panel ── */}
      <AnimatePresence>
        {openDropdown && activeLinkData && 'dropdown' in activeLinkData && (
          <motion.div
            key={openDropdown}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-full left-0 right-0 hidden lg:block border-b border-light-border dark:border-dark-border bg-white dark:bg-dark-bg shadow-xl shadow-black/8 dark:shadow-black/40"
          >
            {/* Top accent line */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
            <div className="container-max px-0">
              {isMega(openDropdown)
                ? openDropdown === 'Services'
                  ? <ServicesMegaPanel />
                  : <SolutionsMegaPanel />
                : <AboutMegaPanel items={activeLinkData.dropdown} />}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Mobile Menu ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-b border-light-border dark:border-dark-border bg-white dark:bg-dark-bg lg:hidden"
          >
            <nav className="container-max flex flex-col gap-0.5 px-4 py-4" aria-label="Mobile navigation">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href;
                const hasDropdown = 'dropdown' in link && link.dropdown;
                const isOpen = mobileDropdown === link.label;

                return (
                  <div key={link.label}>
                    {hasDropdown ? (
                      <>
                        <div className={`flex items-center rounded-xl transition-colors ${isActive ? 'bg-accent/10' : 'hover:bg-light-border/60 dark:hover:bg-dark-border/60'}`}>
                          <Link
                            href={link.href}
                            className={`flex-1 px-4 py-3 text-sm font-semibold transition-colors ${isActive ? 'text-accent' : 'text-light-text dark:text-dark-text hover:text-accent'}`}
                          >
                            {link.label}
                          </Link>
                          <button
                            onClick={() => setMobileDropdown(isOpen ? null : link.label)}
                            className="px-3 py-3 text-light-muted dark:text-dark-muted"
                          >
                            <svg className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                        </div>
                        <AnimatePresence>
                          {isOpen && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <div className="ml-3 mt-1 mb-2 border-l-2 border-light-border dark:border-dark-border pl-3 space-y-0.5">
                                {link.dropdown.map((item) => (
                                  <Link
                                    key={item.href}
                                    href={item.href}
                                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-[13px] text-light-muted dark:text-dark-muted hover:bg-light-border/50 dark:hover:bg-dark-border/50 hover:text-accent transition-colors"
                                  >
                                    <span className="w-1 h-1 rounded-full bg-current opacity-40" />
                                    {item.label}
                                  </Link>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </>
                    ) : (
                      <Link
                        href={link.href}
                        className={`flex rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${isActive ? 'bg-accent/10 text-accent' : 'text-light-text dark:text-dark-text hover:bg-light-border/60 dark:hover:bg-dark-border/60'
                          }`}
                      >
                        {link.label}
                      </Link>
                    )}
                  </div>
                );
              })}
              <Link
                href="/contact"
                className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-bold text-white shadow-md shadow-accent/20"
              >
                Contact Us
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
