import React from 'react';

interface ProgressSummaryProps {
  unlockedCount: number;
  totalCount: number;
}

export const ProgressSummary: React.FC<ProgressSummaryProps> = ({ unlockedCount, totalCount }) => {
  const percentage = Math.round((unlockedCount / totalCount) * 100);

  return (
    <div className="card space-y-4">
      {/* Title */}
      <div className="flex items-center gap-2">
        <span className="text-3xl" aria-hidden="true">🏆</span>
        <div>
          <h1 className="text-child-xl font-bold text-gray-900">Achievements</h1>
          <p className="text-child-xs text-gray-600">Unlock badges by completing challenges!</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-child-sm font-semibold text-gray-900">
            Progress: {unlockedCount} / {totalCount} Unlocked
          </p>
          <p className="text-child-sm font-bold text-primary-600">{percentage}%</p>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary-500 via-accent-500 to-success-500 transition-all duration-700 rounded-full"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
};
