# Lingo.dev Implementation Guide

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation & Setup](#installation--setup)
3. [Configuration](#configuration)
4. [Code Refactoring](#code-refactoring)
5. [Running Translations](#running-translations)
6. [Testing & Validation](#testing--validation)
7. [CI/CD Integration](#cicd-integration)
8. [Best Practices](#best-practices)

---

## Prerequisites

### Required Tools
- Node.js 20.x or higher
- npm or yarn package manager
- Git for version control

### Required Accounts
- Lingo.dev account (free tier available) OR
- OpenAI/Anthropic API key (if using third-party LLM)

### Project Requirements
- React 18+ with TypeScript
- Existing component structure in place
- Access to frontend codebase

---

## Installation & Setup

### Step 1: Install Lingo.dev CLI

Navigate to your frontend directory and initialize Lingo.dev:

```bash
cd multilingual-education-app/frontend
npx lingo.dev@latest init
```

The CLI will prompt you through setup and generate an `i18n.json` configuration file.

### Step 2: Install i18n Library (react-i18next)

While Lingo.dev handles translation, we need a runtime library to use translations in our React components:

```bash
npm install react-i18next i18next i18next-browser-languagedetector i18next-http-backend
```

### Step 3: Set Up Environment Variables

Add to `/frontend/.env`:

```env
# Lingo.dev Configuration (choose one)

# Option 1: Lingo.dev Engine (recommended)
LINGODOTDEV_API_KEY=your-lingo-api-key

# Option 2: OpenAI
OPENAI_API_KEY=your-openai-api-key

# Option 3: Anthropic
ANTHROPIC_API_KEY=your-anthropic-api-key
```

---

## Configuration

### Step 1: Configure i18n.json

Lingo.dev created an `i18n.json` file. Update it for our React + TypeScript project:

```json
{
  "$schema": "https://unpkg.com/lingo.dev@latest/i18n.schema.json",
  "version": "1.0.0",
  "sourceLocale": "en",
  "targetLocales": ["es-419", "ko", "zh-CN", "fr", "de", "ja"],
  "buckets": {
    "json": {
      "include": ["locales/[locale].json"],
      "exclude": []
    }
  },
  "provider": {
    "id": "lingodotdev",
    "model": "gpt-4o",
    "prompt": "Translate the following content from {source} to {target}. Maintain a friendly, educational tone suitable for children ages 8-12 and their parents."
  }
}
```

### Configuration Breakdown

**sourceLocale**: `"en"` - Our current UI language
**targetLocales**: Languages we want to support
  - `es-419`: Latin American Spanish (broader coverage)
  - `ko`: Korean
  - `zh-CN`: Simplified Chinese (Mandarin)
  - `fr`: French
  - `de`: German
  - `ja`: Japanese

**buckets**: Defines which files to translate
  - `include`: Pattern for translation files
  - `[locale]` placeholder is required for JSON buckets

**provider**: LLM configuration
  - `id`: Which service to use
  - `model`: Which model to use
  - `prompt`: Custom instructions for translations (context matters!)

### Step 2: Create Translation File Structure

Create the folder structure:

```bash
mkdir -p src/locales
touch src/locales/en.json
```

### Step 3: Configure i18next in React

Create `/frontend/src/i18n.ts`:

```typescript
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

i18n
  // Load translations dynamically
  .use(Backend)
  // Detect user language
  .use(LanguageDetector)
  // Pass i18n instance to react-i18next
  .use(initReactI18next)
  // Init i18next
  .init({
    fallbackLng: 'en',
    debug: import.meta.env.DEV, // Enable debug in development

    interpolation: {
      escapeValue: false, // React already escapes
    },

    backend: {
      loadPath: '/locales/{{lng}}.json',
    },

    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;
```

### Step 4: Initialize i18n in App

Update `/frontend/src/main.tsx`:

```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import './i18n'; // Import i18n configuration

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

---

## Code Refactoring

### Strategy: Incremental Refactoring

We'll refactor components progressively to use i18n hooks instead of hardcoded strings.

### Pattern 1: Simple Text Replacement

**Before** (hardcoded):
```typescript
// src/components/layout/Header.tsx
export const Header = () => {
  return (
    <header>
      <h1>Reading Quest</h1>
      <p>Your Adventure in Language Learning</p>
    </header>
  );
};
```

**After** (i18n):
```typescript
import { useTranslation } from 'react-i18next';

export const Header = () => {
  const { t } = useTranslation();

  return (
    <header>
      <h1>{t('app.title')}</h1>
      <p>{t('app.tagline')}</p>
    </header>
  );
};
```

**Translation file** (`/frontend/src/locales/en.json`):
```json
{
  "app": {
    "title": "Reading Quest",
    "tagline": "Your Adventure in Language Learning"
  }
}
```

### Pattern 2: Components with Variables

**Before**:
```typescript
export const WelcomeSection = ({ userName }: Props) => {
  return <h2>Welcome back, {userName}!</h2>;
};
```

**After**:
```typescript
import { useTranslation } from 'react-i18next';

export const WelcomeSection = ({ userName }: Props) => {
  const { t } = useTranslation();

  return <h2>{t('dashboard.welcome', { userName })}</h2>;
};
```

**Translation file**:
```json
{
  "dashboard": {
    "welcome": "Welcome back, {{userName}}!"
  }
}
```

### Pattern 3: Pluralization

**Before**:
```typescript
const message = count === 1
  ? `${count} story read`
  : `${count} stories read`;
```

**After**:
```typescript
const { t } = useTranslation();
const message = t('stats.storiesRead', { count });
```

**Translation file**:
```json
{
  "stats": {
    "storiesRead_one": "{{count}} story read",
    "storiesRead_other": "{{count}} stories read"
  }
}
```

### Pattern 4: Conditional Text

**Before**:
```typescript
const buttonLabel = isLoading ? 'Loading...' : 'Generate Story';
```

**After**:
```typescript
const { t } = useTranslation();
const buttonLabel = isLoading
  ? t('common.loading')
  : t('reading.generateStory');
```

**Translation file**:
```json
{
  "common": {
    "loading": "Loading..."
  },
  "reading": {
    "generateStory": "Generate Story"
  }
}
```

### Pattern 5: Error Messages

**Before**:
```typescript
throw new Error('Failed to load user data');
```

**After**:
```typescript
import { i18n } from 'i18next';

throw new Error(i18n.t('errors.userLoadFailed'));
```

**Translation file**:
```json
{
  "errors": {
    "userLoadFailed": "Failed to load user data"
  }
}
```

---

## Running Translations

### Step 1: Extract All Strings

Before running translations, ensure all hardcoded strings are refactored to use `t()` functions and exist in `locales/en.json`.

Example complete structure:

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
    "streak": "Day Streak"
  },
  "reading": {
    "generateStory": "Generate Story",
    "selectLanguage": "Select Language",
    "gradeLevel": "Grade Level",
    "storyLength": "Story Length",
    "theme": "Theme",
    "humorLevel": "Humor Level"
  },
  "pet": {
    "feed": "Feed",
    "play": "Play",
    "clean": "Clean",
    "happiness": "Happiness",
    "hunger": "Hunger",
    "health": "Health"
  },
  "common": {
    "loading": "Loading...",
    "save": "Save",
    "cancel": "Cancel",
    "confirm": "Confirm",
    "back": "Back",
    "next": "Next",
    "close": "Close"
  },
  "errors": {
    "userLoadFailed": "Failed to load user data",
    "storyGenerationFailed": "Failed to generate story",
    "networkError": "Network error occurred"
  }
}
```

### Step 2: Run Lingo.dev CLI

Execute translation:

```bash
npx lingo.dev@latest run
```

The CLI will:
1. Scan `locales/en.json`
2. Extract translatable content
3. Clean non-translatable data (numbers, booleans, etc.)
4. Calculate deltas (what changed since last run)
5. Send deltas to LLM provider
6. Generate translations for all target locales
7. Create `locales/es-419.json`, `locales/ko.json`, etc.
8. Generate `i18n.lock` file (translation fingerprints)

### Step 3: Review Generated Translations

Check the output files:

```bash
ls -la src/locales/
# Should show:
# en.json
# es-419.json
# ko.json
# zh-CN.json
# fr.json
# de.json
# ja.json
```

### Step 4: Commit Changes

```bash
git add src/locales/*.json i18n.json i18n.lock
git commit -m "Add localization support with Lingo.dev

- Configure i18n.json for 6 target languages
- Extract all UI strings to en.json
- Generate translations for Spanish, Korean, Chinese, French, German, Japanese
- Add i18n.lock for delta tracking"
```

---

## Testing & Validation

### Step 1: Test Language Switching

Create a language switcher component:

```typescript
// src/components/common/LanguageSwitcher.tsx
import { useTranslation } from 'react-i18next';

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es-419', name: 'Español' },
    { code: 'ko', name: '한국어' },
    { code: 'zh-CN', name: '中文' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
    { code: 'ja', name: '日本語' },
  ];

  return (
    <select
      value={i18n.language}
      onChange={(e) => i18n.changeLanguage(e.target.value)}
    >
      {languages.map((lang) => (
        <option key={lang.code} value={lang.code}>
          {lang.name}
        </option>
      ))}
    </select>
  );
};
```

### Step 2: Visual QA

For each language:
1. Switch to the language
2. Navigate through all pages
3. Check for:
   - Missing translations (English fallback showing?)
   - Truncated text (UI breaking due to longer translations?)
   - Incorrect translations (wrong context?)
   - Layout issues (RTL languages if applicable)

### Step 3: Automated Testing

Update component tests to use i18n:

```typescript
// Example test
import { render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n';
import { Header } from './Header';

describe('Header', () => {
  it('renders title in current language', () => {
    render(
      <I18nextProvider i18n={i18n}>
        <Header />
      </I18nextProvider>
    );

    expect(screen.getByText(/Reading Quest/i)).toBeInTheDocument();
  });
});
```

### Step 4: Missing Translation Detection

Add a plugin to detect missing translations during development:

```typescript
// src/i18n.ts
i18n.init({
  // ... other config
  saveMissing: true,
  missingKeyHandler: (lng, ns, key) => {
    console.warn(`Missing translation: [${lng}] ${key}`);
  },
});
```

---

## CI/CD Integration

### Option 1: GitHub Actions

Create `.github/workflows/localization.yml`:

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
      - uses: actions/checkout@v3

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

      - name: Create Pull Request
        uses: peter-evans/create-pull-request@v5
        with:
          commit-message: 'chore: update translations'
          title: 'Update Translations'
          body: 'Automated translation update via Lingo.dev'
          branch: 'translations/auto-update'
```

### Option 2: Pre-commit Hook

Create `.husky/pre-commit`:

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# Check if en.json changed
if git diff --cached --name-only | grep -q "locales/en.json"; then
  echo "Detected changes to en.json, running translations..."
  cd frontend && npx lingo.dev@latest run
  git add src/locales/*.json i18n.lock
fi
```

---

## Best Practices

### 1. Translation Key Naming

Use hierarchical namespacing:

```json
{
  "component.feature.action": "Label"
}
```

Examples:
- `dashboard.stats.level`: "Level"
- `reading.settings.language`: "Language"
- `pet.actions.feed`: "Feed"
- `common.buttons.save`: "Save"

### 2. Context in Translation Prompts

Update your `i18n.json` prompt to provide context:

```json
{
  "provider": {
    "prompt": "Translate from {source} to {target}. Context: This is a children's educational app for ages 8-12. Use friendly, encouraging language. Technical terms like 'XP', 'Level', 'Streak' should remain in English or use gaming equivalents familiar to the target culture."
  }
}
```

### 3. Keep Educational Content Separate

**DO NOT** translate story content with Lingo.dev - that's handled by our existing Azure OpenAI system.

Only translate:
- UI labels
- Button text
- Error messages
- Navigation items
- Settings descriptions

### 4. Incremental Updates

After initial setup, only changed strings will be translated:

```bash
# Add new string to en.json
# Run translation (only delta processed)
npx lingo.dev@latest run

# Cost: Only ~50 tokens instead of 5000 tokens
```

### 5. Version Control

Always commit these files together:
- `src/locales/*.json` (translation files)
- `i18n.json` (configuration)
- `i18n.lock` (fingerprints for delta calculation)

### 6. Fallback Strategy

Always provide English fallback:

```typescript
i18n.init({
  fallbackLng: 'en',
  // Other config...
});
```

### 7. Test in Production-like Environment

Before deploying, test with:
1. Browser language set to target language
2. localStorage cleared (fresh user experience)
3. Network throttling (slow 3G)

---

## Troubleshooting

### Issue: "Missing translation" warnings

**Solution**: Run `npx lingo.dev@latest run` again to regenerate translations.

### Issue: Translations not updating

**Solution**: Delete `i18n.lock` and re-run:
```bash
rm i18n.lock
npx lingo.dev@latest run
```

### Issue: API rate limits

**Solution**:
- Use Lingo.dev's own API (higher limits)
- Or implement retry logic with exponential backoff

### Issue: Wrong translations

**Solution**: Update the prompt in `i18n.json` with more specific context:
```json
{
  "provider": {
    "prompt": "Translate from {source} to {target}. This is a gamified reading app. 'XP' means experience points (not ExpressJS or other technical meanings)."
  }
}
```

---

## Summary Checklist

- [ ] Install Lingo.dev CLI
- [ ] Install react-i18next and dependencies
- [ ] Configure `i18n.json` with target locales
- [ ] Set up environment variables (API keys)
- [ ] Create `src/i18n.ts` configuration
- [ ] Initialize i18n in `main.tsx`
- [ ] Refactor components to use `t()` hooks
- [ ] Extract all strings to `locales/en.json`
- [ ] Run initial translation: `npx lingo.dev@latest run`
- [ ] Review generated translations
- [ ] Add LanguageSwitcher component
- [ ] Test all languages visually
- [ ] Set up CI/CD automation
- [ ] Document process for team
- [ ] Commit all changes to git

---

## Next Steps

After completing this guide:
1. Review [architecture.md](./architecture.md) for deeper understanding
2. Check [supported-locales.md](./supported-locales.md) for adding more languages
3. Implement the PRP in `/PRPs/fullstack/lingo-implementation.md`
