#pragma once

#include <cmath>
#include <algorithm>
#include <vector>
#include <string>

#ifndef M_PI
#define M_PI 3.14159265358979323846
#endif

namespace EmoAudioTools {

/**
 * 💥 ScreamoPunch DSP Engine
 * Compressor agressivo estilo FET / 1176 para caixa de bateria (snare crack)
 * e vocais berrados / dinâmicos com compressão paralela integrada.
 *
 * C++17 Header-Only, sem dependências externas.
 */
class ScreamoPunchEngine {
public:
    ScreamoPunchEngine() {
        setSampleRate(44100.0f);
        reset();
    }

    void setSampleRate(float sr) {
        sampleRate = (sr > 8000.0f) ? sr : 44100.0f;
        updateCoefficients();
    }

    void reset() {
        envelopeL = 0.0f;
        envelopeR = 0.0f;
        transientStateL = 0.0f;
        transientStateR = 0.0f;
        gainReductionDb = 0.0f;
    }

    /**
     * @param punch 0.0 a 1.0 (Acentuação de transiente inicial / snap de caixa)
     */
    void setPunch(float p) {
        punchAmount = std::clamp(p, 0.0f, 1.0f);
        updateCoefficients();
    }

    /**
     * @param smash 0.0 a 1.0 (Quantidade de compressão / threshold e ratio)
     */
    void setSmash(float s) {
        smashAmount = std::clamp(s, 0.0f, 1.0f);
    }

    /**
     * @param mix 0.0 (100% Dry) a 1.0 (100% Wet para compressão paralela)
     */
    void setMix(float m) {
        mixAmount = std::clamp(m, 0.0f, 1.0f);
    }

    /**
     * @param gainDb -12.0 a +18.0 dB (Ganho de compensação pós-compressão)
     */
    void setOutputGainDb(float gainDb) {
        outputGain = std::pow(10.0f, gainDb / 20.0f);
    }

    /**
     * Retorna a redução de ganho atual em dB (útil para medidores visuais / VU)
     */
    float getGainReductionDb() const {
        return gainReductionDb;
    }

    /**
     * Processamento de bloco estéreo
     */
    void process(const float* const* inputs, float* const* outputs, int numChannels, int numSamples) {
        const float* inL = inputs[0];
        const float* inR = (numChannels > 1) ? inputs[1] : inputs[0];
        float* outL = outputs[0];
        float* outR = (numChannels > 1) ? outputs[1] : outputs[0];

        // Mapeamento dos parâmetros no estilo FET:
        // Smash varia o threshold de -6 dB até -36 dB e aumenta a agressividade
        float thresholdDb = -6.0f - (smashAmount * 30.0f);
        float thresholdLinear = std::pow(10.0f, thresholdDb / 20.0f);
        float ratio = 4.0f + (smashAmount * 16.0f); // 4:1 até 20:1 ("All Buttons")
        float slope = 1.0f - (1.0f / ratio);

        float maxGrThisBlock = 0.0f;

        for (int i = 0; i < numSamples; ++i) {
            float dryL = inL[i];
            float dryR = inR[i];

            // 1. Transient Shaper inicial (Punch)
            // Filtro derivativo suave para detectar a frente do transiente
            float transL = dryL - transientStateL;
            float transR = dryR - transientStateR;
            transientStateL += transL * 0.35f;
            transientStateR += transR * 0.35f;

            float punchedL = dryL + (transL * punchAmount * 1.5f);
            float punchedR = dryR + (transR * punchAmount * 1.5f);

            // 2. Detector de Envelope (Peak com ataque ultra rápido e release musical)
            float levelL = std::abs(punchedL);
            float levelR = std::abs(punchedR);
            float detector = std::max(levelL, levelR);

            float coeff = (detector > envelopeL) ? attackCoeff : releaseCoeff;
            envelopeL += coeff * (detector - envelopeL);
            envelopeR = envelopeL; // Link estéreo firme para manter a imagem central da caixa

            // 3. Cálculo de Redução de Ganho
            float gainLinear = 1.0f;
            if (envelopeL > thresholdLinear && thresholdLinear > 0.00001f) {
                float envDb = 20.0f * std::log10(envelopeL);
                float overDb = envDb - thresholdDb;
                float grDb = overDb * slope;
                gainLinear = std::pow(10.0f, -grDb / 20.0f);
                maxGrThisBlock = std::max(maxGrThisBlock, grDb);
            }

            // 4. Aplica compressão no sinal processado
            float wetL = punchedL * gainLinear;
            float wetR = punchedR * gainLinear;

            // Saturação sutil de transformador vintage quando comprimido
            wetL = std::tanh(wetL * 1.15f) / 1.15f;
            wetR = std::tanh(wetR * 1.15f) / 1.15f;

            // Make-up gain
            wetL *= outputGain;
            wetR *= outputGain;

            // 5. Mistura Paralela Dry / Wet
            outL[i] = dryL * (1.0f - mixAmount) + wetL * mixAmount;
            outR[i] = dryR * (1.0f - mixAmount) + wetR * mixAmount;
        }

        // Filtro passa-baixas no medidor de GR para animação suave
        gainReductionDb = (gainReductionDb * 0.85f) + (maxGrThisBlock * 0.15f);
    }

private:
    float sampleRate = 44100.0f;
    float punchAmount = 0.5f;
    float smashAmount = 0.5f;
    float mixAmount = 1.0f;
    float outputGain = 1.0f;

    float envelopeL = 0.0f;
    float envelopeR = 0.0f;
    float transientStateL = 0.0f;
    float transientStateR = 0.0f;
    float gainReductionDb = 0.0f;

    float attackCoeff = 0.0f;
    float releaseCoeff = 0.0f;

    void updateCoefficients() {
        // Ataque rápido: 0.1ms a 1.2ms dependendo do Punch
        float attackTimeSec = (0.0001f + (1.0f - punchAmount) * 0.001f);
        // Release clássico 1176: cerca de 60ms a 120ms
        float releaseTimeSec = 0.080f;

        attackCoeff = 1.0f - std::exp(-1.0f / (attackTimeSec * sampleRate));
        releaseCoeff = 1.0f - std::exp(-1.0f / (releaseTimeSec * sampleRate));
    }
};

} // namespace EmoAudioTools
