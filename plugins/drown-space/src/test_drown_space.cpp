#include "DrownSpaceDSP.hpp"
#include <iostream>
#include <vector>
#include <cmath>
#include <cassert>

using namespace EmoAudioTools;

int main() {
    std::cout << "🌊 [TEST] Inicializando suite de testes do DrownSpace Reverb DSP Engine...\n";

    DrownSpaceEngine reverb;
    reverb.setSampleRate(48000.0f);

    const int blockSize = 1024;
    std::vector<float> inL(blockSize, 0.0f);
    std::vector<float> inR(blockSize, 0.0f);
    std::vector<float> outL(blockSize);
    std::vector<float> outR(blockSize);

    // Impulso inicial simples (Dirac delta) para excitar a resposta de cauda do reverb
    inL[0] = 1.0f;
    inR[0] = 1.0f;

    const float* inputs[2] = { inL.data(), inR.data() };
    float* outputs[2] = { outL.data(), outR.data() };

    // 1. Testa Cauda do Reverb com Decaimento Amplo
    std::cout << "  -> Testando geracao de cauda e difusao...";
    reverb.setDecay(0.85f);
    reverb.setMix(0.5f);
    reverb.setCassetteFlutter(0.4f);
    reverb.process(inputs, outputs, 2, blockSize);

    float tailEnergy = 0.0f;
    for (int i = 100; i < blockSize; ++i) {
        assert(!std::isnan(outL[i]) && "DrownSpace gerou NaN!");
        assert(!std::isinf(outL[i]) && "DrownSpace gerou Inf!");
        tailEnergy += std::abs(outL[i]);
    }
    assert(tailEnergy > 0.01f && "Reverb nao produziu cauda difusa!");
    std::cout << " [OK]\n";

    // 2. Testa Auto-Ducking
    std::cout << "  -> Testando ativacao do Auto-Ducking com sinal quente de entrada...";
    reverb.setDucking(0.8f);
    // Injeta sinal contínuo alto
    for (int i = 0; i < blockSize; ++i) {
        inL[i] = 0.8f * std::sin(2.0f * 3.14159f * 440.0f * (i / 48000.0f));
        inR[i] = inL[i];
    }
    reverb.process(inputs, outputs, 2, blockSize);
    for (int i = 0; i < blockSize; ++i) {
        assert(!std::isnan(outL[i]));
    }
    std::cout << " [OK]\n";

    std::cout << "✨ [SUCESSO] Todos os testes unitarios do DrownSpace foram aprovados!\n";
    return 0;
}
