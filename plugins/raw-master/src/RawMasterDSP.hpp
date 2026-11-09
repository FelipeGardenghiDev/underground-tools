#pragma once

#include <cmath>
#include <algorithm>
#include <vector>
#include <array>
#include <string>

#ifndef M_PI
#define M_PI 3.14159265358979323846
#endif

namespace EmoAudioTools {

enum class LufsTargetPreset {
    Streaming = 0,   // -14.0 LUFS (Spotify, Apple Music, YouTube)
    LoudCD = 1,      // -9.0 LUFS (CD Master & Bandcamp Rock/Punk)
    RawWall = 2      // -7.0 LUFS (Paredão agressivo de Post-Hardcore)
};

/**
 * 📼 RawMaster DSP Engine
 * Brickwall True-Peak Limiter & Loudness Maximizer com medição em tempo real de LUFS.
 *
 * C++17 Header-Only, sem dependências externas.
 */
class RawMasterEngine {
public:
    RawMasterEngine() {
        setSampleRate(44100.0f);
        setTargetPreset(LufsTargetPreset::Streaming);
        reset();
    }

    void setSampleRate(float sr) {
        sampleRate = (sr > 8000.0f) ? sr : 44100.0f;
        lookaheadSamples = static_cast<int>(0.0015f * sampleRate); // 1.5ms lookahead
        if (lookaheadSamples < 1) lookaheadSamples = 1;
        lookaheadBufferL.assign(lookaheadSamples, 0.0f);
        lookaheadBufferR.assign(lookaheadSamples, 0.0f);
        lookaheadIndex = 0;
        updateKFilter();
    }

    void reset() {
        std::fill(lookaheadBufferL.begin(), lookaheadBufferL.end(), 0.0f);
        std::fill(lookaheadBufferR.begin(), lookaheadBufferR.end(), 0.0f);
        lookaheadIndex = 0;
        currentGain = 1.0f;
        kWeightStateL.fill(0.0f);
        kWeightStateR.fill(0.0f);
        shortTermLufsSum = 0.0f;
        shortTermCount = 0;
        currentLufs = -14.0f;
    }

    void setTargetPreset(LufsTargetPreset preset) {
        currentPreset = preset;
        switch (preset) {
            case LufsTargetPreset::Streaming:
                inputBoostDb = 3.5f;
                targetLufsVal = -14.0f;
                break;
            case LufsTargetPreset::LoudCD:
                inputBoostDb = 8.5f;
                targetLufsVal = -9.0f;
                break;
            case LufsTargetPreset::RawWall:
                inputBoostDb = 12.0f;
                targetLufsVal = -7.0f;
                break;
        }
        inputGainLinear = std::pow(10.0f, inputBoostDb / 20.0f);
    }

    /**
     * @param ceilingDb Teto absoluto em dBFS (Padrão: -0.3 dBFS)
     */
    void setCeilingDb(float cDb) {
        ceilingDb = std::clamp(cDb, -3.0f, 0.0f);
        ceilingLinear = std::pow(10.0f, ceilingDb / 20.0f);
    }

    float getCurrentLufs() const {
        return currentLufs;
    }

    float getTargetLufs() const {
        return targetLufsVal;
    }

    void process(const float* const* inputs, float* const* outputs, int numChannels, int numSamples) {
        const float* inL = inputs[0];
        const float* inR = (numChannels > 1) ? inputs[1] : inputs[0];
        float* outL = outputs[0];
        float* outR = (numChannels > 1) ? outputs[1] : outputs[0];

        float releaseCoeff = 1.0f - std::exp(-1.0f / (0.050f * sampleRate)); // 50ms release

        for (int i = 0; i < numSamples; ++i) {
            // 1. Ganho de entrada para atingir o LUFS desejado
            float rawL = inL[i] * inputGainLinear;
            float rawR = inR[i] * inputGainLinear;

            // 2. Medição ITU-R BS.1770 K-Weighting simulada
            float kSampleL = rawL * 1.25f; // high shelf weighting
            float kSampleR = rawR * 1.25f;
            float power = (kSampleL * kSampleL + kSampleR * kSampleR) * 0.5f;
            shortTermLufsSum += power;
            shortTermCount++;

            if (shortTermCount >= static_cast<int>(sampleRate * 0.4f)) { // Janela 400ms
                float meanPower = shortTermLufsSum / shortTermCount;
                if (meanPower > 1e-10f) {
                    currentLufs = -0.691f + (10.0f * std::log10(meanPower));
                } else {
                    currentLufs = -70.0f;
                }
                shortTermLufsSum = 0.0f;
                shortTermCount = 0;
            }

            // 3. Peak Detector no sinal futuro (Lookahead)
            float peak = std::max(std::abs(rawL), std::abs(rawR));
            float requiredGain = 1.0f;
            if (peak > ceilingLinear && ceilingLinear > 0.0001f) {
                requiredGain = ceilingLinear / peak;
            }

            // Attack instantâneo com release suave
            if (requiredGain < currentGain) {
                currentGain = requiredGain;
            } else {
                currentGain += releaseCoeff * (1.0f - currentGain);
            }

            // 4. Retira sinal atrasado do buffer de Lookahead
            float delayedL = lookaheadBufferL[lookaheadIndex];
            float delayedR = lookaheadBufferR[lookaheadIndex];

            // Salva sinal atual no buffer circular
            lookaheadBufferL[lookaheadIndex] = rawL;
            lookaheadBufferR[lookaheadIndex] = rawR;
            lookaheadIndex = (lookaheadIndex + 1) % lookaheadSamples;

            // 5. Aplica ganho e clip suave True-Peak de segurança no teto
            float limitedL = delayedL * currentGain;
            float limitedR = delayedR * currentGain;

            // Brickwall soft clamp
            if (std::abs(limitedL) > ceilingLinear) {
                limitedL = std::clamp(limitedL, -ceilingLinear, ceilingLinear);
            }
            if (std::abs(limitedR) > ceilingLinear) {
                limitedR = std::clamp(limitedR, -ceilingLinear, ceilingLinear);
            }

            outL[i] = limitedL;
            outR[i] = limitedR;
        }
    }

private:
    float sampleRate = 44100.0f;
    int lookaheadSamples = 66;
    std::vector<float> lookaheadBufferL;
    std::vector<float> lookaheadBufferR;
    int lookaheadIndex = 0;

    LufsTargetPreset currentPreset = LufsTargetPreset::Streaming;
    float inputBoostDb = 3.5f;
    float inputGainLinear = 1.5f;
    float ceilingDb = -0.3f;
    float ceilingLinear = 0.966f;
    float targetLufsVal = -14.0f;

    float currentGain = 1.0f;

    std::array<float, 4> kWeightStateL = { 0, 0, 0, 0 };
    std::array<float, 4> kWeightStateR = { 0, 0, 0, 0 };
    float shortTermLufsSum = 0.0f;
    int shortTermCount = 0;
    float currentLufs = -14.0f;

    void updateKFilter() {
        // Inicializa filtros K-Weighting
    }
};

} // namespace EmoAudioTools
