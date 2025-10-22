import React from 'react';
import type { Achievement } from '@/types/achievement';
import { getAchievementProgress } from '@/data/achievements';

interface AchievementCardProps {
  achievement: Achievement;
  onClick: () => void;
}

export const AchievementCard: React.FC<AchievementCardProps> = ({ achievement, onClick }) => {
  const progress = getAchievementProgress(achievement);
  const isUnlocked = achievement.unlocked;

  // Get time since unlock
  const getUnlockTime = () => {
    if (!achievement.unlockedAt) return '';
    const now = Date.now();
    const diff = now - achievement.unlockedAt;
    const days = Math.floor(diff / (24 * 60 * 60 * 1000));
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    return `${days} days ago`;
  };

  return (
    <button
      onClick={onClick}
      className={`card-hover text-left transition-all duration-200 ${
        isUnlocked
          ? 'border-primary-300 bg-gradient-to-br from-primary-50 to-white'
          : 'border-gray-200 bg-white grayscale-[50%] opacity-75 hover:grayscale-0 hover:opacity-100'
      }`}
      aria-label={`Achievement: ${achievement.title}${isUnlocked ? ', Unlocked' : ', Locked'}`}
    >
      <div className="space-y-1.5">
        {/* Status Badge */}
        <div className="flex items-center justify-between">
          <span
            className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full ${
              isUnlocked
                ? 'bg-success-100 text-success-700'
                : 'bg-gray-200 text-gray-600'
            }`}
          >
            {isUnlocked ? '✅ UNLOCKED' : '❌ LOCKED'}
          </span>
          {achievement.rarity !== 'common' && (
            <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full ${
              achievement.rarity === 'rare' ? 'bg-blue-100 text-blue-700' :
              achievement.rarity === 'epic' ? 'bg-purple-100 text-purple-700' :
              'bg-amber-100 text-amber-700'
            }`}>
              {achievement.rarity.toUpperCase()}
            </span>
          )}
        </div>

        {/* Icon */}
        <div className={`flex justify-center ${isUnlocked && 'animate-pulse'}`}>
          <div className={`text-4xl ${isUnlocked ? 'drop-shadow-lg' : 'opacity-40'}`}>
            {achievement.icon}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-[13px] font-bold text-gray-900 text-center leading-tight">
          {achievement.title}
        </h3>

        {/* Description */}
        <p className="text-[10px] text-gray-600 text-center line-clamp-2 leading-tight">
          {achievement.description}
        </p>

        {/* Progress or Unlock Date */}
        {isUnlocked ? (
          <div className="space-y-1">
            <p className="text-[10px] text-gray-600 text-center">
              Unlocked: {getUnlockTime()}
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            <p className="text-[10px] text-gray-700 font-medium">
              Progress: {achievement.currentProgress} / {achievement.targetValue}
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full transition-all duration-500 rounded-full ${
                  progress >= 80 ? 'bg-gradient-to-r from-success-400 to-success-600 animate-pulse' :
                  progress >= 50 ? 'bg-gradient-to-r from-primary-400 to-primary-600' :
                  'bg-gradient-to-r from-gray-400 to-gray-500'
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-[10px] text-gray-600 text-right">
              {Math.round(progress)}% complete
            </p>
          </div>
        )}

        {/* Rewards */}
        <div className="border-t border-gray-200 pt-1 space-y-0.5">
          <p className="text-[8px] font-semibold text-gray-700">
            {isUnlocked ? 'Rewards:' : 'Rewards:'}
          </p>
          <div className="flex items-center justify-center gap-1.5 flex-wrap">
            <span className="text-[9px] font-medium text-primary-700">+{achievement.xp} XP</span>
            {achievement.coins > 0 && (
              <span className="text-[9px] font-medium text-amber-600">+{achievement.coins} 🪙</span>
            )}
            {achievement.gems > 0 && (
              <span className="text-[9px] font-medium text-cyan-600">+{achievement.gems} 💎</span>
            )}
          </div>
        </div>
      </div>
    </button>
  );
};
