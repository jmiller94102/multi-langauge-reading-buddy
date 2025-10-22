import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Achievement } from '@/types/achievement';
import { getAchievementProgress } from '@/data/achievements';

interface AchievementModalProps {
  achievement: Achievement | null;
  onClose: () => void;
}

export const AchievementModal: React.FC<AchievementModalProps> = ({ achievement, onClose }) => {
  if (!achievement) return null;

  const progress = getAchievementProgress(achievement);
  const isUnlocked = achievement.unlocked;

  // Get time since unlock
  const getUnlockTime = () => {
    if (!achievement.unlockedAt) return '';
    const date = new Date(achievement.unlockedAt);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (24 * 60 * 60 * 1000));

    if (days === 0) {
      const hours = Math.floor(diff / (60 * 60 * 1000));
      if (hours === 0) {
        const minutes = Math.floor(diff / (60 * 1000));
        return minutes <= 1 ? 'Just now' : `${minutes} minutes ago`;
      }
      return hours === 1 ? '1 hour ago' : `${hours} hours ago`;
    }
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;

    // Format as date for older achievements
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Get rarity config
  const getRarityConfig = () => {
    switch (achievement.rarity) {
      case 'rare':
        return { bg: 'from-blue-500 to-blue-600', text: 'text-blue-100', badge: 'bg-blue-600' };
      case 'epic':
        return { bg: 'from-purple-500 to-purple-600', text: 'text-purple-100', badge: 'bg-purple-600' };
      case 'legendary':
        return { bg: 'from-amber-500 to-orange-600', text: 'text-amber-100', badge: 'bg-gradient-to-r from-amber-500 to-orange-500' };
      default:
        return { bg: 'from-primary-500 to-accent-500', text: 'text-primary-100', badge: 'bg-primary-600' };
    }
  };

  const rarityConfig = getRarityConfig();

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          aria-label="Close modal"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header with gradient */}
          <div className={`bg-gradient-to-br ${rarityConfig.bg} p-6 text-center relative`}>
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors"
              aria-label="Close"
            >
              <span className="text-white text-xl font-bold">×</span>
            </button>

            {/* Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="inline-block text-8xl mb-4 drop-shadow-2xl"
            >
              {achievement.icon}
            </motion.div>

            {/* Title */}
            <h2 className={`text-child-xl font-bold ${rarityConfig.text} mb-2`}>
              {achievement.title}
            </h2>

            {/* Rarity Badge */}
            <div className="flex items-center justify-center gap-2">
              <span className={`${rarityConfig.badge} text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg`}>
                {achievement.rarity.toUpperCase()}
              </span>
              <span
                className={`${
                  isUnlocked
                    ? 'bg-success-500 text-white'
                    : 'bg-white/20 text-white'
                } text-[10px] font-bold px-3 py-1 rounded-full shadow-lg`}
              >
                {isUnlocked ? '✅ UNLOCKED' : '🔒 LOCKED'}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            {/* Description */}
            <div>
              <h3 className="text-child-sm font-bold text-gray-900 mb-2">Description</h3>
              <p className="text-child-sm text-gray-700 leading-relaxed">
                {achievement.description}
              </p>
            </div>

            {/* Progress or Unlock Info */}
            {isUnlocked ? (
              <div className="bg-success-50 border-2 border-success-200 rounded-lg p-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-3xl">🎉</span>
                  <h3 className="text-child-md font-bold text-success-700">Achievement Unlocked!</h3>
                </div>
                <p className="text-child-sm text-success-600 text-center">
                  {getUnlockTime()}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-child-sm font-bold text-gray-900">Progress</h3>
                  <span className="text-child-sm font-bold text-primary-600">
                    {Math.round(progress)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ delay: 0.3, duration: 0.8, ease: 'easeOut' }}
                    className={`h-full transition-all duration-500 rounded-full ${
                      progress >= 80
                        ? 'bg-gradient-to-r from-success-400 to-success-600'
                        : progress >= 50
                        ? 'bg-gradient-to-r from-primary-400 to-primary-600'
                        : 'bg-gradient-to-r from-gray-400 to-gray-500'
                    }`}
                  />
                </div>
                <p className="text-child-sm text-gray-600 text-center">
                  {achievement.currentProgress} / {achievement.targetValue} {achievement.category === 'stories' ? 'stories' : achievement.category === 'quizzes' ? 'quizzes' : 'completed'}
                </p>
              </div>
            )}

            {/* Rewards */}
            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-200 rounded-lg p-4">
              <h3 className="text-child-sm font-bold text-gray-900 mb-3 text-center">
                Rewards
              </h3>
              <div className="flex items-center justify-center gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-600 mb-1">
                    +{achievement.xp}
                  </div>
                  <div className="text-[11px] text-gray-600 font-medium">XP</div>
                </div>
                {achievement.coins > 0 && (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-amber-600 mb-1">
                      +{achievement.coins}
                    </div>
                    <div className="text-[11px] text-gray-600 font-medium">Coins 🪙</div>
                  </div>
                )}
                {achievement.gems > 0 && (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-cyan-600 mb-1">
                      +{achievement.gems}
                    </div>
                    <div className="text-[11px] text-gray-600 font-medium">Gems 💎</div>
                  </div>
                )}
              </div>
            </div>

            {/* Motivational message for locked achievements */}
            {!isUnlocked && progress >= 50 && (
              <div className="text-center">
                <p className="text-child-sm text-primary-600 font-semibold">
                  {progress >= 80
                    ? "You're almost there! Keep going! 🌟"
                    : "Great progress! You're halfway there! 💪"}
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
