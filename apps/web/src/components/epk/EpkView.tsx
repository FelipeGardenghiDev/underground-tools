'use client';

import React, { useState } from 'react';
import { BandProfile } from '@/types';
import { 
  Copy, 
  Check, 
  Download, 
  ExternalLink, 
  Music, 
  Users, 
  Quote, 
  Eye, 
  Edit3,
  Disc3,
  Radio,
  FileCheck
} from 'lucide-react';

interface EpkViewProps {
  profile: BandProfile;
  onUpdateProfile: (profile: BandProfile) => void;
}

export function EpkView({ profile, onUpdateProfile }: EpkViewProps) {
  const [viewMode, setViewMode] = useState<'editor' | 'preview'>('preview');
  const [copiedBio, setCopiedBio] = useState(false);

  const handleCopyShortBio = () => {
    navigator.clipboard.writeText(profile.bioShort);
    setCopiedBio(true);
    setTimeout(() => setCopiedBio(false), 2000);
  };

  const handleUpdate = (field: keyof BandProfile, value: any) => {
    onUpdateProfile({ ...profile, [field]: value });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Toolbar */}
      <div className="bg-zinc-900 border-2 border-zinc-700 p-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-bold text-rose-500 uppercase tracking-widest block">
            PRESS KIT ELETRÔNICO // EPK & IMPRENSA
          </span>
          <p className="text-xs text-zinc-400 font-mono">
            Página pública para enviar a curadores de festivais, selos, zines e casas de show independentes.
          </p>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('preview')}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-mono font-bold uppercase border-2 transition-all ${
              viewMode === 'preview'
                ? 'bg-zinc-100 text-black border-black shadow-brutal'
                : 'bg-black text-zinc-400 border-zinc-700 hover:text-white'
            }`}
          >
            <Eye className="w-4 h-4" />
            Prévia Pública (Zine/Imprensa)
          </button>

          <button
            onClick={() => setViewMode('editor')}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-mono font-bold uppercase border-2 transition-all ${
              viewMode === 'editor'
                ? 'bg-rose-600 text-white border-black shadow-brutal'
                : 'bg-black text-zinc-400 border-zinc-700 hover:text-white'
            }`}
          >
            <Edit3 className="w-4 h-4" />
            Editar Dados
          </button>
        </div>
      </div>

      {viewMode === 'preview' ? (
        /* PUBLIC ZINE-STYLE EPK VIEW */
        <div className="space-y-8 bg-[#0b0b0d] border-4 border-zinc-800 p-6 md:p-10 shadow-brutal">
          {/* Header Hero Banner */}
          <div className="border-b-4 border-zinc-700 pb-6 relative">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-rose-600 text-white font-mono text-[10px] font-bold px-2 py-0.5 uppercase tracking-widest">
                    EPK OFICIAL
                  </span>
                  <span className="bg-yellow-400 text-black font-mono text-[10px] font-bold px-2 py-0.5 uppercase tracking-widest">
                    {profile.genre}
                  </span>
                  <span className="text-zinc-500 font-mono text-xs">
                    {profile.location} • Desde {profile.yearFormed}
                  </span>
                </div>

                <h1 className="font-stencil text-4xl md:text-6xl text-white tracking-wider">
                  {profile.name}
                </h1>
              </div>

              {/* Streaming Links */}
              <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                {profile.links.spotify && (
                  <a
                    href={profile.links.spotify}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-600 px-3 py-1.5 transition-colors"
                  >
                    <Disc3 className="w-4 h-4 animate-spin-slow" /> Spotify
                  </a>
                )}
                {profile.links.bandcamp && (
                  <a
                    href={profile.links.bandcamp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 bg-sky-950 hover:bg-sky-900 text-sky-300 border border-sky-600 px-3 py-1.5 transition-colors"
                  >
                    <Radio className="w-4 h-4" /> Bandcamp
                  </a>
                )}
                {profile.links.instagram && (
                  <a
                    href={profile.links.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 bg-pink-950 hover:bg-pink-900 text-pink-300 border border-pink-600 px-3 py-1.5 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> Instagram
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Quick Copy Bio for Posters/Flyers */}
          <div className="bg-zinc-900/90 border-2 border-yellow-400/80 p-4 shadow-brutal-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono font-bold text-yellow-400 uppercase tracking-widest flex items-center gap-1.5">
                <FileCheck className="w-4 h-4" /> BIO CURTA (PARA FLYERS, CARTAZES & LINHAS DE LINE-UP)
              </span>
              <button
                onClick={handleCopyShortBio}
                className="flex items-center gap-1 bg-yellow-400 hover:bg-yellow-300 text-black font-mono font-bold text-[11px] px-2.5 py-1 border border-black transition-all"
              >
                {copiedBio ? <Check className="w-3.5 h-3.5 text-black" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedBio ? 'Copiado!' : 'Copiar Texto'}
              </button>
            </div>
            <p className="font-mono text-xs text-zinc-300 leading-relaxed italic bg-black/60 p-3 border border-zinc-800">
              "{profile.bioShort}"
            </p>
          </div>

          {/* Bio Longa (Zines e Curadoria) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <h2 className="font-stencil text-2xl text-zinc-100 tracking-wide border-b border-zinc-800 pb-2">
                RELEASE COMPLETO & TRAJETÓRIA
              </h2>
              <div className="text-zinc-300 text-sm leading-relaxed space-y-3 font-mono">
                <p>{profile.bioLong}</p>
              </div>

              {/* Press Quotes */}
              <div className="pt-4 space-y-3">
                <span className="text-xs font-mono font-bold text-rose-500 uppercase tracking-widest block">
                  O QUE DIZEM OS ZINES E A CENA INDEPENDENTE:
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {profile.pressQuotes.map((q, idx) => (
                    <div key={idx} className="bg-black/60 border-l-4 border-rose-600 p-3 space-y-1">
                      <Quote className="w-4 h-4 text-rose-500" />
                      <p className="font-mono text-xs text-zinc-300 italic">"{q.quote}"</p>
                      <span className="text-[10px] font-mono text-yellow-400 font-bold block">
                        — {q.source}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Side Column: Members & Press Photos */}
            <div className="space-y-6">
              {/* Formação / Integrantes */}
              <div className="bg-zinc-900 border-2 border-zinc-800 p-4 space-y-3 shadow-brutal-sm">
                <div className="flex items-center gap-2 border-b border-zinc-800 pb-2">
                  <Users className="w-4 h-4 text-rose-500" />
                  <h3 className="font-stencil text-lg text-white">FORMAÇÃO ATUAL</h3>
                </div>
                <div className="space-y-2.5 font-mono text-xs">
                  {profile.members.map((m) => (
                    <div key={m.id} className="border-b border-zinc-800/60 pb-2 last:border-0 last:pb-0">
                      <div className="font-bold text-zinc-100">{m.name}</div>
                      <div className="text-rose-400 text-[11px]">{m.role}</div>
                      <div className="text-zinc-500 text-[10px]">{m.gearSummary}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Fotos em Alta Resolução */}
              <div className="bg-zinc-900 border-2 border-zinc-800 p-4 space-y-3 shadow-brutal-sm">
                <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block">
                  MATERIAL GRÁFICO (HI-RES)
                </span>
                <div className="space-y-2">
                  {profile.pressPhotos.map((photo) => (
                    <div
                      key={photo.id}
                      className="bg-black border border-zinc-800 p-2.5 flex items-center justify-between gap-2"
                    >
                      <div>
                        <div className="text-xs font-mono font-bold text-zinc-200">{photo.title}</div>
                        <div className="text-[10px] font-mono text-zinc-500">{photo.resolution}</div>
                      </div>
                      <button
                        onClick={() => alert(`Iniciando download simulado de: ${photo.title}`)}
                        className="bg-zinc-800 hover:bg-zinc-700 text-yellow-400 p-1.5 border border-zinc-600 transition-colors"
                        title="Baixar Foto em Alta"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* EDITOR MODE */
        <div className="bg-zinc-900 border-2 border-zinc-800 p-6 space-y-6 shadow-brutal">
          <h2 className="font-stencil text-2xl text-white tracking-wide border-b border-zinc-800 pb-2">
            EDITAR INFORMAÇÕES DO PRESS KIT
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
            <div>
              <label className="text-zinc-400 block mb-1">Nome da Banda</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => handleUpdate('name', e.target.value)}
                className="w-full bg-black border border-zinc-700 text-white p-2 focus:border-rose-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-zinc-400 block mb-1">Gênero / Estilo</label>
              <input
                type="text"
                value={profile.genre}
                onChange={(e) => handleUpdate('genre', e.target.value)}
                className="w-full bg-black border border-zinc-700 text-white p-2 focus:border-rose-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-zinc-400 block mb-1">Cidade / Estado</label>
              <input
                type="text"
                value={profile.location}
                onChange={(e) => handleUpdate('location', e.target.value)}
                className="w-full bg-black border border-zinc-700 text-white p-2 focus:border-rose-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="font-mono text-xs space-y-4">
            <div>
              <label className="text-zinc-400 block mb-1">
                Bio Curta (Flyers, cartazes e redes - máx 250 caracteres)
              </label>
              <textarea
                rows={2}
                value={profile.bioShort}
                onChange={(e) => handleUpdate('bioShort', e.target.value)}
                className="w-full bg-black border border-zinc-700 text-white p-2 focus:border-rose-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-zinc-400 block mb-1">
                Release Completo (Para matérias de zines, blogs e imprensa)
              </label>
              <textarea
                rows={5}
                value={profile.bioLong}
                onChange={(e) => handleUpdate('bioLong', e.target.value)}
                className="w-full bg-black border border-zinc-700 text-white p-2 focus:border-rose-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Social Links */}
          <div className="border-t border-zinc-800 pt-4">
            <span className="text-xs font-mono font-bold text-yellow-400 uppercase tracking-widest block mb-3">
              LINKS DE STREAMING & REDES
            </span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
              <div>
                <label className="text-zinc-400 block mb-1">Spotify URL</label>
                <input
                  type="text"
                  value={profile.links.spotify}
                  onChange={(e) =>
                    onUpdateProfile({ ...profile, links: { ...profile.links, spotify: e.target.value } })
                  }
                  className="w-full bg-black border border-zinc-700 text-white p-2 focus:border-rose-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Bandcamp URL</label>
                <input
                  type="text"
                  value={profile.links.bandcamp}
                  onChange={(e) =>
                    onUpdateProfile({ ...profile, links: { ...profile.links, bandcamp: e.target.value } })
                  }
                  className="w-full bg-black border border-zinc-700 text-white p-2 focus:border-rose-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Instagram URL</label>
                <input
                  type="text"
                  value={profile.links.instagram}
                  onChange={(e) =>
                    onUpdateProfile({ ...profile, links: { ...profile.links, instagram: e.target.value } })
                  }
                  className="w-full bg-black border border-zinc-700 text-white p-2 focus:border-rose-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => setViewMode('preview')}
              className="bg-yellow-400 text-black font-mono font-bold text-xs uppercase px-4 py-2 border-2 border-black shadow-brutal"
            >
              Salvar & Visualizar Prévia
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
