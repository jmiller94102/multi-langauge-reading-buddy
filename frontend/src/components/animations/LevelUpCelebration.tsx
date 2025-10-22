import React, { useEffect, useState } from 'react';
import { Confetti } from './Confetti';

interface LevelUpCelebrationProps {
  newLevel: number;
  xpEarned: number;
  onClose: () => void;
}

export const LevelUpCelebration: React.FC<LevelUpCelebrationProps> = ({
  newLevel,
  xpEarned,
  onClose,
}) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    setTimeout(() => setShow(true), 50);

    // Auto-close after 4 seconds
    const timer = setTimeout(() => {
      setShow(false);
      setTimeout(onClose, 300); // Wait for exit animation
    }, 4000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <>
      {/* Confetti Effect */}
      <Confetti duration={4000} particleCount={80} />

      {/* Level Up Modal */}
      <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
        <div
          className={`bg-gradient-to-br from-primary-500 via-accent-500 to-purple-500 rounded-2xl p-8 max-w-md w-full text-center shadow-2xl transform transition-all duration-300 ${
            show ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
          }`}
        >
          {/* Animated Level Badge */}
          <div className="animate-bounce mb-4">
            <div className="inline-block bg-white rounded-full w-24 h-24 flex items-center justify-center shadow-lg">
              <span className="text-5xl font-bold text-primary-600">{newLevel}</span>
            </div>
          </div>

          {/* Congratulations Text */}
          <h2 className="text-3xl font-bold text-white mb-2 animate-pulse">
            LEVEL UP!
          </h2>
          <p className="text-xl text-white mb-4">
            You reached Level {newLevel}!
          </p>

          {/* XP Badge */}
          <div className="bg-white bg-opacity-20 rounded-lg py-3 px-4 mb-4">
            <p className="text-lg text-white font-semibold">
              +{xpEarned} XP Earned
            </p>
          </div>

          {/* Rewards */}
          <div className="bg-white bg-opacity-20 rounded-lg py-3 px-4 space-y-2">
            <p className="text-sm text-white font-semibold">🎁 Rewards:</p>
            <div className="flex justify-center gap-4 text-white">
              <span className="text-base">🪙 +100 Coins</span>
              <span className="text-base">💎 +5 Gems</span>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={() => {
              setShow(false);
              setTimeout(onClose, 300);
            }}
            className="mt-6 bg-white text-primary-600 font-bold py-3 px-8 rounded-full hover:bg-gray-100 transition-colors"
          >
            Awesome!
          </button>
        </div>
      </div>
    </>
  );
};
