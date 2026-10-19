'use client';

import React, { useState } from 'react';
import { 
  Volume2, 
  Download, 
  ExternalLink, 
  ShieldCheck, 
  CheckCircle2, 
  Sliders, 
  Radio, 
  Disc, 
  Mic2, 
  Flame, 
  Music,
  Terminal,
  Layers,
  Sparkles
} from 'lucide-react';

export function EmoPluginsView() {
  const [activePluginTab, setActivePluginTab] = useState<'midwest-amp' | 'cry-tune'>('midwest-amp');

  // Estado do simulador interativo do MidwestAmp
  const [selectedChannel, setSelectedChannel] = useState<'clean' | 'crunch' | 'lead'>('clean');
  const [selectedCab, setSelectedCab] = useState<'2x12' | 'greenback' | 'v30'>('2x12');
  const [driveVal, setDriveVal] = useState(35);
  const [bassVal, setBassVal] = useState(50);
  const [midVal, setMidVal] = useState(60);
  const [trebleVal, setTrebleVal] = useState(70);
  const [presenceVal, setPresenceVal] = useState(55);
  const [brightActive, setBrightActive] = useState(true);

  // Estado do simulador interativo do CryTune
  const [cryScale, setCryScale] = useState<'midwest-e' | 'chromatic' | 'd-minor' | 'pentatonic'>('midwest-e');
  const [retuneSpeed, setRetuneSpeed] = useState(20);
  const [airPresence, setAirPresence] = useState(4.5);
  const [selectedNote, setSelectedNote] = useState('E4 (335 Hz detuned)');


  return (
    <div className="space-y-10 font-mono">
      {/* Hero Zine Banner */}
      <div className="bg-[#0f0f12] border-4 border-zinc-800 p-6 md:p-10 shadow-brutal relative overflow-hidden">
        {/* Fita Adesiva Emo Tape */}
        <div className="inline-block bg-rose-600 text-white px-3 py-1 font-mono font-bold text-xs uppercase tracking-widest border border-black shadow-brutal-sm -rotate-1 mb-4">
          ★ VST3 & CLAP OPEN-SOURCE • SEM iLOK • SEM ASSINATURA • DIY OU MORRA ★
        </div>

        <h1 className="font-stencil text-4xl md:text-6xl text-white tracking-wider uppercase leading-none max-w-4xl">
          EMO AUDIO TOOLS // SUÍTE DE PLUGINS INDEPENDENTES
        </h1>

        <p className="text-zinc-300 text-sm md:text-base leading-relaxed mt-4 max-w-3xl">
          Esqueça instaladores de 10 GB, serviços de telemetria rodando em segundo plano e dongles antipirataria.
          A <strong className="text-rose-500">Emo Audio Tools</strong> é a suíte de 5 ferramentas essenciais de mixagem e gravação
          do Underground Tools, calibrada para a sonoridade <strong className="text-white">Midwest Emo, Screamo, 2000s Pop-Punk e Post-Hardcore</strong>.
        </p>

        {/* Badges de Filosofia */}
        <div className="flex flex-wrap gap-2 pt-4">
          <span className="bg-black text-yellow-400 text-xs px-2.5 py-1 border border-zinc-700 flex items-center gap-1.5 font-bold">
            <ShieldCheck className="w-3.5 h-3.5" /> 100% CÓDIGO ABERTO (MIT)
          </span>
          <span className="bg-black text-rose-400 text-xs px-2.5 py-1 border border-zinc-700 flex items-center gap-1.5 font-bold">
            <Radio className="w-3.5 h-3.5" /> ZERO TELEMETRIA
          </span>
          <span className="bg-black text-emerald-400 text-xs px-2.5 py-1 border border-zinc-700 flex items-center gap-1.5 font-bold">
            <CheckCircle2 className="w-3.5 h-3.5" /> COMPATÍVEL COM QUALQUER DAW
          </span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SELETOR DE PLUGIN INTERATIVO                                              */}
      {/* ========================================================================= */}
      <div className="flex border-b-4 border-black gap-2">
        <button
          onClick={() => setActivePluginTab('midwest-amp')}
          className={`px-5 py-2.5 text-xs font-bold uppercase tracking-wider border-t-4 border-x-4 border-black transition-all ${
            activePluginTab === 'midwest-amp'
              ? 'bg-[#121217] text-yellow-400 border-b-0 -mb-1 shadow-brutal-sm'
              : 'bg-zinc-900 text-zinc-400 hover:text-white border-zinc-800'
          }`}
        >
          🎸 01. MidwestAmp (Tube Amp &amp; IR)
        </button>
        <button
          onClick={() => setActivePluginTab('cry-tune')}
          className={`px-5 py-2.5 text-xs font-bold uppercase tracking-wider border-t-4 border-x-4 border-black transition-all ${
            activePluginTab === 'cry-tune'
              ? 'bg-[#121217] text-rose-500 border-b-0 -mb-1 shadow-brutal-sm'
              : 'bg-zinc-900 text-zinc-400 hover:text-white border-zinc-800'
          }`}
        >
          🎙️ 02. CryTune (Vocal Pitch &amp; Air)
        </button>
      </div>

      {/* ========================================================================= */}
      {/* PAINEL ATIVO: MIDWESTAMP OU CRYTUNE                                      */}
      {/* ========================================================================= */}
      {activePluginTab === 'midwest-amp' ? (
        <div className="bg-[#121217] border-4 border-black p-6 md:p-8 shadow-brutal relative">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b-2 border-zinc-800 pb-4 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-yellow-400 text-black px-2 py-0.5 text-xs font-bold uppercase">
                  FLAGSHIP 01
                </span>
                <h2 className="font-stencil text-3xl md:text-4xl text-zinc-50 tracking-wider">
                  MIDWESTAMP // TUBE AMP &amp; CAB IR
                </h2>
              </div>
              <p className="text-xs text-zinc-400 mt-1">
                Simulador valvulado de guitarra e baixo focado em afinações abertas, crunch dinâmico e distorção massiva dos anos 2000.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <a
                href="https://github.com/FelipeGardenghiDev/underground-tools/tree/main/plugins/midwest-amp"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold px-4 py-2 border-2 border-black shadow-brutal flex items-center gap-1.5 transition-all"
              >
                <ExternalLink className="w-3.5 h-3.5" /> Código C++ no GitHub
              </a>
            </div>
          </div>

          {/* Chassis Frontal do Amplificador (Simulador Interativo) */}
          <div className="bg-[#1a1a22] border-4 border-zinc-950 p-6 shadow-inner rounded-sm relative overflow-hidden">
            {/* Tolex Texture Accent */}
            <div className="border-b-2 border-zinc-800 pb-4 mb-6 flex flex-wrap justify-between items-center gap-4">
              {/* Seletor de Canal */}
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-zinc-400 uppercase font-bold">CANAL:</span>
                <div className="flex bg-black border-2 border-zinc-800 p-1">
                  <button
                    onClick={() => { setSelectedChannel('clean'); setDriveVal(25); }}
                    className={`px-3 py-1 text-xs font-bold uppercase transition-all ${
                      selectedChannel === 'clean' ? 'bg-yellow-400 text-black' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    1. Kinsella Clean
                  </button>
                  <button
                    onClick={() => { setSelectedChannel('crunch'); setDriveVal(55); }}
                    className={`px-3 py-1 text-xs font-bold uppercase transition-all ${
                      selectedChannel === 'crunch' ? 'bg-rose-600 text-white' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    2. Emo 90s Crunch
                  </button>
                  <button
                    onClick={() => { setSelectedChannel('lead'); setDriveVal(90); }}
                    className={`px-3 py-1 text-xs font-bold uppercase transition-all ${
                      selectedChannel === 'lead' ? 'bg-purple-600 text-white' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    3. Black Parade Wall
                  </button>
                </div>
              </div>

              {/* Chave Bright */}
              <button
                onClick={() => setBrightActive(!brightActive)}
                className={`px-3 py-1 text-xs font-bold border-2 border-black shadow-brutal-sm uppercase transition-all ${
                  brightActive ? 'bg-yellow-400 text-black' : 'bg-zinc-800 text-zinc-400'
                }`}
              >
                BRIGHT: {brightActive ? 'LIGADO (+4dB)' : 'DESLIGADO'}
              </button>
            </div>

            {/* Painel de Knobs Virtuais */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 text-center">
              {/* Drive */}
              <div className="bg-black/60 border border-zinc-800 p-3">
                <span className="text-[10px] text-zinc-400 uppercase block font-bold">DRIVE</span>
                <span className="text-xl font-mono text-rose-500 font-bold">{driveVal}%</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={driveVal}
                  onChange={(e) => setDriveVal(Number(e.target.value))}
                  className="w-full mt-2 accent-rose-500 cursor-pointer h-1.5 bg-zinc-800 rounded-lg"
                />
              </div>

              {/* Bass */}
              <div className="bg-black/60 border border-zinc-800 p-3">
                <span className="text-[10px] text-zinc-400 uppercase block font-bold">BASS</span>
                <span className="text-xl font-mono text-zinc-200 font-bold">{bassVal}%</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={bassVal}
                  onChange={(e) => setBassVal(Number(e.target.value))}
                  className="w-full mt-2 accent-yellow-400 cursor-pointer h-1.5 bg-zinc-800 rounded-lg"
                />
              </div>

              {/* Middle */}
              <div className="bg-black/60 border border-zinc-800 p-3">
                <span className="text-[10px] text-zinc-400 uppercase block font-bold">MIDDLE</span>
                <span className="text-xl font-mono text-zinc-200 font-bold">{midVal}%</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={midVal}
                  onChange={(e) => setMidVal(Number(e.target.value))}
                  className="w-full mt-2 accent-yellow-400 cursor-pointer h-1.5 bg-zinc-800 rounded-lg"
                />
              </div>

              {/* Treble */}
              <div className="bg-black/60 border border-zinc-800 p-3">
                <span className="text-[10px] text-zinc-400 uppercase block font-bold">TREBLE</span>
                <span className="text-xl font-mono text-zinc-200 font-bold">{trebleVal}%</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={trebleVal}
                  onChange={(e) => setTrebleVal(Number(e.target.value))}
                  className="w-full mt-2 accent-yellow-400 cursor-pointer h-1.5 bg-zinc-800 rounded-lg"
                />
              </div>

              {/* Presence */}
              <div className="bg-black/60 border border-zinc-800 p-3">
                <span className="text-[10px] text-zinc-400 uppercase block font-bold">PRESENCE</span>
                <span className="text-xl font-mono text-cyan-400 font-bold">{presenceVal}%</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={presenceVal}
                  onChange={(e) => setPresenceVal(Number(e.target.value))}
                  className="w-full mt-2 accent-cyan-400 cursor-pointer h-1.5 bg-zinc-800 rounded-lg"
                />
              </div>
            </div>

            {/* Seletor de Gabinete IR Embutido */}
            <div className="mt-6 pt-4 border-t-2 border-zinc-800 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-zinc-400 font-bold uppercase">GABINETE IR:</span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => setSelectedCab('2x12')}
                    className={`px-2.5 py-1 border transition-all ${
                      selectedCab === '2x12' ? 'bg-zinc-200 text-black font-bold border-black' : 'bg-black text-zinc-400 border-zinc-800 hover:text-white'
                    }`}
                  >
                    Midwest 2x12 Open Back (Jensens)
                  </button>
                  <button
                    onClick={() => setSelectedCab('greenback')}
                    className={`px-2.5 py-1 border transition-all ${
                      selectedCab === 'greenback' ? 'bg-zinc-200 text-black font-bold border-black' : 'bg-black text-zinc-400 border-zinc-800 hover:text-white'
                    }`}
                  >
                    British 4x12 Greenback
                  </button>
                  <button
                    onClick={() => setSelectedCab('v30')}
                    className={`px-2.5 py-1 border transition-all ${
                      selectedCab === 'v30' ? 'bg-zinc-200 text-black font-bold border-black' : 'bg-black text-zinc-400 border-zinc-800 hover:text-white'
                    }`}
                  >
                    American 4x12 Vintage 30
                  </button>
                </div>
              </div>

              <div className="text-[11px] font-mono text-zinc-400">
                Limitador Brickwall Master: <span className="text-emerald-400 font-bold">-0.1 dB True Peak</span>
              </div>
            </div>
          </div>

          {/* Detalhes de Instalação e Downloads */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 bg-black p-4 border-2 border-zinc-800">
            <div>
              <span className="text-xs font-bold text-zinc-200 uppercase block">
                DOWNLOADS DISPONÍVEIS VIA GITHUB RELEASES (CI/CD):
              </span>
              <span className="text-[11px] text-zinc-400">
                Formatos VST3 &amp; CLAP nativos de 64-bits para Windows, macOS e Linux.
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              <a
                href="https://github.com/FelipeGardenghiDev/underground-tools/actions/workflows/build-plugins.yml"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase px-4 py-2 border-2 border-black shadow-brutal flex items-center gap-2 transition-all"
              >
                <Download className="w-4 h-4" />
                Baixar MidwestAmp (GitHub Release)
              </a>
            </div>
          </div>
        </div>
      ) : (
        /* ========================================================================= */
        /* RACK INTERATIVO: CRYTUNE (VOCAL PITCH CORRECTOR & PRESENCE)               */
        /* ========================================================================= */
        <div className="bg-[#121217] border-4 border-black p-6 md:p-8 shadow-brutal relative">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b-2 border-zinc-800 pb-4 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-rose-600 text-white px-2 py-0.5 text-xs font-bold uppercase">
                  TOOL 02
                </span>
                <h2 className="font-stencil text-3xl md:text-4xl text-zinc-50 tracking-wider">
                  CRYTUNE // VOCAL PITCH &amp; AIR PRESENCE
                </h2>
              </div>
              <p className="text-xs text-zinc-400 mt-1">
                Afinador vocal de baixa latência baseado no algoritmo YIN com fatiamento PSOLA e presença aérea de 10.5 kHz.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <a
                href="https://github.com/FelipeGardenghiDev/underground-tools/tree/main/plugins/cry-tune"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold px-4 py-2 border-2 border-black shadow-brutal flex items-center gap-1.5 transition-all"
              >
                <ExternalLink className="w-3.5 h-3.5" /> Código C++ no GitHub
              </a>
            </div>
          </div>

          <div className="bg-[#181824] border-4 border-zinc-950 p-6 shadow-inner rounded-sm relative">
            {/* Seletor de Escala */}
            <div className="border-b-2 border-zinc-800 pb-4 mb-6 flex flex-wrap justify-between items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-zinc-400 uppercase font-bold">ESCALA:</span>
                <div className="flex flex-wrap bg-black border-2 border-zinc-800 p-1">
                  <button
                    onClick={() => setCryScale('midwest-e')}
                    className={`px-3 py-1 text-xs font-bold uppercase transition-all ${
                      cryScale === 'midwest-e' ? 'bg-rose-600 text-white' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    Midwest E Major (DAEAC#E)
                  </button>
                  <button
                    onClick={() => setCryScale('chromatic')}
                    className={`px-3 py-1 text-xs font-bold uppercase transition-all ${
                      cryScale === 'chromatic' ? 'bg-yellow-400 text-black' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    Cromática
                  </button>
                  <button
                    onClick={() => setCryScale('d-minor')}
                    className={`px-3 py-1 text-xs font-bold uppercase transition-all ${
                      cryScale === 'd-minor' ? 'bg-purple-600 text-white' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    D Menor Emo
                  </button>
                  <button
                    onClick={() => setCryScale('pentatonic')}
                    className={`px-3 py-1 text-xs font-bold uppercase transition-all ${
                      cryScale === 'pentatonic' ? 'bg-cyan-600 text-white' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    Pentatônica Menor
                  </button>
                </div>
              </div>
            </div>

            {/* Knobs do CryTune */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {/* Retune Speed */}
              <div className="bg-black/60 border border-zinc-800 p-4 text-center">
                <span className="text-[10px] text-zinc-400 uppercase block font-bold">RETUNE SPEED</span>
                <span className="text-2xl font-mono text-rose-500 font-bold">{retuneSpeed} ms</span>
                <span className="text-[10px] text-zinc-500 block mb-2">
                  {retuneSpeed === 0 ? '⚡ 0ms (Hard Snap 2000s)' : retuneSpeed <= 30 ? '🔥 Rápido & Firme' : '🍃 Afinação Natural'}
                </span>
                <input
                  type="range"
                  min="0"
                  max="80"
                  value={retuneSpeed}
                  onChange={(e) => setRetuneSpeed(Number(e.target.value))}
                  className="w-full accent-rose-500 cursor-pointer h-1.5 bg-zinc-800 rounded-lg"
                />
              </div>

              {/* Air Presence */}
              <div className="bg-black/60 border border-zinc-800 p-4 text-center">
                <span className="text-[10px] text-zinc-400 uppercase block font-bold">AIR PRESENCE (10.5 kHz)</span>
                <span className="text-2xl font-mono text-cyan-400 font-bold">+{airPresence} dB</span>
                <span className="text-[10px] text-zinc-500 block mb-2">
                  Brilho para cortar paredão de guitarras
                </span>
                <input
                  type="range"
                  min="0"
                  max="9"
                  step="0.5"
                  value={airPresence}
                  onChange={(e) => setAirPresence(Number(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-zinc-800 rounded-lg"
                />
              </div>

              {/* Demonstração Interativa de Quantização */}
              <div className="bg-black/60 border border-zinc-800 p-4">
                <span className="text-[10px] text-zinc-400 uppercase block font-bold text-center">
                  TESTE DE QUANTIZAÇÃO AO VIVO
                </span>
                <div className="mt-2 text-xs space-y-1">
                  <div className="text-zinc-400">
                    Entrada: <span className="text-yellow-400 font-bold">{selectedNote}</span>
                  </div>
                  <div className="text-zinc-400">
                    Corrigido para:{' '}
                    <span className="text-emerald-400 font-bold">
                      {selectedNote.includes('335') ? 'E4 (329.63 Hz) [0 cents]' :
                       selectedNote.includes('445') ? 'A4 (440.00 Hz) [0 cents]' :
                       selectedNote.includes('349') ? (cryScale === 'midwest-e' ? 'E4 / F#4 (Escala E)' : 'F4 (349.23 Hz)') :
                       'Nota afinada'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-1.5 mt-3">
                  <button
                    onClick={() => setSelectedNote('E4 (335 Hz detuned)')}
                    className="px-2 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-[10px] font-bold border border-zinc-700"
                  >
                    Cantar E4 (335 Hz)
                  </button>
                  <button
                    onClick={() => setSelectedNote('A4 (445 Hz detuned)')}
                    className="px-2 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-[10px] font-bold border border-zinc-700"
                  >
                    Cantar A4 (445 Hz)
                  </button>
                  <button
                    onClick={() => setSelectedNote('F4 (349 Hz fora)')}
                    className="px-2 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-[10px] font-bold border border-zinc-700 col-span-2"
                  >
                    Nota Fora da Escala (F4 349 Hz)
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 bg-black p-4 border-2 border-zinc-800">
            <div>
              <span className="text-xs font-bold text-zinc-200 uppercase block">
                DOWNLOAD CRYTUNE VIA GITHUB CI/CD:
              </span>
              <span className="text-[11px] text-zinc-400">
                Compilação automática multiplataforma (Windows .vst3, macOS, Linux).
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              <a
                href="https://github.com/FelipeGardenghiDev/underground-tools/actions/workflows/build-plugins.yml"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase px-4 py-2 border-2 border-black shadow-brutal flex items-center gap-2 transition-all"
              >
                <Download className="w-4 h-4" />
                Baixar CryTune (GitHub Release)
              </a>
            </div>
          </div>
        </div>
      )}


      {/* ========================================================================= */}
      {/* ROADMAP: OS 5 PLUGINS DA SUÍTE EMO AUDIO TOOLS                            */}
      {/* ========================================================================= */}
      <div className="space-y-4">
        <div className="border-b-2 border-zinc-800 pb-2">
          <h3 className="font-stencil text-2xl text-zinc-100 uppercase tracking-wider">
            A SUÍTE COMPLETA // CRONOGRAMA DE DESENVOLVIMENTO
          </h3>
          <p className="text-xs text-zinc-400">
            Tudo o que uma banda de quarto ou garagem precisa para mixar e masterizar com qualidade atual.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Plugin 1: MidwestAmp */}
          <div className="bg-[#121217] border-2 border-zinc-800 p-5 shadow-brutal">
            <div className="flex justify-between items-start mb-2">
              <span className="font-stencil text-xl text-yellow-400">01. MIDWESTAMP</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 font-bold uppercase">
                MOTOR C++ &amp; CLI PRONTOS
              </span>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Simulador valvulado com 3 canais lendários: <em>Kinsella Clean</em> para afinações abertas, <em>Emo 90s Crunch</em> e <em>Black Parade Wall</em>. Inclui utilitário CLI para reamping offline de arquivos WAV.
            </p>
          </div>

          {/* Plugin 2: CryTune */}
          <div className="bg-[#121217] border-2 border-zinc-800 p-5 shadow-brutal">
            <div className="flex justify-between items-start mb-2">
              <span className="font-stencil text-xl text-rose-500">02. CRYTUNE</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 font-bold uppercase">
                MOTOR C++ PRONTO
              </span>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Afinador vocal de baixa latência baseado no algoritmo YIN, fatiamento PSOLA e filtro Air Presence a 10.5 kHz. Calibrado com afinações Midwest Emo (DAEAC#E).
            </p>
          </div>


          {/* Plugin 3: ScreamoPunch */}
          <div className="bg-[#121217] border-2 border-zinc-800 p-5 shadow-brutal">
            <div className="flex justify-between items-start mb-2">
              <span className="font-stencil text-xl text-purple-400">03. SCREAMOPUNCH</span>
              <span className="text-[10px] bg-zinc-800 text-zinc-400 border border-zinc-700 px-2 py-0.5 font-bold uppercase">
                PLANEJADO
              </span>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Compressor agressivo de 2 botões para fazer a caixa da bateria dar aquele tiro seco na cara e amarrar vocais caóticos sem desespero de attack/release.
            </p>
          </div>

          {/* Plugin 4: DrownSpace */}
          <div className="bg-[#121217] border-2 border-zinc-800 p-5 shadow-brutal">
            <div className="flex justify-between items-start mb-2">
              <span className="font-stencil text-xl text-cyan-400">04. DROWNSPACE</span>
              <span className="text-[10px] bg-zinc-800 text-zinc-400 border border-zinc-700 px-2 py-0.5 font-bold uppercase">
                PLANEJADO
              </span>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Reverb cavernoso e melancólico com recurso automático de <em>Ducking</em> (o eco baixa quando o vocal canta) e modulação de fita cassete gasta.
            </p>
          </div>

          {/* Plugin 5: RawMaster */}
          <div className="bg-[#121217] border-2 border-zinc-800 p-5 shadow-brutal md:col-span-2">
            <div className="flex justify-between items-start mb-2">
              <span className="font-stencil text-xl text-white">05. RAWMASTER</span>
              <span className="text-[10px] bg-zinc-800 text-zinc-400 border border-zinc-700 px-2 py-0.5 font-bold uppercase">
                PLANEJADO
              </span>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Maximizer e limiter de 1 botão para atingir o volume comercial do Spotify (-14 LUFS) e Bandcamp (-9 LUFS) sem estourar clipping digital e sem custar R$ 2.000 como o Ozone.
            </p>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* VSTI: A TRINDADE DE INSTRUMENTOS VIRTUAIS (MIDI GENERATORS)               */}
      {/* ========================================================================= */}
      <div className="space-y-4">
        <div className="border-b-2 border-zinc-800 pb-2">
          <div className="flex items-center gap-2">
            <span className="bg-purple-600 text-white px-2 py-0.5 text-xs font-bold uppercase">
              NOVIDADE NO ROADMAP
            </span>
            <h3 className="font-stencil text-2xl text-zinc-100 uppercase tracking-wider">
              🎹 INSTRUMENTOS VIRTUAIS (VSTi) // PARA O REAPER
            </h3>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Gere som do zero desenhando notas no Piano Roll ou tocando no teclado controlador MIDI.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* VSTi 1: MidwestKit */}
          <div className="bg-[#121217] border-2 border-zinc-800 p-5 shadow-brutal flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-2">
                <span className="font-stencil text-lg text-emerald-400">🥁 MIDWESTKIT</span>
                <span className="text-[10px] bg-purple-500/20 text-purple-400 border border-purple-500/40 px-2 py-0.5 font-bold uppercase">
                  VSTi SAMPLER
                </span>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Bateria acústica crua e orgânica de garagem. Caixa estalada com estalo seco (Ludwig Acrolite / Supraphonic), bumbo de feltro e pratos abafados com fita.
              </p>
            </div>
            <span className="text-[10px] text-zinc-500 mt-3 block border-t border-zinc-800 pt-2 font-mono">
              ★ Mapeamento General MIDI padrão
            </span>
          </div>

          {/* VSTi 2: SadBoy Upright */}
          <div className="bg-[#121217] border-2 border-zinc-800 p-5 shadow-brutal flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-2">
                <span className="font-stencil text-lg text-yellow-400">🎹 SADBOY UPRIGHT</span>
                <span className="text-[10px] bg-purple-500/20 text-purple-400 border border-purple-500/40 px-2 py-0.5 font-bold uppercase">
                  VSTi PIANO
                </span>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Piano vertical de armário com feltro natural abafando as cordas. Ruído mecânico de teclas e pedal para introduções lentas e intimistas.
              </p>
            </div>
            <span className="text-[10px] text-zinc-500 mt-3 block border-t border-zinc-800 pt-2 font-mono">
              ★ Captação binaural estéreo próxima
            </span>
          </div>

          {/* VSTi 3: Gargantua Colossus */}
          <div className="bg-[#121217] border-2 border-rose-900/60 p-5 shadow-brutal flex flex-col justify-between relative overflow-hidden">
            <div className="absolute -top-6 -right-6 w-16 h-16 bg-rose-600/10 rounded-full blur-xl pointer-events-none" />
            <div>
              <div className="flex justify-between items-start mb-2">
                <span className="font-stencil text-lg text-rose-500">🌌 GARGANTUA</span>
                <span className="text-[10px] bg-rose-500/20 text-rose-400 border border-rose-500/40 px-2 py-0.5 font-bold uppercase">
                  OMNISPHERE TRIBUTE
                </span>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Inspirado no lendário preset <em>Gargantua</em> (Atmosphere/Omnisphere). Paredão colossal de 7 supersaws analógicas, sub-grave sísmico de 40 Hz, filtro LFO ultra lento e reverb espacial escuro.
              </p>
            </div>
            <span className="text-[10px] text-rose-400 mt-3 block border-t border-zinc-800 pt-2 font-mono">
              ★ Wall-of-Sound atmosférico em 1 tecla
            </span>
          </div>
        </div>
      </div>


      {/* ========================================================================= */}
      {/* GUIA DE INSTALAÇÃO RÁPIDA NAS DAWS                                        */}
      {/* ========================================================================= */}
      <div className="bg-black border-2 border-zinc-800 p-6 text-xs text-zinc-400 space-y-2">
        <div className="flex items-center gap-2 text-zinc-100 font-bold uppercase">
          <Terminal className="w-4 h-4 text-rose-500" />
          ONDE INSTALAR O ARQUIVO .VST3 NO SEU COMPUTADOR:
        </div>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Windows:</strong> <code className="text-yellow-400">C:\Program Files\Common Files\VST3</code></li>
          <li><strong>macOS:</strong> <code className="text-yellow-400">/Library/Audio/Plug-Ins/VST3</code></li>
          <li><strong>Linux:</strong> <code className="text-yellow-400">~/.vst3</code> ou <code className="text-yellow-400">/usr/lib/vst3</code></li>
        </ul>
        <p className="text-[11px] text-zinc-500 pt-2">
          Após copiar o arquivo, abra sua DAW favorita (Reaper, FL Studio, Ableton Live, Logic, Studio One, Bitwig, Cubase) e faça um rescan de plugins.
        </p>
      </div>
    </div>
  );
}
