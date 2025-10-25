# PRP: Lingo.dev UI Localization Implementation

## Document Metadata

**PRP ID**: FULLSTACK-006
**Title**: Lingo.dev UI Localization Implementation
**Type**: Fullstack (Frontend-Heavy)
**Priority**: P2 (Post-MVP Enhancement)
**Estimated Effort**: 8-10 days
**Status**: Planning
**Created**: 2024-10-24
**Owner**: Development Team

---

## Executive Summary

This PRP outlines the implementation of **Lingo.dev** for UI/UX localization of the Reading Quest application, enabling the interface to be displayed in multiple languages (Spanish, Korean, Chinese, French, German, Japanese) while **preserving** the existing custom language blending system for educational content.

**Key Goal**: Allow parents, teachers, and children from non-English-speaking backgrounds to navigate the app in their native language, increasing accessibility and global reach.

**Critical Distinction**: This implementation is for **UI localization** (buttons, labels, navigation) NOT for **educational content localization** (stories, quizzes). The existing 5-level language blending system remains unchanged.

---

## Problem Statement

### Current State

1. **UI Language**: 100% English only
   - All buttons, labels, menus, error messages in English
   - Non-English speakers struggle to navigate
   - Limits market expansion to English-speaking countries

2. **Educational Content**: Dual-language with custom blending
   - Stories: English + Korean OR English + Mandarin
   - 5-level blending system (0-4)
   - Works well for language learning
   - **This system remains unchanged**

### Problems

1. **Accessibility Barrier**
   - Spanish-speaking parents cannot help their children use the app
   - Korean parents learning alongside children face double language barrier
   - Limits adoption in international markets

2. **Market Expansion**
   - Cannot enter Spanish-speaking markets (Latin America, Spain)
   - Cannot serve Asian markets (Korea, China, Japan) effectively
   - Cannot expand to European markets (France, Germany)

3. **User Experience**
   - Non-English speakers rely on visual cues only
   - Error messages incomprehensible
   - Settings and preferences difficult to navigate

### Target Audience Impact

**Primary Beneficiaries**:
- **Non-English-speaking parents** (navigation assistance)
- **Multilingual families** (preferred language for different family members)
- **International schools** (teachers from various countries)
- **ESL educators** (using the app as a teaching tool)

---

## Objectives

### Primary Objectives

1. **Implement UI Localization System**
   - Integrate Lingo.dev CLI for translation automation
   - Integrate react-i18next for runtime translation
   - Support 6 initial languages: EN, ES, KO, ZH, FR, DE, JA

2. **Maintain Educational Content System**
   - Preserve existing language blending logic
   - Ensure story generation remains unchanged
   - Keep vocabulary translation system intact

3. **Provide Seamless Language Switching**
   - Add language switcher component
   - Persist user language preference
   - Support real-time language switching without page reload

4. **Automate Translation Workflow**
   - Set up CI/CD integration
   - Implement delta-based translation updates
   - Reduce translation costs by 90% after initial setup

### Secondary Objectives

1. **Developer Experience**
   - Minimize changes to existing codebase
   - Provide clear documentation
   - Create reusable patterns for future features

2. **Performance**
   - Lazy-load translation files
   - Minimize bundle size impact (<100KB per language)
   - Maintain page load time <3 seconds

3. **Quality**
   - Context-aware translations
   - Brand voice consistency
   - Cultural adaptation where appropriate

---

## Scope

### In Scope

#### UI Components
- [ ] Navigation menus (SideNav, BottomNav, Header)
- [ ] Dashboard labels (Level, XP, Coins, Streak)
- [ ] Reading page UI (buttons, settings labels)
- [ ] Library page (filters, sorting, empty states)
- [ ] Achievements page (categories, progress indicators)
- [ ] Shop page (item names, prices, categories)
- [ ] Profile/Settings page (form labels, descriptions)
- [ ] Pet interface (action buttons, stat labels, food names)
- [ ] Common components (Button, Modal, Toast, etc.)
- [ ] Error messages and validation messages
- [ ] Loading states and empty states
- [ ] Form placeholders and helper text
- [ ] Tooltips and hints

#### Infrastructure
- [ ] Lingo.dev CLI setup and configuration
- [ ] react-i18next runtime integration
- [ ] Translation file structure (`src/locales/*.json`)
- [ ] Language switcher component
- [ ] Language preference persistence (localStorage)
- [ ] CI/CD automation for translations

#### Languages (Phase 1)
- [ ] English (en) - Source locale
- [ ] Spanish (es-419) - Latin American Spanish
- [ ] Korean (ko) - Already supported in learning content
- [ ] Simplified Chinese (zh-CN) - Already supported in learning content

#### Languages (Phase 2 - Future)
- [ ] French (fr)
- [ ] German (de)
- [ ] Japanese (ja)

### Out of Scope

#### Educational Content (Handled by Existing System)
- ❌ Story text generation (Azure OpenAI)
- ❌ Language blending logic (5-level system)
- ❌ Vocabulary translations (embedded in stories)
- ❌ Quiz questions (generated by Azure OpenAI)
- ❌ Secondary language selection logic

#### Backend
- ❌ Backend API response localization (not needed for MVP)
- ❌ Database content localization
- ❌ Email notifications (not implemented yet)

#### Advanced Features (Future Phases)
- ❌ Right-to-left (RTL) language support (Arabic, Hebrew)
- ❌ Multi-locale content management system
- ❌ User-contributed translations
- ❌ A/B testing for translation quality

---

## Technical Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Reading Quest Frontend                    │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  UI Localization Layer (NEW)                        │   │
│  │  ┌───────────────────────────────────────────────┐ │   │
│  │  │  react-i18next Runtime                        │ │   │
│  │  │  - useTranslation() hook                      │ │   │
│  │  │  - Dynamic language switching                 │ │   │
│  │  │  - Fallback to English                        │ │   │
│  │  └───────────────────────────────────────────────┘ │   │
│  │  ┌───────────────────────────────────────────────┐ │   │
│  │  │  Translation Files (locales/*.json)           │ │   │
│  │  │  - en.json, es-419.json, ko.json, zh-CN.json │ │   │
│  │  └───────────────────────────────────────────────┘ │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Educational Content Layer (EXISTING - UNCHANGED)   │   │
│  │  ┌───────────────────────────────────────────────┐ │   │
│  │  │  Custom Language Blending                     │ │   │
│  │  │  - languageBlending.ts                        │ │   │
│  │  │  - 5-level blending (0-4)                     │ │   │
│  │  │  - EN + KO OR EN + ZH                         │ │   │
│  │  └───────────────────────────────────────────────┘ │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                               │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│              Lingo.dev Translation Pipeline                  │
├─────────────────────────────────────────────────────────────┤
│  Developer updates en.json → Lingo.dev CLI run →             │
│  LLM translates deltas → Target locales updated              │
│  (es-419.json, ko.json, zh-CN.json, etc.)                   │
└─────────────────────────────────────────────────────────────┘
```

### Component Integration Pattern

**Before** (Hardcoded):
```typescript
export const Header = () => {
  return <h1>Reading Quest</h1>;
};
```

**After** (i18n):
```typescript
import { useTranslation } from 'react-i18next';

export const Header = () => {
  const { t } = useTranslation();
  return <h1>{t('app.title')}</h1>;
};
```

### Translation File Structure

```
frontend/
├── src/
│   ├── locales/
│   │   ├── en.json           # Source locale (English)
│   │   ├── es-419.json       # Spanish (Latin America)
│   │   ├── ko.json           # Korean
│   │   └── zh-CN.json        # Simplified Chinese
│   │
│   ├── i18n.ts               # i18next configuration
│   └── main.tsx              # Initialize i18n
│
├── i18n.json                 # Lingo.dev configuration
└── i18n.lock                 # Translation fingerprints
```

### Language Selection Flow

```
User opens app
    ↓
Check localStorage for 'uiLanguage'
    ↓
If not found → Detect browser language
    ↓
If not supported → Default to English
    ↓
Load translation file (locales/{lang}.json)
    ↓
Render UI in selected language
    ↓
User changes language via switcher
    ↓
Update i18n.language
    ↓
Save to localStorage
    ↓
Re-render UI (instant, no page reload)
```

---

## Implementation Plan

### Phase 0: Preparation (Day 1, 2-4 hours)

**Objective**: Set up development environment

**Tasks**:
1. Create feature branch: `git checkout -b feature/lingo-integration`
2. Install dependencies:
   ```bash
   npm install react-i18next i18next i18next-browser-languagedetector
   ```
3. Initialize Lingo.dev:
   ```bash
   cd frontend
   npx lingo.dev@latest init
   ```
4. Configure API keys in `.env`:
   ```env
   LINGODOTDEV_API_KEY=your-api-key
   ```

**Acceptance Criteria**:
- [ ] Feature branch created
- [ ] Dependencies installed successfully
- [ ] `i18n.json` generated
- [ ] API keys configured

**Risks**: None

---

### Phase 1: Core Infrastructure (Days 1-2, 4-6 hours)

**Objective**: Set up i18next runtime without breaking existing functionality

**Tasks**:

1. **Create i18n configuration** (`src/i18n.ts`):
```typescript
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    debug: import.meta.env.DEV,
    interpolation: {
      escapeValue: false, // React already escapes
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'uiLanguage',
    },
  });

export default i18n;
```

2. **Import in entry point** (`src/main.tsx`):
```typescript
import './i18n'; // Add before App import
```

3. **Create translation directory**:
```bash
mkdir -p src/locales
touch src/locales/en.json
```

4. **Configure Lingo.dev** (`i18n.json`):
```json
{
  "$schema": "https://unpkg.com/lingo.dev@latest/i18n.schema.json",
  "version": "1.0.0",
  "sourceLocale": "en",
  "targetLocales": ["es-419", "ko", "zh-CN"],
  "buckets": {
    "json": {
      "include": ["locales/[locale].json"]
    }
  },
  "provider": {
    "id": "lingodotdev",
    "model": "gpt-4o",
    "prompt": "Translate from {source} to {target}. Context: This is a children's educational app for ages 8-12. Use friendly, encouraging language. Gaming terms like 'XP', 'Level', 'Streak' should use familiar gaming equivalents. Keep brand name 'Reading Quest' unchanged."
  }
}
```

**Acceptance Criteria**:
- [ ] i18n runtime configured
- [ ] App still runs without errors
- [ ] No visual changes (backwards compatible)
- [ ] Console shows i18n initialized

**Testing**:
```bash
npm run dev
# App should load normally
```

**Risks**: Low

---

### Phase 2: String Extraction (Days 2-3, 6-8 hours)

**Objective**: Extract all UI strings into `en.json`

**Process**:

1. **Audit components** for hardcoded strings:
```bash
# Find string literals (manual review needed)
grep -r "\".*\"" src/components/ | grep -v "className" | grep -v "import" > strings_audit.txt
```

2. **Create comprehensive `en.json`** (see appendix for full structure)

**Key sections to extract**:
- Navigation labels
- Dashboard stats and messages
- Reading page settings
- Pet actions and stats
- Achievement descriptions
- Shop items and categories
- Profile/Settings labels
- Common buttons and actions
- Error messages
- Validation messages
- Loading/empty states

**Important exclusions** (DO NOT add to en.json):
- Story text (generated content)
- Quiz questions (generated content)
- Vocabulary translations (part of story data)
- CSS class names
- API endpoints
- Environment variables

**Acceptance Criteria**:
- [ ] Complete `en.json` with all UI strings
- [ ] Hierarchical structure (namespaced keys)
- [ ] No duplicates
- [ ] Consistent naming convention
- [ ] Variable interpolation syntax: `{{variable}}`
- [ ] Pluralization syntax: `_one`, `_other`

**Risks**: Medium (might miss some strings)

---

### Phase 3: Component Refactoring (Days 3-5, 12-16 hours)

**Objective**: Update all components to use `useTranslation` hook

**Strategy**: Incremental, feature-by-feature refactoring

#### 3.1 Common Components (Day 3, 2-3 hours)

**Components to refactor**:
- LoadingSpinner
- Toast
- Modal
- ErrorBoundary
- SessionIndicator

**Example**:
```typescript
// Before: src/components/common/LoadingSpinner.tsx
export const LoadingSpinner = () => {
  return <div className="spinner">Loading...</div>;
};

// After:
import { useTranslation } from 'react-i18next';

export const LoadingSpinner = () => {
  const { t } = useTranslation();
  return <div className="spinner">{t('common.loading')}</div>;
};
```

**Testing**: Manual verification for each component

---

#### 3.2 Navigation Components (Day 3, 2-3 hours)

**Components to refactor**:
- Header
- SideNav
- BottomNav

**Example**:
```typescript
// Before: src/components/layout/SideNav.tsx
const navItems = [
  { label: 'Dashboard', path: '/', icon: Home },
  { label: 'Reading', path: '/reading', icon: Book },
];

// After:
import { useTranslation } from 'react-i18next';

const SideNav = () => {
  const { t } = useTranslation();

  const navItems = [
    { label: t('nav.dashboard'), path: '/', icon: Home },
    { label: t('nav.reading'), path: '/reading', icon: Book },
  ];

  return /* render */;
};
```

---

#### 3.3 Dashboard Components (Day 4, 3-4 hours)

**Components to refactor**:
- WelcomeSection
- StatsGrid
- VirtualPetWidget
- QuestCard
- QuickActions

**Example with variable interpolation**:
```typescript
// Before: src/components/dashboard/WelcomeSection.tsx
export const WelcomeSection = ({ userName }: Props) => {
  return <h2>Welcome back, {userName}!</h2>;
};

// After:
import { useTranslation } from 'react-i18next';

export const WelcomeSection = ({ userName }: Props) => {
  const { t } = useTranslation();
  return <h2>{t('dashboard.welcome', { userName })}</h2>;
};
```

---

#### 3.4 Reading Page (Day 4, 3-4 hours)

**CRITICAL**: Only refactor UI strings, NOT story content

**Components to refactor**:
- Reading page title and buttons
- StorySettings labels
- LanguageSettings labels
- AudioPlayer controls

**DO NOT refactor**:
- StoryDisplay content (uses existing blending system)
- QuizComponent questions (generated content)
- Vocabulary hints (part of story data)

**Example**:
```typescript
// src/pages/Reading.tsx
import { useTranslation } from 'react-i18next';

export const Reading = () => {
  const { t } = useTranslation();

  return (
    <PageLayout>
      {/* UI labels - USE i18next */}
      <h1>{t('reading.title')}</h1>
      <button>{t('reading.generateButton')}</button>

      {/* Story content - DO NOT use i18next */}
      <StoryDisplay story={story} />
    </PageLayout>
  );
};
```

---

#### 3.5 Other Pages (Day 5, 4-6 hours)

**Pages to refactor**:
- Library
- Achievements
- Shop
- Profile/Settings
- Progress
- TeacherDashboard
- StudentLobby

**Testing after each refactor**:
```bash
npm run dev
# Manual verification:
# 1. Page loads without errors
# 2. All text displays (in English)
# 3. No visual regressions
```

**Acceptance Criteria**:
- [ ] All components use `t()` function
- [ ] No hardcoded UI strings remain
- [ ] Manual QA passed for each feature
- [ ] No console errors
- [ ] App still functions identically (English-only at this stage)

**Risks**: Medium (potential bugs from refactoring)

---

### Phase 4: Translation Generation (Day 5, 2-4 hours)

**Objective**: Generate translations for target languages using Lingo.dev

**Process**:

1. **Run Lingo.dev CLI**:
```bash
cd frontend
npx lingo.dev@latest run
```

**Expected output**:
```
✓ Discovered 1 file
✓ Extracted 187 translatable strings
✓ Calculated deltas (187 new, 0 modified, 0 deleted)
✓ Translating to es-419... (45s)
✓ Translating to ko... (42s)
✓ Translating to zh-CN... (44s)
✓ Injected translations into target files
✓ Updated i18n.lock

Translation complete! ✓
```

2. **Verify generated files**:
```bash
ls -la src/locales/
# Should show:
# en.json (500 lines)
# es-419.json (500 lines)
# ko.json (500 lines)
# zh-CN.json (500 lines)
# i18n.lock (2000 lines)
```

3. **Review translations** (spot-check):
   - Open each file
   - Check 10-20 random keys
   - Verify proper terminology (gaming terms)
   - Check variable interpolation preserved: `{{userName}}`
   - Check pluralization syntax: `_one`, `_other`

4. **Manual corrections** (if needed):
   - Update translation directly in target file OR
   - Update prompt in `i18n.json` and re-run

5. **Commit to git**:
```bash
git add src/locales/*.json i18n.json i18n.lock
git commit -m "feat: generate initial translations for ES, KO, ZH

- Configure Lingo.dev for 3 target languages
- Generate translations for ~500 UI strings
- Add i18n.lock for delta tracking"
```

**Acceptance Criteria**:
- [ ] Translation files generated for all target languages
- [ ] i18n.lock created
- [ ] Spot-check confirms quality translations
- [ ] All files committed to git

**Risks**: Low (can regenerate if quality issues found)

---

### Phase 5: Language Switcher (Day 6, 2-4 hours)

**Objective**: Allow users to switch UI language

**Tasks**:

1. **Create LanguageSwitcher component** (`src/components/common/LanguageSwitcher.tsx`):

```typescript
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

const LANGUAGES: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'es-419', name: 'Spanish', nativeName: 'Español', flag: '🌎' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
  { code: 'zh-CN', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
];

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (langCode: string) => {
    i18n.changeLanguage(langCode);
    localStorage.setItem('uiLanguage', langCode);
  };

  return (
    <div className="relative">
      <select
        value={i18n.language}
        onChange={(e) => changeLanguage(e.target.value)}
        className="px-3 py-2 border rounded-lg bg-white dark:bg-gray-800"
        aria-label="Select language"
      >
        {LANGUAGES.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.flag} {lang.nativeName}
          </option>
        ))}
      </select>
    </div>
  );
};
```

2. **Add to Profile/Settings page** (`src/pages/Profile.tsx`):

```typescript
import { LanguageSwitcher } from '../components/common/LanguageSwitcher';
import { useTranslation } from 'react-i18next';

export const Profile = () => {
  const { t } = useTranslation();

  return (
    <PageLayout>
      <h1>{t('profile.title')}</h1>

      {/* UI Language Section */}
      <section className="mb-6">
        <h2 className="text-xl font-bold mb-2">
          {t('profile.uiLanguage')}
        </h2>
        <p className="text-gray-600 mb-4">
          {t('profile.uiLanguageDescription')}
        </p>
        <LanguageSwitcher />
      </section>

      {/* Learning Language Section (Separate) */}
      <section className="mb-6">
        <h2 className="text-xl font-bold mb-2">
          {t('profile.learningLanguage')}
        </h2>
        <p className="text-gray-600 mb-4">
          {t('profile.learningLanguageDescription')}
        </p>
        <select value={secondaryLanguage} onChange={handleLearningLanguageChange}>
          <option value="ko">{t('reading.languageOptions.korean')}</option>
          <option value="zh">{t('reading.languageOptions.mandarin')}</option>
        </select>
      </section>
    </PageLayout>
  );
};
```

3. **Add to en.json**:
```json
{
  "profile": {
    "title": "Profile",
    "uiLanguage": "Interface Language",
    "uiLanguageDescription": "Choose the language for buttons, menus, and navigation throughout the app.",
    "learningLanguage": "Learning Language",
    "learningLanguageDescription": "Choose which language you want to learn in your reading stories."
  }
}
```

4. **Re-run translations**:
```bash
npx lingo.dev@latest run  # Only translates new keys (delta)
```

5. **Optional: Add to Header** for quick access

**Acceptance Criteria**:
- [ ] LanguageSwitcher component created
- [ ] Added to Profile/Settings page
- [ ] Clear separation between UI language and learning language
- [ ] Language preference persists on page reload
- [ ] Switching language updates UI instantly (no page reload)

**Testing**:
1. Select Spanish → UI changes to Spanish
2. Reload page → UI still in Spanish
3. Generate story → Story still in English + Korean (not Spanish)
4. Switch back to English → UI changes to English

**Risks**: Low

---

### Phase 6: Separation of Concerns (Day 6, 2-3 hours)

**Objective**: Clearly distinguish UI language from learning language

**Tasks**:

1. **Update UserSettings type** (`src/types/user.ts`):

```typescript
interface UserSettings {
  // UI Localization (NEW)
  uiLanguage: 'en' | 'es-419' | 'ko' | 'zh-CN' | 'fr' | 'de' | 'ja';

  // Learning Settings (EXISTING - NO CHANGES)
  primaryLanguage: 'en'; // Fixed for learning
  secondaryLanguage: 'ko' | 'zh'; // For learning
  languageBlendLevel: number; // 0-4
  showHints: boolean;
  showRomanization: boolean;

  // Audio Settings
  audioEnabled: boolean;
  audioSpeed: number;
  audioVoice?: string;
}
```

2. **Update SettingsContext** to manage both independently:

```typescript
// src/contexts/SettingsContext.tsx
export const SettingsProvider = ({ children }) => {
  const { i18n } = useTranslation();

  // UI language managed by i18next
  const [uiLanguage, setUiLanguage] = useState(i18n.language);

  // Learning language managed by existing system
  const [learningSettings, setLearningSettings] = useState({
    secondaryLanguage: 'ko',
    languageBlendLevel: 2,
    showHints: true,
    showRomanization: false,
  });

  const changeUiLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    setUiLanguage(lang);
    localStorage.setItem('uiLanguage', lang);
  };

  // Learning language change does NOT affect UI language
  const changeLearningLanguage = (lang: 'ko' | 'zh') => {
    setLearningSettings(prev => ({ ...prev, secondaryLanguage: lang }));
  };

  return (
    <SettingsContext.Provider value={{
      uiLanguage,
      changeUiLanguage,
      learningSettings,
      changeLearningLanguage,
    }}>
      {children}
    </SettingsContext.Provider>
  );
};
```

3. **Add visual indicators** in UI:
   - Different icons for each (Globe for UI, Book for learning)
   - Separate sections in settings
   - Tooltips explaining the difference

4. **Documentation**: Update user-facing help text

**Acceptance Criteria**:
- [ ] UI language and learning language are independent
- [ ] Changing UI language doesn't affect learning language
- [ ] Clear visual separation in settings
- [ ] User help text explains the distinction

**Risks**: Low

---

### Phase 7: Testing & QA (Days 7-8, 8-12 hours)

**Objective**: Comprehensive testing across all languages

**Test Matrix**:

| Feature | EN | ES | KO | ZH | Issues |
|---------|----|----|----|----|--------|
| Navigation | ✓ | ✓ | ✓ | ✓ | None |
| Dashboard | ✓ | ✓ | ✓ | ✓ | Text overflow in KO |
| Reading | ✓ | ✓ | ✓ | ✓ | None |
| Library | ✓ | ✓ | ✓ | ✓ | None |
| Achievements | ✓ | ✓ | ✓ | ✓ | None |
| Shop | ✓ | ✓ | ✓ | ✓ | Button width in ES |
| Profile | ✓ | ✓ | ✓ | ✓ | None |
| Error Messages | ✓ | ✓ | ✓ | ✓ | None |

**Testing Checklist**:

#### Functional Testing
- [ ] All pages load in each language
- [ ] Navigation works in each language
- [ ] Forms submit correctly
- [ ] Error messages display correctly
- [ ] Language switcher updates UI instantly
- [ ] Language preference persists after reload
- [ ] Browser language detection works
- [ ] Fallback to English works if translation missing

#### Visual QA
- [ ] No text overflow/truncation
- [ ] Buttons accommodate longer text
- [ ] Multi-line labels don't break layout
- [ ] Fonts render correctly (Korean, Chinese)
- [ ] Proper alignment maintained
- [ ] Icons and text aligned

#### Educational Content Integrity (CRITICAL)
- [ ] Story generation works in all UI languages
- [ ] Stories remain English + Korean (not UI language)
- [ ] Language blending slider works
- [ ] Vocabulary hints display correctly
- [ ] Quiz functionality unchanged
- [ ] Audio playback works

#### Performance
- [ ] Page load time <3 seconds
- [ ] Language switch <500ms
- [ ] Translation file size <100KB per language
- [ ] No console errors
- [ ] No memory leaks

**Test Scenarios**:

1. **Scenario: Spanish-speaking parent**
   - Switch UI to Spanish
   - Navigate all pages
   - Generate story with Korean learning
   - Verify story is English + Korean (not Spanish)
   - Check all buttons work

2. **Scenario: Korean parent helping child**
   - Switch UI to Korean
   - Create new user profile
   - Select Mandarin as learning language
   - Generate story
   - Verify UI in Korean, story in English + Mandarin

3. **Scenario: Teacher using Chinese UI**
   - Switch UI to Chinese
   - Navigate to teacher dashboard
   - Create classroom
   - Add students
   - Verify all admin functions work

**Bug Tracking**:
Create issues in GitHub for any bugs found:
```
Title: [i18n] Text overflow in Korean Dashboard
Priority: P1
Steps to reproduce:
1. Switch UI to Korean
2. Navigate to Dashboard
3. Observe "Welcome back" message
Expected: Text fits in container
Actual: Text overflows
```

**Acceptance Criteria**:
- [ ] All functional tests passing
- [ ] All visual QA issues resolved
- [ ] Educational content integrity verified
- [ ] Performance metrics met
- [ ] Test report documented

**Risks**: High (might uncover significant issues)

---

### Phase 8: Bug Fixes & Polish (Days 8-9, 6-10 hours)

**Objective**: Address issues found during QA

**Common Issues & Solutions**:

**Issue 1: Text Overflow**
```css
/* Fix: Use flexible widths */
.button {
  min-width: 100px;
  padding: 0.5rem 1rem;
  white-space: nowrap;
}

/* If still overflows, allow wrapping */
.button {
  min-width: 100px;
  padding: 0.5rem 1rem;
  white-space: normal;
  text-align: center;
}
```

**Issue 2: Missing Translations**
```bash
# Add missing keys to en.json
# Re-run Lingo.dev
npx lingo.dev@latest run
```

**Issue 3: Poor Translation Quality**
```json
// Update provider prompt in i18n.json
{
  "provider": {
    "prompt": "Translate from {source} to {target}. Context: 'Level' is a gaming term for progression level (like in video games), not difficulty level or school grade level."
  }
}

// Delete i18n.lock to force retranslation
rm i18n.lock
npx lingo.dev@latest run
```

**Issue 4: Font Rendering Issues**
```typescript
// Update tailwind.config.js
export default {
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'Noto Sans KR', 'Noto Sans SC', 'sans-serif'],
      },
    },
  },
};

// Install web fonts if needed
// npm install @fontsource/noto-sans-kr @fontsource/noto-sans-sc
```

**Acceptance Criteria**:
- [ ] All P0 bugs fixed
- [ ] All P1 bugs fixed
- [ ] P2 bugs documented for future sprints
- [ ] Re-tested in all languages
- [ ] Code cleaned up (no console.logs, commented code, etc.)

**Risks**: Medium

---

### Phase 9: Documentation (Day 9, 2-4 hours)

**Objective**: Comprehensive documentation for team and users

**Documents to Create/Update**:

1. **Developer Documentation** (`/docs/LOCALIZATION.md`):
   - How the system works
   - How to add new UI strings
   - How to add new languages
   - Troubleshooting guide

2. **User Guide** (in-app help):
   - What UI language means
   - What learning language means
   - How to change languages
   - FAQs

3. **PRP Updates** (this document):
   - Mark as completed
   - Add lessons learned
   - Document final metrics

4. **README Updates**:
   - Add localization section
   - List supported languages
   - Link to documentation

**Acceptance Criteria**:
- [ ] All documentation complete
- [ ] Documentation reviewed by at least 1 other developer
- [ ] User guide added to app
- [ ] README updated

**Risks**: Low

---

### Phase 10: Deployment (Day 10, 2-4 hours)

**Objective**: Deploy to production

**Pre-Deployment Checklist**:
- [ ] All tests passing (unit, integration, E2E)
- [ ] QA sign-off received
- [ ] Translations files committed
- [ ] Environment variables set (production API keys)
- [ ] i18n.lock committed
- [ ] Documentation complete
- [ ] Rollback plan documented
- [ ] Stakeholder approval received

**Deployment Steps**:

1. **Merge to main**:
```bash
git checkout main
git merge feature/lingo-integration
git push origin main
```

2. **CI/CD Pipeline** (automated):
   - Run tests
   - Build frontend
   - Deploy to staging
   - Run smoke tests
   - Deploy to production

3. **Post-Deployment Verification**:
   - [ ] Visit app in production
   - [ ] Test each language
   - [ ] Verify language switcher
   - [ ] Check console for errors
   - [ ] Verify analytics tracking
   - [ ] Monitor error logging

4. **Rollback Plan** (if needed):
```bash
# Option 1: Revert commit
git revert [merge-commit-hash]
git push origin main

# Option 2: Feature flag (if implemented)
# Set VITE_ENABLE_UI_LOCALIZATION=false
```

**Acceptance Criteria**:
- [ ] Production deployment successful
- [ ] All languages working in production
- [ ] No console errors
- [ ] Analytics tracking language selection
- [ ] Team notified of deployment

**Risks**: Medium (production changes always carry risk)

---

## Testing Strategy

### Unit Tests

**Example test for translated component**:
```typescript
// src/components/dashboard/WelcomeSection.test.tsx
import { render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../i18n';
import { WelcomeSection } from './WelcomeSection';

describe('WelcomeSection', () => {
  it('renders welcome message with username', () => {
    render(
      <I18nextProvider i18n={i18n}>
        <WelcomeSection userName="John" />
      </I18nextProvider>
    );

    expect(screen.getByText(/Welcome back, John/i)).toBeInTheDocument();
  });

  it('translates to Spanish', async () => {
    await i18n.changeLanguage('es-419');

    render(
      <I18nextProvider i18n={i18n}>
        <WelcomeSection userName="Juan" />
      </I18nextProvider>
    );

    expect(screen.getByText(/Bienvenido de nuevo, Juan/i)).toBeInTheDocument();
  });
});
```

**Coverage target**: 80% for refactored components

---

### Integration Tests

**Test language switching flow**:
```typescript
// src/__tests__/languageSwitching.integration.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { App } from '../App';

describe('Language Switching', () => {
  it('switches UI language without affecting story language', async () => {
    render(<App />);

    // Initial state: English UI
    expect(screen.getByText('Dashboard')).toBeInTheDocument();

    // Navigate to Profile
    fireEvent.click(screen.getByText('Profile'));

    // Change UI language to Spanish
    const languageSwitcher = screen.getByLabelText('Select language');
    fireEvent.change(languageSwitcher, { target: { value: 'es-419' } });

    // Wait for translation to load
    await waitFor(() => {
      expect(screen.getByText('Tablero')).toBeInTheDocument(); // Spanish for Dashboard
    });

    // Navigate to Reading page
    fireEvent.click(screen.getByText('Lectura')); // Spanish for Reading

    // Generate story with Korean
    fireEvent.click(screen.getByText('Generar Historia')); // Spanish button

    // Verify story is still English + Korean, not Spanish
    await waitFor(() => {
      const storyText = screen.getByTestId('story-content');
      expect(storyText.textContent).toContain('The cat'); // English
      expect(storyText.textContent).toContain('고양이'); // Korean
      expect(storyText.textContent).not.toContain('El gato'); // Not Spanish
    });
  });
});
```

---

### E2E Tests (Playwright)

```typescript
// e2e/localization.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Localization', () => {
  test('should persist language preference', async ({ page }) => {
    await page.goto('http://localhost:5173');

    // Change language to Korean
    await page.selectOption('select[aria-label="Select language"]', 'ko');

    // Verify UI changed to Korean
    await expect(page.locator('text=대시보드')).toBeVisible();

    // Reload page
    await page.reload();

    // Verify language persisted
    await expect(page.locator('text=대시보드')).toBeVisible();
  });

  test('should auto-detect browser language', async ({ page, context }) => {
    // Set browser language to Spanish
    await context.addInitScript(() => {
      Object.defineProperty(navigator, 'language', {
        get: () => 'es-419',
      });
    });

    await page.goto('http://localhost:5173');

    // Verify UI loaded in Spanish
    await expect(page.locator('text=Tablero')).toBeVisible();
  });
});
```

---

## Dependencies

### Required Libraries

```json
{
  "dependencies": {
    "react-i18next": "^13.5.0",
    "i18next": "^23.7.0",
    "i18next-browser-languagedetector": "^7.2.0"
  },
  "devDependencies": {
    "@types/i18next": "^13.0.0"
  }
}
```

### External Services

- **Lingo.dev** (CLI and API):
  - Free tier: 10,000 words/month (sufficient for MVP)
  - Paid tier: $30/month for 50,000 words (recommended)

- **OpenAI/Anthropic** (Alternative LLM providers):
  - If not using Lingo.dev's API
  - Requires API key in environment

---

## Cost Estimation

### Initial Translation (One-time)

**Assumptions**:
- UI strings: ~500 keys
- Target languages: 3 (ES, KO, ZH)
- Total strings: 500 × 3 = 1,500

**Cost**:
- Lingo.dev API: ~$3 (at $0.002/string)
- OR OpenAI GPT-4o: ~$2 (at ~$1/1M tokens)

**Total one-time cost**: **$2-3**

---

### Ongoing Maintenance (Monthly)

**Assumptions**:
- 10% of strings change per month (~50 keys)
- Target languages: 3
- Total: 50 × 3 = 150 strings/month

**Cost**:
- Lingo.dev API: ~$0.30/month
- OR OpenAI GPT-4o: ~$0.20/month

**Total monthly cost**: **$0.20-0.30**

---

### Adding New Languages (Future)

**Cost per language**: ~$1 (500 strings × $0.002)

**Phase 2 (3 more languages)**:
- French, German, Japanese
- Cost: ~$3

**Total for 6 languages**: **$5-6 (one-time)**

---

### Annual Cost Estimate

| Item | Cost |
|------|------|
| Initial translation (3 languages) | $3 |
| Monthly maintenance (12 months) | $3.60 |
| Phase 2 expansion (3 languages) | $3 |
| **Total Year 1** | **~$10** |

**Note**: Extremely cost-effective due to delta-based translation system

---

## Success Metrics

### Quantitative Metrics

1. **Translation Coverage**
   - Target: 100% of UI strings translated
   - Measurement: `i18n.lock` fingerprint count
   - Threshold: 0 missing translations

2. **Performance Impact**
   - Target: Page load time increase <10%
   - Measurement: Lighthouse performance score
   - Baseline: 85-90 (current)
   - Target: 80-85 (with i18n)

3. **Bundle Size Impact**
   - Target: <100KB per language file
   - Measurement: Webpack bundle analyzer
   - Current: ~500KB total
   - With i18n: ~800KB (3 languages)

4. **Language Adoption**
   - Target: >10% of users use non-English UI
   - Measurement: Analytics (localStorage 'uiLanguage')
   - Track by language over time

5. **Translation Cost**
   - Target: <$0.50/month after initial setup
   - Measurement: Lingo.dev dashboard
   - Track monthly API usage

### Qualitative Metrics

1. **User Feedback**
   - Collect feedback from non-English users
   - Survey: "Is the app easier to use in your language?"
   - Target: >80% positive responses

2. **Translation Quality**
   - Native speaker review for each language
   - Identify mistranslations or awkward phrasing
   - Target: <5 quality issues per language

3. **Developer Experience**
   - Survey: "How easy is it to add new UI strings?"
   - Target: "Very easy" or "Easy" from 100% of developers

### Educational Content Integrity (Critical)

1. **Story Generation Unchanged**
   - Target: 0 regressions in story generation
   - Measurement: Manual testing + automated E2E tests
   - Track: English story + Korean/Mandarin blending still works

2. **Language Blending Unchanged**
   - Target: 5-level blending works identically
   - Measurement: Manual testing with all blend levels
   - Track: No changes to `languageBlending.ts` logic

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Translation quality issues | Medium | Medium | Custom prompts, native speaker review, iterative refinement |
| Text overflow/layout breaks | High | Low | Flexible CSS, visual QA in all languages, responsive design |
| Confusion between UI and learning language | Medium | Medium | Clear labeling, separate settings, tooltips, user guide |
| Performance degradation | Low | Medium | Lazy loading, bundle size monitoring, performance testing |
| Breaking educational content | Low | High | Comprehensive testing, separation of concerns, regression tests |
| Missing translations | Medium | Low | Fallback to English, console warnings, QA process |
| API rate limits (Lingo.dev) | Low | Low | Delta-based updates, monitor usage, upgrade plan if needed |
| Team adoption challenges | Low | Medium | Documentation, training, clear patterns |

---

## Rollback Plan

### Scenario 1: Critical Bug in Production

**Trigger**: Major functionality broken (e.g., app crashes when switching language)

**Action**:
1. Revert deployment:
   ```bash
   git revert [merge-commit-hash]
   git push origin main
   ```
2. CI/CD auto-deploys rollback
3. Investigate issue in staging
4. Fix and re-deploy

**Time to rollback**: 5-10 minutes

---

### Scenario 2: Poor Translation Quality

**Trigger**: Multiple user complaints about incorrect translations

**Action**:
1. Keep feature live (not critical)
2. Update translations:
   - Edit target locale files directly OR
   - Update Lingo.dev prompt and re-run
3. Deploy updated translations (no code changes)

**Time to fix**: 1-2 hours

---

### Scenario 3: Performance Issues

**Trigger**: Page load time >5 seconds

**Action**:
1. Implement lazy loading:
   ```typescript
   // Load translations on-demand
   i18n.use(Backend).init({
     backend: {
       loadPath: '/locales/{{lng}}.json',
     },
   });
   ```
2. Split large translation files into namespaces
3. Deploy optimization

**Time to fix**: 2-4 hours

---

## Future Enhancements

### Phase 3: Additional Languages (Future)

**Languages to consider**:
- Portuguese (pt-BR) - Brazil market
- Italian (it) - European expansion
- Russian (ru) - Eastern Europe
- Arabic (ar) - Middle East (requires RTL support)
- Hindi (hi) - India market
- Vietnamese (vi) - Southeast Asia

**Implementation**: Follow same process, add to `targetLocales` in `i18n.json`

---

### Phase 4: Right-to-Left (RTL) Support

**Languages**: Arabic (ar), Hebrew (he), Persian (fa)

**Challenges**:
- Entire UI layout flips
- CSS needs `dir="rtl"` support
- Icons and navigation mirror

**Implementation**:
```typescript
// Detect RTL language
const isRTL = ['ar', 'he', 'fa'].includes(i18n.language);

// Apply to document
document.dir = isRTL ? 'rtl' : 'ltr';

// CSS updates
.container {
  margin-inline-start: 1rem; /* Instead of margin-left */
}
```

**Effort**: 1-2 weeks

---

### Phase 5: Context-Aware Translations

**Enhancement**: Different translations based on context

**Example**:
- "Level" in gaming context: "Nivel" (Spanish)
- "Level" in difficulty context: "Dificultad" (Spanish)

**Implementation**:
```json
{
  "level": {
    "gaming": "Nivel",
    "difficulty": "Dificultad"
  }
}
```

**Effort**: 1 week

---

### Phase 6: User-Contributed Translations

**Feature**: Allow community to suggest translation improvements

**Implementation**:
- Add "Suggest translation" button in app
- Store suggestions in database
- Admin review and approval workflow

**Effort**: 2-3 weeks

---

## Appendix

### Appendix A: Complete Translation File Structure

```json
{
  "app": {
    "title": "Reading Quest",
    "tagline": "Your Adventure in Language Learning"
  },
  "nav": {
    "dashboard": "Dashboard",
    "reading": "Reading",
    "library": "Library",
    "achievements": "Achievements",
    "shop": "Shop",
    "progress": "Progress",
    "profile": "Profile",
    "teacherDashboard": "Teacher Dashboard",
    "studentLobby": "Student Lobby"
  },
  "dashboard": {
    "welcome": "Welcome back, {{userName}}!",
    "level": "Level",
    "xp": "XP",
    "coins": "Coins",
    "streak_one": "{{count}} day streak",
    "streak_other": "{{count}} day streak",
    "stats": {
      "storiesRead": "Stories Read",
      "wordsLearned": "Words Learned",
      "achievementsEarned": "Achievements Earned",
      "petHappiness": "Pet Happiness"
    },
    "quickActions": {
      "title": "Quick Actions",
      "readStory": "Read a Story",
      "feedPet": "Feed Your Pet",
      "viewAchievements": "View Achievements",
      "visitShop": "Visit Shop"
    }
  },
  "reading": {
    "title": "Generate Your Story",
    "generateButton": "Generate Story",
    "generating": "Generating your story...",
    "readAloud": "Read Aloud",
    "settings": {
      "title": "Story Settings",
      "language": "Language",
      "gradeLevel": "Grade Level",
      "storyLength": "Story Length",
      "theme": "Theme",
      "humorLevel": "Humor Level",
      "customPrompt": "Custom Prompt"
    },
    "languageOptions": {
      "korean": "Korean",
      "mandarin": "Mandarin Chinese"
    },
    "gradeLevels": {
      "3rd": "3rd Grade",
      "4th": "4th Grade",
      "5th": "5th Grade",
      "6th": "6th Grade"
    },
    "lengths": {
      "short": "Short (2-3 min)",
      "medium": "Medium (4-5 min)",
      "long": "Long (6-8 min)"
    },
    "themes": {
      "adventure": "Adventure",
      "mystery": "Mystery",
      "scifi": "Science Fiction",
      "fantasy": "Fantasy",
      "animals": "Animals",
      "friendship": "Friendship",
      "custom": "Custom"
    },
    "humorLevels": {
      "min": "Minimal",
      "max": "Maximum",
      "insane": "Insane"
    },
    "blending": {
      "title": "Language Blend Level",
      "description": "Adjust how much secondary language to include",
      "level0": "100% English",
      "level1": "Vocabulary Recognition",
      "level2": "Noun Immersion",
      "level3": "Balanced Mix",
      "level4": "100% Secondary Language"
    },
    "audioControls": {
      "play": "Play",
      "pause": "Pause",
      "stop": "Stop",
      "speed": "Speed"
    }
  },
  "library": {
    "title": "Your Library",
    "empty": "You haven't read any stories yet!",
    "filters": {
      "all": "All Stories",
      "recent": "Recent",
      "favorites": "Favorites",
      "byLanguage": "By Language"
    },
    "sort": {
      "newest": "Newest First",
      "oldest": "Oldest First",
      "title": "By Title"
    },
    "storyCard": {
      "readTime": "{{minutes}} min read",
      "language": "Language: {{lang}}",
      "grade": "Grade: {{grade}}",
      "read": "Read",
      "delete": "Delete"
    }
  },
  "achievements": {
    "title": "Your Achievements",
    "progress": "Progress: {{earned}}/{{total}}",
    "earned": "Earned",
    "locked": "Locked",
    "categories": {
      "all": "All",
      "reading": "Reading",
      "pet": "Pet Care",
      "progress": "Progress",
      "special": "Special"
    },
    "card": {
      "xpReward": "+{{xp}} XP",
      "coinReward": "+{{coins}} coins"
    }
  },
  "pet": {
    "title": "Your Virtual Pet",
    "name": "Name: {{name}}",
    "actions": {
      "feed": "Feed",
      "play": "Play",
      "clean": "Clean",
      "customize": "Customize"
    },
    "stats": {
      "happiness": "Happiness",
      "hunger": "Hunger",
      "health": "Health",
      "energy": "Energy"
    },
    "food": {
      "apple": "Apple",
      "cookie": "Cookie",
      "pizza": "Pizza",
      "sushi": "Sushi",
      "cake": "Cake"
    },
    "evolution": {
      "title": "Evolution Time!",
      "message": "Your pet is ready to evolve!",
      "evolve": "Evolve Now",
      "later": "Maybe Later"
    }
  },
  "shop": {
    "title": "Shop",
    "coins": "{{count}} Coins",
    "buy": "Buy",
    "owned": "Owned",
    "insufficient": "Not enough coins",
    "categories": {
      "all": "All Items",
      "food": "Food",
      "accessories": "Accessories",
      "backgrounds": "Backgrounds",
      "special": "Special"
    }
  },
  "profile": {
    "title": "Profile",
    "settings": "Settings",
    "username": "Username",
    "email": "Email",
    "uiLanguage": "Interface Language",
    "uiLanguageDescription": "Choose the language for buttons, menus, and navigation throughout the app.",
    "learningLanguage": "Learning Language",
    "learningLanguageDescription": "Choose which language you want to learn in your reading stories.",
    "theme": "Theme",
    "notifications": "Notifications",
    "save": "Save Changes",
    "cancel": "Cancel"
  },
  "common": {
    "loading": "Loading...",
    "save": "Save",
    "cancel": "Cancel",
    "confirm": "Confirm",
    "delete": "Delete",
    "edit": "Edit",
    "back": "Back",
    "next": "Next",
    "close": "Close",
    "yes": "Yes",
    "no": "No",
    "ok": "OK",
    "retry": "Retry",
    "refresh": "Refresh"
  },
  "errors": {
    "userLoadFailed": "Failed to load user data. Please try again.",
    "storyGenerationFailed": "Failed to generate story. Please check your settings and try again.",
    "networkError": "Network error occurred. Please check your connection.",
    "invalidInput": "Please check your input and try again.",
    "notFound": "Page not found",
    "unauthorized": "You are not authorized to access this page.",
    "serverError": "Server error occurred. Please try again later.",
    "timeout": "Request timed out. Please try again."
  },
  "validation": {
    "required": "This field is required",
    "email": "Please enter a valid email address",
    "minLength": "Must be at least {{min}} characters",
    "maxLength": "Must be no more than {{max}} characters",
    "number": "Must be a number",
    "positive": "Must be a positive number"
  }
}
```

---

### Appendix B: CI/CD Integration Example

**GitHub Actions** (`.github/workflows/translations.yml`):

```yaml
name: Update Translations

on:
  push:
    branches: [main, develop]
    paths:
      - 'frontend/src/locales/en.json'

jobs:
  translate:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci
        working-directory: ./frontend

      - name: Run Lingo.dev translations
        run: npx lingo.dev@latest run
        working-directory: ./frontend
        env:
          LINGODOTDEV_API_KEY: ${{ secrets.LINGODOTDEV_API_KEY }}

      - name: Commit translation updates
        run: |
          git config --local user.email "action@github.com"
          git config --local user.name "GitHub Action"
          git add frontend/src/locales/*.json frontend/i18n.lock
          git diff --quiet && git diff --staged --quiet || git commit -m "chore: update translations [skip ci]"

      - name: Push changes
        uses: ad-m/github-push-action@master
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          branch: ${{ github.ref }}
```

---

## Conclusion

This PRP provides a comprehensive, step-by-step plan to implement Lingo.dev for UI localization while preserving our existing educational content system. The implementation is designed to be:

- **Incremental**: Phase-by-phase, not big bang
- **Low-risk**: Backwards compatible, extensive testing
- **Cost-effective**: Delta-based translations, ~$10/year
- **Developer-friendly**: Minimal code changes, clear patterns
- **User-friendly**: Clear distinction between UI and learning languages

**Estimated Timeline**: 8-10 days
**Estimated Cost**: ~$10/year
**Priority**: P2 (Post-MVP enhancement)
**Status**: Ready for implementation

---

## Sign-Off

| Role | Name | Approval | Date |
|------|------|----------|------|
| Product Owner | TBD | ☐ | |
| Tech Lead | TBD | ☐ | |
| QA Lead | TBD | ☐ | |
| DevOps | TBD | ☐ | |

---

**Document Version**: 1.0
**Last Updated**: 2024-10-24
**Next Review**: After Phase 3 completion
