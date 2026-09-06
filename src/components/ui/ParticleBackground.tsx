'use client';

import { useEffect, useRef } from 'react';

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  radius: number;
  baseX: number; baseY: number;
  angle: number; angleSpeed: number; orbitRadius: number;
}

const COUNT = 50;
const CONNECT_DIST = 140;
const CONNECT_DIST_SQ = CONNECT_DIST * CONNECT_DIST;
const MOUSE_R = 200;
const MOUSE_R_SQ = MOUSE_R * MOUSE_R;

export function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    // Skip on touch-only devices (no mouse = no interaction value)
    if ('ontouchstart' in window && !window.matchMedia('(pointer: fine)').matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true, desynchronized: true });
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0, h = 0;
    let particles: Particle[] = [];
    let isDark = document.documentElement.classList.contains('dark');
    let paused = false;

    // Pair-dedup using flat Uint8Array instead of string Set — zero allocation
    const pairSeen = new Uint8Array(COUNT * COUNT);

    const rawMouse = { x: -9999, y: -9999 };
    const mouse = { x: -9999, y: -9999 };

    // ── Init ──────────────────────────────────────────────────────────────
    const init = () => {
      const margin = 60;
      particles = Array.from({ length: COUNT }, () => {
        const x = margin + Math.random() * (w - margin * 2);
        const y = margin + Math.random() * (h - margin * 2);
        return {
          x, y, vx: 0, vy: 0,
          radius: Math.random() * 1.2 + 0.8,
          baseX: x, baseY: y,
          angle: Math.random() * Math.PI * 2,
          angleSpeed: 0.002 + Math.random() * 0.004,
          orbitRadius: 20 + Math.random() * 40,
        };
      });
    };

    // ── Resize (debounced) ────────────────────────────────────────────────
    let resizeTimer = 0;
    const applyResize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // Always re-randomize so particles always fill the new viewport evenly
      init();
    };
    const onResize = () => { clearTimeout(resizeTimer); resizeTimer = window.setTimeout(applyResize, 120); };
    applyResize();
    window.addEventListener('resize', onResize, { passive: true });

    // ── Dark mode ─────────────────────────────────────────────────────────
    const obs = new MutationObserver(() => {
      isDark = document.documentElement.classList.contains('dark');
    });
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    // ── Mouse ─────────────────────────────────────────────────────────────
    const onMouseMove = (e: MouseEvent) => { rawMouse.x = e.clientX; rawMouse.y = e.clientY; };
    const onMouseLeave = () => { rawMouse.x = -9999; rawMouse.y = -9999; };
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mouseleave', onMouseLeave, { passive: true });

    // ── Visibility – pause when tab hidden ───────────────────────────────
    const onVisibility = () => { paused = document.hidden; };
    document.addEventListener('visibilitychange', onVisibility);

    // ── Spatial grid (rebuilt each frame, cheap for N=50) ────────────────
    const buildGrid = (): Map<number, number[]> => {
      const cols = Math.ceil(w / CONNECT_DIST);
      const grid = new Map<number, number[]>();
      for (let i = 0; i < particles.length; i++) {
        const cx = Math.floor(particles[i].x / CONNECT_DIST);
        const cy = Math.floor(particles[i].y / CONNECT_DIST);
        const key = cy * cols + cx;
        const cell = grid.get(key);
        if (cell) cell.push(i); else grid.set(key, [i]);
      }
      return grid;
    };

    const cols = () => Math.ceil(w / CONNECT_DIST);

    // ── Main loop ─────────────────────────────────────────────────────────
    const tick = () => {
      rafRef.current = requestAnimationFrame(tick);
      if (paused) return;

      ctx.clearRect(0, 0, w, h);

      // Lerp mouse
      if (rawMouse.x > 0) {
        if (mouse.x < 0) { mouse.x = rawMouse.x; mouse.y = rawMouse.y; }
        else {
          mouse.x += (rawMouse.x - mouse.x) * 0.1;
          mouse.y += (rawMouse.y - mouse.y) * 0.1;
        }
      } else {
        mouse.x = -9999; mouse.y = -9999;
      }

      const margin = 60;

      // Update positions
      for (const p of particles) {
        p.angle += p.angleSpeed;
        const tx = p.baseX + Math.sin(p.angle) * p.orbitRadius;
        const ty = p.baseY + Math.cos(p.angle * 0.7 + 1.3) * p.orbitRadius * 0.6;
        p.vx = (tx - p.x) * 0.022;
        p.vy = (ty - p.y) * 0.022;
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < margin) p.x = margin;
        else if (p.x > w - margin) p.x = w - margin;
        if (p.y < margin) p.y = margin;
        else if (p.y > h - margin) p.y = h - margin;
      }

      // ── Connections (spatial grid, no string allocation) ──────────────
      const grid = buildGrid();
      const ncols = cols();
      pairSeen.fill(0);
      ctx.lineWidth = 0.6;

      for (let i = 0; i < particles.length; i++) {
        const pi = particles[i];
        const cx = Math.floor(pi.x / CONNECT_DIST);
        const cy = Math.floor(pi.y / CONNECT_DIST);
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            const cell = grid.get((cy + dy) * ncols + (cx + dx));
            if (!cell) continue;
            for (const j of cell) {
              if (j <= i) continue;
              if (pairSeen[i * COUNT + j]) continue;
              pairSeen[i * COUNT + j] = 1;
              const ddx = pi.x - particles[j].x;
              const ddy = pi.y - particles[j].y;
              const dSq = ddx * ddx + ddy * ddy;
              if (dSq < CONNECT_DIST_SQ) {
                const t = 1 - Math.sqrt(dSq) / CONNECT_DIST;
                ctx.beginPath();
                ctx.moveTo(pi.x, pi.y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.strokeStyle = isDark ? `rgba(0,196,106,${t * 0.18})` : `rgba(0,196,106,${t * 0.13})`;
                ctx.stroke();
              }
            }
          }
        }
      }

      // ── Mouse web ─────────────────────────────────────────────────────
      const hasMouse = mouse.x > 0;
      type Near = { p: Particle; dist: number };
      const near: Near[] = [];
      if (hasMouse) {
        for (const p of particles) {
          const dx = p.x - mouse.x, dy = p.y - mouse.y;
          const dSq = dx * dx + dy * dy;
          if (dSq < MOUSE_R_SQ) near.push({ p, dist: Math.sqrt(dSq) });
        }
        ctx.lineWidth = 0.8;
        for (const { p, dist: d } of near) {
          const t = 1 - d / MOUSE_R;
          ctx.beginPath();
          ctx.moveTo(mouse.x, mouse.y);
          ctx.lineTo(p.x, p.y);
          ctx.strokeStyle = isDark ? `rgba(0,196,106,${t * 0.35})` : `rgba(0,196,106,${t * 0.10})`;
          ctx.stroke();
        }
        // Triangle web between near particles
        ctx.lineWidth = 0.5;
        const CD08 = CONNECT_DIST * 0.8;
        const CD08SQ = CD08 * CD08;
        for (let a = 0; a < near.length; a++) {
          for (let b = a + 1; b < near.length; b++) {
            const dx = near[a].p.x - near[b].p.x;
            const dy = near[a].p.y - near[b].p.y;
            const dSq = dx * dx + dy * dy;
            if (dSq < CD08SQ) {
              const t = 1 - Math.sqrt(dSq) / CD08;
              const prox = Math.min(1 - near[a].dist / MOUSE_R, 1 - near[b].dist / MOUSE_R);
              ctx.beginPath();
              ctx.moveTo(near[a].p.x, near[a].p.y);
              ctx.lineTo(near[b].p.x, near[b].p.y);
              ctx.strokeStyle = isDark ? `rgba(0,196,106,${0.2 * t * prox})` : `rgba(0,196,106,${0.06 * t * prox})`;
              ctx.stroke();
            }
          }
        }
      }

      // ── Particles ─────────────────────────────────────────────────────
      for (const p of particles) {
        const mDx = p.x - mouse.x, mDy = p.y - mouse.y;
        const prox = hasMouse ? Math.max(0, 1 - (mDx * mDx + mDy * mDy) / MOUSE_R_SQ) : 0;
        // sqrt-free proximity is slightly less linear but saves a sqrt per particle
        const baseA = isDark ? 0.35 : 0.18;

        // Outer glow (skip when no mouse near for perf)
        if (prox > 0 || isDark) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * 3 + prox * 6, 0, Math.PI * 2);
          ctx.fillStyle = isDark ? `rgba(0,196,106,${baseA * 0.12 + prox * 0.12})` : `rgba(0,196,106,${prox * 0.05})`;
          ctx.fill();
        }
        // Mid ring
        if (prox > 0.05) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * 2 + prox * 2, 0, Math.PI * 2);
          ctx.fillStyle = isDark ? `rgba(0,196,106,${prox * 0.18})` : `rgba(0,196,106,${prox * 0.07})`;
          ctx.fill();
        }
        // Core
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius + prox * 1.2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,196,106,${baseA + (isDark ? prox * 0.45 : prox * 0.12)})`;
        ctx.fill();
      }

      // ── Cursor glow ───────────────────────────────────────────────────
      if (hasMouse) {
        const grad = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 90);
        grad.addColorStop(0, `rgba(0,196,106,${isDark ? 0.07 : 0.025})`);
        grad.addColorStop(0.6, `rgba(0,196,106,${isDark ? 0.025 : 0.008})`);
        grad.addColorStop(1, 'rgba(0,196,106,0)');
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 90, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      }
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      clearTimeout(resizeTimer);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('visibilitychange', onVisibility);
      obs.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      aria-hidden="true"
    />
  );
}
