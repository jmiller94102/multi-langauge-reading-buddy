import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import type { Story, Quiz } from '@/types/story';
import type { AudioData } from '@/services/azureOpenAI';

interface StoryContextValue {
  currentStory: Story | null;
  currentQuiz: Quiz | null;
  currentAudioData: AudioData | null;
  setCurrentStory: (story: Story | null) => void;
  setCurrentQuiz: (quiz: Quiz | null) => void;
  setCurrentAudioData: (audioData: AudioData | null) => void;
  clearStory: () => void;
}

const StoryContext = createContext<StoryContextValue | undefined>(undefined);

interface StoryProviderProps {
  children: ReactNode;
}

export const StoryProvider: React.FC<StoryProviderProps> = ({ children }) => {
  const [currentStory, setCurrentStoryState] = useState<Story | null>(null);
  const [currentQuiz, setCurrentQuizState] = useState<Quiz | null>(null);
  const [currentAudioData, setCurrentAudioDataState] = useState<AudioData | null>(null);

  // Load story, quiz, and audio data from localStorage on mount
  useEffect(() => {
    try {
      const savedStory = localStorage.getItem('reading_app_current_story');
      const savedQuiz = localStorage.getItem('reading_app_current_quiz');
      const savedAudioData = localStorage.getItem('reading_app_current_audio_data');

      if (savedStory) {
        setCurrentStoryState(JSON.parse(savedStory));
      }
      if (savedQuiz) {
        setCurrentQuizState(JSON.parse(savedQuiz));
      }
      if (savedAudioData) {
        setCurrentAudioDataState(JSON.parse(savedAudioData));
      }
    } catch (error) {
      console.error('Failed to load story from localStorage:', error);
    }
  }, []);

  // Save story to localStorage whenever it changes
  const setCurrentStory = (story: Story | null) => {
    setCurrentStoryState(story);
    try {
      if (story) {
        localStorage.setItem('reading_app_current_story', JSON.stringify(story));
      } else {
        localStorage.removeItem('reading_app_current_story');
      }
    } catch (error) {
      console.error('Failed to save story to localStorage:', error);
    }
  };

  // Save quiz to localStorage whenever it changes
  const setCurrentQuiz = (quiz: Quiz | null) => {
    setCurrentQuizState(quiz);
    try {
      if (quiz) {
        localStorage.setItem('reading_app_current_quiz', JSON.stringify(quiz));
      } else {
        localStorage.removeItem('reading_app_current_quiz');
      }
    } catch (error) {
      console.error('Failed to save quiz to localStorage:', error);
    }
  };

  // Save audio data to localStorage whenever it changes
  const setCurrentAudioData = (audioData: AudioData | null) => {
    setCurrentAudioDataState(audioData);
    try {
      if (audioData) {
        localStorage.setItem('reading_app_current_audio_data', JSON.stringify(audioData));
      } else {
        localStorage.removeItem('reading_app_current_audio_data');
      }
    } catch (error) {
      console.error('Failed to save audio data to localStorage:', error);
    }
  };

  // Clear story, quiz, and audio data
  const clearStory = () => {
    setCurrentStory(null);
    setCurrentQuiz(null);
    setCurrentAudioData(null);
  };

  return (
    <StoryContext.Provider
      value={{
        currentStory,
        currentQuiz,
        currentAudioData,
        setCurrentStory,
        setCurrentQuiz,
        setCurrentAudioData,
        clearStory,
      }}
    >
      {children}
    </StoryContext.Provider>
  );
};

export const useStory = (): StoryContextValue => {
  const context = useContext(StoryContext);
  if (!context) {
    throw new Error('useStory must be used within a StoryProvider');
  }
  return context;
};
