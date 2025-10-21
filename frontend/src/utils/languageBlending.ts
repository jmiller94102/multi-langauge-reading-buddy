/**
 * Client-Side Language Blending Utility
 *
 * Blends English and secondary language (Korean/Mandarin) based on 5-level system (0-4)
 * WITHOUT making additional LLM calls - uses pre-generated translations from backend
 *
 * Architecture:
 * - Level 0: 100% English
 * - Level 1: Vocabulary recognition (inline translations for nouns + verbs)
 * - Level 2: Noun immersion + sentence mixing (2:1 ratio)
 * - Level 3: Balanced alternation (1:1 ratio)
 * - Level 4: 100% Secondary language
 */

export interface VocabularyWord {
  english?: string; // For translated vocabulary from LLM-2
  word?: string; // For extracted vocabulary from LLM-1
  translation: string;
  definition: string;
  frequency?: number;
}

export interface Vocabulary {
  nouns: VocabularyWord[];
  verbs: VocabularyWord[];
  adjectives?: VocabularyWord[];
  adverbs?: VocabularyWord[];
}

export interface BlendedSentence {
  text: string;
  language: 'primary' | 'secondary';
  showHints: boolean;
  hoverTranslation?: string; // For hover tooltip
}

export interface BlendResult {
  sentences: BlendedSentence[];
  description: string;
}

/**
 * Blend level descriptions for UI feedback (5-level system)
 */
const BLEND_DESCRIPTIONS: Record<number, string> = {
  0: '100% English - Perfect for beginners',
  1: 'Vocabulary recognition - Learn nouns and verbs with inline hints',
  2: 'Noun immersion - Some Korean words, some Korean sentences (2:1)',
  3: 'Balanced mix - Alternating sentences with noun hints (1:1)',
  4: '100% Korean - Full immersion!',
};

/**
 * Replace words in a sentence with their translations
 * Format: **translation (english)** for inline hints
 */
function replaceWords(
  sentence: string,
  words: VocabularyWord[]
): string {
  let result = sentence;

  // Filter out words without english or word field
  const validWords = words.filter(w => (w.english || w.word));

  // Sort by word length (longest first) to avoid partial matches
  const sortedWords = [...validWords].sort((a, b) => {
    const aLen = (a.english || a.word || '').length;
    const bLen = (b.english || b.word || '').length;
    return bLen - aLen;
  });

  for (const word of sortedWords) {
    const englishWord = word.english || word.word;
    const translation = word.translation;
    if (!englishWord || !translation) {
      continue;
    }

    // Case-insensitive word boundary matching
    const regex = new RegExp(`\\b${englishWord}\\b`, 'gi');

    result = result.replace(regex, (match) => {
      // Preserve original case for first letter
      const firstChar = match.charAt(0);
      const isCapitalized = firstChar === firstChar.toUpperCase();
      const formattedTranslation = isCapitalized && translation.length > 0
        ? translation.charAt(0).toUpperCase() + translation.slice(1)
        : translation;

      return `**${formattedTranslation} (${match})**`;
    });
  }

  return result;
}

/**
 * Blend two sentence arrays based on 5-level system (0-4)
 *
 * @param primarySentences - English sentences
 * @param secondarySentences - Korean/Mandarin sentences (same length as primarySentences)
 * @param blendLevel - 0 (all primary) to 4 (all secondary)
 * @param vocabulary - Vocabulary words by part of speech
 * @returns Blended sentence array with language tags and hover translations
 */
export function blendSentences(
  primarySentences: string[],
  secondarySentences: string[],
  blendLevel: number,
  vocabulary?: Vocabulary
): BlendResult {
  const level = Math.max(0, Math.min(4, blendLevel));
  const sentences: BlendedSentence[] = [];

  // Type predicate to filter out undefined values
  const isValidString = (text: string | undefined): text is string => {
    return typeof text === 'string' && text.length > 0;
  };

  // LEVEL 0: 100% English - No blending
  if (level === 0) {
    return {
      sentences: primarySentences.filter(isValidString).map(text => ({
        text,
        language: 'primary' as const,
        showHints: false
      })),
      description: BLEND_DESCRIPTIONS[0] || '100% English'
    };
  }

  // LEVEL 4: 100% Secondary - Full immersion
  if (level === 4) {
    const sentencesToUse = secondarySentences && secondarySentences.length > 0
      ? secondarySentences
      : primarySentences;

    return {
      sentences: sentencesToUse.filter(isValidString).map((text, idx) => ({
        text,
        language: 'secondary' as const,
        showHints: false,
        hoverTranslation: primarySentences[idx] // Hover shows English translation
      })),
      description: BLEND_DESCRIPTIONS[4] || '100% Secondary'
    };
  }

  // Combine nouns and verbs for word replacement
  const wordsToReplace: VocabularyWord[] = [
    ...(vocabulary?.nouns || []),
    ...(vocabulary?.verbs || [])
  ];

  // LEVEL 1: Vocabulary Recognition
  // English sentences with inline translations for nouns + verbs
  if (level === 1) {
    primarySentences.filter(isValidString).forEach((primarySentence) => {
      const blendedText = replaceWords(primarySentence, wordsToReplace);
      sentences.push({
        text: blendedText,
        language: 'primary',
        showHints: true,
      });
    });

    return {
      sentences,
      description: BLEND_DESCRIPTIONS[1] || 'Vocabulary recognition'
    };
  }

  // LEVEL 2: Noun Immersion + Sentence Mixing (2:1 ratio)
  // Pattern: English sentence, English sentence, Korean sentence (with English noun hints)
  if (level === 2) {
    // Level 2 includes both nouns and verbs for more immersion
    const wordsToReplace: VocabularyWord[] = [
      ...(vocabulary?.nouns || []),
      ...(vocabulary?.verbs || [])
    ];
    const nounsOnly = vocabulary?.nouns || [];

    primarySentences.forEach((primarySentence, i) => {
      if (!primarySentence) return;

      const secondarySentence = secondarySentences?.[i];
      const useSecondary = i % 3 === 2 && !!secondarySentence; // Every 3rd sentence

      if (useSecondary && secondarySentence) {
        // Korean sentence with English noun hints
        const blendedSecondary = replaceWords(secondarySentence, nounsOnly);
        sentences.push({
          text: blendedSecondary,
          language: 'secondary',
          showHints: true,
          hoverTranslation: primarySentence
        });
      } else {
        // English sentence with Korean nouns AND verbs (more immersion than Level 1)
        const blendedPrimary = replaceWords(primarySentence, wordsToReplace);
        sentences.push({
          text: blendedPrimary,
          language: 'primary',
          showHints: true,
        });
      }
    });

    return {
      sentences,
      description: BLEND_DESCRIPTIONS[2] || 'Noun immersion'
    };
  }

  // LEVEL 3: Balanced Alternation (1:1 ratio)
  // Pattern: English sentence, Korean sentence (with English noun hints), repeat
  if (level === 3) {
    // Level 3 includes both nouns and verbs (consistent with Level 2)
    const wordsToReplace: VocabularyWord[] = [
      ...(vocabulary?.nouns || []),
      ...(vocabulary?.verbs || [])
    ];
    const nounsOnly = vocabulary?.nouns || [];

    primarySentences.forEach((primarySentence, i) => {
      if (!primarySentence) return;

      const secondarySentence = secondarySentences?.[i];
      const useSecondary = i % 2 === 1 && !!secondarySentence; // Alternate starting with English

      if (useSecondary && secondarySentence) {
        // Korean sentence with English noun hints
        const blendedSecondary = replaceWords(secondarySentence, nounsOnly);
        sentences.push({
          text: blendedSecondary,
          language: 'secondary',
          showHints: true,
          hoverTranslation: primarySentence
        });
      } else {
        // English sentence with Korean nouns AND verbs (consistent immersion)
        const blendedPrimary = replaceWords(primarySentence, wordsToReplace);
        sentences.push({
          text: blendedPrimary,
          language: 'primary',
          showHints: true,
        });
      }
    });

    return {
      sentences,
      description: BLEND_DESCRIPTIONS[3] || 'Balanced mix'
    };
  }

  // Fallback
  return {
    sentences: primarySentences.filter(isValidString).map(text => ({
      text,
      language: 'primary' as const,
      showHints: false
    })),
    description: BLEND_DESCRIPTIONS[0] || '100% English'
  };
}

/**
 * Get description for a blend level (5-level system: 0-4)
 */
export function getBlendDescription(level: number): string {
  const normalizedLevel = Math.max(0, Math.min(4, level));
  return BLEND_DESCRIPTIONS[normalizedLevel] || `Blend level ${normalizedLevel}`;
}
