'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  hover?: boolean;
  variant?: 'glass' | 'solid';
}

interface StatCardProps {
  number: string | number;
  label: string;
  description?: string;
  delay?: number;
  className?: string;
}

// GlassCard: RGBA background with backdrop blur
export function GlassCard({ children, className = '', delay = 0, hover = true }: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.5, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={`glass-card p-6 sm:p-8 relative overflow-hidden ${
        hover
          ? 'hover:-translate-y-1 hover:shadow-glow group before:absolute before:top-0 before:left-0 before:h-1 before:w-0 before:bg-accent hover:before:w-full'
          : ''
      } ${className}`}
    >
      {children}
    </motion.div>
  );
}

// SolidCard: Strong surface background
export function SolidCard({ children, className = '', delay = 0, hover = true }: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.5, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={`rounded-2xl border border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surface p-6 sm:p-8 relative overflow-hidden shadow-card dark:shadow-card-dark ${
        hover
          ? 'hover:-translate-y-1 hover:border-accent/40 hover:shadow-glow group before:absolute before:top-0 before:left-0 before:h-1 before:w-0 before:bg-accent hover:before:w-full'
          : ''
      } ${className}`}
    >
      {children}
    </motion.div>
  );
}

// StatCard: Number + label + micro description
export function StatCard({ number, label, description, delay = 0, className = '' }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.5, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={`glass-card p-6 sm:p-8 text-center relative overflow-hidden hover:-translate-y-1 hover:shadow-glow group before:absolute before:top-0 before:right-0 before:h-0 before:w-1 before:bg-accent hover:before:h-full ${className}`}
    >
      <div className="mb-2 font-heading text-4xl font-bold text-accent sm:text-5xl">
        {number}
      </div>
      <div className="mb-1 text-sm font-semibold uppercase tracking-wider text-light-text dark:text-dark-text">
        {label}
      </div>
      {description && (
        <p className="text-xs text-light-muted dark:text-dark-muted leading-relaxed">
          {description}
        </p>
      )}
    </motion.div>
  );
}

// Legacy Card component for backwards compatibility
export function Card({ children, className = '', delay = 0, hover = true, variant = 'glass' }: CardProps) {
  if (variant === 'solid') {
    return <SolidCard className={className} delay={delay} hover={hover}>{children}</SolidCard>;
  }
  return <GlassCard className={className} delay={delay} hover={hover}>{children}</GlassCard>;
}
