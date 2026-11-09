'use client';

import React, { useState, useEffect } from 'react';
import { Navigation, ActiveTab } from '@/components/Navigation';
import { StageCanvas } from '@/components/stage-plot/StageCanvas';
import { InputListTable } from '@/components/stage-plot/InputListTable';
import { TechRiderSheet } from '@/components/stage-plot/TechRiderSheet';
import { TapeSetlistView } from '@/components/setlist/TapeSetlistView';
import { RoadGuideView } from '@/components/guide/RoadGuideView';
import { EpkView } from '@/components/epk/EpkView';
import { GigManager } from '@/components/shows/GigManager';
import { MerchPixStore } from '@/components/merch/MerchPixStore';
import { ManifestoView } from '@/components/manifesto/ManifestoView';
import { EmoPluginsView } from '@/components/plugins/EmoPluginsView';
import {
  loadStoredData,
  saveStoredData,
  exportBackupFile,
  importBackupFile,
  AppStoredData,
} from '@/lib/storage';
import { decodeShareData, ShareableStageData } from '@/lib/share-link';
import { 
  Sliders, 
  ListOrdered, 
  FileText, 
  Printer, 
  Download, 
  CheckCircle2, 
  Sparkles,
  Layers,
  Share2,
  ExternalLink
} from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('stage_plot');
  const [stageSubTab, setStageSubTab] = useState<'canvas' | 'input_list' | 'rider'>('canvas');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [sharedData, setSharedData] = useState<ShareableStageData | null>(null);

  // App Domain State
  const [data, setData] = useState<AppStoredData | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const loaded = loadStoredData();
    setData(loaded);
  }, []);

  // Check URL Hash for shared stage plot/rider on mount & hashchange (0 cost, 0 database)
  useEffect(() => {
    const handleHash = async () => {
      if (typeof window === 'undefined') return;
      const hash = window.location.hash;
      if (hash.startsWith('#plot=') || hash.startsWith('#rider=')) {
        const token = hash.replace(/^#(plot|rider)=/, '');
        const decoded = await decodeShareData(token);
        if (decoded) {
          setSharedData(decoded);
          setActiveTab('stage_plot');
          setToastMessage(`Modo Convidado: Carregado mapa de "${decoded.bandName}"!`);
          setTimeout(() => setToastMessage(null), 3500);
        }
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Save to localStorage on local state change (only if not viewing shared data)
  useEffect(() => {
    if (data && !sharedData) {
      saveStoredData(data);
    }
  }, [data, sharedData]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Trigger print mode
  const handlePrint = () => {
    window.print();
  };

  // Export backup
  const handleExportBackup = () => {
    if (!data) return;
    exportBackupFile(data);
    showToast('Backup da banda baixado com sucesso!');
  };

  // Import backup
  const handleImportBackup = async (file: File) => {
    try {
      const imported = await importBackupFile(file);
      setData(imported);
      setSharedData(null);
      showToast(`Dados da banda "${imported.profile.name}" restaurados!`);
    } catch (err) {
      alert('Arquivo inválido ou corrompido.');
    }
  };

  // Save shared guest setup to local database (overwriting or adopting it)
  const handleSaveSharedToLocal = () => {
    if (!sharedData || !data) return;
    const merged: AppStoredData = {
      ...data,
      profile: {
        ...data.profile,
        name: sharedData.bandName || data.profile.name,
      },
      stageItems: sharedData.stageItems,
      inputList: sharedData.inputList || data.inputList,
      techRider: sharedData.techRider ? { ...data.techRider, ...sharedData.techRider } : data.techRider,
    };
    setData(merged);
    saveStoredData(merged);
    setSharedData(null);
    window.history.replaceState(null, '', window.location.pathname);
    showToast(`Setup de "${sharedData.bandName}" salvo com sucesso no seu Underground Tools!`);
  };

  // Exit guest shared view
  const handleExitSharedView = () => {
    setSharedData(null);
    window.history.replaceState(null, '', window.location.pathname);
    showToast('Retornado para os dados locais da sua banda.');
  };

  if (!data) {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center font-mono text-zinc-400 text-xs">
        Carregando Underground Tools...
      </div>
    );
  }

  // Active data sources (either shared link or local storage)
  const activeBandName = sharedData?.bandName || data.profile.name;
  const activeStageItems = sharedData?.stageItems || data.stageItems;
  const activeInputList = sharedData?.inputList || data.inputList;
  const activeTechRider = sharedData?.techRider ? { ...data.techRider, ...sharedData.techRider } : data.techRider;

  return (
    <div className="min-h-screen flex flex-col bg-[#080808] text-zinc-100">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-yellow-400 text-black font-mono font-bold text-xs px-4 py-3 border-2 border-black shadow-brutal flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-black" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Guest Mode Shareable Banner */}
      {sharedData && (
        <div className="bg-yellow-400 text-black px-4 py-2.5 border-b-4 border-black font-mono flex flex-wrap items-center justify-between gap-3 shadow-brutal z-40 sticky top-0 no-print">
          <div className="flex items-center gap-2">
            <span className="bg-black text-yellow-400 text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider border border-black">
              MODO CONVIDADO // LINK DIRETO
            </span>
            <span className="text-xs font-bold uppercase">
              Visualizando Palco &amp; Rider de: <strong className="underline decoration-2">{activeBandName}</strong>
            </span>
            <span className="text-[11px] text-zinc-800 hidden md:inline">
              (Sem banco de dados • Gerado em {new Date(sharedData.sharedAt).toLocaleDateString('pt-BR')})
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSaveSharedToLocal}
              className="bg-black hover:bg-zinc-800 text-white font-bold text-xs uppercase px-3 py-1.5 border-2 border-black shadow-brutal-sm flex items-center gap-1.5 transition-all active:scale-95"
              title="Copiar este setup para o seu banco local"
            >
              <Download className="w-3.5 h-3.5 text-yellow-400" />
              Salvar no Meu Underground Tools
            </button>

            <button
              onClick={handleExitSharedView}
              className="bg-zinc-200 hover:bg-white text-black font-bold text-xs uppercase px-3 py-1.5 border-2 border-black shadow-brutal-sm transition-all active:scale-95"
            >
              Voltar pros Meus Dados
            </button>
          </div>
        </div>
      )}

      {/* App Navigation */}
      <div className="no-print">
        <Navigation
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onPrintRider={handlePrint}
          onExportBackup={handleExportBackup}
          onImportBackup={handleImportBackup}
          bandName={activeBandName}
        />
      </div>

      {/* Main Screen Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 no-print">
        {/* TAB 1: MANIFESTO & HUB */}
        {activeTab === 'manifesto' && (
          <ManifestoView onSelectTab={(tab) => setActiveTab(tab)} />
        )}

        {/* TAB 2: STAGE PLOT & RIDER */}
        {activeTab === 'stage_plot' && (
          <div className="space-y-6">
            {/* Sub-tabs for Stage Plot */}
            <div className="bg-[#121215] border-2 border-zinc-800 p-2 flex flex-wrap items-center justify-between gap-2 shadow-brutal">
              <div className="flex items-center space-x-1 sm:space-x-2">
                <button
                  onClick={() => setStageSubTab('canvas')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-bold uppercase transition-all ${
                    stageSubTab === 'canvas'
                      ? 'bg-rose-600 text-white border-2 border-black shadow-brutal-sm'
                      : 'text-zinc-400 hover:text-white bg-black/40 border border-zinc-800'
                  }`}
                >
                  <Sliders className="w-3.5 h-3.5" />
                  01. Palco Visual (Stage Plot)
                </button>

                <button
                  onClick={() => setStageSubTab('input_list')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-bold uppercase transition-all ${
                    stageSubTab === 'input_list'
                      ? 'bg-yellow-400 text-black border-2 border-black shadow-brutal-sm'
                      : 'text-zinc-400 hover:text-white bg-black/40 border border-zinc-800'
                  }`}
                >
                  <ListOrdered className="w-3.5 h-3.5" />
                  02. Input List ({activeInputList.length} Canais)
                </button>

                <button
                  onClick={() => setStageSubTab('rider')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-bold uppercase transition-all ${
                    stageSubTab === 'rider'
                      ? 'bg-zinc-100 text-black border-2 border-black shadow-brutal-sm'
                      : 'text-zinc-400 hover:text-white bg-black/40 border border-zinc-800'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  03. Rider Técnico Completo
                </button>
              </div>

              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 bg-yellow-400 hover:bg-yellow-300 text-black font-mono font-bold text-xs uppercase px-3 py-1.5 border-2 border-black shadow-brutal-sm active:scale-95 transition-all"
              >
                <Printer className="w-3.5 h-3.5" />
                Imprimir Documento F.O.H. (PDF)
              </button>
            </div>

            {/* Sub-tab view */}
            {stageSubTab === 'canvas' && (
              <StageCanvas
                items={activeStageItems}
                onUpdateItems={(items) => {
                  if (sharedData) {
                    setSharedData({ ...sharedData, stageItems: items });
                  } else {
                    setData({ ...data, stageItems: items });
                  }
                }}
                bandName={activeBandName}
                inputList={activeInputList}
                techRider={activeTechRider}
                onToast={showToast}
              />
            )}

            {stageSubTab === 'input_list' && (
              <InputListTable
                channels={activeInputList}
                onUpdateChannels={(channels) => {
                  if (sharedData) {
                    setSharedData({ ...sharedData, inputList: channels });
                  } else {
                    setData({ ...data, inputList: channels });
                  }
                }}
              />
            )}

            {stageSubTab === 'rider' && (
              <TechRiderSheet
                rider={activeTechRider}
                stageItems={activeStageItems}
                inputList={activeInputList}
                onUpdateRider={(rider) => {
                  if (sharedData) {
                    setSharedData({ ...sharedData, techRider: rider });
                  } else {
                    setData({ ...data, techRider: rider });
                  }
                }}
                onPrint={handlePrint}
                onToast={showToast}
              />
            )}
          </div>
        )}

        {/* TAB 3: TAPE SETLIST (CHÃO DE PALCO) */}
        {activeTab === 'setlist' && (
          <TapeSetlistView
            setlist={data.setlist}
            bandName={data.profile.name}
            onUpdateSetlist={(setlist) => setData({ ...data, setlist })}
          />
        )}

        {/* TAB 4: GUIA DE ESTRADA (PALCO PRO) */}
        {activeTab === 'guide' && <RoadGuideView />}

        {/* TAB 5: EPK (PRESS KIT) */}
        {activeTab === 'epk' && (
          <EpkView
            profile={data.profile}
            onUpdateProfile={(profile) => setData({ ...data, profile })}
          />
        )}

        {/* TAB 6: GIGS / SHOWS */}
        {activeTab === 'gigs' && (
          <GigManager
            gigs={data.gigs}
            onUpdateGigs={(gigs) => setData({ ...data, gigs })}
          />
        )}

        {/* TAB 7: MERCH & PIX */}
        {activeTab === 'merch' && (
          <MerchPixStore
            merch={data.merch}
            profile={data.profile}
            onUpdateMerch={(merch) => setData({ ...data, merch })}
          />
        )}

        {/* TAB 8: EMO AUDIO TOOLS (PLUGINS VST3/CLAP) */}
        {activeTab === 'plugins' && <EmoPluginsView />}
      </main>

      {/* ========================================================================= */}
      {/* DEDICATED PRINT VIEW 1: TECH RIDER & STAGE PLOT (A4)                      */}
      {/* ========================================================================= */}
      {activeTab !== 'setlist' && (
        <div className="hidden print-only p-8 text-black bg-white font-mono text-xs">
          {/* Document Header */}
          <div className="border-b-4 border-black pb-4 mb-6 flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-black uppercase tracking-tight">{activeBandName}</h1>
              <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-800">
                RIDER TÉCNICO &amp; MAPA DE PALCO // STAGE PLOT
              </h2>
              <p className="text-[10px] text-neutral-600 mt-1">
                Documento emitido via Underground Tools (underground-tools) • Para F.O.H. &amp; Operadores de Palco
              </p>
            </div>
            <div className="text-right border-2 border-black p-2 text-[10px]">
              <div className="font-bold">PRODUÇÃO DE ESTRADA:</div>
              <div>{activeTechRider.contactName} ({activeTechRider.contactRole})</div>
              <div>Tel: {activeTechRider.contactPhone}</div>
              <div>Email: {activeTechRider.contactEmail}</div>
            </div>
          </div>

          {/* Essential Specs Grid */}
          <div className="grid grid-cols-3 gap-3 border-2 border-black p-3 mb-6 bg-neutral-100">
            <div>
              <span className="font-bold block uppercase text-[10px]">Passagem de Som:</span>
              <span>Mínimo {activeTechRider.soundCheckDurationMin} minutos</span>
            </div>
            <div>
              <span className="font-bold block uppercase text-[10px]">Vias de Monitor:</span>
              <span>{activeTechRider.monitorMixesCount} vias independentes</span>
            </div>
            <div>
              <span className="font-bold block uppercase text-[10px]">Aterramento elétrico:</span>
              <span>3 pinos terra no palco (obrigatório)</span>
            </div>
          </div>

          {/* Input List Table for Print */}
          <div className="mb-6">
            <h3 className="font-bold uppercase tracking-wider mb-2 border-b-2 border-black pb-1">
              INPUT LIST // TABELA DE CANAIS ({activeInputList.length} CANAIS)
            </h3>
            <table className="w-full border-collapse border-2 border-black text-[11px]">
              <thead>
                <tr className="bg-neutral-200 border-b-2 border-black text-left">
                  <th className="border border-black p-1.5 text-center w-12">CH #</th>
                  <th className="border border-black p-1.5">Instrumento</th>
                  <th className="border border-black p-1.5">Microfone / D.I.</th>
                  <th className="border border-black p-1.5">Pedestal</th>
                  <th className="border border-black p-1.5 text-center w-16">+48V</th>
                  <th className="border border-black p-1.5">Notas / EQ</th>
                </tr>
              </thead>
              <tbody>
                {activeInputList.map((ch) => (
                  <tr key={ch.channelNumber} className="border-b border-black">
                    <td className="border border-black p-1 text-center font-bold">
                      {String(ch.channelNumber).padStart(2, '0')}
                    </td>
                    <td className="border border-black p-1 font-bold">{ch.instrument}</td>
                    <td className="border border-black p-1">{ch.micOrDi}</td>
                    <td className="border border-black p-1">{ch.standType}</td>
                    <td className="border border-black p-1 text-center font-bold">
                      {ch.phantom48v ? 'SIM' : '-'}
                    </td>
                    <td className="border border-black p-1 text-[10px]">{ch.notes || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Stage Plot Schematic */}
          <div className="mb-6 border-2 border-black p-4">
            <h3 className="font-bold uppercase tracking-wider mb-2 text-center text-xs">
              ESQUEMA DO MAPA DE PALCO (VISTO DE FRENTE DA CASA / FOH)
            </h3>
            <div className="relative w-full h-[260px] border border-dashed border-neutral-400 bg-neutral-50 mb-2">
              <div className="absolute top-1 inset-x-0 text-center text-[9px] text-neutral-500 uppercase">
                ▲ FUNDO DE PALCO // PAREDE ▲
              </div>
              {activeStageItems.map((item) => (
                <div
                  key={item.id}
                  style={{
                    left: `${item.x}%`,
                    top: `${item.y}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                  className="absolute border border-black bg-white px-1.5 py-0.5 text-[9px] font-bold text-center"
                >
                  {item.shortLabel} {item.channelNumber ? `(CH ${item.channelNumber})` : ''}
                </div>
              ))}
              <div className="absolute bottom-1 inset-x-0 text-center text-[9px] font-bold uppercase border-t border-black bg-neutral-200 py-0.5">
                ▼ FRENTE DE PALCO // PÚBLICO ▼
              </div>
            </div>
          </div>

          {/* Technical Requirements & Hospitality */}
          <div className="grid grid-cols-2 gap-4 text-[10px]">
            <div className="border border-black p-2">
              <strong className="block uppercase mb-1">Requisitos de P.A.:</strong>
              <p>{activeTechRider.paRequirements}</p>
            </div>
            <div className="border border-black p-2">
              <strong className="block uppercase mb-1">Requisitos de Monitor:</strong>
              <p>{activeTechRider.monitorRequirements}</p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* DEDICATED PRINT VIEW 2: TAPE SETLIST (GIANT STAGE LETTERS)                */}
      {/* ========================================================================= */}
      {activeTab === 'setlist' && (
        <div className="hidden print-only p-8 text-black bg-white font-mono print-setlist">
          <div className="border-b-8 border-black pb-4 mb-6 flex justify-between items-end">
            <div>
              <span className="text-xl font-black uppercase tracking-widest block">SETLIST DE PALCO</span>
              <h1 className="text-6xl font-black uppercase tracking-tighter">{data.profile.name}</h1>
            </div>
            <div className="text-2xl font-black border-4 border-black px-4 py-2">
              {data.setlist.length} MÚSICAS
            </div>
          </div>

          <div className="space-y-4">
            {data.setlist.map((song) => (
              <div
                key={song.id}
                className={`flex items-center justify-between border-b-4 border-black pb-3 ${
                  song.isEncore ? 'border-dashed pt-4' : ''
                }`}
              >
                <div className="flex items-center gap-6">
                  <span className="text-5xl font-black w-14 text-center">
                    {String(song.order).padStart(2, '0')}
                  </span>
                  <div>
                    <div className="text-4xl font-black uppercase tracking-tight">
                      {song.title} {song.isEncore ? '(BIS)' : ''}
                    </div>
                    {song.notes && (
                      <div className="text-sm font-bold text-neutral-700 italic">
                        ↳ {song.notes}
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-black border-2 border-black px-3 py-1 inline-block uppercase">
                    {song.tuning}
                  </div>
                  {song.bpm && (
                    <div className="text-sm font-bold text-neutral-600 mt-1">{song.bpm} BPM</div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center text-sm font-bold uppercase border-t-2 border-dashed border-black pt-4">
            UNDERGROUND TOOLS • RESPEITE O HORÁRIO DO FESTIVAL • CÓDIGO ABERTO
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t-4 border-zinc-800 bg-[#060607] py-6 px-4 font-mono text-xs text-zinc-500 text-center no-print">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-stencil text-zinc-300 text-base">UNDERGROUND TOOLS</span>
            <span>• Repositório open-source sob licença MIT</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <a
              href="https://github.com/FelipeGardenghiDev/underground-tools"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 hover:text-rose-500 underline"
            >
              github.com/FelipeGardenghiDev/underground-tools
            </a>
            <span>Feito para a cena independente</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
