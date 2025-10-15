// Story and Quiz content types
export interface Story {
  id: string;
  title: string;

  // Content
  englishContent: string;
  secondaryContent: string; // Korean or Mandarin
  blendedContent: string; // Generated on frontend

  // Metadata
  wordCount: number;
  gradeLevel: string;
  theme: string;
  humorLevel: string;

  // Language data
  languageLevel: number; // 0-10
  nounMappings: Record<string, string>; // English → Korean/Mandarin
  sentences: {
    english: string[];
    secondary: string[];
  };

  // Timestamps
  createdAt: number;
  readAt?: number;
}

export interface Quiz {
  id: string;
  storyId: string;

  // Questions
  questions: QuizQuestion[];

  // Metadata
  gradeLevel: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';

  // Progress
  currentQuestionIndex: number;
  answers: QuizAnswer[];
  score?: number; // Calculated after completion

  // Timestamps
  startedAt: number;
  completedAt?: number;
}

export interface QuizQuestion {
  id: string;
  type: 'multiple-choice' | 'fill-in-blank';
  question: string;

  // Multiple Choice specific
  options?: string[];

  // Answers
  correctAnswer: string;
  explanation: string;

  // Metadata
  skillTested: string; // e.g., 'main_idea', 'inference'
  difficultyLevel: string;
  koreanIntegration: boolean;
  vocabularyUsed?: string[];
}

export interface QuizAnswer {
  questionId: string;
  userAnswer: string;
  correct: boolean;
  timeSpent: number; // milliseconds
}
