'use client';

import React, { useState } from 'react';
import { 
  Sliders, 
  Zap, 
  Radio, 
  Flame, 
  CheckSquare, 
  Volume2, 
  Share2, 
  Wrench, 
  AlertTriangle,
  Lightbulb,
  Music,
  Compass
} from 'lucide-react';

type GuideSection = 'palco' | 'vs_click' | 'foh' | 'ensaio' | 'divulgacao' | 'bag';

export function RoadGuideView() {
  const [activeSection, setActiveSection] = useState<GuideSection>('palco');

  // Interactive Survival Bag checklist state
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({
    gaffer: true,
    p10_reserva: true,
    afinador_mute: true,
    pilhas_9v: false,
    chave_batera: true,
    protetor_auricular: true,
    cordas_reserva: false,
    adaptador_p2_p10: true,
    lanterna: false,
    extensao_eletrica: true,
  });

  const toggleItem = (key: string) => {
    setCheckedItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-6 font-mono">
      {/* Top Banner Toolbar */}
      <div className="bg-[#0f0f12] border-4 border-zinc-800 p-6 shadow-brutal relative">
        <div className="inline-block bg-yellow-400 text-black px-2.5 py-0.5 font-bold text-xs uppercase tracking-widest border border-black shadow-brutal-sm -rotate-1 mb-2">
          MANUAL PRÁTICO • PRODUÇÃO DE PALCO & ESTRADA DIY
        </div>
        <h1 className="font-stencil text-3xl md:text-5xl text-white tracking-wider uppercase">
          GUIA DE SOBREVIVÊNCIA DO MÚSICO INDEPENDENTE
        </h1>
        <p className="text-xs md:text-sm text-zinc-300 mt-2 max-w-3xl leading-relaxed">
          Tudo o que ninguém te ensina sobre como ter uma postura profissional no palco: fitas coloridas,
          como usar VS sem falhas, respeito com o técnico de P.A., ensaios eficientes e divulgação autoral sem firula corporativa.
        </p>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap gap-1.5 border-b-2 border-zinc-800 pb-3">
        <button
          onClick={() => setActiveSection('palco')}
          className={`px-3 py-2 text-xs font-bold uppercase border-2 transition-all ${
            activeSection === 'palco'
              ? 'bg-rose-600 text-white border-black shadow-brutal-sm'
              : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-white'
          }`}
        >
          01. Palco & Som Pro
        </button>

        <button
          onClick={() => setActiveSection('vs_click')}
          className={`px-3 py-2 text-xs font-bold uppercase border-2 transition-all ${
            activeSection === 'vs_click'
              ? 'bg-yellow-400 text-black border-black shadow-brutal-sm'
              : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-white'
          }`}
        >
          02. Usando VS & Click
        </button>

        <button
          onClick={() => setActiveSection('foh')}
          className={`px-3 py-2 text-xs font-bold uppercase border-2 transition-all ${
            activeSection === 'foh'
              ? 'bg-zinc-100 text-black border-black shadow-brutal-sm'
              : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-white'
          }`}
        >
          03. Relação com F.O.H.
        </button>

        <button
          onClick={() => setActiveSection('ensaio')}
          className={`px-3 py-2 text-xs font-bold uppercase border-2 transition-all ${
            activeSection === 'ensaio'
              ? 'bg-emerald-600 text-white border-black shadow-brutal-sm'
              : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-white'
          }`}
        >
          04. Ensaio Produtivo
        </button>

        <button
          onClick={() => setActiveSection('divulgacao')}
          className={`px-3 py-2 text-xs font-bold uppercase border-2 transition-all ${
            activeSection === 'divulgacao'
              ? 'bg-purple-600 text-white border-black shadow-brutal-sm'
              : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-white'
          }`}
        >
          05. Divulgação Autoral
        </button>

        <button
          onClick={() => setActiveSection('bag')}
          className={`px-3 py-2 text-xs font-bold uppercase border-2 transition-all ${
            activeSection === 'bag'
              ? 'bg-zinc-300 text-black border-black shadow-brutal-sm'
              : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-white'
          }`}
        >
          06. Bag da Sobrevivência
        </button>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 1: PALCO & SOM PRO                                               */}
      {/* ========================================================================= */}
      {activeSection === 'palco' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Dica 1: Fitas Coloridas & Gaffer */}
            <div className="bg-[#121215] border-2 border-zinc-800 p-5 shadow-brutal space-y-3">
              <div className="flex items-center gap-2 border-b border-zinc-800 pb-2">
                <span className="w-6 h-6 bg-yellow-400 text-black font-bold flex items-center justify-center text-xs">
                  A
                </span>
                <h3 className="font-stencil text-xl text-yellow-400">
                  O TRUQUE DAS FITAS COLORIDAS (SETUP EM 3 MINUTOS)
                </h3>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Em festivais underground com 5 bandas, a troca de palco precisa ser instantânea. Se você perder
                15 minutos desenrolando cabo embaraçado, a casa corta 2 músicas do seu set.
              </p>
              <div className="bg-black/60 p-3 border-l-4 border-yellow-400 text-xs space-y-1.5">
                <strong className="text-white block uppercase">Identifique os cabos por cor:</strong>
                <p>• <span className="text-rose-400 font-bold">Fita Vermelha:</span> Guitarra 1 (cabos, fonte e pedaleira).</p>
                <p>• <span className="text-sky-400 font-bold">Fita Azul:</span> Guitarra 2.</p>
                <p>• <span className="text-yellow-400 font-bold">Fita Amarela:</span> Baixo e D.I.</p>
                <p>• <span className="text-emerald-400 font-bold">Fita Verde:</span> Microfones de voz próprios.</p>
              </div>
              <p className="text-[11px] text-zinc-400 italic">
                Resultado: no escuro do palco, qualquer integrante ou roadie sabe exatamente onde cada cabo se conecta sem perguntar nada.
              </p>
            </div>

            {/* Dica 2: Posicionamento dos Amplificadores */}
            <div className="bg-[#121215] border-2 border-zinc-800 p-5 shadow-brutal space-y-3">
              <div className="flex items-center gap-2 border-b border-zinc-800 pb-2">
                <span className="w-6 h-6 bg-rose-600 text-white font-bold flex items-center justify-center text-xs">
                  B
                </span>
                <h3 className="font-stencil text-xl text-rose-500">
                  NÃO APONTE O AMPLIFICADOR PARA AS CANELAS
                </h3>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                O erro clássico de guitarrista: colocar o amplificador no chão reto apontando para a panturrilha.
                O ouvido do músico está a 1,75m de altura; como não se ouve direito, ele dobra o volume master no amp.
              </p>
              <div className="bg-black/60 p-3 border-l-4 border-rose-600 text-xs space-y-1.5">
                <strong className="text-white block uppercase">O que fazer:</strong>
                <p>1. <strong>Incline o amp (Tilt-back):</strong> aponte os alto-falantes diretamente para a cabeça do músico.</p>
                <p>2. <strong>Coloque em cima de um case:</strong> eleva o som e você se ouve perfeitamente no palco com volume moderado.</p>
                <p>3. <strong>Voz limpa no microfone:</strong> se o amp não estiver gritando no talo para a frente, o mic do vocal não capta a sobra da guitarra.</p>
              </div>
            </div>

            {/* Dica 3: Afinador com MUTE Obrigatório */}
            <div className="bg-[#121215] border-2 border-zinc-800 p-5 shadow-brutal space-y-3">
              <div className="flex items-center gap-2 border-b border-zinc-800 pb-2">
                <span className="w-6 h-6 bg-zinc-200 text-black font-bold flex items-center justify-center text-xs">
                  C
                </span>
                <h3 className="font-stencil text-xl text-white">
                  AFINAÇÃO NO SILÊNCIO (AFINADOR DE PEDAL COM MUTE)
                </h3>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Nada soa mais amador do que a banda terminar uma música pesada, ficar um silêncio constrangedor no clube,
                e o guitarrista ficar tocando corda solta em alto volume: <em>"Blergh... bliiim... tlim..."</em>.
              </p>
              <p className="bg-black/60 p-3 border-l-4 border-zinc-500 text-xs text-zinc-300">
                O primeiro pedal da sua cadeia de efeitos DEVE ser um afinador cromático com chave Mute (Boss TU-3, TC Polytune, Korg Pitchblack).
                Pisou, cortou o som para o P.A., dropou a afinação em 5 segundos no escuro e voltou com o próximo riff.
              </p>
            </div>

            {/* Dica 4: Fita Crepe no Palco para o Baterista */}
            <div className="bg-[#121215] border-2 border-zinc-800 p-5 shadow-brutal space-y-3">
              <div className="flex items-center gap-2 border-b border-zinc-800 pb-2">
                <span className="w-6 h-6 bg-emerald-500 text-black font-bold flex items-center justify-center text-xs">
                  D
                </span>
                <h3 className="font-stencil text-xl text-emerald-400">
                  TRAVA DE BUMBO & TAPETE DE BATERIA
                </h3>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Piso de palco underground costuma ser madeira lisa ou azulejo escorregadio. No meio da segunda música acelerada,
                o bumbo começa a andar para a frente e o baterista passa o show inteiro puxando o bumbo de volta com o pé.
              </p>
              <p className="bg-black/60 p-3 border-l-4 border-emerald-500 text-xs text-zinc-300">
                <strong>Solução:</strong> Leve sempre um pedaço de carpete ou tapete antiderrapante (1,5m x 1,5m). Se não tiver,
                passe fita Gaffer colando os pés do bumbo no praticável de madeira antes da passagem de som.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 2: USANDO VS & CLICK NO UNDERGROUND                              */}
      {/* ========================================================================= */}
      {activeSection === 'vs_click' && (
        <div className="bg-[#121215] border-2 border-zinc-800 p-6 shadow-brutal space-y-6">
          <div className="border-b border-zinc-800 pb-3">
            <span className="text-xs text-yellow-400 font-bold uppercase tracking-widest block">
              GUIA TÉCNICO // TRACKS, SAMPLERS & METRÔNOMO
            </span>
            <h2 className="font-stencil text-3xl text-white">
              COMO RODAR VS NO UNDERGROUND SEM TRAVAR E SEM PAGAR CARO
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              Bandas de post-hardcore, emo e synthpunk usam samples, intros e ambiências. Veja a arquitetura infalível.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="bg-black border border-zinc-800 p-4 space-y-2">
              <div className="font-stencil text-lg text-yellow-400">01. O SPLIT L/R BÁSICO</div>
              <p className="text-zinc-300 leading-relaxed">
                Você não precisa de uma interface cara de 8 saídas. Basta uma saída estéreo (P2 ou interface de 2 canais):
              </p>
              <ul className="space-y-1 text-zinc-400">
                <li>• <strong>Canal L (Esquerdo):</strong> Metrônomo (Click) + voz guia (apenas no fone do baterista).</li>
                <li>• <strong>Canal R (Direito):</strong> Pistas de áudio, synths e intros (vai para a mesa de som / FOH).</li>
              </ul>
            </div>

            <div className="bg-black border border-zinc-800 p-4 space-y-2">
              <div className="font-stencil text-lg text-rose-500">02. DIRECT BOX OBRIGATÓRIO</div>
              <p className="text-zinc-300 leading-relaxed">
                NUNCA conecte o cabo P2/P10 do seu computador ou celular direto na medusa ou mesa de som da casa sem Direct Box.
              </p>
              <p className="text-zinc-400">
                Se a mesa da casa ligar o <strong>+48V Phantom Power</strong> no canal do seu computador, pode queimar a saída da placa.
                O Direct Box isola galvanicamente seu equipamento e transforma o sinal em balanceado sem chiado.
              </p>
            </div>

            <div className="bg-black border border-zinc-800 p-4 space-y-2">
              <div className="font-stencil text-lg text-emerald-400">03. REGRA DE OURO: MODO AVIÃO</div>
              <p className="text-zinc-300 leading-relaxed">
                Se estiver rodando as pistas via iPad ou celular:
              </p>
              <div className="bg-red-950/60 border border-red-800 p-2 text-rose-300 text-[11px] font-bold">
                ⚠️ MODO AVIÃO + NÃO PERTURBE ATIVADO!
              </div>
              <p className="text-zinc-400 text-[11px]">
                Uma ligação de telemarketing no meio do clímax da sua música mais dramática encerra a carreira da banda no local.
              </p>
            </div>
          </div>

          <div className="border border-zinc-700 bg-black/60 p-4 text-xs space-y-2">
            <span className="text-yellow-400 font-bold uppercase tracking-wider block">
              PLANO DE FUGA: SE O VS TRAVAR NO SHOW, O QUE A BANDA FAZ?
            </span>
            <p className="text-zinc-300 leading-relaxed">
              Equipamento eletrônico esquenta e falha. Toda banda que usa VS precisa ter um combinado interno: se o laptop travar,
              o baterista conta 4 baquetadas no ar e a banda toca a versão crua (raw) de guitarra, baixo e bateria. O show NUNCA pode parar.
            </p>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 3: RELAÇÃO COM FOH / TÉCNICO DE SOM                              */}
      {/* ========================================================================= */}
      {activeSection === 'foh' && (
        <div className="bg-[#121215] border-2 border-zinc-800 p-6 shadow-brutal space-y-6">
          <div className="border-b border-zinc-800 pb-3">
            <span className="text-xs text-emerald-400 font-bold uppercase tracking-widest block">
              F.O.H. // FRONT OF HOUSE
            </span>
            <h2 className="font-stencil text-3xl text-white">
              COMO TRATAR O TÉCNICO DE SOM E TER O MELHOR TIMBRE DA NOITE
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              O técnico de som é a pessoa mais importante da noite. Ele pode fazer seu show soar gigantesco ou inaudível.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="bg-black border-l-4 border-emerald-500 p-4 space-y-2">
              <h4 className="font-stencil text-lg text-emerald-400">O QUE FAZER (ATITUDE PRO):</h4>
              <ul className="space-y-2 text-zinc-300">
                <li>• <strong>Entregar a Input List impressa:</strong> Entregue uma folha A4 em mãos assim que chegar à casa.</li>
                <li>• <strong>Silêncio durante o teste de canal:</strong> Quando o operador pedir "Bumbo", apenas o bumbo toca. Ninguém sola guitarra, ninguém afina baixo.</li>
                <li>• <strong>Sinais de mão claros no monitor:</strong> Aponte para o microfone e faça polegar para cima se quiser mais voz no seu retorno. Não grite no microfone: <em>"Tô sem retorno!"</em>.</li>
                <li>• <strong>Agradecer no microfone no final do set:</strong> Sempre cite o nome do técnico da casa. Gentileza gera volume e dedicação na mixagem.</li>
              </ul>
            </div>

            <div className="bg-black border-l-4 border-rose-600 p-4 space-y-2">
              <h4 className="font-stencil text-lg text-rose-500">O QUE NUNCA FAZER:</h4>
              <ul className="space-y-2 text-zinc-300">
                <li>• <strong>Mexer no ganho do amp depois da passagem:</strong> Se você aumentar o volume do amplificador durante o show, estoura a compressão e a mix do operador vai pro ralo.</li>
                <li>• <strong>Tocar bumbo enquanto o operador ajusta o microfone no palco:</strong> O operador está com a cabeça colada no falante; respeite a audição de quem está trabalhando.</li>
                <li>• <strong>Pedir "tudo no retorno":</strong> Se você pedir bateria, baixo, 2 guitarras e voz no mesmo monitor de chão pequeno, vira uma maionese incompreensível. Peça apenas o que você precisa para se guiar (sua voz + instrumento que dita o tempo).</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 4: ENSAIO PRODUTIVO                                              */}
      {/* ========================================================================= */}
      {activeSection === 'ensaio' && (
        <div className="bg-[#121215] border-2 border-zinc-800 p-6 shadow-brutal space-y-5">
          <div className="border-b border-zinc-800 pb-3">
            <span className="text-xs text-yellow-400 font-bold uppercase tracking-widest block">
              PRÉ-PRODUÇÃO & EFICIÊNCIA
            </span>
            <h2 className="font-stencil text-3xl text-white">
              COMO PARAR DE PERDER TEMPO NO ESTÚDIO DE ENSAIO
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="bg-black p-4 border border-zinc-800 space-y-2">
              <strong className="text-yellow-400 font-stencil text-base block">1. GRAVAÇÃO EM PONTO FIXO</strong>
              <p className="text-zinc-300 leading-relaxed">
                Coloque um celular gravando áudio no centro da sala a cada ensaio. Ouça a gravação no fone no dia seguinte:
                é o único jeito de perceber descompassos, notas fora do tom e transições arrastadas que você não ouve na adrenalina da sala.
              </p>
            </div>

            <div className="bg-black p-4 border border-zinc-800 space-y-2">
              <strong className="text-yellow-400 font-stencil text-base block">2. SIMULAÇÃO DE TROCA DE PALCO</strong>
              <p className="text-zinc-300 leading-relaxed">
                Pelo menos uma vez por mês, ensaie com os instrumentos dentro dos cases no chão da sala. Marque no cronômetro:
                quanto tempo a banda leva para abrir os cases, plugar os cabos, passar o som e tocar a 1ª música? Se passar de 7 minutos, ajuste.
              </p>
            </div>

            <div className="bg-black p-4 border border-zinc-800 space-y-2">
              <strong className="text-yellow-400 font-stencil text-base block">3. O SETLIST COMPLETO SEM PAUSAS</strong>
              <p className="text-zinc-300 leading-relaxed">
                A última hora do ensaio antes de um show deve ser o setlist corrido do começo ao fim sem parar.
                Se alguém errar uma nota, ninguém para a música: segue o baile como se estivesse diante de 300 pessoas no Hangar 110.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 5: DIVULGAÇÃO AUTORAL SEM PARECER CORPORATIVO                   */}
      {/* ========================================================================= */}
      {activeSection === 'divulgacao' && (
        <div className="bg-[#121215] border-2 border-zinc-800 p-6 shadow-brutal space-y-5">
          <div className="border-b border-zinc-800 pb-3">
            <span className="text-xs text-purple-400 font-bold uppercase tracking-widest block">
              MÍDIAS & COMUNIDADE UNDERGROUND
            </span>
            <h2 className="font-stencil text-3xl text-white">
              DIVULGAÇÃO PARA BANDA AUTORAL (SEM DANCINHA DE TIKTOK)
            </h2>
          </div>

          <div className="text-xs text-zinc-300 leading-relaxed space-y-3 font-mono">
            <p>
              O público de punk, hardcore e emo valoriza <strong>verdade e conexão humana</strong>. Quando a banda tenta
              seguir cartilhas de marketing digital corporativo com frases prontas do tipo <em>"Arrasta pra cima pra conferir o novo single!"</em>,
              o fã se afasta.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="bg-black border border-zinc-800 p-4 space-y-2">
              <h4 className="font-stencil text-base text-yellow-400">CRONOGRAMA DE SHOW (3 SEMANAS ANTES):</h4>
              <ul className="space-y-1.5 text-zinc-300">
                <li>• <strong>D-21 (3 semanas):</strong> Postar flyer oficial com local, preço e horário das portas.</li>
                <li>• <strong>D-14 (2 semanas):</strong> Vídeo de 20 segundos tocando um trecho cru do ensaio + marcação das outras bandas do rolê.</li>
                <li>• <strong>D-7 (1 semana):</strong> Apresentar as bandas amigas e incentivar a galera a chegar cedo para ver a primeira banda.</li>
                <li>• <strong>D-1 (Véspera):</strong> Divulgar horários exatos de cada banda subir no palco.</li>
                <li>• <strong>Dia do show:</strong> Link do Maps nos stories + foto da banquinha de merch montada.</li>
              </ul>
            </div>

            <div className="bg-black border border-zinc-800 p-4 space-y-2">
              <h4 className="font-stencil text-base text-purple-400">O CORRE FÍSICO QUE AINDA FUNCIONA:</h4>
              <ul className="space-y-1.5 text-zinc-300">
                <li>• <strong>Cartazes colados no centro:</strong> Papel A3 preto e branco colado em postes e muros de bairros com casas de show alternativas.</li>
                <li>• <strong>Adesivos distribuídos mão em mão:</strong> Adesivo com o logo e nome da banda cola em case de instrumento, shape de skate e porta de banheiro de clube. Fica pra sempre.</li>
                <li>• <strong>Fanzines dobrados na banca de merch:</strong> Imprima 50 cópias de um zine com as letras das músicas e desenhos. O fã guarda como relíquia.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 6: A BAG DA SOBREVIVÊNCIA (CHECKLIST INTERATIVO)                 */}
      {/* ========================================================================= */}
      {activeSection === 'bag' && (
        <div className="bg-[#121215] border-2 border-zinc-800 p-6 shadow-brutal space-y-5">
          <div className="border-b border-zinc-800 pb-3 flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-xs text-yellow-400 font-bold uppercase tracking-widest block">
                CHECKLIST DE ESTRADA // EQUIPAMENTOS VITAIS
              </span>
              <h2 className="font-stencil text-3xl text-white">
                A "BAG DA SOBREVIVÊNCIA" DE PALCO
              </h2>
            </div>
            <span className="bg-black text-yellow-400 font-mono text-xs px-3 py-1 border border-zinc-700">
              {Object.values(checkedItems).filter(Boolean).length} de {Object.keys(checkedItems).length} checados
            </span>
          </div>

          <p className="text-xs text-zinc-300 font-mono">
            Uma mochila preta resistente que SEMPRE acompanha a banda na van ou no carro em dia de show:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
            {[
              { id: 'gaffer', title: '1 Rolo de Fita Gaffer ou Fita Silver Tape preta', desc: 'Prender cabos no chão, colar setlist, travar pés do bumbo.' },
              { id: 'p10_reserva', title: '2 Cabos P10 de 6 metros reservas testados', desc: 'Nunca confie que o cabo da guitarra não vai chiar hoje.' },
              { id: 'afinador_mute', title: 'Afinador de chão com MUTE e bateria reserva', desc: 'Afinação rápida e silenciosa entre as músicas.' },
              { id: 'pilhas_9v', title: 'Duas pilhas 9V alcalinas LACRADAS', desc: 'Para baixos com circuito ativo ou pedais sem fonte.' },
              { id: 'chave_batera', title: 'Chave de afinação de bateria + feltros de prato', desc: 'Metade das casas de show perde o feltro do prato de ataque.' },
              { id: 'protetor_auricular', title: 'Protetores auriculares para todos os integrantes', desc: 'Preserve sua audição: tontura e zumbido destroem carreiras.' },
              { id: 'cordas_reserva', title: '1 Encordoamento reserva completo + alicate pequeno', desc: 'Corda arrebenta sempre na hora do solo mais rápido.' },
              { id: 'adaptador_p2_p10', title: 'Adaptadores P2 para P10 e P10 para P2', desc: 'Salva quem roda VS de celular ou usa fone in-ear.' },
              { id: 'lanterna', title: 'Lanterna pequena de LED (ou de cabeça)', desc: 'Para mexer na parte de trás dos amplificadores no breu do palco.' },
              { id: 'extensao_eletrica', title: '1 Filtro de linha régua com 5 tomadas 3 pinos', desc: 'Garante energia limpa onde só tem 1 tomada na parede.' },
            ].map((item) => (
              <div
                key={item.id}
                onClick={() => toggleItem(item.id)}
                className={`cursor-pointer p-3 border-2 transition-all flex items-start gap-3 select-none ${
                  checkedItems[item.id]
                    ? 'bg-zinc-950 border-emerald-500/80 text-zinc-200'
                    : 'bg-black border-zinc-800 text-zinc-500 hover:border-zinc-700'
                }`}
              >
                <input
                  type="checkbox"
                  checked={!!checkedItems[item.id]}
                  onChange={() => {}}
                  className="w-4 h-4 accent-emerald-500 mt-0.5 cursor-pointer shrink-0"
                />
                <div>
                  <div className={`font-bold ${checkedItems[item.id] ? 'text-white' : 'text-zinc-400'}`}>
                    {item.title}
                  </div>
                  <div className="text-[11px] text-zinc-500 mt-0.5">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
