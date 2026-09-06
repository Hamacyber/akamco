'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useRef } from 'react';

const ACCENT_COLOR = '#00C46A';
const NODE_COLOR = 'rgba(0,196,106,0.40)';
const EDGE_COLOR = 'rgba(0,196,106,0.13)';

/* ── reduced node set (12 nodes) ── */
const NODES = [
  { cx: 120,  cy: 80,  r: 3 },
  { cx: 480,  cy: 110, r: 4 },
  { cx: 900,  cy: 70,  r: 3 },
  { cx: 1320, cy: 100, r: 4 },
  { cx: 260,  cy: 300, r: 4 },
  { cx: 700,  cy: 280, r: 3 },
  { cx: 1100, cy: 310, r: 5 },
  { cx: 100,  cy: 520, r: 3 },
  { cx: 520,  cy: 490, r: 4 },
  { cx: 960,  cy: 510, r: 3 },
  { cx: 1360, cy: 480, r: 4 },
  { cx: 340,  cy: 650, r: 3 },
];

const EDGES: [number, number][] = [
  [0,1],[1,2],[2,3],
  [0,4],[4,5],[5,6],[3,6],
  [4,7],[7,8],[8,9],[9,10],
  [7,11],[11,8],
  [1,5],[2,6],[5,9],
];

export function Hero() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const circles = Array.from(svg.querySelectorAll<SVGCircleElement>('circle'));
    const lines   = Array.from(svg.querySelectorAll<SVGLineElement>('line'));

    let raf: number;
    let t = 0;

    const tick = () => {
      t += 0.0025;
      circles.forEach((c, i) => {
        c.setAttribute('cx', String(NODES[i].cx + Math.sin(t + i * 0.8) * 8));
        c.setAttribute('cy', String(NODES[i].cy + Math.cos(t + i * 0.6) * 8));
      });
      lines.forEach((l, i) => {
        const [a, b] = EDGES[i];
        l.setAttribute('x1', String(NODES[a].cx + Math.sin(t + a * 0.8) * 8));
        l.setAttribute('y1', String(NODES[a].cy + Math.cos(t + a * 0.6) * 8));
        l.setAttribute('x2', String(NODES[b].cx + Math.sin(t + b * 0.8) * 8));
        l.setAttribute('y2', String(NODES[b].cy + Math.cos(t + b * 0.6) * 8));
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section className="relative flex min-h-screen items-center overflow-hidden pt-16 md:pt-20">
      {/* Premium gradient background glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-accent/8 rounded-full blur-[180px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[800px] h-[800px] bg-blue-500/8 rounded-full blur-[180px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[200px]" />
      </div>

      {/* SVG Background */}
      <svg
        ref={svgRef}
        className="absolute inset-0 h-full w-full opacity-40 dark:opacity-30"
        viewBox="0 0 1440 720"
      >
        {EDGES.map((edge, i) => (
          <line key={`edge-${i}`} stroke={EDGE_COLOR} strokeWidth="0.5" />
        ))}
        {NODES.map((node, i) => (
          <circle key={`node-${i}`} r={node.r} fill={NODE_COLOR} />
        ))}
      </svg>

      {/* Content */}
      <div className="container-max relative z-10 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl text-center">
          {/* Premium badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8 inline-block"
          >
            <div className="rounded-full border border-accent/30 bg-gradient-to-r from-accent/10 via-transparent to-accent/10 px-6 py-2 backdrop-blur-md">
              <span className="text-xs font-semibold uppercase tracking-widest text-accent">
                Enterprise Solutions
              </span>
            </div>
          </motion.div>

          {/* Premium heading with gradient */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight"
          >
            <span className="text-light-text dark:text-dark-text">Innovating</span>
            <br />
            <span className="text-accent">
              Infrastructure, Securing
            </span>
            <br />
            <span className="text-light-text dark:text-dark-text">Tomorrow!</span>
          </motion.h1>

          {/* Premium capabilities pills */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-3 md:gap-4"
          >
            {['Enterprise Infrastructure', 'Physical Security', 'Digital Security', 'Renewable Energy', 'Cloud Solutions'].map((cap, i) => (
              <motion.span
                key={cap}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.2 + i * 0.06 }}
                className="px-4 py-2 rounded-full bg-white/10 dark:bg-white/5 backdrop-blur-md border border-white/20 dark:border-white/10 text-xs sm:text-sm font-medium text-light-text dark:text-dark-text hover:bg-white/15 dark:hover:bg-white/10 hover:border-accent/40 transition-all duration-300 cursor-default"
              >
                {cap}
              </motion.span>
            ))}
          </motion.div>

          {/* Premium description */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.28 }}
            className="mt-10 text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed text-light-muted dark:text-dark-muted font-light"
          >
            Design and deliver <span className="text-accent font-semibold">intelligent infrastructure</span> and <span className="text-accent font-semibold">security solutions</span> that help organizations operate smarter, safer, and more efficiently.
          </motion.p>

          {/* Premium CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.42 }}
            className="mt-14 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6"
          >
            {/* Services - Gradient Button */}
            <Link
              href="/services"
              className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-base font-semibold overflow-hidden transition-all duration-300 hover:scale-105"
            >
              {/* Gradient background */}
              <div className="absolute inset-0 bg-gradient-to-r from-accent to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute inset-0 bg-accent/20 group-hover:bg-accent/30 transition-all duration-300" />
              <div className="absolute inset-0 rounded-2xl border border-accent/50 group-hover:border-accent/80 transition-colors duration-300" />
              
              <span className="relative text-light-text dark:text-dark-text group-hover:text-white transition-colors duration-300 flex items-center gap-2">
                Services
                <motion.svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  whileHover={{ x: 4 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </motion.svg>
              </span>
            </Link>

            {/* Free Consultation - Glassmorphic Button */}
            <Link
              href="/contact"
              className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-base font-semibold overflow-hidden transition-all duration-300 hover:scale-105"
            >
              {/* Glassmorphic background */}
              <div className="absolute inset-0 bg-white/10 dark:bg-white/5 backdrop-blur-xl" />
              
              {/* Border with glow */}
              <div className="absolute inset-0 rounded-2xl border border-accent/30 group-hover:border-accent/70 group-hover:shadow-[0_0_30px] group-hover:shadow-accent/40 transition-all duration-300" />

              <span className="relative text-accent group-hover:text-accent transition-colors duration-300 flex items-center gap-2">
                Free Consultation
                <motion.svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  whileHover={{ x: 4 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </motion.svg>
              </span>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
