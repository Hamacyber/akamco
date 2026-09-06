'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { testimonials } from '@/data/testimonials';

export function Testimonials() {
  const [current, setCurrent] = useState(0);

  return (
    <section className="section-padding relative overflow-hidden">
      {/* Premium gradient background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/3 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="container-max relative">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
        >
          <SectionHeader
            label="Client Outcomes"
            title="Trusted by Industry Leaders"
            description="Delivering measurable results for government agencies and enterprise organizations."
          />
        </motion.div>

        <div className="mx-auto max-w-4xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4 }}
              className="relative overflow-hidden rounded-3xl p-8 sm:p-16 text-center"
            >
              {/* Premium glassmorphic background */}
              <div className="absolute inset-0 bg-white/10 dark:bg-white/5 backdrop-blur-2xl" />
              
              {/* Gradient border with glow */}
              <div className="absolute inset-0 rounded-3xl border border-white/20 dark:border-white/10" />
              
              {/* Animated glow effects */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 h-48 w-96 bg-accent/10 blur-[100px] rounded-full" />
              <div className="absolute bottom-0 right-1/2 translate-x-1/2 h-48 w-96 bg-blue-500/10 blur-[100px] rounded-full" />

              {/* Content */}
              <div className="relative z-10">
                {/* Quote Icon */}
                <motion.svg
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  className="mx-auto mb-8 h-10 w-10 text-accent/50"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </motion.svg>

                {/* Quote */}
                <motion.blockquote
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="text-lg sm:text-xl lg:text-2xl text-light-text dark:text-dark-text leading-relaxed font-light italic"
                >
                  &ldquo;{testimonials[current].quote}&rdquo;
                </motion.blockquote>

                {/* Author Info */}
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="mt-10 flex flex-col items-center"
                >
                  {/* Divider line */}
                  <div className="w-12 h-1 bg-gradient-to-r from-transparent via-accent/50 to-transparent rounded-full mb-6" />

                  <p className="text-base font-semibold text-light-text dark:text-dark-text">
                    {testimonials[current].author}
                  </p>
                  <p className="mt-1.5 text-sm text-accent font-medium">
                    {testimonials[current].role}
                  </p>
                  {testimonials[current].companyUrl ? (
                    <a
                      href={testimonials[current].companyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:text-accent transition-colors group"
                    >
                      {testimonials[current].organization}
                      <motion.span
                        whileHover={{ x: 2 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                      >
                        ↗
                      </motion.span>
                    </a>
                  ) : (
                    <p className="mt-2 text-sm text-light-muted dark:text-dark-muted">
                      {testimonials[current].organization}
                    </p>
                  )}
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Premium Navigation Dots */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-10 flex items-center justify-center gap-3"
          >
            {testimonials.map((_, i) => (
              <motion.button
                key={i}
                onClick={() => setCurrent(i)}
                aria-label={`View testimonial ${i + 1}`}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                className={`rounded-full transition-all duration-500 ${
                  i === current
                    ? 'w-10 h-3 bg-gradient-to-r from-accent to-blue-500 shadow-[0_0_20px] shadow-accent/50'
                    : 'w-2.5 h-2.5 bg-light-border dark:bg-dark-border hover:bg-accent/60 hover:scale-125'
                }`}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
