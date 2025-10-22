import React, { useState } from 'react';
import { Button } from '@/components/common/Button';
import type { Quiz, UserAnswer, QuizResult } from '@/types/quiz';
import { calculateComboBonus } from '@/types/quiz';

interface QuizComponentProps {
  quiz: Quiz;
  onComplete: (result: QuizResult) => void;
}

/**
 * Fuzzy matching for fill-in-blank answers
 * Handles: misspellings, extra words, different conjugations, case insensitivity
 */
function isSimilarAnswer(userAnswer: string, correctAnswer: string): boolean {
  // Normalize both answers
  const normalize = (str: string) =>
    str
      .toLowerCase()
      .trim()
      .replace(/[.,!?;:'"()]/g, '') // Remove punctuation
      .replace(/\s+/g, ' '); // Normalize whitespace

  const normalizedUser = normalize(userAnswer);
  const normalizedCorrect = normalize(correctAnswer);

  // Exact match after normalization
  if (normalizedUser === normalizedCorrect) return true;

  // Check if user answer contains the correct answer (allows extra adjectives/adverbs)
  const userWords = normalizedUser.split(' ');
  const correctWords = normalizedCorrect.split(' ');

  // If correct answer is single word
  if (correctWords.length === 1) {
    const correctWord = correctWords[0];
    // Check if user answer contains the correct word
    if (userWords.some(w => w === correctWord)) return true;

    // Levenshtein distance for misspellings (allow 1-2 character difference)
    const distance = levenshteinDistance(normalizedUser, correctWord);
    const threshold = correctWord.length > 5 ? 2 : 1;
    if (distance <= threshold) return true;
  } else {
    // For multi-word answers, check if all correct words appear in user answer
    const allWordsPresent = correctWords.every(correctWord =>
      userWords.some(userWord => {
        if (userWord === correctWord) return true;
        const dist = levenshteinDistance(userWord, correctWord);
        return dist <= 1; // Allow 1 character difference per word
      })
    );
    if (allWordsPresent) return true;
  }

  return false;
}

/**
 * Calculate Levenshtein distance between two strings
 */
function levenshteinDistance(str1: string, str2: string): number {
  const matrix: number[][] = [];

  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }

  return matrix[str2.length][str1.length];
}

export const QuizComponent: React.FC<QuizComponentProps> = ({ quiz, onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [answers, setAnswers] = useState<UserAnswer[]>([]);
  const [comboStreak, setComboStreak] = useState(0);
  const [hintsRemaining, setHintsRemaining] = useState(3);
  const [showHint, setShowHint] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [startTime] = useState(Date.now());
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;
  const previousAnswer = currentQuestionIndex > 0 ? answers[currentQuestionIndex - 1] : null;

  // Safety check
  if (!currentQuestion) {
    return (
      <div className="card py-4 px-4">
        <p className="text-child-base text-red-600">Error: Question not found</p>
      </div>
    );
  }

  const handleAnswerSelect = (answer: string) => {
    if (!showFeedback) {
      setSelectedAnswer(answer);
    }
  };

  const handleSubmit = () => {
    if (!selectedAnswer) return;

    // Determine if answer is correct based on question type
    let correct = false;
    if (currentQuestion.type === 'multipleChoice' && currentQuestion.options) {
      // For multiple choice, check if selected option has isCorrect=true
      const selectedOption = currentQuestion.options.find(opt => opt.text === selectedAnswer);
      correct = selectedOption?.isCorrect || false;
    } else {
      // For fill-in-blank, use fuzzy matching
      correct = isSimilarAnswer(selectedAnswer, currentQuestion.correctAnswer);
    }

    const timeSpent = Math.floor((Date.now() - questionStartTime) / 1000);

    const userAnswer: UserAnswer = {
      questionId: currentQuestion.id,
      selectedAnswer,
      isCorrect: correct,
      timeSpent,
      hintsUsed: showHint ? 1 : 0,
      answeredAt: Date.now(),
    };

    setAnswers([...answers, userAnswer]);
    setIsCorrect(correct);
    setShowFeedback(true);

    if (correct) {
      setComboStreak(comboStreak + 1);
    } else {
      setComboStreak(0);
    }
  };

  const handleNext = () => {
    if (isLastQuestion) {
      // Calculate final results
      const totalCorrect = [...answers, { selectedAnswer, isCorrect } as UserAnswer].filter(a => a.isCorrect).length;
      const score = Math.round((totalCorrect / quiz.questions.length) * 100);

      let totalXP = 0;
      let totalCoins = 0;
      let comboBonus = 0;

      quiz.questions.forEach((q, idx) => {
        const answer = idx < answers.length ? answers[idx] : ({ selectedAnswer, isCorrect } as UserAnswer);
        if (answer && answer.isCorrect) {
          totalXP += q.xpReward;
          totalCoins += q.coinReward;

          // Calculate combo bonus for this question
          const streakAtThisPoint = answers.slice(0, idx).filter(a => a.isCorrect).length;
          comboBonus += calculateComboBonus(streakAtThisPoint, q.xpReward);
        }
      });

      const result: QuizResult = {
        quizId: quiz.id,
        storyId: quiz.storyId,
        score,
        correctAnswers: totalCorrect,
        totalQuestions: quiz.questions.length,
        xpEarned: totalXP,
        coinsEarned: totalCoins,
        comboBonus,
        totalXP: totalXP + comboBonus,
        totalCoins,
        timeSpent: Math.floor((Date.now() - startTime) / 1000),
        perfectScore: score === 100,
        answers: [...answers, { selectedAnswer, isCorrect, timeSpent: Math.floor((Date.now() - questionStartTime) / 1000), hintsUsed: showHint ? 1 : 0, answeredAt: Date.now(), questionId: currentQuestion.id }],
        completedAt: Date.now(),
      };

      onComplete(result);
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer('');
      setShowFeedback(false);
      setShowHint(false);
      setQuestionStartTime(Date.now());
    }
  };

  const handleUseHint = () => {
    if (hintsRemaining > 0 && !showHint) {
      setHintsRemaining(hintsRemaining - 1);
      setShowHint(true);
    }
  };

  const getHintText = (): string => {
    // Simple hint: eliminate one wrong answer
    if (currentQuestion.type === 'multipleChoice' && currentQuestion.options) {
      const wrongOptions = currentQuestion.options.filter(opt => !opt.isCorrect);
      if (wrongOptions.length > 0 && wrongOptions[0]) {
        return `Hint: It's not "${wrongOptions[0].text}"`;
      }
    }
    return 'Hint: Think about the main idea of the story.';
  };

  return (
    <div className="space-y-3">
      {/* Quiz Progress */}
      <div className="card py-3 px-4 space-y-2">
        <div className="flex justify-between items-center">
          <h2 className="text-child-base font-bold text-gray-900">
            Quiz Progress
          </h2>
          <span className="text-child-sm font-bold text-gray-700">
            [{currentQuestionIndex + 1}/{quiz.questions.length}]
          </span>
        </div>

        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-300"
            style={{ width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%` }}
            role="progressbar"
            aria-valuenow={currentQuestionIndex + 1}
            aria-valuemin={0}
            aria-valuemax={quiz.questions.length}
          />
        </div>

        {comboStreak > 1 && (
          <div className="bg-yellow-50 border border-yellow-300 rounded-lg py-2 px-3">
            <p className="text-child-sm font-bold text-yellow-700 flex items-center gap-2">
              <span aria-hidden="true">⚡</span>
              Combo Streak: {comboStreak}x
              <span className="text-[11px]">(+{calculateComboBonus(comboStreak, 10)} XP bonus)</span>
            </p>
          </div>
        )}
      </div>

      {/* Current Question */}
      <div className="card py-4 px-4 space-y-3">
        <div className="border-b-2 border-gray-200 pb-3">
          <p className="text-[11px] font-semibold text-purple-700 mb-1">
            Question {currentQuestionIndex + 1}: {currentQuestion.category}
          </p>
          <h3 className="text-child-base font-bold text-gray-900">
            {currentQuestion.text}
          </h3>
        </div>

        {/* Answer Options */}
        <div className="space-y-2">
          {currentQuestion.type === 'multipleChoice' && currentQuestion.options ? (
            currentQuestion.options.map((option) => (
              <button
                key={option.id}
                onClick={() => handleAnswerSelect(option.text)}
                disabled={showFeedback}
                className={`w-full text-left py-3 px-4 rounded-lg font-semibold text-child-sm transition-all border-2 ${
                  showFeedback
                    ? option.isCorrect
                      ? 'bg-green-100 border-green-500 text-green-900'
                      : selectedAnswer === option.text
                      ? 'bg-red-100 border-red-500 text-red-900'
                      : 'bg-gray-100 border-gray-300 text-gray-600'
                    : selectedAnswer === option.text
                    ? 'bg-primary-100 border-primary-500 text-primary-900'
                    : 'bg-white border-gray-300 text-gray-900 hover:border-primary-300 hover:bg-primary-50'
                }`}
                aria-label={`Select answer: ${option.text}`}
                aria-pressed={selectedAnswer === option.text}
              >
                <span className="flex items-center gap-2">
                  <span className="text-lg" aria-hidden="true">
                    {showFeedback
                      ? option.isCorrect
                        ? '✓'
                        : selectedAnswer === option.text
                        ? '✗'
                        : '○'
                      : selectedAnswer === option.text
                      ? '●'
                      : '○'}
                  </span>
                  <span>{option.text}</span>
                </span>
              </button>
            ))
          ) : (
            <input
              type="text"
              value={selectedAnswer}
              onChange={(e) => handleAnswerSelect(e.target.value)}
              placeholder="Type your answer..."
              disabled={showFeedback}
              className="w-full p-3 border-2 border-gray-300 rounded-lg text-child-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              aria-label="Fill in the blank answer"
            />
          )}
        </div>

        {/* Feedback */}
        {showFeedback && (
          <div className={`rounded-lg p-3 border-2 ${isCorrect ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'}`}>
            <p className={`font-bold text-child-sm mb-1 ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
              {isCorrect ? '✓ Correct!' : '✗ Incorrect'}
            </p>
            {!isCorrect && (
              <p className="text-child-sm text-gray-900 mb-1">
                Correct answer: <span className="font-bold">{currentQuestion.correctAnswer}</span>
              </p>
            )}
            <p className="text-child-xs text-gray-700">
              {currentQuestion.explanation}
            </p>
            {isCorrect && (
              <p className="text-[11px] font-semibold text-green-600 mt-2">
                +{currentQuestion.xpReward} XP, +{currentQuestion.coinReward} 🪙
              </p>
            )}
          </div>
        )}

        {/* Submit/Next Button */}
        {!showFeedback ? (
          <Button
            variant="primary"
            size="large"
            onClick={handleSubmit}
            disabled={!selectedAnswer}
            className="w-full"
            aria-label="Submit answer"
          >
            Submit Answer
          </Button>
        ) : (
          <Button
            variant="primary"
            size="large"
            onClick={handleNext}
            className="w-full"
            aria-label={isLastQuestion ? 'Complete quiz' : 'Next question'}
          >
            {isLastQuestion ? 'Complete Quiz' : 'Next Question →'}
          </Button>
        )}
      </div>

      {/* Previous Answer (if exists) */}
      {previousAnswer && quiz.questions[currentQuestionIndex - 1] && (
        <div className="card py-2 px-3">
          <p className="text-[11px] font-semibold text-gray-700 mb-1">
            Previous Answer: {previousAnswer.isCorrect ? '✓ Correct!' : '✗ Incorrect'}
          </p>
          <p className="text-[11px] text-gray-600">
            {previousAnswer.isCorrect
              ? `+${quiz.questions[currentQuestionIndex - 1]?.xpReward} XP, +${quiz.questions[currentQuestionIndex - 1]?.coinReward} 🪙`
              : 'No rewards'}
          </p>
        </div>
      )}

      {/* Hint Panel */}
      <div className="card py-3 px-4">
        <h3 className="text-child-sm font-bold text-gray-900 mb-2">💡 Hint Available</h3>
        {showHint ? (
          <div className="bg-blue-50 border border-blue-300 rounded-lg p-3">
            <p className="text-child-sm text-blue-900">{getHintText()}</p>
          </div>
        ) : (
          <>
            <Button
              variant="outline"
              size="small"
              onClick={handleUseHint}
              disabled={hintsRemaining === 0 || showFeedback}
              className="w-full"
              aria-label="Use hint (costs 5 coins)"
            >
              Use Hint (-5 🪙)
            </Button>
            <p className="text-[11px] text-gray-600 mt-1 text-center">
              Hints remaining: {hintsRemaining} / 3
            </p>
          </>
        )}
      </div>
    </div>
  );
};
