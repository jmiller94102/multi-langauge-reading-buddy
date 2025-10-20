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
  1: 'Key nouns in secondary language',
  2: 'Nouns + verbs in secondary language',
  3: 'Nouns + verbs + adjectives mixed',
  4: 'Heavy word mixing (nouns/verbs/adj/adv)',
  5: '2 English + 1 secondary sentence pattern',
  6: 'More secondary sentences',
  7: 'Alternating sentences',
  8: 'Mostly secondary sentences',
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
    // FUTURE: Word-level blending (nouns → verbs → adjectives → adverbs)
    // For now: Gradually introduce secondary sentences
    // Level 1: Every 5th sentence, Level 2: Every 4th, Level 3: Every 3rd, Level 4: Every 2nd
    const secondaryFrequency = 6 - level; // 5, 4, 3, 2
    for (let i = 0; i < totalSentences; i++) {
      const primarySentence = primarySentences[i];
      if (!primarySentence) continue;

      const secondarySentence = secondarySentences?.[i];
      const useSecondary = i > 0 && i % secondaryFrequency === 0 && !!secondarySentence;
      sentences.push({
        text: useSecondary && secondarySentence ? secondarySentence : primarySentence,
        language: useSecondary ? 'secondary' : 'primary',
        showHints: useSecondary,
      });
    }
  } else if (level === 5) {
    // 2 English + 1 secondary pattern
    for (let i = 0; i < totalSentences; i++) {
      const primarySentence = primarySentences[i];
      if (!primarySentence) continue;

      const secondarySentence = secondarySentences?.[i];
      const useSecondary = i % 3 === 2 && !!secondarySentence; // Every 3rd sentence is secondary
      sentences.push({
        text: useSecondary && secondarySentence ? secondarySentence : primarySentence,
        language: useSecondary ? 'secondary' : 'primary',
        showHints: useSecondary,
      });
    }
  } else if (level === 6) {
    // 1 English + 1 secondary (more secondary sentences)
    for (let i = 0; i < totalSentences; i++) {
      const primarySentence = primarySentences[i];
      if (!primarySentence) continue;

      const secondarySentence = secondarySentences?.[i];
      const useSecondary = i % 2 === 1 && !!secondarySentence;
      sentences.push({
        text: useSecondary && secondarySentence ? secondarySentence : primarySentence,
        language: useSecondary ? 'secondary' : 'primary',
        showHints: useSecondary,
      });
    }
  } else if (level === 7) {
    // Alternating sentences (same as level 6 but more hints)
    for (let i = 0; i < totalSentences; i++) {
      const primarySentence = primarySentences[i];
      if (!primarySentence) continue;

      const secondarySentence = secondarySentences?.[i];
      const useSecondary = i % 2 === 0 && !!secondarySentence; // Start with secondary
      sentences.push({
        text: useSecondary && secondarySentence ? secondarySentence : primarySentence,
        language: useSecondary ? 'secondary' : 'primary',
        showHints: true, // Show hints at this level
      });
    }
  } else if (level === 8) {
    // 1 English + 2 secondary pattern
    for (let i = 0; i < totalSentences; i++) {
      const primarySentence = primarySentences[i];
      if (!primarySentence) continue;

      const secondarySentence = secondarySentences?.[i];
      const usePrimary = i % 3 === 0; // Every 3rd sentence is primary
      const text = usePrimary ? primarySentence : (secondarySentence || primarySentence);
      sentences.push({
        text,
        language: usePrimary ? 'primary' : 'secondary',
        showHints: !usePrimary,
      });
    }
  } else if (level === 9) {
    // Mostly secondary (1 primary per 4 sentences)
    for (let i = 0; i < totalSentences; i++) {
      const primarySentence = primarySentences[i];
      if (!primarySentence) continue;

      const secondarySentence = secondarySentences?.[i];
      const usePrimary = i % 4 === 0; // Every 4th sentence is primary
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
