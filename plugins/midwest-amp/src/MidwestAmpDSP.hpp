#pragma once

#include <cmath>
#include <algorithm>
#include <vector>
#include <cstring>

/**
 * 🖤 MidwestAmp DSP Engine
 * Simulador de amplificador valvulado e gabinete IR focado na sonoridade
 * Midwest Emo, Screamo, 90s Emo e Post-Hardcore.
 *
 * Arquitetura C++17 Header-Only, sem dependências externas, compatível
 * com VST3, CLAP, AU e WebAssembly AudioWorklet.
 */

namespace EmoAudioTools {

enum class AmpChannel {
    KinsellaClean = 0,   // Limpo percussivo, brilhante e estalado (American Football style)
    EmoCrunch = 1,       // Borda de rompimento valvulada e dinâmica (Sunny Day Real Estate / Mineral)
    ScreamoWall = 2      // Paredão massivo de distorção de alto ganho (MCR / The Used / Underoath)
};

enum class CabinetType {
    Midwest2x12 = 0,           // Caixa aberta 2x12 com falantes claros e brilhantes
    BritishGreenback4x12 = 1,  // Caixa 4x12 clássica britânica com médios encorpados
    AmericanV30_4x12 = 2,      // Caixa 4x12 de alto ganho com graves firmes e presença cortante
    Bypass = 3                 // Sem simulação de caixa (para usar IRs externas na DAW)
};

/**
 * Filtro Biquad digital Direct Form II Transposed (máxima estabilidade numérica)
 */
class BiquadFilter {
public:
    BiquadFilter() { reset(); }

    void reset() {
        b0 = 1.0f; b1 = 0.0f; b2 = 0.0f;
        a1 = 0.0f; a2 = 0.0f;
        z1 = 0.0f; z2 = 0.0f;
    }

    void setLowPass(float sampleRate, float cutoffHz, float q = 0.707f) {
        float w0 = 2.0f * 3.14159265f * cutoffHz / sampleRate;
        float alpha = std::sin(w0) / (2.0f * q);
        float cosw0 = std::cos(w0);

        float a0 = 1.0f + alpha;
        b0 = ((1.0f - cosw0) * 0.5f) / a0;
        b1 = (1.0f - cosw0) / a0;
        b2 = ((1.0f - cosw0) * 0.5f) / a0;
        a1 = (-2.0f * cosw0) / a0;
        a2 = (1.0f - alpha) / a0;
    }

    void setHighPass(float sampleRate, float cutoffHz, float q = 0.707f) {
        float w0 = 2.0f * 3.14159265f * cutoffHz / sampleRate;
        float alpha = std::sin(w0) / (2.0f * q);
        float cosw0 = std::cos(w0);

        float a0 = 1.0f + alpha;
        b0 = ((1.0f + cosw0) * 0.5f) / a0;
        b1 = -(1.0f + cosw0) / a0;
        b2 = ((1.0f + cosw0) * 0.5f) / a0;
        a1 = (-2.0f * cosw0) / a0;
        a2 = (1.0f - alpha) / a0;
    }

    void setPeaking(float sampleRate, float centerHz, float gainDb, float q = 1.0f) {
        float A = std::pow(10.0f, gainDb / 40.0f);
        float w0 = 2.0f * 3.14159265f * centerHz / sampleRate;
        float alpha = std::sin(w0) / (2.0f * q);
        float cosw0 = std::cos(w0);

        float a0 = 1.0f + alpha / A;
        b0 = (1.0f + alpha * A) / a0;
        b1 = (-2.0f * cosw0) / a0;
        b2 = (1.0f - alpha * A) / a0;
        a1 = (-2.0f * cosw0) / a0;
        a2 = (1.0f - alpha / A) / a0;
    }

    void setLowShelf(float sampleRate, float cutoffHz, float gainDb) {
        float A = std::pow(10.0f, gainDb / 40.0f);
        float w0 = 2.0f * 3.14159265f * cutoffHz / sampleRate;
        float cosw0 = std::cos(w0);
        float sinw0 = std::sin(w0);
        float alpha = sinw0 * 0.5f * std::sqrt((A + 1.0f / A) * (1.0f / 0.707f - 1.0f) + 2.0f);

        float a0 = (A + 1.0f) + (A - 1.0f) * cosw0 + 2.0f * std::sqrt(A) * alpha;
        b0 = (A * ((A + 1.0f) - (A - 1.0f) * cosw0 + 2.0f * std::sqrt(A) * alpha)) / a0;
        b1 = (2.0f * A * ((A - 1.0f) - (A + 1.0f) * cosw0)) / a0;
        b2 = (A * ((A + 1.0f) - (A - 1.0f) * cosw0 - 2.0f * std::sqrt(A) * alpha)) / a0;
        a1 = (-2.0f * ((A - 1.0f) + (A + 1.0f) * cosw0)) / a0;
        a2 = ((A + 1.0f) + (A - 1.0f) * cosw0 - 2.0f * std::sqrt(A) * alpha) / a0;
    }

    void setHighShelf(float sampleRate, float cutoffHz, float gainDb) {
        float A = std::pow(10.0f, gainDb / 40.0f);
        float w0 = 2.0f * 3.14159265f * cutoffHz / sampleRate;
        float cosw0 = std::cos(w0);
        float sinw0 = std::sin(w0);
        float alpha = sinw0 * 0.5f * std::sqrt((A + 1.0f / A) * (1.0f / 0.707f - 1.0f) + 2.0f);

        float a0 = (A + 1.0f) - (A - 1.0f) * cosw0 + 2.0f * std::sqrt(A) * alpha;
        b0 = (A * ((A + 1.0f) + (A - 1.0f) * cosw0 + 2.0f * std::sqrt(A) * alpha)) / a0;
        b1 = (-2.0f * A * ((A - 1.0f) + (A + 1.0f) * cosw0)) / a0;
        b2 = (A * ((A + 1.0f) + (A - 1.0f) * cosw0 - 2.0f * std::sqrt(A) * alpha)) / a0;
        a1 = (2.0f * ((A - 1.0f) - (A + 1.0f) * cosw0)) / a0;
        a2 = ((A + 1.0f) - (A - 1.0f) * cosw0 - 2.0f * std::sqrt(A) * alpha) / a0;
    }

    inline float process(float in) {
        float out = b0 * in + z1;
        z1 = b1 * in - a1 * out + z2;
        z2 = b2 * in - a2 * out;
        return out;
    }

private:
    float b0 = 1.0f, b1 = 0.0f, b2 = 0.0f;
    float a1 = 0.0f, a2 = 0.0f;
    float z1 = 0.0f, z2 = 0.0f;
};

/**
 * Motor Principal do MidwestAmp
 */
class MidwestAmpEngine {
public:
    MidwestAmpEngine() {
        setSampleRate(44100.0f);
    }

    void setSampleRate(float sr) {
        sampleRate = (sr > 1000.0f) ? sr : 44100.0f;
        updateFilters();
    }

    // --- CONTROLES DE PARÂMETROS ---
    void setChannel(AmpChannel ch) { channel = ch; }
    void setCabinet(CabinetType cab) { cabinet = cab; updateCabinetFilters(); }
    void setInputGainDb(float db) { inputGain = std::pow(10.0f, db / 20.0f); }
    void setDrive(float val) { drive = std::clamp(val, 0.0f, 1.0f); }
    void setBass(float val) { bass = std::clamp(val, 0.0f, 1.0f); updateFilters(); }
    void setMiddle(float val) { middle = std::clamp(val, 0.0f, 1.0f); updateFilters(); }
    void setTreble(float val) { treble = std::clamp(val, 0.0f, 1.0f); updateFilters(); }
    void setPresence(float val) { presence = std::clamp(val, 0.0f, 1.0f); updateFilters(); }
    void setMasterVolumeDb(float db) { masterGain = std::pow(10.0f, db / 20.0f); }
    void setBrightSwitch(bool active) { brightActive = active; updateFilters(); }

    /**
     * Processa um buffer estéreo de áudio em tempo real
     */
    void process(const float* const* inputs, float* const* outputs, int numChannels, int numSamples) {
        for (int ch = 0; ch < std::min(numChannels, 2); ++ch) {
            const float* in = inputs[ch];
            float* out = outputs[ch];

            for (int i = 0; i < numSamples; ++i) {
                float sample = in[i] * inputGain;

                // 1. Filtro passa-altas de entrada (elimina sub-graves de ruído de palhetada)
                sample = inputRumbleFilter[ch].process(sample);

                // 2. Chave Bright (adiciona brilho pré-distorção)
                if (brightActive) {
                    sample = brightFilter[ch].process(sample);
                }

                // 3. Estágio Valvulado de Pré-Amplificação (Modelagem Não-Linear de Tríodos 12AX7)
                sample = processTubeStages(sample, ch);

                // 4. Tone Stack Passivo (Bass, Middle, Treble)
                sample = bassFilter[ch].process(sample);
                sample = midFilter[ch].process(sample);
                sample = trebleFilter[ch].process(sample);

                // 5. Presença
                sample = presenceFilter[ch].process(sample);

                // 6. Saturação do Power Amp & Volume Master
                sample = std::tanh(sample * (0.8f + drive * 0.4f)) * masterGain;

                // 7. Simulação de Gabinete de Falante (Speaker Cabinet)
                if (cabinet != CabinetType::Bypass) {
                    sample = cabLowFilter[ch].process(sample);
                    sample = cabResonanceFilter[ch].process(sample);
                    sample = cabHighCutFilter[ch].process(sample);
                }

                // 8. Limitador de Segurança (Proteção acústica a 0 dBFS)
                out[i] = std::clamp(sample, -0.99f, 0.99f);
            }
        }
    }

private:
    float sampleRate = 44100.0f;
    AmpChannel channel = AmpChannel::KinsellaClean;
    CabinetType cabinet = CabinetType::Midwest2x12;

    float inputGain = 1.0f;
    float drive = 0.35f;
    float bass = 0.5f;
    float middle = 0.6f;
    float treble = 0.7f;
    float presence = 0.5f;
    float masterGain = 0.85f;
    bool brightActive = true;

    // Filtros por canal de áudio (Estéreo 2 canais)
    BiquadFilter inputRumbleFilter[2];
    BiquadFilter brightFilter[2];
    BiquadFilter bassFilter[2];
    BiquadFilter midFilter[2];
    BiquadFilter trebleFilter[2];
    BiquadFilter presenceFilter[2];

    // Filtros de Gabinete
    BiquadFilter cabLowFilter[2];
    BiquadFilter cabResonanceFilter[2];
    BiquadFilter cabHighCutFilter[2];

    /**
     * Saturação assimétrica de válvula triodo
     * Cria harmônicos pares suaves para calor analógico
     */
    inline float tubeTriodeSaturation(float x, float bias) {
        float biased = x + bias;
        if (biased > 1.2f) return 0.85f;
        if (biased < -1.8f) return -0.95f;
        return std::tanh(biased) - std::tanh(bias);
    }

    /**
     * Processa os estágios de saturação conforme o canal do amplificador
     */
    inline float processTubeStages(float in, int /*ch*/) {
        switch (channel) {
            case AmpChannel::KinsellaClean: {
                // Alto headroom, leve compressão valvulada para dedilhados límpidos
                float g = 1.2f + drive * 2.0f;
                return tubeTriodeSaturation(in * g, 0.12f);
            }

            case AmpChannel::EmoCrunch: {
                // Dois estágios valvulados em cascata com saturação harmônica expressiva
                float g1 = 2.5f + drive * 6.0f;
                float stage1 = tubeTriodeSaturation(in * g1, 0.22f);
                float g2 = 1.5f + drive * 3.0f;
                return tubeTriodeSaturation(stage1 * g2, -0.15f);
            }

            case AmpChannel::ScreamoWall: {
                // Três estágios de alto ganho com saturação densa e sustentação infinita
                float g1 = 4.0f + drive * 12.0f;
                float stage1 = tubeTriodeSaturation(in * g1, 0.28f);
                float stage2 = tubeTriodeSaturation(stage1 * 3.0f, -0.20f);
                float stage3 = std::tanh(stage2 * 2.2f);
                return stage3;
            }
        }
        return in;
    }

    void updateFilters() {
        for (int ch = 0; ch < 2; ++ch) {
            // Rumble Cut a 75 Hz
            inputRumbleFilter[ch].setHighPass(sampleRate, 75.0f, 0.707f);

            // Chave Bright (+4 dB a 3.5 kHz)
            brightFilter[ch].setHighShelf(sampleRate, 3500.0f, 4.0f);

            // Bass (Low Shelf centrado em 120 Hz: -12 dB a +12 dB)
            float bassDb = (bass - 0.5f) * 24.0f;
            bassFilter[ch].setLowShelf(sampleRate, 120.0f, bassDb);

            // Middle (Peaking interativo em 650 Hz: -10 dB a +10 dB)
            float midDb = (middle - 0.5f) * 20.0f;
            midFilter[ch].setPeaking(sampleRate, 650.0f, midDb, 1.2f);

            // Treble (High Shelf em 2.8 kHz: -12 dB a +12 dB)
            float trebleDb = (treble - 0.5f) * 24.0f;
            trebleFilter[ch].setHighShelf(sampleRate, 2800.0f, trebleDb);

            // Presence (Pico em 4.5 kHz: 0 a +8 dB)
            float presenceDb = presence * 8.0f;
            presenceFilter[ch].setPeaking(sampleRate, 4500.0f, presenceDb, 1.5f);
        }
        updateCabinetFilters();
    }

    void updateCabinetFilters() {
        for (int ch = 0; ch < 2; ++ch) {
            switch (cabinet) {
                case CabinetType::Midwest2x12:
                    // Caixa 2x12 Aberta: Graves arejados (HP 85Hz), pico de brilho em 2.8kHz e corte a 5.8kHz
                    cabLowFilter[ch].setHighPass(sampleRate, 85.0f, 0.8f);
                    cabResonanceFilter[ch].setPeaking(sampleRate, 2800.0f, 3.5f, 1.4f);
                    cabHighCutFilter[ch].setLowPass(sampleRate, 5800.0f, 0.85f);
                    break;

                case CabinetType::BritishGreenback4x12:
                    // Caixa 4x12 Greenback: Médios amadeirados (pico em 1.8kHz), graves cheios e corte a 4.9kHz
                    cabLowFilter[ch].setHighPass(sampleRate, 75.0f, 0.9f);
                    cabResonanceFilter[ch].setPeaking(sampleRate, 1800.0f, 4.5f, 1.8f);
                    cabHighCutFilter[ch].setLowPass(sampleRate, 4900.0f, 0.9f);
                    break;

                case CabinetType::AmericanV30_4x12:
                    // Caixa 4x12 V30: Graves cortados firmes (HP 95Hz), pico cortante em 3.4kHz e corte a 5.2kHz
                    cabLowFilter[ch].setHighPass(sampleRate, 95.0f, 1.1f);
                    cabResonanceFilter[ch].setPeaking(sampleRate, 3400.0f, 5.0f, 2.0f);
                    cabHighCutFilter[ch].setLowPass(sampleRate, 5200.0f, 1.0f);
                    break;

                case CabinetType::Bypass:
                    cabLowFilter[ch].reset();
                    cabResonanceFilter[ch].reset();
                    cabHighCutFilter[ch].reset();
                    break;
            }
        }
    }
};

} // namespace EmoAudioTools
