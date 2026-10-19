#include "MidwestAmpDSP.hpp"
#include "../../common/WavHelper.hpp"
#include <iostream>
#include <string>
#include <vector>

using namespace EmoAudioTools;

int main(int argc, char* argv[]) {
    std::cout << "====================================================\n";
    std::cout << "  🎸 MidwestAmp Offline Reamping & Sound Generator\n";
    std::cout << "  Suíte Emo Audio Tools — Underground Tools\n";
    std::cout << "====================================================\n\n";

    std::string outputPath = "midwest_amp_demo.wav";
    AmpChannel channel = AmpChannel::KinsellaClean;
    CabinetType cabinet = CabinetType::Midwest2x12;
    float drive = 0.4f;
    float bass = 0.55f;
    float mid = 0.65f;
    float treble = 0.70f;
    float presence = 0.60f;
    bool bright = true;

    for (int i = 1; i < argc; ++i) {
        std::string arg = argv[i];
        if (arg == "--output" && i + 1 < argc) outputPath = argv[++i];
        else if (arg == "--channel" && i + 1 < argc) {
            std::string c = argv[++i];
            if (c == "clean") channel = AmpChannel::KinsellaClean;
            else if (c == "crunch") channel = AmpChannel::EmoCrunch;
            else if (c == "screamo") channel = AmpChannel::ScreamoWall;
        }
        else if (arg == "--drive" && i + 1 < argc) drive = std::stof(argv[++i]);
        else if (arg == "--cab" && i + 1 < argc) {
            std::string cb = argv[++i];
            if (cb == "2x12") cabinet = CabinetType::Midwest2x12;
            else if (cb == "greenback") cabinet = CabinetType::BritishGreenback4x12;
            else if (cb == "v30") cabinet = CabinetType::AmericanV30_4x12;
            else if (cb == "bypass") cabinet = CabinetType::Bypass;
        }
    }

    std::cout << "[1/3] Sintetizando acorde aberto Midwest Emo (DAEAC#E)...\n";
    AudioBuffer inputBuffer = WavFile::generateMidwestChord(2.5f, 44100);

    std::cout << "[2/3] Configurando motor DSP valvulado:\n";
    std::cout << "      Canal: " << (channel == AmpChannel::KinsellaClean ? "Kinsella Clean" : 
                                   channel == AmpChannel::EmoCrunch ? "Emo Crunch (90s)" : "Screamo Wall (Post-Hardcore)") << "\n";
    std::cout << "      Gabinete: " << (cabinet == CabinetType::Midwest2x12 ? "2x12 Open Back (Jensens)" : 
                                     cabinet == CabinetType::BritishGreenback4x12 ? "4x12 British Greenback" : 
                                     cabinet == CabinetType::AmericanV30_4x12 ? "4x12 American V30" : "Bypass") << "\n";
    std::cout << "      Drive: " << drive << " | Bright: " << (bright ? "ON" : "OFF") << "\n";

    MidwestAmpDSP amp;
    amp.prepare(inputBuffer.sampleRate);
    amp.setChannel(channel);
    amp.setCabinet(cabinet);
    amp.setDrive(drive);
    amp.setToneStack(bass, mid, treble);
    amp.setPresence(presence);
    amp.setBrightSwitch(bright);

    AudioBuffer outputBuffer;
    outputBuffer.sampleRate = inputBuffer.sampleRate;
    outputBuffer.resize(2, inputBuffer.getNumSamples());

    const float* inPtrs[2] = { inputBuffer.channels[0].data(), inputBuffer.channels[1].data() };
    float* outPtrs[2] = { outputBuffer.channels[0].data(), outputBuffer.channels[1].data() };

    amp.process(inPtrs, outPtrs, 2, inputBuffer.getNumSamples());

    std::cout << "[3/3] Exportando áudio masterizado para: " << outputPath << "\n";
    if (WavFile::saveFloatWav(outputPath, outputBuffer)) {
        std::cout << "✨ Sucesso! Áudio renderizado com preservação dinâmica de 32-bit float.\n";
    } else {
        std::cerr << "❌ Erro ao salvar arquivo WAV: " << outputPath << "\n";
        return 1;
    }

    return 0;
}
