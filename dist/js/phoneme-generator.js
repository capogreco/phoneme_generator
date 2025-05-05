/**
 * PhonemeGenerator class
 * 
 * High-level API for generating phonemes using the WebAssembly vocal tract model.
 * This class handles the WASM module loading, AudioWorklet setup, and provides
 * a simple interface for controlling phoneme parameters.
 */

import { allVowels, getPhonemeConfig } from './phonemes.js';

export class PhonemeGenerator {
    constructor(audioContext) {
        this.audioContext = audioContext;
        this.workletNode = null;
        this.isInitialized = false;
        this.tractSize = 44; // Default size, will be updated from WASM
        this.wasmModule = null;
        
        // Current state
        this.currentPhoneme = null;
        
        // Status callback
        this.onStatus = null;
    }
    
    /**
     * Initialize the PhonemeGenerator
     * This loads the WASM module and sets up the AudioWorklet
     */
    async initialize() {
        if (this.isInitialized) return;
        
        try {
            // Step 1: Load the AudioWorklet module
            await this.audioContext.audioWorklet.addModule('js/worklet-processor.js');
            console.log('AudioWorklet module loaded');
            
            // Step 2: Fetch and compile the WASM module
            await this.fetchAndCompileWasm();
            
            // Step 3: Create the AudioWorkletNode
            this.workletNode = new AudioWorkletNode(this.audioContext, 'tract-processor', {
                outputChannelCount: [2],
                numberOfInputs: 0,
                numberOfOutputs: 1
            });
            
            // Step 4: Connect to destination
            this.workletNode.connect(this.audioContext.destination);
            
            // Step 5: Set up message handling
            this.workletNode.port.onmessage = (event) => this.handleWorkletMessage(event);
            
            // Step 6: Send the compiled WASM module to the worklet
            await this.sendWasmToWorklet();
            
            // Set initial parameters based on UI values
            this.initializeParameters();
            
            console.log('PhonemeGenerator initialized');
            return true;
        } catch (error) {
            console.error('Failed to initialize PhonemeGenerator:', error);
            this.sendStatus('error', error.message);
            throw error;
        }
    }
    
    /**
     * Fetch and compile the WASM module on the main thread
     */
    async fetchAndCompileWasm() {
        try {
            const wasmPath = 'wasm/vocal_tract_bg.wasm';
            console.log(`Fetching and compiling WASM from ${wasmPath}...`);
            
            try {
                // Try using compileStreaming first (more efficient)
                this.wasmModule = await WebAssembly.compileStreaming(fetch(wasmPath));
                console.log('WASM module compiled via compileStreaming');
            } catch (error) {
                // Fall back to manual fetch and compile
                console.warn(`CompileStreaming failed (${error.message}), falling back to manual fetch`);
                const response = await fetch(wasmPath);
                const buffer = await response.arrayBuffer();
                this.wasmModule = await WebAssembly.compile(buffer);
                console.log('WASM module compiled via manual fetch and compile');
            }
            
            console.log('WASM module compiled successfully');
        } catch (error) {
            console.error('Failed to fetch and compile WASM module:', error);
            throw error;
        }
    }
    
    /**
     * Send the compiled WASM module to the worklet
     */
    async sendWasmToWorklet() {
        if (!this.workletNode || !this.wasmModule) {
            throw new Error('AudioWorkletNode or WASM module not initialized');
        }
        
        console.log('Sending compiled WASM module to AudioWorklet...');
        
        // Create a promise that resolves when the worklet responds
        const wasmInitPromise = new Promise((resolve, reject) => {
            const messageHandler = (event) => {
                const data = event.data;
                if (data.type === 'wasm-init-status') {
                    this.workletNode.port.removeEventListener('message', messageHandler);
                    if (data.success) {
                        console.log('WASM module initialized in worklet successfully');
                        // Update tract size if provided
                        if (data.tractSize) {
                            this.tractSize = data.tractSize;
                            console.log(`Tract size updated to ${this.tractSize}`);
                        }
                        resolve();
                    } else {
                        console.error('WASM module initialization failed in worklet:', data.error);
                        reject(new Error(`WASM initialization failed: ${data.error}`));
                    }
                }
            };
            
            // Listen for the init status response
            this.workletNode.port.addEventListener('message', messageHandler);
            
            // Send the compiled module
            this.workletNode.port.postMessage({
                type: 'wasm-module',
                wasmModule: this.wasmModule
            }, []);
            
            console.log('Compiled WASM module sent to AudioWorklet');
        });
        
        // Wait for initialization to complete
        await wasmInitPromise;
        this.isInitialized = true;
        this.sendStatus('ready');
    }
    
    /**
     * Initialize parameters based on UI values
     */
    initializeParameters() {
        // Get initial parameter values from UI
        const frequencySlider = document.getElementById('frequencySlider');
        const tensenessSlider = document.getElementById('tensenessSlider');
        const voicingToggle = document.getElementById('voicingToggle');
        const velumSlider = document.getElementById('velumSlider');
        
        if (frequencySlider) {
            this.setFrequency(parseFloat(frequencySlider.value));
        }
        
        if (tensenessSlider) {
            this.setTenseness(parseFloat(tensenessSlider.value));
        }
        
        if (voicingToggle) {
            this.setVoiced(voicingToggle.checked);
        }
        
        if (velumSlider) {
            this.setVelum(parseFloat(velumSlider.value));
        }
        
        // Set default phoneme (neutral 'a')
        if (!this.currentPhoneme) {
            this.setPhoneme('a');
        }
    }
    
    /**
     * Handle messages from the AudioWorklet
     */
    handleWorkletMessage(event) {
        const data = event.data;
        
        if (data.type === 'performance-report') {
            // Forward performance stats to the status handler
            this.sendStatus('performance', data.stats.cpuLoad, data.stats.avgProcessingTimeMs);
        }
    }
    
    /**
     * Send status update to the callback
     */
    sendStatus(type, ...args) {
        if (typeof this.onStatus === 'function') {
            if (type === 'ready') {
                this.onStatus({ type: 'ready' });
            } else if (type === 'error') {
                this.onStatus({ type: 'error', message: args[0] });
            } else if (type === 'performance') {
                this.onStatus({ 
                    type: 'performance', 
                    cpuLoad: args[0], 
                    processingTime: args[1] 
                });
            }
        }
    }
    
    /**
     * Set a phoneme by name
     * @param {string} name - The phoneme name to use
     */
    setPhoneme(name) {
        if (!this.isInitialized || !this.workletNode) {
            console.warn('Cannot set phoneme, PhonemeGenerator not initialized');
            return false;
        }
        
        const phoneme = allVowels[name];
        if (!phoneme) {
            console.error(`Phoneme ${name} not found`);
            return false;
        }
        
        // Get tract configuration for this phoneme
        const diameters = getPhonemeConfig(name, this.tractSize);
        if (!diameters) {
            console.error(`Failed to get configuration for phoneme ${name}`);
            return false;
        }
        
        // Send to AudioWorklet
        this.workletNode.port.postMessage({
            type: 'tract-diameters',
            diameters
        });
        
        // Store current phoneme
        this.currentPhoneme = name;
        return true;
    }
    
    /**
     * Set the glottis frequency (pitch)
     * @param {number} frequency - Frequency in Hz
     */
    setFrequency(frequency) {
        if (!this.workletNode) return;
        
        this.workletNode.parameters.get('frequency').value = frequency;
    }
    
    /**
     * Set the tenseness of the vocal folds
     * @param {number} tenseness - Tenseness value from 0 to 1
     */
    setTenseness(tenseness) {
        if (!this.workletNode) return;
        
        this.workletNode.parameters.get('tenseness').value = tenseness;
    }
    
    /**
     * Set whether the sound is voiced or unvoiced
     * @param {boolean} voiced - True for voiced sound, false for unvoiced
     */
    setVoiced(voiced) {
        if (!this.workletNode) return;
        
        this.workletNode.parameters.get('voicing').value = voiced ? 1 : 0;
    }
    
    /**
     * Set the velum opening (nasal passage)
     * @param {number} velum - Velum opening from 0.01 to 0.4
     */
    setVelum(velum) {
        if (!this.workletNode) return;
        
        this.workletNode.parameters.get('velum').value = velum;
    }
}