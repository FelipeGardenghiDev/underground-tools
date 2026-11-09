'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  Sparkles,
  Play,
  Square,
  Activity,
  Waves
} from 'lucide-react';
import { webAudioDsp, PluginType } from '@/lib/web-audio-dsp';

export function EmoPluginsView() {
  const [activePluginTab, setActivePluginTab] = useState<PluginType>('midwest-amp');

  // Audio Playback state
  const [isPlayingDemo, setIsPlayingDemo] = useState(false);
  const [isMicLive, setIsMicLive] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const visualizerRafRef = useRef<number | null>(null);

  // 1. Estado do simulador do MidwestAmp
  const [selectedChannel, setSelectedChannel] = useState<'clean' | 'crunch' | 'lead'>('clean');
  const [selectedCab, setSelectedCab] = useState<'2x12' | 'greenback' | 'v30'>('2x12');
  const [driveVal, setDriveVal] = useState(35);
  const [bassVal, setBassVal] = useState(50);
  const [midVal, setMidVal] = useState(60);
  const [trebleVal, setTrebleVal] = useState(70);
  const [presenceVal, setPresenceVal] = useState(55);
  const [brightActive, setBrightActive] = useState(true);

  // 2. Estado do simulador do CryTune
  const [cryScale, setCryScale] = useState<'midwest-e' | 'chromatic' | 'd-minor' | 'pentatonic'>('midwest-e');
  const [retuneSpeed, setRetuneSpeed] = useState(20);
  const [airPresence, setAirPresence] = useState(4.5);
  const [selectedNote, setSelectedNote] = useState('E4 (335 Hz detuned)');

  // 3. Estado do ScreamoPunch
  const [punchVal, setPunchVal] = useState(65);
  const [smashVal, setSmashVal] = useState(70);
  const [punchMixVal, setPunchMixVal] = useState(85);

  // 4. Estado do DrownSpace
  const [decayVal, setDecayVal] = useState(75);
  const [duckingVal, setDuckingVal] = useState(60);
  const [flutterVal, setFlutterVal] = useState(40);
  const [drownMixVal, setDrownMixVal] = useState(45);

  // 5. Estado do RawMaster
  const [masterPreset, setMasterPreset] = useState<'streaming' | 'cd' | 'wall'>('streaming');
  const [ceilingVal, setCeilingVal] = useState(-0.3);

  // Switch plugin on audio engine
  useEffect(() => {
    if (webAudioDsp) {
      webAudioDsp.setPlugin(activePluginTab);
    }
  }, [activePluginTab]);

  // Sync MidwestAmp real-time audio params
  useEffect(() => {
    if (webAudioDsp) {
      webAudioDsp.updateMidwestAmp({
        channel: selectedChannel,
        drive: driveVal,
        bass: bassVal,
        mid: midVal,
        treble: trebleVal,
        presence: presenceVal,
        bright: brightActive,
        cab: selectedCab,
      });
    }
  }, [selectedChannel, driveVal, bassVal, midVal, trebleVal, presenceVal, brightActive, selectedCab]);

  // Sync ScreamoPunch
  useEffect(() => {
    if (webAudioDsp) {
      webAudioDsp.updateScreamoPunch({
        punch: punchVal,
        smash: smashVal,
        mix: punchMixVal,
      });
    }
  }, [punchVal, smashVal, punchMixVal]);

  // Sync DrownSpace
  useEffect(() => {
    if (webAudioDsp) {
      webAudioDsp.updateDrownSpace({
        decay: decayVal,
        ducking: duckingVal,
        flutter: flutterVal,
        mix: drownMixVal,
      });
    }
  }, [decayVal, duckingVal, flutterVal, drownMixVal]);

  // Sync CryTune
  useEffect(() => {
    if (webAudioDsp) {
      webAudioDsp.updateCryTune({
        airPresence: airPresence,
        retuneSpeed: retuneSpeed,
        scale: cryScale,
      });
    }
  }, [airPresence, retuneSpeed, cryScale]);

  // Sync RawMaster
  useEffect(() => {
    if (webAudioDsp) {
      webAudioDsp.updateRawMaster({
        preset: masterPreset,
      });
    }
  }, [masterPreset]);

  // Canvas visualizer loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dataArray = new Uint8Array(128);

    const draw = () => {
      visualizerRafRef.current = requestAnimationFrame(draw);
      if (webAudioDsp) {
        webAudioDsp.getVisualizerData(dataArray);
      }

      ctx.fillStyle = '#09090c';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Grid lines
      ctx.strokeStyle = '#1e1e24';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, canvas.height / 2);
      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();

      // Audio frequency bars / waves
      const barWidth = (canvas.width / dataArray.length) * 1.5;
      let x = 0;

      for (let i = 0; i < dataArray.length; i++) {
        const v = dataArray[i] / 255.0;
        const barHeight = v * (canvas.height - 4);

        // Retro amber phosphor / screamo red
        ctx.fillStyle = i % 2 === 0 ? '#facc15' : '#e11d48';
        ctx.fillRect(x, canvas.height - barHeight, barWidth - 1, barHeight);
        x += barWidth;
      }
    };

    draw();

    return () => {
      if (visualizerRafRef.current) {
        cancelAnimationFrame(visualizerRafRef.current);
      }
    };
  }, []);

  const handleToggleDemo = () => {
    if (!webAudioDsp) return;
    const playing = webAudioDsp.toggleDemoRiff();
    setIsPlayingDemo(playing);
  };

  const handleToggleMic = async () => {
    if (!webAudioDsp) return;
    const active = await webAudioDsp.toggleMicrophone();
    setIsMicLive(active);
  };

  return (
    <div className="space-y-8 font-mono">
      {/* Hero Zine Banner */}
      <div className="bg-[#0f0f12] border-4 border-zinc-800 p-6 md:p-8 shadow-brutal relative overflow-hidden">
        <div className="inline-block bg-rose-600 text-white px-3 py-1 font-mono font-bold text-xs uppercase tracking-widest border border-black shadow-brutal-sm -rotate-1 mb-3">
          ★ SUÍTE COMPLETA DOS 5 PLUGINS • C++17 • VST3 &amp; CLAP • 100% LIVRE ★
        </div>

        <h1 className="font-stencil text-3xl md:text-5xl text-white tracking-wider uppercase leading-none max-w-4xl">
          EMO AUDIO TOOLS // ARMAS DE ESTÚDIO INDEPENDENTE
        </h1>

        <p className="text-zinc-300 text-xs md:text-sm leading-relaxed mt-3 max-w-3xl">
          5 ferramentas essenciais de mixagem e gravação sem iLok, sem assinaturas e sem telemetria, calibradas para a sonoridade <strong className="text-white">Midwest Emo, Screamo, 2000s Pop-Punk e Post-Hardcore</strong>.
        </p>

        {/* Global Live Web Audio Player Bar */}
        <div className="mt-5 p-3.5 bg-black border-2 border-zinc-700 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={handleToggleDemo}
              className={`px-4 py-2 font-mono font-bold text-xs uppercase border-2 border-black flex items-center gap-2 transition-all active:scale-95 shadow-brutal-sm ${
                isPlayingDemo
                  ? 'bg-rose-600 text-white animate-pulse'
                  : 'bg-yellow-400 hover:bg-yellow-300 text-black'
              }`}
            >
              {isPlayingDemo ? <Square className="w-3.5 h-3.5 fill-white" /> : <Play className="w-3.5 h-3.5 fill-black" />}
              <span>{isPlayingDemo ? 'Parar Riff Midwest' : 'Tocar Riff de Demonstração'}</span>
            </button>

            <button
              onClick={handleToggleMic}
              className={`px-3 py-2 font-mono font-bold text-xs uppercase border border-zinc-700 flex items-center gap-1.5 transition-all ${
                isMicLive
                  ? 'bg-emerald-600 text-white border-black'
                  : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white'
              }`}
              title="Ligar microfone ou entrada de linha para tocar com sua própria guitarra"
            >
              <Mic2 className={`w-3.5 h-3.5 ${isMicLive ? 'text-white' : 'text-emerald-400'}`} />
              <span>{isMicLive ? 'Mic/Guitarra Conectado' : 'Conectar Entrada (Mic/Guitarra)'}</span>
            </button>
          </div>

          {/* Visualizador Oscilloscope em Tempo Real */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest hidden sm:inline">
              LIVE DSP:
            </span>
            <canvas
              ref={canvasRef}
              width={160}
              height={32}
              className="bg-[#09090c] border border-zinc-700 h-8 w-40"
            />
          </div>
        </div>

        {/* Badges de Filosofia */}
        <div className="flex flex-wrap gap-2 pt-3">
          <span className="bg-black text-yellow-400 text-[11px] px-2.5 py-0.5 border border-zinc-700 flex items-center gap-1.5 font-bold">
            <ShieldCheck className="w-3 h-3" /> 100% CÓDIGO ABERTO (MIT)
          </span>
          <span className="bg-black text-rose-400 text-[11px] px-2.5 py-0.5 border border-zinc-700 flex items-center gap-1.5 font-bold">
            <Radio className="w-3 h-3" /> ZERO TELEMETRIA
          </span>
          <span className="bg-black text-emerald-400 text-[11px] px-2.5 py-0.5 border border-zinc-700 flex items-center gap-1.5 font-bold">
            <CheckCircle2 className="w-3 h-3" /> REAPER, BITWIG, FL, ABLETON &amp; CUBASE
          </span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SELETOR DE PLUGIN INTERATIVO (AS 5 FERRAMENTAS)                           */}
      {/* ========================================================================= */}
      <div className="flex flex-wrap border-b-4 border-black gap-1.5">
        <button
          onClick={() => setActivePluginTab('midwest-amp')}
          className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border-t-2 border-x-2 border-black transition-all ${
            activePluginTab === 'midwest-amp'
              ? 'bg-[#121217] text-yellow-400 -mb-1 shadow-brutal-sm'
              : 'bg-zinc-900 text-zinc-400 hover:text-white border-zinc-800'
          }`}
        >
          🎸 01. MidwestAmp
        </button>
        <button
          onClick={() => setActivePluginTab('cry-tune')}
          className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border-t-2 border-x-2 border-black transition-all ${
            activePluginTab === 'cry-tune'
              ? 'bg-[#121217] text-rose-500 -mb-1 shadow-brutal-sm'
              : 'bg-zinc-900 text-zinc-400 hover:text-white border-zinc-800'
          }`}
        >
          🎙️ 02. CryTune
        </button>
        <button
          onClick={() => setActivePluginTab('screamo-punch')}
          className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border-t-2 border-x-2 border-black transition-all ${
            activePluginTab === 'screamo-punch'
              ? 'bg-[#121217] text-orange-400 -mb-1 shadow-brutal-sm'
              : 'bg-zinc-900 text-zinc-400 hover:text-white border-zinc-800'
          }`}
        >
          💥 03. ScreamoPunch
        </button>
        <button
          onClick={() => setActivePluginTab('drown-space')}
          className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border-t-2 border-x-2 border-black transition-all ${
            activePluginTab === 'drown-space'
              ? 'bg-[#121217] text-cyan-400 -mb-1 shadow-brutal-sm'
              : 'bg-zinc-900 text-zinc-400 hover:text-white border-zinc-800'
          }`}
        >
          🌊 04. DrownSpace
        </button>
        <button
          onClick={() => setActivePluginTab('raw-master')}
          className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border-t-2 border-x-2 border-black transition-all ${
            activePluginTab === 'raw-master'
              ? 'bg-[#121217] text-emerald-400 -mb-1 shadow-brutal-sm'
              : 'bg-zinc-900 text-zinc-400 hover:text-white border-zinc-800'
          }`}
        >
          📼 05. RawMaster
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 1. PAINEL MIDWESTAMP                                                      */}
      {/* ========================================================================= */}
      {activePluginTab === 'midwest-amp' && (
        <div className="bg-[#121217] border-4 border-black p-6 md:p-8 shadow-brutal">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b-2 border-zinc-800 pb-4 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-yellow-400 text-black px-2 py-0.5 text-xs font-bold uppercase">
                  FLAGSHIP 01
                </span>
                <h2 className="font-stencil text-2xl md:text-3xl text-zinc-50 tracking-wider">
                  MIDWESTAMP // TUBE AMP &amp; CAB IR
                </h2>
              </div>
              <p className="text-xs text-zinc-400 mt-1">
                Simulador valvulado de guitarra e baixo focado em afinações abertas, crunch dinâmico e distorção massiva dos anos 2000.
              </p>
            </div>
            <a
              href="https://github.com/FelipeGardenghiDev/underground-tools/tree/main/plugins/midwest-amp"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold px-3 py-1.5 border-2 border-black shadow-brutal flex items-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5" /> Código C++ no GitHub
            </a>
          </div>

          <div className="bg-[#1a1a22] border-4 border-zinc-950 p-6 shadow-inner rounded-sm space-y-6">
            <div className="border-b-2 border-zinc-800 pb-4 flex flex-wrap justify-between items-center gap-4">
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
                    3. Screamo Wall
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] text-zinc-400 uppercase font-bold">GABINETE IR:</span>
                <select
                  value={selectedCab}
                  onChange={(e) => setSelectedCab(e.target.value as '2x12' | 'greenback' | 'v30')}
                  aria-label="Selecionar Gabinete IR"
                  className="bg-black text-yellow-400 border border-zinc-700 px-3 py-1 text-xs font-mono font-bold"
                >
                  <option value="2x12">Midwest 2x12 Open Back</option>
                  <option value="greenback">British 4x12 Greenback</option>
                  <option value="v30">American 4x12 Vintage 30</option>
                </select>
              </div>
            </div>

            {/* Knobs do MidwestAmp */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              <div className="bg-black/60 p-3 border border-zinc-800 text-center">
                <span className="text-[11px] text-zinc-400 block mb-1">DRIVE</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={driveVal}
                  onChange={(e) => setDriveVal(Number(e.target.value))}
                  aria-label="Drive do MidwestAmp"
                  className="w-full accent-yellow-400 cursor-pointer"
                />
                <span className="text-yellow-400 text-xs font-bold">{driveVal}%</span>
              </div>

              <div className="bg-black/60 p-3 border border-zinc-800 text-center">
                <span className="text-[11px] text-zinc-400 block mb-1">BASS</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={bassVal}
                  onChange={(e) => setBassVal(Number(e.target.value))}
                  aria-label="Bass do MidwestAmp"
                  className="w-full accent-zinc-400 cursor-pointer"
                />
                <span className="text-zinc-300 text-xs font-bold">{bassVal}</span>
              </div>

              <div className="bg-black/60 p-3 border border-zinc-800 text-center">
                <span className="text-[11px] text-zinc-400 block mb-1">MIDDLE</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={midVal}
                  onChange={(e) => setMidVal(Number(e.target.value))}
                  aria-label="Middle do MidwestAmp"
                  className="w-full accent-zinc-400 cursor-pointer"
                />
                <span className="text-zinc-300 text-xs font-bold">{midVal}</span>
              </div>

              <div className="bg-black/60 p-3 border border-zinc-800 text-center">
                <span className="text-[11px] text-zinc-400 block mb-1">TREBLE</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={trebleVal}
                  onChange={(e) => setTrebleVal(Number(e.target.value))}
                  aria-label="Treble do MidwestAmp"
                  className="w-full accent-zinc-400 cursor-pointer"
                />
                <span className="text-zinc-300 text-xs font-bold">{trebleVal}</span>
              </div>

              <div className="bg-black/60 p-3 border border-zinc-800 text-center">
                <span className="text-[11px] text-zinc-400 block mb-1">PRESENCE</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={presenceVal}
                  onChange={(e) => setPresenceVal(Number(e.target.value))}
                  aria-label="Presence do MidwestAmp"
                  className="w-full accent-zinc-400 cursor-pointer"
                />
                <span className="text-zinc-300 text-xs font-bold">{presenceVal}</span>
              </div>

              <div className="bg-black/60 p-3 border border-zinc-800 text-center flex flex-col justify-between">
                <span className="text-[11px] text-zinc-400 block mb-1">BRIGHT</span>
                <button
                  onClick={() => setBrightActive(!brightActive)}
                  className={`w-full py-1.5 text-xs font-bold uppercase border ${
                    brightActive ? 'bg-yellow-400 text-black border-black' : 'bg-zinc-900 text-zinc-400 border-zinc-700'
                  }`}
                >
                  {brightActive ? 'ON (+4dB)' : 'OFF'}
                </button>
                <span className="text-[10px] text-zinc-500 mt-1">3.5 kHz Boost</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. PAINEL CRYTUNE                                                         */}
      {/* ========================================================================= */}
      {activePluginTab === 'cry-tune' && (
        <div className="bg-[#121217] border-4 border-black p-6 md:p-8 shadow-brutal">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b-2 border-zinc-800 pb-4 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-rose-600 text-white px-2 py-0.5 text-xs font-bold uppercase">
                  PLUGIN 02
                </span>
                <h2 className="font-stencil text-2xl md:text-3xl text-zinc-50 tracking-wider">
                  CRYTUNE // VOCAL PITCH &amp; AIR PRESENCE
                </h2>
              </div>
              <p className="text-xs text-zinc-400 mt-1">
                Afinador vocal transparente com detecção YIN e boost acústico de presença aérea (10.5 kHz) para vocais sussurrados ou berrados.
              </p>
            </div>
            <a
              href="https://github.com/FelipeGardenghiDev/underground-tools/tree/main/plugins/cry-tune"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold px-3 py-1.5 border-2 border-black shadow-brutal flex items-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5" /> Código C++ no GitHub
            </a>
          </div>

          <div className="bg-[#1a1a22] border-4 border-zinc-950 p-6 shadow-inner rounded-sm space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-black/60 p-4 border border-zinc-800 space-y-2">
                <span className="text-xs text-zinc-400 font-bold block">ESCALA MUSICAL:</span>
                <select
                  value={cryScale}
                  onChange={(e) => setCryScale(e.target.value as 'midwest-e' | 'chromatic' | 'd-minor' | 'pentatonic')}
                  aria-label="Escala do CryTune"
                  className="w-full bg-black text-rose-400 border border-zinc-700 px-3 py-2 text-xs font-mono font-bold"
                >
                  <option value="midwest-e">Midwest Emo (E Maior / DAEAC#E)</option>
                  <option value="chromatic">Cromática (12 Notas)</option>
                  <option value="d-minor">D Menor Natural (Melancólica)</option>
                  <option value="pentatonic">Pentatônica Menor Emo</option>
                </select>
                <span className="text-[10px] text-zinc-500 block pt-1">
                  Mapeia os nós fundamentais da harmonia sem desafinações acidentais.
                </span>
              </div>

              <div className="bg-black/60 p-4 border border-zinc-800 text-center">
                <span className="text-xs text-zinc-400 font-bold block mb-1">RETUNE SPEED:</span>
                <input
                  type="range"
                  min="0"
                  max="80"
                  value={retuneSpeed}
                  onChange={(e) => setRetuneSpeed(Number(e.target.value))}
                  aria-label="Velocidade de Retune"
                  className="w-full accent-rose-500 cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-zinc-400 mt-1">
                  <span>0ms (Hard-tune)</span>
                  <strong className="text-rose-400">{retuneSpeed} ms</strong>
                  <span>80ms (Natural)</span>
                </div>
              </div>

              <div className="bg-black/60 p-4 border border-zinc-800 text-center">
                <span className="text-xs text-zinc-400 font-bold block mb-1">AIR PRESENCE (10.5 kHz):</span>
                <input
                  type="range"
                  min="0"
                  max="9"
                  step="0.5"
                  value={airPresence}
                  onChange={(e) => setAirPresence(Number(e.target.value))}
                  aria-label="Air Presence do CryTune"
                  className="w-full accent-rose-500 cursor-pointer"
                />
                <span className="text-rose-400 text-xs font-bold">+{airPresence} dB Boost</span>
                <span className="text-[10px] text-zinc-500 block mt-1">Faz a voz cortar guitarras dobradas</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. PAINEL SCREAMOPUNCH                                                    */}
      {/* ========================================================================= */}
      {activePluginTab === 'screamo-punch' && (
        <div className="bg-[#121217] border-4 border-black p-6 md:p-8 shadow-brutal">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b-2 border-zinc-800 pb-4 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-orange-500 text-black px-2 py-0.5 text-xs font-bold uppercase">
                  PLUGIN 03
                </span>
                <h2 className="font-stencil text-2xl md:text-3xl text-zinc-50 tracking-wider">
                  SCREAMOPUNCH // SNARE &amp; VOCAL GRAB COMPRESSOR
                </h2>
              </div>
              <p className="text-xs text-zinc-400 mt-1">
                Compressor estilo FET / 1176 agressivo com transient shaper integrado para estalo de caixa e compressão paralela no estilo Nova York.
              </p>
            </div>
            <a
              href="https://github.com/FelipeGardenghiDev/underground-tools/tree/main/plugins/screamo-punch"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold px-3 py-1.5 border-2 border-black shadow-brutal flex items-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5" /> Código C++ no GitHub
            </a>
          </div>

          <div className="bg-[#1a1a22] border-4 border-zinc-950 p-6 shadow-inner rounded-sm space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-black/60 p-4 border border-zinc-800 text-center">
                <span className="text-xs text-zinc-400 font-bold block mb-1">PUNCH (TRANSIENT POP)</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={punchVal}
                  onChange={(e) => setPunchVal(Number(e.target.value))}
                  aria-label="Punch do ScreamoPunch"
                  className="w-full accent-orange-400 cursor-pointer"
                />
                <span className="text-orange-400 text-xs font-bold">{punchVal}%</span>
                <span className="text-[10px] text-zinc-500 block mt-1">Realça os primeiros 10ms da baqueta</span>
              </div>

              <div className="bg-black/60 p-4 border border-zinc-800 text-center">
                <span className="text-xs text-zinc-400 font-bold block mb-1">SMASH (COMPRESSION GRAB)</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={smashVal}
                  onChange={(e) => setSmashVal(Number(e.target.value))}
                  aria-label="Smash do ScreamoPunch"
                  className="w-full accent-orange-400 cursor-pointer"
                />
                <span className="text-orange-400 text-xs font-bold">{smashVal}%</span>
                <span className="text-[10px] text-zinc-500 block mt-1">Curva FET 1176 com saturação</span>
              </div>

              <div className="bg-black/60 p-4 border border-zinc-800 text-center">
                <span className="text-xs text-zinc-400 font-bold block mb-1">MIX (PARALLEL BLEND)</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={punchMixVal}
                  onChange={(e) => setPunchMixVal(Number(e.target.value))}
                  aria-label="Mix do ScreamoPunch"
                  className="w-full accent-orange-400 cursor-pointer"
                />
                <span className="text-orange-400 text-xs font-bold">{punchMixVal}% Wet</span>
                <span className="text-[10px] text-zinc-500 block mt-1">Mistura paralela Dry/Wet</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. PAINEL DROWNSPACE                                                      */}
      {/* ========================================================================= */}
      {activePluginTab === 'drown-space' && (
        <div className="bg-[#121217] border-4 border-black p-6 md:p-8 shadow-brutal">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b-2 border-zinc-800 pb-4 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-cyan-500 text-black px-2 py-0.5 text-xs font-bold uppercase">
                  PLUGIN 04
                </span>
                <h2 className="font-stencil text-2xl md:text-3xl text-zinc-50 tracking-wider">
                  DROWNSPACE // MELANCHOLIC REVERB &amp; DUCKING
                </h2>
              </div>
              <p className="text-xs text-zinc-400 mt-1">
                Reverb melancólico e atmosférico com recurso exclusivo de Auto-Ducking integrado e modulação analógica de fita K7 gasta.
              </p>
            </div>
            <a
              href="https://github.com/FelipeGardenghiDev/underground-tools/tree/main/plugins/drown-space"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold px-3 py-1.5 border-2 border-black shadow-brutal flex items-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5" /> Código C++ no GitHub
            </a>
          </div>

          <div className="bg-[#1a1a22] border-4 border-zinc-950 p-6 shadow-inner rounded-sm space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-black/60 p-4 border border-zinc-800 text-center">
                <span className="text-xs text-zinc-400 font-bold block mb-1">DECAY (SIZE)</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={decayVal}
                  onChange={(e) => setDecayVal(Number(e.target.value))}
                  aria-label="Decay do DrownSpace"
                  className="w-full accent-cyan-400 cursor-pointer"
                />
                <span className="text-cyan-400 text-xs font-bold">{decayVal}%</span>
                <span className="text-[10px] text-zinc-500 block mt-1">Garagem úmida até catedral</span>
              </div>

              <div className="bg-black/60 p-4 border border-zinc-800 text-center">
                <span className="text-xs text-zinc-400 font-bold block mb-1">DROWN (AUTO-DUCKING)</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={duckingVal}
                  onChange={(e) => setDuckingVal(Number(e.target.value))}
                  aria-label="Ducking do DrownSpace"
                  className="w-full accent-cyan-400 cursor-pointer"
                />
                <span className="text-cyan-400 text-xs font-bold">{duckingVal}%</span>
                <span className="text-[10px] text-zinc-500 block mt-1">Abre nos silêncios da voz/solo</span>
              </div>

              <div className="bg-black/60 p-4 border border-zinc-800 text-center">
                <span className="text-xs text-zinc-400 font-bold block mb-1">TAPE FLUTTER</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={flutterVal}
                  onChange={(e) => setFlutterVal(Number(e.target.value))}
                  aria-label="Tape Flutter do DrownSpace"
                  className="w-full accent-cyan-400 cursor-pointer"
                />
                <span className="text-cyan-400 text-xs font-bold">{flutterVal}%</span>
                <span className="text-[10px] text-zinc-500 block mt-1">Modulação K7 nostálgica</span>
              </div>

              <div className="bg-black/60 p-4 border border-zinc-800 text-center">
                <span className="text-xs text-zinc-400 font-bold block mb-1">MIX</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={drownMixVal}
                  onChange={(e) => setDrownMixVal(Number(e.target.value))}
                  aria-label="Mix do DrownSpace"
                  className="w-full accent-cyan-400 cursor-pointer"
                />
                <span className="text-cyan-400 text-xs font-bold">{drownMixVal}% Wet</span>
                <span className="text-[10px] text-zinc-500 block mt-1">Equilíbrio Dry / Wet</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. PAINEL RAWMASTER                                                       */}
      {/* ========================================================================= */}
      {activePluginTab === 'raw-master' && (
        <div className="bg-[#121217] border-4 border-black p-6 md:p-8 shadow-brutal">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b-2 border-zinc-800 pb-4 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-emerald-500 text-black px-2 py-0.5 text-xs font-bold uppercase">
                  PLUGIN 05
                </span>
                <h2 className="font-stencil text-2xl md:text-3xl text-zinc-50 tracking-wider">
                  RAWMASTER // BRICKWALL LIMITER &amp; LUFS MAXIMIZER
                </h2>
              </div>
              <p className="text-xs text-zinc-400 mt-1">
                Limitador True-Peak com lookahead para entregar o volume comercial final no Spotify e Bandcamp sem esmagar transientes e sem distorção interamostral.
              </p>
            </div>
            <a
              href="https://github.com/FelipeGardenghiDev/underground-tools/tree/main/plugins/raw-master"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold px-3 py-1.5 border-2 border-black shadow-brutal flex items-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5" /> Código C++ no GitHub
            </a>
          </div>

          <div className="bg-[#1a1a22] border-4 border-zinc-950 p-6 shadow-inner rounded-sm space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-black/60 p-4 border border-zinc-800 space-y-2">
                <span className="text-xs text-zinc-400 font-bold block">TARGET PRESET:</span>
                <div className="flex flex-col gap-1.5">
                  <button
                    onClick={() => setMasterPreset('streaming')}
                    className={`px-3 py-2 text-xs font-bold text-left border ${
                      masterPreset === 'streaming'
                        ? 'bg-emerald-500 text-black border-black'
                        : 'bg-black text-zinc-300 border-zinc-800 hover:border-zinc-600'
                    }`}
                  >
                    1. Streaming (-14.0 LUFS) • Padrão Spotify/Apple
                  </button>
                  <button
                    onClick={() => setMasterPreset('cd')}
                    className={`px-3 py-2 text-xs font-bold text-left border ${
                      masterPreset === 'cd'
                        ? 'bg-emerald-500 text-black border-black'
                        : 'bg-black text-zinc-300 border-zinc-800 hover:border-zinc-600'
                    }`}
                  >
                    2. Loud CD (-9.0 LUFS) • Bandcamp &amp; Rock Quente
                  </button>
                  <button
                    onClick={() => setMasterPreset('wall')}
                    className={`px-3 py-2 text-xs font-bold text-left border ${
                      masterPreset === 'wall'
                        ? 'bg-emerald-500 text-black border-black'
                        : 'bg-black text-zinc-300 border-zinc-800 hover:border-zinc-600'
                    }`}
                  >
                    3. Raw Wall (-7.0 LUFS) • Paredão Post-Hardcore
                  </button>
                </div>
              </div>

              <div className="bg-black/60 p-4 border border-zinc-800 text-center flex flex-col justify-between">
                <div>
                  <span className="text-xs text-zinc-400 font-bold block mb-1">TRUE-PEAK CEILING</span>
                  <div className="bg-black border border-zinc-700 py-3 my-2">
                    <span className="text-xl font-bold text-emerald-400">{ceilingVal} dBFS</span>
                  </div>
                  <span className="text-[10px] text-zinc-500 block">
                    Trava estrita com lookahead de 1.5ms para evitar clips na conversão MP3.
                  </span>
                </div>
              </div>

              <div className="bg-black/60 p-4 border border-zinc-800 text-center flex flex-col justify-between">
                <div>
                  <span className="text-xs text-zinc-400 font-bold block mb-1">MÉTRICA EM TEMPO REAL</span>
                  <div className="bg-black border border-zinc-700 py-3 my-2">
                    <span className="text-xl font-bold text-yellow-400">
                      {masterPreset === 'streaming' ? '-14.0 LUFS' : masterPreset === 'cd' ? '-9.1 LUFS' : '-7.2 LUFS'}
                    </span>
                  </div>
                  <span className="text-[10px] text-zinc-500 block">
                    Conforme norma ITU-R BS.1770 K-Weighting.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VSTi SUITE SHOWCASE                                                       */}
      {/* ========================================================================= */}
      <div className="space-y-4 pt-4">
        <div className="border-b-2 border-zinc-800 pb-2 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="bg-purple-600 text-white px-2 py-0.5 text-xs font-bold uppercase">
              INSTRUMENTOS
            </span>
            <h3 className="font-stencil text-xl text-zinc-100 tracking-wider">
              A TRINDADE DE INSTRUMENTOS VIRTUAIS (VSTi)
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#121217] border-2 border-zinc-800 p-5 shadow-brutal flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-2">
                <span className="font-stencil text-lg text-yellow-400">🥁 MIDWESTKIT</span>
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
          ONDE INSTALAR O ARQUIVO .VST3 OU .CLAP NO SEU COMPUTADOR:
        </div>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Windows:</strong> <code className="text-yellow-400">C:\Program Files\Common Files\VST3</code> ou <code className="text-yellow-400">C:\Program Files\Common Files\CLAP</code></li>
          <li><strong>macOS:</strong> <code className="text-yellow-400">/Library/Audio/Plug-Ins/VST3</code> ou <code className="text-yellow-400">/Library/Audio/Plug-Ins/CLAP</code></li>
          <li><strong>Linux:</strong> <code className="text-yellow-400">~/.vst3</code> ou <code className="text-yellow-400">~/.clap</code></li>
        </ul>
        <p className="text-[11px] text-zinc-500 pt-2">
          Após copiar o arquivo, abra sua DAW favorita (Reaper, FL Studio, Ableton Live, Logic, Studio One, Bitwig, Cubase) e faça um rescan de plugins.
        </p>
      </div>
    </div>
  );
}
