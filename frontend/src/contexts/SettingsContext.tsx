import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

interface AppSettings {
  soundEnabled: boolean;
  musicVolume: number;
  sfxVolume: number;
  notificationsEnabled: boolean;
  animationsEnabled: boolean;
  developerMode: boolean;
}

interface SettingsContextValue {
  settings: AppSettings;
  updateSettings: (updates: Partial<AppSettings>) => Promise<void>;
  toggleSound: () => Promise<void>;
  toggleNotifications: () => Promise<void>;
  toggleAnimations: () => Promise<void>;
  toggleDeveloperMode: () => Promise<void>;
  setMusicVolume: (volume: number) => Promise<void>;
  setSfxVolume: (volume: number) => Promise<void>;
  resetSettings: () => Promise<void>;
  isLoading: boolean;
}

const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);

const BACKEND_URL = 'http://localhost:8080';

// Default settings
const createDefaultSettings = (): AppSettings => ({
  soundEnabled: true,
  musicVolume: 0.7,
  sfxVolume: 0.8,
  notificationsEnabled: true,
  animationsEnabled: true,
  developerMode: false,
});

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AppSettings>(createDefaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  // Load settings from backend or localStorage
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/settings`, {
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          setSettings(data);
        } else {
          const stored = localStorage.getItem('readingApp_settings');
          if (stored) {
            setSettings(JSON.parse(stored));
          } else {
            const defaultSettings = createDefaultSettings();
            setSettings(defaultSettings);
            localStorage.setItem('readingApp_settings', JSON.stringify(defaultSettings));
          }
        }
      } catch (error) {
        console.error('Failed to load settings:', error);
        const stored = localStorage.getItem('readingApp_settings');
        if (stored) {
          setSettings(JSON.parse(stored));
        } else {
          const defaultSettings = createDefaultSettings();
          setSettings(defaultSettings);
          localStorage.setItem('readingApp_settings', JSON.stringify(defaultSettings));
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  // Persist settings
  const persistSettings = useCallback(async (updatedSettings: AppSettings) => {
    setSettings(updatedSettings);
    localStorage.setItem('readingApp_settings', JSON.stringify(updatedSettings));

    try {
      await fetch(`${BACKEND_URL}/api/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(updatedSettings),
      });
    } catch (error) {
      console.warn('Failed to sync settings with backend:', error);
    }
  }, []);

  const updateSettings = useCallback(async (updates: Partial<AppSettings>) => {
    const updatedSettings = { ...settings, ...updates };
    await persistSettings(updatedSettings);
  }, [settings, persistSettings]);

  const toggleSound = useCallback(async () => {
    await persistSettings({ ...settings, soundEnabled: !settings.soundEnabled });
  }, [settings, persistSettings]);

  const toggleNotifications = useCallback(async () => {
    await persistSettings({ ...settings, notificationsEnabled: !settings.notificationsEnabled });
  }, [settings, persistSettings]);

  const toggleAnimations = useCallback(async () => {
    await persistSettings({ ...settings, animationsEnabled: !settings.animationsEnabled });
  }, [settings, persistSettings]);

  const toggleDeveloperMode = useCallback(async () => {
    await persistSettings({ ...settings, developerMode: !settings.developerMode });
  }, [settings, persistSettings]);

  const setMusicVolume = useCallback(async (volume: number) => {
    await persistSettings({ ...settings, musicVolume: Math.max(0, Math.min(1, volume)) });
  }, [settings, persistSettings]);

  const setSfxVolume = useCallback(async (volume: number) => {
    await persistSettings({ ...settings, sfxVolume: Math.max(0, Math.min(1, volume)) });
  }, [settings, persistSettings]);

  const resetSettings = useCallback(async () => {
    const defaultSettings = createDefaultSettings();
    await persistSettings(defaultSettings);
  }, [persistSettings]);

  const value: SettingsContextValue = {
    settings,
    updateSettings,
    toggleSound,
    toggleNotifications,
    toggleAnimations,
    toggleDeveloperMode,
    setMusicVolume,
    setSfxVolume,
    resetSettings,
    isLoading,
  };

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within SettingsProvider');
  }
  return context;
};
