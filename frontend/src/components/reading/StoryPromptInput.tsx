import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/common/Button';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import type { StorySettings, LanguageSettings } from '@/types/story';

interface StoryPromptInputProps {
  prompt: string;
  storySettings: StorySettings;
  languageSettings: LanguageSettings;
  onPromptChange: (prompt: string) => void;
  onGenerate: () => void;
  isGenerating?: boolean;
}

export const StoryPromptInput: React.FC<StoryPromptInputProps> = ({
  prompt,
  storySettings: _storySettings,
  languageSettings: _languageSettings,
  onPromptChange,
  onGenerate,
  isGenerating = false,
}) => {
  const { t } = useTranslation();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const maxChars = 500;
  const charsRemaining = maxChars - prompt.length;

  // Speech recognition hook
  const {
    transcript,
    isListening,
    isSupported,
    error: speechError,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechRecognition({
    lang: 'en-US',
    continuous: false,
    interimResults: true,
  });

  // Update prompt when transcript changes
  useEffect(() => {
    if (transcript.trim()) {
      const newPrompt = prompt ? `${prompt} ${transcript}` : transcript;
      const truncated = newPrompt.slice(0, maxChars);
      onPromptChange(truncated);
    }
  }, [transcript]);

  // Show speech errors
  useEffect(() => {
    if (speechError) {
      setErrorMessage(speechError);
      setTimeout(() => setErrorMessage(null), 5000);
    }
  }, [speechError]);

  const handleMicrophoneClick = () => {
    // Check browser support
    if (!isSupported) {
      setErrorMessage(t('reading.speechRecognition.notSupported'));
      setTimeout(() => setErrorMessage(null), 5000);
      return;
    }

    if (isListening) {
      // Stop recording
      stopListening();
      if (transcript.trim()) {
        setSuccessMessage(t('reading.speechRecognition.recognized'));
        setTimeout(() => setSuccessMessage(null), 3000);
      }
      resetTranscript();
    } else {
      // Start recording
      setErrorMessage(null);
      setSuccessMessage(null);
      startListening();
    }
  };

  const canGenerate = prompt.trim().length >= 10;

  return (
    <div className="card py-3 px-4 space-y-3">
      {/* Story Prompt Input */}
      <div className="relative">
        <label htmlFor="story-prompt" className="block text-child-sm font-semibold text-gray-700 mb-2">
          {t('reading.storyPrompt')}
        </label>
        <div className="relative">
          <textarea
            id="story-prompt"
            value={prompt}
            onChange={(e) => onPromptChange(e.target.value)}
            placeholder={t('reading.storyPromptPlaceholder')}
            className="w-full p-3 pr-12 border-2 border-gray-300 rounded-lg text-child-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            rows={8}
            maxLength={maxChars}
            aria-label={t('reading.storyPrompt')}
            disabled={isGenerating}
          />
          <button
            onClick={handleMicrophoneClick}
            className={`absolute right-3 top-3 p-2 rounded-full transition-all ${
              isListening
                ? 'bg-red-500 text-white animate-pulse'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            aria-label={isListening ? t('reading.speechRecognition.stopRecording') : t('reading.speechRecognition.startRecording')}
            disabled={isGenerating}
            title={isListening ? t('reading.speechRecognition.clickToStop') : t('reading.speechRecognition.clickToStart')}
          >
            <span className="text-lg" aria-hidden="true">🎤</span>
          </button>
        </div>
        <div className="flex justify-between items-center mt-1">
          <div className="flex-1">
            {errorMessage ? (
              <p className="text-[11px] text-red-600 font-semibold">
                ⚠️ {errorMessage}
              </p>
            ) : successMessage ? (
              <p className="text-[11px] text-green-600 font-semibold">
                ✓ {successMessage}
              </p>
            ) : (
              <p className="text-[11px] text-gray-600 italic">
                {isListening
                  ? `🔴 ${t('reading.speechRecognition.listening')}`
                  : t('reading.speechRecognition.typeOrSpeak')}
              </p>
            )}
          </div>
          <p className={`text-[11px] font-semibold ml-2 ${charsRemaining < 50 ? 'text-red-600' : 'text-gray-600'}`}>
            {t('reading.speechRecognition.charsLeft', { count: charsRemaining })}
          </p>
        </div>
      </div>

      {/* Generate Button */}
      <Button
        variant="primary"
        size="large"
        onClick={onGenerate}
        disabled={!canGenerate || isGenerating}
        className="w-full bg-gradient-to-r from-primary-500 via-purple-500 to-accent-500 hover:from-primary-600 hover:via-purple-600 hover:to-accent-600 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 py-4"
        aria-label={t('reading.generateButton')}
      >
        <span className="text-child-lg font-bold flex items-center justify-center gap-2">
          {isGenerating ? (
            <>
              <span className="animate-spin">⏳</span>
              <span>{t('reading.generating')}</span>
            </>
          ) : (
            <>
              <span aria-hidden="true">🌟</span>
              <span>{t('reading.generateButton')}</span>
            </>
          )}
        </span>
      </Button>

      {!canGenerate && (
        <p className="text-[11px] text-red-600 text-center italic">
          {t('reading.speechRecognition.minCharsRequired')}
        </p>
      )}
    </div>
  );
};
