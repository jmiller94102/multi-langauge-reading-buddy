// Story Types for Reading Page

export type GradeLevel = '3rd' | '4th' | '5th' | '6th';
export type HumorLevel = 'none' | 'light' | 'moderate' | 'heavy';
export type VisualTheme = 'space' | 'jungle' | 'deepSea' | 'minecraft' | 'tron';
export type SecondaryLanguage = 'ko' | 'zh'; // Korean | Mandarin

export interface StorySettings {
  prompt: string;
  length: number; // 250-2000 words
  gradeLevel: GradeLevel;
  humorLevel: HumorLevel;
  visualTheme: VisualTheme;
  customVocabulary?: string[]; // Optional custom words to include
}

export interface LanguageSettings {
  secondaryLanguage: SecondaryLanguage;
  blendLevel: number; // 0-10 (0% to 100% in 10% increments)
  showHints: boolean; // Show inline translations
  showRomanization: boolean; // Show phonetic spelling
  audioEnabled: boolean; // Enable audio reading
  autoPlay: boolean; // Auto-play on generate
}

export interface BlendedWord {
  text: string; // The foreign language word (e.g., "우주비행사")
  translation: string; // English translation (e.g., "astronaut")
  romanization?: string; // Phonetic spelling (e.g., "u-ju-bi-haeng-sa")
  language: SecondaryLanguage;
}

export interface StoryParagraph {
  id: string;
  content: string; // Plain text
  blendedWords: BlendedWord[]; // Foreign words in this paragraph
}

export interface Story {
  id: string;
  title: string;
  content: string; // Full story text
  paragraphs: StoryParagraph[]; // Broken into paragraphs for rendering
  settings: StorySettings;
  languageSettings: LanguageSettings;
  wordCount: number;
  estimatedReadTime: number; // In minutes
  koreanWordCount: number; // Number of Korean/Mandarin words
  createdAt: number;
  audioUrl?: string; // Optional TTS audio URL (BONUS feature)
}

export interface ReadingProgress {
  storyId: string;
  currentParagraph: number; // Index of current paragraph
  scrollProgress: number; // 0-100%
  wordsRead: number; // Estimated based on scroll
  startedAt: number;
  completedAt?: number;
  timeSpent: number; // In seconds
}

export interface StoryGenerationRequest {
  settings: StorySettings;
  languageSettings: LanguageSettings;
}

export interface StoryGenerationResponse {
  story: Story;
  estimatedXP: number;
  estimatedCoins: number;
}

// Initial default settings
export const defaultStorySettings: StorySettings = {
  prompt: '',
  length: 500,
  gradeLevel: '4th',
  humorLevel: 'moderate',
  visualTheme: 'space',
  customVocabulary: [],
};

export const defaultLanguageSettings: LanguageSettings = {
  secondaryLanguage: 'ko',
  blendLevel: 4, // 40% Korean blending
  showHints: true,
  showRomanization: true,
  audioEnabled: true,
  autoPlay: false,
};
