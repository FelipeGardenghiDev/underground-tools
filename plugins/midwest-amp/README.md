# 🎸 MidwestAmp — Tube Amp & Cab IR Simulator
> **Parte da suíte Emo Audio Tools do [Underground Tools](https://github.com/FelipeGardenghiDev/underground-tools)**  
> *Simulador de amplificador valvulado e gabinete focado em Midwest Emo, Screamo, Pop-Punk e Post-Hardcore.*

---

## ⚡ O que é o MidwestAmp?

O **MidwestAmp** é um plugin de áudio gratuito e de código aberto desenvolvido para guitarristas e baixistas independentes. Em vez de centenas de amplificadores digitais genéricos, o MidwestAmp entrega **3 canais lendários afinados para a cena alternativa**:

1. **Kinsella Clean (Midwest Emo):**
   - Headroom limpo, ataque percussivo e estalado, brilho cristalino nas cordas agudas.
   - Perfeito para afinações abertas (*FACGCE, DAEAC#E*) e dedilhados matemáticos (American Football, TTNG, Algernon Cadwallader).
2. **Emo 90s Crunch (Edge of Breakup):**
   - Crunch dinâmico de válvulas EL34/6L6 reagindo com sensibilidade à força da palhetada.
   - Ideal para bases expressivas estilo Sunny Day Real Estate, Mineral, Texas Is The Reason e Jimmy Eat World.
3. **Black Parade Wall (2000s Post-Hardcore / Screamo):**
   - Paredão massivo de distorção de alto ganho com graves travados e agudos cortantes estilo Marshall JCM800 + Mesa Dual Rectifier.
   - Ideal para bases dobradas pesadas e solos chorados (My Chemical Romance, The Used, Silverstein, Underoath).

---

## 🎛️ Controles do Painel

* **Channel Select:** Alterna entre `Kinsella Clean`, `Emo Crunch` e `Screamo Wall`.
* **Input Gain:** Ganho de entrada com filtro passa-altas de 75 Hz integrado para eliminar ruídos de sub-graves.
* **Bright Switch:** Adiciona +4 dB de brilho pré-distorção acima de 3.5 kHz.
* **Drive:** Quantidade de saturação valvulada (modelagem não-linear de tríodos 12AX7).
* **Tone Stack (Bass / Middle / Treble):** Equalizador passivo interativo de 3 bandas modelando circuitos valvulados clássicos.
* **Presence:** Acentuação harmônica no topo da faixa de frequência (4.5 kHz).
* **Cabinet IR Selector:**
  - `Midwest 2x12 Open Back`: Caixa aberta com agudos arejados para afinações abertas.
  - `British 4x12 Greenback`: Médios encorpados e madeira vintage para crunch.
  - `American 4x12 Vintage 30`: Graves firmes e agudos agressivos para guitarras pesadas.
  - `Bypass`: Desliga a caixa embutida caso queira usar suas próprias IRs na DAW.
* **Master Volume:** Volume de saída protegido por um limitador brickwall embutido a 0 dBFS.

---

## 🛠️ Como Compilar Localmente (C++17)

```bash
cd plugins/midwest-amp
mkdir build && cd build
cmake ..
cmake --build .
# Rodar testes de verificação do motor DSP:
./test_midwest_amp # (ou test_midwest_amp.exe no Windows)
```

---

## 📄 Licença

Distribuído sob licença **MIT** como parte do projeto [Underground Tools](https://github.com/FelipeGardenghiDev/underground-tools). Livre para uso em estúdio, palcos, faixas comerciais e produções independentes.
