/**
 * AI Layer — Scaffold
 * 
 * Abstraction layer for AI-powered text processing.
 * Currently uses local simplifier logic.
 * 
 * TODO: Replace with API calls when backend is ready.
 */

import { simplifyText as localSimplify } from './simplifier';

// Configuration for future API integration
const config = {
  apiUrl: null,    // TODO: Set API endpoint
  apiKey: null,    // TODO: Set API key
  useLocalFallback: true,
};

/**
 * Simplify text using AI or local fallback.
 * @param {string} text 
 * @returns {Promise<string>}
 */
export async function simplifyText(text) {
  // TODO: Replace with API call
  // if (config.apiUrl) {
  //   const response = await fetch(`${config.apiUrl}/simplify`, {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${config.apiKey}` },
  //     body: JSON.stringify({ text }),
  //   });
  //   const data = await response.json();
  //   return data.simplified;
  // }

  return localSimplify(text);
}

/**
 * Summarize text using AI or local fallback.
 * @param {string} text 
 * @returns {Promise<string>}
 */
export async function summarizeText(text) {
  // TODO: Replace with API call
  // if (config.apiUrl) {
  //   const response = await fetch(`${config.apiUrl}/summarize`, { ... });
  //   return data.summary;
  // }

  // Local fallback: return first 2 sentences
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  return sentences.slice(0, 2).join(' ');
}

/**
 * Configure the AI layer.
 */
export function configureAI(options) {
  Object.assign(config, options);
}
