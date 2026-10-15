'use client';

import React, { useState } from 'react';
import { GigDate } from '@/types';
import { Calendar, MapPin, Ticket, Plus, Trash2, ExternalLink, Clock, Users } from 'lucide-react';

interface GigManagerProps {
  gigs: GigDate[];
  onUpdateGigs: (gigs: GigDate[]) => void;
}

export function GigManager({ gigs, onUpdateGigs }: GigManagerProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newVenue, setNewVenue] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newState, setNewState] = useState('SP');
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('20:00');
  const [newAddress, setNewAddress] = useState('');
  const [newPrice, setNewPrice] = useState('R$ 30');
  const [newTicketUrl, setNewTicketUrl] = useState('');
  const [newLineup, setNewLineup] = useState('');

  const handleAddGig = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVenue || !newDate || !newCity) return;

    const newGig: GigDate = {
      id: `gig-${Date.now()}`,
      venue: newVenue.trim(),
      city: newCity.trim(),
      state: newState.trim(),
      date: newDate,
      time: newTime,
      address: newAddress.trim() || newVenue,
      doorsPrice: newPrice.trim(),
      ticketUrl: newTicketUrl.trim() || undefined,
      status: 'confirmed',
      lineup: newLineup.split(',').map((s) => s.trim()).filter(Boolean),
    };

    onUpdateGigs([...gigs, newGig]);
    setShowAddForm(false);
    setNewVenue('');
    setNewCity('');
    setNewAddress('');
    setNewTicketUrl('');
    setNewLineup('');
  };

  const handleDeleteGig = (id: string) => {
    onUpdateGigs(gigs.filter((g) => g.id !== id));
  };

  const handleToggleStatus = (id: string) => {
    const statuses: GigDate['status'][] = ['confirmed', 'sold_out', 'cancelled', 'tba'];
    onUpdateGigs(
      gigs.map((g) => {
        if (g.id === id) {
          const nextIdx = (statuses.indexOf(g.status) + 1) % statuses.length;
          return { ...g, status: statuses[nextIdx] };
        }
        return g;
      })
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Toolbar */}
      <div className="bg-zinc-900 border-2 border-zinc-700 p-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-bold text-yellow-400 uppercase tracking-widest block">
            AGENDA DE SHOWS // TOUR DATES
          </span>
          <p className="text-xs text-zinc-400 font-mono">
            Gerenciador de datas ao vivo. Conexão direta com plataformas de ingresso e mapas.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-yellow-400 hover:bg-yellow-300 text-black font-mono font-bold text-xs uppercase px-4 py-2 border-2 border-black shadow-brutal flex items-center gap-1.5 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          {showAddForm ? 'Fechar Formulário' : '+ Marcar Nova Data'}
        </button>
      </div>

      {/* Add New Gig Form Modal/Card */}
      {showAddForm && (
        <form
          onSubmit={handleAddGig}
          className="bg-[#121214] border-2 border-yellow-400 p-6 shadow-brutal space-y-4 font-mono text-xs"
        >
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
            <h3 className="font-stencil text-lg text-yellow-400 uppercase tracking-wider">
              CADASTRAR NOVO SHOW // DATA DA TOUR
            </h3>
            <span className="text-zinc-500 text-[11px]">Todos os campos editáveis</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-zinc-400 block mb-1">Local / Casa de Show</label>
              <input
                type="text"
                required
                placeholder="Ex: Hangar 110 / Porta Maldita"
                value={newVenue}
                onChange={(e) => setNewVenue(e.target.value)}
                className="w-full bg-black border border-zinc-700 text-white p-2 focus:border-rose-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-zinc-400 block mb-1">Cidade</label>
              <input
                type="text"
                required
                placeholder="Ex: São Paulo"
                value={newCity}
                onChange={(e) => setNewCity(e.target.value)}
                className="w-full bg-black border border-zinc-700 text-white p-2 focus:border-rose-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-zinc-400 block mb-1">UF (Estado)</label>
              <input
                type="text"
                required
                maxLength={2}
                placeholder="SP"
                value={newState}
                onChange={(e) => setNewState(e.target.value.toUpperCase())}
                className="w-full bg-black border border-zinc-700 text-white p-2 focus:border-rose-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-zinc-400 block mb-1">Data</label>
              <input
                type="date"
                required
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="w-full bg-black border border-zinc-700 text-white p-2 focus:border-rose-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-zinc-400 block mb-1">Horário de Abertura</label>
              <input
                type="text"
                placeholder="20:00"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                className="w-full bg-black border border-zinc-700 text-white p-2 focus:border-rose-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-zinc-400 block mb-1">Preço dos Ingressos</label>
              <input
                type="text"
                placeholder="R$ 30 (Lote 1) / R$ 45 (Porta)"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
                className="w-full bg-black border border-zinc-700 text-white p-2 focus:border-rose-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-zinc-400 block mb-1">Endereço Completo (para Maps/Waze)</label>
              <input
                type="text"
                placeholder="Rua, número, bairro"
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
                className="w-full bg-black border border-zinc-700 text-white p-2 focus:border-rose-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-zinc-400 block mb-1">Link de Ingressos (Sympla, Shotgun, etc)</label>
              <input
                type="text"
                placeholder="https://..."
                value={newTicketUrl}
                onChange={(e) => setNewTicketUrl(e.target.value)}
                className="w-full bg-black border border-zinc-700 text-white p-2 focus:border-rose-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-zinc-400 block mb-1">Bandas do Line-up (separadas por vírgula)</label>
            <input
              type="text"
              placeholder="Colapso Memorial, Revanche, Desalento..."
              value={newLineup}
              onChange={(e) => setNewLineup(e.target.value)}
              className="w-full bg-black border border-zinc-700 text-white p-2 focus:border-rose-500 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="bg-zinc-800 text-zinc-300 px-4 py-2 border border-zinc-700"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-yellow-400 text-black font-bold uppercase px-6 py-2 border-2 border-black shadow-brutal"
            >
              Confirmar Data
            </button>
          </div>
        </form>
      )}

      {/* Shows List */}
      <div className="space-y-4">
        {gigs.length === 0 ? (
          <div className="bg-zinc-950 border-2 border-dashed border-zinc-800 p-12 text-center text-zinc-500 font-mono text-xs">
            Nenhum show marcado no momento. Adicione as datas da sua tour!
          </div>
        ) : (
          gigs.map((gig) => {
            const dateObj = new Date(gig.date + 'T12:00:00');
            const day = String(dateObj.getDate()).padStart(2, '0');
            const monthStr = dateObj.toLocaleDateString('pt-BR', { month: 'short' }).toUpperCase();
            const weekday = dateObj.toLocaleDateString('pt-BR', { weekday: 'short' }).toUpperCase();

            let statusBadge = (
              <span className="bg-emerald-950 border border-emerald-500 text-emerald-300 font-mono text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider">
                CONFIRMADO
              </span>
            );
            if (gig.status === 'sold_out') {
              statusBadge = (
                <span className="bg-rose-950 border border-rose-500 text-rose-300 font-mono text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider">
                  SOLD OUT // ESGOTADO
                </span>
              );
            } else if (gig.status === 'cancelled') {
              statusBadge = (
                <span className="bg-zinc-800 border border-zinc-600 text-zinc-400 font-mono text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider line-through">
                  CANCELADO
                </span>
              );
            }

            return (
              <div
                key={gig.id}
                className="bg-[#0f0f12] border-2 border-zinc-800 hover:border-zinc-600 p-4 md:p-5 shadow-brutal transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                {/* Date stamp box */}
                <div className="flex items-center gap-4">
                  <div className="bg-black border-2 border-zinc-700 p-3 min-w-[75px] text-center shadow-brutal-sm">
                    <span className="text-[10px] font-mono text-rose-500 font-bold block">{weekday}</span>
                    <span className="font-stencil text-2xl text-white block leading-none my-1">{day}</span>
                    <span className="text-[10px] font-mono text-zinc-400 block">{monthStr}</span>
                  </div>

                  {/* Venue and info */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      {statusBadge}
                      <button
                        onClick={() => handleToggleStatus(gig.id)}
                        className="text-[10px] font-mono text-zinc-500 hover:text-zinc-300 underline"
                        title="Alternar status (Confirmado / Esgotado / Cancelado)"
                      >
                        (mudar status)
                      </button>
                    </div>

                    <h3 className="font-stencil text-xl text-white tracking-wide">{gig.venue}</h3>

                    <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-zinc-400">
                      <span className="flex items-center gap-1 text-zinc-200">
                        <MapPin className="w-3.5 h-3.5 text-rose-500" />
                        {gig.city} - {gig.state}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-zinc-500" /> {gig.time}
                      </span>
                      <span className="bg-zinc-900 px-2 py-0.5 border border-zinc-800 text-yellow-400">
                        {gig.doorsPrice}
                      </span>
                    </div>

                    {gig.lineup.length > 0 && (
                      <div className="flex items-center gap-1.5 text-[11px] font-mono text-zinc-400 pt-1">
                        <Users className="w-3.5 h-3.5 text-zinc-600" />
                        <span>Com: </span>
                        <strong className="text-zinc-300">{gig.lineup.join(' • ')}</strong>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-2 font-mono text-xs self-end md:self-center">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      `${gig.venue} ${gig.address} ${gig.city}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700 px-3 py-2 transition-colors"
                  >
                    <MapPin className="w-3.5 h-3.5" /> Maps
                  </a>

                  {gig.ticketUrl ? (
                    <a
                      href={gig.ticketUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 bg-yellow-400 hover:bg-yellow-300 text-black font-bold border-2 border-black shadow-brutal-sm px-4 py-2 transition-all active:scale-95"
                    >
                      <Ticket className="w-3.5 h-3.5" /> Ingressos
                    </a>
                  ) : (
                    <span className="text-zinc-600 border border-zinc-800 px-3 py-2 text-[11px]">
                      Entrada na porta
                    </span>
                  )}

                  <button
                    onClick={() => handleDeleteGig(gig.id)}
                    className="text-zinc-600 hover:text-rose-500 p-2 border border-transparent hover:border-zinc-700 transition-colors"
                    title="Excluir show"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
