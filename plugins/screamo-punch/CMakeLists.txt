cmake_minimum_required(VERSION 3.15)
project(ScreamoPunch VERSION 1.0.0 LANGUAGES CXX)

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

include_directories(src ${clap_SOURCE_DIR}/include ../common)

add_executable(test_screamo_punch src/test_screamo_punch.cpp)

# Plugin Nativo CLAP
add_library(ScreamoPunch SHARED src/clap_screamo_punch.cpp)
set_target_properties(ScreamoPunch PROPERTIES
    PREFIX ""
    SUFFIX ".clap"
    OUTPUT_NAME "ScreamoPunch"
)

if(MSVC)
    target_compile_options(test_screamo_punch PRIVATE /O2 /fp:fast)
    target_compile_options(ScreamoPunch PRIVATE /O2 /fp:fast)
else()
    target_compile_options(test_screamo_punch PRIVATE -O3 -ffast-math)
    target_compile_options(ScreamoPunch PRIVATE -O3 -ffast-math -fPIC)
endif()

enable_testing()
add_test(NAME RunScreamoPunchTests COMMAND test_screamo_punch)
