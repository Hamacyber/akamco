'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { StoredPartner } from '@/types';
import { useTheme } from '@/lib/theme';

interface Props {
  partners: StoredPartner[];
  categories: string[];
}

export function PartnersContent({ partners, categories }: Props) {
  const { theme } = useTheme();
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedPartner, setSelectedPartner] = useState<StoredPartner | null>(null);

  const allCategories = ['All', ...categories];

  const filteredPartners = activeCategory === 'All'
    ? partners
    : partners.filter(p => p.category === activeCategory);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedPartner) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [selectedPartner]);

  return (
    <div className="pt-24 md:pt-28">
      {/* Hero */}
      <section className="relative section-padding overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-accent/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>
        </div>

        <div className="container-max">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-4xl text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 bg-accent/10 backdrop-blur-sm border border-accent/20 rounded-full px-6 py-3 mb-8">
              <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="text-sm font-bold uppercase tracking-wider text-accent">Technology Partners</span>
            </div>
            <h1 className="font-heading text-3xl sm:text-5xl lg:text-7xl font-bold text-light-text dark:text-dark-text mb-6 leading-tight">
              Trusted Global <span className="text-accent">Partners</span>
            </h1>
            <p className="text-xl text-light-muted dark:text-dark-muted leading-relaxed">
              We proudly work with world-leading brands to deliver innovative, reliable, and secure solutions across IT, security, power, and communications.
            </p>
          </motion.div>

          {/* Category Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-3 mb-16"
          >
            {allCategories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-5 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 ${activeCategory === category
                  ? 'bg-accent text-white shadow-lg shadow-accent/40'
                  : 'bg-light-surface dark:bg-dark-surface text-light-muted dark:text-dark-muted border border-light-border dark:border-dark-border hover:border-accent/50 hover:text-accent'
                  }`}
              >
                {category}
              </button>
            ))}
          </motion.div>

          {/* Partners Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 md:gap-6">
              <AnimatePresence mode="popLayout">
                {filteredPartners.map((partner, index) => (
                  <motion.div
                    key={partner.name}
                    layout
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: -10 }}
                    transition={{
                      duration: 0.4,
                      delay: index * 0.03,
                      layout: { duration: 0.3 }
                    }}
                  >
                    <motion.button
                      onClick={() => setSelectedPartner(partner)}
                      whileHover={{ y: -8, scale: 1.04 }}
                      whileTap={{ scale: 0.97 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                      className="group relative w-full cursor-pointer rounded-2xl overflow-hidden"
                    >
                      {/* Card */}
                      <div className="relative flex flex-col items-center justify-center aspect-square p-5 rounded-2xl border border-light-border/60 dark:border-dark-border/60 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800/80 dark:to-gray-900/80 transition-colors duration-300 group-hover:border-accent/60 group-hover:shadow-xl group-hover:shadow-accent/20">
                        {/* Hover glow */}
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-accent/0 to-accent/0 group-hover:from-accent/10 group-hover:to-accent/5 transition-all duration-500"></div>
                        <div className="absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-accent/30 via-transparent to-accent/20 blur-sm"></div>

                        {/* Logo */}
                        <div className="relative flex-1 w-full flex items-center justify-center">
                          {partner.logo ? (
                            <div className="relative w-full h-full p-3">
                              <Image
                                src={(theme === 'dark' && partner.logoDark) ? partner.logoDark : partner.logo}
                                alt={`${partner.name} logo`}
                                fill
                                className="object-contain transition-all duration-500 group-hover:scale-105"
                              />
                            </div>
                          ) : (
                            <span className="text-lg font-bold text-light-text dark:text-dark-text group-hover:text-accent transition-colors duration-300 text-center leading-tight px-1">
                              {partner.name}
                            </span>
                          )}
                        </div>

                        {/* Shine sweep */}
                        <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
                          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out bg-gradient-to-r from-transparent via-white/20 dark:via-white/10 to-transparent"></div>
                        </div>
                      </div>
                    </motion.button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Partner Detail Modal */}
      <AnimatePresence>
        {selectedPartner && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedPartner(null)}
          >
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-md w-full bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 border border-light-border dark:border-dark-border"
            >
              {/* Close */}
              <button
                onClick={() => setSelectedPartner(null)}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full text-light-muted dark:text-dark-muted hover:text-light-text dark:hover:text-dark-text transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Logo */}
              <div className="w-16 h-16 relative rounded-xl border border-light-border dark:border-dark-border bg-gray-50 dark:bg-gray-800 mb-5">
                {selectedPartner.logo ? (
                  <Image
                    src={(theme === 'dark' && selectedPartner.logoDark) ? selectedPartner.logoDark : selectedPartner.logo}
                    alt={selectedPartner.name}
                    fill
                    className="object-contain p-2"
                  />
                ) : (
                  <span className="absolute inset-0 flex items-center justify-center text-accent font-bold text-xl">
                    {selectedPartner.name.charAt(0)}
                  </span>
                )}
              </div>

              {/* Name + category */}
              <h3 className="font-heading text-xl font-bold text-light-text dark:text-dark-text mb-1">
                {selectedPartner.name}
              </h3>
              <span className="inline-block px-2.5 py-0.5 bg-accent/10 text-accent rounded-full text-xs font-semibold mb-4">
                {selectedPartner.category}
              </span>

              {/* Description */}
              <p className="text-sm text-light-muted dark:text-dark-muted leading-relaxed mb-6">
                {selectedPartner.description}
              </p>

              {/* CTA */}
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-white rounded-xl text-sm font-semibold hover:bg-accent/90 transition-colors"
              >
                Contact Us
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CTA Section */}
      <section className="relative section-padding overflow-hidden">
        <div className="container-max relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-4xl text-center"
          >
            <div className="mb-8 inline-flex items-center gap-2 bg-accent/10 backdrop-blur-sm border border-accent/20 rounded-full px-6 py-3">
              <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="text-sm font-bold uppercase tracking-wider text-accent">Let&apos;s Work Together</span>
            </div>

            <h2 className="font-heading text-4xl sm:text-5xl font-bold text-light-text dark:text-dark-text mb-6">
              Ready to Build Your <span className="text-accent">Solution?</span>
            </h2>
            <p className="text-xl text-light-muted dark:text-dark-muted leading-relaxed mb-10">
              Our vendor-agnostic approach ensures we recommend the right technology for your specific requirements.
            </p>

            <div className="relative inline-block group">
              <div className="absolute -inset-2 bg-gradient-to-r from-accent to-accent/80 rounded-xl blur-lg opacity-40 group-hover:opacity-80 transition-opacity duration-300"></div>
              <Link
                href="/contact"
                className="relative inline-flex items-center justify-center gap-3 px-12 py-5 text-lg font-bold text-white bg-gradient-to-r from-accent to-accent/90 rounded-xl hover:from-accent/90 hover:to-accent transition-all duration-300 shadow-xl shadow-accent/30 hover:shadow-2xl hover:shadow-accent/50 hover:-translate-y-1"
              >
                Get in Touch
                <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
