import React, { useState } from 'react';
import { Button } from '@/components/common/Button';
import type { PetEvolutionTrack } from '@/types/pet';
import { getFoodsByOrigin, type Food } from '@/data/foods';
import { TRACK_FAVORITE_FOODS } from '@/data/petEvolution';

interface FoodMenuProps {
  coins: number;
  petTrack: PetEvolutionTrack;
  onFeedFood: (foodId: string, price: number) => void;
  onClose: () => void;
}

export const FoodMenu: React.FC<FoodMenuProps> = ({ coins, petTrack, onFeedFood, onClose }) => {
  const [selectedOrigin, setSelectedOrigin] = useState<'korean' | 'chinese' | 'universal'>('korean');
  const [showCulturalFact, setShowCulturalFact] = useState<string | null>(null);

  const koreanFoods = getFoodsByOrigin('korean');
  const chineseFoods = getFoodsByOrigin('chinese');
  const universalFoods = getFoodsByOrigin('universal');

  // Handler to switch origin and reset cultural fact state
  const handleOriginChange = (origin: 'korean' | 'chinese' | 'universal') => {
    setSelectedOrigin(origin);
    setShowCulturalFact(null); // Reset cultural fact when switching tabs
  };

  const currentFoods =
    selectedOrigin === 'korean'
      ? koreanFoods
      : selectedOrigin === 'chinese'
        ? chineseFoods
        : universalFoods;

  // Get pet's favorite foods
  const favoriteFoods = TRACK_FAVORITE_FOODS[petTrack];

  const isFavorite = (foodId: string) => favoriteFoods.includes(foodId);
  const canAfford = (price: number) => coins >= price;

  const handleFeedClick = (food: Food) => {
    if (canAfford(food.price)) {
      onFeedFood(food.id, food.price);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden animate-fade-in-scale"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative bg-gradient-to-r from-orange-400 to-pink-500 py-5 px-6 text-center">
          <h2 className="text-child-xl font-black text-white drop-shadow-lg">
            🍽️ Food Menu
          </h2>
          <p className="text-child-xs text-white opacity-90 mt-1">
            Feed your learning buddy delicious cultural foods!
          </p>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-white bg-opacity-30 hover:bg-opacity-50 rounded-full transition-colors"
            aria-label="Close food menu"
          >
            <span className="text-white text-xl font-bold">×</span>
          </button>
        </div>

        {/* Coins Display */}
        <div className="bg-yellow-50 border-b-2 border-yellow-200 py-3 px-6">
          <div className="flex items-center justify-center gap-2">
            <span className="text-2xl" aria-hidden="true">
              🪙
            </span>
            <span className="text-child-base font-bold text-gray-900">Your Coins: {coins}</span>
          </div>
        </div>

        {/* Origin Tabs */}
        <div className="border-b-2 border-gray-200 bg-gray-50">
          <div className="flex items-center justify-center gap-2 px-6 py-3">
            <button
              onClick={() => handleOriginChange('korean')}
              className={`px-4 py-2 rounded-lg font-semibold text-child-xs transition-all ${
                selectedOrigin === 'korean'
                  ? 'bg-red-500 text-white shadow-md scale-105'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
              aria-pressed={selectedOrigin === 'korean'}
            >
              🇰🇷 Korean
            </button>
            <button
              onClick={() => handleOriginChange('chinese')}
              className={`px-4 py-2 rounded-lg font-semibold text-child-xs transition-all ${
                selectedOrigin === 'chinese'
                  ? 'bg-red-500 text-white shadow-md scale-105'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
              aria-pressed={selectedOrigin === 'chinese'}
            >
              🇨🇳 Chinese
            </button>
            <button
              onClick={() => handleOriginChange('universal')}
              className={`px-4 py-2 rounded-lg font-semibold text-child-xs transition-all ${
                selectedOrigin === 'universal'
                  ? 'bg-blue-500 text-white shadow-md scale-105'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
              aria-pressed={selectedOrigin === 'universal'}
            >
              🌍 Universal
            </button>
          </div>
        </div>

        {/* Food Grid */}
        <div className="overflow-y-auto max-h-[500px] p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {currentFoods.map((food) => {
              const favorite = isFavorite(food.id);
              const affordable = canAfford(food.price);

              return (
                <div
                  key={food.id}
                  className={`relative border-2 rounded-xl p-4 transition-all ${
                    favorite
                      ? 'border-pink-400 bg-pink-50'
                      : affordable
                        ? 'border-gray-300 bg-white hover:border-orange-400 hover:shadow-md'
                        : 'border-gray-200 bg-gray-50 opacity-60'
                  }`}
                >
                  {/* Favorite Badge */}
                  {favorite && (
                    <div className="absolute -top-2 -right-2 bg-pink-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-md animate-pulse">
                      ❤️ FAVORITE
                    </div>
                  )}

                  {/* Food Display */}
                  <div className="flex items-start gap-3">
                    <div className="text-4xl flex-shrink-0" aria-hidden="true">
                      {food.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-child-sm font-bold text-gray-900 mb-0.5">
                        {food.name}
                      </h3>
                      <p className="text-[11px] text-gray-600 mb-2 leading-snug">
                        {food.description}
                      </p>

                      {/* Effects */}
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded font-semibold">
                          ❤️ +{food.happinessBoost}
                        </span>
                        <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded font-semibold">
                          🍔 -{food.hungerReduction}
                        </span>
                      </div>

                      {/* Cultural Fact Button */}
                      {food.culturalFact && (
                        <button
                          onClick={() =>
                            setShowCulturalFact(
                              showCulturalFact === food.id ? null : food.id
                            )
                          }
                          className="text-[10px] text-purple-600 font-semibold hover:text-purple-800 transition-colors mb-2"
                        >
                          {showCulturalFact === food.id ? '▼ Hide fact' : '▶ Cultural fact'}
                        </button>
                      )}

                      {/* Cultural Fact Display */}
                      {showCulturalFact === food.id && food.culturalFact && (
                        <div className="bg-purple-50 border border-purple-200 rounded-lg p-2 mb-2 text-[10px] text-purple-900 leading-relaxed">
                          💡 {food.culturalFact}
                        </div>
                      )}

                      {/* Feed Button */}
                      <Button
                        variant={affordable ? 'primary' : 'outline'}
                        size="small"
                        onClick={() => handleFeedClick(food)}
                        disabled={!affordable}
                        className={`w-full text-[11px] font-bold ${
                          favorite
                            ? 'bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600'
                            : ''
                        }`}
                        aria-label={`Feed ${food.name} for ${food.price} coins`}
                      >
                        {affordable ? (
                          <>
                            <span>Feed</span>
                            <span className="ml-1">🪙 {food.price}</span>
                          </>
                        ) : (
                          <>
                            <span>Need {food.price - coins} more coins</span>
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t-2 border-gray-200 bg-gray-50 py-3 px-6">
          <p className="text-center text-[11px] text-gray-600">
            ❤️ <strong>Favorite foods</strong> give your pet{' '}
            <span className="text-pink-600 font-bold">bonus rewards</span>!
          </p>
        </div>
      </div>

      {/* CSS animations */}
      <style>{`
        @keyframes fade-in-scale {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fade-in-scale {
          animation: fade-in-scale 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
};
