#pragma once

#include <cmath>
#include <algorithm>
#include <vector>
#include <array>

#ifndef M_PI
#define M_PI 3.14159265358979323846
#endif

namespace EmoAudioTools {

/**
 * 🌊 DrownSpace DSP Engine
 * Reverb melancólico e atmosférico com recurso exclusivo de Auto-Ducking
 * e modulação lo-fi de fita K7 (Tape Wow & Flutter).
 *
 * C++17 Header-Only, sem dependências externas.
 */
class DrownSpaceEngine {
public:
    DrownSpaceEngine() {
        setSampleRate(44100.0f);
        reset();
    }

    void setSampleRate(float sr) {
        sampleRate = (sr > 8000.0f) ? sr : 44100.0f;
        initDelays();
    }

    void reset() {
        for (auto& cb : combBuffersL) std::fill(cb.begin(), cb.end(), 0.0f);
        for (auto& cb : combBuffersR) std::fill(cb.begin(), cb.end(), 0.0f);
        for (auto& ap : allpassBuffersL) std::fill(ap.begin(), ap.end(), 0.0f);
        for (auto& ap : allpassBuffersR) std::fill(ap.begin(), ap.end(), 0.0f);
        combFilterL.fill(0.0f);
        combFilterR.fill(0.0f);
        duckEnvelope = 0.0f;
        lfoPhase = 0.0f;
    }

    /**
     * @param decay 0.0 a 1.0 (Tamanho da cauda do reverb: 0.5s a 15s)
     */
    void setDecay(float d) {
        decayAmount = std::clamp(d, 0.0f, 1.0f);
        feedback = 0.65f + (decayAmount * 0.28f); // 0.65 a 0.93
    }

    /**
     * @param ducking 0.0 a 1.0 (Atenuação do reverb durante sinal seco presente)
     */
    void setDucking(float d) {
        duckingAmount = std::clamp(d, 0.0f, 1.0f);
    }

    /**
     * @param flutter 0.0 a 1.0 (Modulação lenta de fita K7 gasta)
     */
    void setCassetteFlutter(float f) {
        flutterAmount = std::clamp(f, 0.0f, 1.0f);
    }

    /**
     * @param mix 0.0 (Dry) a 1.0 (100% Wet)
     */
    void setMix(float m) {
        mixAmount = std::clamp(m, 0.0f, 1.0f);
    }

    void process(const float* const* inputs, float* const* outputs, int numChannels, int numSamples) {
        const float* inL = inputs[0];
        const float* inR = (numChannels > 1) ? inputs[1] : inputs[0];
        float* outL = outputs[0];
        float* outR = (numChannels > 1) ? outputs[1] : outputs[0];

        // Coeficientes do detector de envelope para o Auto-Ducking
        float duckAttackCoeff = 1.0f - std::exp(-1.0f / (0.010f * sampleRate));  // 10ms
        float duckReleaseCoeff = 1.0f - std::exp(-1.0f / (0.280f * sampleRate)); // 280ms

        for (int i = 0; i < numSamples; ++i) {
            float dryL = inL[i];
            float dryR = inR[i];
            float dryMono = (dryL + dryR) * 0.5f;

            // 1. Detector de Envelope do Auto-Ducking sobre o sinal de entrada
            float dryLevel = std::abs(dryMono);
            float duckCoeff = (dryLevel > duckEnvelope) ? duckAttackCoeff : duckReleaseCoeff;
            duckEnvelope += duckCoeff * (dryLevel - duckEnvelope);

            // Ganho de atenuação do reverb (quando a voz canta forte, reverb recua)
            float duckGain = 1.0f - (duckingAmount * std::clamp(duckEnvelope * 2.5f, 0.0f, 0.85f));

            // 2. Modulação Tape Wow & Flutter via LFO
            lfoPhase += (2.0f * static_cast<float>(M_PI) * 0.85f) / sampleRate;
            if (lfoPhase > 2.0f * static_cast<float>(M_PI)) lfoPhase -= 2.0f * static_cast<float>(M_PI);
            float flutterMod = std::sin(lfoPhase) * flutterAmount * 0.08f;

            // 3. Rede de 4 Filtros Comb Paralelos (L e R)
            float wetL = 0.0f;
            float wetR = 0.0f;

            for (size_t c = 0; c < 4; ++c) {
                // Comb L
                int idxL = combIndicesL[c];
                float outCombL = combBuffersL[c][idxL];
                combFilterL[c] = (outCombL * 0.75f) + (combFilterL[c] * 0.25f); // Damping passa-baixas
                float nextSampleL = dryL + (combFilterL[c] * (feedback + flutterMod));
                combBuffersL[c][idxL] = nextSampleL;
                combIndicesL[c] = (idxL + 1) % combLengthsL[c];
                wetL += outCombL;

                // Comb R
                int idxR = combIndicesR[c];
                float outCombR = combBuffersR[c][idxR];
                combFilterR[c] = (outCombR * 0.75f) + (combFilterR[c] * 0.25f);
                float nextSampleR = dryR + (combFilterR[c] * (feedback - flutterMod));
                combBuffersR[c][idxR] = nextSampleR;
                combIndicesR[c] = (idxR + 1) % combLengthsR[c];
                wetR += outCombR;
            }

            wetL *= 0.25f;
            wetR *= 0.25f;

            // 4. Dois Estágios de Filtro Allpass em Série para Difusão Espacial
            for (size_t a = 0; a < 2; ++a) {
                // Allpass L
                int idxL = allpassIndicesL[a];
                float bufSampleL = allpassBuffersL[a][idxL];
                float allpassOutL = -wetL + bufSampleL;
                allpassBuffersL[a][idxL] = wetL + (bufSampleL * 0.5f);
                allpassIndicesL[a] = (idxL + 1) % allpassLengthsL[a];
                wetL = allpassOutL;

                // Allpass R
                int idxR = allpassIndicesR[a];
                float bufSampleR = allpassBuffersR[a][idxR];
                float allpassOutR = -wetR + bufSampleR;
                allpassBuffersR[a][idxR] = wetR + (bufSampleR * 0.5f);
                allpassIndicesR[a] = (idxR + 1) % allpassLengthsR[a];
                wetR = allpassOutR;
            }

            // 5. Aplica Auto-Ducking dinâmico na cauda do reverb
            wetL *= duckGain;
            wetR *= duckGain;

            // 6. Saída Balanceada Dry / Wet
            outL[i] = dryL * (1.0f - mixAmount) + wetL * mixAmount;
            outR[i] = dryR * (1.0f - mixAmount) + wetR * mixAmount;
        }
    }

private:
    float sampleRate = 44100.0f;
    float decayAmount = 0.6f;
    float feedback = 0.80f;
    float duckingAmount = 0.5f;
    float flutterAmount = 0.3f;
    float mixAmount = 0.35f;
    float duckEnvelope = 0.0f;
    float lfoPhase = 0.0f;

    // Buffer lengths calibrados com números primos para evitar ressonâncias
    std::array<int, 4> combLengthsL = { 1117, 1373, 1559, 1723 };
    std::array<int, 4> combLengthsR = { 1151, 1381, 1579, 1747 };
    std::array<int, 2> allpassLengthsL = { 227, 563 };
    std::array<int, 2> allpassLengthsR = { 239, 577 };

    std::array<std::vector<float>, 4> combBuffersL;
    std::array<std::vector<float>, 4> combBuffersR;
    std::array<int, 4> combIndicesL = { 0, 0, 0, 0 };
    std::array<int, 4> combIndicesR = { 0, 0, 0, 0 };
    std::array<float, 4> combFilterL = { 0.0f, 0.0f, 0.0f, 0.0f };
    std::array<float, 4> combFilterR = { 0.0f, 0.0f, 0.0f, 0.0f };

    std::array<std::vector<float>, 2> allpassBuffersL;
    std::array<std::vector<float>, 2> allpassBuffersR;
    std::array<int, 2> allpassIndicesL = { 0, 0 };
    std::array<int, 2> allpassIndicesR = { 0, 0 };

    void initDelays() {
        float ratio = sampleRate / 44100.0f;
        for (size_t i = 0; i < 4; ++i) {
            int lenL = static_cast<int>(combLengthsL[i] * ratio);
            int lenR = static_cast<int>(combLengthsR[i] * ratio);
            combBuffersL[i].assign(lenL, 0.0f);
            combBuffersR[i].assign(lenR, 0.0f);
            combIndicesL[i] = 0;
            combIndicesR[i] = 0;
        }
        for (size_t i = 0; i < 2; ++i) {
            int lenL = static_cast<int>(allpassLengthsL[i] * ratio);
            int lenR = static_cast<int>(allpassLengthsR[i] * ratio);
            allpassBuffersL[i].assign(lenL, 0.0f);
            allpassBuffersR[i].assign(lenR, 0.0f);
            allpassIndicesL[i] = 0;
            allpassIndicesR[i] = 0;
        }
    }
};

} // namespace EmoAudioTools
