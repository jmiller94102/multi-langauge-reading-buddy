# Multi-Language Dropdown Feature - Product Requirements Plan (PRP)

## 📋 Executive Summary

**Objective**: Expand the reading app from Korean-only to support multiple secondary languages (Japanese, Mandarin/Simplified Chinese, Italian) with a language selector dropdown and auto-adjusting blend system.

**Current State**: Hardcoded Korean-only implementation
**Target State**: Universal multi-language system with 5 language options

**Effort Estimate**: 8-12 hours
**Difficulty**: MEDIUM (3/5 ⭐)
**Priority**: HIGH - Enables global market expansion

---

## 🎯 Problem Statement

### Current Limitations
- **Hardcoded Korean**: All language logic assumes Korean as secondary language
- **No Language Selection**: Users cannot choose their target language
- **Market Limitation**: Product only viable for English→Korean learners
- **Lost Revenue**: Unable to serve Japanese, Chinese, Italian learners

### User Pain Points
1. Japanese learners cannot use the app (large potential market)
2. Mandarin Chinese learners cannot use the app (massive global demand)
3. Italian learners cannot use the app (European market opportunity)
4. Users must accept Korean regardless of language learning goals

---

## 🔍 Current Architecture Analysis

### Files Audited (2025-10-01)

#### **Frontend - Active Project** (`reading_webapp`)
- ✅ `src/types/settings.ts:15` - Hardcoded `secondaryLanguage: 'Korean'`
- ✅ `src/utils/koreanBlendSystem.ts` - Korean-only blend logic (7 levels)
- ✅ `src/services/LanguageSupportService.ts:44-87` - Korean TTS/phonetics
- ✅ `src/App.tsx` - Main app (too large to fully audit, 34k+ tokens)

#### **Backend - API Server**
- ✅ `backend/server.js:179-239` - Hardcoded Korean translation prompts
- ✅ Azure OpenAI integration - Supports all languages natively

#### **Archived Universal System** (`children_game_ARCHIVED`)
- ✅ `src/services/universalLanguageBlender.ts` - **Complete 4-language implementation**
  - Lines 48-83: Korean translation dictionary
  - Lines 86-121: Spanish translation dictionary
  - Lines 124-159: **Mandarin (Simplified Chinese)** - ALREADY EXISTS! ✅
  - Lines 162-197: Arabic translation dictionary
- ✅ `src/types/language.ts:100-193` - Language configuration types
- ✅ `src/utils/languageHintFormatter.tsx` - Multi-language hint styling

### Key Discovery 🎉
**Mandarin Chinese dictionary already exists in archived version!** We only need to add Japanese and Italian.

---

## ✅ Success Criteria

### Functional Requirements
1. ✅ **Language Dropdown**: User can select from 5 secondary languages
   - English → Korean
   - English → Japanese (Kanji + Hiragana/Katakana)
   - English → Mandarin (Simplified Chinese)
   - English → Italian
   - (Spanish + Arabic already in archived version)

2. ✅ **Auto-Adjusting Blend Bar**: Slider adapts to selected language
   - Level 0: 100% English
   - Levels 1-3: Progressive noun hints in selected language
   - Levels 4-5: Sentence mixing
   - Level 6: 100% selected language

3. ✅ **Backend Language Support**: Translation API accepts `targetLanguage` parameter

4. ✅ **Language-Specific Features**:
   - Japanese: Romanization (Romaji) support
   - Mandarin: Pinyin romanization support
   - Italian: No romanization needed (Latin alphabet)
   - Korean: Existing romanization preserved

### Technical Requirements
1. ✅ **Type Safety**: All language types properly defined
2. ✅ **Translation Dictionaries**: ~150 words per language (nouns, verbs, adjectives)
3. ✅ **Font Support**: CJK fonts for Japanese/Chinese (already have for Korean)
4. ✅ **TTS Integration**: Multi-language text-to-speech
5. ✅ **Backward Compatibility**: Existing Korean content works unchanged

---

## 📐 Technical Implementation Plan

### Phase 1: Infrastructure Migration (2-3 hours)

#### Task 1.1: Migrate Universal Language Blender
**Files to Create/Modify**:
```bash
# Copy from archived version
reading_webapp/src/services/universalLanguageBlender.ts (NEW)
reading_webapp/src/types/language.ts (ENHANCE - add to existing)
reading_webapp/src/utils/languageHintFormatter.tsx (NEW)
```

**Changes**:
- Copy `universalLanguageBlender.ts` from `children_game_ARCHIVED/src/services/`
- Merge language types into existing `reading_webapp/src/types/`
- Add hint formatter for multi-language support

#### Task 1.2: Update Settings Types
**File**: `reading_webapp/src/types/settings.ts`
```typescript
// BEFORE (Line 15):
secondaryLanguage: 'Korean';

// AFTER:
secondaryLanguage: 'Korean' | 'Japanese' | 'Mandarin' | 'Italian' | 'Spanish' | 'Arabic';
```

#### Task 1.3: Create Language Selector Component
**File**: `reading_webapp/src/components/settings/LanguageSelector.tsx` (NEW)
```typescript
interface LanguageSelectorProps {
  currentLanguage: string;
  onChange: (language: string) => void;
  availableLanguages: LanguageOption[];
}

interface LanguageOption {
  code: string; // 'ko', 'ja', 'zh', 'it'
  name: string; // 'Korean', 'Japanese', etc.
  nativeName: string; // '한국어', '日本語', etc.
  flag: string; // Emoji flag
}
```

**UI Design**:
- Dropdown with language flags + names
- Show both English and native names
- Preview of blend levels for each language
- Styled to match existing theme system

---

### Phase 2: Backend Parameterization (1-2 hours)

#### Task 2.1: Parameterize Translation Endpoint
**File**: `backend/server.js`

**Current** (Lines 179-239):
```javascript
// Hardcoded Korean prompts
const koreanPrompt = `Translate to Korean...`;
```

**After**:
```javascript
// Accept targetLanguage parameter
const { targetLanguage = 'ko' } = req.body; // 'ko', 'ja', 'zh', 'it'

const languageNames = {
  'ko': 'Korean (한국어)',
  'ja': 'Japanese (日本語)',
  'zh': 'Mandarin Chinese (中文)',
  'it': 'Italian (Italiano)'
};

const translationPrompt = `Translate to ${languageNames[targetLanguage]}...`;
```

#### Task 2.2: Azure OpenAI Multi-Language Prompts
**Modifications**:
- Add language-specific translation instructions
- Preserve paragraph structure for all languages
- Extract vocabulary mappings per language
- Return JSON format consistent across languages

**Endpoint Signature**:
```javascript
POST /api/generate-story
{
  "passageTheme": "space adventure",
  "targetLanguage": "ja", // NEW PARAMETER
  "passageLength": 500,
  "gradeLevel": "4th Grade",
  // ... other params
}

Response:
{
  "story": {
    "englishContent": "...",
    "secondaryContent": "...", // Translated to targetLanguage
    "nounMappings": { "star": "星" }, // Language-specific mappings
    "targetLanguage": "ja"
  }
}
```

---

### Phase 3: Translation Dictionaries (2-3 hours)

#### Task 3.1: Japanese Dictionary (~150 words)
**File**: `reading_webapp/src/services/universalLanguageBlender.ts`

**Categories to Add**:
```typescript
this.translationDictionaries.set('en-ja', {
  // Family & People (20 words)
  'family': '家族', 'mother': '母', 'father': '父',
  'friend': '友達', 'teacher': '先生', 'student': '学生',
  'child': '子供', 'boy': '男の子', 'girl': '女の子',
  // ... 11 more

  // Animals (15 words)
  'dog': '犬', 'cat': '猫', 'bird': '鳥',
  'fish': '魚', 'rabbit': 'うさぎ', 'bear': '熊',
  // ... 9 more

  // Nature & Places (20 words)
  'tree': '木', 'flower': '花', 'mountain': '山',
  'ocean': '海', 'sky': '空', 'sun': '太陽',
  // ... 14 more

  // Food (15 words)
  'food': '食べ物', 'rice': 'ご飯', 'water': '水',
  // ... 12 more

  // Colors (10 words)
  'red': '赤', 'blue': '青', 'green': '緑',
  // ... 7 more

  // School & Learning (15 words)
  'school': '学校', 'book': '本', 'pencil': '鉛筆',
  // ... 12 more

  // Common Verbs (20 words - base form)
  'run': '走る', 'jump': '跳ぶ', 'play': '遊ぶ',
  // ... 17 more

  // Common Adjectives (15 words)
  'big': '大きい', 'small': '小さい', 'happy': '嬉しい',
  // ... 12 more

  // Time (10 words)
  'morning': '朝', 'night': '夜', 'today': '今日',
  // ... 7 more

  // Additional Educational Words (15 words)
  'story': '物語', 'adventure': '冒険', 'hero': '英雄',
  // ... 12 more
});
```

**Romanization Support** (Romaji):
```typescript
this.romanizationMappings.set('en-ja', {
  '家族': 'kazoku',
  '友達': 'tomodachi',
  '学校': 'gakkou',
  // ... all 150 mappings
});
```

#### Task 3.2: Italian Dictionary (~150 words)
**File**: `reading_webapp/src/services/universalLanguageBlender.ts`

```typescript
this.translationDictionaries.set('en-it', {
  // Family & People
  'family': 'famiglia', 'mother': 'madre', 'father': 'padre',
  'friend': 'amico', 'teacher': 'maestro', 'student': 'studente',
  // ... 144 more across same categories
});
```

**Note**: Italian uses Latin alphabet, no romanization needed

#### Task 3.3: Verify Mandarin Dictionary
**File**: Already exists in archived version! Just copy it.
- Simplified Chinese characters
- Pinyin romanization support
- ~150 words already defined at lines 124-159

---

### Phase 4: Language-Specific Features (2-4 hours)

#### Task 4.1: Japanese Romanization (Romaji)
**Component**: `reading_webapp/src/components/language-support/RomanizationOverlay.tsx`

**Enhancement**:
```typescript
// Add Romaji mapping system
const romajiMappings = {
  'ひらがな': 'hiragana',
  'カタカナ': 'katakana',
  '漢字': 'kanji',
  // ... comprehensive mappings
};

// Display format: 友達 (tomodachi)
```

#### Task 4.2: Mandarin Pinyin Support
**Component**: `reading_webapp/src/components/language-support/RomanizationOverlay.tsx`

**Enhancement**:
```typescript
// Pinyin with tone marks
const pinyinMappings = {
  '你好': 'nǐ hǎo',
  '朋友': 'péngyou',
  '学校': 'xuéxiào',
  // ... comprehensive mappings
};

// Display format: 朋友 (péngyou)
```

#### Task 4.3: Multi-Language TTS
**File**: `reading_webapp/src/services/LanguageSupportService.ts`

**Current** (Line 47):
```typescript
language: language === 'korean' ? 'ko-KR' : 'en-US',
```

**After**:
```typescript
const languageCodes = {
  'Korean': 'ko-KR',
  'Japanese': 'ja-JP',
  'Mandarin': 'zh-CN',
  'Italian': 'it-IT',
  'Spanish': 'es-ES',
  'Arabic': 'ar-SA'
};

language: languageCodes[language] || 'en-US',
```

#### Task 4.4: Font Support Verification
**Check**: `reading_webapp/src/index.css` or theme files
- ✅ Korean: Already have 'Noto Sans KR'
- ✅ Chinese: Can use 'Noto Sans SC' (Simplified Chinese)
- ❓ Japanese: Need 'Noto Sans JP'
- ✅ Italian: Standard Latin fonts work

**Add Japanese Font**:
```css
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&display=swap');

.japanese-text {
  font-family: 'Noto Sans JP', sans-serif;
}
```

---

### Phase 5: Integration & Testing (1-2 hours)

#### Task 5.1: Wire Language Selector to App State
**File**: `reading_webapp/src/App.tsx`

**State Addition**:
```typescript
const [selectedLanguage, setSelectedLanguage] = useState<string>('Korean');

// Pass to story generation
const handleGenerateStory = async () => {
  const response = await fetch('/api/generate-story', {
    method: 'POST',
    body: JSON.stringify({
      ...settings,
      targetLanguage: languageCodeMap[selectedLanguage], // 'ko', 'ja', 'zh', 'it'
    })
  });
};
```

#### Task 5.2: Update Blend System Display
**Logic**:
```typescript
// Dynamically update blend level descriptions
const blendDescriptions = {
  'Korean': BLEND_LEVELS, // Existing Korean descriptions
  'Japanese': JAPANESE_BLEND_LEVELS,
  'Mandarin': MANDARIN_BLEND_LEVELS,
  'Italian': ITALIAN_BLEND_LEVELS,
};

const currentBlendInfo = blendDescriptions[selectedLanguage][blendLevel];
```

#### Task 5.3: Comprehensive Testing Matrix

| Test Case | Korean | Japanese | Mandarin | Italian | Status |
|-----------|--------|----------|----------|---------|--------|
| **Story Generation** | | | | | |
| - Generate 500-word story | ⬜ | ⬜ | ⬜ | ⬜ | Pending |
| - Translation quality | ⬜ | ⬜ | ⬜ | ⬜ | Pending |
| - Vocabulary extraction | ⬜ | ⬜ | ⬜ | ⬜ | Pending |
| **Blend Levels** | | | | | |
| - Level 0 (100% English) | ⬜ | ⬜ | ⬜ | ⬜ | Pending |
| - Level 1 (Noun hints) | ⬜ | ⬜ | ⬜ | ⬜ | Pending |
| - Level 3 (Mixed sentences) | ⬜ | ⬜ | ⬜ | ⬜ | Pending |
| - Level 6 (100% target) | ⬜ | ⬜ | ⬜ | ⬜ | Pending |
| **Romanization** | | | | | |
| - Display accuracy | ⬜ | ⬜ | ⬜ | N/A | Pending |
| - Toggle on/off | ⬜ | ⬜ | ⬜ | N/A | Pending |
| **TTS Audio** | | | | | |
| - Word pronunciation | ⬜ | ⬜ | ⬜ | ⬜ | Pending |
| - Sentence playback | ⬜ | ⬜ | ⬜ | ⬜ | Pending |
| **UI/UX** | | | | | |
| - Language dropdown | ⬜ | ⬜ | ⬜ | ⬜ | Pending |
| - Font rendering | ⬜ | ⬜ | ⬜ | ⬜ | Pending |
| - Hint styling | ⬜ | ⬜ | ⬜ | ⬜ | Pending |

---

## 📊 Resource Requirements

### Development Time Breakdown
- **Phase 1** (Infrastructure): 2-3 hours
- **Phase 2** (Backend): 1-2 hours
- **Phase 3** (Dictionaries): 2-3 hours
- **Phase 4** (Features): 2-4 hours
- **Phase 5** (Testing): 1-2 hours
- **Total**: 8-14 hours

### External Dependencies
- ✅ Azure OpenAI (already integrated) - Supports all languages
- ❓ Japanese font (Noto Sans JP) - Free from Google Fonts
- ✅ Chinese font (Noto Sans SC) - May already have
- ✅ Backend infrastructure - No changes needed

### Translation Data Sources
- **Japanese**: Use archived Spanish/Korean pattern + educational word lists
- **Italian**: Use archived Spanish pattern (similar Romance language)
- **Mandarin**: Copy from archived `universalLanguageBlender.ts` ✅

---

## 🚨 Risk Assessment & Mitigation

### Technical Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Japanese character rendering issues | Medium | High | Test on multiple browsers, use Noto Sans JP |
| Azure translation quality varies | Medium | Medium | Implement quality validation, fallback dictionaries |
| Font loading performance | Low | Medium | Preload CJK fonts, use font-display: swap |
| Blend system edge cases | Medium | Low | Comprehensive testing matrix, handle missing mappings |

### Business Risks
| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Low market demand for new languages | Low | Medium | Market research before full rollout |
| Increased Azure API costs | High | Low | Monitor usage, implement caching |
| Support complexity | Medium | Medium | Document per-language quirks, user guides |

---

## 📈 Success Metrics

### Functional Metrics (Must Pass)
- ✅ All 5 languages generate stories successfully
- ✅ Blend levels work correctly for each language
- ✅ TTS audio plays for all languages
- ✅ Fonts render correctly on desktop + mobile
- ✅ No TypeScript compilation errors
- ✅ Backend API response time < 3 seconds

### Quality Metrics (Targets)
- ✅ Translation accuracy > 90% (spot check)
- ✅ Vocabulary coverage: 150+ words per language
- ✅ UI loads language selector in < 100ms
- ✅ Zero critical bugs in language switching

### Business Metrics (Goals)
- 📊 User adoption: 20% select non-Korean language
- 📊 Market expansion: 3+ new geographic markets
- 📊 Retention: Multi-language users have 30%+ higher retention

---

## 🎯 Next Steps & Execution

### Immediate Actions (Start Now)
1. ✅ **Create this PRP document** - COMPLETED
2. ⬜ **Update MODULE_TASKS.md** with multi-language tasks
3. ⬜ **Backup current implementation** (git commit + tag)
4. ⬜ **Begin Phase 1**: Migrate `universalLanguageBlender.ts`

### Development Workflow
```bash
# Step 1: Create feature branch
git checkout -b feature/multi-language-dropdown

# Step 2: Phase 1 - Infrastructure
cp children_game_ARCHIVED/src/services/universalLanguageBlender.ts \
   reading_webapp/src/services/

# Step 3: Phase 2 - Backend
# Modify backend/server.js translation endpoint

# Step 4: Phase 3 - Dictionaries
# Add Japanese + Italian to universalLanguageBlender.ts

# Step 5: Phase 4 - Language Features
# Update TTS, romanization, fonts

# Step 6: Phase 5 - Integration
# Wire to App.tsx, test all languages

# Step 7: Commit & Deploy
git add .
git commit -m "feat: Add multi-language dropdown (Japanese, Mandarin, Italian)"
git push origin feature/multi-language-dropdown
```

---

## 📚 Reference Documentation

### Key Files Inventory
**Frontend (reading_webapp)**:
- `src/types/settings.ts:15` - Language type definition
- `src/utils/koreanBlendSystem.ts` - Current blend logic
- `src/services/LanguageSupportService.ts` - TTS/phonetics API calls
- `src/App.tsx` - Main application state

**Backend**:
- `server.js:179-239` - Translation endpoint

**Archived (for reference)**:
- `children_game_ARCHIVED/src/services/universalLanguageBlender.ts` - Multi-language implementation
- `children_game_ARCHIVED/src/types/language.ts` - Language configuration types

### Related PRPs
- `language-support-features-prp.md` - Audio/TTS implementation
- `language-support-implementation-children-game.md` - Language features

### External Resources
- Azure OpenAI Translation Docs: https://learn.microsoft.com/en-us/azure/ai-services/openai/
- Noto Fonts (CJK): https://fonts.google.com/noto/specimen/Noto+Sans+JP
- Romaji Reference: https://en.wikipedia.org/wiki/Romanization_of_Japanese
- Pinyin Reference: https://en.wikipedia.org/wiki/Pinyin

---

## ✅ Approval & Sign-off

**PRP Status**: 📝 **DRAFT** - Ready for Review
**Created**: 2025-10-01
**Author**: Claude Code
**Estimated Completion**: 8-12 hours development time

**Approval Required From**:
- [ ] Product Owner - Feature scope approval
- [ ] Tech Lead - Architecture review
- [ ] QA - Testing strategy approval

**Next Review Date**: When context is restored or work begins

---

## 🔄 Context Recovery Instructions

### If Connection Lost - Quick Resume Steps:
1. ✅ **Read this PRP** - Full context in this document
2. ✅ **Check MODULE_TASKS.md** - See completion status
3. ✅ **Review git status** - See what's been committed
4. ⬜ **Resume from last completed phase** - Check task checkboxes above

### Critical Context Pointers:
- **Active Project**: `reading_webapp/` (NOT children_game_ARCHIVED)
- **Mandarin Already Exists**: In archived `universalLanguageBlender.ts:124-159`
- **Only Need**: Japanese + Italian dictionaries (~150 words each)
- **Backend Change**: Add `targetLanguage` parameter to `/api/generate-story`
- **Main Challenge**: Integrating universal blender into active project

### File Map for Quick Navigation:
```
reading_webapp/
├── src/
│   ├── types/settings.ts:15          ← Change secondaryLanguage type here
│   ├── utils/koreanBlendSystem.ts    ← Replace with universal system
│   ├── services/
│   │   ├── universalLanguageBlender.ts  ← Copy from archived (NEW)
│   │   └── LanguageSupportService.ts    ← Update language codes
│   └── components/settings/
│       └── LanguageSelector.tsx          ← Create dropdown (NEW)

backend/
└── server.js:179-239                 ← Parameterize translation
```

**Remember**: Run `/bashes` first to verify which project is active (should be reading_webapp on port 5173)
