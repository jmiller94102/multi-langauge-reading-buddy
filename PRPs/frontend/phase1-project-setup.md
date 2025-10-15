# PRP: Phase 1 - Project Setup & Foundation (Children's Reading App V2)

**Feature**: Complete frontend project initialization for gamified reading comprehension app with Tamagotchi pet system

**Domain**: Frontend
**Phase**: 1 (Foundation)
**Estimated Time**: 8-12 hours
**Complexity**: Medium
**Priority**: CRITICAL (Blocking - Must complete first)

---

## 📋 Overview

Initialize a production-ready React 18 + TypeScript + Vite frontend for a children's education reading app with:
- **Language Learning Features**: Multi-language blending (English ↔ Korean/Mandarin) with 0-10 slider
- **Gamification System**: Tamagotchi-style virtual pet, XP/levels, achievements, quests, shop
- **Child Safety**: COPPA-compliant design (localStorage only for MVP, content filtering ready)
- **Performance**: Optimized for children's short attention spans (<3s load time)
- **Accessibility**: WCAG AA compliant, screen reader support, keyboard navigation

**Success Criteria**: Dev server runs at `http://localhost:5173`, shows "Hello World" with theme, routing works, no console errors

---

## 🎯 Prerequisites

### Knowledge Requirements
- React 18 (functional components, hooks, Context API)
- TypeScript 5.7 (interfaces, types, generics)
- Vite 6.0 (config, build optimization)
- Tailwind CSS 3.4 (utility-first styling)
- Child safety principles (COPPA compliance basics)

### Environment Requirements
- Node.js 20.x or higher
- npm 10.x or higher
- Git installed
- Code editor (VS Code recommended)

### Planning Documents (Reference Only - Don't Load All)
- `docs/v2-architecture.md` (Sections 1-3: Overview, Tech Stack, Priority Features)
- `docs/implementation-strategy.md` (Context management strategy)
- `docs/wireframes/dashboard.md` (UI reference for first page)

---

## 🚨 CRITICAL CONTEXT: Child Safety & COPPA Compliance

### COPPA 2025 Amendments (Effective April 22, 2026)
**Mandatory Requirements**:
1. **No Data Collection Without Parental Consent** (MVP: Use localStorage only)
2. **Written Security Program** (Implement in Phase 7 - Backend)
3. **Content Filtering** (AI output validation before display)
4. **No External Tracking** (No Google Analytics, no 3rd-party cookies in MVP)

### MVP Strategy (Pure Frontend)
✅ **localStorage only** = No COPPA concerns initially
✅ **No backend authentication** = No user data collected
✅ **Content filtering ready** = Architecture supports validation hooks
⏸️ **Parental consent flow** = Add in Phase 7 (Backend Integration)

### Child-Safe Design Principles (Ages 8-12, Grades 3-6)
- **Typography**: 18px+ font size, high contrast (WCAG AA: 4.5:1 minimum)
- **Touch Targets**: 44x44px minimum (WCAG 2.5.5)
- **Color Scheme**: Avoid red/green only (8% of boys colorblind)
- **Language**: Age-appropriate, positive reinforcement, no fear/pressure
- **Error Messages**: Supportive, encouraging ("Try again!" not "Wrong!")

---

## 🛠️ Implementation Steps

### Step 1: Create React + TypeScript + Vite Project

**What**: Initialize Vite project with React 18 and TypeScript 5.7

**Why**: Vite provides fast HMR (Hot Module Replacement) for rapid development, TypeScript ensures type safety for complex state management

**How**:

```bash
# Navigate to project root
cd /Users/joromini/Documents/pyprojects/crewai/gitclone/renzo/reading_app

# Create frontend directory with Vite
npm create vite@latest frontend -- --template react-ts

# Navigate into frontend
cd frontend

# Install dependencies
npm install
```

**Files Created**:
- `frontend/package.json`
- `frontend/vite.config.ts`
- `frontend/tsconfig.json`
- `frontend/tsconfig.app.json`
- `frontend/tsconfig.node.json`
- `frontend/src/main.tsx`
- `frontend/src/App.tsx`
- `frontend/src/index.css`
- `frontend/public/`

**Validation**:
```bash
# Test dev server starts
npm run dev

# Expected output:
#   VITE v6.0.x  ready in XXX ms
#   ➜  Local:   http://localhost:5173/
#   ➜  Network: use --host to expose
```

**Success Criteria**:
- ✅ Dev server runs on port 5173
- ✅ Browser shows default Vite + React page
- ✅ No console errors

---

### Step 2: Install Core Dependencies

**What**: Install Tailwind CSS, React Router, Framer Motion, and child-safe utilities

**Why**:
- Tailwind CSS: Utility-first styling for rapid UI development
- React Router v6: Multi-page navigation (6 pages: Dashboard, Reading, Achievements, Shop, Progress, Profile)
- Framer Motion: Smooth animations for pet interactions and rewards
- date-fns: Date manipulation for daily/weekly quest resets

**How**:

```bash
# Core UI dependencies
npm install tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Routing and animation
npm install react-router-dom framer-motion

# Utilities
npm install date-fns clsx

# Development dependencies
npm install -D @types/node
```

**Files to Modify**:

**1. `frontend/tailwind.config.js`** (Child-friendly theme):
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Child-friendly color palette (WCAG AA compliant)
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6', // Main blue
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        accent: {
          50: '#fef3c7',
          100: '#fde68a',
          200: '#fcd34d',
          300: '#fbbf24',
          400: '#f59e0b', // Main yellow/gold
          500: '#d97706',
          600: '#b45309',
          700: '#92400e',
          800: '#78350f',
          900: '#451a03',
        },
        success: {
          500: '#10b981', // Green for correct answers
          600: '#059669',
        },
        error: {
          500: '#ef4444', // Red for incorrect (used sparingly)
          600: '#dc2626',
        },
        // Pet emotion colors
        petHappy: '#10b981',
        petSad: '#6b7280',
        petAngry: '#ef4444',
        petHungry: '#f59e0b',
        petExcited: '#8b5cf6',
        petBored: '#9ca3af',
        petLove: '#ec4899',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'Inter', 'sans-serif'], // Headings
        mono: ['JetBrains Mono', 'monospace'], // Code/quiz
      },
      fontSize: {
        // Child-friendly sizes (minimum 18px for body)
        'child-xs': ['16px', { lineHeight: '1.5' }],
        'child-sm': ['18px', { lineHeight: '1.6' }], // Default body
        'child-base': ['20px', { lineHeight: '1.6' }],
        'child-lg': ['24px', { lineHeight: '1.5' }],
        'child-xl': ['28px', { lineHeight: '1.4' }],
        'child-2xl': ['32px', { lineHeight: '1.3' }],
      },
      spacing: {
        // Large touch targets for children
        'touch': '44px', // Minimum touch target (WCAG 2.5.5)
        'touch-lg': '56px', // Larger for important actions
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'confetti': 'confetti 1s ease-out forwards',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        confetti: {
          '0%': { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
          '100%': { transform: 'translateY(-100vh) rotate(720deg)', opacity: 0 },
        },
      },
    },
  },
  plugins: [],
}
```

**2. `frontend/src/index.css`** (Global styles with child-safe defaults):
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  /* Child-friendly base styles */
  html {
    @apply antialiased;
    font-size: 18px; /* Base font size for children (COPPA recommendation) */
  }

  body {
    @apply font-sans text-child-sm text-gray-900 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50;
    min-height: 100vh;
  }

  /* High contrast for accessibility (WCAG AA) */
  * {
    @apply focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2;
  }

  /* Ensure all interactive elements have visible focus indicators */
  button:focus-visible,
  a:focus-visible,
  input:focus-visible,
  select:focus-visible,
  textarea:focus-visible {
    @apply ring-2 ring-primary-500 ring-offset-2;
  }
}

@layer components {
  /* Child-friendly button styles */
  .btn-primary {
    @apply bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95;
    min-height: 44px; /* WCAG 2.5.5 minimum touch target */
    min-width: 44px;
  }

  .btn-secondary {
    @apply bg-accent-400 hover:bg-accent-500 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95;
    min-height: 44px;
    min-width: 44px;
  }

  .btn-ghost {
    @apply bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 px-6 rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-all duration-200 active:scale-95;
    min-height: 44px;
    min-width: 44px;
  }

  /* Card styles for pet, quests, achievements */
  .card {
    @apply bg-white rounded-2xl shadow-lg p-6 border border-gray-100;
  }

  .card-hover {
    @apply bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl hover:border-primary-200 transition-all duration-200 cursor-pointer;
  }
}

@layer utilities {
  /* Animation utilities for pet and gamification */
  .animate-pet-happy {
    animation: bounce 0.5s ease-in-out;
  }

  .animate-pet-sad {
    animation: wiggle 1s ease-in-out;
  }

  .animate-reward {
    animation: confetti 1s ease-out forwards;
  }
}
```

**Validation**:
```bash
# Verify Tailwind classes work
npm run dev

# Check package.json has all dependencies
cat package.json | grep -E "(react-router-dom|framer-motion|tailwindcss)"

# Expected output:
#   "react-router-dom": "^6.x.x",
#   "framer-motion": "^11.x.x",
#   "tailwindcss": "^3.4.x"
```

**Success Criteria**:
- ✅ `tailwind.config.js` exists with child-friendly theme
- ✅ `index.css` has child-safe typography and colors
- ✅ Dev server reloads without errors
- ✅ Tailwind utility classes apply correctly (test with `className="bg-primary-500 text-white"`)

---

### Step 3: Configure TypeScript for Strict Mode

**What**: Enable strict TypeScript checking for type safety across 60+ components

**Why**: Prevent runtime errors in complex state management (pet state, gamification logic, language blending)

**How**:

**Update `frontend/tsconfig.json`**:
```json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ],
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

**Update `frontend/tsconfig.app.json`**:
```json
{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting - STRICT MODE for child safety */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,

    /* Path mapping for clean imports */
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/hooks/*": ["./src/hooks/*"],
      "@/contexts/*": ["./src/contexts/*"],
      "@/services/*": ["./src/services/*"],
      "@/utils/*": ["./src/utils/*"],
      "@/types/*": ["./src/types/*"]
    }
  },
  "include": ["src"]
}
```

**Update `frontend/vite.config.ts`** (Path aliases):
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/components': path.resolve(__dirname, './src/components'),
      '@/hooks': path.resolve(__dirname, './src/hooks'),
      '@/contexts': path.resolve(__dirname, './src/contexts'),
      '@/services': path.resolve(__dirname, './src/services'),
      '@/utils': path.resolve(__dirname, './src/utils'),
      '@/types': path.resolve(__dirname, './src/types'),
    },
  },
  server: {
    port: 5173,
    open: true, // Auto-open browser on dev
  },
})
```

**Validation**:
```bash
# Run TypeScript compiler check
npm run type-check

# Expected output (should pass with no errors initially):
#   vite v6.x.x building for production...
#   ✓ TypeScript compiled successfully
```

**Success Criteria**:
- ✅ TypeScript strict mode enabled
- ✅ Path aliases configured (`@/` works)
- ✅ No TypeScript errors in initial setup

---

### Step 4: Set Up Project Directory Structure

**What**: Create organized folder structure for 60+ components, 5+ contexts, 10+ services

**Why**: Scalable architecture prevents "component soup" as project grows to 15,000+ lines of code

**How**:

```bash
# Create directory structure from project root
cd /Users/joromini/Documents/pyprojects/crewai/gitclone/renzo/reading_app/frontend/src

# Component directories (feature-based organization)
mkdir -p components/layout
mkdir -p components/dashboard
mkdir -p components/reading
mkdir -p components/quiz
mkdir -p components/pet
mkdir -p components/gamification
mkdir -p components/shop
mkdir -p components/progress
mkdir -p components/profile
mkdir -p components/common
mkdir -p components/animations
mkdir -p components/accessibility
mkdir -p components/safety

# Page directories (top-level routes)
mkdir -p pages

# State management directories
mkdir -p contexts

# Custom hooks directory
mkdir -p hooks

# Services directory (API calls, localStorage)
mkdir -p services

# Utilities directory (pure functions)
mkdir -p utils

# Types directory (TypeScript interfaces)
mkdir -p types

# Assets directory (images, fonts, sounds)
mkdir -p assets/images/pets/knowledge
mkdir -p assets/images/pets/coolness
mkdir -p assets/images/pets/culture
mkdir -p assets/images/icons
mkdir -p assets/sounds
```

**Validation**:
```bash
# Verify directory structure
tree src -L 2 -d

# Expected output:
# src
# ├── assets
# │   ├── images
# │   └── sounds
# ├── components
# │   ├── accessibility
# │   ├── animations
# │   ├── common
# │   ├── dashboard
# │   ├── gamification
# │   ├── layout
# │   ├── pet
# │   ├── ...
# ├── contexts
# ├── hooks
# ├── pages
# ├── services
# ├── types
# └── utils
```

**Success Criteria**:
- ✅ All directories created
- ✅ `src/` structure matches planning docs organization
- ✅ Ready for Phase 2 component development

---

### Step 5: Create Base TypeScript Interfaces

**What**: Define core TypeScript types for User, Pet, Gamification, Language

**Why**: Type safety across entire app, autocomplete for developers, prevents runtime errors

**How**:

**Create `frontend/src/types/user.ts`**:
```typescript
// User profile and progress types
export interface UserState {
  // Identity
  id: string;
  name: string;
  avatar?: string;

  // Progression
  level: number;
  xp: number;
  xpToNextLevel: number;

  // Currency
  coins: number;
  gems: number;

  // Engagement
  streak: number;
  lastLogin: number; // Unix timestamp

  // Statistics
  stats: {
    totalReadings: number;
    totalQuizzes: number;
    totalCorrectAnswers: number;
    totalWords: number;
    averageQuizScore: number;
    longestStreak: number;
  };

  // Settings
  settings: UserSettings;
}

export interface UserSettings {
  // Language preferences
  primaryLanguage: 'en';
  secondaryLanguage: 'ko' | 'zh'; // Korean or Mandarin
  languageBlendLevel: number; // 0-10 slider

  // Display preferences
  showHints: boolean;
  showRomanization: boolean;
  theme: 'space' | 'jungle' | 'deepSea' | 'minecraft' | 'tron';

  // Audio preferences
  audioEnabled: boolean;
  audioSpeed: number; // 0.75 | 1.0 | 1.25 | 1.5
  audioVoice?: string;

  // Accessibility
  fontSize: 'normal' | 'large' | 'xlarge';
  highContrast: boolean;
  reducedMotion: boolean;

  // Parental controls (for Phase 7 - Backend)
  parentalConsentGiven: boolean;
  parentEmail?: string;
}
```

**Create `frontend/src/types/pet.ts`**:
```typescript
// Virtual pet (Tamagotchi) types
export type PetEmotion = 'happy' | 'sad' | 'angry' | 'hungry' | 'excited' | 'bored' | 'love';
export type PetEvolutionTrack = 'knowledge' | 'coolness' | 'culture';
export type PetEvolutionStage = 0 | 1 | 2 | 3 | 4 | 5 | 6; // 7 stages

export interface PetState {
  // Core stats
  happiness: number; // 0-100
  hunger: number; // 0-100 (increases 1% per hour)
  energy: number; // 0-100 (decreases with activity)

  // Evolution
  evolutionTrack: PetEvolutionTrack;
  evolutionStage: PetEvolutionStage;

  // Identity
  name: string;
  emotion: PetEmotion;

  // Timestamps
  lastFed: number; // Unix timestamp
  lastPlayed: number;
  lastInteraction: number;

  // Items/Accessories
  accessories: string[]; // Unlocked cosmetics
  favoriteFood: string | null; // Cultural food preference
}

export interface PetAction {
  type: 'feed' | 'play' | 'boost' | 'giveCulturalFood';
  foodId?: string; // For cultural food
  timestamp: number;
}

export interface PetEvolution {
  track: PetEvolutionTrack;
  stage: PetEvolutionStage;
  name: string;
  visualConcept: string;
  description: string;
  levelRequired: number;
  imageUrl: string; // Path to pet image
}
```

**Create `frontend/src/types/gamification.ts`**:
```typescript
// XP, Achievements, Quests, Shop types
export interface Achievement {
  id: string;
  name: string;
  description: string;
  category: 'reading' | 'quiz' | 'streak' | 'language' | 'pet' | 'xp' | 'collection';
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

  // Unlock criteria
  unlockCriteria: {
    type: string; // e.g., 'complete_readings', 'maintain_streak'
    target: number;
    current?: number; // Progress towards target
  };

  // Rewards
  xpReward: number;
  gemsReward: number;

  // Status
  unlocked: boolean;
  unlockedAt?: number; // Unix timestamp

  // Display
  iconUrl: string;
  badgeColor: string;
}

export interface Quest {
  id: string;
  type: 'daily' | 'weekly';
  name: string;
  description: string;

  // Requirements
  goal: number;
  current: number;

  // Rewards
  xpReward: number;
  coinsReward: number;
  gemsReward?: number;

  // Status
  completed: boolean;
  claimed: boolean;
  expiresAt: number; // Unix timestamp

  // Display
  iconUrl: string;
}

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  category: 'food' | 'cosmetic' | 'powerup' | 'treasure';

  // Pricing
  costCoins?: number;
  costGems?: number;

  // Availability
  rarity: 'common' | 'uncommon' | 'rare' | 'epic';
  limited: boolean; // Time-limited items
  limitedUntil?: number; // Unix timestamp

  // Effects (for food and powerups)
  effects?: {
    happiness?: number;
    hunger?: number;
    energy?: number;
    xpBoost?: number;
  };

  // Display
  imageUrl: string;
  owned: boolean;
}
```

**Create `frontend/src/types/content.ts`**:
```typescript
// Story and Quiz content types
export interface Story {
  id: string;
  title: string;

  // Content
  englishContent: string;
  secondaryContent: string; // Korean or Mandarin
  blendedContent: string; // Generated on frontend

  // Metadata
  wordCount: number;
  gradeLevel: string;
  theme: string;
  humorLevel: string;

  // Language data
  languageLevel: number; // 0-10
  nounMappings: Record<string, string>; // English → Korean/Mandarin
  sentences: {
    english: string[];
    secondary: string[];
  };

  // Timestamps
  createdAt: number;
  readAt?: number;
}

export interface Quiz {
  id: string;
  storyId: string;

  // Questions
  questions: QuizQuestion[];

  // Metadata
  gradeLevel: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';

  // Progress
  currentQuestionIndex: number;
  answers: QuizAnswer[];
  score?: number; // Calculated after completion

  // Timestamps
  startedAt: number;
  completedAt?: number;
}

export interface QuizQuestion {
  id: string;
  type: 'multiple-choice' | 'fill-in-blank';
  question: string;

  // Multiple Choice specific
  options?: string[];

  // Answers
  correctAnswer: string;
  explanation: string;

  // Metadata
  skillTested: string; // e.g., 'main_idea', 'inference'
  difficultyLevel: string;
  koreanIntegration: boolean;
  vocabularyUsed?: string[];
}

export interface QuizAnswer {
  questionId: string;
  userAnswer: string;
  correct: boolean;
  timeSpent: number; // milliseconds
}
```

**Validation**:
```bash
# Run TypeScript compiler to check types
npm run type-check

# Expected output:
#   ✓ TypeScript compiled successfully
```

**Success Criteria**:
- ✅ All 4 type files created
- ✅ No TypeScript errors
- ✅ Types match planning documents (`docs/mock-data-schema.md`)

---

### Step 6: Set Up React Router (6 Pages)

**What**: Configure client-side routing for Dashboard, Reading, Achievements, Shop, Progress, Profile

**Why**: Multi-page navigation is core to UX (pet on Dashboard, reading flow on Reading page, etc.)

**How**:

**Create `frontend/src/pages/Dashboard.tsx`** (Placeholder):
```typescript
import React from 'react';

export const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500">
      <div className="text-center text-white">
        <h1 className="text-6xl font-bold mb-4 animate-bounce">🎉 Dashboard</h1>
        <p className="text-2xl">Your virtual pet lives here!</p>
      </div>
    </div>
  );
};
```

**Create placeholder pages** (Reading, Achievements, Shop, Progress, Profile):
```bash
# Create remaining placeholder pages
cat > src/pages/Reading.tsx <<'EOF'
import React from 'react';

export const Reading: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-400 to-blue-500">
      <div className="text-center text-white">
        <h1 className="text-6xl font-bold mb-4">📚 Reading</h1>
        <p className="text-2xl">Generate and read stories here</p>
      </div>
    </div>
  );
};
EOF

cat > src/pages/Achievements.tsx <<'EOF'
import React from 'react';

export const Achievements: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-400 to-red-500">
      <div className="text-center text-white">
        <h1 className="text-6xl font-bold mb-4">🏆 Achievements</h1>
        <p className="text-2xl">Unlock badges and rewards</p>
      </div>
    </div>
  );
};
EOF

cat > src/pages/Shop.tsx <<'EOF'
import React from 'react';

export const Shop: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-400 to-pink-500">
      <div className="text-center text-white">
        <h1 className="text-6xl font-bold mb-4">🛒 Shop</h1>
        <p className="text-2xl">Buy food and accessories</p>
      </div>
    </div>
  );
};
EOF

cat > src/pages/Progress.tsx <<'EOF'
import React from 'react';

export const Progress: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-400 to-cyan-500">
      <div className="text-center text-white">
        <h1 className="text-6xl font-bold mb-4">📊 Progress</h1>
        <p className="text-2xl">Track your learning journey</p>
      </div>
    </div>
  );
};
EOF

cat > src/pages/Profile.tsx <<'EOF'
import React from 'react';

export const Profile: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-400 to-red-500">
      <div className="text-center text-white">
        <h1 className="text-6xl font-bold mb-4">👤 Profile</h1>
        <p className="text-2xl">Customize your experience</p>
      </div>
    </div>
  );
};
EOF
```

**Update `frontend/src/App.tsx`** (Router setup):
```typescript
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { Reading } from './pages/Reading';
import { Achievements } from './pages/Achievements';
import { Shop } from './pages/Shop';
import { Progress } from './pages/Progress';
import { Profile } from './pages/Profile';

function App() {
  return (
    <Router>
      <Routes>
        {/* Default route redirects to Dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Main app pages */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/reading" element={<Reading />} />
        <Route path="/achievements" element={<Achievements />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/profile" element={<Profile />} />

        {/* 404 fallback */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
```

**Validation**:
```bash
# Start dev server
npm run dev

# Test navigation in browser:
# http://localhost:5173/ → redirects to /dashboard (shows "🎉 Dashboard")
# http://localhost:5173/reading → shows "📚 Reading"
# http://localhost:5173/achievements → shows "🏆 Achievements"
# http://localhost:5173/shop → shows "🛒 Shop"
# http://localhost:5173/progress → shows "📊 Progress"
# http://localhost:5173/profile → shows "👤 Profile"
```

**Success Criteria**:
- ✅ All 6 routes work
- ✅ Default route (`/`) redirects to `/dashboard`
- ✅ Invalid routes redirect to `/dashboard`
- ✅ No console errors

---

### Step 7: Add ESLint and Prettier (Code Quality)

**What**: Configure linting and formatting for consistent code style

**Why**: 15,000+ lines of code requires automated style enforcement to prevent bugs and maintain readability

**How**:

```bash
# Install ESLint and Prettier
npm install -D eslint eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-jsx-a11y @typescript-eslint/eslint-plugin @typescript-eslint/parser prettier eslint-config-prettier eslint-plugin-prettier
```

**Create `frontend/.eslintrc.cjs`**:
```javascript
module.exports = {
  root: true,
  env: {
    browser: true,
    es2020: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended', // Accessibility linting
    'prettier', // Must be last to disable conflicting rules
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: [
    'react',
    'react-hooks',
    '@typescript-eslint',
    'jsx-a11y',
    'prettier',
  ],
  rules: {
    // React rules
    'react/react-in-jsx-scope': 'off', // Not needed in React 18
    'react/prop-types': 'off', // Using TypeScript instead

    // TypeScript rules
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/no-explicit-any': 'warn',

    // Accessibility rules (CRITICAL for children's app)
    'jsx-a11y/alt-text': 'error', // All images must have alt text
    'jsx-a11y/anchor-is-valid': 'error',
    'jsx-a11y/click-events-have-key-events': 'error', // Keyboard navigation
    'jsx-a11y/no-static-element-interactions': 'error',

    // Code quality
    'no-console': ['warn', { allow: ['warn', 'error'] }], // Discourage console.log
    'prettier/prettier': 'error',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
```

**Create `frontend/.prettierrc`**:
```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "arrowParens": "always"
}
```

**Update `frontend/package.json`** scripts:
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "lint:fix": "eslint . --ext ts,tsx --fix",
    "format": "prettier --write \"src/**/*.{ts,tsx,css,md}\"",
    "type-check": "tsc -b --noEmit"
  }
}
```

**Validation**:
```bash
# Run linter
npm run lint

# Run formatter
npm run format

# Expected output (should pass with minimal warnings):
#   ✓ No ESLint errors
#   ✓ Code formatted successfully
```

**Success Criteria**:
- ✅ ESLint configured with accessibility rules
- ✅ Prettier configured for consistent formatting
- ✅ `npm run lint` passes
- ✅ `npm run format` works

---

### Step 8: Create localStorage Service (MVP Persistence)

**What**: Abstraction layer for localStorage to persist user data, pet state, gamification

**Why**:
- MVP uses localStorage (no backend = no COPPA concerns)
- Service layer makes switching to API in Phase 7 trivial
- Centralized persistence prevents localStorage sprawl

**How**:

**Create `frontend/src/services/storage.service.ts`**:
```typescript
import type { UserState } from '@/types/user';
import type { PetState } from '@/types/pet';
import type { Achievement, Quest } from '@/types/gamification';
import type { Story, Quiz } from '@/types/content';

/**
 * StorageService - MVP persistence layer using localStorage
 *
 * COPPA Compliance: localStorage only = no data sent to servers
 * Future: Replace with API calls in Phase 7 (Backend Integration)
 */

const STORAGE_KEYS = {
  USER: 'reading_app_user',
  PET: 'reading_app_pet',
  ACHIEVEMENTS: 'reading_app_achievements',
  QUESTS: 'reading_app_quests',
  STORIES: 'reading_app_stories',
  QUIZZES: 'reading_app_quizzes',
  SETTINGS: 'reading_app_settings',
} as const;

class StorageService {
  // ===== Generic Storage Methods =====

  private getItem<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error reading ${key} from localStorage:`, error);
      return null;
    }
  }

  private setItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error writing ${key} to localStorage:`, error);
      // Handle quota exceeded error (rare but possible)
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        console.error('localStorage quota exceeded. Consider cleaning old data.');
      }
    }
  }

  private removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing ${key} from localStorage:`, error);
    }
  }

  // ===== User Data =====

  getUser(): UserState | null {
    return this.getItem<UserState>(STORAGE_KEYS.USER);
  }

  saveUser(user: UserState): void {
    this.setItem(STORAGE_KEYS.USER, user);
  }

  // ===== Pet Data =====

  getPet(): PetState | null {
    return this.getItem<PetState>(STORAGE_KEYS.PET);
  }

  savePet(pet: PetState): void {
    this.setItem(STORAGE_KEYS.PET, pet);
  }

  // ===== Achievements =====

  getAchievements(): Achievement[] {
    return this.getItem<Achievement[]>(STORAGE_KEYS.ACHIEVEMENTS) || [];
  }

  saveAchievements(achievements: Achievement[]): void {
    this.setItem(STORAGE_KEYS.ACHIEVEMENTS, achievements);
  }

  // ===== Quests =====

  getQuests(): Quest[] {
    return this.getItem<Quest[]>(STORAGE_KEYS.QUESTS) || [];
  }

  saveQuests(quests: Quest[]): void {
    this.setItem(STORAGE_KEYS.QUESTS, quests);
  }

  // ===== Stories =====

  getStories(): Story[] {
    return this.getItem<Story[]>(STORAGE_KEYS.STORIES) || [];
  }

  saveStory(story: Story): void {
    const stories = this.getStories();
    stories.push(story);
    this.setItem(STORAGE_KEYS.STORIES, stories);
  }

  // ===== Quizzes =====

  getQuizzes(): Quiz[] {
    return this.getItem<Quiz[]>(STORAGE_KEYS.QUIZZES) || [];
  }

  saveQuiz(quiz: Quiz): void {
    const quizzes = this.getQuizzes();
    const existingIndex = quizzes.findIndex((q) => q.id === quiz.id);

    if (existingIndex >= 0) {
      // Update existing quiz
      quizzes[existingIndex] = quiz;
    } else {
      // Add new quiz
      quizzes.push(quiz);
    }

    this.setItem(STORAGE_KEYS.QUIZZES, quizzes);
  }

  // ===== Clear All Data (for debugging or reset) =====

  clearAll(): void {
    Object.values(STORAGE_KEYS).forEach((key) => {
      this.removeItem(key);
    });
  }
}

// Export singleton instance
export const storageService = new StorageService();
```

**Validation**:
```bash
# TypeScript should compile without errors
npm run type-check

# Test in browser console (after running dev server):
# > storageService.saveUser({ id: '1', name: 'Test', level: 1, ... })
# > storageService.getUser()
# Should return the saved user object
```

**Success Criteria**:
- ✅ `storageService` singleton created
- ✅ CRUD methods for User, Pet, Achievements, Quests, Stories, Quizzes
- ✅ Error handling for quota exceeded
- ✅ TypeScript types enforced

---

## 🎯 Quality Gates

### Gate 1: Code Quality ✅

**Commands**:
```bash
# Linting
npm run lint

# Type checking
npm run type-check

# Code formatting
npm run format
```

**Criteria**:
- ✅ No ESLint errors (warnings acceptable)
- ✅ No TypeScript errors
- ✅ Code follows Prettier formatting

---

### Gate 2: Functionality ✅

**Manual Testing**:
```bash
# Start dev server
npm run dev

# Browser testing checklist:
# 1. Navigate to http://localhost:5173/
# 2. Verify redirect to /dashboard
# 3. Test all 6 routes (/dashboard, /reading, /achievements, /shop, /progress, /profile)
# 4. Check each page renders without errors
# 5. Open DevTools Console → No errors
# 6. Test localStorage:
#    - Open DevTools → Application → Local Storage
#    - Verify no errors when using storageService
```

**Criteria**:
- ✅ All routes work
- ✅ No console errors
- ✅ localStorage read/write works
- ✅ Page loads in <3 seconds

---

### Gate 3: Accessibility ✅

**Automated Testing**:
```bash
# Run accessibility linter
npm run lint

# Check for jsx-a11y errors:
#   - Missing alt text
#   - Missing ARIA labels
#   - Keyboard navigation issues
```

**Manual Testing**:
```
# Keyboard navigation test:
# 1. Tab through all interactive elements
# 2. Verify visible focus indicators
# 3. Ensure all buttons/links reachable via keyboard

# Screen reader test (optional but recommended):
# 1. Enable VoiceOver (Mac: Cmd+F5) or NVDA (Windows)
# 2. Navigate through pages
# 3. Verify semantic structure makes sense
```

**Criteria**:
- ✅ No jsx-a11y ESLint errors
- ✅ Focus indicators visible on all interactive elements
- ✅ Keyboard navigation works for all actions

---

### Gate 4: Child Safety ✅

**Checklist**:
```
# COPPA Compliance (MVP)
- ✅ localStorage only (no data sent to servers)
- ✅ No authentication (no user accounts in MVP)
- ✅ No external tracking (no Google Analytics, no 3rd-party cookies)
- ✅ Content filtering architecture ready (service layer for Phase 2)

# Child-Safe Design
- ✅ Font size ≥ 18px (body text)
- ✅ Touch targets ≥ 44x44px (buttons, links)
- ✅ High contrast (WCAG AA: 4.5:1 minimum)
- ✅ Positive language (no fear/pressure in placeholder pages)
- ✅ Colorblind-friendly palette (not red/green only)

# Security
- ✅ No hardcoded secrets in code
- ✅ No API keys exposed in frontend (will be backend-only)
- ✅ localStorage data not sent to external services
```

**Criteria**:
- ✅ All child safety checklist items passed
- ✅ No COPPA violations in MVP design
- ✅ Accessibility guidelines followed

---

### Gate 5: Performance ✅

**Build Test**:
```bash
# Create production build
npm run build

# Analyze bundle size
npm run build -- --analyze

# Preview production build
npm run preview
```

**Criteria**:
- ✅ Build completes without errors
- ✅ Bundle size <500KB gzipped (initial)
- ✅ Dev server hot reload <1 second
- ✅ Production build loads in <3 seconds

---

## ✅ Completion Checklist

**Before marking this PRP complete, verify**:

- [ ] All 8 implementation steps completed
- [ ] All 5 quality gates passed
- [ ] Dev server runs on http://localhost:5173/
- [ ] All 6 routes work (/dashboard, /reading, /achievements, /shop, /progress, /profile)
- [ ] TypeScript strict mode enabled, no errors
- [ ] ESLint + Prettier configured and passing
- [ ] localStorage service created and tested
- [ ] Directory structure matches planning docs
- [ ] Tailwind CSS child-friendly theme applied
- [ ] No console errors in browser
- [ ] README.md updated with project setup instructions

---

## 📚 Next Steps (Phase 2)

After completing this PRP, proceed to:

1. **`PRPs/frontend/component-library.md`** - Common components (Button, Card, Modal, Input, etc.)
2. **`PRPs/frontend/theme-system.md`** - Dynamic theme switching (Space, Jungle, DeepSea, Minecraft, Tron)
3. **`PRPs/frontend/navigation.md`** - Header with currency display, bottom navigation, pet mini-widget

**Expected Phase 2 Start Date**: After Phase 1 complete (~1-2 days)

---

## 🐛 Troubleshooting

### Issue: `npm install` fails with ERR_PNPM_REGISTRIES_MISMATCH
**Solution**:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: TypeScript errors about `@/` path alias
**Solution**: Restart TypeScript server in VS Code (Cmd+Shift+P → "TypeScript: Restart TS Server")

### Issue: Tailwind classes not applying
**Solution**:
```bash
# Verify tailwind.config.js content array includes all files
# Restart dev server
npm run dev
```

### Issue: localStorage quota exceeded
**Solution**:
```typescript
// Clear old data in browser DevTools → Application → Local Storage → Clear All
// Or programmatically:
storageService.clearAll();
```

---

## 📊 Confidence Score: 9/10

**Reasoning**:

**Strengths (+)**:
- ✅ **Comprehensive research**: V1 codebase patterns analyzed, children's app best practices compiled
- ✅ **Child safety first**: COPPA compliance designed from day one (localStorage only for MVP)
- ✅ **Proven tech stack**: React 18 + TypeScript + Vite is production-tested (used in V1)
- ✅ **Scalable architecture**: Directory structure supports 60+ components, 15,000+ lines
- ✅ **Accessibility built-in**: jsx-a11y linting, WCAG AA compliance, keyboard navigation
- ✅ **Clear validation gates**: 5 quality gates with executable commands (lint, type-check, manual tests)
- ✅ **Reference codebase**: V1 (`reading_webapp/`) provides working examples for Azure integration
- ✅ **Detailed steps**: 8 granular steps with code examples, file paths, validation commands

**Weaknesses (-1)**:
- ⚠️ **No automated accessibility tests**: Manual testing required (could add @axe-core/react in future)

**Risk Mitigation**:
- Manual accessibility testing checklist provided
- jsx-a11y ESLint plugin catches common issues automatically
- Phase 2 will add automated accessibility tests with @axe-core/react

**Likelihood of one-pass success**: 90% (assumes developer follows all steps, runs all validation commands)

---

## 📖 References

**Codebase Examples**:
- `reading_webapp/src/App.tsx` - V1 theme system, state management patterns
- `reading_webapp/src/components/` - Component organization examples
- `backend/server.js` - Azure OpenAI integration patterns (for Phase 2 reference)

**External Documentation**:
- React 18: https://react.dev/
- TypeScript 5.7: https://www.typescriptlang.org/docs/
- Vite 6: https://vite.dev/
- Tailwind CSS 3.4: https://tailwindcss.com/docs
- React Router v6: https://reactrouter.com/en/main
- Framer Motion 11: https://www.framer.com/motion/
- WCAG 2.1 AA: https://www.w3.org/WAI/WCAG21/quickref/?currentsidebar=%23col_overview&levels=aa
- COPPA Compliance: https://www.ftc.gov/legal-library/browse/rules/childrens-online-privacy-protection-rule-coppa

**Planning Documents**:
- `docs/v2-architecture.md` - Complete technical specification
- `docs/implementation-strategy.md` - Development approach and context management
- `docs/wireframes/dashboard.md` - First page UI reference
- `docs/mock-data-schema.md` - TypeScript interface definitions

---

**PRP Status**: ✅ Ready for Execution
**Last Updated**: 2025-10-11
**Author**: AI Agent (Claude Code)
**Approved By**: [Pending User Review]
