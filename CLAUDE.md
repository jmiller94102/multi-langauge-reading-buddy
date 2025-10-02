# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 🚨 **CRITICAL: PROJECT IDENTIFICATION FIRST**

### **MANDATORY: Identify Active Frontend BEFORE Any Changes**

**⚠️ MULTIPLE FRONTENDS EXIST - MUST VERIFY WHICH IS ACTIVE**

```bash
# STEP 1: Check which frontend is running (REQUIRED BEFORE ANY MODIFICATIONS)
/bashes  # Check all running background processes

# STEP 2: Identify the active frontend by port and output
# reading_webapp -> localhost:5173 (ACTIVE USER PROJECT)
# children_game_ARCHIVED  -> localhost:3000 (ARCHIVED - DO NOT USE)

# STEP 3: Verify active project structure
ls -la reading_webapp/               # ✅ User's main project
ls -la children_game_ARCHIVED/       # 🚫 ARCHIVED - DO NOT USE

# STEP 4: Confirm by checking package.json
cat reading_webapp/package.json | head -5               # Should show "reading_webapp"
cat children_game_ARCHIVED/package.json | head -5       # Should show "children-education-game" (ARCHIVED)
```

### **🎯 FRONTEND PROJECT MAP**

| Project | Port | Status | Purpose | Package Name |
|---------|------|--------|---------|--------------|
| **`reading_webapp`** | **5173** | **🟢 ACTIVE** | **User's main project** | `reading_webapp` |
| `children_game_ARCHIVED` | 3000 | 🚫 **ARCHIVED** | **DO NOT USE - Archived prototype** | `children-education-game` |
| `backend` | 8080 | 🟢 Service | API backend | `reading-app-backend` |

**⚠️ IMPORTANT:** The `children_game_ARCHIVED` directory is ARCHIVED. See `/children_game_ARCHIVED/README_ARCHIVED.md` for details.

### **🛡️ VERIFICATION COMMANDS (Use Before Every Modification)**

```bash
# Quick verification script - RUN THIS FIRST
echo "=== PROJECT VERIFICATION ===" && \
echo "Current directory: $(pwd)" && \
echo "Active frontend: $(if pgrep -f "5173" > /dev/null; then echo "reading_webapp ✅"; else echo "reading_webapp ❌"; fi)" && \
echo "Archived frontend: $(if pgrep -f "3000" > /dev/null; then echo "children_game_ARCHIVED ⚠️ SHOULD NOT BE RUNNING"; else echo "children_game_ARCHIVED ✅ (properly stopped)"; fi)" && \
echo "Package name: $(cat package.json 2>/dev/null | grep '"name"' | head -1 || echo 'No package.json')"
```

## 🚀 QUICK START (After Context Clear)

### Essential Context Recovery Commands (CORRECT PRP WORKFLOW)
```bash
# STEP 1: VERIFY ACTIVE PROJECT (MANDATORY)
# Run verification commands above FIRST

# STEP 2: Generate PRP from requirements document
/generate-prp.md docs/requirements/product_requirements_document.md

# STEP 3: Execute the generated PRP file (will be saved in docs/PRPs/ folder)
/execute-prp.md docs/PRPs/multilingual-reading-webapp-children-game.md

# Manual fallback (only if PRP commands unavailable):
# ⚠️  CHANGE: Navigate to reading_webapp (NOT children_game)
Read: /Users/joromini/Documents/pyprojects/crewai/gitclone/renzo/reading_app/docs/requirements/product_requirements_document.md
ls -la reading_webapp/    # ✅ CORRECT PROJECT
cd reading_webapp && npm run dev  # ✅ CORRECT COMMAND
```

### 📁 PRP Workflow Explanation:
1. **generate-prp.md** takes the docs/requirements/product_requirements_document.md as input
2. **Generates** a comprehensive PRP file in `docs/PRPs/{feature-name}-children-game.md`
3. **execute-prp.md** then takes the generated PRP file as input
4. **Executes** the systematic development with built-in validation gates

### 🚨 CRITICAL: Use PRP Workflow (NOT Manual Steps)
The `.claude/commands/` structure provides:
- **Systematic execution** with built-in validation gates
- **Child safety prioritization** throughout development
- **Educational standards compliance** checking
- **Performance optimization** for attention spans
- **Content filtering** and safety validation

### PRP Development Priority Order
1. **Execute PRP Command** - Automated systematic development with safety checks
2. **Follow PRP Validation Gates** - Technical → Functional → Child-Specific testing
3. **Agent Reviews at Each Gate** - Code quality, safety, educational value
4. **Continuous Safety Validation** - Content filtering before content generation

### Key Implementation Focus
- **Single-page application** with fixed layout (TopBar, Left/Right Sidebars, Center Reading Container)
- **Progressive English-to-Korean language learning** with 10-level slider
- **Azure OpenAI integration** for educational content generation
- **Dynamic theming** (Space, Jungle, Deep Sea, Minecraft, Tron) without layout changes
- **Child safety validation** through CrewAI agents and content filtering

## 🚀 Agent Management & Context Strategy

### Use Specialized Agents for Complex Tasks
- **Use `/agents` command** to launch specialized agents for complex, multi-step tasks
- **Code Reviewer Agent**: Use after significant code changes for quality assurance
- **Performance Optimization Agent**: For analyzing and improving app performance
- **Testing Agent**: For comprehensive test coverage and validation
- **Security Agent**: For child safety, content filtering, and data protection validation

### When to Use Agents
- After implementing major features (launch code reviewer)
- Before production deployment (launch security and performance agents)
- When debugging complex issues (launch debugging specialist)
- For comprehensive testing (launch testing agent)

## Project Overview

This is a multilingual reading comprehension webapp designed for children (3rd-6th grade). The application helps kids practice reading skills through interactive challenges while progressively learning a secondary language (Korean). Features immersive skin themes, AI-generated content, and comprehensive progress tracking.

## Development Commands

### Core Development Tasks
- **Start development server**: `npm run dev` (runs on port 3000)
- **Build for production**: `npm run build`
- **Lint code**: `npm run lint`
- **Type checking**: `npm run type-check`
- **Run tests**: `npm test`
- **Preview production build**: `npm run preview`

### Setup
```bash
# Navigate to children_game directory
cd children_game

# Install dependencies
npm i

# Start development server
npm run dev
```

### Quality Assurance Workflow
```bash
# Before committing - run full quality check
npm run lint && npm run type-check && npm test

# After major changes - launch code reviewer agent
/agents code-reviewer

# Before deployment - comprehensive validation
/agents security-agent && /agents performance-agent
```

## Architecture & Structure

### Tech Stack
- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Components**: Custom components with Radix UI primitives
- **Styling**: Tailwind CSS with dynamic theme system
- **State Management**: React hooks with localStorage persistence
- **Animations**: Framer Motion for immersive experiences
- **LLM Integration**: Azure OpenAI API for content generation
- **Image Generation**: AI image generation for themed content
- **Multilingual**: English/Korean (Hangul) progressive language learning

### Project Structure (Single-Page Application)
```
children_game/src/
├── components/
│   ├── layout/
│   │   ├── TopBar.tsx           # Gamification points, progress, level
│   │   ├── LeftSidebar.tsx      # Settings, Reading config, Skin themes
│   │   └── RightSidebar.tsx     # Quiz, Vocabulary tools
│   ├── reading/
│   │   ├── ReadingContainer.tsx # Main scrollable reading passage
│   │   ├── PassageDisplay.tsx   # Themed content display
│   │   └── GenerateButton.tsx   # Content generation trigger
│   ├── quiz/
│   │   ├── QuizContainer.tsx    # Quiz questions and answers
│   │   ├── MultipleChoice.tsx   # MC question component
│   │   └── FillInBlank.tsx      # Fill-in-blank component
│   ├── themes/
│   │   ├── ThemeProvider.tsx    # Dynamic skin theme system
│   │   └── SkinRenderer.tsx     # Background/frame rendering
│   └── agents/
│       ├── ContentValidator.tsx  # CrewAI agent for content validation
│       └── ProgressTracker.tsx   # Achievement and progress logic
├── hooks/
│   ├── useAzureLLM.ts          # Azure OpenAI integration
│   ├── useLanguageProgress.ts  # Multilingual progression
│   └── useLocalStorage.ts      # Persistence management
├── utils/
│   ├── contentGeneration.ts   # AI prompt engineering
│   ├── languageBlending.ts    # English/Korean progressive mixing
│   └── childSafety.ts         # Content filtering and guardrails
└── types/
    ├── content.ts             # Reading passage, quiz types
    ├── language.ts            # Multilingual content types
    └── themes.ts              # Skin theme definitions
```

### Key Architecture Principles

#### Single-Page Application Layout
- **Fixed Component Positions**: TopBar, Left/Right sidebars, center reading area never change position
- **Dynamic Content**: Only content within containers changes, maintaining spatial consistency
- **Immersive Theming**: Background, frames, colors change while functionality remains unchanged
- **No Context Switching**: All features accessible without page navigation

#### Multilingual Progressive Learning System
- **Language Blend Levels**: 10-level slider from 100% English to 100% Korean (Hangul)
- **Progressive Integration**: Gradual introduction of Korean words, phrases, then sentences
- **Content Validation**: CrewAI agent ensures vocabulary requirements and educational standards
- **Grade-Level Appropriate**: 3rd-6th grade content filtering and complexity

#### Azure LLM Integration
- **Primary Provider**: Azure OpenAI for content generation
- **Fallback Options**: Multiple LLM provider support via configuration
- **Content Validation**: Multi-layer validation for child appropriateness
- **Prompt Engineering**: Specialized prompts for educational content and language blending

#### Child Safety & Educational Standards
- **Grade-Level Filtering**: Content appropriate for selected grade (3rd-6th)
- **Content Guardrails**: Multi-layer safety checks for generated content
- **Vocabulary Priority**: Ensures custom vocabulary words are included in passages
- **Educational Validation**: CrewAI agent validates learning objectives are met

### State Management Strategy
```typescript
// Core application state structure
interface AppState {
  user: {
    gradeLevel: '3rd' | '4th' | '5th' | '6th'
    languageProgress: number // 0-100 (English to Korean ratio)
    points: number
    achievements: Achievement[]
  }
  settings: {
    passageLength: number // 250-2000 words
    theme: string // 'space' | 'jungle' | 'deepSea' | 'minecraft' | 'tron'
    humorLevel: number // 1-3 scale
    quizConfig: QuizSettings
    llmProvider: 'azure' | 'openai' | 'claude'
  }
  content: {
    currentPassage: string
    generatedImage: string
    quiz: QuizQuestion[]
    vocabulary: VocabularyWord[]
  }
}
```

### Development Guidelines

#### Reference Projects
- **Primary UI Inspiration**: `/example_projects_ARCHIVED/b44_example` for base layout and UX patterns (ARCHIVED - READ ONLY)
- **Performance Patterns**: `/example_projects_ARCHIVED/surfsense_reference_analysis` for optimization strategies (ARCHIVED - READ ONLY)
- **LLM Integration**: SurfSense patterns for Azure OpenAI configuration

#### Code Quality Standards
- **Type Safety**: Strict TypeScript with proper interfaces for all data structures
- **Component Architecture**: Separation of layout, business logic, and presentation
- **Performance**: Lazy loading, memoization, and efficient re-renders
- **Accessibility**: Child-friendly design with large touch targets and high contrast

#### Testing Requirements
- **Unit Tests**: All utility functions and hooks
- **Component Tests**: Key interactive components
- **Integration Tests**: Full user workflows
- **Content Safety Tests**: Validation of AI-generated content

### 🚨 REQUIRED: Agent Code Verification

**EXPECTATION**: Claude Code MUST use `/agents` to verify and check code quality throughout development.

#### Mandatory Agent Usage Points:
```bash
# 1. AFTER implementing any component - REQUIRED
/agents code-reviewer "Review [ComponentName] for TypeScript best practices, accessibility, and child safety"

# 2. AFTER adding LLM integration - REQUIRED
/agents security-auditor "Validate content filtering, API key handling, and child safety measures"

# 3. AFTER theme/animation changes - REQUIRED
/agents performance-optimizer "Check theme switching performance and memory usage"

# 4. BEFORE any commit - REQUIRED
/agents code-reviewer "Final quality check for maintainability and standards compliance"

# 5. AFTER major feature completion - REQUIRED
/agents content-validator "Ensure educational standards and grade-level appropriateness"
```

#### Non-Negotiable Agent Verification Triggers:
- ✅ **Every new component** → Launch code-reviewer agent
- ✅ **Any security-related code** → Launch security-auditor agent
- ✅ **LLM/AI integration** → Launch both security and content-validation agents
- ✅ **Animation/performance code** → Launch performance-optimizer agent
- ✅ **Before commits** → Launch comprehensive code-reviewer agent

#### Quality Gates - Code MUST pass agent review before proceeding:
1. **Code Quality**: TypeScript standards, component architecture, error handling
2. **Child Safety**: Content filtering, data protection, age-appropriate design
3. **Performance**: Efficient rendering, memory management, responsive design
4. **Educational Standards**: Grade-level content, learning objectives met

**FAILURE TO USE AGENTS = INCOMPLETE DEVELOPMENT**

### 🎯 CRITICAL: Avoid Hardcoded Values in Tests & Validation

#### ❌ Bad Testing Patterns (Creates False Positives):
```typescript
// DON'T DO THIS - Brittle hardcoded checks
test('passage generation', () => {
  expect(passage.content).toBe("The space station orbits Earth..."); // Hardcoded content
  expect(passage.wordCount).toBe(347); // Exact word count
  expect(quiz[0].answer).toBe("Mars"); // Hardcoded answer
});

// DON'T DO THIS - Magic numbers
const EXPECTED_KOREAN_WORDS = 15; // What if content varies?
const EXACT_GRADE_LEVEL_SCORE = 4.2; // Too specific
```

#### ✅ Good Testing Patterns (Robust Validation):
```typescript
// DO THIS - Range-based validation
test('passage generation meets requirements', () => {
  expect(passage.wordCount).toBeGreaterThanOrEqual(400);
  expect(passage.wordCount).toBeLessThanOrEqual(600);
  expect(passage.gradeLevel).toMatch(/^(3rd|4th|5th|6th)$/);
  expect(passage.content).toMatch(/^[A-Za-z\s,.'!?]+$/); // Valid characters only
});

// DO THIS - Property-based testing
test('korean blending maintains readability', () => {
  const blendLevels = [0, 2, 5, 7, 10];
  blendLevels.forEach(level => {
    const text = blendLanguages(sampleText, level);
    expect(text.length).toBeGreaterThan(0);
    expect(text).toMatch(/[\u3131-\u3163\u3AC0-\u3D7FA-Za-z\s]/); // Korean + English chars
    expect(calculateReadability(text)).toBeGreaterThan(0);
  });
});

// DO THIS - Content validation without hardcoding
test('content safety validation', async () => {
  const content = await generateContent({ topic: 'science', gradeLevel: '4th' });
  const safety = await validateContentSafety(content);

  expect(safety.isChildSafe).toBe(true);
  expect(safety.hasInappropriateWords).toBe(false);
  expect(safety.gradeComplexity).toBeGreaterThanOrEqual(3);
  expect(safety.gradeComplexity).toBeLessThanOrEqual(6);
});

// DO THIS - Dynamic expectation based on input
test('theme switching preserves functionality', () => {
  const themes = ['Space', 'Jungle', 'DeepSea', 'Minecraft', 'Tron'];
  themes.forEach(theme => {
    const { container } = render(<App theme={theme} />);

    // Test structure exists, not specific content
    expect(container.querySelector('[data-testid="top-bar"]')).toBeInTheDocument();
    expect(container.querySelector('[data-testid="reading-container"]')).toBeInTheDocument();
    expect(container.querySelector('[data-testid="quiz-sidebar"]')).toBeInTheDocument();

    // Test CSS variables are applied (theme-specific)
    const rootStyles = getComputedStyle(container.firstChild as Element);
    expect(rootStyles.getPropertyValue('--theme-primary')).toBeTruthy();
  });
});
```

#### 🛡️ Robust Validation Strategies:

**1. Range-Based Assertions**
- Word counts: `toBeGreaterThan(min)` and `toBeLessThan(max)`
- Grade levels: Pattern matching `/^(3rd|4th|5th|6th)$/`
- Scores: Range validation instead of exact numbers

**2. Property-Based Testing**
- Test behavior across multiple inputs
- Validate properties that should always hold true
- Use generated test data, not fixed examples

**3. Content Structure Validation**
- Check for required elements/attributes
- Validate data types and formats
- Test regex patterns for content validity

**4. Dynamic Expectations**
- Calculate expected values from inputs
- Use configuration-driven test parameters
- Adapt assertions based on runtime conditions

**5. Mock Data Patterns**
```typescript
// Good: Realistic but flexible test data
const createMockPassage = (overrides = {}) => ({
  wordCount: faker.random.number({ min: 400, max: 600 }),
  gradeLevel: faker.random.arrayElement(['3rd', '4th', '5th', '6th']),
  topic: faker.random.arrayElement(['science', 'history', 'nature']),
  hasImages: faker.random.boolean(),
  ...overrides
});

// Good: Property-based quiz validation
const validateQuizStructure = (quiz: QuizQuestion[]) => {
  expect(quiz).toHaveLength.toBeGreaterThan(0);
  quiz.forEach(question => {
    expect(question.text).toBeTruthy();
    expect(question.options).toHaveLength(4);
    expect(question.correctIndex).toBeGreaterThanOrEqual(0);
    expect(question.correctIndex).toBeLessThan(question.options.length);
  });
};
```

#### 🚨 Agent Instructions for Test Review:
When using `/agents code-reviewer`, specifically ask to:
- "Check for hardcoded values in tests - flag any exact string/number matches"
- "Verify test assertions use ranges and patterns, not magic numbers"
- "Ensure mocks are realistic and flexible, not brittle fixtures"
- "Validate tests will pass with different AI-generated content"

## 📚 **Critical Learnings & Failure Analysis**

**IMPORTANT**: Before working on this project, review critical learnings to avoid repeating costly mistakes.

### **Learning Documentation**
- **Main Index**: [`docs/learnings/README.md`](./docs/learnings/README.md) - Overview of all project learnings
- **Azure OpenAI Integration**: [`docs/learnings/azure-openai-integration.md`](./docs/learnings/azure-openai-integration.md) - **CRITICAL** 17+ hour debugging failure

### **🚨 MUST READ Before Azure Integrations**
**Problem**: Azure OpenAI failing with 401/404 errors despite valid credentials  
**Root Cause**: Using `OpenAI` instead of `AzureOpenAI` client class  
**Prevention**: Always use service-specific client classes for Azure services  

```typescript
// ❌ WRONG - Causes 401/404 errors
import OpenAI from 'openai'
new OpenAI({ baseURL: ..., defaultQuery: ..., defaultHeaders: ... })

// ✅ CORRECT - Works immediately  
import { AzureOpenAI } from 'openai'
new AzureOpenAI({ apiVersion: ..., endpoint: ..., apiKey: ... })
```

### **Quick Prevention Rules**
1. **Check for service-specific clients FIRST** (AzureOpenAI, AzureStorage, etc.)
2. **Start with official documentation examples** before custom implementation
3. **Test basic connection** before adding complexity
4. **When auth fails, check client class** before checking credentials

**Reference Files**: 
- Working example: `children_game/src/test-azure-foundry.ts`
- Full implementation: `children_game/src/services/azureOpenAI.ts`

### **🚨 CRITICAL: React White Screen Debugging**
**Problem**: React apps showing white screen despite correct-looking code  
**Root Cause**: Import errors, CSS loading issues, component complexity  
**Solution**: Incremental development with inline styles  

**Full Documentation**: [`docs/react-white-screen-debugging.md`](./docs/react-white-screen-debugging.md)

**Quick Fix Pattern**:
```typescript
// ✅ SAFE: Start with this pattern
const SafeApp = () => (
  <div style={{
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    color: 'white'
  }}>
    Content here
  </div>
)

// ❌ RISKY: External imports can break everything
import { externalService } from './services/external'
import './styles.css'
```

**Prevention Rules**:
1. **Build incrementally** from working foundation
2. **Use inline styles** for critical theming  
3. **Test imports separately** before adding to components
4. **Add complexity gradually** and test each step