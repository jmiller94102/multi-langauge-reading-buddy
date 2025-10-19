import React from 'react';
import type { UserState } from '@/types/user';
import { ProgressBar } from '@/components/common/ProgressBar';

interface WelcomeSectionProps {
  user: UserState;
}

export const WelcomeSection: React.FC<WelcomeSectionProps> = ({ user }) => {
  const levelGainToday = 2; // TODO: Calculate from user stats

  return (
    <section className="card py-3 px-4 space-y-2">
      {/* Greeting and Level - Compact */}
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-child-lg font-bold text-gray-900 flex items-center gap-2">
          <span className="text-xl">🎓</span>
          Welcome back, {user.name}!
        </h1>
        <div className="flex items-center gap-2 bg-primary-50 px-3 py-1 rounded-lg border border-primary-200 shrink-0">
          <span className="text-child-sm font-bold text-primary-700">Lv {user.level}</span>
          <span className="text-child-xs text-green-600 font-semibold">▲{levelGainToday}</span>
        </div>
      </div>

      {/* XP Progress Bar - Inline */}
      <div className="flex items-center gap-3">
        <span className="text-child-xs text-gray-600 shrink-0">To Lv {user.level + 1}:</span>
        <div className="flex-1">
          <ProgressBar
            current={user.xp}
            total={user.xpToNextLevel}
            color="blue"
            showLabel={false}
            height="small"
            animated
          />
        </div>
        <span className="text-child-xs font-bold text-gray-900 shrink-0">
          {user.xp.toLocaleString()}/{user.xpToNextLevel.toLocaleString()}
        </span>
      </div>

      {/* Streak Indicator - Inline */}
      <div className="flex items-center gap-2">
        <span className="text-lg" aria-hidden="true">🔥</span>
        <span className="text-child-sm font-semibold text-orange-600">
          {user.streak} Day Streak
        </span>
      </div>
    </section>
  );
};
