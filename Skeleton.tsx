// src/app/layout.tsx
import type { Metadata, Viewport } from 'next';
import { Barlow_Condensed, Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const displayFont = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-display',
  display: 'swap',
});

const bodyFont = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-body',
  display: 'swap',
});

const monoFont = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'KustVåg – Surfprognos Halland & Skåne',
  description: 'Realtidsprognos för surf och kustväder vid Hallands och Skånes bästa spotar. Vågdata, vindprognos och tidvatten.',
  manifest: '/manifest.json',
  keywords: ['surf', 'surfprognos', 'Halland', 'Skåne', 'Apelviken', 'Tylösand', 'Mölle', 'vågprognos'],
  authors: [{ name: 'KustVåg' }],
  openGraph: {
    title: 'KustVåg – Surfprognos Halland & Skåne',
    description: 'Realtidsprognos för surf och kustväder',
    type: 'website',
    locale: 'sv_SE',
  },
  twitter: { card: 'summary_large_image' },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'KustVåg',
  },
  icons: {
    icon: '/icons/icon-192.png',
    apple: '/icons/apple-touch-icon.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#000f1a',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sv" className={`dark ${displayFont.variable} ${bodyFont.variable} ${monoFont.variable}`}>
      <head>
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </head>
      <body className="font-body bg-depth-950 text-white antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
