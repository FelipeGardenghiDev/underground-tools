#pragma once

#include <vector>
#include <cmath>
#include <algorithm>
#include <string>
#include <array>
#include <cstdint>

#ifndef M_PI
#define M_PI 3.14159265358979323846
#endif

namespace EmoAudioTools {

/**
 * Escalas Musicais Típicas para Afinação Vocal Emo / Alternativa
 */
enum class MusicalScale {
    Chromatic = 0,
    Major = 1,
    NaturalMinor = 2,
    MidwestEmo_E = 3,       // Escala E Maior / DAEAC#E (E, F#, G#, A, B, C#, D#)
    MidwestEmo_D = 4,       // Escala D Maior / FACGCE relativo (D, E, F#, G, A, B, C#)
    EmoMinor_Pentatonic = 5 // Pentatônica menor (típica de refrões melancólicos)
};

/**
 * Filtro Biquad para Equalização Vocal e Estágio "Air Presence"
 */
class VocalBiquad {
public:
    void reset() {
        x1 = x2 = y1 = y2 = 0.0f;
    }

    void setHighShelf(float sampleRate, float frequency, float gainDb) {
        float A = std::pow(10.0f, gainDb / 40.0f);
        float w0 = 2.0f * static_cast<float>(M_PI) * frequency / sampleRate;
        float cosw0 = std::cos(w0);
        float sinw0 = std::sin(w0);
        float alpha = sinw0 / 2.0f * std::sqrt((A + 1.0f / A) * (1.0f / 0.707f - 1.0f) + 2.0f);

        float b0_val =    A * ((A + 1.0f) + (A - 1.0f) * cosw0 + 2.0f * std::sqrt(A) * alpha);
        float b1_val = -2.0f * A * ((A - 1.0f) + (A + 1.0f) * cosw0);
        float b2_val =    A * ((A + 1.0f) + (A - 1.0f) * cosw0 - 2.0f * std::sqrt(A) * alpha);
        float a0_val =        (A + 1.0f) - (A - 1.0f) * cosw0 + 2.0f * std::sqrt(A) * alpha;
        float a1_val =  2.0f * ((A - 1.0f) - (A + 1.0f) * cosw0);
        float a2_val =        (A + 1.0f) - (A - 1.0f) * cosw0 - 2.0f * std::sqrt(A) * alpha;

        float invA0 = 1.0f / a0_val;
        b0 = b0_val * invA0;
        b1 = b1_val * invA0;
        b2 = b2_val * invA0;
        a1 = a1_val * invA0;
        a2 = a2_val * invA0;
    }

    void setHighPass(float sampleRate, float frequency, float q = 0.707f) {
        float w0 = 2.0f * static_cast<float>(M_PI) * frequency / sampleRate;
        float cosw0 = std::cos(w0);
        float alpha = std::sin(w0) / (2.0f * q);

        float b0_val =  (1.0f + cosw0) / 2.0f;
        float b1_val = -(1.0f + cosw0);
        float b2_val =  (1.0f + cosw0) / 2.0f;
        float a0_val =   1.0f + alpha;
        float a1_val =  -2.0f * cosw0;
        float a2_val =   1.0f - alpha;

        float invA0 = 1.0f / a0_val;
        b0 = b0_val * invA0;
        b1 = b1_val * invA0;
        b2 = b2_val * invA0;
        a1 = a1_val * invA0;
        a2 = a2_val * invA0;
    }

    inline float process(float in) {
        float out = b0 * in + b1 * x1 + b2 * x2 - a1 * y1 - a2 * y2;
        x2 = x1;
        x1 = in;
        y2 = y1;
        y1 = out;
        return out;
    }

private:
    float b0 = 1.0f, b1 = 0.0f, b2 = 0.0f;
    float a1 = 0.0f, a2 = 0.0f;
    float x1 = 0.0f, x2 = 0.0f;
    float y1 = 0.0f, y2 = 0.0f;
};

/**
 * Estimador de Pitch em Tempo Real baseado no Algoritmo YIN
 * Otimizado com buffer circular de baixa latência para voz humana
 */
class YinPitchDetector {
public:
    void init(float sr, int bufferSize = 1024) {
        sampleRate = sr;
        windowSize = bufferSize;
        halfBufferSize = bufferSize / 2;
        yinBuffer.assign(halfBufferSize, 0.0f);
        audioHistory.assign(bufferSize, 0.0f);
        writeIndex = 0;
    }

    void feedSample(float sample) {
        audioHistory[writeIndex] = sample;
        writeIndex = (writeIndex + 1) % windowSize;
    }

    /**
     * Calcula o pitch detectado (frequência fundamental f0 em Hz)
     * Retorna -1.0f se o sinal for inaudível ou não-periódico (ruído/respiração)
     */
    float getPitch(float threshold = 0.15f) {
        // 1. Passo: Função de Diferença d(tau)
        for (int tau = 0; tau < halfBufferSize; ++tau) {
            float sum = 0.0f;
            for (int i = 0; i < halfBufferSize; ++i) {
                int idx1 = (writeIndex + i) % windowSize;
                int idx2 = (writeIndex + i + tau) % windowSize;
                float delta = audioHistory[idx1] - audioHistory[idx2];
                sum += delta * delta;
            }
            yinBuffer[tau] = sum;
        }

        // 2. Passo: Cumulative Mean Normalized Difference Function d'(tau)
        yinBuffer[0] = 1.0f;
        float runningSum = 0.0f;
        for (int tau = 1; tau < halfBufferSize; ++tau) {
            runningSum += yinBuffer[tau];
            if (runningSum > 0.00001f) {
                yinBuffer[tau] *= (static_cast<float>(tau) / runningSum);
            } else {
                yinBuffer[tau] = 1.0f;
            }
        }

        // 3. Passo: Busca do primeiro mínimo abaixo do limiar absoluto
        int tauEstimate = -1;
        for (int tau = 2; tau < halfBufferSize; ++tau) {
            if (yinBuffer[tau] < threshold) {
                while (tau + 1 < halfBufferSize && yinBuffer[tau + 1] < yinBuffer[tau]) {
                    tau++;
                }
                tauEstimate = tau;
                break;
            }
        }

        if (tauEstimate == -1) {
            // Nenhum pitch claro detectado
            return -1.0f;
        }

        // 4. Passo: Interpolação Parabólica para precisão sub-amostral
        float betterTau = static_cast<float>(tauEstimate);
        if (tauEstimate > 0 && tauEstimate < halfBufferSize - 1) {
            float s0 = yinBuffer[tauEstimate - 1];
            float s1 = yinBuffer[tauEstimate];
            float s2 = yinBuffer[tauEstimate + 1];
            float denom = 2.0f * (2.0f * s1 - s2 - s0);
            if (std::abs(denom) > 1e-6f) {
                betterTau += (s2 - s0) / denom;
            }
        }

        float f0 = sampleRate / betterTau;
        // Limita a voz humana comum (65 Hz [C2] até 1100 Hz [C6])
        if (f0 >= 65.0f && f0 <= 1100.0f) {
            return f0;
        }

        return -1.0f;
    }

private:
    float sampleRate = 44100.0f;
    int windowSize = 1024;
    int halfBufferSize = 512;
    std::vector<float> yinBuffer;
    std::vector<float> audioHistory;
    int writeIndex = 0;
};

/**
 * Motor DSP Completo do CryTune
 */
class CryTuneDSP {
public:
    CryTuneDSP() {
        prepare(44100.0f);
    }

    void prepare(float sr) {
        sampleRate = sr;
        pitchDetector.init(sr, 1024);
        for (int ch = 0; ch < 2; ++ch) {
            airPresenceFilter[ch].reset();
            lowRumbleFilter[ch].reset();
            airPresenceFilter[ch].setHighShelf(sampleRate, 10500.0f, airPresenceDb);
            lowRumbleFilter[ch].setHighPass(sampleRate, 80.0f, 0.707f);
        }

        delayBuffer.assign(4096, 0.0f);
        delayWriteIdx = 0;
        phase = 0.0f;
        currentSmoothedPitch = 220.0f;
        targetPitch = 220.0f;
    }

    // Parâmetros
    void setRootNote(int midiRoot) { rootNote = midiRoot % 12; } // 0 = C, 2 = D, 4 = E, etc.
    void setScale(MusicalScale s) { currentScale = s; }
    void setRetuneSpeedMs(float speedMs) { retuneSpeedMs = std::clamp(speedMs, 0.0f, 150.0f); }
    void setAirPresenceDb(float db) {
        airPresenceDb = std::clamp(db, 0.0f, 9.0f);
        for (int ch = 0; ch < 2; ++ch) {
            airPresenceFilter[ch].setHighShelf(sampleRate, 10500.0f, airPresenceDb);
        }
    }
    void setMix(float m) { mix = std::clamp(m, 0.0f, 1.0f); }
    void setCrackPreservation(bool preserve) { preserveCracks = preserve; }

    float getDetectedPitch() const { return lastDetectedPitch; }
    float getTargetPitch() const { return targetPitch; }

    /**
     * Quantiza uma frequência detectada para a nota mais próxima na escala musical selecionada
     */
    float quantizePitch(float detectedFreq) {
        if (detectedFreq <= 0.0f) return detectedFreq;

        // Converte frequência para número de nota MIDI contínuo
        float midiNote = 69.0f + 12.0f * std::log2(detectedFreq / 440.0f);
        int nearestMidi = static_cast<int>(std::round(midiNote));

        // Array de semitons permitidos conforme a escala
        std::array<bool, 12> allowedSemitones = { false };

        switch (currentScale) {
            case MusicalScale::Chromatic:
                allowedSemitones.fill(true);
                break;

            case MusicalScale::Major:
            case MusicalScale::MidwestEmo_E:
            case MusicalScale::MidwestEmo_D: {
                // Escala Maior: Root + 0, 2, 4, 5, 7, 9, 11
                int baseRoot = (currentScale == MusicalScale::MidwestEmo_E) ? 4 : // E
                               (currentScale == MusicalScale::MidwestEmo_D) ? 2 : // D
                               rootNote;
                for (int interval : { 0, 2, 4, 5, 7, 9, 11 }) {
                    allowedSemitones[(baseRoot + interval) % 12] = true;
                }
                break;
            }

            case MusicalScale::NaturalMinor: {
                // Escala Menor Natural: Root + 0, 2, 3, 5, 7, 8, 10
                for (int interval : { 0, 2, 3, 5, 7, 8, 10 }) {
                    allowedSemitones[(rootNote + interval) % 12] = true;
                }
                break;
            }

            case MusicalScale::EmoMinor_Pentatonic: {
                // Pentatônica Menor: Root + 0, 3, 5, 7, 10
                for (int interval : { 0, 3, 5, 7, 10 }) {
                    allowedSemitones[(rootNote + interval) % 12] = true;
                }
                break;
            }
        }

        // Encontra a nota permitida mais próxima
        int bestNote = nearestMidi;
        int minDistance = 999;
        for (int note = nearestMidi - 6; note <= nearestMidi + 6; ++note) {
            int pitchClass = (note % 12 + 12) % 12;
            if (allowedSemitones[pitchClass]) {
                int dist = std::abs(note - nearestMidi);
                if (dist < minDistance) {
                    minDistance = dist;
                    bestNote = note;
                }
            }
        }

        // Converte nota MIDI de volta para frequência
        return 440.0f * std::pow(2.0f, (static_cast<float>(bestNote) - 69.0f) / 12.0f);
    }

    /**
     * Processa um bloco de áudio estéreo com correção de pitch e presença emo
     */
    void process(const float* const* inputs, float* const* outputs, int numChannels, int numSamples) {
        float speedAlpha = (retuneSpeedMs <= 0.5f) ? 1.0f : (1.0f - std::exp(-1000.0f / (retuneSpeedMs * sampleRate)));

        for (int i = 0; i < numSamples; ++i) {
            // Média mono para detecção de afinação
            float monoIn = 0.5f * (inputs[0][i] + (numChannels > 1 ? inputs[1][i] : inputs[0][i]));
            pitchDetector.feedSample(monoIn);

            // Calcula o pitch periodicamente (a cada 64 amostras para economia de CPU)
            if ((processSampleCount++ % 64) == 0) {
                float detected = pitchDetector.getPitch(0.18f);
                if (detected > 0.0f) {
                    lastDetectedPitch = detected;
                    targetPitch = quantizePitch(detected);
                }
            }

            // Suaviza a transição de afinação conforme o parâmetro Retune Speed
            if (lastDetectedPitch > 0.0f && targetPitch > 0.0f) {
                currentSmoothedPitch += (targetPitch - currentSmoothedPitch) * speedAlpha;
            }

            // Pitch Shift Factor = frequência corrigida / frequência original
            float pitchRatio = 1.0f;
            if (lastDetectedPitch > 40.0f && currentSmoothedPitch > 40.0f) {
                pitchRatio = currentSmoothedPitch / lastDetectedPitch;
                pitchRatio = std::clamp(pitchRatio, 0.75f, 1.33f); // Limite de 1/3 oitava para timbre natural
            }

            // Grava na linha de retardo circular
            delayBuffer[delayWriteIdx] = monoIn;

            // Pitch shifter dual-tap com envelope triangular de sobreposição sem descontinuidade
            float grainSize = 512.0f;
            phase += (1.0f - pitchRatio) / grainSize;
            while (phase >= 1.0f) phase -= 1.0f;
            while (phase < 0.0f) phase += 1.0f;

            float tap1 = phase * grainSize;
            float tap2 = std::fmod(phase + 0.5f, 1.0f) * grainSize;

            float w1 = 0.5f * (1.0f + std::cos(2.0f * M_PI * (phase - 0.5f)));
            float w2 = 1.0f - w1;

            float s1 = readDelay(tap1);
            float s2 = readDelay(tap2);
            float tunedMono = s1 * w1 + s2 * w2;

            delayWriteIdx = (delayWriteIdx + 1) % static_cast<int>(delayBuffer.size());

            // Processamento estéreo final com filtro de presença e mix
            for (int ch = 0; ch < std::min(numChannels, 2); ++ch) {
                float dry = inputs[ch][i];
                float wet = tunedMono;

                // Passa pelo filtro Air Presence (brilho aéreo nos agudos)
                wet = airPresenceFilter[ch].process(wet);
                wet = lowRumbleFilter[ch].process(wet);

                outputs[ch][i] = dry * (1.0f - mix) + wet * mix;
            }
        }
    }

private:
    float sampleRate = 44100.0f;
    int rootNote = 0; // C
    MusicalScale currentScale = MusicalScale::MidwestEmo_E;
    float retuneSpeedMs = 20.0f; // 20ms = equilibrado para emo moderno
    float airPresenceDb = 4.5f;  // +4.5 dB a 10.5 kHz
    float mix = 1.0f;            // 100% wet
    bool preserveCracks = true;

    YinPitchDetector pitchDetector;
    VocalBiquad airPresenceFilter[2];
    VocalBiquad lowRumbleFilter[2];

    std::vector<float> delayBuffer;
    int delayWriteIdx = 0;
    float phase = 0.0f;
    uint32_t processSampleCount = 0;

    float lastDetectedPitch = 220.0f;
    float targetPitch = 220.0f;
    float currentSmoothedPitch = 220.0f;

    inline float readDelay(float offset) {
        int bufSize = static_cast<int>(delayBuffer.size());
        float readPos = static_cast<float>(delayWriteIdx) - offset;
        while (readPos < 0.0f) readPos += bufSize;
        while (readPos >= bufSize) readPos -= bufSize;

        int i0 = static_cast<int>(readPos);
        int i1 = (i0 + 1) % bufSize;
        float frac = readPos - i0;
        return delayBuffer[i0] * (1.0f - frac) + delayBuffer[i1] * frac;
    }
};

} // namespace EmoAudioTools
