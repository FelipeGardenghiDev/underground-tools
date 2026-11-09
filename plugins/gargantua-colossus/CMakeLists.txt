cmake_minimum_required(VERSION 3.15)
project(GargantuaColossus VERSION 1.0.0 LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

include_directories(src ../common)

add_executable(test_gargantua_colossus src/test_gargantua_colossus.cpp)

if(MSVC)
    target_compile_options(test_gargantua_colossus PRIVATE /O2 /fp:fast)
else()
    target_compile_options(test_gargantua_colossus PRIVATE -O3 -ffast-math)
endif()

enable_testing()
add_test(NAME RunGargantuaColossusTests COMMAND test_gargantua_colossus)
