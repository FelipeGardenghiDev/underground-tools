# ⚡ UNDERGROUND TOOLS
> **Armas de palco & ferramentas DIY para bandas independentes.**  
> *100% Código Aberto • Sem Paywall • Sem Firula Corporativa • Sem cara de IA.*

---

## 🏴 Por que o Underground Tools existe?

Tocar em banda independente no Brasil é um corre pesado: carregar amp 4x12 na chuva, dividir van com 8 pessoas, dormir no chão de sala e chegar no palco sem o técnico de som da casa saber quantos canais ou tomadas a banda precisa.

O **Underground Tools** é uma plataforma comunitária open-source projetada para dar **profissionalismo cirúrgico** ao artista independente:

1. **Mapa de Palco Visual (Stage Plot)**: Arraste bateria, amplificadores, microfones de voz, tomadas elétricas e monitores no palco.
2. **Input List & Patch de Canais**: Tabela técnica com microfones sugeridos, tipo de pedestal, observações de EQ e alertas de **+48V Phantom Power**.
3. **Exportação Limpa para Impressão (PDF A4)**: Gera com um clique a folha técnica perfeita em preto e branco para a prancheta do operador de som (F.O.H.).
4. **Press Kit Eletrônico (EPK)**: Bio curta (para flyers/cartazes e redes sociais), release completo para zines e curadorias de festivais, e download direto de fotos oficiais em alta resolução (300 DPI).
5. **Agenda de Shows (Tour Dates)**: Controle de datas, horários de abertura de portas, ingressos (Sympla, Shotgun etc.), localização no Maps e controle de shows esgotados (*Sold Out*).
6. **Vitrine de Merch & Pix Direto**: Catálogo de camisetas, fitas K7, vinil e patches com geração de Pix e fechamento direto no WhatsApp da banda (zero taxas de plataformas intermediárias).

---

## 🎨 Identidade Visual: Hardcore / Screamo / Emo 90s / Zine Culture

Esqueça o visual genérico de startup com gradientes roxos suaves, cantos hiper arredondados e cara de template de inteligência artificial. O visual do **Underground Tools** é cru e visceral:
- Contraste brutal: Fundo preto asfalto (`#080808`), papel osso (`#f4f1ea`), vermelho sangue / screamo (`#e11d48`) e fita zebrada/amarela (`#facc15`).
- Tipografia stencil/grotesque condensada para títulos + monospace para dados técnicos, canais e riders.
- Sombras sólidas offset (`shadow-brutal`), bordas duras e tags inspiradas em credenciais de camarim (*All Access / Tech Rider*).

---

## 🏗️ Arquitetura Monorepo (Custo Zero)

O projeto foi estruturado para manter o **custo de hospedagem em zero reais**, permitindo que qualquer coletivo ou banda rode sua própria instância:

```
underground-tools/
├── apps/
│   └── web/                   # Next.js 16 (Turbopack) + Tailwind CSS v4 + TypeScript
├── packages/
│   └── shared-types/          # Tipos de domínio compartilhados (Banda, Rider, Stage, Merch)
├── pnpm-workspace.yaml
├── package.json
└── LICENSE                    # Licença MIT (100% Livre)
```

- **Frontend & App Router:** Next.js hospedável no plano Hobby gratuito da Vercel.
- **Banco de Dados (Próxima etapa):** Supabase PostgreSQL (500 MB grátis) + Autenticação Magic Link / Google.
- **Armazenamento de Fotos (Próxima etapa):** Supabase Storage (1 GB grátis).
- **Impressão / PDF:** Renderização no cliente via CSS `@media print` para não onerar Serverless Functions.

---

## 🚀 Como Rodar Localmente

### Pré-requisitos
- **Node.js** >= 18 (recomendado Node 20+)
- **pnpm** >= 9 (`npm install -g pnpm`)

### Instalação e Execução

```bash
# Clone o repositório
git clone https://github.com/FelipeGardenghiDev/underground-tools.git
cd underground-tools

# Instale as dependências do monorepo
pnpm install

# Inicie o servidor de desenvolvimento
pnpm dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador para acessar a plataforma.

Para testar o build de produção:
```bash
pnpm build
```

---

## 🤝 Como Contribuir

O repositório é 100% comunitário. Ideias bem-vindas:
- Novos presets de equipamentos de palco (amplificadores clássicos, teclados, pedaleiras, microfones).
- Novas opções de exportação de rider.
- Modelagem das migrations SQL para o Supabase.

---

## 📄 Licença

Distribuído sob a licença **MIT**. Veja [LICENSE](./LICENSE) para mais detalhes.

*Feito pela cena independente, para a cena independente.*
