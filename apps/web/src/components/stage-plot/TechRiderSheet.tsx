'use client';

import React from 'react';
import { InputListChannel, StageItem, TechRider } from '@/types';
import { Printer, Phone, Mail, User, Clock, AlertTriangle, ShieldCheck } from 'lucide-react';

interface TechRiderSheetProps {
  rider: TechRider;
  stageItems: StageItem[];
  inputList: InputListChannel[];
  onUpdateRider: (rider: TechRider) => void;
  onPrint: () => void;
}

export function TechRiderSheet({
  rider,
  stageItems,
  inputList,
  onUpdateRider,
  onPrint,
}: TechRiderSheetProps) {
  const handleChange = (field: keyof TechRider, value: any) => {
    onUpdateRider({ ...rider, [field]: value });
  };

  return (
    <div className="space-y-6">
      {/* Top action bar */}
      <div className="bg-zinc-900 border-2 border-zinc-700 p-4 flex flex-wrap items-center justify-between gap-4 no-print">
        <div>
          <span className="text-xs font-mono font-bold text-rose-500 uppercase tracking-widest block">
            RIDER TÉCNICO // TECH RIDER & HOSPITALIDADE
          </span>
          <p className="text-xs text-zinc-400 font-mono">
            Documento técnico formal enviado à produção do evento e operador de P.A.
          </p>
        </div>

        <button
          onClick={onPrint}
          className="bg-yellow-400 hover:bg-yellow-300 text-black font-mono font-bold text-xs uppercase px-4 py-2.5 border-2 border-black shadow-brutal flex items-center gap-2 active:scale-95 transition-all"
        >
          <Printer className="w-4 h-4" />
          Imprimir / Salvar PDF (A4)
        </button>
      </div>

      {/* RIDER SHEET (Dual purpose: editable on screen, cleanly printed on paper) */}
      <div className="bg-[#121214] border-2 border-zinc-800 p-6 shadow-brutal space-y-6 print-card text-zinc-200">
        {/* Document Header */}
        <div className="border-b-4 border-zinc-700 pb-4 flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="inline-block bg-rose-600 text-white font-mono text-[10px] font-bold px-2 py-0.5 uppercase tracking-widest mb-1">
              RIDER TÉCNICO OFICIAL
            </div>
            <h2 className="font-stencil text-3xl tracking-wider text-white">
              {rider.bandName}
            </h2>
            <p className="text-xs font-mono text-zinc-400">
              Gerado via Underground Tools • Documento válido para eventos e festivais
            </p>
          </div>

          <div className="bg-black/60 p-3 border border-zinc-800 text-right font-mono text-xs space-y-1">
            <div className="text-yellow-400 font-bold">CONTATO DE PRODUÇÃO / ESTRADA:</div>
            <div className="text-zinc-200">{rider.contactName} ({rider.contactRole})</div>
            <div className="text-zinc-400 flex items-center justify-end gap-1">
              <Phone className="w-3 h-3 text-rose-500" /> {rider.contactPhone}
            </div>
            <div className="text-zinc-400 flex items-center justify-end gap-1">
              <Mail className="w-3 h-3 text-rose-500" /> {rider.contactEmail}
            </div>
          </div>
        </div>

        {/* Section 1: Contacts & Timings */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-black/40 border border-zinc-800 p-3 space-y-1">
            <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block">
              Passagem de Som (Soundcheck)
            </span>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-yellow-400" />
              <input
                type="number"
                value={rider.soundCheckDurationMin}
                onChange={(e) => handleChange('soundCheckDurationMin', parseInt(e.target.value) || 0)}
                className="w-16 bg-black border border-zinc-700 px-2 py-1 font-mono text-sm font-bold text-white focus:outline-none"
              />
              <span className="text-xs font-mono text-zinc-400">minutos (mínimo)</span>
            </div>
          </div>

          <div className="bg-black/40 border border-zinc-800 p-3 space-y-1">
            <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block">
              Vias de Monitor
            </span>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={rider.monitorMixesCount}
                onChange={(e) => handleChange('monitorMixesCount', parseInt(e.target.value) || 0)}
                className="w-16 bg-black border border-zinc-700 px-2 py-1 font-mono text-sm font-bold text-white focus:outline-none"
              />
              <span className="text-xs font-mono text-zinc-400">vias independentes</span>
            </div>
          </div>

          <div className="bg-black/40 border border-zinc-800 p-3 space-y-1">
            <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block">
              Aterramento elétrico
            </span>
            <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Obrigatório 3 pinos terra no palco</span>
            </div>
          </div>
        </div>

        {/* Section 2: P.A. & Monitoring Specs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
          <div className="border border-zinc-800 p-3 space-y-2 bg-black/30">
            <label className="text-[11px] font-bold text-yellow-400 uppercase tracking-wider block">
              01. Exigências de P.A. (Front of House)
            </label>
            <textarea
              rows={3}
              value={rider.paRequirements}
              onChange={(e) => handleChange('paRequirements', e.target.value)}
              className="w-full bg-black border border-zinc-700 text-zinc-300 p-2 text-xs focus:border-rose-500 focus:outline-none"
            />
          </div>

          <div className="border border-zinc-800 p-3 space-y-2 bg-black/30">
            <label className="text-[11px] font-bold text-yellow-400 uppercase tracking-wider block">
              02. Exigências de Monitoração de Palco
            </label>
            <textarea
              rows={3}
              value={rider.monitorRequirements}
              onChange={(e) => handleChange('monitorRequirements', e.target.value)}
              className="w-full bg-black border border-zinc-700 text-zinc-300 p-2 text-xs focus:border-rose-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Section 3: Iluminação & Hospitalidade */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
          <div className="border border-zinc-800 p-3 space-y-2 bg-black/30">
            <label className="text-[11px] font-bold text-zinc-300 uppercase tracking-wider block">
              03. Iluminação & Atmosfera
            </label>
            <textarea
              rows={3}
              value={rider.lightingNotes}
              onChange={(e) => handleChange('lightingNotes', e.target.value)}
              className="w-full bg-black border border-zinc-700 text-zinc-300 p-2 text-xs focus:border-rose-500 focus:outline-none"
            />
          </div>

          <div className="border border-zinc-800 p-3 space-y-2 bg-black/30">
            <label className="text-[11px] font-bold text-zinc-300 uppercase tracking-wider block">
              04. Hospitalidade / Camarim (Bebida & Comida)
            </label>
            <textarea
              rows={3}
              value={rider.hospitalityNotes}
              onChange={(e) => handleChange('hospitalityNotes', e.target.value)}
              className="w-full bg-black border border-zinc-700 text-zinc-300 p-2 text-xs focus:border-rose-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Section 4: Additional Notes / Cláusula de Respeito Underground */}
        <div className="border border-zinc-800 p-3 bg-black/50 font-mono text-xs space-y-2">
          <label className="text-[11px] font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
            05. Observações Gerais & Segurança
          </label>
          <textarea
            rows={2}
            value={rider.additionalNotes}
            onChange={(e) => handleChange('additionalNotes', e.target.value)}
            className="w-full bg-black border border-zinc-700 text-zinc-300 p-2 text-xs focus:border-rose-500 focus:outline-none"
          />
        </div>

        {/* Stage Summary for Print */}
        <div className="pt-2 border-t border-zinc-800 font-mono text-[11px] text-zinc-500 flex justify-between items-center">
          <span>Mapa de palco acoplado: {stageItems.length} itens posicionados</span>
          <span>Input list acoplada: {inputList.length} canais patch</span>
        </div>
      </div>
    </div>
  );
}
