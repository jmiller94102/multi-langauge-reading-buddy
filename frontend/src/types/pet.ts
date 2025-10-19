// Virtual pet (Tamagotchi) types
export type PetEmotion = 'happy' | 'sad' | 'angry' | 'hungry' | 'excited' | 'bored' | 'love';
export type PetEvolutionTrack = 'knowledge' | 'coolness' | 'culture';
export type PetEvolutionStage = 0 | 1 | 2 | 3 | 4 | 5 | 6; // 7 stages

export interface EvolutionHistoryEntry {
  stage: number;
  stageName: string;
  evolvedAt: number; // timestamp
  userLevel: number;
}

export interface PetState {
  // Core stats
  happiness: number; // 0-100
  hunger: number; // 0-100 (increases 1% per hour)
  energy: number; // 0-100 (decreases with activity)

  // Evolution
  evolutionTrack: PetEvolutionTrack;
  evolutionStage: PetEvolutionStage;
  evolutionHistory: EvolutionHistoryEntry[];

  // Identity
  name: string;
  emotion: PetEmotion;

  // Timestamps
  lastFed: number; // Unix timestamp
  lastPlayed: number;
  lastInteraction: number;

  // Items/Accessories
  ownedAccessories: string[]; // All unlocked cosmetics
  equippedAccessories: string[]; // Currently equipped (max 4)
  favoriteFood: string | null; // Cultural food preference
  foodsTriedHistory: string[]; // Food IDs tried
}

export interface PetAction {
  type: 'feed' | 'play' | 'boost' | 'giveCulturalFood';
  foodId?: string; // For cultural food
  timestamp: number;
}

export interface PetEvolution {
  track: PetEvolutionTrack;
  stage: PetEvolutionStage;
  name: string;
  visualConcept: string;
  description: string;
  levelRequired: number;
  imageUrl: string; // Path to pet image
}
