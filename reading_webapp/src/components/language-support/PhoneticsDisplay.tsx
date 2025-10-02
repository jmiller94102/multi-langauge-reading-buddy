import React, { useState, useCallback, useRef, useEffect } from 'react';

interface ThemeStyle {
  primary: string;
  accent: string;
  text: string;
  background: string;
  fontFamily?: string;
}

interface PhoneticsData {
  success: boolean;
  koreanText: string;
  simplified: string;
  ipa: string;
  confidence: string;
  displayType: string;
  childSafe: boolean;
  timestamp: string;
}

interface PhoneticsDisplayProps {
  koreanText: string;
  displayType: 'simplified' | 'IPA' | 'both';
  trigger: 'click' | 'hover';
  theme: ThemeStyle;
  enabled: boolean;
  childSafe?: boolean;
  onPronunciationPlay?: (text: string) => void;
}

export const PhoneticsDisplay: React.FC<PhoneticsDisplayProps> = ({
  koreanText,
  displayType,
  trigger,
  theme,
  enabled,
  childSafe = true,
  onPronunciationPlay
}) => {
  const [showPhonetics, setShowPhonetics] = useState(false);
  const [phoneticsData, setPhoneticsData] = useState<PhoneticsData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load phonetics data from backend
  const loadPhonetics = useCallback(async () => {
    if (!enabled || !koreanText.trim()) return;

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('http://localhost:3001/api/korean-phonetics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          koreanText: koreanText.trim(),
          displayType,
          childSafe
        })
      });

      if (!response.ok) {
        throw new Error(`API response not ok: ${response.status}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to get phonetics data');
      }

      setPhoneticsData(data);
    } catch (error) {
      console.error('Phonetics loading failed:', error);
      setError('Pronunciation guide not available');
    } finally {
      setIsLoading(false);
    }
  }, [koreanText, displayType, childSafe, enabled]);

  const handleInteraction = useCallback(() => {
    if (!enabled) return;

    if (trigger === 'click') {
      setShowPhonetics(!showPhonetics);
      if (!showPhonetics && !phoneticsData && !isLoading) {
        loadPhonetics();
      }
    }
  }, [trigger, enabled, showPhonetics, phoneticsData, isLoading, loadPhonetics]);

  const handleMouseEnter = useCallback(() => {
    if (!enabled || trigger !== 'hover') return;

    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Delay showing to avoid accidental triggers
    timeoutRef.current = setTimeout(() => {
      setShowPhonetics(true);
      if (!phoneticsData && !isLoading) {
        loadPhonetics();
      }
    }, 300);
  }, [trigger, enabled, phoneticsData, isLoading, loadPhonetics]);

  const handleMouseLeave = useCallback(() => {
    if (!enabled || trigger !== 'hover') return;

    // Clear the timeout if we're leaving before it triggers
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Hide after a short delay to allow moving to tooltip
    timeoutRef.current = setTimeout(() => {
      setShowPhonetics(false);
    }, 200);
  }, [trigger, enabled]);

  const handlePronunciationPlay = useCallback(() => {
    if (onPronunciationPlay && koreanText) {
      onPronunciationPlay(koreanText);
    }
  }, [onPronunciationPlay, koreanText]);

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  if (!enabled) {
    return <span style={{ color: theme.text }}>{koreanText}</span>;
  }

  // Check if text contains Korean characters
  const hasKoreanChars = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(koreanText);

  if (!hasKoreanChars) {
    return <span style={{ color: theme.text }}>{koreanText}</span>;
  }

  return (
    <div
      ref={containerRef}
      className="relative inline-block"
      style={{ position: 'relative' }}
    >
      {/* Korean text with interaction */}
      <span
        className="korean-text"
        style={{
          color: theme.text,
          textDecoration: 'underline',
          textDecorationStyle: 'dotted',
          textDecorationColor: theme.accent,
          cursor: enabled ? 'help' : 'default',
          padding: '2px 4px',
          borderRadius: '3px',
          backgroundColor: showPhonetics ? `${theme.accent}15` : 'transparent',
          transition: 'all 0.2s ease',
          fontWeight: 'bold'
        }}
        onClick={handleInteraction}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        aria-describedby={showPhonetics ? `phonetics-${koreanText.replace(/\s+/g, '-')}` : undefined}
        role={trigger === 'click' ? 'button' : undefined}
        tabIndex={trigger === 'click' ? 0 : undefined}
        onKeyDown={(e) => {
          if (trigger === 'click' && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            handleInteraction();
          }
        }}
      >
        {koreanText}
      </span>

      {/* Phonetics tooltip */}
      {showPhonetics && (
        <div
          id={`phonetics-${koreanText.replace(/\s+/g, '-')}`}
          className="phonetics-tooltip"
          style={{
            position: 'absolute',
            top: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            marginTop: '8px',
            backgroundColor: theme.background || '#fff',
            border: `2px solid ${theme.accent}`,
            borderRadius: '8px',
            padding: '12px',
            minWidth: '120px',
            maxWidth: '200px',
            zIndex: 1000,
            boxShadow: `0 4px 12px ${theme.accent}30`,
            animation: 'fadeInUp 0.3s ease',
            whiteSpace: 'nowrap'
          }}
          role="tooltip"
          onMouseEnter={() => {
            if (timeoutRef.current) {
              clearTimeout(timeoutRef.current);
            }
          }}
          onMouseLeave={handleMouseLeave}
        >
          {/* Loading state */}
          {isLoading && (
            <div style={{ textAlign: 'center', color: theme.text, fontSize: '12px' }}>
              <div
                style={{
                  width: '16px',
                  height: '16px',
                  border: `2px solid ${theme.accent}20`,
                  borderTop: `2px solid ${theme.accent}`,
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  margin: '0 auto 4px'
                }}
              />
              Loading...
            </div>
          )}

          {/* Error state */}
          {error && !isLoading && (
            <div style={{
              color: '#ff6b6b',
              fontSize: '12px',
              textAlign: 'center',
              whiteSpace: 'normal'
            }}>
              {error}
            </div>
          )}

          {/* Phonetics data */}
          {phoneticsData && !isLoading && !error && (
            <div style={{ color: theme.text }}>
              {(displayType === 'simplified' || displayType === 'both') && (
                <div style={{
                  fontWeight: 'bold',
                  fontSize: '14px',
                  marginBottom: displayType === 'both' ? '6px' : '0',
                  color: theme.accent
                }}>
                  {phoneticsData.simplified}
                </div>
              )}

              {(displayType === 'IPA' || displayType === 'both') && (
                <div style={{
                  fontFamily: 'monospace',
                  fontSize: '13px',
                  color: theme.text,
                  opacity: 0.8
                }}>
                  [{phoneticsData.ipa}]
                </div>
              )}

              {/* Pronunciation button */}
              {onPronunciationPlay && (
                <button
                  onClick={handlePronunciationPlay}
                  style={{
                    marginTop: '8px',
                    background: theme.accent,
                    color: theme.text,
                    border: 'none',
                    borderRadius: '6px',
                    padding: '4px 8px',
                    fontSize: '12px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    width: '100%',
                    justifyContent: 'center',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                  aria-label="Play pronunciation"
                >
                  <span style={{ fontSize: '14px' }}>🔊</span>
                  Play
                </button>
              )}

              {/* Confidence indicator for children */}
              {phoneticsData.confidence === 'basic' && (
                <div style={{
                  fontSize: '10px',
                  color: theme.text,
                  opacity: 0.6,
                  marginTop: '4px',
                  textAlign: 'center'
                }}>
                  Basic pronunciation guide
                </div>
              )}
            </div>
          )}

          {/* Tooltip arrow */}
          <div
            style={{
              position: 'absolute',
              top: '-6px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '12px',
              height: '12px',
              backgroundColor: theme.background || '#fff',
              border: `2px solid ${theme.accent}`,
              borderRight: 'none',
              borderBottom: 'none',
              transform: 'translateX(-50%) rotate(45deg)',
              zIndex: -1
            }}
          />
        </div>
      )}

      {/* CSS for animations */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};