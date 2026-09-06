'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FadeIn } from '@/components/ui/FadeIn';

export function CTASection() {
  return (
    <section className="section-padding relative overflow-hidden">
      {/* Premium gradient background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[150px]" />
      </div>

      <div className="container-max relative">
        <FadeIn>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-3xl p-12 sm:p-20 text-center"
          >
            {/* Premium glassmorphic background */}
            <div className="absolute inset-0 bg-white/10 dark:bg-white/5 backdrop-blur-2xl" />
            
            {/* Gradient border with glow */}
            <div className="absolute inset-0 rounded-3xl border border-white/20 dark:border-white/10" />
            
            {/* Animated glow effect */}
            <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-40 w-80 bg-accent/15 blur-[100px] rounded-full animate-pulse" />
            <div className="absolute -bottom-32 right-1/2 translate-x-1/2 h-40 w-80 bg-blue-500/15 blur-[100px] rounded-full animate-pulse" style={{ animationDelay: '1s' }} />

            {/* Content */}
            <div className="relative z-10">
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="mb-6 inline-block"
              >
                <div className="rounded-full border border-accent/30 bg-gradient-to-r from-accent/10 via-transparent to-accent/10 px-6 py-2 backdrop-blur-md">
                  <span className="text-xs font-semibold uppercase tracking-widest text-accent">
                    Let's Get Started
                  </span>
                </div>
              </motion.div>

              {/* Heading */}
              <motion.h2
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-light-text dark:text-dark-text mb-6"
              >
                Ready to Secure Your
                <br />
                <span className="text-accent">Infrastructure?</span>
              </motion.h2>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mx-auto max-w-2xl text-base text-light-muted dark:text-dark-muted leading-relaxed mb-8"
              >
                Let&apos;s discuss how Akamco Technologies can deliver the security, reliability, and 
                performance your organization demands.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: 0.25 }}
                className="flex flex-col items-center justify-center gap-4 sm:flex-row"
              >
                {/* Contact Us Button */}
                <Link
                  href="/contact"
                  className="group relative inline-flex items-center justify-center px-8 py-4 rounded-2xl text-base font-semibold overflow-hidden transition-all duration-300"
                >
                  {/* Primary gradient background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-accent to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute inset-0 bg-accent/10 dark:bg-accent/20 group-hover:bg-accent/20 dark:group-hover:bg-accent/30 transition-all duration-300" />
                  <div className="absolute inset-0 rounded-2xl border border-accent/40 group-hover:border-accent/80 transition-colors duration-300" />
                  <span className="relative text-light-text dark:text-dark-text group-hover:text-white transition-colors duration-300 flex items-center gap-2">
                    Contact Us
                    <motion.svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      whileHover={{ x: 4 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </motion.svg>
                  </span>
                </Link>

                {/* View Solutions Button */}
                <Link
                  href="/solutions"
                  className="group relative inline-flex items-center justify-center px-8 py-4 rounded-2xl text-base font-semibold overflow-hidden transition-all duration-300"
                >
                  {/* Glassmorphic background */}
                  <div className="absolute inset-0 bg-white/10 dark:bg-white/5 backdrop-blur-xl" />
                  <div className="absolute inset-0 rounded-2xl border border-accent/30 group-hover:border-accent/60 group-hover:shadow-[0_0_30px] group-hover:shadow-accent/30 transition-all duration-300" />
                  <span className="relative text-accent group-hover:text-accent transition-colors duration-300 flex items-center gap-2">
                    View Solutions
                    <motion.svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      whileHover={{ x: 4 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </motion.svg>
                  </span>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </FadeIn>
      </div>
    </section>
  );
}
