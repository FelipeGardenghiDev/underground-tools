#pragma once

#include <cmath>
#include <algorithm>
#include <vector>
#include <array>
#include <cstdint>

#ifndef M_PI
#define M_PI 3.14159265358979323846
#endif

namespace EmoAudioTools {

/**
 * 🌌 Gargantua Colossus DSP Engine
 * Sintetizador Atmosférico de Paredão & Drone Synth Cinematográfico
 * Inspirado no lendário preset "Gargantua" do Spectrasonics Atmosphere / Omnisphere.
 *
 * Características:
 * - 7 Osciladores Supersaw analógicos desafinados entre si
 * - Sub-oscilador sísmico de peso gravitacional puro
 * - Filtro Low-Pass ressonante de 4 polos (24 dB/oct) com varredura LFO lenta
 * - Chorus e Difusão Espacial Estéreo
 */
class GargantuaColossusEngine {
public:
    struct SynthVoice {
        bool active = false;
        int note = 0;
        float baseFreq = 110.0f;
        float velocity = 0.0f;
        std::array<float, 7> sawPhases = {0.0f};
        float subPhase = 0.0f;
        float envelope = 0.0f;
        float targetEnvelope = 0.0f;
        float filterCutoffState1 = 0.0f;
        float filterCutoffState2 = 0.0f;
        float filterCutoffState3 = 0.0f;
        float filterCutoffState4 = 0.0f;
    };

    GargantuaColossusEngine() {
        setSampleRate(44100.0f);
        reset();
    }

    void setSampleRate(float sr) {
        sampleRate = (sr > 8000.0f) ? sr : 44100.0f;
        reset();
    }

    void reset() {
        for (auto& v : voices) {
            v.active = false;
            v.envelope = 0.0f;
        }
        lfoPhase = 0.0f;
        reverbBufferL.assign(4096, 0.0f);
        reverbBufferR.assign(4096, 0.0f);
        reverbIndex = 0;
    }

    void noteOn(int midiNote, float velocity) {
        if (velocity <= 0.0f) {
            noteOff(midiNote);
            return;
        }

        int voiceIdx = -1;
        for (size_t i = 0; i < voices.size(); ++i) {
            if (!voices[i].active) {
                voiceIdx = static_cast<int>(i);
                break;
            }
        }
        if (voiceIdx == -1) voiceIdx = 0;

        auto& v = voices[voiceIdx];
        v.active = true;
        v.note = midiNote;
        v.velocity = std::clamp(velocity, 0.05f, 1.0f);
        v.baseFreq = 440.0f * std::pow(2.0f, (midiNote - 69.0f) / 12.0f);
        v.targetEnvelope = 1.0f;

        // Distribuição de fase inicial aleatória para evitar cancelamento de fase
        for (size_t i = 0; i < 7; ++i) {
            v.sawPhases[i] = static_cast<float>(i) / 7.0f;
        }
        v.subPhase = 0.0f;
    }

    void noteOff(int midiNote) {
        for (auto& v : voices) {
            if (v.active && v.note == midiNote) {
                v.targetEnvelope = 0.0f; // Release lento cinematográfico
            }
        }
    }

    void process(float* outL, float* outR, int numSamples) {
        std::fill(outL, outL + numSamples, 0.0f);
        std::fill(outR, outR + numSamples, 0.0f);

        // Desafinações microscópicas típicas do som Supersaw (detune spread)
        const std::array<float, 7> detuneFactors = {
            -0.015f, -0.009f, -0.004f, 0.0f, +0.004f, +0.009f, +0.015f
        };

        const float lfoInc = (2.0f * static_cast<float>(M_PI) * 0.12f) / sampleRate; // 0.12 Hz (varredura ultra lenta de 8 segundos)
        const float attackCoeff = 1.0f - std::exp(-1.0f / (0.8f * sampleRate)); // Attack suave de 800ms
        const float releaseCoeff = 1.0f - std::exp(-1.0f / (1.5f * sampleRate)); // Release longo de 1.5s

        for (int s = 0; s < numSamples; ++s) {
            lfoPhase += lfoInc;
            if (lfoPhase >= 2.0f * static_cast<float>(M_PI)) lfoPhase -= 2.0f * static_cast<float>(M_PI);

            // Modulação do filtro pelo LFO
            float lfoValue = 0.5f * (1.0f + std::sin(lfoPhase));
            float cutoffFreq = 400.0f + (lfoValue * 2800.0f); // 400 Hz a 3200 Hz
            float f = std::clamp(2.0f * cutoffFreq / sampleRate, 0.01f, 0.95f);
            float q = 0.65f; // Ressonância moderada sem apito agudo

            float mixL = 0.0f;
            float mixR = 0.0f;

            for (auto& v : voices) {
                if (!v.active) continue;

                // Envelope suave
                if (v.targetEnvelope > 0.5f) {
                    v.envelope += (v.targetEnvelope - v.envelope) * attackCoeff;
                } else {
                    v.envelope += (v.targetEnvelope - v.envelope) * releaseCoeff;
                    if (v.envelope < 0.001f) {
                        v.active = false;
                        continue;
                    }
                }

                float sawSumL = 0.0f;
                float sawSumR = 0.0f;

                // 7 Supersaws com Pan estéreo alargado
                for (size_t osc = 0; osc < 7; ++osc) {
                    float oscFreq = v.baseFreq * (1.0f + detuneFactors[osc]);
                    float phaseInc = oscFreq / sampleRate;
                    v.sawPhases[osc] += phaseInc;
                    if (v.sawPhases[osc] >= 1.0f) v.sawPhases[osc] -= 1.0f;

                    // Onda Sawtooth bipolar (-1 a +1)
                    float saw = 2.0f * v.sawPhases[osc] - 1.0f;

                    // Distribuição panorâmica
                    float pan = static_cast<float>(osc) / 6.0f; // 0.0 (left) a 1.0 (right)
                    sawSumL += saw * (1.0f - pan);
                    sawSumR += saw * pan;
                }

                // Sub-oscilador sísmico (1 oitava abaixo)
                float subFreq = v.baseFreq * 0.5f;
                v.subPhase += subFreq / sampleRate;
                if (v.subPhase >= 1.0f) v.subPhase -= 1.0f;
                float sub = std::sin(v.subPhase * 2.0f * static_cast<float>(M_PI)) * 0.45f;

                float rawSignalL = (sawSumL * 0.28f + sub * 0.5f) * v.envelope * v.velocity;
                float rawSignalR = (sawSumR * 0.28f + sub * 0.5f) * v.envelope * v.velocity;

                // Filtro 4-polos em cascata para o canal L
                v.filterCutoffState1 += f * (rawSignalL - v.filterCutoffState1 + q * (v.filterCutoffState1 - v.filterCutoffState2));
                v.filterCutoffState2 += f * (v.filterCutoffState1 - v.filterCutoffState2);
                v.filterCutoffState3 += f * (v.filterCutoffState2 - v.filterCutoffState3);
                v.filterCutoffState4 += f * (v.filterCutoffState3 - v.filterCutoffState4);

                mixL += v.filterCutoffState4;
                mixR += v.filterCutoffState4 * 0.9f + rawSignalR * 0.1f;
            }

            // Espaço atmosférico embutido (Dark Diffusion Reverb)
            reverbBufferL[reverbIndex] = mixL;
            reverbBufferR[reverbIndex] = mixR;

            size_t tapL = (reverbIndex + 2341) % reverbBufferL.size();
            size_t tapR = (reverbIndex + 3127) % reverbBufferR.size();
            float spaceL = reverbBufferL[tapL] * 0.35f;
            float spaceR = reverbBufferR[tapR] * 0.35f;

            reverbIndex = (reverbIndex + 1) % reverbBufferL.size();

            outL[s] = std::tanh(mixL + spaceL);
            outR[s] = std::tanh(mixR + spaceR);
        }
    }

private:
    float sampleRate = 44100.0f;
    float lfoPhase = 0.0f;
    size_t reverbIndex = 0;
    std::vector<float> reverbBufferL;
    std::vector<float> reverbBufferR;
    std::array<SynthVoice, 8> voices;
};

} // namespace EmoAudioTools
