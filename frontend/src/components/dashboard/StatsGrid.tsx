import React from 'react';
import { useUser } from '@/contexts/UserContext';
import type { UserState } from '@/types/user';

interface StatsGridProps {
  user: UserState;
  totalAchievements: number;
  unlockedAchievements: number;
}

export const StatsGrid: React.FC<StatsGridProps> = ({
  user,
  totalAchievements,
  unlockedAchievements,
}) => {
  const { getDailyXPGain } = useUser();
  const levelProgress = ((user.xp / user.xpToNextLevel) * 100).toFixed(0);
  const achievementProgress = ((unlockedAchievements / totalAchievements) * 100).toFixed(0);
  const xpGainedToday = getDailyXPGain();

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
      {/* Total XP - Compact */}
      <div className="card py-2 px-3">
        <div className="flex items-center gap-1.5 mb-1">
          <span className="text-lg" aria-hidden="true">📚</span>
          <span className="text-child-xs font-semibold text-gray-700">XP</span>
        </div>
        <p className="text-child-lg font-bold text-gray-900">{user.xp.toLocaleString()}</p>
        <p className="text-[10px] text-green-600 font-medium">▲ +{xpGainedToday}</p>
      </div>

      {/* Level - Compact */}
      <div className="card py-2 px-3">
        <div className="flex items-center gap-1.5 mb-1">
          <span className="text-lg" aria-hidden="true">📈</span>
          <span className="text-child-xs font-semibold text-gray-700">Level</span>
        </div>
        <p className="text-child-lg font-bold text-gray-900">Lv {user.level}</p>
        <div className="flex items-center gap-1">
          <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary-500 transition-all duration-300"
              style={{ width: `${levelProgress}%` }}
              role="progressbar"
              aria-valuenow={Number(levelProgress)}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
          <span className="text-[10px] text-gray-600 font-medium">{levelProgress}%</span>
        </div>
      </div>

      {/* Streak - Compact */}
      <div className="card py-2 px-3">
        <div className="flex items-center gap-1.5 mb-1">
          <span className="text-lg" aria-hidden="true">🔥</span>
          <span className="text-child-xs font-semibold text-gray-700">Streak</span>
        </div>
        <p className="text-child-lg font-bold text-gray-900">{user.streak}d</p>
        <p className="text-[10px] text-orange-600 font-medium">Best: {user.stats.longestStreak}</p>
      </div>

      {/* Achievements - Compact */}
      <div className="card py-2 px-3">
        <div className="flex items-center gap-1.5 mb-1">
          <span className="text-lg" aria-hidden="true">🏆</span>
          <span className="text-child-xs font-semibold text-gray-700">Badges</span>
        </div>
        <p className="text-child-lg font-bold text-gray-900">
          {unlockedAchievements}/{totalAchievements}
        </p>
        <p className="text-[10px] text-gray-600 font-medium">{achievementProgress}%</p>
      </div>
    </div>
  );
};
