// XP, Achievements, Quests, Shop types
export interface Achievement {
  id: string;
  name: string;
  description: string;
  category: 'reading' | 'quiz' | 'streak' | 'language' | 'pet' | 'xp' | 'collection';
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

  // Unlock criteria
  unlockCriteria: {
    type: string; // e.g., 'complete_readings', 'maintain_streak'
    target: number;
    current?: number; // Progress towards target
  };

  // Rewards
  xpReward: number;
  gemsReward: number;

  // Status
  unlocked: boolean;
  unlockedAt?: number; // Unix timestamp

  // Display
  iconUrl: string;
  badgeColor: string;
}

export interface Quest {
  id: string;
  type: 'daily' | 'weekly';
  name: string;
  description: string;

  // Requirements
  goal: number;
  current: number;

  // Rewards
  xpReward: number;
  coinsReward: number;
  gemsReward?: number;

  // Status
  completed: boolean;
  claimed: boolean;
  expiresAt: number; // Unix timestamp

  // Display
  iconUrl: string;
}

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  category: 'food' | 'cosmetic' | 'powerup' | 'treasure';

  // Pricing
  costCoins?: number;
  costGems?: number;

  // Availability
  rarity: 'common' | 'uncommon' | 'rare' | 'epic';
  limited: boolean; // Time-limited items
  limitedUntil?: number; // Unix timestamp

  // Effects (for food and powerups)
  effects?: {
    happiness?: number;
    hunger?: number;
    energy?: number;
    xpBoost?: number;
  };

  // Display
  imageUrl: string;
  owned: boolean;
}
