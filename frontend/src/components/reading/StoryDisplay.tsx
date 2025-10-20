import React, { useState, useEffect } from 'react';
import { Button } from '@/components/common/Button';
import type { Story, BlendedWord } from '@/types/story';

interface StoryDisplayProps {
  story: Story;
  onFinish: () => void;
  currentBlendLevel?: number; // Real-time blend level (0-10)
  showHints?: boolean; // Real-time hint toggle
  showRomanization?: boolean; // Real-time romanization toggle
}

export const StoryDisplay: React.FC<StoryDisplayProps> = ({
  story,
  onFinish,
  currentBlendLevel = 4,
  showHints = true,
  showRomanization = true,
}) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [wordsRead, setWordsRead] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);

  useEffect(() => {
    const handleScroll = (e: Event) => {
      const target = e.target as HTMLDivElement;
      const scrollTop = target.scrollTop || 0;
      const scrollHeight = target.scrollHeight || 1;
      const clientHeight = target.clientHeight || 1;
      const scrollPercentage = (scrollTop / (scrollHeight - clientHeight)) * 100;
      setScrollProgress(Math.min(100, Math.max(0, scrollPercentage)));

      // Estimate words read based on scroll position
      const estimatedWords = Math.floor((scrollPercentage / 100) * story.wordCount);
      setWordsRead(estimatedWords);
    };

    const container = document.getElementById('story-content');
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [story.wordCount]);

  const handlePlayPause = () => {
    // TODO: Implement audio playback in Phase 8 (BONUS)
    setIsPlaying(!isPlaying);
    alert('Audio playback coming soon in Phase 8!');
  };

  const handleSpeedChange = () => {
    const speeds = [0.75, 1.0, 1.25, 1.5];
    const currentIndex = speeds.indexOf(playbackSpeed);
    const nextSpeed = speeds[(currentIndex + 1) % speeds.length] || 1.0;
    setPlaybackSpeed(nextSpeed);
  };

  const renderBlendedText = (content: string, blendedWords: BlendedWord[]) => {
    if (blendedWords.length === 0) {
      return <span>{content}</span>;
    }

    // Calculate which words to show based on blend level (0 = show all, 10 = show none)
    const wordsToShow = Math.max(0, Math.ceil(blendedWords.length * (1 - currentBlendLevel / 10)));

    let lastIndex = 0;
    const parts: React.ReactNode[] = [];

    blendedWords.forEach((word, idx) => {
      const wordIndex = content.indexOf(word.text, lastIndex);
      if (wordIndex !== -1) {
        // Add text before the blended word
        if (wordIndex > lastIndex) {
          parts.push(<span key={`text-${idx}`}>{content.substring(lastIndex, wordIndex)}</span>);
        }

        // Determine if this word should have visible hints based on blend level
        const shouldShowWordHints = idx < wordsToShow;

        // Add the blended word with styling and tooltip
        parts.push(
          <span
            key={`word-${idx}`}
            className={`font-bold ${shouldShowWordHints ? 'text-primary-700' : 'text-gray-900'} cursor-help hover:text-primary-900 transition-colors relative group`}
            title={`${word.translation}${word.romanization ? ` (${word.romanization})` : ''}`}
          >
            {word.text}
            {showHints && shouldShowWordHints && (
              <span className="text-gray-600 font-normal text-[13px]"> ({word.translation})</span>
            )}
            {showRomanization && word.romanization && !showHints && shouldShowWordHints && (
              <span className="text-[11px] text-gray-500 font-normal"> ({word.romanization})</span>
            )}
          </span>
        );

        lastIndex = wordIndex + word.text.length;
      }
    });

    // Add remaining text
    if (lastIndex < content.length) {
      parts.push(<span key="text-end">{content.substring(lastIndex)}</span>);
    }

    return <>{parts}</>;
  };

  const estimatedTimeRemaining = Math.ceil(((story.wordCount - wordsRead) / 200) * 60); // Assuming 200 WPM

  return (
    <div className="space-y-3">
      {/* Story Header */}
      <div className="card py-3 px-4 space-y-3">
        <div className="border-b-2 border-gray-200 pb-2">
          <h2 className="text-child-lg font-bold text-gray-900 mb-1">
            📖 {story.title}
          </h2>
          <p className="text-[11px] text-gray-600">
            {story.wordCount} words • {story.settings.gradeLevel} Grade • {story.languageSettings.blendLevel * 10}% {story.languageSettings.secondaryLanguage === 'ko' ? 'Korean' : 'Mandarin'}
          </p>
        </div>

        {/* Audio Controls */}
        <div>
          <p className="text-child-sm font-semibold text-gray-700 mb-2">Controls:</p>
          <div className="grid grid-cols-4 gap-2">
            <Button
              variant="outline"
              size="small"
              onClick={handlePlayPause}
              className="flex-col h-auto py-2"
              aria-label={isPlaying ? 'Pause audio' : 'Play audio'}
            >
              <span className="text-lg mb-0.5" aria-hidden="true">
                {isPlaying ? '⏸️' : '▶️'}
              </span>
              <span className="text-[10px] font-semibold">
                {isPlaying ? 'Pause' : 'Play'}
              </span>
            </Button>

            <Button
              variant="outline"
              size="small"
              onClick={() => alert('Read aloud feature coming soon!')}
              className="flex-col h-auto py-2"
              aria-label="Read aloud"
            >
              <span className="text-lg mb-0.5" aria-hidden="true">🎧</span>
              <span className="text-[10px] font-semibold">Read</span>
            </Button>

            <Button
              variant="outline"
              size="small"
              onClick={handleSpeedChange}
              className="flex-col h-auto py-2"
              aria-label={`Playback speed ${playbackSpeed}x`}
            >
              <span className="text-lg mb-0.5" aria-hidden="true">📊</span>
              <span className="text-[10px] font-semibold">{playbackSpeed}x</span>
            </Button>

            <div className="flex flex-col items-center justify-center bg-primary-50 rounded px-2 py-1">
              <div className="text-[9px] text-primary-700 font-semibold">Level {currentBlendLevel}</div>
              <div className="text-[8px] text-gray-600">
                {showHints && '✓ Hints'}
                {!showHints && showRomanization && '✓ Roman'}
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-[11px] font-semibold text-gray-700">Progress:</span>
            <span className="text-[11px] font-bold text-gray-900">{Math.round(scrollProgress)}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary-500 to-accent-500 transition-all duration-300"
              style={{ width: `${scrollProgress}%` }}
              role="progressbar"
              aria-valuenow={scrollProgress}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Reading progress"
            />
          </div>
        </div>
      </div>

      {/* Story Content */}
      <div className="card py-4 px-4">
        <div
          id="story-content"
          className="prose max-w-none overflow-y-auto max-h-[500px] pr-2"
          style={{ scrollbarWidth: 'thin' }}
        >
          {story.paragraphs.map((paragraph) => (
            <p key={paragraph.id} className="text-child-base leading-relaxed mb-4 text-gray-900">
              {renderBlendedText(paragraph.content, paragraph.blendedWords)}
            </p>
          ))}
        </div>

        {/* Reading Stats */}
        <div className="border-t-2 border-gray-200 mt-4 pt-3 space-y-2">
          <div className="flex justify-between text-[11px] text-gray-600">
            <span>Words Read: {wordsRead} / {story.wordCount}</span>
            <span>~{estimatedTimeRemaining}s remaining</span>
          </div>
        </div>

        {/* Finish Button */}
        {scrollProgress >= 80 && (
          <div className="mt-3">
            <Button
              variant="primary"
              size="large"
              onClick={onFinish}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-lg"
              aria-label="Finish reading and take quiz"
            >
              <span className="text-child-base font-bold flex items-center justify-center gap-2">
                <span aria-hidden="true">✅</span>
                <span>Finished Reading? Take Quiz →</span>
              </span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
