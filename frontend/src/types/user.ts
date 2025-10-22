// User profile and progress types
export interface UserState {
  // Identity
  id: string;
  name: string;
  avatar?: string;

  // Progression
  level: number;
  xp: number;
  xpToNextLevel: number;

  // Currency
  coins: number;
  gems: number;

  // Engagement
  streak: number;
  lastLogin: number; // Unix timestamp

  // Statistics
  stats: {
    totalReadings: number;
    totalQuizzes: number;
    totalCorrectAnswers: number;
    totalWords: number;
    averageQuizScore: number;
    longestStreak: number;
  };

  // Activity history
  xpHistory: Array<{ amount: number; timestamp: number }>;
  levelHistory: Array<{ level: number; timestamp: number }>;

  // Settings
  settings: UserSettings;
}

export interface UserSettings {
  // Language preferences
  primaryLanguage: 'en';
  secondaryLanguage: 'ko' | 'zh'; // Korean or Mandarin
  languageBlendLevel: number; // 0-10 slider

  // Display preferences
  showHints: boolean;
  showRomanization: boolean;
  theme: 'space' | 'jungle' | 'deepSea' | 'minecraft' | 'tron';

  // Audio preferences
  audioEnabled: boolean;
  audioSpeed: number; // 0.75 | 1.0 | 1.25 | 1.5
  audioVoice?: string;

  // Accessibility
  fontSize: 'normal' | 'large' | 'xlarge';
  highContrast: boolean;
  reducedMotion: boolean;

  // Parental controls (for Phase 7 - Backend)
  parentalConsentGiven: boolean;
  parentEmail?: string;
}
