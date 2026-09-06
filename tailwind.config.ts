import type { Config } from 'tailwindcss';
import typography from '@tailwindcss/typography';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: '#00C46A',
          light: '#33D084',
          dark: '#00A359',
          50: '#E6FFF2',
          100: '#B3FFD9',
          200: '#80FFC0',
          300: '#4DFFA7',
          400: '#1AFF8E',
          500: '#00C46A',
          600: '#00A359',
          700: '#008247',
          800: '#006136',
          900: '#004024',
        },
        dark: {
          bg: '#0B0F14',
          surface: '#111827',
          card: '#1A2332',
          border: '#1F2937',
          muted: '#D1D5DB',
          text: '#F9FAFB',
        },
        light: {
          bg: '#F5F7FA',
          surface: '#FFFFFF',
          card: '#FFFFFF',
          border: '#E5E7EB',
          muted: '#4B5563',
          text: '#111827',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        heading: ['var(--font-sora)', 'var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-gradient': 'linear-gradient(135deg, #0B0F14 0%, #111827 50%, #0B0F14 100%)',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(0, 196, 106, 0.15)',
        'glow-lg': '0 0 40px rgba(0, 196, 106, 0.2)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
        'card-dark': '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -2px rgba(0, 0, 0, 0.2)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'marquee': 'marquee 35s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      perspective: {
        '1000': '1000px',
        '2000': '2000px',
      },
    },
  },
  plugins: [
    function ({ addUtilities }: any) {
      addUtilities({
        '.perspective-1000': {
          perspective: '1000px',
        },
        '.perspective-2000': {
          perspective: '2000px',
        },
        '.preserve-3d': {
          transformStyle: 'preserve-3d',
        },
        '.backface-hidden': {
          backfaceVisibility: 'hidden',
        },
        '.rotate-y-180': {
          transform: 'rotateY(180deg)',
        },
        '.rotate-y-90': {
          transform: 'rotateY(90deg)',
        },
        '.rotate-y-270': {
          transform: 'rotateY(270deg)',
        },
        '.rotate-x-90': {
          transform: 'rotateX(90deg)',
        },
        '.rotate-x-270': {
          transform: 'rotateX(270deg)',
        },
        '.translate-z-24': {
          transform: 'translateZ(96px)',
        },
      });
    },
    typography,
  ],
};

export default config;
