# Frontend Development Guide - Reading App V2

This file provides frontend-specific guidance for Claude Code when working on the frontend application.

**Version**: 2.0
**Last Updated**: 2025-10-11
**Status**: Ready for Phase 1 Implementation

---

## 🚀 Quick Start for Development

### Context Recovery (After Session Reset)

**If starting a new session or context was cleared**:

```bash
# 1. Read root CLAUDE.md for project context
Read: /Users/joromini/Documents/pyprojects/crewai/gitclone/renzo/reading_app/CLAUDE.md

# 2. Read this frontend CLAUDE.md
Read: /Users/joromini/Documents/pyprojects/crewai/gitclone/renzo/reading_app/frontend/CLAUDE.md

# 3. Identify current PRP (check PRPs/frontend/ for in-progress PRP)
Read: /Users/joromini/Documents/pyprojects/crewai/gitclone/renzo/reading_app/PRPs/frontend/README.md

# 4. Execute current PRP
/execute-prp PRPs/frontend/<current-feature>.md
```

---

## 📁 Frontend Directory Structure

```
frontend/
├── CLAUDE.md                     # This file
├── src/
│   ├── components/
│   │   ├── layout/              # Header, Navigation, PageLayout
│   │   ├── dashboard/           # Dashboard page components
│   │   ├── reading/             # Reading page components
│   │   ├── achievements/        # Achievements page components
│   │   ├── shop/                # Shop page components
│   │   ├── progress/            # Progress page components
│   │   ├── profile/             # Profile page components
│   │   ├── common/              # Reusable UI components
│   │   └── animations/          # Animation components
│   ├── pages/
│   │   ├── Dashboard.tsx
│   │   ├── Reading.tsx
│   │   ├── Achievements.tsx
│   │   ├── Shop.tsx
│   │   ├── Progress.tsx
│   │   └── Profile.tsx
│   ├── contexts/
│   │   ├── UserContext.tsx
│   │   ├── PetContext.tsx
│   │   ├── AchievementContext.tsx
│   │   ├── QuestContext.tsx
│   │   └── SettingsContext.tsx
│   ├── hooks/
│   │   ├── useLocalStorage.ts
│   │   ├── useAzureLLM.ts
│   │   ├── useSpeechRecognition.ts
│   │   ├── useLanguageBlending.ts
│   │   ├── useSyncedAudio.ts
│   │   ├── useDebounce.ts
│   │   └── useToast.ts
│   ├── services/
│   │   ├── azureOpenAI.ts
│   │   ├── petService.ts
│   │   ├── achievementService.ts
│   │   ├── questService.ts
│   │   └── storageService.ts
│   ├── utils/
│   │   ├── xpCalculations.ts
│   │   ├── petBehavior.ts
│   │   ├── languageBlending.ts
│   │   └── validators.ts
│   ├── types/
│   │   ├── user.ts
│   │   ├── pet.ts
│   │   ├── achievement.ts
│   │   ├── quest.ts
│   │   ├── story.ts
│   │   └── quiz.ts
│   ├── App.tsx
│   └── main.tsx
├── public/
│   └── images/
│       └── pets/
│           ├── knowledge/
│           ├── coolness/
│           └── culture/
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```

---

## ⚙️ Development Commands

### Core Development Tasks

```bash
# Start dev server (port 5173)
npm run dev

# Run tests
npm test

# Run tests in watch mode
npm test -- --watch

# Test coverage report
npm run test:coverage

# Type checking
npm run type-check

# Linting
npm run lint

# Fix lint issues
npm run lint:fix

# Build for production
npm run build

# Preview production build
npm run preview
```

### Setup (First Time)

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### Quality Assurance Workflow

```bash
# Before committing - run full quality check
npm run lint && npm run type-check && npm test

# After major changes - launch code reviewer agent (MANDATORY)
/agents code-reviewer "Review {ComponentName} for quality, accessibility, and child safety"

# Before deployment - comprehensive validation
/agents security-auditor "Security audit for frontend"
/agents performance-optimizer "Performance check for frontend"
```

---

## 🏗️ Architecture Patterns

### Component Organization

**Three component types**:

1. **Page Components** (`src/pages/`)
   - Top-level route components
   - Compose feature components
   - Manage page-level state

2. **Feature Components** (`src/components/{feature}/`)
   - Specific to a feature area
   - Handle business logic
   - Connect to global state

3. **Common Components** (`src/components/common/`)
   - Reusable across features
   - No business logic
   - Props-driven only

### State Management

**Global State** (React Context):
- `UserContext`: User profile, level, XP, coins, gems, streak
- `PetContext`: Pet state, emotions, evolution
- `AchievementContext`: Achievement progress
- `QuestContext`: Daily and weekly quests
- `SettingsContext`: App settings and preferences

**Local State**: `useState`, `useReducer` for component-specific state

**Persistence**: localStorage (MVP), IndexedDB (future), API (post-MVP)

### Naming Conventions

- **Components**: PascalCase (`VirtualPet.tsx`)
- **Hooks**: camelCase with `use` prefix (`useSyncedAudio.ts`)
- **Props Interfaces**: `{ComponentName}Props` (e.g., `VirtualPetProps`)
- **Event Handlers**: `on{Event}` pattern (e.g., `onFeed`, `onPlayClick`)
- **State Variables**: camelCase (e.g., `isLoading`, `selectedItem`)

---

## 🔄 PRP Execution Guidelines

**📖 See `.claude/SHARED-PATTERNS.md` for complete PRP workflow**

### Quick Reference

**Before**: Read docs, verify deps, check dev server, create branch
**During**: Update todos, test incrementally, use sub-agents, commit milestones
**After**: Full test suite, sub-agent review, merge to main

---

## 🛡️ Mandatory Sub-Agent Validation

**📖 See `.claude/SHARED-PATTERNS.md` for complete validation patterns and commands**

### Frontend-Specific Validation Points

**After component implementation**: TypeScript safety, React patterns, accessibility, child safety
**After state management**: Memory leaks, optimization, state consistency
**After UI/UX features**: WCAG AA, keyboard nav, screen reader, child-friendly design
**Before commit**: Comprehensive quality check (MANDATORY)

---

## 🧪 Testing Requirements

### Unit Tests (Required)

**Test all**:
- Utility functions
- Custom hooks
- Critical business logic

**Example**:
```typescript
// usePetEmotion.test.ts
describe('usePetEmotion', () => {
  it('returns happy emotion when stats are good', () => {
    const { result } = renderHook(() => usePetEmotion({
      happiness: 80,
      hunger: 20,
      energy: 70
    }));
    expect(result.current).toBe('happy');
  });
});
```

### Integration Tests (Required)

**Test critical user flows**:
- Story generation → Reading → Quiz → Rewards
- Pet feeding, evolution
- Achievement unlocking
- Quest completion

### Component Tests

**Test interactive components**:
```typescript
// VirtualPet.test.tsx
describe('VirtualPet', () => {
  it('calls onFeed when feed button clicked', () => {
    const onFeedMock = jest.fn();
    render(<VirtualPet pet={mockPet} onFeed={onFeedMock} />);
    fireEvent.click(screen.getByRole('button', { name: /feed/i }));
    expect(onFeedMock).toHaveBeenCalled Times(1);
  });
});
```

### E2E Tests (Optional for MVP)

Complete user journeys, multi-page navigation

---

## 🧩 Component File Pattern

### Standard Component Structure

```
src/components/{feature}/{ComponentName}/
├── {ComponentName}.tsx         # Main component
├── {ComponentName}.test.tsx    # Tests
├── {ComponentName}.module.css  # Styles (if needed)
├── types.ts                    # Component-specific types
└── index.ts                    # Barrel export
```

### Example Component Template

```typescript
// src/components/dashboard/VirtualPet/VirtualPet.tsx
import React, { useState } from 'react';
import type { PetState } from '@/types/pet';

interface VirtualPetProps {
  pet: PetState;
  coins: number;
  gems: number;
  size?: 'small' | 'large';
  onFeed: (foodId: string) => void;
  onPlay: () => void;
  onBoost: () => void;
  onClick?: () => void;
}

export const VirtualPet: React.FC<VirtualPetProps> = ({
  pet,
  coins,
  gems,
  size = 'large',
  onFeed,
  onPlay,
  onBoost,
  onClick
}) => {
  const [showActions, setShowActions] = useState(false);

  return (
    <div className="virtual-pet">
      {/* Component implementation */}
    </div>
  );
};
```

---

## 🛠️ Technology Stack

### Core

- **React**: 18.3.1
- **TypeScript**: 5.7
- **Vite**: 6.0

### UI & Styling

- **Tailwind CSS**: 3.4 (utility-first styling)
- **Framer Motion**: 11.x (animations)
- **Radix UI**: Accessible component primitives

### State & Data

- **React Context API**: Global state management
- **localStorage**: MVP persistence
- **IndexedDB**: Future offline support

### Testing

- **Vitest**: Test runner
- **React Testing Library**: Component testing
- **MSW (Mock Service Worker)**: API mocking

### AI Integration

- **Azure OpenAI SDK**: Story/quiz generation
- **FLUX-1.1-pro**: Pet art generation (via Azure)

---

## 🎨 Styling Guidelines

### Tailwind CSS

**Use utility classes for most styling**:
```tsx
<div className="flex items-center justify-between p-4 bg-blue-500 text-white rounded-lg shadow-md">
  Content
</div>
```

### When to Use CSS Modules

**Complex animations or unique component styles**:
```tsx
import styles from './VirtualPet.module.css';

<div className={styles.petContainer}>
  <div className={styles.petAnimation}>Pet</div>
</div>
```

### Theme System

**Use CSS variables for theming**:
```css
:root {
  --theme-primary: #3b82f6;
  --theme-accent: #06b6d4;
  --theme-text: #f1f5f9;
  --theme-background: radial-gradient(circle, #1e3a8a 0%, #0f172a 100%);
}
```

---

## 🚀 Performance Guidelines

### Code Splitting

**Lazy load pages**:
```typescript
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Reading = lazy(() => import('./pages/Reading'));
```

### Memoization

**Use React.memo for expensive components**:
```typescript
export const VirtualPet = React.memo<VirtualPetProps>(({ pet, onFeed }) => {
  // Component implementation
});
```

**Use useMemo for expensive calculations**:
```typescript
const xpProgress = useMemo(() => {
  return (user.xp / user.xpToNextLevel) * 100;
}, [user.xp, user.xpToNextLevel]);
```

**Use useCallback for event handlers passed to children**:
```typescript
const handleFeed = useCallback((foodId: string) => {
  // Implementation
}, [dependencies]);
```

### Image Optimization

- Use WebP format
- Lazy load images: `<img loading="lazy" />`
- Responsive images with srcset

---

## ♿ Accessibility Checklist

- [ ] All interactive elements keyboard accessible
- [ ] ARIA labels on all non-text elements
- [ ] Focus indicators visible
- [ ] Color contrast meets WCAG AA (4.5:1)
- [ ] Alt text on all images
- [ ] Form validation with clear error messages
- [ ] Skip links for main content
- [ ] Semantic HTML (proper heading hierarchy)

---

## 👶 Child Safety Guidelines

- [ ] Content filtering before AI generation
- [ ] No external links without validation
- [ ] No user-generated content without moderation
- [ ] Age-appropriate language only
- [ ] No data collection without parent consent

---

## 🚫 Common Pitfalls to Avoid

### ❌ Don't Do This

- Hardcoded values in tests (use ranges, patterns)
- Direct localStorage manipulation (use service layer)
- Inline styles everywhere (use Tailwind or CSS modules)
- Prop drilling (use Context for deep props)
- Unused imports or variables

### ✅ Do This

- Property-based testing with flexible assertions
- Service abstraction for localStorage
- Consistent styling approach (Tailwind-first)
- Context for global state
- Clean, well-organized code

---

## 📚 Available PRPs for Execution

### Phase 1: Foundation

- [ ] `project-setup.md` - React + TypeScript + Vite setup
- [ ] `component-library.md` - Common components (Button, Card, Modal, etc.)
- [ ] `theme-system.md` - Theme provider, Tailwind configuration
- [ ] `navigation.md` - Header, bottom nav, routing

### Phase 2: Core Pages

- [ ] `dashboard-page.md` - Dashboard with pet, quests, stats
- [ ] `reading-page.md` - Story generation, display, quiz
- [ ] `language-blending.md` - Blend level slider, inline hints
- [ ] `speech-to-text.md` - Voice input for story prompts

### Phase 3: Pet System

- [ ] `pet-system.md` - Virtual pet component, emotions, stats
- [ ] `pet-evolution.md` - Evolution animations, ceremonies
- [ ] `pet-interactions.md` - Feed, play, boost actions

### Phase 4: Gamification

- [ ] `achievements.md` - Achievement grid, modals, progress
- [ ] `quests.md` - Daily/weekly quests, rewards
- [ ] `shop.md` - Shop items, purchase flow, inventory

### Phase 5: Progress & Profile

- [ ] `progress-page.md` - Charts, analytics, history
- [ ] `profile-page.md` - Settings, customization

### Phase 6: Polish

- [ ] `animations.md` - Confetti, transitions, loading states
- [ ] `error-handling.md` - Error boundaries, retry logic
- [ ] `performance-optimization.md` - Code splitting, lazy loading

### Phase 8: BONUS

- [ ] `audio-player.md` - Audio reading with word highlighting

**See**: `PRPs/frontend/README.md` for full list and status tracking

---

## 📊 Development Progress Tracking

**📖 See `.claude/SHARED-PATTERNS.md` for complete TodoWrite usage patterns**

### Quick Reference

- ✅ Create todos at start of PRP execution
- ✅ ONE task `in_progress` at a time
- ✅ Mark `completed` immediately after finishing
- ✅ Update at each PRP step

---

## 🔗 Related Documentation

**Root Project Guide**:
- `/reading_app/CLAUDE.md` - Root orchestration, project overview

**Planning Documents**:
- `docs/v2-architecture.md` - Complete technical specification
- `docs/wireframes/` - All 6 pages with layouts
- `docs/component-specifications.md` - 60+ React components
- `docs/mock-data-schema.md` - TypeScript interfaces
- `docs/implementation-strategy.md` - Full implementation approach

**Backend Guide** (POST-MVP):
- `backend/CLAUDE.md` - Backend development guide

---

## 🎯 Next Steps

### If Starting Fresh

1. **Read root CLAUDE.md** for project context
2. **Read this frontend CLAUDE.md** (done)
3. **Choose Phase 1 PRP**: `PRPs/frontend/project-setup.md`
4. **Execute PRP**: `/execute-prp PRPs/frontend/project-setup.md`
5. **Follow PRP workflow**: Implement → Test → Validate → Complete

### If Resuming Development

1. **Check current PRP**: Read `PRPs/frontend/README.md`
2. **Resume PRP**: `/execute-prp PRPs/frontend/<current-prp>.md`
3. **Continue from last step**: Check todo list for current task

---

**Frontend CLAUDE.md Status**: ✅ Complete
**Frontend Status**: Not started - Ready for Phase 1
**Next Step**: Execute `/execute-prp PRPs/frontend/project-setup.md` when ready to begin
