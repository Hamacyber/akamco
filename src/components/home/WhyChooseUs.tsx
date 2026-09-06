'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const REASONS = [
    {
        icon: (
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        title: '25+ Years of Experience',
        description: 'Founded in 2001, Akamco has spent over two decades delivering mission-critical infrastructure across Iraq and the region — with a track record clients trust.',
        accent: '#00C46A',
    },
    {
        icon: (
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
            </svg>
        ),
        title: 'Government & Enterprise Trusted',
        description: 'Preferred partner for federal ministries, defense agencies, and Fortune-class enterprises — delivering sovereign, compliant, and resilient solutions.',
        accent: '#0EA5E9',
    },
    {
        icon: (
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
        ),
        title: 'Industry Certifications',
        description: 'Our engineers hold certifications from Cisco, HPE, Microsoft, CompTIA, ISO 27001, and CISM — ensuring solutions are designed and delivered to global standards.',
        accent: '#8B5CF6',
    },
    {
        icon: (
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        ),
        title: '24/7 Security Operations',
        description: 'Our Security Operations Centre monitors your environment around the clock — detecting, triaging, and responding to threats before they become incidents.',
        accent: '#EF4444',
    },
    {
        icon: (
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.5 16.875h3.375m0 0h3.375m-3.375 0V13.5m0 3.375v3.375M6 10.5h2.25a2.25 2.25 0 002.25-2.25V6a2.25 2.25 0 00-2.25-2.25H6A2.25 2.25 0 003.75 6v2.25A2.25 2.25 0 006 10.5zm0 9.75h2.25A2.25 2.25 0 0010.5 18v-2.25a2.25 2.25 0 00-2.25-2.25H6a2.25 2.25 0 00-2.25 2.25V18A2.25 2.25 0 006 20.25zm9.75-9.75H18a2.25 2.25 0 002.25-2.25V6A2.25 2.25 0 0018 3.75h-2.25A2.25 2.25 0 0013.5 6v2.25a2.25 2.25 0 002.25 2.25z" />
            </svg>
        ),
        title: 'End-to-End Delivery',
        description: 'From concept and design through installation, commissioning, and ongoing support — we are the single accountable partner for your entire technology lifecycle.',
        accent: '#F59E0B',
    },
    {
        icon: (
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
        ),
        title: 'Local Expertise, Regional Reach',
        description: 'Headquartered in Baghdad with deep knowledge of local regulations, procurement processes, and operational realities — combined with international standards.',
        accent: '#10B981',
    },
];

export function WhyChooseUs() {
    return (
        <section className="section-padding relative overflow-hidden">
            {/* Premium gradient background */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px]" />
            </div>

            <div className="container-max relative">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.5 }}
                    className="mb-16 text-center"
                >
                    {/* Premium badge */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.4 }}
                        className="mb-6 inline-block"
                    >
                        <div className="rounded-full border border-accent/30 bg-gradient-to-r from-accent/10 via-transparent to-accent/10 px-6 py-2 backdrop-blur-md">
                            <span className="text-xs font-semibold uppercase tracking-widest text-accent">
                                ✨ Why Akamco
                            </span>
                        </div>
                    </motion.div>

                    {/* Premium heading with gradient */}
                    <h2 className="font-heading text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl mb-6">
                        <span className="text-light-text dark:text-dark-text">Built on Trust,</span>
                        <br />
                        <span className="text-accent">
                            Delivered with Precision
                        </span>
                    </h2>
                    
                    {/* Subtitle */}
                    <p className="mx-auto max-w-2xl text-base text-light-muted dark:text-dark-muted leading-relaxed">
                        Six reasons organisations across government, enterprise, and critical infrastructure choose Akamco as their long-term technology partner.
                    </p>
                </motion.div>

                {/* Cards grid */}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {REASONS.map((reason, i) => (
                        <motion.div
                            key={reason.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.1 }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            whileHover={{ y: -8, scale: 1.02 }}
                            className="group relative rounded-3xl overflow-hidden"
                        >
                            {/* Glassmorphic background */}
                            <div className="absolute inset-0 bg-white/10 dark:bg-white/5 backdrop-blur-xl" />
                            
                            {/* Gradient border glow */}
                            <div
                                className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                style={{
                                    background: `linear-gradient(135deg, ${reason.accent}40, transparent)`,
                                    boxShadow: `0 0 30px ${reason.accent}30`,
                                }}
                            />

                            {/* Border */}
                            <div className="absolute inset-0 rounded-3xl border border-white/20 dark:border-white/10 group-hover:border-white/40 transition-colors duration-500" />

                            {/* Content */}
                            <div className="relative p-8 h-full flex flex-col">
                                {/* Icon container with glow */}
                                <motion.div
                                    whileHover={{ scale: 1.1 }}
                                    transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                                    className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl transition-all duration-500"
                                    style={{
                                        background: `linear-gradient(135deg, ${reason.accent}30, ${reason.accent}15)`,
                                        color: reason.accent,
                                        boxShadow: `0 0 20px ${reason.accent}20`,
                                    }}
                                >
                                    {reason.icon}
                                </motion.div>

                                {/* Title */}
                                <h3 className="font-heading text-lg font-bold text-light-text dark:text-dark-text mb-3 group-hover:text-accent transition-colors duration-300">
                                    {reason.title}
                                </h3>

                                {/* Description */}
                                <p className="text-sm text-light-muted dark:text-dark-muted leading-relaxed flex-grow group-hover:text-light-text/80 dark:group-hover:text-dark-text/80 transition-colors duration-300">
                                    {reason.description}
                                </p>

                                {/* Accent line indicator */}
                                <div className="mt-4 h-0.5 w-8 bg-gradient-to-r from-accent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Premium CTA Button */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="mt-16 flex justify-center"
                >
                    <Link
                        href="/about"
                        className="group relative inline-flex items-center gap-2 rounded-2xl px-8 py-4 text-base font-semibold overflow-hidden"
                    >
                        {/* Glassmorphic background */}
                        <div className="absolute inset-0 bg-gradient-to-r from-accent to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="absolute inset-0 bg-white/10 backdrop-blur-xl" />
                        <div className="absolute inset-0 border border-accent/30 group-hover:border-accent/60 transition-colors duration-300 rounded-2xl" />

                        {/* Content */}
                        <span className="relative text-light-text dark:text-dark-text group-hover:text-white transition-colors duration-300 flex items-center gap-2">
                            Learn About Our Story
                            <motion.svg
                                className="h-4 w-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                whileHover={{ x: 4 }}
                                transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </motion.svg>
                        </span>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
