/**
 * AudioWorklet Processor for the Vocal Tract model
 * 
 * This processor loads and runs the WebAssembly vocal tract model,
 * handling all the low-level audio processing.
 */

// Constants for performance monitoring
const PERFORMANCE_REPORT_INTERVAL_MS = 1000;
const BUFFER_SIZE = 128; // AudioWorkletNode default buffer size

// Load the wasm-bindgen glue code synchronously
let wasmBindgenInit = null;
try {
    // Note: The path is relative to where the worklet is loaded from
    importScripts('../wasm/vocal_tract.js');
    // The default export from wasm-bindgen is the initialization function
    wasmBindgenInit = self.__wbg_init;
    console.log('WASM glue code loaded successfully');
} catch (error) {
    console.error('Failed to load WASM glue code:', error);
}

class TractProcessor extends AudioWorkletProcessor {
    constructor() {
        super();
        
        // WASM module state
        this.wasmExports = null;
        
        // Tract configuration
        this.tractSize = 44; // Default, will be updated from WASM
        this.tractDiameters = new Array(this.tractSize).fill(1.5);
        
        // Audio generation state
        this.noiseSource = 0;
        
        // Performance monitoring - using AudioWorklet's currentTime
        this.processingStartTime = 0;
        this.processingTimeInFrames = 0;
        this.blockCount = 0;
        this.lastPerformanceReport = currentTime;
        
        // Set up message port for communication with main thread
        this.port.onmessage = this.handleMessage.bind(this);
        
        console.log('TractProcessor initialized');
    }
    
    /**
     * Handle messages from the main thread
     */
    async handleMessage(event) {
        const data = event.data;
        
        if (data.type === 'wasm-module') {
            try {
                // Verify that we have the wasm-bindgen initialization function
                if (!wasmBindgenInit) {
                    throw new Error('WASM glue code not loaded. Cannot initialize WASM module.');
                }
                
                // Initialize WASM module with the compiled module from the main thread
                if (data.wasmModule) {
                    await this.initializeWasmModule(data.wasmModule);
                    
                    // Report success and tract size back to main thread
                    this.port.postMessage({
                        type: 'wasm-init-status',
                        success: true,
                        tractSize: this.tractSize
                    });
                } else {
                    throw new Error('No WASM module provided');
                }
            } catch (error) {
                console.error('Error initializing WASM module in worklet:', error);
                this.port.postMessage({
                    type: 'wasm-init-status',
                    success: false,
                    error: error.message
                });
            }
        } else if (data.type === 'tract-diameters') {
            // Update tract diameters
            if (data.diameters && data.diameters.length === this.tractSize) {
                this.tractDiameters = data.diameters;
                // Apply the diameters to the tract
                this.updateTractShape();
            } else {
                console.error(`Invalid tract diameters. Expected length ${this.tractSize}, got ${data.diameters?.length}`);
            }
        }
    }
    
    /**
     * Initialize WASM module using wasm-bindgen
     */
    async initializeWasmModule(wasmModule) {
        try {
            console.log('Initializing WASM module using wasm-bindgen...');
            
            // Use the init function from wasm-bindgen to handle instantiation
            // This will take care of creating the correct import object
            this.wasmExports = await wasmBindgenInit(wasmModule);
            
            // Verify that we got valid exports
            if (!this.wasmExports || typeof this.wasmExports !== 'object') {
                throw new Error('WASM initialization did not produce valid exports');
            }
            
            // Initialize the tract and glottis
            const sr = sampleRate; // AudioWorkletGlobalScope provides this
            this.wasmExports.init_tract(sr);
            this.wasmExports.init_glottis(sr);
            
            // Get the tract size
            this.tractSize = this.wasmExports.get_tract_size();
            console.log(`Tract size from WASM: ${this.tractSize}`);
            
            // Initialize tract diameters to neutral shape
            this.tractDiameters = new Array(this.tractSize).fill(1.5);
            
            // Apply the neutral shape
            this.updateTractShape();
            
            console.log('WASM module initialized successfully in worklet');
            return true;
        } catch (error) {
            console.error('Failed to initialize WASM module in worklet:', error);
            throw error;
        }
    }
    
    /**
     * Update the tract shape in the WASM module
     */
    updateTractShape() {
        if (!this.wasmExports) return;
        
        // Apply each diameter to the tract
        for (let i = 0; i < this.tractSize; i++) {
            const diameter = this.tractDiameters[i] || 1.5;
            this.wasmExports.set_diameter(i, diameter);
            this.wasmExports.set_rest_diameter(i, diameter);
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
        if (!this.wasmExports) {
            const output = outputs[0];
            output.forEach(channel => {
                for (let i = 0; i < channel.length; i++) {
                    channel[i] = 0;
                }
            });
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
        this.wasmExports.set_frequency(frequency);
        this.wasmExports.set_tenseness(tenseness);
        this.wasmExports.set_voiced(voicing);
        this.wasmExports.set_velum(velum);
        
        // Get the output buffer
        const output = outputs[0];
        const leftChannel = output[0];
        const rightChannel = output.length > 1 ? output[1] : null;
        
        // Process each sample
        for (let i = 0; i < leftChannel.length; i++) {
            // Generate noise source (simple random noise)
            this.noiseSource = Math.random() * 2 - 1;
            
            // Process through glottis
            const glottalOutput = this.wasmExports.process_glottis(this.noiseSource);
            
            // Get noise modulation factor from glottis
            const noiseModulator = this.wasmExports.get_noise_modulator();
            
            // Process through vocal tract with turbulence noise
            const lambda = 1.0; // Time step factor
            const tractOutput = this.wasmExports.process_tract(
                glottalOutput, 
                this.noiseSource, 
                lambda
            );
            
            // Add some turbulence noise at appropriate points
            // (typically at constrictions in the tract)
            let turbulenceNoise = this.noiseSource * 0.1;
            
            // At teeth
            const teethPosition = this.tractSize * 0.8;
            this.wasmExports.add_turbulence_noise(
                turbulenceNoise,
                teethPosition,
                2.0, // Noise level for smaller constrictions
                noiseModulator
            );
            
            // At lips for fricatives
            const lipsPosition = this.tractSize - 1;
            this.wasmExports.add_turbulence_noise(
                turbulenceNoise,
                lipsPosition,
                2.0, // Noise level for smaller constrictions
                noiseModulator
            );
            
            // Write output to buffer (both channels)
            leftChannel[i] = tractOutput;
            if (rightChannel) {
                rightChannel[i] = tractOutput;
            }
        }
        
        // Mark the end of the block
        this.wasmExports.glottis_finish_block();
        this.wasmExports.tract_finish_block(0.0);
        
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
    { name: 'tenseness', defaultValue: 0.6, minValue: 0, maxValue: 1 },
    { name: 'voicing', defaultValue: 1, minValue: 0, maxValue: 1 },
    { name: 'velum', defaultValue: 0.01, minValue: 0.01, maxValue: 0.4 }
];

// Register the processor
registerProcessor('tract-processor', TractProcessor);