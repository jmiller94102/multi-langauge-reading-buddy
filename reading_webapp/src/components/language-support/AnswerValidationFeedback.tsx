import React, { useState, useEffect } from 'react';

interface ThemeStyle {
  primary: string;
  accent: string;
  text: string;
  background: string;
}

interface ValidationResult {
  isCorrect: boolean;
  similarity: number;
  feedback: string;
  encouragement?: string;
  suggestion?: string;
}

interface AnswerValidationFeedbackProps {
  userAnswer: string;
  correctAnswer: string;
  questionType: 'multiple-choice' | 'fill-in-blank';
  questionId: string;
  gradeLevel: string;
  onValidationComplete: (result: ValidationResult) => void;
  encouragementLevel: 'gentle' | 'enthusiastic' | 'supportive';
  theme: ThemeStyle;
  enabled?: boolean;
}

export const AnswerValidationFeedback: React.FC<AnswerValidationFeedbackProps> = ({
  userAnswer,
  correctAnswer,
  questionType,
  questionId,
  gradeLevel,
  onValidationComplete,
  encouragementLevel,
  theme,
  enabled = true
}) => {
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  // Validate answer when user answer changes
  useEffect(() => {
    if (!enabled || !userAnswer.trim()) {
      setValidationResult(null);
      setShowFeedback(false);
      return;
    }

    const validateAnswer = async () => {
      setIsValidating(true);
      
      try {
        const response = await fetch('http://localhost:3001/api/validate-answer', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userAnswer: userAnswer.trim(),
            correctAnswer,
            questionType,
            gradeLevel,
            childSafe: true
          })
        });

        if (response.ok) {
          const validation = await response.json();
          
          const result: ValidationResult = {
            isCorrect: validation.isCorrect,
            similarity: validation.similarity || 0,
            feedback: generateFeedback(validation, userAnswer, correctAnswer),
            encouragement: generateEncouragement(validation, encouragementLevel),
            suggestion: generateSuggestion(validation, questionType)
          };

          setValidationResult(result);
          onValidationComplete(result);
          
          // Show feedback after a brief delay
          setTimeout(() => setShowFeedback(true), 500);
        } else {
          throw new Error('Validation failed');
        }
      } catch (error) {
        console.error('Answer validation failed:', error);
        
        // Fallback validation
        const isCorrect = userAnswer.toLowerCase().trim() === correctAnswer.toLowerCase().trim();
        const result: ValidationResult = {
          isCorrect,
          similarity: isCorrect ? 1.0 : 0.0,
          feedback: isCorrect 
            ? "Great job! That's correct! 🌟" 
            : "Not quite right, but great effort! Keep trying! 💪",
          encouragement: isCorrect 
            ? "You're doing amazing!" 
            : "You're learning so well!",
          suggestion: isCorrect 
            ? undefined 
            : "Try reading that part of the story again for clues! 📖"
        };

        setValidationResult(result);
        onValidationComplete(result);
        setTimeout(() => setShowFeedback(true), 500);
      } finally {
        setIsValidating(false);
      }
    };

    // Debounce validation for fill-in-blank questions
    const timeoutId = setTimeout(validateAnswer, questionType === 'fill-in-blank' ? 1000 : 0);
    return () => clearTimeout(timeoutId);
  }, [userAnswer, correctAnswer, questionType, gradeLevel, enabled, encouragementLevel, onValidationComplete]);

  // Generate contextual feedback based on validation result
  const generateFeedback = (validation: any, userAnswer: string, correctAnswer: string): string => {
    if (validation.isCorrect) {
      if (validation.similarity > 0.95) {
        return "Perfect! Exactly right! 🎉";
      } else {
        return "Great job! That's correct! 🌟";
      }
    } else if (validation.similarity > 0.7) {
      return "You're very close! Try thinking about it a bit differently. 🤔";
    } else if (validation.similarity > 0.4) {
      return "Good thinking! You're on the right track, but not quite there yet. 📚";
    } else {
      return "Not quite right, but great effort! Let's try again! 💪";
    }
  };

  // Generate encouragement based on level
  const generateEncouragement = (validation: any, level: string): string => {
    const encouragements = {
      gentle: validation.isCorrect 
        ? ["You did it!", "Nice work!", "Well done!", "Great thinking!"]
        : ["Keep trying!", "You're learning!", "Almost there!", "Good effort!"],
      enthusiastic: validation.isCorrect
        ? ["Amazing work! 🚀", "You're a star! ⭐", "Fantastic! 🎊", "Incredible! 🌟"]
        : ["You've got this! 💪", "Keep going! 🔥", "Don't give up! 🌈", "You're awesome! 😊"],
      supportive: validation.isCorrect
        ? ["I'm proud of you! 🤗", "You should feel great! 😊", "That was excellent! 👏", "You're doing so well! 🌟"]
        : ["I believe in you! 💙", "Learning is a journey! 🛤️", "Every try makes you stronger! 💪", "You're growing! 🌱"]
    };

    const options = encouragements[level as keyof typeof encouragements] || encouragements.supportive;
    return options[Math.floor(Math.random() * options.length)];
  };

  // Generate helpful suggestions
  const generateSuggestion = (validation: any, questionType: string): string | undefined => {
    if (validation.isCorrect) return undefined;

    if (validation.similarity > 0.7) {
      return "Look for keywords in the story that match your answer! 🔍";
    } else if (questionType === 'fill_in_blank') {
      return "Try reading the sentence around the blank again! 📖";
    } else {
      return "Think about what the story was mainly about! 💭";
    }
  };

  if (!enabled || !validationResult || !showFeedback) {
    return null;
  }

  return (
    <div 
      style={{
        marginTop: '12px',
        animation: 'slideUp 0.3s ease-out'
      }}
    >
      {/* Main feedback card */}
      <div
        style={{
          background: validationResult.isCorrect 
            ? 'rgba(76, 175, 80, 0.15)' 
            : validationResult.similarity > 0.7 
              ? 'rgba(255, 193, 7, 0.15)'
              : 'rgba(244, 67, 54, 0.15)',
          border: `2px solid ${
            validationResult.isCorrect 
              ? 'rgba(76, 175, 80, 0.4)' 
              : validationResult.similarity > 0.7 
                ? 'rgba(255, 193, 7, 0.4)'
                : 'rgba(244, 67, 54, 0.4)'
          }`,
          borderRadius: '12px',
          padding: '16px',
          backdropFilter: 'blur(10px)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Celebration animation overlay for correct answers */}
        {validationResult.isCorrect && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `linear-gradient(45deg, ${theme.accent}10, ${theme.primary}10)`,
              animation: 'celebrate 0.6s ease-out',
              pointerEvents: 'none'
            }}
          />
        )}

        {/* Status icon and main feedback */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <div
            style={{
              fontSize: '24px',
              animation: validationResult.isCorrect ? 'bounce 0.6s ease-out' : 'none'
            }}
          >
            {validationResult.isCorrect 
              ? '✅' 
              : validationResult.similarity > 0.7 
                ? '⚠️' 
                : '❌'
            }
          </div>
          
          <div style={{ flex: 1 }}>
            <div style={{ 
              fontSize: '16px', 
              fontWeight: '600',
              color: theme.text,
              marginBottom: '4px'
            }}>
              {validationResult.feedback}
            </div>
            
            {validationResult.encouragement && (
              <div style={{ 
                fontSize: '14px', 
                fontStyle: 'italic',
                color: theme.accent,
                opacity: 0.9
              }}>
                {validationResult.encouragement}
              </div>
            )}
          </div>
        </div>

        {/* Similarity score for debugging (only show if not perfect) */}
        {validationResult.similarity < 1.0 && validationResult.similarity > 0 && (
          <div style={{
            fontSize: '12px',
            opacity: 0.7,
            color: theme.text,
            marginBottom: '8px'
          }}>
            Similarity: {Math.round(validationResult.similarity * 100)}%
          </div>
        )}

        {/* Suggestion for improvement */}
        {validationResult.suggestion && (
          <div style={{
            background: `${theme.primary}10`,
            border: `1px solid ${theme.primary}30`,
            borderRadius: '8px',
            padding: '8px 12px',
            fontSize: '13px',
            color: theme.text,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span>💡</span>
            <span>{validationResult.suggestion}</span>
          </div>
        )}

        {/* Loading indicator */}
        {isValidating && (
          <div style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            width: '16px',
            height: '16px',
            border: `2px solid ${theme.accent}`,
            borderTop: '2px solid transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
        )}
      </div>

      {/* CSS animations */}
      <style>{`
        @keyframes slideUp {
          0% {
            opacity: 0;
            transform: translateY(10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes bounce {
          0%, 20%, 53%, 80%, 100% {
            transform: scale(1);
          }
          40%, 43% {
            transform: scale(1.2);
          }
          70% {
            transform: scale(1.1);
          }
          90% {
            transform: scale(1.05);
          }
        }
        
        @keyframes celebrate {
          0% {
            opacity: 0;
            transform: scale(0.8);
          }
          50% {
            opacity: 0.3;
            transform: scale(1.1);
          }
          100% {
            opacity: 0;
            transform: scale(1);
          }
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
