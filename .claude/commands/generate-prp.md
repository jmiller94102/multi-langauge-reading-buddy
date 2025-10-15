# Create PRP for Children's Education Game

## Feature file: $ARGUMENTS

Generate a complete PRP for children's education game feature implementation with thorough research. Ensure context is passed to the AI agent to enable self-validation and iterative refinement. Read the feature file first to understand what needs to be created, how the examples provided help, and any other considerations.

The AI agent only gets the context you are appending to the PRP and training data. Assume the AI agent has access to the codebase and the same knowledge cutoff as you, so it's important that your research findings are included or referenced in the PRP. The Agent has Websearch capabilities, so pass URLs to documentation and examples.

## Research Process

1. **Codebase Analysis** (Search ONLY these relevant sources)
   - **`example_projects_ARCHIVED/loveable_example/read-lingo-quest/`** - Modern React patterns, shadcn/ui components, reading passage display, game mechanics
   - **`reading_webapp/`** - V1 implementation patterns (multi-language, theme system, Azure OpenAI integration)
   - **`children_game_ARCHIVED/`** - Reading game patterns (story flow, quiz mechanics, browser TTS)
   - **`backend/server.js`** - Azure OpenAI integration lessons (CRITICAL: use `AzureOpenAI` not `OpenAI` class)
   - **`docs/*.md`** - Planning documents (v2-architecture.md, implementation-strategy.md, wireframes)
   - Analyze existing component structures and state management patterns
   - Check for child safety implementations (content filtering, COPPA compliance)

2. **External Research** (Only if needed for specific features)
   - React/TypeScript 2025 best practices (functional components, hooks, Context API)
   - Tailwind CSS for child-friendly UI design
   - Accessibility guidelines (WCAG AA for children ages 8-12)
   - COPPA compliance requirements (2025 amendments)
   - Educational content generation patterns
   - Tamagotchi/virtual pet state management examples (if implementing pet system)

3. **Children's App Specific Research**
   - Age-appropriate design (18px+ fonts, 44x44px touch targets, high contrast)
   - Safe content filtering patterns (Azure content filtering, profanity detection)
   - Positive reinforcement UI patterns (encouraging messages, not fear-based)
   - Audio/visual feedback for engagement (animations, sound effects)
   - Progress tracking and gamification (XP, achievements, quests)

## PRP Generation

Using the established PRP template structure:

### Critical Context to Include for AI Agent
- **Documentation**: URLs with specific sections for React 18, Vite 6, TypeScript 5.7, Tailwind CSS 3.4, shadcn/ui
- **Code Examples**: Real snippets from:
  - `loveable_example/read-lingo-quest/` - Modern UI components (shadcn/ui), reading passage display, game toolbar
  - `reading_webapp/` (V1) - Multi-language system, theme switching, Azure OpenAI integration
  - `children_game_ARCHIVED/` - Story/quiz flow, browser TTS, Framer Motion animations
- **Safety Requirements**: Content filtering, COPPA compliance (localStorage-only for MVP), privacy-first design
- **Educational Guidelines**: Age-appropriate learning objectives (grades 3-6, ages 8-12)
- **Technical Patterns**: React Context API, shadcn/ui components, memoization, code splitting, performance optimization

### Implementation Blueprint
- Start with child safety and COPPA compliance (localStorage-only MVP strategy)
- Reference modern React patterns from `loveable_example/read-lingo-quest/` (shadcn/ui components, reading passage display)
- Reference V1 implementation from `reading_webapp/src/` (multi-language system, theme switching)
- Include Azure OpenAI integration patterns from `backend/server.js` (use `AzureOpenAI` class)
- Detail educational content generation strategy (story prompts, quiz generation)
- Specify gamification system (XP, achievements, quests, virtual pet)
- Include audio/visual feedback systems (Framer Motion animations, browser TTS for MVP)

### Validation Gates (Must be Executable)
```bash
# Syntax/Style
npm run lint && npm run type-check

# Unit Tests with children's app specific testing
npm test -- --coverage

# Performance validation for children's attention spans
npm run build && npm run preview
# Manual testing: Load time < 3 seconds, responsive touch targets

# Content safety validation
npm run test:content-filter
```

*** CRITICAL AFTER YOU ARE DONE RESEARCHING AND EXPLORING THE CODEBASE BEFORE YOU START WRITING THE PRP ***

*** ULTRA-THINK ABOUT THE CHILDREN'S EDUCATION GAME PRP AND PLAN YOUR APPROACH FOCUSING ON:
1. Child safety and age-appropriate content
2. Educational value and learning objectives
3. Engaging UI/UX for young children
4. Parent controls and progress monitoring
5. Performance optimized for shorter attention spans
THEN START WRITING THE PRP ***

## Output
Save as: `PRPs/{feature-name}-children-game.md`

## Quality Checklist for Children's App PRP
- [ ] All necessary context for child-safe development included
- [ ] Validation gates are executable by AI (npm commands, manual tests)
- [ ] References example patterns (`loveable_example/read-lingo-quest/` for modern UI components)
- [ ] References V1 codebase patterns (`reading_webapp/`, `children_game_ARCHIVED/`, `backend/`)
- [ ] Clear implementation path with child-specific considerations (fonts, touch targets, colors)
- [ ] Error handling documented with age-appropriate feedback ("Try again!" not "Wrong!")
- [ ] Educational objectives clearly defined (reading comprehension, language learning)
- [ ] COPPA compliance addressed (localStorage-only for MVP, parental consent in Phase 7)
- [ ] Accessibility requirements for children specified (WCAG AA, keyboard nav, screen reader)
- [ ] Performance requirements for short attention spans addressed (<3s load time, smooth animations)

Score the PRP on a scale of 1-10 (confidence level to succeed in one-pass implementation focusing on child safety and educational value)

Remember: The goal is one-pass implementation success of a safe, educational, and engaging children's app through comprehensive context.