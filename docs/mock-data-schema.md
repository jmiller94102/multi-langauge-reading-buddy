# Reading App V2 - Mock Data Schema

## Overview

This document defines the complete TypeScript interfaces and mock data structures for the MVP. All data will be stored in `localStorage` until backend integration.

---

## Core Data Types

### **User State**

```typescript
interface UserState {
  // Identity
  id: string; // UUID generated on first use
  name: string; // Default: "Renzo"
  avatar: string; // Emoji or image URL
  gradeLevel: '3rd' | '4th' | '5th' | '6th';

  // Progress
  level: number; // User level (1-25+)
  xp: number; // Current XP
  xpToNextLevel: number; // XP required for next level

  // Currency
  coins: number;
  gems: number;

  // Streak
  streak: number; // Current consecutive days
  longestStreak: number; // Best streak ever
  lastLoginDate: number; // Unix timestamp

  // Stats
  totalPassagesRead: number;
  totalQuizzesCompleted: number;
  totalXPEarned: number;

  // Settings
  settings: UserSettings;

  // Timestamps
  createdAt: number; // Unix timestamp
  updatedAt: number;
}
```

### **User Settings**

```typescript
interface UserSettings {
  // Language
  primaryLanguage: 'en'; // Locked to English for MVP
  secondaryLanguages: Array<'ko' | 'zh' | 'ja' | 'it' | 'es' | 'ar'>;
  defaultBlendLevel: number; // 0-10
  showHints: boolean;
  showRomanization: boolean;
  audioSupport: boolean;
  autoPlayAudio: boolean;

  // Reading
  defaultPassageLength: number; // 250-2000
  defaultHumorLevel: 'None' | 'Light' | 'Moderate' | 'Heavy';
  defaultTheme: 'Space' | 'Jungle' | 'DeepSea' | 'Minecraft' | 'Tron';

  // Quiz
  quizDifficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  defaultQuestionMix: {
    multipleChoice: number;
    fillInBlank: number;
  };

  // Appearance
  visualTheme: 'Space' | 'Jungle' | 'DeepSea' | 'Minecraft' | 'Tron';
  colorMode: 'auto' | 'light' | 'dark';
  fontSize: 'small' | 'medium' | 'large';
  animationsEnabled: boolean;
  confettiEnabled: boolean;
  petReactionsEnabled: boolean;

  // Sound
  masterVolume: number; // 0-100
  soundEffectsEnabled: boolean;
  ttsVoice: 'male' | 'female';
  ttsSpeed: number; // 0.5-2.0
  highlightWordsWhileReading: boolean;

  // Notifications
  dailyReminders: boolean;
  questAlerts: boolean;
  achievementAlerts: boolean;
  petNeedsAttention: boolean;
  weeklyReports: boolean;
  dailyReminderTime: string; // "10:00"
  weeklyReportDay: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  weeklyReportTime: string; // "09:00"

  // Privacy
  saveLocally: boolean;
  cloudSync: boolean; // False for MVP (no auth)
  analytics: boolean;

  // Advanced
  developerMode: boolean;
  betaFeatures: boolean;
}
```

---

## Pet System

### **Pet State**

```typescript
interface PetState {
  // Identity
  name: string; // Default: "Flutterpuff" (based on stage)
  evolutionTrack: 'knowledge' | 'coolness' | 'culture';
  evolutionStage: 0 | 1 | 2 | 3 | 4 | 5 | 6; // 7 stages (0 = baby, 6 = max)

  // Stats
  happiness: number; // 0-100
  hunger: number; // 0-100 (increases 1% per hour)
  energy: number; // 0-100 (decreases with activity)

  // Current State
  emotion: 'happy' | 'sad' | 'angry' | 'hungry' | 'excited' | 'bored' | 'love';

  // Timestamps
  lastFed: number; // Unix timestamp
  lastPlayed: number;
  lastInteraction: number;

  // Items
  ownedAccessories: string[]; // IDs of owned cosmetics
  equippedAccessories: string[]; // IDs of currently worn items
  favoriteFood: string | null; // ID of favorite cultural food (after trying 5+ of same culture)
  foodsTriedHistory: string[]; // IDs of all foods ever tried

  // Evolution History
  evolutionHistory: EvolutionHistoryEntry[];
}

interface EvolutionHistoryEntry {
  stage: number;
  name: string;
  unlockedAt: number; // Unix timestamp
  level: number; // User level when evolved
}
```

### **Pet Evolution Definitions**

```typescript
interface EvolutionTrack {
  id: 'knowledge' | 'coolness' | 'culture';
  name: string;
  description: string;
  stages: EvolutionStage[];
}

interface EvolutionStage {
  id: number; // 0-6
  name: string;
  levelRequirement: number;
  description: string;
  imageUrl: string; // Path to pet image for each emotion
  abilities: string[]; // Special bonuses (e.g., "+10% XP bonus")
}

// Example: Knowledge Track
const knowledgeTrack: EvolutionTrack = {
  id: 'knowledge',
  name: 'Knowledge Track',
  description: 'Academic progression from Pre-K to PhD',
  stages: [
    {
      id: 0,
      name: 'Newbie',
      levelRequirement: 1,
      description: 'Just starting to learn',
      imageUrl: '/assets/pet/knowledge/stage-0-{emotion}.png',
      abilities: []
    },
    {
      id: 1,
      name: 'Kindergartener',
      levelRequirement: 4,
      description: 'Learning basics',
      imageUrl: '/assets/pet/knowledge/stage-1-{emotion}.png',
      abilities: ['+5% XP bonus']
    },
    {
      id: 2,
      name: 'Elementary',
      levelRequirement: 8,
      description: 'Building foundation',
      imageUrl: '/assets/pet/knowledge/stage-2-{emotion}.png',
      abilities: ['+10% XP bonus', 'Korean foods unlocked']
    },
    {
      id: 3,
      name: 'Middle Schooler',
      levelRequirement: 12,
      description: 'Developing skills',
      imageUrl: '/assets/pet/knowledge/stage-3-{emotion}.png',
      abilities: ['+15% XP bonus', 'Shop unlocks']
    },
    {
      id: 4,
      name: 'High Schooler',
      levelRequirement: 16,
      description: 'Advanced learning',
      imageUrl: '/assets/pet/knowledge/stage-4-{emotion}.png',
      abilities: ['+20% XP bonus', 'Premium items']
    },
    {
      id: 5,
      name: 'College Graduate',
      levelRequirement: 20,
      description: 'Specialized knowledge',
      imageUrl: '/assets/pet/knowledge/stage-5-{emotion}.png',
      abilities: ['+25% XP bonus', 'Cultural foods']
    },
    {
      id: 6,
      name: 'PhD Scholar',
      levelRequirement: 25,
      description: 'Master of learning',
      imageUrl: '/assets/pet/knowledge/stage-6-{emotion}.png',
      abilities: ['+30% XP bonus', 'All items unlocked', 'Max evolution bonus']
    }
  ]
};
```

---

## Gamification System

### **Achievement**

```typescript
interface Achievement {
  id: string; // e.g., "first-steps"
  title: string;
  description: string;
  category: 'reading' | 'quiz' | 'streak' | 'language' | 'pet' | 'level' | 'collection';
  icon: string; // Emoji or icon name
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

  // Requirements
  requirement: AchievementRequirement;

  // Rewards
  rewards: {
    xp: number;
    coins?: number;
    gems?: number;
  };

  // State
  unlocked: boolean;
  progress: number; // Current progress (e.g., 3 out of 5)
  total: number; // Total needed
  unlockedAt?: number; // Unix timestamp
}

type AchievementRequirement =
  | { type: 'passages_read', count: number }
  | { type: 'quizzes_completed', count: number }
  | { type: 'perfect_quizzes', count: number }
  | { type: 'streak_days', days: number }
  | { type: 'words_learned', language: string, count: number }
  | { type: 'level_reached', level: number }
  | { type: 'achievements_unlocked', count: number }
  | { type: 'pet_evolution', stage: number }
  | { type: 'foods_tried', count: number, culture?: string }
  | { type: 'passages_at_blend_level', level: number, count: number };

// Example achievements
const achievements: Achievement[] = [
  {
    id: 'first-steps',
    title: 'First Steps',
    description: 'Complete your first reading passage',
    category: 'reading',
    icon: '📖',
    rarity: 'common',
    requirement: { type: 'passages_read', count: 1 },
    rewards: { xp: 100 },
    unlocked: false,
    progress: 0,
    total: 1
  },
  {
    id: 'week-warrior',
    title: 'Week Warrior',
    description: 'Maintain a 7-day streak',
    category: 'streak',
    icon: '🔥',
    rarity: 'uncommon',
    requirement: { type: 'streak_days', days: 7 },
    rewards: { xp: 200, gems: 1 },
    unlocked: false,
    progress: 0,
    total: 7
  },
  // ... (see architecture.md for full list of 27 achievements)
];
```

### **Quest**

```typescript
interface Quest {
  id: string; // e.g., "daily-reader"
  title: string;
  description: string;
  type: 'daily' | 'weekly';
  icon: string; // Emoji

  // Requirements
  goal: QuestGoal;

  // Rewards
  rewards: {
    xp: number;
    coins: number;
    gems?: number;
  };

  // State
  progress: number; // Current progress
  total: number; // Total needed
  completed: boolean;
  claimed: boolean; // Whether rewards have been claimed

  // Timestamps
  startedAt: number; // Unix timestamp
  expiresAt: number; // Unix timestamp
}

type QuestGoal =
  | { type: 'read_passages', count: number }
  | { type: 'complete_quizzes', minScore: number, count: number }
  | { type: 'maintain_streak' }
  | { type: 'earn_xp', amount: number }
  | { type: 'unlock_achievements', count: number }
  | { type: 'read_at_blend_level', level: number, count: number }
  | { type: 'learn_words', count: number };

// Example daily quests
const dailyQuests: Quest[] = [
  {
    id: 'daily-reader',
    title: 'Daily Reader',
    description: 'Complete 3 reading passages',
    type: 'daily',
    icon: '📖',
    goal: { type: 'read_passages', count: 3 },
    rewards: { xp: 100, coins: 50 },
    progress: 0,
    total: 3,
    completed: false,
    claimed: false,
    startedAt: Date.now(),
    expiresAt: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
  },
  // ... (see architecture.md for full quest list)
];
```

---

## Content System

### **Story Content**

```typescript
interface StoryContent {
  id: string; // UUID

  // Metadata
  title: string;
  theme: string; // User's prompt
  gradeLevel: '3rd' | '4th' | '5th' | '6th';
  humorLevel: 'None' | 'Light' | 'Moderate' | 'Heavy';
  visualTheme: 'Space' | 'Jungle' | 'DeepSea' | 'Minecraft' | 'Tron';

  // Language
  primaryLanguage: 'en';
  secondaryLanguage: 'ko' | 'zh' | 'ja' | 'it' | 'es' | 'ar';
  blendLevel: number; // 0-10

  // Content
  englishContent: string; // Full English text
  secondaryContent: string; // Full secondary language text
  blendedContent: string; // English + secondary language blended

  // Sentence mappings
  englishSentences: string[];
  secondarySentences: string[];

  // Word mappings
  wordMappings: Array<{
    english: string;
    secondary: string;
    romanization?: string; // For Korean/Mandarin
    position: number; // Index in blended content
  }>;

  // Vocabulary
  customVocabulary: string[]; // Words requested by teacher
  extractedNouns: string[]; // Auto-extracted key nouns
  newWordsIntroduced: string[]; // Secondary language words introduced

  // Stats
  wordCount: number;
  estimatedReadingTime: number; // Minutes

  // Quiz
  quiz: Quiz;

  // Timestamps
  generatedAt: number;
  completedAt?: number;
}
```

### **Quiz**

```typescript
interface Quiz {
  id: string; // UUID
  storyId: string; // Reference to story

  // Settings
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  customPrompt?: string; // Teacher's custom question focus

  // Questions
  questions: QuizQuestion[];

  // Results
  userAnswers: Array<string | null>; // null if not answered yet
  correctAnswers: string[];
  score: number; // 0-100
  accuracy: number; // 0-100

  // Stats
  timeSpent: number; // Seconds
  hintsUsed: number;
  comboStreak: number; // Consecutive correct answers

  // State
  completed: boolean;
  startedAt?: number;
  completedAt?: number;
}

interface QuizQuestion {
  id: string;
  type: 'multiple-choice' | 'fill-in-blank';
  questionType: 'comprehension' | 'inference' | 'plot' | 'vocabulary' | 'prediction';

  // Question
  question: string;
  context?: string; // Excerpt from story if needed

  // Answers (for multiple-choice)
  options?: string[]; // 4 options
  correctIndex?: number; // Index of correct option

  // Answer (for fill-in-blank)
  correctAnswer?: string;
  acceptableAnswers?: string[]; // Synonyms/variations accepted

  // Feedback
  explanation?: string; // Why this answer is correct
  hint?: string; // Available for -5 coins

  // Stats
  answered: boolean;
  userAnswer: string | null;
  isCorrect: boolean;
  timeSpent: number; // Seconds
}

// Example quiz
const exampleQuiz: Quiz = {
  id: 'quiz-123',
  storyId: 'story-456',
  difficulty: 'Intermediate',
  questions: [
    {
      id: 'q1',
      type: 'multiple-choice',
      questionType: 'comprehension',
      question: 'What did Jessie say?',
      options: [
        'We need more practice',
        'We\'ll win easily!',
        'Let\'s give up',
        'Pikachu is too strong'
      ],
      correctIndex: 1,
      explanation: 'Jessie confidently declared "We\'ll win easily!" while dribbling the basketball.',
      hint: 'Look for what Jessie said while dribbling.',
      answered: false,
      userAnswer: null,
      isCorrect: false,
      timeSpent: 0
    },
    {
      id: 'q2',
      type: 'fill-in-blank',
      questionType: 'vocabulary',
      question: 'The Korean word for "gymnasium" is ____.',
      correctAnswer: '체육관',
      acceptableAnswers: ['체육관', 'cheyukgwan'],
      explanation: '체육관 (cheyukgwan) means gymnasium in Korean.',
      hint: 'It appeared early in the story when Pikachu arrived.',
      answered: false,
      userAnswer: null,
      isCorrect: false,
      timeSpent: 0
    }
  ],
  userAnswers: [null, null],
  correctAnswers: ['We\'ll win easily!', '체육관'],
  score: 0,
  accuracy: 0,
  timeSpent: 0,
  hintsUsed: 0,
  comboStreak: 0,
  completed: false
};
```

---

## Shop System

### **Shop Item**

```typescript
interface ShopItem {
  id: string;
  name: string;
  description: string;
  category: 'food' | 'cosmetic' | 'powerup' | 'chest';

  // Display
  icon: string; // Emoji or image URL
  rarity?: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

  // Price
  coinCost?: number;
  gemCost?: number;

  // Requirements
  levelRequirement?: number;
  trackRequirement?: 'knowledge' | 'coolness' | 'culture';

  // Effects (for food/powerups)
  effects?: {
    happinessBoost?: number;
    hungerReduction?: number;
    energyBoost?: number;
    emotionTrigger?: 'happy' | 'love' | 'excited';
    xpBonus?: number;
    duration?: number; // Minutes (for powerups)
  };

  // Cultural food specific
  culture?: 'korean' | 'chinese' | 'japanese' | 'italian' | 'spanish' | 'mexican';

  // Limits
  dailyLimit?: number;
  weeklyLimit?: number;

  // State
  owned: boolean;
  ownedCount: number; // For stackable items (powerups, food)
  purchasedToday: number; // For daily limit tracking
  purchasedThisWeek: number; // For weekly limit tracking
}

// Example foods
const koreanFoods: ShopItem[] = [
  {
    id: 'food-kimchi',
    name: 'Kimchi',
    description: 'Traditional fermented vegetables',
    category: 'food',
    icon: '🥬',
    rarity: 'common',
    coinCost: 50,
    culture: 'korean',
    effects: {
      happinessBoost: 10,
      hungerReduction: 30,
      energyBoost: 5
    },
    owned: false,
    ownedCount: 0,
    purchasedToday: 0,
    purchasedThisWeek: 0
  },
  {
    id: 'food-tteokbokki',
    name: 'Tteokbokki',
    description: 'Spicy rice cakes',
    category: 'food',
    icon: '🍜',
    rarity: 'uncommon',
    coinCost: 100,
    culture: 'korean',
    effects: {
      happinessBoost: 15,
      hungerReduction: 40,
      emotionTrigger: 'love'
    },
    owned: false,
    ownedCount: 0,
    purchasedToday: 0,
    purchasedThisWeek: 0
  }
];

// Example cosmetic
const cosmeticItems: ShopItem[] = [
  {
    id: 'cosmetic-grad-cap',
    name: 'Graduation Cap',
    description: 'Classic academic headwear',
    category: 'cosmetic',
    icon: '🎓',
    coinCost: 200,
    levelRequirement: 5,
    trackRequirement: 'knowledge',
    owned: false,
    ownedCount: 0,
    purchasedToday: 0,
    purchasedThisWeek: 0
  }
];

// Example powerup
const powerupItems: ShopItem[] = [
  {
    id: 'powerup-2x-xp',
    name: '2x XP Boost',
    description: 'Double XP for 1 hour',
    category: 'powerup',
    icon: '2️⃣✖️',
    gemCost: 3,
    effects: {
      xpBonus: 100, // 100% bonus = 2x
      duration: 60 // Minutes
    },
    owned: false,
    ownedCount: 0,
    purchasedToday: 0,
    purchasedThisWeek: 0
  }
];
```

### **Treasure Chest**

```typescript
interface TreasureChest extends ShopItem {
  category: 'chest';
  contents: {
    coinRange: [number, number]; // [min, max]
    gemRange: [number, number];
    guaranteedItems: Array<{
      type: 'food' | 'cosmetic' | 'powerup';
      rarity?: string;
      count: number;
    }>;
  };
}

const basicChest: TreasureChest = {
  id: 'chest-basic',
  name: 'Basic Chest',
  description: 'Mystery rewards',
  category: 'chest',
  icon: '📦',
  coinCost: 250,
  dailyLimit: 5,
  contents: {
    coinRange: [50, 150],
    gemRange: [0, 2],
    guaranteedItems: [
      { type: 'food', count: 1 }
    ]
  },
  owned: false,
  ownedCount: 0,
  purchasedToday: 0,
  purchasedThisWeek: 0
};
```

---

## Progress Tracking

### **Learning Goals**

```typescript
interface LearningGoal {
  id: string;
  type: 'passages' | 'xp' | 'level' | 'words';
  title: string;
  target: number;
  progress: number;
  timeframe: 'week' | 'month' | 'custom';
  startDate: number;
  endDate: number;
  completed: boolean;
  completedAt?: number;
}

const exampleGoals: LearningGoal[] = [
  {
    id: 'goal-weekly-passages',
    type: 'passages',
    title: 'Complete 15 passages',
    target: 15,
    progress: 12,
    timeframe: 'week',
    startDate: Date.now() - 5 * 24 * 60 * 60 * 1000,
    endDate: Date.now() + 2 * 24 * 60 * 60 * 1000,
    completed: false
  },
  {
    id: 'goal-monthly-level',
    type: 'level',
    title: 'Reach Level 15',
    target: 15,
    progress: 12,
    timeframe: 'month',
    startDate: Date.now() - 20 * 24 * 60 * 60 * 1000,
    endDate: Date.now() + 10 * 24 * 60 * 60 * 1000,
    completed: false
  }
];
```

### **Language Progress**

```typescript
interface LanguageProgress {
  language: 'ko' | 'zh' | 'ja' | 'it' | 'es' | 'ar';

  // Vocabulary
  wordsLearned: number;
  wordsEncountered: string[]; // All unique words seen
  wordsLearned Words: string[]; // Words the user has mastered

  // Reading
  passagesRead: number;
  passagesAtLevel5Plus: number; // Blend level 5+
  averageBlendLevel: number;

  // Quiz
  quizAccuracy: number; // 0-100
  languageQuizzesTaken: number;
}

const koreanProgress: LanguageProgress = {
  language: 'ko',
  wordsLearned: 145,
  wordsEncountered: ['안녕하세요', '감사합니다', '우주비행사', '체육관', /* ... */],
  wordsLearnedWords: ['안녕하세요', '감사합니다', /* ... */],
  passagesRead: 23,
  passagesAtLevel5Plus: 8,
  averageBlendLevel: 4.2,
  quizAccuracy: 87,
  languageQuizzesTaken: 18
};
```

---

## localStorage Schema

All data stored under keys:

```typescript
const STORAGE_KEYS = {
  USER: 'readingAppV2_user',
  PET: 'readingAppV2_pet',
  ACHIEVEMENTS: 'readingAppV2_achievements',
  QUESTS: 'readingAppV2_quests',
  SETTINGS: 'readingAppV2_settings',
  READING_HISTORY: 'readingAppV2_readingHistory',
  QUIZ_HISTORY: 'readingAppV2_quizHistory',
  SHOP_INVENTORY: 'readingAppV2_shopInventory',
  PROGRESS: 'readingAppV2_progress',
  GOALS: 'readingAppV2_goals',
  LANGUAGE_PROGRESS: 'readingAppV2_languageProgress'
};

// Example storage
localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userState));
const storedUser: UserState = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER) || '{}');
```

---

## Mock Data for Development

### **Default User**

```typescript
const mockUser: UserState = {
  id: 'user-renzo-001',
  name: 'Renzo',
  avatar: '🎓',
  gradeLevel: '4th',
  level: 12,
  xp: 2450,
  xpToNextLevel: 3000,
  coins: 1250,
  gems: 15,
  streak: 7,
  longestStreak: 12,
  lastLoginDate: Date.now(),
  totalPassagesRead: 23,
  totalQuizzesCompleted: 18,
  totalXPEarned: 2450,
  settings: {
    // ... (full default settings)
  },
  createdAt: Date.now() - 20 * 24 * 60 * 60 * 1000, // 20 days ago
  updatedAt: Date.now()
};
```

### **Default Pet**

```typescript
const mockPet: PetState = {
  name: 'Flutterpuff',
  evolutionTrack: 'knowledge',
  evolutionStage: 2,
  happiness: 85,
  hunger: 30,
  energy: 60,
  emotion: 'happy',
  lastFed: Date.now() - 2 * 60 * 60 * 1000, // 2 hours ago
  lastPlayed: Date.now() - 5 * 60 * 60 * 1000, // 5 hours ago
  lastInteraction: Date.now() - 30 * 60 * 1000, // 30 min ago
  ownedAccessories: ['cosmetic-grad-cap', 'cosmetic-glasses', 'cosmetic-backpack'],
  equippedAccessories: ['cosmetic-grad-cap'],
  favoriteFood: 'food-bulgogi',
  foodsTriedHistory: ['food-kimchi', 'food-dumplings', 'food-tteokbokki', 'food-bulgogi', 'food-fried-rice', 'food-bibimbap'],
  evolutionHistory: [
    { stage: 0, name: 'Newbie', unlockedAt: Date.now() - 20 * 24 * 60 * 60 * 1000, level: 1 },
    { stage: 1, name: 'Kindergartener', unlockedAt: Date.now() - 12 * 24 * 60 * 60 * 1000, level: 4 },
    { stage: 2, name: 'Elementary', unlockedAt: Date.now() - 5 * 24 * 60 * 60 * 1000, level: 8 }
  ]
};
```

---

## Utility Functions

### **XP Calculations**

```typescript
// Calculate XP required for next level
function calculateXPRequired(level: number): number {
  return Math.floor(100 * Math.pow(level, 1.5));
}

// Calculate total XP for a given level
function calculateTotalXPForLevel(level: number): number {
  let total = 0;
  for (let i = 1; i < level; i++) {
    total += calculateXPRequired(i);
  }
  return total;
}

// Determine level from total XP
function getLevelFromXP(totalXP: number): number {
  let level = 1;
  let accumulatedXP = 0;

  while (accumulatedXP + calculateXPRequired(level) <= totalXP) {
    accumulatedXP += calculateXPRequired(level);
    level++;
  }

  return level;
}

// Award XP and check for level up
function awardXP(user: UserState, amount: number): { leveledUp: boolean, newLevel: number } {
  user.xp += amount;
  user.totalXPEarned += amount;

  const currentLevel = user.level;

  while (user.xp >= user.xpToNextLevel) {
    user.xp -= user.xpToNextLevel;
    user.level++;
    user.xpToNextLevel = calculateXPRequired(user.level);
  }

  return {
    leveledUp: user.level > currentLevel,
    newLevel: user.level
  };
}
```

### **Pet Calculations**

```typescript
// Decay hunger over time (1% per hour)
function updatePetHunger(pet: PetState): void {
  const hoursSinceLastFed = (Date.now() - pet.lastFed) / (1000 * 60 * 60);
  pet.hunger = Math.min(100, pet.hunger + Math.floor(hoursSinceLastFed));

  // Reduce happiness if very hungry
  if (pet.hunger > 70) {
    const happinessDecay = Math.floor((pet.hunger - 70) / 10);
    pet.happiness = Math.max(0, pet.happiness - happinessDecay);
  }
}

// Determine pet emotion based on stats
function determinePetEmotion(pet: PetState): PetState['emotion'] {
  if (pet.hunger > 70) return 'hungry';
  if (pet.hunger > 90) return 'angry';
  if (pet.happiness < 30) return 'sad';
  if (pet.happiness > 80) return 'happy';
  if (pet.energy < 20) return 'bored';
  return 'happy'; // Default
}

// Get pet image path
function getPetImagePath(pet: PetState): string {
  return `/assets/pet/${pet.evolutionTrack}/stage-${pet.evolutionStage}-${pet.emotion}.png`;
}
```

### **Achievement Progress**

```typescript
// Update achievement progress
function updateAchievementProgress(
  achievements: Achievement[],
  user: UserState,
  pet: PetState
): Achievement[] {
  return achievements.map(achievement => {
    if (achievement.unlocked) return achievement;

    let progress = 0;

    switch (achievement.requirement.type) {
      case 'passages_read':
        progress = user.totalPassagesRead;
        break;
      case 'quizzes_completed':
        progress = user.totalQuizzesCompleted;
        break;
      case 'streak_days':
        progress = user.streak;
        break;
      case 'level_reached':
        progress = user.level;
        break;
      case 'pet_evolution':
        progress = pet.evolutionStage;
        break;
      // ... handle other types
    }

    achievement.progress = progress;

    if (progress >= achievement.total && !achievement.unlocked) {
      achievement.unlocked = true;
      achievement.unlockedAt = Date.now();
    }

    return achievement;
  });
}
```

---

## Summary

This schema provides:
- ✅ Complete TypeScript interfaces for all data structures
- ✅ Mock data for development and testing
- ✅ localStorage keys for persistence
- ✅ Utility functions for calculations
- ✅ Ready for frontend implementation
- ✅ Extensible for future backend integration

**Next Steps:**
1. Implement React Context providers using these interfaces
2. Create custom hooks (useUser, usePet, useAchievements, etc.)
3. Build components with proper TypeScript types
4. Test with mock data before backend integration
