'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

interface AnimatedCounterProps {
  value: number;
  suffix?: string;
  label: string;
  duration?: number;
  variant?: 'light' | 'dark';
}

export function AnimatedCounter({
  value,
  suffix = '',
  label,
  duration = 2,
  variant = 'light',
}: AnimatedCounterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '0px 0px -20px 0px' });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    const end = value;
    const isDecimal = end % 1 !== 0;
    const durationMs = duration * 1000;
    let startTime: number | null = null;
    let rafId: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = end * eased;

      if (progress >= 1) {
        setCount(end);
      } else {
        setCount(isDecimal ? parseFloat(current.toFixed(1)) : Math.round(current));
        rafId = requestAnimationFrame(animate);
      }
    };

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [isInView, value, duration]);

  if (variant === 'dark') {
    return (
      <div ref={ref}>
        <span className="font-heading text-3xl font-black tracking-tight text-white">
          {count}
          <span className="text-accent">{suffix}</span>
        </span>
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 12 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      className="text-center"
    >
      <div className="font-heading text-3xl font-bold text-accent sm:text-4xl">
        {count}
        <span className="text-accent">{suffix}</span>
      </div>
      <p className="mt-1 text-sm font-semibold text-light-text dark:text-dark-text">
        {label}
      </p>
    </motion.div>
  );
}
