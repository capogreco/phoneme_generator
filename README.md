# Phoneme Generator

A web-based vocal tract phoneme generator using WebAssembly and the Web Audio API.

## Overview

This project implements a real-time vocal synthesizer that allows for the generation of vowel and consonant phonemes. It is built on a physical model of the human vocal tract implemented in Rust and compiled to WebAssembly.

## Features

- Interactive vocal tract visualization
- Real-time audio synthesis
- Control of fundamental vocal parameters:
  - Frequency (pitch)
  - Tenseness
  - Voicing
  - Velum opening
- Selection of various vowel phonemes

## Technology Stack

- Deno for server-side runtime
- WebAssembly for the vocal tract simulation engine
- Web Audio API with AudioWorklet for real-time audio processing
- HTML5 Canvas for visualization

## Getting Started

1. Install Deno if you don't have it already: https://deno.com/
2. Clone this repository
3. Run the server:

```bash
deno task start
```

4. Open a browser and navigate to `http://localhost:8000`

## Credits

This project is based on the Pink Trombone vocal synthesis model, implemented in Rust and WebAssembly.

## License

MIT