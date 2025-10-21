import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import type { UserState, UserSettings } from '../types/user';
import type { UserInventory } from '../types/shop';

export interface UserContextValue {
  user: UserState;
  inventory: UserInventory;
  updateUser: (updates: Partial<UserState>) => Promise<void>;
  addXP: (amount: number) => Promise<void>;
  addCoins: (amount: number) => Promise<void>;
  addGems: (amount: number) => Promise<void>;
  spendCoins: (amount: number) => Promise<boolean>;
  spendGems: (amount: number) => Promise<boolean>;
  updateSettings: (settings: Partial<UserSettings>) => Promise<void>;
  incrementStreak: () => Promise<void>;
  resetStreak: () => Promise<void>;
  updateStats: (stats: Partial<UserState['stats']>) => Promise<void>;
  addToInventory: (itemId: string, category: 'foods' | 'cosmetics' | 'powerUps', quantity?: number) => Promise<void>;
  removeFromInventory: (itemId: string, category: 'foods' | 'cosmetics' | 'powerUps', quantity?: number) => Promise<void>;
  isLoading: boolean;
}

const UserContext = createContext<UserContextValue | undefined>(undefined);

const BACKEND_URL = 'http://localhost:8080';

// Default user state
const createDefaultUser = (): UserState => ({
  id: crypto.randomUUID(),
  name: 'Young Explorer',
  avatar: undefined,
  level: 1,
  xp: 0,
  xpToNextLevel: 100,
  coins: 100,
  gems: 10,
  streak: 0,
  lastLogin: Date.now(),
  stats: {
    totalReadings: 0,
    totalQuizzes: 0,
    totalCorrectAnswers: 0,
    totalWords: 0,
    averageQuizScore: 0,
    longestStreak: 0,
  },
  settings: {
    primaryLanguage: 'en',
    secondaryLanguage: 'ko',
    languageBlendLevel: 0,
    showHints: true,
    showRomanization: true,
    theme: 'space',
    audioEnabled: true,
    audioSpeed: 1.0,
    fontSize: 'normal',
    highContrast: false,
    reducedMotion: false,
    parentalConsentGiven: false,
  },
});

// XP calculation helper
const calculateXPToNextLevel = (level: number): number => {
  return Math.floor(100 * Math.pow(1.5, level - 1));
};

// Default inventory
const createDefaultInventory = (): UserInventory => ({
  foods: [],
  cosmetics: [],
  powerUps: new Map<string, number>(),
  equippedCosmetics: {},
});

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserState>(createDefaultUser);
  const [inventory, setInventory] = useState<UserInventory>(createDefaultInventory);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from backend or localStorage
  useEffect(() => {
    const loadUser = async () => {
      try {
        // Try to load from backend first
        const response = await fetch(`${BACKEND_URL}/api/user`, {
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data);
        } else {
          // Fallback to localStorage
          const stored = localStorage.getItem('readingApp_user');
          if (stored) {
            setUser(JSON.parse(stored));
          } else {
            // Create new user
            const newUser = createDefaultUser();
            setUser(newUser);
            localStorage.setItem('readingApp_user', JSON.stringify(newUser));
          }
        }

        // Load inventory
        const inventoryStored = localStorage.getItem('readingApp_inventory');
        if (inventoryStored) {
          const parsedInventory = JSON.parse(inventoryStored);
          // Convert powerUps array back to Map
          setInventory({
            ...parsedInventory,
            powerUps: new Map(parsedInventory.powerUps || []),
          });
        } else {
          const newInventory = createDefaultInventory();
          setInventory(newInventory);
          localStorage.setItem('readingApp_inventory', JSON.stringify({
            ...newInventory,
            powerUps: Array.from(newInventory.powerUps.entries()),
          }));
        }
      } catch (error) {
        console.error('Failed to load user:', error);
        // Fallback to localStorage
        const stored = localStorage.getItem('readingApp_user');
        if (stored) {
          setUser(JSON.parse(stored));
        } else {
          const newUser = createDefaultUser();
          setUser(newUser);
          localStorage.setItem('readingApp_user', JSON.stringify(newUser));
        }

        // Load inventory fallback
        const inventoryStored = localStorage.getItem('readingApp_inventory');
        if (inventoryStored) {
          const parsedInventory = JSON.parse(inventoryStored);
          setInventory({
            ...parsedInventory,
            powerUps: new Map(parsedInventory.powerUps || []),
          });
        } else {
          setInventory(createDefaultInventory());
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  // Persist user changes
  const persistUser = useCallback(async (updatedUser: UserState) => {
    setUser(updatedUser);
    localStorage.setItem('readingApp_user', JSON.stringify(updatedUser));

    // Try to sync with backend
    try {
      await fetch(`${BACKEND_URL}/api/user`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(updatedUser),
      });
    } catch (error) {
      console.warn('Failed to sync user with backend:', error);
    }
  }, []);

  const updateUser = useCallback(async (updates: Partial<UserState>) => {
    const updatedUser = { ...user, ...updates };
    await persistUser(updatedUser);
  }, [user, persistUser]);

  const addXP = useCallback(async (amount: number) => {
    let newXP = user.xp + amount;
    let newLevel = user.level;
    let newXPToNextLevel = user.xpToNextLevel;

    // Level up logic
    while (newXP >= newXPToNextLevel) {
      newXP -= newXPToNextLevel;
      newLevel++;
      newXPToNextLevel = calculateXPToNextLevel(newLevel);
    }

    await persistUser({
      ...user,
      xp: newXP,
      level: newLevel,
      xpToNextLevel: newXPToNextLevel,
    });
  }, [user, persistUser]);

  const addCoins = useCallback(async (amount: number) => {
    await persistUser({
      ...user,
      coins: user.coins + amount,
    });
  }, [user, persistUser]);

  const addGems = useCallback(async (amount: number) => {
    await persistUser({
      ...user,
      gems: user.gems + amount,
    });
  }, [user, persistUser]);

  const spendCoins = useCallback(async (amount: number): Promise<boolean> => {
    if (user.coins < amount) return false;

    await persistUser({
      ...user,
      coins: user.coins - amount,
    });
    return true;
  }, [user, persistUser]);

  const spendGems = useCallback(async (amount: number): Promise<boolean> => {
    if (user.gems < amount) return false;

    await persistUser({
      ...user,
      gems: user.gems - amount,
    });
    return true;
  }, [user, persistUser]);

  const updateSettings = useCallback(async (settings: Partial<UserSettings>) => {
    await persistUser({
      ...user,
      settings: { ...user.settings, ...settings },
    });
  }, [user, persistUser]);

  const incrementStreak = useCallback(async () => {
    const newStreak = user.streak + 1;
    const longestStreak = Math.max(user.stats.longestStreak, newStreak);

    await persistUser({
      ...user,
      streak: newStreak,
      lastLogin: Date.now(),
      stats: {
        ...user.stats,
        longestStreak,
      },
    });
  }, [user, persistUser]);

  const resetStreak = useCallback(async () => {
    await persistUser({
      ...user,
      streak: 0,
      lastLogin: Date.now(),
    });
  }, [user, persistUser]);

  const updateStats = useCallback(async (stats: Partial<UserState['stats']>) => {
    await persistUser({
      ...user,
      stats: { ...user.stats, ...stats },
    });
  }, [user, persistUser]);

  // Persist inventory changes
  const persistInventory = useCallback(async (updatedInventory: UserInventory) => {
    setInventory(updatedInventory);
    // Convert Map to array for JSON serialization
    const serializedInventory = {
      ...updatedInventory,
      powerUps: Array.from(updatedInventory.powerUps.entries()),
    };
    localStorage.setItem('readingApp_inventory', JSON.stringify(serializedInventory));

    // Try to sync with backend
    try {
      await fetch(`${BACKEND_URL}/api/user/inventory`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(serializedInventory),
      });
    } catch (error) {
      console.warn('Failed to sync inventory with backend:', error);
    }
  }, []);

  const addToInventory = useCallback(async (
    itemId: string,
    category: 'foods' | 'cosmetics' | 'powerUps',
    quantity: number = 1
  ) => {
    const updatedInventory = { ...inventory };

    if (category === 'powerUps') {
      const currentCount = updatedInventory.powerUps.get(itemId) || 0;
      updatedInventory.powerUps.set(itemId, currentCount + quantity);
    } else if (category === 'foods') {
      updatedInventory.foods = [...updatedInventory.foods, itemId];
    } else if (category === 'cosmetics') {
      if (!updatedInventory.cosmetics.includes(itemId)) {
        updatedInventory.cosmetics = [...updatedInventory.cosmetics, itemId];
      }
    }

    await persistInventory(updatedInventory);
  }, [inventory, persistInventory]);

  const removeFromInventory = useCallback(async (
    itemId: string,
    category: 'foods' | 'cosmetics' | 'powerUps',
    quantity: number = 1
  ) => {
    const updatedInventory = { ...inventory };

    if (category === 'powerUps') {
      const currentCount = updatedInventory.powerUps.get(itemId) || 0;
      if (currentCount <= quantity) {
        updatedInventory.powerUps.delete(itemId);
      } else {
        updatedInventory.powerUps.set(itemId, currentCount - quantity);
      }
    } else if (category === 'foods') {
      const index = updatedInventory.foods.indexOf(itemId);
      if (index > -1) {
        updatedInventory.foods = [
          ...updatedInventory.foods.slice(0, index),
          ...updatedInventory.foods.slice(index + 1),
        ];
      }
    } else if (category === 'cosmetics') {
      updatedInventory.cosmetics = updatedInventory.cosmetics.filter(id => id !== itemId);
    }

    await persistInventory(updatedInventory);
  }, [inventory, persistInventory]);

  const value: UserContextValue = {
    user,
    inventory,
    updateUser,
    addXP,
    addCoins,
    addGems,
    spendCoins,
    spendGems,
    updateSettings,
    incrementStreak,
    resetStreak,
    updateStats,
    addToInventory,
    removeFromInventory,
    isLoading,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
};
