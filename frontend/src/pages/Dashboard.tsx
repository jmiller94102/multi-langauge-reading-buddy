import React, { useState } from 'react';
import { WelcomeSection } from '@/components/dashboard/WelcomeSection';
import { StatsGrid } from '@/components/dashboard/StatsGrid';
import { QuestCard } from '@/components/dashboard/QuestCard';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { StreakBonus } from '@/components/dashboard/StreakBonus';
import { VirtualPetWidget } from '@/components/dashboard/VirtualPetWidget';
import { EvolutionAnimation } from '@/components/pet/EvolutionAnimation';
import { EvolutionModal } from '@/components/pet/EvolutionModal';
import { usePetEvolution } from '@/hooks/usePetEvolution';
import { mockUser, mockPet, mockDailyQuests, mockWeeklyQuests } from '@/utils/mockData';
import { getFoodById } from '@/data/foods';
import { getFoodReaction } from '@/data/petEvolution';
import type { Quest } from '@/types/quest';
import type { PetEmotion } from '@/types/pet';

export const Dashboard: React.FC = () => {
  // TODO: Replace with actual context/state management in Phase 2+
  const [user, setUser] = useState(mockUser);
  const [pet, setPet] = useState(mockPet);
  const [dailyQuests, setDailyQuests] = useState<Quest[]>(mockDailyQuests);
  const [weeklyQuests, setWeeklyQuests] = useState<Quest[]>(mockWeeklyQuests);

  const totalAchievements = 24; // TODO: Get from achievement data
  const unlockedAchievements = 8; // TODO: Calculate from achievements

  // Pet Evolution System
  const {
    showAnimation,
    showModal,
    newStage,
    handleAnimationComplete,
    handleModalClose,
    checkEvolution,
    nextEvolutionInfo,
  } = usePetEvolution({
    pet,
    userLevel: user.level,
    onPetUpdate: setPet,
  });

  // Filter out streak quest from daily quests (shown separately now)
  const nonStreakDailyQuests = dailyQuests.filter(q => q.category !== 'streak');
  const streakQuest = dailyQuests.find(q => q.category === 'streak');

  // Calculate time until daily reset
  const getDailyResetTime = () => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    const diff = tomorrow.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleClaimQuest = (questId: string) => {
    // Update daily quests
    setDailyQuests((prev) =>
      prev.map((q) => (q.id === questId ? { ...q, status: 'claimed' as const } : q))
    );
    // Update weekly quests
    setWeeklyQuests((prev) =>
      prev.map((q) => (q.id === questId ? { ...q, status: 'claimed' as const } : q))
    );
    // TODO: Add rewards to user (XP, coins, gems)
    // TODO: Show celebration animation
  };

  // Pet interaction handlers
  const handleFeedFood = (foodId: string, price: number) => {
    // Check if user can afford the food
    if (user.coins < price) return;

    // Get food data
    const food = getFoodById(foodId);
    if (!food) return;

    // Get pet's reaction to this food (includes track-specific bonuses)
    const { emotion, effect } = getFoodReaction(foodId, pet.evolutionTrack);

    // Update pet state
    setPet((prev) => {
      const updatedPet = {
        ...prev,
        hunger: Math.max(0, prev.hunger - effect.hungerReduction),
        happiness: Math.min(100, prev.happiness + effect.happinessChange),
        emotion: emotion as PetEmotion,
        lastFed: Date.now(),
        lastInteraction: Date.now(),
      };

      // Add food to tried history if not already tried
      if (!prev.foodsTriedHistory.includes(foodId)) {
        updatedPet.foodsTriedHistory = [...prev.foodsTriedHistory, foodId];
      }

      return updatedPet;
    });

    // Deduct coins
    setUser((prev) => ({ ...prev, coins: prev.coins - price }));

    // Apply track-specific bonuses if this is a favorite food
    if (effect.bonusType && effect.bonusAmount) {
      if (effect.bonusType === 'xp') {
        setUser((prev) => ({ ...prev, xp: prev.xp + effect.bonusAmount! }));
      } else if (effect.bonusType === 'coins') {
        setUser((prev) => ({ ...prev, coins: prev.coins + effect.bonusAmount! }));
      }
      // languageBonus would be applied during quiz completion
    }

    // TODO: Add feeding animation
    // TODO: Show bonus notification if favorite food
  };

  const handlePlay = () => {
    if (pet.energy >= 20) {
      setPet((prev) => ({
        ...prev,
        happiness: Math.min(100, prev.happiness + 20),
        energy: Math.max(0, prev.energy - 20),
        lastPlayed: Date.now(),
        lastInteraction: Date.now(),
      }));
      // TODO: Add play animation
    }
  };

  const handleBoost = () => {
    if (user.gems >= 1) {
      setPet((prev) => ({
        ...prev,
        happiness: Math.min(100, prev.happiness + 30),
        hunger: Math.max(0, prev.hunger - 20),
        energy: Math.min(100, prev.energy + 30),
        lastInteraction: Date.now(),
      }));
      setUser((prev) => ({ ...prev, gems: prev.gems - 1 }));
      // TODO: Add boost animation
    }
  };

  return (
    <div className="space-y-3 max-w-7xl mx-auto">
      {/* Welcome Section - Compact */}
      <WelcomeSection user={user} />

      {/* Stats Grid - Compact */}
      <StatsGrid
        user={user}
        totalAchievements={totalAchievements}
        unlockedAchievements={unlockedAchievements}
      />

      {/* Main Content - SYMMETRICAL 3-COLUMN LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        {/* Left Column (40%) - Daily Quests (non-streak) */}
        <div className="lg:col-span-5 space-y-2">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-child-base font-bold text-gray-900 flex items-center gap-1.5">
              <span className="text-lg" aria-hidden="true">🎯</span>
              Daily Quests
            </h2>
            <span className="text-[11px] text-gray-600">Resets {getDailyResetTime()}</span>
          </div>
          <div className="grid gap-2">
            {nonStreakDailyQuests.map((quest) => (
              <QuestCard key={quest.id} quest={quest} onClaim={handleClaimQuest} />
            ))}
          </div>
        </div>

        {/* Center Column (25%) - STREAK BONUS (Tall, spans height of 2 quests) */}
        <div className="lg:col-span-3">
          <StreakBonus
            currentStreak={user.streak}
            longestStreak={user.stats.longestStreak}
            todayComplete={streakQuest?.status === 'completed'}
            onClaim={() => streakQuest && handleClaimQuest(streakQuest.id)}
          />
        </div>

        {/* Right Column (35%) - Pet and Leaderboard */}
        <div className="lg:col-span-4 space-y-3">
          {/* Virtual Pet Widget */}
          <VirtualPetWidget
            pet={pet}
            coins={user.coins}
            gems={user.gems}
            onFeedFood={handleFeedFood}
            onPlay={handlePlay}
            onBoost={handleBoost}
            onEvolve={checkEvolution}
            nextEvolutionInfo={nextEvolutionInfo}
          />

          {/* Leaderboard - Compact */}
          <div className="card py-3 px-4 space-y-2">
            <h2 className="text-child-base font-bold text-gray-900 flex items-center gap-1.5">
              <span className="text-lg" aria-hidden="true">🏅</span>
              Leaderboard
            </h2>
            <div className="space-y-1 text-child-xs">
              <div className="flex items-center justify-between py-1 border-b border-gray-100">
                <span className="font-medium">👑 Sarah</span>
                <span className="text-gray-600">5,420</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-gray-100">
                <span className="font-medium">🦸 Mike</span>
                <span className="text-gray-600">4,890</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-gray-100">
                <span className="font-medium">🌟 Emma</span>
                <span className="text-gray-600">3,765</span>
              </div>
              <div className="flex items-center justify-between py-1.5 bg-primary-50 -mx-4 px-4 rounded">
                <span className="font-bold text-primary-700">🎓 {user.name} ⭐</span>
                <span className="font-bold text-primary-700">{user.xp}</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="font-medium">🦄 Lily</span>
                <span className="text-gray-600">2,180</span>
              </div>
            </div>
            <p className="text-[10px] text-gray-600 pt-1">
              Rank #4 • 🎯 250 XP to #3
            </p>
          </div>
        </div>
      </div>

      {/* Weekly Quests and Quick Actions - Full Width Below */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* Weekly Quests */}
        <section className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-child-base font-bold text-gray-900 flex items-center gap-1.5">
              <span className="text-lg" aria-hidden="true">📅</span>
              Weekly Quests
            </h2>
            <span className="text-[11px] text-gray-600">Resets in 5d</span>
          </div>
          <div className="grid gap-2">
            {weeklyQuests.map((quest) => (
              <QuestCard key={quest.id} quest={quest} onClaim={handleClaimQuest} />
            ))}
          </div>
        </section>

        {/* Quick Actions */}
        <QuickActions />
      </div>

      {/* Pet Evolution System */}
      {showAnimation && (
        <EvolutionAnimation
          track={pet.evolutionTrack}
          onComplete={handleAnimationComplete}
        />
      )}

      {showModal && newStage !== null && (
        <EvolutionModal
          petName={pet.name}
          track={pet.evolutionTrack}
          newStage={newStage}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
};
