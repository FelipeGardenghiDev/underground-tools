#include "RawMasterDSP.hpp"
#include <iostream>
#include <vector>
#include <cmath>
#include <cassert>

using namespace EmoAudioTools;

int main() {
    std::cout << "📼 [TEST] Inicializando suite de testes do RawMaster Limiter DSP Engine...\n";

    RawMasterEngine limiter;
    limiter.setSampleRate(48000.0f);

    const int blockSize = 1024;
    std::vector<float> inL(blockSize);
    std::vector<float> inR(blockSize);
    std::vector<float> outL(blockSize);
    std::vector<float> outR(blockSize);

    // Sinal de teste: Sinal senoidal ultrapassando 0 dBFS (+6 dBFS)
    for (int i = 0; i < blockSize; ++i) {
        float t = static_cast<float>(i) / 48000.0f;
        float sample = 2.0f * std::sin(2.0f * 3.14159f * 1000.0f * t); // +6 dBFS
        inL[i] = sample;
        inR[i] = sample;
    }

    const float* inputs[2] = { inL.data(), inR.data() };
    float* outputs[2] = { outL.data(), outR.data() };

    // 1. Testa Teto de -0.3 dBFS (0.966 linear)
    std::cout << "  -> Testando clamp no teto de -0.3 dB True Peak...";
    limiter.setCeilingDb(-0.3f);
    limiter.setTargetPreset(LufsTargetPreset::LoudCD);
    limiter.process(inputs, outputs, 2, blockSize);

    float maxPeak = 0.0f;
    for (int i = 0; i < blockSize; ++i) {
        assert(!std::isnan(outL[i]) && "RawMaster gerou NaN!");
        assert(!std::isinf(outL[i]) && "RawMaster gerou Inf!");
        maxPeak = std::max(maxPeak, std::abs(outL[i]));
    }

    assert(maxPeak <= 0.97f && "Limiter falhou e permitiu ultrapassagem do teto!");
    std::cout << " [OK] (Pico maximo medido: " << maxPeak << " <= 0.966)\n";

    // 2. Testa Medidor de LUFS
    std::cout << "  -> Testando integracao do medidor LUFS...";
    assert(!std::isnan(limiter.getCurrentLufs()) && "LUFS retornou NaN!");
    std::cout << " [OK] (LUFS medido: " << limiter.getCurrentLufs() << " dB)\n";

    std::cout << "✨ [SUCESSO] Todos os testes unitarios do RawMaster foram aprovados!\n";
    return 0;
}
