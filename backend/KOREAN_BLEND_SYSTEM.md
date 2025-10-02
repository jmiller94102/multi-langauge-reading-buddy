# Korean Blend System Documentation

## Overview
The Korean Blend System provides progressive language learning through a 7-level sliding scale that blends English (primary) and Korean (secondary) content in real-time.

## Architecture

### Backend: 2 LLM Calls per Story Generation
1. **Call 1**: Generate English story based on user parameters
2. **Call 2**: Translate the English story to Korean
3. **Return**: Both English and Korean versions + metadata

### Frontend: Real-Time Presentation Blending
- No additional LLM calls needed
- Sliding bar (0-6) instantly changes content presentation
- Uses pre-generated English + Korean content from backend

## 7-Level Blending System

### Level 0: Pure English (🇺🇸)
- **Content**: 100% English sentences
- **Hints**: None
- **Example**: "The cat sat on the mat."

### Level 1: English + Korean Noun Hints (🌱)
- **Content**: 100% English sentences
- **Hints**: Korean nouns in parentheses (italic + gold)
- **Example**: "The cat (고양이) sat on the mat (매트)."

### Level 2: English Dominant - 2:1 Ratio (📚)
- **Content**: 2 English sentences + 1 Korean sentence
- **Hints**: Korean hints on English, English hints on Korean
- **Example**:
  - "The cat (고양이) sat happily."
  - "The sun (태양) was shining bright."
  - "매트 (mat) 위에 앉았다."

### Level 3: Balanced - 1:1 Ratio (⚖️)
- **Content**: Alternating English and Korean sentences
- **Hints**: Bidirectional hints on both languages
- **Example**:
  - "The cat (고양이) sat on the mat (매트)."
  - "태양 (sun)이 밝게 빛나고 있었다."

### Level 4: Korean Dominant - 1:2 Ratio (🔄)
- **Content**: 1 English sentence + 2 Korean sentences
- **Hints**: Korean hints on English, English hints on Korean
- **Example**:
  - "The cat (고양이) was very happy."
  - "매트 (mat) 위에 편안하게 앉았다."
  - "태양 (sun)이 따뜻하게 비춰주었다."

### Level 5: Korean + English Noun Hints (🇰🇷)
- **Content**: 100% Korean sentences
- **Hints**: English nouns in parentheses (italic + gold)
- **Example**: "고양이 (cat)가 매트 (mat) 위에 앉았다."

### Level 6: Pure Korean (🇰🇷)
- **Content**: 100% Korean sentences
- **Hints**: None
- **Example**: "고양이가 매트 위에 앉았다."

## Styling Standards

### Primary Language Text
- Normal font weight and style
- Default text color
- Standard font family

### Secondary Language Hints (in parentheses)
- **Color**: `#fbbf24` (gold)
- **Style**: `font-style: italic`
- **Weight**: `font-weight: 400`
- **Font**: `'Noto Sans KR', sans-serif` for Korean
- **Format**: `primary_word (secondary_word)`

### Visual Hierarchy
- **Normal text**: Primary language content, easy to read
- **Italic + Gold**: Secondary language hints, clearly marked as supplementary

## Multi-Language Support
This system is designed to work with any primary ↔ secondary language pair:
- English ↔ Korean (current)
- English ↔ Spanish (future)
- English ↔ French (future)
- etc.

## Implementation Details

### Backend Response Format
```json
{
  "success": true,
  "story": {
    "title": "Story Title",
    "englishContent": "Full English story...",
    "koreanContent": "Full Korean translation...",
    "englishSentences": ["Sentence 1", "Sentence 2", ...],
    "koreanSentences": ["번역 1", "번역 2", ...],
    "nounMappings": {
      "cat": "고양이",
      "mat": "매트"
    },
    "wordCount": 450,
    "gradeLevel": "4th Grade"
  }
}
```

### Frontend Blending Logic
1. Parse both English and Korean sentence arrays
2. Apply level-specific ratios and hint rules
3. Generate real-time HTML with proper styling
4. Update display instantly when slider moves

## Modification Guidelines

### Adding New Levels
1. Define ratio and hint rules in this document
2. Update backend response if needed
3. Add frontend blending logic
4. Update slider labels and descriptions

### Adding New Languages
1. Add language detection patterns
2. Update font family specifications
3. Add noun extraction and mapping logic
4. Test with language-specific characters

### Performance Considerations
- Sentence splitting and mapping done once after story generation
- Real-time blending uses pre-processed data
- No network calls during slider interaction
- Efficient DOM updates for smooth user experience