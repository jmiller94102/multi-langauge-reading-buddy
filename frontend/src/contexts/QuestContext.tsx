import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import type { Quest, QuestFrequency, QuestCategory, DailyQuestsState, WeeklyQuestsState } from '../types/quest';

interface QuestContextValue {
  dailyQuests: Quest[];
  weeklyQuests: Quest[];
  updateQuestProgress: (questId: string, progress: number) => Promise<void>;
  completeQuest: (questId: string) => Promise<void>;
  claimQuest: (questId: string) => Promise<{ xp: number; coins: number; gems: number } | null>;
  resetDailyQuests: () => Promise<void>;
  resetWeeklyQuests: () => Promise<void>;
  isLoading: boolean;
}

const QuestContext = createContext<QuestContextValue | undefined>(undefined);

const BACKEND_URL = 'http://localhost:8080';

// Generate default quests
const generateDailyQuests = (): Quest[] => [
  {
    id: 'daily-1',
    title: 'Read a Story',
    description: 'Complete 1 reading session',
    icon: '📖',
    frequency: 'daily',
    category: 'reading',
    currentProgress: 0,
    targetProgress: 1,
    status: 'active',
    rewards: { xp: 50, coins: 25, gems: 0 },
    expiresAt: Date.now() + 24 * 60 * 60 * 1000,
  },
  {
    id: 'daily-2',
    title: 'Quiz Master',
    description: 'Score 80% or higher on a quiz',
    icon: '🎯',
    frequency: 'daily',
    category: 'quiz',
    currentProgress: 0,
    targetProgress: 1,
    status: 'active',
    rewards: { xp: 75, coins: 35, gems: 1 },
    expiresAt: Date.now() + 24 * 60 * 60 * 1000,
  },
  {
    id: 'daily-3',
    title: 'Language Explorer',
    description: 'Try blend level 3 or higher',
    icon: '🌍',
    frequency: 'daily',
    category: 'language',
    currentProgress: 0,
    targetProgress: 1,
    status: 'active',
    rewards: { xp: 40, coins: 20, gems: 0 },
    expiresAt: Date.now() + 24 * 60 * 60 * 1000,
  },
];

const generateWeeklyQuests = (): Quest[] => [
  {
    id: 'weekly-1',
    title: 'Reading Enthusiast',
    description: 'Complete 10 reading sessions',
    icon: '📚',
    frequency: 'weekly',
    category: 'reading',
    currentProgress: 0,
    targetProgress: 10,
    status: 'active',
    rewards: { xp: 300, coins: 150, gems: 5 },
    expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'weekly-2',
    title: 'Streak Champion',
    description: 'Maintain a 7-day streak',
    icon: '🔥',
    frequency: 'weekly',
    category: 'streak',
    currentProgress: 0,
    targetProgress: 7,
    status: 'active',
    rewards: { xp: 500, coins: 250, gems: 10 },
    expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'weekly-3',
    title: 'XP Hunter',
    description: 'Earn 1000 XP this week',
    icon: '⭐',
    frequency: 'weekly',
    category: 'xp',
    currentProgress: 0,
    targetProgress: 1000,
    status: 'active',
    rewards: { xp: 200, coins: 100, gems: 3 },
    expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
  },
];

export const QuestProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [dailyQuests, setDailyQuests] = useState<Quest[]>(generateDailyQuests);
  const [weeklyQuests, setWeeklyQuests] = useState<Quest[]>(generateWeeklyQuests);
  const [isLoading, setIsLoading] = useState(true);

  // Load quests from backend or localStorage
  useEffect(() => {
    const loadQuests = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/quests`, {
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          setDailyQuests(data.daily || generateDailyQuests());
          setWeeklyQuests(data.weekly || generateWeeklyQuests());
        } else {
          const storedDaily = localStorage.getItem('readingApp_dailyQuests');
          const storedWeekly = localStorage.getItem('readingApp_weeklyQuests');

          if (storedDaily) setDailyQuests(JSON.parse(storedDaily));
          else setDailyQuests(generateDailyQuests());

          if (storedWeekly) setWeeklyQuests(JSON.parse(storedWeekly));
          else setWeeklyQuests(generateWeeklyQuests());
        }
      } catch (error) {
        console.error('Failed to load quests:', error);
        const storedDaily = localStorage.getItem('readingApp_dailyQuests');
        const storedWeekly = localStorage.getItem('readingApp_weeklyQuests');

        if (storedDaily) setDailyQuests(JSON.parse(storedDaily));
        else setDailyQuests(generateDailyQuests());

        if (storedWeekly) setWeeklyQuests(JSON.parse(storedWeekly));
        else setWeeklyQuests(generateWeeklyQuests());
      } finally {
        setIsLoading(false);
      }
    };

    loadQuests();
  }, []);

  // Auto-check for expired quests
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();

      setDailyQuests(prev => {
        const needsReset = prev.some(q => q.expiresAt < now);
        if (needsReset) {
          const newQuests = generateDailyQuests();
          localStorage.setItem('readingApp_dailyQuests', JSON.stringify(newQuests));
          return newQuests;
        }
        return prev;
      });

      setWeeklyQuests(prev => {
        const needsReset = prev.some(q => q.expiresAt < now);
        if (needsReset) {
          const newQuests = generateWeeklyQuests();
          localStorage.setItem('readingApp_weeklyQuests', JSON.stringify(newQuests));
          return newQuests;
        }
        return prev;
      });
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  // Persist quests
  const persistQuests = useCallback(async (daily: Quest[], weekly: Quest[]) => {
    setDailyQuests(daily);
    setWeeklyQuests(weekly);
    localStorage.setItem('readingApp_dailyQuests', JSON.stringify(daily));
    localStorage.setItem('readingApp_weeklyQuests', JSON.stringify(weekly));

    try {
      await fetch(`${BACKEND_URL}/api/quests`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ daily, weekly }),
      });
    } catch (error) {
      console.warn('Failed to sync quests with backend:', error);
    }
  }, []);

  const updateQuestProgress = useCallback(async (questId: string, progress: number) => {
    const updateQuest = (quest: Quest): Quest => {
      if (quest.id !== questId) return quest;
      const newProgress = Math.min(progress, quest.targetProgress);
      const isComplete = newProgress >= quest.targetProgress;
      return {
        ...quest,
        currentProgress: newProgress,
        status: isComplete ? 'completed' : 'active',
        completedAt: isComplete ? Date.now() : undefined,
      };
    };

    const newDaily = dailyQuests.map(updateQuest);
    const newWeekly = weeklyQuests.map(updateQuest);

    await persistQuests(newDaily, newWeekly);
  }, [dailyQuests, weeklyQuests, persistQuests]);

  const completeQuest = useCallback(async (questId: string) => {
    const completeQuestFn = (quest: Quest): Quest => {
      if (quest.id !== questId) return quest;
      return {
        ...quest,
        currentProgress: quest.targetProgress,
        status: 'completed',
        completedAt: Date.now(),
      };
    };

    const newDaily = dailyQuests.map(completeQuestFn);
    const newWeekly = weeklyQuests.map(completeQuestFn);

    await persistQuests(newDaily, newWeekly);
  }, [dailyQuests, weeklyQuests, persistQuests]);

  const claimQuest = useCallback(async (questId: string) => {
    const claimQuestFn = (quest: Quest): Quest => {
      if (quest.id !== questId || quest.status !== 'completed') return quest;
      return {
        ...quest,
        status: 'claimed',
        claimedAt: Date.now(),
      };
    };

    const quest = [...dailyQuests, ...weeklyQuests].find(q => q.id === questId);
    if (!quest || quest.status !== 'completed') return null;

    const newDaily = dailyQuests.map(claimQuestFn);
    const newWeekly = weeklyQuests.map(claimQuestFn);

    await persistQuests(newDaily, newWeekly);

    return quest.rewards;
  }, [dailyQuests, weeklyQuests, persistQuests]);

  const resetDailyQuests = useCallback(async () => {
    const newQuests = generateDailyQuests();
    await persistQuests(newQuests, weeklyQuests);
  }, [weeklyQuests, persistQuests]);

  const resetWeeklyQuests = useCallback(async () => {
    const newQuests = generateWeeklyQuests();
    await persistQuests(dailyQuests, newQuests);
  }, [dailyQuests, persistQuests]);

  const value: QuestContextValue = {
    dailyQuests,
    weeklyQuests,
    updateQuestProgress,
    completeQuest,
    claimQuest,
    resetDailyQuests,
    resetWeeklyQuests,
    isLoading,
  };

  return <QuestContext.Provider value={value}>{children}</QuestContext.Provider>;
};

export const useQuests = () => {
  const context = useContext(QuestContext);
  if (!context) {
    throw new Error('useQuests must be used within QuestProvider');
  }
  return context;
};
