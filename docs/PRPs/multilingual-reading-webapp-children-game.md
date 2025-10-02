# Multilingual Reading Comprehension Webapp - Product Requirements Plan (PRP)

## 🎯 EXECUTIVE SUMMARY

**Project**: Single-page multilingual reading comprehension webapp for children (3rd-6th grade)
**Objective**: Create an immersive, educationally sound application that progressively introduces Korean language learning through AI-generated reading passages and interactive quizzes
**Timeline**: Systematic development with built-in validation gates
**Key Innovation**: Fixed-layout single-page design with dynamic theming and progressive language blending

## 🏗️ ARCHITECTURE OVERVIEW

### Single-Page Application Design
```
┌─────────────────────────────────────────────────────────────┐
│                      TopBar (Fixed)                         │
│              Points | Level | Progress | Settings           │
├─────────────┬───────────────────────────┬─────────────────────┤
│             │                           │                     │
│ LeftSidebar │     ReadingContainer      │    RightSidebar     │
│ (Collapsible│      (Independent         │    (Collapsible)    │
│             │       Scroll)             │                     │
│ • Settings  │                           │ • Quiz              │
│ • Themes    │  Generated Passage +      │ • Vocabulary        │
│ • Language  │  AI Images               │ • Progress          │
│             │                           │                     │
└─────────────┴───────────────────────────┴─────────────────────┘
```

### Core Technical Stack
- **Framework**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS with dynamic theme system
- **AI Integration**: Azure OpenAI for content generation
- **Animation**: Framer Motion for theme transitions
- **State**: React hooks + localStorage persistence
- **Language**: Progressive English-to-Korean (Hangul) blending

## 📋 DEVELOPMENT ROADMAP

### PHASE 1: Foundation & Layout (Validation Gate 1)
**Goal**: Establish single-page architecture with fixed layout system

#### Task 1.1: Project Initialization
```bash
# Create new React TypeScript project
npm create vite@latest reading_webapp -- --template react-ts
cd reading_webapp
npm install framer-motion @azure/openai react-query tailwindcss
```

**Deliverables**:
- [x] Vite React TypeScript project structure
- [x] Package.json with all required dependencies
- [x] Tailwind CSS configuration with theme support
- [x] TypeScript configuration with strict mode

**Success Criteria**:
- Development server starts without errors
- Build process completes successfully
- Tailwind CSS classes are available

#### Task 1.2: Core Type Definitions
Create comprehensive TypeScript interfaces in `src/types/`:

**Content Types** (`content.ts`):
```typescript
interface ReadingPassage {
  id: string;
  text: string;
  wordCount: number;
  gradeLevel: '3rd' | '4th' | '5th' | '6th';
  languageBlend: LanguageBlendInfo;
  generatedImage?: string;
  vocabularyUsed: string[];
  estimatedReadingTime: number;
}

interface QuizQuestion {
  id: string;
  type: 'multiple-choice' | 'fill-in-blank';
  question: string;
  content: string;
  options?: string[];
  correctAnswer: string | number;
  explanation: string;
}
```

**Settings Types** (`settings.ts`):
```typescript
interface AppSettings {
  passageLength: number; // 250-2000 words
  passageTheme: string;
  humorLevel: 1 | 2 | 3;
  vocabularyWords: string[];
  languageBlendLevel: number; // 0-10
  skinTheme: 'Space' | 'Jungle' | 'DeepSea' | 'Minecraft' | 'Tron';
  multipleChoiceCount: number; // 1-10
  fillInBlankCount: number; // 1-10
  quizDifficulty: 'Basic' | 'Intermediate' | 'Challenging';
}
```

**Deliverables**:
- [x] Complete TypeScript interface definitions
- [x] Type exports and imports properly configured
- [x] No TypeScript compilation errors

#### Task 1.3: Single-Page Layout System
Create fixed-position layout components in `src/components/layout/`:

**MainLayout.tsx** - Layout coordinator:
```typescript
const MainLayout: React.FC = () => {
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);

  return (
    <div className="h-screen w-screen overflow-hidden">
      <TopBar className="fixed top-0 left-0 right-0 h-16 z-50" />

      <div className="flex pt-16 h-full">
        <LeftSidebar
          className="fixed left-0 top-16 bottom-0 w-80 z-40"
          isVisible={leftSidebarOpen}
        />

        <main className={`flex-1 transition-all duration-300
          ${leftSidebarOpen ? 'ml-80' : 'ml-0'}
          ${rightSidebarOpen ? 'mr-80' : 'mr-0'}`}>
          <ReadingContainer className="h-full overflow-y-auto" />
        </main>

        <RightSidebar
          className="fixed right-0 top-16 bottom-0 w-80 z-40"
          isVisible={rightSidebarOpen}
        />
      </div>
    </div>
  );
};
```

**Deliverables**:
- [x] MainLayout with fixed positioning
- [x] TopBar with gamification elements
- [x] Collapsible left/right sidebars
- [x] Responsive layout adjustments

**Success Criteria**:
- Layout maintains fixed positions across all screen sizes
- Sidebars collapse/expand without affecting main content
- No scrolling issues or layout breaks

### VALIDATION GATE 1: Technical Foundation
**Criteria**: All Phase 1 tasks complete, no TypeScript errors, layout functions properly

---

### PHASE 2: Theme System & Visual Design (Validation Gate 2)

#### Task 2.1: Dynamic Theme Provider
Create theme system in `src/components/themes/`:

**ThemeProvider.tsx** - CSS variable injection:
```typescript
const ThemeProvider: React.FC<{ theme: ThemeName; children: React.ReactNode }> =
  ({ theme, children }) => {
  const themeConfig = THEME_CONFIGS[theme];

  useEffect(() => {
    // Inject CSS custom properties for dynamic theming
    const root = document.documentElement;
    Object.entries(themeConfig.colors).forEach(([key, value]) => {
      root.style.setProperty(`--theme-${key}`, value);
    });
  }, [theme, themeConfig]);

  return (
    <div className={`theme-${theme.toLowerCase()}`} data-theme={theme}>
      {children}
      <SkinRenderer theme={theme} />
    </div>
  );
};
```

**Theme Configurations**:
- Space: Dark blues, stars, nebula backgrounds
- Jungle: Greens, browns, tropical imagery
- Deep Sea: Blues, teals, underwater aesthetics
- Minecraft: Blocky, pixelated, earth tones
- Tron: Neon blues, geometric patterns, dark backgrounds

**Deliverables**:
- [x] 5 complete theme configurations
- [x] CSS custom property injection system
- [x] Background asset management
- [x] Smooth theme transition animations

#### Task 2.2: Celebration System
Create immersive celebration overlays:

**CelebrationOverlay.tsx**:
```typescript
const CelebrationOverlay: React.FC<{ trigger: CelebrationType }> = ({ trigger }) => {
  return (
    <AnimatePresence>
      {trigger && (
        <motion.div
          className="fixed inset-0 z-[100] pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <ThemeSpecificCelebration theme={currentTheme} type={trigger} />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
```

**Deliverables**:
- [x] Quiz completion celebrations
- [x] Level-up animations
- [x] Reading milestone celebrations
- [x] Theme-appropriate visual effects

### VALIDATION GATE 2: Visual Design
**Criteria**: All 5 themes functional, animations smooth, no performance degradation

---

### PHASE 3: AI Content Generation & Language Blending (Validation Gate 3)

#### Task 3.1: Azure OpenAI Integration
Create LLM hook in `src/hooks/useAzureLLM.ts`:

**Content Generation Pipeline**:
```typescript
const useAzureLLM = () => {
  const generateEducationalContent = async (settings: AppSettings) => {
    // Step 1: Build educational prompt
    const prompt = buildEducationalPrompt({
      gradeLevel: settings.gradeLevel,
      passageLength: settings.passageLength,
      theme: settings.passageTheme,
      vocabularyWords: settings.vocabularyWords,
      humorLevel: settings.humorLevel
    });

    // Step 2: Generate base content
    const response = await azureClient.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: EDUCATIONAL_SYSTEM_PROMPT },
        { role: "user", content: prompt }
      ],
      temperature: settings.humorLevel * 0.3
    });

    // Step 3: Validate content safety and educational value
    const content = response.choices[0].message.content;
    const validation = await validateContent(content, settings);

    if (!validation.passed) {
      throw new Error(`Content validation failed: ${validation.feedback}`);
    }

    return content;
  };

  return { generateEducationalContent };
};
```

**Deliverables**:
- [x] Azure OpenAI client configuration
- [x] Educational prompt engineering
- [x] Content validation pipeline
- [x] Error handling and fallbacks

#### Task 3.2: Progressive Language Blending
Create language progression system in `src/utils/languageProgression.ts`:

**10-Level Blending Strategy**:
```typescript
const BLEND_STRATEGIES = {
  0: (text: string) => text, // 100% English
  1: (text: string) => replaceCommonNouns(text, 0.1), // 10% Korean nouns
  2: (text: string) => replaceCommonNouns(text, 0.2), // 20% Korean nouns
  3: (text: string) => replaceNounsAndAdjectives(text, 0.3),
  4: (text: string) => introduceSentenceKorean(text, 0.4),
  5: (text: string) => alternateSentences(text), // 50/50 alternating
  6: (text: string) => majorityKoreanWithEnglishSupport(text, 0.6),
  7: (text: string) => koreanWithEnglishNouns(text, 0.7),
  8: (text: string) => mostlyKorean(text, 0.8),
  9: (text: string) => koreanWithMinimalEnglish(text, 0.9),
  10: (text: string) => translateToKorean(text) // 100% Korean
};

const applyLanguageBlending = (text: string, level: number): string => {
  const blendFunction = BLEND_STRATEGIES[level];
  const blendedText = blendFunction(text);

  // Ensure proper Hangul rendering and text flow
  return formatMixedLanguageText(blendedText);
};
```

**Deliverables**:
- [x] 10-level progressive blending system
- [x] Korean Hangul font support (Noto Sans KR)
- [x] Proper text rendering for mixed scripts
- [x] Natural language progression validation

#### Task 3.3: Content Validation Agent
Create CrewAI validation system in `src/components/agents/ContentValidator.tsx`:

**Multi-Layer Validation**:
```typescript
const ContentValidator = {
  async validateContent(content: string, settings: AppSettings): Promise<ValidationResult> {
    const validationTasks = await Promise.all([
      validateGradeAppropriateness(content, settings.gradeLevel),
      validateChildSafety(content),
      validateVocabularyIntegration(content, settings.vocabularyWords),
      validateEducationalValue(content),
      validateReadabilityScore(content, settings.gradeLevel)
    ]);

    const allPassed = validationTasks.every(task => task.passed);

    return {
      passed: allPassed,
      confidence: calculateConfidenceScore(validationTasks),
      feedback: validationTasks.filter(t => !t.passed).map(t => t.feedback),
      suggestions: allPassed ? [] : generateImprovementSuggestions(validationTasks)
    };
  }
};
```

**Deliverables**:
- [x] Grade-level appropriateness validation
- [x] Child safety content filtering
- [x] Vocabulary integration verification
- [x] Educational objective compliance checking

### VALIDATION GATE 3: AI Integration
**Criteria**: Content generation working, language blending functional, safety validation passing

---

### PHASE 4: Interactive Components & User Experience (Validation Gate 4)

#### Task 4.1: Reading Interface
Create reading components in `src/components/reading/`:

**ReadingContainer.tsx** - Main content display:
```typescript
const ReadingContainer: React.FC = () => {
  const { currentPassage, isLoading, generateNewPassage } = useContent();
  const { currentTheme } = useTheme();

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-4xl mx-auto">
        {currentPassage?.generatedImage && (
          <ImageDisplay
            src={currentPassage.generatedImage}
            alt="Passage illustration"
            theme={currentTheme}
          />
        )}

        <PassageDisplay
          text={currentPassage?.text || ''}
          languageBlend={currentPassage?.languageBlend}
          theme={currentTheme}
        />

        <GenerateButton
          onGenerate={generateNewPassage}
          isLoading={isLoading}
          disabled={isLoading}
        />
      </div>
    </div>
  );
};
```

**Deliverables**:
- [x] Independent scrolling reading container
- [x] Theme-appropriate content rendering
- [x] AI-generated image integration
- [x] Content generation controls

#### Task 4.2: Quiz System
Create interactive quiz in `src/components/quiz/`:

**QuizContainer.tsx** - Adaptive quiz interface:
```typescript
const QuizContainer: React.FC = () => {
  const { currentQuiz, currentQuestion, submitAnswer, nextQuestion } = useQuiz();
  const [userAnswers, setUserAnswers] = useState<Record<string, any>>({});

  const handleAnswerSubmit = (questionId: string, answer: any) => {
    setUserAnswers(prev => ({ ...prev, [questionId]: answer }));
    submitAnswer(questionId, answer);
  };

  return (
    <div className="h-full overflow-y-auto p-4">
      <QuizProgress
        current={currentQuestion + 1}
        total={currentQuiz.questions.length}
      />

      {currentQuiz.questions.map((question, index) => (
        <div key={question.id} className={index === currentQuestion ? 'block' : 'hidden'}>
          {question.type === 'multiple-choice' ? (
            <MultipleChoice
              question={question}
              onAnswer={(answer) => handleAnswerSubmit(question.id, answer)}
              selectedAnswer={userAnswers[question.id]}
            />
          ) : (
            <FillInBlank
              question={question}
              onAnswer={(answer) => handleAnswerSubmit(question.id, answer)}
              userAnswer={userAnswers[question.id]}
            />
          )}
        </div>
      ))}
    </div>
  );
};
```

**Deliverables**:
- [x] Multiple choice question component
- [x] Fill-in-blank question component
- [x] Progress tracking and scoring
- [x] Answer validation and feedback

#### Task 4.3: Settings Interface
Create configuration panels in `src/components/settings/`:

**Reading Settings Panel**:
```typescript
const ReadingSettings: React.FC = () => {
  const { settings, updateSettings } = useSettings();

  return (
    <div className="space-y-6">
      <SliderControl
        label="Passage Length"
        value={settings.passageLength}
        min={250}
        max={2000}
        step={250}
        onChange={(value) => updateSettings({ passageLength: value })}
        unit="words"
      />

      <TextInput
        label="Story Theme"
        value={settings.passageTheme}
        onChange={(value) => updateSettings({ passageTheme: value })}
        placeholder="e.g., space exploration, underwater adventure"
      />

      <SliderControl
        label="Humor Level"
        value={settings.humorLevel}
        min={1}
        max={3}
        step={1}
        onChange={(value) => updateSettings({ humorLevel: value })}
        labels={["Subtle", "Moderate", "Insanely Funny"]}
      />

      <VocabularyInput
        label="Priority Vocabulary"
        words={settings.vocabularyWords}
        onChange={(words) => updateSettings({ vocabularyWords: words })}
      />
    </div>
  );
};
```

**Deliverables**:
- [x] Reading configuration controls
- [x] Language progression slider (0-10 levels)
- [x] Theme selection interface
- [x] LLM provider settings

### VALIDATION GATE 4: User Experience
**Criteria**: All interactive components functional, settings save properly, UX is intuitive

---

### PHASE 5: Progress Tracking & Persistence (Validation Gate 5)

#### Task 5.1: Progress Tracking System
Create comprehensive analytics in `src/hooks/useProgress.ts`:

**Progress Tracking Features**:
```typescript
interface UserProgress {
  profile: {
    gradeLevel: string;
    currentLevel: number;
    totalPoints: number;
    streak: number;
    achievements: Achievement[];
  };
  sessions: ReadingSession[];
  vocabulary: {
    wordsLearned: string[];
    definitionsViewed: Record<string, number>;
    correctAnswers: Record<string, number>;
  };
  performance: {
    averageQuizScore: number;
    preferredThemes: string[];
    languageProgressionRate: number;
    timeSpentReading: number; // minutes
  };
}
```

**Achievement System**:
- Reading milestones (passages completed)
- Quiz performance streaks
- Language progression achievements
- Theme exploration rewards
- Vocabulary mastery badges

**Deliverables**:
- [x] Comprehensive progress tracking
- [x] Achievement system with celebratory animations
- [x] Performance analytics and insights
- [x] Session history and patterns

#### Task 5.2: Local Storage Persistence
Create robust persistence in `src/hooks/useLocalStorage.ts`:

**Data Management Strategy**:
```typescript
const useLocalStorage = () => {
  const saveUserData = (data: UserProgress) => {
    try {
      const serialized = JSON.stringify(data);
      localStorage.setItem('reading-app-progress', serialized);
      localStorage.setItem('reading-app-backup', serialized); // Backup copy
    } catch (error) {
      console.error('Failed to save progress:', error);
    }
  };

  const loadUserData = (): UserProgress | null => {
    try {
      const data = localStorage.getItem('reading-app-progress');
      return data ? JSON.parse(data) : null;
    } catch (error) {
      // Try backup if main storage corrupted
      const backup = localStorage.getItem('reading-app-backup');
      return backup ? JSON.parse(backup) : null;
    }
  };

  const exportProgress = () => {
    const data = loadUserData();
    if (data) {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'reading-progress-backup.json';
      a.click();
    }
  };

  return { saveUserData, loadUserData, exportProgress };
};
```

**Deliverables**:
- [x] Automatic progress saving
- [x] Data corruption recovery
- [x] Progress export/import functionality
- [x] Privacy-compliant local-only storage

### VALIDATION GATE 5: Data & Persistence
**Criteria**: Progress saves reliably, achievements work, export/import functional

---

## 🛡️ CHILD SAFETY & EDUCATIONAL COMPLIANCE

### Content Safety Pipeline
1. **AI Generation**: Educational prompts with built-in safety constraints
2. **Grade-Level Validation**: Automated reading level assessment
3. **Content Filtering**: Multi-layer inappropriate content detection
4. **Educational Review**: Learning objective compliance checking
5. **Final Approval**: Human-reviewable content validation results

### Privacy & Data Protection
- **Local-Only Storage**: No external data transmission during normal use
- **API Key Security**: Base64 encoding for sensitive configuration
- **Child Privacy**: COPPA-compliant data handling practices
- **Parental Controls**: Settings export for family oversight

### Educational Standards Alignment
- **Grade-Level Accuracy**: 3rd-6th grade content complexity validation
- **Vocabulary Integration**: Custom word prioritization in passages
- **Comprehension Focus**: Quiz questions test understanding, not memorization
- **Progressive Learning**: Language blending supports educational progression

## 📊 PERFORMANCE REQUIREMENTS

### Response Times
- **Content Generation**: < 10 seconds for new passages
- **Theme Switching**: < 500ms animation completion
- **Quiz Loading**: < 1 second question display
- **Settings Save**: Immediate localStorage persistence

### Resource Optimization
- **Memory Usage**: Efficient component re-rendering with useMemo
- **Bundle Size**: Code splitting for theme assets and LLM integration
- **Image Loading**: Lazy loading for generated images
- **Font Loading**: Progressive enhancement for Korean fonts

### Browser Compatibility
- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+
- **Mobile Support**: Responsive design for tablets and phones
- **Accessibility**: WCAG AA compliance for educational content
- **Offline Capability**: Cached content for network interruptions

## 🧪 TESTING STRATEGY

### Unit Testing Priorities
```typescript
// Language blending validation
test('applies correct Korean ratio at each blend level', () => {
  const levels = [0, 2, 5, 7, 10];
  levels.forEach(level => {
    const result = applyLanguageBlending(sampleText, level);
    const koreanRatio = calculateKoreanRatio(result);
    expect(koreanRatio).toBeCloseTo(level * 0.1, 0.1);
  });
});

// Content safety validation
test('rejects inappropriate content for children', async () => {
  const inappropriateContent = "Violence and adult themes...";
  const validation = await validateContent(inappropriateContent);
  expect(validation.passed).toBe(false);
  expect(validation.feedback).toContain('age-inappropriate');
});

// Theme system validation
test('preserves layout during theme transitions', () => {
  const { container, rerender } = render(<App theme="Space" />);
  const initialLayout = getLayoutPositions(container);

  rerender(<App theme="Jungle" />);
  const newLayout = getLayoutPositions(container);

  expect(initialLayout).toEqual(newLayout);
});
```

### Integration Testing Focus
- **Complete User Workflows**: Generate content → Read passage → Complete quiz
- **Cross-Theme Functionality**: All features work across all 5 themes
- **Language Progression**: Smooth blending across all 10 levels
- **Performance Benchmarks**: Content generation and theme switching within SLA

### Manual Testing Checklist
- [ ] Single-page layout maintains fixed positions
- [ ] Korean Hangul renders correctly in all browsers
- [ ] AI content generation produces age-appropriate material
- [ ] Quiz questions match passage content accurately
- [ ] Theme transitions are smooth and non-disruptive
- [ ] Progress saves immediately after each interaction
- [ ] All 5 themes load completely and look appropriate
- [ ] Language blending feels natural and educational

## 🚀 DEPLOYMENT PREPARATION

### Production Build Optimization
```bash
# Production build process
npm run build                    # Vite production build
npm run type-check              # Final TypeScript validation
npm run lint                    # Code quality check
npm run test -- --coverage     # Test coverage report
```

### Environment Configuration
- **API Keys**: Azure OpenAI configuration for content generation
- **Asset Optimization**: Compressed theme backgrounds and audio files
- **CDN Setup**: Optimized delivery for fonts and static assets
- **Error Tracking**: Production error monitoring and reporting

### Performance Monitoring
- **Core Web Vitals**: LCP, FID, CLS tracking for user experience
- **Custom Metrics**: Content generation time, theme switch duration
- **User Analytics**: Reading progress, quiz completion rates (privacy-compliant)
- **Error Rates**: AI generation failures, validation errors

---

## ✅ FINAL VALIDATION CHECKLIST

### Technical Requirements
- [ ] Single-page application with fixed layout (no page navigation)
- [ ] 10-level progressive English-to-Korean language blending
- [ ] AI content generation with educational validation
- [ ] 5 immersive skin themes with smooth transitions
- [ ] Interactive quiz system (multiple choice + fill-in-blank)
- [ ] Collapsible sidebar navigation with tab organization
- [ ] Independent scroll functionality in reading container
- [ ] AI-generated images integrated within theme aesthetic

### Safety & Educational Standards
- [ ] Grade-appropriate content validation (3rd-6th grade)
- [ ] Multi-layer child safety content filtering
- [ ] Custom vocabulary prioritization in generated passages
- [ ] Educational objective compliance verification
- [ ] Local-only data storage with privacy protection
- [ ] COPPA-compliant child data handling

### Performance & Quality
- [ ] Content generation completes within 10 seconds
- [ ] Theme transitions complete within 500ms
- [ ] Korean Hangul displays correctly across devices
- [ ] Progress persistence through localStorage
- [ ] No TypeScript compilation errors
- [ ] 100% test coverage for critical functions
- [ ] WCAG AA accessibility compliance

### User Experience
- [ ] Intuitive single-page navigation
- [ ] Engaging theme-appropriate celebrations
- [ ] Clear progress indicators and achievements
- [ ] Responsive design for multiple screen sizes
- [ ] Educational content feels age-appropriate and fun
- [ ] Language progression feels natural and supportive

---

**SUCCESS DEFINITION**: A production-ready multilingual reading comprehension webapp that engages children in educational content while progressively introducing Korean language learning in a safe, immersive, and educationally sound environment.

The application should demonstrate excellence in technical implementation, child safety, educational value, and user experience design while maintaining the innovative single-page fixed-layout architecture that eliminates context switching and maximizes learning focus.