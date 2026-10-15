'use client';

import React, { useState } from 'react';
import { InputListChannel } from '@/types';
import { Plus, Trash2, Zap, AlertCircle } from 'lucide-react';

interface InputListTableProps {
  channels: InputListChannel[];
  onUpdateChannels: (channels: InputListChannel[]) => void;
}

export function InputListTable({ channels, onUpdateChannels }: InputListTableProps) {
  const [newInstrument, setNewInstrument] = useState('');
  const [newMic, setNewMic] = useState('Shure SM57');
  const [newStand, setNewStand] = useState<InputListChannel['standType']>('Short Boom');
  const [new48v, setNew48v] = useState(false);
  const [newNotes, setNewNotes] = useState('');

  const handleAddChannel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInstrument.trim()) return;

    const nextChannelNum = channels.length > 0 ? Math.max(...channels.map((c) => c.channelNumber)) + 1 : 1;

    const newChannel: InputListChannel = {
      channelNumber: nextChannelNum,
      instrument: newInstrument.trim(),
      micOrDi: newMic.trim(),
      standType: newStand,
      phantom48v: new48v,
      notes: newNotes.trim() || undefined,
    };

    onUpdateChannels([...channels, newChannel]);
    setNewInstrument('');
    setNewNotes('');
    setNew48v(false);
  };

  const handleDeleteChannel = (channelNumber: number) => {
    const updated = channels
      .filter((c) => c.channelNumber !== channelNumber)
      .map((c, idx) => ({ ...c, channelNumber: idx + 1 })); // re-index channels
    onUpdateChannels(updated);
  };

  const handleToggle48V = (channelNumber: number) => {
    onUpdateChannels(
      channels.map((c) => (c.channelNumber === channelNumber ? { ...c, phantom48v: !c.phantom48v } : c))
    );
  };

  const handleUpdateField = (channelNumber: number, field: keyof InputListChannel, value: any) => {
    onUpdateChannels(
      channels.map((c) => (c.channelNumber === channelNumber ? { ...c, [field]: value } : c))
    );
  };

  const phantomCount = channels.filter((c) => c.phantom48v).length;

  return (
    <div className="space-y-4">
      {/* Header bar */}
      <div className="bg-zinc-900 border-2 border-zinc-700 p-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="text-xs font-mono font-bold text-yellow-400 uppercase tracking-widest block">
            TABELA DE CANAIS // INPUT LIST
          </span>
          <p className="text-xs text-zinc-400 font-mono">
            Lista de patch para a mesa de som / F.O.H. Especificações de microfone, pedestais e Direct Box.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="bg-black text-zinc-300 px-2 py-1 border border-zinc-700">
            Total Canais: <strong className="text-white">{channels.length}</strong>
          </span>
          <span className="bg-black text-rose-400 px-2 py-1 border border-zinc-700 flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 fill-rose-500" />
            +48V Requerido: <strong>{phantomCount} vias</strong>
          </span>
        </div>
      </div>

      {/* Input List Table */}
      <div className="overflow-x-auto border-2 border-zinc-800 shadow-brutal">
        <table className="w-full text-left font-mono text-xs text-zinc-300 bg-[#0d0d0f]">
          <thead className="bg-black text-zinc-100 uppercase tracking-wider text-[11px] border-b-2 border-zinc-700">
            <tr>
              <th className="py-2.5 px-3 w-16 text-center">CH #</th>
              <th className="py-2.5 px-3 min-w-[140px]">Instrumento / Fonte</th>
              <th className="py-2.5 px-3 min-w-[160px]">Mic / D.I. Sugerido</th>
              <th className="py-2.5 px-3 min-w-[120px]">Pedestal</th>
              <th className="py-2.5 px-3 w-24 text-center">+48V</th>
              <th className="py-2.5 px-3 min-w-[180px]">Observações Técnicas</th>
              <th className="py-2.5 px-3 w-12 text-center no-print">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {channels.map((ch) => (
              <tr key={ch.channelNumber} className="hover:bg-zinc-900/60 transition-colors">
                {/* Channel Number */}
                <td className="py-2 px-3 text-center font-bold text-yellow-400 bg-black/40">
                  {String(ch.channelNumber).padStart(2, '0')}
                </td>

                {/* Instrument */}
                <td className="py-2 px-3">
                  <input
                    type="text"
                    value={ch.instrument}
                    onChange={(e) => handleUpdateField(ch.channelNumber, 'instrument', e.target.value)}
                    className="w-full bg-transparent border-b border-transparent hover:border-zinc-700 focus:border-rose-500 focus:bg-black px-1 py-0.5 text-zinc-100 font-bold focus:outline-none"
                  />
                </td>

                {/* Mic / D.I. */}
                <td className="py-2 px-3">
                  <input
                    type="text"
                    value={ch.micOrDi}
                    onChange={(e) => handleUpdateField(ch.channelNumber, 'micOrDi', e.target.value)}
                    className="w-full bg-transparent border-b border-transparent hover:border-zinc-700 focus:border-rose-500 focus:bg-black px-1 py-0.5 text-zinc-300 focus:outline-none"
                  />
                </td>

                {/* Stand Type */}
                <td className="py-2 px-3">
                  <select
                    value={ch.standType}
                    onChange={(e) => handleUpdateField(ch.channelNumber, 'standType', e.target.value)}
                    className="bg-zinc-900 border border-zinc-700 text-zinc-300 text-[11px] px-1.5 py-1 focus:border-rose-500 focus:outline-none"
                  >
                    <option value="Tall Boom">Girafa Alto</option>
                    <option value="Short Boom">Girafa Baixo</option>
                    <option value="Straight">Reto</option>
                    <option value="Clip">Garra / Clip</option>
                    <option value="None">Sem pedestal (D.I.)</option>
                  </select>
                </td>

                {/* +48V Toggle */}
                <td className="py-2 px-3 text-center">
                  <button
                    onClick={() => handleToggle48V(ch.channelNumber)}
                    className={`px-2 py-0.5 text-[10px] font-bold border transition-colors ${
                      ch.phantom48v
                        ? 'bg-rose-950 border-rose-500 text-rose-300 shadow-[0_0_8px_rgba(225,29,72,0.4)]'
                        : 'bg-zinc-900 border-zinc-700 text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    {ch.phantom48v ? '48V ON' : 'OFF'}
                  </button>
                </td>

                {/* Notes */}
                <td className="py-2 px-3">
                  <input
                    type="text"
                    value={ch.notes || ''}
                    placeholder="Instruções de EQ / posicionamento..."
                    onChange={(e) => handleUpdateField(ch.channelNumber, 'notes', e.target.value)}
                    className="w-full bg-transparent border-b border-transparent hover:border-zinc-700 focus:border-rose-500 focus:bg-black px-1 py-0.5 text-zinc-400 placeholder:text-zinc-600 focus:outline-none text-[11px]"
                  />
                </td>

                {/* Delete */}
                <td className="py-2 px-3 text-center no-print">
                  <button
                    onClick={() => handleDeleteChannel(ch.channelNumber)}
                    className="text-zinc-600 hover:text-rose-500 transition-colors p-1"
                    title="Remover canal"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add New Channel Form */}
      <form
        onSubmit={handleAddChannel}
        className="bg-zinc-900/80 border-2 border-dashed border-zinc-700 p-3 flex flex-wrap items-end gap-3 text-xs font-mono no-print"
      >
        <div className="flex-1 min-w-[150px]">
          <label className="text-[10px] text-zinc-400 uppercase tracking-wider block mb-1">
            + Novo Instrumento
          </label>
          <input
            type="text"
            required
            placeholder="Ex: Teclado L / Voz Convidado"
            value={newInstrument}
            onChange={(e) => setNewInstrument(e.target.value)}
            className="w-full bg-black border border-zinc-700 text-white px-2 py-1.5 focus:border-rose-500 focus:outline-none"
          />
        </div>

        <div className="min-w-[140px]">
          <label className="text-[10px] text-zinc-400 uppercase tracking-wider block mb-1">
            Microfone / D.I.
          </label>
          <input
            type="text"
            value={newMic}
            onChange={(e) => setNewMic(e.target.value)}
            className="w-full bg-black border border-zinc-700 text-white px-2 py-1.5 focus:border-rose-500 focus:outline-none"
          />
        </div>

        <div className="min-w-[120px]">
          <label className="text-[10px] text-zinc-400 uppercase tracking-wider block mb-1">
            Pedestal
          </label>
          <select
            value={newStand}
            onChange={(e) => setNewStand(e.target.value as any)}
            className="w-full bg-black border border-zinc-700 text-white px-2 py-1.5 focus:border-rose-500 focus:outline-none"
          >
            <option value="Tall Boom">Girafa Alto</option>
            <option value="Short Boom">Girafa Baixo</option>
            <option value="Straight">Reto</option>
            <option value="Clip">Garra / Clip</option>
            <option value="None">Sem pedestal</option>
          </select>
        </div>

        <div className="flex items-center gap-2 self-center pt-4">
          <input
            type="checkbox"
            id="phantom_new"
            checked={new48v}
            onChange={(e) => setNew48v(e.target.checked)}
            className="w-4 h-4 accent-rose-600 cursor-pointer"
          />
          <label htmlFor="phantom_new" className="text-zinc-300 text-[11px] cursor-pointer">
            Requer +48V
          </label>
        </div>

        <div className="flex-1 min-w-[150px]">
          <label className="text-[10px] text-zinc-400 uppercase tracking-wider block mb-1">
            Notas
          </label>
          <input
            type="text"
            placeholder="Ex: Não usar gate agressivo"
            value={newNotes}
            onChange={(e) => setNewNotes(e.target.value)}
            className="w-full bg-black border border-zinc-700 text-white px-2 py-1.5 focus:border-rose-500 focus:outline-none"
          />
        </div>

        <button
          type="submit"
          className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold uppercase px-4 py-2 border border-black shadow-brutal flex items-center gap-1 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" /> Adicionar Canal
        </button>
      </form>
    </div>
  );
}
