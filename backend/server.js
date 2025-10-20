/**
 * Secure Backend Server for Reading App
 * Handles Azure OpenAI API calls to keep API keys secure
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { AzureOpenAI } = require('openai');

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5174',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));

// Azure OpenAI Client (Secure - API key never exposed to frontend)
const client = new AzureOpenAI({
  endpoint: process.env.AZURE_OPENAI_ENDPOINT,
  apiKey: process.env.AZURE_OPENAI_API_KEY,
  apiVersion: process.env.AZURE_OPENAI_API_VERSION,
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Backend server is running',
    timestamp: Date.now(),
  });
});

// Helper function to split text into sentences
function splitIntoSentences(text) {
  // Split by sentence-ending punctuation, preserving the punctuation
  return text
    .split(/(?<=[.!?])\s+/)
    .map(s => s.trim())
    .filter(s => s.length > 0);
}

// Story generation endpoint - 2 sequential LLM calls (English + Translation)
app.post('/api/generate-story', async (req, res) => {
  try {
    const { storySettings, languageSettings } = req.body;
    if (!storySettings || !languageSettings) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    const langName = languageSettings.secondaryLanguage === 'ko' ? 'Korean' : 'Mandarin Chinese';
    const langCode = languageSettings.secondaryLanguage;

    // STEP 1: Generate English story
    console.log(`[${new Date().toISOString()}] STEP 1: Generating English story...`);
    const englishSystemPrompt = `You are an expert children's story writer. Write exactly ${storySettings.length} words (±10%) for ${storySettings.gradeLevel} grade level in ENGLISH ONLY. Make the story engaging, educational, and age-appropriate. Return JSON: {"title":"", "content":"", "wordCount":0}`;

    const userPrompt = `Story prompt: ${storySettings.prompt}`;

    const englishResponse = await client.chat.completions.create({
      model: process.env.AZURE_OPENAI_DEPLOYMENT,
      messages: [
        { role: 'system', content: englishSystemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.8,
      max_tokens: 4000,
      response_format: { type: 'json_object' }
    });

    const englishContent = englishResponse.choices[0]?.message?.content;
    if (!englishContent) {
      throw new Error('Empty response from Azure OpenAI (English story)');
    }

    let englishStory;
    try {
      englishStory = JSON.parse(englishContent);
    } catch (parseError) {
      console.error('[ERROR] JSON parse failed (English):', parseError.message);
      throw new Error(`Invalid JSON from Azure OpenAI: ${parseError.message}`);
    }

    console.log(`[${new Date().toISOString()}] English story generated: "${englishStory.title}" (${englishStory.wordCount} words)`);

    // STEP 2: Translate to secondary language (full text)
    console.log(`[${new Date().toISOString()}] STEP 2: Translating to ${langName}...`);
    const translationSystemPrompt = `You are an expert translator specializing in children's literature. Translate the following English story to ${langName}, maintaining the same meaning, tone, and sentence structure. Return JSON: {"translatedTitle":"", "translatedContent":""}`;

    const translationResponse = await client.chat.completions.create({
      model: process.env.AZURE_OPENAI_DEPLOYMENT,
      messages: [
        { role: 'system', content: translationSystemPrompt },
        { role: 'user', content: `Title: ${englishStory.title}\n\nStory:\n${englishStory.content}` }
      ],
      temperature: 0.3, // Lower temperature for more accurate translation
      max_tokens: 8000, // Increased for longer translations
      response_format: { type: 'json_object' }
    });

    const translationContent = translationResponse.choices[0]?.message?.content;
    if (!translationContent) {
      throw new Error('Empty response from Azure OpenAI (Translation)');
    }

    let translationData;
    try {
      translationData = JSON.parse(translationContent);
    } catch (parseError) {
      console.error('[ERROR] JSON parse failed (Translation):', parseError.message);
      console.error('[ERROR] Response length:', translationContent?.length || 0);
      console.error('[ERROR] Response preview:', translationContent?.substring(0, 500));
      throw new Error(`Invalid JSON from translation: ${parseError.message}`);
    }

    console.log(`[${new Date().toISOString()}] Translation completed: ${translationData.translatedContent?.length || 0} characters`);

    // Split content into sentences for client-side blending
    const englishSentences = splitIntoSentences(englishStory.content);
    const secondarySentences = splitIntoSentences(translationData.translatedContent || '');

    // Build vocabulary map by matching common words between English and translation
    // For MVP, we'll build this later - for now just use empty map
    const vocabularyMap = {};

    // Build story object with BOTH language versions
    const story = {
      id: `story_${Date.now()}`,
      title: englishStory.title,
      translatedTitle: translationData.translatedTitle || englishStory.title,

      // Full content in both languages
      primaryContent: englishStory.content,
      secondaryContent: secondarySentences.join(' '),

      // Sentence arrays for blending
      primarySentences: englishSentences,
      secondarySentences: secondarySentences,

      // Vocabulary mapping for hints
      vocabularyMap: vocabularyMap,

      // Legacy fields for compatibility
      content: englishStory.content,
      paragraphs: [{
        id: 'p1',
        content: englishStory.content,
        blendedWords: Object.entries(vocabularyMap).map(([word, data]) => ({
          text: word,
          translation: data.translation,
          romanization: data.romanization,
          language: langCode
        }))
      }],

      settings: storySettings,
      languageSettings,
      wordCount: englishStory.wordCount || englishSentences.join(' ').split(/\s+/).length,
      estimatedReadTime: Math.ceil(storySettings.length / 200),
      koreanWordCount: Object.keys(vocabularyMap).length,
      createdAt: Date.now()
    };

    console.log(`[${new Date().toISOString()}] Complete story package created: ${story.primarySentences.length} English sentences, ${story.secondarySentences.length} ${langName} sentences`);
    res.json({ success: true, data: story, timestamp: Date.now() });
  } catch (error) {
    console.error('[ERROR] Story generation failed:', error);
    res.status(500).json({ success: false, error: 'Failed to generate story', message: error.message });
  }
});

// Quiz generation endpoint
app.post('/api/generate-quiz', async (req, res) => {
  try {
    const { story, quizSettings } = req.body;
    if (!story || !quizSettings) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    const systemPrompt = `You are a quiz creator. Create ${quizSettings.multipleChoiceCount} multiple choice and ${quizSettings.fillInBlankCount} fill-in-blank questions for the story. Difficulty: ${quizSettings.difficulty}. Return JSON: {"questions":[{"id":"q1","type":"multipleChoice","category":"comprehension","text":"","options":[{"id":"a","text":"","isCorrect":false}],"correctAnswer":"","explanation":"","xpReward":10,"coinReward":5}]}`;

    const userPrompt = `Story: ${story.title}\n\n${story.content}\n\nCreate ${quizSettings.multipleChoiceCount + quizSettings.fillInBlankCount} questions.`;

    const response = await client.chat.completions.create({
      model: process.env.AZURE_OPENAI_DEPLOYMENT,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 2000,
      response_format: { type: 'json_object' }
    });

    const quizData = JSON.parse(response.choices[0]?.message?.content || '{}');
    const quiz = {
      id: `quiz_${Date.now()}`,
      storyId: story.id,
      questions: quizData.questions || [],
      settings: quizSettings,
      createdAt: Date.now()
    };

    console.log(`[${new Date().toISOString()}] Quiz generated with ${quiz.questions.length} questions`);
    res.json({ success: true, data: quiz, timestamp: Date.now() });
  } catch (error) {
    console.error('[ERROR] Quiz generation failed:', error);
    res.status(500).json({ success: false, error: 'Failed to generate quiz', message: error.message });
  }
});

// Export for testing
module.exports = app;

// Start server
if (require.main === module) {
  app.listen(PORT, () => {
    console.log('\n🚀 Secure Backend Server Running');
    console.log(`   Port: ${PORT}`);
    console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`   Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5174'}`);
    console.log(`   Azure OpenAI: ${process.env.AZURE_OPENAI_ENDPOINT ? '✓ Configured' : '✗ Not configured'}`);
    console.log('\n📡 API Endpoints:');
    console.log(`   GET  http://localhost:${PORT}/api/health`);
    console.log('\n🔒 API keys are securely stored in backend/.env');
    console.log('   Never exposed to frontend!\n');
  });
}
