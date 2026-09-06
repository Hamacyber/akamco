'use client';

import Image from 'next/image';
import { useTheme } from '@/lib/theme';

interface AkamcoLogoProps {
  className?: string;
  /** Height in pixels — width scales proportionally */
  height?: number;
  /** Variant: 'full' shows "Akamco TECHNOLOGIES", 'icon' shows just the green bar */
  variant?: 'full' | 'icon';
}

/**
 * Akamco Technologies logo using actual brand SVG files.
 *
 * Logo files in /public/images/:
 *   - dark-logo.svg  → dark text version (shown on light backgrounds)
 *   - light-logo.svg → white text version (shown on dark backgrounds)
 *   - logo-icon.png  → green bar icon only (favicon / small usage)
 */
export function AkamcoLogo({
  className = '',
  height = 32,
  variant = 'full',
}: AkamcoLogoProps) {
  const { theme } = useTheme();

  if (variant === 'icon') {
    return (
      <Image
        src="/images/logo-icon.png"
        alt="Akamco"
        width={Math.round(height * 0.4)}
        height={height}
        className={className}
        priority
      />
    );
  }

  // Aspect ratio of the full logo is roughly 2.2:1
  const width = Math.round(height * 2.2);

  return (
    <span className={`inline-flex items-center ${className}`}>
      {/* Light mode: dark text logo */}
      <Image
        src="/images/dark-logo.svg"
        alt="Akamco Technologies"
        width={width}
        height={height}
        className={`dark:hidden ${className}`}
        priority
        style={{ height: `${height}px`, width: 'auto' }}
      />
      {/* Dark mode: white text logo */}
      <Image
        src="/images/light-logo.svg"
        alt="Akamco Technologies"
        width={width}
        height={height}
        className={`hidden dark:block ${className}`}
        priority
        style={{ height: `${height}px`, width: 'auto' }}
      />
    </span>
  );
}
