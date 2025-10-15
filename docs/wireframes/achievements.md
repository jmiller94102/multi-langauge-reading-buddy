# Achievements Page Wireframe

## Layout Overview

The Achievements page displays all unlockable badges, progress tracking, and motivational messaging to encourage continued learning.

---

## Desktop Layout (>1024px)

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│  Header                                                                                │
│  ┌──────────────────┬─────────────────────────────────────────┬─────────────────────┐ │
│  │ 🎓 LearnKorean   │                                         │  🪙 1,250   💎 15   │ │
│  │ ← Back to Home   │                                         │  🔥 7 Days          │ │
│  └──────────────────┴─────────────────────────────────────────┴─────────────────────┘ │
└────────────────────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────────────────────┐
│  Page Header                                                                           │
│  ┌──────────────────────────────────────────────────────────────────────────────────┐ │
│  │  🏆 Achievements                                                                  │ │
│  │  Unlock badges by completing challenges!                                         │ │
│  │                                                                                  │ │
│  │  Progress: 8 / 24 Unlocked  (33%)                                                │ │
│  │  ████████░░░░░░░░░░░░░░░░░░░░░░                                                 │ │
│  │                                                                                  │ │
│  │  [Filter: All ▼]  [Sort: Recent ▼]  [Search: 🔍________________]               │ │
│  └──────────────────────────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────────────────────┐
│  Achievement Grid (4 columns)                                                          │
│                                                                                        │
│  ┌─────────────────┬─────────────────┬─────────────────┬─────────────────────────┐   │
│  │ ✅ UNLOCKED     │ ✅ UNLOCKED     │ ✅ UNLOCKED     │ ❌ LOCKED               │   │
│  │                 │                 │                 │                         │   │
│  │ ┌─────────────┐ │ ┌─────────────┐ │ ┌─────────────┐ │ ┌─────────────┐       │   │
│  │ │   📖        │ │ │   🔥        │ │ │   ⚡        │ │ │   ⭐        │       │   │
│  │ │             │ │ │             │ │ │             │ │ │   (grayed)   │       │   │
│  │ └─────────────┘ │ └─────────────┘ │ └─────────────┘ │ └─────────────┘       │   │
│  │                 │                 │                 │                         │   │
│  │ First Steps     │ Week Warrior    │ Speed Reader    │ Perfect Score           │   │
│  │                 │                 │                 │                         │   │
│  │ Complete your   │ Maintain a      │ Read 10         │ Get 100% on            │   │
│  │ first reading   │ 7-day streak    │ passages        │ a quiz                  │   │
│  │                 │                 │                 │                         │   │
│  │ Unlocked:       │ Unlocked:       │ Unlocked:       │ Progress:               │   │
│  │ 2 days ago      │ Yesterday       │ 3 days ago      │ 3 / 5                   │   │
│  │                 │                 │                 │ ████████░░              │   │
│  │ +100 XP         │ +200 XP         │ +200 XP         │ 60% complete            │   │
│  │                 │ +1 💎           │                 │                         │   │
│  └─────────────────┴─────────────────┴─────────────────┴─────────────────────────┘   │
│                                                                                        │
│  ┌─────────────────┬─────────────────┬─────────────────┬─────────────────────────┐   │
│  │ ❌ LOCKED       │ ❌ LOCKED       │ ❌ LOCKED       │ ❌ LOCKED               │   │
│  │                 │                 │                 │                         │   │
│  │ ┌─────────────┐ │ ┌─────────────┐ │ ┌─────────────┐ │ ┌─────────────┐       │   │
│  │ │   🎯        │ │ │   🏅        │ │ │   🏆        │ │ │   📈        │       │   │
│  │ │   (grayed)   │ │ │   (grayed)   │ │ │   (grayed)   │ │ │   (grayed)   │       │   │
│  │ └─────────────┘ │ └─────────────┘ │ └─────────────┘ │ └─────────────┘       │   │
│  │                 │                 │                 │                         │   │
│  │ Vocabulary      │ Quiz Champion   │ Level 10        │ Rising Star             │   │
│  │ Master          │                 │                 │                         │   │
│  │                 │                 │                 │                         │   │
│  │ Learn 100       │ Complete 25     │ Reach player    │ Earn 5000               │   │
│  │ new words       │ quizzes         │ level 10        │ total XP                │   │
│  │                 │                 │                 │                         │   │
│  │ Progress:       │ Progress:       │ Progress:       │ Progress:               │   │
│  │ 67 / 100        │ 12 / 25         │ 8 / 10          │ 2,450 / 5,000           │   │
│  │ ██████████████░ │ ████████░░░░    │ ████████████░░  │ ████░░░░░░░░░░░         │   │
│  │ 67% complete    │ 48% complete    │ 80% complete    │ 49% complete            │   │
│  │                 │                 │                 │                         │   │
│  │ +500 XP         │ +300 XP         │ +500 XP         │ +1000 XP                │   │
│  │                 │ +2 💎           │ +5 💎           │ +10 💎                  │   │
│  └─────────────────┴─────────────────┴─────────────────┴─────────────────────────┘   │
│                                                                                        │
│  [Load More... 16 more achievements]                                                  │
└────────────────────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────────────────────┐
│  Motivational Section                                                                  │
│  ┌──────────────────────────────────────────────────────────────────────────────────┐ │
│  │  Keep Going! 🌟                                                                   │ │
│  │                                                                                  │ │
│  │  You're doing great! Complete more readings and quizzes to unlock new            │ │
│  │  achievements.                                                                    │ │
│  │                                                                                  │ │
│  │  Next Achievement: Perfect Score (2 more perfect quizzes needed!)                │ │
│  │  [Start Reading] →                                                               │ │
│  └──────────────────────────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────────────────────┐
│  Bottom Navigation                                                                     │
│  ┌──────┬──────┬──────┬──────┬──────┬──────┐                                          │
│  │ 🏠   │ 📖   │ 🏆   │ 🏪   │ 📊   │ 👤   │                                          │
│  │ Home │ Read │ Achv │ Shop │Stats │ Prof │                                          │
│  │      │      │  ●   │      │      │      │                                          │
│  └──────┴──────┴──────┴──────┴──────┴──────┘                                          │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## Mobile Layout (<768px)

```
┌─────────────────────────────────────────────┐
│  Header                                     │
│  ┌───────────────────────────────────────┐ │
│  │ ← 🎓 Achievements                     │ │
│  │                                       │ │
│  │ 🪙 1,250   💎 15   🔥 7 Days          │ │
│  └───────────────────────────────────────┘ │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  Progress Summary                           │
│  ┌───────────────────────────────────────┐ │
│  │ 🏆 Achievements                        │ │
│  │                                       │ │
│  │ 8 / 24 Unlocked (33%)                 │ │
│  │ ████████░░░░░░░░░░░░░░                │ │
│  │                                       │ │
│  │ [Filter ▼] [Sort ▼] [🔍]             │ │
│  └───────────────────────────────────────┘ │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  Achievement Grid (2 columns)               │
│                                             │
│  ┌──────────────┬──────────────────────┐   │
│  │ ✅ UNLOCKED  │ ✅ UNLOCKED          │   │
│  │              │                      │   │
│  │ ┌──────────┐ │ ┌──────────┐        │   │
│  │ │   📖     │ │ │   🔥     │        │   │
│  │ └──────────┘ │ └──────────┘        │   │
│  │              │                      │   │
│  │ First Steps  │ Week Warrior         │   │
│  │              │                      │   │
│  │ Complete     │ 7-day streak         │   │
│  │ 1st reading  │                      │   │
│  │              │                      │   │
│  │ 2 days ago   │ Yesterday            │   │
│  │ +100 XP      │ +200 XP, +1 💎       │   │
│  └──────────────┴──────────────────────┘   │
│                                             │
│  ┌──────────────┬──────────────────────┐   │
│  │ ✅ UNLOCKED  │ ❌ LOCKED            │   │
│  │              │                      │   │
│  │ ┌──────────┐ │ ┌──────────┐        │   │
│  │ │   ⚡     │ │ │   ⭐     │        │   │
│  │ └──────────┘ │ │ (grayed)  │        │   │
│  │              │ └──────────┘        │   │
│  │ Speed Reader │ Perfect Score        │   │
│  │              │                      │   │
│  │ Read 10      │ Get 100% on          │   │
│  │ passages     │ a quiz               │   │
│  │              │                      │   │
│  │ 3 days ago   │ Progress: 3/5        │   │
│  │ +200 XP      │ ████████░░ 60%       │   │
│  └──────────────┴──────────────────────┘   │
│                                             │
│  [Load More... 16 achievements]             │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  Motivational Message                       │
│  ┌───────────────────────────────────────┐ │
│  │ Keep Going! 🌟                        │ │
│  │                                       │ │
│  │ Next: Perfect Score                   │ │
│  │ (2 more perfect quizzes!)             │ │
│  │                                       │ │
│  │ [Start Reading] →                     │ │
│  └───────────────────────────────────────┘ │
└─────────────────────────────────────────────┘

[BOTTOM PADDING: 80px for nav]

┌─────────────────────────────────────────────┐
│  Bottom Navigation                          │
│  ┌──────┬──────┬──────┬──────┬──────┬───┐  │
│  │  🏠  │  📖  │  🏆  │  🏪  │  📊  │ 👤│  │
│  │ Home │ Read │ Achv │ Shop │Stats │Pro│  │
│  │      │      │  ●   │      │      │   │  │
│  └──────┴──────┴──────┴──────┴──────┴───┘  │
└─────────────────────────────────────────────┘
```

---

## Achievement Categories

### **Reading Achievements**
- First Steps (1 passage) - 100 XP
- Book Worm (10 passages) - 200 XP
- Avid Reader (50 passages) - 500 XP
- Master Reader (100 passages) - 1000 XP, +10 💎

### **Quiz Achievements**
- Quiz Novice (1 quiz) - 100 XP
- Quiz Apprentice (10 quizzes) - 200 XP
- Quiz Expert (50 quizzes) - 500 XP
- Perfect Scholar (10 perfect quizzes) - 500 XP, +5 💎

### **Streak Achievements**
- Committed (7-day streak) - 200 XP, +1 💎
- Dedicated (30-day streak) - 500 XP, +5 💎
- Legendary (100-day streak) - 1500 XP, +15 💎

### **Language Achievements**
- Bilingual Beginner (level 5+ passage) - 250 XP
- Language Explorer (level 8+ passage) - 400 XP
- Multilingual Master (level 10 passage) - 750 XP, +10 💎
- Korean Scholar (20 Korean passages) - 500 XP
- Mandarin Master (20 Mandarin passages) - 500 XP

### **Pet Achievements**
- First Evolution (evolve once) - 200 XP
- Pet Parent (happy >80% for 7 days) - 300 XP
- Food Connoisseur (try 10 foods) - 250 XP, +2 💎
- Culture Ambassador (try 3 culture foods) - 400 XP, +3 💎

### **XP/Level Achievements**
- Level 5 - 200 XP
- Level 10 - 500 XP, +5 💎
- Level 20 - 1000 XP, +10 💎
- Level 25 - 2000 XP, +20 💎, "Legend" badge

### **Collection Achievements**
- Collector (5 achievements) - 250 XP
- Achiever (10 achievements) - 500 XP
- Completionist (all achievements) - 2000 XP, +50 💎

---

## Component Breakdown

### **Achievement Badge Card**
- Icon (emoji or image)
- Title
- Description
- Status (unlocked/locked)
- Progress bar (if locked)
- Reward display (XP, coins, gems)
- Unlock date (if unlocked)
- Animations:
  - Glow/pulse for unlocked
  - Grayscale for locked
  - Shake on hover

### **Filter/Sort Controls**
- **Filter dropdown**:
  - All
  - Unlocked
  - Locked
  - Reading
  - Quiz
  - Streak
  - Language
  - Pet
  - XP/Level
- **Sort dropdown**:
  - Recent (unlock date)
  - Progress (closest to unlock)
  - Alphabetical
  - Rarity (XP/gem rewards)

### **Search Bar**
- Real-time filtering by title or description
- Highlight matching text

### **Progress Summary**
- Overall unlock percentage
- Visual progress bar
- Count (e.g., 8 / 24)

### **Motivational Section**
- Encouragement message
- Next achievement recommendation
- CTA button to Reading page

---

## Interactions

### **Click Achievement Card (Unlocked)**
```
[Modal opens]
┌─────────────────────────────────────┐
│  🏆 Week Warrior                    │
│  ═══════════════════════════════    │
│                                     │
│  ┌─────────────┐                    │
│  │     🔥      │                    │
│  └─────────────┘                    │
│                                     │
│  Maintain a 7-day streak            │
│                                     │
│  Unlocked: Yesterday                │
│                                     │
│  Rewards Earned:                    │
│  • +200 XP                          │
│  • +1 💎                            │
│                                     │
│  Progress:                          │
│  7 / 7 days ████████████ 100%       │
│                                     │
│  [Close]                            │
└─────────────────────────────────────┘
```

### **Click Achievement Card (Locked)**
```
[Modal opens]
┌─────────────────────────────────────┐
│  ⭐ Perfect Score                   │
│  ═══════════════════════════════    │
│                                     │
│  ┌─────────────┐                    │
│  │     ⭐      │                    │
│  │  (grayed)    │                    │
│  └─────────────┘                    │
│                                     │
│  Get 100% on a quiz                 │
│                                     │
│  Progress: 3 / 5                    │
│  ████████░░ 60%                     │
│                                     │
│  Rewards (when unlocked):           │
│  • +500 XP                          │
│  • +5 💎                            │
│                                     │
│  Tips:                              │
│  • Read the story carefully         │
│  • Use hints sparingly              │
│  • Practice with easier quizzes     │
│                                     │
│  [Start Reading]  [Close]           │
└─────────────────────────────────────┘
```

### **Filter/Sort**
- Click dropdown
- Select option
- Grid reorders/filters instantly
- Show filtered count (e.g., "8 Reading Achievements")

### **Search**
- Type in search box
- Real-time filtering
- Highlight matching text in cards
- Show no results message if empty

### **Achievement Unlock**
```
[Full-screen modal with animation]
┌─────────────────────────────────────┐
│                                     │
│   ✨ Achievement Unlocked! ✨       │
│                                     │
│       ┌─────────────┐               │
│       │     🔥      │               │
│       │ (animates)   │               │
│       └─────────────┘               │
│                                     │
│       Week Warrior                  │
│                                     │
│   Maintain a 7-day streak           │
│                                     │
│   Rewards:                          │
│   • +200 XP                         │
│   • +1 💎                           │
│                                     │
│   [Awesome!]                        │
│                                     │
└─────────────────────────────────────┘

[Confetti animation]
[Pet shows "Excited" emotion]
[Achievement added to grid with glow effect]
```

---

## States & Animations

### **Achievement Unlock Animation**
1. Full-screen modal appears
2. Achievement icon scales up (0.5x → 1.2x → 1x)
3. Glow pulse effect
4. Confetti falls
5. Reward count-up animation (+200 XP)
6. Pet celebrates
7. Auto-dismiss after 5 sec or manual close

### **Progress Update**
- Progress bar fills smoothly (CSS transition)
- Percentage updates with easing
- Badge icon glows when close to unlock (>80%)

### **Grid Filtering**
- Fade out non-matching cards
- Slide matching cards into new positions
- Smooth transition (300ms)

### **Loading State**
```
┌─────────────────────────────┐
│  🏆 Loading Achievements... │
│  [Spinner]                  │
└─────────────────────────────┘
```

---

## Accessibility

- **Keyboard Navigation**: Tab through cards, Enter to open modal
- **Screen Reader**: Announce unlock status, progress, rewards
- **High Contrast**: Unlocked badges have colored border, locked are grayscale
- **Focus Indicators**: Blue outline on focused card
- **ARIA Labels**: "Achievement: Week Warrior, Unlocked, +200 XP, +1 gem"

---

## Performance

- **Lazy Rendering**: Only render visible cards (virtual scrolling)
- **Memoize Cards**: Only re-render when achievement data changes
- **Optimize Icons**: Use SVG or small PNGs, sprite sheets
- **Debounce Search**: Wait 300ms after typing before filtering

---

## Notes

- Achievements should feel **celebratory and rewarding**
- Progress bars motivate **continued effort**
- Locked achievements provide **clear goals**
- Motivational section **encourages next action**
- Filter/sort helps users **find relevant achievements**
- Modal provides **detailed information** without cluttering grid
