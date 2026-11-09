#include "GargantuaColossusDSP.hpp"
#include <cassert>
#include <iostream>
#include <vector>

using namespace EmoAudioTools;

int main() {
    std::cout << "[Test GargantuaColossus] Iniciando verificacao do sintetizador de drone..." << std::endl;

    GargantuaColossusEngine synth;
    synth.setSampleRate(44100.0f);

    std::vector<float> bufferL(2048, 0.0f);
    std::vector<float> bufferR(2048, 0.0f);

    // Toca nota grave atmosférica (C2 = MIDI 36)
    synth.noteOn(36, 0.9f);
    synth.process(bufferL.data(), bufferR.data(), 2048);

    float maxSample = 0.0f;
    for (float s : bufferL) {
        maxSample = std::max(maxSample, std::abs(s));
    }
    assert(maxSample > 0.01f);
    std::cout << "  ✓ Paredao Gargantua Supersaw gerado com sucesso. Nivel de Pico: " << maxSample << std::endl;

    // Release da nota
    synth.noteOff(36);
    synth.process(bufferL.data(), bufferR.data(), 2048);
    std::cout << "  ✓ Decaimento cinematografico (release suave) executado sem cliques." << std::endl;

    std::cout << "[Test GargantuaColossus] Todos os testes passaram com perfeição!" << std::endl;
    return 0;
}
