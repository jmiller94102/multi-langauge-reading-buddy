# Migration Strategy: Integrating Lingo.dev with Existing Language System

## Overview

This document outlines how to integrate Lingo.dev for UI localization while **preserving** our existing custom language blending system for educational content.

---

## Current State Analysis

### What We Have Now

**1. Custom Language Blending System** ✅ Keep
- **Purpose**: Educational content (stories, quizzes)
- **Location**: `/frontend/src/utils/languageBlending.ts`
- **Flow**: Backend generates English + secondary language → Frontend blends based on level (0-4)
- **Languages**: English + Korean OR English + Mandarin
- **Scope**: Story content only

**2. Hardcoded UI Strings** ❌ Replace with Lingo.dev
- **Purpose**: UI labels, buttons, navigation, errors
- **Location**: Scattered across all components
- **Languages**: English only
- **Problem**: No localization for non-English-speaking parents/teachers

### What We Need

**Two separate localization systems coexisting**:

```
┌─────────────────────────────────────────────────────────────┐
│                    Reading Quest App                         │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  UI/UX Localization (NEW - Lingo.dev + i18next)             │
│  ├─ Buttons, labels, navigation                             │
│  ├─ Error messages, tooltips                                │
│  ├─ Settings, profile, dashboard UI                         │
│  └─ Languages: EN, ES, KO, ZH, FR, DE, JA                   │
│                                                               │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Educational Content (EXISTING - Custom System)              │
│  ├─ Story generation (Azure OpenAI)                          │
│  ├─ Language blending (5-level system)                      │
│  ├─ Vocabulary translations                                  │
│  └─ Languages: EN + KO OR EN + ZH                           │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## Key Distinction

### UI Localization (Lingo.dev)
**Purpose**: Allow users to navigate the app in their native language
**Example**: Spanish-speaking parent selects "Español" → entire UI shows Spanish

### Educational Content (Custom System)
**Purpose**: Help children learn a second language through blended stories
**Example**: English-speaking child learning Korean → stories blend English + Korean based on proficiency level

---

## Migration Phases

### Phase 0: Preparation (Day 1)

**Goal**: Set up development environment and create isolated test

**Tasks**:
1. Create feature branch: `git checkout -b feature/lingo-integration`
2. Install dependencies: `npm install react-i18next i18next i18next-browser-languagedetector`
3. Initialize Lingo.dev: `npx lingo.dev@latest init`
4. Set up API keys in `.env`

**Deliverables**:
- Feature branch created
- Dependencies installed
- `i18n.json` configuration file generated
- Development environment ready

**Risk**: Low
**Time**: 2-4 hours

---

### Phase 1: Core Infrastructure (Days 1-2)

**Goal**: Set up i18next runtime without touching existing components

**Tasks**:

1. **Create i18n configuration** (`/frontend/src/i18n.ts`):
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
      escapeValue: false,
    },
    resources: {
      en: {
        translation: {}, // Will populate later
      },
    },
  });

export default i18n;
```

2. **Import i18n in entry point** (`/frontend/src/main.tsx`):
```typescript
import './i18n'; // Add this line
```

3. **Create initial translation file structure**:
```bash
mkdir -p src/locales
touch src/locales/en.json
```

4. **Configure Lingo.dev** (`/frontend/i18n.json`):
```json
{
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
    "prompt": "Translate from {source} to {target}. This is a children's educational app for ages 8-12. Use friendly, encouraging language."
  }
}
```

**Testing**:
```bash
npm run dev
# App should still work (i18n loaded but not used yet)
```

**Deliverables**:
- i18n runtime configured
- No visual changes (backwards compatible)

**Risk**: Low
**Time**: 4-6 hours

---

### Phase 2: Extract UI Strings (Days 2-3)

**Goal**: Identify and extract all hardcoded UI strings into `en.json`

**Strategy**: Systematic component-by-component extraction

**Process**:

1. **Audit components** for hardcoded strings:
```bash
# Find all string literals in components
grep -r "\".*\"" src/components/ | grep -v "className" | grep -v "import"
```

2. **Create comprehensive `en.json`**:
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
    "profile": "Profile"
  },
  "dashboard": {
    "welcome": "Welcome back, {{userName}}!",
    "level": "Level",
    "xp": "XP",
    "coins": "Coins",
    "streak": "{{count}} day streak",
    "quickActions": {
      "readStory": "Read a Story",
      "feedPet": "Feed Your Pet",
      "viewAchievements": "View Achievements"
    }
  },
  "reading": {
    "title": "Generate Your Story",
    "generateButton": "Generate Story",
    "settings": {
      "language": "Language",
      "gradeLevel": "Grade Level",
      "storyLength": "Story Length",
      "theme": "Theme",
      "humorLevel": "Humor Level"
    },
    "languageOptions": {
      "korean": "Korean",
      "mandarin": "Mandarin Chinese"
    },
    "storyPrompt": "What would you like your story to be about?"
  },
  "pet": {
    "title": "Your Virtual Pet",
    "actions": {
      "feed": "Feed",
      "play": "Play",
      "clean": "Clean"
    },
    "stats": {
      "happiness": "Happiness",
      "hunger": "Hunger",
      "health": "Health"
    },
    "food": {
      "apple": "Apple",
      "cookie": "Cookie",
      "pizza": "Pizza"
    }
  },
  "achievements": {
    "title": "Your Achievements",
    "progress": "Progress",
    "earned": "Earned",
    "locked": "Locked",
    "categories": {
      "all": "All",
      "reading": "Reading",
      "pet": "Pet Care",
      "progress": "Progress"
    }
  },
  "shop": {
    "title": "Shop",
    "coins": "Coins",
    "buy": "Buy",
    "owned": "Owned",
    "categories": {
      "food": "Food",
      "accessories": "Accessories",
      "backgrounds": "Backgrounds"
    }
  },
  "profile": {
    "title": "Profile",
    "settings": "Settings",
    "username": "Username",
    "email": "Email",
    "language": "Interface Language",
    "theme": "Theme",
    "notifications": "Notifications"
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
    "no": "No"
  },
  "errors": {
    "userLoadFailed": "Failed to load user data. Please try again.",
    "storyGenerationFailed": "Failed to generate story. Please check your settings.",
    "networkError": "Network error occurred. Please check your connection.",
    "invalidInput": "Please check your input and try again.",
    "notFound": "Page not found",
    "unauthorized": "You are not authorized to access this page"
  },
  "validation": {
    "required": "This field is required",
    "email": "Please enter a valid email address",
    "minLength": "Must be at least {{min}} characters",
    "maxLength": "Must be no more than {{max}} characters"
  }
}
```

**Important: DO NOT extract educational content**:
- ❌ Story text (generated by Azure OpenAI)
- ❌ Quiz questions (generated by Azure OpenAI)
- ❌ Vocabulary translations (part of story generation)
- ❌ Language blending logic strings

**Deliverables**:
- Complete `en.json` with all UI strings
- Documentation of string locations

**Risk**: Low
**Time**: 6-8 hours

---

### Phase 3: Refactor Components (Days 3-5)

**Goal**: Update components to use `useTranslation` hook

**Strategy**: Incremental refactoring, one feature at a time

**Order of refactoring** (lowest to highest risk):

#### 3.1 Common Components (Day 3)
Start with simple, reusable components:

```typescript
// Before: src/components/common/Button.tsx
export const Button = ({ children, ...props }) => {
  return <button {...props}>{children}</button>;
};

// After: No changes needed
// Buttons receive translated text as children prop
```

```typescript
// Before: src/components/common/LoadingSpinner.tsx
export const LoadingSpinner = () => {
  return <div>Loading...</div>;
};

// After:
import { useTranslation } from 'react-i18next';

export const LoadingSpinner = () => {
  const { t } = useTranslation();
  return <div>{t('common.loading')}</div>;
};
```

#### 3.2 Navigation Components (Day 3)

```typescript
// Before: src/components/layout/SideNav.tsx
const navItems = [
  { label: 'Dashboard', path: '/' },
  { label: 'Reading', path: '/reading' },
  { label: 'Library', path: '/library' },
];

// After:
import { useTranslation } from 'react-i18next';

const SideNav = () => {
  const { t } = useTranslation();

  const navItems = [
    { label: t('nav.dashboard'), path: '/' },
    { label: t('nav.reading'), path: '/reading' },
    { label: t('nav.library'), path: '/library' },
  ];

  return /* render navItems */;
};
```

#### 3.3 Dashboard Components (Day 4)

```typescript
// Before: src/components/dashboard/WelcomeSection.tsx
export const WelcomeSection = ({ userName }) => {
  return <h2>Welcome back, {userName}!</h2>;
};

// After:
import { useTranslation } from 'react-i18next';

export const WelcomeSection = ({ userName }) => {
  const { t } = useTranslation();
  return <h2>{t('dashboard.welcome', { userName })}</h2>;
};
```

#### 3.4 Reading Page (Day 4) - CRITICAL SECTION

**Important**: Only refactor UI strings, NOT story content

```typescript
// Before: src/pages/Reading.tsx
return (
  <div>
    <h1>Generate Your Story</h1>
    <button>Generate Story</button>

    {/* Story content - DO NOT TRANSLATE */}
    <StoryDisplay story={story} />
  </div>
);

// After:
import { useTranslation } from 'react-i18next';

return (
  <div>
    <h1>{t('reading.title')}</h1>
    <button>{t('reading.generateButton')}</button>

    {/* Story content - UNCHANGED */}
    <StoryDisplay story={story} />
  </div>
);
```

**Critical: StoryDisplay component should NOT use i18next**:
```typescript
// src/components/reading/StoryDisplay.tsx
// DO NOT import useTranslation here!

export const StoryDisplay = ({ story }) => {
  // Story content uses existing blending system
  return (
    <div>
      {blendSentences(
        story.primarySentences,
        story.secondarySentences,
        blendLevel
      )}
    </div>
  );
};
```

#### 3.5 Other Pages (Day 5)
- Achievements page
- Shop page
- Profile page
- Progress page
- Library page

**Testing after each refactor**:
```bash
npm run dev
# Manually test each refactored component
# Verify no visual changes (still showing English)
```

**Deliverables**:
- All components refactored to use `t()` function
- Manual QA completed for each feature
- No regressions

**Risk**: Medium (potential to break existing functionality)
**Time**: 12-16 hours

---

### Phase 4: Generate Translations (Day 5)

**Goal**: Use Lingo.dev to generate translations for target languages

**Process**:

1. **Run Lingo.dev CLI**:
```bash
cd frontend
npx lingo.dev@latest run
```

2. **Verify generated files**:
```bash
ls src/locales/
# Should show:
# en.json
# es-419.json (Spanish)
# ko.json (Korean)
# zh-CN.json (Chinese)
```

3. **Review translations**:
Open each file and spot-check for:
- Correct terminology (gaming terms: "XP", "Level", etc.)
- Appropriate tone (child-friendly, encouraging)
- Proper variable interpolation: `{{userName}}`
- Pluralization rules: `{{count}}`

4. **Commit to version control**:
```bash
git add src/locales/*.json i18n.json i18n.lock
git commit -m "Generate initial translations with Lingo.dev"
```

**Deliverables**:
- Translation files for all target languages
- `i18n.lock` file for delta tracking
- QA review notes

**Risk**: Low (can regenerate if needed)
**Time**: 2-4 hours

---

### Phase 5: Add Language Switcher (Day 6)

**Goal**: Allow users to switch UI language

**Implementation**:

1. **Create LanguageSwitcher component**:
```typescript
// src/components/common/LanguageSwitcher.tsx
import { useTranslation } from 'react-i18next';

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const languages = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'es-419', name: 'Spanish', nativeName: 'Español' },
    { code: 'ko', name: 'Korean', nativeName: '한국어' },
    { code: 'zh-CN', name: 'Chinese', nativeName: '中文' },
  ];

  const changeLanguage = (langCode: string) => {
    i18n.changeLanguage(langCode);
    localStorage.setItem('uiLanguage', langCode); // Persist preference
  };

  return (
    <select
      value={i18n.language}
      onChange={(e) => changeLanguage(e.target.value)}
      className="px-3 py-2 border rounded"
    >
      {languages.map((lang) => (
        <option key={lang.code} value={lang.code}>
          {lang.nativeName}
        </option>
      ))}
    </select>
  );
};
```

2. **Add to Settings page** (`src/pages/Profile.tsx`):
```typescript
import { LanguageSwitcher } from '../components/common/LanguageSwitcher';

export const Profile = () => {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t('profile.title')}</h1>

      <div>
        <label>{t('profile.language')}</label>
        <LanguageSwitcher />
      </div>

      {/* Other settings */}
    </div>
  );
};
```

3. **Add to Header** (optional):
```typescript
// src/components/layout/Header.tsx
import { LanguageSwitcher } from '../common/LanguageSwitcher';

export const Header = () => {
  return (
    <header>
      <h1>Reading Quest</h1>
      <LanguageSwitcher />
    </header>
  );
};
```

**Deliverables**:
- LanguageSwitcher component
- Integrated into Profile page
- UI language preference persisted

**Risk**: Low
**Time**: 2-4 hours

---

### Phase 6: Separation of Concerns (Day 6)

**Goal**: Clearly separate UI language from educational content language

**Problem**: Users might confuse UI language with learning language

**Solution**: Clear labeling and separate settings

**Update Settings Context** (`src/types/user.ts`):
```typescript
interface UserSettings {
  // UI Language (NEW)
  uiLanguage: 'en' | 'es-419' | 'ko' | 'zh-CN' | 'fr' | 'de' | 'ja';

  // Learning Settings (EXISTING - DO NOT CHANGE)
  primaryLanguage: 'en'; // English (fixed for learning)
  secondaryLanguage: 'ko' | 'zh'; // Korean or Mandarin (for learning)
  languageBlendLevel: number; // 0-4
  showHints: boolean;
  showRomanization: boolean;

  // Other settings...
}
```

**Update Settings UI** (`src/pages/Profile.tsx`):
```typescript
return (
  <div>
    <h2>{t('profile.settings')}</h2>

    {/* UI Language */}
    <div className="setting-group">
      <h3>{t('profile.uiLanguage')}</h3>
      <p>{t('profile.uiLanguageDescription')}</p>
      <LanguageSwitcher />
    </div>

    {/* Learning Language (Separate Section) */}
    <div className="setting-group">
      <h3>{t('profile.learningLanguage')}</h3>
      <p>{t('profile.learningLanguageDescription')}</p>
      <select value={secondaryLanguage} onChange={handleLanguageChange}>
        <option value="ko">{t('reading.languageOptions.korean')}</option>
        <option value="zh">{t('reading.languageOptions.mandarin')}</option>
      </select>
    </div>
  </div>
);
```

**Add to en.json**:
```json
{
  "profile": {
    "uiLanguage": "Interface Language",
    "uiLanguageDescription": "Choose the language for buttons, menus, and navigation",
    "learningLanguage": "Learning Language",
    "learningLanguageDescription": "Choose which language you want to learn in your stories"
  }
}
```

**Deliverables**:
- Clear separation between UI language and learning language
- User-friendly descriptions
- Separate settings sections

**Risk**: Low
**Time**: 2-3 hours

---

### Phase 7: Testing & QA (Days 7-8)

**Goal**: Comprehensive testing across all languages

**Test Plan**:

#### 7.1 Functional Testing

**For each language** (EN, ES, KO, ZH):

1. **Navigation**
   - [ ] All menu items display correctly
   - [ ] Page titles render properly
   - [ ] Breadcrumbs work

2. **Dashboard**
   - [ ] Welcome message with username interpolation
   - [ ] Stat labels (Level, XP, Coins, Streak)
   - [ ] Quick action buttons

3. **Reading Page**
   - [ ] UI labels in selected language
   - [ ] Story content in learning language (unchanged)
   - [ ] Settings labels (grade level, theme, etc.)
   - [ ] Generate button

4. **Library**
   - [ ] Story cards render
   - [ ] Filter/sort labels
   - [ ] Empty state message

5. **Achievements**
   - [ ] Achievement titles
   - [ ] Progress indicators
   - [ ] Filter buttons

6. **Shop**
   - [ ] Item names
   - [ ] Prices
   - [ ] Buy buttons

7. **Profile**
   - [ ] Form labels
   - [ ] Language switcher
   - [ ] Save button

8. **Error Messages**
   - [ ] Network errors
   - [ ] Validation errors
   - [ ] 404 page

#### 7.2 Visual QA

**Check for**:
- [ ] Text overflow (longer translations)
- [ ] Button width (truncated text)
- [ ] Layout breaks (multi-line labels)
- [ ] Font rendering (Korean, Chinese characters)
- [ ] Alignment issues

**Example fixes**:
```css
/* Before: Fixed width causes overflow */
.button {
  width: 100px;
}

/* After: Flexible width */
.button {
  min-width: 100px;
  padding: 0.5rem 1rem;
}
```

#### 7.3 Edge Cases

**Test scenarios**:
- [ ] Switch language mid-session
- [ ] Language persists after page reload
- [ ] Fallback to English if translation missing
- [ ] Browser language auto-detection
- [ ] Missing translation warnings in console (dev mode)

#### 7.4 Educational Content Integrity

**Critical**: Verify learning system is NOT affected:

- [ ] Story generation still works
- [ ] Language blending (0-4 slider) still functions
- [ ] Vocabulary hints display correctly
- [ ] Quiz questions render properly
- [ ] Audio playback works

**Test with UI in different language**:
1. Switch UI to Spanish
2. Generate a story with Korean learning language
3. Verify story is English + Korean (NOT Spanish + Korean)

#### 7.5 Performance Testing

- [ ] Page load time < 3 seconds
- [ ] Language switch < 500ms
- [ ] Translation file size < 100KB per language
- [ ] No console errors

**Deliverables**:
- QA test report
- Bug list (if any)
- Screenshots of each language
- Performance metrics

**Risk**: High (might discover issues requiring fixes)
**Time**: 8-12 hours

---

### Phase 8: Bug Fixes & Polish (Days 8-9)

**Goal**: Address issues found during QA

**Common issues and fixes**:

**Issue 1: Text overflow**
```css
/* Fix: Use flexible layouts */
.card-title {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
```

**Issue 2: Missing translations**
```typescript
// Add missing keys to en.json
// Re-run: npx lingo.dev@latest run
```

**Issue 3: Wrong context translation**
```json
// Update provider prompt in i18n.json
{
  "provider": {
    "prompt": "Translate from {source} to {target}. Context: In our app, 'Level' refers to user progression level (like in video games), not difficulty level."
  }
}
```

**Issue 4: Variable interpolation broken**
```json
// Ensure {{variables}} preserved
{
  "welcome": "Welcome back, {{userName}}!"
}
```

**Deliverables**:
- All QA issues resolved
- Re-tested in all languages
- Code cleaned up

**Risk**: Medium
**Time**: 6-10 hours

---

### Phase 9: Documentation (Day 9)

**Goal**: Document the dual localization system for future developers

**Create** `/docs/LOCALIZATION.md`:
```markdown
# Localization Guide

## Two Localization Systems

### UI Localization (Lingo.dev + i18next)
- **Purpose**: Translate interface to user's native language
- **Languages**: EN, ES, KO, ZH, FR, DE, JA
- **Files**: `src/locales/*.json`
- **Usage**: `const { t } = useTranslation(); t('key')`

### Educational Content (Custom Blending)
- **Purpose**: Help children learn a second language
- **Languages**: EN + KO OR EN + ZH
- **Files**: `src/utils/languageBlending.ts`
- **Usage**: `blendSentences(primary, secondary, level)`

## Adding New UI Strings

1. Add to `src/locales/en.json`
2. Use in component: `t('namespace.key')`
3. Run: `npx lingo.dev@latest run`
4. Commit all translation files

## Adding New Languages

1. Update `i18n.json` targetLocales
2. Run: `npx lingo.dev@latest run`
3. Add to LanguageSwitcher component
4. Test thoroughly
```

**Update** `/PRPs/README.md`:
- Add link to Lingo.dev PRP
- Mention dual localization system

**Deliverables**:
- Comprehensive localization guide
- Updated project documentation
- Team training materials

**Risk**: Low
**Time**: 2-4 hours

---

### Phase 10: Deployment (Day 10)

**Goal**: Deploy to production

**Pre-deployment checklist**:
- [ ] All tests passing
- [ ] QA sign-off received
- [ ] Translation files committed
- [ ] Environment variables set
- [ ] i18n.lock committed
- [ ] Documentation complete

**Deployment steps**:

1. **Merge to main**:
```bash
git checkout main
git merge feature/lingo-integration
git push origin main
```

2. **Build frontend**:
```bash
cd frontend
npm run build
```

3. **Deploy** (via your deployment pipeline)

4. **Post-deployment verification**:
- [ ] All languages load correctly
- [ ] Language switcher works
- [ ] No console errors
- [ ] Educational content still works

**Rollback plan**:
```bash
git revert [commit-hash]
git push origin main
```

**Deliverables**:
- Production deployment
- Post-deployment verification report

**Risk**: Medium (production changes)
**Time**: 2-4 hours

---

## Backwards Compatibility Strategy

### Approach: Graceful Degradation

**If i18n fails to load**:
```typescript
// src/i18n.ts
i18n.init({
  fallbackLng: 'en',

  // Return key if translation missing
  parseMissingKeyHandler: (key) => {
    console.warn(`Missing translation: ${key}`);
    return key;
  },
});
```

**If translation file missing**:
```typescript
// Fallback to English
i18n.loadLanguages(['en']).then(() => {
  i18n.changeLanguage('en');
});
```

### Feature Flags

Optional: Use feature flag to gradually roll out:

```typescript
// src/utils/featureFlags.ts
export const FEATURES = {
  UI_LOCALIZATION: import.meta.env.VITE_ENABLE_UI_LOCALIZATION === 'true',
};

// In components:
{FEATURES.UI_LOCALIZATION ? (
  <LanguageSwitcher />
) : null}
```

---

## Rollback Plan

### If major issues discovered post-deployment:

**Option 1: Quick Fix**
```bash
# Fix the issue
git add .
git commit -m "fix: resolve localization issue"
git push
```

**Option 2: Full Rollback**
```bash
# Revert the merge commit
git revert -m 1 [merge-commit-hash]
git push origin main
```

**Option 3: Feature Flag Disable**
```bash
# Disable via environment variable
export VITE_ENABLE_UI_LOCALIZATION=false
```

---

## Cost Estimation

### Initial Translation (Day 5)

**Calculation**:
- UI strings: ~500 keys
- Target languages: 3 (Spanish, Korean, Chinese)
- Total: 500 × 3 = 1,500 strings

**Cost**: ~$3 (at $0.002/string with GPT-4o)

### Incremental Updates (Ongoing)

**Scenario**: 10% of strings change per month
- Changed strings: 50
- Target languages: 3
- Total: 50 × 3 = 150 strings/month

**Cost**: ~$0.30/month

**Annual cost**: ~$3.60/year (after initial $3)

### Adding New Languages (Future)

**Cost per language**: ~$1 (500 strings × $0.002)

---

## Risk Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Translation quality issues | Medium | Medium | Custom prompts, QA review, iterative refinement |
| Text overflow/layout breaks | High | Low | Flexible CSS, visual QA in all languages |
| Confusion between UI language and learning language | Medium | Medium | Clear labeling, separate settings sections |
| Performance degradation | Low | Medium | Lazy loading, bundle size monitoring |
| Breaking educational content | Low | High | Comprehensive testing, separation of concerns |
| Missing translations | Medium | Low | Fallback to English, console warnings |

---

## Success Metrics

### Phase 1-3 (Implementation)
- [ ] All components refactored (100% coverage)
- [ ] Zero regressions in existing features
- [ ] No console errors

### Phase 4-6 (Translation & UX)
- [ ] 3 languages fully translated
- [ ] Language switcher functional
- [ ] User preferences persisted

### Phase 7-10 (QA & Deployment)
- [ ] All QA tests passing
- [ ] Production deployment successful
- [ ] Post-deployment verification complete

### Long-term (Post-Launch)
- [ ] User adoption of non-English languages > 10%
- [ ] No user-reported localization bugs
- [ ] Educational content system unaffected

---

## Summary

### Key Principles

1. **Separation of Concerns**: UI localization (Lingo.dev) separate from educational content (custom system)
2. **Incremental Migration**: Phase-by-phase implementation, not big bang
3. **Backwards Compatibility**: Always fallback to English
4. **Testing First**: Comprehensive QA before deployment
5. **Clear Labeling**: Users understand difference between UI language and learning language

### Timeline

| Phase | Days | Tasks |
|-------|------|-------|
| 0 | 0.25 | Preparation |
| 1 | 0.5 | Core infrastructure |
| 2 | 1 | Extract UI strings |
| 3 | 2 | Refactor components |
| 4 | 0.5 | Generate translations |
| 5 | 0.5 | Add language switcher |
| 6 | 0.5 | Separation of concerns |
| 7 | 1.5 | Testing & QA |
| 8 | 1 | Bug fixes & polish |
| 9 | 0.25 | Documentation |
| 10 | 0.25 | Deployment |
| **Total** | **8 days** | Full implementation |

---

## Next Steps

1. Review this migration strategy with the team
2. Get sign-off on the approach
3. Schedule 2-week sprint for implementation
4. Begin Phase 0 (Preparation)
5. Proceed through phases systematically
