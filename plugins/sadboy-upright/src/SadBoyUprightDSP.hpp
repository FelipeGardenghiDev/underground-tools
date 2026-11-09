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
 * 🎹 SadBoy Upright DSP Engine
 * Sintetizador de Piano Acústico Vertical de Feltro (Felt Piano)
 * Timbres melancólicos e intimistas com atenuação de feltro e ruído mecânico.
 */
class SadBoyUprightEngine {
public:
    struct PianoVoice {
        bool active = false;
        int note = 0;
        float velocity = 0.0f;
        float freq = 440.0f;
        std::vector<float> delayBuffer;
        size_t delayLength = 0;
        size_t readIndex = 0;
        float filterState = 0.0f;
        float feedback = 0.988f;
        float feltDamping = 0.40f;
        float releaseRate = 0.999f;
        bool isReleased = false;
    };

    SadBoyUprightEngine() {
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
        lfoPhase = 0.0f;
        sustainPedal = false;
        rngState = 987654321;
    }

    void setSustainPedal(bool pressed) {
        sustainPedal = pressed;
        if (!pressed) {
            for (auto& v : voices) {
                if (v.active && v.isReleased) {
                    v.active = false;
                }
            }
        }
    }

    void noteOn(int midiNote, float velocity) {
        if (velocity <= 0.0f) {
            noteOff(midiNote);
            return;
        }

        // Frequência da nota MIDI
        float freq = 440.0f * std::pow(2.0f, (midiNote - 69.0f) / 12.0f);
        size_t len = static_cast<size_t>(sampleRate / freq);
        if (len < 4) len = 4;

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
        v.isReleased = false;
        v.note = midiNote;
        v.velocity = std::clamp(velocity, 0.01f, 1.0f);
        v.freq = freq;
        v.delayLength = len;
        v.readIndex = 0;
        v.filterState = 0.0f;
        v.delayBuffer.assign(len, 0.0f);

        // Amortecimento natural do feltro: quanto mais agudo, mais rápido decai
        v.feedback = std::clamp(0.992f - (freq / 45000.0f), 0.94f, 0.992f);
        v.feltDamping = 0.45f; // Suaviza o impacto do martelo

        // Excitação inicial das cordas com ruído branco filtrado (martelo batendo no feltro)
        float prevNoise = 0.0f;
        for (size_t s = 0; s < len; ++s) {
            float noise = nextRandom() * v.velocity;
            // Filtro passa-baixas para simular o feltro no martelo
            prevNoise += v.feltDamping * (noise - prevNoise);
            v.delayBuffer[s] = prevNoise;
        }
    }

    void noteOff(int midiNote) {
        for (auto& v : voices) {
            if (v.active && v.note == midiNote) {
                v.isReleased = true;
                if (!sustainPedal) {
                    // Abafa a nota suavemente
                    v.feedback *= 0.92f;
                }
            }
        }
    }

    void process(float* outL, float* outR, int numSamples) {
        std::fill(outL, outL + numSamples, 0.0f);
        std::fill(outR, outR + numSamples, 0.0f);

        // Modulação lenta de fita K7 (Tape Wow & Flutter: ~0.4 Hz)
        const float lfoInc = (2.0f * static_cast<float>(M_PI) * 0.4f) / sampleRate;

        for (int s = 0; s < numSamples; ++s) {
            lfoPhase += lfoInc;
            if (lfoPhase >= 2.0f * static_cast<float>(M_PI)) lfoPhase -= 2.0f * static_cast<float>(M_PI);
            float flutter = std::sin(lfoPhase) * 0.0008f;

            float sampleL = 0.0f;
            float sampleR = 0.0f;

            for (auto& v : voices) {
                if (!v.active || v.delayBuffer.empty()) continue;

                // Algoritmo Karplus-Strong com feltro acústico
                float currentSample = v.delayBuffer[v.readIndex];
                
                // Filtro IIR de perda harmônica (feltro)
                v.filterState = (currentSample + v.filterState) * 0.5f;
                float nextSample = v.filterState * v.feedback;

                v.delayBuffer[v.readIndex] = nextSample;
                v.readIndex = (v.readIndex + 1) % v.delayLength;

                // Pan estereofônico natural conforme a posição no teclado de 88 teclas
                float notePan = std::clamp((v.note - 21.0f) / (108.0f - 21.0f), 0.15f, 0.85f);
                float panL = std::cos(notePan * static_cast<float>(M_PI) * 0.5f);
                float panR = std::sin(notePan * static_cast<float>(M_PI) * 0.5f);

                sampleL += currentSample * panL * (1.0f + flutter);
                sampleR += currentSample * panR * (1.0f - flutter);

                if (v.isReleased && !sustainPedal) {
                    v.feedback *= 0.9992f;
                    if (std::abs(currentSample) < 0.0001f) {
                        v.active = false;
                    }
                }
            }

            // Saturação aveludada do circuito pré-amplificado
            outL[s] = std::tanh(sampleL * 0.7f);
            outR[s] = std::tanh(sampleR * 0.7f);
        }
    }

private:
    float nextRandom() {
        rngState = rngState * 1664525u + 1013904223u;
        return (static_cast<float>(rngState & 0x7FFFFFFF) / 1073741824.0f) - 1.0f;
    }

    float sampleRate = 44100.0f;
    uint32_t rngState = 987654321;
    bool sustainPedal = false;
    float lfoPhase = 0.0f;
    std::array<PianoVoice, 16> voices;
};

} // namespace EmoAudioTools
