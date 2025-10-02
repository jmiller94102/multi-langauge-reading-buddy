import React, { useState, useRef, useCallback } from 'react';
import { AudioCacheService } from '../../services/AudioCacheService';

interface ThemeStyle {
  primary: string;
  accent: string;
  text: string;
  background: string;
}

interface KoreanPhoneticsPanelProps {
  koreanText: string;
  displayType: 'simplified' | 'IPA' | 'both';
  onPhoneticsModeChange: (mode: string) => void;
  autoPlayAudio?: boolean;
  theme: ThemeStyle;
  blendLevel: number; // 0-10 for progressive disclosure
  enabled?: boolean;
  onUsageTracked?: (data: { action: string; korean: string; success: boolean }) => void;
}

interface PhoneticsData {
  simplified: string;
  ipa: string;
  confidence: number;
  audioUrl?: string;
}

export const KoreanPhoneticsPanel: React.FC<KoreanPhoneticsPanelProps> = ({
  koreanText,
  displayType,
  onPhoneticsModeChange,
  autoPlayAudio = false,
  theme,
  blendLevel,
  enabled = true,
  onUsageTracked
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [phoneticsData, setPhoneticsData] = useState<PhoneticsData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedToVocabulary, setSavedToVocabulary] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const cacheService = AudioCacheService.getInstance();
  const overlayRef = useRef<HTMLDivElement>(null);

  // Determine interaction pattern based on blend level
  const getInteractionPattern = useCallback(() => {
    if (blendLevel <= 2) return 'hover'; // Levels 0-2: Phonetics on hover
    if (blendLevel <= 5) return 'click'; // Levels 3-5: Phonetics on click with audio
    if (blendLevel <= 8) return 'demand'; // Levels 6-8: Phonetics on demand
    return 'minimal'; // Levels 9-10: Minimal phonetics support
  }, [blendLevel]);

  // Fetch phonetics data from API
  const fetchPhonetics = useCallback(async () => {
    if (!koreanText.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:3001/api/korean-phonetics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          koreanText: koreanText.trim(),
          displayType,
          childSafe: true
        })
      });

      if (!response.ok) {
        throw new Error('Phonetics generation failed');
      }

      const result = await response.json();

      if (result.success) {
        const phonetics: PhoneticsData = {
          simplified: result.simplified || '',
          ipa: result.ipa || '',
          confidence: result.confidence || 0.8,
          audioUrl: result.audioUrl
        };

        setPhoneticsData(phonetics);

        // Auto-play audio if enabled and available
        if (autoPlayAudio && (phonetics.audioUrl || blendLevel <= 5)) {
          playKoreanAudio();
        }

        // Track successful phonetics access
        if (onUsageTracked) {
          onUsageTracked({ action: 'phonetics_accessed', korean: koreanText, success: true });
        }
      } else {
        throw new Error(result.error || 'Phonetics generation failed');
      }
    } catch (error) {
      console.error('Korean phonetics failed:', error);
      
      // Fallback phonetics for common words
      const fallbackPhonetics = getFallbackPhonetics(koreanText);
      if (fallbackPhonetics) {
        setPhoneticsData(fallbackPhonetics);
      } else {
        setError('Pronunciation helper is loading... Try sounding it out slowly! 🗣️');
      }

      if (onUsageTracked) {
        onUsageTracked({ action: 'phonetics_failed', korean: koreanText, success: false });
      }
    } finally {
      setIsLoading(false);
    }
  }, [koreanText, displayType, autoPlayAudio, blendLevel, onUsageTracked]);

  // Fallback phonetics for common Korean words
  const getFallbackPhonetics = (text: string): PhoneticsData | null => {
    const commonWords: Record<string, PhoneticsData> = {
      '안녕하세요': { simplified: 'ahn-nyeong-ha-se-yo', ipa: '[annjʌŋhasejo]', confidence: 0.9 },
      '감사합니다': { simplified: 'gam-sa-ham-ni-da', ipa: '[kamsahamnida]', confidence: 0.9 },
      '안녕': { simplified: 'ahn-nyeong', ipa: '[annjʌŋ]', confidence: 0.9 },
      '네': { simplified: 'ne', ipa: '[ne]', confidence: 0.9 },
      '아니요': { simplified: 'ah-ni-yo', ipa: '[anijo]', confidence: 0.9 },
      '친구': { simplified: 'chin-gu', ipa: '[tʃʰingu]', confidence: 0.9 },
      '학교': { simplified: 'hak-gyo', ipa: '[hakkjo]', confidence: 0.9 },
      '사랑': { simplified: 'sa-rang', ipa: '[saɾaŋ]', confidence: 0.9 }
    };

    return commonWords[text.trim()] || null;
  };

  // Play Korean audio
  const playKoreanAudio = useCallback(async () => {
    try {
      // Check cache first
      const cached = cacheService.get(koreanText, 'korean');
      
      if (cached && audioRef.current) {
        audioRef.current.src = cached;
        await audioRef.current.play();
        return;
      }

      // Generate audio via TTS API
      const response = await fetch('http://localhost:3001/api/text-to-speech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: koreanText,
          language: 'ko-KR',
          voice: 'korean',
          speed: 1.0,
          childSafe: true
        })
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.audio && audioRef.current) {
          cacheService.set(koreanText, 'korean', result.audio);
          audioRef.current.src = result.audio;
          await audioRef.current.play();
        }
      }
    } catch (error) {
      console.error('Korean audio playback failed:', error);
    }
  }, [koreanText, cacheService]);

  // Handle Korean text interaction
  const handleKoreanTextInteraction = useCallback(async (type: 'hover' | 'click') => {
    if (!enabled) return;

    const interactionPattern = getInteractionPattern();
    
    // Check if interaction is allowed based on blend level
    if (interactionPattern === 'minimal' && type === 'hover') return;
    if (interactionPattern === 'demand' && type === 'hover') return;
    if (interactionPattern === 'hover' && type === 'click') return;

    if (!phoneticsData) {
      await fetchPhonetics();
    }

    setIsVisible(true);
  }, [enabled, getInteractionPattern, phoneticsData, fetchPhonetics]);

  // Handle mouse enter
  const handleMouseEnter = useCallback(() => {
    handleKoreanTextInteraction('hover');
  }, [handleKoreanTextInteraction]);

  // Handle mouse leave
  const handleMouseLeave = useCallback(() => {
    const interactionPattern = getInteractionPattern();
    if (interactionPattern === 'hover') {
      setTimeout(() => setIsVisible(false), 300); // Brief delay for smooth UX
    }
  }, [getInteractionPattern]);

  // Handle click
  const handleClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleKoreanTextInteraction('click');
  }, [handleKoreanTextInteraction]);

  // Save to vocabulary
  const handleSaveToVocabulary = useCallback(() => {
    // This would integrate with a vocabulary system
    setSavedToVocabulary(true);
    
    if (onUsageTracked) {
      onUsageTracked({ action: 'vocabulary_saved', korean: koreanText, success: true });
    }

    // Reset after 2 seconds
    setTimeout(() => setSavedToVocabulary(false), 2000);
  }, [koreanText, onUsageTracked]);

  // Close overlay
  const handleClose = useCallback(() => {
    setIsVisible(false);
    setError(null);
  }, []);

  if (!enabled || !koreanText.trim()) {
    return <span>{koreanText}</span>;
  }

  return (
    <span className="korean-phonetics-container" style={{ position: 'relative', display: 'inline-block' }}>
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        onError={() => setError('Audio playback error')}
      />

      {/* Korean text with interaction */}
      <span
        className="korean-text-interactive"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        style={{
          textDecoration: isVisible ? 'underline' : 'underline',
          textDecorationColor: isVisible ? theme.accent : `${theme.accent}40`,
          textDecorationStyle: 'solid',
          textDecorationThickness: '1px',
          cursor: 'pointer',
          color: isVisible ? theme.accent : 'inherit',
          transition: 'all 0.2s ease',
          transform: isVisible ? 'scale(1.02)' : 'scale(1)',
          display: 'inline-block'
        }}
        title={getInteractionPattern() === 'hover' ? 'Hover for pronunciation' : 'Click for pronunciation'}
      >
        {koreanText}
      </span>

      {/* Phonetics overlay */}
      {isVisible && (
        <div
          ref={overlayRef}
          style={{
            position: 'absolute',
            top: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1000,
            background: `${theme.background}f0`,
            backdropFilter: 'blur(10px)',
            border: `2px solid ${theme.accent}60`,
            borderRadius: '12px',
            padding: '16px',
            minWidth: '280px',
            maxWidth: '400px',
            boxShadow: `0 8px 24px ${theme.primary}20`,
            animation: 'fadeIn 0.3s ease-out',
            marginTop: '8px'
          }}
        >
          {/* Header with Korean text and audio button */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            marginBottom: '12px'
          }}>
            <div style={{ 
              fontSize: '18px', 
              fontWeight: '600',
              color: theme.text
            }}>
              🔊 {koreanText}
            </div>
            
            <button
              onClick={handleClose}
              style={{
                background: 'none',
                border: 'none',
                color: theme.text,
                fontSize: '18px',
                cursor: 'pointer',
                opacity: 0.7,
                transition: 'opacity 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '0.7'}
            >
              ✕
            </button>
          </div>

          {/* Loading state */}
          {isLoading && (
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              color: theme.text,
              fontSize: '14px'
            }}>
              <div style={{
                width: '16px',
                height: '16px',
                border: `2px solid ${theme.accent}`,
                borderTop: '2px solid transparent',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }} />
              Loading pronunciation...
            </div>
          )}

          {/* Error state */}
          {error && (
            <div style={{
              color: '#ff6b6b',
              fontSize: '14px',
              fontStyle: 'italic',
              textAlign: 'center'
            }}>
              {error}
            </div>
          )}

          {/* Phonetics display */}
          {phoneticsData && !isLoading && (
            <div>
              {/* Simplified phonetics */}
              {(displayType === 'simplified' || displayType === 'both') && phoneticsData.simplified && (
                <div style={{ marginBottom: '8px' }}>
                  <div style={{ 
                    fontSize: '12px', 
                    color: theme.accent,
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    marginBottom: '4px'
                  }}>
                    Simplified:
                  </div>
                  <div style={{ 
                    fontSize: '16px', 
                    color: theme.text,
                    fontFamily: 'monospace',
                    background: `${theme.primary}15`,
                    padding: '6px 10px',
                    borderRadius: '6px'
                  }}>
                    {phoneticsData.simplified}
                  </div>
                </div>
              )}

              {/* IPA phonetics */}
              {(displayType === 'IPA' || displayType === 'both') && phoneticsData.ipa && (
                <div style={{ marginBottom: '12px' }}>
                  <div style={{ 
                    fontSize: '12px', 
                    color: theme.accent,
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    marginBottom: '4px'
                  }}>
                    IPA:
                  </div>
                  <div style={{ 
                    fontSize: '16px', 
                    color: theme.text,
                    fontFamily: 'monospace',
                    background: `${theme.primary}15`,
                    padding: '6px 10px',
                    borderRadius: '6px'
                  }}>
                    {phoneticsData.ipa}
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <div style={{ 
                display: 'flex', 
                gap: '8px', 
                justifyContent: 'center',
                marginTop: '12px'
              }}>
                <button
                  onClick={playKoreanAudio}
                  style={{
                    background: `linear-gradient(135deg, ${theme.accent}, ${theme.primary})`,
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '6px 12px',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'transform 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  🔊 Play
                </button>

                <button
                  onClick={handleSaveToVocabulary}
                  disabled={savedToVocabulary}
                  style={{
                    background: savedToVocabulary 
                      ? `${theme.primary}60` 
                      : `${theme.primary}20`,
                    color: theme.text,
                    border: `1px solid ${theme.primary}40`,
                    borderRadius: '6px',
                    padding: '6px 12px',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: savedToVocabulary ? 'default' : 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                  onMouseEnter={(e) => !savedToVocabulary && (e.currentTarget.style.transform = 'scale(1.05)')}
                  onMouseLeave={(e) => !savedToVocabulary && (e.currentTarget.style.transform = 'scale(1)')}
                >
                  {savedToVocabulary ? '✓ Saved' : '📚 Save'}
                </button>
              </div>

              {/* Confidence indicator */}
              {phoneticsData.confidence < 0.8 && (
                <div style={{
                  fontSize: '11px',
                  color: `${theme.text}70`,
                  textAlign: 'center',
                  marginTop: '8px',
                  fontStyle: 'italic'
                }}>
                  Pronunciation confidence: {Math.round(phoneticsData.confidence * 100)}%
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* CSS animations */}
      <style>{`
        @keyframes fadeIn {
          0% {
            opacity: 0;
            transform: translateX(-50%) translateY(-10px);
          }
          100% {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </span>
  );
};
