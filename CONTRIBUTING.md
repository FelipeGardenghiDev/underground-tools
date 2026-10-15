# 🤝 Como Contribuir com o Underground Tools

O **Underground Tools** é um projeto construído por e para a cena de música independente (punk, hardcore, emo, metal, indie, folk e derivados). 

Queremos ferramentas simples, rápidas, estáveis e livres de paywalls ou dependências proprietárias predatórias.

---

## 🛠️ Filosofia de Contribuição

1. **Sem Firula Corporativa:** Nada de interfaces estéreis cheias de gradientes de IA ou botões gigantescos para coletar dados pessoais.
2. **Prioridade para a Praticidade de Palco:** Se uma funcionalidade ajuda a banda a passar o som mais rápido, a não queimar equipamento ou a vender merch sem taxa, ela é prioridade máxima.
3. **Leveza & Custo Zero:** Todo código deve conseguir rodar em camadas gratuitas de hospedagem (Vercel Hobby, Supabase Free Tier, GitHub Pages).

---

## 💻 Ambiente de Desenvolvimento

### Requisitos
- **Node.js** >= 18
- **pnpm** >= 9 (`npm i -g pnpm`)

### Comandos do Monorepo

```bash
# Instalar dependências de todos os pacotes
pnpm install

# Rodar o frontend em modo dev
pnpm dev

# Testar o build de produção (Turbopack)
pnpm build
```

---

## 🎸 O Que Você Pode Adicionar?

- **Novos Equipamentos de Palco:** Sugira ou adicione novos presets de instrumentos em `apps/web/src/components/stage-plot/StageCanvas.tsx`.
- **Dicas de Produção no Guia de Estrada:** Tem experiência com iluminação, cabos, gravação de ensaio ou van? Abra um PR com melhorias no `RoadGuideView.tsx`.
- **Melhorias de Acessibilidade e Exportação:** Novos formatos de impressão ou integrações diretas de áudio.

---

## 📋 Padrão de Commits

Seguimos a convenção de Conventional Commits:
- `feat: adiciona preset de amplificador valvulado 2x12`
- `fix: corrige alinhamento de canais da input list na impressao A4`
- `docs: atualiza guia de click e vs para bateristas`

*Obrigado por fortalecer o underground! DIY or Die.*
