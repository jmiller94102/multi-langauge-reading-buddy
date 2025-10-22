import type { StorySettings, LanguageSettings, Story } from '@/types/story';
import type { Quiz, QuizSettings } from '@/types/quiz';
import { fetchWithRetry } from '@/utils/apiRetry';

// Backend API Configuration (SECURE - No API keys exposed!)
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';

/**
 * Generate a story with language blending using secure backend API
 * API keys are NEVER exposed to the frontend!
 */
export const generateStory = async (
  storySettings: StorySettings,
  languageSettings: LanguageSettings
): Promise<Story> => {
  try {
    // Use retry logic for story generation (can take time, may hit rate limits)
    const response = await fetchWithRetry(
      `${BACKEND_URL}/api/generate-story`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          storySettings,
          languageSettings,
        }),
      },
      {
        maxRetries: 3,
        initialDelay: 2000, // 2 seconds for LLM calls
        onRetry: (attempt) => {
          console.log(`Retrying story generation (attempt ${attempt}/3)...`);
        },
      }
    );

    const data = await response.json();

    if (!data.success || !data.data) {
      throw new Error('Invalid response from backend');
    }

    return data.data;
  } catch (error) {
    console.error('Error generating story:', error);
    throw new Error(`Failed to generate story: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Generate a quiz based on a story using secure backend API
 * API keys are NEVER exposed to the frontend!
 */
export const generateQuiz = async (
  story: Story,
  quizSettings: QuizSettings
): Promise<Quiz> => {
  try {
    // Use retry logic for quiz generation (can take time, may hit rate limits)
    const response = await fetchWithRetry(
      `${BACKEND_URL}/api/generate-quiz`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          story,
          quizSettings,
        }),
      },
      {
        maxRetries: 3,
        initialDelay: 2000, // 2 seconds for LLM calls
        onRetry: (attempt) => {
          console.log(`Retrying quiz generation (attempt ${attempt}/3)...`);
        },
      }
    );

    const data = await response.json();

    if (!data.success || !data.data) {
      throw new Error('Invalid response from backend');
    }

    return data.data;
  } catch (error) {
    console.error('Error generating quiz:', error);
    throw new Error(`Failed to generate quiz: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Test backend API connection
 */
export const testConnection = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/health`);
    const data = await response.json();
    return data.success === true;
  } catch (error) {
    console.error('Backend API connection test failed:', error);
    return false;
  }
};

/**
 * Generate audio from text using OpenAI TTS
 */
export interface AudioData {
  audioUrl: string;
  duration: number;
  wordTimings: Array<{ word: string; startTime: number; endTime: number }>;
  wordCount: number;
}

export const generateAudio = async (
  text: string,
  voice: string = 'alloy',
  speed: number = 1.0
): Promise<AudioData> => {
  try {
    const response = await fetchWithRetry(
      `${BACKEND_URL}/api/generate-audio`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, voice, speed }),
      },
      {
        maxRetries: 2,
        initialDelay: 3000, // 3 seconds for TTS calls
        onRetry: (attempt) => {
          console.log(`Retrying audio generation (attempt ${attempt}/2)...`);
        },
      }
    );

    const data = await response.json();

    if (!data.success || !data.data) {
      throw new Error('Invalid response from backend');
    }

    return data.data;
  } catch (error) {
    console.error('Error generating audio:', error);
    throw new Error(`Failed to generate audio: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};
