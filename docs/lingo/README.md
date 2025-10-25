# Lingo.dev Integration Guide

## Overview

This directory contains comprehensive documentation for integrating **Lingo.dev** into the Reading Quest multilingual education app. Lingo.dev is an AI-powered localization platform that automates translation workflows through Git integration and CI/CD pipelines.

## Our Use Case

**Current State**: Reading Quest currently has:
- **English-only UI** (primary interface language)
- **Language Learning Content** in English + Korean/Mandarin (5-level blending system)
- Custom language blending logic for educational content

**Goal**: Expand the **UI itself** to support multiple primary languages (not just the educational content), enabling:
- Spanish-speaking parents to navigate the app in Spanish
- Korean parents to use a fully localized Korean interface
- Mandarin-speaking families to access the app in Chinese
- French, German, Japanese, and other language communities

**Important Distinction**:
- **Educational Content**: Remains dual-language (English + secondary language) with our custom blending system
- **UI/UX Localization**: NEW - All buttons, labels, instructions, error messages, etc. translated to the user's preferred language

## What Lingo.dev Provides

1. **Automated Translation Workflow**
   - Triggers translations automatically on git commits
   - Creates pull requests with translated content
   - Integrates with CI/CD pipelines

2. **AI-Powered Translation Engine**
   - Context-aware translations for accuracy
   - Customizable brand voice and terminology
   - Support for 80+ locales

3. **Developer-Friendly CLI**
   - Free, open-source tool
   - Minimal configuration required
   - Works with existing file structures

4. **Smart Delta Processing**
   - Only translates changed content (incremental updates)
   - Reduces API costs by 90%+ after initial setup
   - Maintains translation memory via `i18n.lock` file

## Documentation Structure

### Core Documentation

1. **[implementation-guide.md](./implementation-guide.md)**
   - Step-by-step setup instructions
   - Configuration examples for our React + TypeScript stack
   - Integration with existing codebase
   - Testing and validation procedures

2. **[architecture.md](./architecture.md)**
   - How Lingo.dev works (5-step workflow)
   - Technical architecture and data flow
   - Integration with our monorepo structure
   - File structure and bucket configuration

3. **[supported-locales.md](./supported-locales.md)**
   - Complete list of available languages
   - Locale code formats (ISO 639-1, BCP 47)
   - Recommended locales for our target audience
   - Regional variant considerations

4. **[migration-strategy.md](./migration-strategy.md)**
   - How to migrate from current custom system
   - Coexistence with language blending system
   - Phased rollout approach
   - Backwards compatibility considerations

## Key Benefits for Our Project

### 1. Separate Concerns
- **Lingo.dev**: UI localization (buttons, menus, labels)
- **Custom System**: Educational content blending (English + Korean/Mandarin stories)

### 2. Developer Experience
- Automatic translations on commit
- No manual translation workflow needed
- Preserves code structure and formatting
- Minimal git merge conflicts

### 3. Cost Efficiency
- Only pay for changed content (delta processing)
- Free tier: 10,000 words/month
- Paid plans start at $30/month
- Enterprise options available

### 4. Quality & Consistency
- AI-powered translations with context awareness
- Brand voice customization
- Translation memory and glossaries
- Cultural adaptation capabilities

## Quick Start

To get started with Lingo.dev integration:

```bash
# Navigate to frontend directory
cd multilingual-education-app/frontend

# Initialize Lingo.dev
npx lingo.dev@latest init

# Configure your API key (choose one)
export LINGODOTDEV_API_KEY="your-api-key"
# OR use OpenAI/Anthropic
export OPENAI_API_KEY="your-openai-key"

# Run your first translation
npx lingo.dev@latest run
```

See [implementation-guide.md](./implementation-guide.md) for detailed instructions.

## Project Scope

### In Scope
- Frontend UI localization (all React components)
- Error messages and notifications
- Form labels and validation messages
- Navigation menus and buttons
- Settings and preferences UI
- Achievement descriptions
- Shop item names and descriptions
- Quest descriptions

### Out of Scope (Handled by Existing System)
- Story content generation (Azure OpenAI)
- Language blending logic (custom 5-level system)
- Vocabulary translations (embedded in story generation)
- Educational content prompts

## Timeline Estimate

| Phase | Duration | Description |
|-------|----------|-------------|
| Phase 1 | 1-2 days | Setup, configuration, initial string extraction |
| Phase 2 | 2-3 days | Refactor components to use i18n hooks |
| Phase 3 | 1 day | Initial translation run for 3-5 languages |
| Phase 4 | 2-3 days | Testing, QA, and bug fixes |
| Phase 5 | 1 day | Documentation and team training |
| **Total** | **7-10 days** | MVP with 3-5 languages fully localized |

## Next Steps

1. Review the [implementation-guide.md](./implementation-guide.md) for detailed setup instructions
2. Review the [architecture.md](./architecture.md) to understand how it works
3. Check [supported-locales.md](./supported-locales.md) to select target languages
4. Review the PRP in `/PRPs/fullstack/` for the complete development plan

## Questions to Consider

Before implementation, discuss with the team:

1. **Which languages should we prioritize?**
   - Spanish (es-419 for Latin America, es-ES for Spain)?
   - Korean (ko)?
   - Mandarin Chinese (zh-CN or zh-TW)?
   - Others?

2. **What's our translation budget?**
   - Free tier (10,000 words/month)?
   - Paid plan ($30-$600/month)?
   - Custom enterprise pricing?

3. **How do we handle language selection?**
   - Auto-detect based on browser locale?
   - Manual language picker in settings?
   - Remember user preference in localStorage?

4. **What's our fallback strategy?**
   - Default to English if translation missing?
   - Show translation key for debugging?
   - Log missing translations for review?

## Resources

- **Lingo.dev Website**: https://lingo.dev/en
- **CLI Documentation**: https://lingo.dev/en/cli/quick-start
- **Supported Locales**: https://lingo.dev/en/cli/supported-locales
- **GitHub**: https://github.com/lingodotdev (CLI is open source)

## Contact

For questions about this integration, see the PRP document or consult the implementation guide.
