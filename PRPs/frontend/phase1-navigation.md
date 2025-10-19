# Phase 1 - Navigation System Implementation

**Feature**: Header, Navigation, and Page Layout Components
**Phase**: 1 (Foundation)
**Priority**: ⭐⭐⭐ HIGHEST
**Estimated Time**: 3-4 hours
**Status**: Ready for Execution

---

## Overview

Implement the navigation system for the Reading App V2, including:
- **Header** with logo, currency display (coins, gems), and streak counter
- **Bottom Navigation** (mobile, thumb-friendly) with 6 tabs
- **Side Navigation** (desktop) with 6 tabs
- **PageLayout** wrapper component for consistent page structure
- **React Router** setup for multi-page navigation

---

## Prerequisites

- ✅ Phase 1 Project Setup completed
- ✅ Phase 1 Component Library completed (Button, Card, etc.)
- ✅ Theme system configured (Tailwind CSS, colors, fonts)
- ✅ React Router DOM installed (`react-router-dom`)

---

## Navigation Requirements (From Wireframes)

### Header Component
**Location**: Top of all pages
**Contents**:
- Logo/App name (left) - Click to go to Dashboard
- Currency display (right):
  - Coins: 🪙 125
  - Gems: 💎 45
  - Streak: 🔥 7 days
- Responsive: Stack on mobile, inline on desktop

### Bottom Navigation (Mobile < 768px)
**Location**: Fixed bottom, 80px height
**Tabs** (6):
1. 📚 Dashboard (home icon)
2. 📖 Reading (book icon)
3. 🏆 Achievements (trophy icon)
4. 🛍️ Shop (shopping bag icon)
5. 📊 Progress (chart icon)
6. 👤 Profile (user icon)

**Behavior**:
- Active tab highlighted (primary color)
- Icon + label for each tab
- Thumb-friendly hit targets (56px)
- Fixed position, always visible

### Side Navigation (Desktop > 1024px)
**Location**: Left sidebar, 240px width
**Same 6 tabs** as bottom nav
**Additional Features**:
- Expanded text labels
- Hover effects
- Active tab with left border accent

### PageLayout Component
**Wrapper** for all pages with:
- Header at top
- Navigation (bottom or side depending on screen size)
- Main content area with proper padding
- Responsive margins

---

## Step 1: Setup React Router

### 1.1 Create Main Routes Configuration

**File**: `src/App.tsx`

```tsx
import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PageLayout } from '@/components/layout/PageLayout';
import { Skeleton } from '@/components/common/Skeleton';

// Lazy load pages for code splitting
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Reading = lazy(() => import('@/pages/Reading'));
const Achievements = lazy(() => import('@/pages/Achievements'));
const Shop = lazy(() => import('@/pages/Shop'));
const Progress = lazy(() => import('@/pages/Progress'));
const Profile = lazy(() => import('@/pages/Profile'));

function App() {
  return (
    <BrowserRouter>
      <PageLayout>
        <Suspense fallback={<Skeleton variant="page" />}>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/reading" element={<Reading />} />
            <Route path="/achievements" element={<Achievements />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Suspense>
      </PageLayout>
    </BrowserRouter>
  );
}

export default App;
```

**Validation**:
```bash
npm run type-check  # Should pass
```

---

## Step 2: Create Header Component

### 2.1 Implement Header Component

**File**: `src/components/layout/Header.tsx`

```tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface HeaderProps {
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({ className }) => {
  const navigate = useNavigate();

  // TODO: Replace with actual user data from UserContext in Phase 2
  const coins = 125;
  const gems = 45;
  const streak = 7;

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm',
        className
      )}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo - Click to go to Dashboard */}
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-lg px-2 py-1"
          aria-label="Go to Dashboard"
        >
          <span className="text-2xl font-bold text-primary-600">📚</span>
          <span className="hidden sm:block text-xl font-bold text-gray-900">
            Reading Quest
          </span>
        </button>

        {/* Currency Display */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Coins */}
          <div
            className="flex items-center gap-1.5 bg-gradient-to-br from-yellow-50 to-yellow-100 px-3 py-1.5 rounded-full border border-yellow-200"
            role="status"
            aria-label={`${coins} coins`}
          >
            <span className="text-lg" aria-hidden="true">
              🪙
            </span>
            <span className="font-semibold text-gray-900 text-sm sm:text-base">
              {coins}
            </span>
          </div>

          {/* Gems */}
          <div
            className="flex items-center gap-1.5 bg-gradient-to-br from-blue-50 to-blue-100 px-3 py-1.5 rounded-full border border-blue-200"
            role="status"
            aria-label={`${gems} gems`}
          >
            <span className="text-lg" aria-hidden="true">
              💎
            </span>
            <span className="font-semibold text-gray-900 text-sm sm:text-base">
              {gems}
            </span>
          </div>

          {/* Streak */}
          <div
            className="hidden sm:flex items-center gap-1.5 bg-gradient-to-br from-orange-50 to-orange-100 px-3 py-1.5 rounded-full border border-orange-200"
            role="status"
            aria-label={`${streak} day streak`}
          >
            <span className="text-lg" aria-hidden="true">
              🔥
            </span>
            <span className="font-semibold text-gray-900 text-base">
              {streak}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
```

**Accessibility**:
- ✅ Semantic `<header>` element
- ✅ ARIA labels for currency display
- ✅ Keyboard accessible logo button
- ✅ Focus indicators

**Validation**:
```bash
npm run type-check
npm run lint
```

---

## Step 3: Create Navigation Components

### 3.1 Create Navigation Types

**File**: `src/types/navigation.ts`

```typescript
export interface NavItem {
  id: string;
  label: string;
  icon: string;
  path: string;
  ariaLabel: string;
}

export const NAV_ITEMS: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: '🏠',
    path: '/dashboard',
    ariaLabel: 'Go to Dashboard',
  },
  {
    id: 'reading',
    label: 'Reading',
    icon: '📖',
    path: '/reading',
    ariaLabel: 'Go to Reading page',
  },
  {
    id: 'achievements',
    label: 'Achievements',
    icon: '🏆',
    path: '/achievements',
    ariaLabel: 'Go to Achievements page',
  },
  {
    id: 'shop',
    label: 'Shop',
    icon: '🛍️',
    path: '/shop',
    ariaLabel: 'Go to Shop page',
  },
  {
    id: 'progress',
    label: 'Progress',
    icon: '📊',
    path: '/progress',
    ariaLabel: 'Go to Progress page',
  },
  {
    id: 'profile',
    label: 'Profile',
    icon: '👤',
    path: '/profile',
    ariaLabel: 'Go to Profile page',
  },
];
```

### 3.2 Create Bottom Navigation (Mobile)

**File**: `src/components/layout/BottomNav.tsx`

```tsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { NAV_ITEMS } from '@/types/navigation';
import { cn } from '@/lib/utils';

export const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-lg"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="flex justify-around items-center h-20 px-2">
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={cn(
                'flex flex-col items-center justify-center gap-1 px-2 py-2 rounded-lg transition-all duration-200 min-w-touch min-h-touch',
                isActive
                  ? 'text-primary-600 bg-primary-50'
                  : 'text-gray-600 hover:text-primary-500 hover:bg-gray-50'
              )}
              aria-label={item.ariaLabel}
              aria-current={isActive ? 'page' : undefined}
            >
              <span className="text-2xl" aria-hidden="true">
                {item.icon}
              </span>
              <span
                className={cn(
                  'text-xs font-medium',
                  isActive ? 'font-bold' : 'font-normal'
                )}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
```

**Accessibility**:
- ✅ Semantic `<nav>` with aria-label
- ✅ `aria-current="page"` for active tab
- ✅ Large touch targets (44px minimum)
- ✅ Keyboard accessible

### 3.3 Create Side Navigation (Desktop)

**File**: `src/components/layout/SideNav.tsx`

```tsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { NAV_ITEMS } from '@/types/navigation';
import { cn } from '@/lib/utils';

export const SideNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav
      className="hidden lg:flex flex-col w-60 bg-white border-r border-gray-200 h-[calc(100vh-4rem)] sticky top-16"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="flex flex-col gap-2 p-4">
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 border-l-4',
                isActive
                  ? 'bg-primary-50 text-primary-700 border-primary-600 font-semibold shadow-sm'
                  : 'bg-transparent text-gray-700 border-transparent hover:bg-gray-50 hover:border-gray-300'
              )}
              aria-label={item.ariaLabel}
              aria-current={isActive ? 'page' : undefined}
            >
              <span className="text-2xl" aria-hidden="true">
                {item.icon}
              </span>
              <span className="text-base">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
```

**Accessibility**:
- ✅ Semantic `<nav>` with aria-label
- ✅ `aria-current="page"` for active tab
- ✅ Keyboard accessible
- ✅ Clear visual focus indicators

**Validation**:
```bash
npm run type-check
npm run lint
```

---

## Step 4: Create PageLayout Component

### 4.1 Implement PageLayout Wrapper

**File**: `src/components/layout/PageLayout.tsx`

```tsx
import React from 'react';
import { Header } from './Header';
import { BottomNav } from './BottomNav';
import { SideNav } from './SideNav';

interface PageLayoutProps {
  children: React.ReactNode;
}

export const PageLayout: React.FC<PageLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header - Always visible */}
      <Header />

      {/* Main Content Area */}
      <div className="flex">
        {/* Side Navigation - Desktop Only */}
        <SideNav />

        {/* Page Content */}
        <main
          className="flex-1 container mx-auto px-4 py-6 pb-24 lg:pb-6"
          role="main"
          id="main-content"
        >
          {children}
        </main>
      </div>

      {/* Bottom Navigation - Mobile Only */}
      <BottomNav />
    </div>
  );
};
```

**Layout Behavior**:
- Mobile (< 1024px): Header + Bottom Nav
- Desktop (≥ 1024px): Header + Side Nav
- Main content has padding-bottom for bottom nav on mobile
- Responsive container with proper spacing

**Accessibility**:
- ✅ Semantic `<main>` with id for skip links
- ✅ Proper heading hierarchy maintained
- ✅ Responsive layout adapts to screen size

**Validation**:
```bash
npm run type-check
npm run lint
```

---

## Step 5: Create Placeholder Pages

### 5.1 Create Page Components

**Files**: Create these in `src/pages/`

**`Dashboard.tsx`**:
```tsx
import React from 'react';

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-child-2xl font-bold text-gray-900">Dashboard</h1>
      <p className="text-child-base text-gray-600">
        Welcome to your reading dashboard! This page will show your virtual pet, quests, and
        stats.
      </p>
    </div>
  );
};

export default Dashboard;
```

**Repeat for**:
- `Reading.tsx` (title: "Reading")
- `Achievements.tsx` (title: "Achievements")
- `Shop.tsx` (title: "Shop")
- `Progress.tsx` (title: "Progress")
- `Profile.tsx` (title: "Profile")

**Validation**:
```bash
npm run dev  # Check all routes work
# Visit: http://localhost:5173/dashboard
# Visit: http://localhost:5173/reading
# etc.
```

---

## Step 6: Add Skip Link for Accessibility

### 6.1 Add Skip to Main Content Link

**File**: Update `src/components/layout/PageLayout.tsx`

Add skip link before header:

```tsx
export const PageLayout: React.FC<PageLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Skip Link for Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 bg-primary-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
      >
        Skip to main content
      </a>

      {/* Rest of layout... */}
    </div>
  );
};
```

**Add to** `src/index.css`:

```css
/* Screen reader only utility */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.focus\:not-sr-only:focus {
  position: static;
  width: auto;
  height: auto;
  padding: inherit;
  margin: inherit;
  overflow: visible;
  clip: auto;
  white-space: normal;
}
```

---

## Step 7: Create Barrel Exports

### 7.1 Create Index Files

**File**: `src/components/layout/index.ts`

```typescript
export { Header } from './Header';
export { BottomNav } from './BottomNav';
export { SideNav } from './SideNav';
export { PageLayout } from './PageLayout';
```

**File**: `src/pages/index.ts`

```typescript
export { default as Dashboard } from './Dashboard';
export { default as Reading } from './Reading';
export { default as Achievements } from './Achievements';
export { default as Shop } from './Shop';
export { default as Progress } from './Progress';
export { default as Profile } from './Profile';
```

---

## Step 8: Testing & Validation

### 8.1 Manual Testing Checklist

**Desktop Testing (> 1024px)**:
- [ ] Side navigation visible on left
- [ ] Bottom navigation hidden
- [ ] Click each nav item, verify route changes
- [ ] Active tab highlighted with left border
- [ ] Header currency displays correctly
- [ ] Logo click returns to dashboard

**Mobile Testing (< 768px)**:
- [ ] Bottom navigation visible at bottom
- [ ] Side navigation hidden
- [ ] Click each nav item, verify route changes
- [ ] Active tab highlighted with background color
- [ ] Header currency displays correctly (streak hidden on mobile)
- [ ] Content has padding-bottom for bottom nav

**Keyboard Testing**:
- [ ] Tab through all navigation items
- [ ] Enter key activates navigation
- [ ] Skip link appears on focus
- [ ] Focus indicators visible on all interactive elements

**Screen Reader Testing**:
- [ ] Navigation has proper aria-label
- [ ] Active tab has aria-current="page"
- [ ] Currency displays have aria-label
- [ ] Logo has descriptive aria-label

### 8.2 Automated Validation

```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Build test
npm run build
```

### 8.3 Accessibility Validation

Run accessibility audit (manual or with tools):
```bash
# If you have axe-core or similar
npm run test:a11y
```

**Checklist**:
- [ ] WCAG AA color contrast (4.5:1)
- [ ] Keyboard navigation works
- [ ] Focus indicators visible
- [ ] ARIA labels present
- [ ] Semantic HTML used
- [ ] Skip link functional

---

## Quality Gates

### Gate 1: Code Quality ✅
```bash
npm run lint && npm run type-check
```
**Criteria**: No errors, follows conventions

### Gate 2: Functionality ✅
- [ ] All 6 routes navigate correctly
- [ ] Active tab highlights properly
- [ ] Header displays currency
- [ ] Logo returns to dashboard
- [ ] Responsive layout works (desktop + mobile)

### Gate 3: Accessibility ✅
- [ ] Keyboard navigation works
- [ ] Screen reader compatible
- [ ] WCAG AA compliant
- [ ] Skip link functional
- [ ] Focus indicators visible

### Gate 4: Child Safety ✅
- [ ] No external links
- [ ] Age-appropriate content
- [ ] Large touch targets (44px+)
- [ ] Clear, simple navigation

---

## Completion Checklist

- [ ] React Router setup complete
- [ ] Header component implemented
- [ ] Bottom navigation (mobile) implemented
- [ ] Side navigation (desktop) implemented
- [ ] PageLayout wrapper implemented
- [ ] All 6 placeholder pages created
- [ ] Skip link added
- [ ] Barrel exports created
- [ ] Manual testing completed (desktop + mobile)
- [ ] Keyboard testing completed
- [ ] Type checking passed
- [ ] Linting passed
- [ ] Accessibility validated (WCAG AA)
- [ ] Build successful

---

## Next Steps

After completing this PRP:
1. ✅ Mark `phase1-navigation.md` as complete in README
2. → Move to Phase 2: Dashboard Page implementation
3. → Implement UserContext to replace hardcoded currency values in Header
4. → Add animations to navigation transitions (Phase 6)

---

**Status**: Ready for Execution
**Last Updated**: 2025-10-14
**Estimated Completion**: 3-4 hours
