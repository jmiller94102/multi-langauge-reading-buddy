name: "Multilingual Reading Comprehension Webapp - PRP (Product Requirements Prompt)"
description: |

## Purpose
Create an immersive, single-page reading comprehension webapp that helps children (3rd-6th grade) practice reading skills while progressively learning Korean through AI-generated content and interactive quizzes.

## Core Principles
1. **Single-Page Immersion**: Fixed layout with dynamic content to eliminate context switching
2. **Progressive Language Learning**: Gradual English-to-Korean transition through 10-level progression system
3. **AI-Powered Content**: Azure OpenAI generates age-appropriate reading passages with embedded vocabulary
4. **Immersive Theming**: Dynamic skin themes (Space, Jungle, Deep Sea, Minecraft, Tron) change visual experience
5. **Child Safety**: Multi-layer content validation and grade-appropriate guardrails
6. **Educational Standards**: CrewAI agent validates content meets learning objectives

---

## Goal
Build a single-page webapp that makes reading comprehension engaging through immersive themes, progressive Korean language integration, and AI-generated content that adapts to individual learning preferences and grade levels.

## Why
- **Language Learning Gap**: Traditional methods don't progressively introduce secondary languages in reading contexts
- **Engagement Through Immersion**: Static educational apps lack visual appeal; dynamic theming maintains interest
- **Context Switching Problems**: Multi-page apps lose focus; single-page design maintains learning flow
- **Personalized Content**: AI generation allows infinite content variation while meeting specific educational requirements
- **Measurable Progress**: Gamification with detailed analytics provides clear learning progression indicators

## What
A React TypeScript single-page application with fixed layout components, dynamic theming system, AI content generation, and progressive multilingual learning capabilities.

### Success Criteria
- [ ] Single-page application with fixed layout components (no page navigation)
- [ ] 10-level progressive English-to-Korean language blending system functional
- [ ] AI content generation creates grade-appropriate passages with custom vocabulary
- [ ] Multiple immersive skin themes change visual experience without affecting functionality
- [ ] Quiz system supports both multiple choice and fill-in-blank questions
- [ ] Left/right sidebars auto-hide and show with tab-based navigation
- [ ] Center reading container has independent scroll functionality
- [ ] Generated images appear related to passage content within skin theme
- [ ] Content validation ensures 3rd-6th grade appropriateness
- [ ] Progress persistence through localStorage with detailed analytics

## All Needed Context

### Documentation & References
```yaml
# MUST READ - Primary UI/UX Inspiration
- file: /Users/joromini/Documents/pyprojects/crewai/gitclone/renzo/reading_app/example_projects/b44_example
  why: Primary UI skeleton and layout patterns for single-page application
  critical: Fixed component positioning, sidebar behavior, responsive design

- file: /Users/joromini/Documents/pyprojects/crewai/gitclone/renzo/reading_app/example_projects/surfsense_reference_analysis/azure-llm-config-patterns.md
  why: Azure OpenAI integration patterns and LLM configuration management
  critical: User-specific LLM configs, API error handling, secure token management

- file: /Users/joromini/Documents/pyprojects/crewai/gitclone/renzo/reading_app/example_projects/surfsense_reference_analysis/performance-optimization-patterns.md
  why: Performance patterns for React applications with dynamic content
  critical: Memoization, efficient re-renders, animation optimization

- file: /Users/joromini/Documents/pyprojects/crewai/gitclone/renzo/reading_app/example_projects/surfsense_reference_analysis/sidebar-navigation-patterns.md
  why: Auto-hide sidebar implementation and tab-based navigation
  critical: Collapsible behavior, state management, responsive design

- file: /Users/joromini/Documents/pyprojects/crewai/gitclone/renzo/reading_app/example_projects/loveable_example/read-lingo-quest/src/components/ReadingPassage.tsx
  why: Reading interface patterns and interactive content display
  critical: Content presentation, user engagement, progress tracking

# EXTERNAL DOCUMENTATION
- url: https://docs.microsoft.com/en-us/azure/cognitive-services/openai/
  why: Azure OpenAI API documentation for content generation
  section: Chat completions, content filtering, prompt engineering best practices

- url: https://react.dev/reference/react/useMemo
  why: Performance optimization for expensive operations
  critical: Memoizing AI-generated content, theme calculations, language processing

- url: https://tailwindcss.com/docs/responsive-design
  why: Responsive design for fixed layout components
  section: Breakpoints, container queries, dynamic sizing

- url: https://www.framer.com/motion/
  why: Animation library for theme transitions and celebratory effects
  section: Layout animations, gesture recognition, spring animations
```

### Current Codebase tree
```bash
reading_app/
├── example_projects/
│   ├── b44_example/                        # PRIMARY UI inspiration
│   ├── loveable_example/read-lingo-quest/  # React/TypeScript patterns
│   └── surfsense_reference_analysis/       # Performance & LLM patterns
├── .claude/
│   └── commands/                           # PRP generation commands
├── children_game/                          # Existing prototype (reference only)
├── CLAUDE.md                               # Updated project guidelines
└── product_requirements_document.md        # This document
```

### Desired Codebase tree - Single Page Webapp
```bash
reading_webapp/
├── public/
│   ├── index.html
│   ├── manifest.json
│   └── assets/
│       ├── themes/                    # Theme-specific backgrounds
│       │   ├── space/                 # Space theme assets
│       │   ├── jungle/                # Jungle theme assets
│       │   ├── deep-sea/              # Deep sea theme assets
│       │   ├── minecraft/             # Minecraft theme assets
│       │   └── tron/                  # Tron theme assets
│       └── sounds/                    # Audio feedback files
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── TopBar.tsx             # Gamification bar (points, level, progress)
│   │   │   ├── LeftSidebar.tsx        # Settings, Reading config, Themes
│   │   │   ├── RightSidebar.tsx       # Quiz, Vocabulary tools
│   │   │   └── MainLayout.tsx         # Single-page layout coordinator
│   │   ├── reading/
│   │   │   ├── ReadingContainer.tsx   # Scrollable reading passage container
│   │   │   ├── PassageDisplay.tsx     # Themed content renderer
│   │   │   ├── GenerateButton.tsx     # AI content generation trigger
│   │   │   └── ImageDisplay.tsx       # Generated passage images
│   │   ├── quiz/
│   │   │   ├── QuizContainer.tsx      # Scrollable quiz container
│   │   │   ├── MultipleChoice.tsx     # MC question component
│   │   │   ├── FillInBlank.tsx        # Fill-in-blank component
│   │   │   └── QuizProgress.tsx       # Quiz completion tracking
│   │   ├── settings/
│   │   │   ├── ReadingSettings.tsx    # Passage config (length, theme, difficulty)
│   │   │   ├── LanguageSettings.tsx   # English/Korean progression slider
│   │   │   ├── ThemeSelector.tsx      # Skin theme selection
│   │   │   └── LLMSettings.tsx        # AI provider configuration
│   │   ├── vocabulary/
│   │   │   ├── VocabularyPanel.tsx    # Word definitions and search
│   │   │   ├── WordSearch.tsx         # Free-form word lookup
│   │   │   └── DefinitionDisplay.tsx  # Definition, synonym, antonym display
│   │   ├── themes/
│   │   │   ├── ThemeProvider.tsx      # Dynamic theme system
│   │   │   ├── SkinRenderer.tsx       # Background/frame theming
│   │   │   └── CelebrationOverlay.tsx # Full-screen celebrations
│   │   └── agents/
│   │       ├── ContentValidator.tsx    # CrewAI content validation agent
│   │       └── ProgressTracker.tsx     # Achievement and progress logic
│   ├── hooks/
│   │   ├── useAzureLLM.ts             # Azure OpenAI integration
│   │   ├── useLanguageBlending.ts     # English-Korean progressive mixing
│   │   ├── useThemeSystem.ts          # Dynamic theming
│   │   ├── useLocalStorage.ts         # Progress persistence
│   │   └── useContentGeneration.ts    # AI content orchestration
│   ├── utils/
│   │   ├── promptEngineering.ts       # LLM prompt templates
│   │   ├── languageProgression.ts     # 10-level language blending logic
│   │   ├── contentValidation.ts       # Grade-level and safety filtering
│   │   ├── vocabularyIntegration.ts   # Custom word embedding in passages
│   │   └── imageGeneration.ts         # AI image generation for passages
│   ├── types/
│   │   ├── content.ts                 # Reading passage, quiz question types
│   │   ├── language.ts                # Multilingual content structures
│   │   ├── themes.ts                  # Skin theme definitions
│   │   ├── settings.ts                # User configuration types
│   │   └── progress.ts                # Achievement and progress types
│   ├── App.tsx                        # Single-page root component
│   └── main.tsx                       # Application entry point
├── package.json
├── vite.config.ts
├── tailwind.config.js                 # Dynamic theming configuration
├── tsconfig.json
└── README.md
```

### Known Gotchas & Critical Requirements
```typescript
// CRITICAL: Single-page application constraints
// Example: No React Router - all navigation through state management
// Example: Fixed layout positions - only content within containers changes
// Example: Theme changes must not affect component positioning or functionality

// MULTILINGUAL COMPLEXITY: Progressive language blending
// Example: Korean Hangul rendering requires proper font support and character encoding
// Example: Text direction and line-height adjustments for mixed scripts
// Example: Quiz questions must reflect language used in passage while maintaining comprehension focus

// AZURE LLM INTEGRATION: Content generation requirements
// Example: Prompt engineering must balance educational goals with vocabulary integration
// Example: Content validation pipeline: Grade-level → Safety → Vocabulary → Educational objectives
// Example: Rate limiting and error handling for AI API calls during content generation

// THEME SYSTEM: Dynamic visual changes without functional impact
// Example: Background images and frames change, but scroll containers and interaction areas remain identical
// Example: Animation transitions between themes must not interfere with reading or quiz interactions
// Example: Generated images must fit within theme aesthetic while remaining content-relevant

// CHILD SAFETY: Multi-layer content validation
// Example: Grade-level appropriateness (3rd-6th) must be validated by CrewAI agent
// Example: No external links, API calls only to configured LLM providers
// Example: Progress data stored locally only - no external data transmission without explicit consent
```

## Implementation Blueprint

### Data models and structure

Create core data models for multilingual reading comprehension webapp with AI content generation.

```typescript
// Core Application State
interface AppState {
  user: UserProfile;
  settings: AppSettings;
  content: ContentState;
  ui: UIState;
}

interface UserProfile {
  gradeLevel: '3rd' | '4th' | '5th' | '6th';
  languageProgress: number; // 0-100 (English to Korean progression)
  points: number;
  level: number;
  achievements: Achievement[];
  streak: number;
  sessionHistory: ReadingSession[];
}

interface AppSettings {
  // Reading Configuration
  passageLength: number; // 250-2000 words in 250-word increments
  passageTheme: string; // Free-form text for AI generation
  humorLevel: number; // 1-3 scale (Subtle to Insanely Funny)
  vocabularyWords: string[]; // Custom vocabulary to prioritize in passages

  // Quiz Configuration
  multipleChoiceCount: number; // 1-10
  fillInBlankCount: number; // 1-10
  quizDifficulty: 'Basic' | 'Intermediate' | 'Challenging';

  // Language & Localization
  primaryLanguage: 'English';
  secondaryLanguage: 'Korean';
  languageBlendLevel: number; // 0-10 (0=100% English, 10=100% Korean)

  // Theme & UI
  skinTheme: 'Space' | 'Jungle' | 'DeepSea' | 'Minecraft' | 'Tron';

  // AI Configuration
  llmProvider: 'azure' | 'openai' | 'claude';
  imageGenerator: 'dalle' | 'midjourney' | 'stable-diffusion';
}

interface ContentState {
  currentPassage: {
    text: string;
    wordCount: number;
    languageBlend: LanguageBlendInfo;
    generatedImage: string | null;
    vocabularyUsed: string[];
    readingTime: number; // estimated minutes
  };
  quiz: {
    questions: QuizQuestion[];
    currentQuestion: number;
    answers: Record<number, string | number>;
    completed: boolean;
    score: QuizScore;
  };
  vocabulary: {
    definitions: Record<string, WordDefinition>;
    searchHistory: string[];
  };
}

interface QuizQuestion {
  id: string;
  type: 'multiple-choice' | 'fill-in-blank';
  question: string; // In English (directions)
  content: string; // May be mixed language based on passage
  options?: string[]; // For MC questions, reflects passage language
  correctAnswer: string | number;
  explanation: string;
  difficulty: 'Basic' | 'Intermediate' | 'Challenging';
}

interface LanguageBlendInfo {
  englishPercentage: number;
  koreanPercentage: number;
  blendStrategy: {
    nouns: 'english' | 'korean' | 'mixed';
    verbs: 'english' | 'korean' | 'mixed';
    sentences: 'alternating' | 'random' | 'progressive';
  };
}

interface WordDefinition {
  word: string;
  definition: string;
  synonyms: string[];
  antonyms: string[];
  partOfSpeech: string;
  exampleSentence: string;
}
```

### List of tasks to be completed in order

```yaml
Task 1:
CREATE reading_webapp/ directory structure:
  - INITIALIZE new React TypeScript project with Vite
  - CONFIGURE package.json with dependencies: framer-motion, @azure/openai, react-query
  - SETUP Tailwind CSS with dynamic theme configuration
  - REFERENCE: example_projects/b44_example for base UI patterns

Task 2:
CREATE core type definitions in src/types/:
  - content.ts: Reading passages, quiz questions, language blending structures
  - settings.ts: User configuration, LLM settings, theme selections
  - progress.ts: User profile, achievements, session tracking
  - themes.ts: Skin theme definitions and asset mappings

Task 3:
CREATE single-page layout system in src/components/layout/:
  - MainLayout.tsx: Fixed positioning coordinator for all components
  - TopBar.tsx: Gamification elements (points, level, progress bar)
  - LeftSidebar.tsx: Tabbed interface with Reading settings, Language settings, Theme selector
  - RightSidebar.tsx: Tabbed interface with Quiz container, Vocabulary tools

Task 4:
CREATE theme system in src/components/themes/:
  - ThemeProvider.tsx: Dynamic theme state management and CSS variable injection
  - SkinRenderer.tsx: Background image and frame rendering based on selected theme
  - CelebrationOverlay.tsx: Full-screen immersive celebration animations
  - REFERENCE: Framer Motion for smooth theme transitions

Task 5:
CREATE Azure LLM integration in src/hooks/useAzureLLM.ts:
  - IMPLEMENT content generation with prompt engineering for educational content
  - ADD error handling, rate limiting, and content validation pipeline
  - INCLUDE grade-level filtering and vocabulary integration requirements
  - REFERENCE: example_projects/surfsense_reference_analysis/azure-llm-config-patterns.md

Task 6:
CREATE language blending system in src/utils/languageProgression.ts:
  - IMPLEMENT 10-level progression from 100% English to 100% Korean
  - CREATE blending strategies: noun replacement → verb inclusion → sentence alternation
  - ADD Hangul font support and proper text rendering for mixed scripts
  - ENSURE quiz questions reflect passage language while maintaining English directions

Task 7:
CREATE reading interface in src/components/reading/:
  - ReadingContainer.tsx: Scrollable container with independent scroll from page
  - PassageDisplay.tsx: Themed content renderer with proper typography
  - GenerateButton.tsx: AI content generation trigger with loading states
  - ImageDisplay.tsx: Generated image integration within theme aesthetic

Task 8:
CREATE quiz system in src/components/quiz/:
  - QuizContainer.tsx: Scrollable quiz interface optimized for space efficiency
  - MultipleChoice.tsx: MC questions with language-appropriate options
  - FillInBlank.tsx: Fill-in-blank component with text input validation
  - QuizProgress.tsx: Real-time progress tracking and score calculation

Task 9:
CREATE vocabulary tools in src/components/vocabulary/:
  - VocabularyPanel.tsx: Key words from passage with definitions
  - WordSearch.tsx: Free-form search with definition/synonym/antonym buttons
  - DefinitionDisplay.tsx: Expandable definitions with examples and context

Task 10:
CREATE content validation agent in src/components/agents/ContentValidator.tsx:
  - IMPLEMENT CrewAI agent for multi-layer content validation
  - VALIDATE grade-level appropriateness, safety, vocabulary integration
  - ENSURE educational objectives are met in generated content
  - ADD feedback loop for content regeneration if validation fails

Task 11:
CREATE progress persistence in src/hooks/useLocalStorage.ts:
  - IMPLEMENT comprehensive progress tracking with achievements
  - STORE user settings, reading history, and learning analytics
  - ENSURE data privacy compliance and local-only storage
  - ADD export/import functionality for progress backup

Task 12:
CREATE settings interface in src/components/settings/:
  - ReadingSettings.tsx: Passage length, theme, humor level, vocabulary input
  - LanguageSettings.tsx: 10-level English/Korean progression slider
  - ThemeSelector.tsx: Visual theme selection with preview
  - LLMSettings.tsx: AI provider configuration and content generation settings
```

### Per task pseudocode for complex tasks

```typescript
// Task 5: Azure LLM Integration with Content Validation
const useAzureLLM = () => {
  const generatePassage = async (settings: AppSettings): Promise<ContentState> => {
    // CRITICAL: Prompt engineering for educational content
    const prompt = buildEducationalPrompt(settings);

    try {
      const response = await azureClient.chat.completions.create({
        model: "gpt-4",
        messages: [
          { role: "system", content: EDUCATIONAL_SYSTEM_PROMPT },
          { role: "user", content: prompt }
        ],
        temperature: settings.humorLevel * 0.3,
      });

      const rawContent = response.choices[0].message.content;

      // PATTERN: Multi-layer validation pipeline
      const validatedContent = await validateContent(rawContent, settings);
      const blendedContent = applyLanguageBlending(validatedContent, settings.languageBlendLevel);

      return {
        passage: blendedContent,
        quiz: await generateQuiz(blendedContent, settings),
        image: await generatePassageImage(blendedContent, settings.skinTheme)
      };
    } catch (error) {
      // GOTCHA: Graceful fallback for API failures
      return getFallbackContent(settings.gradeLevel);
    }
  };
};

// Task 6: Language Blending System
const applyLanguageBlending = (text: string, level: number): string => {
  // CRITICAL: Progressive language introduction strategy
  const blendStrategies = {
    0: () => text, // 100% English
    1: () => replaceNouns(text, 0.1), // 90% English - some Korean nouns
    2: () => replaceNouns(text, 0.2), // 80% English - more Korean nouns
    3: () => replaceNounsAndVerbs(text, 0.3), // 70% English - nouns + verbs
    4: () => replaceSentences(text, 0.4), // 60% English - some Korean sentences
    5: () => alternateSentences(text), // 50/50 alternating sentences
    6: () => replaceSentencesWithMixedNouns(text, 0.6), // 40% English
    // ... continue to level 10 (100% Korean)
  };

  // PATTERN: Ensure proper Hangul rendering and text flow
  const blendedText = blendStrategies[level]();
  return formatMixedLanguageText(blendedText);
};

// Task 10: Content Validation Agent (CrewAI Integration)
const ContentValidator = {
  async validateContent(content: string, settings: AppSettings): Promise<ValidationResult> {
    // CRITICAL: Multi-agent validation approach
    const validationTasks = [
      gradeAppropriateness(content, settings.gradeLevel),
      safetyCheck(content),
      vocabularyIntegration(content, settings.vocabularyWords),
      educationalValue(content, settings.gradeLevel)
    ];

    const results = await Promise.all(validationTasks);

    // PATTERN: All validations must pass
    const isValid = results.every(result => result.passed);

    if (!isValid) {
      // GOTCHA: Provide specific feedback for regeneration
      return {
        valid: false,
        feedback: results.filter(r => !r.passed).map(r => r.feedback),
        suggestions: generateImprovementSuggestions(results)
      };
    }

    return { valid: true, confidence: calculateConfidenceScore(results) };
  }
};

// Task 3: Single-Page Layout with Fixed Positioning
const MainLayout = () => {
  // CRITICAL: Fixed positions that never change regardless of content/theme
  return (
    <div className="h-screen w-screen overflow-hidden">
      {/* FIXED: Top bar always at top */}
      <TopBar className="fixed top-0 left-0 right-0 h-16 z-50" />

      <div className="flex pt-16 h-full">
        {/* FIXED: Left sidebar position, content changes */}
        <LeftSidebar
          className="fixed left-0 top-16 bottom-0 w-80 z-40"
          isVisible={leftSidebarOpen}
        />

        {/* DYNAMIC: Center content area adjusts to sidebar states */}
        <main
          className={`flex-1 transition-all duration-300 ${
            leftSidebarOpen ? 'ml-80' : 'ml-0'
          } ${rightSidebarOpen ? 'mr-80' : 'mr-0'}`}
        >
          {/* CRITICAL: Independent scroll container */}
          <ReadingContainer className="h-full overflow-y-auto" />
        </main>

        {/* FIXED: Right sidebar position, content changes */}
        <RightSidebar
          className="fixed right-0 top-16 bottom-0 w-80 z-40"
          isVisible={rightSidebarOpen}
        />
      </div>

      {/* OVERLAY: Theme-specific backgrounds and celebrations */}
      <ThemeRenderer />
      <CelebrationOverlay />
    </div>
  );
};
```

### Integration Points
```yaml
AZURE_LLM:
  - provider: Azure OpenAI with GPT-4 for content generation
  - configuration: User-specific API keys and model preferences
  - validation: Multi-layer content filtering and educational standards compliance
  - fallback: Local content library for offline/error scenarios

THEME_SYSTEM:
  - assets: Static background images per theme (space, jungle, deep-sea, minecraft, tron)
  - rendering: CSS custom properties for dynamic theme switching
  - animations: Framer Motion for smooth theme transitions without layout shifts
  - images: AI-generated passage illustrations integrated within theme aesthetic

LANGUAGE_PROCESSING:
  - fonts: Google Fonts with Korean Hangul support (Noto Sans KR)
  - encoding: UTF-8 with proper Korean text rendering and line-height adjustments
  - blending: Progressive English-to-Korean integration with 10-level granularity
  - validation: Text direction and readability checks for mixed-script content

STORAGE:
  - method: localStorage with JSON serialization for all user data
  - encryption: Base64 encoding for sensitive settings (API keys)
  - persistence: Auto-save on every user interaction and setting change
  - privacy: Local-only storage, no external data transmission during normal operation

PERFORMANCE:
  - optimization: useMemo for expensive language processing operations
  - lazy_loading: Dynamic imports for theme assets and AI model calls
  - caching: Memoized content generation results and vocabulary lookups
  - monitoring: Performance tracking for theme switching and content generation
```

## Validation Loop

### Level 1: Syntax & Style
```bash
# Run these FIRST - fix any errors before proceeding
npm run lint                         # ESLint for code quality
npm run type-check                   # TypeScript checking
npm run format                       # Prettier formatting

# Expected: No errors. If errors, READ the error and fix.
```

### Level 2: Unit Tests
```typescript
// CREATE test files for each component with multilingual webapp test cases:
describe('ReadingComprehensionWebapp', () => {
  test('generates grade-appropriate passages', async () => {
    const passage = await generatePassage('4th', 500, 3, 'Space');
    expect(passage.gradeLevel).toBe('4th');
    expect(passage.wordCount).toBeGreaterThanOrEqual(400);
    expect(passage.wordCount).toBeLessThanOrEqual(600);
  });

  test('blends languages at correct levels', () => {
    const text = blendLanguages("Hello world", 5);
    expect(text).toContain("안녕하세요"); // Should have some Korean
    expect(text).toContain("world"); // Should retain some English
  });

  test('validates content safety for children', async () => {
    const content = await generateContent({ topic: "space exploration" });
    const validation = await validateContent(content);
    expect(validation.isChildSafe).toBe(true);
    expect(validation.gradeLevel).toMatch(/^(3rd|4th|5th|6th)$/);
  });

  test('theme switching preserves layout', () => {
    const { rerender } = render(<App theme="Space" />);
    const layout = screen.getByTestId('main-layout');
    rerender(<App theme="Jungle" />);
    expect(layout).toHaveClass('grid-layout'); // Layout structure unchanged
  });
});
```

```bash
# Run and iterate until passing:
npm test -- --coverage
# If failing: Read error, understand root cause, fix code, re-run
```

### Level 3: Integration Tests
```bash
# Start the development server
npm run dev

# Manual testing checklist:
# 1. Single-page layout loads correctly with all 4 sections visible
# 2. Language blend slider transitions smoothly 0→10
# 3. Theme switching animates without breaking layout
# 4. Azure LLM integration generates age-appropriate content
# 5. Quiz questions match passage content accurately

# Multilingual testing:
# 6. Korean Hangul renders correctly across all browsers
# 7. Mixed-script text maintains proper readability and line height
# 8. Language progression feels natural and educational
# 9. Font switching between Latin and Korean scripts is seamless

# Performance testing:
# 10. Content generation completes within 10 seconds
# 11. Theme transitions complete within 500ms
# 12. localStorage saves all settings immediately
```

## Final validation Checklist
- [ ] All tests pass: `npm test`
- [ ] No linting errors: `npm run lint`
- [ ] No type errors: `npm run type-check`
- [ ] Performance: Content generation under 10 seconds
- [ ] Accessibility: WCAG AA compliance for educational content
- [ ] Content safety: All AI-generated content filtered through CrewAI
- [ ] Multilingual: Korean Hangul displays correctly across devices
- [ ] Progress saves: localStorage persistence working correctly
- [ ] Themes: All 5 skin themes load and animate properly

---

## Anti-Patterns to Avoid
- ❌ Don't create multiple pages or navigation (single-page requirement)
- ❌ Don't use complex Korean grammar beyond beginner level
- ❌ Don't ignore content filtering for AI-generated material
- ❌ Don't store API keys in plain text (use base64 encoding)
- ❌ Don't break fixed layout positions during theme changes
- ❌ Don't generate content without grade-level validation
- ❌ Don't use themes that might distract from learning content
- ❌ Don't create language blending that confuses rather than teaches

## Special Considerations for Multilingual Learning App
- **Progressive Learning**: Language blending must feel natural, not jarring
- **Content Safety**: Double validation for AI-generated educational material
- **Cultural Sensitivity**: Korean content should be culturally appropriate
- **Fixed Layout**: Single-page design eliminates context switching confusion
- **Theme Integration**: Visual themes enhance engagement without hindering comprehension
- **Grade Alignment**: All content must match specified educational standards (3rd-6th grade)