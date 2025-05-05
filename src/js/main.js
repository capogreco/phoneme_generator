/**
 * Main application for the Phoneme Generator
 * This module handles audio initialization, UI setup, and WASM loading
 */

import { allVowels, basicConsonants, getPhonemeConfig } from './phonemes.js';
import { PhonemeGenerator } from './phoneme-generator.js';

class PhonemeApp {
    constructor() {
        // Core state
        this.audioContext = null;
        this.phonemeGenerator = null;
        this.isReady = false;
        
        // UI Elements
        this.statusMessage = document.getElementById('statusMessage');
        this.startButton = document.getElementById('startButton');
        this.stopButton = document.getElementById('stopButton');
        this.tractCanvas = document.getElementById('tractCanvas');
        this.tractCtx = this.tractCanvas?.getContext('2d');
        this.extendedVowelsContainer = document.getElementById('extendedVowels');
        
        // Control elements
        this.frequencySlider = document.getElementById('frequencySlider');
        this.tensenessSlider = document.getElementById('tensenessSlider');
        this.voicingToggle = document.getElementById('voicingToggle');
        this.velumSlider = document.getElementById('velumSlider');
        
        // Info elements
        this.sampleRateDisplay = document.getElementById('sampleRate');
        this.cpuLoadDisplay = document.getElementById('cpuLoad');
        this.processingTimeDisplay = document.getElementById('processingTime');
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Create extended vowel buttons
        this.createExtendedVowelButtons();
        
        // Initialize UI values
        this.initializeUIValues();
        
        console.log('PhonemeApp initialized');
    }
    
    /**
     * Set up all UI event listeners
     */
    setupEventListeners() {
        // Start/stop buttons
        this.startButton?.addEventListener('click', () => this.start());
        this.stopButton?.addEventListener('click', () => this.stop());
        
        // Basic vowel buttons
        document.querySelectorAll('.vowel-button[data-vowel]').forEach(button => {
            button.addEventListener('click', (e) => {
                const vowel = e.target.dataset.vowel;
                this.selectVowel(vowel);
            });
        });
        
        // Consonant buttons
        document.querySelectorAll('.phoneme-button[data-phoneme]').forEach(button => {
            button.addEventListener('click', (e) => {
                const phoneme = e.target.dataset.phoneme;
                this.selectPhoneme(phoneme);
            });
        });
        
        // Control sliders
        if (this.frequencySlider) {
            this.frequencySlider.addEventListener('input', () => {
                const value = parseFloat(this.frequencySlider.value);
                document.getElementById('frequencyValue').textContent = value;
                this.phonemeGenerator?.setFrequency(value);
            });
        }
        
        if (this.tensenessSlider) {
            this.tensenessSlider.addEventListener('input', () => {
                const value = parseFloat(this.tensenessSlider.value);
                document.getElementById('tensenessValue').textContent = value;
                this.phonemeGenerator?.setTenseness(value);
            });
        }
        
        if (this.voicingToggle) {
            this.voicingToggle.addEventListener('change', () => {
                this.phonemeGenerator?.setVoiced(this.voicingToggle.checked);
            });
        }
        
        if (this.velumSlider) {
            this.velumSlider.addEventListener('input', () => {
                const value = parseFloat(this.velumSlider.value);
                document.getElementById('velumValue').textContent = value;
                this.phonemeGenerator?.setVelum(value);
            });
        }
    }
    
    /**
     * Create buttons for extended vowels
     */
    createExtendedVowelButtons() {
        if (!this.extendedVowelsContainer) return;
        
        // Get keys for extended vowels (all vowels except basic ones)
        const extendedVowelKeys = Object.keys(allVowels).filter(key => 
            !['a', 'e', 'i', 'o', 'u'].includes(key)
        );
        
        // Create buttons
        extendedVowelKeys.forEach(key => {
            const vowel = allVowels[key];
            const button = document.createElement('button');
            button.className = 'vowel-button extended';
            button.dataset.vowel = key;
            button.title = `${vowel.description} (${vowel.example})`;
            button.textContent = `${vowel.ipaSymbol} (${vowel.example})`;
            
            button.addEventListener('click', () => this.selectVowel(key));
            this.extendedVowelsContainer.appendChild(button);
        });
    }
    
    /**
     * Start audio processing
     */
    async start() {
        try {
            this.updateStatus('Initializing audio...');
            
            // Create AudioContext if it doesn't exist
            if (!this.audioContext) {
                this.audioContext = new AudioContext();
                this.sampleRateDisplay.textContent = this.audioContext.sampleRate;
                
                // Load the AudioWorklet processor
                this.updateStatus('Loading AudioWorklet...');
                await this.audioContext.audioWorklet.addModule('js/worklet-processor.js');
                
                // Create the phoneme generator instance
                this.phonemeGenerator = new PhonemeGenerator(this.audioContext);
                
                // Set up message handling for performance stats
                this.phonemeGenerator.onStatus = (status) => {
                    if (status.type === 'ready') {
                        this.isReady = true;
                        this.updateStatus('Ready');
                    } else if (status.type === 'performance') {
                        this.cpuLoadDisplay.textContent = status.cpuLoad.toFixed(1) + '%';
                        this.processingTimeDisplay.textContent = status.processingTime.toFixed(2) + 'ms';
                    } else if (status.type === 'error') {
                        this.updateStatus('Error: ' + status.message, true);
                    }
                };
                
                // Initialize and connect
                await this.phonemeGenerator.initialize();
                
                // Set a default phoneme and update the visualization
                const defaultPhoneme = 'a';
                const diameters = this.phonemeGenerator.setPhoneme(defaultPhoneme);
                if (diameters) {
                    this.drawTractShape(diameters);
                    
                    // Highlight the default vowel button
                    document.querySelectorAll('.vowel-button').forEach(button => {
                        if (button.dataset.vowel === defaultPhoneme) {
                            button.classList.add('selected');
                        } else {
                            button.classList.remove('selected');
                        }
                    });
                }
            } else if (this.audioContext.state === 'suspended') {
                await this.audioContext.resume();
            }
            
            // Update UI
            this.startButton.disabled = true;
            this.stopButton.disabled = false;
            
        } catch (error) {
            console.error('Error starting audio:', error);
            this.updateStatus('Error: ' + error.message, true);
        }
    }
    
    /**
     * Stop audio processing
     */
    stop() {
        if (this.audioContext) {
            this.audioContext.suspend();
            this.updateStatus('Audio stopped');
            
            // Update UI
            this.startButton.disabled = false;
            this.stopButton.disabled = true;
        }
    }
    
    /**
     * Select a vowel by name
     * @param {string} vowelName - Name of the vowel to select
     */
    selectVowel(vowelName) {
        if (!this.isReady || !this.phonemeGenerator) {
            this.updateStatus('Not ready. Click Start Audio first.');
            return;
        }
        
        const vowel = allVowels[vowelName];
        if (!vowel) {
            console.error(`Vowel ${vowelName} not found`);
            return;
        }
        
        // Set the tract shape for this vowel
        const diameters = this.phonemeGenerator.setPhoneme(vowelName);
        
        // Draw the tract shape
        if (diameters) {
            this.drawTractShape(diameters);
        }
        
        // Update UI to highlight the selected vowel and clear any selected consonants
        document.querySelectorAll('.vowel-button, .phoneme-button').forEach(button => {
            button.classList.remove('selected');
        });
        
        document.querySelectorAll('.vowel-button').forEach(button => {
            if (button.dataset.vowel === vowelName) {
                button.classList.add('selected');
            }
        });
        
        // Update status
        this.updateStatus(`Selected vowel: ${vowel.ipaSymbol} (${vowel.example})`);
    }
    
    /**
     * Select a consonant phoneme by name
     * @param {string} phonemeName - Name of the consonant to select
     */
    selectPhoneme(phonemeName) {
        if (!this.isReady || !this.phonemeGenerator) {
            this.updateStatus('Not ready. Click Start Audio first.');
            return;
        }
        
        // Get phoneme from allPhonemes (imported from phonemes.js)
        const phoneme = basicConsonants[phonemeName];
        if (!phoneme) {
            console.error(`Phoneme ${phonemeName} not found`);
            return;
        }
        
        // Set the tract shape for this phoneme
        const diameters = this.phonemeGenerator.setPhoneme(phonemeName);
        
        // Draw the tract shape
        if (diameters) {
            this.drawTractShape(diameters);
        }
        
        // Update UI to highlight the selected consonant and clear any selected vowels
        document.querySelectorAll('.vowel-button, .phoneme-button').forEach(button => {
            button.classList.remove('selected');
        });
        
        document.querySelectorAll('.phoneme-button').forEach(button => {
            if (button.dataset.phoneme === phonemeName) {
                button.classList.add('selected');
            }
        });
        
        // Update status
        this.updateStatus(`Selected consonant: ${phoneme.ipaSymbol} (${phoneme.example})`);
    }
    
    /**
     * Draw the vocal tract shape on the canvas
     * @param {Array<number>} diameters - Array of tract diameters
     */
    drawTractShape(diameters) {
        if (!this.tractCanvas || !this.tractCtx) return;
        
        // Get canvas dimensions
        const width = this.tractCanvas.width;
        const height = this.tractCanvas.height;
        
        // Clear canvas
        this.tractCtx.fillStyle = '#1a1a1a';
        this.tractCtx.fillRect(0, 0, width, height);
        
        // Draw centerline
        this.tractCtx.beginPath();
        this.tractCtx.moveTo(0, height / 2);
        this.tractCtx.lineTo(width, height / 2);
        this.tractCtx.strokeStyle = '#444444';
        this.tractCtx.stroke();
        
        // Calculate segment width based on number of diameters
        const segmentWidth = width / diameters.length;
        
        // Draw the tract shape
        this.tractCtx.beginPath();
        
        // Draw top half
        for (let i = 0; i < diameters.length; i++) {
            const x = i * segmentWidth;
            const diameter = diameters[i] || 0;
            const halfSize = (diameter / 3.0) * (height / 2); // Scale diameter
            
            if (i === 0) {
                this.tractCtx.moveTo(x, height / 2 - halfSize);
            } else {
                this.tractCtx.lineTo(x, height / 2 - halfSize);
            }
        }
        
        // Draw bottom half (mirror of top)
        for (let i = diameters.length - 1; i >= 0; i--) {
            const x = i * segmentWidth;
            const diameter = diameters[i] || 0;
            const halfSize = (diameter / 3.0) * (height / 2);
            this.tractCtx.lineTo(x, height / 2 + halfSize);
        }
        
        // Close the path and fill/stroke
        this.tractCtx.closePath();
        this.tractCtx.fillStyle = 'rgba(66, 133, 244, 0.5)'; // Transparent blue
        this.tractCtx.fill();
        this.tractCtx.strokeStyle = '#4285f4'; // Solid blue outline
        this.tractCtx.stroke();
        
        // Add labels for important parts of the tract
        this.tractCtx.fillStyle = '#ffffff';
        this.tractCtx.font = '12px Arial';
        this.tractCtx.fillText('Glottis', 5, 20);
        this.tractCtx.fillText('Pharynx', width * 0.2, 20);
        this.tractCtx.fillText('Palate', width * 0.5, 20);
        this.tractCtx.fillText('Lips', width * 0.9, 20);
    }

    /**
     * Initialize UI values to match slider default values
     */
    initializeUIValues() {
        // Update displayed values for all sliders
        if (this.frequencySlider) {
            const frequencyValue = document.getElementById('frequencyValue');
            if (frequencyValue) {
                frequencyValue.textContent = this.frequencySlider.value;
            }
        }
        
        if (this.tensenessSlider) {
            const tensenessValue = document.getElementById('tensenessValue');
            if (tensenessValue) {
                tensenessValue.textContent = this.tensenessSlider.value;
            }
        }
        
        if (this.velumSlider) {
            const velumValue = document.getElementById('velumValue');
            if (velumValue) {
                velumValue.textContent = this.velumSlider.value;
            }
        }
    }

    /**
     * Update status message
     * @param {string} message - Status message to display
     * @param {boolean} isError - Whether this is an error message
     */
    updateStatus(message, isError = false) {
        console.log('Status:', message);
        if (this.statusMessage) {
            this.statusMessage.textContent = message;
            
            // Apply error styling if it's an error
            if (isError) {
                this.statusMessage.classList.add('error');
            } else {
                this.statusMessage.classList.remove('error');
            }
        }
    }
}

// Initialize the application when the DOM is ready
window.addEventListener('DOMContentLoaded', () => {
    window.phonemeApp = new PhonemeApp();
});