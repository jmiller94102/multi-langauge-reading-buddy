import React, { useState, useCallback, useMemo } from 'react';

interface ThemeStyle {
  primary: string;
  accent: string;
  text: string;
  background: string;
  fontFamily?: string;
}

interface RomanizationOverlayProps {
  text: string;
  theme: ThemeStyle;
  enabled: boolean;
  displayMode: 'hover' | 'toggle' | 'always';
  fadeOutLevel: number; // 0-10 language blend level - higher means less romanization
  system: 'revised' | 'mccune' | 'yale'; // Korean romanization systems
  childSafe?: boolean;
  userPreferenceOverride?: boolean; // Allow user to override automatic behavior
  onUsageTracked?: (data: { action: string; korean: string; level: number }) => void;
  apiEnabled?: boolean; // Use API for better romanization accuracy
}

export const RomanizationOverlay: React.FC<RomanizationOverlayProps> = ({
  text,
  theme,
  enabled,
  displayMode,
  fadeOutLevel,
  system,
  childSafe = true,
  userPreferenceOverride = false,
  onUsageTracked,
  apiEnabled = false
}) => {
  const [showRomanization, setShowRomanization] = useState(displayMode === 'always');
  const [isHovering, setIsHovering] = useState(false);
  const [apiRomanizations, setApiRomanizations] = useState<Record<string, string>>({});

  // Basic Korean to romanization mapping (Revised Romanization of Korean)
  const romanizationMap = useMemo(() => {
    const revisedMap: Record<string, string> = {
      // Basic vowels
      '아': 'a', '어': 'eo', '오': 'o', '우': 'u', '으': 'eu', '이': 'i',
      '애': 'ae', '에': 'e', '외': 'oe', '위': 'wi', '의': 'ui',

      // Common syllables
      '안': 'an', '녕': 'nyeong', '하': 'ha', '세': 'se', '요': 'yo',
      '만': 'man', '나': 'na', '다': 'da', '라': 'ra', '바': 'ba',
      '가': 'ga', '감': 'gam', '합': 'hap', '니': 'ni',

      // Numbers
      '일': 'il', '삼': 'sam', '사': 'sa', '오수': 'o-su',
      '육': 'yuk', '칠': 'chil', '팔': 'pal', '구': 'gu', '십': 'sip',

      // Common words
      '안녕': 'annyeong', '하세요': 'haseyo', '감사': 'gamsa',
      '합니다': 'hamnida', '네': 'ne', '아니': 'ani',
      '좋다': 'jota', '나쁘다': 'nappeuda', '크다': 'keuda', '작다': 'jakda',
      '빨갛다': 'ppalgata', '파랗다': 'parata', '노랗다': 'norata',

      // Food words (common for children)
      '밥': 'bap', '물': 'mul', '김치': 'gimchi', '빵': 'ppang',
      '우유': 'uyu', '사과': 'sagwa', '바나나': 'banana',

      // Family words
      '엄마': 'eomma', '아빠': 'appa', '형': 'hyeong', '누나': 'nuna',
      '언니': 'eonni', '동생': 'dongsaeng',

      // School words
      '학교': 'hakgyo', '선생님': 'seonsaengnim', '책': 'chaek',
      '연필': 'yeonpil', '지우개': 'jiugae'
    };

    // Add McCune-Reischauer variations if needed
    const mccuneMap: Record<string, string> = {
      '안녕': 'annyŏng', '하세요': 'haseyo', '감사': 'kamsa',
      '합니다': 'hamnida'
    };

    return system === 'mccune' ? { ...revisedMap, ...mccuneMap } : revisedMap;
  }, [system]);

  // Calculate opacity based on fade-out level (progressive learning)
  const calculateOpacity = useCallback((baseOpacity: number = 1) => {
    if (!enabled) return 0;

    // User preference override - always show if enabled
    if (userPreferenceOverride) return baseOpacity;

    // Progressive disclosure based on Korean blend level:
    // Levels 0-2: Full romanization display
    // Levels 3-5: Romanization on hover/click only
    // Levels 6-8: New vocabulary romanization only
    // Levels 9-10: No romanization (full immersion)
    if (fadeOutLevel <= 2) return baseOpacity; // Full display
    if (fadeOutLevel <= 5) return baseOpacity * 0.8; // Reduced but visible
    if (fadeOutLevel <= 8) return baseOpacity * 0.3; // New vocabulary only
    return baseOpacity * 0.05; // Full immersion - minimal help
  }, [enabled, fadeOutLevel, userPreferenceOverride]);

  // Fetch romanization from API
  const fetchApiRomanization = useCallback(async (koreanText: string) => {
    if (!apiEnabled || apiRomanizations[koreanText]) return;

    try {
      const response = await fetch('http://localhost:3001/api/korean-romanization', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          koreanText,
          system,
          childSafe
        })
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.romanization) {
          setApiRomanizations(prev => ({
            ...prev,
            [koreanText]: result.romanization
          }));
          
          // Track successful API usage
          if (onUsageTracked) {
            onUsageTracked({ action: 'api_romanization', korean: koreanText, level: fadeOutLevel });
          }
        }
      }
    } catch (error) {
      console.warn('API romanization failed:', error);
    }
  }, [apiEnabled, apiRomanizations, system, childSafe, onUsageTracked, fadeOutLevel]);

  // Convert Korean text to romanization (synchronous)
  const getRomanization = useCallback((koreanText: string): string => {
    // Check API cache first
    if (apiRomanizations[koreanText]) {
      return apiRomanizations[koreanText];
    }

    // Check local mapping
    if (romanizationMap[koreanText]) {
      return romanizationMap[koreanText];
    }

    // Try character by character for unknown phrases
    let result = '';
    for (let char of koreanText) {
      if (romanizationMap[char]) {
        result += romanizationMap[char];
      } else if (/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(char)) {
        // Korean character without mapping
        result += '?';
      } else {
        // Non-Korean character (space, punctuation, etc.)
        result += char;
      }
    }

    // Trigger API fetch for better romanization
    if (apiEnabled && !apiRomanizations[koreanText]) {
      fetchApiRomanization(koreanText);
    }

    // Track fallback usage
    if (onUsageTracked && !apiRomanizations[koreanText]) {
      onUsageTracked({ action: 'fallback_romanization', korean: koreanText, level: fadeOutLevel });
    }

    return result || koreanText;
  }, [romanizationMap, apiRomanizations, apiEnabled, fetchApiRomanization, onUsageTracked, fadeOutLevel]);

  // Split text into Korean and non-Korean segments
  const textSegments = useMemo(() => {
    const segments: Array<{ text: string; isKorean: boolean; romanization?: string }> = [];
    const koreanRegex = /[가-힣]+/g;
    let lastIndex = 0;
    let match;

    while ((match = koreanRegex.exec(text)) !== null) {
      // Add non-Korean text before this match
      if (match.index > lastIndex) {
        segments.push({
          text: text.slice(lastIndex, match.index),
          isKorean: false
        });
      }

      // Add Korean text with romanization
      segments.push({
        text: match[0],
        isKorean: true,
        romanization: getRomanization(match[0])
      });

      lastIndex = match.index + match[0].length;
    }

    // Add remaining non-Korean text
    if (lastIndex < text.length) {
      segments.push({
        text: text.slice(lastIndex),
        isKorean: false
      });
    }

    return segments;
  }, [text, getRomanization]);

  const handleMouseEnter = useCallback(() => {
    if (displayMode === 'hover') {
      setIsHovering(true);
      setShowRomanization(true);
    }
  }, [displayMode]);

  const handleMouseLeave = useCallback(() => {
    if (displayMode === 'hover') {
      setIsHovering(false);
      setShowRomanization(false);
    }
  }, [displayMode]);

  const handleToggle = useCallback(() => {
    if (displayMode === 'toggle') {
      setShowRomanization(!showRomanization);
    }
  }, [displayMode, showRomanization]);

  if (!enabled || calculateOpacity() === 0) {
    return <span style={{ color: theme.text }}>{text}</span>;
  }

  const shouldShowRomanization = displayMode === 'always' ||
    (displayMode === 'hover' && isHovering) ||
    (displayMode === 'toggle' && showRomanization);

  return (
    <div
      className="romanization-container"
      style={{
        display: 'inline-block',
        position: 'relative',
        lineHeight: '1.6'
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {textSegments.map((segment, index) => (
        <span key={index} style={{ position: 'relative', display: 'inline-block' }}>
          {/* Original text */}
          <span
            style={{
              color: theme.text,
              cursor: displayMode === 'toggle' && segment.isKorean ? 'pointer' : 'default'
            }}
            onClick={segment.isKorean ? handleToggle : undefined}
          >
            {segment.text}
          </span>

          {/* Romanization overlay */}
          {segment.isKorean && segment.romanization && shouldShowRomanization && (
            <span
              className="romanization-text"
              style={{
                position: 'absolute',
                top: '100%',
                left: '50%',
                transform: 'translateX(-50%)',
                fontSize: '10px',
                color: theme.accent,
                backgroundColor: `${theme.background || '#fff'}ee`,
                padding: '2px 4px',
                borderRadius: '3px',
                border: `1px solid ${theme.accent}40`,
                whiteSpace: 'nowrap',
                zIndex: 10,
                opacity: calculateOpacity(0.9),
                transition: 'opacity 0.3s ease',
                fontFamily: 'monospace',
                marginTop: '2px',
                boxShadow: `0 2px 4px ${theme.accent}20`,
                animation: shouldShowRomanization ? 'fadeInRomanization 0.3s ease' : undefined
              }}
              role="tooltip"
              aria-label={`Romanization: ${segment.romanization}`}
            >
              {segment.romanization}
            </span>
          )}
        </span>
      ))}

      {/* Toggle hint for children */}
      {displayMode === 'toggle' && textSegments.some(s => s.isKorean) && (
        <span
          style={{
            fontSize: '10px',
            color: theme.accent,
            opacity: calculateOpacity(0.6),
            marginLeft: '4px',
            cursor: 'help'
          }}
          title="Click Korean words to toggle romanization"
        >
          📝
        </span>
      )}

      {/* Learning progress indicator */}
      {fadeOutLevel > 5 && displayMode !== 'always' && (
        <span
          style={{
            fontSize: '8px',
            color: theme.accent,
            opacity: calculateOpacity(0.4),
            marginLeft: '2px'
          }}
          title={`Learning level: ${fadeOutLevel}/10 - Romanization ${fadeOutLevel > 8 ? 'minimal' : 'reduced'}`}
        >
          {fadeOutLevel > 8 ? '🎓' : '📚'}
        </span>
      )}

      {/* CSS for animations */}
      <style>{`
        @keyframes fadeInRomanization {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(-5px);
          }
          to {
            opacity: ${calculateOpacity(0.9)};
            transform: translateX(-50%) translateY(0);
          }
        }
      `}</style>
    </div>
  );
};