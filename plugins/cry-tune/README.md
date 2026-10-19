# 🎙️ CryTune — Vocal Pitch Corrector & Air Presence

> **Parte da Suíte Emo Audio Tools — [Underground Tools](https://github.com/FelipeGardenghiDev/underground-tools)**  
> *Afinador vocal transparente para gravações intimistas e hard-tune expressivo calibrado para a cena alternativa e Midwest Emo.*

---

## 🖤 Recursos & Diferenciais

1. **Detecção de Pitch em Tempo Real (YIN):**
   - Algoritmo YIN com interpolação parabólica sub-amostral para rastreamento preciso da voz humana de 65 Hz (C2) a 1100 Hz (C6).
2. **Escalas Customizadas da Cena Emo:**
   - Cromática, Maior, Menor Natural, Pentatônica e afinações dedicadas para Midwest Emo (Escalas E Maior e D Maior relativas a *DAEAC#E* e *FACGCE*).
3. **Controle de Transição (Retune Speed):**
   - De 0 ms (efeito hard-tune/Cher dos anos 2000) a 80 ms (correção natural e imperceptível).
4. **Filtro Air Presence:**
   - High-shelf acústico a 10.5 kHz (+0 dB a +9 dB) para conferir brilho aéreo e presença cortante sobre guitarras dobradas.
5. **Arquitetura 100% Livre e Aberta:**
   - Código C++17 puro, seguro para áudio em tempo real (zero alocações no loop de renderização).
   - Sem telemetria, sem iLok, sem dongles, sem cobranças.

---

## 🛠️ Como Compilar

```bash
mkdir build && cd build
cmake .. -DCMAKE_BUILD_TYPE=Release
cmake --build . --config Release
ctest --output-on-failure
```
