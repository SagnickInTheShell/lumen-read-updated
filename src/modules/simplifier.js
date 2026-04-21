/**
 * Simplifier Module
 * 
 * Local text simplification:
 * - Splits sentences >18 words at commas/conjunctions
 * - Replaces ~90 difficult words with simpler alternatives
 * 
 * Structured for drop-in API replacement.
 * TODO: Replace with API call when AI layer is integrated.
 */

const WORD_REPLACEMENTS = {
  // Academic → Everyday
  "comprehend": "understand",
  "utilize": "use",
  "demonstrate": "show",
  "subsequently": "then",
  "facilitate": "help",
  "endeavor": "try",
  "approximately": "about",
  "sufficient": "enough",
  "numerous": "many",
  "commence": "start",
  "terminate": "end",
  "additional": "more",
  "substantial": "large",
  "significantly": "greatly",
  "implement": "put in place",
  "fundamental": "basic",
  "predominantly": "mostly",
  "consequently": "so",
  "acquisition": "getting",
  "methodology": "method",
  "phenomenon": "event",
  "prerequisite": "requirement",
  "compensatory": "make-up",
  "constitute": "make up",
  "modifications": "changes",
  "modification": "change",
  "implications": "effects",
  "cognitive": "mental",
  "phonological": "sound-based",
  "neurological": "brain-related",
  "psychological": "mind-related",
  "specifically": "exactly",
  "extraordinary": "amazing",
  "remarkable": "impressive",
  "approximately": "about",
  "simultaneously": "at the same time",
  "interconnected": "connected",
  "extraneous": "extra",
  "comprehension": "understanding",
  "accessibility": "ease of use",
  "functionality": "features",
  "characterized": "described",
  "predominantly": "mainly",
  "incorporate": "include",
  "establishment": "setup",
  "conventional": "standard",
  "contemporary": "modern",
  "substantial": "big",
  "proportion": "share",
  "implications": "results",
  "perspective": "view",
  "particularly": "especially",
  "environment": "setting",
  "environments": "settings",
  "individuals": "people",
  "individual": "person",
  "organizations": "groups",
  "characteristics": "features",
  "circumstances": "conditions",
  "representations": "forms",
  "consideration": "thought",
  "considerations": "factors",
  "investigation": "study",
  "accumulate": "build up",
  "sophisticated": "advanced",
  "accelerate": "speed up",
  "accommodate": "fit",
  "accomplish": "do",
  "acknowledgment": "thanks",
  "adaptation": "change",
  "alternative": "other choice",
  "anticipate": "expect",
  "appreciation": "thanks",
  "appropriate": "right",
  "competence": "skill",
  "comprehensive": "complete",
  "contemporary": "current",
  "deliberate": "on purpose",
  "distinguish": "tell apart",
  "elaborate": "detailed",
  "emphasize": "stress",
  "equivalent": "equal",
  "essentially": "basically",
  "exclusively": "only",
  "fluctuate": "change",
  "hypothesis": "guess",
  "inevitable": "unavoidable",
  "initiate": "start",
  "mechanism": "process",
  "oscillate": "swing",
  "persistent": "lasting",
  "preliminary": "early",
  "proficiency": "skill",
};

const CONJUNCTIONS = ['and', 'but', 'because', 'however', 'although', 'while', 'which', 'whereas', 'therefore', 'moreover'];
const MAX_WORDS_PER_SENTENCE = 18;

/**
 * Simplify a block of text.
 * @param {string} text - The text to simplify
 * @returns {string} Simplified text
 */
export function simplifyText(text) {
  if (!text || typeof text !== 'string') return text;

  // Step 1: Split into sentences
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];

  // Step 2: Process each sentence
  const simplified = sentences.map(sentence => {
    let processed = sentence.trim();

    // Replace difficult words (whole word match only)
    for (const [difficult, simple] of Object.entries(WORD_REPLACEMENTS)) {
      const regex = new RegExp(`\\b${difficult}\\b`, 'gi');
      processed = processed.replace(regex, (match) => {
        // Preserve capitalization
        if (match[0] === match[0].toUpperCase()) {
          return simple.charAt(0).toUpperCase() + simple.slice(1);
        }
        return simple;
      });
    }

    // Split long sentences
    const words = processed.split(/\s+/);
    if (words.length > MAX_WORDS_PER_SENTENCE) {
      processed = splitLongSentence(processed);
    }

    return processed;
  });

  return simplified.join(' ');
}

/**
 * Split a long sentence at natural break points.
 */
function splitLongSentence(sentence) {
  // Try splitting at conjunctions first
  for (const conj of CONJUNCTIONS) {
    const regex = new RegExp(`\\s*,?\\s*\\b${conj}\\b\\s+`, 'i');
    const parts = sentence.split(regex);

    if (parts.length >= 2 && parts.every(p => p.split(/\s+/).length >= 4)) {
      return parts.map((part, i) => {
        part = part.trim();
        // Capitalize first letter of new sentences
        if (i > 0) {
          part = part.charAt(0).toUpperCase() + part.slice(1);
        }
        // Ensure ends with period
        if (i < parts.length - 1 && !part.match(/[.!?]$/)) {
          part += '.';
        }
        return part;
      }).join(' ');
    }
  }

  // Try splitting at commas
  const commaParts = sentence.split(/,\s*/);
  if (commaParts.length >= 2) {
    const mid = Math.floor(commaParts.length / 2);
    const first = commaParts.slice(0, mid).join(', ').trim();
    const second = commaParts.slice(mid).join(', ').trim();

    if (first.split(/\s+/).length >= 4 && second.split(/\s+/).length >= 4) {
      const firstClean = first.match(/[.!?]$/) ? first : first + '.';
      const secondClean = second.charAt(0).toUpperCase() + second.slice(1);
      return `${firstClean} ${secondClean}`;
    }
  }

  return sentence;
}

/**
 * Simplify an array of sentences.
 * @param {string[]} sentences 
 * @returns {string[]}
 */
export function simplifySentences(sentences) {
  return sentences.map(s => simplifyText(s));
}
