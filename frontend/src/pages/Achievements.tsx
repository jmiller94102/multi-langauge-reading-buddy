import React, { useState, useMemo } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { ProgressSummary } from '@/components/achievements/ProgressSummary';
import { FilterControls, type FilterOption, type SortOption } from '@/components/achievements/FilterControls';
import { AchievementCard } from '@/components/achievements/AchievementCard';
import { MotivationalSection } from '@/components/achievements/MotivationalSection';
import { ACHIEVEMENTS, getUnlockedAchievements, getNextAchievement, getAchievementProgress } from '@/data/achievements';
import type { Achievement } from '@/types/achievement';

export const Achievements: React.FC = () => {
  const [filter, setFilter] = useState<FilterOption>('all');
  const [sort, setSort] = useState<SortOption>('recent');
  const [searchQuery, setSearchQuery] = useState('');

  const unlockedCount = getUnlockedAchievements().length;
  const totalCount = ACHIEVEMENTS.length;
  const nextAchievement = getNextAchievement();

  // Filter, sort, and search achievements
  const filteredAchievements = useMemo(() => {
    let filtered = [...ACHIEVEMENTS];

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
  }, [filter, sort, searchQuery]);

  const handleAchievementClick = (achievement: Achievement) => {
    // TODO: Show achievement modal in Phase 6 (Animations & Polish)
    console.log('Achievement clicked:', achievement.title);
  };

  return (
    <PageLayout>
      <div className="space-y-4 max-w-7xl mx-auto">
        {/* Progress Summary */}
        <ProgressSummary unlockedCount={unlockedCount} totalCount={totalCount} />

        {/* Filter, Sort, Search */}
        <FilterControls
          filter={filter}
          sort={sort}
          searchQuery={searchQuery}
          onFilterChange={setFilter}
          onSortChange={setSort}
          onSearchChange={setSearchQuery}
        />

        {/* Achievement Grid */}
        <div>
          {filteredAchievements.length > 0 ? (
            <>
              <p className="text-child-xs text-gray-600 mb-3">
                Showing {filteredAchievements.length} {filteredAchievements.length === 1 ? 'achievement' : 'achievements'}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
            <div className="card text-center py-12">
              <span className="text-6xl mb-4 block" aria-hidden="true">🔍</span>
              <h3 className="text-child-lg font-bold text-gray-900 mb-2">No achievements found</h3>
              <p className="text-child-sm text-gray-600">
                Try adjusting your filters or search query
              </p>
            </div>
          )}
        </div>

        {/* Motivational Section */}
        <MotivationalSection nextAchievement={nextAchievement} />
      </div>
    </PageLayout>
  );
};
