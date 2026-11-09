import type { Metadata, Viewport } from 'next';
import { Bebas_Neue, Space_Mono } from 'next/font/google';
import './globals.css';
import { PwaRegistrar } from '@/components/pwa/PwaRegistrar';

const bebas = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas',
  display: 'swap',
});

const spaceMono = Space_Mono({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-space-mono',
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#080808',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: 'Underground Tools // Armas de Palco & Ferramentas DIY para Bandas',
  description:
    'Plataforma open-source comunitária para bandas independentes: Mapa de Palco interativo, Input List, Rider Técnico em PDF (A4), Setlist de Chão de Palco, Press Kit (EPK), Guia de Estrada e Merch no Pix.',
  keywords: ['underground', 'bandas', 'hardcore', 'emo', 'stage plot', 'tech rider', 'input list', 'epk', 'diy', 'setlist'],
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/icons/icon-192.svg', sizes: '192x192', type: 'image/svg+xml' },
      { url: '/icons/icon-512.svg', sizes: '512x512', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/icons/icon-192.svg' },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Underground Tools',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`h-full bg-[#080808] ${bebas.variable} ${spaceMono.variable}`}>
      <body className="min-h-full flex flex-col bg-[#080808] text-zinc-100 antialiased selection:bg-rose-600 selection:text-white font-mono">
        <PwaRegistrar />
        {children}
      </body>
    </html>
  );
}
