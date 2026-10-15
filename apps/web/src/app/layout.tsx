import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Underground Tools // Armas de Palco & Ferramentas DIY para Bandas',
  description:
    'Plataforma open-source comunitária para bandas independentes: Mapa de Palco interativo, Input List, Rider Técnico em PDF (A4), Press Kit (EPK) e Merch no Pix.',
  keywords: ['underground', 'bandas', 'hardcore', 'emo', 'stage plot', 'tech rider', 'input list', 'epk', 'diy'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="h-full bg-[#080808]">
      <body className="min-h-full flex flex-col bg-[#080808] text-zinc-100 antialiased selection:bg-rose-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
