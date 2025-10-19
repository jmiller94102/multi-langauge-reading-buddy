import React from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface HeaderProps {
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({ className }) => {
  const navigate = useNavigate();

  // TODO: Replace with actual user data from UserContext in Phase 2
  const coins = 125;
  const gems = 45;
  const streak = 7;

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm',
        className
      )}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo - Click to go to Dashboard */}
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-lg px-2 py-1"
          aria-label="Go to Dashboard"
        >
          <span className="text-2xl font-bold text-primary-600">📚</span>
          <span className="hidden sm:block text-xl font-bold text-gray-900">
            Reading Quest
          </span>
        </button>

        {/* Currency Display */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Coins */}
          <div
            className="flex items-center gap-1.5 bg-gradient-to-br from-yellow-50 to-yellow-100 px-3 py-1.5 rounded-full border border-yellow-200"
            role="status"
            aria-label={`${coins} coins`}
          >
            <span className="text-lg" aria-hidden="true">
              🪙
            </span>
            <span className="font-semibold text-gray-900 text-sm sm:text-base">
              {coins}
            </span>
          </div>

          {/* Gems */}
          <div
            className="flex items-center gap-1.5 bg-gradient-to-br from-blue-50 to-blue-100 px-3 py-1.5 rounded-full border border-blue-200"
            role="status"
            aria-label={`${gems} gems`}
          >
            <span className="text-lg" aria-hidden="true">
              💎
            </span>
            <span className="font-semibold text-gray-900 text-sm sm:text-base">
              {gems}
            </span>
          </div>

          {/* Streak */}
          <div
            className="hidden sm:flex items-center gap-1.5 bg-gradient-to-br from-orange-50 to-orange-100 px-3 py-1.5 rounded-full border border-orange-200"
            role="status"
            aria-label={`${streak} day streak`}
          >
            <span className="text-lg" aria-hidden="true">
              🔥
            </span>
            <span className="font-semibold text-gray-900 text-base">
              {streak}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
