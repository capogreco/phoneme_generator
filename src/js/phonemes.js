/**
 * Phoneme configurations for the vocal tract model
 * 
 * Each configuration represents the diameter values for the vocal tract tube,
 * from the glottis (index 0) to the lips (last index).
 * 
 * The configurations are based on the reference implementation and extended
 * to cover additional phonemes based on the International Phonetic Alphabet.
 */

// Basic vowel configurations from the reference implementation
export const basicVowels = {
    // 'a' as in "father"
    'a': {
        ipaSymbol: 'ɑ',
        example: 'father',
        description: 'Open back unrounded vowel',
        // From glottis to lips, diameter values
        diameters: [0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 1.4, 1.4, 1.4, 1.4, 1.4, 1.4, 1.4, 1.4, 1.4, 1.4, 1.4, 1.2, 1.2, 1.2, 1.2, 1.2, 1.2, 1.2, 1.2, 1.2, 1.2, 1.2, 1.2, 1.2, 1.2, 1.2, 1.2, 1.2, 1.2, 1.2, 1.2, 1.2, 1.2, 1.2]
    },
    
    // 'e' as in "bet"
    'e': {
        ipaSymbol: 'ɛ',
        example: 'bet',
        description: 'Open-mid front unrounded vowel',
        diameters: [0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 1.4, 1.4, 1.4, 1.4, 1.4, 1.4, 1.4, 1.4, 1.4, 1.4, 1.0, 0.8, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.8, 1.0, 1.2, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5]
    },
    
    // 'i' as in "meet"
    'i': {
        ipaSymbol: 'i',
        example: 'meet',
        description: 'Close front unrounded vowel',
        diameters: [0.6, 0.6, 0.6, 0.6, 0.6, 0.7, 0.7, 0.7, 0.7, 0.7, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.7, 0.4, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.6, 0.9, 1.2, 1.5, 1.7, 1.8, 1.8, 1.8, 1.8, 1.8, 1.8, 1.8, 1.8, 1.8, 1.8]
    },
    
    // 'o' as in "boat"
    'o': {
        ipaSymbol: 'o',
        example: 'boat',
        description: 'Close-mid back rounded vowel',
        diameters: [0.6, 0.6, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 1.0, 1.1, 1.2, 1.3, 1.4, 1.4, 1.4, 1.4, 1.4, 1.4, 1.0, 0.7, 0.4, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.4, 0.6, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8]
    },
    
    // 'u' as in "boot"
    'u': {
        ipaSymbol: 'u',
        example: 'boot',
        description: 'Close back rounded vowel',
        diameters: [0.6, 0.6, 0.6, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.7, 0.4, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.6, 0.8, 1.0, 1.0, 1.0]
    }
};

// Extended vowel configurations to complete the IPA set
// Based on phonetic descriptions and interpolations from the basic vowels
export const extendedVowels = {
    // 'æ' as in "cat"
    'ae': {
        ipaSymbol: 'æ',
        example: 'cat',
        description: 'Near-open front unrounded vowel',
        // This is between 'a' and 'e', but closer to front
        diameters: [0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 1.4, 1.4, 1.4, 1.4, 1.4, 1.4, 1.4, 1.4, 1.4, 1.4, 1.2, 1.0, 0.8, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.9, 1.1, 1.3, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5]
    },
    
    // 'ʌ' as in "cut" 
    'caret': {
        ipaSymbol: 'ʌ',
        example: 'cut',
        description: 'Open-mid back unrounded vowel',
        // Between 'a' and 'o', but unrounded
        diameters: [0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 1.2, 1.2, 1.3, 1.3, 1.4, 1.4, 1.4, 1.4, 1.4, 1.4, 1.2, 1.0, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.9, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0]
    },
    
    // 'ɪ' as in "bit"
    'small-i': {
        ipaSymbol: 'ɪ',
        example: 'bit',
        description: 'Near-close near-front unrounded vowel',
        // Between 'i' and 'e'
        diameters: [0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 1.2, 1.2, 1.2, 1.2, 1.2, 1.2, 1.2, 1.2, 1.2, 1.2, 0.8, 0.5, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.7, 1.0, 1.3, 1.5, 1.6, 1.7, 1.7, 1.7, 1.7, 1.7, 1.7, 1.7, 1.7, 1.7, 1.7]
    },
    
    // 'ʊ' as in "book"
    'upsilon': {
        ipaSymbol: 'ʊ',
        example: 'book',
        description: 'Near-close near-back rounded vowel',
        // Between 'u' and 'o'
        diameters: [0.6, 0.6, 0.6, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 1.0, 1.0, 1.0, 1.0, 1.1, 1.1, 1.1, 1.1, 1.1, 1.1, 0.8, 0.5, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.5, 0.5, 0.7, 0.9, 0.9, 0.9, 0.9]
    },
    
    // 'ə' as in "about" (schwa)
    'schwa': {
        ipaSymbol: 'ə',
        example: 'about',
        description: 'Mid central vowel',
        // Neutral tract shape
        diameters: [0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0]
    },
    
    // 'ɔ' as in "thought"
    'open-o': {
        ipaSymbol: 'ɔ',
        example: 'thought',
        description: 'Open-mid back rounded vowel',
        // Between 'o' and 'a', but rounded
        diameters: [0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 1.2, 1.2, 1.3, 1.3, 1.4, 1.4, 1.4, 1.4, 1.4, 1.4, 1.1, 0.8, 0.5, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.5, 0.6, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7]
    },
    
    // 'y' as in French "tu"
    'y': {
        ipaSymbol: 'y',
        example: 'French: tu',
        description: 'Close front rounded vowel',
        // Like 'i' but with rounded lips (combine 'i' front with 'u' lip rounding)
        diameters: [0.6, 0.6, 0.6, 0.6, 0.6, 0.7, 0.7, 0.7, 0.7, 0.7, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.7, 0.4, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.4, 0.5, 0.6, 0.6, 0.6]
    },
    
    // 'ø' as in French "deux"
    'oe': {
        ipaSymbol: 'ø',
        example: 'French: deux',
        description: 'Close-mid front rounded vowel',
        // Like 'e' but with rounded lips (combine 'e' front with 'o' lip rounding)
        diameters: [0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 1.4, 1.4, 1.4, 1.4, 1.4, 1.4, 1.4, 1.4, 1.4, 1.4, 1.0, 0.8, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.4, 0.4, 0.4, 0.4, 0.4]
    },
    
    // 'ɯ' as in Japanese "u"
    'barred-u': {
        ipaSymbol: 'ɯ',
        example: 'Japanese: u',
        description: 'Close back unrounded vowel',
        // Like 'u' but unrounded
        diameters: [0.6, 0.6, 0.6, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.7, 0.4, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.4, 0.8, 1.2, 1.4, 1.4, 1.4]
    }
};

// Combine basic and extended vowels for easy access
export const allVowels = { ...basicVowels, ...extendedVowels };

/**
 * Helper function to resize a phoneme configuration to match the tract size
 * @param {Array} diameters - The original diameter array
 * @param {number} targetSize - The desired tract size
 * @returns {Array} - Resized diameter array
 */
export function resizePhonemeConfig(diameters, targetSize) {
    if (diameters.length === targetSize) {
        return [...diameters]; // Return a copy to avoid mutations
    }
    
    const resized = new Array(targetSize);
    for (let i = 0; i < targetSize; i++) {
        const normalizedPos = i / (targetSize - 1);
        const sourceIndex = Math.floor(normalizedPos * (diameters.length - 1));
        resized[i] = diameters[sourceIndex];
    }
    
    return resized;
}

/**
 * Utility to get phoneme configuration by name
 * @param {string} name - The phoneme name
 * @param {number} tractSize - The desired tract size
 * @returns {Array|null} - Resized diameter array or null if not found
 */
export function getPhonemeConfig(name, tractSize) {
    const phoneme = allVowels[name];
    if (!phoneme) return null;
    
    return resizePhonemeConfig(phoneme.diameters, tractSize);
}