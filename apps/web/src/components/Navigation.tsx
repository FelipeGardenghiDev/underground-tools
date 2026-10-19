'use client';

import React, { useRef } from 'react';
import { 
  Flame, 
  Sliders, 
  FileText, 
  CalendarDays, 
  ShoppingBag, 
  Printer, 
  Volume2,
  ListMusic,
  Compass,
  Download,
  Upload,
  Radio
} from 'lucide-react';

export type ActiveTab = 'manifesto' | 'stage_plot' | 'setlist' | 'guide' | 'epk' | 'gigs' | 'merch' | 'plugins';

interface NavigationProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onPrintRider: () => void;
  onExportBackup: () => void;
  onImportBackup: (file: File) => void;
  bandName: string;
}

export function Navigation({
  activeTab,
  setActiveTab,
  onPrintRider,
  onExportBackup,
  onImportBackup,
  bandName,
}: NavigationProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImportBackup(file);
      e.target.value = '';
    }
  };

  return (
    <header className="border-b-4 border-zinc-800 bg-[#080808] text-zinc-100 sticky top-0 z-50">
      {/* Top Tape Banner */}
      <div className="bg-yellow-400 text-black px-4 py-1 text-xs font-mono font-bold uppercase tracking-wider flex justify-between items-center overflow-x-auto whitespace-nowrap border-b-2 border-black">
        <div className="flex items-center gap-3">
          <span className="bg-black text-yellow-400 px-2 py-0.5 text-[10px] tracking-widest">
            DIY OR DIE
          </span>
          <span>UNDERGROUND TOOLS • CÓDIGO ABERTO • SEM PAYWALL • SEM IA GENÉRICA</span>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-[11px]">
          <span>⚡ PARA QUEM VIVE O CORRE DO PALCO</span>
          <span>⚡ AUTO-SAVE LOCAL</span>
        </div>
      </div>

      {/* Main Nav Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('manifesto')}>
          <div className="bg-rose-600 text-white p-2 border-2 border-black shadow-brutal flex items-center justify-center font-stencil text-2xl tracking-tighter">
            <Flame className="w-6 h-6 mr-1 fill-white" />
            UGT
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-stencil text-2xl md:text-3xl tracking-wider text-zinc-50 leading-none hover:text-rose-500 transition-colors">
                UNDERGROUND TOOLS
              </h1>
              <span className="text-[10px] font-mono bg-zinc-800 text-rose-400 px-1.5 py-0.5 border border-zinc-700">
                v0.2
              </span>
            </div>
            <p className="text-[11px] font-mono text-zinc-400 tracking-tight mt-0.5">
              Armas de palco & ferramentas para o corre da música independente
            </p>
          </div>
        </div>

        {/* Action Buttons: Backup & Print */}
        <div className="flex items-center gap-2">
          {/* Backup / Export File */}
          <button
            onClick={onExportBackup}
            className="flex items-center gap-1.5 bg-black hover:bg-zinc-800 text-zinc-300 hover:text-white font-mono text-xs px-2.5 py-1.5 border border-zinc-700 transition-colors"
            title="Baixar cópia de segurança (.ugt.json)"
          >
            <Download className="w-3.5 h-3.5 text-yellow-400" />
            <span className="hidden sm:inline">Salvar Backup</span>
          </button>

          {/* Import Backup */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 bg-black hover:bg-zinc-800 text-zinc-300 hover:text-white font-mono text-xs px-2.5 py-1.5 border border-zinc-700 transition-colors"
            title="Restaurar dados de um arquivo .ugt.json"
          >
            <Upload className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Restaurar</span>
          </button>

          {/* Print button (contextual) */}
          <button
            onClick={onPrintRider}
            className="flex items-center gap-1.5 bg-yellow-400 hover:bg-yellow-300 text-black font-mono font-bold text-xs uppercase px-3 py-1.5 border-2 border-black shadow-brutal active:scale-95 transition-all"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Imprimir A4 (PDF)</span>
          </button>

          <a
            href="https://github.com/FelipeGardenghiDev/underground-tools"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-mono text-xs px-3 py-2 border-2 border-zinc-700 shadow-brutal-sm hover:border-zinc-500 transition-colors"
          >
            <svg className="w-4 h-4 fill-current text-rose-500" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            <span className="hidden sm:inline">GitHub</span>
          </a>
        </div>
      </div>

      {/* Tabs Menu */}
      <nav className="border-t-2 border-zinc-800 bg-[#0d0d0f] px-4 overflow-x-auto">
        <div className="max-w-7xl mx-auto flex items-center space-x-1 sm:space-x-2 py-1.5">
          <button
            onClick={() => setActiveTab('manifesto')}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-mono font-bold uppercase transition-all whitespace-nowrap border-2 ${
              activeTab === 'manifesto'
                ? 'bg-zinc-100 text-black border-black shadow-brutal'
                : 'text-zinc-400 border-transparent hover:text-zinc-200 hover:bg-zinc-900'
            }`}
          >
            <Volume2 className="w-3.5 h-3.5" />
            01. Manifesto
          </button>

          <button
            onClick={() => setActiveTab('stage_plot')}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-mono font-bold uppercase transition-all whitespace-nowrap border-2 ${
              activeTab === 'stage_plot'
                ? 'bg-rose-600 text-white border-black shadow-brutal'
                : 'text-zinc-400 border-transparent hover:text-rose-400 hover:bg-zinc-900'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            02. Palco & Rider
          </button>

          <button
            onClick={() => setActiveTab('setlist')}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-mono font-bold uppercase transition-all whitespace-nowrap border-2 ${
              activeTab === 'setlist'
                ? 'bg-yellow-400 text-black border-black shadow-brutal'
                : 'text-zinc-400 border-transparent hover:text-yellow-400 hover:bg-zinc-900'
            }`}
          >
            <ListMusic className="w-3.5 h-3.5" />
            03. Setlist de Chão
          </button>

          <button
            onClick={() => setActiveTab('guide')}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-mono font-bold uppercase transition-all whitespace-nowrap border-2 ${
              activeTab === 'guide'
                ? 'bg-emerald-500 text-black border-black shadow-brutal'
                : 'text-zinc-400 border-transparent hover:text-emerald-400 hover:bg-zinc-900'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            04. Guia de Estrada (Palco PRO)
          </button>

          <button
            onClick={() => setActiveTab('epk')}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-mono font-bold uppercase transition-all whitespace-nowrap border-2 ${
              activeTab === 'epk'
                ? 'bg-zinc-100 text-black border-black shadow-brutal'
                : 'text-zinc-400 border-transparent hover:text-zinc-200 hover:bg-zinc-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            05. Press Kit (EPK)
          </button>

          <button
            onClick={() => setActiveTab('gigs')}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-mono font-bold uppercase transition-all whitespace-nowrap border-2 ${
              activeTab === 'gigs'
                ? 'bg-zinc-100 text-black border-black shadow-brutal'
                : 'text-zinc-400 border-transparent hover:text-zinc-200 hover:bg-zinc-900'
            }`}
          >
            <CalendarDays className="w-3.5 h-3.5" />
            06. Shows
          </button>

          <button
            onClick={() => setActiveTab('merch')}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-mono font-bold uppercase transition-all whitespace-nowrap border-2 ${
              activeTab === 'merch'
                ? 'bg-purple-600 text-white border-black shadow-brutal'
                : 'text-zinc-400 border-transparent hover:text-purple-400 hover:bg-zinc-900'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            07. Merch & Pix
          </button>

          <button
            onClick={() => setActiveTab('plugins')}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-mono font-bold uppercase transition-all whitespace-nowrap border-2 ${
              activeTab === 'plugins'
                ? 'bg-rose-600 text-white border-black shadow-brutal animate-pulse'
                : 'text-rose-400 border-rose-950/60 hover:text-white hover:bg-rose-950/30'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            08. Emo Audio Tools (VST3)
          </button>
        </div>
      </nav>
    </header>
  );
}
