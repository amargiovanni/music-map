// ── Basic profanity filter ──────────────────────────────────────────
// Hardcoded list of common English and Italian profanity words.
// This is intentionally kept small and focused on the most common terms.

const PROFANITY_LIST: string[] = [
  // English
  'fuck',
  'shit',
  'ass',
  'asshole',
  'bitch',
  'bastard',
  'damn',
  'dick',
  'piss',
  'cunt',
  'cock',
  'whore',
  'slut',
  'nigger',
  'nigga',
  'faggot',
  'retard',
  // Italian
  'cazzo',
  'minchia',
  'stronzo',
  'stronza',
  'merda',
  'vaffanculo',
  'fanculo',
  'puttana',
  'troia',
  'coglione',
  'porco dio',
  'madonna',
  'porca',
  'figa',
  'negro',
  'negra',
  'frocio',
  'ricchione',
];

// Build a set of lowercase words for O(1) lookup
const PROFANITY_SET = new Set(PROFANITY_LIST.map((w) => w.toLowerCase()));

// Also build multi-word phrases (like "porco dio") for substring check
const PROFANITY_PHRASES = PROFANITY_LIST.filter((w) => w.includes(' ')).map(
  (w) => w.toLowerCase(),
);

/**
 * Returns true if the given text contains profanity.
 * Checks both individual words and multi-word phrases.
 */
export function containsProfanity(text: string): boolean {
  if (!text) return false;

  const lower = text.toLowerCase();

  // Check multi-word phrases first (substring match)
  for (const phrase of PROFANITY_PHRASES) {
    if (lower.includes(phrase)) {
      return true;
    }
  }

  // Split into words and check each against the set
  // Strip common punctuation from word boundaries
  const words = lower.split(/[\s,.:;!?'"()\-_/\\]+/);
  for (const word of words) {
    if (word && PROFANITY_SET.has(word)) {
      return true;
    }
  }

  return false;
}
