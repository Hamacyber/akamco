'use client';

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from 'react';
import HTMLFlipBook from 'react-pageflip';
import { motion, AnimatePresence } from 'framer-motion';

/* ─── PDF.js dynamic import (client-only) ─────────────────────── */
let pdfjsLib: typeof import('pdfjs-dist') | null = null;

async function getPdfJs() {
  if (pdfjsLib) return pdfjsLib;
  const lib = await import('pdfjs-dist');
  lib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${lib.version}/pdf.worker.min.mjs`;
  pdfjsLib = lib;
  return lib;
}

/* ─── Types ───────────────────────────────────────────────────── */
interface PDFFlipBookProps {
  pdfUrl: string;
  totalPages?: number;
}

interface PageProps {
  pageImage: string;
  pageNumber: number;
  totalPages: number;
}

/* ─── Single Page (forwardRef needed by react-pageflip) ───────── */
const Page = forwardRef<HTMLDivElement, PageProps>(
  ({ pageImage, pageNumber, totalPages }, ref) => (
    <div
      ref={ref}
      className="relative w-full h-full bg-white shadow-lg overflow-hidden"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={pageImage}
        alt={`Page ${pageNumber}`}
        className="absolute inset-0 w-full h-full object-contain"
        draggable={false}
      />
      {/* Page number */}
      <div className="absolute bottom-2 left-0 right-0 text-center">
        <span className="text-[10px] text-gray-400 font-medium tracking-wide">
          {pageNumber} / {totalPages}
        </span>
      </div>
    </div>
  ),
);
Page.displayName = 'Page';

/* ─── Cover (first / last) ────────────────────────────────────── */
const CoverPage = forwardRef<HTMLDivElement, PageProps>(
  ({ pageImage, pageNumber, totalPages }, ref) => (
    <div
      ref={ref}
      className="relative w-full h-full bg-gradient-to-br from-gray-900 to-gray-800 shadow-2xl overflow-hidden rounded-sm"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={pageImage}
        alt={`Page ${pageNumber}`}
        className="absolute inset-0 w-full h-full object-contain"
        draggable={false}
      />
    </div>
  ),
);
CoverPage.displayName = 'CoverPage';

/* ─── Loading Cover ───────────────────────────────────────────── */
const LoadingPage = forwardRef<HTMLDivElement, { label: string }>(
  ({ label }, ref) => (
    <div
      ref={ref}
      className="relative w-full h-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center"
    >
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
      </div>
    </div>
  ),
);
LoadingPage.displayName = 'LoadingPage';

/* ─── Main FlipBook Component ─────────────────────────────────── */
export default function PDFFlipBook({ pdfUrl, totalPages: hintPages }: PDFFlipBookProps) {
  const [pages, setPages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(hintPages ?? 0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const flipBookRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 550, height: 778 });

  /* ── Responsive sizing ──────────────────────────────────────── */
  const calcDimensions = useCallback(() => {
    const maxW = isFullscreen
      ? Math.min(window.innerWidth * 0.45, 800)
      : Math.min(window.innerWidth * 0.44, 650);
    const maxH = isFullscreen
      ? window.innerHeight * 0.88
      : Math.min(window.innerHeight * 0.82, 920);
    // A4 aspect ≈ 1 : 1.414
    let w = maxW;
    let h = w * 1.414;
    if (h > maxH) {
      h = maxH;
      w = h / 1.414;
    }
    // Minimum sizes for mobile
    if (w < 280) { w = 280; h = w * 1.414; }
    setDimensions({ width: Math.round(w), height: Math.round(h) });
  }, [isFullscreen]);

  useEffect(() => {
    calcDimensions();
    const handler = () => calcDimensions();
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, [calcDimensions]);

  /* ── Load PDF ───────────────────────────────────────────────── */
  useEffect(() => {
    let cancelled = false;

    async function loadPdf() {
      try {
        setLoading(true);
        setError(null);
        const pdfjs = await getPdfJs();
        const pdf = await pdfjs.getDocument(pdfUrl).promise;
        const numPages = pdf.numPages;
        if (cancelled) return;
        setTotalPages(numPages);

        const rendered: string[] = [];
        const scale = 2; // hi-res

        for (let i = 1; i <= numPages; i++) {
          if (cancelled) return;
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale });
          const canvas = document.createElement('canvas');
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          const ctx = canvas.getContext('2d')!;
          await page.render({ canvasContext: ctx, viewport }).promise;
          rendered.push(canvas.toDataURL('image/jpeg', 0.92));
        }

        if (!cancelled) {
          setPages(rendered);
          setLoading(false);
        }
      } catch (err: any) {
        if (!cancelled) {
          setError(err?.message || 'Failed to load PDF');
          setLoading(false);
        }
      }
    }

    loadPdf();
    return () => { cancelled = true; };
  }, [pdfUrl]);

  /* ── Navigation helpers ─────────────────────────────────────── */
  const flipPrev = () => flipBookRef.current?.pageFlip()?.flipPrev();
  const flipNext = () => flipBookRef.current?.pageFlip()?.flipNext();
  const onFlip = (e: any) => setCurrentPage(e.data);

  /* ── Fullscreen ─────────────────────────────────────────────── */
  const toggleFullscreen = async () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      await containerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      await document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  /* ── Keyboard navigation ────────────────────────────────────── */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') flipPrev();
      if (e.key === 'ArrowRight') flipNext();
      if (e.key === 'Escape' && isFullscreen) document.exitFullscreen();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isFullscreen]);

  /* ── Render ─────────────────────────────────────────────────── */
  return (
    <div
      ref={containerRef}
      className={`flex flex-col items-center justify-center gap-6 ${
        isFullscreen
          ? 'bg-gray-950 p-6 h-screen'
          : ''
      }`}
    >
      {/* Book container */}
      <div className="relative">
        {/* Decorative shadow under the book */}
        <div
          className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[80%] h-8 bg-black/20 dark:bg-black/40 rounded-[50%] blur-xl pointer-events-none"
          aria-hidden
        />

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center gap-4"
              style={{ width: dimensions.width * 2, height: dimensions.height }}
            >
              <div className="relative w-20 h-20">
                <div className="absolute inset-0 rounded-full border-4 border-accent/20" />
                <div className="absolute inset-0 rounded-full border-4 border-accent border-t-transparent animate-spin" />
                <svg
                  className="absolute inset-0 m-auto w-8 h-8 text-accent"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                  Loading Company Profile
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Preparing {hintPages || ''} pages...
                </p>
              </div>
            </motion.div>
          ) : error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center gap-3 py-20"
            >
              <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
                <svg className="w-7 h-7 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <p className="text-red-600 dark:text-red-400 font-medium">{error}</p>
            </motion.div>
          ) : (
            <motion.div
              key="book"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              {/* @ts-ignore - react-pageflip types */}
              <HTMLFlipBook
                ref={flipBookRef}
                width={dimensions.width}
                height={dimensions.height}
                size="fixed"
                minWidth={280}
                maxWidth={800}
                minHeight={396}
                maxHeight={1130}
                maxShadowOpacity={0.5}
                showCover={true}
                mobileScrollSupport={true}
                onFlip={onFlip}
                className="flipbook-shadow"
                style={{}} 
                startPage={0}
                drawShadow={true}
                flippingTime={1200}
                usePortrait={false}
                startZIndex={0}
                autoSize={false}
                clickEventForward={true}
                useMouseEvents={true}
                swipeDistance={20}
                showPageCorners={true}
                disableFlipByClick={false}
              >
                {pages.map((img, idx) => {
                  const Comp = idx === 0 || idx === pages.length - 1 ? CoverPage : Page;
                  return (
                    <Comp
                      key={idx}
                      pageImage={img}
                      pageNumber={idx + 1}
                      totalPages={totalPages}
                    />
                  );
                })}
              </HTMLFlipBook>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Controls */}
      {!loading && !error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-3 flex-wrap justify-center"
        >
          {/* Prev */}
          <button
            onClick={flipPrev}
            disabled={currentPage <= 0}
            className="group relative p-3 rounded-xl bg-white/80 dark:bg-white/10 border border-gray-200 dark:border-white/10 backdrop-blur-sm hover:bg-accent/10 hover:border-accent/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
            aria-label="Previous page"
          >
            <svg className="w-5 h-5 text-gray-700 dark:text-gray-200 group-hover:text-accent transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Page indicator */}
          <div className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/80 dark:bg-white/10 border border-gray-200 dark:border-white/10 backdrop-blur-sm shadow-sm">
            <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-200 tabular-nums">
              {currentPage + 1} – {Math.min(currentPage + 2, totalPages)}
            </span>
            <span className="text-xs text-gray-400 dark:text-gray-500">
              of {totalPages}
            </span>
          </div>

          {/* Next */}
          <button
            onClick={flipNext}
            disabled={currentPage >= totalPages - 1}
            className="group relative p-3 rounded-xl bg-white/80 dark:bg-white/10 border border-gray-200 dark:border-white/10 backdrop-blur-sm hover:bg-accent/10 hover:border-accent/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
            aria-label="Next page"
          >
            <svg className="w-5 h-5 text-gray-700 dark:text-gray-200 group-hover:text-accent transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Divider */}
          <div className="w-px h-8 bg-gray-200 dark:bg-white/10 mx-1" />

          {/* Fullscreen */}
          <button
            onClick={toggleFullscreen}
            className="group p-3 rounded-xl bg-white/80 dark:bg-white/10 border border-gray-200 dark:border-white/10 backdrop-blur-sm hover:bg-accent/10 hover:border-accent/30 transition-all duration-200 shadow-sm"
            aria-label={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? (
              <svg className="w-5 h-5 text-gray-700 dark:text-gray-200 group-hover:text-accent transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-gray-700 dark:text-gray-200 group-hover:text-accent transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
              </svg>
            )}
          </button>

          {/* Download */}
          <a
            href={pdfUrl}
            download
            className="group flex items-center gap-2 px-4 py-2.5 rounded-xl bg-accent text-white font-semibold text-sm hover:bg-accent-600 transition-all duration-200 shadow-sm shadow-accent/25"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download PDF
          </a>
        </motion.div>
      )}
    </div>
  );
}
