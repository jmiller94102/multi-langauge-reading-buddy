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

// Story generation endpoint
app.post('/api/generate-story', async (req, res) => {
  try {
    const { storySettings, languageSettings } = req.body;
    if (!storySettings || !languageSettings) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    const langName = languageSettings.secondaryLanguage === 'ko' ? 'Korean' : 'Mandarin Chinese';
    const blendPercent = languageSettings.blendLevel * 10;

    const systemPrompt = `You are an expert children's story writer. Write exactly ${storySettings.length} words (±10%) for ${storySettings.gradeLevel} grade. Blend ${blendPercent}% ${langName} words naturally. Return JSON: {"title":"", "content":"", "paragraphs":[{"id":"p1", "content":"", "blendedWords":[{"text":"", "translation":"", "romanization":"", "language":"${languageSettings.secondaryLanguage}"}]}], "wordCount":0}`;

    const userPrompt = `Story prompt: ${storySettings.prompt}`;

    const response = await client.chat.completions.create({
      model: process.env.AZURE_OPENAI_DEPLOYMENT,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.8,
      max_tokens: storySettings.length * 3,
      response_format: { type: 'json_object' }
    });

    const storyData = JSON.parse(response.choices[0]?.message?.content || '{}');
    const story = {
      id: `story_${Date.now()}`,
      ...storyData,
      settings: storySettings,
      languageSettings,
      estimatedReadTime: Math.ceil(storySettings.length / 200),
      koreanWordCount: storyData.paragraphs?.reduce((c, p) => c + (p.blendedWords?.length || 0), 0) || 0,
      createdAt: Date.now()
    };

    console.log(`[${new Date().toISOString()}] Story generated: ${story.title}`);
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
