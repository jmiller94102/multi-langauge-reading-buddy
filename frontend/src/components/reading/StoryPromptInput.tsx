import React, { useState } from 'react';
import { Button } from '@/components/common/Button';
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
  const [isRecording, setIsRecording] = useState(false);

  const maxChars = 500;
  const charsRemaining = maxChars - prompt.length;

  const handleMicrophoneClick = () => {
    // TODO: Implement speech-to-text in Phase 2
    // For now, just toggle recording state
    setIsRecording(!isRecording);

    // Placeholder: Show alert for now
    if (!isRecording) {
      alert('Speech-to-text feature coming soon! For now, please type your story idea.');
    }
  };

  const canGenerate = prompt.trim().length >= 10;

  return (
    <div className="card py-3 px-4 space-y-3">
      <h2 className="text-child-base font-bold text-gray-900 border-b-2 border-gray-200 pb-2">
        ✨ Create Your Story
      </h2>

      {/* Story Prompt Input */}
      <div className="relative">
        <label htmlFor="story-prompt" className="block text-child-sm font-semibold text-gray-700 mb-2">
          Story Prompt
        </label>
        <div className="relative">
          <textarea
            id="story-prompt"
            value={prompt}
            onChange={(e) => onPromptChange(e.target.value)}
            placeholder="A fun adventure about Pikachu playing basketball with Team Rocket..."
            className="w-full p-3 pr-12 border-2 border-gray-300 rounded-lg text-child-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            rows={8}
            maxLength={maxChars}
            aria-label="Story prompt text area"
            disabled={isGenerating}
          />
          <button
            onClick={handleMicrophoneClick}
            className={`absolute right-3 top-3 p-2 rounded-full transition-all ${
              isRecording
                ? 'bg-red-500 text-white animate-pulse'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            aria-label="Use microphone for speech-to-text"
            disabled={isGenerating}
          >
            <span className="text-lg" aria-hidden="true">🎤</span>
          </button>
        </div>
        <div className="flex justify-between items-center mt-1">
          <p className="text-[11px] text-gray-600 italic">
            {isRecording ? 'Recording... (speech-to-text coming soon)' : 'Type your story idea or click 🎤 to speak it'}
          </p>
          <p className={`text-[11px] font-semibold ${charsRemaining < 50 ? 'text-red-600' : 'text-gray-600'}`}>
            {charsRemaining} chars left
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
        aria-label="Generate story"
      >
        <span className="text-child-lg font-bold flex items-center justify-center gap-2">
          {isGenerating ? (
            <>
              <span className="animate-spin">⏳</span>
              <span>Generating Story...</span>
            </>
          ) : (
            <>
              <span aria-hidden="true">🌟</span>
              <span>Generate Story</span>
            </>
          )}
        </span>
      </Button>

      {!canGenerate && (
        <p className="text-[11px] text-red-600 text-center italic">
          Please enter at least 10 characters to generate a story
        </p>
      )}
    </div>
  );
};
