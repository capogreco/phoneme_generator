/**
 * Main application for the Phoneme Generator
 * This module handles audio initialization, UI setup, and WASM loading
 */

import { allVowels, getPhonemeConfig } from './phonemes.js';
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
                        this.updateStatus('Error: ' + status.message);
                    }
                };
                
                // Initialize and connect
                await this.phonemeGenerator.initialize();
            } else if (this.audioContext.state === 'suspended') {
                await this.audioContext.resume();
            }
            
            // Update UI
            this.startButton.disabled = true;
            this.stopButton.disabled = false;
            
        } catch (error) {
            console.error('Error starting audio:', error);
            this.updateStatus('Error: ' + error.message);
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
        this.phonemeGenerator.setPhoneme(vowelName);
        
        // Update UI to highlight the selected vowel
        document.querySelectorAll('.vowel-button').forEach(button => {
            if (button.dataset.vowel === vowelName) {
                button.classList.add('selected');
            } else {
                button.classList.remove('selected');
            }
        });
        
        // Update status
        this.updateStatus(`Selected vowel: ${vowel.ipaSymbol} (${vowel.example})`);
    }
    
    /**
     * Update status message
     * @param {string} message - Status message to display
     */
    updateStatus(message) {
        console.log('Status:', message);
        if (this.statusMessage) {
            this.statusMessage.textContent = message;
        }
    }
}

// Initialize the application when the DOM is ready
window.addEventListener('DOMContentLoaded', () => {
    window.phonemeApp = new PhonemeApp();
});