cmake_minimum_required(VERSION 3.15)
project(MidwestAmp VERSION 1.0.0 LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

include(FetchContent)
FetchContent_Declare(
    clap
    GIT_REPOSITORY https://github.com/free-audio/clap.git
    GIT_TAG 1.2.2
    GIT_SHALLOW TRUE
)
FetchContent_MakeAvailable(clap)

# Inclui os cabeçalhos DSP, CLAP e Common
include_directories(src ${clap_SOURCE_DIR}/include ../common)

# Executável de testes unitários do motor DSP
add_executable(test_midwest_amp src/test_midwest_amp.cpp)

# Utilitário CLI para reamp offline e geração de demos
add_executable(midwest_amp_cli src/midwest_amp_cli.cpp)

# Plugin Nativo CLAP (compatível com REAPER, Bitwig, FL Studio)
add_library(MidwestAmp SHARED src/clap_midwest_amp.cpp)
set_target_properties(MidwestAmp PROPERTIES
    PREFIX ""
    SUFFIX ".clap"
    OUTPUT_NAME "MidwestAmp"
)

if(MSVC)
    target_compile_options(test_midwest_amp PRIVATE /O2 /fp:fast)
    target_compile_options(midwest_amp_cli PRIVATE /O2 /fp:fast)
    target_compile_options(MidwestAmp PRIVATE /O2 /fp:fast)
else()
    target_compile_options(test_midwest_amp PRIVATE -O3 -ffast-math)
    target_compile_options(midwest_amp_cli PRIVATE -O3 -ffast-math)
    target_compile_options(MidwestAmp PRIVATE -O3 -ffast-math -fPIC)
endif()

enable_testing()
add_test(NAME RunMidwestAmpTests COMMAND test_midwest_amp)
add_test(NAME RunMidwestAmpCLI COMMAND midwest_amp_cli --output demo_test.wav)
