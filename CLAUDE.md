# CLAUDE.md - Reading App V2

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

**Version**: 2.0
**Last Updated**: 2025-10-11
**Status**: Planning Complete - Ready for Implementation

---

## 🚀 Project Overview

**Reading App V2** is a gamified multilingual reading comprehension webapp for children (3rd-6th grade). The app features:

- **Multi-language learning**: English (primary) with Korean and Mandarin (secondary languages)
- **Language blending slider**: 0-10 scale (100% English → 100% secondary language)
- **Virtual pet companion**: Tamagotchi-style learning buddy with 7 emotions, 3 evolution tracks (Knowledge, Coolness, Culture)
- **Gamification**: Achievements, quests, shop, XP/level system
- **AI-powered**: Azure OpenAI (gpt-5-pro for stories/quizzes, FLUX-1.1-pro for pet art)
- **BONUS feature**: Audio reading with synchronized word highlighting

---

## 🎯 Architecture Decision Records

### Tech Stack
- **Frontend**: React 18 + TypeScript + Vite (port 5173)
- **Backend**: Node.js + Express + PostgreSQL (port 8080) - POST-MVP
- **Styling**: Tailwind CSS + Framer Motion
- **State**: React Context + localStorage (MVP), API integration (post-MVP)
- **AI**: Azure OpenAI (gpt-5-pro, FLUX-1.1-pro)

### Development Approach
- **Pure frontend MVP** (localStorage for persistence)
- **No authentication** for MVP
- **Backend integration** in Phase 7 (POST-MVP)
- **Multi-page navigation** (6 pages: Dashboard, Reading, Achievements, Shop, Progress, Profile)

### Priority Order
1. **Language features** (blend slider, hints, romanization)
2. **Virtual pet system** (emotions, evolution, interactions)
3. **Reading & quiz generation** (story prompts, AI generation)
4. **Gamification** (achievements, quests, shop, XP system)
5. **BONUS**: Audio reading with highlighting (Phase 8)

---

## 📁 Project Structure

```
reading_app/                      # Root project directory
├── CLAUDE.md                     # This file (root orchestration)
├── PRPs/                         # Product Requirement Prompts
│   ├── frontend/                 # Frontend PRPs
│   ├── backend/                  # Backend PRPs (POST-MVP)
│   └── fullstack/                # Cross-cutting PRPs
├── docs/                         # Planning documentation
│   ├── v2-architecture.md
│   ├── wireframes/
│   ├── mock-data-schema.md
│   ├── api-contract.md
│   ├── component-specifications.md
│   ├── audio-sync-architecture.md
│   ├── pet-evolution-system.md
│   └── implementation-strategy.md
├── frontend/                     # Frontend application (to be created)
│   ├── CLAUDE.md                 # Frontend-specific guide
│   ├── src/
│   ├── public/
│   └── package.json
└── backend/                      # Backend API (POST-MVP)
    ├── CLAUDE.md                 # Backend-specific guide
    └── src/
```

---

## ⚡ QUICK CONTEXT RECOVERY

### After `/clear` or Starting New Session

**Use this command to instantly recover project context**:

```bash
/recover-context
```

**What it does**:
1. ✅ Detects which domain you're working on (frontend/backend/fullstack)
2. ✅ Loads appropriate CLAUDE.md files in correct order
3. ✅ Shows current PRP progress and next actions
4. ✅ Displays recent git activity
5. ✅ Provides clear path to continue work

**When to use**:
- After running `/clear` to reset context
- After power cycle or session timeout
- Returning to project after time away
- Context limit reached (>150K tokens)
- Switching between major features

**Time required**: 30 seconds (ultra-fast) to 5 minutes (complete)

**See**: `.claude/commands/recover-context.md` for full documentation

---

## 🚨 CRITICAL: PRP-Based Development Workflow

### What is a PRP?

**PRP (Product Requirement Prompt)** = Detailed implementation guide for a specific feature

- Step-by-step instructions
- Code examples and file paths
- Validation checkpoints with sub-agent commands
- Quality gates (testing, accessibility, performance, security)

### PRP Workflow Commands

#### Generate a PRP
```bash
/generate-prp docs/wireframes/dashboard.md
```
**Output**: Creates `PRPs/frontend/dashboard-implementation.md`

#### Execute a PRP
```bash
/execute-prp PRPs/frontend/dashboard-implementation.md
```
**Workflow**:
1. Reads PRP file
2. Creates todo list from PRP steps
3. Executes steps sequentially
4. Runs validation at each gate
5. Uses sub-agents for quality checks
6. Marks PRP complete when all steps done

### PRP Directory Organization

- **`PRPs/frontend/`**: Frontend feature PRPs (components, pages, UI)
- **`PRPs/backend/`**: Backend API PRPs (endpoints, database, auth) - POST-MVP
- **`PRPs/fullstack/`**: Cross-cutting PRPs (Azure integration, deployment, offline sync)

**See**: `PRPs/frontend/README.md`, `PRPs/backend/README.md`, `PRPs/fullstack/README.md` for available PRPs

---

## 🛡️ MANDATORY: Sub-Agent Validation

**EXPECTATION**: Claude Code MUST use `/agents` to verify and check code quality throughout development.

**📖 See `.claude/SHARED-PATTERNS.md` for complete validation patterns and commands**

### Quick Reference

**6 Mandatory Validation Points**:
1. After Component Implementation
2. After State Management Changes
3. After Security-Related Code
4. After API Integration
5. After Performance Optimization
6. Before Every Commit (MANDATORY)

**FAILURE TO USE AGENTS = INCOMPLETE DEVELOPMENT**

---

## 📊 Development Progress Tracking

**📖 See `.claude/SHARED-PATTERNS.md` for complete TodoWrite usage patterns**

### Quick Reference

**TodoWrite Tool (MANDATORY)**:
- ✅ Create todos at start of PRP execution
- ✅ ONE task `in_progress` at a time
- ✅ Mark `completed` immediately after finishing
- ✅ Update todos at each PRP step

---

## 🔄 Context Management Strategy

### When to Reset Context

**Problem**: Claude Code context limit (200K tokens)

**Reset Triggers**:
- Context usage >150K tokens (75% full)
- Switching between major features
- Completing a PRP

### Context Recovery (After Reset)

**🚀 FASTEST METHOD**: Use the `/recover-context` command (see section above)

```bash
/recover-context
```

**Manual Recovery** (if command unavailable):
```bash
# 1. Read root CLAUDE.md
Read: /Users/joromini/Documents/pyprojects/crewai/gitclone/renzo/reading_app/CLAUDE.md

# 2. Read domain-specific CLAUDE.md
Read: /Users/joromini/Documents/pyprojects/crewai/gitclone/renzo/reading_app/frontend/CLAUDE.md

# 3. Read current PRP
Read: /Users/joromini/Documents/pyprojects/crewai/gitclone/renzo/reading_app/PRPs/frontend/dashboard-implementation.md

# 4. Check progress (if saved)
Read: /Users/joromini/Documents/pyprojects/crewai/gitclone/renzo/reading_app/docs/progress/session-2025-10-11.md

# 5. Resume development
/execute-prp PRPs/frontend/dashboard-implementation.md
```

### Minimal Context Strategy

**Only load what's needed**:
- ✅ Root CLAUDE.md (project context)
- ✅ Frontend/Backend CLAUDE.md (domain context)
- ✅ Current PRP (task context)
- ✅ Current component files (implementation context)
- ❌ Don't load: All planning docs (use as reference only)
- ❌ Don't load: Completed PRPs (unless needed for reference)

### Efficiency Guidelines

**📖 See `.claude/SHARED-PATTERNS.md` for complete efficiency patterns**

**Avoid re-reading files unnecessarily**:
- ✅ After editing a file, you know its contents - don't re-read
- ✅ Make multiple edits without re-reading between them
- ✅ Trust your recent edits unless user/linter modified the file
- ❌ Don't re-read after every edit (wastes 1000+ tokens per read)

---

## 🎯 Development Phases

### Phase 1: Foundation (Weeks 1-2)
**PRPs**: `project-setup.md`, `component-library.md`, `theme-system.md`, `navigation.md`

### Phase 2: Core Reading Experience (Weeks 3-5)
**PRPs**: `dashboard-page.md`, `reading-page.md`, `language-blending.md`, `speech-to-text.md`, `azure-openai-integration.md`

### Phase 3: Pet System (Weeks 6-7)
**PRPs**: `pet-system.md`, `pet-evolution.md`, `pet-interactions.md`, `pet-art-generation.md`

### Phase 4: Gamification (Weeks 8-9)
**PRPs**: `achievements.md`, `quests.md`, `shop.md`

### Phase 5: Progress & Profile (Weeks 10-11)
**PRPs**: `progress-page.md`, `profile-page.md`

### Phase 6: Polish (Week 12)
**PRPs**: `animations.md`, `error-handling.md`, `performance-optimization.md`

### Phase 7: Backend Integration (Weeks 13-15) - POST-MVP
**PRPs**: `backend/project-setup.md`, `backend/user-endpoints.md`, `backend/pet-endpoints.md`

### Phase 8: BONUS - Audio Reading (Weeks 16-17)
**PRPs**: `fullstack/audio-generation.md`, `frontend/audio-player.md`

---

## 🚪 Quality Gates

All features must pass 5 quality gates before proceeding:

### Gate 1: Code Quality
```bash
npm run lint && npm run type-check
/agents code-reviewer "Comprehensive code quality review"
```
**Criteria**: No errors, sub-agent approval, follows conventions

### Gate 2: Testing
```bash
npm test && npm run test:coverage
```
**Criteria**: All tests pass, >80% coverage, critical paths tested

### Gate 3: Accessibility
```bash
npm run test:a11y
/agents accessibility-checker "WCAG AA compliance check"
```
**Criteria**: WCAG AA compliant, keyboard nav, screen reader compatible

### Gate 4: Performance
```bash
npm run build -- --analyze && npm run lighthouse
```
**Criteria**: Lighthouse >90, bundle <500KB gzipped, TTI <3s

### Gate 5: Child Safety
```bash
/agents security-auditor "Child safety compliance audit"
```
**Criteria**: No inappropriate content, content filtering active, age-appropriate design

---

## 📚 Planning Documentation Reference

All planning documents are in `docs/` directory. Reference these when building features:

- **`docs/v2-architecture.md`**: Complete technical specification (130+ pages)
- **`docs/wireframes/`**: All 6 pages with desktop/mobile layouts
- **`docs/mock-data-schema.md`**: TypeScript interfaces, mock data
- **`docs/api-contract.md`**: 17 REST endpoints for backend integration
- **`docs/component-specifications.md`**: 60+ React components with props
- **`docs/audio-sync-architecture.md`**: Audio reading with highlighting (BONUS)
- **`docs/pet-evolution-system.md`**: 21 pet forms, 147 images, evolution logic
- **`docs/implementation-strategy.md`**: This structured approach (full details)

**See each document for detailed specifications when implementing related features.**

---

## 🚨 CRITICAL LEARNINGS

### Azure OpenAI Integration

**Problem**: Azure OpenAI failing with 401/404 errors despite valid credentials
**Root Cause**: Using `OpenAI` instead of `AzureOpenAI` client class
**Prevention**: Always use service-specific client classes

```typescript
// ❌ WRONG - Causes 401/404 errors
import OpenAI from 'openai'
new OpenAI({ baseURL: ..., defaultQuery: ..., defaultHeaders: ... })

// ✅ CORRECT - Works immediately
import { AzureOpenAI } from 'openai'
new AzureOpenAI({ apiVersion: ..., endpoint: ..., apiKey: ... })
```

**Full Documentation**: `docs/learnings/azure-openai-integration.md`

### React White Screen Debugging

**Problem**: React apps showing white screen despite correct-looking code
**Root Cause**: Import errors, CSS loading issues, component complexity
**Solution**: Incremental development with inline styles

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
```

**Full Documentation**: `docs/react-white-screen-debugging.md`

### Prevention Rules
1. Check for service-specific clients FIRST (AzureOpenAI, AzureStorage, etc.)
2. Start with official documentation examples before custom implementation
3. Test basic connection before adding complexity
4. Build incrementally from working foundation
5. Use inline styles for critical theming
6. Test imports separately before adding to components

---

## 🎯 CRITICAL: Testing Best Practices

### ❌ Avoid Hardcoded Values

**Bad Pattern**:
```typescript
expect(passage.content).toBe("The space station orbits Earth..."); // Hardcoded
expect(passage.wordCount).toBe(347); // Exact number
```

### ✅ Use Range-Based Validation

**Good Pattern**:
```typescript
expect(passage.wordCount).toBeGreaterThanOrEqual(400);
expect(passage.wordCount).toBeLessThanOrEqual(600);
expect(passage.gradeLevel).toMatch(/^(3rd|4th|5th|6th)$/);
```

**Full Guidelines**: See section 269-423 of this file (testing patterns preserved from original CLAUDE.md)

---

## 🔗 Navigation Between CLAUDE.md Files

This is the **ROOT CLAUDE.md** (orchestration level).

For domain-specific development:
- **Frontend Development**: `frontend/CLAUDE.md`
- **Backend Development**: `backend/CLAUDE.md` (POST-MVP)

Each domain CLAUDE.md contains:
- Specific development commands
- Technology stack details
- Component/API patterns
- Testing requirements
- Available PRPs for that domain

---

## 🚀 Getting Started (New Development Session)

### Step 1: Read CLAUDE.md Files
```bash
# Read this root CLAUDE.md (already done)
# Read frontend CLAUDE.md
Read: frontend/CLAUDE.md
```

### Step 2: Choose a PRP to Execute
```bash
# See available PRPs
Read: PRPs/frontend/README.md

# Execute first PRP (project setup)
/execute-prp PRPs/frontend/project-setup.md
```

### Step 3: Follow PRP Workflow
1. Implement feature step-by-step
2. Run tests incrementally
3. Use sub-agents at validation points (MANDATORY)
4. Update todo list continuously
5. Pass all quality gates
6. Commit code

### Step 4: Move to Next PRP
```bash
# Mark current PRP complete
# Execute next PRP
/execute-prp PRPs/frontend/dashboard-page.md
```

---

## 📋 Summary: Key Success Factors

1. **MANDATORY Sub-Agent Usage**: Never skip validation
2. **Todo List Discipline**: Update at every step, one in_progress task only
3. **Incremental Testing**: Test as you build, don't batch
4. **Context Management**: Reset at 75% usage, use recovery commands
5. **Quality Gates**: Pass all 5 gates before moving forward
6. **PRP-Based Development**: Generate → Execute → Validate → Complete
7. **Child Safety First**: Content filtering, age-appropriate design, COPPA compliance

---

## 🎓 Additional Resources

- **Implementation Strategy** (full details): `docs/implementation-strategy.md`
- **Frontend Guide**: `frontend/CLAUDE.md`
- **Backend Guide**: `backend/CLAUDE.md`
- **PRP Templates**: `PRPs/{frontend,backend,fullstack}/README.md`
- **Planning Docs**: `docs/v2-architecture.md`, `docs/wireframes/`, etc.

---

**CLAUDE.md Status**: ✅ Complete
**Project Status**: Planning Complete - Ready for Phase 1 Implementation
**Next Step**: Read `frontend/CLAUDE.md` and execute first PRP
