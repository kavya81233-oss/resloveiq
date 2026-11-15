import type { Metadata, Viewport } from 'next';
import { Inter, Space_Grotesk, Noto_Sans_Kannada, JetBrains_Mono } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import '@/app/globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

const notoSansKannada = Noto_Sans_Kannada({
  subsets: ['kannada'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-noto-kannada',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#060B16',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://resolveiq.gov.in'),
  title: 'ResolveIQ — Kannada-First Agentic AI Complaint Management System',
  description:
    'Every complaint is a promise. We prove it was kept. Autonomous municipal complaint triage, incident clustering, and verified closure loop in Kannada, Kanglish, English, and Hindi.',
  keywords: [
    'ResolveIQ',
    'Civic Tech',
    'Kannada AI',
    'Kanglish NLP',
    'Municipal Complaint Resolution',
    'Incident Clustering',
    'Verified Closure Loop',
    'Bengaluru Civic Grievance',
  ],
  authors: [{ name: 'ResolveIQ Team' }],
  openGraph: {
    title: 'ResolveIQ — Every complaint is a promise. We prove it was kept.',
    description: 'Kannada-first agentic civic resolution assistant with incident clustering and verified closure loop.',
    url: 'https://resolveiq.gov.in',
    siteName: 'ResolveIQ',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ResolveIQ — Civic Intelligence System',
    description: 'Autonomous incident clustering and citizen-verified complaint resolution in Kannada and Kanglish.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  let messages;
  try {
    messages = (await import(`../../../messages/${locale}.json`)).default;
  } catch (error) {
    notFound();
  }

  // JSON-LD structured data for civic SoftwareApplication
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'ResolveIQ',
    operatingSystem: 'Web, Telegram',
    applicationCategory: 'GovernmentApplication',
    description:
      'Kannada-first agentic AI complaint management and resolution system with cross-script clustering and citizen-verified closure.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'INR',
    },
    inLanguage: ['kn', 'en', 'hi'],
  };

  return (
    <html lang={locale} className="dark" suppressHydrationWarning>
      <head>
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} ${notoSansKannada.variable} ${jetbrainsMono.variable} font-sans antialiased bg-bg text-text selection:bg-primary selection:text-bg`}
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-50 px-4 py-2 bg-primary text-bg font-semibold rounded-lg shadow-lg focus:outline-none"
        >
          Skip to main content
        </a>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <div id="main-content" className="relative min-h-screen flex flex-col">
            {children}
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

