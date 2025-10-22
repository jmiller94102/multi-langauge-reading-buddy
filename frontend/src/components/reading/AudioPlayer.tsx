import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/common/Button';

export interface WordTiming {
  word: string;
  startTime: number;
  endTime: number;
}

interface AudioPlayerProps {
  audioUrl: string;
  wordTimings: WordTiming[];
  duration: number;
  onWordChange?: (wordIndex: number) => void;
  className?: string;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  audioUrl,
  wordTimings,
  duration,
  onWordChange,
  className = '',
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [timingOffset, setTimingOffset] = useState(0); // Timing adjustment in seconds (-2 to +2)
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Speed options
  const speedOptions = [0.75, 1.0, 1.25, 1.5];

  // Initialize audio element
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(audioUrl);
      audioRef.current.playbackRate = playbackSpeed;

      // Event listeners
      audioRef.current.addEventListener('loadeddata', () => {
        setIsLoading(false);
      });

      audioRef.current.addEventListener('error', () => {
        setError('Failed to load audio');
        setIsLoading(false);
      });

      audioRef.current.addEventListener('ended', () => {
        setIsPlaying(false);
        setCurrentTime(0);
        setCurrentWordIndex(-1);
      });

      audioRef.current.addEventListener('timeupdate', () => {
        if (audioRef.current) {
          setCurrentTime(audioRef.current.currentTime);
        }
      });
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [audioUrl, playbackSpeed]);

  // Update current word based on playback time
  useEffect(() => {
    // Apply timing offset to sync highlighting with audio
    // Positive offset = highlighting appears LATER (slows down)
    // Negative offset = highlighting appears EARLIER (speeds up)
    const adjustedTime = currentTime - timingOffset;
    const wordIndex = wordTimings.findIndex(
      (timing) => adjustedTime >= timing.startTime && adjustedTime < timing.endTime
    );

    if (wordIndex !== currentWordIndex) {
      setCurrentWordIndex(wordIndex);
      if (onWordChange && wordIndex !== -1) {
        onWordChange(wordIndex);
      }
    }
  }, [currentTime, wordTimings, currentWordIndex, onWordChange, timingOffset]);

  // Play/Pause
  const togglePlayPause = useCallback(() => {
    if (!audioRef.current || isLoading) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch((err) => {
        console.error('Playback error:', err);
        setError('Failed to play audio');
      });
      setIsPlaying(true);
    }
  }, [isPlaying, isLoading]);

  // Change playback speed
  const changeSpeed = useCallback((speed: number) => {
    setPlaybackSpeed(speed);
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
    }
  }, []);

  // Skip forward/backward
  const skip = useCallback((seconds: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = Math.max(0, Math.min(duration, audioRef.current.currentTime + seconds));
  }, [duration]);

  // Seek to specific time
  const seek = useCallback((time: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = time;
  }, []);

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate progress percentage
  const progress = (currentTime / duration) * 100;

  if (error) {
    return (
      <div className={`card p-4 bg-red-50 border-red-200 ${className}`}>
        <p className="text-child-sm text-red-600 text-center">⚠️ {error}</p>
      </div>
    );
  }

  return (
    <div className={`card p-4 space-y-3 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-child-md font-bold text-gray-900 flex items-center gap-2">
          <span>🔊</span>
          Audio Player
        </h3>
        <span className="text-child-xs text-gray-600">
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="relative">
        <input
          type="range"
          min={0}
          max={duration}
          value={currentTime}
          onChange={(e) => seek(parseFloat(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-primary-500"
          style={{
            background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${progress}%, #e5e7eb ${progress}%, #e5e7eb 100%)`,
          }}
          disabled={isLoading}
        />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between gap-2">
        {/* Playback Controls */}
        <div className="flex items-center gap-2">
          {/* Skip Backward */}
          <button
            onClick={() => skip(-5)}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50"
            disabled={isLoading}
            aria-label="Skip backward 5 seconds"
          >
            <span className="text-lg">⏪</span>
          </button>

          {/* Play/Pause */}
          <Button
            onClick={togglePlayPause}
            disabled={isLoading}
            className="bg-primary-500 hover:bg-primary-600 text-white rounded-full p-3 min-w-0"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            <span className="text-2xl">{isLoading ? '⏳' : isPlaying ? '⏸️' : '▶️'}</span>
          </Button>

          {/* Skip Forward */}
          <button
            onClick={() => skip(5)}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50"
            disabled={isLoading}
            aria-label="Skip forward 5 seconds"
          >
            <span className="text-lg">⏩</span>
          </button>
        </div>

        {/* Speed Controls */}
        <div className="flex items-center gap-1">
          <span className="text-child-xs text-gray-600 mr-1">Speed:</span>
          {speedOptions.map((speed) => (
            <button
              key={speed}
              onClick={() => changeSpeed(speed)}
              className={`px-2 py-1 rounded text-child-xs font-semibold transition-colors ${
                playbackSpeed === speed
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              disabled={isLoading}
            >
              {speed}x
            </button>
          ))}
        </div>
      </div>

      {/* Highlighted Word Speed Adjustment */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <label htmlFor="timing-offset" className="text-child-xs text-gray-700 font-semibold">
            Highlighted Word Speed:
          </label>
          <span className="text-child-xs text-gray-600 font-mono">
            {timingOffset > 0 ? '+' : ''}{(timingOffset * 1000).toFixed(0)}ms
          </span>
        </div>
        <input
          id="timing-offset"
          type="range"
          min={-2}
          max={2}
          step={0.05}
          value={timingOffset}
          onChange={(e) => setTimingOffset(parseFloat(e.target.value))}
          className="w-full h-1.5 bg-gray-200 rounded-full appearance-none cursor-pointer accent-accent-500"
          disabled={isLoading}
          aria-label="Adjust highlighted word speed"
        />
        <div className="flex justify-between text-[10px] text-gray-500">
          <span>Faster</span>
          <span>Perfect</span>
          <span>Slower</span>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center">
          <p className="text-child-sm text-gray-600">Loading audio...</p>
        </div>
      )}
    </div>
  );
};
