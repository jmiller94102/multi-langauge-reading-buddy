# Reading Quest - Architecture Documentation

**Version**: 2.0  
**Last Updated**: 2025-01-XX  
**Status**: Active Development

---

## Executive Summary

Reading Quest is a gamified multilingual education application designed for children in grades 3-6. The application helps young learners practice reading comprehension while progressively learning Korean or Mandarin Chinese through AI-generated stories, interactive quizzes, and a virtual pet companion system.

**Core Value Proposition**: Progressive language learning that gradually increases difficulty through a 5-level blending system, making language acquisition feel natural and engaging through gamification.

---

## System Overview

### Architecture Style

**Hybrid Client-Server Architecture** with emphasis on client-side processing:
- **Frontend-heavy MVP**: Business logic and state management in React
- **Backend as Service Proxy**: Secure API key management and AI service orchestration
- **Progressive Enhancement**: Designed for future backend integration without frontend rewrites

### High-Level Components

```
┌─────────────────────────────────────────────────────────────┐
│                     Browser (Client)                         │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  React Application (Port 5173)                         │ │
│  │  ├── Pages (8): Dashboard, Reading, Library, etc.     │ │
│  │  ├── React Contexts (8): User, Pet, Story, etc.       │ │
│  │  ├── Components (60+): Feature & Common components    │ │
│  │  ├── Services: Azure integration, Storage, etc.       │ │
│  │  └── Utils: Language blending, XP calculations, etc.  │ │
│  └────────────────────────────────────────────────────────┘ │
│           │                                                   │
│           │ HTTP/REST API                                    │
│           ↓                                                   │
└─────────────────────────────────────────────────────────────┘
           │
           │
┌──────────▼──────────────────────────────────────────────────┐
│         Node.js Backend (Port 8080)                          │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Express Server                                         │ │
│  │  ├── Story Generation Endpoint                         │ │
│  │  ├── Quiz Generation Endpoint                          │ │
│  │  ├── TTS Audio Generation Endpoint                     │ │
│  │  ├── User/Pet/Quest Persistence (In-Memory - MVP)     │ │
│  │  └── CORS & Security Middleware                        │ │
│  └────────────────────────────────────────────────────────┘ │
│           │                                                   │
│           │ Azure OpenAI SDK                                 │
│           ↓                                                   │
└─────────────────────────────────────────────────────────────┘
           │
           │
┌──────────▼──────────────────────────────────────────────────┐
│              External Services                                │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Azure OpenAI                                           │ │
│  │  ├── GPT-4o: Story & Quiz Generation                   │ │
│  │  ├── TTS: Text-to-Speech (multilingual)                │ │
│  │  └── FLUX-1.1-pro: Pet Art (planned)                   │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## Technology Stack

### Frontend

| Category | Technology | Version | Purpose |
|----------|-----------|---------|---------|
| **Framework** | React | 18.3.1 | UI component framework |
| **Language** | TypeScript | 5.7 | Type-safe development |
| **Build Tool** | Vite | 6.0 | Fast dev server & bundling |
| **Routing** | React Router | Latest | Multi-page navigation |
| **Styling** | Tailwind CSS | 3.4 | Utility-first CSS |
| **Animations** | Framer Motion | 11.x | Smooth UI transitions |
| **State Management** | React Context | - | Global state |
| **Data Persistence** | localStorage | - | Client-side storage (MVP) |
| **Testing** | Vitest | Latest | Unit & integration tests |
| **UI Components** | Radix UI | Latest | Accessible primitives |

### Backend

| Category | Technology | Version | Purpose |
|----------|-----------|---------|---------|
| **Runtime** | Node.js | 20.x | Server runtime |
| **Framework** | Express | 4.x | HTTP server |
| **Language** | JavaScript | ES6+ | Backend logic |
| **AI Integration** | Azure OpenAI SDK | Latest | LLM & TTS services |
| **Storage** | In-Memory Map | - | MVP persistence |
| **Database** | PostgreSQL | 16 | Planned for post-MVP |
| **ORM** | Prisma | Latest | Planned for post-MVP |

### External Services

- **Azure OpenAI (GPT-4o)**: Story generation, quiz generation
- **Azure TTS**: Multilingual text-to-speech with word timings
- **FLUX-1.1-pro**: Pet artwork generation (planned)

---

## Application Architecture

### Frontend Architecture

#### Layered Structure

```
┌─────────────────────────────────────────────┐
│          Presentation Layer                  │
│  ┌──────────────────────────────────────┐   │
│  │  Pages (Routes)                       │   │
│  │  - Dashboard, Reading, Library, etc. │   │
│  └──────────────────────────────────────┘   │
└────────────────┬────────────────────────────┘
                 │
┌────────────────▼────────────────────────────┐
│          Component Layer                     │
│  ┌──────────────────────────────────────┐   │
│  │  Feature Components                   │   │
│  │  - Reading, Pet, Achievements, etc.  │   │
│  └──────────────────────────────────────┘   │
│  ┌──────────────────────────────────────┐   │
│  │  Common Components                    │   │
│  │  - Button, Card, Modal, etc.         │   │
│  └──────────────────────────────────────┘   │
└────────────────┬────────────────────────────┘
                 │
┌────────────────▼────────────────────────────┐
│          State Management Layer              │
│  ┌──────────────────────────────────────┐   │
│  │  React Contexts (8)                   │   │
│  │  - User, Pet, Story, Quest, etc.     │   │
│  └──────────────────────────────────────┘   │
└────────────────┬────────────────────────────┘
                 │
┌────────────────▼────────────────────────────┐
│          Business Logic Layer                │
│  ┌──────────────────────────────────────┐   │
│  │  Services                             │   │
│  │  - Azure OpenAI, Storage, etc.       │   │
│  └──────────────────────────────────────┘   │
│  ┌──────────────────────────────────────┐   │
│  │  Utils                                │   │
│  │  - Language blending, XP calc, etc.  │   │
│  └──────────────────────────────────────┘   │
└────────────────┬────────────────────────────┘
                 │
┌────────────────▼────────────────────────────┐
│          Data Layer                          │
│  ┌──────────────────────────────────────┐   │
│  │  localStorage (MVP)                   │   │
│  │  IndexedDB (Planned)                  │   │
│  │  Backend API (Post-MVP)               │   │
│  └──────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

#### State Management Pattern

**React Context API** with Provider composition:

```typescript
<AppProviders>
  <UserProvider>
    <PetProvider>
      <StoryProvider>
        <QuestProvider>
          <AchievementProvider>
            <SettingsProvider>
              <ToastProvider>
                <Router>
                  {/* Application */}
                </Router>
              </ToastProvider>
            </SettingsProvider>
          </AchievementProvider>
        </QuestProvider>
      </StoryProvider>
    </PetProvider>
  </UserProvider>
</AppProviders>
```

**State Persistence Strategy**:
1. **Write**: Context updates → localStorage sync → Optional backend sync
2. **Read**: localStorage → Fallback to backend → Fallback to defaults
3. **Hydration**: On mount, load from storage before first render

### Backend Architecture

#### Request Flow

```
Client Request
    │
    ↓
┌───────────────────┐
│  CORS Middleware  │ ← Allow localhost:5173-5175
└────────┬──────────┘
         │
         ↓
┌───────────────────┐
│  JSON Body Parser │ ← 10MB limit
└────────┬──────────┘
         │
         ↓
┌───────────────────┐
│  Route Handler    │ ← /api/generate-story, /api/generate-quiz, etc.
└────────┬──────────┘
         │
         ↓
┌───────────────────┐
│  Request          │
│  Validation       │
└────────┬──────────┘
         │
         ↓
┌───────────────────┐
│  Azure OpenAI     │ ← Sequential LLM calls (English → Translation)
│  Integration      │
└────────┬──────────┘
         │
         ↓
┌───────────────────┐
│  Response         │
│  Formatting       │
└────────┬──────────┘
         │
         ↓
    JSON Response
```

#### Two-Phase LLM Strategy

The backend uses a sequential two-phase approach for multilingual content:

**Phase 1: English Story Generation**
- Input: Story prompt, length, grade level, humor level
- LLM: Azure OpenAI GPT-4o
- Output: English story + vocabulary extraction (POS-tagged)
- Vocabulary filtering: Frequency-based (top N most common words)

**Phase 2: Translation**
- Input: English story + filtered vocabulary
- LLM: Azure OpenAI GPT-4o
- Output: Translated story + translated vocabulary
- Preserves: Paragraph structure, context definitions

**Benefits of Two-Phase Approach**:
- Cleaner prompt engineering (single responsibility)
- Better translation quality (full context available)
- Vocabulary consistency (POS alignment)
- Easier debugging and testing

#### In-Memory Storage (MVP)

Current implementation uses JavaScript Maps for persistence:
- `users`: User profiles and progress
- `pets`: Virtual pet state
- `quests`: Quest progress
- `achievements`: Achievement unlocks
- `settings`: User preferences

**Migration Path**: Designed for easy swap to PostgreSQL + Prisma ORM in Phase 7.

---

## Core Features Architecture

### 1. Progressive Language Learning System

#### 5-Level Blending System (0-4)

The application implements client-side language blending WITHOUT additional LLM calls:

```
Level 0: 100% English
├── Display: Pure English sentences
└── Purpose: Baseline reading comprehension

Level 1: Vocabulary Recognition
├── Display: English sentences with inline Korean/Mandarin hints
├── Replacement: Nouns + Verbs → **translation (english)**
└── Purpose: Vocabulary building

Level 2: Noun Immersion + Sentence Mixing (2:1)
├── Pattern: EN, EN, KO (with noun hints), repeat
├── English: Full noun + verb replacement
├── Korean: Noun hints only
└── Purpose: Gradual immersion

Level 3: Balanced Alternation (1:1)
├── Pattern: EN, KO (with noun hints), repeat
├── English: Full noun + verb replacement
├── Korean: Noun hints only
└── Purpose: Balanced practice

Level 4: 100% Korean/Mandarin
├── Display: Pure secondary language sentences
├── Hover: English translation on hover
└── Purpose: Full immersion
```

**Key Implementation Details**:
- Pre-generated: Both language versions created during story generation
- Client-side: Blending happens in browser using `languageBlending.ts`
- No latency: Instant switching between levels
- Vocabulary-aware: Uses POS-tagged vocabulary from backend

### 2. Virtual Pet System

#### Pet State Machine

```
Pet States:
├── Emotions (7): happy, excited, curious, sleepy, sad, hungry, sick
├── Stats: happiness (0-100), hunger (0-100), energy (0-100)
└── Evolution: stage (1-7), track (knowledge|coolness|culture)

State Transitions:
happiness > 70, hunger < 30, energy > 50 → happy
happiness > 80, energy > 70 → excited
hunger > 70 → hungry
energy < 30 → sleepy
happiness < 30 → sad
hunger > 90 or happiness < 20 → sick
```

#### Evolution System

**Three Evolution Tracks** (21 total forms = 3 tracks × 7 stages):

1. **Knowledge Track**: Bookworm → Scholar → Professor path
2. **Coolness Track**: Cool Kid → Trendsetter → Icon path  
3. **Culture Track**: Explorer → Ambassador → Master path

**Evolution Triggers**:
- XP milestones for stage advancement
- Track selection based on user activity patterns
- Ceremonial animations on evolution

### 3. Gamification Engine

#### Progression System

```
XP System:
├── Sources: Reading completion, quiz performance, streaks, achievements
├── Calculation: Base XP × Difficulty × Combo × Streak multiplier
├── Level Formula: XP_required = 100 × 1.5^(level - 1)
└── Rewards: Coins, gems, pet food on level up

Economy System:
├── Coins: Earned through gameplay, spent in shop
├── Gems: Premium currency (rare rewards, special items)
└── Inventory: Foods (consumables), cosmetics (permanent), power-ups (limited use)
```

#### Achievement System (30+ badges)

**Categories**:
- Reading milestones (stories read, words read)
- Quiz performance (perfect scores, streaks)
- Language progression (blend level advancement)
- Pet care (feeding, evolution)
- Consistency (daily streaks, weekly goals)

**Implementation**: Event-driven with `AchievementContext` tracking conditions

#### Quest System

**Daily Quests** (3/day):
- Read 1 story
- Complete 1 quiz
- Feed pet 2 times

**Weekly Quests** (3/week):
- Read 5 stories
- Achieve 3-day streak
- Unlock 1 achievement

### 4. AI Integration Architecture

#### Content Generation Pipeline

```
User Input (Story Prompt)
         │
         ↓
┌────────────────────┐
│  Frontend Service  │
│  (azureOpenAI.ts)  │
└─────────┬──────────┘
          │ HTTP POST /api/generate-story
          ↓
┌────────────────────┐
│  Backend Server    │
│  (server.js)       │
└─────────┬──────────┘
          │
          ↓
┌────────────────────────────────┐
│  Phase 1: English Generation   │
│  ├── System Prompt             │
│  ├── User Prompt               │
│  └── Response: Story + Vocab   │
└─────────┬──────────────────────┘
          │
          ↓
┌────────────────────────────────┐
│  Vocabulary Filtering          │
│  ├── Count word frequency      │
│  ├── Sort by usage             │
│  └── Top N per POS category    │
└─────────┬──────────────────────┘
          │
          ↓
┌────────────────────────────────┐
│  Phase 2: Translation          │
│  ├── Input: EN story + vocab   │
│  └── Output: KO/ZH + vocab     │
└─────────┬──────────────────────┘
          │
          ↓
┌────────────────────────────────┐
│  Sentence Splitting            │
│  ├── Split by punctuation      │
│  ├── Preserve paragraphs       │
│  └── Align EN ↔ KO arrays      │
└─────────┬──────────────────────┘
          │
          ↓
     Story Object
     (sent to frontend)
```

#### Audio Generation (TTS)

```
Text Input
    │
    ↓
┌────────────────────┐
│  Backend TTS       │
│  ├── Azure OpenAI  │
│  ├── Voice: alloy  │
│  └── Speed: 1.0x   │
└────────┬───────────┘
         │
         ↓
┌────────────────────┐
│  Word Timing Calc  │
│  ├── 130 WPM rate  │
│  ├── Punctuation   │
│  │   pauses        │
│  └── Word length   │
│      adjustment    │
└────────┬───────────┘
         │
         ↓
    Audio + Timings
    (base64 data URL)
```

---

## Key Architectural Patterns

### 1. React Context Pattern (State Management)

**Provider Composition**:
```typescript
<UserProvider>
  <PetProvider>
    <StoryProvider>
      <QuestProvider>
        <AchievementProvider>
          <SettingsProvider>
            <ToastProvider>
              <App />
```

**Characteristics**:
- Top-down data flow
- Centralized state updates
- Persistence hooks (localStorage sync)
- Async operations with loading states

**Pros**:
- No external dependencies
- Built-in React feature
- Simple mental model
- Easy debugging

**Cons**:
- Can cause unnecessary re-renders
- Potential performance issues at scale
- Context hell with deep nesting

### 2. Service Layer Pattern

**Abstraction of External Dependencies**:

```typescript
// services/azureOpenAI.ts
export const generateStory = async (settings, languageSettings) => {
  // Retry logic
  // Error handling
  // Response formatting
}

// Usage in components
const story = await generateStory(storySettings, langSettings);
```

**Benefits**:
- Swappable implementations
- Centralized error handling
- Retry logic encapsulation
- Testing isolation

### 3. Feature-Based Organization

```
components/
├── dashboard/       # Dashboard-specific components
├── reading/         # Reading page components
├── achievements/    # Achievement components
├── shop/            # Shop components
├── pet/             # Pet system components
└── common/          # Shared components
```

**Rationale**:
- High cohesion (related code together)
- Easy navigation
- Clear ownership
- Scales with features

### 4. Type-Driven Development

**Comprehensive TypeScript Interfaces**:
- `types/user.ts`: User state, settings, inventory
- `types/pet.ts`: Pet state, emotions, evolution
- `types/story.ts`: Story structure, blending, vocabulary
- `types/quiz.ts`: Questions, answers, results
- `types/achievement.ts`: Badge definitions, progress
- `types/quest.ts`: Quest types, completion

**Benefits**:
- Compile-time safety
- IntelliSense support
- Self-documenting code
- Refactoring confidence

### 5. Lazy Loading & Code Splitting

**Route-Based Splitting**:
```typescript
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Reading = lazy(() => import('./pages/Reading'));
// etc.
```

**Results**:
- Faster initial load
- Reduced bundle size
- Better cache utilization
- Improved perceived performance

---

## Data Flow Architecture

### Story Generation Flow

```
User (Reading Page)
    │ Enter prompt, settings
    ↓
StoryContext
    │ generateStory()
    ↓
azureOpenAI Service
    │ HTTP POST to backend
    ↓
Backend Server
    │ Sequential LLM calls
    │ ├── Phase 1: English + vocab extraction
    │ └── Phase 2: Translation
    ↓
Story Object
    │ primarySentences, secondarySentences, vocabulary
    ↓
StoryContext (State Update)
    │ setCurrentStory()
    ↓
Reading Page
    │ Re-render with new story
    ↓
Language Blending Utility
    │ Client-side sentence mixing based on level
    ↓
Display (Blended Content)
```

### Quiz Completion Flow

```
User (Answers Question)
    ↓
Quiz Component
    │ onAnswerSelect()
    ↓
UserContext
    │ ├── addXP(questionXP)
    │ ├── addCoins(questionCoins)
    │ └── updateStats()
    ↓
XP Level Check
    │ If XP >= xpToNextLevel
    ↓
Level Up Trigger
    │ setLevelUpCelebration()
    ↓
Global Celebration Component
    │ LevelUpCelebration modal
    ↓
AchievementContext
    │ Check achievement conditions
    │ ├── First quiz completed
    │ ├── 10 quizzes completed
    │ └── Perfect score achievement
    ↓
PetContext
    │ Update pet happiness
    │ Check evolution conditions
    ↓
UI Updates (Cascading)
```

### Persistence Strategy

**Dual-Persistence Approach** (MVP):

```
State Change
    │
    ├─────────────────┬─────────────────┐
    ↓                 ↓                 ↓
localStorage    Backend Sync    React State
(immediate)      (async)         (memory)
    │                 │                 │
    ↓                 ↓                 ↓
Browser Cache   In-Memory Map   Component Re-render
(persistent)    (session-only)   (UI update)
```

**Read Priority**:
1. React State (if loaded)
2. localStorage (on mount)
3. Backend API (fallback)
4. Default values (initialization)

---

## Security Architecture

### API Key Management

**Current Implementation** (Secure):
- API keys stored in backend `.env` file
- NEVER exposed to frontend
- Frontend makes requests to backend proxy
- Backend makes authenticated requests to Azure

**CORS Configuration**:
```javascript
cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'],
  credentials: true
})
```

### Content Safety

**Child Safety Measures**:
- No user-generated content exposure (currently)
- AI-generated stories (controlled prompts)
- No external links or images
- Age-appropriate language in prompts
- COPPA compliance design (no data collection)

### Input Validation

**Backend**:
- JSON body size limit: 10MB
- Request validation (required fields)
- Error handling with try-catch

**Frontend**:
- TypeScript type safety
- Form validation before submission
- User input sanitization (future)

---

## Performance Characteristics

### Bundle Size

**Frontend**:
- Target: <500KB gzipped (per CLAUDE.md quality gates)
- Strategy: Code splitting, lazy loading, tree shaking
- Critical path: Dashboard + common components only

### Network Optimization

**Story Generation**:
- Average latency: 5-15 seconds (2 LLM calls)
- Retry logic: 3 attempts with exponential backoff
- Error recovery: User-friendly error messages

**TTS Generation**:
- Average latency: 3-8 seconds
- Audio format: MP3 base64-encoded
- Caching: None (currently)

### Client-Side Performance

**React Optimization**:
- `React.memo` on expensive components
- `useMemo` for calculations
- `useCallback` for event handlers
- Lazy loading for routes

**Target Metrics** (per quality gates):
- Lighthouse score: >90
- Time to Interactive: <3s
- First Contentful Paint: <1.5s

---

## Deployment Architecture

### Current Setup (Development)

```
Frontend:
├── Dev Server: Vite (Port 5173)
├── Hot Reload: Enabled
└── Build: npm run build → dist/

Backend:
├── Dev Server: Node.js (Port 8080)
├── Process Manager: None (manual restart)
└── Environment: .env file
```

### Production Architecture (Planned)

```
┌─────────────────────────────────────┐
│  CDN (Static Assets)                │
│  ├── Frontend bundle (Vercel/S3)   │
│  ├── Pet images                     │
│  └── Audio cache                    │
└─────────────┬───────────────────────┘
              │
              ↓
┌─────────────────────────────────────┐
│  Load Balancer                      │
└─────────────┬───────────────────────┘
              │
              ↓
┌─────────────────────────────────────┐
│  Backend API Servers                │
│  ├── Node.js + Express              │
│  ├── PM2 (process management)       │
│  └── Azure App Service             │
└─────────────┬───────────────────────┘
              │
              ├────────────┬────────────┐
              ↓            ↓            ↓
         PostgreSQL   Azure OpenAI   Redis
         (Data)       (AI Services)  (Cache)
```

---

## Technology Decisions & Rationale

### Why React?

**Decision**: React 18 with TypeScript
**Rationale**:
- Large ecosystem and community
- TypeScript support
- Component reusability
- Virtual DOM performance
- Hooks for state management
- Developer familiarity

### Why Vite?

**Decision**: Vite over Create React App
**Rationale**:
- 10-100x faster dev server
- Native ES modules (no bundling in dev)
- Optimized production builds
- Built-in TypeScript support
- Smaller bundle sizes

### Why Context API over Redux?

**Decision**: React Context for state management
**Rationale**:
- No external dependencies
- Sufficient for MVP scale
- Simpler learning curve
- Less boilerplate
- Easier testing

**Trade-off**: May need Redux/Zustand if:
- State becomes too complex
- Performance issues from re-renders
- Need time-travel debugging

### Why localStorage over IndexedDB?

**Decision**: localStorage for MVP
**Rationale**:
- Simple API
- Synchronous reads
- Sufficient for <10MB data
- No setup required

**Trade-off**: Will migrate to IndexedDB for:
- Offline story storage
- Large audio file caching
- Structured query capabilities

### Why Express over NestJS?

**Decision**: Express for backend
**Rationale**:
- Lightweight and flexible
- Fast setup for MVP
- Minimal learning curve
- Sufficient for proxy pattern

**Trade-off**: Could use NestJS for:
- Enterprise-scale features
- Built-in dependency injection
- Microservices architecture
- GraphQL integration

---

## Critical Design Decisions

### 1. Client-Side Blending

**Decision**: Perform language blending in browser, not backend
**Rationale**:
- Instant blend level switching
- No additional LLM costs
- Reduced network latency
- Better user experience

**Implementation**: Pre-generate both language versions, blend on client

### 2. Two-Phase LLM Strategy

**Decision**: Separate English generation from translation
**Rationale**:
- Cleaner prompts (single responsibility)
- Better translation quality
- Easier debugging
- Vocabulary alignment

**Alternative Considered**: Single-phase generation with mixed content
**Rejected Because**: Inconsistent results, poor vocabulary extraction

### 3. Frontend-Heavy MVP

**Decision**: Implement business logic in frontend, backend as proxy
**Rationale**:
- Faster development cycle
- No database setup needed
- Easy testing and iteration
- API key security maintained

**Migration Path**: Phase 7 moves logic to backend without frontend rewrites

### 4. No Authentication (MVP)

**Decision**: Single-user experience without login
**Rationale**:
- Reduces MVP complexity
- Faster development
- localStorage sufficient for demo
- Parent consent not required

**Future**: Add authentication in Phase 7 for multi-user support

---

## Testing Strategy

### Current Test Coverage

**Frontend**:
- Unit tests: Utils, hooks (target: >80%)
- Component tests: React Testing Library
- Integration tests: User flows (critical paths)
- E2E tests: Optional for MVP

**Backend**:
- API tests: Story/quiz generation endpoints
- Integration tests: Azure OpenAI connection
- Load tests: Planned for production

### Quality Gates (Per CLAUDE.md)

1. Code Quality: Lint + Type-check + Code Review
2. Testing: >80% coverage, all critical paths
3. Accessibility: WCAG AA compliance
4. Performance: Lighthouse >90, TTI <3s
5. Child Safety: Content filtering, COPPA compliance

---

## Documentation Strategy

### Current Documentation

**Comprehensive Planning Docs**:
- `v2-architecture.md`: Full technical specification
- `wireframes/`: 6 page designs
- `api-contract.md`: REST API specification
- `component-specifications.md`: 60+ component specs
- `pet-evolution-system.md`: Pet system details
- `audio-sync-architecture.md`: TTS implementation

**Developer Guides**:
- Root `CLAUDE.md`: Project orchestration
- `frontend/CLAUDE.md`: Frontend development
- `backend/CLAUDE.md`: Backend development
- `ORGANIZATION.md`: Project structure guide

**Process Documentation**:
- `PRPs/`: Product Requirement Prompts (feature implementation guides)
- `docs/learnings/`: Critical debugging lessons
- `CONTEXT_RECOVERY_GUIDE.md`: Session recovery

---

## Known Limitations & Technical Debt

### MVP Limitations

1. **No Database**: Using in-memory Maps (backend) and localStorage (frontend)
   - Impact: Data lost on server restart
   - Mitigation: Planned PostgreSQL migration (Phase 7)

2. **No Authentication**: Single-user mode only
   - Impact: Can't support multiple users
   - Mitigation: JWT auth planned (Phase 7)

3. **No Caching**: Regenerating stories/audio on each request
   - Impact: Higher API costs, slower response
   - Mitigation: Redis cache planned (Phase 7)

4. **Client-Side Storage Limits**: localStorage capped at ~10MB
   - Impact: Limited story library size
   - Mitigation: IndexedDB migration planned

5. **No Error Telemetry**: Manual error tracking
   - Impact: Hard to diagnose production issues
   - Mitigation: Sentry integration planned

### Technical Debt

1. **Context Re-render Issues**: Potential performance issues with deeply nested providers
2. **Vocabulary Filtering Logic**: Frequency-based but not context-aware
3. **Audio Timing Estimation**: Simple WPM calculation, not accurate for all voices
4. **No Progressive Web App**: Not installable, no offline mode
5. **Hardcoded Configuration**: Theme values, XP formulas in code vs config files

---

## Scalability Considerations

### Current Capacity

**Frontend**:
- Handles: Single user, ~100 components, ~10MB data
- Bottleneck: Context re-renders, large component trees

**Backend**:
- Handles: Low concurrent requests (<10 simultaneous)
- Bottleneck: In-memory storage, no horizontal scaling

### Scalability Path

**Phase 7 Backend Migration**:
- PostgreSQL: Multi-user support, data persistence
- Redis: Caching for stories, quizzes, audio
- Load balancing: Multiple backend instances
- CDN: Static asset delivery

**Phase 8+ Enhancements**:
- GraphQL: Reduce over-fetching
- WebSockets: Real-time features (leaderboards)
- Service Workers: Offline support, PWA
- Microservices: Separate story generation from user management

---

## Development Workflow

### PRP-Based Development (Per CLAUDE.md)

```
1. Generate PRP from wireframe
   /generate-prp docs/wireframes/dashboard.md
   
2. Execute PRP
   /execute-prp PRPs/frontend/dashboard-implementation.md
   
3. Implementation Loop
   ├── Update todo list
   ├── Implement feature
   ├── Write tests
   ├── Run validation (sub-agents)
   └── Commit milestone
   
4. Quality Gates
   ├── Gate 1: Code quality
   ├── Gate 2: Testing
   ├── Gate 3: Accessibility
   ├── Gate 4: Performance
   └── Gate 5: Child safety
   
5. Mark PRP complete
   Move to next PRP
```

### Git Workflow

**Branching** (Implied from CLAUDE.md):
- Main: Stable, production-ready code
- Feature branches: Per PRP execution
- No direct commits to main

**Commit Strategy**:
- Milestone commits during PRP execution
- All quality gates passed before merge
- Sub-agent validation before commit

---

## External Dependencies

### Frontend Dependencies (Inferred)

**Core**:
- react, react-dom
- react-router-dom
- typescript
- vite

**UI**:
- tailwindcss
- framer-motion
- @radix-ui/*

**State & Utils**:
- (No external state libraries - using Context API)

**Testing**:
- vitest
- @testing-library/react
- @testing-library/jest-dom

### Backend Dependencies

**Core**:
- express
- cors
- dotenv

**AI Services**:
- openai (Azure OpenAI SDK)

**Future** (Phase 7):
- prisma (ORM)
- pg (PostgreSQL driver)
- jsonwebtoken (auth)
- bcrypt (password hashing)

---

## Architectural Strengths

1. **Clear Separation of Concerns**: Frontend/backend, features/common, state/presentation
2. **Type Safety**: Comprehensive TypeScript throughout
3. **Secure API Integration**: Keys never exposed to client
4. **Progressive Enhancement**: MVP → Post-MVP path well-defined
5. **Documented Patterns**: CLAUDE.md files provide clear conventions
6. **Child-Focused Design**: Safety and age-appropriateness prioritized
7. **Scalable Structure**: Feature-based organization supports growth
8. **AI-First Architecture**: LLM integration as core, not bolt-on
9. **Client-Side Optimization**: Blending without server round-trips
10. **Comprehensive Planning**: Extensive documentation and wireframes

---

## Architectural Weaknesses & Improvement Opportunities

See next section for detailed improvement recommendations.

---

## Improvement Recommendations

### Priority 1: Critical (Immediate Impact)

#### 1.1 Migrate from Context API to Zustand

**Issue**: Deep context nesting causing potential re-render performance issues
**Current**: 8 nested Context providers
**Impact**: Every context update triggers re-renders in all child components

**Solution**:
```typescript
// Replace Context providers with Zustand stores
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useUserStore = create(
  persist(
    (set) => ({
      user: defaultUser,
      addXP: (amount) => set((state) => ({
        user: { ...state.user, xp: state.user.xp + amount }
      })),
      // ... other actions
    }),
    { name: 'user-storage' }
  )
);
```

**Benefits**:
- Eliminates context nesting
- Built-in persistence middleware
- Better performance (selective re-renders)
- Simpler mental model
- DevTools integration

**Effort**: Medium (2-3 days)
**ROI**: High (significant performance improvement)

#### 1.2 Add Response Caching Layer

**Issue**: Regenerating identical stories/quizzes costs API calls
**Current**: No caching mechanism
**Impact**: Higher Azure OpenAI costs, slower UX

**Solution**:
```typescript
// Add simple cache with TTL
class ResponseCache {
  private cache = new Map<string, { data: any; timestamp: number }>();
  private TTL = 1000 * 60 * 60; // 1 hour

  get(key: string) {
    const entry = this.cache.get(key);
    if (entry && Date.now() - entry.timestamp < this.TTL) {
      return entry.data;
    }
    return null;
  }

  set(key: string, data: any) {
    this.cache.set(key, { data, timestamp: Date.now() });
  }
}
```

**Benefits**:
- Reduces API costs by 40-60%
- Faster response times
- Better offline experience

**Effort**: Low (1 day)
**ROI**: Very High (immediate cost savings)

#### 1.3 Implement Error Telemetry

**Issue**: No visibility into production errors
**Current**: Manual error tracking via console.error
**Impact**: Cannot diagnose user-facing issues

**Solution**: Integrate Sentry or similar service
```typescript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: process.env.VITE_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  integrations: [
    new Sentry.BrowserTracing(),
    new Sentry.Replay(),
  ],
  tracesSampleRate: 0.1,
  replaysSessionSampleRate: 0.1,
});
```

**Benefits**:
- Real-time error monitoring
- User session replay
- Performance tracking
- Stack trace analysis

**Effort**: Low (1 day)
**ROI**: High (better debugging, faster fixes)

### Priority 2: High (MVP Completion)

#### 2.1 Migrate to IndexedDB for Story Library

**Issue**: localStorage limit (~10MB) restricts story library size
**Current**: Can store ~20-30 stories before hitting limit
**Impact**: Users lose saved stories

**Solution**: Use Dexie.js wrapper for IndexedDB
```typescript
import Dexie from 'dexie';

const db = new Dexie('ReadingQuestDB');
db.version(1).stores({
  stories: '++id, title, createdAt',
  audioCache: '++id, storyId, audioUrl'
});

// Migration path preserves existing localStorage data
await migrateFromLocalStorage();
```

**Benefits**:
- Store 100+ stories
- Cache audio files locally
- Structured queries
- Better offline support

**Effort**: Medium (2-3 days)
**ROI**: High (essential for user retention)

#### 2.2 Add Request Queueing

**Issue**: Multiple simultaneous LLM requests can fail or timeout
**Current**: Direct fetch calls without queue management
**Impact**: Race conditions, failed generations

**Solution**: Implement request queue with concurrency limit
```typescript
class RequestQueue {
  private queue: Array<() => Promise<any>> = [];
  private activeCount = 0;
  private maxConcurrent = 2;

  async add<T>(fn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await fn();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
      this.processQueue();
    });
  }
}
```

**Benefits**:
- Prevents API rate limiting
- Better error handling
- Smoother UX
- Cost optimization

**Effort**: Low (1-2 days)
**ROI**: High (prevents failures)

#### 2.3 Context-Aware Vocabulary Selection

**Issue**: Frequency-based filtering doesn't consider pedagogical value
**Current**: Top N most frequent words may not be best for learning
**Impact**: Suboptimal vocabulary for language learning

**Solution**: Add semantic importance scoring
```typescript
function scoreVocabularyWord(word: VocabularyWord, context: string) {
  return {
    frequency: word.frequency || 0,
    pedagogicalValue: calculatePedagogicalValue(word), // Educational importance
    contextRelevance: calculateContextRelevance(word, context),
    difficulty: assessDifficulty(word, gradeLevel),
  };
}
```

**Benefits**:
- Better learning outcomes
- More relevant vocabulary
- Grade-appropriate selection
- Improved language acquisition

**Effort**: Medium (3-4 days, requires testing)
**ROI**: High (core educational value)

### Priority 3: Medium (Quality of Life)

#### 3.1 Add Progressive Web App (PWA) Support

**Issue**: Not installable, no offline mode
**Current**: Standard web app
**Impact**: Less engagement, requires internet

**Solution**: Add service worker and manifest
```typescript
// vite-plugin-pwa configuration
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [{
          urlPattern: /^https:\/\/.*\.openai\.azure\.com\/.*/i,
          handler: 'NetworkFirst',
        }]
      }
    })
  ]
});
```

**Benefits**:
- Installable app icon
- Offline story reading
- Faster load times
- Better mobile experience

**Effort**: Medium (2-3 days)
**ROI**: Medium (better UX, more engagement)

#### 3.2 Extract Configuration to External Files

**Issue**: XP formulas, theme values hardcoded in components
**Current**: Magic numbers throughout codebase
**Impact**: Difficult to tune game balance

**Solution**: Create configuration system
```typescript
// config/gamification.ts
export const GAMIFICATION_CONFIG = {
  xp: {
    baseLevel: 100,
    growthFactor: 1.5,
    calculateRequired: (level: number) => 
      Math.floor(100 * Math.pow(1.5, level - 1))
  },
  rewards: {
    storyCompletion: { xp: 50, coins: 25 },
    perfectQuiz: { xp: 100, coins: 50, gems: 5 }
  }
};
```

**Benefits**:
- Easy balance adjustments
- A/B testing capability
- Better maintainability
- Clear game design

**Effort**: Low (1-2 days)
**ROI**: Medium (easier tuning)

#### 3.3 Optimize TTS Word Timing Algorithm

**Issue**: Simple WPM calculation inaccurate for multilingual content
**Current**: 130 WPM with basic punctuation pauses
**Impact**: Audio sync drift, especially for Korean/Mandarin

**Solution**: Use language-specific timing models
```typescript
const TIMING_PROFILES = {
  en: { wpm: 150, syllableWeight: 0.8 },
  ko: { wpm: 110, syllableWeight: 1.2 }, // Korean is syllable-timed
  zh: { wpm: 120, syllableWeight: 1.0 }
};

function calculateWordTiming(word: string, language: string) {
  const profile = TIMING_PROFILES[language];
  const syllables = countSyllables(word, language);
  return (syllables * profile.syllableWeight) / (profile.wpm / 60);
}
```

**Benefits**:
- Accurate audio sync
- Better multilingual support
- Professional feel
- Reduced drift over time

**Effort**: Medium (2-3 days)
**ROI**: Medium (better feature quality)

### Priority 4: Future Enhancements

#### 4.1 Add Component Lazy Loading Optimization

**Issue**: All page components loaded at once
**Current**: Lazy loading at route level only
**Impact**: Larger initial bundle for each route

**Solution**: Lazy load heavy components within pages
```typescript
const VirtualPet = lazy(() => import('./components/pet/VirtualPet'));
const AchievementGrid = lazy(() => import('./components/achievements/Grid'));

// Use with Suspense
<Suspense fallback={<Skeleton />}>
  <VirtualPet />
</Suspense>
```

**Effort**: Low (1 day)
**ROI**: Low (marginal bundle size reduction)

#### 4.2 Add Backend Health Monitoring

**Issue**: No backend uptime/health tracking
**Current**: Manual monitoring
**Impact**: Cannot detect backend failures

**Solution**: Add health check endpoint monitoring
```typescript
// Simple uptime monitor
setInterval(async () => {
  try {
    await fetch(`${BACKEND_URL}/api/health`);
    updateStatus('healthy');
  } catch {
    updateStatus('unhealthy');
    notifyAdmin();
  }
}, 60000); // Every minute
```

**Effort**: Low (1 day)
**ROI**: Medium (better reliability)

#### 4.3 Implement Retry Queue for Failed Requests

**Issue**: Failed API calls not automatically retried
**Current**: Basic retry logic in fetchWithRetry
**Impact**: Users must manually retry

**Solution**: Persistent retry queue with exponential backoff
```typescript
class RetryQueue {
  private queue: PersistentQueue<FailedRequest>;

  async addFailedRequest(request: FailedRequest) {
    await this.queue.enqueue(request);
    this.processQueue();
  }

  private async processQueue() {
    const request = await this.queue.peek();
    if (request && this.shouldRetry(request)) {
      await this.retry(request);
    }
  }
}
```

**Effort**: Medium (2-3 days)
**ROI**: Low (edge case handling)

### Priority 5: Post-MVP (Backend Migration)

#### 5.1 Database Schema Design

**Recommendation**: Use normalized schema with proper indexing

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY,
  name VARCHAR(100),
  level INT DEFAULT 1,
  xp INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  INDEX idx_level (level),
  INDEX idx_xp (xp)
);

-- Stories table with JSONB for flexibility
CREATE TABLE stories (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  content JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  INDEX idx_user_created (user_id, created_at)
);
```

**Effort**: High (5-7 days with migrations)
**ROI**: Essential for multi-user support

#### 5.2 Add Redis Caching Layer

**Recommendation**: Cache expensive LLM responses
- Story cache: 24-hour TTL
- Quiz cache: 1-hour TTL  
- Vocabulary cache: 7-day TTL

**Effort**: Medium (3-4 days)
**ROI**: Very High (60-80% cost reduction)

#### 5.3 Implement JWT Authentication

**Recommendation**: Add secure multi-user auth
- Access tokens: 1-hour expiration
- Refresh tokens: 7-day expiration
- httpOnly cookies for security

**Effort**: High (5-7 days)
**ROI**: Essential for production

---

## Architecture Improvement Summary

### Quick Wins (Do Now)
1. Add response caching (1 day, very high ROI)
2. Implement error telemetry (1 day, high ROI)
3. Extract configuration files (1-2 days, medium ROI)

### Short-Term (Next Sprint)
1. Migrate to Zustand (2-3 days, high ROI)
2. Add IndexedDB storage (2-3 days, high ROI)
3. Implement request queue (2-3 days, high ROI)
4. Optimize TTS timing (2-3 days, medium ROI)

### Medium-Term (Post-MVP)
1. Add PWA support (2-3 days, medium ROI)
2. Context-aware vocabulary (3-4 days, high educational ROI)
3. Backend health monitoring (1 day, medium ROI)

### Long-Term (Production Ready)
1. Database migration (5-7 days, essential)
2. Redis caching (3-4 days, very high ROI)
3. JWT authentication (5-7 days, essential)
4. Retry queue system (2-3 days, low ROI)

---

## Conclusion

Reading Quest demonstrates strong architectural foundations with clear separation of concerns, type safety, and progressive enhancement design. The main areas for improvement focus on:

1. **Performance optimization** (Context → Zustand migration)
2. **Cost reduction** (Caching layer implementation)
3. **Reliability** (Error telemetry, retry mechanisms)
4. **Scalability** (Database migration preparation)

The architecture is well-positioned for growth, with a clear migration path from MVP to production-ready application.

---

**Document Status**: Complete  
**Review Date**: 2025-01-XX  
**Next Review**: After Phase 7 backend migration