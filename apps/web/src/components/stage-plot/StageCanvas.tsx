'use client';

import React, { useState, useRef } from 'react';
import { StageItem, StageItemCategory } from '@/types';
import { STAGE_PRESETS } from '@/lib/mock-data';
import { 
  Plus, 
  Trash2, 
  Zap, 
  RotateCw, 
  Speaker, 
  Mic2, 
  Layers, 
  HelpCircle,
  Move,
  Download,
  LayoutTemplate
} from 'lucide-react';

interface StageCanvasProps {
  items: StageItem[];
  onUpdateItems: (items: StageItem[]) => void;
}

const PRESET_GEAR: { type: StageItemCategory; name: string; shortLabel: string; defaultChannel?: number }[] = [
  { type: 'drums', name: 'Bateria Acústica', shortLabel: 'BATERIA' },
  { type: 'amp_guitar', name: 'Amp Guitarra (4x12)', shortLabel: 'AMP GUIT 4x12' },
  { type: 'amp_bass', name: 'Amp Baixo (Ampeg 8x10)', shortLabel: 'AMP BAIXO' },
  { type: 'mic_vocal', name: 'Microfone de Voz (Girafa)', shortLabel: 'MIC VOZ' },
  { type: 'monitor_wedge', name: 'Monitor de Chão', shortLabel: 'MONITOR VIA' },
  { type: 'di_box', name: 'Direct Box (D.I.)', shortLabel: 'D.I. BOX' },
  { type: 'power_strip', name: 'Tomada 110V/220V', shortLabel: 'AC 110/220V' },
  { type: 'pedalboard', name: 'Pedaleira de Efeitos', shortLabel: 'PEDALEIRA' },
  { type: 'keyboard', name: 'Teclado / Synth', shortLabel: 'TECLADO' },
];

export function StageCanvas({ items, onUpdateItems }: StageCanvasProps) {
  const [selectedId, setSelectedId] = useState<string | null>(items[0]?.id || null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragItemId, setDragItemId] = useState<string | null>(null);
  const [showStamps, setShowStamps] = useState(true);
  const stageRef = useRef<HTMLDivElement>(null);

  const selectedItem = items.find((i) => i.id === selectedId) || null;

  // Handle stage drag movement
  const handleMouseDown = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedId(id);
    setDragItemId(id);
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !dragItemId || !stageRef.current) return;

    const rect = stageRef.current.getBoundingClientRect();
    const x = Math.max(5, Math.min(95, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(8, Math.min(92, ((e.clientY - rect.top) / rect.height) * 100));

    onUpdateItems(
      items.map((item) => (item.id === dragItemId ? { ...item, x: Math.round(x), y: Math.round(y) } : item))
    );
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragItemId(null);
  };

  // Add new gear preset
  const handleAddGear = (preset: (typeof PRESET_GEAR)[0]) => {
    const newItem: StageItem = {
      id: `gear-${Date.now()}`,
      type: preset.type,
      name: preset.name,
      shortLabel: preset.shortLabel,
      x: 50,
      y: 50,
      notes: 'Adicionado ao palco',
      channelNumber: preset.defaultChannel,
    };
    onUpdateItems([...items, newItem]);
    setSelectedId(newItem.id);
  };

  // Apply stage preset template
  const handleApplyPreset = (presetItems: StageItem[]) => {
    if (confirm('Deseja carregar este modelo de palco? O layout atual será substituído.')) {
      onUpdateItems(presetItems);
      setSelectedId(presetItems[0]?.id || null);
    }
  };

  // Delete item
  const handleDeleteItem = (id: string) => {
    const filtered = items.filter((i) => i.id !== id);
    onUpdateItems(filtered);
    if (selectedId === id) {
      setSelectedId(filtered[0]?.id || null);
    }
  };

  // Rotate item
  const handleRotateItem = (id: string) => {
    onUpdateItems(
      items.map((i) => (i.id === id ? { ...i, rotation: ((i.rotation || 0) + 45) % 360 } : i))
    );
  };

  // Export stage plot as SVG image file
  const handleExportStageImage = () => {
    const width = 1000;
    const height = 700;

    const svgContent = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
        <rect width="${width}" height="${height}" fill="#09090b" stroke="#ffffff" stroke-width="6"/>
        
        <!-- Header -->
        <rect x="0" y="0" width="${width}" height="60" fill="#e11d48"/>
        <text x="30" y="40" font-family="Arial, sans-serif" font-weight="900" font-size="28" fill="#ffffff" letter-spacing="2">
          STAGE PLOT // MAPA DE PALCO OFICIAL (UNDERGROUND TOOLS)
        </text>

        <!-- Upstage guide -->
        <rect x="50" y="80" width="${width - 100}" height="30" fill="#18181b" stroke="#3f3f46" stroke-dasharray="4"/>
        <text x="${width / 2}" y="100" text-anchor="middle" font-family="monospace" font-size="14" fill="#a1a1aa">
          ▲ FUNDO DE PALCO // PAREDE // DRUM RISER ▲
        </text>

        <!-- Drum guide box -->
        <rect x="300" y="130" width="400" height="200" fill="none" stroke="#27272a" stroke-width="2" stroke-dasharray="6"/>
        <text x="${width / 2}" y="235" text-anchor="middle" font-family="monospace" font-size="14" fill="#3f3f46">
          ÁREA DA BATERIA (2x2m)
        </text>

        <!-- Stage Items -->
        ${items
          .map((item) => {
            const posX = (item.x / 100) * width;
            const posY = (item.y / 100) * height;
            let fill = '#18181b';
            let stroke = '#ffffff';
            let textColor = '#ffffff';

            if (item.type === 'drums') { fill = '#451a03'; stroke = '#f59e0b'; textColor = '#fef3c7'; }
            else if (item.type === 'amp_bass') { fill = '#172554'; stroke = '#3b82f6'; textColor = '#dbeafe'; }
            else if (item.type === 'amp_guitar') { fill = '#450a0a'; stroke = '#ef4444'; textColor = '#fee2e2'; }
            else if (item.type === 'mic_vocal') { fill = '#022c22'; stroke = '#10b981'; textColor = '#d1fae5'; }
            else if (item.type === 'power_strip') { fill = '#422006'; stroke = '#eab308'; textColor = '#fef08a'; }
            else if (item.type === 'monitor_wedge') { fill = '#3b0764'; stroke = '#a855f7'; textColor = '#f3e8ff'; }

            return `
              <g transform="translate(${posX}, ${posY})">
                <rect x="-60" y="-30" width="120" height="60" fill="${fill}" stroke="${stroke}" stroke-width="3" rx="4"/>
                <text x="0" y="-5" text-anchor="middle" font-family="monospace" font-weight="bold" font-size="12" fill="${textColor}">
                  ${item.shortLabel}
                </text>
                ${item.channelNumber ? `
                  <text x="0" y="16" text-anchor="middle" font-family="monospace" font-weight="bold" font-size="11" fill="#facc15">
                    CH ${item.channelNumber}
                  </text>
                ` : ''}
              </g>
            `;
          })
          .join('')}

        <!-- Downstage / Audience -->
        <rect x="0" y="${height - 50}" width="${width}" height="50" fill="#facc15"/>
        <text x="${width / 2}" y="${height - 20}" text-anchor="middle" font-family="monospace" font-weight="bold" font-size="18" fill="#000000" letter-spacing="4">
          ▼ FRENTE DE PALCO // PÚBLICO & F.O.H. ▼
        </text>
      </svg>
    `;

    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `mapa-de-palco-underground-${new Date().toISOString().slice(0, 10)}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Render visual item icon/badge
  const renderItemVisual = (item: StageItem, isSelected: boolean) => {
    let icon = <Speaker className="w-4 h-4 text-zinc-300" />;
    let bgStyle = 'bg-zinc-900 border-zinc-500';

    if (item.type === 'drums') {
      bgStyle = 'bg-amber-950 border-amber-500 text-amber-200';
      icon = <Layers className="w-5 h-5 text-amber-400" />;
    } else if (item.type === 'amp_bass') {
      bgStyle = 'bg-blue-950 border-blue-500 text-blue-200';
      icon = <Speaker className="w-5 h-5 text-blue-400" />;
    } else if (item.type === 'amp_guitar') {
      bgStyle = 'bg-red-950 border-red-500 text-red-200';
      icon = <Speaker className="w-4 h-4 text-rose-400" />;
    } else if (item.type === 'mic_vocal') {
      bgStyle = 'bg-emerald-950 border-emerald-500 text-emerald-200';
      icon = <Mic2 className="w-4 h-4 text-emerald-400" />;
    } else if (item.type === 'power_strip') {
      bgStyle = 'bg-yellow-950 border-yellow-400 text-yellow-300';
      icon = <Zap className="w-4 h-4 text-yellow-400 fill-yellow-400" />;
    } else if (item.type === 'monitor_wedge') {
      bgStyle = 'bg-purple-950 border-purple-500 text-purple-200';
      icon = <Speaker className="w-4 h-4 text-purple-400" />;
    }

    return (
      <div
        key={item.id}
        onMouseDown={(e) => handleMouseDown(item.id, e)}
        style={{
          left: `${item.x}%`,
          top: `${item.y}%`,
          transform: `translate(-50%, -50%) rotate(${item.rotation || 0}deg)`,
        }}
        className={`absolute cursor-move select-none p-2 border-2 shadow-brutal transition-shadow flex flex-col items-center justify-center min-w-[75px] max-w-[120px] ${bgStyle} ${
          isSelected ? 'ring-4 ring-rose-500 border-white z-30' : 'hover:border-zinc-200 z-10'
        }`}
      >
        <div className="flex items-center gap-1">
          {icon}
          {item.channelNumber && (
            <span className="text-[10px] font-mono bg-black text-rose-400 px-1 border border-zinc-700">
              CH {item.channelNumber}
            </span>
          )}
        </div>
        <span className="text-[10px] font-mono font-bold uppercase tracking-tight text-center mt-1 leading-tight text-zinc-100">
          {item.shortLabel}
        </span>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Top Banner Toolbar */}
      <div className="bg-zinc-900 border-2 border-zinc-700 p-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="text-xs font-mono font-bold text-rose-500 uppercase tracking-widest block">
            PALCO // STAGE PLOT INTERATIVO
          </span>
          <p className="text-xs text-zinc-400 font-mono">
            Arraste os instrumentos no palco para definir o layout exato que o técnico de P.A. verá.
          </p>
        </div>

        {/* Action: Export SVG Image */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowStamps(!showStamps)}
            className="text-[11px] font-mono text-zinc-400 hover:text-white px-2 py-1 border border-zinc-700"
          >
            {showStamps ? 'Ocultar Carimbos' : 'Mostrar Carimbos'}
          </button>

          <button
            onClick={handleExportStageImage}
            className="bg-yellow-400 hover:bg-yellow-300 text-black font-mono font-bold text-xs uppercase px-3 py-1.5 border-2 border-black shadow-brutal-sm flex items-center gap-1.5 active:scale-95 transition-all"
          >
            <Download className="w-3.5 h-3.5" /> Baixar Imagem (SVG/WhatsApp)
          </button>
        </div>
      </div>

      {/* Preset Formations Bar */}
      <div className="bg-black border border-zinc-800 p-2.5 flex flex-wrap items-center gap-2 text-xs font-mono">
        <span className="text-zinc-400 flex items-center gap-1 mr-1">
          <LayoutTemplate className="w-3.5 h-3.5 text-rose-500" /> Modelos Rápidos de Palco:
        </span>
        {STAGE_PRESETS.map((preset, idx) => (
          <button
            key={idx}
            onClick={() => handleApplyPreset(preset.items)}
            className="bg-zinc-900 hover:bg-zinc-800 text-zinc-200 hover:text-white border border-zinc-700 hover:border-rose-500 px-2.5 py-1 text-[11px] transition-colors"
            title={preset.description}
          >
            {preset.name}
          </button>
        ))}
      </div>

      {/* Quick Add Bar */}
      <div className="bg-zinc-900/60 border border-zinc-800 p-2 flex flex-wrap items-center gap-1.5 text-xs font-mono">
        <span className="text-[11px] text-zinc-400 mr-1 flex items-center gap-1">
          <Plus className="w-3.5 h-3.5 text-yellow-400" /> Inserir equipamento:
        </span>
        {PRESET_GEAR.map((preset) => (
          <button
            key={preset.type}
            onClick={() => handleAddGear(preset)}
            className="bg-black hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700 hover:border-zinc-500 text-[10px] px-2 py-1 transition-all active:scale-95"
          >
            + {preset.shortLabel}
          </button>
        ))}
      </div>

      {/* Main Grid + Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Stage Canvas (3 Cols) */}
        <div className="lg:col-span-3">
          <div
            ref={stageRef}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className="relative w-full h-[520px] bg-zinc-950 border-4 border-zinc-800 bg-stage-grid overflow-hidden rounded-none shadow-brutal select-none"
          >
            {/* Stage Directions */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-zinc-900/90 text-zinc-400 font-mono text-[11px] px-3 py-0.5 border border-zinc-700 tracking-wider">
              ▲ FUNDO DE PALCO // DRUM RISER // PAREDE TRILHA
            </div>

            <div className="absolute left-2 top-1/2 -translate-y-1/2 -rotate-90 origin-center text-zinc-600 font-mono text-[10px] tracking-widest">
              STAGE LEFT (ESQUERDA)
            </div>

            <div className="absolute right-2 top-1/2 -translate-y-1/2 rotate-90 origin-center text-zinc-600 font-mono text-[10px] tracking-widest">
              STAGE RIGHT (DIREITA)
            </div>

            {/* Drum riser guide box */}
            <div className="absolute top-[12%] left-[30%] w-[40%] h-[30%] border-2 border-dashed border-zinc-800 pointer-events-none flex items-center justify-center">
              <span className="text-[10px] font-mono text-zinc-700 tracking-widest uppercase">
                ÁREA DA BATERIA (2x2m)
              </span>
            </div>

            {/* Front Stage / Audience marker */}
            <div className="absolute bottom-0 inset-x-0 bg-yellow-400 text-black py-1 px-4 text-center font-mono font-bold text-xs uppercase tracking-widest border-t-2 border-black">
              ▼ FRENTE DE PALCO // PÚBLICO & MESA DE SOM (F.O.H.) ▼
            </div>

            {/* Virtual DIY Stamps on Canvas */}
            {showStamps && (
              <>
                <div className="absolute top-6 left-6 pointer-events-none stamp-approved">
                  F.O.H. APPROVED
                </div>
                <div className="absolute top-6 right-6 pointer-events-none stamp-danger">
                  PASSAGEM OBRIGATÓRIA
                </div>
              </>
            )}

            {/* Render Items */}
            {items.map((item) => renderItemVisual(item, item.id === selectedId))}
          </div>

          <div className="flex items-center justify-between text-xs font-mono text-zinc-500 mt-2 px-1">
            <span className="flex items-center gap-1">
              <Move className="w-3.5 h-3.5 text-zinc-400" /> Clique e arraste qualquer equipamento para reposicionar
            </span>
            <span>Dimensões de referência padrão: 6m x 4m</span>
          </div>
        </div>

        {/* Selected Item Inspector Panel */}
        <div className="lg:col-span-1 bg-zinc-900 border-2 border-zinc-800 p-4 flex flex-col justify-between shadow-brutal">
          {selectedItem ? (
            <div className="space-y-4">
              <div className="border-b border-zinc-800 pb-2">
                <span className="text-[10px] font-mono text-rose-500 uppercase tracking-widest">
                  PROPRIEDADES DO EQUIPAMENTO
                </span>
                <h3 className="font-stencil text-xl text-zinc-100 tracking-wider">
                  {selectedItem.shortLabel}
                </h3>
              </div>

              {/* Edit Name */}
              <div>
                <label className="text-[11px] font-mono text-zinc-400 block mb-1">Nome Completo</label>
                <input
                  type="text"
                  value={selectedItem.name}
                  onChange={(e) =>
                    onUpdateItems(
                      items.map((i) => (i.id === selectedItem.id ? { ...i, name: e.target.value } : i))
                    )
                  }
                  className="w-full bg-black border border-zinc-700 text-zinc-200 text-xs font-mono px-2 py-1.5 focus:border-rose-500 focus:outline-none"
                />
              </div>

              {/* Edit Short Label */}
              <div>
                <label className="text-[11px] font-mono text-zinc-400 block mb-1">Rótulo Curto no Palco</label>
                <input
                  type="text"
                  value={selectedItem.shortLabel}
                  onChange={(e) =>
                    onUpdateItems(
                      items.map((i) => (i.id === selectedItem.id ? { ...i, shortLabel: e.target.value } : i))
                    )
                  }
                  className="w-full bg-black border border-zinc-700 text-zinc-200 text-xs font-mono px-2 py-1.5 focus:border-rose-500 focus:outline-none"
                />
              </div>

              {/* Channel Number */}
              <div>
                <label className="text-[11px] font-mono text-zinc-400 block mb-1">
                  Canal na Input List (Opcional)
                </label>
                <input
                  type="number"
                  min="1"
                  max="48"
                  value={selectedItem.channelNumber || ''}
                  placeholder="Ex: 7"
                  onChange={(e) =>
                    onUpdateItems(
                      items.map((i) =>
                        i.id === selectedItem.id
                          ? { ...i, channelNumber: e.target.value ? parseInt(e.target.value) : undefined }
                          : i
                      )
                    )
                  }
                  className="w-full bg-black border border-zinc-700 text-zinc-200 text-xs font-mono px-2 py-1.5 focus:border-rose-500 focus:outline-none"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="text-[11px] font-mono text-zinc-400 block mb-1">
                  Instruções para o Operador
                </label>
                <textarea
                  rows={3}
                  value={selectedItem.notes || ''}
                  placeholder="Ex: Pedestal articulado, apontar no cone de 12..."
                  onChange={(e) =>
                    onUpdateItems(
                      items.map((i) => (i.id === selectedItem.id ? { ...i, notes: e.target.value } : i))
                    )
                  }
                  className="w-full bg-black border border-zinc-700 text-zinc-200 text-xs font-mono px-2 py-1.5 focus:border-rose-500 focus:outline-none"
                />
              </div>

              {/* Actions */}
              <div className="pt-2 flex items-center gap-2">
                <button
                  onClick={() => handleRotateItem(selectedItem.id)}
                  className="flex-1 flex items-center justify-center gap-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-600 text-xs font-mono py-2 transition-colors"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  Girar (+45°)
                </button>

                <button
                  onClick={() => handleDeleteItem(selectedItem.id)}
                  className="flex items-center justify-center bg-red-950 hover:bg-red-900 text-rose-300 border border-red-700 text-xs font-mono px-3 py-2 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-zinc-500 font-mono text-xs">
              <HelpCircle className="w-6 h-6 mx-auto mb-2 text-zinc-600" />
              Selecione um equipamento no palco para editar seus detalhes.
            </div>
          )}

          {/* Quick Stats */}
          <div className="mt-4 pt-3 border-t border-zinc-800 text-[11px] font-mono text-zinc-400 space-y-1">
            <div className="flex justify-between">
              <span>Equipamentos no palco:</span>
              <strong className="text-zinc-200">{items.length}</strong>
            </div>
            <div className="flex justify-between">
              <span>Pontos de energia (AC):</span>
              <strong className="text-yellow-400">
                {items.filter((i) => i.type === 'power_strip').length}
              </strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
