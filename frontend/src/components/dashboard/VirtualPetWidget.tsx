import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
  onEvolve?: () => void; // Manual evolution trigger
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
  onEvolve,
  nextEvolutionInfo,
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
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
        {t('pet.learningBuddy')}
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
          {pet.evolutionTrack === 'knowledge' && `📚 ${t('pet.tracks.knowledge')}`}
          {pet.evolutionTrack === 'coolness' && `😎 ${t('pet.tracks.coolness')}`}
          {pet.evolutionTrack === 'culture' && `🌍 ${t('pet.tracks.culture')}`}
        </p>
      </div>

      {/* Stats Bars */}
      <div className="space-y-2">
        {/* Happiness */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-semibold text-gray-700">❤️ {t('pet.stats.happiness')}</span>
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
              aria-label={t('pet.stats.happinessLevel')}
            />
          </div>
        </div>

        {/* Hunger */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-semibold text-gray-700">🍔 {t('pet.stats.hunger')}</span>
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
              aria-label={t('pet.stats.hungerLevel')}
            />
          </div>
        </div>

        {/* Energy */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-semibold text-gray-700">⚡ {t('pet.stats.energy')}</span>
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
              aria-label={t('pet.stats.energyLevel')}
            />
          </div>
        </div>
      </div>

      {/* Evolution Progress */}
      <div className="border-t border-gray-200 pt-2">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[11px] font-semibold text-purple-700">
            🌟 {t('pet.evolution.progress')}
          </span>
          <span className="text-[11px] font-bold text-purple-900">
            {t('pet.evolution.stage', { current: pet.evolutionStage, max: 6 })}
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
            aria-label={t('pet.evolution.progressLabel')}
          />
        </div>

        {/* Next evolution info */}
        {nextEvolutionInfo && (
          <div className="mt-1">
            {nextEvolutionInfo.canEvolve ? (
              <p className="text-[11px] font-bold text-green-600 animate-pulse">
                ✨ {t('pet.evolution.readyToEvolve')}
              </p>
            ) : nextEvolutionInfo.nextStageName ? (
              <p className="text-[10px] text-gray-600">
                {t('pet.evolution.next', { stage: nextEvolutionInfo.nextStageName, level: nextEvolutionInfo.requiredLevel })}
                {nextEvolutionInfo.levelsRemaining && nextEvolutionInfo.levelsRemaining > 0 && (
                  <span className="text-purple-600 font-semibold">
                    {' '}• {t('pet.evolution.levelsToGo', { count: nextEvolutionInfo.levelsRemaining })}
                  </span>
                )}
              </p>
            ) : (
              <p className="text-[11px] font-bold text-yellow-600">
                🎉 {t('pet.evolution.maxReached')}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Evolution Button (if ready to evolve) */}
      {nextEvolutionInfo?.canEvolve && onEvolve && (
        <div className="border-t border-gray-200 pt-2">
          <Button
            variant="primary"
            size="medium"
            onClick={onEvolve}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 animate-pulse"
            aria-label={t('pet.evolution.evolveButton', { name: pet.name, stage: nextEvolutionInfo.nextStageName })}
          >
            <span className="text-base mb-0.5" aria-hidden="true">✨</span>
            <span className="text-[12px] font-bold ml-2">{t('pet.evolution.readyToEvolve')}</span>
          </Button>
        </div>
      )}

      {/* Pet Action Buttons */}
      <div className="grid grid-cols-3 gap-1.5 pt-1">
        <Button
          variant="outline"
          size="small"
          onClick={() => setShowFoodMenu(true)}
          disabled={!canFeed}
          className="flex-col h-auto py-1.5"
          aria-label={t('pet.actions.feedLabel', { name: pet.name })}
        >
          <span className="text-base mb-0.5" aria-hidden="true">🍔</span>
          <span className="text-[10px] font-semibold">{t('pet.actions.feed')}</span>
          <span className="text-[9px] text-gray-500">{t('pet.actions.menu')}</span>
        </Button>

        <Button
          variant="outline"
          size="small"
          onClick={onPlay}
          disabled={!canPlay}
          className="flex-col h-auto py-1.5"
          aria-label={t('pet.actions.playLabel', { name: pet.name })}
        >
          <span className="text-base mb-0.5" aria-hidden="true">🎮</span>
          <span className="text-[10px] font-semibold">{t('pet.actions.play')}</span>
          <span className="text-[9px] text-gray-500">-20⚡</span>
        </Button>

        <Button
          variant="outline"
          size="small"
          onClick={onBoost}
          disabled={!canBoost}
          className="flex-col h-auto py-1.5"
          aria-label={t('pet.actions.boostLabel', { name: pet.name })}
        >
          <span className="text-base mb-0.5" aria-hidden="true">✨</span>
          <span className="text-[10px] font-semibold">{t('pet.actions.boost')}</span>
          <span className="text-[9px] text-gray-500">1💎</span>
        </Button>
      </div>

      {/* Status Message */}
      <div className="text-[10px] text-gray-600 italic pt-1">
        {pet.hunger > 70 && t('pet.status.hungry')}
        {pet.energy < 30 && pet.hunger <= 70 && t('pet.status.tired')}
        {pet.happiness > 80 && pet.hunger <= 70 && pet.energy >= 30 && t('pet.status.happy')}
      </div>

      {/* Navigation Buttons - Shop/Badges/Stats */}
      <div className="grid grid-cols-3 gap-1.5 pt-1 border-t border-gray-200">
        <Button
          variant="outline"
          size="small"
          onClick={() => navigate('/shop')}
          className="flex-col h-auto py-1.5"
          aria-label={t('pet.navigation.shopLabel')}
        >
          <span className="text-base mb-0.5" aria-hidden="true">🏪</span>
          <span className="text-[10px] font-semibold">{t('pet.navigation.shop')}</span>
        </Button>
        <Button
          variant="outline"
          size="small"
          onClick={() => navigate('/achievements')}
          className="flex-col h-auto py-1.5"
          aria-label={t('pet.navigation.badgesLabel')}
        >
          <span className="text-base mb-0.5" aria-hidden="true">🏆</span>
          <span className="text-[10px] font-semibold">{t('pet.navigation.badges')}</span>
        </Button>
        <Button
          variant="outline"
          size="small"
          onClick={() => navigate('/achievements')}
          className="flex-col h-auto py-1.5"
          aria-label={t('pet.navigation.statsLabel')}
        >
          <span className="text-base mb-0.5" aria-hidden="true">📊</span>
          <span className="text-[10px] font-semibold">{t('pet.navigation.stats')}</span>
        </Button>
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
