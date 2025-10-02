import React, { useState, useRef, useEffect, useCallback, memo } from 'react';
import { AudioCacheService } from '../../services/AudioCacheService';
import { VoicePreferenceService } from '../../services/VoicePreferenceService';

interface ThemeStyle {
  primary: string;
  accent: string;
  text: string;
  background: string;
}

interface ProfessionalAudioPlayerProps {
  text: string;
  language: 'english' | 'korean';
  childSafe?: boolean;
  theme: ThemeStyle;
  enabled: boolean;
  autoPlay?: boolean;
  onUsageTracked?: (data: { action: string; duration?: number; success: boolean }) => void;
}

const ProfessionalAudioPlayerComponent: React.FC<ProfessionalAudioPlayerProps> = ({
  text,
  language,
  childSafe = true,
  theme,
  enabled,
  autoPlay = false,
  onUsageTracked
}) => {
  console.log('🎵 ProfessionalAudioPlayer rendered:', { enabled, textLength: text.length, language });
  // State management
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [playbackProgress, setPlaybackProgress] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceIndex, setSelectedVoiceIndex] = useState<number>(-1);
  const [currentUtterance, setCurrentUtterance] = useState<SpeechSynthesisUtterance | null>(null);
  const [showVoiceSelector, setShowVoiceSelector] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const cacheService = AudioCacheService.getInstance();

  // Initialize voices with proper loading and restore preference
  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      console.log('🎵 Loading voices, total available:', voices.length);

      const filteredVoices = voices.filter(voice =>
        language === 'korean' ? voice.lang.startsWith('ko') : voice.lang.startsWith('en')
      );
      console.log(`🎵 Filtered ${language} voices:`, filteredVoices.length);

      setAvailableVoices(filteredVoices);

      if (selectedVoiceIndex === -1 && filteredVoices.length > 0) {
        // Try to restore saved preference first
        const savedVoiceName = VoicePreferenceService.getPreference();

        if (savedVoiceName) {
          const savedIndex = filteredVoices.findIndex(v =>
            v.name.toLowerCase() === savedVoiceName.toLowerCase()
          );
          if (savedIndex !== -1) {
            console.log('🎵 Restored saved voice preference:', savedVoiceName);
            setSelectedVoiceIndex(savedIndex);
            return;
          }
        }

        // No saved preference - use best voice
        const bestVoiceIndex = findBestVoiceIndex(filteredVoices, language);
        setSelectedVoiceIndex(bestVoiceIndex);
        console.log('🎵 Auto-selected voice index:', bestVoiceIndex);
      }
    };

    // Load voices immediately
    loadVoices();

    // Also load when voices change (browser needs time to load them)
    window.speechSynthesis.onvoiceschanged = loadVoices;

    // Force voice loading for some browsers
    if (window.speechSynthesis.getVoices().length === 0) {
      console.log('🎵 No voices loaded yet, forcing voice loading...');
      setTimeout(loadVoices, 100);
      setTimeout(loadVoices, 500);
      setTimeout(loadVoices, 1000);
    }

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, [language, selectedVoiceIndex]);

  // Cleanup effect - stop audio when component unmounts
  useEffect(() => {
    return () => {
      console.log('🎵 Component cleanup - stopping all audio');
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      if (currentUtterance) {
        window.speechSynthesis.cancel();
      }
      window.speechSynthesis.cancel(); // Force stop all
    };
  }, [currentUtterance]);

  // Clean text for TTS
  const cleanTextForTTS = (rawText: string): string => {
    return rawText
      .replace(/<[^>]*>/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/\s+/g, ' ')
      .trim();
  };

  // Load audio with backend fallback
  const loadAudio = useCallback(async (forceRefresh = false) => {
    if (!enabled || !text.trim()) return;

    try {
      setIsLoading(true);
      setError(null);

      // Get selected voice name (simplified - no mapping needed!)
      const selectedVoice = availableVoices[selectedVoiceIndex];
      const voiceName = selectedVoice?.name.toLowerCase() || 'nova';

      // Check cache first (now includes voice in key)
      if (!forceRefresh) {
        const cached = cacheService.get(text, language, voiceName);
        if (cached && audioRef.current) {
          console.log('🔁 Using cached audio for voice:', voiceName);
          audioRef.current.src = cached;
          setIsLoading(false);
          return;
        }
      }

      // Try backend TTS (Azure OpenAI handles all languages automatically)
      try {
        const response = await fetch('http://localhost:3001/api/text-to-speech', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: cleanTextForTTS(text),
            voice: voiceName, // Azure OpenAI auto-detects language from text
            speed: playbackSpeed,
            childSafe
          })
        });

        if (response.ok) {
          const result = await response.json();
          if (result.success && result.audio && audioRef.current) {
            // Cache with voice included in key
            cacheService.set(text, language, voiceName, result.audio);
            audioRef.current.src = result.audio;
            console.log('✅ Audio loaded with voice:', voiceName);
            setIsLoading(false);
            return;
          }
        }
      } catch (backendError) {
        console.log('🎵 Backend TTS unavailable, will use browser TTS fallback');
      }

      // Browser TTS is handled in togglePlayback - this is normal
      setIsLoading(false);

    } catch (error) {
      console.error('🎵 Audio loading failed:', error);
      // Don't set error here - let browser TTS handle it
      setIsLoading(false);
    }
  }, [text, language, childSafe, enabled, playbackSpeed, availableVoices, selectedVoiceIndex]);

  // Auto-load audio when text changes (blend level adjustment)
  const prevTextRef = useRef<string>(text);
  useEffect(() => {
    const textChanged = prevTextRef.current !== text;

    if (textChanged && enabled && text.trim()) {
      console.log('🎵 Text changed (blend level adjusted), pre-loading new audio...');

      // Stop current playback
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      if (currentUtterance) {
        window.speechSynthesis.cancel();
        setCurrentUtterance(null);
      }

      // Reset playback state
      setIsPlaying(false);
      setPlaybackProgress(0);
      setStartTime(null);

      // Pre-load new audio in background
      loadAudio(true); // Force refresh for new text

      prevTextRef.current = text;
    }
  }, [text, enabled, loadAudio, currentUtterance]);

  // Find best voice automatically with enhanced quality detection
  const findBestVoiceIndex = (voices: SpeechSynthesisVoice[], lang: string): number => {
    console.log('🎵 Finding best voice for language:', lang);
    console.log('🎵 Available voices:', voices.map(v => `${v.name} (${v.lang}) - Local: ${v.localService}`));
    
    if (lang === 'korean') {
      // Korean voice priority: Neural > Premium > Enhanced > Local > Any
      const priorities = [
        (v: SpeechSynthesisVoice) => v.name.toLowerCase().includes('neural'),
        (v: SpeechSynthesisVoice) => v.name.toLowerCase().includes('premium'),
        (v: SpeechSynthesisVoice) => v.name.toLowerCase().includes('enhanced'),
        (v: SpeechSynthesisVoice) => v.name.toLowerCase().includes('yuna') || v.name.toLowerCase().includes('jihun'),
        (v: SpeechSynthesisVoice) => v.localService,
        () => true // fallback to any voice
      ];
      
      for (const priority of priorities) {
        const index = voices.findIndex(priority);
        if (index !== -1) {
          console.log('🎵 Selected Korean voice:', voices[index].name);
          return index;
        }
      }
    } else {
      // English voice priority: Natural names > Neural > Premium > Enhanced > Local > Any
      const priorities = [
        (v: SpeechSynthesisVoice) => v.name.toLowerCase().includes('samantha'),
        (v: SpeechSynthesisVoice) => v.name.toLowerCase().includes('alex'),
        (v: SpeechSynthesisVoice) => v.name.toLowerCase().includes('ava'),
        (v: SpeechSynthesisVoice) => v.name.toLowerCase().includes('karen'),
        (v: SpeechSynthesisVoice) => v.name.toLowerCase().includes('daniel'),
        (v: SpeechSynthesisVoice) => v.name.toLowerCase().includes('neural'),
        (v: SpeechSynthesisVoice) => v.name.toLowerCase().includes('premium'),
        (v: SpeechSynthesisVoice) => v.name.toLowerCase().includes('enhanced'),
        (v: SpeechSynthesisVoice) => v.name.toLowerCase().includes('natural'),
        (v: SpeechSynthesisVoice) => v.localService && v.lang.startsWith('en-US'),
        (v: SpeechSynthesisVoice) => v.localService,
        () => true // fallback to any voice
      ];
      
      for (const priority of priorities) {
        const index = voices.findIndex(priority);
        if (index !== -1) {
          console.log('🎵 Selected English voice:', voices[index].name);
          return index;
        }
      }
    }
    
    console.log('🎵 Using fallback voice (index 0)');
    return 0;
  };

  // Toggle playback
  const togglePlayback = useCallback(async () => {
    console.log('🎵 togglePlayback called:', { enabled, isPlaying, hasUtterance: !!currentUtterance });
    
    if (!enabled) {
      console.log('🎵 Audio not enabled, returning');
      return;
    }

    if (isPlaying) {
      console.log('🎵 FORCE STOPPING all audio...');
      
      // Stop backend audio aggressively
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current.src = ''; // Clear source
        audioRef.current.load(); // Reset element
        console.log('🎵 Backend audio FORCE STOPPED');
      }
      
      // Stop browser TTS aggressively
      if (currentUtterance) {
        window.speechSynthesis.cancel();
        setCurrentUtterance(null);
        console.log('🎵 Current utterance cancelled');
      }
      
      // Multiple force stops for browser TTS (some browsers need this)
      window.speechSynthesis.cancel();
      setTimeout(() => window.speechSynthesis.cancel(), 10);
      setTimeout(() => window.speechSynthesis.cancel(), 50);
      
      // Reset all state immediately
      setIsPlaying(false);
      setPlaybackProgress(0);
      setStartTime(null);
      setIsLoading(false);
      setError(null);
      
      console.log('🎵 ALL AUDIO FORCE STOPPED');
    } else {
      try {
        setIsLoading(true);
        
        // Try backend audio first (force refresh if no src to ensure fresh audio)
        if (!audioRef.current?.src) {
          await loadAudio(true); // Force refresh for new playback
        }

        if (audioRef.current?.src) {
          // Backend TTS
          audioRef.current.playbackRate = playbackSpeed;
          await audioRef.current.play();
          setIsPlaying(true);
          setStartTime(Date.now());
        } else if ('speechSynthesis' in window && availableVoices.length > 0) {
          // Browser TTS fallback
          console.log('🎵 Using browser Speech Synthesis API');
          console.log('🎵 Available voices for', language + ':', availableVoices.length);
          console.log('🎵 Selected voice index:', selectedVoiceIndex);
          
          const cleanText = cleanTextForTTS(text);
          const utterance = new SpeechSynthesisUtterance(cleanText);
          
          utterance.rate = playbackSpeed * 0.9;
          utterance.pitch = 1.0;
          utterance.volume = 0.9;
          
          if (selectedVoiceIndex >= 0 && availableVoices[selectedVoiceIndex]) {
            utterance.voice = availableVoices[selectedVoiceIndex];
            console.log('🎵 Selected', language, 'voice:', availableVoices[selectedVoiceIndex].name);
          } else {
            console.log('🎵 No voice selected, using default');
          }

          utterance.onstart = () => {
            setIsPlaying(true);
            setStartTime(Date.now());
            setIsLoading(false);
          };

          utterance.onend = () => {
            setIsPlaying(false);
            setPlaybackProgress(0);
            setCurrentUtterance(null);
            setStartTime(null);
          };

          utterance.onerror = () => {
            setIsPlaying(false);
            setError('Voice playback failed');
            setCurrentUtterance(null);
            setIsLoading(false);
          };

          setCurrentUtterance(utterance);
          window.speechSynthesis.speak(utterance);
          console.log('🎵 Speech synthesis started');
        } else if ('speechSynthesis' in window) {
          // Voices not loaded yet, try to wait and retry
          console.log('🎵 Voices not loaded yet, waiting...');
          setError('Loading voices, please try again in a moment...');
          setIsLoading(false);
          
          // Try to load voices and retry after a short delay
          setTimeout(() => {
            const voices = window.speechSynthesis.getVoices();
            if (voices.length > 0) {
              console.log('🎵 Voices now available, retrying...');
              setError(null);
              // Trigger voice loading
              const filteredVoices = voices.filter(voice => 
                language === 'korean' ? voice.lang.startsWith('ko') : voice.lang.startsWith('en')
              );
              setAvailableVoices(filteredVoices);
              if (filteredVoices.length > 0 && selectedVoiceIndex === -1) {
                const bestVoiceIndex = findBestVoiceIndex(filteredVoices, language);
                setSelectedVoiceIndex(bestVoiceIndex);
              }
            }
          }, 1000);
        } else {
          throw new Error('No TTS service available');
        }
      } catch (error) {
        setError('Audio playback failed');
        setIsLoading(false);
      }
    }
  }, [isPlaying, enabled, loadAudio, playbackSpeed, text, availableVoices, selectedVoiceIndex, currentUtterance]);

  // Handle voice selection with complete reset and pre-load
  const handleVoiceChange = async (voiceIndex: number) => {
    console.log('🎵 Voice changed from', selectedVoiceIndex, 'to', voiceIndex);

    // FORCE STOP ALL AUDIO IMMEDIATELY
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.src = '';
      audioRef.current.load();
    }
    if (currentUtterance) {
      window.speechSynthesis.cancel();
      setCurrentUtterance(null);
    }
    window.speechSynthesis.cancel();
    setTimeout(() => window.speechSynthesis.cancel(), 10);

    // RESET ALL STATE COMPLETELY
    setIsPlaying(false);
    setPlaybackProgress(0);
    setStartTime(null);

    // UPDATE VOICE SELECTION
    const newVoice = availableVoices[voiceIndex];
    setSelectedVoiceIndex(voiceIndex);
    setShowVoiceSelector(false);

    // SAVE PREFERENCE
    VoicePreferenceService.setPreference(newVoice.name);

    // PRE-LOAD AUDIO WITH NEW VOICE
    setIsLoading(true);
    try {
      await loadAudio(true); // Force refresh with new voice
      setIsLoading(false);
      setError('Voice changed - click play to hear ' + newVoice.name);
      // Clear success message after 3 seconds
      setTimeout(() => setError(null), 3000);
    } catch (error) {
      setIsLoading(false);
      setError('Failed to load audio with new voice');
    }

    console.log('🎵 Voice change complete - audio pre-loaded with new voice');

    if (onUsageTracked) {
      onUsageTracked({
        action: 'voice_changed',
        success: true
      });
    }
  };

  // Handle speed change
  const handleSpeedChange = (newSpeed: number) => {
    setPlaybackSpeed(newSpeed);
    if (audioRef.current) {
      audioRef.current.playbackRate = newSpeed;
    }
  };

  if (!enabled) return null;

  const selectedVoice = availableVoices[selectedVoiceIndex];

  return (
    <div className="professional-audio-player">
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        onTimeUpdate={() => {
          if (audioRef.current) {
            const progress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
            setPlaybackProgress(progress || 0);
          }
        }}
        onEnded={() => {
          setIsPlaying(false);
          setPlaybackProgress(0);
          setStartTime(null);
        }}
      />

      {/* Main Player Container */}
      <div 
        className="audio-player-container"
        style={{
          background: `linear-gradient(135deg, ${theme.primary}15, ${theme.accent}10)`,
          border: `1px solid ${theme.accent}30`,
          borderRadius: '16px',
          padding: '20px',
          backdropFilter: 'blur(10px)',
          boxShadow: `0 8px 32px ${theme.primary}20`,
          marginBottom: '16px'
        }}
      >
        {/* Top Row: Play Button + Progress + Voice Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
          
          {/* Professional Play Button */}
          <button
            onClick={togglePlayback}
            disabled={isLoading}
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              border: 'none',
              background: isLoading 
                ? `linear-gradient(135deg, ${theme.accent}60, ${theme.primary}60)`
                : `linear-gradient(135deg, ${theme.accent}, ${theme.primary})`,
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: isLoading ? 'none' : `0 4px 16px ${theme.accent}40`,
              transform: isLoading ? 'scale(0.95)' : 'scale(1)',
            }}
            onMouseEnter={(e) => {
              if (!isLoading) {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = `0 6px 20px ${theme.accent}50`;
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoading) {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = `0 4px 16px ${theme.accent}40`;
              }
            }}
          >
            {isLoading ? (
              <div 
                style={{
                  width: '20px',
                  height: '20px',
                  border: '2px solid white',
                  borderTop: '2px solid transparent',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }}
              />
            ) : isPlaying ? (
              <div style={{ display: 'flex', gap: '3px' }}>
                <div style={{ width: '4px', height: '16px', backgroundColor: 'white', borderRadius: '2px' }} />
                <div style={{ width: '4px', height: '16px', backgroundColor: 'white', borderRadius: '2px' }} />
              </div>
            ) : (
              <div 
                style={{
                  width: '0',
                  height: '0',
                  borderLeft: '12px solid white',
                  borderTop: '8px solid transparent',
                  borderBottom: '8px solid transparent',
                  marginLeft: '3px'
                }}
              />
            )}
          </button>

          {/* Progress Bar */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div 
              style={{
                height: '6px',
                backgroundColor: `${theme.accent}20`,
                borderRadius: '3px',
                overflow: 'hidden',
                position: 'relative'
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${playbackProgress}%`,
                  background: `linear-gradient(90deg, ${theme.accent}, ${theme.primary})`,
                  borderRadius: '3px',
                  transition: 'width 0.3s ease'
                }}
              />
            </div>
            
            {/* Voice Info */}
            <div style={{ 
              fontSize: '12px', 
              color: theme.text + '80',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span>
                🎵 {selectedVoice ? selectedVoice.name : 'Default Voice'}
                {selectedVoice?.localService && ' (Premium)'}
              </span>
              <span>{playbackSpeed}x speed</span>
            </div>
          </div>

          {/* Voice Selector Button */}
          <button
            onClick={() => setShowVoiceSelector(!showVoiceSelector)}
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              border: `1px solid ${theme.accent}40`,
              background: showVoiceSelector ? theme.accent + '20' : 'transparent',
              color: theme.text,
              cursor: 'pointer',
              fontSize: '12px',
              transition: 'all 0.2s ease'
            }}
          >
            🎙️ Voice
          </button>
        </div>

        {/* Voice Selector Dropdown */}
        {showVoiceSelector && (
          <div 
            style={{
              background: theme.background,
              border: `1px solid ${theme.accent}40`,
              borderRadius: '12px',
              padding: '12px',
              marginBottom: '12px',
              maxHeight: '200px',
              overflowY: 'auto'
            }}
          >
            <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: theme.text }}>
              Select Voice ({availableVoices.length} available)
            </div>
            {availableVoices.map((voice, index) => (
              <button
                key={index}
                onClick={() => handleVoiceChange(index)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  marginBottom: '4px',
                  borderRadius: '6px',
                  border: 'none',
                  background: selectedVoiceIndex === index ? theme.accent + '30' : 'transparent',
                  color: theme.text,
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontSize: '12px',
                  transition: 'background 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  if (selectedVoiceIndex !== index) {
                    e.currentTarget.style.background = theme.accent + '15';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedVoiceIndex !== index) {
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                <div style={{ fontWeight: '500' }}>{voice.name}</div>
                <div style={{ fontSize: '10px', opacity: 0.7 }}>
                  {voice.lang} • {voice.localService ? 'Local' : 'Remote'}
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Bottom Row: Speed Control + Error Display */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          
          {/* Speed Control */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '12px', color: theme.text + '80' }}>Speed:</span>
            {[0.5, 0.75, 1.0, 1.25, 1.5].map(speed => (
              <button
                key={speed}
                onClick={() => handleSpeedChange(speed)}
                style={{
                  padding: '4px 8px',
                  borderRadius: '4px',
                  border: 'none',
                  background: playbackSpeed === speed ? theme.accent : theme.accent + '20',
                  color: playbackSpeed === speed ? 'white' : theme.text,
                  cursor: 'pointer',
                  fontSize: '10px',
                  transition: 'all 0.2s ease'
                }}
              >
                {speed}x
              </button>
            ))}
          </div>

          {/* Error Display */}
          {error && (
            <div style={{
              padding: '6px 12px',
              borderRadius: '6px',
              background: '#fee',
              color: '#c33',
              fontSize: '11px',
              border: '1px solid #fcc'
            }}>
              ⚠️ {error}
            </div>
          )}
        </div>
      </div>

      {/* CSS Animation */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

// Memoized export to reduce re-renders
export const ProfessionalAudioPlayer = memo(ProfessionalAudioPlayerComponent);
export default ProfessionalAudioPlayer;
