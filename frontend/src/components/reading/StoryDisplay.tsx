import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/common/Button';
import type { Story } from '@/types/story';
import { blendSentences } from '@/utils/languageBlending';
import { AudioPlayer, type WordTiming } from '@/components/reading/AudioPlayer';
import { HighlightedText } from '@/components/reading/HighlightedText';
import { generateAudio, type AudioData } from '@/services/azureOpenAI';
import { useStory } from '@/contexts/StoryContext';

interface StoryDisplayProps {
  story: Story;
  onFinish: () => void;
  onGenerateNew?: () => void; // Navigate to prompt/generation screen
  onSaveStory?: () => void; // Save current story to library
  currentBlendLevel?: number; // Real-time blend level (0-4: 5-level system)
  showHints?: boolean; // Real-time hint toggle
  showRomanization?: boolean; // Real-time romanization toggle
}

export const StoryDisplay: React.FC<StoryDisplayProps> = ({
  story,
  onFinish,
  onGenerateNew,
  onSaveStory,
  currentBlendLevel = 2,
  showHints = true,
  showRomanization = true,
}) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [wordsRead, setWordsRead] = useState(0);

  // Get audio data from context (persists across navigation)
  const { currentAudioData: audioData, setCurrentAudioData: setAudioData } = useStory();

  // Audio generation state (local to component)
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);
  const [generationProgress, setGenerationProgress] = useState<string>('');

  // Real-time sentence blending based on current blend level
  const blendedContent = useMemo(() => {
    if (!story.primarySentences || story.primarySentences.length === 0) {
      // Fallback to legacy paragraph rendering if sentence arrays not available
      return null;
    }

    return blendSentences(
      story.primarySentences,
      story.secondarySentences || story.primarySentences,
      currentBlendLevel,
      story.vocabulary
    );
  }, [story.primarySentences, story.secondarySentences, currentBlendLevel, story.vocabulary]);

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

  // Generate audio from story content
  const handleGenerateAudio = async () => {
    setIsGeneratingAudio(true);
    setAudioError(null);

    try {
      // Progressive feedback - makes wait time feel shorter
      setGenerationProgress('Preparing your narrator...');

      setTimeout(() => setGenerationProgress('Generating speech...'), 1000);
      setTimeout(() => setGenerationProgress('Processing audio...'), 3000);
      setTimeout(() => setGenerationProgress('Almost ready...'), 5000);

      // Get secondary language text (Korean/Mandarin) for pronunciation practice
      // Kids already know English - they need to HEAR the target language!
      // Filter out paragraph break markers before joining
      const fullText = story.secondarySentences && story.secondarySentences.length > 0
        ? story.secondarySentences.filter(s => s !== '__PARAGRAPH_BREAK__').join(' ')
        : story.primarySentences?.filter(s => s !== '__PARAGRAPH_BREAK__').join(' ') || story.paragraphs?.map(p => p.content).join(' ') || '';

      // Choose voice based on language for better pronunciation
      const voice = story.languageSettings.secondaryLanguage === 'ko' ? 'nova' : 'shimmer';

      // Generate audio with OpenAI TTS (multilingual voices support Korean/Mandarin)
      const data = await generateAudio(fullText, voice, 1.0);
      setAudioData(data);
      setGenerationProgress('');
    } catch (error) {
      console.error('Failed to generate audio:', error);
      setAudioError(error instanceof Error ? error.message : 'Failed to generate audio');
      setGenerationProgress('');
    } finally {
      setIsGeneratingAudio(false);
    }
  };

  // Handle word change during audio playback
  const handleWordChange = (wordIndex: number) => {
    setCurrentWordIndex(wordIndex);
  };

  // Render a single sentence with vocabulary hints
  const renderSentence = (text: string, language: 'primary' | 'secondary', sentenceShowHints: boolean, idx: number) => {
    // For primary language with hints (Level 1), parse markdown-style replacements
    if (language === 'primary' && sentenceShowHints && showHints) {
      const parts: React.ReactNode[] = [];
      // Match pattern: **translation (english)**
      const regex = /\*\*([^(]+)\(([^)]+)\)\*\*/g;
      let lastIndex = 0;
      let match;
      let partIndex = 0;

      while ((match = regex.exec(text)) !== null) {
        // Add text before the match
        if (match.index > lastIndex) {
          parts.push(
            <span key={`text-${idx}-${partIndex++}`}>
              {text.substring(lastIndex, match.index)}
            </span>
          );
        }

        // Add the matched word with hint
        const translation = match[1]?.trim() || '';
        const english = match[2]?.trim() || '';
        parts.push(
          <span
            key={`word-${idx}-${partIndex++}`}
            className="font-semibold text-primary-700 cursor-help hover:text-primary-900"
            title={`💡 ${translation}`}
          >
            {translation}
            <span className="text-gray-600 font-normal text-[12px] ml-1">({english})</span>
          </span>
        );

        lastIndex = regex.lastIndex;
      }

      // Add remaining text after last match
      if (lastIndex < text.length) {
        parts.push(
          <span key={`text-end-${idx}`}>
            {text.substring(lastIndex)}
          </span>
        );
      }

      // If no matches were found, just return plain text
      if (parts.length === 0) {
        return <span>{text}</span>;
      }

      return <>{parts}</>;
    }

    // For secondary language sentences, add hints for vocabulary words
    if (language === 'secondary' && sentenceShowHints && showHints && story.vocabularyMap) {
      const parts: React.ReactNode[] = [];
      const words = text.split(/\s+/);
      let currentText = '';

      words.forEach((word, wordIdx) => {
        const cleanWord = word.toLowerCase().replace(/[.,!?;:]/g, '');
        const vocab = story.vocabularyMap?.[cleanWord];

        if (vocab && showHints) {
          // Flush any accumulated text
          if (currentText) {
            parts.push(<span key={`text-${idx}-${wordIdx}`}>{currentText} </span>);
            currentText = '';
          }

          // Add word with hint
          parts.push(
            <span
              key={`word-${idx}-${wordIdx}`}
              className="font-semibold text-primary-700 cursor-help hover:text-primary-900"
              title={vocab.translation + (vocab.romanization ? ` (${vocab.romanization})` : '')}
            >
              {word}
              <span className="text-gray-600 font-normal text-[12px] ml-1">({vocab.translation})</span>
              {' '}
            </span>
          );
        } else {
          currentText += (currentText ? ' ' : '') + word;
        }
      });

      // Flush remaining text
      if (currentText) {
        parts.push(<span key={`text-end-${idx}`}>{currentText}</span>);
      }

      return <>{parts}</>;
    }

    // For primary language or no hints, just return plain text
    return <span>{text}</span>;
  };

  const estimatedTimeRemaining = Math.ceil(((story.wordCount - wordsRead) / 200) * 60); // Assuming 200 WPM

  return (
    <div className="space-y-3">
      {/* Story Header with Action Buttons */}
      <div className="card py-3 px-4 space-y-3">
        <div className="border-b-2 border-gray-200 pb-2">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex-1">
              <h2 className="text-child-lg font-bold text-gray-900 mb-1">
                📖 {story.title}
              </h2>
              <p className="text-[11px] text-gray-600">
                {story.wordCount} words • {story.settings.gradeLevel} Grade • Level {currentBlendLevel} ({story.languageSettings.secondaryLanguage === 'ko' ? 'Korean' : 'Mandarin'})
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              {onSaveStory && (
                <Button
                  variant="outline"
                  size="small"
                  onClick={onSaveStory}
                  className="flex items-center gap-1"
                  aria-label="Save story to library"
                >
                  <span className="text-base" aria-hidden="true">💾</span>
                  <span className="text-[11px] font-semibold">Save Story</span>
                </Button>
              )}
              {onGenerateNew && (
                <Button
                  variant="primary"
                  size="small"
                  onClick={onGenerateNew}
                  className="flex items-center gap-1"
                  aria-label="Generate new story"
                >
                  <span className="text-base" aria-hidden="true">✨</span>
                  <span className="text-[11px] font-semibold">New Story</span>
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Audio Controls */}
        {!audioData && (
          <div>
            <p className="text-child-sm font-semibold text-gray-700 mb-2">Listen to Story:</p>
            <Button
              variant="primary"
              size="medium"
              onClick={handleGenerateAudio}
              disabled={isGeneratingAudio}
              className="w-full"
              aria-label="Generate audio narration"
            >
              {isGeneratingAudio ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin">⏳</span>
                  <span className="text-child-sm">{generationProgress || 'Generating Audio...'}</span>
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <span aria-hidden="true">🎧</span>
                  <span className="text-child-sm font-bold">Listen to Story</span>
                </span>
              )}
            </Button>
            {audioError && (
              <p className="text-child-xs text-red-600 mt-2">⚠️ {audioError}</p>
            )}
          </div>
        )}

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

      {/* Audio Player */}
      {audioData && (
        <AudioPlayer
          audioUrl={audioData.audioUrl}
          wordTimings={audioData.wordTimings}
          duration={audioData.duration}
          onWordChange={handleWordChange}
        />
      )}

      {/* Audio Mode Notice */}
      {audioData && currentWordIndex !== -1 && currentBlendLevel !== 4 && (
        <div className="card py-2 px-3 bg-blue-50 border border-blue-300">
          <p className="text-child-xs text-blue-700">
            💡 <strong>Tip:</strong> Word highlighting works best at Blend Level 4 (100% {story.languageSettings.secondaryLanguage === 'ko' ? 'Korean' : 'Mandarin'}).
            You can adjust the slider in the sidebar for more/less English support while listening.
          </p>
        </div>
      )}

      {/* Story Content */}
      <div className="card py-4 px-4">
        <div
          id="story-content"
          className="prose max-w-none overflow-y-auto max-h-[500px] pr-2"
          style={{ scrollbarWidth: 'thin' }}
        >
          {audioData && currentWordIndex !== -1 && currentBlendLevel === 4 ? (
            // AUDIO MODE (BLEND LEVEL 4 ONLY): Show secondary language with word highlighting
            // At level 4 (100% secondary), word highlighting syncs perfectly with audio
            // Filter out paragraph break markers before displaying
            <div className="space-y-4">
              <HighlightedText
                text={story.secondarySentences && story.secondarySentences.length > 0
                  ? story.secondarySentences.filter(s => s !== '__PARAGRAPH_BREAK__').join(' ')
                  : story.primarySentences?.filter(s => s !== '__PARAGRAPH_BREAK__').join(' ') || story.paragraphs?.map(p => p.content).join(' ') || ''}
                currentWordIndex={currentWordIndex}
                className="text-child-base"
              />
            </div>
          ) : blendedContent ? (
            // NEW: Sentence-based blending (real-time adjustable)
            // Group sentences into natural paragraphs based on paragraph break markers
            <div className="space-y-4">
              {(() => {
                const paragraphs: Array<Array<(typeof blendedContent.sentences)[0]>> = [];
                let currentParagraph: Array<(typeof blendedContent.sentences)[0]> = [];

                blendedContent.sentences.forEach((sentence) => {
                  // Check if this is a paragraph break marker
                  if (sentence.text === '__PARAGRAPH_BREAK__') {
                    if (currentParagraph.length > 0) {
                      paragraphs.push([...currentParagraph]);
                      currentParagraph = [];
                    }
                  } else {
                    currentParagraph.push(sentence);
                  }
                });

                // Add final paragraph if it has content
                if (currentParagraph.length > 0) {
                  paragraphs.push(currentParagraph);
                }

                // Fallback: if no paragraphs formed, group sentences by 4
                if (paragraphs.length === 0) {
                  const sentencesPerParagraph = 4;
                  for (let i = 0; i < blendedContent.sentences.length; i += sentencesPerParagraph) {
                    paragraphs.push(blendedContent.sentences.slice(i, i + sentencesPerParagraph));
                  }
                }

                return paragraphs.map((paragraphSentences, pIdx) => (
                  <p 
                    key={`paragraph-${pIdx}`} 
                    className="text-child-base leading-relaxed text-gray-900"
                    data-paragraph-index={pIdx}
                  >
                    {paragraphSentences.map((sentence, sIdx) => (
                      <span
                        key={`sentence-${pIdx}-${sIdx}`}
                        className={
                          sentence.language === 'secondary'
                            ? 'text-primary-800 font-medium cursor-help'
                            : ''
                        }
                        title={sentence.hoverTranslation ? `💡 ${sentence.hoverTranslation}` : undefined}
                      >
                        {renderSentence(sentence.text, sentence.language, sentence.showHints, pIdx * 100 + sIdx)}
                        {sIdx < paragraphSentences.length - 1 && ' '}
                      </span>
                    ))}
                  </p>
                ));
              })()}
            </div>
          ) : (
            // FALLBACK: Legacy paragraph-based rendering
            <div className="space-y-4">
              {story.paragraphs?.map((paragraph, pIdx) => (
                <p 
                  key={paragraph.id} 
                  className="text-child-base leading-relaxed text-gray-900"
                  data-paragraph-index={pIdx}
                >
                  {paragraph.content}
                </p>
              ))}
            </div>
          )}
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
