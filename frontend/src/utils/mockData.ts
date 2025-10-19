import type { UserState } from '@/types/user';
import type { PetState } from '@/types/pet';
import type { Quest } from '@/types/quest';
import type { Achievement } from '@/types/achievement';

// Mock user data for Dashboard
export const mockUser: UserState = {
  id: 'user_123',
  name: 'Renzo',
  avatar: '🎓',
  level: 12,
  xp: 2450,
  xpToNextLevel: 3000,
  coins: 1250,
  gems: 15,
  streak: 7,
  lastLogin: Date.now(),
  stats: {
    totalReadings: 45,
    totalQuizzes: 38,
    totalCorrectAnswers: 152,
    totalWords: 12450,
    averageQuizScore: 87,
    longestStreak: 12,
  },
  settings: {
    primaryLanguage: 'en',
    secondaryLanguage: 'ko',
    languageBlendLevel: 4,
    showHints: true,
    showRomanization: true,
    theme: 'space',
    audioEnabled: true,
    audioSpeed: 1.0,
    fontSize: 'normal',
    highContrast: false,
    reducedMotion: false,
    parentalConsentGiven: true,
  },
};

// Mock pet data for Dashboard
export const mockPet: PetState = {
  happiness: 85,
  hunger: 30,
  energy: 60,
  evolutionTrack: 'knowledge',
  evolutionStage: 2,
  evolutionHistory: [
    {
      stage: 0,
      stageName: 'Newbie',
      evolvedAt: Date.now() - 30 * 24 * 60 * 60 * 1000, // 30 days ago
      userLevel: 1,
    },
    {
      stage: 1,
      stageName: 'Kindergartener',
      evolvedAt: Date.now() - 20 * 24 * 60 * 60 * 1000, // 20 days ago
      userLevel: 4,
    },
    {
      stage: 2,
      stageName: 'Elementary',
      evolvedAt: Date.now() - 10 * 24 * 60 * 60 * 1000, // 10 days ago
      userLevel: 8,
    },
  ],
  name: 'Flutterpuff',
  emotion: 'happy',
  lastFed: Date.now() - 2 * 60 * 60 * 1000, // 2 hours ago
  lastPlayed: Date.now() - 1 * 60 * 60 * 1000, // 1 hour ago
  lastInteraction: Date.now() - 30 * 60 * 1000, // 30 min ago
  ownedAccessories: [],
  equippedAccessories: [],
  favoriteFood: null,
  foodsTriedHistory: [],
};

// Mock daily quests for Dashboard
export const mockDailyQuests: Quest[] = [
  {
    id: 'daily_reading_1',
    title: 'Daily Reader',
    description: 'Complete 3 reading passages',
    icon: '📖',
    frequency: 'daily',
    category: 'reading',
    currentProgress: 2,
    targetProgress: 3,
    status: 'active',
    rewards: {
      xp: 100,
      coins: 50,
      gems: 0,
    },
    expiresAt: Date.now() + 18 * 60 * 60 * 1000 + 45 * 60 * 1000 + 23 * 1000, // 18:45:23 from now
  },
  {
    id: 'daily_quiz_1',
    title: 'Quiz Master',
    description: 'Score 80%+ on 2 quizzes',
    icon: '🎯',
    frequency: 'daily',
    category: 'quiz',
    currentProgress: 1,
    targetProgress: 2,
    status: 'active',
    rewards: {
      xp: 150,
      coins: 75,
      gems: 1,
    },
    expiresAt: Date.now() + 18 * 60 * 60 * 1000 + 45 * 60 * 1000 + 23 * 1000,
  },
  {
    id: 'daily_streak_1',
    title: 'Streak Bonus',
    description: 'Maintain your daily streak',
    icon: '🔥',
    frequency: 'daily',
    category: 'streak',
    currentProgress: 1,
    targetProgress: 1,
    status: 'completed',
    rewards: {
      xp: 500, // 10x bonus for consistency
      coins: 250, // 10x bonus for consistency
      gems: 0,
    },
    expiresAt: Date.now() + 18 * 60 * 60 * 1000 + 45 * 60 * 1000 + 23 * 1000,
    completedAt: Date.now() - 2 * 60 * 60 * 1000, // Completed 2 hours ago
  },
];

// Mock weekly quests for Dashboard
export const mockWeeklyQuests: Quest[] = [
  {
    id: 'weekly_xp_1',
    title: 'Rising Star',
    description: 'Earn 1000 XP this week',
    icon: '🌟',
    frequency: 'weekly',
    category: 'xp',
    currentProgress: 650,
    targetProgress: 1000,
    status: 'active',
    rewards: {
      xp: 500,
      coins: 200,
      gems: 3,
    },
    expiresAt: Date.now() + 5 * 24 * 60 * 60 * 1000, // 5 days from now
  },
  {
    id: 'weekly_achievement_1',
    title: 'Achievement Hunter',
    description: 'Unlock 2 new achievements',
    icon: '🏆',
    frequency: 'weekly',
    category: 'achievement',
    currentProgress: 1,
    targetProgress: 2,
    status: 'active',
    rewards: {
      xp: 300,
      coins: 150,
      gems: 2,
    },
    expiresAt: Date.now() + 5 * 24 * 60 * 60 * 1000,
  },
];

// Mock achievements for Dashboard stats
export const mockAchievements: Achievement[] = [
  {
    id: 'ach_first_reading',
    title: 'First Steps',
    description: 'Complete your first reading passage',
    icon: '📖',
    category: 'reading',
    rarity: 'common',
    requirement: 'Complete 1 reading passage',
    targetValue: 1,
    xp: 50,
    coins: 25,
    gems: 0,
    unlocked: true,
    currentProgress: 1,
    unlockedAt: Date.now() - 30 * 24 * 60 * 60 * 1000, // 30 days ago
  },
  {
    id: 'ach_10_readings',
    title: 'Bookworm',
    description: 'Complete 10 reading passages',
    icon: '📚',
    category: 'reading',
    rarity: 'common',
    requirement: 'Complete 10 reading passages',
    targetValue: 10,
    xp: 100,
    coins: 50,
    gems: 1,
    unlocked: true,
    currentProgress: 10,
    unlockedAt: Date.now() - 15 * 24 * 60 * 60 * 1000, // 15 days ago
  },
  // Add more achievements for testing (8 unlocked, 16 locked)
  // Total: 24 achievements, 8 unlocked (33%)
];
