// Quest and daily/weekly challenge types
export type QuestFrequency = 'daily' | 'weekly';
export type QuestCategory = 'reading' | 'quiz' | 'streak' | 'achievement' | 'language' | 'xp';
export type QuestStatus = 'active' | 'completed' | 'claimed' | 'expired';

export interface Quest {
  id: string;
  title: string;
  description: string;
  icon: string; // Emoji icon
  frequency: QuestFrequency;
  category: QuestCategory;

  // Progress tracking
  currentProgress: number;
  targetProgress: number;
  status: QuestStatus;

  // Rewards
  rewards: QuestRewards;

  // Timing
  expiresAt: number; // Unix timestamp
  completedAt?: number;
  claimedAt?: number;
}

export interface QuestRewards {
  xp: number;
  coins: number;
  gems: number;
}

export interface DailyQuestsState {
  quests: Quest[];
  resetTime: number; // Next reset timestamp
}

export interface WeeklyQuestsState {
  quests: Quest[];
  resetTime: number; // Next reset timestamp
}
