import { useState, useCallback } from 'react';
import type { PetState, PetEvolutionStage, EvolutionHistoryEntry } from '@/types/pet';
import {
  canEvolveToNextStage,
  getNextEvolutionInfo,
  EVOLUTION_STAGE_NAMES,
} from '@/data/petEvolution';

interface UsePetEvolutionProps {
  pet: PetState;
  userLevel: number;
  onPetUpdate: (updatedPet: PetState) => void;
}

interface UsePetEvolutionReturn {
  showAnimation: boolean;
  showModal: boolean;
  newStage: PetEvolutionStage | null;
  handleAnimationComplete: () => void;
  handleModalClose: () => void;
  checkEvolution: () => void;
  nextEvolutionInfo: ReturnType<typeof getNextEvolutionInfo>;
}

export function usePetEvolution({
  pet,
  userLevel,
  onPetUpdate,
}: UsePetEvolutionProps): UsePetEvolutionReturn {
  const [showAnimation, setShowAnimation] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [newStage, setNewStage] = useState<PetEvolutionStage | null>(null);

  // Get next evolution information
  const nextEvolutionInfo = getNextEvolutionInfo(pet.evolutionTrack, pet.evolutionStage, userLevel);

  // Check if pet can evolve (manual trigger only)
  const checkEvolution = useCallback(() => {
    // Check if already evolved at this level
    const alreadyEvolvedAtLevel = pet.evolutionHistory.some(
      (entry) => entry.userLevel === userLevel && entry.stage === pet.evolutionStage
    );

    if (alreadyEvolvedAtLevel) {
      // Already evolved at this level, don't trigger again
      return;
    }

    if (canEvolveToNextStage(pet.evolutionStage, userLevel)) {
      // Start evolution sequence
      const nextStage = (pet.evolutionStage + 1) as PetEvolutionStage;
      setNewStage(nextStage);
      setShowAnimation(true);
    }
  }, [pet.evolutionStage, pet.evolutionHistory, userLevel]);

  // Handle animation completion
  const handleAnimationComplete = useCallback(() => {
    setShowAnimation(false);

    if (newStage !== null) {
      // Update pet state with new evolution
      const evolutionEntry: EvolutionHistoryEntry = {
        stage: newStage,
        stageName: EVOLUTION_STAGE_NAMES[pet.evolutionTrack][newStage],
        evolvedAt: Date.now(),
        userLevel,
      };

      const updatedPet: PetState = {
        ...pet,
        evolutionStage: newStage,
        evolutionHistory: [...pet.evolutionHistory, evolutionEntry],
        happiness: Math.min(100, pet.happiness + 20), // Boost happiness on evolution
        emotion: 'excited', // Pet is excited about evolution
      };

      onPetUpdate(updatedPet);

      // Show modal after animation
      setShowModal(true);
    }
  }, [newStage, pet, userLevel, onPetUpdate]);

  // Handle modal close
  const handleModalClose = useCallback(() => {
    setShowModal(false);
    setNewStage(null);
  }, []);

  return {
    showAnimation,
    showModal,
    newStage,
    handleAnimationComplete,
    handleModalClose,
    checkEvolution,
    nextEvolutionInfo,
  };
}
