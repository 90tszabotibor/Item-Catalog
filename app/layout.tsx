import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import './catalog.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://item-catalog.vercel.app'),
  title: 'Faerûn árusai és mágikus tárgyai',
  description: 'A kampány árusainak és mágikus tárgyainak játékosi katalógusa.',
  openGraph: {
    title: 'Faerûn árusai és mágikus tárgyai',
    description: 'Árusok és mágikus tárgyak · Játékosi kiadás · 1502 DR',
    images: [{ url: '/og.png', width: 1733, height: 909, alt: 'Faerûn árusai és mágikus tárgyai' }],
    locale: 'hu_HU',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Faerûn árusai és mágikus tárgyai',
    description: 'Árusok és mágikus tárgyak · Játékosi kiadás · 1502 DR',
    images: ['/og.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hu">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
