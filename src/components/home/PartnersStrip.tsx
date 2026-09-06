'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

type PartnerItem = { name: string; logo: string; logoDark?: string };

function LogoItem({ name, logo, logoDark }: PartnerItem) {
    const [lightErr, setLightErr] = useState(false);
    const [darkErr, setDarkErr] = useState(false);
    return (
        <div
            style={{ flexShrink: 0, width: '190px', margin: '0 14px' }}
            className="flex h-20 items-center justify-center rounded-xl border border-light-border dark:border-dark-border px-5 transition-all duration-300 hover:scale-105 hover:border-accent/50 hover:shadow-glow"
        >
            {/* Light mode logo */}
            {!lightErr ? (
                <Image
                    src={logo}
                    alt={name}
                    width={160}
                    height={64}
                    className="block dark:hidden h-14 w-auto max-w-full object-contain"
                    onError={() => setLightErr(true)}
                    unoptimized
                />
            ) : (
                <span className="block dark:hidden text-xs font-semibold text-light-muted text-center leading-tight">{name}</span>
            )}
            {/* Dark mode logo â€” use logoDark if available, else fall back to light logo */}
            {!darkErr ? (
                <Image
                    src={logoDark ?? logo}
                    alt={name}
                    width={160}
                    height={64}
                    className="hidden dark:block h-14 w-auto max-w-full object-contain brightness-110"
                    onError={() => setDarkErr(true)}
                    unoptimized
                />
            ) : (
                <span className="hidden dark:block text-xs font-semibold text-dark-muted text-center leading-tight">{name}</span>
            )}
        </div>
    );
}

interface PartnersStripProps {
    partners: PartnerItem[];
}

export function PartnersStrip({ partners }: PartnersStripProps) {
    // Double the list for seamless loop
    const doubled = [...partners, ...partners];
    // Each item is 160px wide + 20px margin = 180px. Total for one set:
    const totalWidth = partners.length * 218;

    return (
        <section className="section-padding border-y border-light-border/50 dark:border-dark-border/50 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[120px] -translate-y-1/2" />
                <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[120px] -translate-y-1/2" />
            </div>

            <div className="container-max mb-14 relative">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.5 }}
                    className="text-center"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.4 }}
                        className="mb-6 inline-block"
                    >
                        <div className="rounded-full border border-accent/30 bg-gradient-to-r from-accent/10 via-transparent to-accent/10 px-6 py-2 backdrop-blur-md">
                            <span className="text-xs font-semibold uppercase tracking-widest text-accent">
                                Technology Partners
                            </span>
                        </div>
                    </motion.div>

                    <h2 className="font-heading text-3xl font-bold text-light-text dark:text-dark-text sm:text-4xl lg:text-5xl mb-4">
                        Backed by the World&apos;s
                        <br />
                        <span className="text-accent">Leading Vendors</span>
                    </h2>

                    <p className="text-base text-light-muted dark:text-dark-muted max-w-2xl mx-auto leading-relaxed">
                        Our solutions are built on certified, enterprise-grade technology from global leaders you already trust.
                    </p>
                </motion.div>
            </div>

            {/* Scrolling marquee â€” JS-driven via Framer Motion so it always works */}
            <div className="relative overflow-hidden">
                <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-32 bg-gradient-to-r from-white/80 dark:from-[#111827]/80 via-transparent to-transparent backdrop-blur-sm" />
                <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-32 bg-gradient-to-l from-white/80 dark:from-[#111827]/80 via-transparent to-transparent backdrop-blur-sm" />

                <motion.div
                    style={{ display: 'flex', width: 'max-content' }}
                    animate={{ x: [0, -totalWidth] }}
                    transition={{ duration: 120, ease: 'linear', repeat: Infinity }}
                    className="py-4"
                >
                    {doubled.map((p, i) => (
                        <motion.div key={`${p.name}-${i}`} whileHover={{ y: -6 }}>
                            <LogoItem name={p.name} logo={p.logo} logoDark={p.logoDark} />
                        </motion.div>
                    ))}
                </motion.div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mt-14 text-center relative"
            >
                <Link
                    href="/partners"
                    className="group inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-semibold relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-white/10 dark:bg-white/5 backdrop-blur-xl" />
                    <div className="absolute inset-0 rounded-2xl border border-accent/30 group-hover:border-accent/60 group-hover:shadow-[0_0_30px] group-hover:shadow-accent/30 transition-all duration-300" />
                    <span className="relative text-accent group-hover:text-accent transition-colors duration-300 flex items-center gap-1.5">
                        View all {partners.length} technology partners
                        <motion.svg
                            className="h-3.5 w-3.5"
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
        </section>
    );
}

