# Reading App V2 - Complete Architecture Document

## 🎯 Project Overview

**Purpose**: Gamified multilingual reading comprehension app for elementary students (grades 3-6) with Tamagotchi-style learning companion.

**Core Philosophy**:
- **Language Learning FIRST** - Rich multilingual features are the foundation
- **Gamification SECOND** - Tamagotchi layer adds engagement without distracting from learning
- **Pure Frontend MVP** - No authentication, all state in localStorage, backend integration later

---

## 🏗️ Technology Stack

### **Frontend Framework**
- **React 18** with TypeScript
- **Vite** for build tooling
- **React Router v6** for multi-page navigation
- **Tailwind CSS** for styling
- **Framer Motion** for animations

### **State Management**
- **React Context** for global state (user, pet, gamification)
- **localStorage** for persistence
- **Custom hooks** for business logic

### **AI Models (Azure AI Foundry)**

#### **Image Generation**
- **Primary**: `FLUX-1.1-pro` (Tamagotchi character evolution art)
- **Alternative**: `FLUX.1-Kontext-pro` (context-aware image generation)
- **Fallback**: `gpt-image-1` (general purpose image generation)
- **Use case**: Generate 7 emotions × 7 evolution stages = 49 pet images per track

#### **Chat/Story Generation**
- **Primary**: `gpt-5-pro` (story generation, quiz creation, translation)
- **Use case**:
  - Story content generation with Korean/Mandarin blending
  - Quiz question generation (customizable by teachers)
  - Translation and romanization

#### **Audio (BONUS Feature)**
- **Text-to-Speech**: `gpt-4o-transcribe`
- **Use case**: Read story aloud with word-level highlighting synchronization
- **Architecture**: Design early for future implementation

---

## 📋 Priority Features

### **PRIORITY 1: Language Features (Foundation)**

#### **1.1 Multi-Language Support**
- **Primary Language**: English (100% at level 0)
- **Secondary Languages**:
  - Korean (Hangul with romanization)
  - Mandarin (Simplified Chinese with Pinyin)
- **Blending Scale**: 0-10 slider
  - Level 0: 100% English
  - Level 5: 50% English, 50% Secondary
  - Level 10: 100% Secondary

#### **1.2 Language Display Modes**
- **Inline hints** (default): `The brave 우주비행사 (astronaut) flew...`
- **Show/Hide toggle**:
  - Show hints: Inline translations visible
  - Hide hints: Clean text, hover/click for translation
- **Romanization toggle**:
  - Korean: Hangul + romanization
  - Mandarin: Characters + Pinyin

#### **1.3 Language Features**
- ✅ Phonetics display
- ✅ Romanization (Korean: Revised Romanization, Mandarin: Pinyin)
- ✅ Audio support (text-to-speech for story reading)
- ✅ Visual context (images related to story)
- ✅ Grammar hints (hover/click tooltips)
- ✅ Custom vocabulary injection (teacher-defined words to include)
- ✅ Grade-level content adaptation (3rd-6th grade)

---

### **PRIORITY 2: Story Generation & Reading**

#### **2.1 Story Prompt Input**
```
┌─────────────────────────────────────────────────────────┐
│  Story Prompt                                           │
│  ┌─────────────────────────────────────────────────┐   │
│  │ A fun adventure about Pikachu playing...        │ 🎤│
│  └─────────────────────────────────────────────────┘   │
│  [Type or click 🎤 to speak your story idea]            │
└─────────────────────────────────────────────────────────┘
```

**Features:**
- **Text input**: Free-form prompt (existing)
- **Speech-to-text**: Microphone icon → record → transcribe
  - Use case: Elementary students who type slowly
  - Model: `gpt-4o-transcribe` (or browser Web Speech API)
  - Auto-fill text input after transcription

#### **2.2 Story Settings**
- **Length**: 250-2000 words (slider)
- **Grade Level**: 3rd, 4th, 5th, 6th (dropdown)
- **Humor Level**: None, Light, Moderate, Heavy (dropdown)
- **Theme**: Space, Jungle, Deep Sea, Minecraft, Tron (radio buttons)
- **Language**: Korean or Mandarin (toggle)
- **Language Level**: 0-10 slider
- **Custom Vocabulary**: Text area (comma-separated words)

#### **2.3 Story Display**
- **Blended text**: English + Korean/Mandarin based on level
- **Inline hints**: Toggleable translations
- **Romanization**: Toggleable phonetic spelling
- **Audio playback**: Read story aloud (BONUS)
- **Word highlighting**: Sync audio with text highlighting (BONUS)

---

### **PRIORITY 3: Quiz System**

#### **3.1 Quiz Customization (Teacher Interface)**
```
┌─────────────────────────────────────────────────────────┐
│  Quiz Settings                                          │
│  ┌─────────────────────────────────────────────────┐   │
│  │ Custom Question Prompt (Optional)               │   │
│  │ ┌───────────────────────────────────────────┐   │   │
│  │ │ Focus on character development and...     │   │   │
│  │ └───────────────────────────────────────────┘   │   │
│  │ (Leave blank for default comprehension Qs)  │   │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  Difficulty:  [  Beginner  ▼ ]                         │
│               Beginner, Intermediate, Advanced          │
│                                                         │
│  Question Types:                                        │
│  ☑ Comprehension (What happened in the story?)          │
│  ☑ Inference (Why did the character do that?)           │
│  ☑ Plot Analysis (What was the main problem?)           │
│  ☑ Vocabulary (What does "X" mean in context?)          │
│  ☑ Prediction (What might happen next?)                 │
│                                                         │
│  Number of Questions: 3 Multiple Choice, 2 Fill-in-Blank│
└─────────────────────────────────────────────────────────┘
```

**Features:**
- **Default questions**: Comprehension, inference, plot, vocabulary, prediction
- **Custom prompt**: Teachers can specify curriculum-aligned questions
- **Difficulty levels**:
  - Beginner: Simple recall, direct questions
  - Intermediate: Inference, context clues
  - Advanced: Critical thinking, synthesis
- **Grade-level scaling**: Automatically adjust complexity based on grade
- **Question mix**: Multiple choice + fill-in-blank

#### **3.2 Quiz Mechanics**
- **Combo counter**: Consecutive correct answers → XP multiplier
- **Immediate feedback**: ✓ Correct or ✗ Incorrect with explanation
- **XP rewards**: +10-20 XP per correct answer, +50 bonus for perfect quiz
- **Coin rewards**: +5-10 coins per correct answer
- **Gem rewards**: +1 gem for perfect quiz (100% accuracy)
- **Pet reaction**: Happy on correct, supportive on incorrect

---

### **BONUS FEATURE: Audio Reading with Synchronized Highlighting**

#### **Architecture Design**

**Tech Stack:**
- **TTS Model**: `gpt-4o-transcribe` OR browser Web Speech API
- **Audio Format**: MP3 or WebM (streaming preferred)
- **Highlighting**: CSS classes + JavaScript

**Implementation Plan:**

**Option 1: Word-Level Timestamps (Preferred)**
```typescript
interface AudioTimeline {
  words: Array<{
    word: string;
    start: number; // milliseconds
    end: number;
    element: HTMLElement; // DOM reference
  }>;
  duration: number;
}

// Azure API call
POST /audio/generate-with-timestamps
{
  text: "The brave 우주비행사 flew through space.",
  language: "en-US",
  includeWordTimestamps: true
}

// Response
{
  audioUrl: "blob:...",
  wordTimestamps: [
    { word: "The", start: 0, end: 200 },
    { word: "brave", start: 250, end: 600 },
    ...
  ]
}
```

**Option 2: Sentence-Level (Fallback)**
- Highlight full sentences as they're spoken
- Simpler but less engaging

**UI Component:**
```tsx
<AudioReader
  text={storyContent}
  language={primaryLanguage}
  onWordHighlight={(wordIndex) => highlightWord(wordIndex)}
  onComplete={() => celebratePetReaction()}
/>
```

**Features:**
- Play/pause button
- Speed control (0.75x, 1x, 1.25x, 1.5x)
- Visual progress bar
- Highlight color changes as words are spoken
- Auto-scroll to keep highlighted word visible

**Dependencies:**
- Need to test if Azure TTS provides word-level timestamps
- Fallback: Use browser Speech Synthesis API (limited voices but has `boundary` events)

**MVP Decision**:
- ✅ **Design architecture now** (component structure, API contract)
- ⏸️ **Implement in Phase 2** (after core language features work)

---

## 🐾 Tamagotchi System

### **1. Pet Emotions (7 States)**

| Emotion | Trigger | Visual Cues | Duration |
|---------|---------|-------------|----------|
| **Happy** | Correct quiz answer, feeding, playing | Smiling, bouncing | Until next event |
| **Sad** | Incorrect quiz answer, low happiness | Frowning, drooping | Until interaction |
| **Angry** | Ignored for >3 days, hunger >90% | Red face, steam | Until fed/played |
| **Hungry** | Hunger meter >70% | Begging, stomach growl | Until fed |
| **Excited** | Level up, achievement unlock, special item | Jumping, sparkles | 5 seconds |
| **Bored** | No interaction for 1 day | Yawning, sleeping | Until activity |
| **Love** | Perfect quiz, cultural food gift | Hearts, blushing | 10 seconds |

### **2. Pet Stats**
```typescript
interface PetState {
  // Core stats
  happiness: number; // 0-100
  hunger: number; // 0-100 (increases 1% per hour)
  energy: number; // 0-100 (decreases with activity)

  // Evolution
  evolutionTrack: 'knowledge' | 'coolness' | 'culture' | 'custom';
  evolutionStage: 0 | 1 | 2 | 3 | 4 | 5 | 6; // 7 stages

  // Identity
  name: string; // User-defined or default
  emotion: 'happy' | 'sad' | 'angry' | 'hungry' | 'excited' | 'bored' | 'love';

  // Timestamps
  lastFed: number; // Unix timestamp
  lastPlayed: number;
  lastInteraction: number;

  // Items/accessories
  accessories: string[]; // Unlocked cosmetics
  favoriteFood: string | null; // Cultural food preference
}
```

### **3. Multi-Track Evolution System**

#### **Track 1: Knowledge Evolution**
**Theme**: Academic progression from Pre-K to PhD

| Stage | Name | Level Requirement | Visual Concept | Description |
|-------|------|-------------------|----------------|-------------|
| 0 | Newbie | Level 1-3 | Baby with ABC blocks | Just starting to learn |
| 1 | Kindergartener | Level 4-7 | Child with backpack | Learning basics |
| 2 | Elementary | Level 8-11 | Kid with books | Building foundation |
| 3 | Middle Schooler | Level 12-15 | Teen with notebooks | Developing skills |
| 4 | High Schooler | Level 16-19 | Teen with laptop | Advanced learning |
| 5 | College Graduate | Level 20-24 | Young adult with diploma | Specialized knowledge |
| 6 | PhD Scholar | Level 25+ | Adult with graduation cap | Master of learning |

**Visual Style**: Academic attire (graduation gowns, glasses, books, scrolls)

---

#### **Track 2: Coolness Evolution**
**Theme**: Fashion/style progression from plain to pop star

| Stage | Name | Level Requirement | Visual Concept | Description |
|-------|------|-------------------|----------------|-------------|
| 0 | Plain Buddy | Level 1-3 | No accessories | Simple and humble |
| 1 | Casual Friend | Level 4-7 | T-shirt, cap | Relaxed style |
| 2 | Trendy Pal | Level 8-11 | Hoodie, sneakers | Following trends |
| 3 | Cool Cat | Level 12-15 | Sunglasses, jacket | Stylish vibe |
| 4 | Super Star | Level 16-19 | Stage outfit | Performing artist |
| 5 | Pop Icon | Level 20-24 | Glittering costume | Celebrity status |
| 6 | Legend | Level 25+ | Crown, trophy | Ultimate coolness |

**Visual Style**: Fashion evolution (clothing, accessories, bling)

---

#### **Track 3: Culture Evolution**
**Theme**: Global citizen progression through cultural knowledge

| Stage | Name | Level Requirement | Visual Concept | Description |
|-------|------|-------------------|----------------|-------------|
| 0 | Homebody | Level 1-3 | Local culture | Exploring home |
| 1 | Tourist | Level 4-7 | Map, camera | Discovering nearby |
| 2 | Explorer | Level 8-11 | Backpack, compass | Traveling wider |
| 3 | Adventurer | Level 12-15 | Globe, passport | World traveler |
| 4 | Diplomat | Level 16-19 | Multiple flags | Cultural ambassador |
| 5 | World Sage | Level 20-24 | Traditional garb | Wisdom of cultures |
| 6 | Universal Spirit | Level 25+ | Aura of unity | Embodies all cultures |

**Visual Style**: Cultural symbols, traditional clothing, global icons

---

#### **Track 4: Custom/Hybrid Tracks** (Future Expansion)
- **Animal Kingdom**: Baby animal → Majestic creature
- **Robot Tech**: Simple bot → AI overlord
- **Fantasy**: Sprite → Dragon
- **Sports**: Beginner → Champion athlete
- **Art**: Doodler → Master artist

---

### **4. Cultural Food System**

**Purpose**:
- Provide happiness boost beyond regular feeding
- Teach cultural appreciation
- Collectible items that unlock achievements

**Food Categories:**

#### **Korean Foods** 🇰🇷
| Item | Cost | Effect | Rarity |
|------|------|--------|--------|
| Kimchi | 50 coins | +10 happiness, +5 energy | Common |
| Tteokbokki | 100 coins | +15 happiness, "Love" emotion | Uncommon |
| Bulgogi | 150 coins | +20 happiness, +10 energy | Rare |
| Bibimbap | 200 coins | +25 happiness, +15 energy, +10 XP | Epic |

#### **Chinese Foods** 🇨🇳
| Item | Cost | Effect | Rarity |
|------|------|--------|--------|
| Dumplings | 50 coins | +10 happiness, +5 energy | Common |
| Fried Rice | 100 coins | +15 happiness, "Excited" emotion | Uncommon |
| Kung Pao Chicken | 150 coins | +20 happiness, +10 energy | Rare |
| Peking Duck | 200 coins | +25 happiness, +15 energy, +10 XP | Epic |

#### **Other Cultures** (Future Expansion)
- Japanese: Sushi, Ramen, Onigiri
- Italian: Pizza, Pasta, Gelato
- Mexican: Tacos, Burritos, Churros
- American: Burgers, Hot Dogs, Apple Pie

**Cultural Food Features:**
- **Favorite Food**: Pet develops preference after trying 5+ of same culture
- **Food Collection**: Track which foods have been tried
- **Cultural Achievements**: "Korean Food Explorer", "Chinese Cuisine Master"
- **Limited-Time Foods**: Special items during cultural holidays

---

### **5. Pet Interactions**

#### **Feed (10 coins)**
- Reduces hunger by 30%
- Increases happiness by 10%
- Regular food only

#### **Play (1 gem)**
- Increases happiness by 20%
- Triggers "Excited" emotion
- Mini-game animation

#### **Give Cultural Food (50-200 coins)**
- Reduces hunger by 50%
- Increases happiness by 10-25%
- Triggers "Love" emotion
- Adds to food collection

#### **Boost (5 gems)**
- Sets happiness to 100%
- Sets hunger to 0%
- Sets energy to 100%
- Emergency "reset" button

#### **Pet/Interact (Free)**
- Click pet to see stats
- Random reactions (bounce, spin, nuzzle)
- Increases happiness by 5%
- Cooldown: 5 minutes

---

### **6. Automatic Behaviors**

#### **Decay Over Time**
- **Hunger**: +1% per hour (real-time)
- **Happiness**: -1% per 2 hours if hunger >70%
- **Energy**: -5% per reading activity

#### **Reactions to Events**
- **Reading started**: Pet shows "Excited" emotion
- **Reading completed**: Pet shows "Happy", +5% happiness
- **Quiz correct answer**: Pet bounces, "Happy" emotion
- **Quiz incorrect answer**: Pet shows "Sad" but supportive message
- **Level up**: Pet shows "Excited", celebration animation
- **Achievement unlock**: Pet shows "Love", confetti

#### **Attention Needs**
- **Hunger >70%**: Pet shows "Hungry" emotion, reminder notification
- **Hunger >90%**: Pet shows "Angry" emotion, persistent reminder
- **No interaction for 1 day**: Pet shows "Bored" emotion
- **No interaction for 3 days**: Pet shows "Angry" emotion, grace period warning

**Grace Period**: Pet doesn't "die" or run away, just shows unhappy emotions to encourage return

---

### **7. Evolution Triggers**

**Automatic Evolution:**
- Occurs when user reaches level threshold
- Modal popup: "Your pet is evolving!"
- Animation: Old form → sparkles → new form
- Celebration: Confetti, XP bonus, achievement

**Evolution Requirements:**
| Stage | Level | XP Required | Special Unlock |
|-------|-------|-------------|----------------|
| 0 → 1 | 4 | 400 | None |
| 1 → 2 | 8 | 1,200 | "First Evolution" achievement |
| 2 → 3 | 12 | 2,500 | Shop unlocks |
| 3 → 4 | 16 | 4,500 | Cultural food unlocks |
| 4 → 5 | 20 | 7,500 | Premium items unlocks |
| 5 → 6 | 25 | 12,000 | "Max Evolution" achievement |

---

## 📊 XP & Progression System

### **XP Sources**

| Activity | XP Reward | Conditions |
|----------|-----------|------------|
| Complete reading passage | 50 XP | Base reward |
| Quiz correct answer | 10 XP | Per question |
| Quiz perfect score | +50 XP | Bonus for 100% |
| Combo streak (quiz) | +5/10/15 XP | 3x/5x/10x combos |
| Daily login | 25 XP | Once per day |
| Daily quest completed | 50-150 XP | Varies by quest |
| Weekly quest completed | 300-500 XP | Varies by quest |
| Achievement unlocked | 100-500 XP | Varies by rarity |
| Streak milestone | 50-200 XP | 7/30/100 day streaks |

### **Level Formula**
```typescript
function calculateXPRequired(level: number): number {
  // Exponential curve: 100 * (level ^ 1.5)
  return Math.floor(100 * Math.pow(level, 1.5));
}

// Examples:
// Level 1 → 2: 100 XP
// Level 2 → 3: 283 XP
// Level 5 → 6: 1,118 XP
// Level 10 → 11: 3,162 XP
// Level 20 → 21: 8,944 XP
```

### **Level Rewards**

| Level | Reward | Description |
|-------|--------|-------------|
| 2 | +100 coins | Currency boost |
| 3 | +50 coins, +1 gem | Mixed currency |
| 4 | Pet evolution | First evolution |
| 5 | +200 coins, Achievement | "Rising Star" badge |
| 8 | Pet evolution | Second evolution |
| 10 | +500 coins, +5 gems | Major milestone |
| 12 | Pet evolution | Third evolution |
| 15 | Shop unlock | Premium items available |
| 16 | Pet evolution | Fourth evolution |
| 20 | Pet evolution, +1000 coins | Fifth evolution |
| 25 | Pet evolution, "Legend" achievement | Max evolution |

---

## 💰 Currency System

### **Coins (Common Currency)**

**Earning:**
- Reading passage: +25-50 coins (based on length)
- Quiz correct answer: +5-10 coins
- Daily quest: +25-75 coins
- Weekly quest: +100-200 coins
- Daily login: +10 coins
- Level up: +50-500 coins (scales with level)

**Spending:**
- Feed pet: -10 coins
- Cultural food: -50 to -200 coins
- Shop items (cosmetics): -100 to -500 coins
- Treasure chest (random rewards): -250 coins

### **Gems (Premium Currency)**

**Earning:**
- Perfect quiz (100%): +1 gem
- Daily login streak (7 days): +1 gem
- Weekly quest: +1-3 gems
- Achievement unlock: +1-5 gems (rarity based)
- Level milestone (5, 10, 15, 20, 25): +2-10 gems

**Spending:**
- Pet play: -1 gem
- Pet boost: -5 gems
- Premium shop items: -10 to -50 gems
- Special treasure chest: -10 gems

---

## 🎯 Quest System

### **Daily Quests (3 active)**

Reset: Every day at midnight local time

| Quest | Goal | Rewards | Notes |
|-------|------|---------|-------|
| Daily Reader | Complete 2-3 passages | +100 XP, +50 coins | Encourages reading |
| Quiz Master | Score 80%+ on 2 quizzes | +150 XP, +75 coins, +1 gem | Quality over quantity |
| Streak Keeper | Maintain daily streak | +50 XP, +25 coins | Habit reinforcement |
| Language Explorer | Read at blend level 5+ | +125 XP, +60 coins | Encourages language learning |
| Vocabulary Collector | Learn 5 new words | +100 XP, +40 coins | Vocabulary focus |

**Quest Selection**: 3 random quests per day from pool of 5-10 options

### **Weekly Quests (2 active)**

Reset: Every Monday at midnight

| Quest | Goal | Rewards | Notes |
|-------|------|---------|-------|
| Rising Star | Earn 1000 XP this week | +500 XP, +200 coins, +3 gems | Total progress |
| Achievement Hunter | Unlock 2 achievements | +300 XP, +150 coins, +2 gems | Exploration |
| Reading Marathon | Complete 10 passages | +400 XP, +180 coins, +2 gems | Volume |
| Quiz Champion | Complete 15 quizzes | +450 XP, +200 coins, +3 gems | Assessment focus |
| Cultural Foodie | Try 5 different foods | +350 XP, +100 coins, +5 gems | Culture exploration |

---

## 🏆 Achievement System

### **Achievement Categories**

#### **Reading Achievements**
- First Steps (Complete 1 passage) - 100 XP
- Book Worm (Complete 10 passages) - 200 XP
- Avid Reader (Complete 50 passages) - 500 XP
- Master Reader (Complete 100 passages) - 1000 XP

#### **Quiz Achievements**
- Quiz Novice (Complete 1 quiz) - 100 XP
- Quiz Apprentice (Complete 10 quizzes) - 200 XP
- Quiz Expert (Complete 50 quizzes) - 500 XP
- Perfect Scholar (Get 100% on 10 quizzes) - 500 XP, +5 gems

#### **Streak Achievements**
- Committed (7-day streak) - 200 XP, +1 gem
- Dedicated (30-day streak) - 500 XP, +5 gems
- Legendary (100-day streak) - 1500 XP, +15 gems

#### **Language Achievements**
- Bilingual Beginner (Complete passage at level 5+) - 250 XP
- Language Explorer (Complete passage at level 8+) - 400 XP
- Multilingual Master (Complete passage at level 10) - 750 XP, +10 gems
- Korean Scholar (Complete 20 passages with Korean) - 500 XP
- Mandarin Master (Complete 20 passages with Mandarin) - 500 XP

#### **Pet Achievements**
- First Evolution (Evolve pet once) - 200 XP
- Pet Parent (Keep pet happy >80% for 7 days) - 300 XP
- Food Connoisseur (Try 10 different foods) - 250 XP, +2 gems
- Culture Ambassador (Try food from 3 cultures) - 400 XP, +3 gems

#### **XP/Level Achievements**
- Level 5 (Reach level 5) - 200 XP
- Level 10 (Reach level 10) - 500 XP, +5 gems
- Level 20 (Reach level 20) - 1000 XP, +10 gems
- Level 25 (Reach level 25) - 2000 XP, +20 gems, "Legend" badge

#### **Collection Achievements**
- Collector (Unlock 5 achievements) - 250 XP
- Achiever (Unlock 10 achievements) - 500 XP
- Completionist (Unlock all achievements) - 2000 XP, +50 gems, Special badge

---

## 🗂️ File Structure

```
reading_app/
├── reading_webapp/                    # ✅ OLD - Archived for reference
└── reading_webapp_v2/                 # 🆕 NEW - V2 Gamified App
    ├── docs/
    │   ├── architecture.md            # This file
    │   ├── wireframes/
    │   │   ├── dashboard.md
    │   │   ├── reading.md
    │   │   ├── achievements.md
    │   │   ├── shop.md
    │   │   ├── progress.md
    │   │   └── profile.md
    │   ├── component-specs.md
    │   ├── mock-data-schema.md
    │   └── api-contract.md
    │
    ├── src/
    │   ├── components/
    │   │   ├── pet/
    │   │   │   ├── VirtualPet.tsx         # Main pet widget
    │   │   │   ├── PetImage.tsx           # Pet sprite with animations
    │   │   │   ├── PetStats.tsx           # Happiness/hunger bars
    │   │   │   ├── PetActions.tsx         # Feed/play/boost buttons
    │   │   │   └── PetEvolution.tsx       # Evolution modal
    │   │   │
    │   │   ├── gamification/
    │   │   │   ├── XPBar.tsx              # XP progress bar
    │   │   │   ├── LevelUpModal.tsx       # Level up celebration
    │   │   │   ├── CurrencyDisplay.tsx    # Coins + gems header
    │   │   │   ├── StreakTracker.tsx      # Daily streak counter
    │   │   │   ├── QuestCard.tsx          # Daily/weekly quest
    │   │   │   ├── QuestList.tsx          # Quest container
    │   │   │   ├── AchievementBadge.tsx   # Single achievement
    │   │   │   ├── AchievementGrid.tsx    # All achievements
    │   │   │   ├── ComboCounter.tsx       # Quiz streak multiplier
    │   │   │   └── RewardNotification.tsx # +XP, +coins popups
    │   │   │
    │   │   ├── reading/
    │   │   │   ├── StoryPromptInput.tsx   # Text + speech-to-text
    │   │   │   ├── StorySettings.tsx      # Length, grade, humor, etc.
    │   │   │   ├── LanguageControls.tsx   # Language selector + slider
    │   │   │   ├── StoryDisplay.tsx       # Blended text with hints
    │   │   │   ├── HintToggle.tsx         # Show/hide translations
    │   │   │   ├── RomanizationToggle.tsx # Show/hide romanization
    │   │   │   ├── AudioPlayer.tsx        # Read aloud (BONUS)
    │   │   │   └── WordHighlighter.tsx    # Sync audio highlight (BONUS)
    │   │   │
    │   │   ├── quiz/
    │   │   │   ├── QuizSettings.tsx       # Teacher customization
    │   │   │   ├── QuizContainer.tsx      # Quiz wrapper
    │   │   │   ├── MultipleChoice.tsx     # MC question
    │   │   │   ├── FillInBlank.tsx        # Fill-in question
    │   │   │   ├── QuizFeedback.tsx       # Correct/incorrect message
    │   │   │   └── QuizResults.tsx        # Final score summary
    │   │   │
    │   │   ├── shop/
    │   │   │   ├── ShopItem.tsx           # Single purchasable item
    │   │   │   ├── CulturalFoodCard.tsx   # Food item with culture flag
    │   │   │   ├── CosmeticCard.tsx       # Pet accessory
    │   │   │   └── TreasureChest.tsx      # Random reward box
    │   │   │
    │   │   ├── layout/
    │   │   │   ├── Layout.tsx             # Main wrapper
    │   │   │   ├── Header.tsx             # Logo, currency, streak
    │   │   │   ├── Navigation.tsx         # Bottom/side nav
    │   │   │   └── MiniPetWidget.tsx      # Small pet for non-dashboard pages
    │   │   │
    │   │   ├── ui/                        # shadcn/ui components
    │   │   │   ├── button.tsx
    │   │   │   ├── card.tsx
    │   │   │   ├── slider.tsx
    │   │   │   ├── progress.tsx
    │   │   │   ├── modal.tsx
    │   │   │   └── ...
    │   │   │
    │   │   └── effects/
    │   │       ├── Confetti.tsx           # Celebration animation
    │   │       ├── ParticleEffect.tsx     # Stars, hearts, sparkles
    │   │       └── FloatingXP.tsx         # +XP float animation
    │   │
    │   ├── pages/
    │   │   ├── Dashboard.tsx              # Main hub
    │   │   ├── Reading.tsx                # Story generation + reading
    │   │   ├── Achievements.tsx           # Achievement grid
    │   │   ├── Shop.tsx                   # Item purchases
    │   │   ├── Progress.tsx               # Stats and charts
    │   │   └── Profile.tsx                # User settings
    │   │
    │   ├── hooks/
    │   │   ├── useGameState.ts            # Global game state
    │   │   ├── usePetState.ts             # Pet-specific state
    │   │   ├── useAchievements.ts         # Achievement tracking
    │   │   ├── useQuests.ts               # Quest progress
    │   │   ├── useXP.ts                   # XP/level calculations
    │   │   ├── useCurrency.ts             # Coins/gems management
    │   │   ├── useLanguage.ts             # Language blending
    │   │   └── useLocalStorage.ts         # Persistence helper
    │   │
    │   ├── services/
    │   │   ├── azureAI.ts                 # Azure AI Foundry client
    │   │   ├── storyGeneration.ts         # Story API calls
    │   │   ├── quizGeneration.ts          # Quiz API calls
    │   │   ├── imageGeneration.ts         # FLUX/gpt-image-1 calls
    │   │   ├── speechToText.ts            # Speech input
    │   │   └── textToSpeech.ts            # Audio reading (BONUS)
    │   │
    │   ├── utils/
    │   │   ├── xpCalculations.ts          # Level formulas
    │   │   ├── achievementLogic.ts        # Unlock detection
    │   │   ├── questLogic.ts              # Quest progress tracking
    │   │   ├── petBehavior.ts             # Pet emotion/reaction logic
    │   │   ├── languageBlending.ts        # Text blending algorithm
    │   │   ├── romanization.ts            # Korean/Mandarin romanization
    │   │   └── currencyCalculations.ts    # Reward formulas
    │   │
    │   ├── types/
    │   │   ├── user.ts                    # User data types
    │   │   ├── pet.ts                     # Pet state types
    │   │   ├── gamification.ts            # XP, achievements, quests
    │   │   ├── story.ts                   # Story content types
    │   │   ├── quiz.ts                    # Quiz question types
    │   │   └── shop.ts                    # Shop item types
    │   │
    │   ├── data/
    │   │   ├── mockUser.ts                # Mock user data
    │   │   ├── achievements.ts            # Achievement definitions
    │   │   ├── quests.ts                  # Quest definitions
    │   │   ├── shopItems.ts               # Shop inventory
    │   │   ├── culturalFoods.ts           # Food catalog
    │   │   └── petEvolutions.ts           # Evolution track definitions
    │   │
    │   ├── assets/
    │   │   ├── pet-images/
    │   │   │   ├── knowledge/
    │   │   │   │   ├── stage-0-happy.png
    │   │   │   │   ├── stage-0-sad.png
    │   │   │   │   └── ... (49 images per track)
    │   │   │   ├── coolness/
    │   │   │   └── culture/
    │   │   └── icons/
    │   │       ├── coins.svg
    │   │       ├── gems.svg
    │   │       └── ...
    │   │
    │   ├── App.tsx                        # Root component with routing
    │   ├── main.tsx                       # Entry point
    │   └── index.css                      # Global styles
    │
    ├── public/
    │   └── sounds/                        # Sound effects (optional)
    │       ├── coin.mp3
    │       ├── level-up.mp3
    │       └── achievement.mp3
    │
    ├── package.json
    ├── vite.config.ts
    ├── tailwind.config.ts
    └── tsconfig.json
```

---

## 📡 API Contract (Future Backend)

### **User Data**
```typescript
// GET /api/user/:userId
interface User {
  id: string;
  name: string;
  level: number;
  xp: number;
  coins: number;
  gems: number;
  streak: number;
  lastLogin: number;
  pet: PetState;
  achievements: Achievement[];
  quests: Quest[];
  settings: UserSettings;
}

// POST /api/user/:userId/update
// Body: Partial<User>
```

### **Progress Tracking**
```typescript
// POST /api/user/:userId/xp/add
interface AddXPRequest {
  amount: number;
  source: 'reading' | 'quiz' | 'quest' | 'achievement';
}

// POST /api/user/:userId/achievement/unlock
interface UnlockAchievementRequest {
  achievementId: string;
}
```

### **Pet Interactions**
```typescript
// POST /api/user/:userId/pet/feed
interface FeedPetRequest {
  foodType: 'regular' | 'cultural';
  foodId?: string; // For cultural foods
}

// POST /api/user/:userId/pet/play
// No body needed

// POST /api/user/:userId/pet/boost
// No body needed
```

### **Story Generation**
```typescript
// POST /api/generate-story
interface StoryGenerationRequest {
  prompt: string;
  length: number;
  gradeLevel: string;
  humorLevel: string;
  theme: string;
  language: 'ko' | 'zh';
  languageLevel: number; // 0-10
  customVocabulary?: string[];
}

interface StoryGenerationResponse {
  story: string;
  blendedStory: string;
  title: string;
  wordCount: number;
  vocabularyUsed: string[];
}
```

### **Quiz Generation**
```typescript
// POST /api/generate-quiz
interface QuizGenerationRequest {
  storyContent: string;
  gradeLevel: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  numMultipleChoice: number;
  numFillInBlank: number;
  customPrompt?: string; // Teacher override
}

interface QuizGenerationResponse {
  questions: QuizQuestion[];
}
```

### **Audio Generation (BONUS)**
```typescript
// POST /api/audio/generate-tts
interface TTSRequest {
  text: string;
  language: string;
  includeTimestamps: boolean;
}

interface TTSResponse {
  audioUrl: string;
  duration: number;
  wordTimestamps?: Array<{
    word: string;
    start: number;
    end: number;
  }>;
}
```

---

## 🎨 Image Generation Plan

### **Pet Art Requirements**

**Total Images Needed:**
- 7 emotions × 7 stages × 3 tracks = 147 images
- Initial MVP: 1 track (Knowledge) = 49 images
- Fallback: Use emojis/simple SVGs for prototyping

### **FLUX-1.1-pro Prompts**

#### **Knowledge Track - Stage 0 (Newbie)**
```
"Cute chibi character, baby with ABC blocks, kawaii style,
pixel art aesthetic, {emotion} expression, pastel colors,
white background, front view, educational theme"

Emotions: happy, sad, angry, hungry, excited, bored, love
```

#### **Knowledge Track - Stage 6 (PhD Scholar)**
```
"Cute chibi character, adult with graduation cap and diploma,
kawaii style, pixel art aesthetic, {emotion} expression,
academic robes, white background, front view, scholarly theme"
```

### **Generation Process**
1. Create prompt template for each stage
2. Generate 7 emotion variants per stage
3. Download and optimize images (compress, resize)
4. Organize in folder structure: `/assets/pet-images/knowledge/stage-{N}-{emotion}.png`
5. Create TypeScript mapping: `const petImages = { knowledge: { 0: { happy: '...' } } }`

### **Alternative**: Start with emojis or simple SVGs
- Rapid prototyping without art dependencies
- Replace with AI-generated art later
- Example:
  - Happy: 😊
  - Sad: 😔
  - Angry: 😠
  - Hungry: 😋
  - Excited: 🤩
  - Bored: 😑
  - Love: 🥰

---

## 🎤 Speech-to-Text Architecture

### **Story Prompt Input**

**Option 1: Browser Web Speech API** (Free, no Azure API call)
```typescript
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.lang = 'en-US';
recognition.continuous = false;
recognition.interimResults = false;

recognition.onresult = (event) => {
  const transcript = event.results[0][0].transcript;
  setStoryPrompt(transcript);
};

recognition.start();
```

**Option 2: Azure `gpt-4o-transcribe`** (If Web Speech API insufficient)
```typescript
// Record audio in browser
const mediaRecorder = new MediaRecorder(stream);
const audioChunks = [];
mediaRecorder.ondataavailable = (e) => audioChunks.push(e.data);

// Send to Azure for transcription
const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
const formData = new FormData();
formData.append('audio', audioBlob);

const response = await fetch('/api/transcribe', {
  method: 'POST',
  body: formData
});

const { transcript } = await response.json();
setStoryPrompt(transcript);
```

**Recommendation**: Start with Web Speech API (MVP), add Azure option if needed.

---

## 📱 Responsive Design Strategy

### **Breakpoints**
```css
/* Mobile: < 768px */
.mobile-nav { display: flex; } /* Bottom navigation */
.desktop-nav { display: none; }

/* Tablet: 768px - 1024px */
.mobile-nav { display: flex; }
.sidebar { width: 200px; } /* Narrow sidebar */

/* Desktop: > 1024px */
.mobile-nav { display: none; }
.desktop-nav { display: flex; } /* Side navigation */
.sidebar { width: 300px; } /* Full sidebar */
```

### **Component Priorities**

**Dashboard (Mobile)**
- Pet widget: Full width
- Quests: Stack vertically
- Stats: 2x2 grid

**Dashboard (Desktop)**
- Pet widget: 30% width (right)
- Quests: 70% width (left)
- Stats: 4-column row

**Reading Page (Mobile)**
- Story: Full width, scrollable
- Settings: Collapsible drawer
- Mini pet: Floating bottom-right corner

**Reading Page (Desktop)**
- Story: 60% width (center)
- Settings: 20% width (left sidebar)
- Quiz: 20% width (right sidebar)
- Mini pet: Fixed top-right

---

## 🚀 Development Phases

### **Phase 1: Foundation (Week 1-2)**
- [ ] Project setup (Vite, React, TypeScript, Tailwind)
- [ ] Routing (6 pages)
- [ ] Global state (React Context)
- [ ] localStorage persistence
- [ ] Mock data structures
- [ ] Basic layout (header, nav, pages)

### **Phase 2: Language Features (Week 3-4)**
- [ ] Story prompt input (text + speech-to-text)
- [ ] Story settings UI
- [ ] Language selector (Korean/Mandarin)
- [ ] Language blending slider (0-10)
- [ ] Story display with blended text
- [ ] Hint toggle (show/hide translations)
- [ ] Romanization toggle
- [ ] Copy existing reading logic from v1

### **Phase 3: Quiz System (Week 5)**
- [ ] Quiz settings (teacher customization)
- [ ] Quiz generation (Azure API)
- [ ] Multiple choice component
- [ ] Fill-in-blank component
- [ ] Quiz feedback
- [ ] Combo counter
- [ ] Results summary

### **Phase 4: Gamification - Core (Week 6-7)**
- [ ] XP system
- [ ] Level up detection
- [ ] Currency display (coins, gems)
- [ ] Reward notifications (+XP, +coins)
- [ ] Achievement definitions
- [ ] Achievement tracking
- [ ] Achievement grid
- [ ] Quest definitions
- [ ] Quest tracking
- [ ] Quest cards
- [ ] Streak system
- [ ] Daily login tracking

### **Phase 5: Virtual Pet (Week 8-9)**
- [ ] Pet state management
- [ ] Pet image component (use emojis initially)
- [ ] Pet emotion logic
- [ ] Pet actions (feed, play, boost)
- [ ] Pet stats display (happiness, hunger)
- [ ] Pet reactions to events
- [ ] Pet evolution system
- [ ] Evolution modal
- [ ] Generate pet art with FLUX (or defer)

### **Phase 6: Shop & Culture (Week 10)**
- [ ] Cultural food catalog
- [ ] Shop UI
- [ ] Purchase logic
- [ ] Food effects
- [ ] Cosmetics (if time)

### **Phase 7: Polish & Effects (Week 11-12)**
- [ ] Confetti animations
- [ ] Particle effects
- [ ] Floating XP indicators
- [ ] Sound effects (optional)
- [ ] Responsive design refinement
- [ ] Loading states
- [ ] Error handling

### **Phase 8: BONUS - Audio Reading (Week 13+)**
- [ ] TTS API integration
- [ ] Audio player component
- [ ] Word-level highlighting
- [ ] Sync logic
- [ ] Speed controls

### **Phase 9: Backend Integration (Later)**
- [ ] User authentication
- [ ] Database schema
- [ ] API endpoints
- [ ] Replace localStorage with API calls

---

## ❓ Open Questions

1. **Audio Reading**: Should we prioritize this in MVP or defer to Phase 2?
   - **Recommendation**: Design architecture now, implement in Phase 8 (post-MVP)

2. **Pet Art**: Start with emojis or generate FLUX images immediately?
   - **Recommendation**: Use emojis for rapid prototyping, generate art in Phase 5

3. **Evolution Tracks**: Which track to build first?
   - **Recommendation**: Knowledge track (most aligned with educational theme)

4. **Shop Items**: What cosmetics make sense for educational context?
   - Ideas: Pencils, books, glasses, graduation caps, backpacks, study desks
   - Cultural items: Traditional clothing, flags, cultural symbols

5. **Difficulty Scaling**: How should questions change across grade levels?
   - 3rd grade: Simple recall, short sentences
   - 4th grade: Inference, cause/effect
   - 5th grade: Analysis, multiple steps
   - 6th grade: Critical thinking, synthesis

---

## 🎯 Success Criteria

**MVP is complete when:**
- ✅ User can generate story with Korean/Mandarin blending (level 0-10)
- ✅ User can toggle hints and romanization
- ✅ User can complete quiz with customizable questions
- ✅ User earns XP, levels up, gains coins/gems
- ✅ Pet reacts to user actions with 7 emotions
- ✅ Pet evolves based on user level
- ✅ Achievements unlock and display
- ✅ Daily/weekly quests track progress
- ✅ Shop allows purchasing cultural food
- ✅ All data persists in localStorage
- ✅ Responsive design works on mobile/desktop

**Success metrics:**
- User can complete full learning flow (generate → read → quiz → rewards) without bugs
- Pet provides emotional feedback throughout
- Language features match or exceed v1 capabilities
- Gamification feels rewarding, not overwhelming

---

## 📚 Next Documents to Create

1. **Wireframes** (`docs/wireframes/`) - Visual ASCII mockups of all 6 pages
2. **Mock Data Schema** (`docs/mock-data-schema.md`) - Exact TypeScript interfaces
3. **Component Specs** (`docs/component-specs.md`) - Every component's API
4. **API Contract** (`docs/api-contract.md`) - Detailed endpoint specs

---

**Ready for review!** Let me know if you want to:
- Modify any features
- Change priorities
- Add/remove anything
- Proceed to wireframes

This architecture balances **language features first** (your priority) with **gamification second** (Tamagotchi layer), while designing for **audio reading** as a future bonus. 🚀
