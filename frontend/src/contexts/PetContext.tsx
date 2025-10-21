import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import type { PetState, PetEmotion, PetEvolutionTrack, PetEvolutionStage, PetAction } from '../types/pet';

interface PetContextValue {
  pet: PetState;
  feedPet: (foodId?: string) => Promise<void>;
  playWithPet: () => Promise<void>;
  boostPet: () => Promise<void>;
  evolvePet: (newStage: PetEvolutionStage) => Promise<void>;
  changePetTrack: (track: PetEvolutionTrack) => Promise<void>;
  equipAccessory: (accessoryId: string) => Promise<void>;
  unequipAccessory: (accessoryId: string) => Promise<void>;
  updatePetName: (name: string) => Promise<void>;
  getCurrentEmotion: () => PetEmotion;
  isLoading: boolean;
}

const PetContext = createContext<PetContextValue | undefined>(undefined);

const BACKEND_URL = 'http://localhost:8080';

// Default pet state
const createDefaultPet = (): PetState => ({
  happiness: 50,
  hunger: 50,
  energy: 100,
  evolutionTrack: 'knowledge',
  evolutionStage: 0,
  evolutionHistory: [],
  name: 'Buddy',
  emotion: 'happy',
  lastFed: Date.now(),
  lastPlayed: Date.now(),
  lastInteraction: Date.now(),
  ownedAccessories: [],
  equippedAccessories: [],
  favoriteFood: null,
  foodsTriedHistory: [],
});

// Calculate pet emotion based on stats
const calculateEmotion = (happiness: number, hunger: number, energy: number): PetEmotion => {
  if (hunger > 80) return 'hungry';
  if (happiness < 20) return 'sad';
  if (energy < 20) return 'bored';
  if (happiness > 80 && hunger < 30 && energy > 60) return 'love';
  if (happiness > 70) return 'happy';
  if (happiness < 40) return 'angry';
  return 'excited';
};

export const PetProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [pet, setPet] = useState<PetState>(createDefaultPet);
  const [isLoading, setIsLoading] = useState(true);

  // Load pet from backend or localStorage
  useEffect(() => {
    const loadPet = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/pet`, {
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          setPet(data);
        } else {
          const stored = localStorage.getItem('readingApp_pet');
          if (stored) {
            setPet(JSON.parse(stored));
          } else {
            const newPet = createDefaultPet();
            setPet(newPet);
            localStorage.setItem('readingApp_pet', JSON.stringify(newPet));
          }
        }
      } catch (error) {
        console.error('Failed to load pet:', error);
        const stored = localStorage.getItem('readingApp_pet');
        if (stored) {
          setPet(JSON.parse(stored));
        } else {
          const newPet = createDefaultPet();
          setPet(newPet);
          localStorage.setItem('readingApp_pet', JSON.stringify(newPet));
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadPet();
  }, []);

  // Auto-update hunger every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setPet(prev => {
        const hoursSinceLastFed = (Date.now() - prev.lastFed) / (1000 * 60 * 60);
        const hungerIncrease = Math.floor(hoursSinceLastFed);
        const newHunger = Math.min(100, prev.hunger + hungerIncrease);
        const newEmotion = calculateEmotion(prev.happiness, newHunger, prev.energy);

        const updated = {
          ...prev,
          hunger: newHunger,
          emotion: newEmotion,
        };

        localStorage.setItem('readingApp_pet', JSON.stringify(updated));
        return updated;
      });
    }, 60000); // Every minute

    return () => clearInterval(interval);
  }, []);

  // Persist pet changes
  const persistPet = useCallback(async (updatedPet: PetState) => {
    setPet(updatedPet);
    localStorage.setItem('readingApp_pet', JSON.stringify(updatedPet));

    try {
      await fetch(`${BACKEND_URL}/api/pet`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(updatedPet),
      });
    } catch (error) {
      console.warn('Failed to sync pet with backend:', error);
    }
  }, []);

  const feedPet = useCallback(async (foodId?: string) => {
    const now = Date.now();
    const newHunger = Math.max(0, pet.hunger - 30);
    const newHappiness = Math.min(100, pet.happiness + 10);
    const newEmotion = calculateEmotion(newHappiness, newHunger, pet.energy);

    const updatedPet: PetState = {
      ...pet,
      hunger: newHunger,
      happiness: newHappiness,
      emotion: newEmotion,
      lastFed: now,
      lastInteraction: now,
      foodsTriedHistory: foodId && !pet.foodsTriedHistory.includes(foodId)
        ? [...pet.foodsTriedHistory, foodId]
        : pet.foodsTriedHistory,
    };

    await persistPet(updatedPet);
  }, [pet, persistPet]);

  const playWithPet = useCallback(async () => {
    const now = Date.now();
    const newHappiness = Math.min(100, pet.happiness + 20);
    const newEnergy = Math.max(0, pet.energy - 15);
    const newEmotion = calculateEmotion(newHappiness, pet.hunger, newEnergy);

    const updatedPet: PetState = {
      ...pet,
      happiness: newHappiness,
      energy: newEnergy,
      emotion: newEmotion,
      lastPlayed: now,
      lastInteraction: now,
    };

    await persistPet(updatedPet);
  }, [pet, persistPet]);

  const boostPet = useCallback(async () => {
    const now = Date.now();
    const newHappiness = Math.min(100, pet.happiness + 15);
    const newHunger = Math.max(0, pet.hunger - 15);
    const newEnergy = Math.min(100, pet.energy + 30);
    const newEmotion = calculateEmotion(newHappiness, newHunger, newEnergy);

    const updatedPet: PetState = {
      ...pet,
      happiness: newHappiness,
      hunger: newHunger,
      energy: newEnergy,
      emotion: newEmotion,
      lastInteraction: now,
    };

    await persistPet(updatedPet);
  }, [pet, persistPet]);

  const evolvePet = useCallback(async (newStage: PetEvolutionStage) => {
    const stageName = `Stage ${newStage}`;
    const updatedPet: PetState = {
      ...pet,
      evolutionStage: newStage,
      evolutionHistory: [
        ...pet.evolutionHistory,
        {
          stage: newStage,
          stageName,
          evolvedAt: Date.now(),
          userLevel: 0, // Will be updated from UserContext
        },
      ],
    };

    await persistPet(updatedPet);
  }, [pet, persistPet]);

  const changePetTrack = useCallback(async (track: PetEvolutionTrack) => {
    const updatedPet: PetState = {
      ...pet,
      evolutionTrack: track,
      evolutionStage: 0,
      evolutionHistory: [],
    };

    await persistPet(updatedPet);
  }, [pet, persistPet]);

  const equipAccessory = useCallback(async (accessoryId: string) => {
    if (pet.equippedAccessories.length >= 4) return;

    const updatedPet: PetState = {
      ...pet,
      equippedAccessories: [...pet.equippedAccessories, accessoryId],
    };

    await persistPet(updatedPet);
  }, [pet, persistPet]);

  const unequipAccessory = useCallback(async (accessoryId: string) => {
    const updatedPet: PetState = {
      ...pet,
      equippedAccessories: pet.equippedAccessories.filter(id => id !== accessoryId),
    };

    await persistPet(updatedPet);
  }, [pet, persistPet]);

  const updatePetName = useCallback(async (name: string) => {
    const updatedPet: PetState = {
      ...pet,
      name,
    };

    await persistPet(updatedPet);
  }, [pet, persistPet]);

  const getCurrentEmotion = useCallback((): PetEmotion => {
    return calculateEmotion(pet.happiness, pet.hunger, pet.energy);
  }, [pet]);

  const value: PetContextValue = {
    pet,
    feedPet,
    playWithPet,
    boostPet,
    evolvePet,
    changePetTrack,
    equipAccessory,
    unequipAccessory,
    updatePetName,
    getCurrentEmotion,
    isLoading,
  };

  return <PetContext.Provider value={value}>{children}</PetContext.Provider>;
};

export const usePet = () => {
  const context = useContext(PetContext);
  if (!context) {
    throw new Error('usePet must be used within PetProvider');
  }
  return context;
};
