# Progress Page Wireframe

## Layout Overview

The Progress page displays detailed stats, charts, pet evolution timeline, and learning analytics.

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
│  │  📊 Your Learning Progress                                                        │ │
│  │  Track your journey to becoming a multilingual master!                           │ │
│  │                                                                                  │ │
│  │  [Time Range: This Week ▼]  [Export Stats] [Share Progress]                     │ │
│  └──────────────────────────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────┬─────────────────────────────────────────┐
│  Left Column (60%)                           │  Right Column (40%)                     │
│                                              │                                         │
│  ┌────────────────────────────────────────┐ │  ┌────────────────────────────────────┐ │
│  │  📈 Overview Stats                     │ │  │  🐾 Pet Evolution Timeline         │ │
│  │  ═══════════════════════════════════   │ │  │  ═══════════════════════════════   │ │
│  │                                        │ │  │                                    │ │
│  │  This Week                             │ │  │  ┌──────────────────────────────┐ │ │
│  │                                        │ │  │  │  Level 12 • Knowledge Track  │ │ │
│  │  ┌──────────┬──────────┬──────────┐   │ │  │  │                              │ │ │
│  │  │ 📚 XP    │ 📖 Read  │ ✅ Quiz  │   │ │  │  │    ┌─────────────────┐      │ │ │
│  │  │          │          │          │   │ │  │  │    │                 │      │ │ │
│  │  │  +450    │    12    │    10    │   │ │  │  │    │  [Current Pet]  │      │ │ │
│  │  │  ↑ 22%   │  ↑ 3     │  ↑ 2     │   │ │  │  │    │  Flutterpuff    │      │ │ │
│  │  └──────────┴──────────┴──────────┘   │ │  │  │    │                 │      │ │ │
│  │                                        │ │  │  │    └─────────────────┘      │ │ │
│  │  ┌──────────┬──────────┬──────────┐   │ │  │  │                              │ │ │
│  │  │ 🎯 Streak│ 💎 Gems  │ 🏆 Achv  │   │ │  │  │  Stage 2 (Child)             │ │ │
│  │  │          │          │          │   │ │  │  │  Unlocked 5 days ago         │ │ │
│  │  │    7     │   +5     │   +2     │   │ │  │  └──────────────────────────────┘ │ │
│  │  │  🔥 Best │  ↑ Earned│  Unlocked│   │ │  │                                    │ │
│  │  └──────────┴──────────┴──────────┘   │ │  │  Evolution History:                │ │
│  └────────────────────────────────────────┘ │  │                                    │ │
│                                              │  │  ┌──────────────────────────────┐ │ │
│  ┌────────────────────────────────────────┐ │  │  │ ● Level 15 → Phoenixel       │ │ │
│  │  📊 XP Earned Over Time                │ │  │  │   Next Evolution (3 levels)  │ │ │
│  │  ═══════════════════════════════════   │ │  │  │   ████████░░ [12/15]         │ │ │
│  │                                        │ │  │  └──────────────────────────────┘ │ │
│  │  [Line Chart]                          │ │  │                                    │ │
│  │   450 XP │            ╱─╲               │ │  │  ┌──────────────────────────────┐ │ │
│  │   400 XP │          ╱     ╲             │ │  │  │ ✓ Level 8 → Wingstar         │ │ │
│  │   350 XP │        ╱         ╲           │ │  │  │   (Current)                  │ │ │
│  │   300 XP │      ╱             ╲         │ │  │  │   5 days ago                 │ │ │
│  │   250 XP │    ╱                 ╲       │ │  │  └──────────────────────────────┘ │ │
│  │   200 XP │  ╱                     ╲     │ │  │                                    │ │
│  │   150 XP │╱                         ╲   │ │  │  ┌──────────────────────────────┐ │ │
│  │   100 XP ─────────────────────────────  │ │  │  │ ✓ Level 4 → Flutterpuff      │ │ │
│  │    50 XP │                              │ │  │  │   12 days ago                │ │ │
│  │     0 XP └───┬───┬───┬───┬───┬───┬───  │ │  │  └──────────────────────────────┘ │ │
│  │             Mon Tue Wed Thu Fri Sat Sun │ │  │                                    │ │
│  │                                        │ │  │  ┌──────────────────────────────┐ │ │
│  │  Total This Week: +450 XP              │ │  │  │ ✓ Level 1 → Chirpychi        │ │ │
│  │  Average per Day: 64 XP                │ │  │  │   (Baby)                     │ │ │
│  └────────────────────────────────────────┘ │  │  │   20 days ago                │ │ │
│                                              │  │  └──────────────────────────────┘ │ │
│  ┌────────────────────────────────────────┐ │  └────────────────────────────────────┘ │
│  │  📅 Daily Activity Heatmap             │ │                                         │
│  │  ═══════════════════════════════════   │ │  ┌────────────────────────────────────┐ │
│  │                                        │ │  │  🎯 Learning Goals                 │ │
│  │  Mon ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░   │ │  │  ═══════════════════════════════   │ │
│  │  Tue ░░████████████████████░░░░░░░░   │ │  │                                    │ │
│  │  Wed ░░████████████████░░░░░░░░░░░░   │ │  │  Weekly Goal:                      │ │
│  │  Thu ░░████████████████████████░░░░   │ │  │  Complete 15 passages              │ │
│  │  Fri ░░████████████████████░░░░░░░░   │ │  │  ████████████░░░  [12/15] 80%      │ │
│  │  Sat ░░████████████████████████████   │ │  │                                    │ │
│  │  Sun ░░████████████░░░░░░░░░░░░░░░░   │ │  │  Monthly Goal:                     │ │
│  │      └───────────────────────────────  │ │  │  Reach Level 15                    │ │
│  │       12am 6am  12pm  6pm  12am        │ │  │  ████████████░░  [12/15] 80%       │ │
│  │                                        │ │  │                                    │ │
│  │  Most Active: Saturday 2-4pm           │ │  │  Long-term Goal:                   │ │
│  │  Average Session: 18 minutes           │ │  │  Master 500 Korean words           │ │
│  └────────────────────────────────────────┘ │  │  █████░░░░░░░░░░  [145/500] 29%    │ │
│                                              │  │                                    │ │
│  ┌────────────────────────────────────────┐ │  │  [Set New Goal]                    │ │
│  │  🌍 Language Learning Progress         │ │  └────────────────────────────────────┘ │
│  │  ═══════════════════════════════════   │ │                                         │
│  │                                        │ │  ┌────────────────────────────────────┐ │
│  │  Korean (🇰🇷)                          │ │  │  🏅 Recent Achievements            │ │
│  │                                        │ │  │  ═══════════════════════════════   │ │
│  │  Words Learned: 145                    │ │  │                                    │ │
│  │  ████████████████████░░░░ 29%          │ │  │  ✨ Yesterday                      │ │
│  │                                        │ │  │  🔥 Week Warrior                   │ │
│  │  Passages at Level 5+: 8               │ │  │  Maintain 7-day streak             │ │
│  │  ████████████████░░░░░░░ 40%           │ │  │  +200 XP, +1 💎                    │ │
│  │                                        │ │  │                                    │ │
│  │  Average Blend Level: 4.2              │ │  │  ✨ 3 days ago                     │ │
│  │  ████████░░░░░░░░░░░░░░░ 42%           │ │  │  ⚡ Speed Reader                   │ │
│  │                                        │ │  │  Read 10 passages                  │ │
│  │  Mandarin (🇨🇳)                        │ │  │  +200 XP                           │ │
│  │                                        │ │  │                                    │ │
│  │  Words Learned: 23                     │ │  │  [View All Achievements] →         │ │
│  │  ████░░░░░░░░░░░░░░░░░░ 5%             │ │  └────────────────────────────────────┘ │
│  │                                        │ │                                         │
│  │  Passages at Level 5+: 0               │ │                                         │
│  │  ░░░░░░░░░░░░░░░░░░░░░░ 0%             │ │                                         │
│  └────────────────────────────────────────┘ │                                         │
│                                              │                                         │
│  ┌────────────────────────────────────────┐ │                                         │
│  │  🎓 Quiz Performance                   │ │                                         │
│  │  ═══════════════════════════════════   │ │                                         │
│  │                                        │ │                                         │
│  │  Overall Accuracy: 87%                 │ │                                         │
│  │  ████████████████████░░░ 87%           │ │                                         │
│  │                                        │ │                                         │
│  │  Improvement Trend: ↑ Improving        │ │                                         │
│  │  This Week: 90% (↑ 5%)                 │ │                                         │
│  │  Last Week: 85%                        │ │                                         │
│  │                                        │ │                                         │
│  │  Best Subject: Comprehension (95%)     │ │                                         │
│  │  Needs Work: Vocabulary (78%)          │ │                                         │
│  │                                        │ │                                         │
│  │  Perfect Quizzes: 3 / 10               │ │                                         │
│  │  ████████░░░░░░ 30%                    │ │                                         │
│  └────────────────────────────────────────┘ │                                         │
└──────────────────────────────────────────────┴─────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────────────────────┐
│  Bottom Navigation                                                                     │
│  ┌──────┬──────┬──────┬──────┬──────┬──────┐                                          │
│  │ 🏠   │ 📖   │ 🏆   │ 🏪   │ 📊   │ 👤   │                                          │
│  │ Home │ Read │ Achv │ Shop │Stats │ Prof │                                          │
│  │      │      │      │      │  ●   │      │                                          │
│  └──────┴──────┴──────┴──────┴──────┴──────┘                                          │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## Mobile Layout (<768px)

```
┌─────────────────────────────────────────────┐
│  Header                                     │
│  ┌───────────────────────────────────────┐ │
│  │ ← 🎓 Progress                         │ │
│  │                                       │ │
│  │ 🪙 1,250   💎 15   🔥 7 Days          │ │
│  └───────────────────────────────────────┘ │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  Time Range & Actions                       │
│  [This Week ▼] [Export] [Share]             │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  📈 Overview Stats (This Week)              │
│  ═══════════════════════════════            │
│                                             │
│  ┌──────────┬──────────┬──────────────┐    │
│  │ 📚 XP    │ 📖 Read  │ ✅ Quiz      │    │
│  │  +450    │    12    │    10        │    │
│  │ ↑ 22%    │  ↑ 3     │  ↑ 2         │    │
│  └──────────┴──────────┴──────────────┘    │
│                                             │
│  ┌──────────┬──────────┬──────────────┐    │
│  │ 🎯 Streak│ 💎 Gems  │ 🏆 Achv      │    │
│  │    7     │   +5     │   +2         │    │
│  │ 🔥 Best  │ ↑ Earned │  Unlocked    │    │
│  └──────────┴──────────┴──────────────┘    │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  📊 XP Over Time                            │
│  ═══════════════════════════════            │
│  [Simplified line chart]                    │
│  Total: +450 XP                             │
│  Average: 64 XP/day                         │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  🐾 Pet Evolution                           │
│  ═══════════════════════════════            │
│                                             │
│  ┌───────────────────────────────────────┐ │
│  │  [Current Pet Image]                  │ │
│  │  Flutterpuff • Level 12               │ │
│  │  Knowledge Track                      │ │
│  └───────────────────────────────────────┘ │
│                                             │
│  Next: Level 15 → Phoenixel                 │
│  ████████░░ [12/15] 80%                     │
│                                             │
│  [View History ▼]                           │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  🎯 Learning Goals                          │
│  ═══════════════════════════════            │
│                                             │
│  Weekly: 15 passages                        │
│  ████████████░░░ [12/15] 80%                │
│                                             │
│  Monthly: Reach Level 15                    │
│  ████████████░░ [12/15] 80%                 │
│                                             │
│  Long-term: 500 Korean words                │
│  █████░░░░░░░░░░ [145/500] 29%              │
│                                             │
│  [Set New Goal]                             │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  🌍 Language Progress                       │
│  ═══════════════════════════════            │
│                                             │
│  Korean 🇰🇷                                 │
│  Words: 145  Passages 5+: 8                 │
│  ████████████████████░░░░ 29%               │
│                                             │
│  Mandarin 🇨🇳                               │
│  Words: 23  Passages 5+: 0                  │
│  ████░░░░░░░░░░░░░░░░░░ 5%                  │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  🎓 Quiz Performance                        │
│  ═══════════════════════════════            │
│                                             │
│  Overall: 87%  This Week: 90% (↑ 5%)        │
│  ████████████████████░░░ 87%                │
│                                             │
│  Best: Comprehension (95%)                  │
│  Needs Work: Vocabulary (78%)               │
│                                             │
│  Perfect Quizzes: 3/10                      │
│  ████████░░░░░░ 30%                         │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  🏅 Recent Achievements (Collapsed) [▼]     │
│  ═══════════════════════════════            │
└─────────────────────────────────────────────┘

[BOTTOM PADDING: 80px for nav]
```

---

## Component Breakdown

### **Overview Stats Cards**
- Stat value with trend indicator (↑↓)
- Comparison to last period
- Color-coded by performance

### **XP Chart**
- Line graph showing daily XP gains
- Week/month/year toggle
- Hover to see exact values
- Total and average displayed below

### **Activity Heatmap**
- Visual representation of daily activity
- Color intensity = activity level
- Shows time patterns
- Most active time highlighted

### **Pet Evolution Timeline**
- Current stage highlighted
- Past evolutions with dates
- Next evolution progress bar
- Click to view stage details

### **Language Progress Bars**
- Words learned count
- Passage completion at different blend levels
- Average blend level
- Separate sections for each language

### **Quiz Performance**
- Overall accuracy %
- Trend indicator (improving/declining/stable)
- Best/worst subject areas
- Perfect quiz progress

### **Learning Goals**
- Weekly, monthly, long-term goals
- Progress bars
- Completion percentage
- Set new goal button

### **Recent Achievements**
- List of recently unlocked achievements
- Date unlocked
- Rewards earned
- Link to full achievements page

---

## Interactions

### **Time Range Selector**
```
[Click dropdown]
┌─────────────────────┐
│ ⚪ Today            │
│ ● This Week         │
│ ⚪ This Month        │
│ ⚪ All Time          │
│ ⚪ Custom Range      │
└─────────────────────┘

[Stats update based on selection]
```

### **Export Stats**
```
[Click Export]
┌─────────────────────────────────────┐
│  Export Your Progress               │
│                                     │
│  Format:                            │
│  ⚪ PDF Report                      │
│  ● Image (PNG)                      │
│  ⚪ CSV Data                        │
│                                     │
│  Include:                           │
│  ☑ Stats Summary                    │
│  ☑ XP Chart                         │
│  ☑ Language Progress                │
│  ☑ Pet Evolution                    │
│  ☐ Full Achievement List            │
│                                     │
│  [Cancel] [Export]                  │
└─────────────────────────────────────┘

[Download file]
```

### **Share Progress**
```
[Click Share]
┌─────────────────────────────────────┐
│  Share Your Progress                │
│                                     │
│  [Preview Image]                    │
│  ┌─────────────────────────────┐   │
│  │  Week 12 Progress           │   │
│  │  Level 12 • 450 XP          │   │
│  │  7-day streak 🔥            │   │
│  │  [Pet Image]                │   │
│  └─────────────────────────────┘   │
│                                     │
│  Share to:                          │
│  [Twitter] [Facebook] [Copy Link]   │
│                                     │
│  [Close]                            │
└─────────────────────────────────────┘
```

### **Set New Goal**
```
[Click Set New Goal]
┌─────────────────────────────────────┐
│  Create Learning Goal               │
│                                     │
│  Goal Type:                         │
│  ⚪ Passages (e.g., Read 20)        │
│  ● XP Target (e.g., Earn 1000 XP)   │
│  ⚪ Level (e.g., Reach Level 15)    │
│  ⚪ Words (e.g., Learn 100 words)   │
│                                     │
│  Target: [1000] XP                  │
│                                     │
│  Timeframe:                         │
│  ⚪ This Week                       │
│  ● This Month                       │
│  ⚪ Custom Deadline                 │
│                                     │
│  [Cancel] [Create Goal]             │
└─────────────────────────────────────┘
```

### **Hover XP Chart Point**
```
[Tooltip appears]
┌───────────────┐
│  Tuesday      │
│  +75 XP       │
│  3 passages   │
│  2 quizzes    │
└───────────────┘
```

### **Click Pet Evolution Stage**
```
[Modal shows stage details]
┌─────────────────────────────────────┐
│  Evolution: Flutterpuff             │
│                                     │
│  ┌─────────────┐                    │
│  │             │                    │
│  │  [Pet Image]│                    │
│  │             │                    │
│  └─────────────┘                    │
│                                     │
│  Stage: 2 (Child)                   │
│  Unlocked: 5 days ago               │
│  Level Required: 8                  │
│                                     │
│  Special Abilities:                 │
│  • +10% XP bonus                    │
│  • Unlocked Korean foods            │
│                                     │
│  [Close]                            │
└─────────────────────────────────────┘
```

---

## States & Animations

### **Loading State**
```
┌─────────────────────────────┐
│  📊 Loading your stats...   │
│  [Spinner]                  │
└─────────────────────────────┘
```

### **Chart Animation**
- Line draws from left to right (800ms)
- Points pop in sequentially
- Smooth transitions between time ranges

### **Progress Bar Fill**
- Animates from 0 to target % (500ms)
- Easing function for smooth motion
- Color transitions based on progress

### **Stat Count-Up**
- Numbers increment from 0 to target
- Duration: 1000ms
- Easing: ease-out

---

## Accessibility

- **Keyboard Navigation**: Tab through sections, arrow keys for chart
- **Screen Reader**: Announce all stats with units
- **High Contrast**: Chart lines clearly visible
- **Alt Text**: Describe trends for chart data
- **Accessible Tables**: Proper headers for tabular data

---

## Performance

- **Lazy Load Charts**: Only render when scrolling into view
- **Memoize Calculations**: Cache stat computations
- **Debounce Time Range**: Wait 300ms before re-fetching
- **Optimize Charts**: Use canvas instead of SVG for large datasets

---

## Notes

- Progress page should feel **informative and motivating**
- Charts provide **visual feedback** on improvement
- Goals create **clear targets** to work towards
- Pet evolution timeline shows **long-term progress**
- Language progress **highlights bilingual journey**
- Quiz performance helps **identify areas for improvement**
- Export/share features allow **celebrating achievements**
