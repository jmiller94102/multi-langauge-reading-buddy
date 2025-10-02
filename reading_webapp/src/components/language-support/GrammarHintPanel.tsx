import React, { useState, useCallback, useMemo } from 'react';

interface ThemeStyle {
  primary: string;
  accent: string;
  text: string;
  background: string;
  fontFamily?: string;
}

interface GrammarRule {
  id: string;
  pattern: string;
  explanation: string;
  examples: string[];
  level: 'basic' | 'intermediate' | 'advanced';
  visualCue?: string;
}

interface GrammarHintPanelProps {
  text: string;
  gradeLevel: '3rd' | '4th' | '5th' | '6th';
  theme: ThemeStyle;
  enabled: boolean;
  explanationStyle: 'visual' | 'textual' | 'both';
  complexity: 'simple' | 'normal' | 'detailed';
  childSafe?: boolean;
}

export const GrammarHintPanel: React.FC<GrammarHintPanelProps> = ({
  text,
  gradeLevel,
  theme,
  enabled,
  explanationStyle,
  complexity,
  childSafe = true
}) => {
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [showPanel, setShowPanel] = useState(false);
  const [activeRule, setActiveRule] = useState<GrammarRule | null>(null);

  // Grammar rules database for Korean language learning
  const grammarRules = useMemo((): GrammarRule[] => [
    // Basic particles (3rd-4th grade)
    {
      id: 'subject-particle',
      pattern: '이/가',
      explanation: 'Subject marker - shows who or what is doing the action',
      examples: ['나는 학생이에요 (I am a student)', '책이 있어요 (There is a book)'],
      level: 'basic',
      visualCue: '👤'
    },
    {
      id: 'object-particle',
      pattern: '을/를',
      explanation: 'Object marker - shows what is receiving the action',
      examples: ['사과를 먹어요 (I eat an apple)', '책을 읽어요 (I read a book)'],
      level: 'basic',
      visualCue: '📖'
    },
    {
      id: 'topic-particle',
      pattern: '은/는',
      explanation: 'Topic marker - introduces what we are talking about',
      examples: ['저는 학생이에요 (As for me, I am a student)', '오늘은 좋은 날이에요 (Today is a good day)'],
      level: 'basic',
      visualCue: '💭'
    },

    // Location and direction (4th-5th grade)
    {
      id: 'location-particle',
      pattern: '에/에서',
      explanation: '에 = to/at (destination), 에서 = from/at (location of action)',
      examples: ['학교에 가요 (I go to school)', '집에서 공부해요 (I study at home)'],
      level: 'intermediate',
      visualCue: '📍'
    },

    // Polite endings (all grades)
    {
      id: 'polite-ending',
      pattern: '요',
      explanation: 'Polite ending - makes sentences respectful and friendly',
      examples: ['안녕하세요 (Hello)', '감사합니다 (Thank you)'],
      level: 'basic',
      visualCue: '🙇'
    },

    // Question forms (5th-6th grade)
    {
      id: 'question-particle',
      pattern: '뭐/무엇',
      explanation: 'Question words for "what"',
      examples: ['뭐 해요? (What are you doing?)', '무엇을 좋아해요? (What do you like?)'],
      level: 'intermediate',
      visualCue: '❓'
    },

    // Advanced patterns (6th grade)
    {
      id: 'connective',
      pattern: '그래서/그런데',
      explanation: '그래서 = so/therefore, 그런데 = but/however',
      examples: ['비가 와서 집에 있어요 (It\'s raining, so I\'m staying home)', '좋은데 비싸요 (It\'s good, but expensive)'],
      level: 'advanced',
      visualCue: '🔗'
    }
  ], []);

  // Filter rules based on grade level and complexity
  const appropriateRules = useMemo(() => {
    const gradeNumber = parseInt(gradeLevel.replace(/\D/g, ''));

    return grammarRules.filter(rule => {
      if (gradeNumber <= 3) return rule.level === 'basic';
      if (gradeNumber <= 4) return rule.level === 'basic' || rule.level === 'intermediate';
      return true; // 5th-6th grade gets all rules
    });
  }, [grammarRules, gradeLevel]);

  // Detect grammar patterns in text
  const detectGrammarPatterns = useCallback((inputText: string) => {
    const detectedPatterns: Array<{ rule: GrammarRule; position: number; match: string }> = [];

    appropriateRules.forEach(rule => {
      // Simple pattern matching for Korean particles and patterns
      const patterns = rule.pattern.split('/');

      patterns.forEach(pattern => {
        if (inputText.includes(pattern)) {
          const position = inputText.indexOf(pattern);
          detectedPatterns.push({
            rule,
            position,
            match: pattern
          });
        }
      });
    });

    return detectedPatterns.sort((a, b) => a.position - b.position);
  }, [appropriateRules]);

  // Get detected patterns in current text
  const detectedPatterns = useMemo(() => {
    return detectGrammarPatterns(text);
  }, [text, detectGrammarPatterns]);

  const handleWordClick = useCallback((word: string, event: React.MouseEvent) => {
    if (!enabled) return;

    // Find if this word contains any grammar patterns
    const pattern = detectedPatterns.find(p => word.includes(p.match));

    if (pattern) {
      setSelectedWord(word);
      setActiveRule(pattern.rule);
      setShowPanel(true);
    } else {
      setShowPanel(false);
      setActiveRule(null);
    }
  }, [enabled, detectedPatterns]);

  const renderTextWithHighlights = useCallback(() => {
    if (!enabled || detectedPatterns.length === 0) {
      return <span style={{ color: theme.text }}>{text}</span>;
    }

    const words = text.split(/(\s+)/);

    return (
      <span>
        {words.map((word, index) => {
          const hasPattern = detectedPatterns.some(p => word.includes(p.match));

          return (
            <span
              key={index}
              style={{
                color: theme.text,
                cursor: hasPattern ? 'help' : 'default',
                backgroundColor: hasPattern ? `${theme.accent}20` : 'transparent',
                borderRadius: hasPattern ? '3px' : '0',
                padding: hasPattern ? '1px 3px' : '0',
                textDecoration: hasPattern ? 'underline' : 'none',
                textDecorationStyle: 'dotted',
                textDecorationColor: theme.accent,
                transition: 'all 0.2s ease'
              }}
              onClick={(e) => hasPattern ? handleWordClick(word, e) : undefined}
              onMouseEnter={(e) => {
                if (hasPattern) {
                  e.currentTarget.style.backgroundColor = `${theme.accent}40`;
                }
              }}
              onMouseLeave={(e) => {
                if (hasPattern) {
                  e.currentTarget.style.backgroundColor = `${theme.accent}20`;
                }
              }}
            >
              {word}
            </span>
          );
        })}
      </span>
    );
  }, [text, theme, enabled, detectedPatterns, handleWordClick]);

  const renderGrammarExplanation = useCallback(() => {
    if (!activeRule) return null;

    const isSimpleComplexity = complexity === 'simple';
    const showVisual = explanationStyle === 'visual' || explanationStyle === 'both';
    const showText = explanationStyle === 'textual' || explanationStyle === 'both';

    return (
      <div
        style={{
          backgroundColor: theme.background || '#fff',
          border: `2px solid ${theme.accent}`,
          borderRadius: '12px',
          padding: '16px',
          marginTop: '12px',
          maxWidth: '400px',
          boxShadow: `0 4px 12px ${theme.accent}30`,
          animation: 'slideInUp 0.3s ease'
        }}
      >
        {/* Header with visual cue */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '12px'
        }}>
          {showVisual && activeRule.visualCue && (
            <span style={{ fontSize: '24px' }}>{activeRule.visualCue}</span>
          )}
          <h4 style={{
            margin: 0,
            color: theme.accent,
            fontSize: '16px',
            fontWeight: 'bold'
          }}>
            {activeRule.pattern}
          </h4>
        </div>

        {/* Explanation */}
        {showText && (
          <p style={{
            color: theme.text,
            fontSize: isSimpleComplexity ? '14px' : '13px',
            lineHeight: '1.5',
            margin: '0 0 12px 0'
          }}>
            {activeRule.explanation}
          </p>
        )}

        {/* Examples */}
        {!isSimpleComplexity && activeRule.examples.length > 0 && (
          <div style={{ marginTop: '12px' }}>
            <h5 style={{
              margin: '0 0 8px 0',
              color: theme.accent,
              fontSize: '12px',
              fontWeight: 'bold'
            }}>
              Examples:
            </h5>
            {activeRule.examples.slice(0, 2).map((example, index) => (
              <div
                key={index}
                style={{
                  backgroundColor: `${theme.primary}10`,
                  padding: '6px 8px',
                  borderRadius: '6px',
                  marginBottom: '4px',
                  fontSize: '12px',
                  color: theme.text,
                  fontFamily: 'monospace'
                }}
              >
                {example}
              </div>
            ))}
          </div>
        )}

        {/* Close button */}
        <button
          onClick={() => {
            setShowPanel(false);
            setActiveRule(null);
            setSelectedWord(null);
          }}
          style={{
            marginTop: '8px',
            backgroundColor: theme.accent,
            color: theme.background || '#fff',
            border: 'none',
            borderRadius: '6px',
            padding: '6px 12px',
            fontSize: '12px',
            cursor: 'pointer',
            float: 'right'
          }}
        >
          Got it! ✓
        </button>
        <div style={{ clear: 'both' }} />
      </div>
    );
  }, [activeRule, theme, complexity, explanationStyle]);

  if (!enabled) {
    return <span style={{ color: theme.text }}>{text}</span>;
  }

  return (
    <div className="grammar-hint-container" style={{ position: 'relative' }}>
      {/* Text with grammar highlights */}
      <div style={{ marginBottom: showPanel ? '8px' : '0' }}>
        {renderTextWithHighlights()}
      </div>

      {/* Grammar pattern indicator */}
      {detectedPatterns.length > 0 && !showPanel && (
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          fontSize: '10px',
          color: theme.accent,
          opacity: 0.7,
          marginLeft: '4px'
        }}>
          <span>📚</span>
          <span>{detectedPatterns.length} grammar pattern{detectedPatterns.length > 1 ? 's' : ''}</span>
        </div>
      )}

      {/* Grammar explanation panel */}
      {showPanel && renderGrammarExplanation()}

      {/* CSS for animations */}
      <style>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};