#include "MidwestAmpDSP.hpp"
#include <iostream>
#include <vector>
#include <cmath>
#include <cassert>

using namespace EmoAudioTools;

int main() {
    std::cout << "🖤 [TEST] Inicializando suite de testes do MidwestAmp DSP Engine...\n";

    MidwestAmpEngine amp;
    amp.setSampleRate(48000.0f);

    const int blockSize = 256;
    std::vector<float> inL(blockSize);
    std::vector<float> inR(blockSize);
    std::vector<float> outL(blockSize);
    std::vector<float> outR(blockSize);

    // Gera sinal de teste: Senoide de 440 Hz (Nota Lá de Guitarra) com amplitude 0.5
    for (int i = 0; i < blockSize; ++i) {
        float t = static_cast<float>(i) / 48000.0f;
        float sample = 0.5f * std::sin(2.0f * 3.14159265f * 440.0f * t);
        inL[i] = sample;
        inR[i] = sample;
    }

    const float* inputs[2] = { inL.data(), inR.data() };
    float* outputs[2] = { outL.data(), outR.data() };

    // 1. Testa Canal KinsellaClean
    std::cout << "  -> Testando Canal 0: KinsellaClean...";
    amp.setChannel(AmpChannel::KinsellaClean);
    amp.setDrive(0.3f);
    amp.setCabinet(CabinetType::Midwest2x12);
    amp.process(inputs, outputs, 2, blockSize);

    for (int i = 0; i < blockSize; ++i) {
        assert(!std::isnan(outL[i]) && "KinsellaClean gerou NaN!");
        assert(!std::isinf(outL[i]) && "KinsellaClean gerou Inf!");
        assert(std::abs(outL[i]) <= 1.0f && "Limitador falhou no KinsellaClean!");
    }
    std::cout << " [OK]\n";

    // 2. Testa Canal EmoCrunch
    std::cout << "  -> Testando Canal 1: EmoCrunch...";
    amp.setChannel(AmpChannel::EmoCrunch);
    amp.setDrive(0.6f);
    amp.setCabinet(CabinetType::BritishGreenback4x12);
    amp.process(inputs, outputs, 2, blockSize);

    for (int i = 0; i < blockSize; ++i) {
        assert(!std::isnan(outL[i]) && "EmoCrunch gerou NaN!");
        assert(!std::isinf(outL[i]) && "EmoCrunch gerou Inf!");
        assert(std::abs(outL[i]) <= 1.0f && "Limitador falhou no EmoCrunch!");
    }
    std::cout << " [OK]\n";

    // 3. Testa Canal ScreamoWall (Alto Ganho Extremo)
    std::cout << "  -> Testando Canal 2: ScreamoWall (High-Gain)...";
    amp.setChannel(AmpChannel::ScreamoWall);
    amp.setDrive(0.95f);
    amp.setInputGainDb(12.0f); // Sinal quente
    amp.setCabinet(CabinetType::AmericanV30_4x12);
    amp.process(inputs, outputs, 2, blockSize);

    float energyL = 0.0f;
    for (int i = 0; i < blockSize; ++i) {
        assert(!std::isnan(outL[i]) && "ScreamoWall gerou NaN!");
        assert(!std::isinf(outL[i]) && "ScreamoWall gerou Inf!");
        assert(std::abs(outL[i]) <= 1.0f && "Limitador falhou no ScreamoWall!");
        energyL += outL[i] * outL[i];
    }
    assert(energyL > 0.01f && "Sinal de saida esta mudo!");
    std::cout << " [OK]\n";

    // 4. Testa Cabinet Bypass
    std::cout << "  -> Testando Cabinet Bypass...";
    amp.setCabinet(CabinetType::Bypass);
    amp.process(inputs, outputs, 2, blockSize);
    for (int i = 0; i < blockSize; ++i) {
        assert(!std::isnan(outL[i]));
    }
    std::cout << " [OK]\n";

    std::cout << "✨ [SUCESSO] Todos os testes unitarios do MidwestAmp DSP Engine foram aprovados com louvor!\n";
    return 0;
}
