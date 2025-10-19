import type { PetEvolutionTrack, PetEvolutionStage } from '@/types/pet';

/**
 * Pet Evolution System Data
 * Based on docs/pet-evolution-system.md
 */

// Evolution stage names by track
export const EVOLUTION_STAGE_NAMES: Record<
  PetEvolutionTrack,
  Record<PetEvolutionStage, string>
> = {
  knowledge: {
    0: 'Newbie',
    1: 'Kindergartener',
    2: 'Elementary',
    3: 'Middle Schooler',
    4: 'High Schooler',
    5: 'College Graduate',
    6: 'PhD Scholar',
  },
  coolness: {
    0: 'Plain Egg',
    1: 'Street Style',
    2: 'Cool Kid',
    3: 'Trendsetter',
    4: 'Style Icon',
    5: 'Influencer',
    6: 'Pop Star',
  },
  culture: {
    0: 'Homebody',
    1: 'Town Explorer',
    2: 'Regional Traveler',
    3: 'National Wanderer',
    4: 'Continental Voyager',
    5: 'World Citizen',
    6: 'Universal Spirit',
  },
};

// User level required for each evolution stage
export const EVOLUTION_LEVEL_REQUIREMENTS: Record<PetEvolutionStage, number> = {
  0: 1, // Starting stage
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 25,
};

// XP required for each level (Formula: 100 * level^1.5)
export function calculateXPForLevel(level: number): number {
  return Math.floor(100 * Math.pow(level, 1.5));
}

// Get cumulative XP needed to reach a level
export function getCumulativeXP(targetLevel: number): number {
  let total = 0;
  for (let level = 1; level < targetLevel; level++) {
    total += calculateXPForLevel(level);
  }
  return total;
}

// Track-specific bonuses by stage
export const TRACK_BONUSES = {
  knowledge: {
    // XP multiplier bonuses
    0: { xpBonus: 0, description: 'Base XP' },
    1: { xpBonus: 5, description: '+5% XP bonus for completing first quiz of the day' },
    2: { xpBonus: 10, description: '+10% XP bonus for reading passages at grade level' },
    3: { xpBonus: 15, description: '+15% XP bonus, unlocks advanced vocabulary challenges' },
    4: { xpBonus: 20, description: '+20% XP bonus, unlocks bonus quizzes with extra rewards' },
    5: {
      xpBonus: 25,
      description: '+25% XP bonus, unlocks mentor mode (review past quizzes for bonus XP)',
    },
    6: {
      xpBonus: 30,
      description: '+30% XP bonus, daily wisdom quotes, unlocks "perfect passage" challenges',
    },
  },
  coolness: {
    // Coin bonuses
    0: { coinBonus: 0, description: 'Base coins' },
    1: { coinBonus: 5, description: '+5 coins bonus for creative story prompts' },
    2: { coinBonus: 10, description: '+10 coins bonus for stories with humor level 3+' },
    3: { coinBonus: 15, description: '+15 coins bonus, unlocks exclusive cosmetics in shop' },
    4: { coinBonus: 20, description: "+20 coins bonus, pet's outfit changes daily automatically" },
    5: {
      coinBonus: 25,
      description: '+25 coins bonus, achievements shared with "followers" (visual effect)',
    },
    6: {
      coinBonus: 30,
      description: '+30 coins bonus, daily concert animation, unlocks "encore" mode for bonus XP',
    },
  },
  culture: {
    // Language XP bonuses (applied when blend level 7-10)
    0: { languageBonus: 0, description: 'Base language XP' },
    1: { languageBonus: 5, description: '+5% bonus XP for trying new language words' },
    2: {
      languageBonus: 10,
      description: '+10% bonus XP, loves Korean and Chinese cultural foods',
    },
    3: {
      languageBonus: 15,
      description: '+15% bonus XP, unlocks cultural trivia quizzes',
    },
    4: {
      languageBonus: 20,
      description: '+20% bonus XP for high blend level reading (7-10)',
    },
    5: {
      languageBonus: 25,
      description: '+25% bonus XP, daily cultural fact, bonus for diverse vocabulary',
    },
    6: {
      languageBonus: 30,
      description:
        '+30% bonus XP, perfect understanding of all languages, unlocks "universal stories"',
    },
  },
};

// Get bonus description for a specific track and stage
export function getBonusForStage(track: PetEvolutionTrack, stage: PetEvolutionStage) {
  return TRACK_BONUSES[track][stage];
}

// Check if user can evolve to next stage
export function canEvolveToNextStage(
  currentStage: PetEvolutionStage,
  userLevel: number
): boolean {
  const nextStage = (currentStage + 1) as PetEvolutionStage;
  if (nextStage > 6) return false; // Max stage is 6

  const requiredLevel = EVOLUTION_LEVEL_REQUIREMENTS[nextStage];
  return userLevel >= requiredLevel;
}

// Get next evolution stage info
export function getNextEvolutionInfo(
  track: PetEvolutionTrack,
  currentStage: PetEvolutionStage,
  userLevel: number
) {
  const nextStage = (currentStage + 1) as PetEvolutionStage;
  if (nextStage > 6) {
    return {
      canEvolve: false,
      nextStage: null,
      nextStageName: null,
      requiredLevel: null,
      levelsRemaining: null,
    };
  }

  const requiredLevel = EVOLUTION_LEVEL_REQUIREMENTS[nextStage];
  const nextStageName = EVOLUTION_STAGE_NAMES[track][nextStage];
  const canEvolve = userLevel >= requiredLevel;
  const levelsRemaining = Math.max(0, requiredLevel - userLevel);

  return {
    canEvolve,
    nextStage,
    nextStageName,
    requiredLevel,
    levelsRemaining,
  };
}

// Calculate total bonus multiplier for XP
export function calculateXPMultiplier(track: PetEvolutionTrack, stage: PetEvolutionStage): number {
  const bonus = TRACK_BONUSES[track][stage];
  if ('xpBonus' in bonus) {
    return 1 + bonus.xpBonus / 100; // e.g., 5% = 1.05
  }
  if ('languageBonus' in bonus && track === 'culture') {
    return 1 + bonus.languageBonus / 100;
  }
  return 1; // No XP bonus
}

// Calculate coin bonus
export function calculateCoinBonus(track: PetEvolutionTrack, stage: PetEvolutionStage): number {
  const bonus = TRACK_BONUSES[track][stage];
  if ('coinBonus' in bonus) {
    return bonus.coinBonus; // Flat coin bonus
  }
  return 0;
}

// Get track-specific favorite foods
export const TRACK_FAVORITE_FOODS: Record<PetEvolutionTrack, string[]> = {
  knowledge: ['bibimbap', 'peking-duck'], // Balanced meal, celebratory food
  coolness: ['tteokbokki', 'fried-rice'], // Trendy street food, quick and tasty
  culture: ['kimchi', 'dumplings'], // Traditional, symbolic
};

// Food effects
export interface FoodEffect {
  happinessChange: number;
  hungerReduction: number;
  bonusType?: 'xp' | 'coins' | 'language';
  bonusAmount?: number;
  message: string;
}

// Get food reaction for pet
export function getFoodReaction(
  foodId: string,
  petTrack: PetEvolutionTrack
): { emotion: string; effect: FoodEffect } {
  const isFavorite = TRACK_FAVORITE_FOODS[petTrack].includes(foodId);
  const isCulturalFood = Object.values(TRACK_FAVORITE_FOODS)
    .flat()
    .includes(foodId);

  if (isFavorite) {
    return {
      emotion: 'love',
      effect: {
        happinessChange: 15,
        hungerReduction: 35,
        bonusType: petTrack === 'knowledge' ? 'xp' : petTrack === 'coolness' ? 'coins' : 'language',
        bonusAmount: 10,
        message: `LOVES ${foodId}! ❤️`,
      },
    };
  }

  if (isCulturalFood) {
    return {
      emotion: 'happy',
      effect: {
        happinessChange: 10,
        hungerReduction: 30,
        message: `Enjoyed the ${foodId}! 😊`,
      },
    };
  }

  return {
    emotion: 'neutral',
    effect: {
      happinessChange: 5,
      hungerReduction: 25,
      message: `Ate the ${foodId}.`,
    },
  };
}
