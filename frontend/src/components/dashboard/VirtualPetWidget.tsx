import React, { useState } from 'react';
import type { PetState } from '@/types/pet';
import { Button } from '@/components/common/Button';
import { EVOLUTION_STAGE_NAMES } from '@/data/petEvolution';
import { PetCharacter } from '@/components/pet/PetCharacter';
import { FoodMenu } from '@/components/pet/FoodMenu';

interface VirtualPetWidgetProps {
  pet: PetState;
  coins: number;
  gems: number;
  onFeedFood: (foodId: string, price: number) => void;
  onPlay: () => void;
  onBoost: () => void;
  nextEvolutionInfo?: {
    canEvolve: boolean;
    nextStage: number | null;
    nextStageName: string | null;
    requiredLevel: number | null;
    levelsRemaining: number | null;
  };
}

export const VirtualPetWidget: React.FC<VirtualPetWidgetProps> = ({
  pet,
  coins,
  gems,
  onFeedFood,
  onPlay,
  onBoost,
  nextEvolutionInfo,
}) => {
  const [showFoodMenu, setShowFoodMenu] = useState(false);

  // Determine status color based on stats
  const getStatColor = (value: number) => {
    if (value >= 70) return 'bg-green-500';
    if (value >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  // Get current stage name
  const currentStageName = EVOLUTION_STAGE_NAMES[pet.evolutionTrack][pet.evolutionStage];

  // Evolution progress calculation
  const evolutionProgress = pet.evolutionStage >= 6
    ? 100 // Max stage reached
    : ((pet.evolutionStage) / 6) * 100; // Stages 0-6, show overall progress

  // Check if actions are affordable
  const canFeed = coins >= 10; // Minimum food costs 10 coins
  const canPlay = pet.energy >= 20; // Playing requires 20 energy
  const canBoost = gems >= 1; // Boost costs 1 gem

  // Handle food feeding
  const handleFeedFood = (foodId: string, price: number) => {
    onFeedFood(foodId, price);
    setShowFoodMenu(false);
  };

  return (
    <div className="card text-center py-3 px-4 space-y-3">
      {/* Header */}
      <h2 className="text-child-base font-bold text-gray-900 flex items-center justify-center gap-1.5">
        <span className="text-lg" aria-hidden="true">🐾</span>
        Learning Buddy
      </h2>

      {/* Pet Display */}
      <div className="py-3">
        <div className="mb-2 transition-transform hover:scale-110 cursor-pointer flex justify-center" aria-hidden="true">
          <PetCharacter emotion={pet.emotion} size="large" animate={true} />
        </div>
        <p className="text-child-lg font-bold text-gray-900">{pet.name}</p>
        <p className="text-child-xs text-gray-600">
          {currentStageName} • {pet.emotion.charAt(0).toUpperCase() + pet.emotion.slice(1)}
        </p>
        <p className="text-[10px] text-purple-600 font-semibold">
          {pet.evolutionTrack === 'knowledge' && '📚 Knowledge Track'}
          {pet.evolutionTrack === 'coolness' && '😎 Coolness Track'}
          {pet.evolutionTrack === 'culture' && '🌍 Culture Track'}
        </p>
      </div>

      {/* Stats Bars */}
      <div className="space-y-2">
        {/* Happiness */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-semibold text-gray-700">❤️ Happiness</span>
            <span className="text-[11px] font-bold text-gray-900">{pet.happiness}%</span>
          </div>
          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${getStatColor(pet.happiness)}`}
              style={{ width: `${pet.happiness}%` }}
              role="progressbar"
              aria-valuenow={pet.happiness}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Pet happiness level"
            />
          </div>
        </div>

        {/* Hunger */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-semibold text-gray-700">🍔 Hunger</span>
            <span className="text-[11px] font-bold text-gray-900">{pet.hunger}%</span>
          </div>
          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${getStatColor(100 - pet.hunger)}`}
              style={{ width: `${pet.hunger}%` }}
              role="progressbar"
              aria-valuenow={pet.hunger}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Pet hunger level"
            />
          </div>
        </div>

        {/* Energy */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-semibold text-gray-700">⚡ Energy</span>
            <span className="text-[11px] font-bold text-gray-900">{pet.energy}%</span>
          </div>
          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${getStatColor(pet.energy)}`}
              style={{ width: `${pet.energy}%` }}
              role="progressbar"
              aria-valuenow={pet.energy}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Pet energy level"
            />
          </div>
        </div>
      </div>

      {/* Evolution Progress */}
      <div className="border-t border-gray-200 pt-2">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[11px] font-semibold text-purple-700">
            🌟 Evolution Progress
          </span>
          <span className="text-[11px] font-bold text-purple-900">
            Stage {pet.evolutionStage}/6
          </span>
        </div>
        <div className="h-1.5 bg-purple-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
            style={{ width: `${evolutionProgress}%` }}
            role="progressbar"
            aria-valuenow={evolutionProgress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Evolution progress"
          />
        </div>

        {/* Next evolution info */}
        {nextEvolutionInfo && (
          <div className="mt-1">
            {nextEvolutionInfo.canEvolve ? (
              <p className="text-[11px] font-bold text-green-600 animate-pulse">
                ✨ Ready to evolve!
              </p>
            ) : nextEvolutionInfo.nextStageName ? (
              <p className="text-[10px] text-gray-600">
                Next: {nextEvolutionInfo.nextStageName} (Level {nextEvolutionInfo.requiredLevel})
                {nextEvolutionInfo.levelsRemaining && nextEvolutionInfo.levelsRemaining > 0 && (
                  <span className="text-purple-600 font-semibold">
                    {' '}• {nextEvolutionInfo.levelsRemaining} levels to go
                  </span>
                )}
              </p>
            ) : (
              <p className="text-[11px] font-bold text-yellow-600">
                🎉 Max Evolution Reached!
              </p>
            )}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-3 gap-2 pt-1">
        <Button
          variant="outline"
          size="small"
          onClick={() => setShowFoodMenu(true)}
          disabled={!canFeed}
          className="flex-col h-auto py-2"
          aria-label={`Feed ${pet.name} - Open food menu`}
        >
          <span className="text-lg mb-0.5" aria-hidden="true">🍔</span>
          <span className="text-[10px] font-semibold">Feed</span>
          <span className="text-[9px] text-gray-500">Menu</span>
        </Button>

        <Button
          variant="outline"
          size="small"
          onClick={onPlay}
          disabled={!canPlay}
          className="flex-col h-auto py-2"
          aria-label={`Play with ${pet.name} (requires 20 energy)`}
        >
          <span className="text-lg mb-0.5" aria-hidden="true">🎮</span>
          <span className="text-[10px] font-semibold">Play</span>
          <span className="text-[9px] text-gray-500">-20⚡</span>
        </Button>

        <Button
          variant="outline"
          size="small"
          onClick={onBoost}
          disabled={!canBoost}
          className="flex-col h-auto py-2"
          aria-label={`Boost ${pet.name} (costs 1 gem)`}
        >
          <span className="text-lg mb-0.5" aria-hidden="true">✨</span>
          <span className="text-[10px] font-semibold">Boost</span>
          <span className="text-[9px] text-gray-500">1💎</span>
        </Button>
      </div>

      {/* Status Message */}
      <div className="text-[10px] text-gray-600 italic pt-1">
        {pet.hunger > 70 && "I'm hungry! 🍔"}
        {pet.energy < 30 && pet.hunger <= 70 && "I'm tired... 😴"}
        {pet.happiness > 80 && pet.hunger <= 70 && pet.energy >= 30 && "I'm so happy! 🌟"}
      </div>

      {/* Food Menu Modal */}
      {showFoodMenu && (
        <FoodMenu
          coins={coins}
          petTrack={pet.evolutionTrack}
          onFeedFood={handleFeedFood}
          onClose={() => setShowFoodMenu(false)}
        />
      )}
    </div>
  );
};
