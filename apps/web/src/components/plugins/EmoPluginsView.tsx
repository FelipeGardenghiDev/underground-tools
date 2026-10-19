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
  // Estado do simulador interativo do MidwestAmp
  const [selectedChannel, setSelectedChannel] = useState<'clean' | 'crunch' | 'lead'>('clean');
  const [selectedCab, setSelectedCab] = useState<'2x12' | 'greenback' | 'v30'>('2x12');
  const [driveVal, setDriveVal] = useState(35);
  const [bassVal, setBassVal] = useState(50);
  const [midVal, setMidVal] = useState(60);
  const [trebleVal, setTrebleVal] = useState(70);
  const [presenceVal, setPresenceVal] = useState(55);
  const [brightActive, setBrightActive] = useState(true);

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
      {/* DESTAQUE PRINCIPAL: MIDWESTAMP (FLAGSHIP TUBE AMP SIMULATOR)              */}
      {/* ========================================================================= */}
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
                MOTOR C++ PRONTO
              </span>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Simulador de amplificador valvulado e gabinete com 3 canais lendários: <em>Kinsella Clean</em> para afinações abertas, <em>Emo 90s Crunch</em> e <em>Black Parade Wall</em>.
            </p>
          </div>

          {/* Plugin 2: CryTune */}
          <div className="bg-[#121217] border-2 border-zinc-800 p-5 shadow-brutal">
            <div className="flex justify-between items-start mb-2">
              <span className="font-stencil text-xl text-rose-500">02. CRYTUNE</span>
              <span className="text-[10px] bg-yellow-500/20 text-yellow-400 border border-yellow-500/40 px-2 py-0.5 font-bold uppercase">
                EM DESENVOLVIMENTO
              </span>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Afinador vocal de baixa latência baseado no algoritmo YIN e fatiamento PSOLA. De Midwest Emo natural e emotivo ao hard-tune dramático de 2000s Post-Hardcore.
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
