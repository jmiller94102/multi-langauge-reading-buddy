import type { StorySettings, LanguageSettings, Story } from '@/types/story';
import type { Quiz, QuizSettings } from '@/types/quiz';

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
    const response = await fetch(`${BACKEND_URL}/api/generate-story`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        storySettings,
        languageSettings,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

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
    const response = await fetch(`${BACKEND_URL}/api/generate-quiz`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        story,
        quizSettings,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

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
