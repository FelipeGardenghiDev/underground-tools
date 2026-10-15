'use client';

import React, { useState } from 'react';
import { SetlistItem } from '@/types';
import { 
  Printer, 
  Plus, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  Clock, 
  Flame, 
  Music,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface TapeSetlistViewProps {
  setlist: SetlistItem[];
  bandName: string;
  onUpdateSetlist: (setlist: SetlistItem[]) => void;
}

export function TapeSetlistView({ setlist, bandName, onUpdateSetlist }: TapeSetlistViewProps) {
  const [newTitle, setNewTitle] = useState('');
  const [newTuning, setNewTuning] = useState<SetlistItem['tuning']>('Drop D');
  const [newBpm, setNewBpm] = useState<number | undefined>(160);
  const [newDuration, setNewDuration] = useState('3:30');
  const [newNotes, setNewNotes] = useState('');
  const [newIsEncore, setNewIsEncore] = useState(false);

  // Add song
  const handleAddSong = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const nextOrder = setlist.length + 1;
    const newSong: SetlistItem = {
      id: `song-${Date.now()}`,
      order: nextOrder,
      title: newTitle.trim(),
      tuning: newTuning,
      bpm: newBpm,
      duration: newDuration.trim() || '3:00',
      notes: newNotes.trim() || undefined,
      isEncore: newIsEncore,
    };

    onUpdateSetlist([...setlist, newSong]);
    setNewTitle('');
    setNewNotes('');
    setNewIsEncore(false);
  };

  // Delete song
  const handleDeleteSong = (id: string) => {
    const filtered = setlist
      .filter((s) => s.id !== id)
      .map((s, idx) => ({ ...s, order: idx + 1 }));
    onUpdateSetlist(filtered);
  };

  // Move up
  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const items = [...setlist];
    const temp = items[index];
    items[index] = items[index - 1];
    items[index - 1] = temp;
    onUpdateSetlist(items.map((s, idx) => ({ ...s, order: idx + 1 })));
  };

  // Move down
  const handleMoveDown = (index: number) => {
    if (index === setlist.length - 1) return;
    const items = [...setlist];
    const temp = items[index];
    items[index] = items[index + 1];
    items[index + 1] = temp;
    onUpdateSetlist(items.map((s, idx) => ({ ...s, order: idx + 1 })));
  };

  // Calculate total minutes roughly
  const calculateTotalMinutes = () => {
    let totalSec = 0;
    setlist.forEach((s) => {
      if (s.duration) {
        const parts = s.duration.split(':');
        if (parts.length === 2) {
          totalSec += parseInt(parts[0]) * 60 + parseInt(parts[1]);
        }
      } else {
        totalSec += 180;
      }
    });
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins}m ${secs > 0 ? `${secs}s` : ''}`;
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Toolbar */}
      <div className="bg-zinc-900 border-2 border-zinc-700 p-4 flex flex-wrap items-center justify-between gap-4 no-print">
        <div>
          <span className="text-xs font-mono font-bold text-yellow-400 uppercase tracking-widest block">
            SETLIST DE CHÃO // TAPE SETLIST
          </span>
          <p className="text-xs text-zinc-400 font-mono">
            Gerador de repertório em letras gigantes para colar com fita crepe na caixa de retorno ou no chão do palco.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-black text-zinc-300 font-mono text-xs px-3 py-2 border border-zinc-700 flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-yellow-400" />
            <span>Tempo estimado de palco: </span>
            <strong className="text-yellow-400">{calculateTotalMinutes()}</strong>
          </div>

          <button
            onClick={() => window.print()}
            className="bg-yellow-400 hover:bg-yellow-300 text-black font-mono font-bold text-xs uppercase px-4 py-2.5 border-2 border-black shadow-brutal flex items-center gap-2 active:scale-95 transition-all"
          >
            <Printer className="w-4 h-4" />
            Imprimir Setlist de Chão (A4)
          </button>
        </div>
      </div>

      {/* Main Grid: Setlist Preview (Styled like paper taped to stage) + Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 no-print">
        {/* Setlist Live Preview / Stage Paper Sheet (7 Cols) */}
        <div className="lg:col-span-7">
          <div className="relative bg-[#f5f2eb] text-black border-4 border-black p-6 md:p-8 shadow-brutal min-h-[550px]">
            {/* Fake Duct Tape on Corners */}
            <div className="absolute -top-3 left-6 w-20 h-6 bg-zinc-900/90 shadow-md transform -rotate-3 border-x-2 border-dashed border-zinc-700 pointer-events-none"></div>
            <div className="absolute -top-3 right-6 w-20 h-6 bg-zinc-900/90 shadow-md transform rotate-3 border-x-2 border-dashed border-zinc-700 pointer-events-none"></div>
            <div className="absolute -bottom-3 left-6 w-20 h-6 bg-zinc-900/90 shadow-md transform rotate-2 border-x-2 border-dashed border-zinc-700 pointer-events-none"></div>
            <div className="absolute -bottom-3 right-6 w-20 h-6 bg-zinc-900/90 shadow-md transform -rotate-2 border-x-2 border-dashed border-zinc-700 pointer-events-none"></div>

            {/* Header */}
            <div className="border-b-4 border-black pb-3 mb-4 flex justify-between items-end">
              <div>
                <span className="font-mono text-xs font-bold uppercase tracking-widest text-zinc-700 block">
                  SETLIST AO VIVO • CHÃO DE PALCO
                </span>
                <h2 className="font-stencil text-4xl text-black tracking-wider leading-none">
                  {bandName}
                </h2>
              </div>
              <div className="font-mono text-right text-xs">
                <span className="font-bold bg-black text-white px-2 py-0.5">
                  TOTAL: {setlist.length} MÚSICAS
                </span>
              </div>
            </div>

            {/* Songs List */}
            <div className="space-y-2">
              {setlist.map((song, idx) => (
                <div
                  key={song.id}
                  className={`p-2 border-b-2 border-black flex items-center justify-between gap-3 ${
                    song.isEncore ? 'bg-yellow-300 border-2 border-dashed border-black' : ''
                  }`}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span className="font-stencil text-3xl text-black w-8 text-center shrink-0">
                      {String(song.order).padStart(2, '0')}
                    </span>
                    <div className="truncate">
                      <div className="flex items-center gap-2">
                        <span className="font-stencil text-2xl tracking-wide text-black truncate uppercase">
                          {song.title}
                        </span>
                        {song.isEncore && (
                          <span className="bg-black text-yellow-400 font-mono text-[9px] font-bold px-1.5 py-0.5 uppercase">
                            BIS
                          </span>
                        )}
                      </div>
                      {song.notes && (
                        <div className="font-mono text-[11px] text-zinc-700 font-bold truncate">
                          ↳ {song.notes}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 font-mono text-xs">
                    {/* Tuning badge */}
                    <span className="bg-black text-white font-bold px-2 py-0.5 text-[11px] uppercase tracking-wider">
                      {song.tuning}
                    </span>
                    {song.bpm && (
                      <span className="text-[11px] text-zinc-600 font-bold hidden sm:inline">
                        {song.bpm} BPM
                      </span>
                    )}
                    {song.duration && (
                      <span className="text-[11px] text-zinc-600 hidden sm:inline">
                        ({song.duration})
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-3 border-t-2 border-dashed border-zinc-500 font-mono text-[10px] text-zinc-600 flex justify-between items-center">
              <span>Lembrete de palco: Água mineral no chão • Mute antes de afinar</span>
              <span>UNDERGROUND TOOLS</span>
            </div>
          </div>
        </div>

        {/* Setlist Management / Reorder / Add (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Add Song Form */}
          <form
            onSubmit={handleAddSong}
            className="bg-zinc-900 border-2 border-zinc-700 p-4 shadow-brutal space-y-3 font-mono text-xs"
          >
            <h3 className="font-stencil text-lg text-yellow-400 uppercase tracking-wide border-b border-zinc-800 pb-1">
              + Inserir Música no Set
            </h3>

            <div>
              <label className="text-zinc-400 block mb-1">Nome da Faixa</label>
              <input
                type="text"
                required
                placeholder="Ex: Último Suspiro no Hangar"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full bg-black border border-zinc-700 text-white p-2 focus:border-rose-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-zinc-400 block mb-1">Afinação da Música</label>
                <select
                  value={newTuning}
                  onChange={(e) => setNewTuning(e.target.value as any)}
                  className="w-full bg-black border border-zinc-700 text-white p-2 focus:border-rose-500 focus:outline-none text-[11px]"
                >
                  <option value="Standard E">Standard E (Padrão)</option>
                  <option value="Drop D">Drop D</option>
                  <option value="Half-Step (Eb)">Half-Step Down (Eb)</option>
                  <option value="Drop C">Drop C</option>
                  <option value="Open DADGAD">Open DADGAD</option>
                  <option value="Standard D">Standard D</option>
                  <option value="Outra">Outra Afinação</option>
                </select>
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Duração (Min:Seg)</label>
                <input
                  type="text"
                  placeholder="3:20"
                  value={newDuration}
                  onChange={(e) => setNewDuration(e.target.value)}
                  className="w-full bg-black border border-zinc-700 text-white p-2 focus:border-rose-500 focus:outline-none text-[11px]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 items-center">
              <div>
                <label className="text-zinc-400 block mb-1">BPM (Metrônomo/Click)</label>
                <input
                  type="number"
                  placeholder="160"
                  value={newBpm || ''}
                  onChange={(e) => setNewBpm(e.target.value ? parseInt(e.target.value) : undefined)}
                  className="w-full bg-black border border-zinc-700 text-white p-2 focus:border-rose-500 focus:outline-none text-[11px]"
                />
              </div>

              <div className="flex items-center gap-2 pt-4">
                <input
                  type="checkbox"
                  id="encore_check"
                  checked={newIsEncore}
                  onChange={(e) => setNewIsEncore(e.target.checked)}
                  className="w-4 h-4 accent-yellow-400 cursor-pointer"
                />
                <label htmlFor="encore_check" className="text-yellow-400 text-xs cursor-pointer">
                  Música de BIS
                </label>
              </div>
            </div>

            <div>
              <label className="text-zinc-400 block mb-1">Instrução de Palco / Transição</label>
              <input
                type="text"
                placeholder="Ex: Emenda direto sem contagem, Léo dropa a 6ª corda..."
                value={newNotes}
                onChange={(e) => setNewNotes(e.target.value)}
                className="w-full bg-black border border-zinc-700 text-white p-2 focus:border-rose-500 focus:outline-none text-[11px]"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-bold uppercase py-2 border border-black shadow-brutal flex items-center justify-center gap-1.5 transition-all"
            >
              <Plus className="w-4 h-4" /> Adicionar à Setlist
            </button>
          </form>

          {/* Reordering Controls List */}
          <div className="bg-[#121215] border-2 border-zinc-800 p-4 space-y-2 font-mono text-xs">
            <span className="text-[10px] text-zinc-400 uppercase tracking-widest block mb-2">
              ORDEM DO SHOW (REORDENAR MÚSICAS)
            </span>
            <div className="space-y-1.5 max-h-[300px] overflow-y-auto pr-1">
              {setlist.map((s, index) => (
                <div
                  key={s.id}
                  className="bg-black border border-zinc-800 p-2 flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-zinc-500 font-bold w-5">{s.order}.</span>
                    <span className="text-zinc-200 truncate font-bold">{s.title}</span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleMoveUp(index)}
                      disabled={index === 0}
                      className="p-1 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white disabled:opacity-30 border border-zinc-800"
                      title="Subir na ordem"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleMoveDown(index)}
                      disabled={index === setlist.length - 1}
                      className="p-1 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white disabled:opacity-30 border border-zinc-800"
                      title="Descer na ordem"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteSong(s.id)}
                      className="p-1 bg-zinc-900 hover:bg-rose-950 text-zinc-500 hover:text-rose-400 border border-zinc-800 ml-1"
                      title="Remover"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
