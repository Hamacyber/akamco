'use client';

import { motion } from 'framer-motion';

interface SectionHeaderProps {
  label?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
}

export function SectionHeader({
  label,
  title,
  description,
  align = 'center',
}: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      className={`mb-14 ${align === 'center' ? 'text-center' : 'text-left'}`}
    >
      {label && (
        <span className="mb-3 inline-block rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-accent">
          {label}
        </span>
      )}
      <h2 className="font-heading text-2xl font-bold tracking-tight text-light-text dark:text-dark-text sm:text-3xl lg:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="mx-auto mt-4 max-w-2xl text-sm text-light-muted dark:text-dark-muted leading-relaxed sm:text-base">
          {description}
        </p>
      )}
    </motion.div>
  );
}
