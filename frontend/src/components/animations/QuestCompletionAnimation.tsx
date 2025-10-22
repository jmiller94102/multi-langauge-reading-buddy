import React, { useEffect, useState } from 'react';

interface QuestCompletionAnimationProps {
  questTitle: string;
  xpReward: number;
  coinReward: number;
  gemReward?: number;
  onComplete: () => void;
}

export const QuestCompletionAnimation: React.FC<QuestCompletionAnimationProps> = ({
  questTitle,
  xpReward,
  coinReward,
  gemReward,
  onComplete,
}) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    setTimeout(() => setShow(true), 50);

    // Auto-close after 2.5 seconds
    const timer = setTimeout(() => {
      setShow(false);
      setTimeout(onComplete, 300); // Wait for exit animation
    }, 2500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      className={`fixed top-24 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ${
        show ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'
      }`}
    >
      <div className="bg-gradient-to-r from-success-500 to-emerald-500 text-white rounded-2xl shadow-2xl p-6 min-w-[320px] max-w-md">
        {/* Success Icon */}
        <div className="flex items-center gap-3 mb-3">
          <div className="text-4xl animate-bounce">✅</div>
          <div className="flex-1">
            <h3 className="text-lg font-bold">Quest Completed!</h3>
            <p className="text-sm opacity-90">{questTitle}</p>
          </div>
        </div>

        {/* Rewards */}
        <div className="bg-white bg-opacity-20 rounded-lg py-2 px-4">
          <div className="flex items-center justify-center gap-4 text-sm font-semibold">
            <span>+{xpReward} XP</span>
            <span>🪙 +{coinReward}</span>
            {gemReward && gemReward > 0 && <span>💎 +{gemReward}</span>}
          </div>
        </div>
      </div>
    </div>
  );
};
