import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PageLayout } from '@/components/layout/PageLayout';
import { PetCharacter } from '@/components/pet/PetCharacter';
import { EVOLUTION_STAGE_NAMES } from '@/data/petEvolution';
import { useUser } from '@/contexts/UserContext';
import { usePet } from '@/contexts/PetContext';
import { useAchievements } from '@/contexts/AchievementContext';

export const Progress: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { pet } = usePet();
  const { unlockedAchievements } = useAchievements();
  const recentAchievements = unlockedAchievements.slice(-5).reverse().slice(0, 3);

  // Calculate weekly stats (simulated - in production, would track weekly deltas)
  const weeklyStats = {
    xpGained: Math.floor(user.xp * 0.3), // Estimate ~30% of current XP from this week
    xpChange: 22,
    passagesRead: Math.floor(user.stats.totalReadings * 0.2), // Estimate ~20% from this week
    passagesChange: 3,
    quizzesCompleted: Math.floor(user.stats.totalQuizzes * 0.2),
    quizzesChange: 2,
    gemsEarned: Math.floor(user.gems * 0.15), // Estimate ~15% from this week
    achievementsUnlocked: Math.min(unlockedAchievements.length, 2),
  };

  // Calculate language progress from user stats
  // Korean progress (assuming secondary language 'ko')
  const isKoreanActive = user.settings.secondaryLanguage === 'ko';
  const koreanProgress = {
    wordsLearned: isKoreanActive ? Math.floor(user.stats.totalWords * 0.4) : 0, // Estimate Korean words
    totalWords: 500,
    passages5Plus: isKoreanActive ? Math.floor(user.stats.totalReadings * 0.3) : 0, // Readings at blend 5+
    totalPassages5Plus: 20,
    avgBlendLevel: isKoreanActive ? user.settings.languageBlendLevel : 0,
    maxBlendLevel: 10,
  };

  // Mandarin progress (assuming secondary language 'zh')
  const isMandarinActive = user.settings.secondaryLanguage === 'zh';
  const mandarinProgress = {
    wordsLearned: isMandarinActive ? Math.floor(user.stats.totalWords * 0.4) : 0,
    totalWords: 500,
    passages5Plus: isMandarinActive ? Math.floor(user.stats.totalReadings * 0.3) : 0,
    totalPassages5Plus: 20,
  };

  // Calculate quiz performance from user stats
  const quizPerformance = {
    overallAccuracy: Math.round(user.stats.averageQuizScore),
    thisWeekAccuracy: Math.min(100, Math.round(user.stats.averageQuizScore + 3)), // Slight improvement
    weekChange: 3,
    bestSubject: 'Comprehension',
    bestAccuracy: Math.min(100, Math.round(user.stats.averageQuizScore + 8)),
    needsWork: 'Vocabulary',
    needsWorkAccuracy: Math.max(0, Math.round(user.stats.averageQuizScore - 9)),
    perfectQuizzes: user.stats.totalQuizzes > 0 ? Math.floor(user.stats.totalQuizzes * 0.3) : 0,
    totalQuizzes: user.stats.totalQuizzes,
  };

  // Calculate percentages
  const koreanWordsPercent = Math.round((koreanProgress.wordsLearned / koreanProgress.totalWords) * 100);
  const koreanPassagesPercent = Math.round((koreanProgress.passages5Plus / koreanProgress.totalPassages5Plus) * 100);
  const koreanBlendPercent = Math.round((koreanProgress.avgBlendLevel / koreanProgress.maxBlendLevel) * 100);
  const mandarinWordsPercent = Math.round((mandarinProgress.wordsLearned / mandarinProgress.totalWords) * 100);
  const perfectQuizPercent = Math.round((quizPerformance.perfectQuizzes / quizPerformance.totalQuizzes) * 100);

  return (
    <PageLayout>
      <div className="space-y-4 max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="card space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-3xl" aria-hidden="true">📊</span>
            <div>
              <h1 className="text-child-xl font-bold text-gray-900">Your Learning Progress</h1>
              <p className="text-child-xs text-gray-600">Track your journey to becoming a multilingual master!</p>
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left Column - Stats */}
          <div className="lg:col-span-7 space-y-4">
            {/* Overview Stats */}
            <div className="card">
              <h2 className="text-child-lg font-bold text-gray-900 mb-3">📈 This Week's Overview</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <StatCard icon="📚" label="XP Earned" value={weeklyStats.xpGained} change={weeklyStats.xpChange} />
                <StatCard icon="📖" label="Passages" value={weeklyStats.passagesRead} change={weeklyStats.passagesChange} />
                <StatCard icon="✅" label="Quizzes" value={weeklyStats.quizzesCompleted} change={weeklyStats.quizzesChange} />
                <StatCard icon="🎯" label="Streak" value={user.streak} suffix=" days" />
                <StatCard icon="💎" label="Gems" value={weeklyStats.gemsEarned} prefix="+" />
                <StatCard icon="🏆" label="Achievements" value={weeklyStats.achievementsUnlocked} prefix="+" />
              </div>
            </div>

            {/* Language Progress */}
            <div className="card">
              <h2 className="text-child-lg font-bold text-gray-900 mb-3">🌍 Language Learning Progress</h2>

              {/* Korean */}
              <div className="mb-4">
                <h3 className="text-child-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <span>🇰🇷</span>Korean
                </h3>
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-child-xs text-gray-700 mb-1">
                      <span>Words Learned:</span>
                      <span className="font-semibold">{koreanProgress.wordsLearned} / {koreanProgress.totalWords}</span>
                    </div>
                    <ProgressBar percent={koreanWordsPercent} />
                  </div>
                  <div>
                    <div className="flex justify-between text-child-xs text-gray-700 mb-1">
                      <span>Level 5+ Passages:</span>
                      <span className="font-semibold">{koreanProgress.passages5Plus} / {koreanProgress.totalPassages5Plus}</span>
                    </div>
                    <ProgressBar percent={koreanPassagesPercent} />
                  </div>
                  <div>
                    <div className="flex justify-between text-child-xs text-gray-700 mb-1">
                      <span>Avg Blend Level:</span>
                      <span className="font-semibold">{koreanProgress.avgBlendLevel} / {koreanProgress.maxBlendLevel}</span>
                    </div>
                    <ProgressBar percent={koreanBlendPercent} />
                  </div>
                </div>
              </div>

              {/* Mandarin */}
              <div>
                <h3 className="text-child-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <span>🇨🇳</span>Mandarin
                </h3>
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-child-xs text-gray-700 mb-1">
                      <span>Words Learned:</span>
                      <span className="font-semibold">{mandarinProgress.wordsLearned} / {mandarinProgress.totalWords}</span>
                    </div>
                    <ProgressBar percent={mandarinWordsPercent} />
                  </div>
                  <div>
                    <div className="flex justify-between text-child-xs text-gray-700 mb-1">
                      <span>Level 5+ Passages:</span>
                      <span className="font-semibold">{mandarinProgress.passages5Plus} / {mandarinProgress.totalPassages5Plus}</span>
                    </div>
                    <ProgressBar percent={0} />
                  </div>
                </div>
              </div>
            </div>

            {/* Quiz Performance */}
            <div className="card">
              <h2 className="text-child-lg font-bold text-gray-900 mb-3">🎓 Quiz Performance</h2>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-child-sm font-semibold text-gray-900">Overall Accuracy</span>
                    <span className="text-child-sm font-bold text-primary-600">{quizPerformance.overallAccuracy}%</span>
                  </div>
                  <ProgressBar percent={quizPerformance.overallAccuracy} color="blue" />
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-200">
                  <div>
                    <p className="text-child-xs text-gray-600">This Week</p>
                    <p className="text-child-sm font-bold text-success-600">
                      {quizPerformance.thisWeekAccuracy}% <span className="text-child-xs">↑ {quizPerformance.weekChange}%</span>
                    </p>
                  </div>
                  <div>
                    <p className="text-child-xs text-gray-600">Trend</p>
                    <p className="text-child-sm font-bold text-success-600">↑ Improving</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-200">
                  <div className="flex justify-between mb-2">
                    <span className="text-child-xs text-gray-700">Best: {quizPerformance.bestSubject}</span>
                    <span className="text-child-xs font-semibold text-success-600">{quizPerformance.bestAccuracy}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-child-xs text-gray-700">Needs Work: {quizPerformance.needsWork}</span>
                    <span className="text-child-xs font-semibold text-amber-600">{quizPerformance.needsWorkAccuracy}%</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-200">
                  <div className="flex justify-between text-child-xs text-gray-700 mb-1">
                    <span>Perfect Quizzes:</span>
                    <span className="font-semibold">{quizPerformance.perfectQuizzes} / {quizPerformance.totalQuizzes}</span>
                  </div>
                  <ProgressBar percent={perfectQuizPercent} color="amber" />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Pet & Achievements */}
          <div className="lg:col-span-5 space-y-4">
            {/* Pet Evolution */}
            <div className="card">
              <h2 className="text-child-lg font-bold text-gray-900 mb-3">🐾 Pet Evolution</h2>
              <div className="space-y-3">
                <div className="text-center py-4 bg-gradient-to-br from-primary-50 to-accent-50 rounded-lg">
                  <div className="flex justify-center mb-2">
                    <PetCharacter emotion={pet.emotion} size="large" animate={true} />
                  </div>
                  <p className="text-child-sm font-bold text-gray-900">{pet.name}</p>
                  <p className="text-child-xs text-gray-600">Level {user.level} • {pet.evolutionTrack} Track</p>
                </div>

                <div>
                  <div className="flex justify-between text-child-xs text-gray-700 mb-1">
                    <span>Current Stage:</span>
                    <span className="font-semibold">Stage {pet.evolutionStage} ({EVOLUTION_STAGE_NAMES[pet.evolutionTrack][pet.evolutionStage]})</span>
                  </div>
                  <div className="flex justify-between text-child-xs text-gray-700">
                    <span>Next Evolution:</span>
                    <span className="font-semibold">Level 15</span>
                  </div>
                  <div className="mt-2">
                    <ProgressBar percent={Math.round((user.level / 15) * 100)} color="purple" />
                    <p className="text-child-xs text-center text-gray-600 mt-1">
                      {15 - user.level} levels to go!
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Learning Goals */}
            <div className="card">
              <h2 className="text-child-lg font-bold text-gray-900 mb-3">🎯 Learning Goals</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-child-xs font-semibold text-gray-700 mb-1">Weekly: Complete 15 passages</p>
                  <ProgressBar percent={80} />
                  <p className="text-child-xs text-gray-600 mt-1">12 / 15 (80%)</p>
                </div>
                <div>
                  <p className="text-child-xs font-semibold text-gray-700 mb-1">Monthly: Reach Level 15</p>
                  <ProgressBar percent={Math.round((user.level / 15) * 100)} />
                  <p className="text-child-xs text-gray-600 mt-1">{user.level} / 15 ({Math.round((user.level / 15) * 100)}%)</p>
                </div>
                <div>
                  <p className="text-child-xs font-semibold text-gray-700 mb-1">Long-term: Master 500 Korean words</p>
                  <ProgressBar percent={koreanWordsPercent} />
                  <p className="text-child-xs text-gray-600 mt-1">{koreanProgress.wordsLearned} / 500 ({koreanWordsPercent}%)</p>
                </div>
              </div>
            </div>

            {/* Recent Achievements */}
            <div className="card">
              <h2 className="text-child-lg font-bold text-gray-900 mb-3">🏅 Recent Achievements</h2>
              <div className="space-y-2">
                {recentAchievements.map((achievement) => (
                  <div key={achievement.id} className="flex items-center gap-3 p-2 bg-primary-50 rounded-lg">
                    <span className="text-3xl">{achievement.icon}</span>
                    <div className="flex-1">
                      <p className="text-child-xs font-bold text-gray-900">{achievement.title}</p>
                      <p className="text-[10px] text-gray-600">+{achievement.xp} XP{achievement.gems > 0 && `, +${achievement.gems} 💎`}</p>
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => navigate('/achievements')}
                  className="w-full py-2 text-child-xs font-semibold text-primary-600 hover:text-primary-700 transition-colors"
                >
                  View All Achievements →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

// Stat Card Component
const StatCard: React.FC<{ icon: string; label: string; value: number; change?: number; prefix?: string; suffix?: string }> = ({ icon, label, value, change, prefix = '', suffix = '' }) => (
  <div className="bg-gradient-to-br from-gray-50 to-white p-3 rounded-lg border border-gray-200">
    <div className="flex items-center gap-2 mb-1">
      <span className="text-xl" aria-hidden="true">{icon}</span>
      <span className="text-child-xs text-gray-600">{label}</span>
    </div>
    <p className="text-child-base font-bold text-gray-900">
      {prefix}{value}{suffix}
    </p>
    {change !== undefined && (
      <p className="text-[10px] text-success-600">↑ {change > 0 ? '+' : ''}{change}{typeof change === 'number' && change < 50 ? '%' : ''}</p>
    )}
  </div>
);

// Progress Bar Component
const ProgressBar: React.FC<{ percent: number; color?: 'blue' | 'amber' | 'purple' | 'green' }> = ({ percent, color = 'blue' }) => {
  const colorClasses = {
    blue: 'bg-gradient-to-r from-primary-400 to-primary-600',
    amber: 'bg-gradient-to-r from-amber-400 to-amber-600',
    purple: 'bg-gradient-to-r from-purple-400 to-purple-600',
    green: 'bg-gradient-to-r from-success-400 to-success-600',
  };

  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
      <div
        className={`h-full ${colorClasses[color]} transition-all duration-500`}
        style={{ width: `${Math.min(100, Math.max(0, percent))}%` }}
      />
    </div>
  );
};
