import React from 'react';
import type { AchievementCategory } from '@/types/achievement';

export type FilterOption = 'all' | 'unlocked' | 'locked' | AchievementCategory;
export type SortOption = 'recent' | 'progress' | 'alphabetical' | 'rarity';

interface FilterControlsProps {
  filter: FilterOption;
  sort: SortOption;
  searchQuery: string;
  onFilterChange: (filter: FilterOption) => void;
  onSortChange: (sort: SortOption) => void;
  onSearchChange: (query: string) => void;
}

export const FilterControls: React.FC<FilterControlsProps> = ({
  filter,
  sort,
  searchQuery,
  onFilterChange,
  onSortChange,
  onSearchChange,
}) => {
  return (
    <div className="card">
      <div className="flex flex-col lg:flex-row gap-3">
        {/* Filter Dropdown */}
        <div className="flex-1">
          <label htmlFor="filter" className="block text-child-xs font-semibold text-gray-700 mb-1">
            Filter
          </label>
          <select
            id="filter"
            value={filter}
            onChange={(e) => onFilterChange(e.target.value as FilterOption)}
            className="w-full px-3 py-2 text-child-sm border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">All Achievements</option>
            <option value="unlocked">Unlocked</option>
            <option value="locked">Locked</option>
            <option value="reading">📖 Reading</option>
            <option value="quiz">✏️ Quiz</option>
            <option value="streak">🔥 Streak</option>
            <option value="language">🌍 Language</option>
            <option value="pet">🦋 Pet</option>
            <option value="xp">⬆️ XP/Level</option>
            <option value="collection">🌟 Collection</option>
          </select>
        </div>

        {/* Sort Dropdown */}
        <div className="flex-1">
          <label htmlFor="sort" className="block text-child-xs font-semibold text-gray-700 mb-1">
            Sort By
          </label>
          <select
            id="sort"
            value={sort}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="w-full px-3 py-2 text-child-sm border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="recent">Recent</option>
            <option value="progress">Closest to Unlock</option>
            <option value="alphabetical">Alphabetical</option>
            <option value="rarity">Rarity</option>
          </select>
        </div>

        {/* Search Bar */}
        <div className="flex-1">
          <label htmlFor="search" className="block text-child-xs font-semibold text-gray-700 mb-1">
            Search
          </label>
          <div className="relative">
            <input
              id="search"
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search achievements..."
              className="w-full px-3 py-2 text-child-sm border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent pr-10"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" aria-hidden="true">
              🔍
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
