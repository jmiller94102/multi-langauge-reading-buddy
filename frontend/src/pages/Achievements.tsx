import React, { useState, useMemo } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { PetCharacter } from '@/components/pet/PetCharacter';
import { EVOLUTION_STAGE_NAMES } from '@/data/petEvolution';
import { ProgressSummary } from '@/components/achievements/ProgressSummary';
import { FilterControls, type FilterOption, type SortOption } from '@/components/achievements/FilterControls';
import { AchievementCard } from '@/components/achievements/AchievementCard';
import { AchievementModal } from '@/components/achievements/AchievementModal';
import { MotivationalSection } from '@/components/achievements/MotivationalSection';
import { useAchievements } from '@/contexts/AchievementContext';
import { useUser } from '@/contexts/UserContext';
import { usePet } from '@/contexts/PetContext';
import type { Achievement } from '@/types/achievement';

// Helper function for achievement progress calculation
function getAchievementProgress(achievement: Achievement): number {
  if (achievement.unlocked) return 100;
  return Math.min(100, (achievement.currentProgress / achievement.targetValue) * 100);
}

// Helper function to get next achievement
function getNextAchievement(achievements: Achievement[]): Achievement | null {
  const lockedAchievements = achievements.filter(a => !a.unlocked);
  if (lockedAchievements.length === 0) return null;

  return lockedAchievements.sort((a, b) => {
    const progressA = getAchievementProgress(a);
    const progressB = getAchievementProgress(b);
    return progressB - progressA; // Highest progress first
  })[0] || null;
}

export const Achievements: React.FC = () => {
  const { user } = useUser();
  const { pet } = usePet();
  const { achievements, unlockedAchievements } = useAchievements();
  const [filter, setFilter] = useState<FilterOption>('all');
  const [sort, setSort] = useState<SortOption>('recent');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);

  const unlockedCount = unlockedAchievements.length;
  const totalCount = achievements.length;
  const nextAchievement = getNextAchievement(achievements);

  // Calculate stats
  const weeklyStats = {
    xpGained: Math.floor(user.xp * 0.3),
    passagesRead: Math.floor(user.stats.totalReadings * 0.2),
    quizzesCompleted: Math.floor(user.stats.totalQuizzes * 0.2),
    gemsEarned: Math.floor(user.gems * 0.15),
  };

  const isKoreanActive = user.settings.secondaryLanguage === 'ko';
  const koreanProgress = {
    wordsLearned: isKoreanActive ? Math.floor(user.stats.totalWords * 0.4) : 0,
    totalWords: 500,
  };

  // Filter, sort, and search achievements
  const filteredAchievements = useMemo(() => {
    let filtered = [...achievements];

    // Apply filter
    if (filter === 'unlocked') {
      filtered = filtered.filter(a => a.unlocked);
    } else if (filter === 'locked') {
      filtered = filtered.filter(a => !a.unlocked);
    } else if (filter !== 'all') {
      filtered = filtered.filter(a => a.category === filter);
    }

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(a =>
        a.title.toLowerCase().includes(query) ||
        a.description.toLowerCase().includes(query)
      );
    }

    // Apply sort
    filtered.sort((a, b) => {
      if (sort === 'recent') {
        // Unlocked sorted by unlock date, then locked by progress
        if (a.unlocked && b.unlocked) {
          return (b.unlockedAt || 0) - (a.unlockedAt || 0);
        }
        if (a.unlocked) return -1;
        if (b.unlocked) return 1;
        return getAchievementProgress(b) - getAchievementProgress(a);
      } else if (sort === 'progress') {
        // Closest to unlock first
        return getAchievementProgress(b) - getAchievementProgress(a);
      } else if (sort === 'alphabetical') {
        return a.title.localeCompare(b.title);
      } else if (sort === 'rarity') {
        const rarityOrder = { common: 0, rare: 1, epic: 2, legendary: 3 };
        return rarityOrder[b.rarity] - rarityOrder[a.rarity];
      }
      return 0;
    });

    return filtered;
  }, [achievements, filter, sort, searchQuery]);

  const handleAchievementClick = (achievement: Achievement) => {
    setSelectedAchievement(achievement);
  };

  const koreanWordsPercent = Math.round((koreanProgress.wordsLearned / koreanProgress.totalWords) * 100);
  const quizAccuracy = Math.round(user.stats.averageQuizScore);

  return (
    <PageLayout>
      <div className="space-y-3 max-w-7xl mx-auto">
        {/* Page Header with Quick Stats */}
        <div className="card py-2 px-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl" aria-hidden="true">🏆</span>
              <div>
                <h1 className="text-child-base font-bold text-gray-900">Achievements & Progress</h1>
                <p className="text-[10px] text-gray-600">Track your learning journey!</p>
              </div>
            </div>
            <div className="flex gap-2">
              <MiniStat icon="📚" value={weeklyStats.xpGained} label="XP" />
              <MiniStat icon="📖" value={weeklyStats.passagesRead} label="Stories" />
              <MiniStat icon="✅" value={weeklyStats.quizzesCompleted} label="Quizzes" />
              <MiniStat icon="💎" value={weeklyStats.gemsEarned} label="Gems" />
            </div>
          </div>
        </div>

        {/* Main Grid: Achievements + Progress */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          {/* Left: Achievements Grid (2 columns) */}
          <div className="lg:col-span-2 space-y-3">
            {/* Progress Summary */}
            <ProgressSummary unlockedCount={unlockedCount} totalCount={totalCount} />

            {/* Filter, Sort, Search - Compact */}
            <FilterControls
              filter={filter}
              sort={sort}
              searchQuery={searchQuery}
              onFilterChange={setFilter}
              onSortChange={setSort}
              onSearchChange={setSearchQuery}
            />

            {/* Achievement Grid - Compact */}
            <div className="card p-2">
              {filteredAchievements.length > 0 ? (
                <>
                  <p className="text-[10px] text-gray-600 mb-2 px-1">
                    Showing {filteredAchievements.length} {filteredAchievements.length === 1 ? 'achievement' : 'achievements'}
                  </p>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-4 xl:grid-cols-5 gap-2 max-h-[400px] overflow-y-auto pr-1">
                    {filteredAchievements.map((achievement) => (
                      <AchievementCard
                        key={achievement.id}
                        achievement={achievement}
                        onClick={() => handleAchievementClick(achievement)}
                      />
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <span className="text-4xl mb-2 block" aria-hidden="true">🔍</span>
                  <h3 className="text-child-sm font-bold text-gray-900 mb-1">No achievements found</h3>
                  <p className="text-[10px] text-gray-600">
                    Try adjusting your filters or search query
                  </p>
                </div>
              )}
            </div>

            {/* Motivational Section - Compact */}
            <MotivationalSection nextAchievement={nextAchievement} />
          </div>

          {/* Right: Progress Stats (1 column) */}
          <div className="space-y-3">
            {/* Pet Evolution - Compact */}
            <div className="card p-2">
              <h2 className="text-child-sm font-bold text-gray-900 mb-2 flex items-center gap-1">
                <span>🐾</span>Pet Evolution
              </h2>
              <div className="text-center py-2 bg-gradient-to-br from-primary-50 to-accent-50 rounded">
                <div className="flex justify-center mb-1">
                  <PetCharacter emotion={pet.emotion} size="medium" animate={true} />
                </div>
                <p className="text-[11px] font-bold text-gray-900">{pet.name}</p>
                <p className="text-[10px] text-gray-600">Lvl {user.level} • {pet.evolutionTrack}</p>
              </div>
              <div className="mt-2">
                <div className="flex justify-between text-[10px] text-gray-700 mb-1">
                  <span>Stage {pet.evolutionStage}</span>
                  <span>Next: Lvl 15</span>
                </div>
                <ProgressBar percent={Math.round((user.level / 15) * 100)} color="purple" />
              </div>
            </div>

            {/* Language Progress - Compact */}
            <div className="card p-2">
              <h2 className="text-child-sm font-bold text-gray-900 mb-2 flex items-center gap-1">
                <span>🌍</span>Language Progress
              </h2>
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] text-gray-700">🇰🇷 Korean Words</span>
                    <span className="text-[10px] font-semibold text-gray-900">
                      {koreanProgress.wordsLearned}/{koreanProgress.totalWords}
                    </span>
                  </div>
                  <ProgressBar percent={koreanWordsPercent} />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] text-gray-700">Blend Level</span>
                    <span className="text-[10px] font-semibold text-gray-900">
                      {user.settings.languageBlendLevel}/10
                    </span>
                  </div>
                  <ProgressBar percent={user.settings.languageBlendLevel * 10} />
                </div>
              </div>
            </div>

            {/* Quiz Performance - Compact */}
            <div className="card p-2">
              <h2 className="text-child-sm font-bold text-gray-900 mb-2 flex items-center gap-1">
                <span>🎓</span>Quiz Stats
              </h2>
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] text-gray-700">Accuracy</span>
                    <span className="text-[10px] font-bold text-primary-600">{quizAccuracy}%</span>
                  </div>
                  <ProgressBar percent={quizAccuracy} color="blue" />
                </div>
                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-gray-200">
                  <div>
                    <p className="text-[9px] text-gray-600">Total Quizzes</p>
                    <p className="text-[11px] font-bold text-gray-900">{user.stats.totalQuizzes}</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-gray-600">This Week</p>
                    <p className="text-[11px] font-bold text-success-600">{weeklyStats.quizzesCompleted}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Learning Goals - Compact */}
            <div className="card p-2">
              <h2 className="text-child-sm font-bold text-gray-900 mb-2 flex items-center gap-1">
                <span>🎯</span>Goals
              </h2>
              <div className="space-y-2">
                <div>
                  <p className="text-[10px] text-gray-700 mb-1">Weekly: 15 passages</p>
                  <ProgressBar percent={80} />
                  <p className="text-[9px] text-gray-600 mt-0.5">12/15</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-700 mb-1">Monthly: Level 15</p>
                  <ProgressBar percent={Math.round((user.level / 15) * 100)} />
                  <p className="text-[9px] text-gray-600 mt-0.5">{user.level}/15</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-700 mb-1">Korean: 500 words</p>
                  <ProgressBar percent={koreanWordsPercent} />
                  <p className="text-[9px] text-gray-600 mt-0.5">{koreanProgress.wordsLearned}/500</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Achievement Detail Modal */}
      <AchievementModal
        achievement={selectedAchievement}
        onClose={() => setSelectedAchievement(null)}
      />
    </PageLayout>
  );
};

// Mini Stat Component
const MiniStat: React.FC<{ icon: string; value: number; label: string }> = ({ icon, value, label }) => (
  <div className="flex items-center gap-1 bg-gradient-to-br from-gray-50 to-white px-2 py-1 rounded border border-gray-200">
    <span className="text-sm" aria-hidden="true">{icon}</span>
    <div>
      <p className="text-[11px] font-bold text-gray-900">{value}</p>
      <p className="text-[9px] text-gray-600">{label}</p>
    </div>
  </div>
);

// Progress Bar Component
const ProgressBar: React.FC<{ percent: number; color?: 'blue' | 'amber' | 'purple' | 'green' }> = ({ percent, color = 'blue' }) => {
  const colorClasses = {
    blue: 'bg-gradient-to-r from-primary-400 to-primary-600',
    amber: 'bg-gradient-to-r from-amber-400 to-amber-600',
    purple: 'bg-gradient-to-r from-purple-400 to-purple-600',
    green: 'bg-gradient-to-r from-success-400 to-success-600',
  };

  return (
    <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
      <div
        className={`h-full ${colorClasses[color]} transition-all duration-500`}
        style={{ width: `${Math.min(100, Math.max(0, percent))}%` }}
      />
    </div>
  );
};
