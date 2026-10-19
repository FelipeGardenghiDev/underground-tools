cmake_minimum_required(VERSION 3.15)
project(MidwestAmp VERSION 1.0.0 LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Inclui os cabeçalhos DSP
include_directories(src)

# Executável de testes unitários do motor DSP
add_executable(test_midwest_amp src/test_midwest_amp.cpp)

# Configurações de compilação otimizada para áudio em tempo real
if(MSVC)
    target_compile_options(test_midwest_amp PRIVATE /O2 /fp:fast)
else()
    target_compile_options(test_midwest_amp PRIVATE -O3 -ffast-math)
endif()

enable_testing()
add_test(NAME RunMidwestAmpTests COMMAND test_midwest_amp)
