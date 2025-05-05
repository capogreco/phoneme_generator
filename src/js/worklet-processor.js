/**
 * AudioWorklet Processor for the Vocal Tract model
 * 
 * This processor loads and runs the WebAssembly vocal tract model,
 * handling all the low-level audio processing.
 */

// Constants for performance monitoring
const PERFORMANCE_REPORT_INTERVAL_MS = 1000;
const BUFFER_SIZE = 128; // AudioWorkletNode default buffer size

// WASM State
let wasmExports = null;
let wasmReady = false;
let wasmModule = null;
let wasmInstance = null;

console.log('TractProcessor script loading...');

class TractProcessor extends AudioWorkletProcessor {
    constructor() {
        super();
        
        // Tract configuration
        this.tractSize = 44; // Default, will be updated from WASM once ready
        this.tractDiameters = new Array(this.tractSize).fill(1.5);
        
        // Constrictions for fricatives and stops
        this.constrictions = [];
        
        // Audio generation state
        this.noiseSource = 0;
        
        // Stop consonant timing control
        this.isStop = false;
        this.stopPhase = 'none'; // 'none', 'silence', 'burst', 'sustain'
        this.stopTiming = {
            silenceBeforeBurst: 50, // ms
            burstDuration: 20,      // ms
            sustainDuration: 200    // ms
        };
        this.stopTimer = 0;         // ms
        this.samplesSincePhaseChange = 0;
        
        // Keep track of original constrictions for burst phase
        this.originalConstrictions = [];
        
        // Performance monitoring - using AudioWorklet's currentTime
        this.processingStartTime = 0;
        this.processingTimeInFrames = 0;
        this.blockCount = 0;
        this.lastPerformanceReport = currentTime;
        
        // Set up message port for communication with main thread
        this.port.onmessage = this.handleMessage.bind(this);
        
        console.log('TractProcessor constructor called');
    }
    
    /**
     * Handle messages from the main thread
     */
    handleMessage(event) {
        const data = event.data;
        
        if (data.type === 'wasm-module') {
            // Receive and initialize the WASM module
            this.initializeWasm(data.wasmModule, data.wasmPath);
        } else if (data.type === 'tract-diameters') {
            // Only update tract diameters if WASM is ready
            if (!wasmReady) {
                console.warn('Cannot update tract diameters: WASM not ready');
                return;
            }
            
            // Update tract diameters
            if (data.diameters && data.diameters.length === this.tractSize) {
                this.tractDiameters = data.diameters;
                // Apply the diameters to the tract
                this.updateTractShape();
            } else {
                console.error(`Invalid tract diameters. Expected length ${this.tractSize}, got ${data.diameters?.length}`);
            }
        } else if (data.type === 'add-constriction') {
            // Add a constriction for fricatives and stops
            if (!wasmReady) {
                console.warn('Cannot add constriction: WASM not ready');
                return;
            }
            
            // Store the constriction in our array
            this.constrictions.push({
                index: data.index,
                diameter: data.diameter,
                fricative: data.fricative
            });
            
            console.log(`Added constriction at index ${data.index}, diameter ${data.diameter}, fricative ${data.fricative}`);
        } else if (data.type === 'add-after-burst-constriction') {
            // Add a constriction for the after-burst phase of affricates
            if (!wasmReady) {
                console.warn('Cannot add after-burst constriction: WASM not ready');
                return;
            }
            
            // Initialize the after-burst constrictions array if not exists
            if (!this.afterBurstConstrictions) {
                this.afterBurstConstrictions = [];
            }
            
            // Store the constriction
            this.afterBurstConstrictions.push({
                index: data.index,
                diameter: data.diameter,
                fricative: data.fricative
            });
            
            console.log(`Added after-burst constriction at index ${data.index}, diameter ${data.diameter}, fricative ${data.fricative}`);
        } else if (data.type === 'clear-constrictions') {
            // Clear all constrictions
            this.constrictions = [];
            this.originalConstrictions = [];
            this.afterBurstConstrictions = [];
            console.log('Cleared all constrictions');
        } else if (data.type === 'set-stop-consonant') {
            // Handle the stop consonant timing properties
            if (data.isStop) {
                this.isStop = true;
                // Set timing parameters
                if (data.timing) {
                    this.stopTiming = {
                        silenceBeforeBurst: data.timing.silenceBeforeBurst || 50,
                        burstDuration: data.timing.burstDuration || 20,
                        sustainDuration: data.timing.sustainDuration || 200
                    };
                }
                
                // Save the original constrictions for later
                this.originalConstrictions = JSON.parse(JSON.stringify(this.constrictions));
                
                // Store after-burst constrictions if provided
                if (data.afterBurstConstrictions) {
                    this.afterBurstConstrictions = data.afterBurstConstrictions;
                } else {
                    this.afterBurstConstrictions = null;
                }
                
                // Start the stop consonant sequence
                this.stopPhase = 'silence';
                this.stopTimer = 0;
                this.samplesSincePhaseChange = 0;
                
                console.log(`Starting stop consonant with timing: silence=${this.stopTiming.silenceBeforeBurst}ms, burst=${this.stopTiming.burstDuration}ms, sustain=${this.stopTiming.sustainDuration}ms`);
            } else {
                // Reset stop consonant state
                this.isStop = false;
                this.stopPhase = 'none';
                this.stopTimer = 0;
                this.originalConstrictions = [];
                this.afterBurstConstrictions = null;
            }
        } else if (data.type === 'set-velum-opening') {
            // Set the velum opening (for nasal consonants)
            if (!wasmReady) {
                console.warn('Cannot set velum opening: WASM not ready');
                return;
            }
            
            const velumOpening = data.velumOpening || 0.01;
            console.log(`Setting velum opening to ${velumOpening}`);
            wasmExports.set_velum(velumOpening);
        } else if (data.type === 'set-approximant') {
            // Handle approximant consonant properties
            // Approximants are handled through their constrictions
            // but might need special handling in the future
            console.log('Setting approximant mode');
        }
    }
    
    /**
     * Initialize the WASM module
     * @param {ArrayBuffer} moduleObj - The WASM binary
     * @param {string} wasmPath - The path of the WASM file that was loaded
     */
    async initializeWasm(moduleObj, wasmPath) {
        try {
            console.log('Received WASM module in worklet, initializing...');
            
            // First compile the ArrayBuffer into a WebAssembly.Module
            try {
                console.log('Compiling WASM module from binary...');
                wasmModule = await WebAssembly.compile(moduleObj);
                console.log('WASM module compiled successfully');
            } catch (error) {
                console.error('Failed to compile WASM module:', error);
                throw new Error(`Failed to compile WASM module: ${error.message}`);
            }
            
            // Analyze module imports to understand what's required
            const moduleImports = WebAssembly.Module.imports(wasmModule);
            console.log('WASM module requires these imports:', moduleImports);
            
            // Check if this is the direct implementation or wasm-bindgen version
            const isDirectImplementation = wasmPath.includes('direct');
            console.log(`Using ${isDirectImplementation ? 'direct implementation' : 'wasm-bindgen implementation'}`);
            
            // Build import object with required functions
            let importObject;
            
            if (isDirectImplementation) {
                // Direct implementation needs simpler imports
                importObject = {
                    env: {
                        // Math functions
                        sinf: Math.sin,
                        cosf: Math.cos,
                        expf: Math.exp,
                        sqrtf: Math.sqrt,
                        powf: Math.pow,
                        logf: Math.log,
                        fmaxf: Math.max,
                        fminf: Math.min,
                        
                        // C-style math functions (no f suffix)
                        sin: Math.sin,
                        cos: Math.cos,
                        exp: Math.exp,
                        sqrt: Math.sqrt,
                        pow: Math.pow,
                        log: Math.log,
                        fabs: Math.abs,
                        fmod: (x, y) => x % y,
                        
                        // Random number generation
                        random_number: () => Math.random(),
                        
                        // Memory management
                        memory: new WebAssembly.Memory({ initial: 256 })
                    }
                };
            } else {
                // Full wasm-bindgen implementation needs more complex imports
                importObject = {
                    env: {
                        // Math functions
                        sinf: Math.sin,
                        cosf: Math.cos,
                        expf: Math.exp,
                        sqrtf: Math.sqrt,
                        powf: Math.pow,
                        logf: Math.log,
                        fmaxf: Math.max,
                        fminf: Math.min,
                        
                        // C-style math functions (no f suffix)
                        sin: Math.sin,
                        cos: Math.cos,
                        exp: Math.exp,
                        sqrt: Math.sqrt,
                        pow: Math.pow,
                        log: Math.log,
                        fabs: Math.abs,
                        fmod: (x, y) => x % y,
                        
                        // Random number generation
                        random_number: () => Math.random(),
                        
                        // Memory management (required by wasm-bindgen)
                        emscripten_notify_memory_growth: () => {},
                        memory: new WebAssembly.Memory({ initial: 256 })
                    },
                    // Add wbg namespace for wasm-bindgen functions
                    wbg: {
                        __wbg_log_: console.log,
                        __wbindgen_throw: (ptr, len) => { throw new Error("wasm error"); },
                        __wbindgen_object_drop_ref: () => {},
                        __wbg_new_: () => new Object(),
                        __wbindgen_is_object: (val) => typeof(val) === 'object',
                        __wbindgen_is_undefined: (val) => val === undefined,
                        __wbindgen_is_null: (val) => val === null,
                        __wbindgen_memory: () => new WebAssembly.Memory({initial: 256}),
                        __wbg_error_: (arg0, arg1) => console.error(arg0, arg1)
                    }
                };
            }
            
            // Dynamically add any missing imports
            moduleImports.forEach(imp => {
                const { module: modName, name: funcName } = imp;
                
                // Create namespace if it doesn't exist
                if (!importObject[modName]) {
                    importObject[modName] = {};
                    console.log(`Created namespace: ${modName}`);
                }
                
                // Add dummy function if not already present
                if (!importObject[modName][funcName]) {
                    importObject[modName][funcName] = function(...args) {
                        console.log(`Called import ${modName}.${funcName} with args:`, args);
                        return 0;
                    };
                    console.log(`Added dummy function for: ${modName}.${funcName}`);
                }
            });
            
            // Try to instantiate the WASM module
            try {
                console.log('Instantiating WASM module with import object:', 
                            Object.keys(importObject).map(k => `${k}: ${Object.keys(importObject[k]).length} properties`));
                
                // Log which implementation we're using
                console.log(`Using ${isDirectImplementation ? 'direct' : 'wasm-bindgen'} implementation`);
                
                wasmInstance = await WebAssembly.instantiate(wasmModule, importObject);
                console.log('WASM module instantiated successfully');
            } catch (error) {
                console.error('Failed to instantiate WASM module:', error);
                
                // Try to get more detailed error information
                if (error.message.includes("missing import")) {
                    // Look at the error message to extract the missing import
                    const match = error.message.match(/import\s+(\w+)\.(\w+)/);
                    if (match) {
                        const [_, namespace, funcName] = match;
                        console.error(`Missing import: ${namespace}.${funcName}`);
                        
                        // Try to add the missing import and retry
                        if (!importObject[namespace]) {
                            importObject[namespace] = {};
                        }
                        
                        importObject[namespace][funcName] = (...args) => {
                            console.log(`Called missing import ${namespace}.${funcName} with args:`, args);
                            return 0;
                        };
                        
                        try {
                            console.log(`Retrying with added import: ${namespace}.${funcName}`);
                            wasmInstance = await WebAssembly.instantiate(wasmModule, importObject);
                            console.log('WASM module instantiated successfully on retry');
                        } catch (retryError) {
                            console.error('Retry also failed:', retryError);
                            throw new Error(`WASM instantiation failed on retry: ${retryError.message}`);
                        }
                    } else {
                        throw new Error(`WASM instantiation failed: ${error.message}`);
                    }
                } else {
                    throw new Error(`WASM instantiation failed: ${error.message}`);
                }
            }
            
            // Get exports
            wasmExports = wasmInstance.exports;
            console.log('Available WASM exports:', Object.keys(wasmExports));
            
            // Check for required functions - handle both naming conventions
            // Some implementations use init_tract, others use _init_tract (C convention)
            const requiredFunctions = [
                ['init_tract', '_init_tract'],
                ['init_glottis', '_init_glottis'],
                ['process_tract', '_process_tract'],
                ['process_glottis', '_process_glottis'],
                ['get_tract_size', '_get_tract_size'],
                ['set_diameter', '_set_diameter'],
                ['set_frequency', '_set_frequency'],
                ['set_tenseness', '_set_tenseness'],
                ['set_voiced', '_set_voiced'],
                ['set_velum', '_set_velum']
            ];
            
            // Check that at least one version of each required function exists
            const missingFunctions = [];
            for (const [mainName, fallbackName] of requiredFunctions) {
                if (typeof wasmExports[mainName] !== 'function' && 
                    typeof wasmExports[fallbackName] !== 'function') {
                    missingFunctions.push(`${mainName} or ${fallbackName}`);
                }
                
                // If only fallback exists, create an alias to the main name
                if (typeof wasmExports[mainName] !== 'function' && 
                    typeof wasmExports[fallbackName] === 'function') {
                    console.log(`Creating alias from ${fallbackName} to ${mainName}`);
                    wasmExports[mainName] = wasmExports[fallbackName];
                }
            }
            
            if (missingFunctions.length > 0) {
                throw new Error('Missing required WASM exports: ' + missingFunctions.join(', ') + 
                               '. Found: ' + Object.keys(wasmExports).join(', '));
            }
            
            // Initialize the tract and glottis with sample rate
            try {
                console.log('Initializing tract with sample rate:', sampleRate);
                wasmExports.init_tract(sampleRate);
                console.log('Initializing glottis with sample rate:', sampleRate);
                wasmExports.init_glottis(sampleRate);
            } catch (error) {
                console.error('Error during initialization:', error);
                throw new Error(`Failed to initialize tract/glottis: ${error.message}`);
            }
            
            // Get the tract size
            try {
                this.tractSize = wasmExports.get_tract_size();
                console.log(`Tract size from WASM: ${this.tractSize}`);
                
                // Initialize tract diameters arrays
                this.tractDiameters = new Array(this.tractSize).fill(1.5);
            } catch (error) {
                console.error('Error getting tract size:', error);
                this.tractSize = 44; // Default size
                this.tractDiameters = new Array(this.tractSize).fill(1.5);
                console.log(`Using default tract size: ${this.tractSize}`);
            }
            
            // Mark as ready
            wasmReady = true;
            
            // Send success message to main thread
            this.port.postMessage({
                type: 'wasm-init-status',
                success: true,
                tractSize: this.tractSize
            });
            
            console.log('WASM initialization complete, ready for audio processing');
        } catch (error) {
            console.error('Error initializing WASM in worklet:', error);
            
            // Send error to main thread
            this.port.postMessage({
                type: 'wasm-init-status',
                success: false,
                error: error.toString()
            });
        }
    }
    
    /**
     * Update the tract shape in the WASM module
     */
    updateTractShape() {
        if (!wasmReady) return;
        
        // Apply each diameter to the tract
        for (let i = 0; i < this.tractSize; i++) {
            const diameter = this.tractDiameters[i] || 1.5;
            wasmExports.set_diameter(i, diameter);
            wasmExports.set_rest_diameter(i, diameter);
        }
    }
    
    /**
     * Update the stop consonant phase based on elapsed time
     */
    updateStopConsonantPhase(samplesToProcess) {
        if (!this.isStop || this.stopPhase === 'none') {
            return;
        }
        
        // Add the number of samples in this block to our counter
        this.samplesSincePhaseChange += samplesToProcess;
        
        // Convert samples to milliseconds
        const msElapsed = (this.samplesSincePhaseChange / sampleRate) * 1000;
        
        // Check if we need to transition to the next phase
        if (this.stopPhase === 'silence' && msElapsed >= this.stopTiming.silenceBeforeBurst) {
            // Transition from silence to burst
            console.log('Stop consonant: Transitioning from silence to burst phase');
            this.stopPhase = 'burst';
            this.samplesSincePhaseChange = 0;
            
            // For the burst, add high turbulence noise by modifying constrictions
            if (this.originalConstrictions.length > 0) {
                this.constrictions = this.originalConstrictions.map(c => ({
                    ...c,
                    // During burst, add high turbulence
                    fricative: 1.0
                }));
            }
            
            // For affricates, apply the after-burst constrictions if available
            if (this.afterBurstConstrictions && this.afterBurstConstrictions.length > 0) {
                this.constrictions = this.afterBurstConstrictions;
            }
            
        } else if (this.stopPhase === 'burst' && msElapsed >= this.stopTiming.burstDuration) {
            // Transition from burst to sustain
            console.log('Stop consonant: Transitioning from burst to sustain phase');
            this.stopPhase = 'sustain';
            this.samplesSincePhaseChange = 0;
            
            // For affricates, keep using the after-burst constrictions
            if (this.afterBurstConstrictions && this.afterBurstConstrictions.length > 0) {
                // Keep the fricative constrictions but adjust their parameters
                this.constrictions = this.afterBurstConstrictions.map(c => ({
                    ...c,
                    // Slightly reduce the fricative intensity for the sustain phase
                    fricative: c.fricative * 0.8
                }));
            } 
            // For regular stops, create a slightly open version of the original constrictions
            else if (this.originalConstrictions.length > 0) {
                this.constrictions = this.originalConstrictions.map(c => ({
                    ...c,
                    // Open up the constriction a bit for the sustain phase
                    diameter: Math.max(0.1, c.diameter + 0.05),
                    fricative: c.fricative * 0.5 // Reduce turbulence
                }));
            }
            
        } else if (this.stopPhase === 'sustain' && msElapsed >= this.stopTiming.sustainDuration) {
            // End of stop consonant sequence
            console.log('Stop consonant: Sequence complete');
            this.isStop = false;
            this.stopPhase = 'none';
        }
    }
    
    /**
     * Process a buffer of audio
     * This is called by the AudioWorklet system with output buffers to fill
     */
    process(inputs, outputs, parameters) {
        // Start timing this block using currentTime (in seconds)
        this.processingStartTime = currentTime;
        
        // If WASM is not initialized, output silence
        if (!wasmReady || !wasmExports) {
            const output = outputs[0];
            output.forEach(channel => {
                for (let i = 0; i < channel.length; i++) {
                    channel[i] = 0;
                }
            });
            
            // If still not ready after many blocks, log a warning
            if (this.blockCount % 100 === 0) {
                console.warn('WASM not ready - outputting silence');
            }
            
            this.blockCount++;
            return true;
        }
        
        // Get parameter values
        const frequency = parameters.frequency?.length > 0 
            ? parameters.frequency[0] 
            : 140;
            
        const tenseness = parameters.tenseness?.length > 0 
            ? parameters.tenseness[0] 
            : 0.6;
            
        const voicing = parameters.voicing?.length > 0 
            ? parameters.voicing[0] > 0.5 
            : true;
            
        const velum = parameters.velum?.length > 0 
            ? parameters.velum[0] 
            : 0.01;
        
        // Apply parameters to WASM module
        try {
            wasmExports.set_frequency(frequency);
            wasmExports.set_tenseness(tenseness);
            wasmExports.set_voiced(voicing ? 1 : 0);
            wasmExports.set_velum(velum);
            
            // Get the output buffer
            const output = outputs[0];
            const leftChannel = output[0];
            const rightChannel = output.length > 1 ? output[1] : null;
            
            // Update stop consonant phase if needed
            this.updateStopConsonantPhase(leftChannel.length);
            
            // Process each sample
            for (let i = 0; i < leftChannel.length; i++) {
                // Generate noise source (simple random noise)
                this.noiseSource = Math.random() * 2 - 1;
                
                // For stop consonants in silence phase, output silence
                if (this.isStop && this.stopPhase === 'silence') {
                    leftChannel[i] = 0;
                    if (rightChannel) {
                        rightChannel[i] = 0;
                    }
                    continue;
                }
                
                // Process through glottis
                const glottalOutput = wasmExports.process_glottis(this.noiseSource);
                
                // Get noise modulation factor from glottis
                const noiseModulator = wasmExports.get_noise_modulator();
                
                // Process through vocal tract with turbulence noise
                const lambda = 1.0; // Time step factor
                
                // Apply any constrictions before processing the tract
                if (this.constrictions.length > 0) {
                    // Process each constriction to add turbulence noise
                    for (const constriction of this.constrictions) {
                        // If fricative value > 0, add turbulence noise
                        if (constriction.fricative > 0) {
                            // For stop consonants in burst phase, add extra noise
                            const burstMultiplier = 
                                (this.isStop && this.stopPhase === 'burst') ? 2.0 : 1.0;
                                
                            wasmExports.add_turbulence_noise(
                                this.noiseSource * constriction.fricative * burstMultiplier,
                                constriction.index,
                                constriction.diameter,
                                noiseModulator
                            );
                        }
                    }
                } else {
                    // If no specific constrictions, add default noise at typical points
                    // At teeth
                    const teethPosition = Math.floor(this.tractSize * 0.8);
                    wasmExports.add_turbulence_noise(
                        this.noiseSource * 0.1,
                        teethPosition,
                        2.0, // Noise level for smaller constrictions 
                        noiseModulator
                    );
                    
                    // At lips
                    const lipsPosition = this.tractSize - 1;
                    wasmExports.add_turbulence_noise(
                        this.noiseSource * 0.1,
                        lipsPosition,
                        2.0, // Noise level for smaller constrictions
                        noiseModulator
                    );
                }
                
                // Process the tract
                const tractOutput = wasmExports.process_tract(
                    glottalOutput, 
                    this.noiseSource, 
                    lambda
                );
                
                // Apply gain to make output more audible
                // For burst phase, apply extra gain
                const burstGain = (this.isStop && this.stopPhase === 'burst') ? 1.5 : 1.0;
                const gainedOutput = tractOutput * 3.0 * burstGain;
                
                // Write output to buffer (both channels)
                leftChannel[i] = gainedOutput;
                if (rightChannel) {
                    rightChannel[i] = gainedOutput;
                }
            }
            
            // Mark the end of the block
            wasmExports.glottis_finish_block();
            wasmExports.tract_finish_block(BUFFER_SIZE / sampleRate);
            
            // Update performance metrics
            this.blockCount++;
            // Calculate time spent (in seconds)
            const timeSpent = currentTime - this.processingStartTime;
            // Convert to milliseconds for easier reading
            this.processingTimeInFrames += timeSpent * 1000;
            
            // Send performance report periodically
            if (currentTime - this.lastPerformanceReport >= PERFORMANCE_REPORT_INTERVAL_MS / 1000) {
                this.sendPerformanceReport();
                this.lastPerformanceReport = currentTime;
            }
        } catch (error) {
            console.error('Error during audio processing:', error);
            const output = outputs[0];
            output.forEach(channel => {
                for (let i = 0; i < channel.length; i++) {
                    channel[i] = 0;
                }
            });
        }
        
        // Continue processing
        return true;
    }
    
    /**
     * Send performance metrics to the main thread
     */
    sendPerformanceReport() {
        // Only report if we've processed some blocks
        if (this.blockCount === 0) return;
        
        // Calculate average processing time in milliseconds
        const avgProcessingTimeMs = this.processingTimeInFrames / this.blockCount;
        
        // Calculate CPU load percentage (processing time / available time)
        // 128 samples at 44.1kHz gives ~2.9ms of time per buffer
        const timePerBuffer = BUFFER_SIZE / sampleRate * 1000;
        const cpuLoad = (avgProcessingTimeMs / timePerBuffer) * 100;
        
        // Report metrics
        this.port.postMessage({
            type: 'performance-report',
            stats: {
                avgProcessingTimeMs,
                cpuLoad,
                blockCount: this.blockCount
            }
        });
        
        // Reset counters
        this.processingTimeInFrames = 0;
        this.blockCount = 0;
    }
}

// Define parameters for the processor
TractProcessor.parameterDescriptors = [
    { name: 'frequency', defaultValue: 140, minValue: 80, maxValue: 400 },
    { name: 'tenseness', defaultValue: 0.6, minValue: 0.01, maxValue: 0.99 },
    { name: 'voicing', defaultValue: 1, minValue: 0, maxValue: 1 },
    { name: 'velum', defaultValue: 0.01, minValue: 0.01, maxValue: 0.4 }
];

// Register the processor
registerProcessor('tract-processor', TractProcessor);
console.log('TractProcessor registered');