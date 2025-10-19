import { AzureOpenAI } from 'openai';
import type { StorySettings, LanguageSettings, Story, StoryParagraph, BlendedWord } from '@/types/story';
import type { Quiz, QuizSettings, Question, QuestionOption } from '@/types/quiz';

// Azure OpenAI Configuration
const AZURE_OPENAI_ENDPOINT = import.meta.env.VITE_AZURE_OPENAI_ENDPOINT || '';
const AZURE_OPENAI_API_KEY = import.meta.env.VITE_AZURE_OPENAI_API_KEY || '';
const AZURE_OPENAI_API_VERSION = '2024-12-01-preview';
const AZURE_OPENAI_DEPLOYMENT = 'gpt-4.1'; // gpt-4.1 deployment name

// Initialize Azure OpenAI client
const client = new AzureOpenAI({
  endpoint: AZURE_OPENAI_ENDPOINT,
  apiKey: AZURE_OPENAI_API_KEY,
  apiVersion: AZURE_OPENAI_API_VERSION,
  dangerouslyAllowBrowser: true, // Required for browser usage
});

/**
 * Generate a story with language blending using Azure OpenAI
 */
export const generateStory = async (
  storySettings: StorySettings,
  languageSettings: LanguageSettings
): Promise<Story> => {
  const langName = languageSettings.secondaryLanguage === 'ko' ? 'Korean' : 'Mandarin Chinese';
  const blendPercent = languageSettings.blendLevel * 10;

  const systemPrompt = `You are an expert children's story writer specializing in bilingual education.
Create engaging, age-appropriate stories that blend English with ${langName}.

CRITICAL REQUIREMENTS:
1. Write exactly ${storySettings.length} words (±10%).
2. Suitable for ${storySettings.gradeLevel} grade reading level.
3. ${storySettings.humorLevel} humor level.
4. Theme: ${storySettings.visualTheme}.
5. Language blending: ${blendPercent}% ${langName} words mixed with English.
6. Include ${langName} words naturally in the story flow.
7. Each ${langName} word must have an English translation in parentheses immediately after it.
8. Format ${langName} words like this: "word (translation)".
9. Make the story exciting and engaging for children!

Return ONLY valid JSON in this exact format (no markdown, no code blocks):
{
  "title": "Story Title",
  "content": "Full story text with language blending...",
  "paragraphs": [
    {
      "id": "p1",
      "content": "Paragraph text...",
      "blendedWords": [
        {
          "text": "${langName} word",
          "translation": "English translation",
          "romanization": "phonetic spelling (optional)",
          "language": "${languageSettings.secondaryLanguage}"
        }
      ]
    }
  ],
  "wordCount": ${storySettings.length}
}`;

  const userPrompt = `Story Prompt: ${storySettings.prompt}

${storySettings.customVocabulary && storySettings.customVocabulary.length > 0
  ? `Include these vocabulary words: ${storySettings.customVocabulary.join(', ')}`
  : ''}

Remember: ${blendPercent}% ${langName} blending means approximately ${Math.floor((storySettings.length * blendPercent) / 100)} words should be in ${langName}.`;

  try {
    const response = await client.chat.completions.create({
      model: AZURE_OPENAI_DEPLOYMENT,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.8,
      max_tokens: storySettings.length * 3, // Allow enough tokens for the story
      response_format: { type: 'json_object' }, // Ensure JSON response
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No content received from Azure OpenAI');
    }

    // Parse the JSON response
    const storyData = JSON.parse(content);

    // Construct the Story object
    const story: Story = {
      id: `story_${Date.now()}`,
      title: storyData.title,
      content: storyData.content,
      paragraphs: storyData.paragraphs.map((p: { id: string; content: string; blendedWords: BlendedWord[] }) => ({
        id: p.id || `p${Date.now()}`,
        content: p.content,
        blendedWords: p.blendedWords || [],
      })),
      settings: storySettings,
      languageSettings,
      wordCount: storyData.wordCount || storySettings.length,
      estimatedReadTime: Math.ceil(storySettings.length / 200), // 200 WPM average
      koreanWordCount: storyData.paragraphs.reduce((count: number, p: StoryParagraph) =>
        count + (p.blendedWords?.length || 0), 0),
      createdAt: Date.now(),
    };

    return story;
  } catch (error) {
    console.error('Error generating story:', error);
    throw new Error(`Failed to generate story: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Generate a quiz based on a story using Azure OpenAI
 */
export const generateQuiz = async (
  story: Story,
  quizSettings: QuizSettings
): Promise<Quiz> => {
  const systemPrompt = `You are an expert quiz creator for children's reading comprehension.
Create engaging, age-appropriate quiz questions based on the provided story.

CRITICAL REQUIREMENTS:
1. Create ${quizSettings.multipleChoiceCount} multiple choice questions.
2. Create ${quizSettings.fillInBlankCount} fill-in-the-blank questions.
3. Question difficulty: ${quizSettings.difficulty}.
4. Include these question types: ${quizSettings.categories.join(', ')}.
5. Each question should test understanding of the story.
6. Provide clear explanations for correct answers.
7. Multiple choice questions must have exactly 4 options, with only 1 correct.

${quizSettings.customFocus ? `Focus on: ${quizSettings.customFocus}` : ''}

Return ONLY valid JSON in this exact format (no markdown, no code blocks):
{
  "questions": [
    {
      "id": "q1",
      "type": "multipleChoice",
      "category": "comprehension",
      "text": "Question text?",
      "options": [
        {"id": "a", "text": "Option A", "isCorrect": false},
        {"id": "b", "text": "Option B", "isCorrect": true},
        {"id": "c", "text": "Option C", "isCorrect": false},
        {"id": "d", "text": "Option D", "isCorrect": false}
      ],
      "correctAnswer": "Option B",
      "explanation": "Why this is correct...",
      "xpReward": 10,
      "coinReward": 5
    }
  ]
}`;

  const userPrompt = `Story Title: ${story.title}

Story Content:
${story.content}

Create ${quizSettings.multipleChoiceCount + quizSettings.fillInBlankCount} questions total.`;

  try {
    const response = await client.chat.completions.create({
      model: AZURE_OPENAI_DEPLOYMENT,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 2000,
      response_format: { type: 'json_object' },
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No content received from Azure OpenAI');
    }

    const quizData = JSON.parse(content);

    const quiz: Quiz = {
      id: `quiz_${Date.now()}`,
      storyId: story.id,
      questions: quizData.questions.map((q: Question) => ({
        id: q.id || `q${Date.now()}`,
        type: q.type,
        category: q.category,
        text: q.text,
        options: q.options?.map((opt: QuestionOption) => ({
          id: opt.id,
          text: opt.text,
          isCorrect: opt.isCorrect,
        })),
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        xpReward: q.xpReward || 10,
        coinReward: q.coinReward || 5,
      })),
      settings: quizSettings,
      createdAt: Date.now(),
    };

    return quiz;
  } catch (error) {
    console.error('Error generating quiz:', error);
    throw new Error(`Failed to generate quiz: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Test Azure OpenAI connection
 */
export const testConnection = async (): Promise<boolean> => {
  try {
    const response = await client.chat.completions.create({
      model: AZURE_OPENAI_DEPLOYMENT,
      messages: [{ role: 'user', content: 'Test connection' }],
      max_tokens: 10,
    });

    return response.choices.length > 0;
  } catch (error) {
    console.error('Azure OpenAI connection test failed:', error);
    return false;
  }
};
