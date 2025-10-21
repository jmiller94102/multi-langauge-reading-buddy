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
      max_tokens: 8000,
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
