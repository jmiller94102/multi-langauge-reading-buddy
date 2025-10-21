import type { Cosmetic, PowerUp, TreasureChest } from '@/types/shop';

// Cosmetics - Pet Accessories
export const COSMETICS: Cosmetic[] = [
  // Knowledge Track
  {
    id: 'graduate-cap',
    name: 'Graduation Cap',
    description: 'Classic academic achievement symbol',
    icon: '🎓',
    category: 'cosmetics',
    type: 'hat',
    price: 200,
    evolutionTrack: 'knowledge',
    levelRequirement: 5,
    rarity: 'common',
  },
  {
    id: 'reading-glasses',
    name: 'Reading Glasses',
    description: 'For the scholarly pet',
    icon: '👓',
    category: 'cosmetics',
    type: 'accessory',
    price: 400,
    evolutionTrack: 'knowledge',
    levelRequirement: 10,
    rarity: 'uncommon',
  },
  {
    id: 'backpack',
    name: 'Scholar Backpack',
    description: 'Packed with learning materials',
    icon: '🎒',
    category: 'cosmetics',
    type: 'accessory',
    gemPrice: 5,
    price: 0,
    evolutionTrack: 'knowledge',
    levelRequirement: 15,
    rarity: 'rare',
  },
  {
    id: 'book-stack',
    name: 'Book Stack',
    description: 'Surrounded by knowledge',
    icon: '📚',
    category: 'cosmetics',
    type: 'background',
    gemPrice: 10,
    price: 0,
    evolutionTrack: 'knowledge',
    levelRequirement: 20,
    rarity: 'epic',
  },

  // Coolness Track
  {
    id: 'sunglasses',
    name: 'Cool Sunglasses',
    description: 'The essence of cool',
    icon: '😎',
    category: 'cosmetics',
    type: 'accessory',
    price: 250,
    evolutionTrack: 'coolness',
    levelRequirement: 5,
    rarity: 'common',
  },
  {
    id: 'guitar',
    name: 'Rock Guitar',
    description: 'Ready to rock and roll',
    icon: '🎸',
    category: 'cosmetics',
    type: 'accessory',
    gemPrice: 5,
    price: 0,
    evolutionTrack: 'coolness',
    levelRequirement: 10,
    rarity: 'uncommon',
  },
  {
    id: 'crown',
    name: 'Royal Crown',
    description: 'Rule in style',
    icon: '👑',
    category: 'cosmetics',
    type: 'hat',
    gemPrice: 15,
    price: 0,
    evolutionTrack: 'coolness',
    levelRequirement: 15,
    rarity: 'epic',
  },
  {
    id: 'trophy',
    name: 'Victory Trophy',
    description: 'Champion of champions',
    icon: '🏆',
    category: 'cosmetics',
    type: 'background',
    gemPrice: 25,
    price: 0,
    evolutionTrack: 'coolness',
    levelRequirement: 20,
    rarity: 'legendary',
  },

  // Culture Track
  {
    id: 'fan',
    name: 'Traditional Fan',
    description: 'Elegant cultural accessory',
    icon: '🪭',
    category: 'cosmetics',
    type: 'accessory',
    price: 220,
    evolutionTrack: 'culture',
    levelRequirement: 5,
    rarity: 'common',
  },
  {
    id: 'lantern',
    name: 'Paper Lantern',
    description: 'Lights the way',
    icon: '🏮',
    category: 'cosmetics',
    type: 'background',
    gemPrice: 5,
    price: 0,
    evolutionTrack: 'culture',
    levelRequirement: 10,
    rarity: 'uncommon',
  },
  {
    id: 'kimono',
    name: 'Traditional Kimono',
    description: 'Beautiful cultural outfit',
    icon: '👘',
    category: 'cosmetics',
    type: 'outfit',
    gemPrice: 12,
    price: 0,
    evolutionTrack: 'culture',
    levelRequirement: 15,
    rarity: 'rare',
  },
  {
    id: 'blossom',
    name: 'Cherry Blossom',
    description: 'Spring beauty',
    icon: '🌸',
    category: 'cosmetics',
    type: 'background',
    gemPrice: 20,
    price: 0,
    evolutionTrack: 'culture',
    levelRequirement: 20,
    rarity: 'epic',
  },
];

// Power-Ups - Temporary Boosts
export const POWER_UPS: PowerUp[] = [
  {
    id: 'xp-boost',
    name: '2x XP Boost',
    description: 'Double XP for 1 hour',
    icon: '2️⃣✖️',
    category: 'powerups',
    gemPrice: 3,
    price: 0,
    effect: 'Double all XP earned',
    duration: 60, // 60 minutes
    stackable: false,
    rarity: 'rare',
  },
  {
    id: 'hint-token',
    name: 'Hint Token',
    description: 'Get one free hint in quiz',
    icon: '🔮',
    category: 'powerups',
    price: 25,
    effect: 'Free hint in next quiz',
    stackable: true,
    rarity: 'common',
  },
  {
    id: 'perfect-shot',
    name: 'Perfect Shot',
    description: 'Guarantee next quiz is perfect',
    icon: '🎯',
    category: 'powerups',
    gemPrice: 10,
    price: 0,
    effect: 'Next quiz automatically perfect',
    stackable: false,
    rarity: 'epic',
  },
  {
    id: 'auto-complete',
    name: 'Auto-Complete',
    description: 'Finish current reading instantly',
    icon: '🌟',
    category: 'powerups',
    gemPrice: 5,
    price: 0,
    effect: 'Complete current reading passage',
    stackable: false,
    rarity: 'rare',
  },
  {
    id: 'coin-doubler',
    name: 'Coin Doubler',
    description: 'Double coins earned for 30 min',
    icon: '🪙✨',
    category: 'powerups',
    gemPrice: 2,
    price: 0,
    effect: 'Double all coins earned',
    duration: 30,
    stackable: false,
    rarity: 'uncommon',
  },
];

// Treasure Chests - Mystery Rewards
export const TREASURE_CHESTS: TreasureChest[] = [
  {
    id: 'basic-chest',
    name: 'Basic Chest',
    description: 'Small rewards for everyday learning',
    icon: '📦',
    category: 'chests',
    price: 250,
    contents: {
      coinsMin: 50,
      coinsMax: 150,
      gemsMin: 0,
      gemsMax: 2,
      items: ['1 random food', 'Small XP bonus'],
    },
    dailyLimit: 5,
    rarity: 'common',
  },
  {
    id: 'premium-chest',
    name: 'Premium Chest',
    description: 'Better rewards for dedicated learners',
    icon: '🎁',
    category: 'chests',
    gemPrice: 10,
    price: 0,
    contents: {
      coinsMin: 200,
      coinsMax: 500,
      gemsMin: 5,
      gemsMax: 15,
      items: ['1 random cosmetic', '1 power-up', 'Large XP bonus'],
    },
    dailyLimit: 2,
    rarity: 'rare',
  },
  {
    id: 'legendary-chest',
    name: 'Legendary Chest',
    description: 'Epic rewards for true champions',
    icon: '💎',
    category: 'chests',
    gemPrice: 50,
    price: 0,
    contents: {
      coinsMin: 500,
      coinsMax: 1000,
      gemsMin: 20,
      gemsMax: 50,
      items: ['1 legendary cosmetic', '3 power-ups', 'Rare pet accessory', 'Massive XP bonus'],
    },
    weeklyLimit: 1,
    rarity: 'legendary',
  },
];

// Helper functions
export function getCosmeticsByTrack(track: 'knowledge' | 'coolness' | 'culture'): Cosmetic[] {
  return COSMETICS.filter(c => c.evolutionTrack === track);
}

export function getAffordableCosmetics(coins: number, gems: number, userLevel: number): Cosmetic[] {
  return COSMETICS.filter(c => {
    const canAfford = c.gemPrice ? gems >= c.gemPrice : coins >= c.price;
    const meetsLevel = userLevel >= c.levelRequirement;
    return canAfford && meetsLevel;
  });
}

export function getAffordablePowerUps(coins: number, gems: number): PowerUp[] {
  return POWER_UPS.filter(p => {
    return p.gemPrice ? gems >= p.gemPrice : coins >= p.price;
  });
}

export function getCosmeticById(id: string): Cosmetic | undefined {
  return COSMETICS.find(c => c.id === id);
}

export function getPowerUpById(id: string): PowerUp | undefined {
  return POWER_UPS.find(p => p.id === id);
}

export function getChestById(id: string): TreasureChest | undefined {
  return TREASURE_CHESTS.find(c => c.id === id);
}
