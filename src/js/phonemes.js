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

// Basic consonant configurations
// For consonants, we define the vocal tract shape (diameters) and additional parameters:
// - constrictions: array of {index, diameter, fricative} for specific points of constriction
// - voiced: whether the consonant is voiced (true) or unvoiced (false)
// - timing: parameters to control articulation timing for stops and fricatives
//   - silenceBeforeBurst: milliseconds of silence before the release burst (for stops)
//   - burstDuration: milliseconds for the release burst phase
//   - sustainDuration: milliseconds for the sustained phase after the burst
export const basicConsonants = {
    // 'p' as in "pan" - Bilabial stop (complete closure at the lips)
    'p': {
        ipaSymbol: 'p',
        example: 'pan',
        description: 'Voiceless bilabial stop',
        // Based on schwa with closed lips
        diameters: [0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.1, 0.0],
        constrictions: [
            { index: 43, diameter: 0.0, fricative: 0.0 } // Complete closure at lips
        ],
        voiced: false,
        timing: {
            silenceBeforeBurst: 50, // 50ms of silence before burst
            burstDuration: 20,      // 20ms of burst
            sustainDuration: 200    // 200ms of sustained sound
        },
        isStop: true
    },
    
    // 'b' as in "ban" - Voiced bilabial stop
    'b': {
        ipaSymbol: 'b',
        example: 'ban',
        description: 'Voiced bilabial stop',
        // Same as 'p' but voiced
        diameters: [0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.1, 0.0],
        constrictions: [
            { index: 43, diameter: 0.0, fricative: 0.0 } // Complete closure at lips
        ],
        voiced: true,
        timing: {
            silenceBeforeBurst: 30, // Voiced stops have shorter silence
            burstDuration: 20,
            sustainDuration: 200
        },
        isStop: true
    },
    
    // 't' as in "tan" - Alveolar stop
    't': {
        ipaSymbol: 't',
        example: 'tan',
        description: 'Voiceless alveolar stop',
        // Closure at the alveolar ridge
        diameters: [0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.1, 0.0, 0.0, 0.1, 0.3, 0.5, 0.8, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0],
        constrictions: [
            { index: 26, diameter: 0.0, fricative: 0.0 } // Complete closure at alveolar ridge
        ],
        voiced: false,
        timing: {
            silenceBeforeBurst: 50,
            burstDuration: 15,
            sustainDuration: 200
        },
        isStop: true
    },
    
    // 'd' as in "dan" - Voiced alveolar stop
    'd': {
        ipaSymbol: 'd',
        example: 'dan',
        description: 'Voiced alveolar stop',
        // Same as 't' but voiced
        diameters: [0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.1, 0.0, 0.0, 0.1, 0.3, 0.5, 0.8, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0],
        constrictions: [
            { index: 26, diameter: 0.0, fricative: 0.0 } // Complete closure at alveolar ridge
        ],
        voiced: true,
        timing: {
            silenceBeforeBurst: 30,
            burstDuration: 15,
            sustainDuration: 200
        },
        isStop: true
    },
    
    // 'k' as in "can" - Velar stop
    'k': {
        ipaSymbol: 'k',
        example: 'can',
        description: 'Voiceless velar stop',
        // Closure at the velum (soft palate)
        diameters: [0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 1.0, 1.0, 1.0, 1.0, 0.1, 0.0, 0.0, 0.1, 0.3, 0.6, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0],
        constrictions: [
            { index: 15, diameter: 0.0, fricative: 0.0 } // Complete closure at velum
        ],
        voiced: false,
        timing: {
            silenceBeforeBurst: 50,
            burstDuration: 25,
            sustainDuration: 200
        },
        isStop: true
    },
    
    // 'g' as in "gain" - Voiced velar stop
    'g': {
        ipaSymbol: 'g',
        example: 'gain',
        description: 'Voiced velar stop',
        // Same as 'k' but voiced
        diameters: [0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 1.0, 1.0, 1.0, 1.0, 0.1, 0.0, 0.0, 0.1, 0.3, 0.6, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0],
        constrictions: [
            { index: 15, diameter: 0.0, fricative: 0.0 } // Complete closure at velum
        ],
        voiced: true,
        timing: {
            silenceBeforeBurst: 30,
            burstDuration: 25,
            sustainDuration: 200
        },
        isStop: true
    },
    
    // 'f' as in "fan" - Labiodental fricative
    'f': {
        ipaSymbol: 'f',
        example: 'fan',
        description: 'Voiceless labiodental fricative',
        // Narrow constriction between lower lip and upper teeth
        diameters: [0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.3, 0.2, 0.1],
        constrictions: [
            { index: 42, diameter: 0.1, fricative: 0.8 } // Narrow opening with high turbulence at labiodental area
        ],
        voiced: false
    },
    
    // 'v' as in "van" - Voiced labiodental fricative
    'v': {
        ipaSymbol: 'v',
        example: 'van',
        description: 'Voiced labiodental fricative',
        // Same as 'f' but voiced
        diameters: [0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.3, 0.2, 0.1],
        constrictions: [
            { index: 42, diameter: 0.1, fricative: 0.8 } // Narrow opening with high turbulence at labiodental area
        ],
        voiced: true
    },
    
    // 's' as in "sun" - Alveolar fricative
    's': {
        ipaSymbol: 's',
        example: 'sun',
        description: 'Voiceless alveolar fricative',
        // Narrow constriction at the alveolar ridge
        diameters: [0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.3, 0.2, 0.1, 0.2, 0.3, 0.5, 0.8, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0],
        constrictions: [
            { index: 27, diameter: 0.1, fricative: 1.0 } // Narrow opening with high turbulence at alveolar ridge
        ],
        voiced: false
    },
    
    // 'z' as in "zip" - Voiced alveolar fricative
    'z': {
        ipaSymbol: 'z',
        example: 'zip',
        description: 'Voiced alveolar fricative',
        // Same as 's' but voiced
        diameters: [0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.3, 0.2, 0.1, 0.2, 0.3, 0.5, 0.8, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0],
        constrictions: [
            { index: 27, diameter: 0.1, fricative: 1.0 } // Narrow opening with high turbulence at alveolar ridge
        ],
        voiced: true
    },
    
    // Additional fricatives
    
    // 'ʃ' as in "ship" - Voiceless postalveolar fricative
    'sh': {
        ipaSymbol: 'ʃ',
        example: 'ship',
        description: 'Voiceless postalveolar fricative',
        // Like 's' but with a different tongue position - more retracted
        diameters: [0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.5, 0.3, 0.1, 0.15, 0.2, 0.4, 0.8, 1.1, 1.2, 1.2, 1.2, 1.2, 1.2, 1.2, 1.2, 1.2, 1.2, 1.2, 1.2, 1.2],
        constrictions: [
            { index: 25, diameter: 0.1, fricative: 1.0 } // Constriction at the postalveolar region
        ],
        voiced: false
    },
    
    // 'ʒ' as in "measure" - Voiced postalveolar fricative
    'zh': {
        ipaSymbol: 'ʒ',
        example: 'measure',
        description: 'Voiced postalveolar fricative',
        // Same as 'ʃ' but voiced
        diameters: [0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.5, 0.3, 0.1, 0.15, 0.2, 0.4, 0.8, 1.1, 1.2, 1.2, 1.2, 1.2, 1.2, 1.2, 1.2, 1.2, 1.2, 1.2, 1.2, 1.2],
        constrictions: [
            { index: 25, diameter: 0.1, fricative: 1.0 } // Constriction at the postalveolar region
        ],
        voiced: true
    },
    
    // 'θ' as in "thin" - Voiceless dental fricative
    'th': {
        ipaSymbol: 'θ',
        example: 'thin',
        description: 'Voiceless dental fricative',
        // Tongue tip between teeth
        diameters: [0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0.1, 0.05, 0.1, 0.2, 0.3, 0.5, 0.7, 0.9],
        constrictions: [
            { index: 37, diameter: 0.05, fricative: 0.8 } // Narrow opening between teeth
        ],
        voiced: false
    },
    
    // 'ð' as in "this" - Voiced dental fricative
    'dh': {
        ipaSymbol: 'ð',
        example: 'this',
        description: 'Voiced dental fricative',
        // Same as 'θ' but voiced
        diameters: [0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0.1, 0.05, 0.1, 0.2, 0.3, 0.5, 0.7, 0.9],
        constrictions: [
            { index: 37, diameter: 0.05, fricative: 0.8 } // Narrow opening between teeth
        ],
        voiced: true
    },
    
    // 'h' as in "hat" - Voiceless glottal fricative
    'h': {
        ipaSymbol: 'h',
        example: 'hat',
        description: 'Voiceless glottal fricative',
        // The constriction is at the glottis (beginning of the tract)
        // Otherwise, keep the tract neutral 
        diameters: [0.6, 0.6, 0.6, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0],
        constrictions: [
            { index: 0, diameter: 0.1, fricative: 1.0 } // Constriction at the glottis
        ],
        voiced: false
    },
    
    // Nasal consonants
    
    // 'm' as in "man" - Bilabial nasal
    'm': {
        ipaSymbol: 'm',
        example: 'man',
        description: 'Bilabial nasal',
        // Similar to 'b' but with open velum
        diameters: [0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.1, 0.0],
        constrictions: [
            { index: 43, diameter: 0.0, fricative: 0.0 } // Complete closure at lips
        ],
        voiced: true,
        nasal: true,
        velumOpening: 0.4
    },
    
    // 'n' as in "no" - Alveolar nasal
    'n': {
        ipaSymbol: 'n',
        example: 'no',
        description: 'Alveolar nasal',
        // Similar to 'd' but with open velum
        diameters: [0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.1, 0.0, 0.0, 0.1, 0.3, 0.5, 0.8, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0],
        constrictions: [
            { index: 26, diameter: 0.0, fricative: 0.0 } // Complete closure at alveolar ridge
        ],
        voiced: true,
        nasal: true,
        velumOpening: 0.4
    },
    
    // 'ŋ' as in "sing" - Velar nasal
    'ng': {
        ipaSymbol: 'ŋ',
        example: 'sing',
        description: 'Velar nasal',
        // Similar to 'g' but with open velum
        diameters: [0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 1.0, 1.0, 1.0, 1.0, 0.1, 0.0, 0.0, 0.1, 0.3, 0.6, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0],
        constrictions: [
            { index: 15, diameter: 0.0, fricative: 0.0 } // Complete closure at velum
        ],
        voiced: true,
        nasal: true,
        velumOpening: 0.4
    },
    
    // Approximants and semi-vowels
    
    // 'l' as in "light" - Lateral approximant
    'l': {
        ipaSymbol: 'l',
        example: 'light',
        description: 'Alveolar lateral approximant',
        // Tongue tip at alveolar ridge, but with sides lowered
        diameters: [0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.3, 0.25, 0.2, 0.2, 0.4, 0.8, 1.0, 1.2, 1.2, 1.2, 1.2, 1.2, 1.2, 1.2, 1.2, 1.2, 1.2, 1.2, 1.2],
        constrictions: [
            { index: 26, diameter: 0.2, fricative: 0.0 } // Partial closure at alveolar ridge
        ],
        voiced: true,
        approximant: true
    },
    
    // 'r' as in "red" - Approximant (American English 'r')
    'r': {
        ipaSymbol: 'ɹ',
        example: 'red',
        description: 'Alveolar approximant',
        // Retroflexed tongue position
        diameters: [0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.8, 0.6, 0.4, 0.35, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.4, 0.7, 1.0, 1.1, 1.1, 1.1, 1.1, 1.1, 1.1, 1.1, 1.1, 1.1, 1.1, 1.1, 1.1],
        constrictions: [
            { index: 24, diameter: 0.3, fricative: 0.0 } // Partial constriction for approximant
        ],
        voiced: true,
        approximant: true
    },
    
    // 'w' as in "win" - Labial-velar approximant
    'w': {
        ipaSymbol: 'w',
        example: 'win',
        description: 'Labial-velar approximant',
        // Combined lip rounding and velar constriction, similar to 'u'
        diameters: [0.6, 0.6, 0.6, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.3, 0.3, 0.3, 0.4, 0.5, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.3, 0.2, 0.1, 0.05, 0.05],
        constrictions: [
            { index: 15, diameter: 0.3, fricative: 0.0 }, // Velar constriction
            { index: 43, diameter: 0.05, fricative: 0.0 }  // Lip rounding
        ],
        voiced: true,
        approximant: true
    },
    
    // 'j' as in "yes" - Palatal approximant
    'j': {
        ipaSymbol: 'j',
        example: 'yes',
        description: 'Palatal approximant',
        // Similar to 'i' vowel but more constricted
        diameters: [0.6, 0.6, 0.6, 0.6, 0.6, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0.2, 0.2, 0.3, 0.4, 0.8, 1.0, 1.2, 1.3, 1.3, 1.3, 1.3, 1.3, 1.3, 1.3, 1.4, 1.4, 1.5, 1.6, 1.7, 1.7, 1.7, 1.7, 1.7, 1.7, 1.7, 1.7, 1.7, 1.7],
        constrictions: [
            { index: 15, diameter: 0.2, fricative: 0.0 }  // Constriction at the palate
        ],
        voiced: true,
        approximant: true
    },
    
    // Affricates (combination of stop + fricative)
    
    // 'tʃ' as in "chair" - Voiceless postalveolar affricate
    'ch': {
        ipaSymbol: 'tʃ',
        example: 'chair',
        description: 'Voiceless postalveolar affricate',
        // Similar to 't' followed by 'ʃ'
        diameters: [0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.5, 0.3, 0.1, 0.1, 0.2, 0.4, 0.8, 1.1, 1.2, 1.2, 1.2, 1.2, 1.2, 1.2, 1.2, 1.2, 1.2, 1.2, 1.2, 1.2],
        constrictions: [
            { index: 26, diameter: 0.0, fricative: 0.0 } // Complete closure at alveolar/postalveolar region
        ],
        voiced: false,
        isStop: true,
        timing: {
            silenceBeforeBurst: 30,
            burstDuration: 20,
            sustainDuration: 200
        },
        // After burst, transition to fricative
        afterBurstConstrictions: [
            { index: 26, diameter: 0.1, fricative: 1.0 } // Fricative constriction after burst
        ]
    },
    
    // 'dʒ' as in "job" - Voiced postalveolar affricate
    'j-stop': {
        ipaSymbol: 'dʒ',
        example: 'job',
        description: 'Voiced postalveolar affricate',
        // Similar to 'd' followed by 'ʒ'
        diameters: [0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.5, 0.3, 0.1, 0.1, 0.2, 0.4, 0.8, 1.1, 1.2, 1.2, 1.2, 1.2, 1.2, 1.2, 1.2, 1.2, 1.2, 1.2, 1.2, 1.2],
        constrictions: [
            { index: 26, diameter: 0.0, fricative: 0.0 } // Complete closure at alveolar/postalveolar region
        ],
        voiced: true,
        isStop: true,
        timing: {
            silenceBeforeBurst: 20,
            burstDuration: 20,
            sustainDuration: 200
        },
        // After burst, transition to fricative
        afterBurstConstrictions: [
            { index: 26, diameter: 0.1, fricative: 1.0 } // Fricative constriction after burst
        ]
    }
};

// Combine basic and extended vowels for easy access
export const allVowels = { ...basicVowels, ...extendedVowels };

// Combine all phonemes
export const allPhonemes = { ...allVowels, ...basicConsonants };

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
 * @returns {Object|null} - Phoneme configuration or null if not found
 */
export function getPhonemeConfig(name, tractSize) {
    const phoneme = allPhonemes[name];
    if (!phoneme) return null;
    
    // Create a copy of the phoneme configuration
    const config = {
        diameters: resizePhonemeConfig(phoneme.diameters, tractSize)
    };
    
    // Add consonant-specific properties if they exist
    if (phoneme.constrictions) {
        // Scale the constriction indices to match the target tract size
        config.constrictions = phoneme.constrictions.map(constriction => {
            const scaledIndex = Math.floor((constriction.index / phoneme.diameters.length) * tractSize);
            return {
                index: scaledIndex,
                diameter: constriction.diameter,
                fricative: constriction.fricative
            };
        });
    }
    
    // Add after-burst constrictions for affricates if they exist
    if (phoneme.afterBurstConstrictions) {
        // Scale the constriction indices to match the target tract size
        config.afterBurstConstrictions = phoneme.afterBurstConstrictions.map(constriction => {
            const scaledIndex = Math.floor((constriction.index / phoneme.diameters.length) * tractSize);
            return {
                index: scaledIndex,
                diameter: constriction.diameter,
                fricative: constriction.fricative
            };
        });
    }
    
    // Copy voiced property if it exists
    if (phoneme.voiced !== undefined) {
        config.voiced = phoneme.voiced;
    }
    
    // Copy stop/plosive properties if they exist
    if (phoneme.isStop !== undefined) {
        config.isStop = phoneme.isStop;
    }
    
    // Copy approximant property if it exists
    if (phoneme.approximant !== undefined) {
        config.approximant = phoneme.approximant;
    }
    
    // Copy nasal properties if they exist
    if (phoneme.nasal !== undefined) {
        config.nasal = phoneme.nasal;
    }
    
    if (phoneme.velumOpening !== undefined) {
        config.velumOpening = phoneme.velumOpening;
    }
    
    // Copy timing parameters if they exist
    if (phoneme.timing) {
        config.timing = { ...phoneme.timing };
    }
    
    return config;
}