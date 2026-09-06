'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';

const IMPACT_STATS = [
  {
    value: 25,
    suffix: '+',
    label: 'Years of Excellence',
    description: 'Serving Iraq & the Middle East since 2001',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    ),
  },
  {
    value: 500,
    suffix: '+',
    label: 'Projects Delivered',
    description: 'Mission-critical deployments across all sectors',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    ),
  },
  {
    value: 300,
    suffix: '+',
    label: 'Clients Served',
    description: 'Trusted by ministries and enterprises alike',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
      </svg>
    ),
  },
  {
    value: 24,
    suffix: '/7',
    label: 'Always Operational',
    description: 'Round-the-clock monitoring and support',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.348 14.651a3.75 3.75 0 0 1 0-5.303m5.304 0a3.75 3.75 0 0 1 0 5.303m-7.425 2.122a6.75 6.75 0 0 1 0-9.546m9.546 0a6.75 6.75 0 0 1 0 9.546M5.106 18.894c-3.808-3.808-3.808-9.98 0-13.789m13.788 0c3.808 3.809 3.808 9.981 0 13.79M12 12h.008v.007H12V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
      </svg>
    ),
  },
];

export function StatsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '0px 0px -80px 0px' });

  return (
    <section
      ref={sectionRef}
      className="relative py-24 md:py-32 overflow-hidden"
    >
      {/* Premium gradient background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[150px]" />
      </div>

      <div className="relative container-max px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          {/* Premium badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.4 }}
            className="mb-6 inline-block"
          >
            <div className="rounded-full border border-accent/30 bg-gradient-to-r from-accent/10 via-transparent to-accent/10 px-6 py-2 backdrop-blur-md">
              <span className="text-xs font-semibold uppercase tracking-widest text-accent">
                Our Impact
              </span>
            </div>
          </motion.div>

          {/* Premium heading */}
          <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-light-text dark:text-dark-text mb-6">
            <span>Numbers That</span>
            <br />
            <span className="text-accent">Speak</span>
          </h2>

          {/* Subtitle */}
          <p className="mx-auto max-w-2xl text-base text-light-muted dark:text-dark-muted leading-relaxed">
            Over two decades of delivering critical technology across Iraq and the Middle East.
          </p>
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {IMPACT_STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative overflow-hidden rounded-3xl p-8 md:p-10"
            >
              {/* Glassmorphic background */}
              <div className="absolute inset-0 bg-white/10 dark:bg-white/5 backdrop-blur-2xl" />
              
              {/* Gradient border with glow */}
              <div
                className="absolute inset-0 rounded-3xl border border-white/20 dark:border-white/10 group-hover:border-white/40 group-hover:shadow-[0_0_40px] transition-all duration-500"
                style={{
                  boxShadow: `inset 0 0 20px rgba(0, 196, 106, 0.1)`,
                }}
              />

              {/* Background glow on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" style={{
                background: `radial-gradient(circle at center, ${stat.icon.props?.fill || '#00C46A'}20, transparent 70%)`
              }} />

              {/* Content */}
              <div className="relative z-10 flex flex-col items-center text-center h-full">
                {/* Icon container with glow */}
                <motion.div
                  whileHover={{ scale: 1.15, rotate: 5 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                  className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl text-accent transition-all duration-500"
                  style={{
                    background: `linear-gradient(135deg, rgba(0, 196, 106, 0.2), rgba(0, 196, 106, 0.1))`,
                    boxShadow: `0 0 20px rgba(0, 196, 106, 0.3)`,
                  }}
                >
                  {stat.icon}
                </motion.div>

                {/* Number with glow effect */}
                <div className="mb-3 relative">
                  <motion.div
                    className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-accent to-blue-500 bg-clip-text text-transparent"
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ duration: 0.6, delay: 0.2 + i * 0.1 }}
                  >
                    {isInView && (
                      <>
                        <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                      </>
                    )}
                    {!isInView && `${stat.value}${stat.suffix}`}
                  </motion.div>
                  
                  {/* Glow behind number */}
                  <div className="absolute inset-0 blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500" style={{
                    background: `linear-gradient(135deg, rgba(0, 196, 106, 0.5), rgba(59, 130, 246, 0.3))`,
                    zIndex: -1,
                  }} />
                </div>

                {/* Label */}
                <h3 className="text-base sm:text-lg font-bold text-light-text dark:text-dark-text mb-3 group-hover:text-accent transition-colors duration-300">
                  {stat.label}
                </h3>

                {/* Description */}
                <p className="text-xs sm:text-sm text-light-muted dark:text-dark-muted leading-relaxed flex-grow">
                  {stat.description}
                </p>

                {/* Bottom accent line */}
                <div className="mt-6 h-1 w-8 bg-gradient-to-r from-accent to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
