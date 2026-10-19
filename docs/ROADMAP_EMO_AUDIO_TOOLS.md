# 🖤 ROADMAP: EMO AUDIO TOOLS — UNDERGROUND TOOLS

> **Armas de estúdio e produção musical para a cena independente.**  
> *100% Código Aberto • Sem Paywall • Sem iLok / Dongles • Sem Assinatura • Sem Firula Corporativa.*

---

## 🏴 1. Manifesto & Filosofia

O mercado de plugins de produção musical tornou-se refém de softwares inflados, instaladores invasivos com serviços em segundo plano, plataformas antipirataria (iLok) que travam o computador e assinaturas mensais abusivas.

A **Emo Audio Tools** nasce como parte do ecossistema [**Underground Tools**](https://github.com/FelipeGardenghiDev/underground-tools) para entregar uma **suíte essencial de 5 ferramentas de mixagem e gravação**, gratuitas, de código aberto e ultra-diretas ao ponto, com identidade visual inspirada na cultura zine dos anos 90/2000 e calibrada com timbres icônicos da cena **Emo, Screamo, Midwest Emo, Pop-Punk e Post-Hardcore**.

---

## 🎛️ 2. A Suíte dos 5 Plugins Essenciais

```mermaid
flowchart LR
    In["🎸 Entrada: Voz / Guitarras / Baixo / Bateria"] --> Tune["1. CryTune<br/>(Afinador Vocal & Presença)"]
    In --> Amp["2. MidwestAmp<br/>(Simulador de Amp & Cab IR)"]
    Tune & Amp --> Punch["3. ScreamoPunch<br/>(Compressor Snare & Mixbus)"]
    Punch --> Space["4. DrownSpace<br/>(Reverb Melancólico com Ducking)"]
    Space --> Master["5. RawMaster<br/>(Maximizer LUFS & Limiter)"]
    Master --> Out["📼 Master Final Pronta"]
```

---

### 🎸 Plugin 1: **MidwestAmp** *(Guitar & Bass Tube Amp Sim + Cabinet IR)*
* **Objetivo:** O timbre de guitarra definitivo para a cena alternativa sem precisar de amplificadores de R$ 15.000.
* **Canais / Modos de Timbre:**
  1. **Kinsella Clean (Midwest Emo):** Som limpo, percussivo, brilhante e estalado para afinações abertas (*FACGCE, DAEAC#E*) e dedilhados matemáticos (American Football, TTNG, Algernon Cadwallader).
  2. **Drive & Grit (Emo / Indie 90s):** Timbre valvulado empurrado no limiar do rompimento (*edge-of-breakup*), dinâmico ao toque da palheta (Sunny Day Real Estate, Mineral, Jimmy Eat World).
  3. **Black Parade Wall (2000s Post-Hardcore / Screamo):** Paredão massivo de distorção de alto ganho estilo Marshall JCM800 + Mesa Boogie Dual Rectifier com agudos cortantes e graves firmes (My Chemical Romance, The Used, Silverstein, Underoath).
* **Controles:**
  - `Gain` (Ganho de entrada / saturação de válvulas)
  - `Bass / Middle / Treble` (Tone Stack interativo passivo de 3 bandas)
  - `Presence` (Brilho das harmônicas superiores)
  - `Cab Select` (Seleção de impulso IR embutido: 2x12 Open Back, 4x12 Vintage 30, Bass 8x10)
  - `Master Volume` (Nível de saída com limitador de segurança)

---

### 🎙️ Plugin 2: **CryTune** *(Pitch Corrector & Vocal Presence)*
* **Objetivo:** Afinação vocal intuitiva que vai da correção transparente e intimista até o hard-tune expressivo dos anos 2000.
* **Motor DSP:** Detecção no domínio do tempo via algoritmo YIN / McLeod Pitch Method acoplado a fatiamento de fase PSOLA (*Pitch-Synchronous Overlap-Add*).
* **Controles:**
  - `Key & Scale` (Escala da música: ex: C Major, D Minor, Pentatônica)
  - `Speed / Tightness` (Velocidade de transição: de 50ms para natural até 0ms para robô dramático)
  - `Air / Screamo Presence` (Filtro passa-altas de presença a 8 kHz para fazer o vocal sussurrado ou berrado cortar as guitarras dobradas)

---

### 💥 Plugin 3: **ScreamoPunch** *(Snare Crack & Vocal Grab Compressor)*
* **Objetivo:** O compressor agressivo que faz a caixa da bateria dar aquele tiro seco na cara e amarra vocais caóticos sem complicar com tempos milimétricos de attack/release.
* **Controles:**
  - `Punch` (Macro de ataque rápido e recuperação musical com saturação sutil)
  - `Smash` (Quantidade de compressão / redução de ganho com medidor estilo agulha retroiluminada)
  - `Mix` (Controle Dry/Wet para compressão paralela no estilo Nova York)

---

### 🌊 Plugin 4: **DrownSpace** *(Melancholic Ambient Reverb & Tape Flutter)*
* **Objetivo:** Reverb profundo e melancólico com recurso exclusivo de **Ducking Automático** (o reverb se afasta discretamente quando a voz ou solo toca, e preenche o espaço nos silêncios).
* **Controles:**
  - `Decay` (Tamanho do espaço: de garagem úmida a catedral gótica abandonada)
  - `Drown / Ducking` (Nível de compressão sidechain interna automática na cauda do reverb)
  - `Cassette Flutter` (Modulação nostálgica de *wow/flutter* simulando fita K7 gasta)

---

### 📼 Plugin 5: **RawMaster** *(Brickwall Limiter & Loudness Maximizer)*
* **Objetivo:** Deixar a mixagem final no volume comercial do Spotify e Bandcamp sem esmagar os transientes da bateria e sem gerar distorção digital.
* **Controles:**
  - `Target LUFS` (Preset seletor: `-14 LUFS` para Streaming ou `-9 LUFS` para som de CD quente)
  - `Ceiling` (Teto travado a `-0.3 dB True Peak` para evitar clip na conversão MP3)
  - `LUFS Live Meter` (Medidor integrado verde/amarelo/vermelho em tempo real)

---

## 🎹 2.1. A Trindade de Instrumentos Virtuais (VSTi)

Além da suíte de mixagem e efeitos de áudio, desenvolvemos 3 instrumentos virtuais (geradores de som via MIDI) essenciais para compor produções inteiras dentro do Reaper:

```mermaid
flowchart TD
    MIDI["🎹 Teclado MIDI / Piano Roll do Reaper"] --> VSTi1["🥁 1. MidwestKit<br/>(Bateria Acústica Crua de Garagem)"]
    MIDI --> VSTi2["🎹 2. SadBoy Upright<br/>(Piano Vertical de Feltro & Intimista)"]
    MIDI --> VSTi3["🌌 3. Gargantua Colossus<br/>(Paredão Atmosférico & Drone Synth)"]
    VSTi1 & VSTi2 & VSTi3 --> Mixer["🎚️ Reaper Mix Tracks"]
```

---

### 🥁 Instrumento 1: **MidwestKit** *(Raw Acoustic Emo Drum Sampler)*
* **Objetivo:** O antídoto para as baterias de metal modernas super-processadas e cheias de samples artificiais.
* **Sonoridade:**
  - **Caixa (Snare):** Estalo seco e explosivo estilo Ludwig Acrolite / Supraphonic dos anos 90 (*snare crack* à la Jimmy Eat World, The Starting Line e American Football).
  - **Bumbo (Kick):** Batente de feltro orgânico, punch médio-grave sem aquele som de "click de plástico".
  - **Pratos (Cymbals):** Hi-hats e Ride Zildjian abafados com fita gaffer para evitar sobras estridentes na mixagem.
* **Mapeamento:** 100% compatível com o mapa MIDI padrão (General MIDI / BFD / Superior Drummer).

---

### 🎹 Instrumento 2: **SadBoy Upright** *(Felt & Tack Melancholic Piano)*
* **Objetivo:** O piano acústico intimista e imperfeito que carrega toda a melancolia das introduções e baladas emo.
* **Sonoridade:**
  - Cordas abafadas por feltro natural, atenuando agudos metálicos e valorizando os graves aveludados.
  - Captação binaural com microfones estéreo bem próximos às cordas.
  - Controle de ruído mecânico de teclas (*Key Release Noise*) e pedal de sustentação.

---

### 🌌 Instrumento 3: **Gargantua Colossus** *(Cinematic Drone & Atmospheric Wall Synth)*
* **Inspirado diretamente no lendário preset *"Gargantua"* do Spectrasonics Atmosphere / Omnisphere.**
* **Objetivo:** Entregar aquele som imenso, abissal e cinematográfico que preenche o fundo de faixas de Post-Rock, Shoegaze e Emo moderno (*Deftones, Brand New, Caspian, Bring Me The Horizon, Circa Survive*), sem precisar desembolsar US$ 500 no Omnisphere nem ocupar 60 GB de disco.
* **Motor de Síntese:**
  - **7 Osciladores Analógicos Supersaw:** Levemente desafinados entre si para criar uma parede colossal de harmônicos.
  - **Sub-Oscilador Sísmico (30–60 Hz):** Onda senoidal/triangular de peso gravitacional puro.
  - **Filtro Low-Pass Ressonante de 4 Polos (24 dB/oct):** Varredura ultra lenta governada por LFO analógico (*slow evolving sweep*).
  - **Chorus Espacial & Dark Plate Reverb:** Alargamento estéreo infinito para fazer a textura flutuar ao redor das guitarras e vocais.

---

## 🏗️ 3. Arquitetura de Código & Monorepo


Os plugins residem diretamente dentro do repositório [`underground-tools`](https://github.com/FelipeGardenghiDev/underground-tools):

```
underground-tools/
├── apps/
│   └── web/                   # Next.js 16 + Tailwind CSS v4
│       └── src/app/plugins/   # 🚀 Vitrine zine com downloads e áudios Antes/Depois
├── plugins/                   # 🎛️ Código-fonte dos plugins nativos
│   ├── midwest-amp/           # Plugin de Guitarra/Baixo
│   │   ├── src/               # Código DSP C++ / Header-only
│   │   ├── irs/               # Impulse Responses embutidas (.wav)
│   │   ├── CMakeLists.txt     # Script de compilação universal
│   │   └── README.md
│   ├── cry-tune/
│   ├── screamo-punch/
│   ├── drown-space/
│   └── raw-master/
├── .github/
│   └── workflows/
│       └── build-plugins.yml  # 🤖 Compilação multiplataforma no GitHub Actions
├── docs/
│   └── ROADMAP_EMO_AUDIO_TOOLS.md
```

---

## 🤖 4. Pipeline de Compilação Multiplataforma (GitHub Actions)

Toda vez que uma nova versão for publicada no repositório, o GitHub Actions executa uma matriz automatizada:
1. **Windows Runner (`windows-latest`):** Compila o `.vst3` e `.clap` de 64 bits utilizando MSVC / CMake.
2. **macOS Runner (`macos-latest`):** Compila o binário universal para Mac (suporte nativo para processadores Intel e Apple Silicon M1/M2/M3/M4).
3. **Linux Runner (`ubuntu-latest`):** Compila o `.vst3` e `.clap` para distribuições Linux (Ubuntu, Debian, Fedora, Arch).
4. **Publicação Automática:** Empacota os arquivos em um `.zip` assinado e cria uma **Release oficial** com link direto de download no site.

---

## 🎯 5. Status de Execução & Próximos Passos

* [x] **MidwestAmp (Motor DSP C++):** Modelagem não-linear de tríodos 12AX7 (*Kinsella Clean*, *Emo 90s Crunch*, *Screamo Wall*), Tone Stack FMV passivo interativo, chave Bright, emulação de falantes 2x12 e 4x12, limitador de segurança.
* [x] **MidwestAmp CLI & WavHelper:** Utilitário standalone de linha de comando para reamping offline de arquivos WAV e sintetizador de acordes em afinação DAEAC#E.
* [x] **CryTune (Motor DSP C++):** Detecção de pitch em tempo real via algoritmo YIN, quantização musical para afinações Midwest Emo (*DAEAC#E* e *FACGCE*), retune speed configurável (0ms hard snap a 80ms natural), filtro Air Presence a 10.5 kHz.
* [x] **Pipeline CI/CD Multi-OS:** GitHub Actions compilando e validando testes unitários nativamente no Ubuntu, macOS e Windows.
* [x] **Vitrine Web Underground Tools:** Interface interativa estilo zine com controles e simulação em tempo real de ambos os plugins.
* [ ] **Plugin 3: ScreamoPunch:** Compressor de 2 botões (*Punch* e *Smash*) com saturação harmônica de fita e mixbus glue.
* [ ] **Plugin 4: DrownSpace:** Reverb cavernoso com auto-ducking e modulação tape flutter.
* [ ] **Plugin 5: RawMaster:** Maximizer LUFS com medição em tempo real e ceiling -0.3 dB True Peak.

