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
  origin: (origin, callback) => {
    // Allow requests from localhost on ports 5173, 5174, and 5175 (Vite dev servers)
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:5175',
      process.env.FRONTEND_URL
    ].filter(Boolean);

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));

// Azure OpenAI Client (for chat completions, TTS, and all Azure OpenAI services)
const client = new AzureOpenAI({
  endpoint: process.env.AZURE_OPENAI_ENDPOINT,
  apiKey: process.env.AZURE_OPENAI_API_KEY,
  apiVersion: process.env.AZURE_OPENAI_API_VERSION,
});

// In-memory storage (MVP - will be replaced with database later)
const storage = {
  users: new Map(),
  pets: new Map(),
  quests: new Map(),
  achievements: new Map(),
  settings: new Map(),
};

// Helper to get user ID from session (for MVP, use a default user)
const getUserId = (req) => {
  return req.cookies?.userId || 'default_user';
};

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Backend server is running',
    timestamp: Date.now(),
  });
});

// User endpoints
app.get('/api/user', (req, res) => {
  const userId = getUserId(req);
  const user = storage.users.get(userId);
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ success: false, error: 'User not found' });
  }
});

app.put('/api/user', (req, res) => {
  const userId = getUserId(req);
  const userData = req.body;
  storage.users.set(userId, userData);
  res.json({ success: true, data: userData });
});

// Pet endpoints
app.get('/api/pet', (req, res) => {
  const userId = getUserId(req);
  const pet = storage.pets.get(userId);
  if (pet) {
    res.json(pet);
  } else {
    res.status(404).json({ success: false, error: 'Pet not found' });
  }
});

app.put('/api/pet', (req, res) => {
  const userId = getUserId(req);
  const petData = req.body;
  storage.pets.set(userId, petData);
  res.json({ success: true, data: petData });
});

// Quest endpoints
app.get('/api/quests', (req, res) => {
  const userId = getUserId(req);
  const quests = storage.quests.get(userId);
  if (quests) {
    res.json(quests);
  } else {
    res.status(404).json({ success: false, error: 'Quests not found' });
  }
});

app.put('/api/quests', (req, res) => {
  const userId = getUserId(req);
  const questData = req.body;
  storage.quests.set(userId, questData);
  res.json({ success: true, data: questData });
});

// Achievement endpoints
app.get('/api/achievements', (req, res) => {
  const userId = getUserId(req);
  const achievements = storage.achievements.get(userId);
  if (achievements) {
    res.json(achievements);
  } else {
    res.status(404).json({ success: false, error: 'Achievements not found' });
  }
});

app.put('/api/achievements', (req, res) => {
  const userId = getUserId(req);
  const achievementData = req.body;
  storage.achievements.set(userId, achievementData);
  res.json({ success: true, data: achievementData });
});

// Settings endpoints
app.get('/api/settings', (req, res) => {
  const userId = getUserId(req);
  const settings = storage.settings.get(userId);
  if (settings) {
    res.json(settings);
  } else {
    res.status(404).json({ success: false, error: 'Settings not found' });
  }
});

app.put('/api/settings', (req, res) => {
  const userId = getUserId(req);
  const settingsData = req.body;
  storage.settings.set(userId, settingsData);
  res.json({ success: true, data: settingsData });
});

// Helper function to split text into sentences while preserving paragraph breaks
function splitIntoSentences(text) {
  // First split by paragraph breaks (double newlines or single newlines)
  const paragraphs = text.split(/\n\n+|\n/).filter(p => p.trim().length > 0);

  // Then split each paragraph into sentences
  const allSentences = [];
  paragraphs.forEach((paragraph, pIndex) => {
    const sentences = paragraph
      .split(/(?<=[.!?])\s+/)
      .map(s => s.trim())
      .filter(s => s.length > 0);

    allSentences.push(...sentences);

    // Add paragraph marker after last sentence of each paragraph (except the last paragraph)
    if (pIndex < paragraphs.length - 1 && sentences.length > 0) {
      allSentences.push('__PARAGRAPH_BREAK__');
    }
  });

  return allSentences;
}

// Helper function to count word frequency in text
function countWordFrequency(text) {
  // Remove punctuation and convert to lowercase
  const words = text
    .toLowerCase()
    .replace(/[.,!?;:'"()\[\]{}—-]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 0);

  const frequency = {};
  words.forEach(word => {
    frequency[word] = (frequency[word] || 0) + 1;
  });

  return frequency;
}

// Helper function to filter vocabulary by frequency
function filterVocabularyByFrequency(vocabulary, storyText, limits = { nouns: 12, verbs: 10, adjectives: 8, adverbs: 5 }) {
  const frequency = countWordFrequency(storyText);

  const filterWords = (words, limit) => {
    if (!words || !Array.isArray(words)) return [];

    // Add frequency count to each word
    const wordsWithFreq = words.map(w => ({
      ...w,
      frequency: frequency[w.word?.toLowerCase()] || 0
    }));

    // Sort by frequency (descending) and take top N
    return wordsWithFreq
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, limit);
  };

  return {
    nouns: filterWords(vocabulary.nouns, limits.nouns),
    verbs: filterWords(vocabulary.verbs, limits.verbs),
    adjectives: filterWords(vocabulary.adjectives, limits.adjectives),
    adverbs: filterWords(vocabulary.adverbs, limits.adverbs)
  };
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

    // STEP 1: Generate English story + Extract vocabulary with POS tags
    console.log(`[${new Date().toISOString()}] STEP 1: Generating English story with vocabulary extraction...`);
    const englishSystemPrompt = `You are an expert children's story writer and vocabulary educator.

Write exactly ${storySettings.length} words (±10%) for ${storySettings.gradeLevel} grade level in ENGLISH ONLY. Make the story engaging, educational, and age-appropriate.

ALSO extract key vocabulary words by part of speech:
- nouns: important objects, people, places (10-15 words)
- verbs: main action words (8-12 words)
- adjectives: descriptive words (5-8 words)
- adverbs: words describing actions (3-5 words)

For each word, provide a brief contextual definition that matches how it's used in THIS story.

Return JSON:
{
  "title": "",
  "content": "",
  "wordCount": 0,
  "vocabulary": {
    "nouns": [{"word": "dog", "definition": "a friendly pet animal"}],
    "verbs": [{"word": "run", "definition": "to move quickly"}],
    "adjectives": [{"word": "happy", "definition": "feeling joy"}],
    "adverbs": [{"word": "quickly", "definition": "at a fast pace"}]
  }
}`;

    const userPrompt = `Story prompt: ${storySettings.prompt}`;

    const englishResponse = await client.chat.completions.create({
      model: process.env.AZURE_OPENAI_DEPLOYMENT,
      messages: [
        { role: 'system', content: englishSystemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.8,
      max_tokens: 6000,
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

    const vocabCount = (englishStory.vocabulary?.nouns?.length || 0) +
                       (englishStory.vocabulary?.verbs?.length || 0) +
                       (englishStory.vocabulary?.adjectives?.length || 0) +
                       (englishStory.vocabulary?.adverbs?.length || 0);
    console.log(`[${new Date().toISOString()}] English story generated: "${englishStory.title}" (${englishStory.wordCount} words, ${vocabCount} vocabulary words extracted)`);

    // Apply frequency-based filtering to vocabulary
    const filteredVocabulary = filterVocabularyByFrequency(englishStory.vocabulary, englishStory.content);
    const filteredCount = (filteredVocabulary.nouns?.length || 0) +
                          (filteredVocabulary.verbs?.length || 0) +
                          (filteredVocabulary.adjectives?.length || 0) +
                          (filteredVocabulary.adverbs?.length || 0);
    console.log(`[${new Date().toISOString()}] Vocabulary filtered by frequency: ${vocabCount} → ${filteredCount} words (top nouns: ${filteredVocabulary.nouns?.length || 0}, top verbs: ${filteredVocabulary.verbs?.length || 0})`);

    // STEP 2: Translate story + vocabulary to secondary language
    console.log(`[${new Date().toISOString()}] STEP 2: Translating story and vocabulary to ${langName}...`);
    const translationSystemPrompt = `You are an expert translator specializing in children's literature.

Translate the English story to ${langName}, maintaining the same meaning, tone, and sentence structure.

IMPORTANT: Preserve paragraph breaks from the original English text. Use double newlines (\\n\\n) to separate paragraphs.

ALSO translate each vocabulary word, matching the contextual meaning from the English definition.

Return JSON:
{
  "translatedTitle": "",
  "translatedContent": "",
  "vocabulary": {
    "nouns": [{"english": "dog", "translation": "개", "definition": "translated definition"}],
    "verbs": [{"english": "run", "translation": "달리다", "definition": "translated definition"}],
    "adjectives": [{"english": "happy", "translation": "행복한", "definition": "translated definition"}],
    "adverbs": [{"english": "quickly", "translation": "빨리", "definition": "translated definition"}]
  }
}`;

    const translationInput = {
      title: englishStory.title,
      content: englishStory.content,
      vocabulary: filteredVocabulary // Use frequency-filtered vocabulary
    };

    const translationResponse = await client.chat.completions.create({
      model: process.env.AZURE_OPENAI_DEPLOYMENT,
      messages: [
        { role: 'system', content: translationSystemPrompt },
        { role: 'user', content: JSON.stringify(translationInput, null, 2) }
      ],
      temperature: 0.3, // Lower temperature for more accurate translation
      max_tokens: 12000, // Increased to prevent Korean/Chinese translation truncation
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

    const translatedVocabCount = (translationData.vocabulary?.nouns?.length || 0) +
                                  (translationData.vocabulary?.verbs?.length || 0) +
                                  (translationData.vocabulary?.adjectives?.length || 0) +
                                  (translationData.vocabulary?.adverbs?.length || 0);
    console.log(`[${new Date().toISOString()}] Translation completed: ${translationData.translatedContent?.length || 0} characters, ${translatedVocabCount} vocabulary words`);

    // Split content into sentences for client-side blending
    const englishSentences = splitIntoSentences(englishStory.content);
    const secondarySentences = splitIntoSentences(translationData.translatedContent || '');

    // Build vocabulary structure for client-side word replacement
    const vocabulary = {
      nouns: translationData.vocabulary?.nouns || [],
      verbs: translationData.vocabulary?.verbs || [],
      adjectives: translationData.vocabulary?.adjectives || [],
      adverbs: translationData.vocabulary?.adverbs || []
    };

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

      // Vocabulary with POS tags for word-level blending
      vocabulary: vocabulary,

      // Legacy fields for compatibility
      content: englishStory.content,
      paragraphs: [{
        id: 'p1',
        content: englishStory.content,
        blendedWords: [] // Using new vocabulary structure instead
      }],

      settings: storySettings,
      languageSettings,
      wordCount: englishStory.wordCount || englishSentences.join(' ').split(/\s+/).length,
      estimatedReadTime: Math.ceil(storySettings.length / 200),
      koreanWordCount: filteredCount,
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

// Text-to-Speech endpoint - Generate audio from story text
app.post('/api/generate-audio', async (req, res) => {
  try {
    const { text, voice = 'alloy', speed = 1.0 } = req.body;
    if (!text) {
      return res.status(400).json({ success: false, error: 'Missing required field: text' });
    }

    console.log(`[${new Date().toISOString()}] Generating TTS audio: ${text.substring(0, 50)}... (voice: ${voice}, speed: ${speed})`);

    // Generate audio using Azure OpenAI TTS deployment
    const mp3 = await client.audio.speech.create({
      model: process.env.AZURE_TTS_DEPLOYMENT || 'gpt-4o-mini-tts', // Azure TTS deployment name
      voice: voice, // alloy, echo, fable, nova, shimmer (multilingual support)
      input: text,
      speed: speed, // 0.25 to 4.0
    });

    // Convert audio stream to buffer
    const buffer = Buffer.from(await mp3.arrayBuffer());

    // Calculate approximate word timings for synchronization with punctuation-aware pausing
    // Split text into sentences first to account for natural pauses after sentences
    const sentences = text.split(/([.!?]+\s+)/);
    const wordTimings = [];
    let currentTime = 0.05; // 50ms initial delay

    // Pause durations (in seconds) - TTS engines add natural pauses
    const PAUSE_AFTER_SENTENCE = 0.4; // 400ms after period/question/exclamation
    const PAUSE_AFTER_COMMA = 0.15; // 150ms after comma
    const WORDS_PER_MINUTE = 130; // Multilingual TTS speaking rate
    const SECONDS_PER_WORD = 60 / WORDS_PER_MINUTE / speed;

    for (const sentence of sentences) {
      if (!sentence.trim()) continue;

      // Split sentence into words and punctuation
      const tokens = sentence.split(/(\s+)/);

      for (const token of tokens) {
        if (!token.trim()) continue; // Skip whitespace

        // Check if token is punctuation only
        if (/^[.!?,;:]+$/.test(token)) {
          // Add pause for sentence-ending punctuation
          if (/[.!?]/.test(token)) {
            currentTime += PAUSE_AFTER_SENTENCE;
          } else if (/,/.test(token)) {
            currentTime += PAUSE_AFTER_COMMA;
          }
          continue;
        }

        // Clean word (remove attached punctuation for timing)
        const cleanWord = token.replace(/[.!?,;:]+$/, '');
        if (!cleanWord) continue;

        // Calculate word duration (longer words take slightly more time)
        const wordLength = cleanWord.length;
        const wordDuration = SECONDS_PER_WORD * (0.8 + (wordLength / 30)); // Adjust for word length

        wordTimings.push({
          word: token, // Keep original token with punctuation
          startTime: currentTime,
          endTime: currentTime + wordDuration,
        });

        currentTime += wordDuration;
      }
    }

    // Calculate total estimated duration
    const estimatedDuration = currentTime;
    const wordCount = wordTimings.length;

    console.log(`[${new Date().toISOString()}] TTS audio generated: ${buffer.length} bytes, ${wordCount} words, ~${estimatedDuration.toFixed(1)}s duration`);

    // Return audio as base64-encoded data URL
    const audioBase64 = buffer.toString('base64');
    const audioDataUrl = `data:audio/mp3;base64,${audioBase64}`;

    res.json({
      success: true,
      data: {
        audioUrl: audioDataUrl,
        duration: estimatedDuration,
        wordTimings: wordTimings,
        wordCount: wordCount,
      },
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('[ERROR] TTS generation failed:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate audio',
      message: error.message,
    });
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
    console.log(`   POST http://localhost:${PORT}/api/generate-audio`);
    console.log('\n🔒 API keys are securely stored in backend/.env');
    console.log('   Never exposed to frontend!\n');
  });
}
