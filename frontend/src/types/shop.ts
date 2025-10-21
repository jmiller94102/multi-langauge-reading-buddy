// Shop-related types

export type ShopCategory = 'foods' | 'cosmetics' | 'powerups' | 'chests' | 'specials';
export type ItemRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
export type CosmeticType = 'hat' | 'accessory' | 'outfit' | 'background';
export type EvolutionTrack = 'knowledge' | 'coolness' | 'culture';

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: ShopCategory;
  price: number; // in coins
  gemPrice?: number; // optional gem price
  rarity?: ItemRarity;
}

export interface Cosmetic extends ShopItem {
  category: 'cosmetics';
  type: CosmeticType;
  evolutionTrack: EvolutionTrack;
  levelRequirement: number;
}

export interface PowerUp extends ShopItem {
  category: 'powerups';
  effect: string;
  duration?: number; // in minutes, undefined for one-time use
  stackable: boolean;
}

export interface TreasureChest extends ShopItem {
  category: 'chests';
  contents: {
    coinsMin: number;
    coinsMax: number;
    gemsMin: number;
    gemsMax: number;
    items: string[]; // descriptions of possible items
  };
  dailyLimit?: number;
  weeklyLimit?: number;
}

export interface SpecialBundle extends ShopItem {
  category: 'specials';
  contents: {
    coins?: number;
    gems?: number;
    powerUps?: string[];
    foods?: string[];
    cosmetics?: string[];
  };
  regularPrice: number;
  discount: number; // percentage
  expiresAt?: number; // Unix timestamp
}

export interface UserInventory {
  foods: string[]; // food IDs
  cosmetics: string[]; // cosmetic IDs
  powerUps: Map<string, number>; // powerUpId -> count
  equippedCosmetics: {
    hat?: string;
    accessory?: string;
    outfit?: string;
    background?: string;
  };
}
