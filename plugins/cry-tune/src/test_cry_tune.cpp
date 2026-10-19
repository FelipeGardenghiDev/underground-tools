#include "CryTuneDSP.hpp"
#include <iostream>
#include <vector>
#include <cassert>
#include <cmath>

using namespace EmoAudioTools;

void testYinPitchDetection() {
    std::cout << "[Test 1] YIN Pitch Detection Algorithm... ";
    CryTuneDSP tuner;
    tuner.prepare(44100.0f);

    YinPitchDetector detector;
    detector.init(44100.0f, 1024);

    // Gera 2048 amostras de senoide pura a 220 Hz (A3)
    const float testFreq = 220.0f;
    for (int i = 0; i < 2048; ++i) {
        float sample = std::sin(2.0f * M_PI * testFreq * i / 44100.0f);
        detector.feedSample(sample);
    }

    float detected = detector.getPitch();
    assert(detected > 0.0f);
    assert(std::abs(detected - testFreq) < 5.0f); // Erro inferior a 5 Hz (~2%)
    std::cout << "OK (Detectado: " << detected << " Hz para tom de " << testFreq << " Hz)\n";
}

void testScaleQuantization() {
    std::cout << "[Test 2] Scale Quantization (Midwest Emo Tuning)... ";
    CryTuneDSP tuner;
    tuner.prepare(44100.0f);
    tuner.setScale(MusicalScale::MidwestEmo_E); // E Major

    // Teste 1: Frequência ligeiramente desafinada próxima de A4 (440 Hz -> 445 Hz)
    float correctedA4 = tuner.quantizePitch(445.0f);
    assert(std::abs(correctedA4 - 440.0f) < 2.0f);

    // Teste 2: Frequência próxima de E4 (329.63 Hz -> 335 Hz)
    float correctedE4 = tuner.quantizePitch(335.0f);
    assert(std::abs(correctedE4 - 329.63f) < 3.0f);

    // Teste 3: Nota fora da escala E Maior (F4 = 349.23 Hz deve quantizar para E4 ou F#4)
    float snapped = tuner.quantizePitch(349.23f);
    bool snappedToE_or_Fsharp = (std::abs(snapped - 329.63f) < 5.0f) || (std::abs(snapped - 369.99f) < 5.0f);
    assert(snappedToE_or_Fsharp);

    std::cout << "OK\n";
}

void testAudioBlockProcessing() {
    std::cout << "[Test 3] Real-time Audio Block Processing & Stability... ";
    CryTuneDSP tuner;
    tuner.prepare(44100.0f);
    tuner.setAirPresenceDb(6.0f);
    tuner.setRetuneSpeedMs(15.0f);

    const int blockSize = 256;
    const int totalBlocks = 10;
    std::vector<float> inLeft(blockSize, 0.0f);
    std::vector<float> inRight(blockSize, 0.0f);
    std::vector<float> outLeft(blockSize, 0.0f);
    std::vector<float> outRight(blockSize, 0.0f);

    const float* inPtrs[2] = { inLeft.data(), inRight.data() };
    float* outPtrs[2] = { outLeft.data(), outRight.data() };

    for (int b = 0; b < totalBlocks; ++b) {
        // Gera tom senoidal com modulação suave
        for (int i = 0; i < blockSize; ++i) {
            float t = static_cast<float>(b * blockSize + i) / 44100.0f;
            inLeft[i] = 0.5f * std::sin(2.0f * M_PI * 442.0f * t);
            inRight[i] = inLeft[i];
        }

        tuner.process(inPtrs, outPtrs, 2, blockSize);

        for (int i = 0; i < blockSize; ++i) {
            assert(!std::isnan(outLeft[i]));
            assert(!std::isinf(outLeft[i]));
            assert(!std::isnan(outRight[i]));
            assert(!std::isinf(outRight[i]));
        }
    }
    std::cout << "OK (Zero NaNs, processamento estéreo íntegro)\n";
}

int main() {
    std::cout << "===============================================\n";
    std::cout << "  🎙️ CryTune DSP Unit Tests — Underground Tools\n";
    std::cout << "===============================================\n";

    testYinPitchDetection();
    testScaleQuantization();
    testAudioBlockProcessing();

    std::cout << "\n✨ Todos os testes do CryTune passaram com sucesso!\n";
    return 0;
}
