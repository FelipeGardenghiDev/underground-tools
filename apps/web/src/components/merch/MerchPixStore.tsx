'use client';

import React, { useState } from 'react';
import { BandProfile, MerchItem } from '@/types';
import { 
  ShoppingBag, 
  Copy, 
  Check, 
  QrCode, 
  MessageSquare, 
  Plus, 
  Trash2, 
  ShieldAlert, 
  Flame 
} from 'lucide-react';

interface MerchPixStoreProps {
  merch: MerchItem[];
  profile: BandProfile;
  onUpdateMerch: (merch: MerchItem[]) => void;
}

export function MerchPixStore({ merch, profile, onUpdateMerch }: MerchPixStoreProps) {
  const [selectedItem, setSelectedItem] = useState<MerchItem | null>(merch[0] || null);
  const [selectedSize, setSelectedSize] = useState<string>('G');
  const [copiedPix, setCopiedPix] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  // New item form
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<MerchItem['category']>('Camiseta');
  const [newPrice, setNewPrice] = useState(60);
  const [newSizes, setNewSizes] = useState('P, M, G, GG');
  const [newDesc, setNewDesc] = useState('');

  const handleCopyPix = () => {
    navigator.clipboard.writeText(profile.links.pixKey);
    setCopiedPix(true);
    setTimeout(() => setCopiedPix(false), 2000);
  };

  const handleAddMerch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    const newItem: MerchItem = {
      id: `merch-${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      price: newPrice,
      sizes: newSizes ? newSizes.split(',').map((s) => s.trim()).filter(Boolean) : undefined,
      description: newDesc.trim() || 'Item oficial da banda.',
      inStock: true,
    };

    onUpdateMerch([...merch, newItem]);
    setSelectedItem(newItem);
    setShowAddForm(false);
    setNewTitle('');
    setNewDesc('');
  };

  const handleDeleteMerch = (id: string) => {
    const updated = merch.filter((m) => m.id !== id);
    onUpdateMerch(updated);
    if (selectedItem?.id === id) {
      setSelectedItem(updated[0] || null);
    }
  };

  // WhatsApp order link formatting
  const generateWhatsAppLink = () => {
    if (!selectedItem) return '#';
    const message = `Salve galera do ${profile.name}! Gostaria de adquirir o item: *${selectedItem.title}*${
      selectedItem.sizes ? ` (Tamanho: ${selectedSize})` : ''
    } no valor de R$ ${selectedItem.price.toFixed(
      2
    )}. Já gerei a chave Pix e gostaria de combinar a entrega / envio!`;
    return `https://wa.me/${profile.links.whatsappOrder}?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Toolbar */}
      <div className="bg-zinc-900 border-2 border-zinc-700 p-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-bold text-yellow-400 uppercase tracking-widest block">
            VITRINE DE MERCH // VENDA DIRETA NO PIX
          </span>
          <p className="text-xs text-zinc-400 font-mono">
            Zero taxas de intermediários. O dinheiro vai 100% direto para o caixa da banda via Pix e WhatsApp.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-yellow-400 hover:bg-yellow-300 text-black font-mono font-bold text-xs uppercase px-4 py-2 border-2 border-black shadow-brutal flex items-center gap-1.5 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          {showAddForm ? 'Fechar' : '+ Cadastrar Novo Merch'}
        </button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <form
          onSubmit={handleAddMerch}
          className="bg-[#121214] border-2 border-yellow-400 p-6 shadow-brutal space-y-4 font-mono text-xs"
        >
          <h3 className="font-stencil text-lg text-yellow-400 uppercase">
            CADASTRAR ITEM DE MERCHANDISING
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-zinc-400 block mb-1">Título do Produto</label>
              <input
                type="text"
                required
                placeholder="Ex: Camiseta 'Sem Trégua'"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full bg-black border border-zinc-700 text-white p-2 focus:border-rose-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-zinc-400 block mb-1">Categoria</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as any)}
                className="w-full bg-black border border-zinc-700 text-white p-2 focus:border-rose-500 focus:outline-none"
              >
                <option value="Camiseta">Camiseta</option>
                <option value="Fita K7">Fita K7</option>
                <option value="Vinil / CD">Vinil / CD</option>
                <option value="Patch / Bottom">Patch / Bottom</option>
                <option value="Zine / Print">Zine / Pôster</option>
                <option value="Adesivos">Cartela de Adesivos</option>
              </select>
            </div>

            <div>
              <label className="text-zinc-400 block mb-1">Preço (R$)</label>
              <input
                type="number"
                min="0"
                step="1"
                required
                value={newPrice}
                onChange={(e) => setNewPrice(parseFloat(e.target.value) || 0)}
                className="w-full bg-black border border-zinc-700 text-white p-2 focus:border-rose-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-zinc-400 block mb-1">Tamanhos disponíveis (separados por vírgula)</label>
              <input
                type="text"
                placeholder="P, M, G, GG (ou deixe em branco se for tamanho único)"
                value={newSizes}
                onChange={(e) => setNewSizes(e.target.value)}
                className="w-full bg-black border border-zinc-700 text-white p-2 focus:border-rose-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-zinc-400 block mb-1">Descrição do material / detalhes</label>
              <input
                type="text"
                placeholder="Ex: Silk screen frente e verso, algodão penteado 30.1..."
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                className="w-full bg-black border border-zinc-700 text-white p-2 focus:border-rose-500 focus:outline-none"
              />
            </div>
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
              Salvar Produto
            </button>
          </div>
        </form>
      )}

      {/* Main Grid: Products List + Pix Checkout Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Merch Catalog (2 cols) */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {merch.map((item) => {
            const isSelected = selectedItem?.id === item.id;
            return (
              <div
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className={`cursor-pointer p-4 border-2 transition-all flex flex-col justify-between shadow-brutal relative ${
                  isSelected
                    ? 'bg-zinc-900 border-rose-500 ring-2 ring-rose-500'
                    : 'bg-[#0f0f12] border-zinc-800 hover:border-zinc-600'
                }`}
              >
                {/* Category badge */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="bg-black text-yellow-400 text-[10px] font-mono font-bold px-2 py-0.5 border border-zinc-800 uppercase">
                    {item.category}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteMerch(item.id);
                    }}
                    className="text-zinc-600 hover:text-rose-500 p-1"
                    title="Excluir produto"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-1 mb-4">
                  <h4 className="font-stencil text-xl text-white tracking-wide">{item.title}</h4>
                  <p className="font-mono text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Price and Action */}
                <div className="border-t border-zinc-800/80 pt-3 flex items-center justify-between">
                  <span className="font-stencil text-2xl text-emerald-400">
                    R$ {item.price.toFixed(2)}
                  </span>
                  <button
                    onClick={() => setSelectedItem(item)}
                    className="bg-yellow-400 hover:bg-yellow-300 text-black font-mono font-bold text-xs uppercase px-3 py-1.5 border border-black shadow-brutal-sm"
                  >
                    Comprar via Pix
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* PIX Checkout & WhatsApp Drawer (1 col) */}
        <div className="bg-[#121214] border-2 border-zinc-700 p-5 shadow-brutal space-y-5 flex flex-col justify-between">
          {selectedItem ? (
            <div className="space-y-4">
              <div className="border-b border-zinc-800 pb-3">
                <span className="text-[10px] font-mono text-rose-500 uppercase tracking-widest block">
                  PEDIDO DIRETO DA BANDA
                </span>
                <h3 className="font-stencil text-2xl text-white">{selectedItem.title}</h3>
                <span className="text-xl font-stencil text-emerald-400 block mt-1">
                  VALOR: R$ {selectedItem.price.toFixed(2)}
                </span>
              </div>

              {/* Sizes selector */}
              {selectedItem.sizes && selectedItem.sizes.length > 0 && (
                <div>
                  <label className="text-xs font-mono text-zinc-400 block mb-1.5">
                    Escolha o Tamanho:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {selectedItem.sizes.map((sz) => (
                      <button
                        key={sz}
                        onClick={() => setSelectedSize(sz)}
                        className={`font-mono text-xs px-3 py-1.5 border-2 transition-all ${
                          selectedSize === sz
                            ? 'bg-rose-600 text-white border-black shadow-brutal-sm'
                            : 'bg-black text-zinc-300 border-zinc-700 hover:border-zinc-500'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* PIX Block */}
              <div className="bg-black border-2 border-dashed border-zinc-700 p-4 space-y-3 text-center">
                <div className="flex items-center justify-center gap-1.5 text-xs font-mono text-yellow-400 font-bold uppercase">
                  <QrCode className="w-4 h-4" /> CHAVE PIX DA BANDA
                </div>

                {/* Simulated high-contrast QR box */}
                <div className="w-36 h-36 mx-auto bg-white p-2 border-2 border-black flex flex-col items-center justify-center">
                  <div className="grid grid-cols-4 gap-1 w-full h-full p-1 bg-black">
                    <div className="bg-white col-span-2 row-span-2"></div>
                    <div className="bg-white"></div>
                    <div className="bg-white"></div>
                    <div className="bg-white"></div>
                    <div className="bg-white"></div>
                    <div className="bg-white col-span-2 row-span-2"></div>
                    <div className="bg-white"></div>
                    <div className="bg-white"></div>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-[11px] font-mono text-zinc-400">Titular: {profile.links.pixReceiver}</div>
                  <div className="font-mono text-xs font-bold text-white bg-zinc-900 p-2 border border-zinc-800 break-all select-all">
                    {profile.links.pixKey}
                  </div>
                </div>

                <button
                  onClick={handleCopyPix}
                  className="w-full bg-zinc-800 hover:bg-zinc-700 text-yellow-400 font-mono text-xs py-2 border border-zinc-600 flex items-center justify-center gap-1.5 transition-colors"
                >
                  {copiedPix ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  {copiedPix ? 'Chave Copiada para Área de Transferência!' : 'Copiar Chave Pix'}
                </button>
              </div>

              {/* WhatsApp direct send */}
              <div className="space-y-2 pt-2">
                <a
                  href={generateWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-xs uppercase py-3 border-2 border-black shadow-brutal flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <MessageSquare className="w-4 h-4 fill-white" />
                  Confirmar Pedido no WhatsApp da Banda
                </a>
                <p className="text-[10px] font-mono text-zinc-500 text-center">
                  Ao clicar, abre o WhatsApp com a mensagem do seu pedido já pronta para envio.
                </p>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-zinc-500 font-mono text-xs">
              Selecione um produto do catálogo para abrir o checkout Pix.
            </div>
          )}

          <div className="border-t border-zinc-800 pt-3 text-[11px] font-mono text-zinc-500 flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-rose-500 shrink-0" />
            <span>Apoie o circuito independente comprando direto de quem produz.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
