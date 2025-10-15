# Dashboard Page Wireframe

## Layout Overview

The Dashboard is the main hub where users see their pet, quests, stats, and quick actions.

---

## Desktop Layout (>1024px)

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│  Header                                                                                │
│  ┌──────────────────┬─────────────────────────────────────────┬─────────────────────┐ │
│  │ 🎓 LearnKorean   │                                         │  🪙 1,250   💎 15   │ │
│  │                  │                                         │  🔥 7 Days          │ │
│  └──────────────────┴─────────────────────────────────────────┴─────────────────────┘ │
└────────────────────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────────────────────┐
│  Welcome Section                                                                       │
│  ┌──────────────────────────────────────────────────────────────────────────────────┐ │
│  │  🎓 Welcome back, Renzo!                          Level 12  ▲ +2 from yesterday  │ │
│  │     Ready to learn today?                                                        │ │
│  │                                                                                  │ │
│  │     XP Progress to Level 13:   ████████████████░░░░░░░░  2,450 / 3,000         │ │
│  │                                                                                  │ │
│  │     🔥 7 Day Streak • Keep it up!                                               │ │
│  └──────────────────────────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────────────────────┐
│  Stats Grid                                                                            │
│  ┌─────────────────┬─────────────────┬─────────────────┬─────────────────────────┐   │
│  │  📚 Total XP    │  📈 Level       │  🎯 Streak      │  🏆 Achievements        │   │
│  │                 │                 │                 │                         │   │
│  │     2,450       │    Level 12     │    7 days       │      8 / 24             │   │
│  │   ▲ +150 today  │  ████████░░ 82% │  🔥 Best: 12    │   33% Complete          │   │
│  └─────────────────┴─────────────────┴─────────────────┴─────────────────────────┘   │
└────────────────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────┬─────────────────────────────────────────┐
│  Left Column (60%)                           │  Right Column (40%)                     │
│                                              │                                         │
│  ┌────────────────────────────────────────┐ │  ┌────────────────────────────────────┐ │
│  │  🎯 Daily Quests                       │ │  │  🐾 Your Learning Buddy            │ │
│  │  ═══════════════════════════════════   │ │  │                                    │ │
│  │  Resets in 18:45:23                    │ │  │  ┌──────────────────────────────┐ │ │
│  │                                        │ │  │  │                              │ │ │
│  │  ┌──────────────────────────────────┐ │ │  │  │        😊 Happy              │ │ │
│  │  │ 📖 Daily Reader         [2/3] ▓▓░│ │ │  │  │                              │ │ │
│  │  │ Complete 3 reading passages      │ │ │  │  │     [Pet Image Here]         │ │ │
│  │  │                                  │ │ │  │  │                              │ │ │
│  │  │ Rewards:                         │ │ │  │  │    Flutterpuff               │ │ │
│  │  │ • +100 XP                        │ │ │  │  │    Level 12                  │ │ │
│  │  │ • +50 🪙                         │ │ │  │  │                              │ │ │
│  │  │                                  │ │ │  │  └──────────────────────────────┘ │ │
│  │  │ Progress: 66% ████████░░░        │ │ │  │                                    │ │
│  │  └──────────────────────────────────┘ │ │  │  Stats:                            │ │
│  │                                        │ │  │  ❤️  Happiness  [85%] ████████░   │ │
│  │  ┌──────────────────────────────────┐ │ │  │  🍖 Hunger     [30%] ███░░░░░░    │ │
│  │  │ 🎯 Quiz Master      [1/2] ▓░     │ │ │  │  ⚡ Energy     [60%] ██████░░░░   │ │
│  │  │ Score 80%+ on 2 quizzes          │ │ │  │                                    │ │
│  │  │                                  │ │ │  │  Actions:                          │ │
│  │  │ Rewards:                         │ │ │  │  ┌──────────┬──────────┬─────────┐ │ │
│  │  │ • +150 XP                        │ │ │  │  │Feed      │Play      │Boost    │ │ │
│  │  │ • +75 🪙                         │ │ │  │  │10 🪙     │1 💎      │5 💎     │ │ │
│  │  │ • +1 💎                          │ │ │  │  └──────────┴──────────┴─────────┘ │ │
│  │  │                                  │ │ │  │                                    │ │
│  │  │ Progress: 50% ██████░░░░         │ │ │  │  Next Evolution:                   │ │
│  │  └──────────────────────────────────┘ │ │  │  Level 15 → Phoenixel              │ │
│  │                                        │ │  │  ████████░░░  [12/15]             │ │
│  │  ┌──────────────────────────────────┐ │ │  │                                    │ │
│  │  │ 🔥 Streak Keeper    [1/1] ✓      │ │ │  │  💡 Tip: A happy buddy helps you   │ │
│  │  │ Maintain your daily streak       │ │ │  │     learn better!                  │ │
│  │  │                                  │ │ │  └────────────────────────────────────┘ │
│  │  │ Rewards:                         │ │  │                                         │
│  │  │ • +50 XP                         │ │  │  ┌────────────────────────────────────┐ │
│  │  │ • +25 🪙                         │ │  │  │  🏅 Weekly Leaderboard             │ │
│  │  │                                  │ │  │  │  ═══════════════════════════════   │ │
│  │  │ Status: ✓ Complete               │ │  │  │                                    │ │
│  │  │ [Claim Rewards]                  │ │  │  │  1. 👑 Sarah         5,420 XP      │ │
│  │  └──────────────────────────────────┘ │ │  │  │  2. 🦸 Mike          4,890 XP      │ │
│  │                                        │ │  │  │  3. 🌟 Emma          3,765 XP      │ │
│  └────────────────────────────────────────┘ │  │  │  4. 🎓 Renzo (You)   2,450 XP ⭐   │ │
│                                              │  │  │  5. 🦄 Lily          2,180 XP      │ │
│  ┌────────────────────────────────────────┐ │  │  │                                    │ │
│  │  📅 Weekly Quests                      │ │  │  │  Your Rank: #4                     │ │
│  │  ═══════════════════════════════════   │ │  │  │  🎯 250 XP to rank #3!             │ │
│  │  Resets in 5 days                      │ │  │  └────────────────────────────────────┘ │
│  │                                        │ │  │                                         │
│  │  ┌──────────────────────────────────┐ │ │  └─────────────────────────────────────────┘
│  │  │ 🌟 Rising Star   [650/1000] ▓▓▓░ │ │ │
│  │  │ Earn 1000 XP this week           │ │ │
│  │  │                                  │ │ │
│  │  │ Rewards:                         │ │ │
│  │  │ • +500 XP                        │ │ │
│  │  │ • +200 🪙                        │ │ │
│  │  │ • +3 💎                          │ │ │
│  │  │                                  │ │ │
│  │  │ Progress: 65% ███████░░░         │ │ │
│  │  │ 🎯 350 XP to go!                 │ │ │
│  │  └──────────────────────────────────┘ │ │
│  │                                        │ │
│  │  ┌──────────────────────────────────┐ │ │
│  │  │ 🏆 Achievement Hunter [1/2] ▓░   │ │ │
│  │  │ Unlock 2 new achievements        │ │ │
│  │  │                                  │ │ │
│  │  │ Rewards:                         │ │ │
│  │  │ • +300 XP                        │ │ │
│  │  │ • +150 🪙                        │ │ │
│  │  │ • +2 💎                          │ │ │
│  │  │                                  │ │ │
│  │  │ Progress: 50% ██████░░░░         │ │ │
│  │  │ 🎯 1 more to go!                 │ │ │
│  │  └──────────────────────────────────┘ │ │
│  └────────────────────────────────────────┘ │
│                                              │
│  ┌────────────────────────────────────────┐ │
│  │  🚀 Quick Actions                      │ │
│  │  ═══════════════════════════════════   │ │
│  │                                        │ │
│  │  ┌──────────────────────────────────┐ │ │
│  │  │  ▶ Start Reading                 │ │ │
│  │  │                                  │ │ │
│  │  │  Generate a new story and        │ │ │
│  │  │  practice your language skills   │ │ │
│  │  └──────────────────────────────────┘ │ │
│  │  [Large, prominent button - gradient] │ │
│  │                                        │ │
│  │  ┌──────────┬──────────┬────────────┐ │ │
│  │  │🏪 Shop   │🏆 Achv   │📊 Progress │ │ │
│  │  │Visit     │View      │Check       │ │ │
│  │  │Store     │Badges    │Stats       │ │ │
│  │  └──────────┴──────────┴────────────┘ │ │
│  └────────────────────────────────────────┘ │
│                                              │
│  ┌────────────────────────────────────────┐ │
│  │  🌍 Language Settings                  │ │
│  │  ═══════════════════════════════════   │ │
│  │                                        │ │
│  │  Secondary Language:                   │ │
│  │  ⚪ Korean 🇰🇷    ⚪ Mandarin 🇨🇳      │ │
│  │                                        │ │
│  │  Blend Level: [4]                      │ │
│  │  ├───●────────────────┤               │ │
│  │  0%        50%       100%             │ │
│  │  English   Mix      Secondary         │ │
│  │                                        │ │
│  │  Current: 40% Korean blending          │ │
│  │                                        │ │
│  │  Display Options:                      │ │
│  │  ☑ Show translation hints             │ │
│  │  ☑ Show romanization                  │ │
│  │  ☑ Audio support                      │ │
│  └────────────────────────────────────────┘ │
└──────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────────────────────┐
│  Bottom Navigation (Desktop - visible but less prominent)                              │
│  ┌──────┬──────┬──────┬──────┬──────┬──────┐                                          │
│  │ 🏠   │ 📖   │ 🏆   │ 🏪   │ 📊   │ 👤   │                                          │
│  │ Home │ Read │ Achv │ Shop │Stats │ Prof │                                          │
│  │ ●    │      │      │      │      │      │  (● = active page)                      │
│  └──────┴──────┴──────┴──────┴──────┴──────┘                                          │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## Mobile Layout (<768px)

```
┌─────────────────────────────────────────────┐
│  Header                                     │
│  ┌───────────────────────────────────────┐ │
│  │ 🎓 LearnKorean                        │ │
│  │                                       │ │
│  │ 🪙 1,250   💎 15   🔥 7 Days          │ │
│  └───────────────────────────────────────┘ │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  Welcome Section                            │
│  ┌───────────────────────────────────────┐ │
│  │ 🎓 Welcome back, Renzo!               │ │
│  │    Ready to learn?                    │ │
│  │                                       │ │
│  │ Level 12  ▲ +2                        │ │
│  │ ████████████░░░░  2,450/3,000        │ │
│  │                                       │ │
│  │ 🔥 7 Day Streak                       │ │
│  └───────────────────────────────────────┘ │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  Stats Grid (2x2)                           │
│  ┌──────────────┬──────────────────────┐   │
│  │ 📚 Total XP  │  📈 Level            │   │
│  │   2,450      │   Level 12           │   │
│  │ ▲ +150       │ 82% ████████░░       │   │
│  ├──────────────┼──────────────────────┤   │
│  │ 🎯 Streak    │  🏆 Achievements     │   │
│  │   7 days     │    8 / 24            │   │
│  │ 🔥 Best: 12  │  33% Complete        │   │
│  └──────────────┴──────────────────────┘   │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  🐾 Your Learning Buddy                     │
│  ┌───────────────────────────────────────┐ │
│  │                                       │ │
│  │        😊 Happy                       │ │
│  │                                       │ │
│  │     [Pet Image Here]                  │ │
│  │                                       │ │
│  │    Flutterpuff • Level 12             │ │
│  │                                       │ │
│  └───────────────────────────────────────┘ │
│                                             │
│  ❤️  Happiness [85%] ████████░             │
│  🍖 Hunger    [30%] ███░░░░░░              │
│  ⚡ Energy    [60%] ██████░░░░             │
│                                             │
│  ┌───────┬───────┬───────────────────┐     │
│  │ Feed  │ Play  │ Super Boost       │     │
│  │ 10 🪙 │ 1 💎  │ 5 💎              │     │
│  └───────┴───────┴───────────────────┘     │
│                                             │
│  Next Evolution: Level 15 → Phoenixel       │
│  ████████░░░  [12/15]                       │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  🎯 Daily Quests (Collapsible)              │
│  ═════════════════════════════  [▼]         │
│  Resets in 18:45:23                         │
│                                             │
│  ┌───────────────────────────────────────┐ │
│  │ 📖 Daily Reader      [2/3] ▓▓░        │ │
│  │ Complete 3 passages                   │ │
│  │                                       │ │
│  │ +100 XP  +50 🪙                       │ │
│  │ Progress: 66% ████████░░░             │ │
│  └───────────────────────────────────────┘ │
│                                             │
│  ┌───────────────────────────────────────┐ │
│  │ 🎯 Quiz Master       [1/2] ▓░         │ │
│  │ Score 80%+ on 2 quizzes               │ │
│  │                                       │ │
│  │ +150 XP  +75 🪙  +1 💎                │ │
│  │ Progress: 50% ██████░░░░              │ │
│  └───────────────────────────────────────┘ │
│                                             │
│  ┌───────────────────────────────────────┐ │
│  │ 🔥 Streak Keeper     [1/1] ✓          │ │
│  │ Maintain daily streak                 │ │
│  │                                       │ │
│  │ +50 XP  +25 🪙                        │ │
│  │ [Claim Rewards] ✨                    │ │
│  └───────────────────────────────────────┘ │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  📅 Weekly Quests (Collapsible)             │
│  ═════════════════════════════  [▼]         │
│  Resets in 5 days                           │
│                                             │
│  ┌───────────────────────────────────────┐ │
│  │ 🌟 Rising Star   [650/1000] ▓▓▓░      │ │
│  │ Earn 1000 XP this week                │ │
│  │                                       │ │
│  │ +500 XP  +200 🪙  +3 💎               │ │
│  │ 🎯 350 XP to go!                      │ │
│  └───────────────────────────────────────┘ │
│                                             │
│  ┌───────────────────────────────────────┐ │
│  │ 🏆 Achievement Hunter [1/2] ▓░        │ │
│  │ Unlock 2 achievements                 │ │
│  │                                       │ │
│  │ +300 XP  +150 🪙  +2 💎               │ │
│  │ 🎯 1 more to go!                      │ │
│  └───────────────────────────────────────┘ │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  🚀 Quick Actions                           │
│  ═══════════════════════════════            │
│                                             │
│  ┌───────────────────────────────────────┐ │
│  │     ▶ Start Reading                   │ │
│  │                                       │ │
│  │  Generate a story and practice!       │ │
│  └───────────────────────────────────────┘ │
│  [Full-width gradient button]              │
│                                             │
│  ┌──────────┬──────────┬─────────────┐    │
│  │ 🏪 Shop  │ 🏆 Achv  │ 📊 Progress │    │
│  └──────────┴──────────┴─────────────┘    │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  🏅 Leaderboard (Collapsed by default)      │
│  ═════════════════════════════  [▶]         │
│  Your Rank: #4                              │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  🌍 Language Settings (Collapsed)           │
│  ═════════════════════════════  [▶]         │
│  Currently: 40% Korean                      │
└─────────────────────────────────────────────┘

[BOTTOM PADDING: 80px for nav]

┌─────────────────────────────────────────────┐
│  Bottom Navigation (Fixed)                  │
│  ┌──────┬──────┬──────┬──────┬──────┬───┐  │
│  │  🏠  │  📖  │  🏆  │  🏪  │  📊  │ 👤│  │
│  │ Home │ Read │ Achv │ Shop │Stats │Pro│  │
│  │  ●   │      │      │      │      │   │  │
│  └──────┴──────┴──────┴──────┴──────┴───┘  │
└─────────────────────────────────────────────┘
```

---

## Component Breakdown

### **Header**
- Logo (left)
- Currency display (right): Coins, Gems, Streak
- Responsive: Stack on mobile

### **Welcome Section**
- Greeting with user name
- Level badge with today's gain
- XP progress bar to next level
- Streak indicator

### **Stats Grid**
- 4 cards: Total XP, Level, Streak, Achievements
- Show daily/weekly change
- Responsive: 2x2 on mobile, 1x4 on desktop

### **Virtual Pet Widget**
- Pet image (emotion-based)
- Pet name and level
- Stats: Happiness, Hunger, Energy (progress bars)
- Action buttons: Feed, Play, Boost
- Evolution progress
- Tip message

### **Daily Quests**
- 3 quest cards (scrollable if needed)
- Each card shows:
  - Icon and title
  - Description
  - Progress bar with ratio (e.g., 2/3)
  - Rewards (XP, coins, gems)
  - Claim button when complete
- Reset timer

### **Weekly Quests**
- 2 quest cards (larger goals)
- Same structure as daily but with bigger rewards
- Reset timer (days remaining)

### **Quick Actions**
- Prominent "Start Reading" button (gradient, large)
- Secondary actions: Shop, Achievements, Progress

### **Leaderboard**
- Top 5 users
- Highlight current user
- Show rank and XP gap to next rank

### **Language Settings**
- Language toggle (Korean/Mandarin)
- Blend level slider (0-10)
- Display options checkboxes
- Collapsed on mobile by default

---

## Interactions

### **Pet Actions**
- **Click Pet Image**: Opens pet modal with detailed stats and history
- **Feed Button**: Deducts 10 coins, reduces hunger, shows animation
- **Play Button**: Deducts 1 gem, increases happiness, mini-game animation
- **Boost Button**: Deducts 5 gems, sets all stats to 100%, celebration

### **Quest Cards**
- **Click Card**: Expands to show detailed requirements and tips
- **Claim Rewards**: Only enabled when quest complete
  - Shows +XP/+coins/+gems floating animation
  - Pet celebrates
  - Updates currency display
  - Confetti if significant reward

### **Language Slider**
- **Drag Slider**: Updates blend level in real-time
- **Shows Preview**: Small example text below slider

### **Quick Actions**
- **Start Reading**: Navigates to Reading page
- **Shop/Achv/Progress**: Navigates to respective pages

---

## States & Animations

### **Loading State**
```
┌─────────────────────────────┐
│  🎓 LearnKorean             │
│                             │
│  Loading your progress...   │
│  ⏳                         │
└─────────────────────────────┘
```

### **First-Time User**
```
┌─────────────────────────────┐
│  👋 Welcome to LearnKorean! │
│                             │
│  Let's set up your buddy!   │
│                             │
│  Choose your evolution:     │
│  ⚪ Knowledge (🎓)          │
│  ⚪ Coolness (😎)           │
│  ⚪ Culture (🌍)            │
│                             │
│  [Get Started]              │
└─────────────────────────────┘
```

### **Level Up Animation**
```
┌───────────────────────────────┐
│                               │
│     ✨ Level Up! ✨           │
│                               │
│   You reached Level 13!       │
│                               │
│   Rewards:                    │
│   • +100 XP                   │
│   • +50 🪙                    │
│                               │
│   [Awesome!]                  │
│                               │
└───────────────────────────────┘
[Confetti animation]
[Pet shows "Excited" emotion]
```

### **Quest Complete**
```
[Toast notification - top right]
┌─────────────────────────────┐
│ ✓ Quest Complete!           │
│ Daily Reader                │
│                             │
│ +100 XP  +50 🪙             │
└─────────────────────────────┘
[Auto-dismisses after 3 seconds]
[Pet bounces with "Happy" emotion]
```

### **Pet Needs Attention**
```
[Badge on pet widget]
┌─────────────────────────────┐
│ 🐾 Your Learning Buddy  ⚠️  │
│                             │
│ [Pet image - "Hungry"]      │
│                             │
│ Your buddy is hungry!       │
│ Feed them to restore energy.│
└─────────────────────────────┘
[Pet widget border turns orange/red]
```

---

## Accessibility

- **Keyboard Navigation**: Tab through quests, pet actions, buttons
- **Screen Reader**: Announce quest progress, XP gains, pet emotions
- **High Contrast**: Pet emotions distinguishable without color
- **Focus Indicators**: Clear blue outline on focused elements
- **ARIA Labels**: All interactive elements properly labeled

---

## Performance

- **Lazy Load**: Pet images only load when visible
- **Debounce**: Language slider updates after 300ms of inactivity
- **Memoize**: Quest list only re-renders when quest data changes
- **LocalStorage**: Save state every 5 seconds (debounced)

---

## Notes

- Dashboard should feel **welcoming and motivating**
- Pet is the **emotional anchor** - always prominent
- Quests provide **clear daily structure**
- Quick actions encourage **immediate engagement** ("Start Reading" CTA)
- Stats show **progress over time** (today's gain, trend arrows)
- Language settings **accessible but not overwhelming** (collapsed on mobile)
