# Lingo.dev Architecture & Technical Workflow

## Overview

This document explains how Lingo.dev works under the hood, its integration with our Reading Quest application, and the technical architecture of the localization pipeline.

---

## Table of Contents

1. [Core Architecture](#core-architecture)
2. [The 5-Step Translation Workflow](#the-5-step-translation-workflow)
3. [File Structure & Organization](#file-structure--organization)
4. [Bucket System](#bucket-system)
5. [Delta Calculation & Optimization](#delta-calculation--optimization)
6. [Integration with Our Monorepo](#integration-with-our-monorepo)
7. [Translation Memory](#translation-memory)
8. [Performance Optimization](#performance-optimization)

---

## Core Architecture

### High-Level Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Developer Workflow                        │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  1. Update en.json          (Source Locale)                 │
│     - Add new UI strings                                     │
│     - Modify existing translations                           │
│     - Remove obsolete keys                                   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  2. Run Lingo.dev CLI       npx lingo.dev@latest run        │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              Lingo.dev 5-Step Pipeline                       │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Step 1: Content Discovery                           │   │
│  │ Step 2: Data Cleaning                               │   │
│  │ Step 3: Delta Calculation                           │   │
│  │ Step 4: Localization (LLM Call)                     │   │
│  │ Step 5: Content Injection                           │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  3. Output Generated Files                                   │
│     - locales/es-419.json   (Spanish)                       │
│     - locales/ko.json       (Korean)                        │
│     - locales/zh-CN.json    (Chinese)                       │
│     - i18n.lock             (Fingerprints)                  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  4. Git Commit & Push                                        │
│     - Commit translation files                              │
│     - CI/CD creates PR (optional)                           │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  5. Runtime (React i18next)                                  │
│     - Load translation files dynamically                     │
│     - Render UI in user's selected language                 │
└─────────────────────────────────────────────────────────────┘
```

---

## The 5-Step Translation Workflow

### Step 1: Content Discovery

**What it does**: Recursively scans the project for translation files based on bucket configurations.

**How it works**:
1. Reads `i18n.json` configuration
2. Iterates through each bucket definition
3. Applies include/exclude patterns
4. Discovers all matching files

**For our project**:
```json
{
  "buckets": {
    "json": {
      "include": ["locales/[locale].json"],
      "exclude": []
    }
  }
}
```

**Files discovered**:
- `src/locales/en.json` (source)
- Target placeholders: `src/locales/es-419.json`, `src/locales/ko.json`, etc.

**Output**: List of file paths to process

---

### Step 2: Data Cleaning

**What it does**: Filters out non-translatable content to reduce API costs and improve accuracy.

**Content automatically excluded**:
- Numeric values: `42`, `3.14`, `1000`
- Booleans: `true`, `false`
- ISO dates: `2024-10-24T12:00:00Z`
- UUIDs: `550e8400-e29b-41d4-a716-446655440000`
- Code snippets: `console.log()`, `import React`
- URLs: `https://example.com`
- File paths: `/src/components/Button.tsx`
- Empty strings: `""`
- Whitespace-only strings: `"   "`

**Example**:

**Before cleaning** (en.json):
```json
{
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "level": 5,
    "xp": 1250,
    "isActive": true,
    "greeting": "Welcome back!",
    "lastLoginDate": "2024-10-24T12:00:00Z"
  }
}
```

**After cleaning** (sent to LLM):
```json
{
  "user": {
    "greeting": "Welcome back!"
  }
}
```

**Benefit**: Only 1 string translated instead of 6 entries (83% cost reduction)

---

### Step 3: Delta Calculation

**What it does**: Uses SHA-256 hashing to identify what changed since the last translation run.

**How it works**:
1. Reads current `en.json` content
2. Generates SHA-256 hash for each translatable string
3. Compares against previous hashes stored in `i18n.lock`
4. Identifies:
   - **New keys**: Added since last run
   - **Modified keys**: Content changed
   - **Deleted keys**: Removed from source
   - **Unchanged keys**: Skip translation

**Example**:

**Run 1** (initial translation):
```json
// en.json
{
  "common": {
    "save": "Save",
    "cancel": "Cancel"
  }
}
```

**i18n.lock generated**:
```json
{
  "en": {
    "common.save": "a1b2c3d4...",
    "common.cancel": "e5f6g7h8..."
  }
}
```

**Run 2** (added new key + modified existing):
```json
// en.json
{
  "common": {
    "save": "Save Changes",  // Modified
    "cancel": "Cancel",      // Unchanged
    "close": "Close"         // New
  }
}
```

**Delta sent to LLM**:
```json
{
  "common": {
    "save": "Save Changes",  // Modified
    "close": "Close"         // New
  }
}
```

**Result**: Only 2 strings translated instead of 3 (33% cost reduction)

**Cost comparison**:
- **Without delta**: 100 strings × 6 languages = 600 API calls
- **With delta** (10% changed): 10 strings × 6 languages = 60 API calls
- **Savings**: 90% reduction in API costs

---

### Step 4: Localization

**What it does**: Sends delta content to LLM provider for translation.

**Process**:
1. Prepare translation request with custom prompt
2. Send deltas to LLM (OpenAI, Anthropic, or Lingo.dev Engine)
3. Implement retry logic with exponential backoff
4. Process multiple target languages concurrently
5. Receive translated content

**Example request to LLM**:

**Prompt**:
```
Translate the following content from English to Korean.
Context: This is a children's educational app for ages 8-12.
Use friendly, encouraging language. Gaming terms like "XP", "Level", "Streak"
should use familiar gaming equivalents.

Content to translate:
{
  "dashboard": {
    "welcome": "Welcome back, {{userName}}!",
    "level": "Level",
    "xp": "XP"
  }
}
```

**Response from LLM**:
```json
{
  "dashboard": {
    "welcome": "다시 오신 것을 환영합니다, {{userName}}!",
    "level": "레벨",
    "xp": "경험치"
  }
}
```

**Resilience features**:
- Automatic retry on network failures
- Exponential backoff (1s, 2s, 4s, 8s)
- Concurrent processing across languages
- Graceful error handling

**Parallel processing**:
```
English → Spanish   (concurrent)
       → Korean     (concurrent)
       → Chinese    (concurrent)
       → French     (concurrent)
       → German     (concurrent)
       → Japanese   (concurrent)
```

---

### Step 5: Content Injection

**What it does**: Injects translated content back into target locale files while preserving structure.

**Features**:
- Preserves file formatting (indentation, spacing)
- Maintains JSON structure and key ordering
- Respects Prettier configuration if present
- Minimizes git merge conflicts
- Updates only changed keys

**Example**:

**Existing es-419.json**:
```json
{
  "common": {
    "save": "Guardar",
    "cancel": "Cancelar"
  }
}
```

**Delta to inject**:
```json
{
  "common": {
    "save": "Guardar Cambios",  // Updated
    "close": "Cerrar"            // New
  }
}
```

**Result es-419.json**:
```json
{
  "common": {
    "save": "Guardar Cambios",   // Updated in place
    "cancel": "Cancelar",         // Unchanged, preserved
    "close": "Cerrar"             // Added
  }
}
```

**Git-friendly approach**:
- Only modified lines show in git diff
- No unnecessary whitespace changes
- Preserves comments (if using JSON5)
- Maintains key order

---

## File Structure & Organization

### Our Project Structure

```
multilingual-education-app/
└── frontend/
    ├── src/
    │   ├── locales/                   # Translation files
    │   │   ├── en.json                # Source locale (English)
    │   │   ├── es-419.json            # Latin American Spanish
    │   │   ├── ko.json                # Korean
    │   │   ├── zh-CN.json             # Simplified Chinese
    │   │   ├── fr.json                # French
    │   │   ├── de.json                # German
    │   │   └── ja.json                # Japanese
    │   │
    │   ├── i18n.ts                    # i18next configuration
    │   └── main.tsx                   # Initializes i18n
    │
    ├── public/
    │   └── locales/                   # Alternative: Serve as static assets
    │
    ├── i18n.json                      # Lingo.dev configuration
    ├── i18n.lock                      # Translation fingerprints
    └── package.json                   # Dependencies
```

### Translation File Format

**Hierarchical JSON structure**:

```json
{
  "namespace": {
    "category": {
      "key": "Translation value",
      "keyWithVariables": "Hello, {{name}}!",
      "pluralization_one": "{{count}} item",
      "pluralization_other": "{{count}} items"
    }
  }
}
```

**Example for our app**:

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
    "stats": {
      "level": "Level",
      "xp": "XP",
      "coins": "Coins",
      "streak_one": "{{count}} day streak",
      "streak_other": "{{count}} day streak"
    }
  },
  "reading": {
    "generateStory": "Generate Story",
    "settings": {
      "language": "Language",
      "gradeLevel": "Grade Level",
      "storyLength": "Story Length",
      "theme": "Theme",
      "humorLevel": "Humor Level"
    }
  },
  "pet": {
    "actions": {
      "feed": "Feed",
      "play": "Play",
      "clean": "Clean"
    },
    "stats": {
      "happiness": "Happiness",
      "hunger": "Hunger",
      "health": "Health"
    }
  },
  "common": {
    "buttons": {
      "save": "Save",
      "cancel": "Cancel",
      "confirm": "Confirm",
      "back": "Back",
      "next": "Next",
      "close": "Close"
    },
    "loading": "Loading...",
    "error": "An error occurred"
  },
  "errors": {
    "userLoadFailed": "Failed to load user data",
    "storyGenerationFailed": "Failed to generate story",
    "networkError": "Network error occurred",
    "invalidInput": "Please check your input"
  }
}
```

---

## Bucket System

### What are Buckets?

Buckets define **which files to translate** and **what parser to use**.

### Available Bucket Types

| Bucket Type | File Extension | Description | Example |
|-------------|----------------|-------------|---------|
| `json` | `.json` | Standard JSON files | `locales/[locale].json` |
| `typescript` | `.ts`, `.tsx` | TypeScript source files | `i18n/[locale].ts` |
| `markdown` | `.md` | Markdown documentation | `docs/[locale]/README.md` |
| `yaml` | `.yml`, `.yaml` | YAML configuration | `config/[locale].yml` |
| `xliff` | `.xlf`, `.xliff` | XLIFF translation files | `translations/[locale].xlf` |

### Our Bucket Configuration

```json
{
  "buckets": {
    "json": {
      "include": ["locales/[locale].json"],
      "exclude": []
    }
  }
}
```

**Explanation**:
- **Bucket name**: `json` (determines parser)
- **Include pattern**: `locales/[locale].json`
  - `[locale]` is a **required placeholder** for JSON buckets
  - Matches: `locales/en.json`, `locales/es-419.json`, etc.
- **Exclude**: None (could exclude test files, backups, etc.)

### Advanced Bucket Examples

**Multiple include patterns**:
```json
{
  "buckets": {
    "json": {
      "include": [
        "locales/[locale].json",
        "i18n/[locale]/translations.json"
      ],
      "exclude": [
        "locales/test/*.json",
        "**/*.backup.json"
      ]
    }
  }
}
```

**TypeScript files** (alternative to JSON):
```json
{
  "buckets": {
    "typescript": {
      "include": ["i18n/[locale].ts"]
    }
  }
}
```

Example TypeScript locale file:
```typescript
// i18n/en.ts
export default {
  app: {
    title: 'Reading Quest',
  },
  nav: {
    dashboard: 'Dashboard',
  },
} as const;
```

---

## Delta Calculation & Optimization

### How Hashing Works

**SHA-256 Algorithm**:
```
"Welcome back!" → SHA-256 → "a1b2c3d4e5f6g7h8..."
```

**Stored in i18n.lock**:
```json
{
  "version": "1.0.0",
  "sourceLocale": "en",
  "fingerprints": {
    "en": {
      "dashboard.welcome": "a1b2c3d4e5f6g7h8...",
      "common.save": "b2c3d4e5f6g7h8i9..."
    }
  }
}
```

### Change Detection Logic

```
┌──────────────────────────────────────────────────────────┐
│  Current en.json         vs.      i18n.lock              │
├──────────────────────────────────────────────────────────┤
│  "dashboard.welcome"              "dashboard.welcome"    │
│  Hash: "a1b2c3d4..."              Hash: "a1b2c3d4..."    │
│  Status: UNCHANGED ✓              → Skip translation     │
├──────────────────────────────────────────────────────────┤
│  "common.save"                    "common.save"          │
│  Hash: "NEW_HASH"                 Hash: "OLD_HASH"       │
│  Status: MODIFIED ✗               → Translate            │
├──────────────────────────────────────────────────────────┤
│  "common.close"                   (not found)            │
│  Hash: "z9y8x7w6..."              -                      │
│  Status: NEW ✗                    → Translate            │
├──────────────────────────────────────────────────────────┤
│  (not found)                      "common.delete"        │
│  -                                Hash: "c3d4e5f6..."    │
│  Status: DELETED ✗                → Remove from targets  │
└──────────────────────────────────────────────────────────┘
```

### Cost Optimization Examples

**Scenario 1: Initial translation**
- Strings: 200
- Target languages: 6
- API calls: 200 × 6 = 1,200 strings
- Cost: ~$2.40 (at $0.002/string)

**Scenario 2: Incremental update (10% changed)**
- Changed strings: 20
- Target languages: 6
- API calls: 20 × 6 = 120 strings
- Cost: ~$0.24
- **Savings**: 90%

**Scenario 3: Adding new language**
- Existing strings: 200
- New language: 1
- API calls: 200 × 1 = 200 strings
- Cost: ~$0.40
- **Note**: Only translates to new language, not all languages

---

## Integration with Our Monorepo

### Monorepo Structure

```
multilingual-education-app/
├── frontend/              # React + Vite + TypeScript
│   ├── i18n.json         # Lingo.dev config
│   ├── i18n.lock         # Fingerprints
│   └── src/
│       └── locales/      # Translation files
│
├── backend/               # Node.js + Express
│   └── (no localization needed)
│
└── docs/                  # Documentation
    └── lingo/             # Lingo.dev guides
```

### Lingo.dev Scope

**In scope for Lingo.dev**:
- Frontend UI strings only
- React component labels
- Error messages
- Navigation items
- Form validation messages

**Out of scope**:
- Backend API responses (handled server-side if needed)
- Story content (handled by Azure OpenAI)
- Language blending system (custom logic)

### Running Lingo.dev in Monorepo

Always run from frontend directory:

```bash
cd multilingual-education-app/frontend
npx lingo.dev@latest run
```

**Why?** `i18n.json` is located in frontend directory, and paths are relative to that location.

---

## Translation Memory

### i18n.lock File

The `i18n.lock` file serves as translation memory, storing fingerprints of all translatable content.

**Structure**:
```json
{
  "version": "1.0.0",
  "sourceLocale": "en",
  "targetLocales": ["es-419", "ko", "zh-CN", "fr", "de", "ja"],
  "fingerprints": {
    "en": {
      "app.title": "550e8400e29b41d4a716446655440000",
      "app.tagline": "e29b41d4a716446655440000550e8400",
      "nav.dashboard": "41d4a716446655440000550e8400e29b"
    }
  },
  "lastUpdated": "2024-10-24T12:00:00Z"
}
```

### Benefits

1. **Incremental updates**: Only translate what changed
2. **Cost savings**: Reduce API calls by 90%+
3. **Version control**: Track translation history
4. **Rollback capability**: Revert to previous state if needed

### Best Practices

**Always commit i18n.lock**:
```bash
git add i18n.lock src/locales/*.json
git commit -m "Update translations"
```

**Never edit i18n.lock manually** - it's auto-generated by the CLI.

**Delete i18n.lock to force re-translation**:
```bash
rm i18n.lock
npx lingo.dev@latest run  # Re-translates everything
```

---

## Performance Optimization

### Parallel Processing

Lingo.dev translates multiple target languages concurrently:

```
┌─────────────────────────────────────────────┐
│  English source (1 file)                    │
└──────────────┬──────────────────────────────┘
               │
               ├─→ Spanish   (concurrent) ─┐
               ├─→ Korean    (concurrent) ─┤
               ├─→ Chinese   (concurrent) ─┤
               ├─→ French    (concurrent) ─┼─→ Write to disk
               ├─→ German    (concurrent) ─┤
               └─→ Japanese  (concurrent) ─┘
```

**Benefit**: 6 languages translated in ~same time as 1 language

### Caching

**On-disk cache**: `i18n.lock` serves as persistent cache
**In-memory cache**: CLI caches unchanged translations during run

### Network Resilience

**Exponential backoff**:
```
Attempt 1: Send request
↓ (fail)
Wait 1 second
Attempt 2: Retry
↓ (fail)
Wait 2 seconds
Attempt 3: Retry
↓ (fail)
Wait 4 seconds
Attempt 4: Retry
↓ (success)
Continue
```

### Batching

**Small batches**: Lingo.dev sends multiple keys per API call
**Benefit**: Fewer API requests, lower latency

**Example**:
```
Instead of:
  50 API calls × 1 key each = 50 requests

Lingo.dev does:
  5 API calls × 10 keys each = 5 requests
```

---

## Summary

### Key Takeaways

1. **5-step pipeline**: Discovery → Cleaning → Delta → Localization → Injection
2. **Incremental updates**: Only translate changed content (90% cost savings)
3. **Git-friendly**: Minimal diffs, preserves formatting
4. **Concurrent processing**: Translate multiple languages in parallel
5. **Resilient**: Automatic retry with exponential backoff
6. **Developer-first**: Minimal configuration, automatic workflow

### Architecture Benefits

- **Fast**: Delta calculation + parallel processing
- **Cost-effective**: Only pay for changed content
- **Reliable**: Retry logic + error handling
- **Maintainable**: Clean file structure + version control
- **Scalable**: Add languages without rewriting code

---

## Next Steps

1. Review [implementation-guide.md](./implementation-guide.md) for setup instructions
2. Check [supported-locales.md](./supported-locales.md) for language options
3. Implement the PRP in `/PRPs/fullstack/lingo-implementation.md`
