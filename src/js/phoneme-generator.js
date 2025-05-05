/**
 * PhonemeGenerator class
 * 
 * High-level API for generating phonemes using the WebAssembly vocal tract model.
 * This class handles the WASM module loading, AudioWorklet setup, and provides
 * a simple interface for controlling phoneme parameters.
 */

import { allVowels, allPhonemes, getPhonemeConfig } from './phonemes.js';

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
            
            // Step 2: Create the AudioWorkletNode
            this.workletNode = new AudioWorkletNode(this.audioContext, 'tract-processor', {
                outputChannelCount: [2],
                numberOfInputs: 0,
                numberOfOutputs: 1
            });
            
            // Step 3: Connect to destination
            this.workletNode.connect(this.audioContext.destination);
            
            // Step 4: Set up message handling
            this.workletNode.port.onmessage = (event) => this.handleWorkletMessage(event);
            
            // Step 5: Send the WASM binary to the worklet
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
     * Send the WASM binary to the worklet
     */
    async sendWasmToWorklet() {
        if (!this.workletNode) {
            throw new Error('AudioWorkletNode not initialized');
        }
        
        console.log('Sending WASM binary to AudioWorklet...');
        
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
        
            // Fetch the WASM binary
            (async () => {
                try {
                    // Try to fetch the direct implementation WASM first (simpler)
                    let wasmPath = 'wasm/vocal_tract_direct.wasm';
                    let response = await fetch(wasmPath);
                    
                    // If that fails, fall back to the wasm-bindgen version
                    if (!response.ok) {
                        console.log('Direct WASM implementation not found, falling back to wasm-bindgen version');
                        wasmPath = 'wasm/vocal_tract_bg.wasm';
                        response = await fetch(wasmPath);
                        
                        if (!response.ok) {
                            throw new Error(`Failed to fetch WASM file from ${wasmPath}`);
                        }
                    }
                    
                    console.log(`Successfully fetched WASM file from ${wasmPath}`);
                    const wasmBinary = await response.arrayBuffer();
                    
                    console.log(`Fetched WASM binary, size: ${wasmBinary.byteLength} bytes`);
                    
                    // Create a copy of the binary before transferring it
                    // to avoid issues with the ArrayBuffer being detached
                    const wasmBinaryCopy = wasmBinary.slice(0);
                    
                    // Send the binary to the worklet with its path
                    this.workletNode.port.postMessage({
                        type: 'wasm-module',
                        wasmModule: wasmBinary,
                        wasmPath: wasmPath
                    }, [wasmBinary]); // Transfer the binary for better performance
                    
                    console.log('WASM binary sent to AudioWorklet');
                } catch (error) {
                    console.error('Error sending WASM binary to worklet:', error);
                    reject(error);
                }
            })();
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
     * @returns {Array|null} - The diameters array for visualization, or null on error
     */
    setPhoneme(name) {
        if (!this.isInitialized || !this.workletNode) {
            console.warn('Cannot set phoneme, PhonemeGenerator not initialized');
            return null;
        }
        
        const phoneme = allPhonemes[name];
        if (!phoneme) {
            console.error(`Phoneme ${name} not found`);
            return null;
        }
        
        // Get tract configuration for this phoneme
        const config = getPhonemeConfig(name, this.tractSize);
        if (!config) {
            console.error(`Failed to get configuration for phoneme ${name}`);
            return null;
        }
        
        // Send diameter configuration to AudioWorklet
        this.workletNode.port.postMessage({
            type: 'tract-diameters',
            diameters: config.diameters
        });
        
        // Handle consonant-specific properties
        
        // First, clear any existing constrictions
        this.workletNode.port.postMessage({
            type: 'clear-constrictions'
        });
        
        // Set voicing if specified
        if (config.voiced !== undefined) {
            this.setVoiced(config.voiced);
        }
        
        // Add any constrictions for fricatives and stops
        if (config.constrictions && config.constrictions.length > 0) {
            for (const constriction of config.constrictions) {
                this.workletNode.port.postMessage({
                    type: 'add-constriction',
                    index: constriction.index,
                    diameter: constriction.diameter,
                    fricative: constriction.fricative
                });
            }
        }
        
        // Add after-burst constrictions for affricates
        if (config.afterBurstConstrictions && config.afterBurstConstrictions.length > 0) {
            for (const constriction of config.afterBurstConstrictions) {
                this.workletNode.port.postMessage({
                    type: 'add-after-burst-constriction',
                    index: constriction.index,
                    diameter: constriction.diameter,
                    fricative: constriction.fricative
                });
            }
        }
        
        // Handle nasal consonants
        if (config.nasal && config.velumOpening !== undefined) {
            this.workletNode.port.postMessage({
                type: 'set-velum-opening',
                velumOpening: config.velumOpening
            });
            console.log(`Setting nasal consonant ${name} with velum opening:`, config.velumOpening);
        } else {
            // Set default velum opening if not a nasal consonant
            this.setVelum(0.01);
        }
        
        // Handle approximants
        if (config.approximant) {
            this.workletNode.port.postMessage({
                type: 'set-approximant',
                isApproximant: true
            });
            console.log(`Setting approximant consonant ${name}`);
        }
        
        // Handle stop consonant timing
        if (config.isStop) {
            console.log(`Setting stop consonant ${name} with timing:`, config.timing);
            this.workletNode.port.postMessage({
                type: 'set-stop-consonant',
                isStop: true,
                timing: config.timing,
                afterBurstConstrictions: config.afterBurstConstrictions
            });
        } else {
            // Make sure to turn off stop consonant mode if not a stop
            this.workletNode.port.postMessage({
                type: 'set-stop-consonant',
                isStop: false
            });
        }
        
        // Store current phoneme
        this.currentPhoneme = name;
        
        // Return the diameters for visualization
        return config.diameters;
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