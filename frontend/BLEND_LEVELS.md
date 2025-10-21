# Language Blend Level System (5-Level)

## Overview
Progressive language learning system with 5 levels (0-4) that starts with vocabulary recognition and gradually transitions to full secondary language immersion.

## Architecture
- **2 LLM Calls Only**: English story generation + vocabulary extraction, then translation
- **Client-Side Blending**: Real-time word/sentence replacement without additional API costs
- **Frequency-Based Vocabulary**: Only the top 12 nouns and top 10 verbs are translated for efficiency
- **Grammar Integrity**: Each sentence maintains its native language grammar (English: SVO, Korean: SOV)

## Blend Level Definitions

### Level 0: 100% English (Beginner)
**Description**: Pure English - Perfect for complete beginners

**Implementation**: Display only `primarySentences`, no word replacement

**Example**: "The happy dog ran quickly to the park."

**Learning Focus**: Reading comprehension without language switching

---

### Level 1: Vocabulary Recognition
**Description**: English sentences with inline translations for nouns and verbs

**Implementation**: Replace words from `vocabulary.nouns` and `vocabulary.verbs` with inline hints

**Format**: `**translation (english)**`

**Example**: "The happy **개 (dog)** **달렸다 (ran)** quickly to the **공원 (park)**."

**Learning Focus**: Vocabulary recognition while maintaining reading flow

**UX Pattern**: Inline hints show translation in bold with English in parentheses

---

### Level 2: Noun Immersion + Sentence Mixing (2:1 ratio)
**Description**: Mix of English and Korean sentences with English noun hints in Korean sentences

**Implementation**:
- Pattern: English, English, Korean (with English noun hints), repeat
- English sentences: Replace nouns only with Korean translations
- Korean sentences (every 3rd): Full Korean grammar with 1-2 English nouns as context clues

**Example**:
1. "The happy **개 (dog)** played in the garden." (English with Korean nouns)
2. "It was a sunny day in the **park (공원)**." (English with Korean nouns)
3. "**Dog**가 나무 아래에서 쉬었다." (Korean sentence with English noun hints)

**Learning Focus**: Transition from word-level to sentence-level comprehension, maintaining grammar integrity

**UX Pattern**:
- English sentences show Korean nouns with inline hints
- Korean sentences show English nouns as "training wheels"
- Hover over Korean sentences shows full English translation

---

### Level 3: Balanced Alternation (1:1 ratio)
**Description**: Alternating sentences between English and Korean with noun hints

**Implementation**:
- Pattern: English (with Korean nouns), Korean (with English nouns), repeat
- Same word replacement strategy as Level 2

**Example**:
1. "The **고양이 (cat)** **앉았다 (sat)** on the mat." (English)
2. "**Cat**이 창문을 통해 밖을 보았다." (Korean with English hint)

**Learning Focus**: Equal exposure to both languages, building comprehension in both directions

**UX Pattern**: Hover tooltips on all Korean sentences show English translation

---

### Level 4: 100% Secondary Language (Immersion)
**Description**: Full immersion in secondary language

**Implementation**: Display only `secondarySentences`, no English

**Example**: "행복한 개가 공원으로 빨리 달렸다."

**Learning Focus**: Complete language immersion, native reading patterns

**UX Pattern**: Hover over any sentence shows English translation as safety net

---

## Implementation Notes

### Word Replacement Strategy
1. **Frequency Filtering**: Backend counts word frequency and selects top N most common words:
   - Nouns: top 12
   - Verbs: top 10
2. **Regex Matching**: `\b${word.english}\b` for case-insensitive word boundary matching
3. **Format**: `**translation (english)**` for inline hints
4. **Order**: Nouns first, then verbs

### Sentence Blending Strategy

**Level 2 Pattern** (2:1):
- Sentences 0, 1: English with Korean noun replacements
- Sentence 2: Full Korean with English noun hints
- Repeat for all sentences (`i % 3 === 2` for Korean sentences)

**Level 3 Pattern** (1:1):
- Even indices (0, 2, 4...): English with Korean noun replacements
- Odd indices (1, 3, 5...): Full Korean with English noun hints
- Alternating pattern (`i % 2 === 1` for Korean sentences)

### Hover Tooltip Strategy
- All secondary language sentences (Levels 2-4) include `hoverTranslation` field
- Shows corresponding English sentence from `primarySentences` array
- Format: `💡 {englishTranslation}`
- Cursor changes to `cursor-help` on hover

---

## UX Guidance

### Slider Direction
- **Lower (0)** = More English (easier)
- **Higher (4)** = More Korean/Mandarin (harder)
- User slides LEFT for more help, RIGHT for more challenge

### Hints and Help
- **Level 0**: No hints needed (100% English)
- **Level 1**: Inline translations in every sentence
- **Levels 2-3**: Inline translations + hover tooltips on Korean sentences
- **Level 4**: Hover tooltips only (no inline hints)

---

## Future Modifications

To adjust blend levels, modify:
1. `BLEND_DESCRIPTIONS` in `frontend/src/utils/languageBlending.ts`
2. `blendSentences()` function logic in same file
3. `filterVocabularyByFrequency()` limits in `backend/server.js`
4. This documentation file

---

## Technical Details

### Backend
- **File**: `backend/server.js`
- **LLM-1**: Extracts 10-15 nouns, 8-12 verbs with contextual definitions
- **Frequency Filter**: Counts word occurrences, selects top N by frequency
- **LLM-2**: Translates story + filtered vocabulary matching context
- **Output**: Story with `primarySentences`, `secondarySentences`, and `vocabulary` structure

### Frontend
- **File**: `frontend/src/utils/languageBlending.ts`
- **Function**: `blendSentences(primarySentences, secondarySentences, blendLevel, vocabulary)`
- **Output**: `BlendResult` with array of `BlendedSentence` objects containing text, language, showHints, and hoverTranslation

### Type Definitions
- **File**: `frontend/src/types/story.ts`
- **Interfaces**: `Story`, `Vocabulary`, `VocabularyWord`, `LanguageSettings`

---

## Example Vocabulary Structure

```typescript
vocabulary: {
  nouns: [
    { english: "dog", translation: "개", definition: "a domesticated pet animal", frequency: 5 },
    { english: "park", translation: "공원", definition: "an outdoor recreation area", frequency: 3 }
  ],
  verbs: [
    { english: "ran", translation: "달렸다", definition: "moved quickly on foot", frequency: 2 },
    { english: "played", translation: "놀았다", definition: "engaged in activity for enjoyment", frequency: 4 }
  ]
}
```

---

## Benefits of 5-Level System

- **Cost-Effective**: Only 2 LLM calls per story (vs. 7+ with on-demand translation)
- **Contextual**: Vocabulary definitions match story context
- **Progressive**: Natural learning curve from vocabulary → sentences → immersion
- **Grammatically Correct**: Each sentence respects its language's grammar rules
- **Flexible**: Easy to adjust levels, ratios, or vocabulary limits
- **UX-Friendly**: Hover hints provide safety net at all levels

---

**Version**: 2.0 (5-Level System)
**Last Updated**: 2025-01-XX
**Status**: ✅ Active
