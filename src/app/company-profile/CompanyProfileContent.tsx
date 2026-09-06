'use client';

import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';

const PDFFlipBook = dynamic(() => import('@/components/ui/PDFFlipBook'), {
  ssr: false,
});

export default function CompanyProfileContent() {
  return (
    <main className="relative min-h-screen pt-24 pb-16">
      {/* Top gradient accent */}
      <div className="absolute top-0 left-0 right-0 h-80 bg-gradient-to-b from-accent/5 via-transparent to-transparent pointer-events-none" />

      <div className="w-full px-2 sm:px-4 lg:px-6 relative z-10">
        {/* FlipBook */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="flex justify-center"
        >
          <PDFFlipBook
            pdfUrl="/Profile-Akamco-2025.pdf"
            totalPages={19}
          />
        </motion.div>
      </div>

      {/* Bottom accent */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-accent/3 via-transparent to-transparent pointer-events-none" />
    </main>
  );
}
