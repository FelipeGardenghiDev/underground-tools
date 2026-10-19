#pragma once

#include <vector>
#include <string>
#include <fstream>
#include <cstdint>
#include <cmath>
#include <stdexcept>
#include <iostream>

namespace EmoAudioTools {

#pragma pack(push, 1)
struct WavHeader {
    char riffTag[4];        // "RIFF"
    uint32_t riffSize;      // File size - 8
    char waveTag[4];        // "WAVE"
    char fmtTag[4];         // "fmt "
    uint32_t fmtSize;       // 16 bytes for PCM
    uint16_t audioFormat;   // 1 = PCM, 3 = IEEE Float
    uint16_t numChannels;   // 1 = Mono, 2 = Stereo
    uint32_t sampleRate;    // e.g. 44100, 48000
    uint32_t byteRate;      // sampleRate * numChannels * (bitsPerSample / 8)
    uint16_t blockAlign;    // numChannels * (bitsPerSample / 8)
    uint16_t bitsPerSample; // 16 or 32
    char dataTag[4];        // "data"
    uint32_t dataSize;      // Number of audio data bytes
};
#pragma pack(pop)

struct AudioBuffer {
    int sampleRate = 44100;
    int numChannels = 2;
    std::vector<std::vector<float>> channels; // [channel][sample]

    int getNumSamples() const {
        return channels.empty() ? 0 : static_cast<int>(channels[0].size());
    }

    void resize(int ch, int samples) {
        numChannels = ch;
        channels.assign(ch, std::vector<float>(samples, 0.0f));
    }
};

class WavFile {
public:
    /**
     * Salva um AudioBuffer como arquivo WAV de 32-bit Float PCM
     */
    static bool saveFloatWav(const std::string& filePath, const AudioBuffer& buffer) {
        std::ofstream out(filePath, std::ios::binary);
        if (!out.is_open()) return false;

        uint32_t numSamples = buffer.getNumSamples();
        uint16_t channels = static_cast<uint16_t>(buffer.numChannels);
        uint32_t sampleRate = static_cast<uint32_t>(buffer.sampleRate);
        uint16_t bitsPerSample = 32;
        uint32_t dataSize = numSamples * channels * (bitsPerSample / 8);

        WavHeader header;
        std::copy_n("RIFF", 4, header.riffTag);
        header.riffSize = sizeof(WavHeader) - 8 + dataSize;
        std::copy_n("WAVE", 4, header.waveTag);
        std::copy_n("fmt ", 4, header.fmtTag);
        header.fmtSize = 16;
        header.audioFormat = 3; // 3 = IEEE Float
        header.numChannels = channels;
        header.sampleRate = sampleRate;
        header.byteRate = sampleRate * channels * 4;
        header.blockAlign = channels * 4;
        header.bitsPerSample = bitsPerSample;
        std::copy_n("data", 4, header.dataTag);
        header.dataSize = dataSize;

        out.write(reinterpret_cast<const char*>(&header), sizeof(WavHeader));

        // Interleaving das amostras em float
        for (uint32_t i = 0; i < numSamples; ++i) {
            for (uint16_t ch = 0; ch < channels; ++ch) {
                float val = buffer.channels[ch][i];
                out.write(reinterpret_cast<const char*>(&val), sizeof(float));
            }
        }

        return true;
    }

    /**
     * Sintetizador de acorde aberto emo em afinação DAEAC#E
     * Útil para testes automatizados reproduzindo dinâmica real de palhetada
     */
    static AudioBuffer generateMidwestChord(float durationSec = 2.0f, int sampleRate = 44100) {
        AudioBuffer buffer;
        int numSamples = static_cast<int>(durationSec * sampleRate);
        buffer.sampleRate = sampleRate;
        buffer.resize(2, numSamples);

        // Frequências das cordas em afinação Midwest Emo (DAEAC#E):
        // D2 (73.4 Hz), A2 (110 Hz), E3 (164.8 Hz), A3 (220 Hz), C#4 (277.2 Hz), E4 (329.6 Hz)
        const float freqs[] = { 73.42f, 110.0f, 164.81f, 220.0f, 277.18f, 329.63f };
        const int numStrings = 6;

        for (int i = 0; i < numSamples; ++i) {
            float t = static_cast<float>(i) / sampleRate;
            float sample = 0.0f;

            for (int s = 0; s < numStrings; ++s) {
                // Simulação de corda de guitarra com ataque percussivo e decaimento exponencial
                float stringDecay = std::exp(-t * (1.2f + s * 0.4f));
                float f = freqs[s];

                // Fundamental + harmônicos típicos de captador single-coil de Telecaster
                float stringSound = std::sin(2.0f * M_PI * f * t)
                                  + 0.5f * std::sin(4.0f * M_PI * f * t)
                                  + 0.25f * std::sin(6.0f * M_PI * f * t)
                                  + 0.12f * std::sin(8.0f * M_PI * f * t);

                sample += stringSound * stringDecay * (0.16f);
            }

            // Espalhamento estéreo sutil para realismo acústico
            buffer.channels[0][i] = sample;
            buffer.channels[1][i] = sample * 0.98f;
        }

        return buffer;
    }
};

} // namespace EmoAudioTools
