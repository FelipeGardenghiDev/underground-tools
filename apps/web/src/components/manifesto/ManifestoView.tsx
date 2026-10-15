'use client';

import React from 'react';
import { ActiveTab } from '../Navigation';
import { 
  Flame, 
  Sliders, 
  FileText, 
  CalendarDays, 
  ShoppingBag, 
  CheckSquare, 
  Terminal, 
  ShieldCheck, 
  Zap,
  ArrowRight
} from 'lucide-react';

interface ManifestoViewProps {
  onSelectTab: (tab: ActiveTab) => void;
}

export function ManifestoView({ onSelectTab }: ManifestoViewProps) {
  return (
    <div className="space-y-10 font-mono">
      {/* Hero Zine Banner */}
      <div className="bg-[#0f0f12] border-4 border-zinc-800 p-6 md:p-10 shadow-brutal relative overflow-hidden">
        {/* Gritty Tape Sticker */}
        <div className="inline-block bg-yellow-400 text-black px-3 py-1 font-mono font-bold text-xs uppercase tracking-widest border border-black shadow-brutal-sm -rotate-1 mb-4">
          ★ CÓDIGO ABERTO • SEM FINS LUCRATIVOS • DIY OU MORRA ★
        </div>

        <h1 className="font-stencil text-4xl md:text-6xl text-white tracking-wider uppercase leading-none max-w-4xl">
          ARMAS DE PALCO & FERRAMENTAS PARA QUEM VIVE O UNDERGROUND
        </h1>

        <p className="text-zinc-300 text-sm md:text-base leading-relaxed mt-4 max-w-3xl">
          Bandas independentes não precisam de landing pages com gradientes roxos de IA ou plataformas que
          cobram mensalidade em dólar para atualizar uma data de show. O <strong className="text-rose-500">Underground Tools</strong> foi
          criado para dar profissionalismo de ponta ao corre independente: mapa de palco visual, input list para o técnico de som,
          press kit eletrônico e venda de merch sem intermediários.
        </p>

        {/* Action quick links */}
        <div className="flex flex-wrap gap-3 mt-6">
          <button
            onClick={() => onSelectTab('stage_plot')}
            className="bg-rose-600 hover:bg-rose-500 text-white font-mono font-bold text-xs uppercase px-5 py-3 border-2 border-black shadow-brutal flex items-center gap-2 transition-all active:scale-95"
          >
            <Sliders className="w-4 h-4" />
            Abrir Mapa de Palco & Rider Técnico
          </button>

          <button
            onClick={() => onSelectTab('epk')}
            className="bg-zinc-100 hover:bg-white text-black font-mono font-bold text-xs uppercase px-5 py-3 border-2 border-black shadow-brutal flex items-center gap-2 transition-all active:scale-95"
          >
            <FileText className="w-4 h-4" />
            Configurar Press Kit (EPK)
          </button>
        </div>
      </div>

      {/* 4 Pillars Grid */}
      <div>
        <div className="flex items-center gap-2 mb-4 border-b border-zinc-800 pb-2">
          <Terminal className="w-4 h-4 text-yellow-400" />
          <h2 className="font-stencil text-2xl text-white tracking-wide">
            O ARSENAL DO UNDERGROUND TOOLS
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1 */}
          <div
            onClick={() => onSelectTab('stage_plot')}
            className="cursor-pointer bg-zinc-950 border-2 border-zinc-800 hover:border-rose-500 p-5 shadow-brutal transition-all flex flex-col justify-between group"
          >
            <div className="space-y-2">
              <div className="w-10 h-10 bg-rose-950 border border-rose-500 text-rose-400 flex items-center justify-center font-stencil text-xl">
                01
              </div>
              <h3 className="font-stencil text-xl text-white group-hover:text-rose-400 transition-colors">
                MAPA DE PALCO & RIDER
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Posicionamento visual da bateria, amps, mics e tomadas. Geração de Input List completa com
                exportação para PDF A4 limpo para o técnico de som da casa.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs text-rose-400 font-bold">
              <span>Construir Rider</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2 */}
          <div
            onClick={() => onSelectTab('epk')}
            className="cursor-pointer bg-zinc-950 border-2 border-zinc-800 hover:border-yellow-400 p-5 shadow-brutal transition-all flex flex-col justify-between group"
          >
            <div className="space-y-2">
              <div className="w-10 h-10 bg-yellow-950 border border-yellow-500 text-yellow-400 flex items-center justify-center font-stencil text-xl">
                02
              </div>
              <h3 className="font-stencil text-xl text-white group-hover:text-yellow-400 transition-colors">
                PRESS KIT (EPK)
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Página pública com bio curta para cartazes, release para zines e curadorias de festivais,
                e fotos promocionais em 300 DPI prontas para download.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs text-yellow-400 font-bold">
              <span>Montar EPK</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3 */}
          <div
            onClick={() => onSelectTab('gigs')}
            className="cursor-pointer bg-zinc-950 border-2 border-zinc-800 hover:border-zinc-300 p-5 shadow-brutal transition-all flex flex-col justify-between group"
          >
            <div className="space-y-2">
              <div className="w-10 h-10 bg-zinc-900 border border-zinc-600 text-zinc-300 flex items-center justify-center font-stencil text-xl">
                03
              </div>
              <h3 className="font-stencil text-xl text-white group-hover:text-zinc-200 transition-colors">
                AGENDA DE SHOWS
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Controle de datas, horários de portas, links de ingressos (Sympla, Shotgun etc.), localização no
                Maps e controle de shows esgotados.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-300 font-bold">
              <span>Gerenciar Tour</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 4 */}
          <div
            onClick={() => onSelectTab('merch')}
            className="cursor-pointer bg-zinc-950 border-2 border-zinc-800 hover:border-emerald-500 p-5 shadow-brutal transition-all flex flex-col justify-between group"
          >
            <div className="space-y-2">
              <div className="w-10 h-10 bg-emerald-950 border border-emerald-500 text-emerald-400 flex items-center justify-center font-stencil text-xl">
                04
              </div>
              <h3 className="font-stencil text-xl text-white group-hover:text-emerald-400 transition-colors">
                MERCH & PIX DIRETO
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Vitrine de camisetas, fitas K7, vinil e patches com geração de Pix e pedido direto no WhatsApp da
                banda. Sem comissão para plataformas gringas.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs text-emerald-400 font-bold">
              <span>Abrir Vitrine</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* Manifesto & Philosophy section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-zinc-900 border-2 border-zinc-800 p-6 shadow-brutal space-y-4">
          <div className="flex items-center gap-2 border-b border-zinc-800 pb-2">
            <Flame className="w-5 h-5 text-rose-500" />
            <h3 className="font-stencil text-2xl text-white tracking-wide">
              O MANIFESTO: POR QUE FAZEMOS ISSO?
            </h3>
          </div>

          <div className="text-xs text-zinc-300 leading-relaxed space-y-3 font-mono">
            <p>
              Tocar em banda independente no Brasil é um desafio hercúleo: dividir van, carregar amplificador pesado na chuva,
              dormir em chão de sala e lidar com operadores de som que não sabem o que fazer quando a banda sobe no palco.
            </p>
            <p>
              Uma banda com um <strong>Rider Técnico bem desenhado</strong>, uma <strong>Input List sem ruído</strong> e um{' '}
              <strong>Press Kit direto ao ponto</strong> é atendida com respeito pela casa de show, passa o som em 20 minutos e
              faz a apresentação com a intensidade que a música merece.
            </p>
            <p className="bg-black/60 p-3 border-l-4 border-yellow-400 text-zinc-200">
              "A tecnologia deve servir para fortalecer as bandas e as pessoas que constroem a cultura de baixo para cima,
              não para encher os bolsos de plataformas intermediárias com taxas predatórias."
            </p>
          </div>

          {/* Architecture Box */}
          <div className="border border-zinc-700 bg-black p-4 space-y-2 text-xs">
            <span className="text-[10px] font-bold text-yellow-400 uppercase tracking-widest block">
              ARQUITETURA DE CUSTO ZERO (STACK SUGERIDA)
            </span>
            <ul className="space-y-1.5 text-zinc-400">
              <li>• <strong>Frontend:</strong> Next.js App Router no plano Hobby da Vercel (R$ 0).</li>
              <li>• <strong>Banco de Dados & Auth:</strong> Supabase PostgreSQL (R$ 0 no Free Tier).</li>
              <li>• <strong>Mídia & Fotos:</strong> Supabase Storage de 1GB gratuito (R$ 0).</li>
              <li>• <strong>Domínio:</strong> Registro.br .art.br ou .com.br (~R$ 40/ano para toda a plataforma).</li>
            </ul>
          </div>
        </div>

        {/* Checklist de Respeito no Palco */}
        <div className="bg-[#121214] border-2 border-zinc-800 p-6 shadow-brutal space-y-4">
          <div className="flex items-center gap-2 border-b border-zinc-800 pb-2">
            <CheckSquare className="w-5 h-5 text-yellow-400" />
            <h3 className="font-stencil text-xl text-white">CHECKLIST DE ESTRADA</h3>
          </div>

          <div className="space-y-2.5 text-xs text-zinc-300">
            <div className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">✓</span>
              <span>Input List entregue impressa ou enviada 48h antes</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">✓</span>
              <span>Identificação de canais que necessitam +48V Phantom</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">✓</span>
              <span>Tomadas de energia (AC) mapeadas nas pedaleiras</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">✓</span>
              <span>Contato de emergência do responsável de produção</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">✓</span>
              <span>QR Code Pix visível na banca de merch no show</span>
            </div>
          </div>

          {/* GitHub Open-Source Pill */}
          <div className="pt-4 border-t border-zinc-800 space-y-2">
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest block">
              PARTICIPE DO DESENVOLVIMENTO
            </span>
            <a
              href="https://github.com/FelipeGardenghiDev/underground-tools"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs py-2 px-3 border border-zinc-700 flex items-center justify-center gap-2 transition-colors"
            >
              <svg className="w-4 h-4 fill-current text-rose-500" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              Repositório Aberto no GitHub
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
