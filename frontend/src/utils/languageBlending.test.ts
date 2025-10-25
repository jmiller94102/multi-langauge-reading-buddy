import { describe, it, expect } from 'vitest';
import { blendSentences, getBlendDescription } from './languageBlending';
import type { Vocabulary, VocabularyWord } from './languageBlending';

describe('languageBlending', () => {
  const mockPrimarySentences = [
    'The dog runs in the park.',
    'The cat sleeps on the mat.',
    'Birds fly in the sky.',
    'Fish swim in the ocean.',
  ];

  const mockSecondarySentences = [
    '개가 공원에서 달립니다.',
    '고양이가 매트에서 잠을 잡니다.',
    '새들이 하늘을 납니다.',
    '물고기가 바다에서 수영합니다.',
  ];

  const mockVocabulary: Vocabulary = {
    nouns: [
      { english: 'dog', translation: '개', definition: 'animal' },
      { english: 'park', translation: '공원', definition: 'outdoor space' },
      { english: 'cat', translation: '고양이', definition: 'animal' },
      { english: 'mat', translation: '매트', definition: 'surface' },
    ],
    verbs: [
      { english: 'runs', translation: '달립니다', definition: 'to run' },
      { english: 'sleeps', translation: '잠을 잡니다', definition: 'to sleep' },
    ],
  };

  describe('blendSentences', () => {
    describe('Level 0: 100% Primary', () => {
      it('returns all primary sentences without blending', () => {
        const result = blendSentences(
          mockPrimarySentences,
          mockSecondarySentences,
          0,
          mockVocabulary
        );

        expect(result.sentences).toHaveLength(mockPrimarySentences.length);
        expect(result.sentences.every(s => s.language === 'primary')).toBe(true);
        expect(result.sentences.every(s => !s.showHints)).toBe(true);
        expect(result.description).toContain('100%');
        expect(result.description).toContain('English');
      });

      it('preserves original sentence text', () => {
        const result = blendSentences(
          mockPrimarySentences,
          mockSecondarySentences,
          0
        );

        result.sentences.forEach((sentence, idx) => {
          expect(sentence.text).toBe(mockPrimarySentences[idx]);
        });
      });
    });

    describe('Level 1: Vocabulary Recognition', () => {
      it('returns primary sentences with inline vocabulary hints', () => {
        const result = blendSentences(
          mockPrimarySentences,
          mockSecondarySentences,
          1,
          mockVocabulary
        );

        expect(result.sentences).toHaveLength(mockPrimarySentences.length);
        expect(result.sentences.every(s => s.language === 'primary')).toBe(true);
        expect(result.sentences.every(s => s.showHints)).toBe(true);
        expect(result.description).toMatch(/vocabulary/i);
      });

      it('replaces nouns and verbs with translations', () => {
        const result = blendSentences(
          mockPrimarySentences,
          mockSecondarySentences,
          1,
          mockVocabulary
        );

        // Check that first sentence contains translation markers
        expect(result.sentences[0].text).toContain('**');
        expect(result.sentences[0].text).toContain('(dog)');
      });
    });

    describe('Level 2: Noun Immersion', () => {
      it('mixes primary and secondary sentences in 2:1 ratio', () => {
        const result = blendSentences(
          mockPrimarySentences,
          mockSecondarySentences,
          2,
          mockVocabulary
        );

        expect(result.sentences).toHaveLength(mockPrimarySentences.length);
        
        const primaryCount = result.sentences.filter(s => s.language === 'primary').length;
        const secondaryCount = result.sentences.filter(s => s.language === 'secondary').length;
        
        // Approximately 2:1 ratio (every 3rd sentence is secondary)
        expect(secondaryCount).toBeGreaterThan(0);
        expect(primaryCount).toBeGreaterThan(secondaryCount);
      });

      it('includes hints for all sentences', () => {
        const result = blendSentences(
          mockPrimarySentences,
          mockSecondarySentences,
          2,
          mockVocabulary
        );

        expect(result.sentences.every(s => s.showHints)).toBe(true);
      });
    });

    describe('Level 3: Balanced Alternation', () => {
      it('alternates between primary and secondary sentences', () => {
        const result = blendSentences(
          mockPrimarySentences,
          mockSecondarySentences,
          3,
          mockVocabulary
        );

        expect(result.sentences).toHaveLength(mockPrimarySentences.length);
        
        const primaryCount = result.sentences.filter(s => s.language === 'primary').length;
        const secondaryCount = result.sentences.filter(s => s.language === 'secondary').length;
        
        // Should be roughly balanced (1:1 ratio)
        expect(Math.abs(primaryCount - secondaryCount)).toBeLessThanOrEqual(1);
      });

      it('provides hover translations for secondary sentences', () => {
        const result = blendSentences(
          mockPrimarySentences,
          mockSecondarySentences,
          3,
          mockVocabulary
        );

        const secondarySentences = result.sentences.filter(s => s.language === 'secondary');
        expect(secondarySentences.every(s => s.hoverTranslation !== undefined)).toBe(true);
      });
    });

    describe('Level 4: 100% Secondary', () => {
      it('returns all secondary sentences', () => {
        const result = blendSentences(
          mockPrimarySentences,
          mockSecondarySentences,
          4,
          mockVocabulary
        );

        expect(result.sentences).toHaveLength(mockSecondarySentences.length);
        expect(result.sentences.every(s => s.language === 'secondary')).toBe(true);
        expect(result.sentences.every(s => !s.showHints)).toBe(true);
        expect(result.description).toContain('100%');
      });

      it('provides hover translations for all sentences', () => {
        const result = blendSentences(
          mockPrimarySentences,
          mockSecondarySentences,
          4,
          mockVocabulary
        );

        expect(result.sentences.every(s => s.hoverTranslation !== undefined)).toBe(true);
      });

      it('falls back to primary if secondary not available', () => {
        const result = blendSentences(
          mockPrimarySentences,
          [],
          4
        );

        expect(result.sentences).toHaveLength(mockPrimarySentences.length);
        expect(result.sentences.every(s => s.language === 'secondary')).toBe(true);
      });
    });

    describe('Edge Cases', () => {
      it('handles level outside valid range (clamps to 0-4)', () => {
        const resultNegative = blendSentences(mockPrimarySentences, mockSecondarySentences, -1);
        expect(resultNegative.sentences.every(s => s.language === 'primary')).toBe(true);

        const resultHigh = blendSentences(mockPrimarySentences, mockSecondarySentences, 10);
        expect(resultHigh.sentences.every(s => s.language === 'secondary')).toBe(true);
      });

      it('handles empty sentence arrays', () => {
        const result = blendSentences([], [], 2);
        expect(result.sentences).toHaveLength(0);
      });

      it('handles missing vocabulary', () => {
        const result = blendSentences(mockPrimarySentences, mockSecondarySentences, 1);
        
        expect(result.sentences).toHaveLength(mockPrimarySentences.length);
        expect(result.sentences.every(s => s.language === 'primary')).toBe(true);
      });

      it('handles undefined sentences in arrays', () => {
        const sentencesWithUndefined = ['Hello', undefined, 'World'] as any[];
        const result = blendSentences(sentencesWithUndefined, mockSecondarySentences, 0);
        
        // Should filter out undefined values
        expect(result.sentences.length).toBeLessThanOrEqual(sentencesWithUndefined.length);
        expect(result.sentences.every(s => s.text.length > 0)).toBe(true);
      });
    });

    describe('Word Replacement', () => {
      it('preserves capitalization in replaced words', () => {
        const sentences = ['Dog runs in the park.'];
        const vocabulary: Vocabulary = {
          nouns: [{ english: 'dog', translation: '개', definition: 'animal' }],
          verbs: [],
        };

        const result = blendSentences(sentences, ['개가 공원에서 달립니다.'], 1, vocabulary);
        
        // Should preserve capital D
        expect(result.sentences[0].text).toContain('개');
      });

      it('handles words that appear multiple times', () => {
        const sentences = ['The dog sees another dog.'];
        const vocabulary: Vocabulary = {
          nouns: [{ english: 'dog', translation: '개', definition: 'animal' }],
          verbs: [],
        };

        const result = blendSentences(sentences, ['개가 다른 개를 봅니다.'], 1, vocabulary);
        
        // Both instances of "dog" should be replaced
        const dogCount = (result.sentences[0].text.match(/dog/gi) || []).length;
        expect(dogCount).toBe(2);
      });
    });
  });

  describe('getBlendDescription', () => {
    it('returns correct description for level 0', () => {
      const description = getBlendDescription(0);
      expect(description).toContain('100%');
      expect(description).toContain('English');
    });

    it('returns correct description for level 1', () => {
      const description = getBlendDescription(1);
      expect(description).toMatch(/vocabulary/i);
    });

    it('returns correct description for level 2', () => {
      const description = getBlendDescription(2);
      expect(description).toMatch(/immersion/i);
    });

    it('returns correct description for level 3', () => {
      const description = getBlendDescription(3);
      expect(description).toMatch(/balanced/i);
    });

    it('returns correct description for level 4', () => {
      const description = getBlendDescription(4);
      expect(description).toContain('100%');
    });

    it('clamps levels outside valid range', () => {
      const descriptionNegative = getBlendDescription(-5);
      expect(descriptionNegative).toContain('100%');
      expect(descriptionNegative).toContain('English');

      const descriptionHigh = getBlendDescription(20);
      expect(descriptionHigh).toContain('100%');
    });
  });
});