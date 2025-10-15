# Reading Page Wireframe

## Layout Overview

The Reading page is where users generate stories, read with language blending, and take quizzes. This is the core learning experience.

---

## Desktop Layout (>1024px)

### **State 1: Story Generation (Before Generate)**

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│  Header                                                                                │
│  ┌──────────────────┬─────────────────────────────────────────┬─────────────────────┐ │
│  │ 🎓 LearnKorean   │                                         │  🪙 1,250   💎 15   │ │
│  │ ← Back to Home   │                                         │  🔥 7 Days          │ │
│  └──────────────────┴─────────────────────────────────────────┴─────────────────────┘ │
└────────────────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────┬─────────────────────────────────────────┐
│  Left Panel (Settings - 25%)                 │  Center Panel (65%)                     │
│                                              │                                         │
│  ┌────────────────────────────────────────┐ │  ┌────────────────────────────────────┐ │
│  │  📝 Story Settings                     │ │  │  ✨ Create Your Story              │ │
│  │  ═══════════════════════════════════   │ │  │                                    │ │
│  │                                        │ │  │  ┌──────────────────────────────┐ │ │
│  │  Story Theme:                          │ │  │  │ Story Prompt              🎤 │ │ │
│  │  ┌──────────────────────────────────┐ │ │  │  │                              │ │ │
│  │  │ A fun adventure about Pikachu    │ │ │  │  │ A fun adventure about        │ │ │
│  │  │ playing basketball...            │ │ │  │  │ Pikachu playing basketball   │ │ │
│  │  │                              🎤  │ │ │  │  │ with Team Rocket...          │ │ │
│  │  └──────────────────────────────────┘ │ │  │  │                              │ │ │
│  │  [Click 🎤 to speak your idea]       │ │  │  └──────────────────────────────┘ │ │
│  │                                        │ │  │                                    │ │
│  │  Length: 500 words                     │ │  │  Type your story idea or click     │ │
│  │  ├────────●──────────┤                 │ │  │  the microphone to speak it!       │ │
│  │  250        1000     2000               │ │  │                                    │ │
│  │                                        │ │  │  ┌──────────────────────────────┐ │ │
│  │  Grade Level:                          │ │  │  │  Preview                     │ │ │
│  │  ⚪ 3rd  ● 4th  ⚪ 5th  ⚪ 6th          │ │  │  │                              │ │ │
│  │                                        │ │  │  │  Your story will be about    │ │ │
│  │  Humor Level:                          │ │  │  │  500 words, suitable for     │ │ │
│  │  ☐ None  ☐ Light  ● Moderate  ☐ Heavy │ │  │  │  4th graders, with moderate  │ │ │
│  │                                        │ │  │  │  humor, and 40% Korean       │ │ │
│  │  Visual Theme:                         │ │  │  │  blending.                   │ │ │
│  │  ⚪ Space 🚀                           │ │  │  │                              │ │ │
│  │  ⚪ Jungle 🌴                          │ │  │  └──────────────────────────────┘ │ │
│  │  ● Deep Sea 🌊                         │ │  │                                    │ │
│  │  ⚪ Minecraft ⛏️                       │ │  │  ┌──────────────────────────────┐ │ │
│  │  ⚪ Tron 💠                            │ │  │  │  🌟 Generate Story           │ │ │
│  │                                        │ │  │  └──────────────────────────────┘ │ │
│  └────────────────────────────────────────┘ │  │  [Large gradient button]           │ │
│                                              │  │                                    │ │
│  ┌────────────────────────────────────────┐ │  └────────────────────────────────────┘ │
│  │  🌍 Language Settings                  │ │                                         │
│  │  ═══════════════════════════════════   │ │  Right Panel (10%) - Empty for now      │
│  │                                        │ │                                         │
│  │  Secondary Language:                   │ │                                         │
│  │  ● Korean 🇰🇷    ⚪ Mandarin 🇨🇳      │ │                                         │
│  │                                        │ │                                         │
│  │  Blend Level: [4]                      │ │                                         │
│  │  ├───●────────────────┤               │ │                                         │
│  │  0%        50%       100%             │ │                                         │
│  │  English   Mix      Korean            │ │                                         │
│  │                                        │ │                                         │
│  │  Current: 40% Korean blending          │ │                                         │
│  │                                        │ │                                         │
│  │  Example Preview:                      │ │                                         │
│  │  "The brave 우주비행사 (astronaut)    │ │                                         │
│  │   flew through 우주 (space)."         │ │                                         │
│  │                                        │ │                                         │
│  │  Display Options:                      │ │                                         │
│  │  ☑ Show translation hints             │ │                                         │
│  │  ☑ Show romanization (u-ju-bi-haeng-sa)│ │                                        │
│  │  ☑ Audio support (read aloud)         │ │                                         │
│  │  ☐ Auto-play on generate              │ │                                         │
│  └────────────────────────────────────────┘ │                                         │
│                                              │                                         │
│  ┌────────────────────────────────────────┐ │                                         │
│  │  🎯 Quiz Settings                      │ │                                         │
│  │  ═══════════════════════════════════   │ │                                         │
│  │                                        │ │                                         │
│  │  Custom Question Focus (Optional):     │ │                                         │
│  │  ┌──────────────────────────────────┐ │ │                                         │
│  │  │ Focus on character development   │ │ │                                         │
│  │  │ and problem-solving skills       │ │ │                                         │
│  │  └──────────────────────────────────┘ │ │                                         │
│  │  (Leave blank for default questions)   │ │                                         │
│  │                                        │ │                                         │
│  │  Difficulty:                           │ │                                         │
│  │  [  Intermediate  ▼ ]                  │ │                                         │
│  │                                        │ │                                         │
│  │  Question Mix:                         │ │                                         │
│  │  • 3 Multiple Choice                   │ │                                         │
│  │  • 2 Fill-in-Blank                     │ │                                         │
│  │                                        │ │                                         │
│  │  Question Types:                       │ │                                         │
│  │  ☑ Comprehension                       │ │                                         │
│  │  ☑ Inference                           │ │                                         │
│  │  ☑ Plot Analysis                       │ │                                         │
│  │  ☑ Vocabulary                          │ │                                         │
│  │  ☐ Prediction                          │ │                                         │
│  └────────────────────────────────────────┘ │                                         │
│                                              │                                         │
│  ┌────────────────────────────────────────┐ │                                         │
│  │  📚 Custom Vocabulary (Optional)       │ │                                         │
│  │  ═══════════════════════════════════   │ │                                         │
│  │                                        │ │                                         │
│  │  ┌──────────────────────────────────┐ │ │                                         │
│  │  │ basketball, teamwork, victory,   │ │ │                                         │
│  │  │ strategy, champion                │ │ │                                         │
│  │  └──────────────────────────────────┘ │ │                                         │
│  │  (Comma-separated words to include)    │ │                                         │
│  └────────────────────────────────────────┘ │                                         │
└──────────────────────────────────────────────┴─────────────────────────────────────────┘
```

---

### **State 2: Generating Story (Loading)**

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│  Header                                                                                │
│  ┌──────────────────┬─────────────────────────────────────────┬─────────────────────┐ │
│  │ 🎓 LearnKorean   │                                         │  🪙 1,250   💎 15   │ │
│  │ ← Back to Home   │                                         │  🔥 7 Days          │ │
│  └──────────────────┴─────────────────────────────────────────┴─────────────────────┘ │
└────────────────────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                                                                        │
│                                  Center Panel                                          │
│                                                                                        │
│                          ┌──────────────────────────────┐                             │
│                          │                              │                             │
│                          │   ✨ Generating Your Story   │                             │
│                          │                              │                             │
│                          │        [Spinner/Loader]      │                             │
│                          │                              │                             │
│                          │   Creating a 4th grade story │                             │
│                          │   with 40% Korean blending   │                             │
│                          │                              │                             │
│                          │   This may take 10-15 sec... │                             │
│                          │                              │                             │
│                          └──────────────────────────────┘                             │
│                                                                                        │
│                          [Pet shows "Excited" emotion]                                 │
│                                                                                        │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

### **State 3: Reading Story (After Generate)**

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│  Header                                                                                │
│  ┌──────────────────┬─────────────────────────────────────────┬─────────────────────┐ │
│  │ 🎓 LearnKorean   │  Pikachu's Basketball Adventure         │  🪙 1,250   💎 15   │ │
│  │ ← Back           │  500 words • 4th Grade • 40% Korean     │  🔥 7 Days          │ │
│  └──────────────────┴─────────────────────────────────────────┴─────────────────────┘ │
└────────────────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────┬─────────────────────────────────────────┐
│  Left Panel (Settings - Collapsed, 5%)       │  Center Panel (Story - 65%)             │
│                                              │                                         │
│  [⚙️ Settings]                               │  ┌────────────────────────────────────┐ │
│  [Collapse/expand toggle]                    │  │  📖 Pikachu's Basketball Adventure │ │
│                                              │  │  ═══════════════════════════════    │ │
│                                              │  │                                    │ │
│                                              │  │  Controls:                         │ │
│                                              │  │  ┌──────┬──────┬──────┬─────────┐ │ │
│                                              │  │  │ 🎧   │ ▶️   │ ⏸️   │ 📊 1.0x │ │ │
│                                              │  │  │ Read │ Play │Pause │ Speed   │ │ │
│                                              │  │  └──────┴──────┴──────┴─────────┘ │ │
│                                              │  │                                    │ │
│                                              │  │  Display:                          │ │
│                                              │  │  ☑ Show Hints  ☑ Romanization     │ │
│                                              │  │                                    │ │
│                                              │  │  Progress: ████████░░░ 80%        │ │
│                                              │  │  ┌──────────────────────────────┐ │ │
│                                              │  │  │                              │ │ │
│                                              │  │  │  It was a 맑은 (sunny)       │ │ │
│                                              │  │  │  day when Pikachu and        │ │ │
│                                              │  │  │  friends arrived at the      │ │ │
│                                              │  │  │  체육관 (gymnasium). Team     │ │ │
│                                              │  │  │  Rocket was already          │ │ │
│                                              │  │  │  practicing their 슛         │ │ │
│                                              │  │  │  (shots), looking very       │ │ │
│                                              │  │  │  confident.                  │ │ │
│                                              │  │  │                              │ │ │
│                                              │  │  │  "We'll 이기다 (win) easily!"│ │ │
│                                              │  │  │  shouted Jessie, dribbling   │ │ │
│                                              │  │  │  the 농구공 (basketball).    │ │ │
│                                              │  │  │  But Pikachu had a 계획      │ │ │
│                                              │  │  │  (plan).                     │ │ │
│                                              │  │  │                              │ │ │
│                                              │  │  │  [Story continues...]        │ │ │
│                                              │  │  │  [Scrollable content]        │ │ │
│                                              │  │  │                              │ │ │
│                                              │  │  └──────────────────────────────┘ │ │
│                                              │  │                                    │ │
│                                              │  │  Word Count: 500 words read        │ │
│                                              │  │  Reading Time: ~3 min remaining    │ │
│                                              │  │                                    │ │
│                                              │  │  ┌──────────────────────────────┐ │ │
│                                              │  │  │  ✅ Finished Reading?        │ │ │
│                                              │  │  │  [Take Quiz] →               │ │ │
│                                              │  │  └──────────────────────────────┘ │ │
│                                              │  └────────────────────────────────────┘ │
│                                              │                                         │
└──────────────────────────────────────────────┼─────────────────────────────────────────┤
                                               │  Right Panel (Mini Pet & Stats - 30%)   │
                                               │                                         │
                                               │  ┌────────────────────────────────────┐ │
                                               │  │  🐾 Learning Buddy                 │ │
                                               │  │                                    │ │
                                               │  │  ┌──────────────────────────────┐ │ │
                                               │  │  │                              │ │ │
                                               │  │  │     😊 Reading with you!     │ │ │
                                               │  │  │                              │ │ │
                                               │  │  │   [Mini Pet Image]           │ │ │
                                               │  │  │                              │ │ │
                                               │  │  │   Flutterpuff                │ │ │
                                               │  │  │                              │ │ │
                                               │  │  └──────────────────────────────┘ │ │
                                               │  │                                    │ │
                                               │  │  ❤️ [85%] ████████░              │ │
                                               │  │  🍖 [30%] ███░░░░░░               │ │
                                               │  │                                    │ │
                                               │  │  💬 "Keep reading! You're doing    │ │
                                               │  │      great!"                       │ │
                                               │  └────────────────────────────────────┘ │
                                               │                                         │
                                               │  ┌────────────────────────────────────┐ │
                                               │  │  📊 Reading Progress               │ │
                                               │  │                                    │ │
                                               │  │  Words Read: 400 / 500             │ │
                                               │  │  █████████████░░  80%              │ │
                                               │  │                                    │ │
                                               │  │  Korean Words Encountered: 23      │ │
                                               │  │  • 맑은 (sunny)                    │ │
                                               │  │  • 체육관 (gymnasium)              │ │
                                               │  │  • 슛 (shot)                       │ │
                                               │  │  • 이기다 (win)                    │ │
                                               │  │  • [View All] ▼                    │ │
                                               │  │                                    │ │
                                               │  │  Estimated XP: +50                 │ │
                                               │  │  Estimated Coins: +25              │ │
                                               │  └────────────────────────────────────┘ │
                                               │                                         │
                                               │  ┌────────────────────────────────────┐ │
                                               │  │  💡 Learning Tips                  │ │
                                               │  │                                    │ │
                                               │  │  Try clicking on Korean words      │ │
                                               │  │  to hear pronunciation!            │ │
                                               │  │                                    │ │
                                               │  │  Toggle romanization to practice   │ │
                                               │  │  reading Hangul.                   │ │
                                               │  └────────────────────────────────────┘ │
                                               └─────────────────────────────────────────┘
```

---

### **State 4: Taking Quiz (After Reading)**

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│  Header                                                                                │
│  ┌──────────────────┬─────────────────────────────────────────┬─────────────────────┐ │
│  │ 🎓 LearnKorean   │  Quiz: Pikachu's Basketball Adventure   │  🪙 1,250   💎 15   │ │
│  │ ← Back to Story  │  Question 2 of 5                        │  🔥 7 Days          │ │
│  └──────────────────┴─────────────────────────────────────────┴─────────────────────┘ │
└────────────────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────┬─────────────────────────────────────────┐
│  Center Panel (Quiz - 70%)                   │  Right Panel (Pet & Progress - 30%)     │
│                                              │                                         │
│  ┌────────────────────────────────────────┐ │  ┌────────────────────────────────────┐ │
│  │  Quiz Progress                         │ │  │  🐾 Learning Buddy                 │ │
│  │  ████░░░░░  [2/5]                      │ │  │                                    │ │
│  │                                        │ │  │  ┌──────────────────────────────┐ │ │
│  │  ⚡ Combo Streak: 2x  (+20 XP bonus)   │ │  │  │   😊 You've got this!        │ │ │
│  └────────────────────────────────────────┘ │  │  │                              │ │ │
│                                              │  │  │   [Mini Pet Image]           │ │ │
│  ┌────────────────────────────────────────┐ │  │  │                              │ │ │
│  │  Question 2: Comprehension             │ │  │  │   Flutterpuff                │ │ │
│  │                                        │ │  │  └──────────────────────────────┘ │ │
│  │  Why did Pikachu have a plan?          │ │  │                                    │ │
│  │                                        │ │  │  ❤️ [90%] █████████░  ↑            │ │
│  │  ⚪ A. Because he was hungry           │ │  │  🍖 [30%] ███░░░░░░                │ │
│  │  ⚪ B. To win the game                 │ │  │                                    │ │
│  │  ⚪ C. Team Rocket looked confident    │ │  │  💬 "Great job on Q1! Keep going!" │ │
│  │  ⚪ D. He wanted to practice           │ │  └────────────────────────────────────┘ │
│  │                                        │ │                                         │
│  │  [Submit Answer]                       │ │  ┌────────────────────────────────────┐ │
│  └────────────────────────────────────────┘ │  │  📊 Quiz Stats                     │ │
│                                              │  │                                    │ │
│  ┌────────────────────────────────────────┐ │  │  Questions Answered: 1 / 5         │ │
│  │  Previous Answer: ✓                    │ │  │  Correct: 1 (100%)                 │ │
│  │                                        │ │  │                                    │ │
│  │  Question 1: What did Jessie say?      │ │  │  Current XP: +10                   │ │
│  │  Your answer: "We'll win easily!"      │ │  │  Potential Bonus: +50 (perfect)    │ │
│  │                                        │ │  │                                    │ │
│  │  ✓ Correct! +10 XP, +5 🪙              │ │  │  Combo Multiplier: 2x              │ │
│  │                                        │ │  │  [████░░░░░░] 3x at 3 correct      │ │
│  └────────────────────────────────────────┘ │  └────────────────────────────────────┘ │
│                                              │                                         │
│                                              │  ┌────────────────────────────────────┐ │
│                                              │  │  💡 Hint Available                 │ │
│                                              │  │                                    │ │
│                                              │  │  Need help?                        │ │
│                                              │  │  [Use Hint] (-5 coins)             │ │
│                                              │  │                                    │ │
│                                              │  │  Hints used: 0 / 3                 │ │
│                                              │  └────────────────────────────────────┘ │
└──────────────────────────────────────────────┴─────────────────────────────────────────┘
```

---

### **State 5: Quiz Complete**

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                  Quiz Results                                          │
│                                                                                        │
│                          ┌──────────────────────────────┐                             │
│                          │                              │                             │
│                          │      🎉 Great Job! 🎉        │                             │
│                          │                              │                             │
│                          │   Quiz Complete!             │                             │
│                          │                              │                             │
│                          │   Score: 4 / 5 (80%)         │                             │
│                          │   ████████░░                 │                             │
│                          │                              │                             │
│                          │   Rewards Earned:            │                             │
│                          │   • +40 XP (questions)       │                             │
│                          │   • +20 coins                │                             │
│                          │   • Combo bonus: +10 XP      │                             │
│                          │   ───────────────────        │                             │
│                          │   Total: +50 XP, +20 🪙      │                             │
│                          │                              │                             │
│                          │   [Review Answers]           │                             │
│                          │   [Generate New Story]       │                             │
│                          │   [Back to Dashboard]        │                             │
│                          │                              │                             │
│                          └──────────────────────────────┘                             │
│                                                                                        │
│                          [Pet shows "Happy" emotion]                                   │
│                          [Confetti animation]                                          │
│                                                                                        │
└────────────────────────────────────────────────────────────────────────────────────────┘

[Floating XP indicators: +50 XP, +20 🪙]
[Pet happiness increases to 95%]
[Quest progress updates: "Quiz Master" 2/2 ✓]
```

---

## Mobile Layout (<768px)

### **State 1: Story Generation (Mobile)**

```
┌─────────────────────────────────────────────┐
│  Header                                     │
│  ┌───────────────────────────────────────┐ │
│  │ ← 🎓 LearnKorean                      │ │
│  │                                       │ │
│  │ 🪙 1,250   💎 15   🔥 7 Days          │ │
│  └───────────────────────────────────────┘ │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  ✨ Create Your Story                       │
│  ═══════════════════════════════            │
│                                             │
│  ┌───────────────────────────────────────┐ │
│  │ Story Prompt                      🎤  │ │
│  │                                       │ │
│  │ A fun adventure about Pikachu         │ │
│  │ playing basketball...                 │ │
│  │                                       │ │
│  └───────────────────────────────────────┘ │
│  [Tap 🎤 to speak]                          │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  ⚙️ Settings (Collapsible) [▼]              │
│  ═══════════════════════════════            │
│                                             │
│  Length: 500 words                          │
│  ├────●──────────┤                          │
│  250       1000    2000                     │
│                                             │
│  Grade Level:                               │
│  [    4th Grade    ▼ ]                      │
│                                             │
│  Humor:                                     │
│  [    Moderate     ▼ ]                      │
│                                             │
│  Theme:                                     │
│  [    Deep Sea 🌊  ▼ ]                      │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  🌍 Language (Collapsible) [▼]              │
│  ═══════════════════════════════            │
│                                             │
│  ● Korean 🇰🇷   ⚪ Mandarin 🇨🇳            │
│                                             │
│  Blend: [4]                                 │
│  ├───●────────┤                             │
│  0%   50%   100%                            │
│                                             │
│  ☑ Show hints                               │
│  ☑ Romanization                             │
│  ☑ Audio                                    │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  🎯 Quiz (Collapsible) [▼]                  │
│  ═══════════════════════════════            │
│                                             │
│  Difficulty: [Intermediate ▼]               │
│                                             │
│  Questions: 3 MC, 2 Fill-in                 │
│                                             │
│  ☑ Comprehension ☑ Inference                │
│  ☑ Plot  ☑ Vocabulary                       │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  ┌───────────────────────────────────────┐ │
│  │   🌟 Generate Story                   │ │
│  └───────────────────────────────────────┘ │
│  [Full-width gradient button]              │
└─────────────────────────────────────────────┘

[BOTTOM PADDING: 80px for nav]
```

---

### **State 3: Reading Story (Mobile)**

```
┌─────────────────────────────────────────────┐
│  Header                                     │
│  ┌───────────────────────────────────────┐ │
│  │ ← Pikachu's Basketball                │ │
│  │                                       │ │
│  │ 🪙 1,250   💎 15   🔥 7 Days          │ │
│  └───────────────────────────────────────┘ │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  📖 Story                                   │
│  ═══════════════════════════════            │
│                                             │
│  [⚙️]  ☑ Hints  ☑ Romanization             │
│                                             │
│  ┌──────┬──────┬──────┬───────┐            │
│  │ 🎧   │ ▶️   │ ⏸️   │ 1.0x  │            │
│  │ Read │ Play │Pause │ Speed │            │
│  └──────┴──────┴──────┴───────┘            │
│                                             │
│  Progress: ████████░░ 80%                   │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  Story Text (Scrollable)                    │
│  ┌───────────────────────────────────────┐ │
│  │                                       │ │
│  │ It was a 맑은 (sunny) day when        │ │
│  │ Pikachu and friends arrived at        │ │
│  │ the 체육관 (gymnasium). Team          │ │
│  │ Rocket was already practicing         │ │
│  │ their 슛 (shots), looking very        │ │
│  │ confident.                            │ │
│  │                                       │ │
│  │ "We'll 이기다 (win) easily!"          │ │
│  │ shouted Jessie, dribbling the         │ │
│  │ 농구공 (basketball). But Pikachu      │ │
│  │ had a 계획 (plan).                    │ │
│  │                                       │ │
│  │ [Continues scrolling...]              │ │
│  │                                       │ │
│  └───────────────────────────────────────┘ │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  🐾 Mini Pet (Floating bottom-right)        │
│  ┌─────────────┐                            │
│  │ 😊 Happy    │                            │
│  │ [Pet Img]   │                            │
│  │ Flutterpuff │                            │
│  └─────────────┘                            │
│  [Tap to expand stats]                      │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  📊 Progress (Collapsible) [▼]              │
│  ═══════════════════════════════            │
│                                             │
│  Words Read: 400 / 500                      │
│  Korean Words: 23                           │
│  Estimated: +50 XP, +25 🪙                  │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  ┌───────────────────────────────────────┐ │
│  │   ✅ Take Quiz →                      │ │
│  └───────────────────────────────────────┘ │
│  [Full-width button at end of story]       │
└─────────────────────────────────────────────┘

[BOTTOM PADDING: 80px for nav]
```

---

### **State 4: Quiz (Mobile)**

```
┌─────────────────────────────────────────────┐
│  ← Quiz: Question 2/5                       │
│  🪙 1,250   💎 15                           │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  Progress: ████░░░░░ [2/5]                  │
│  ⚡ Combo: 2x (+20 XP)                      │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  Q2: Why did Pikachu have a plan?           │
│                                             │
│  ⚪ A. Because he was hungry                │
│  ⚪ B. To win the game                      │
│  ⚪ C. Team Rocket looked confident         │
│  ⚪ D. He wanted to practice                │
│                                             │
│  [Submit Answer]                            │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  Previous: ✓ Correct!                       │
│  Q1: What did Jessie say?                   │
│  +10 XP, +5 🪙                              │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  🐾 Mini Pet (Bottom-right)                 │
│  ┌─────────┐                                │
│  │   😊    │                                │
│  │ [Pet]   │                                │
│  │ Great!  │                                │
│  └─────────┘                                │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  💡 Hint Available                          │
│  [Use Hint] (-5 🪙)                         │
│  Hints: 0/3 used                            │
└─────────────────────────────────────────────┘

[BOTTOM PADDING: 80px for nav]
```

---

## Component Breakdown

### **Story Prompt Input**
- **Text area**: Multi-line input
- **Microphone button**: Speech-to-text
  - Click to record
  - Display waveform while recording
  - Auto-fill text on completion
- **Character counter**: Show remaining chars

### **Story Settings**
- **Length slider**: 250-2000 words
- **Grade level**: Radio buttons (3rd-6th)
- **Humor level**: Checkboxes (None, Light, Moderate, Heavy)
- **Theme**: Radio buttons with emojis
- **Collapsed on mobile** by default

### **Language Controls**
- **Language toggle**: Korean/Mandarin
- **Blend slider**: 0-10 with live preview
- **Display options**: Checkboxes (hints, romanization, audio)
- **Example preview**: Shows sample blended text

### **Quiz Settings**
- **Custom prompt**: Optional text area
- **Difficulty dropdown**: Beginner/Intermediate/Advanced
- **Question mix**: Auto-populated based on settings
- **Question types**: Checkboxes
- **Collapsed on mobile** by default

### **Story Display**
- **Audio controls**: Play/pause/speed
- **Hint toggle**: Show/hide translations inline
- **Romanization toggle**: Show/hide phonetics
- **Scrollable content**: Auto-scroll on audio
- **Word highlighting**: Sync with audio (BONUS feature)
- **Progress bar**: % of story read
- **Finish button**: Appears when scrolled to bottom

### **Quiz Component**
- **Progress bar**: Visual [2/5] indicator
- **Combo counter**: Streak multiplier
- **Question card**: Clear question text
- **Answer options**: Radio buttons (MC) or text input (fill-in)
- **Submit button**: Disabled until answer selected
- **Previous answer**: Show last result (✓ or ✗)
- **Hint button**: Optional (-5 coins)

### **Mini Pet Widget**
- **Pet image**: Current emotion
- **Pet name**: Flutterpuff
- **Stats bars**: Happiness, Hunger (compact)
- **Speech bubble**: Encouragement message
- **Tap to expand**: Full stats modal on mobile

---

## Interactions

### **Speech-to-Text**
1. User clicks 🎤 microphone
2. Browser requests microphone permission
3. Recording starts (show waveform animation)
4. User speaks story idea
5. Recording stops (auto after 30 sec or manual stop)
6. Transcription fills text area
7. User can edit transcribed text

### **Generate Story**
1. User clicks "Generate Story"
2. Validation: Check if prompt is not empty
3. Loading screen appears (10-15 sec)
4. Pet shows "Excited" emotion
5. API call to Azure GPT-5-pro
6. Story generated with Korean/Mandarin blending
7. Transition to reading view
8. Auto-scroll to top

### **Reading with Audio (BONUS)**
1. User clicks "Play" audio
2. TTS begins reading story
3. Current word highlights in yellow
4. Auto-scroll keeps highlighted word visible
5. User can pause/resume
6. Speed control: 0.75x, 1x, 1.25x, 1.5x

### **Language Hint Toggle**
- **Hints ON**: Show inline translations
  - `The brave 우주비행사 (astronaut)`
- **Hints OFF**: Clean text, hover for translation
  - `The brave 우주비행사` → Hover shows "astronaut"

### **Romanization Toggle**
- **Romanization ON**: Show phonetic spelling
  - `우주비행사 (u-ju-bi-haeng-sa)`
- **Romanization OFF**: Only Hangul/Characters
  - `우주비행사`

### **Quiz Answer Submission**
1. User selects answer (radio button)
2. Submit button enabled
3. User clicks Submit
4. Immediate feedback: ✓ or ✗
5. Show correct answer if wrong
6. Show explanation
7. Update combo counter
8. Pet reacts (happy if correct, supportive if wrong)
9. XP/coins awarded
10. Floating +XP animation
11. Auto-advance to next question (2 sec delay)

### **Quiz Hint**
1. User clicks "Use Hint"
2. Deduct 5 coins
3. Show partial answer or context clue
4. Hint count decrements (max 3 per quiz)

---

## States & Animations

### **Generating Story**
```
[Spinner animation]
"Creating your story..."
Pet bounces with excitement
```

### **Reading Progress**
```
[Progress bar fills as user scrolls]
Words read: 400 / 500
Pet shows encouragement at 25%, 50%, 75%, 100%
```

### **Quiz Correct Answer**
```
✓ Correct! +10 XP +5 🪙
[Green checkmark animation]
[Pet shows "Happy" emotion]
[+10 XP floats up]
[Combo counter increases]
```

### **Quiz Incorrect Answer**
```
✗ Incorrect
Correct answer: B. To win the game
Explanation: Pikachu wanted to beat Team Rocket.

[Red X animation]
[Pet shows "Sad" but supportive message]
[Combo counter resets]
```

### **Quiz Complete**
```
[Full-screen modal]
🎉 Great Job! 🎉
Score: 4/5 (80%)

[Confetti animation]
[Pet shows "Love" emotion]
[XP/coins count up animation]
[Daily quest progress updates]
```

---

## Accessibility

- **Keyboard Navigation**: Tab through all inputs, arrow keys for sliders
- **Screen Reader**: Announce story progress, quiz questions, answers
- **Audio Descriptions**: Option to describe images for visually impaired
- **High Contrast**: Korean/Mandarin words distinguishable from English
- **Font Size**: Adjustable text size for readability

---

## Performance

- **Lazy Load Story**: Only render visible paragraphs (virtual scrolling)
- **Debounce Sliders**: Update preview after 300ms
- **Cache Audio**: Save TTS audio to avoid re-generating
- **Optimize Images**: Compress pet images, lazy load
- **Code Splitting**: Load quiz component only when needed

---

## Notes

- Reading page is the **core learning experience**
- Language controls must be **easily accessible** but not intrusive
- Pet provides **emotional support** throughout reading
- Quiz should feel like a **natural continuation** of reading, not a test
- Audio feature (BONUS) enhances **pronunciation learning**
- Progress tracking shows **immediate feedback** (XP, coins, quest progress)
- Mobile layout **collapses settings** to maximize reading area
