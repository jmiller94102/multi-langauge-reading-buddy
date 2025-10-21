// Story Types for Reading Page

export type GradeLevel = '3rd' | '4th' | '5th' | '6th';
export type HumorLevel = 'min' | 'max' | 'insane';
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
  blendLevel: number; // 0-4 (5-level system: 0=100% English, 4=100% Secondary)
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

export interface VocabularyWord {
  english?: string; // For translated vocabulary from LLM-2
  word?: string; // For extracted vocabulary from LLM-1
  translation: string;
  definition: string;
  frequency?: number;
}

export interface Vocabulary {
  nouns: VocabularyWord[];
  verbs: VocabularyWord[];
  adjectives?: VocabularyWord[];
  adverbs?: VocabularyWord[];
}

export interface Story {
  id: string;
  title: string;
  translatedTitle?: string; // Title in secondary language
  content: string; // Full story text (legacy, for compatibility)
  paragraphs: StoryParagraph[]; // Broken into paragraphs for rendering (legacy)

  // NEW: Dual-language content for client-side blending
  primaryContent: string; // Full English story
  secondaryContent?: string; // Full Korean/Mandarin story
  primarySentences: string[]; // English sentences for blending
  secondarySentences?: string[]; // Korean/Mandarin sentences for blending
  vocabularyMap?: Record<string, { translation: string; romanization: string }>; // Legacy word hints
  vocabulary?: Vocabulary; // NEW: Frequency-filtered vocabulary by POS

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
  prompt: 'A story of Pikachu battling Gangar in a Pokemon tournament. His friends Ash and Charmander are cheering him on. The weather is cloudy and about to rain. Pikachu is supercharged by lightning.',
  length: 500,
  gradeLevel: '4th',
  humorLevel: 'insane',
  visualTheme: 'tron',
  customVocabulary: [],
};

export const defaultLanguageSettings: LanguageSettings = {
  secondaryLanguage: 'ko',
  blendLevel: 2, // Level 2: Noun immersion + sentence mixing (2:1)
  showHints: true,
  showRomanization: true,
  audioEnabled: true,
  autoPlay: false,
};
