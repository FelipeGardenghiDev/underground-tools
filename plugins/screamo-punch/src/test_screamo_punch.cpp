#include "ScreamoPunchDSP.hpp"
#include <iostream>
#include <vector>
#include <cmath>
#include <cassert>

using namespace EmoAudioTools;

int main() {
    std::cout << "💥 [TEST] Inicializando suite de testes do ScreamoPunch DSP Engine...\n";

    ScreamoPunchEngine comp;
    comp.setSampleRate(48000.0f);

    const int blockSize = 512;
    std::vector<float> inL(blockSize);
    std::vector<float> inR(blockSize);
    std::vector<float> outL(blockSize);
    std::vector<float> outR(blockSize);

    // Sinal de teste: Transiente de caixa de bateria (pico forte inicial e decaimento rápido)
    for (int i = 0; i < blockSize; ++i) {
        float t = static_cast<float>(i) / 48000.0f;
        float snareHit = (i == 0 ? 1.0f : 0.0f) + 0.8f * std::exp(-t * 80.0f) * std::sin(2.0f * 3.14159f * 180.0f * t);
        inL[i] = snareHit;
        inR[i] = snareHit;
    }

    const float* inputs[2] = { inL.data(), inR.data() };
    float* outputs[2] = { outL.data(), outR.data() };

    // 1. Testa Compressão Forte (Smash = 0.9)
    std::cout << "  -> Testando modo Smash agressivo...";
    comp.setSmash(0.9f);
    comp.setPunch(0.7f);
    comp.setMix(1.0f);
    comp.process(inputs, outputs, 2, blockSize);

    for (int i = 0; i < blockSize; ++i) {
        assert(!std::isnan(outL[i]) && "ScreamoPunch gerou NaN!");
        assert(!std::isinf(outL[i]) && "ScreamoPunch gerou Inf!");
        assert(std::abs(outL[i]) <= 1.5f && "Compressor explodiu!");
    }
    assert(comp.getGainReductionDb() > 0.5f && "Gain reduction nao foi ativado com sinal forte!");
    std::cout << " [OK] (GR medido: " << comp.getGainReductionDb() << " dB)\n";

    // 2. Testa Compressão Paralela (Mix = 0.5)
    std::cout << "  -> Testando compressao paralela (50% Dry / 50% Wet)...";
    comp.setMix(0.5f);
    comp.process(inputs, outputs, 2, blockSize);
    for (int i = 0; i < blockSize; ++i) {
        assert(!std::isnan(outL[i]));
    }
    std::cout << " [OK]\n";

    std::cout << "✨ [SUCESSO] Todos os testes unitarios do ScreamoPunch foram aprovados!\n";
    return 0;
}
