# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build Commands
- Start development server: `deno task start`
- Build project: `deno task build`
- Run tests: `deno test --allow-read --allow-net`

## Code Style Guidelines
- **Rust**: Use `f32` for audio calculations, handle unsafe code with proper checks
- **Error Handling**: Use `Option<T>` for nullable state, include bounds checking
- **Naming**: Use snake_case for Rust functions, camelCase for JavaScript
- **Imports**: Group standard library imports first, then third-party, then local modules
- **Comments**: Document complex audio processing algorithms and WebAssembly interfaces
- **WebAssembly**: Use `wasm-bindgen` for JS interface, avoid Emscripten dependencies
- **UI**: Implement dark mode for all HTML interfaces, ensure visualizations work on dark backgrounds
- **JavaScript**: Use ES modules, proper async/await for WASM loading
- **TypeScript**: Use TypeScript type annotations when possible for improved code safety

## Project Requirements
- Use Deno runtime instead of Node.js
- ONLY use Rust for WebAssembly generation, NO fallbacks to C
- Focus on Rust → WASM → AudioWorklet workflow
- Prioritize fixing Rust implementation for WebAssembly issues