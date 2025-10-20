/**
 * Client-Side Language Blending Utility
 *
 * Blends English and secondary language (Korean/Mandarin) sentences based on blend level (0-10)
 * WITHOUT making additional LLM calls - uses pre-generated translations from backend
 */

export interface BlendedSentence {
  text: string;
  language: 'primary' | 'secondary';
  showHints: boolean;
}

export interface BlendResult {
  sentences: BlendedSentence[];
  description: string;
}

/**
 * Blend level descriptions for UI feedback
 */
const BLEND_DESCRIPTIONS: Record<number, string> = {
  0: '100% English - Perfect for beginners',
  1: 'Mostly English with a few hints',
  2: 'English dominant - Some secondary words',
  3: 'Mostly English',
  4: 'English with frequent secondary language',
  5: 'Balanced - Equal mix',
  6: 'Secondary language with English support',
  7: 'Mostly secondary language',
  8: 'Secondary dominant - Some English',
  9: 'Almost all secondary language',
  10: '100% Secondary - Full immersion!',
};

/**
 * Calculate blend ratio based on level (0-10)
 * Returns: { primaryRatio, secondaryRatio } as percentage (0-1)
 */
function getBlendRatio(level: number): { primaryRatio: number; secondaryRatio: number } {
  const normalizedLevel = Math.max(0, Math.min(10, level));
  const secondaryRatio = normalizedLevel / 10; // 0 = 0%, 10 = 100%
  const primaryRatio = 1 - secondaryRatio;
  return { primaryRatio, secondaryRatio };
}

/**
 * Blend two sentence arrays based on level (0-10)
 *
 * @param primarySentences - English sentences
 * @param secondarySentences - Korean/Mandarin sentences (same length as primarySentences)
 * @param blendLevel - 0 (all primary) to 10 (all secondary)
 * @returns Blended sentence array with language tags
 */
export function blendSentences(
  primarySentences: string[],
  secondarySentences: string[],
  blendLevel: number
): BlendResult {
  const level = Math.max(0, Math.min(10, blendLevel));
  const sentences: BlendedSentence[] = [];

  // Type predicate to filter out undefined values
  const isValidString = (text: string | undefined): text is string => {
    return typeof text === 'string' && text.length > 0;
  };

  // Handle edge cases
  if (level === 0) {
    // 100% English
    return {
      sentences: primarySentences.filter(isValidString).map(text => ({
        text,
        language: 'primary' as const,
        showHints: false
      })),
      description: BLEND_DESCRIPTIONS[0] || '100% English - Perfect for beginners'
    };
  }

  if (level === 10) {
    // 100% Secondary
    const sentencesToUse = secondarySentences && secondarySentences.length > 0 ? secondarySentences : primarySentences;
    return {
      sentences: sentencesToUse.filter(isValidString).map(text => ({
        text,
        language: 'secondary' as const,
        showHints: false
      })),
      description: BLEND_DESCRIPTIONS[10] || '100% Secondary - Full immersion!'
    };
  }

  // Calculate ratios
  const { primaryRatio, secondaryRatio } = getBlendRatio(level);
  const totalSentences = primarySentences.length;

  // Determine pattern based on level
  if (level >= 1 && level <= 4) {
    // English dominant - alternate with increasing secondary frequency
    const secondaryFrequency = Math.ceil(1 / secondaryRatio); // How often to insert secondary sentence
    for (let i = 0; i < totalSentences; i++) {
      const primarySentence = primarySentences[i];
      if (!primarySentence) continue; // Skip if undefined

      const secondarySentence = secondarySentences?.[i];
      const useSecondary = secondaryRatio > 0 && i % secondaryFrequency === 0 && !!secondarySentence;
      sentences.push({
        text: useSecondary && secondarySentence ? secondarySentence : primarySentence,
        language: useSecondary ? 'secondary' : 'primary',
        showHints: useSecondary,
      });
    }
  } else if (level === 5) {
    // Balanced 50/50 - alternate every sentence
    for (let i = 0; i < totalSentences; i++) {
      const primarySentence = primarySentences[i];
      if (!primarySentence) continue; // Skip if undefined

      const secondarySentence = secondarySentences?.[i];
      const useSecondary = i % 2 === 1 && !!secondarySentence;
      sentences.push({
        text: useSecondary && secondarySentence ? secondarySentence : primarySentence,
        language: useSecondary ? 'secondary' : 'primary',
        showHints: true,
      });
    }
  } else if (level >= 6 && level <= 9) {
    // Secondary dominant - alternate with increasing primary sparsity
    const primaryFrequency = Math.ceil(1 / primaryRatio); // How often to insert primary sentence
    for (let i = 0; i < totalSentences; i++) {
      const primarySentence = primarySentences[i];
      if (!primarySentence) continue; // Skip if undefined

      const usePrimary = primaryRatio > 0 && i % primaryFrequency === 0;
      const secondarySentence = secondarySentences?.[i];
      const text = usePrimary ? primarySentence : (secondarySentence || primarySentence);
      sentences.push({
        text,
        language: usePrimary ? 'primary' : 'secondary',
        showHints: !usePrimary,
      });
    }
  }

  return {
    sentences,
    description: BLEND_DESCRIPTIONS[level] || `Blend level ${level}`,
  };
}

/**
 * Get description for a blend level
 */
export function getBlendDescription(level: number): string {
  const normalizedLevel = Math.max(0, Math.min(10, level));
  return BLEND_DESCRIPTIONS[normalizedLevel] || `Blend level ${normalizedLevel}`;
}
