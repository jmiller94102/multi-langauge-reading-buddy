import React, { useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { getFoodsByOrigin, type Food } from '@/data/foods';
import { POWER_UPS, getCosmeticsByTrack } from '@/data/shopItems';
import type { Cosmetic, PowerUp } from '@/types/shop';
import { useUser } from '@/contexts/UserContext';
import { usePet } from '@/contexts/PetContext';

type TabType = 'foods' | 'cosmetics' | 'powerups';

export const Shop: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('foods');
  const { user, spendCoins, spendGems, addToInventory } = useUser();
  const { equipAccessory } = usePet();
  const [selectedItem, setSelectedItem] = useState<Food | Cosmetic | PowerUp | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handlePurchase = (item: Food | Cosmetic | PowerUp) => {
    setSelectedItem(item);
    setShowConfirmation(true);
  };

  const confirmPurchase = async () => {
    if (!selectedItem) return;

    const price = 'price' in selectedItem ? selectedItem.price : 0;
    const gemPrice = 'gemPrice' in selectedItem ? selectedItem.gemPrice : 0;

    // Check if user can afford
    if (gemPrice && user.gems < gemPrice) {
      alert('Not enough gems!');
      setShowConfirmation(false);
      return;
    }
    if (!gemPrice && user.coins < price) {
      alert('Not enough coins!');
      setShowConfirmation(false);
      return;
    }

    // Deduct currency
    let success = false;
    if (gemPrice) {
      success = await spendGems(gemPrice);
    } else {
      success = await spendCoins(price);
    }

    if (!success) {
      alert('Purchase failed - insufficient funds!');
      setShowConfirmation(false);
      return;
    }

    // Add item to inventory based on category
    if ('emoji' in selectedItem) {
      // It's a Food item
      await addToInventory(selectedItem.id, 'foods');
    } else if ('type' in selectedItem) {
      // It's a Cosmetic item
      await addToInventory(selectedItem.id, 'cosmetics');
      // Auto-equip if there's space
      try {
        await equipAccessory(selectedItem.id);
      } catch (error) {
        console.log('Could not auto-equip accessory:', error);
      }
    } else {
      // It's a PowerUp item
      await addToInventory(selectedItem.id, 'powerUps');
    }

    alert(`Purchased ${selectedItem.name}!`);
    setShowConfirmation(false);
    setSelectedItem(null);
  };

  // Korean and Chinese foods
  const koreanFoods = getFoodsByOrigin('korean');
  const chineseFoods = getFoodsByOrigin('chinese');

  // Cosmetics by track
  const knowledgeCosmetics = getCosmeticsByTrack('knowledge');
  const coolnessCosmetics = getCosmeticsByTrack('coolness');
  const cultureCosmetics = getCosmeticsByTrack('culture');

  return (
    <PageLayout>
      <div className="space-y-4 max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="card space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-3xl" aria-hidden="true">🏪</span>
            <div>
              <h1 className="text-child-xl font-bold text-gray-900">Shop</h1>
              <p className="text-child-xs text-gray-600">Treat your learning buddy and unlock special items!</p>
            </div>
          </div>

          {/* Balance Display */}
          <div className="flex items-center gap-4 pt-2 border-t border-gray-200">
            <div className="flex items-center gap-2">
              <span className="text-2xl" aria-hidden="true">🪙</span>
              <span className="text-child-base font-bold text-amber-600">{user.coins} Coins</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl" aria-hidden="true">💎</span>
              <span className="text-child-base font-bold text-cyan-600">{user.gems} Gems</span>
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="card p-0">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('foods')}
              className={`flex-1 py-3 px-4 text-child-sm font-semibold transition-colors ${
                activeTab === 'foods'
                  ? 'bg-primary-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              🍖 Foods
            </button>
            <button
              onClick={() => setActiveTab('cosmetics')}
              className={`flex-1 py-3 px-4 text-child-sm font-semibold transition-colors ${
                activeTab === 'cosmetics'
                  ? 'bg-primary-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              👕 Cosmetics
            </button>
            <button
              onClick={() => setActiveTab('powerups')}
              className={`flex-1 py-3 px-4 text-child-sm font-semibold transition-colors ${
                activeTab === 'powerups'
                  ? 'bg-primary-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              ⚡ Power-Ups
            </button>
          </div>
        </div>

        {/* Foods Tab */}
        {activeTab === 'foods' && (
          <div className="space-y-4">
            {/* Korean Foods */}
            <section className="card">
              <h2 className="text-child-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span>🇰🇷</span>Korean Cuisine
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-2">
                {koreanFoods.map(food => (
                  <FoodCard key={food.id} food={food} onPurchase={() => handlePurchase(food)} canAfford={user.coins >= food.price} />
                ))}
              </div>
            </section>

            {/* Chinese Foods */}
            <section className="card">
              <h2 className="text-child-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span>🇨🇳</span>Chinese Cuisine
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-2">
                {chineseFoods.map(food => (
                  <FoodCard key={food.id} food={food} onPurchase={() => handlePurchase(food)} canAfford={user.coins >= food.price} />
                ))}
              </div>
            </section>
          </div>
        )}

        {/* Cosmetics Tab */}
        {activeTab === 'cosmetics' && (
          <div className="space-y-4">
            <section className="card">
              <h2 className="text-child-lg font-bold text-gray-900 mb-3">🎓 Knowledge Track</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-2">
                {knowledgeCosmetics.map(cosmetic => (
                  <CosmeticCard key={cosmetic.id} cosmetic={cosmetic} userLevel={user.level} userCoins={user.coins} userGems={user.gems} onPurchase={() => handlePurchase(cosmetic)} />
                ))}
              </div>
            </section>

            <section className="card">
              <h2 className="text-child-lg font-bold text-gray-900 mb-3">😎 Coolness Track</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-2">
                {coolnessCosmetics.map(cosmetic => (
                  <CosmeticCard key={cosmetic.id} cosmetic={cosmetic} userLevel={user.level} userCoins={user.coins} userGems={user.gems} onPurchase={() => handlePurchase(cosmetic)} />
                ))}
              </div>
            </section>

            <section className="card">
              <h2 className="text-child-lg font-bold text-gray-900 mb-3">🪭 Culture Track</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-2">
                {cultureCosmetics.map(cosmetic => (
                  <CosmeticCard key={cosmetic.id} cosmetic={cosmetic} userLevel={user.level} userCoins={user.coins} userGems={user.gems} onPurchase={() => handlePurchase(cosmetic)} />
                ))}
              </div>
            </section>
          </div>
        )}

        {/* Power-Ups Tab */}
        {activeTab === 'powerups' && (
          <div className="card">
            <h2 className="text-child-lg font-bold text-gray-900 mb-3">⚡ Temporary Boosts</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {POWER_UPS.map(powerup => (
                <PowerUpCard key={powerup.id} powerup={powerup} userCoins={user.coins} userGems={user.gems} onPurchase={() => handlePurchase(powerup)} />
              ))}
            </div>
          </div>
        )}

        {/* Purchase Confirmation Modal */}
        {showConfirmation && selectedItem && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full space-y-4">
              <h3 className="text-child-lg font-bold text-gray-900">Purchase {selectedItem.name}?</h3>
              <div className="flex justify-center">
                <span className="text-6xl">{'emoji' in selectedItem ? selectedItem.emoji : selectedItem.icon}</span>
              </div>
              <p className="text-child-sm text-gray-700 text-center">{selectedItem.description}</p>
              <div className="border-t border-gray-200 pt-4">
                <p className="text-child-sm font-bold text-gray-900">
                  Cost: {'gemPrice' in selectedItem && selectedItem.gemPrice ? `💎 ${selectedItem.gemPrice}` : `🪙 ${('price' in selectedItem ? selectedItem.price : 0)}`}
                </p>
                <p className="text-child-xs text-gray-600">
                  Balance after: {'gemPrice' in selectedItem && selectedItem.gemPrice
                    ? `💎 ${user.gems - (selectedItem.gemPrice || 0)}`
                    : `🪙 ${user.coins - (('price' in selectedItem ? selectedItem.price : 0))}`
                  }
                </p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowConfirmation(false)} className="btn-ghost flex-1">
                  Cancel
                </button>
                <button onClick={confirmPurchase} className="btn-primary flex-1">
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

// Food Card Component
const FoodCard: React.FC<{ food: Food; onPurchase: () => void; canAfford: boolean }> = ({ food, onPurchase, canAfford }) => (
  <div className="card-hover space-y-1">
    <div className="flex justify-center">
      <span className="text-3xl">{food.emoji}</span>
    </div>
    <h3 className="text-[13px] font-bold text-gray-900 text-center leading-tight">{food.name}</h3>
    <p className="text-[10px] text-gray-600 text-center line-clamp-2 leading-tight">{food.description}</p>
    <div className="space-y-0.5 text-[9px] text-gray-700">
      <p>❤️ +{food.happinessBoost}</p>
      <p>⚡ -{food.hungerReduction}</p>
    </div>
    <div className="border-t border-gray-200 pt-1">
      <p className="text-[11px] font-bold text-amber-600 mb-1">🪙 {food.price}</p>
      <button onClick={onPurchase} disabled={!canAfford} className={`w-full py-1.5 px-3 rounded-lg font-semibold text-[10px] transition-colors ${canAfford ? 'bg-primary-500 text-white hover:bg-primary-600' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}>
        {canAfford ? 'Purchase' : 'Not Enough'}
      </button>
    </div>
  </div>
);

// Cosmetic Card Component
const CosmeticCard: React.FC<{ cosmetic: Cosmetic; userLevel: number; userCoins: number; userGems: number; onPurchase: () => void }> = ({ cosmetic, userLevel, userCoins, userGems, onPurchase }) => {
  const isLocked = userLevel < cosmetic.levelRequirement;
  const canAfford = cosmetic.gemPrice ? userGems >= cosmetic.gemPrice : userCoins >= cosmetic.price;
  const canPurchase = !isLocked && canAfford;

  return (
    <div className={`card-hover space-y-1 ${isLocked ? 'opacity-60 grayscale' : ''}`}>
      <div className="flex justify-center">
        <span className="text-3xl">{cosmetic.icon}</span>
      </div>
      <h3 className="text-[13px] font-bold text-gray-900 text-center leading-tight">{cosmetic.name}</h3>
      <p className="text-[10px] text-gray-600 text-center line-clamp-2 leading-tight">{cosmetic.description}</p>
      {isLocked && (
        <p className="text-[9px] text-red-600 font-semibold text-center">🔒 Lvl {cosmetic.levelRequirement}</p>
      )}
      <div className="border-t border-gray-200 pt-1">
        <p className="text-[11px] font-bold mb-1">
          {cosmetic.gemPrice ? `💎 ${cosmetic.gemPrice}` : `🪙 ${cosmetic.price}`}
        </p>
        <button onClick={onPurchase} disabled={!canPurchase} className={`w-full py-1.5 px-3 rounded-lg font-semibold text-[10px] transition-colors ${canPurchase ? 'bg-primary-500 text-white hover:bg-primary-600' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}>
          {isLocked ? 'Locked' : canAfford ? 'Buy' : 'Not Enough'}
        </button>
      </div>
    </div>
  );
};

// Power-Up Card Component
const PowerUpCard: React.FC<{ powerup: PowerUp; userCoins: number; userGems: number; onPurchase: () => void }> = ({ powerup, userCoins, userGems, onPurchase }) => {
  const canAfford = powerup.gemPrice ? userGems >= powerup.gemPrice : userCoins >= powerup.price;

  return (
    <div className="card-hover space-y-1">
      <div className="flex justify-center">
        <span className="text-3xl">{powerup.icon}</span>
      </div>
      <h3 className="text-[13px] font-bold text-gray-900 text-center leading-tight">{powerup.name}</h3>
      <p className="text-[10px] text-gray-600 text-center leading-tight">{powerup.description}</p>
      <div className="space-y-0.5 text-[9px] text-gray-700">
        <p>⚡ {powerup.effect}</p>
        {powerup.duration && <p>⏱️ {powerup.duration} min</p>}
      </div>
      <div className="border-t border-gray-200 pt-1">
        <p className="text-[11px] font-bold mb-1">
          {powerup.gemPrice ? `💎 ${powerup.gemPrice}` : `🪙 ${powerup.price}`}
        </p>
        <button onClick={onPurchase} disabled={!canAfford} className={`w-full py-1.5 px-3 rounded-lg font-semibold text-[10px] transition-colors ${canAfford ? 'bg-primary-500 text-white hover:bg-primary-600' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}>
          {canAfford ? 'Buy' : 'Not Enough'}
        </button>
      </div>
    </div>
  );
};
