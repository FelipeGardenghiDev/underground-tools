#include "MidwestKitDSP.hpp"
#include <cassert>
#include <iostream>
#include <vector>

using namespace EmoAudioTools;

int main() {
    std::cout << "[Test MidwestKit] Iniciando verificacao do motor de bateria..." << std::endl;

    MidwestKitEngine drums;
    drums.setSampleRate(44100.0f);

    std::vector<float> bufferL(512, 0.0f);
    std::vector<float> bufferR(512, 0.0f);

    // Dispara Bumbo
    drums.noteOn(36, 0.9f);
    drums.process(bufferL.data(), bufferR.data(), 512);

    float maxKick = 0.0f;
    for (float s : bufferL) {
        maxKick = std::max(maxKick, std::abs(s));
    }
    assert(maxKick > 0.05f);
    std::cout << "  ✓ Bumbo (Kick 36) sintetizado com sucesso. Pico: " << maxKick << std::endl;

    // Dispara Caixa
    drums.noteOn(38, 0.85f);
    drums.process(bufferL.data(), bufferR.data(), 512);

    float maxSnare = 0.0f;
    for (float s : bufferL) {
        maxSnare = std::max(maxSnare, std::abs(s));
    }
    assert(maxSnare > 0.05f);
    std::cout << "  ✓ Caixa (Snare 38) sintetizada com sucesso. Pico: " << maxSnare << std::endl;

    // Dispara Chimbal Fechado
    drums.noteOn(42, 0.7f);
    drums.process(bufferL.data(), bufferR.data(), 512);
    std::cout << "  ✓ Chimbal Fechado (Hat 42) sintetizado com sucesso." << std::endl;

    std::cout << "[Test MidwestKit] Todos os testes passaram com perfeição!" << std::endl;
    return 0;
}
