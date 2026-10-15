import type { Metadata } from 'next';
import { Bebas_Neue, Space_Mono } from 'next/font/google';
import './globals.css';

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

export const metadata: Metadata = {
  title: 'Underground Tools // Armas de Palco & Ferramentas DIY para Bandas',
  description:
    'Plataforma open-source comunitária para bandas independentes: Mapa de Palco interativo, Input List, Rider Técnico em PDF (A4), Setlist de Chão de Palco, Press Kit (EPK), Guia de Estrada e Merch no Pix.',
  keywords: ['underground', 'bandas', 'hardcore', 'emo', 'stage plot', 'tech rider', 'input list', 'epk', 'diy', 'setlist'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`h-full bg-[#080808] ${bebas.variable} ${spaceMono.variable}`}>
      <body className="min-h-full flex flex-col bg-[#080808] text-zinc-100 antialiased selection:bg-rose-600 selection:text-white font-mono">
        {children}
      </body>
    </html>
  );
}
