import React, { useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { WelcomeSection } from '@/components/dashboard/WelcomeSection';
import { StatsGrid } from '@/components/dashboard/StatsGrid';
import { QuestCard } from '@/components/dashboard/QuestCard';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { StreakBonus } from '@/components/dashboard/StreakBonus';
import { VirtualPetWidget } from '@/components/dashboard/VirtualPetWidget';
import { EvolutionAnimation } from '@/components/pet/EvolutionAnimation';
import { EvolutionModal } from '@/components/pet/EvolutionModal';
import { QuestCompletionAnimation } from '@/components/animations/QuestCompletionAnimation';
import { PetInteractionAnimation, type PetInteractionType } from '@/components/animations/PetInteractionAnimation';
import { usePetEvolution } from '@/hooks/usePetEvolution';
import { useUser } from '@/contexts/UserContext';
import { usePet } from '@/contexts/PetContext';
import { useQuests } from '@/contexts/QuestContext';
import { useAchievements } from '@/contexts/AchievementContext';
import { getFoodById } from '@/data/foods';
import { getFoodReaction } from '@/data/petEvolution';
import type { PetEmotion } from '@/types/pet';
import type { Quest } from '@/types/quest';

export const Dashboard: React.FC = () => {
  // Context integration
  const { user, addXP, addCoins, addGems, spendCoins, spendGems } = useUser();
  const { pet, feedPet: contextFeedPet, playWithPet, boostPet } = usePet();
  const { dailyQuests, weeklyQuests, claimQuest } = useQuests();
  const { achievements } = useAchievements();

  // Animation states
  const [completedQuest, setCompletedQuest] = useState<Quest | null>(null);
  const [petInteraction, setPetInteraction] = useState<PetInteractionType | null>(null);

  const totalAchievements = achievements.length;
  const unlockedAchievements = achievements.filter(a => a.unlocked).length;

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
    onPetUpdate: async () => {}, // Evolution handled by context
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

  const handleClaimQuest = async (questId: string) => {
    // Find the quest being claimed
    const quest = [...dailyQuests, ...weeklyQuests].find(q => q.id === questId);
    if (!quest) return;

    // Claim quest and get rewards
    const rewards = await claimQuest(questId);

    if (rewards) {
      // Show quest completion animation
      setCompletedQuest(quest);

      // Apply rewards to user
      await addXP(rewards.xp);
      await addCoins(rewards.coins);
      if (rewards.gems > 0) {
        await addGems(rewards.gems);
      }
    }
  };

  // Pet interaction handlers
  const handleFeedFood = async (foodId: string, price: number) => {
    // Check if user can afford the food
    if (user.coins < price) return;

    // Get food data
    const food = getFoodById(foodId);
    if (!food) return;

    // Get pet's reaction to this food (includes track-specific bonuses)
    const { emotion, effect } = getFoodReaction(foodId, pet.evolutionTrack);

    // Deduct coins first
    const success = await spendCoins(price);
    if (!success) return;

    // Feed pet using context
    await contextFeedPet(foodId);

    // Show feeding animation
    setPetInteraction('feed');

    // Apply track-specific bonuses if this is a favorite food
    if (effect.bonusType && effect.bonusAmount) {
      if (effect.bonusType === 'xp') {
        await addXP(effect.bonusAmount);
      } else if (effect.bonusType === 'coins') {
        await addCoins(effect.bonusAmount);
      }
      // languageBonus would be applied during quiz completion
    }
  };

  const handlePlay = async () => {
    if (pet.energy >= 20) {
      await playWithPet();
      setPetInteraction('play');
    }
  };

  const handleBoost = async () => {
    if (user.gems >= 1) {
      const success = await spendGems(1);
      if (success) {
        await boostPet();
        setPetInteraction('boost');
      }
    }
  };

  return (
    <PageLayout>
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

      {/* Quest Completion Animation */}
      {completedQuest && (
        <QuestCompletionAnimation
          questTitle={completedQuest.title}
          xpReward={completedQuest.rewards.xp}
          coinReward={completedQuest.rewards.coins}
          gemReward={completedQuest.rewards.gems}
          onComplete={() => setCompletedQuest(null)}
        />
      )}

      {/* Pet Interaction Animation */}
      {petInteraction && (
        <PetInteractionAnimation
          type={petInteraction}
          onComplete={() => setPetInteraction(null)}
        />
      )}
      </div>
    </PageLayout>
  );
};
