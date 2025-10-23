import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/common/Button';

interface StreakBonusProps {
  currentStreak: number;
  longestStreak: number;
  todayComplete: boolean;
  onClaim?: () => void;
}

export const StreakBonus: React.FC<StreakBonusProps> = ({
  currentStreak,
  longestStreak,
  todayComplete,
  onClaim,
}) => {
  const navigate = useNavigate();

  // Calculate rewards based on streak (10x multiplier)
  const baseXP = 50;
  const baseCoins = 25;
  const todayXP = baseXP * 10; // 500 XP
  const todayCoins = baseCoins * 10; // 250 coins

  // Tomorrow's bonus (progressive - increases with streak)
  const tomorrowMultiplier = Math.min(1 + (currentStreak * 0.1), 3); // Cap at 3x
  const tomorrowXP = Math.floor(todayXP * tomorrowMultiplier);
  const tomorrowCoins = Math.floor(todayCoins * tomorrowMultiplier);

  return (
    <div className="card h-full flex flex-col justify-between py-2 px-3 bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-50 border-2 border-orange-200">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-1.5 mb-1.5">
          <span className="text-xl animate-pulse" aria-hidden="true">🔥</span>
          <h3 className="text-child-sm font-bold text-orange-900">Streak Bonus</h3>
        </div>

        {/* Current Streak - Large Display */}
        <div className="bg-white rounded-lg py-2 px-3 mb-2 shadow-sm">
          <div className="text-4xl font-black text-orange-600 mb-0.5 animate-bounce-slow">
            {currentStreak}
          </div>
          <div className="text-[11px] font-semibold text-gray-700">Day Streak</div>
          <div className="text-[9px] text-gray-500 mt-0.5">Best: {longestStreak} days</div>
        </div>

        {/* Today's Reward */}
        {todayComplete ? (
          <div className="mb-2">
            <div className="bg-green-50 border border-green-200 rounded py-1.5 px-2 mb-1.5">
              <div className="text-[11px] font-bold text-green-700 flex items-center justify-center gap-1">
                <span>✓</span>
                <span>Today Complete!</span>
              </div>
              <div className="text-[10px] text-green-600 mt-0.5">
                +{todayXP} XP • +{todayCoins} 🪙
              </div>
            </div>
            <Button
              variant="primary"
              size="small"
              onClick={onClaim}
              className="w-full py-1 text-[10px] bg-green-600 hover:bg-green-700"
              aria-label="Claim streak bonus"
            >
              ✨ Claim Bonus
            </Button>
          </div>
        ) : (
          <div className="mb-2">
            <div className="bg-gray-50 border border-gray-200 rounded py-1.5 px-2">
              <div className="text-[11px] font-semibold text-gray-700">Today's Bonus</div>
              <div className="text-[10px] text-gray-600 mt-0.5">
                +{todayXP} XP • +{todayCoins} 🪙
              </div>
              <div className="text-[9px] text-gray-500 italic mt-0.5">Complete a reading to unlock</div>
            </div>
          </div>
        )}
      </div>

      {/* Start Reading CTA - Prominent */}
      <div className="border-t border-orange-200 pt-2 mt-auto">
        <Button
          variant="primary"
          size="medium"
          onClick={() => navigate('/reading')}
          className="w-full bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 py-2 mb-2"
          aria-label="Start reading a new story"
        >
          <span className="text-child-sm font-bold flex items-center justify-center gap-2">
            <span aria-hidden="true">▶</span>
            Start Reading
          </span>
        </Button>

        <div className="text-center">
          <div className="text-[11px] font-bold text-orange-900 mb-1.5 flex items-center justify-center gap-1">
            <span className="text-xs">🎁</span>
            <span>Come Back Tomorrow!</span>
          </div>

          {/* Visual ladder showing progression */}
          <div className="bg-gradient-to-t from-yellow-100 to-orange-100 rounded py-2 px-2 mb-1.5 border border-orange-300">
            <div className="flex items-center justify-center gap-2 mb-1">
              <div className="flex flex-col items-center">
                <span className="text-xl">🔥</span>
                <div className="text-[10px] font-bold text-orange-600">{currentStreak + 1}</div>
              </div>
              <div className="text-base">→</div>
              <div className="flex flex-col items-center">
                <span className="text-xl">💰</span>
                <div className="text-[10px] font-bold text-orange-600">
                  {tomorrowMultiplier.toFixed(1)}x
                </div>
              </div>
            </div>

            <div className="text-[12px] font-black text-orange-700">
              +{tomorrowXP} XP
            </div>
            <div className="text-[10px] font-bold text-orange-600">
              +{tomorrowCoins} 🪙
            </div>
          </div>

          {/* Motivational message */}
          <div className="text-[9px] text-orange-700 font-medium italic">
            {tomorrowMultiplier > 1.5
              ? "🌟 You're on fire! Keep going!"
              : "📈 Rewards grow each day!"}
          </div>
        </div>
      </div>
    </div>
  );
};
