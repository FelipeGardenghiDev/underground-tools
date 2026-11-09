cmake_minimum_required(VERSION 3.15)
project(DrownSpace VERSION 1.0.0 LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

include_directories(src ../common)

add_executable(test_drown_space src/test_drown_space.cpp)

if(MSVC)
    target_compile_options(test_drown_space PRIVATE /O2 /fp:fast)
else()
    target_compile_options(test_drown_space PRIVATE -O3 -ffast-math)
endif()

enable_testing()
add_test(NAME RunDrownSpaceTests COMMAND test_drown_space)
