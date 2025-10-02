import React, { useState, useCallback, useMemo } from 'react';
import { HighlightRange } from '../../types/content';

interface ThemeStyle {
  primary: string;
  accent: string;
  text: string;
  background: string;
  fontFamily?: string;
}

interface VisualHighlighterProps {
  text: string;
  highlightRanges: HighlightRange[];
  theme: ThemeStyle;
  enabled: boolean;
  childSafe?: boolean;
  onHighlightClick?: (range: HighlightRange) => void;
  onWordClick?: (word: string, position: number) => void;
}

export const VisualHighlighter: React.FC<VisualHighlighterProps> = ({
  text,
  highlightRanges,
  theme,
  enabled,
  childSafe = true,
  onHighlightClick,
  onWordClick
}) => {
  const [activeHighlight, setActiveHighlight] = useState<string | null>(null);
  const [hoveredWord, setHoveredWord] = useState<number | null>(null);

  // Process text into segments with highlight information
  const textSegments = useMemo(() => {
    if (!enabled || !text || highlightRanges.length === 0) {
      return [{ text, type: 'normal', start: 0, end: text.length }];
    }

    // Sort ranges by start position
    const sortedRanges = [...highlightRanges].sort((a, b) => a.start - b.start);
    const segments: Array<{
      text: string;
      type: 'normal' | 'hint' | 'vocabulary' | 'answer' | 'korean' | 'context';
      start: number;
      end: number;
      range?: HighlightRange;
    }> = [];

    let currentPos = 0;

    sortedRanges.forEach((range) => {
      // Add normal text before highlight
      if (currentPos < range.start) {
        segments.push({
          text: text.slice(currentPos, range.start),
          type: 'normal',
          start: currentPos,
          end: range.start
        });
      }

      // Add highlighted segment
      if (range.start < range.end && range.end <= text.length) {
        segments.push({
          text: text.slice(range.start, range.end),
          type: range.type,
          start: range.start,
          end: range.end,
          range
        });
        currentPos = range.end;
      }
    });

    // Add remaining normal text
    if (currentPos < text.length) {
      segments.push({
        text: text.slice(currentPos),
        type: 'normal',
        start: currentPos,
        end: text.length
      });
    }

    return segments;
  }, [text, highlightRanges, enabled]);

  // Get highlight styles based on type and theme
  const getHighlightStyle = useCallback((type: string, isActive: boolean = false) => {
    const baseStyle = {
      transition: 'all 0.3s ease',
      borderRadius: '3px',
      padding: '2px 4px',
      margin: '0 1px',
      cursor: type !== 'normal' ? 'pointer' : 'default',
      position: 'relative' as const,
      display: 'inline-block'
    };

    switch (type) {
      case 'hint':
        return {
          ...baseStyle,
          backgroundColor: isActive ? `${theme.accent}40` : `${theme.accent}20`,
          border: `2px solid ${theme.accent}`,
          color: theme.text,
          boxShadow: isActive ? `0 2px 8px ${theme.accent}30` : 'none',
          transform: isActive ? 'scale(1.02)' : 'scale(1)'
        };
      case 'vocabulary':
        return {
          ...baseStyle,
          backgroundColor: isActive ? `${theme.primary}40` : `${theme.primary}20`,
          border: `2px solid ${theme.primary}`,
          color: theme.text,
          boxShadow: isActive ? `0 2px 8px ${theme.primary}30` : 'none',
          transform: isActive ? 'scale(1.02)' : 'scale(1)'
        };
      case 'korean':
        return {
          ...baseStyle,
          backgroundColor: isActive ? '#ff6b6b40' : '#ff6b6b20',
          border: '2px solid #ff6b6b',
          color: theme.text,
          fontWeight: 'bold',
          boxShadow: isActive ? '0 2px 8px #ff6b6b30' : 'none',
          transform: isActive ? 'scale(1.02)' : 'scale(1)'
        };
      case 'answer':
        return {
          ...baseStyle,
          backgroundColor: isActive ? '#10b98140' : '#10b98120',
          border: '2px solid #10b981',
          color: theme.text,
          boxShadow: isActive ? '0 2px 8px #10b98130' : 'none',
          transform: isActive ? 'scale(1.02)' : 'scale(1)'
        };
      case 'context':
        return {
          ...baseStyle,
          backgroundColor: isActive ? `${theme.background}40` : `${theme.background}20`,
          border: `1px dashed ${theme.text}40`,
          color: theme.text,
          opacity: 0.8,
          boxShadow: isActive ? `0 2px 4px ${theme.text}20` : 'none'
        };
      default:
        return {
          color: theme.text,
          cursor: onWordClick ? 'pointer' : 'default'
        };
    }
  }, [theme, onWordClick]);

  const handleSegmentClick = useCallback((segment: any) => {
    if (!enabled || segment.type === 'normal') {
      if (onWordClick && segment.text.trim()) {
        onWordClick(segment.text.trim(), segment.start);
      }
      return;
    }

    if (segment.range) {
      setActiveHighlight(segment.range.id || `${segment.start}-${segment.end}`);
      onHighlightClick?.(segment.range);
    }
  }, [enabled, onHighlightClick, onWordClick]);

  const handleMouseEnter = useCallback((segment: any) => {
    if (segment.type !== 'normal') {
      setActiveHighlight(segment.range?.id || `${segment.start}-${segment.end}`);
    } else if (onWordClick) {
      setHoveredWord(segment.start);
    }
  }, [onWordClick]);

  const handleMouseLeave = useCallback(() => {
    setActiveHighlight(null);
    setHoveredWord(null);
  }, []);

  if (!enabled) {
    return (
      <span style={{ color: theme.text, fontFamily: theme.fontFamily || 'inherit' }}>
        {text}
      </span>
    );
  }

  return (
    <div
      className="visual-highlighter"
      style={{
        lineHeight: '1.6',
        fontSize: '16px',
        fontFamily: theme.fontFamily || 'inherit',
        userSelect: 'text',
        wordBreak: 'break-word',
        position: 'relative'
      }}
    >
      {textSegments.map((segment, index) => {
        const isActive = activeHighlight === (segment.range?.id || `${segment.start}-${segment.end}`);
        const isHovered = hoveredWord === segment.start && segment.type === 'normal';

        return (
          <span
            key={`${segment.start}-${segment.end}-${index}`}
            style={{
              ...getHighlightStyle(segment.type, isActive),
              ...(isHovered && onWordClick ? {
                backgroundColor: `${theme.primary}10`,
                borderRadius: '3px',
                padding: '1px 2px'
              } : {})
            }}
            onClick={() => handleSegmentClick(segment)}
            onMouseEnter={() => handleMouseEnter(segment)}
            onMouseLeave={handleMouseLeave}
            data-type={segment.type}
            data-range-id={segment.range?.id}
            data-hint={segment.range?.hint}
            aria-label={
              segment.type !== 'normal'
                ? `${segment.type} highlighted text: ${segment.text}${segment.range?.hint ? `. Hint: ${segment.range.hint}` : ''}`
                : undefined
            }
            role={segment.type !== 'normal' ? 'button' : undefined}
            tabIndex={segment.type !== 'normal' ? 0 : undefined}
            onKeyDown={(e) => {
              if (segment.type !== 'normal' && (e.key === 'Enter' || e.key === ' ')) {
                e.preventDefault();
                handleSegmentClick(segment);
              }
            }}
          >
            {segment.text}
            {/* Child-friendly visual indicators */}
            {isActive && segment.range?.hint && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  backgroundColor: theme.background || '#fff',
                  border: `2px solid ${theme.accent}`,
                  borderRadius: '8px',
                  padding: '8px 12px',
                  fontSize: '14px',
                  color: theme.text,
                  maxWidth: '200px',
                  zIndex: 1000,
                  boxShadow: `0 4px 12px ${theme.accent}30`,
                  marginTop: '4px',
                  textAlign: 'center',
                  animation: 'fadeIn 0.3s ease'
                }}
              >
                {segment.range.hint}
              </div>
            )}
          </span>
        );
      })}

      {/* CSS for fade in animation */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateX(-50%) translateY(-10px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </div>
  );
};