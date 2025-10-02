import React, { useState, useRef, useCallback, useEffect } from 'react';
import { AudioCacheService } from '../../services/AudioCacheService';
import { LanguageSupportService } from '../../services/LanguageSupportService';
import { AnalyticsService } from '../../services/AnalyticsService';

interface ThemeStyle {
  primary: string;
  accent: string;
  text: string;
  background: string;
}

interface AudioPlayerProps {
  text: string;
  language: 'english' | 'korean';
  childSafe?: boolean;
  theme: ThemeStyle;
  enabled: boolean;
  autoPlay?: boolean;
  onUsageTracked?: (data: { action: string; duration?: number; success: boolean }) => void;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  text,
  language,
  childSafe = true,
  theme,
  enabled,
  autoPlay = false,
  onUsageTracked
}) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [playbackProgress, setPlaybackProgress] = useState(0)
  const [startTime, setStartTime] = useState<number | null>(null)
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([])
  const [selectedVoiceIndex, setSelectedVoiceIndex] = useState<number>(-1)
  const [isLoadingAudio, setIsLoadingAudio] = useState(false)
  
  const audioRef = useRef<HTMLAudioElement>(null)
  const cacheService = AudioCacheService.getInstance()
  const languageService = LanguageSupportService.getInstance()
  const analyticsService = AnalyticsService.getInstance();

  // Initialize voices when component mounts
  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      const filteredVoices = voices.filter(voice => 
        language === 'korean' ? voice.lang.startsWith('ko') : voice.lang.startsWith('en')
      );
      setAvailableVoices(filteredVoices);
      
      // Auto-select best voice if none selected
      if (selectedVoiceIndex === -1 && filteredVoices.length > 0) {
        const bestVoiceIndex = findBestVoiceIndex(filteredVoices, language);
        setSelectedVoiceIndex(bestVoiceIndex);
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, [language, selectedVoiceIndex]);

  // Helper function to find best voice
  const findBestVoiceIndex = (voices: SpeechSynthesisVoice[], lang: string): number => {
    if (lang === 'korean') {
      return voices.findIndex(voice => 
        voice.name.includes('Premium') || voice.name.includes('Enhanced') || voice.name.includes('Neural')
      ) || voices.findIndex(voice => voice.localService) || 0;
    } else {
      return voices.findIndex(voice => 
        voice.name.includes('Samantha') || voice.name.includes('Alex') || voice.name.includes('Ava')
      ) || voices.findIndex(voice => 
        voice.name.includes('Premium') || voice.name.includes('Enhanced')
      ) || voices.findIndex(voice => voice.localService) || 0;
    }
  };

  // Child-optimized audio loading with browser TTS fallback
  const loadAudio = useCallback(async () => {
    if (!enabled || !text.trim()) return;
    try {
      setIsLoading(true);
      setError(null);

      // Check cache first using AudioCacheService
      const cached = cacheService.get(text, language);

      if (cached) {
        if (audioRef.current) {
          audioRef.current.src = cached;
        }
        setIsLoading(false);
        return;
      }

      // Try backend TTS first
      try {
        const response = await fetch('http://localhost:3001/api/text-to-speech', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text,
            language: language === 'korean' ? 'ko-KR' : 'en-US',
            voice: language,
            speed: playbackSpeed,
            childSafe
          })
        });

        if (response.ok) {
          const result = await response.json();
          if (result.success && result.audio) {
            // Cache for future use with AudioCacheService
            cacheService.set(text, language, result.audio);
            if (audioRef.current) {
              audioRef.current.src = result.audio;
            }
            setIsLoading(false);
            return;
          }
        }
      } catch (backendError) {
        console.log('Backend TTS unavailable, using browser TTS fallback');
      }

      // Fallback to browser Speech Synthesis API
      if ('speechSynthesis' in window) {
        console.log('🔊 Using browser TTS fallback');
        // We'll handle this in the play function instead
        setIsLoading(false);
        return;
      }

      throw new Error('No TTS service available');

    } catch (error) {
      console.error('Audio loading failed:', error);
      const childFriendlyError = 'The story reader is taking a quick break! 😴 Try again in a moment!';
      setError(childFriendlyError);
      
      // Track failed audio loading
      if (onUsageTracked) {
        onUsageTracked({ action: 'audio_load_failed', success: false });
      }
    } finally {
      setIsLoading(false);
    }
  }, [text, language, childSafe, enabled, playbackSpeed]);

  const togglePlayback = useCallback(async () => {
    console.log('🎵 AudioPlayer: togglePlayback called');
    console.log('🎵 AudioPlayer: enabled =', enabled);
    console.log('🎵 AudioPlayer: isPlaying =', isPlaying);
    console.log('🎵 AudioPlayer: text length =', text.length);
    
    if (!enabled) {
      console.log('🎵 AudioPlayer: Audio not enabled, returning');
      return;
    }

    if (isPlaying) {
      // Stop current playback
      if (audioRef.current && audioRef.current.src) {
        audioRef.current.pause();
      }
      
      // Stop browser TTS if active
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      
      setIsPlaying(false);
      
      // Track usage duration
      if (startTime && onUsageTracked) {
        const duration = Date.now() - startTime;
        onUsageTracked({ action: 'audio_paused', duration, success: true });
      }
      setStartTime(null);
    } else {
      try {
        console.log('🎵 AudioPlayer: Starting playback process...');
        
        // Load audio if not already loaded
        if (audioRef.current && !audioRef.current.src) {
          console.log('🎵 AudioPlayer: No audio src, calling loadAudio...');
          await loadAudio();
        }

        console.log('🎵 AudioPlayer: Checking audio element src...');
        console.log('🎵 AudioPlayer: audioRef.current =', audioRef.current);
        console.log('🎵 AudioPlayer: audioRef.current.src =', audioRef.current?.src);

        // Try to play from audio element first (backend TTS)
        if (audioRef.current && audioRef.current.src) {
          console.log('🎵 AudioPlayer: Playing from audio element (backend TTS)');
          audioRef.current.playbackRate = playbackSpeed;
          await audioRef.current.play();
          setIsPlaying(true);
          setStartTime(Date.now());
          
          if (onUsageTracked) {
            onUsageTracked({ action: 'audio_started', success: true });
          }
        } else if ('speechSynthesis' in window) {
          // Fallback to browser TTS
          console.log('🔊 Using browser Speech Synthesis API');
          
          // Strip HTML tags and clean the text for TTS
          const cleanText = text
            .replace(/<[^>]*>/g, ' ')  // Remove HTML tags
            .replace(/&nbsp;/g, ' ')   // Replace &nbsp; with spaces
            .replace(/&amp;/g, '&')    // Replace &amp; with &
            .replace(/&lt;/g, '<')     // Replace &lt; with <
            .replace(/&gt;/g, '>')     // Replace &gt; with >
            .replace(/\s+/g, ' ')      // Replace multiple spaces with single space
            .trim();                   // Remove leading/trailing whitespace
          
          console.log('🔊 Original text:', text.substring(0, 100) + '...');
          console.log('🔊 Clean text to speak:', cleanText.substring(0, 100) + '...');
          console.log('🔊 Language:', language);
          console.log('🔊 Playback speed:', playbackSpeed);
          
          const utterance = new SpeechSynthesisUtterance(cleanText);
          utterance.rate = playbackSpeed * 0.9; // Slightly slower for better clarity
          utterance.pitch = 1.0; // Natural pitch (not too high to avoid robotic sound)
          utterance.volume = 0.9; // Slightly lower volume for comfort
          
          // Set high-quality, natural voice
          const voices = window.speechSynthesis.getVoices();
          console.log('🔊 Available voices:', voices.map(v => `${v.name} (${v.lang}) - ${v.localService ? 'Local' : 'Remote'}`));
          
          if (language === 'korean') {
            // Prefer high-quality Korean voices
            const koreanVoice = voices.find(voice => 
              voice.lang.startsWith('ko') && 
              (voice.name.includes('Premium') || voice.name.includes('Enhanced') || voice.name.includes('Neural'))
            ) || voices.find(voice => voice.lang.startsWith('ko') && voice.localService) 
              || voices.find(voice => voice.lang.startsWith('ko'));
            
            if (koreanVoice) {
              console.log('🔊 Selected Korean voice:', koreanVoice.name);
              utterance.voice = koreanVoice;
            }
          } else {
            // Prefer high-quality English voices - prioritize natural, premium voices
            const englishVoice = voices.find(voice => 
              voice.lang.startsWith('en') && 
              (voice.name.includes('Samantha') || voice.name.includes('Alex') || voice.name.includes('Ava'))
            ) || voices.find(voice => 
              voice.lang.startsWith('en') && 
              (voice.name.includes('Premium') || voice.name.includes('Enhanced') || voice.name.includes('Neural'))
            ) || voices.find(voice => 
              voice.lang.startsWith('en-US') && voice.localService
            ) || voices.find(voice => 
              voice.lang.startsWith('en') && voice.localService
            ) || voices.find(voice => voice.lang.startsWith('en'));
            
            if (englishVoice) {
              console.log('🔊 Selected English voice:', englishVoice.name);
              utterance.voice = englishVoice;
            }
          }
          
          utterance.onstart = () => {
            setIsPlaying(true);
            setStartTime(Date.now());
            if (onUsageTracked) {
              onUsageTracked({ action: 'browser_tts_started', success: true });
            }
          };
          
          utterance.onend = () => {
            setIsPlaying(false);
            setPlaybackProgress(0);
            if (startTime && onUsageTracked) {
              const duration = Date.now() - startTime;
              onUsageTracked({ action: 'browser_tts_completed', duration, success: true });
            }
            setStartTime(null);
          };
          
          utterance.onerror = (error) => {
            console.error('Browser TTS failed:', error);
            setIsPlaying(false);
            setError('Voice reader is having trouble. Try again! 🎵');
            if (onUsageTracked) {
              onUsageTracked({ action: 'browser_tts_failed', success: false });
            }
          };
          
          window.speechSynthesis.speak(utterance);
        } else {
          console.log('🎵 AudioPlayer: No speechSynthesis available');
          throw new Error('No TTS service available');
        }
      } catch (error) {
        console.error('🎵 AudioPlayer: Playback failed with error:', error);
        console.error('🎵 AudioPlayer: Error stack:', (error as Error)?.stack);
        const childFriendlyError = 'Oops! The audio player needs a moment. Try clicking again! 🎵';
        setError(childFriendlyError);
        
        if (onUsageTracked) {
          onUsageTracked({ action: 'audio_play_failed', success: false });
        }
      }
    }
  }, [isPlaying, enabled, loadAudio, playbackSpeed, startTime, onUsageTracked, text, language]);

  const toggleMute = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  }, [isMuted]);

  // Speed control handler
  const handleSpeedChange = useCallback((newSpeed: number) => {
    setPlaybackSpeed(newSpeed);
    if (audioRef.current) {
      audioRef.current.playbackRate = newSpeed;
    }
    
    if (onUsageTracked) {
      onUsageTracked({ action: 'speed_changed', success: true });
    }
  }, [onUsageTracked]);

  // Auto-play effect
  React.useEffect(() => {
    if (autoPlay && enabled && text && !isPlaying && !isLoading) {
      togglePlayback();
    }
  }, [autoPlay, enabled, text, isPlaying, isLoading, togglePlayback]);

  // Audio event handlers
  const handleAudioEnded = useCallback(() => {
    setIsPlaying(false);
    setPlaybackProgress(0);
    
    // Track completion
    if (startTime && onUsageTracked) {
      const duration = Date.now() - startTime;
      onUsageTracked({ action: 'audio_completed', duration, success: true });
    }
    setStartTime(null);
  }, [startTime, onUsageTracked]);

  const handleTimeUpdate = useCallback(() => {
    if (audioRef.current) {
      const progress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setPlaybackProgress(progress || 0);
    }
  }, []);

  if (!enabled) {
    return null;
  }

  // Child-safe controls with theme integration
  return (
    <div
      className="flex items-center gap-2 p-2 rounded-lg"
      style={{
        backgroundColor: `${theme.primary}20`,
        border: `1px solid ${theme.accent}40`
      }}
    >
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        onEnded={handleAudioEnded}
        onTimeUpdate={handleTimeUpdate}
        onError={() => setError('Audio playback error')}
      />

      {/* Large, child-friendly play button - 48x48px as specified */}
      <button
        onClick={togglePlayback}
        disabled={isLoading}
        className="h-12 w-12 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105"
        style={{
          backgroundColor: theme.primary,
          color: theme.text,
          fontSize: '18px',
          opacity: isLoading ? 0.6 : 1,
          cursor: isLoading ? 'not-allowed' : 'pointer',
          minWidth: '48px',
          minHeight: '48px'
        }}
        aria-label={isPlaying ? 'Pause audio' : 'Play audio'}
      >
        {isLoading ? (
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : isPlaying ? (
          <div className="flex gap-1">
            <div className="w-1 h-4 bg-white" />
            <div className="w-1 h-4 bg-white" />
          </div>
        ) : (
          <div
            className="w-0 h-0 border-l-4 border-r-0 border-t-2 border-b-2 border-transparent border-l-white ml-1"
            style={{ borderLeftColor: theme.text }}
          />
        )}
      </button>

      {/* Visual progress indicator */}
      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full transition-all duration-300 rounded-full"
          style={{
            backgroundColor: theme.accent,
            width: `${playbackProgress}%`
          }}
        />
      </div>

      {/* Speed control dropdown */}
      <select
        value={playbackSpeed}
        onChange={(e) => handleSpeedChange(parseFloat(e.target.value))}
        className="h-8 px-2 rounded text-xs border-none outline-none transition-all duration-200 hover:scale-105"
        style={{
          backgroundColor: theme.accent + '20',
          color: theme.text,
          fontSize: '12px'
        }}
        aria-label="Playback speed"
      >
        <option value={0.5}>0.5x</option>
        <option value={0.75}>0.75x</option>
        <option value={1.0}>1.0x</option>
        <option value={1.25}>1.25x</option>
        <option value={1.5}>1.5x</option>
      </select>

      {/* Child-friendly volume control */}
      <button
        onClick={toggleMute}
        className="h-8 w-8 rounded flex items-center justify-center transition-all duration-200 hover:scale-105"
        style={{
          backgroundColor: theme.accent + '20',
          color: theme.accent
        }}
        aria-label={isMuted ? 'Unmute audio' : 'Mute audio'}
      >
        {isMuted ? (
          <span style={{ fontSize: '16px' }}>🔇</span>
        ) : (
          <span style={{ fontSize: '16px' }}>🔊</span>
        )}
      </button>

      {/* Error display */}
      {error && (
        <div
          className="text-xs p-1 rounded"
          style={{
            backgroundColor: '#fee',
            color: '#c33',
            maxWidth: '120px'
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
};