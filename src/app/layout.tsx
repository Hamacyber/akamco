import type { Metadata, Viewport } from 'next';
import { headers } from 'next/headers';
import { Inter, Sora } from 'next/font/google';
import { ThemeProvider } from '@/lib/theme';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ParticleBackground } from '@/components/ui/ParticleBackground';
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL, SITE_OG_IMAGE } from '@/lib/constants';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-sora',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Engineering Secure Digital Infrastructure`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    'cybersecurity',
    'IT infrastructure',
    'government IT',
    'data center',
    'SOC',
    'penetration testing',
    'AI security',
    'enterprise security',
    'network infrastructure',
    'cloud architecture',
    'VAPT',
    'managed security services',
  ],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Engineering Secure Digital Infrastructure`,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: SITE_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: SITE_NAME,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} — Engineering Secure Digital Infrastructure`,
    description: SITE_DESCRIPTION,
    images: [SITE_OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/images/logo-dark.png',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = headers().get('x-pathname') ?? '';
  const isAdmin = pathname.startsWith('/admin') || pathname === '/admin/login';

  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/images/logo-dark.png" />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('akamco-theme');if(t==='light'){document.documentElement.classList.remove('dark')}else{document.documentElement.classList.add('dark')}}catch(e){}})()`
          }}
        />
        {/* Organization JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: SITE_NAME,
              url: SITE_URL,
              logo: `${SITE_URL}/images/og-image.png`,
              description: SITE_DESCRIPTION,
              sameAs: [],
              contactPoint: {
                '@type': 'ContactPoint',
                contactType: 'customer support',
                url: `${SITE_URL}/contact`,
              },
            }),
          }}
        />
        {/* WebSite JSON-LD (enables Google Sitelinks Searchbox) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: SITE_NAME,
              url: SITE_URL,
              potentialAction: {
                '@type': 'SearchAction',
                target: { '@type': 'EntryPoint', urlTemplate: `${SITE_URL}/blog?search={search_term_string}` },
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />
      </head>
      <body className={`${inter.variable} ${sora.variable} font-sans antialiased`}>
        <ThemeProvider>
          {isAdmin ? (
            // Admin: no navbar, footer, or particle — the admin layout handles its own shell
            <>{children}</>
          ) : (
            <>
              <ParticleBackground />
              <div className="relative z-10 flex min-h-screen flex-col">
                <Navbar />
                <main className="flex-1">{children}</main>
                <Footer />
              </div>
            </>
          )}
        </ThemeProvider>
      </body>
    </html>
  );
}
