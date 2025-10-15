# Implementation Strategy - Reading App V2

## Overview

This document outlines the structured implementation approach for Reading App V2, leveraging Claude Code best practices with CLAUDE.md files, PRP (Product Requirement Prompt) framework, and mandatory sub-agent validation.

**Version**: 1.0
**Last Updated**: 2025-10-11
**Status**: ✅ Complete - Ready for Development

---

## Table of Contents

1. [Project Structure](#project-structure)
2. [CLAUDE.md Organization](#claudemd-organization)
3. [PRP Framework](#prp-framework)
4. [Development Workflow](#development-workflow)
5. [Sub-Agent Validation Strategy](#sub-agent-validation-strategy)
6. [Context Management](#context-management)
7. [Todo List System](#todo-list-system)
8. [Development Phases](#development-phases)
9. [Quality Gates](#quality-gates)

---

## Project Structure

### Recommended Directory Organization

```
reading_app/                          # Root project directory
├── CLAUDE.md                         # Root project CLAUDE.md (orchestration level)
├── PRPs/                             # Root PRP directory
│   ├── frontend/                     # Frontend-specific PRPs
│   │   ├── dashboard-implementation.md
│   │   ├── reading-page-implementation.md
│   │   ├── pet-system-implementation.md
│   │   └── audio-player-implementation.md
│   ├── backend/                      # Backend-specific PRPs
│   │   ├── api-endpoints-implementation.md
│   │   ├── database-schema-implementation.md
│   │   └── azure-integration-implementation.md
│   └── fullstack/                    # Full-stack feature PRPs
│       ├── authentication-system.md
│       ├── offline-sync-implementation.md
│       └── deployment-pipeline.md
├── docs/                             # Planning documentation (existing)
│   ├── v2-architecture.md
│   ├── wireframes/
│   ├── mock-data-schema.md
│   ├── api-contract.md
│   ├── component-specifications.md
│   ├── audio-sync-architecture.md
│   └── pet-evolution-system.md
├── frontend/                         # Frontend application
│   ├── CLAUDE.md                     # Frontend-specific CLAUDE.md
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── contexts/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── utils/
│   ├── public/
│   ├── package.json
│   └── vite.config.ts
├── backend/                          # Backend API
│   ├── CLAUDE.md                     # Backend-specific CLAUDE.md
│   ├── src/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── models/
│   │   └── utils/
│   ├── package.json
│   └── tsconfig.json
└── .claude/                          # Claude Code configuration
    └── commands/
        ├── generate-prp.md
        ├── execute-prp.md
        └── validate-feature.md
```

---

## CLAUDE.md Organization

### 1. Root CLAUDE.md (Project Orchestration)

**Purpose**: High-level project coordination, cross-cutting concerns, architecture decisions

**Location**: `/reading_app/CLAUDE.md`

**Key Sections**:
```markdown
# Reading App V2 - Root Project Guide

## Project Overview
- Multi-language reading comprehension app for children (3rd-6th grade)
- Tamagotchi-style gamification with virtual pet
- Pure frontend MVP → Backend integration in later phases

## Architecture Decision Records
- Frontend: React 18 + TypeScript + Vite
- Backend: Node.js + Express (post-MVP)
- Database: PostgreSQL (post-MVP)
- AI: Azure OpenAI (gpt-5-pro, FLUX-1.1-pro)

## Development Priorities
1. Language features (English → Korean/Mandarin blending)
2. Virtual pet system
3. Reading & quiz generation
4. Gamification (achievements, quests, shop)
5. BONUS: Audio reading with highlighting

## PRP Workflow
- Generate PRPs: `/generate-prp <planning-doc-path>`
- Execute PRPs: `/execute-prp <prp-path>`
- PRPs stored in: `PRPs/frontend/`, `PRPs/backend/`, `PRPs/fullstack/`

## Critical Rules
- **MANDATORY**: Use sub-agents for all code validation
- **MANDATORY**: Update todo list at each step
- **MANDATORY**: Test each feature before moving to next
- **NEVER**: Skip quality gates
- **NEVER**: Commit code without sub-agent review

## Sub-Agent Validation Points
- After implementing any component → `/agents code-reviewer`
- After security-related code → `/agents security-auditor`
- After performance optimization → `/agents performance-optimizer`
- Before committing → `/agents code-reviewer "Final review"`

## Context Management Strategy
- Use planning docs in `docs/` as reference
- Execute one PRP at a time to maintain focus
- Use sub-agents for complex multi-file operations
- Regular context resets with summary generation

## Quality Gates
- ✅ Code Review (sub-agent validation)
- ✅ Unit Tests (>80% coverage)
- ✅ Integration Tests (critical paths)
- ✅ Accessibility Checks (WCAG AA)
- ✅ Performance Benchmarks (Lighthouse >90)
```

---

### 2. Frontend CLAUDE.md

**Purpose**: Frontend-specific development guidelines, component patterns, state management

**Location**: `/reading_app/frontend/CLAUDE.md`

**Key Sections**:
```markdown
# Frontend Development Guide - Reading App V2

## 🚀 Quick Start for Development

### Context Recovery (After Session Reset)
1. Read root CLAUDE.md: `/reading_app/CLAUDE.md`
2. Read this frontend CLAUDE.md
3. Identify current PRP: Check `PRPs/frontend/` for in-progress PRP
4. Execute PRP: `/execute-prp PRPs/frontend/<current-feature>.md`

## Development Commands
- Start dev server: `npm run dev` (port 5173)
- Run tests: `npm test`
- Type check: `npm run type-check`
- Lint: `npm run lint`
- Build: `npm run build`

## Architecture Patterns

### Component Organization
- **Pages**: Top-level route components (`src/pages/`)
- **Features**: Feature-specific components (`src/components/{feature}/`)
- **Common**: Reusable UI components (`src/components/common/`)

### State Management
- **Global State**: React Context (UserContext, PetContext, etc.)
- **Local State**: useState, useReducer
- **Persistence**: localStorage (MVP), IndexedDB (future)

### Naming Conventions
- Components: PascalCase (`VirtualPet.tsx`)
- Hooks: camelCase with `use` prefix (`useSyncedAudio.ts`)
- Props: `{ComponentName}Props` interface
- Event handlers: `on{Event}` pattern

## PRP Execution Guidelines

### Before Starting a PRP
1. Read planning docs referenced in PRP
2. Verify all dependencies installed
3. Check dev server is running
4. Create feature branch: `git checkout -b feature/<prp-name>`

### During PRP Execution
1. Update todo list at each step
2. Test incrementally (don't batch)
3. Use sub-agents for validation
4. Commit after each major milestone

### After Completing PRP
1. Run full test suite
2. Sub-agent code review (MANDATORY)
3. Update progress tracking
4. Merge to main branch

## Mandatory Sub-Agent Validation

### Component Implementation
```bash
# After creating any component
/agents code-reviewer "Review {ComponentName} for TypeScript best practices, accessibility, and React patterns"
```

### State Management
```bash
# After adding Context or complex hooks
/agents code-reviewer "Review state management for {Feature} - check for memory leaks, optimization opportunities"
```

### UI/UX Features
```bash
# After implementing UI features
/agents accessibility-checker "Validate {ComponentName} for WCAG AA compliance, keyboard navigation, screen reader support"
```

### Before Commit
```bash
# Final validation before commit
/agents code-reviewer "Final review for {Feature} - comprehensive quality check"
```

## Testing Requirements

### Unit Tests (Required)
- All utility functions
- All custom hooks
- Critical business logic

### Integration Tests (Required)
- User authentication flows
- Story generation → Reading → Quiz flow
- Pet feeding, evolution
- Achievement unlocking

### E2E Tests (Optional for MVP)
- Complete user journeys
- Multi-page navigation

## File Structure Guidelines

### Component File Pattern
```
src/components/{feature}/{ComponentName}/
├── {ComponentName}.tsx         # Main component
├── {ComponentName}.test.tsx    # Tests
├── {ComponentName}.module.css  # Styles (if needed)
├── types.ts                    # Component-specific types
└── index.ts                    # Barrel export
```

### Service File Pattern
```
src/services/{ServiceName}/
├── {ServiceName}.ts            # Main service
├── {ServiceName}.test.ts       # Tests
├── types.ts                    # Service types
└── index.ts                    # Barrel export
```

## Technology Stack

### Core
- React 18.3.1
- TypeScript 5.7
- Vite 6.0

### UI & Styling
- Tailwind CSS 3.4
- Framer Motion 11.x (animations)
- Radix UI (accessible primitives)

### State & Data
- React Context API
- localStorage (MVP persistence)
- IndexedDB (future offline support)

### Testing
- Vitest
- React Testing Library
- MSW (API mocking)

### AI Integration
- Azure OpenAI SDK
- FLUX-1.1-pro (via Azure)

## Performance Guidelines

### Code Splitting
- Lazy load pages: `React.lazy(() => import('./pages/Dashboard'))`
- Dynamic imports for heavy components

### Memoization
- Use `React.memo` for expensive components
- Use `useMemo` for expensive calculations
- Use `useCallback` for event handlers passed to children

### Image Optimization
- Use WebP format
- Lazy load images: `<img loading="lazy" />`
- Responsive images with srcset

## Accessibility Checklist

- [ ] All interactive elements keyboard accessible
- [ ] ARIA labels on all non-text elements
- [ ] Focus indicators visible
- [ ] Color contrast meets WCAG AA (4.5:1)
- [ ] Alt text on all images
- [ ] Form validation with clear error messages
- [ ] Skip links for main content
- [ ] Semantic HTML (proper heading hierarchy)

## Child Safety Guidelines

- [ ] Content filtering before AI generation
- [ ] No external links without validation
- [ ] No user-generated content without moderation
- [ ] Age-appropriate language only
- [ ] No data collection without parent consent

## Common Pitfalls to Avoid

### ❌ Don't Do This
- Hardcoded values in tests (use ranges, patterns)
- Direct localStorage manipulation (use service layer)
- Inline styles (use Tailwind or CSS modules)
- prop drilling (use Context for deep props)
- Unused imports or variables

### ✅ Do This
- Property-based testing with flexible assertions
- Service abstraction for localStorage
- Consistent styling approach
- Context for global state
- Clean, well-organized code

## PRPs Available for Execution

### Phase 1: Foundation
- `PRPs/frontend/project-setup.md` - Initial setup, dependencies
- `PRPs/frontend/component-library.md` - Common components (Button, Card, Modal, etc.)
- `PRPs/frontend/theme-system.md` - Theme provider, Tailwind config

### Phase 2: Core Pages
- `PRPs/frontend/dashboard-page.md` - Dashboard with pet, quests, stats
- `PRPs/frontend/reading-page.md` - Story generation, display, quiz
- `PRPs/frontend/navigation.md` - Header, bottom nav, routing

### Phase 3: Pet System
- `PRPs/frontend/pet-system.md` - Virtual pet component, emotions, stats
- `PRPs/frontend/pet-evolution.md` - Evolution animations, ceremonies
- `PRPs/frontend/pet-interactions.md` - Feed, play, boost actions

### Phase 4: Gamification
- `PRPs/frontend/achievements.md` - Achievement grid, modals, progress
- `PRPs/frontend/quests.md` - Daily/weekly quests, rewards
- `PRPs/frontend/shop.md` - Shop items, purchase flow, inventory

### Phase 5: Progress & Profile
- `PRPs/frontend/progress-page.md` - Charts, analytics, history
- `PRPs/frontend/profile-page.md` - Settings, customization

### Phase 6: Language Features
- `PRPs/frontend/language-blending.md` - Blend level slider, inline hints
- `PRPs/frontend/speech-to-text.md` - Voice input for story prompts

### Phase 7: Polish
- `PRPs/frontend/animations.md` - Confetti, transitions, loading states
- `PRPs/frontend/error-handling.md` - Error boundaries, retry logic

### Phase 8: BONUS
- `PRPs/frontend/audio-player.md` - Audio reading with word highlighting

## Development Progress Tracking

### Use TodoWrite Tool
- Create todos at start of PRP execution
- Mark in_progress when starting a task
- Mark completed immediately after finishing
- ONE task in_progress at a time

### Example Todo Pattern
```typescript
[
  {
    "content": "Set up React project with Vite and TypeScript",
    "status": "completed",
    "activeForm": "Setting up React project"
  },
  {
    "content": "Create common component library (Button, Card, Modal)",
    "status": "in_progress",
    "activeForm": "Creating common component library"
  },
  {
    "content": "Implement Dashboard page with pet widget",
    "status": "pending",
    "activeForm": "Implementing Dashboard page"
  }
]
```

## Next Steps
1. Read root CLAUDE.md for project context
2. Choose a PRP from Phase 1 to start
3. Execute: `/execute-prp PRPs/frontend/<chosen-prp>.md`
4. Follow PRP validation gates
5. Use sub-agents for quality checks
```

---

### 3. Backend CLAUDE.md

**Purpose**: Backend-specific development guidelines, API patterns, database management

**Location**: `/reading_app/backend/CLAUDE.md`

**Key Sections**:
```markdown
# Backend Development Guide - Reading App V2

## 🚀 Quick Start for Development

### Context Recovery (After Session Reset)
1. Read root CLAUDE.md: `/reading_app/CLAUDE.md`
2. Read this backend CLAUDE.md
3. Identify current PRP: Check `PRPs/backend/` for in-progress PRP
4. Execute PRP: `/execute-prp PRPs/backend/<current-feature>.md`

## Development Commands
- Start dev server: `npm run dev` (port 8080)
- Run tests: `npm test`
- Database migrations: `npm run migrate`
- Seed database: `npm run seed`
- Type check: `npm run type-check`

## Architecture Patterns

### API Structure
- **Routes**: Express routes (`src/routes/`)
- **Controllers**: Request handlers (`src/controllers/`)
- **Services**: Business logic (`src/services/`)
- **Models**: Database models (`src/models/`)
- **Middleware**: Auth, validation, error handling (`src/middleware/`)

### Naming Conventions
- Routes: RESTful naming (`/api/v1/users`, `/api/v1/pets`)
- Controllers: `{resource}Controller.ts` (e.g., `userController.ts`)
- Services: `{resource}Service.ts` (e.g., `storyGenerationService.ts`)
- Models: `{Resource}.ts` (e.g., `User.ts`, `Pet.ts`)

## PRP Execution Guidelines

### Before Starting a PRP
1. Read API contract: `docs/api-contract.md`
2. Verify database is running (PostgreSQL)
3. Check environment variables configured
4. Create feature branch: `git checkout -b backend/<prp-name>`

### During PRP Execution
1. Update todo list at each step
2. Test endpoints with Postman/curl
3. Use sub-agents for validation
4. Write tests alongside implementation

### After Completing PRP
1. Run full test suite (unit + integration)
2. Sub-agent security review (MANDATORY)
3. API documentation update
4. Merge to main branch

## Mandatory Sub-Agent Validation

### API Endpoint Implementation
```bash
# After creating any endpoint
/agents code-reviewer "Review {endpoint} API implementation for security, error handling, and RESTful best practices"
```

### Database Operations
```bash
# After database changes
/agents code-reviewer "Review database schema/queries for {Feature} - check for SQL injection, indexing, performance"
```

### Security Features
```bash
# After implementing authentication or authorization
/agents security-auditor "Comprehensive security audit for {Feature} - authentication, authorization, data validation"
```

### External Integrations
```bash
# After Azure OpenAI integration
/agents code-reviewer "Review API integration for {Service} - error handling, rate limiting, cost management"
```

## Technology Stack

### Core
- Node.js 20.x
- TypeScript 5.7
- Express 4.x

### Database
- PostgreSQL 16 (production)
- Prisma ORM

### Authentication
- JWT (jsonwebtoken)
- bcrypt (password hashing)

### AI Integration
- Azure OpenAI SDK
- FLUX-1.1-pro API

### Testing
- Jest
- Supertest (API testing)

## API Design Principles

### RESTful Standards
- GET: Retrieve resources
- POST: Create resources
- PATCH: Partial update
- DELETE: Remove resources
- PUT: Full replacement (avoid for MVP)

### Response Format
```typescript
// Success
{
  "success": true,
  "data": { ... },
  "timestamp": 1696284000000
}

// Error
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Human-readable message",
    "details": { ... }
  },
  "timestamp": 1696284000000
}
```

### Pagination
```typescript
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 145,
    "totalPages": 8
  }
}
```

## Security Guidelines

### Authentication
- JWT tokens with 1-hour expiration
- Refresh tokens with 7-day expiration
- Secure httpOnly cookies for tokens

### Authorization
- Role-based access control (RBAC)
- Resource ownership validation
- API rate limiting (per user, per IP)

### Data Validation
- Joi schema validation on all inputs
- SQL injection prevention (use ORM)
- XSS prevention (sanitize inputs)

### Secrets Management
- Environment variables for API keys
- Never commit secrets to git
- Use Azure Key Vault (production)

## Database Guidelines

### Schema Design
- Use migrations for all schema changes
- Foreign key constraints
- Indexes on frequently queried fields
- Timestamp fields (createdAt, updatedAt)

### Query Optimization
- Use Prisma query optimization
- Avoid N+1 queries (use `include`)
- Pagination for large result sets
- Database connection pooling

## Error Handling

### Error Types
```typescript
class AppError extends Error {
  statusCode: number;
  code: string;
  details?: any;

  constructor(message: string, statusCode: number, code: string, details?: any) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}
```

### Common Error Codes
- `VALIDATION_ERROR` (400)
- `UNAUTHORIZED` (401)
- `FORBIDDEN` (403)
- `NOT_FOUND` (404)
- `RATE_LIMIT_EXCEEDED` (429)
- `INTERNAL_ERROR` (500)

## Testing Requirements

### Unit Tests (Required)
- All service functions
- All utility functions
- Business logic

### Integration Tests (Required)
- All API endpoints
- Database operations
- External service integrations

### Load Tests (Optional)
- Story generation endpoint
- Audio generation endpoint

## PRPs Available for Execution

### Phase 1: Foundation
- `PRPs/backend/project-setup.md` - Express setup, TypeScript config
- `PRPs/backend/database-setup.md` - PostgreSQL, Prisma ORM
- `PRPs/backend/middleware.md` - Auth, validation, error handling

### Phase 2: Core APIs
- `PRPs/backend/user-endpoints.md` - User CRUD, profile, settings
- `PRPs/backend/pet-endpoints.md` - Pet state, feed, play, boost
- `PRPs/backend/content-generation.md` - Story/quiz generation

### Phase 3: Gamification APIs
- `PRPs/backend/achievement-endpoints.md` - Achievements, progress
- `PRPs/backend/quest-endpoints.md` - Daily/weekly quests, rewards
- `PRPs/backend/shop-endpoints.md` - Shop items, purchases, inventory

### Phase 4: Analytics & Progress
- `PRPs/backend/progress-endpoints.md` - Analytics, history
- `PRPs/backend/leaderboard.md` - User rankings (optional)

### Phase 5: Advanced Features
- `PRPs/backend/audio-generation.md` - TTS with word timings (BONUS)
- `PRPs/backend/caching.md` - Redis caching for performance

## Development Progress Tracking

### Use TodoWrite Tool
- Create todos at start of PRP execution
- Mark in_progress when starting a task
- Mark completed immediately after finishing
- ONE task in_progress at a time

## Next Steps
1. Read root CLAUDE.md for project context
2. Wait for frontend MVP completion
3. Execute: `/execute-prp PRPs/backend/project-setup.md`
4. Follow PRP validation gates
```

---

## PRP Framework

### What is a PRP?

**PRP (Product Requirement Prompt)** = Detailed implementation guide for a specific feature

**Structure**:
```markdown
# PRP: {Feature Name}

## Overview
- Feature description
- Dependencies
- Estimated time

## Prerequisites
- Required planning docs
- Required components/services
- Environment setup

## Implementation Steps

### Step 1: {Task Name}
**What**: Description of what to build
**Why**: Reasoning behind approach
**How**: Detailed instructions

**Files to Create/Modify**:
- `path/to/file.ts`

**Code**:
```typescript
// Implementation code
```

**Validation**:
```bash
# Test command
npm test -- ComponentName.test.ts

# Sub-agent validation
/agents code-reviewer "Review ComponentName for {specific concerns}"
```

### Step 2: {Next Task}
...

## Quality Gates

### Gate 1: Unit Tests
- [ ] All tests passing
- [ ] Coverage >80%

### Gate 2: Sub-Agent Review
- [ ] Code quality validated
- [ ] Security checked
- [ ] Performance acceptable

### Gate 3: Integration Test
- [ ] Feature works end-to-end
- [ ] No regressions

## Completion Checklist
- [ ] All steps completed
- [ ] All quality gates passed
- [ ] Documentation updated
- [ ] PRP marked complete in todo list
```

---

### PRP Generation Workflow

#### Using `/generate-prp` Command

**Command**: `/generate-prp <planning-doc-path>`

**Example**:
```bash
/generate-prp docs/wireframes/dashboard.md
```

**Output**: Creates PRP at `PRPs/frontend/dashboard-implementation.md`

---

#### Manual PRP Creation

If auto-generation needs refinement:

1. Copy PRP template
2. Fill in feature-specific details
3. Reference planning docs
4. Add validation checkpoints
5. Save in appropriate directory (`PRPs/frontend/` or `PRPs/backend/`)

---

### PRP Execution Workflow

#### Using `/execute-prp` Command

**Command**: `/execute-prp <prp-path>`

**Example**:
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

---

## Development Workflow

### Phase-Based Development Strategy

```
┌──────────────────────────────────────────────────────┐
│              Development Phase Workflow              │
└──────────────────────────────────────────────────────┘

Phase 1: Foundation
   ↓
1. Generate PRP: /generate-prp docs/v2-architecture.md
2. Execute PRP: /execute-prp PRPs/frontend/project-setup.md
3. Validation: /agents code-reviewer "Initial setup validation"
4. Mark complete, move to next PRP

Phase 2: Core Features
   ↓
1. Generate PRP: /generate-prp docs/wireframes/dashboard.md
2. Execute PRP: /execute-prp PRPs/frontend/dashboard-page.md
3. Validation: /agents code-reviewer "Dashboard component review"
4. Test: npm test -- Dashboard.test.tsx
5. Mark complete, move to next PRP

[Repeat for each phase...]
```

---

### Daily Development Session

**Start of Session**:
```bash
# 1. Check current progress
cat PRPs/frontend/current-prp.txt  # Track current PRP

# 2. Read relevant CLAUDE.md
# - Root CLAUDE.md
# - Frontend/Backend CLAUDE.md
# - Current PRP

# 3. Check todo list status
# (Claude Code shows this automatically)

# 4. Resume development
/execute-prp PRPs/frontend/<current-prp>.md
```

**During Session**:
- Work through PRP steps sequentially
- Update todo list at each step
- Test incrementally (don't batch)
- Use sub-agents at validation points
- Commit after each major milestone

**End of Session**:
```bash
# 1. Mark current step in PRP
echo "Completed Step 3 of 8" > PRPs/frontend/current-prp.txt

# 2. Update todo list (mark progress)

# 3. Commit work
git add .
git commit -m "feat: Completed Dashboard header component"

# 4. Document blockers/next steps
```

---

## Sub-Agent Validation Strategy

### Mandatory Validation Points

#### 1. After Component Implementation

**Trigger**: Immediately after creating/modifying a component

**Command**:
```bash
/agents code-reviewer "Review {ComponentName} component:
- TypeScript type safety
- React best practices (hooks, memoization)
- Accessibility (ARIA, keyboard nav, screen reader)
- Child safety (content filtering, age-appropriate design)
- Performance (unnecessary re-renders, expensive operations)
"
```

**Expected Output**: Validation report with pass/fail + recommendations

---

#### 2. After State Management Changes

**Trigger**: Adding/modifying Context, hooks, or complex state logic

**Command**:
```bash
/agents code-reviewer "Review state management for {Feature}:
- Memory leaks (useEffect cleanup, listener removal)
- Optimization opportunities (useMemo, useCallback, React.memo)
- State consistency (race conditions, stale closures)
- Performance (unnecessary re-renders)
"
```

---

#### 3. After Security-Related Code

**Trigger**: Authentication, API calls, user input handling

**Command**:
```bash
/agents security-auditor "Comprehensive security audit for {Feature}:
- Input validation (XSS, injection attacks)
- API key protection (never exposed in frontend)
- Data sanitization (user-generated content)
- Child safety compliance (COPPA, age-appropriate content)
"
```

---

#### 4. After API Integration

**Trigger**: Azure OpenAI, external service integration

**Command**:
```bash
/agents code-reviewer "Review API integration for {Service}:
- Error handling (network failures, timeout, rate limits)
- Cost management (caching, request batching)
- Retry logic (exponential backoff)
- API key security (backend-only, never in frontend)
"
```

---

#### 5. After Performance Optimization

**Trigger**: Code splitting, lazy loading, memoization

**Command**:
```bash
/agents performance-optimizer "Analyze performance for {Feature}:
- Bundle size impact
- Lazy loading effectiveness
- Memoization correctness
- Memory usage patterns
"
```

---

#### 6. Before Every Commit (MANDATORY)

**Trigger**: Before running `git commit`

**Command**:
```bash
/agents code-reviewer "Final comprehensive review before commit:
- Code quality and maintainability
- Test coverage adequacy
- Documentation completeness
- No TODO/FIXME left unresolved (or documented as known issues)
"
```

---

### Sub-Agent Validation Workflow

```
Implement Feature
   ↓
Run Tests (npm test)
   ↓
Tests Pass? → No → Fix Issues → Loop
   ↓ Yes
Sub-Agent Validation
   ↓
Validation Pass? → No → Fix Issues Identified → Loop
   ↓ Yes
Mark Todo Complete
   ↓
Commit Code
   ↓
Move to Next Feature
```

---

### Handling Sub-Agent Feedback

**If Sub-Agent Identifies Issues**:

1. **Critical Issues**: Fix immediately before proceeding
2. **Recommendations**: Evaluate priority, fix if time allows
3. **Nice-to-Haves**: Document as tech debt, defer to polish phase

**Document Decisions**:
```markdown
## Sub-Agent Review: Dashboard Component

**Date**: 2025-10-11
**Reviewer**: code-reviewer agent

**Critical Issues**: None

**Recommendations**:
- ✅ Add memoization to expensive calculation (FIXED)
- ✅ Improve error handling in API call (FIXED)
- ⏸️ Extract magic numbers to constants (Deferred to polish phase)

**Tech Debt Created**:
- TODO: Extract hard-coded theme colors to design tokens
```

---

## Context Management

### Challenge: Long Development Sessions

**Problem**: Claude Code context limit (200K tokens)

**Solution**: Structured context reset strategy

---

### Context Reset Workflow

**When to Reset**:
- Context usage >150K tokens (75% full)
- Switching between major features
- Completing a PRP

**How to Reset**:
```markdown
1. Generate summary of current progress
2. Save summary to `docs/progress/session-{date}.md`
3. Update `PRPs/frontend/current-prp.txt` with current step
4. Clear conversation
5. Start new session with context recovery commands
```

**Context Recovery Commands** (New Session):
```bash
# Read root CLAUDE.md
Read: /reading_app/CLAUDE.md

# Read frontend/backend CLAUDE.md
Read: /reading_app/frontend/CLAUDE.md

# Read current PRP
Read: /reading_app/PRPs/frontend/dashboard-implementation.md

# Check progress
Read: /reading_app/docs/progress/session-2025-10-11.md

# Resume development
/execute-prp PRPs/frontend/dashboard-implementation.md
```

---

### Minimal Context Strategy

**Only load what's needed**:
- ✅ Root CLAUDE.md (project context)
- ✅ Frontend/Backend CLAUDE.md (domain context)
- ✅ Current PRP (task context)
- ✅ Current component files (implementation context)
- ❌ Don't load: All planning docs (use as reference only)
- ❌ Don't load: Completed PRPs (unless needed for reference)

---

## Todo List System

### TodoWrite Tool Usage

**Purpose**: Track development progress, maintain focus, provide visibility

**Required Usage**:
- ✅ Create todos at start of PRP execution
- ✅ Mark `in_progress` when starting a task
- ✅ Mark `completed` immediately after finishing
- ✅ ONE task `in_progress` at a time
- ✅ Update todos at each PRP step

---

### Todo Structure for PRP

**Example PRP**: Dashboard Implementation

**Todo List**:
```json
[
  {
    "content": "Create Dashboard page component structure",
    "status": "completed",
    "activeForm": "Creating Dashboard page structure"
  },
  {
    "content": "Implement VirtualPet widget with emotion system",
    "status": "completed",
    "activeForm": "Implementing VirtualPet widget"
  },
  {
    "content": "Build QuestList with daily and weekly quests",
    "status": "in_progress",
    "activeForm": "Building QuestList component"
  },
  {
    "content": "Add StatsGrid for user level, XP, streak, achievements",
    "status": "pending",
    "activeForm": "Adding StatsGrid component"
  },
  {
    "content": "Integrate LanguageSettingsWidget with blend level slider",
    "status": "pending",
    "activeForm": "Integrating LanguageSettingsWidget"
  },
  {
    "content": "Sub-agent validation: Dashboard component review",
    "status": "pending",
    "activeForm": "Validating Dashboard component"
  },
  {
    "content": "Write unit tests for Dashboard components",
    "status": "pending",
    "activeForm": "Writing Dashboard tests"
  }
]
```

---

### Todo List Best Practices

**DO**:
- ✅ Break PRPs into granular tasks (1-2 hour each)
- ✅ Use clear, action-oriented task names
- ✅ Include validation steps in todo list
- ✅ Mark completed immediately (don't batch)
- ✅ Use `activeForm` for progress visibility

**DON'T**:
- ❌ Create vague todos ("Work on frontend")
- ❌ Mark multiple tasks in_progress
- ❌ Skip updating todos (causes tracking confusion)
- ❌ Mark completed before validation passes

---

## Development Phases

### Phase 1: Foundation (Weeks 1-2)

**Goals**:
- Project setup (frontend + backend)
- Common component library
- Theme system
- Basic navigation

**PRPs**:
1. `PRPs/frontend/project-setup.md`
2. `PRPs/frontend/component-library.md`
3. `PRPs/frontend/theme-system.md`
4. `PRPs/frontend/navigation.md`

**Quality Gates**:
- ✅ Dev servers running (frontend: 5173, backend: 8080)
- ✅ All common components tested (>80% coverage)
- ✅ Theme switching works across all components
- ✅ Navigation functional on desktop + mobile

---

### Phase 2: Core Reading Experience (Weeks 3-5)

**Goals**:
- Dashboard page with pet
- Reading page (story generation + quiz)
- Language features (blend level, hints)

**PRPs**:
1. `PRPs/frontend/dashboard-page.md`
2. `PRPs/frontend/reading-page.md`
3. `PRPs/frontend/language-blending.md`
4. `PRPs/frontend/speech-to-text.md`
5. `PRPs/fullstack/azure-openai-integration.md`

**Quality Gates**:
- ✅ Users can generate stories with prompts
- ✅ Language blending works (0-10 slider)
- ✅ Quizzes generated and functional
- ✅ Speech-to-text working (browser API)
- ✅ Sub-agent validation passed for all components

---

### Phase 3: Pet System (Weeks 6-7)

**Goals**:
- Virtual pet with 7 emotions
- Pet interactions (feed, play, boost)
- Evolution system (7 stages × 3 tracks)

**PRPs**:
1. `PRPs/frontend/pet-system.md`
2. `PRPs/frontend/pet-evolution.md`
3. `PRPs/frontend/pet-interactions.md`
4. `PRPs/fullstack/pet-art-generation.md` (FLUX-1.1-pro)

**Quality Gates**:
- ✅ 21 pet forms generated (7 stages × 3 tracks)
- ✅ 147 emotion variants generated (21 forms × 7 emotions)
- ✅ Pet emotions change based on stats
- ✅ Evolution animations functional
- ✅ Feed/play/boost interactions working

---

### Phase 4: Gamification (Weeks 8-9)

**Goals**:
- Achievements (27 achievements)
- Quests (daily + weekly)
- Shop (foods, cosmetics, power-ups)

**PRPs**:
1. `PRPs/frontend/achievements.md`
2. `PRPs/frontend/quests.md`
3. `PRPs/frontend/shop.md`

**Quality Gates**:
- ✅ All 27 achievements unlockable
- ✅ Daily/weekly quests reset properly
- ✅ Shop purchases working (coins/gems)
- ✅ Inventory system functional

---

### Phase 5: Progress & Profile (Weeks 10-11)

**Goals**:
- Progress page (analytics, charts)
- Profile page (settings, customization)

**PRPs**:
1. `PRPs/frontend/progress-page.md`
2. `PRPs/frontend/profile-page.md`

**Quality Gates**:
- ✅ Charts render correctly (XP, activity heatmap)
- ✅ Settings persist to localStorage
- ✅ Theme switching functional

---

### Phase 6: Polish (Week 12)

**Goals**:
- Animations (confetti, transitions)
- Error handling
- Performance optimization
- Accessibility improvements

**PRPs**:
1. `PRPs/frontend/animations.md`
2. `PRPs/frontend/error-handling.md`
3. `PRPs/frontend/performance-optimization.md`

**Quality Gates**:
- ✅ Lighthouse score >90
- ✅ WCAG AA compliance
- ✅ All error states handled gracefully

---

### Phase 7: Backend Integration (Weeks 13-15) - POST-MVP

**Goals**:
- API endpoints for all features
- Database setup (PostgreSQL)
- Authentication system

**PRPs**:
1. `PRPs/backend/project-setup.md`
2. `PRPs/backend/user-endpoints.md`
3. `PRPs/backend/pet-endpoints.md`
4. `PRPs/backend/content-generation.md`

**Quality Gates**:
- ✅ All API endpoints functional
- ✅ Frontend migrated from localStorage to API
- ✅ Authentication working (JWT)

---

### Phase 8: BONUS - Audio Reading (Weeks 16-17)

**Goals**:
- Audio generation with word timings
- Synchronized highlighting

**PRPs**:
1. `PRPs/fullstack/audio-generation.md`
2. `PRPs/frontend/audio-player.md`

**Quality Gates**:
- ✅ Audio generated for stories
- ✅ Word highlighting synchronized (<100ms accuracy)
- ✅ Playback controls functional (play, pause, seek, speed)

---

## Quality Gates

### Gate 1: Code Quality

**Validation**:
```bash
# Linting
npm run lint

# Type checking
npm run type-check

# Sub-agent review
/agents code-reviewer "Comprehensive code quality review for {Feature}"
```

**Criteria**:
- ✅ No linting errors
- ✅ No TypeScript errors
- ✅ Sub-agent approval
- ✅ Code follows project conventions

---

### Gate 2: Testing

**Validation**:
```bash
# Unit tests
npm test

# Coverage report
npm run test:coverage
```

**Criteria**:
- ✅ All tests passing
- ✅ >80% code coverage
- ✅ Critical paths tested

---

### Gate 3: Accessibility

**Validation**:
```bash
# Automated a11y testing
npm run test:a11y

# Sub-agent review
/agents accessibility-checker "WCAG AA compliance check for {Feature}"
```

**Criteria**:
- ✅ WCAG AA compliant
- ✅ Keyboard navigation functional
- ✅ Screen reader compatible

---

### Gate 4: Performance

**Validation**:
```bash
# Build size analysis
npm run build -- --analyze

# Lighthouse audit
npm run lighthouse
```

**Criteria**:
- ✅ Lighthouse performance >90
- ✅ Bundle size <500KB (gzipped)
- ✅ Time to Interactive <3s

---

### Gate 5: Child Safety

**Validation**:
```bash
# Sub-agent security audit
/agents security-auditor "Child safety compliance audit for {Feature}"
```

**Criteria**:
- ✅ No inappropriate content possible
- ✅ Content filtering active
- ✅ No external links without validation
- ✅ Age-appropriate design

---

## Summary: Implementation Approach

### Recommended Development Flow

```
┌─────────────────────────────────────────────────────┐
│         STRUCTURED DEVELOPMENT WORKFLOW             │
└─────────────────────────────────────────────────────┘

1. Read CLAUDE.md files (root → frontend/backend)
   ↓
2. Generate PRP: /generate-prp <planning-doc>
   ↓
3. Review generated PRP, refine if needed
   ↓
4. Execute PRP: /execute-prp <prp-path>
   ↓
5. Follow PRP steps sequentially:
   - Implement feature
   - Write tests
   - Run tests
   - Sub-agent validation (MANDATORY)
   - Mark todo complete
   - Commit code
   ↓
6. Quality Gates:
   - Gate 1: Code Quality (linting, types, review)
   - Gate 2: Testing (unit, integration, coverage)
   - Gate 3: Accessibility (WCAG AA)
   - Gate 4: Performance (Lighthouse >90)
   - Gate 5: Child Safety (content filtering)
   ↓
7. PRP Complete → Move to next PRP
   ↓
8. Phase Complete → Celebrate → Next Phase
```

---

### Key Success Factors

1. **MANDATORY Sub-Agent Usage**: Never skip validation
2. **Todo List Discipline**: Update at every step
3. **Incremental Testing**: Test as you build, don't batch
4. **Context Management**: Reset context at 75% usage
5. **Quality Gates**: Pass all gates before moving forward
6. **One Task at a Time**: Single in_progress todo only

---

**Implementation Strategy Status**: ✅ Complete
**Next Step**: Begin Phase 1 - Generate first PRP
