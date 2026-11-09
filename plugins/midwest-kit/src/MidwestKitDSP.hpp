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
 * 🥁 MidwestKit DSP Engine
 * Sintetizador e Sampler de Bateria Acústica Crua de Garagem
 * Específico para Midwest Emo, Screamo e Pop-Punk dos anos 90/2000.
 *
 * Mapeamento MIDI Padrão General MIDI:
 * - 36: Bumbo Orgânico (Felt Beater Kick)
 * - 38: Caixa Estalada (Acrolite Snare Crack)
 * - 42: Chimbal Fechado Abafado (Gaffer Damped Closed Hat)
 * - 46: Chimbal Aberto (Open Hat)
 * - 49: Prato de Ataque (Explosive Crash)
 */
class MidwestKitEngine {
public:
    struct Voice {
        bool active = false;
        int note = 0;
        float velocity = 0.0f;
        float phase = 0.0f;
        float phaseInc = 0.0f;
        float pitchDecay = 0.0f;
        float ampEnvelope = 0.0f;
        float ampDecayRate = 0.0f;
        float panL = 0.707f;
        float panR = 0.707f;
        float noiseState = 0.0f;
        float filterState = 0.0f;
    };

    MidwestKitEngine() {
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
        }
        rngState = 123456789;
    }

    void noteOn(int midiNote, float velocity) {
        if (velocity <= 0.0f) return;

        // Procura voz livre ou a mais antiga
        int voiceIdx = -1;
        for (size_t i = 0; i < voices.size(); ++i) {
            if (!voices[i].active) {
                voiceIdx = static_cast<int>(i);
                break;
            }
        }
        if (voiceIdx == -1) voiceIdx = 0; // voice stealing simples

        auto& v = voices[voiceIdx];
        v.active = true;
        v.note = midiNote;
        v.velocity = std::clamp(velocity, 0.01f, 1.0f);
        v.phase = 0.0f;
        v.ampEnvelope = 1.0f;
        v.noiseState = 0.0f;
        v.filterState = 0.0f;

        switch (midiNote) {
            case 36: // Bumbo (Kick)
                v.phaseInc = (62.0f * 2.0f * static_cast<float>(M_PI)) / sampleRate;
                v.pitchDecay = 160.0f;
                v.ampDecayRate = std::exp(-1.0f / (0.35f * sampleRate));
                v.panL = 0.707f; v.panR = 0.707f; // Centro
                break;

            case 38: // Caixa (Snare)
                v.phaseInc = (185.0f * 2.0f * static_cast<float>(M_PI)) / sampleRate;
                v.pitchDecay = 110.0f;
                v.ampDecayRate = std::exp(-1.0f / (0.24f * sampleRate));
                v.panL = 0.75f; v.panR = 0.65f; // Levemente à esquerda
                break;

            case 42: // Chimbal Fechado (Closed Hat)
                v.phaseInc = 0.0f;
                v.pitchDecay = 0.0f;
                v.ampDecayRate = std::exp(-1.0f / (0.045f * sampleRate));
                v.panL = 0.85f; v.panR = 0.50f;
                break;

            case 46: // Chimbal Aberto (Open Hat)
                // Se o chimbal aberto tocar, abafa o anterior
                v.phaseInc = 0.0f;
                v.pitchDecay = 0.0f;
                v.ampDecayRate = std::exp(-1.0f / (0.45f * sampleRate));
                v.panL = 0.85f; v.panR = 0.50f;
                break;

            case 49: // Crash
                v.phaseInc = 0.0f;
                v.pitchDecay = 0.0f;
                v.ampDecayRate = std::exp(-1.0f / (1.80f * sampleRate));
                v.panL = 0.50f; v.panR = 0.85f;
                break;

            default:
                v.active = false;
                break;
        }
    }

    void noteOff(int midiNote) {
        // Chimbal fechado corta o chimbal aberto (choke group padrão de bateria)
        if (midiNote == 42) {
            for (auto& v : voices) {
                if (v.active && v.note == 46) {
                    v.ampDecayRate = std::exp(-1.0f / (0.015f * sampleRate)); // mute rápido
                }
            }
        }
    }

    void process(float* outL, float* outR, int numSamples) {
        std::fill(outL, outL + numSamples, 0.0f);
        std::fill(outR, outR + numSamples, 0.0f);

        for (int s = 0; s < numSamples; ++s) {
            float sampleL = 0.0f;
            float sampleR = 0.0f;

            for (auto& v : voices) {
                if (!v.active) continue;

                float sample = 0.0f;

                if (v.note == 36) {
                    // Sintetiza o Bumbo: Tom senoidal com drop de pitch + clique orgânico
                    float freq = 55.0f + v.pitchDecay * v.ampEnvelope;
                    v.phaseInc = (freq * 2.0f * static_cast<float>(M_PI)) / sampleRate;
                    v.phase += v.phaseInc;
                    if (v.phase >= 2.0f * static_cast<float>(M_PI)) v.phase -= 2.0f * static_cast<float>(M_PI);

                    sample = std::sin(v.phase) * 1.2f;
                    // Saturação sutil de fita
                    sample = std::tanh(sample * 1.5f);
                } else if (v.note == 38) {
                    // Sintetiza a Caixa: Corpo ressonante + esteira ruidosa metálica
                    float freq = 175.0f + v.pitchDecay * v.ampEnvelope;
                    v.phaseInc = (freq * 2.0f * static_cast<float>(M_PI)) / sampleRate;
                    v.phase += v.phaseInc;
                    if (v.phase >= 2.0f * static_cast<float>(M_PI)) v.phase -= 2.0f * static_cast<float>(M_PI);

                    float body = std::sin(v.phase);
                    float whiteNoise = nextRandom();
                    // Filtro passa-altas para a esteira
                    v.filterState += 0.35f * (whiteNoise - v.filterState);
                    float snareWire = whiteNoise - v.filterState;

                    sample = (body * 0.45f + snareWire * 0.65f);
                    sample = std::tanh(sample * 1.4f);
                } else if (v.note == 42 || v.note == 46 || v.note == 49) {
                    // Pratos e Chimbais: Ruído metálico denso filtrado
                    float noise = nextRandom();
                    v.filterState += 0.65f * (noise - v.filterState);
                    sample = noise - v.filterState;
                }

                sample *= v.ampEnvelope * v.velocity;
                sampleL += sample * v.panL;
                sampleR += sample * v.panR;

                v.ampEnvelope *= v.ampDecayRate;
                if (v.ampEnvelope < 0.0005f) {
                    v.active = false;
                }
            }

            outL[s] = sampleL;
            outR[s] = sampleR;
        }
    }

private:
    float nextRandom() {
        rngState = rngState * 1664525u + 1013904223u;
        return (static_cast<float>(rngState & 0x7FFFFFFF) / 1073741824.0f) - 1.0f;
    }

    float sampleRate = 44100.0f;
    uint32_t rngState = 123456789;
    std::array<Voice, 12> voices;
};

} // namespace EmoAudioTools
