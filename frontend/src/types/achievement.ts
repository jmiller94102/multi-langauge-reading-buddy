// Achievement and badge types
export type AchievementCategory = 'reading' | 'quiz' | 'streak' | 'language' | 'pet' | 'xp' | 'collection';
export type AchievementRarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string; // Emoji icon
  category: AchievementCategory;
  rarity: AchievementRarity;

  // Requirements
  requirement: string; // Human-readable requirement
  targetValue: number;

  // Rewards
  xp: number;
  coins: number;
  gems: number;

  // Tracking
  unlocked: boolean;
  currentProgress: number;
  unlockedAt?: number; // Unix timestamp
}

export interface AchievementProgress {
  achievementId: string;
  currentProgress: number;
  unlocked: boolean;
  unlockedAt?: number;
}
