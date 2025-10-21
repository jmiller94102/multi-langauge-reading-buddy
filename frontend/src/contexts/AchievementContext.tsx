import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import type { Achievement, AchievementProgress, AchievementCategory } from '../types/achievement';

interface AchievementContextValue {
  achievements: Achievement[];
  unlockedAchievements: Achievement[];
  lockedAchievements: Achievement[];
  updateProgress: (achievementId: string, progress: number) => Promise<void>;
  unlockAchievement: (achievementId: string) => Promise<Achievement | null>;
  checkAchievements: (stats: Record<string, number>) => Promise<Achievement[]>;
  getAchievementsByCategory: (category: AchievementCategory) => Achievement[];
  isLoading: boolean;
}

const AchievementContext = createContext<AchievementContextValue | undefined>(undefined);

const BACKEND_URL = 'http://localhost:8080';

// Default achievements data
const getDefaultAchievements = (): Achievement[] => {
  const stored = localStorage.getItem('readingApp_achievementsData');
  if (stored) {
    return JSON.parse(stored);
  }

  // Import from data file if it exists
  try {
    const achievementsData = require('../data/achievements').achievements;
    return achievementsData.map((a: any) => ({
      ...a,
      unlocked: false,
      currentProgress: 0,
    }));
  } catch {
    // Fallback to basic achievements
    return [
      {
        id: 'first-read',
        title: 'First Steps',
        description: 'Complete your first reading',
        icon: '📖',
        category: 'reading',
        rarity: 'common',
        requirement: 'Complete 1 reading',
        targetValue: 1,
        xp: 50,
        coins: 25,
        gems: 0,
        unlocked: false,
        currentProgress: 0,
      },
      {
        id: 'quiz-ace',
        title: 'Quiz Ace',
        description: 'Score 100% on a quiz',
        icon: '💯',
        category: 'quiz',
        rarity: 'rare',
        requirement: 'Perfect score on quiz',
        targetValue: 1,
        xp: 100,
        coins: 50,
        gems: 2,
        unlocked: false,
        currentProgress: 0,
      },
      {
        id: 'week-streak',
        title: 'Week Warrior',
        description: 'Maintain a 7-day streak',
        icon: '🔥',
        category: 'streak',
        rarity: 'epic',
        requirement: '7-day streak',
        targetValue: 7,
        xp: 200,
        coins: 100,
        gems: 5,
        unlocked: false,
        currentProgress: 0,
      },
      {
        id: 'polyglot',
        title: 'Polyglot',
        description: 'Try all blend levels',
        icon: '🌍',
        category: 'language',
        rarity: 'rare',
        requirement: 'Try blend levels 0-10',
        targetValue: 11,
        xp: 150,
        coins: 75,
        gems: 3,
        unlocked: false,
        currentProgress: 0,
      },
    ];
  }
};

export const AchievementProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [achievements, setAchievements] = useState<Achievement[]>(getDefaultAchievements);
  const [isLoading, setIsLoading] = useState(true);

  // Load achievements from backend or localStorage
  useEffect(() => {
    const loadAchievements = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/achievements`, {
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          setAchievements(data);
        } else {
          const stored = localStorage.getItem('readingApp_achievements');
          if (stored) {
            setAchievements(JSON.parse(stored));
          } else {
            const defaultAchievements = getDefaultAchievements();
            setAchievements(defaultAchievements);
            localStorage.setItem('readingApp_achievements', JSON.stringify(defaultAchievements));
          }
        }
      } catch (error) {
        console.error('Failed to load achievements:', error);
        const stored = localStorage.getItem('readingApp_achievements');
        if (stored) {
          setAchievements(JSON.parse(stored));
        } else {
          const defaultAchievements = getDefaultAchievements();
          setAchievements(defaultAchievements);
          localStorage.setItem('readingApp_achievements', JSON.stringify(defaultAchievements));
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadAchievements();
  }, []);

  // Persist achievements
  const persistAchievements = useCallback(async (updatedAchievements: Achievement[]) => {
    setAchievements(updatedAchievements);
    localStorage.setItem('readingApp_achievements', JSON.stringify(updatedAchievements));

    try {
      await fetch(`${BACKEND_URL}/api/achievements`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(updatedAchievements),
      });
    } catch (error) {
      console.warn('Failed to sync achievements with backend:', error);
    }
  }, []);

  const updateProgress = useCallback(async (achievementId: string, progress: number) => {
    const updated = achievements.map(achievement => {
      if (achievement.id !== achievementId) return achievement;

      const newProgress = Math.min(progress, achievement.targetValue);
      const shouldUnlock = newProgress >= achievement.targetValue && !achievement.unlocked;

      return {
        ...achievement,
        currentProgress: newProgress,
        unlocked: shouldUnlock || achievement.unlocked,
        unlockedAt: shouldUnlock ? Date.now() : achievement.unlockedAt,
      };
    });

    await persistAchievements(updated);
  }, [achievements, persistAchievements]);

  const unlockAchievement = useCallback(async (achievementId: string): Promise<Achievement | null> => {
    const achievement = achievements.find(a => a.id === achievementId);
    if (!achievement || achievement.unlocked) return null;

    const updated = achievements.map(a =>
      a.id === achievementId
        ? { ...a, unlocked: true, currentProgress: a.targetValue, unlockedAt: Date.now() }
        : a
    );

    await persistAchievements(updated);

    return { ...achievement, unlocked: true, unlockedAt: Date.now() };
  }, [achievements, persistAchievements]);

  const checkAchievements = useCallback(async (stats: Record<string, number>): Promise<Achievement[]> => {
    const newlyUnlocked: Achievement[] = [];

    const updated = achievements.map(achievement => {
      if (achievement.unlocked) return achievement;

      // Check if achievement should be unlocked based on stats
      let shouldUnlock = false;
      let newProgress = achievement.currentProgress;

      // Match achievement ID patterns to stats
      if (achievement.id.includes('reading') && stats.totalReadings !== undefined) {
        newProgress = stats.totalReadings;
        shouldUnlock = newProgress >= achievement.targetValue;
      } else if (achievement.id.includes('quiz') && stats.totalQuizzes !== undefined) {
        newProgress = stats.totalQuizzes;
        shouldUnlock = newProgress >= achievement.targetValue;
      } else if (achievement.id.includes('streak') && stats.streak !== undefined) {
        newProgress = stats.streak;
        shouldUnlock = newProgress >= achievement.targetValue;
      } else if (achievement.id.includes('xp') && stats.totalXP !== undefined) {
        newProgress = stats.totalXP;
        shouldUnlock = newProgress >= achievement.targetValue;
      }

      if (shouldUnlock) {
        const unlocked = { ...achievement, unlocked: true, currentProgress: newProgress, unlockedAt: Date.now() };
        newlyUnlocked.push(unlocked);
        return unlocked;
      }

      return { ...achievement, currentProgress: newProgress };
    });

    if (newlyUnlocked.length > 0) {
      await persistAchievements(updated);
    }

    return newlyUnlocked;
  }, [achievements, persistAchievements]);

  const getAchievementsByCategory = useCallback((category: AchievementCategory): Achievement[] => {
    return achievements.filter(a => a.category === category);
  }, [achievements]);

  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const lockedAchievements = achievements.filter(a => !a.unlocked);

  const value: AchievementContextValue = {
    achievements,
    unlockedAchievements,
    lockedAchievements,
    updateProgress,
    unlockAchievement,
    checkAchievements,
    getAchievementsByCategory,
    isLoading,
  };

  return <AchievementContext.Provider value={value}>{children}</AchievementContext.Provider>;
};

export const useAchievements = () => {
  const context = useContext(AchievementContext);
  if (!context) {
    throw new Error('useAchievements must be used within AchievementProvider');
  }
  return context;
};
