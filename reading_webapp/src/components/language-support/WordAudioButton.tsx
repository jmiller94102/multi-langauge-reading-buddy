import React, { useState, useRef, useCallback } from 'react';
import { AudioCacheService } from '../../services/AudioCacheService';

interface ThemeStyle {
  primary: string;
  accent: string;
  text: string;
  background: string;
}

interface WordAudioButtonProps {
  word: string;
  language: 'english' | 'korean';
  theme: ThemeStyle;
  enabled: boolean;
  onUsageTracked?: (data: { action: string; word: string; success: boolean }) => void;
}

export const WordAudioButton: React.FC<WordAudioButtonProps> = ({
  word,
  language,
  theme,
  enabled,
  onUsageTracked
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const cacheService = AudioCacheService.getInstance();

  const playWordAudio = useCallback(async () => {
    if (!enabled || !word.trim()) return;

    try {
      setIsLoading(true);
      setError(null);

      // Check cache first using AudioCacheService
      const cached = cacheService.get(word, language);

      let audioSrc: string | null = cached;

      if (!cached) {
        const response = await fetch('http://localhost:3001/api/text-to-speech', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: word,
            language: language === 'korean' ? 'ko-KR' : 'en-US',
            voice: language,
            speed: 1.0,
            childSafe: true
          })
        });

        if (!response.ok) {
          throw new Error('Word audio generation failed');
        }

        const result = await response.json();

        if (result.success && result.audio) {
          audioSrc = result.audio;
          cacheService.set(word, language, result.audio);
        } else {
          throw new Error(result.error || 'Word audio generation failed');
        }
      }

      // Play the audio
      if (audioSrc && audioRef.current) {
        audioRef.current.src = audioSrc;
        await audioRef.current.play();
        
        // Track successful word audio
        if (onUsageTracked) {
          onUsageTracked({ action: 'word_audio_played', word, success: true });
        }
      }

    } catch (error) {
      console.error('Word audio failed:', error);
      setError('Word sound not available right now');
      
      if (onUsageTracked) {
        onUsageTracked({ action: 'word_audio_failed', word, success: false });
      }
    } finally {
      setIsLoading(false);
    }
  }, [word, language, enabled, onUsageTracked]);

  const handleMouseEnter = useCallback(() => {
    if (enabled) {
      setIsVisible(true);
    }
  }, [enabled]);

  const handleMouseLeave = useCallback(() => {
    setIsVisible(false);
    setError(null);
  }, []);

  const handleClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    playWordAudio();
  }, [playWordAudio]);

  // Long press for mobile
  const handleTouchStart = useCallback(() => {
    if (enabled) {
      setIsVisible(true);
    }
  }, [enabled]);

  const handleTouchEnd = useCallback(() => {
    setTimeout(() => setIsVisible(false), 2000); // Hide after 2 seconds on mobile
  }, []);

  if (!enabled) {
    return <span>{word}</span>;
  }

  return (
    <span
      className="relative inline-block cursor-pointer"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        onError={() => setError('Audio playback error')}
      />

      {/* The word itself */}
      <span
        className="transition-all duration-200 hover:scale-105"
        style={{
          color: isVisible ? theme.accent : 'inherit',
          textDecoration: isVisible ? 'underline' : 'none',
          textDecorationColor: theme.accent
        }}
      >
        {word}
      </span>

      {/* Word-level audio button - 24x24px as specified */}
      {isVisible && (
        <button
          onClick={handleClick}
          disabled={isLoading}
          className="absolute -top-1 -right-1 h-6 w-6 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 z-10"
          style={{
            backgroundColor: theme.primary,
            color: theme.text,
            fontSize: '10px',
            opacity: isLoading ? 0.6 : 0.9,
            cursor: isLoading ? 'not-allowed' : 'pointer',
            minWidth: '24px',
            minHeight: '24px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
          }}
          aria-label={`Pronounce ${word}`}
        >
          {isLoading ? (
            <div className="w-2 h-2 border border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <span style={{ fontSize: '10px' }}>🔊</span>
          )}
        </button>
      )}

      {/* Error tooltip */}
      {error && isVisible && (
        <div
          className="absolute top-8 left-0 text-xs p-1 rounded whitespace-nowrap z-20"
          style={{
            backgroundColor: '#fee',
            color: '#c33',
            fontSize: '10px'
          }}
        >
          {error}
        </div>
      )}
    </span>
  );
};
