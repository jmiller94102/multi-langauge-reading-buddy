// Quiz Types for Reading Page

export type QuizDifficulty = 'beginner' | 'intermediate' | 'advanced';
export type QuestionType = 'multipleChoice' | 'fillInBlank' | 'trueFalse';
export type QuestionCategory = 'comprehension' | 'inference' | 'plotAnalysis' | 'vocabulary' | 'prediction';

export interface QuizSettings {
  customFocus?: string; // Optional custom question focus
  difficulty: QuizDifficulty;
  multipleChoiceCount: number; // Default: 3
  fillInBlankCount: number; // Default: 2
  categories: QuestionCategory[]; // Which types to include
}

export interface QuestionOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface Question {
  id: string;
  type: QuestionType;
  category: QuestionCategory;
  text: string; // The question text
  options?: QuestionOption[]; // For multiple choice (undefined for fill-in-blank)
  correctAnswer: string; // Correct answer text
  explanation: string; // Why this is the correct answer
  xpReward: number; // Base XP for this question (typically 10)
  coinReward: number; // Base coins for this question (typically 5)
}

export interface UserAnswer {
  questionId: string;
  selectedAnswer: string; // User's answer
  isCorrect: boolean;
  timeSpent: number; // Seconds spent on this question
  hintsUsed: number; // Number of hints used
  answeredAt: number;
}

export interface Quiz {
  id: string;
  storyId: string;
  questions: Question[];
  settings: QuizSettings;
  createdAt: number;
}

export interface QuizProgress {
  quizId: string;
  currentQuestionIndex: number; // 0-based index
  answers: UserAnswer[];
  comboStreak: number; // Consecutive correct answers
  hintsRemaining: number; // Max 3 hints per quiz
  startedAt: number;
  completedAt?: number;
}

export interface QuizResult {
  quizId: string;
  storyId: string;
  score: number; // Percentage (0-100)
  correctAnswers: number;
  totalQuestions: number;
  xpEarned: number; // Base XP from questions
  coinsEarned: number; // Base coins from questions
  comboBonus: number; // Bonus XP from combo streaks
  totalXP: number; // xpEarned + comboBonus
  totalCoins: number;
  timeSpent: number; // Total seconds
  perfectScore: boolean; // 100% score
  answers: UserAnswer[];
  completedAt: number;
}

export interface HintResponse {
  hint: string; // Contextual clue or partial answer
  cost: number; // Coins deducted (typically 5)
}

// Default quiz settings
export const defaultQuizSettings: QuizSettings = {
  customFocus: undefined,
  difficulty: 'intermediate',
  multipleChoiceCount: 3,
  fillInBlankCount: 2,
  categories: ['comprehension', 'inference', 'plotAnalysis', 'vocabulary'],
};

// Combo multiplier calculation
export const getComboMultiplier = (streak: number): number => {
  if (streak >= 5) return 3; // 3x multiplier at 5+ streak
  if (streak >= 3) return 2; // 2x multiplier at 3-4 streak
  if (streak >= 2) return 1.5; // 1.5x multiplier at 2 streak
  return 1; // No multiplier at 0-1 streak
};

// XP bonus calculation based on combo
export const calculateComboBonus = (streak: number, questionXP: number): number => {
  const multiplier = getComboMultiplier(streak);
  if (multiplier === 1) return 0;
  return Math.floor(questionXP * (multiplier - 1));
};
