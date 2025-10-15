# Reading App V2 - Wireframes

## Overview

This directory contains detailed ASCII wireframes for all 6 pages of the gamified Reading App V2. Each wireframe shows desktop and mobile layouts, component breakdowns, interactions, and states.

---

## Pages

### **1. Dashboard** ([dashboard.md](./dashboard.md))
**Purpose**: Main hub with pet, quests, stats, and quick actions

**Key Features**:
- Virtual Pet widget (prominent, interactive)
- Daily Quests (3 cards with progress)
- Weekly Quests (2 cards with bigger rewards)
- Stats Grid (XP, Level, Streak, Achievements)
- Quick Actions (Start Reading CTA)
- Language Settings (blend level slider)
- Leaderboard

**Priority**: ⭐⭐⭐ **HIGHEST** (User lands here first, sets tone)

---

### **2. Reading** ([reading.md](./reading.md))
**Purpose**: Core learning experience - story generation, reading, and quizzes

**Key Features**:
- Story Prompt Input (text + speech-to-text 🎤)
- Story Settings (length, grade, humor, theme)
- Language Controls (Korean/Mandarin, blend slider, hints toggle)
- Quiz Settings (teacher customization, difficulty)
- Story Display (blended text with inline hints)
- Audio Player (BONUS: read aloud with highlighting)
- Quiz Section (multiple choice + fill-in-blank)
- Mini Pet Widget (encouragement)
- Progress Tracking (words read, XP estimates)

**States**:
1. Story Generation (before generate)
2. Generating (loading)
3. Reading Story
4. Taking Quiz
5. Quiz Complete

**Priority**: ⭐⭐⭐ **HIGHEST** (Core educational experience)

---

### **3. Achievements** ([achievements.md](./achievements.md))
**Purpose**: Display unlockable badges and progress

**Key Features**:
- Achievement Grid (4 cols desktop, 2 cols mobile)
- Progress Summary (8 / 24 unlocked, 33%)
- Filter/Sort Controls (by category, progress, alphabetical)
- Search Bar
- Achievement Categories:
  - Reading (4 achievements)
  - Quiz (4 achievements)
  - Streak (3 achievements)
  - Language (5 achievements)
  - Pet (4 achievements)
  - XP/Level (4 achievements)
  - Collection (3 achievements)
- Motivational Section (next achievement recommendation)

**Priority**: ⭐⭐ **MEDIUM** (Motivational, not critical for MVP)

---

### **4. Shop** ([shop.md](./shop.md))
**Purpose**: Purchase cultural foods, cosmetics, power-ups, and chests

**Key Features**:
- Category Tabs (Foods, Cosmetics, Power-Ups, Chests, Specials)
- Cultural Foods:
  - Korean: Kimchi (50 🪙), Tteokbokki (100 🪙), Bulgogi (150 🪙), Bibimbap (200 🪙)
  - Chinese: Dumplings, Fried Rice, Kung Pao Chicken, Peking Duck
- Cosmetics (evolution track-specific accessories)
- Power-Ups (2x XP, Hint Tokens, Perfect Shot, Auto-Complete)
- Treasure Chests (Basic, Premium, Legendary)
- Limited Specials (time-limited bundles)
- Pet's Favorites Section (recommendation engine)

**Priority**: ⭐⭐ **MEDIUM** (Enhances engagement, not critical for MVP)

---

### **5. Progress** ([progress.md](./progress.md))
**Purpose**: Detailed stats, charts, and analytics

**Key Features**:
- Overview Stats (this week: XP, passages, quizzes, streak, gems, achievements)
- XP Chart (line graph over time)
- Daily Activity Heatmap (time-of-day patterns)
- Pet Evolution Timeline (past + next evolutions)
- Language Learning Progress (Korean: 145 words, Mandarin: 23 words)
- Quiz Performance (87% accuracy, improvement trend)
- Learning Goals (weekly, monthly, long-term with progress bars)
- Recent Achievements
- Export/Share Features

**Priority**: ⭐⭐ **MEDIUM** (Insightful but not critical for MVP)

---

### **6. Profile** ([profile.md](./profile.md))
**Purpose**: User settings, pet customization, app preferences

**Key Features**:
- User Profile (avatar, username, grade level)
- Pet Customization (evolution track, name, accessories)
- Language Preferences (secondary languages, default blend level)
- Learning Settings (passage length, humor, quiz difficulty)
- Theme & Appearance (5 visual themes, color mode, font size, animations)
- Sound & Audio (volume, TTS voice/speed, word highlighting)
- Notifications (daily reminders, quest alerts, pet needs)
- Data & Privacy (local storage, cache management, export/delete)
- Advanced Settings (developer mode, beta features, version info)

**Priority**: ⭐ **LOW** (Essential but not user-facing, can use defaults initially)

---

## Layout Patterns

### **Desktop (>1024px)**
- Header with logo, currency, streak
- Side or top navigation
- Two-column layouts (60/40 split)
- Prominent CTAs
- Detailed stats and charts

### **Mobile (<768px)**
- Bottom navigation (thumb-friendly)
- Single-column, stacked layout
- Collapsible sections
- Full-width cards
- Simplified charts
- 80px bottom padding for nav

---

## Common Components

### **Used Across Multiple Pages**
- **Header**: Logo, currency display (coins, gems), streak counter
- **Navigation**: Bottom nav (mobile) or side nav (desktop) with 6 tabs
- **Virtual Pet Widget**: Large on Dashboard, mini on Reading/other pages
- **Progress Bars**: XP, quests, achievements, goals
- **Currency Display**: Always visible in header
- **Modal Dialogs**: Confirmations, detailed views
- **Toast Notifications**: Success messages (+XP, +coins)
- **Confetti Animations**: Level ups, achievement unlocks

### **Component Library Needed**
- Button (primary, secondary, outline)
- Card (with hover effects)
- Slider (blend level, volume, etc.)
- Progress Bar (various colors)
- Modal (centered, fullscreen for celebrations)
- Dropdown (select, filter, sort)
- Checkbox / Radio
- Toggle Switch
- Input (text, number)
- Badge (rarity, status)
- Tab Navigation
- Tooltip
- Skeleton Loader

---

## Design Tokens

### **Colors (Per Theme)**
Each theme has:
- `primary`: Main accent color
- `accent`: Secondary accent
- `text`: Text color
- `background`: Background gradient/pattern

**Example - Space Theme:**
- Primary: #3b82f6 (blue)
- Accent: #06b6d4 (cyan)
- Text: #f1f5f9 (off-white)
- Background: Radial gradient (dark blue to black)

### **Typography**
- Headings: Bold, 18-24px
- Body: Regular, 14-16px
- Labels: Semi-bold, 12px
- Captions: Regular, 10-12px

### **Spacing**
- Padding: 12px, 16px, 20px, 24px
- Gaps: 8px, 12px, 16px
- Card Radius: 12px, 16px, 20px

### **Animations**
- Duration: 300ms (quick), 500ms (standard), 1000ms (slow)
- Easing: ease-out (most), ease-in-out (back-and-forth)
- Transitions: opacity, transform, background-color

---

## Interactions Summary

### **Global**
- Click logo → Navigate to Dashboard
- Click currency → Open shop (future)
- Click streak → Open achievements with filter for streak achievements
- Bottom nav → Navigate between pages

### **Pet Interactions**
- Click pet → Open pet modal with full stats
- Feed button → Deduct coins, reduce hunger, show animation
- Play button → Deduct gems, increase happiness, mini-game
- Boost button → Deduct gems, max all stats, celebration

### **Quest Interactions**
- Click quest card → Expand details
- Claim rewards → Show +XP/+coins animation, update currency, pet celebrates

### **Achievement Interactions**
- Click unlocked achievement → Show details modal with unlock date
- Click locked achievement → Show progress, tips, CTA to Reading page

### **Shop Interactions**
- Click item → Open purchase confirmation
- Confirm purchase → Deduct currency, add to inventory, show success animation
- Try cosmetic → Preview pet with accessory before purchase

---

## State Management Considerations

### **Global State Needed**
- User data (level, XP, coins, gems, streak)
- Pet state (happiness, hunger, energy, evolution stage, accessories)
- Achievements (unlocked, progress)
- Quests (daily, weekly, progress)
- Settings (language, theme, sound, etc.)
- Reading history
- Quiz results

### **Local State (Page-Level)**
- Form inputs (story prompt, settings)
- UI state (modals open/closed, tabs active)
- Loading states
- Validation errors

### **Persistence**
- localStorage for MVP (all state)
- Backend API for production (save/load)

---

## Responsive Breakpoints

```css
/* Mobile: < 768px */
- Bottom nav
- Single column
- Collapsible sections
- Full-width cards

/* Tablet: 768px - 1024px */
- Bottom or side nav
- Two-column (50/50)
- Partially expanded sections
- Medium cards

/* Desktop: > 1024px */
- Side nav
- Two-column (60/40)
- Fully expanded sections
- Large cards, charts
```

---

## Accessibility Checklist

- [ ] **Keyboard Navigation**: Tab through all interactive elements
- [ ] **Screen Reader**: ARIA labels on all elements
- [ ] **Focus Indicators**: Visible outlines on focused elements
- [ ] **Color Contrast**: WCAG AA compliance (4.5:1 for text)
- [ ] **Alt Text**: Descriptive alt text for images
- [ ] **Error Messages**: Clear, actionable error messages
- [ ] **Form Validation**: Real-time validation with helpful hints
- [ ] **Modal Focus Trapping**: Trap focus inside modals
- [ ] **Skip Links**: Skip to main content
- [ ] **Semantic HTML**: Proper heading hierarchy, landmarks

---

## Performance Considerations

- [ ] **Lazy Loading**: Load images/components as needed
- [ ] **Virtual Scrolling**: For long lists (achievements, shop items)
- [ ] **Memoization**: Prevent unnecessary re-renders
- [ ] **Debouncing**: Delay expensive operations (search, autosave)
- [ ] **Code Splitting**: Separate bundles per route
- [ ] **Image Optimization**: Compress, use WebP, responsive sizes
- [ ] **Caching**: Cache API responses, images, audio
- [ ] **Prefetching**: Prefetch next likely page (e.g., Reading from Dashboard)

---

## Next Steps

1. ✅ **Wireframes Complete** - All 6 pages documented
2. ⏳ **Mock Data Schema** - Define TypeScript interfaces for all data structures
3. ⏳ **Component Specifications** - Detailed props/state for each component
4. ⏳ **API Contract** - Endpoint specs for future backend integration
5. ⏳ **Prototype** - Build standalone Virtual Pet demo
6. ⏳ **Development** - Implement pages in priority order (Dashboard → Reading → Others)

---

## Questions & Decisions

### **Resolved**
- ✅ Multi-page navigation (not single-page)
- ✅ Pure frontend MVP (no auth, localStorage only)
- ✅ FLUX-1.1-pro for pet art (or emoji placeholders)
- ✅ gpt-5-pro for story/quiz generation
- ✅ 7 pet emotions (happy, sad, angry, hungry, excited, bored, love)
- ✅ 3 evolution tracks (Knowledge, Coolness, Culture)
- ✅ Cultural foods (Korean, Chinese) as shop items
- ✅ Speech-to-text for story prompt (browser Web Speech API)
- ✅ Audio reading designed early (BONUS Phase 8 implementation)

### **Pending**
- ⏳ Pet art style (pixel art vs. illustrated vs. 3D)
- ⏳ Evolution track names finalized per stage
- ⏳ Achievement reward balance (XP/gems amounts)
- ⏳ Quest reset times (midnight local time?)
- ⏳ Treasure chest rarity probabilities
- ⏳ Power-up effectiveness values

---

## Document Structure

```
docs/wireframes/
├── README.md (this file)
├── dashboard.md
├── reading.md
├── achievements.md
├── shop.md
├── progress.md
└── profile.md
```

---

## Feedback & Iteration

These wireframes are **living documents**. As we build prototypes and user-test, we'll iterate on:
- Component placement
- Interaction patterns
- Visual hierarchy
- Information density
- Mobile usability

**Version**: 1.0 (Initial wireframes)
**Last Updated**: 2025-10-11
**Status**: ✅ Complete - Ready for mock data schema
