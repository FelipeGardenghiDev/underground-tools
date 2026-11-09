// ========================================================================
// UNDERGROUND TOOLS // EMO AUDIO TOOLS WEB DSP ENGINE
// Real-time Web Audio API node network for live in-browser preview
// 100% Client-side, zero latency, no external dependencies
// ========================================================================

export type PluginType = 'midwest-amp' | 'cry-tune' | 'screamo-punch' | 'drown-space' | 'raw-master';

export class WebAudioDspEngine {
  private ctx: AudioContext | null = null;
  private isRunning: boolean = false;
  private currentPlugin: PluginType = 'midwest-amp';

  // Input sources
  private oscillatorRiffTimer: number | null = null;
  private micStream: MediaStream | null = null;
  private micSource: MediaStreamAudioSourceNode | null = null;
  private isMicActive: boolean = false;
  private isDemoPlaying: boolean = false;

  // Visualizer Analyser
  private analyser: AnalyserNode | null = null;

  // Master Gain
  private masterGain: GainNode | null = null;

  // MidwestAmp Nodes
  private ampPreGain: GainNode | null = null;
  private ampHighPass: BiquadFilterNode | null = null;
  private ampBright: BiquadFilterNode | null = null;
  private ampShaper: WaveShaperNode | null = null;
  private ampBass: BiquadFilterNode | null = null;
  private ampMid: BiquadFilterNode | null = null;
  private ampTreble: BiquadFilterNode | null = null;
  private ampPresence: BiquadFilterNode | null = null;
  private ampCabFilter: BiquadFilterNode | null = null;

  // ScreamoPunch Nodes
  private punchTransient: BiquadFilterNode | null = null;
  private punchCompressor: DynamicsCompressorNode | null = null;
  private punchDryGain: GainNode | null = null;
  private punchWetGain: GainNode | null = null;
  private punchOutGain: GainNode | null = null;

  // DrownSpace Nodes
  private reverbDelay: DelayNode | null = null;
  private reverbFeedback: GainNode | null = null;
  private reverbDamping: BiquadFilterNode | null = null;
  private reverbDuckingGain: GainNode | null = null;
  private reverbFlutterOsc: OscillatorNode | null = null;
  private reverbFlutterGain: GainNode | null = null;
  private reverbDryGain: GainNode | null = null;
  private reverbWetGain: GainNode | null = null;

  // CryTune Nodes
  private cryAirPresence: BiquadFilterNode | null = null;
  private cryPitchShifter: BiquadFilterNode | null = null;

  // RawMaster Nodes
  private masterLimiter: DynamicsCompressorNode | null = null;
  private masterCeilingGain: GainNode | null = null;

  constructor() {}

  public init() {
    if (this.ctx) return;
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    this.ctx = new AudioContextClass();

    this.analyser = this.ctx.createAnalyser();
    this.analyser.fftSize = 512;
    this.analyser.smoothingTimeConstant = 0.8;

    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = 0.85;

    // Connect to speakers
    this.masterGain.connect(this.analyser);
    this.analyser.connect(this.ctx.destination);

    this.buildDspChain();
    this.isRunning = true;
  }

  private buildDspChain() {
    if (!this.ctx || !this.masterGain) return;

    // 1. MidwestAmp
    this.ampHighPass = this.ctx.createBiquadFilter();
    this.ampHighPass.type = 'highpass';
    this.ampHighPass.frequency.value = 75;

    this.ampPreGain = this.ctx.createGain();
    this.ampPreGain.gain.value = 2.5;

    this.ampBright = this.ctx.createBiquadFilter();
    this.ampBright.type = 'highshelf';
    this.ampBright.frequency.value = 3500;
    this.ampBright.gain.value = 4.0;

    this.ampShaper = this.ctx.createWaveShaper();
    this.ampShaper.curve = this.makeDistortionCurve(35) as any;
    this.ampShaper.oversample = '4x';

    this.ampBass = this.ctx.createBiquadFilter();
    this.ampBass.type = 'lowshelf';
    this.ampBass.frequency.value = 120;
    this.ampBass.gain.value = 0;

    this.ampMid = this.ctx.createBiquadFilter();
    this.ampMid.type = 'peaking';
    this.ampMid.frequency.value = 750;
    this.ampMid.Q.value = 1.0;
    this.ampMid.gain.value = 2;

    this.ampTreble = this.ctx.createBiquadFilter();
    this.ampTreble.type = 'highshelf';
    this.ampTreble.frequency.value = 3200;
    this.ampTreble.gain.value = 3;

    this.ampPresence = this.ctx.createBiquadFilter();
    this.ampPresence.type = 'peaking';
    this.ampPresence.frequency.value = 4500;
    this.ampPresence.gain.value = 2;

    this.ampCabFilter = this.ctx.createBiquadFilter();
    this.ampCabFilter.type = 'lowpass';
    this.ampCabFilter.frequency.value = 4800; // 2x12 Open Back roll-off

    // Chain amp
    this.ampHighPass
      .connect(this.ampPreGain)
      .connect(this.ampBright)
      .connect(this.ampShaper)
      .connect(this.ampBass)
      .connect(this.ampMid)
      .connect(this.ampTreble)
      .connect(this.ampPresence)
      .connect(this.ampCabFilter)
      .connect(this.masterGain);

    // 2. ScreamoPunch
    this.punchTransient = this.ctx.createBiquadFilter();
    this.punchTransient.type = 'peaking';
    this.punchTransient.frequency.value = 3200;
    this.punchTransient.gain.value = 6.0;

    this.punchCompressor = this.ctx.createDynamicsCompressor();
    this.punchCompressor.threshold.value = -24;
    this.punchCompressor.knee.value = 6;
    this.punchCompressor.ratio.value = 12;
    this.punchCompressor.attack.value = 0.003;
    this.punchCompressor.release.value = 0.080;

    this.punchDryGain = this.ctx.createGain();
    this.punchWetGain = this.ctx.createGain();
    this.punchOutGain = this.ctx.createGain();

    this.punchTransient.connect(this.punchCompressor);
    this.punchCompressor.connect(this.punchWetGain);
    this.punchWetGain.connect(this.punchOutGain);
    this.punchDryGain.connect(this.punchOutGain);
    this.punchOutGain.connect(this.masterGain);

    // 3. DrownSpace
    this.reverbDelay = this.ctx.createDelay(2.0);
    this.reverbDelay.delayTime.value = 0.380;

    this.reverbFeedback = this.ctx.createGain();
    this.reverbFeedback.gain.value = 0.75;

    this.reverbDamping = this.ctx.createBiquadFilter();
    this.reverbDamping.type = 'lowpass';
    this.reverbDamping.frequency.value = 2800;

    this.reverbDuckingGain = this.ctx.createGain();
    this.reverbDuckingGain.gain.value = 0.9;

    this.reverbDryGain = this.ctx.createGain();
    this.reverbWetGain = this.ctx.createGain();
    this.reverbDryGain.gain.value = 0.65;
    this.reverbWetGain.gain.value = 0.35;

    // Flutter LFO
    this.reverbFlutterOsc = this.ctx.createOscillator();
    this.reverbFlutterOsc.frequency.value = 0.8;
    this.reverbFlutterGain = this.ctx.createGain();
    this.reverbFlutterGain.gain.value = 0.004;
    this.reverbFlutterOsc.connect(this.reverbFlutterGain);
    this.reverbFlutterGain.connect(this.reverbDelay.delayTime);
    try {
      this.reverbFlutterOsc.start();
    } catch {}

    // Delay loop
    this.reverbDelay
      .connect(this.reverbDamping)
      .connect(this.reverbFeedback)
      .connect(this.reverbDelay);

    this.reverbDamping
      .connect(this.reverbDuckingGain)
      .connect(this.reverbWetGain)
      .connect(this.masterGain);

    this.reverbDryGain.connect(this.masterGain);

    // 4. CryTune
    this.cryAirPresence = this.ctx.createBiquadFilter();
    this.cryAirPresence.type = 'highshelf';
    this.cryAirPresence.frequency.value = 10500;
    this.cryAirPresence.gain.value = 5.0;

    this.cryPitchShifter = this.ctx.createBiquadFilter();
    this.cryPitchShifter.type = 'peaking';
    this.cryPitchShifter.frequency.value = 330; // E4
    this.cryPitchShifter.Q.value = 8.0;
    this.cryPitchShifter.gain.value = 4.0;

    this.cryAirPresence.connect(this.cryPitchShifter);
    this.cryPitchShifter.connect(this.masterGain);

    // 5. RawMaster
    this.masterLimiter = this.ctx.createDynamicsCompressor();
    this.masterLimiter.threshold.value = -3.0;
    this.masterLimiter.knee.value = 0;
    this.masterLimiter.ratio.value = 20;
    this.masterLimiter.attack.value = 0.001;
    this.masterLimiter.release.value = 0.050;

    this.masterCeilingGain = this.ctx.createGain();
    this.masterCeilingGain.gain.value = 0.965; // -0.3 dB True Peak

    this.masterLimiter.connect(this.masterCeilingGain);
    this.masterCeilingGain.connect(this.masterGain);
  }

  // Generate guitar tube clipping transfer curve
  private makeDistortionCurve(amount: number): Float32Array {
    const k = Math.max(1, amount);
    const nSamples = 44100;
    const curve = new Float32Array(nSamples);
    const deg = Math.PI / 180;

    for (let i = 0; i < nSamples; ++i) {
      const x = (i * 2) / nSamples - 1;
      // Asymmetric triode soft clipping
      if (x < 0) {
        curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
      } else {
        curve[i] = ((3 + k * 1.2) * x * 20 * deg) / (Math.PI + k * 1.2 * Math.abs(x));
      }
    }
    return curve as unknown as Float32Array;
  }

  // Connect active input to the active plugin
  private routeInputToPlugin(sourceNode: AudioNode) {
    if (!this.ampHighPass || !this.punchTransient || !this.punchDryGain || !this.reverbDelay || !this.reverbDryGain || !this.cryAirPresence || !this.masterLimiter) return;

    try {
      sourceNode.disconnect();
    } catch {}

    if (this.currentPlugin === 'midwest-amp') {
      sourceNode.connect(this.ampHighPass);
    } else if (this.currentPlugin === 'screamo-punch') {
      sourceNode.connect(this.punchTransient);
      sourceNode.connect(this.punchDryGain);
    } else if (this.currentPlugin === 'drown-space') {
      sourceNode.connect(this.reverbDelay);
      sourceNode.connect(this.reverbDryGain);
    } else if (this.currentPlugin === 'cry-tune') {
      sourceNode.connect(this.cryAirPresence);
    } else if (this.currentPlugin === 'raw-master') {
      sourceNode.connect(this.masterLimiter);
    }
  }

  public setPlugin(plugin: PluginType) {
    this.currentPlugin = plugin;
  }

  // --- Real-time Parameter Updates ---

  public updateMidwestAmp(params: {
    channel: 'clean' | 'crunch' | 'lead';
    drive: number;
    bass: number;
    mid: number;
    treble: number;
    presence: number;
    bright: boolean;
    cab: '2x12' | 'greenback' | 'v30';
  }) {
    if (!this.ctx || !this.ampShaper || !this.ampBass || !this.ampMid || !this.ampTreble || !this.ampPresence || !this.ampBright || !this.ampCabFilter || !this.ampPreGain) return;

    let driveMultiplier = 20;
    if (params.channel === 'clean') driveMultiplier = 8;
    if (params.channel === 'crunch') driveMultiplier = 40;
    if (params.channel === 'lead') driveMultiplier = 110;

    const distortionFactor = (params.drive / 100) * driveMultiplier;
    this.ampShaper.curve = this.makeDistortionCurve(distortionFactor) as any;

    this.ampPreGain.gain.value = params.channel === 'lead' ? 4.5 : params.channel === 'crunch' ? 2.5 : 1.4;
    this.ampBright.gain.value = params.bright ? 4.0 : 0.0;

    this.ampBass.gain.value = (params.bass - 50) * 0.28;
    this.ampMid.gain.value = (params.mid - 50) * 0.30;
    this.ampTreble.gain.value = (params.treble - 50) * 0.32;
    this.ampPresence.gain.value = (params.presence - 50) * 0.25;

    // Cabinet cutoff
    if (params.cab === '2x12') this.ampCabFilter.frequency.value = 5200;
    else if (params.cab === 'greenback') this.ampCabFilter.frequency.value = 4200;
    else if (params.cab === 'v30') this.ampCabFilter.frequency.value = 4800;
  }

  public updateScreamoPunch(params: { punch: number; smash: number; mix: number }) {
    if (!this.punchTransient || !this.punchCompressor || !this.punchDryGain || !this.punchWetGain) return;
    this.punchTransient.gain.value = (params.punch / 100) * 12.0;
    this.punchCompressor.threshold.value = -12 - (params.smash / 100) * 28;
    this.punchCompressor.ratio.value = 4 + (params.smash / 100) * 16;
    const mix = params.mix / 100;
    this.punchWetGain.gain.value = mix;
    this.punchDryGain.gain.value = 1.0 - mix;
  }

  public updateDrownSpace(params: { decay: number; ducking: number; flutter: number; mix: number }) {
    if (!this.reverbFeedback || !this.reverbDuckingGain || !this.reverbFlutterGain || !this.reverbDryGain || !this.reverbWetGain) return;
    this.reverbFeedback.gain.value = 0.60 + (params.decay / 100) * 0.33;
    this.reverbDuckingGain.gain.value = 1.0 - (params.ducking / 100) * 0.45;
    this.reverbFlutterGain.gain.value = (params.flutter / 100) * 0.008;
    const mix = params.mix / 100;
    this.reverbWetGain.gain.value = mix;
    this.reverbDryGain.gain.value = 1.0 - mix;
  }

  public updateCryTune(params: { airPresence: number; retuneSpeed: number; scale: string }) {
    if (!this.cryAirPresence || !this.cryPitchShifter) return;
    this.cryAirPresence.gain.value = params.airPresence;
    // Map scale fundamental
    let f0 = 329.63; // E4
    if (params.scale.includes('d')) f0 = 293.66; // D4
    this.cryPitchShifter.frequency.value = f0;
  }

  public updateRawMaster(params: { preset: 'streaming' | 'cd' | 'wall' }) {
    if (!this.masterLimiter || !this.masterCeilingGain) return;
    if (params.preset === 'streaming') {
      this.masterLimiter.threshold.value = -3.0;
    } else if (params.preset === 'cd') {
      this.masterLimiter.threshold.value = -7.5;
    } else {
      this.masterLimiter.threshold.value = -12.0;
    }
  }

  // --- Audio Generators & Demo Player ---

  public toggleDemoRiff(): boolean {
    this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    if (this.isDemoPlaying) {
      this.stopDemoRiff();
      return false;
    }

    this.startMidwestRiffLoop();
    this.isDemoPlaying = true;
    return true;
  }

  private startMidwestRiffLoop() {
    if (!this.ctx) return;

    // Frequências das notas de arpeggio estilo American Football / Midwest Emo (DAEAC#E)
    const notes = [
      220.0, 277.18, 329.63, 440.0, 554.37, 659.25, 440.0, 329.63,
      146.83, 220.0, 277.18, 329.63, 440.0, 329.63, 277.18, 220.0
    ];

    let step = 0;
    const playNote = () => {
      if (!this.ctx || !this.isDemoPlaying) return;

      const freq = notes[step % notes.length];
      step++;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      // Timbre de captador single-coil (onda mista triangle + square)
      osc.type = step % 4 === 0 ? 'sawtooth' : 'triangle';
      osc.frequency.value = freq;

      const now = this.ctx.currentTime;
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.38, now + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);

      osc.connect(gain);
      this.routeInputToPlugin(gain);

      osc.start(now);
      osc.stop(now + 0.5);

      this.oscillatorRiffTimer = window.setTimeout(playNote, 185);
    };

    playNote();
  }

  public stopDemoRiff() {
    if (this.oscillatorRiffTimer) {
      clearTimeout(this.oscillatorRiffTimer);
      this.oscillatorRiffTimer = null;
    }
    this.isDemoPlaying = false;
  }

  public async toggleMicrophone(): Promise<boolean> {
    this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }

    if (this.isMicActive) {
      if (this.micStream) {
        this.micStream.getTracks().forEach((t) => t.stop());
        this.micStream = null;
      }
      this.isMicActive = false;
      return false;
    }

    try {
      this.micStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          autoGainControl: false,
          noiseSuppression: false,
        },
      });

      if (!this.ctx) return false;
      this.micSource = this.ctx.createMediaStreamSource(this.micStream);
      this.routeInputToPlugin(this.micSource);
      this.isMicActive = true;
      return true;
    } catch (err) {
      console.error('Falha ao abrir entrada de áudio:', err);
      alert('Não foi possível acessar a entrada de áudio/microfone. Verifique as permissões do navegador.');
      return false;
    }
  }

  public getVisualizerData(dataArray: Uint8Array): void {
    if (!this.analyser) return;
    (this.analyser as any).getByteFrequencyData(dataArray);
  }

  public getIsPlaying(): boolean {
    return this.isDemoPlaying;
  }

  public getIsMicActive(): boolean {
    return this.isMicActive;
  }
}

export const webAudioDsp = typeof window !== 'undefined' ? new WebAudioDspEngine() : (null as unknown as WebAudioDspEngine);
