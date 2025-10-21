import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Achievement } from '@/types/achievement';

interface MotivationalSectionProps {
  nextAchievement: Achievement | null;
}

export const MotivationalSection: React.FC<MotivationalSectionProps> = ({ nextAchievement }) => {
  const navigate = useNavigate();

  return (
    <div className="card bg-gradient-to-br from-primary-50 to-accent-50 border-primary-200">
      <div className="space-y-4">
        <h2 className="text-child-lg font-bold text-gray-900 flex items-center gap-2">
          <span className="text-2xl" aria-hidden="true">🌟</span>
          Keep Going!
        </h2>

        <p className="text-child-sm text-gray-700">
          You're doing great! Complete more readings and quizzes to unlock new achievements.
        </p>

        {nextAchievement && (
          <div className="bg-white rounded-lg p-4 border-2 border-primary-200">
            <p className="text-child-xs font-semibold text-gray-700 mb-2">
              Next Achievement:
            </p>
            <div className="flex items-center gap-3">
              <span className="text-4xl" aria-hidden="true">{nextAchievement.icon}</span>
              <div className="flex-1">
                <p className="text-child-sm font-bold text-gray-900">{nextAchievement.title}</p>
                <p className="text-child-xs text-gray-600">
                  {nextAchievement.targetValue - nextAchievement.currentProgress} more needed!
                </p>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={() => navigate('/reading')}
          className="btn-primary w-full lg:w-auto flex items-center justify-center gap-2"
        >
          Start Reading
          <span aria-hidden="true">→</span>
        </button>
      </div>
    </div>
  );
};
