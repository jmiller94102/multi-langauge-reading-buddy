import React from 'react';
import type { Quest } from '@/types/quest';
import { Button } from '@/components/common/Button';

interface QuestCardProps {
  quest: Quest;
  onClaim?: (questId: string) => void;
}

export const QuestCard: React.FC<QuestCardProps> = ({ quest, onClaim }) => {
  const progress = (quest.currentProgress / quest.targetProgress) * 100;
  const isComplete = quest.status === 'completed';
  const isClaimed = quest.status === 'claimed';

  const getProgressColor = () => {
    if (isClaimed) return 'bg-gray-400';
    if (isComplete) return 'bg-green-500';
    return 'bg-primary-500';
  };

  return (
    <div className="card-hover py-2 px-3">
      {/* Header - Compact inline */}
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="text-lg shrink-0" aria-hidden="true">{quest.icon}</span>
          <h3 className="text-child-sm font-bold text-gray-900 truncate">{quest.title}</h3>
          <span className="text-child-xs text-gray-500 shrink-0">
            [{quest.currentProgress}/{quest.targetProgress}]
          </span>
          {isComplete && !isClaimed && <span className="text-sm text-green-600 shrink-0">✓</span>}
          {isClaimed && <span className="text-sm text-gray-400 shrink-0">✓</span>}
        </div>
      </div>

      {/* Progress Bar and Rewards - Single Line */}
      <div className="flex items-center gap-2 mb-1">
        <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${getProgressColor()}`}
            style={{ width: `${progress}%` }}
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
        <div className="flex items-center gap-2 text-[11px] font-medium shrink-0">
          {quest.rewards.xp > 0 && <span className="text-primary-600">+{quest.rewards.xp}XP</span>}
          {quest.rewards.coins > 0 && <span className="text-yellow-600">+{quest.rewards.coins}🪙</span>}
          {quest.rewards.gems > 0 && <span className="text-blue-600">+{quest.rewards.gems}💎</span>}
        </div>
      </div>

      {/* Claim Button - Compact */}
      {isComplete && !isClaimed && onClaim && (
        <Button
          variant="primary"
          size="small"
          onClick={() => onClaim(quest.id)}
          className="w-full py-1.5 text-child-xs"
          aria-label={`Claim rewards for ${quest.title}`}
        >
          ✨ Claim
        </Button>
      )}
    </div>
  );
};
