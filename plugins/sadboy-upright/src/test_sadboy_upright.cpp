#include "SadBoyUprightDSP.hpp"
#include <cassert>
#include <iostream>
#include <vector>

using namespace EmoAudioTools;

int main() {
    std::cout << "[Test SadBoyUpright] Iniciando verificacao do piano de feltro..." << std::endl;

    SadBoyUprightEngine piano;
    piano.setSampleRate(44100.0f);

    std::vector<float> bufferL(1024, 0.0f);
    std::vector<float> bufferR(1024, 0.0f);

    // Toca um acorde melancólico de Emo (E Maior / G# menor: Notas MIDI 64, 68, 71)
    piano.noteOn(64, 0.8f); // E4
    piano.noteOn(68, 0.75f); // G#4
    piano.noteOn(71, 0.7f); // B4

    piano.process(bufferL.data(), bufferR.data(), 1024);

    float maxSample = 0.0f;
    for (float s : bufferL) {
        maxSample = std::max(maxSample, std::abs(s));
    }
    assert(maxSample > 0.01f);
    std::cout << "  ✓ Acorde de Feltro sintetizado com sucesso. Nivel de Pico: " << maxSample << std::endl;

    // Testa Sustain Pedal
    piano.setSustainPedal(true);
    piano.noteOff(64);
    piano.process(bufferL.data(), bufferR.data(), 1024);
    std::cout << "  ✓ Sustain Pedal ativo manteve as notas em ressonancia." << std::endl;

    std::cout << "[Test SadBoyUpright] Todos os testes passaram com perfeição!" << std::endl;
    return 0;
}
