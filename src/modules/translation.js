/**
 * Translation — Scaffold
 * 
 * Placeholder for multi-language translation.
 * Currently returns original text unchanged.
 * 
 * TODO: Implement with Google Translate API or similar.
 */

const SUPPORTED_LANGUAGES = [
  // Empty for now — populate when implementing
  // { code: 'es', name: 'Spanish' },
  // { code: 'fr', name: 'French' },
  // { code: 'de', name: 'German' },
];

/**
 * Translate text to target language.
 * @param {string} text 
 * @param {string} targetLang - ISO 639-1 code
 * @returns {Promise<string>}
 */
export async function translateText(text, targetLang) {
  // TODO: Replace with API call
  console.log(`[Translation] Placeholder: would translate to ${targetLang}`);
  return text; // Returns original text unchanged
}

/**
 * Get list of supported languages.
 */
export function getSupportedLanguages() {
  return SUPPORTED_LANGUAGES;
}

/**
 * Check if translation is available.
 */
export function isTranslationAvailable() {
  return false; // Not yet implemented
}
