import React, { useState, useCallback } from 'react';

interface ThemeStyle {
  primary: string;
  accent: string;
  text: string;
  background: string;
}

interface HintState {
  level: number;
  text: string;
  isLoading: boolean;
  error: string | null;
}

interface QuizHintSystemProps {
  question: {
    question: string;
    type: 'multiple-choice' | 'fill-in-blank';
  };
  storyContent: string;
  gradeLevel: string;
  onHintUsed?: (level: number, hint: string) => void;
  maxHints?: number;
  theme: ThemeStyle;
  enabled: boolean;
}

export const QuizHintSystem: React.FC<QuizHintSystemProps> = ({
  question,
  storyContent,
  gradeLevel,
  onHintUsed,
  maxHints = 3,
  theme,
  enabled
}) => {
  const [hints, setHints] = useState<HintState[]>([]);
  const [currentHintLevel, setCurrentHintLevel] = useState(0);
  const [isGeneratingHint, setIsGeneratingHint] = useState(false);

  // Progressive hint button labels
  const getButtonLabel = useCallback(() => {
    if (currentHintLevel === 0) return "💡 Need a Hint?";
    if (currentHintLevel === 1) return "🔍 More Help?";
    if (currentHintLevel === 2) return "🎯 Final Hint?";
    return "All hints used ✓";
  }, [currentHintLevel]);

  // Generate hint from backend API (frontend calls existing API only)
  const generateHint = useCallback(async () => {
    if (!enabled || currentHintLevel >= maxHints || isGeneratingHint) return;

    setIsGeneratingHint(true);

    try {
      // Call existing backend API
      const response = await fetch('http://localhost:3001/api/generate-quiz-hint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionText: question.question,
          storyContent,
          gradeLevel,
          hintLevel: currentHintLevel + 1,
          childSafe: true
        })
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const result = await response.json();

      if (result.success && result.hint) {
        const newHint: HintState = {
          level: currentHintLevel + 1,
          text: result.hint,
          isLoading: false,
          error: null
        };

        setHints(prev => [...prev, newHint]);
        setCurrentHintLevel(prev => prev + 1);

        if (onHintUsed) {
          onHintUsed(newHint.level, newHint.text);
        }
      } else {
        throw new Error('Invalid hint response');
      }
    } catch (error) {
      console.error('Hint generation failed:', error);
      
      // Fallback hint (simple frontend fallback)
      const fallbackHints = [
        "Look for clues in the story that relate to this question! 🔍",
        "Try reading the paragraph again and look for key words! 📖",
        "Think about what the main character was doing or feeling! 💭"
      ];
      
      const fallbackText = fallbackHints[Math.min(currentHintLevel, fallbackHints.length - 1)];
      
      const errorHint: HintState = {
        level: currentHintLevel + 1,
        text: fallbackText,
        isLoading: false,
        error: 'Using offline hint'
      };

      setHints(prev => [...prev, errorHint]);
      setCurrentHintLevel(prev => prev + 1);

      if (onHintUsed) {
        onHintUsed(errorHint.level, errorHint.text);
      }
    } finally {
      setIsGeneratingHint(false);
    }
  }, [enabled, currentHintLevel, maxHints, isGeneratingHint, question.question, storyContent, gradeLevel, onHintUsed]);

  if (!enabled) {
    return null;
  }

  return (
    <div className="quiz-hint-system" style={{ marginTop: '12px' }}>
      {/* Hint Button */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '8px' }}>
        <button
          onClick={generateHint}
          disabled={currentHintLevel >= maxHints || isGeneratingHint}
          style={{
            background: currentHintLevel >= maxHints 
              ? `${theme.primary}40` 
              : isGeneratingHint 
                ? `${theme.accent}60`
                : `linear-gradient(135deg, ${theme.accent}, ${theme.primary})`,
            color: theme.text,
            border: 'none',
            borderRadius: '18px',
            padding: '8px 16px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: currentHintLevel >= maxHints || isGeneratingHint ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease',
            transform: isGeneratingHint ? 'scale(0.98)' : 'scale(1)',
            opacity: currentHintLevel >= maxHints ? 0.6 : 1,
            minHeight: '36px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: currentHintLevel < maxHints && !isGeneratingHint 
              ? `0 2px 8px ${theme.accent}30` 
              : 'none'
          }}
          aria-label={`Request hint ${currentHintLevel + 1} of ${maxHints}`}
        >
          {isGeneratingHint ? (
            <>
              <div 
                style={{
                  width: '12px',
                  height: '12px',
                  border: `2px solid ${theme.text}`,
                  borderTop: '2px solid transparent',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }}
              />
              <span>Thinking...</span>
            </>
          ) : (
            <>
              <span>{getButtonLabel()}</span>
              {currentHintLevel < maxHints && (
                <span style={{ 
                  fontSize: '12px', 
                  opacity: 0.8,
                  background: `${theme.text}20`,
                  borderRadius: '10px',
                  padding: '2px 6px'
                }}>
                  ({currentHintLevel + 1}/{maxHints})
                </span>
              )}
            </>
          )}
        </button>
      </div>

      {/* Hints Display */}
      {hints.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {hints.map((hint, index) => (
            <div
              key={index}
              style={{
                background: `${theme.primary}15`,
                border: `1px solid ${theme.accent}30`,
                borderRadius: '12px',
                padding: '12px 16px',
                animation: 'slideDown 0.3s ease-out',
                backdropFilter: 'blur(10px)'
              }}
            >
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px',
                marginBottom: '4px'
              }}>
                <span style={{ 
                  fontSize: '16px',
                  filter: hint.error ? 'grayscale(1)' : 'none'
                }}>
                  💡
                </span>
                <span style={{ 
                  fontSize: '12px', 
                  fontWeight: '600',
                  color: theme.accent,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Hint {hint.level}
                </span>
              </div>
              
              <p style={{ 
                margin: 0,
                fontSize: '14px',
                lineHeight: '1.4',
                color: theme.text,
                fontStyle: hint.error ? 'italic' : 'normal'
              }}>
                {hint.text}
              </p>
              
              {hint.error && (
                <div style={{
                  fontSize: '11px',
                  color: `${theme.accent}80`,
                  marginTop: '4px',
                  fontStyle: 'italic'
                }}>
                  ⚠️ Using fallback hint
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add CSS animation for slideDown */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes slideDown {
          0% {
            opacity: 0;
            transform: translateY(-10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};
