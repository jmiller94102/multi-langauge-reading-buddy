import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
// TEMPORARY: Stack Auth disabled for MVP - will re-enable post-MVP
// import { useUser as useStackUser } from '@stackframe/stack';
import type { UserState, UserSettings } from '../types/user';
import type { UserInventory } from '../types/shop';

export interface LevelUpCelebration {
  newLevel: number;
  xpEarned: number;
}

export interface UserContextValue {
  user: UserState;
  stackUser: any | null;
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
  levelUpCelebration: LevelUpCelebration | null;
  clearLevelUpCelebration: () => void;
  getDailyXPGain: () => number;
  getDailyLevelGain: () => number;
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
  xpHistory: [],
  levelHistory: [{ level: 1, timestamp: Date.now() }],
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
  // TEMPORARY: Stack Auth disabled for MVP - will re-enable post-MVP
  const stackUser = null; // useStackUser(); // Stack Auth user
  const [user, setUser] = useState<UserState>(createDefaultUser);
  const [inventory, setInventory] = useState<UserInventory>(createDefaultInventory);
  const [isLoading, setIsLoading] = useState(true);
  const [levelUpCelebration, setLevelUpCelebration] = useState<LevelUpCelebration | null>(null);

  // Load user from backend or localStorage, sync with Stack Auth
  useEffect(() => {
    const loadUser = async () => {
      // If no Stack Auth user, don't load app data
      if (!stackUser) {
        setUser(createDefaultUser);
        setInventory(createDefaultInventory);
        setIsLoading(false);
        return;
      }

      try {
        // Use Stack user ID for storage key
        const storageKey = `readingApp_user_${stackUser.id}`;
        const inventoryKey = `readingApp_inventory_${stackUser.id}`;

        // Try to load from backend first
        const response = await fetch(`${BACKEND_URL}/api/user`, {
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data);
        } else {
          // Fallback to localStorage
          const stored = localStorage.getItem(storageKey);
          if (stored) {
            setUser(JSON.parse(stored));
          } else {
            // Create new user for this Stack Auth user
            const newUser = createDefaultUser();
            newUser.id = stackUser.id; // Use Stack user ID
            newUser.name = stackUser.displayName || 'Young Explorer';
            setUser(newUser);
            localStorage.setItem(storageKey, JSON.stringify(newUser));
          }
        }

        // Load inventory
        const inventoryStored = localStorage.getItem(inventoryKey);
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
          localStorage.setItem(inventoryKey, JSON.stringify({
            ...newInventory,
            powerUps: Array.from(newInventory.powerUps.entries()),
          }));
        }
      } catch (error) {
        console.error('Failed to load user:', error);
        // Fallback to localStorage
        const storageKey = `readingApp_user_${stackUser.id}`;
        const inventoryKey = `readingApp_inventory_${stackUser.id}`;
        
        const stored = localStorage.getItem(storageKey);
        if (stored) {
          setUser(JSON.parse(stored));
        } else {
          const newUser = createDefaultUser();
          newUser.id = stackUser.id;
          newUser.name = stackUser.displayName || 'Young Explorer';
          setUser(newUser);
          localStorage.setItem(storageKey, JSON.stringify(newUser));
        }

        // Load inventory fallback
        const inventoryStored = localStorage.getItem(inventoryKey);
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
  }, [stackUser]);

  // Persist user changes
  const persistUser = useCallback(async (updatedUser: UserState) => {
    setUser(updatedUser);
    
    // Use Stack user ID for storage key if authenticated
    const storageKey = stackUser ? `readingApp_user_${stackUser.id}` : 'readingApp_user';
    localStorage.setItem(storageKey, JSON.stringify(updatedUser));

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
  }, [stackUser]);

  const updateUser = useCallback(async (updates: Partial<UserState>) => {
    const updatedUser = { ...user, ...updates };
    await persistUser(updatedUser);
  }, [user, persistUser]);

  const addXP = useCallback(async (amount: number) => {
    let newXP = user.xp + amount;
    let newLevel = user.level;
    let newXPToNextLevel = user.xpToNextLevel;
    const oldLevel = user.level;
    const now = Date.now();

    // Track XP gain (initialize arrays if they don't exist)
    const newXPHistory = [...(user.xpHistory || []), { amount, timestamp: now }];

    // Level up logic
    const levelUps: Array<{ level: number; timestamp: number }> = [];
    while (newXP >= newXPToNextLevel) {
      newXP -= newXPToNextLevel;
      newLevel++;
      newXPToNextLevel = calculateXPToNextLevel(newLevel);
      levelUps.push({ level: newLevel, timestamp: now });
    }

    // Update user state
    await persistUser({
      ...user,
      xp: newXP,
      level: newLevel,
      xpToNextLevel: newXPToNextLevel,
      xpHistory: newXPHistory,
      levelHistory: levelUps.length > 0 ? [...(user.levelHistory || []), ...levelUps] : (user.levelHistory || []),
    });

    // Trigger level-up celebration if leveled up
    if (newLevel > oldLevel) {
      setLevelUpCelebration({
        newLevel,
        xpEarned: amount,
      });
    }
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
    
    // Use Stack user ID for storage key if authenticated
    const inventoryKey = stackUser ? `readingApp_inventory_${stackUser.id}` : 'readingApp_inventory';
    localStorage.setItem(inventoryKey, JSON.stringify(serializedInventory));

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
  }, [stackUser]);

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

  const clearLevelUpCelebration = useCallback(() => {
    setLevelUpCelebration(null);
  }, []);

  // Calculate daily XP gains
  const getDailyXPGain = useCallback((): number => {
    const now = Date.now();
    const oneDayAgo = now - (24 * 60 * 60 * 1000);

    return (user.xpHistory || [])
      .filter(entry => entry.timestamp >= oneDayAgo)
      .reduce((total, entry) => total + entry.amount, 0);
  }, [user.xpHistory]);

  // Calculate daily level gains
  const getDailyLevelGain = useCallback((): number => {
    const now = Date.now();
    const oneDayAgo = now - (24 * 60 * 60 * 1000);

    const levelsToday = (user.levelHistory || []).filter(entry => entry.timestamp >= oneDayAgo);
    return levelsToday.length;
  }, [user.levelHistory]);

  const value: UserContextValue = {
    user,
    stackUser,
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
    levelUpCelebration,
    clearLevelUpCelebration,
    getDailyXPGain,
    getDailyLevelGain,
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
