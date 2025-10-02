export interface LanguageBlendInfo {
  level: number; // 0-10 scale (0 = 100% English, 10 = 100% Korean)
  koreanWords: string[];
  englishWords: string[];
  mixedSentences: boolean;
  readabilityScore: number;
}

export interface ReadingPassage {
  id: string;
  text: string;
  wordCount: number;
  gradeLevel: '3rd' | '4th' | '5th' | '6th';
  languageBlend: LanguageBlendInfo;
  generatedImage?: string;
  vocabularyUsed: string[];
  estimatedReadingTime: number; // in minutes
  theme: string;
  createdAt: string;
}

export interface QuizQuestion {
  id: string;
  type: 'multiple-choice' | 'fill-in-blank';
  question: string;
  options?: string[];
  correct_answer: string | number;
  explanation: string;
  skill_tested: string;
  difficulty_level: string;
  korean_integration: boolean;
  vocabulary_used?: string[];
}

export interface Quiz {
  questions: QuizQuestion[];
  metadata: {
    total_questions: number;
    skills_covered: string[];
    korean_vocabulary_count: number;
    estimated_completion_time: number;
    generation_method?: string;
  };
}

export interface ContentValidationResult {
  passed: boolean;
  confidence: number;
  feedback: string[];
  suggestions: string[];
  gradeLevel: string;
  safetyScore: number;
  educationalValue: number;
}

export interface ContentGenerationRequest {
  gradeLevel: '3rd' | '4th' | '5th' | '6th';
  passageLength: number;
  theme: string;
  vocabularyWords: string[];
  humorLevel: 1 | 2 | 3;
  languageBlendLevel: number;
  previousPassages?: string[]; // To avoid repetition
}

export interface HighlightRange {
  start: number;
  end: number;
  type: 'hint' | 'vocabulary' | 'answer' | 'korean' | 'context';
  id?: string;
  hint?: string;
  metadata?: Record<string, unknown>;
}

export interface QuizHintRequest {
  questionText: string;
  storyContent: string;
  gradeLevel?: string;
  childSafe?: boolean;
}

export interface QuizHintResponse {
  success: boolean;
  hint: string;
  gradeLevel: string;
  childSafe: boolean;
  timestamp: string;
}