export interface AppSettings {
  // Reading Configuration
  passageLength: number; // 250-2000 words in 250-word increments
  passageTheme: string; // Free-form text for AI generation
  humorLevel: 1 | 2 | 3; // Subtle to Insanely Funny
  vocabularyWords: string[]; // Custom vocabulary to prioritize in passages

  // Quiz Configuration
  multipleChoiceCount: number; // 1-10
  fillInBlankCount: number; // 1-10
  quizDifficulty: 'Basic' | 'Intermediate' | 'Challenging';

  // Language & Localization
  primaryLanguage: 'English';
  secondaryLanguage: 'Korean' | 'Japanese' | 'Mandarin' | 'Italian' | 'Spanish' | 'Arabic';
  languageBlendLevel: number; // 0-10 (0=100% English, 10=100% secondary language)

  // Theme & UI
  skinTheme: 'Space' | 'Jungle' | 'DeepSea' | 'Minecraft' | 'Tron';

  // AI Configuration
  llmProvider: 'azure' | 'openai' | 'claude';
  imageGenerator: 'dalle' | 'midjourney' | 'stable-diffusion';
}

export interface UserProfile {
  gradeLevel: '3rd' | '4th' | '5th' | '6th';
  languageProgress: number; // 0-100 (English to secondary language progression)
  points: number;
  level: number;
  achievements: Achievement[];
  streak: number;
  sessionHistory: ReadingSession[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string;
  category: 'reading' | 'quiz' | 'language' | 'theme' | 'streak';
}

export interface ReadingSession {
  id: string;
  startTime: string;
  endTime: string;
  passagesRead: number;
  quizzesCompleted: number;
  pointsEarned: number;
  languageLevel: number;
  theme: string;
}