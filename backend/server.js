const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Import Azure OpenAI
const { AzureOpenAI } = require('openai');

// Import LangSmith for observability
const { Client } = require('langsmith');
const { wrapOpenAI } = require('langsmith/wrappers/openai');

// Initialize Azure OpenAI client
let azureClient = null;
let langsmithClient = null;

function initializeLangSmith() {
  const langchainApiKey = process.env.LANGCHAIN_API_KEY;
  const langchainProject = process.env.LANGCHAIN_PROJECT || 'default';
  const langchainTracing = process.env.LANGCHAIN_TRACING_V2 === 'true';

  console.log('🔍 Checking LangSmith credentials...');
  console.log(`   Tracing Enabled: ${langchainTracing ? '✅ Yes' : '❌ No'}`);
  console.log(`   API Key: ${langchainApiKey ? '✅ Found' : '❌ Missing'} (${langchainApiKey ? langchainApiKey.substring(0, 12) + '...' : 'N/A'})`);
  console.log(`   Project: ${langchainProject}`);

  if (!langchainApiKey || !langchainTracing) {
    console.warn('❌ LangSmith not configured or tracing disabled');
    return null;
  }

  try {
    langsmithClient = new Client({
      apiKey: langchainApiKey,
    });
    console.log('✅ LangSmith client initialized successfully');
    return langsmithClient;
  } catch (error) {
    console.error('❌ Failed to initialize LangSmith client:', error);
    return null;
  }
}

function initializeAzureOpenAI() {
  const apiKey = process.env.AZURE_OPENAI_API_KEY;
  const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
  const apiVersion = process.env.AZURE_OPENAI_API_VERSION || '2024-12-01-preview';

  console.log('🔍 Checking Azure OpenAI credentials...');
  console.log(`   API Key: ${apiKey ? '✅ Found' : '❌ Missing'} (${apiKey ? apiKey.substring(0, 8) + '...' : 'N/A'})`);
  console.log(`   Endpoint: ${endpoint ? '✅ Found' : '❌ Missing'} (${endpoint || 'N/A'})`);
  console.log(`   API Version: ${apiVersion}`);

  if (!apiKey || !endpoint) {
    console.warn('❌ Azure OpenAI credentials not found in .env file');
    console.warn('💡 Make sure the .env file contains:');
    console.warn('   AZURE_OPENAI_API_KEY=your_api_key');
    console.warn('   AZURE_OPENAI_ENDPOINT=your_endpoint');
    return null;
  }

  try {
    const baseClient = new AzureOpenAI({
      apiKey: apiKey,
      endpoint: endpoint,
      apiVersion: apiVersion,
    });

    // Wrap with LangSmith tracing if available
    if (langsmithClient) {
      azureClient = wrapOpenAI(baseClient);
      console.log('✅ Azure OpenAI client initialized with LangSmith tracing');
    } else {
      azureClient = baseClient;
      console.log('✅ Azure OpenAI client initialized (no tracing)');
    }

    return azureClient;
  } catch (error) {
    console.error('❌ Failed to initialize Azure OpenAI client:', error);
    return null;
  }
}

// Initialize on startup
initializeLangSmith();
initializeAzureOpenAI();

// Story generation endpoint
app.post('/api/generate-story', async (req, res) => {
  try {
    console.log('🎯 Story generation request received:', req.body);

    const {
      passageTheme,
      passageLength = 500,
      humorLevel = 'Moderate Fun',
      gradeLevel = '4th Grade',
      koreanLevel = 0,
      customVocabulary = '',
      targetLanguage = 'ko' // 'ko', 'ja', 'zh', 'it', 'es', 'ar'
    } = req.body;

    // Language configuration mapping
    const languageNames = {
      'ko': 'Korean (한국어)',
      'ja': 'Japanese (日本語)',
      'zh': 'Mandarin Chinese (中文)',
      'it': 'Italian (Italiano)',
      'es': 'Spanish (Español)',
      'ar': 'Arabic (العربية)'
    };

    const targetLanguageName = languageNames[targetLanguage] || 'Korean (한국어)';

    if (!passageTheme) {
      return res.status(400).json({
        error: 'Passage theme is required',
        message: 'Please provide a passageTheme in the request body'
      });
    }

    // Check if Azure OpenAI is available
    if (!azureClient) {
      console.log('🚧 Azure OpenAI not available, returning mock story');
      return res.json({
        success: true,
        story: {
          title: `The Amazing ${passageTheme} Adventure`,
          englishContent: `This is a mock story about ${passageTheme} for ${gradeLevel} students. The story would be ${passageLength} words long with ${humorLevel} humor level. To get real AI-generated stories, please configure Azure OpenAI credentials in the .env file.`,
          koreanContent: '이것은 모의 이야기입니다. Azure OpenAI 자격 증명을 구성하여 실제 AI 생성 이야기를 받으세요.',
          englishSentences: [`This is a mock story about ${passageTheme} for ${gradeLevel} students.`, `The story would be ${passageLength} words long with ${humorLevel} humor level.`, `To get real AI-generated stories, please configure Azure OpenAI credentials in the .env file.`],
          koreanSentences: ['이것은 모의 이야기입니다.', 'Azure OpenAI 자격 증명을 구성하여 실제 AI 생성 이야기를 받으세요.'],
          nounMappings: { 'story': '이야기', 'students': '학생들', 'words': '단어' },
          customVocabulary: customVocabulary ? customVocabulary.split(',').map(w => w.trim()) : [],
          wordCount: passageLength,
          gradeLevel: gradeLevel,
          koreanLevel: koreanLevel
        }
      });
    }

    // =================================================================
    // 🚀 2-CALL LLM SYSTEM FOR KOREAN BLEND
    // =================================================================
    // Call 1: Generate English story
    // Call 2: Translate to Korean + extract sentence mappings
    // Frontend: Real-time blending using pre-generated content
    // =================================================================

    const deployment = process.env.AZURE_OPENAI_DEPLOYMENT || 'gpt-4.1';

    // ===== CALL 1: Generate English Story =====
    const englishPrompt = `Write a ${passageLength}-word story for ${gradeLevel} students.

Topic/Theme: ${passageTheme}
Humor Level: ${humorLevel}
Grade Level: ${gradeLevel}
${customVocabulary ? `Include these vocabulary words: ${customVocabulary}` : ''}

Requirements:
- Exactly ${passageLength} words (approximately)
- Age-appropriate for ${gradeLevel}
- Educational and engaging content
- ${humorLevel} humor level
- Include themes of friendship, learning, and positive values
- Clear sentence structure for translation
- Use simple, educational vocabulary
- IMPORTANT: Do NOT use any dash characters (-) anywhere in the story. Use periods, commas, and exclamation marks instead for natural flow

Format your response as:
TITLE: [Creative, engaging title for the story]

STORY:
[The complete story here]

Please write a complete, original story that meets these requirements.`;

    console.log('🤖 [Call 1/2] Generating English story...');

    const englishResponse = await azureClient.chat.completions.create({
      model: deployment,
      messages: [
        {
          role: 'system',
          content: 'You are an expert educational content creator specializing in age-appropriate stories for children. Generate engaging, original stories with clear sentence structure suitable for language learning.'
        },
        {
          role: 'user',
          content: englishPrompt
        }
      ],
      max_tokens: Math.max(500, Math.floor(passageLength * 2)),
      temperature: 0.8
    });

    const englishContent = englishResponse.choices[0]?.message?.content || 'Story generation failed';

    // Parse title and story from the response
    let englishTitle = `${passageTheme} Story`;
    let englishStory = englishContent;

    if (englishContent.includes('TITLE:') && englishContent.includes('STORY:')) {
      const titleMatch = englishContent.match(/TITLE:\s*(.+)/);
      const storyMatch = englishContent.match(/STORY:\s*([\s\S]+)/);

      if (titleMatch && storyMatch) {
        englishTitle = titleMatch[1].trim();
        englishStory = storyMatch[1].trim();
      }
    }

    // Remove any dash characters that might have slipped through, but preserve line breaks
    englishTitle = englishTitle.replace(/-/g, ' ').replace(/[ \t]+/g, ' ').trim();
    englishStory = englishStory.replace(/-/g, ' ').replace(/[ \t]+/g, ' ').replace(/\n\s*\n/g, '\n\n').trim();

    const wordCount = englishStory.split(' ').length;

    console.log(`✅ [Call 1/2] Generated "${englishTitle}" - ${wordCount} word English story`);
    console.log(`🎭 Title extraction debug:`, {
      hasTitle: englishContent.includes('TITLE:'),
      hasStory: englishContent.includes('STORY:'),
      firstLines: englishContent.split('\n').slice(0, 3)
    });

    // ===== CALL 2: Translate to Target Language with Word Mappings =====
    const translationPrompt = `You are a ${targetLanguageName} translation expert. Your task is to translate an English story and extract vocabulary words.

ENGLISH STORY TO TRANSLATE:
${englishStory}

INSTRUCTIONS:
1. Translate the story to ${targetLanguageName}, suitable for ${gradeLevel} students
2. PRESERVE all paragraph breaks from the English story
3. Extract 5 nouns, 5 verbs, and 5 adjectives that actually appear in the story
4. Map each English word to its ${targetLanguageName} translation

IMPORTANT: Extract words that are ACTUALLY in the story above, not example words.

Return ONLY this JSON format:
{
  "translation": "Your ${targetLanguageName} translation here with preserved paragraphs",
  "wordMappings": {
    "nouns": {
      "actual_noun_from_story": "${targetLanguageName}_translation",
      "another_real_noun": "${targetLanguageName}_translation",
      "third_real_noun": "${targetLanguageName}_translation",
      "fourth_real_noun": "${targetLanguageName}_translation",
      "fifth_real_noun": "${targetLanguageName}_translation"
    },
    "verbs": {
      "actual_verb_from_story": "${targetLanguageName}_translation",
      "another_real_verb": "${targetLanguageName}_translation",
      "third_real_verb": "${targetLanguageName}_translation",
      "fourth_real_verb": "${targetLanguageName}_translation",
      "fifth_real_verb": "${targetLanguageName}_translation"
    },
    "adjectives": {
      "actual_adjective_from_story": "${targetLanguageName}_translation",
      "another_real_adjective": "${targetLanguageName}_translation",
      "third_real_adjective": "${targetLanguageName}_translation",
      "fourth_real_adjective": "${targetLanguageName}_translation",
      "fifth_real_adjective": "${targetLanguageName}_translation"
    }
  }
}

START WITH { AND END WITH }`;

    console.log(`🤖 [Call 2/2] Translating to ${targetLanguageName}...`);

    const translationResponse = await azureClient.chat.completions.create({
      model: deployment,
      messages: [
        {
          role: 'system',
          content: `You are an expert ${targetLanguageName} translator specializing in educational content for children. Provide accurate, natural ${targetLanguageName} translations that maintain the educational value and emotional impact of the original English text.`
        },
        {
          role: 'user',
          content: translationPrompt
        }
      ],
      max_tokens: Math.max(1200, Math.floor(passageLength * 4)), // Translation + JSON structure needs more space
      temperature: 0.3 // Lower temperature for more accurate translation
    });

    const translatedContent = translationResponse.choices[0]?.message?.content || '{}';

    let translatedStory = '';
    let extractedMappings = {};

    // Extract JSON from response if it exists
    let cleanedContent = translatedContent.trim();
    console.log(`🔍 LLM Response preview:`, cleanedContent.substring(0, 300));

    // Try to find and extract complete JSON
    const jsonMatch = cleanedContent.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        const jsonString = jsonMatch[0];
        console.log(`🔍 Extracted JSON string:`, jsonString.substring(0, 200) + '...');

        const parsed = JSON.parse(jsonString);

        // Extract clean translation
        translatedStory = parsed.translation || '';

        // Ensure translated story doesn't contain JSON artifacts
        if (translatedStory.includes('{') || translatedStory.includes('"wordMappings"')) {
          console.log(`⚠️ ${targetLanguageName} story contains JSON artifacts, cleaning...`);
          translatedStory = extractKoreanText(translatedStory);
        }

        // Combine all word mappings
        if (parsed.wordMappings) {
          extractedMappings = {
            ...(parsed.wordMappings.nouns || {}),
            ...(parsed.wordMappings.verbs || {}),
            ...(parsed.wordMappings.adjectives || {})
          };

          console.log(`✅ [Call 2/2] Generated ${targetLanguageName} translation with ${Object.keys(extractedMappings).length} word mappings`);
          console.log(`🔍 Word mapping categories:`, {
            nouns: Object.keys(parsed.wordMappings.nouns || {}).length,
            verbs: Object.keys(parsed.wordMappings.verbs || {}).length,
            adjectives: Object.keys(parsed.wordMappings.adjectives || {}).length
          });
        } else {
          console.log(`⚠️ No wordMappings found in parsed JSON`);
        }
      } catch (e) {
        console.log(`❌ JSON parsing failed:`, e.message);
        console.log(`🔍 Raw ${targetLanguageName} content:`, translatedContent);

        // Fallback: extract translated text manually
        translatedStory = extractKoreanText(translatedContent);
        console.log(`✅ [Call 2/2] Generated ${targetLanguageName} translation (manual extraction mode)`);
      }
    } else {
      // No JSON found, treat as plain text
      translatedStory = translatedContent;
      console.log(`❌ No JSON structure found in response`);
      console.log(`✅ [Call 2/2] Generated ${targetLanguageName} translation (plain text mode)`);
    }

    // ===== Process Sentences for Frontend Blending =====
    // Split both stories into sentences while preserving paragraph structure
    // IMPORTANT: Preserve paragraph breaks in the main content for frontend processing
    // Quote-aware sentence splitting to preserve dialogue integrity
    function splitSentencesQuoteAware(text) {
      const sentences = [];
      let currentSentence = '';
      let insideQuotes = false;
      
      for (let i = 0; i < text.length; i++) {
        const char = text[i];
        currentSentence += char;
        
        // Track quote state
        if (char === '"') {
          insideQuotes = !insideQuotes;
        }
        
        // Only split on sentence-ending punctuation when outside quotes
        if (!insideQuotes && /[.!?]/.test(char)) {
          // Look ahead - don't split if next char is also punctuation or quote
          const nextChar = i + 1 < text.length ? text[i + 1] : '';
          if (!/[.!?"]/.test(nextChar)) {
            if (currentSentence.trim().length > 0) {
              sentences.push(currentSentence.trim());
              currentSentence = '';
            }
          }
        }
      }
      
      // Add any remaining content
      if (currentSentence.trim().length > 0) {
        sentences.push(currentSentence.trim());
      }
      
      return sentences;
    }
    
    const englishSentences = splitSentencesQuoteAware(englishStory);
    const translatedSentences = splitSentencesQuoteAware(translatedStory);

    // Use extracted mappings or fall back to basic extraction
    const nounMappings = Object.keys(extractedMappings).length > 0
      ? extractedMappings
      : extractBasicNounMappings(englishStory, translatedStory);

    console.log(`📊 Processed: ${englishSentences.length} English sentences, ${translatedSentences.length} ${targetLanguageName} sentences`);

    console.log('🔧 Building response object...');

    // Force immediate execution by wrapping in setTimeout
    setTimeout(() => {
      console.log('🔧 Inside setTimeout - Building response object...');
    }, 0);

    // ===== Return Complete Language Pair =====
    const response = {
      success: true,
      story: {
        title: englishTitle,
        englishContent: englishStory,
        koreanContent: translatedStory, // Keep field name for backward compatibility
        englishSentences: englishSentences,
        koreanSentences: translatedSentences, // Keep field name for backward compatibility
        nounMappings: nounMappings,
        customVocabulary: customVocabulary ? customVocabulary.split(',').map(w => w.trim()) : [],
        targetLanguage: targetLanguage,
        targetLanguageName: targetLanguageName,
        wordCount: wordCount,
        gradeLevel: gradeLevel,
        koreanLevel: koreanLevel
      },
      debug: {
        llmCall1: {
          prompt: englishPrompt,
          response: englishContent
        },
        llmCall2: {
          prompt: translationPrompt,
          response: translatedContent
        },
        wordMappings: extractedMappings,
        extractedMappings: extractedMappings,
        mappingCount: Object.keys(extractedMappings).length > 0 ?
          Object.values(extractedMappings).reduce((sum, category) => {
            return sum + (typeof category === 'object' ? Object.keys(category).length : 0)
          }, 0) : Object.keys(nounMappings).length
      }
    };

    console.log('📤 Sending response with debug data:', JSON.stringify({
      hasDebug: !!response.debug,
      debugMappingCount: response.debug?.mappingCount,
      responseKeys: Object.keys(response)
    }));

    res.json(response);

  } catch (error) {
    console.error('❌ Story generation failed:', error);
    res.status(500).json({
      error: 'Story generation failed',
      message: error.message
    });
  }
});

// =================================================================
// 🛠️ HELPER FUNCTIONS FOR KOREAN BLEND SYSTEM
// =================================================================

/**
 * Extract Korean text from mixed content (removes JSON artifacts)
 * @param {string} content - Content that may contain Korean text mixed with JSON
 * @returns {string} - Clean Korean text
 */
function extractKoreanText(content) {
  // Remove JSON structure markers
  let cleaned = content.replace(/\{[\s\S]*"translation":\s*"/i, '');
  cleaned = cleaned.replace(/",\s*"wordMappings"[\s\S]*\}/, '');
  cleaned = cleaned.replace(/[{}"\[\]]/g, '');

  // Extract lines that contain Korean characters
  const lines = cleaned.split('\n');
  const koreanLines = lines.filter(line =>
    /[\u3131-\u3163\u3AC0-\u3D7F\uAC00-\uD7AF]/.test(line) &&
    !line.includes('nouns') &&
    !line.includes('verbs') &&
    !line.includes('adjectives')
  );

  return koreanLines.join('\n').trim();
}

/**
 * Extract basic noun mappings between English and Korean stories
 * This creates simple word-to-word mappings for hint generation
 *
 * @param {string} englishStory - The original English story
 * @param {string} koreanStory - The Korean translation
 * @returns {Object} - Mapping of English words to Korean words
 */
function extractBasicNounMappings(englishStory, koreanStory) {
  // Basic noun mappings for common educational words
  // In a more advanced system, this could use NLP to extract actual mappings
  // For now, we'll use common educational vocabulary mappings

  const commonMappings = {
    'cat': '고양이',
    'dog': '개',
    'bird': '새',
    'fish': '물고기',
    'tree': '나무',
    'flower': '꽃',
    'sun': '태양',
    'moon': '달',
    'star': '별',
    'house': '집',
    'school': '학교',
    'book': '책',
    'friend': '친구',
    'family': '가족',
    'water': '물',
    'food': '음식',
    'apple': '사과',
    'ball': '공',
    'car': '자동차',
    'bike': '자전거',
    'park': '공원',
    'home': '집',
    'mother': '엄마',
    'father': '아빠',
    'teacher': '선생님',
    'student': '학생',
    'child': '아이',
    'boy': '소년',
    'girl': '소녀',
    'day': '날',
    'night': '밤',
    'morning': '아침',
    'afternoon': '오후',
    'evening': '저녁',
    'game': '게임',
    'story': '이야기',
    'adventure': '모험',
    'journey': '여행',
    'pokemon': '포켓몬',
    'pikachu': '피카츄'
  };

  // Find which common words appear in the English story
  const foundMappings = {};
  const englishWords = englishStory.toLowerCase().match(/\b\w+\b/g) || [];

  englishWords.forEach(word => {
    if (commonMappings[word]) {
      foundMappings[word] = commonMappings[word];
    }
  });

  console.log(`📝 Found ${Object.keys(foundMappings).length} noun mappings:`, foundMappings);

  return foundMappings;
}

// =================================================================
// 🧠 QUIZ GENERATION SYSTEM - HELPER FUNCTIONS
// =================================================================

/**
 * Quiz difficulty framework mapping comprehension skills to grade levels
 */
const QUIZ_DIFFICULTY_FRAMEWORK = {
  basic: {
    "2nd": ["literal_facts", "character_identification", "simple_sequence"],
    "3rd": ["literal_facts", "character_identification", "simple_sequence"],
    "4th": ["main_idea", "cause_effect", "simple_inference"],
    "5th": ["main_idea", "cause_effect", "simple_inference"],
    "6th": ["theme_identification", "character_motivation", "basic_analysis"]
  },
  intermediate: {
    "2nd": ["simple_inference", "character_feelings", "basic_prediction"],
    "3rd": ["simple_inference", "character_feelings", "basic_prediction"],
    "4th": ["theme_analysis", "complex_sequence", "vocabulary_context"],
    "5th": ["theme_analysis", "complex_sequence", "vocabulary_context"],
    "6th": ["author_purpose", "compare_contrast", "advanced_inference"]
  },
  challenging: {
    "2nd": ["advanced_inference", "theme_identification", "vocabulary_analysis"],
    "3rd": ["advanced_inference", "theme_identification", "vocabulary_analysis"],
    "4th": ["critical_analysis", "author_craft", "complex_relationships"],
    "5th": ["critical_analysis", "author_craft", "complex_relationships"],
    "6th": ["literary_analysis", "synthesis", "argument_evaluation"]
  }
};

/**
 * Select source content based on Korean level
 * @param {string} englishContent - Original English story
 * @param {string} koreanContent - Korean translation
 * @param {number} koreanLevel - Korean blend level (0-10)
 * @returns {object} Content selection strategy
 */
function selectSourceContent(englishContent, koreanContent, koreanLevel) {
  if (koreanLevel <= 3) {
    // Focus on English comprehension with Korean vocabulary hints
    return {
      primary: englishContent,
      secondary: koreanContent,
      questionLanguage: 'english',
      vocabularyFocus: 'korean_hints'
    };
  } else if (koreanLevel <= 7) {
    // Mixed language comprehension
    return {
      primary: englishContent, // Use English as base for now
      secondary: koreanContent,
      questionLanguage: 'mixed',
      vocabularyFocus: 'bilingual'
    };
  } else {
    // Korean comprehension focus with English support
    return {
      primary: koreanContent || englishContent,
      secondary: englishContent,
      questionLanguage: 'korean',
      vocabularyFocus: 'english_support'
    };
  }
}

/**
 * Select unique comprehension skills based on difficulty and grade level
 * @param {string} difficulty - Quiz difficulty level
 * @param {string} gradeLevel - Target grade level
 * @param {number} totalQuestions - Total questions needed
 * @returns {array} Array of unique comprehension skills
 */
function selectSkillsByDifficulty(difficulty, gradeLevel, totalQuestions) {
  const gradeKey = gradeLevel.replace(' Grade', '').replace('th', '').replace('nd', '').replace('rd', '').replace('st', '');
  const skills = QUIZ_DIFFICULTY_FRAMEWORK[difficulty]?.[gradeKey] || QUIZ_DIFFICULTY_FRAMEWORK[difficulty]?.["4th"] || [];
  
  // Ensure we have enough unique skills
  const allSkills = [
    ...skills,
    "literal_comprehension", "main_idea", "character_analysis", "cause_effect",
    "vocabulary_context", "inference", "theme_identification", "sequence_events"
  ];
  
  // Remove duplicates and return required number
  const uniqueSkills = [...new Set(allSkills)];
  return uniqueSkills.slice(0, totalQuestions);
}

/**
 * Generate mock quiz for fallback scenarios
 * @param {number} multipleChoice - Number of multiple choice questions
 * @param {number} fillInBlank - Number of fill-in-blank questions
 * @param {string} gradeLevel - Target grade level
 * @param {string} difficulty - Quiz difficulty
 * @returns {object} Mock quiz object
 */
function generateMockQuiz(multipleChoice, fillInBlank, gradeLevel, difficulty) {
  const questions = [];
  
  // Generate mock multiple choice questions
  for (let i = 0; i < multipleChoice; i++) {
    questions.push({
      id: `mc_${i + 1}`,
      type: "multiple-choice",
      question: `What was the main theme of this ${gradeLevel} story?`,
      options: [
        "Adventure and discovery",
        "Friendship and teamwork", 
        "Learning and growth",
        "Overcoming challenges"
      ],
      correct_answer: "Adventure and discovery",
      explanation: "The story focused on the exciting journey and new discoveries made by the characters.",
      skill_tested: "main_idea",
      difficulty_level: difficulty,
      korean_integration: false
    });
  }
  
  // Generate mock fill-in-blank questions
  for (let i = 0; i < fillInBlank; i++) {
    questions.push({
      id: `fib_${i + 1}`,
      type: "fill-in-blank",
      question: "The adventure taught important lessons about _____ and curiosity.",
      correct_answer: "friendship",
      explanation: "The story emphasized how friendship helps characters overcome challenges.",
      skill_tested: "theme_identification",
      difficulty_level: difficulty,
      korean_integration: false
    });
  }
  
  return {
    questions: questions,
    metadata: {
      total_questions: multipleChoice + fillInBlank,
      skills_covered: ["main_idea", "theme_identification"],
      korean_vocabulary_count: 0,
      estimated_completion_time: Math.ceil((multipleChoice + fillInBlank) * 1.5),
      generation_method: "mock_fallback"
    }
  };
}

/**
 * Enhance grade level for more challenging questions
 * @param {string} gradeLevel - Original grade level
 * @returns {string} Enhanced grade level
 */
function enhanceGradeLevel(gradeLevel) {
  const gradeMapping = {
    '2nd Grade': '3rd Grade',
    '3rd Grade': '4th Grade', 
    '4th Grade': '5th Grade',
    '5th Grade': '6th Grade',
    '6th Grade': '7th Grade',
    '7th Grade': '8th Grade',
    '8th Grade': '9th Grade'
  };
  
  return gradeMapping[gradeLevel] || gradeLevel;
}

/**
 * Calculate semantic similarity between two strings
 * @param {string} answer1 - First answer
 * @param {string} answer2 - Second answer  
 * @returns {number} Similarity score (0-1)
 */
function calculateSemanticSimilarity(answer1, answer2) {
  if (!answer1 || !answer2) return 0;
  
  // Normalize answers
  const normalize = (str) => str.toLowerCase().trim()
    .replace(/[^\w\s]/g, '') // Remove punctuation
    .replace(/\s+/g, ' '); // Normalize whitespace
  
  const norm1 = normalize(answer1);
  const norm2 = normalize(answer2);
  
  // Exact match
  if (norm1 === norm2) return 1.0;
  
  // Handle common variations
  const variations = [
    // Plural/singular
    [/s$/, ''], [/es$/, ''], [/ies$/, 'y'],
    // Common conjugations
    [/ed$/, ''], [/ing$/, ''], [/er$/, ''], [/est$/, ''],
    // Articles
    [/^(a|an|the)\s+/, '']
  ];
  
  let bestScore = 0;
  
  // Try variations of both answers
  const getVariations = (text) => {
    const vars = [text];
    variations.forEach(([pattern, replacement]) => {
      if (pattern.test(text)) {
        vars.push(text.replace(pattern, replacement));
      }
      // Also try adding common endings
      if (typeof replacement === 'string' && replacement !== '') {
        vars.push(text + replacement);
      }
    });
    return vars;
  };
  
  const vars1 = getVariations(norm1);
  const vars2 = getVariations(norm2);
  
  // Check all combinations
  for (const v1 of vars1) {
    for (const v2 of vars2) {
      if (v1 === v2) return 0.95; // High similarity for variations
      
      // Levenshtein distance for typos
      const distance = levenshteinDistance(v1, v2);
      const maxLen = Math.max(v1.length, v2.length);
      const similarity = maxLen > 0 ? 1 - (distance / maxLen) : 0;
      bestScore = Math.max(bestScore, similarity);
    }
  }
  
  // For phrases, check if key words match
  if (norm1.includes(' ') || norm2.includes(' ')) {
    const words1 = norm1.split(' ').filter(w => w.length > 2);
    const words2 = norm2.split(' ').filter(w => w.length > 2);
    
    if (words1.length > 0 && words2.length > 0) {
      let matchingWords = 0;
      for (const word1 of words1) {
        for (const word2 of words2) {
          if (calculateSemanticSimilarity(word1, word2) > 0.8) {
            matchingWords++;
            break;
          }
        }
      }
      const phraseScore = matchingWords / Math.max(words1.length, words2.length);
      bestScore = Math.max(bestScore, phraseScore);
    }
  }
  
  return bestScore;
}

/**
 * Calculate Levenshtein distance between two strings
 * @param {string} a - First string
 * @param {string} b - Second string
 * @returns {number} Edit distance
 */
function levenshteinDistance(a, b) {
  const matrix = Array(b.length + 1).fill().map(() => Array(a.length + 1).fill(0));
  
  for (let i = 0; i <= a.length; i++) matrix[0][i] = i;
  for (let j = 0; j <= b.length; j++) matrix[j][0] = j;
  
  for (let j = 1; j <= b.length; j++) {
    for (let i = 1; i <= a.length; i++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j - 1][i] + 1,     // deletion
        matrix[j][i - 1] + 1,     // insertion
        matrix[j - 1][i - 1] + cost // substitution
      );
    }
  }
  
  return matrix[b.length][a.length];
}

/**
 * Generate quiz questions using Azure OpenAI (3rd LLM call)
 * @param {object} params - Generation parameters
 * @returns {object} Generated quiz object
 */
async function generateQuizQuestions({ sourceContent, vocabularyMappings, settings }) {
  const { gradeLevel, multipleChoice, fillInBlank, quizDifficulty, koreanLevel, originalGradeLevel } = settings;
  const totalQuestions = multipleChoice + fillInBlank;
  
  // Select unique skills to test
  const skillsToTest = selectSkillsByDifficulty(quizDifficulty, gradeLevel, totalQuestions);
  
  // Determine if we should use phrase-based answers for higher levels
  const gradeNumber = parseInt(gradeLevel.match(/\d+/)?.[0] || '4');
  const usePhraseBased = gradeNumber >= 5;
  
  const deployment = process.env.AZURE_OPENAI_DEPLOYMENT || 'gpt-4.1';
  
  // Build comprehensive quiz generation prompt
  const quizPrompt = `You are an expert educational content creator specializing in reading comprehension assessment for children.

STORY TO ANALYZE:
${sourceContent.primary}

EXTRACTED VOCABULARY:
${JSON.stringify(vocabularyMappings)}

QUIZ PARAMETERS:
- Target Grade Level: ${gradeLevel} (Enhanced from ${originalGradeLevel || gradeLevel} for increased challenge)
- Difficulty: ${quizDifficulty}
- Multiple Choice Questions: ${multipleChoice}
- Fill-in-Blank Questions: ${fillInBlank}
- Korean Level: ${koreanLevel}
- Skills to Test: ${skillsToTest.join(', ')}
- Use Phrase-Based Answers: ${usePhraseBased}

CRITICAL REQUIREMENTS:
1. Generate exactly ${multipleChoice} multiple choice and ${fillInBlank} fill-in-blank questions
2. Each question must test a DIFFERENT comprehension skill (no duplicates)
3. Progress from basic recall to higher-order thinking
4. Use vocabulary from the extracted word mappings when possible
5. Ensure questions are appropriately challenging for ${gradeLevel} reading level
6. Include Korean vocabulary integration based on Korean Level ${koreanLevel}
7. Questions must be answerable from the story content provided
8. ${usePhraseBased ? 'For fill-in-blank questions, use PHRASES (2-4 words) instead of single words for more advanced thinking' : 'For fill-in-blank questions, use single words or short phrases'}
9. For fill-in-blank questions, provide SIMPLE, NATURAL answers that students would write (e.g., "friendship" not "friendship and fair playteamwork and honestybeing good friendsplaying fairly")
10. CRITICAL: The "correct_answer" field must contain ONLY the primary, most natural answer (e.g., "park" not "park to play basketballgame in the parkafternoon basketball gamepark for a game")

KOREAN INTEGRATION GUIDELINES:
- Korean Level 0-3: Questions in English, Korean vocabulary hints in answers
- Korean Level 4-7: Mixed language questions, bilingual comprehension
- Korean Level 8-10: Questions in Korean with English support

FORMAT REQUIREMENTS:
Return ONLY valid JSON with this exact structure:
{
  "questions": [
    {
      "id": "q1",
      "type": "multiple-choice",
      "question": "Question text here",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct_answer": "Option A",
      "explanation": "Why this answer is correct",
      "skill_tested": "main_idea",
      "difficulty_level": "${quizDifficulty}",
      "korean_integration": ${koreanLevel > 0},
      "vocabulary_used": ["word1", "word2"]
    },
    {
      "id": "q2", 
      "type": "fill-in-blank",
      "question": "The main character learned about _______.",
      "correct_answer": "friendship",
      "explanation": "The story shows how friendship is important",
      "skill_tested": "theme_identification",
      "difficulty_level": "${quizDifficulty}",
      "korean_integration": ${koreanLevel > 0},
      "vocabulary_used": ["friendship"]
    }
  ],
  "metadata": {
    "total_questions": ${totalQuestions},
    "skills_covered": ${JSON.stringify(skillsToTest)},
    "korean_vocabulary_count": ${Object.keys(vocabularyMappings).length},
    "estimated_completion_time": ${Math.ceil(totalQuestions * 1.5)}
  }
}

Generate educational, engaging questions that help children learn while testing their comprehension of the story.`;

  console.log('🤖 [Call 3/3] Generating quiz questions...');

  const quizResponse = await azureClient.chat.completions.create({
    model: deployment,
    messages: [
      {
        role: 'system',
        content: 'You are an expert educational content creator specializing in reading comprehension assessment for children. Generate engaging, educational quiz questions that test different comprehension skills without redundancy.'
      },
      {
        role: 'user',
        content: quizPrompt
      }
    ],
    max_tokens: Math.max(1500, totalQuestions * 200),
    temperature: 0.3 // Lower temperature for consistent, educational content
  });

  const quizContent = quizResponse.choices[0]?.message?.content || '{}';
  
  try {
    // Parse JSON response
    const cleanedContent = quizContent.trim();
    const jsonMatch = cleanedContent.match(/\{[\s\S]*\}/);
    
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      console.log(`✅ [Call 3/3] Generated ${parsed.questions?.length || 0} quiz questions`);
      return parsed;
    } else {
      throw new Error('No valid JSON found in response');
    }
  } catch (error) {
    console.error('❌ Quiz JSON parsing failed:', error.message);
    console.log('🔍 Raw quiz response:', quizContent.substring(0, 500));
    
    // Fallback to mock quiz
    return generateMockQuiz(multipleChoice, fillInBlank, gradeLevel, quizDifficulty);
  }
}

// =================================================================
// 🧠 QUIZ GENERATION ENDPOINT - 3RD LLM CALL
// =================================================================

// Quiz generation endpoint
app.post('/api/generate-quiz', async (req, res) => {
  try {
    console.log('🎯 Quiz generation request received:', req.body);

    const {
      englishContent,
      koreanContent,
      nounMappings = {},
      gradeLevel = '4th Grade',
      multipleChoice = 3,
      fillInBlank = 2,
      quizDifficulty = 'intermediate',
      koreanLevel = 0
    } = req.body;

    // Increase difficulty by 1 grade level for more challenging questions
    const enhancedGradeLevel = enhanceGradeLevel(gradeLevel);

    // Validate required inputs
    if (!englishContent && !koreanContent) {
      return res.status(400).json({
        error: 'Story content is required',
        message: 'Please provide either englishContent or koreanContent'
      });
    }

    // Check if Azure OpenAI is available
    if (!azureClient) {
      console.log('🚧 Azure OpenAI not available, returning mock quiz');
      return res.json({
        success: true,
        quiz: generateMockQuiz(multipleChoice, fillInBlank, gradeLevel, quizDifficulty)
      });
    }

    // Select source content based on Korean level
    const sourceContent = selectSourceContent(englishContent, koreanContent, koreanLevel);
    
    // Generate quiz questions using 3rd LLM call with enhanced difficulty
    const quizResponse = await generateQuizQuestions({
      sourceContent,
      vocabularyMappings: nounMappings,
      settings: { gradeLevel: enhancedGradeLevel, multipleChoice, fillInBlank, quizDifficulty, koreanLevel, originalGradeLevel: gradeLevel }
    });

    console.log(`✅ Generated quiz with ${quizResponse.questions.length} questions`);

    res.json({
      success: true,
      quiz: quizResponse
    });

  } catch (error) {
    console.error('❌ Quiz generation failed:', error);
    res.status(500).json({
      error: 'Quiz generation failed',
      message: error.message,
      // Fallback to mock quiz on error
      quiz: generateMockQuiz(req.body.multipleChoice || 3, req.body.fillInBlank || 2, 
                           req.body.gradeLevel || '4th Grade', req.body.quizDifficulty || 'intermediate')
    });
  }
});

// Azure Speech Services for child-safe text-to-speech
const speechSdk = require('microsoft-cognitiveservices-speech-sdk');

// Semantic answer validation endpoint
app.post('/api/validate-answer', async (req, res) => {
  try {
    const { userAnswer, correctAnswer, questionType, gradeLevel } = req.body;

    if (!userAnswer || !correctAnswer) {
      return res.status(400).json({ error: 'Both userAnswer and correctAnswer are required' });
    }

    // Calculate semantic similarity
    const similarity = calculateSemanticSimilarity(userAnswer, correctAnswer);
    
    // Determine thresholds based on grade level and question type
    const gradeNumber = parseInt(gradeLevel?.match(/\d+/)?.[0] || '4');
    const isHigherGrade = gradeNumber >= 5;
    
    let threshold = 0.9; // Default 90% similarity
    
    if (questionType === 'fill_in_blank') {
      if (isHigherGrade) {
        threshold = 0.85; // More lenient for phrase-based answers
      } else {
        threshold = 0.9; // Standard for single words
      }
    }

    const isCorrect = similarity >= threshold;
    
    console.log(`🔍 Answer validation: "${userAnswer}" vs "${correctAnswer}" = ${similarity.toFixed(3)} (threshold: ${threshold})`);

    res.json({
      success: true,
      isCorrect,
      similarity: Math.round(similarity * 100) / 100,
      threshold,
      feedback: isCorrect 
        ? 'Correct! Great job!' 
        : similarity > 0.7 
          ? 'Very close! Try to be more specific.' 
          : 'Not quite right. Think about the story again.',
      details: {
        exactMatch: similarity === 1.0,
        closeMatch: similarity >= 0.95,
        semanticMatch: similarity >= threshold,
        gradeLevel,
        questionType
      }
    });

  } catch (error) {
    console.error('❌ Answer validation failed:', error);
    res.status(500).json({ error: 'Answer validation failed' });
  }
});

// Child content safety validation
function validateChildContent(text) {
  const inappropriateWords = ['bad', 'violence', 'adult']; // Basic example
  const lowerText = text.toLowerCase();

  for (const word of inappropriateWords) {
    if (lowerText.includes(word)) {
      return {
        isAppropriate: false,
        reason: `Content contains inappropriate word: ${word}`
      };
    }
  }

  return { isAppropriate: true };
}

// Voice management endpoint - get available Azure OpenAI voices
app.get('/api/voices', async (_req, res) => {
  try {
    // Azure OpenAI TTS voices with descriptions
    const azureVoices = [
      {
        id: 'alloy',
        name: 'Alloy',
        description: 'Neutral and balanced voice',
        gender: 'neutral',
        recommended: false
      },
      {
        id: 'ash',
        name: 'Ash',
        description: 'Warm and expressive voice',
        gender: 'neutral',
        recommended: false
      },
      {
        id: 'ballad',
        name: 'Ballad',
        description: 'Calm and soothing voice',
        gender: 'neutral',
        recommended: false
      },
      {
        id: 'coral',
        name: 'Coral',
        description: 'Bright and friendly voice',
        gender: 'female',
        recommended: true,
        childFriendly: true
      },
      {
        id: 'echo',
        name: 'Echo',
        description: 'Clear and articulate voice',
        gender: 'male',
        recommended: false
      },
      {
        id: 'fable',
        name: 'Fable',
        description: 'Storytelling voice',
        gender: 'neutral',
        recommended: true,
        childFriendly: true
      },
      {
        id: 'nova',
        name: 'Nova',
        description: 'Energetic and engaging voice',
        gender: 'female',
        recommended: true,
        childFriendly: true,
        default: true
      },
      {
        id: 'onyx',
        name: 'Onyx',
        description: 'Deep and authoritative voice',
        gender: 'male',
        recommended: false
      },
      {
        id: 'sage',
        name: 'Sage',
        description: 'Gentle and wise voice',
        gender: 'neutral',
        recommended: true,
        childFriendly: true
      },
      {
        id: 'shimmer',
        name: 'Shimmer',
        description: 'Playful and animated voice',
        gender: 'female',
        recommended: true,
        childFriendly: true
      }
    ];

    res.json({
      success: true,
      voices: azureVoices,
      defaultVoice: 'nova',
      provider: 'Azure OpenAI',
      count: azureVoices.length
    });

  } catch (error) {
    console.error('❌ Voice management error:', error);
    res.status(500).json({ error: 'Voice service unavailable' });
  }
});

// Multilingual TTS endpoint - Azure OpenAI TTS for all languages (English, Korean, Mixed)
app.post('/api/text-to-speech', async (req, res) => {
  try {
    const { text, voice, speed, childSafe, language } = req.body;

    // Validate required parameters
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    // Child safety validation
    if (childSafe !== false) { // Default to child-safe mode
      const safetyCheck = validateChildContent(text);
      if (!safetyCheck.isAppropriate) {
        console.log('🚫 Child safety check failed:', safetyCheck.reason);
        return res.status(400).json({
          error: 'Content not appropriate for children',
          details: safetyCheck.reason
        });
      }
    }

    // Use Azure OpenAI TTS for ALL languages (supports English, Korean, and mixed multilingual text)
    console.log('🌐 Using Azure OpenAI TTS (multilingual support)');
    return await generateAzureOpenAITTS(text, voice, speed, res);

  } catch (error) {
    console.error('❌ TTS generation failed:', error);

    // Fallback to Azure Speech Services for Korean if Azure OpenAI fails
    const hasKorean = /[\u3131-\u3163\uac00-\ud7a3]/.test(text);
    if (hasKorean) {
      console.log('⚠️ Azure OpenAI failed, trying Azure Speech fallback for Korean...');
      try {
        return await generateKoreanTTS(text, speed, res);
      } catch (fallbackError) {
        console.error('❌ Fallback also failed:', fallbackError);
      }
    }

    res.status(500).json({
      error: 'Speech generation failed',
      details: error.message
    });
  }
});

// Korean TTS using Azure Speech Services (better Korean support)
async function generateKoreanTTS(text, speed, res) {
  try {
    // Check Azure Speech credentials
    const speechKey = process.env.AZURE_SPEECH_KEY;
    const speechRegion = process.env.AZURE_SPEECH_REGION;

    if (!speechKey || !speechRegion) {
      console.error('❌ Azure Speech credentials not found');
      return res.status(500).json({ error: 'Korean TTS service not configured' });
    }

    // Configure Azure Speech for Korean
    const speechConfig = speechSdk.SpeechConfig.fromSubscription(speechKey, speechRegion);
    speechConfig.speechSynthesisVoiceName = 'ko-KR-SunHiNeural'; // Premium Korean voice
    speechConfig.speechSynthesisOutputFormat = speechSdk.SpeechSynthesisOutputFormat.Audio24Khz96KBitRateMonoMp3;

    // Create SSML for Korean
    const adjustedSpeed = speed || 1.0;
    const ssml = `
      <speak version="1.0" xml:lang="ko-KR">
        <prosody rate="${adjustedSpeed}" pitch="+3%">
          ${text}
        </prosody>
      </speak>
    `;

    console.log('🎤 Using premium Korean neural voice: ko-KR-SunHiNeural');

    // Create synthesizer
    const synthesizer = new speechSdk.SpeechSynthesizer(speechConfig);

    // Synthesize speech
    const result = await new Promise((resolve, reject) => {
      synthesizer.speakSsmlAsync(
        ssml,
        (result) => {
          synthesizer.close();
          resolve(result);
        },
        (error) => {
          synthesizer.close();
          reject(error);
        }
      );
    });

    if (result.reason === speechSdk.ResultReason.SynthesizingAudioCompleted) {
      const audioBase64 = Buffer.from(result.audioData).toString('base64');
      console.log('✅ Korean audio generated successfully');

      res.json({
        success: true,
        audio: `data:audio/mp3;base64,${audioBase64}`,
        duration: result.audioData.byteLength,
        childSafe: true,
        voice: 'ko-KR-SunHiNeural',
        language: 'korean',
        provider: 'Azure Speech Services'
      });
    } else {
      console.error('❌ Korean speech synthesis failed:', result.errorDetails);
      res.status(500).json({ error: 'Korean speech synthesis failed' });
    }

  } catch (error) {
    console.error('❌ Korean TTS generation failed:', error);
    res.status(500).json({ error: 'Korean TTS failed', details: error.message });
  }
}

// Multilingual TTS using Azure OpenAI (supports English, Korean, and mixed languages)
async function generateAzureOpenAITTS(text, voice, speed, res) {
  try {
    // Get Azure OpenAI credentials
    const apiKey = process.env.AZURE_OPENAI_API_KEY;
    const ttsServiceBase = process.env.TTS_SERVICE_API_BASE;
    const ttsDeployment = 'gpt-4o-mini-tts-2';

    if (!apiKey || !ttsServiceBase) {
      console.error('❌ Azure OpenAI TTS credentials not found');
      return res.status(500).json({ error: 'TTS service not configured' });
    }

    // Available Azure OpenAI voices
    const availableVoices = [
      'alloy', 'ash', 'ballad', 'coral', 'echo',
      'fable', 'nova', 'onyx', 'sage', 'shimmer'
    ];

    // Smart voice matching - handles browser voice names gracefully
    const selectedVoice = (() => {
      if (!voice) return 'nova'; // Default child-friendly voice

      const lowerVoice = voice.toLowerCase();

      // Exact match
      if (availableVoices.includes(lowerVoice)) {
        return lowerVoice;
      }

      // Partial match (e.g., "Samantha (English)" → check for partial matches)
      const partialMatch = availableVoices.find(v =>
        lowerVoice.includes(v) || v.includes(lowerVoice)
      );
      if (partialMatch) {
        console.log(`🎵 Mapped browser voice "${voice}" to Azure voice "${partialMatch}"`);
        return partialMatch;
      }

      // Fallback to default
      console.log(`🎵 Unknown voice "${voice}", using default "nova"`);
      return 'nova';
    })();

    // Detect language in text for logging
    const hasKorean = /[\u3131-\u3163\uac00-\ud7a3]/.test(text);
    const hasEnglish = /[a-zA-Z]/.test(text);
    const languageType = hasKorean && hasEnglish ? 'mixed' : hasKorean ? 'korean' : 'english';

    console.log('🎤 Using Azure OpenAI TTS voice:', selectedVoice);
    console.log('🌐 Detected language type:', languageType);
    console.log('🎵 Generating audio for text:', text.substring(0, 100) + '...');

    // Construct Azure OpenAI TTS endpoint
    const ttsUrl = `${ttsServiceBase}/openai/deployments/${ttsDeployment}/audio/speech?api-version=2025-03-01-preview`;

    // Make request to Azure OpenAI TTS API
    const fetch = (await import('node-fetch')).default;
    const response = await fetch(ttsUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: ttsDeployment,
        input: text,
        voice: selectedVoice,
        speed: speed || 1.0
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Azure OpenAI TTS API error:', response.status, errorText);
      return res.status(response.status).json({
        error: 'TTS generation failed',
        details: errorText
      });
    }

    // Get audio data as buffer
    const audioBuffer = await response.buffer();
    const audioBase64 = audioBuffer.toString('base64');

    console.log(`✅ Multilingual audio generated successfully (${languageType})`);
    console.log('📊 Audio size:', audioBuffer.length, 'bytes');

    res.json({
      success: true,
      audio: `data:audio/mp3;base64,${audioBase64}`,
      duration: audioBuffer.length,
      childSafe: true,
      voice: selectedVoice,
      language: languageType, // 'english', 'korean', or 'mixed'
      provider: 'Azure OpenAI TTS (Multilingual)',
      availableVoices: availableVoices
    });

  } catch (error) {
    console.error('❌ Azure OpenAI TTS generation failed:', error);
    res.status(500).json({
      error: 'TTS generation failed',
      details: error.message
    });
  }
}

// Quiz hint generation endpoint with child safety
app.post('/api/generate-quiz-hint', async (req, res) => {
  try {
    const { questionText, storyContent, gradeLevel, childSafe } = req.body;

    // Validate required parameters
    if (!questionText || !storyContent) {
      return res.status(400).json({ error: 'Question text and story content are required' });
    }

    // Child safety validation
    if (childSafe !== false) { // Default to child-safe mode
      const questionSafety = validateChildContent(questionText);
      const storySafety = validateChildContent(storyContent);

      if (!questionSafety.isAppropriate) {
        console.log('🚫 Question content failed child safety check:', questionSafety.reason);
        return res.status(400).json({
          error: 'Question content not appropriate for children',
          details: questionSafety.reason
        });
      }

      if (!storySafety.isAppropriate) {
        console.log('🚫 Story content failed child safety check:', storySafety.reason);
        return res.status(400).json({
          error: 'Story content not appropriate for children',
          details: storySafety.reason
        });
      }
    }

    // Check Azure OpenAI client
    if (!azureClient) {
      console.error('❌ Azure OpenAI client not configured');
      return res.status(500).json({ error: 'AI service not configured' });
    }

    // Generate educational hint using Azure OpenAI
    const hintPrompt = `
You are a friendly, encouraging reading tutor for children in ${gradeLevel || '4th'} grade.
A child is struggling with this reading comprehension question and needs a helpful hint.

STORY EXCERPT:
${storyContent.substring(0, 800)}...

QUESTION:
${questionText}

Create a helpful hint that:
1. Encourages the child to think for themselves
2. Points them to the right part of the story without giving away the answer
3. Uses simple, age-appropriate language
4. Builds confidence with positive tone
5. Includes an emoji to make it friendly

Rules:
- Don't give the answer directly
- Use words a ${gradeLevel || '4th'} grader can understand
- Keep it under 50 words
- Be encouraging and supportive
- Include one relevant emoji

Example format: "🔍 Look for clues in the second paragraph about how the character felt when..."
`;

    const completion = await azureClient.chat.completions.create({
      model: process.env.AZURE_OPENAI_DEPLOYMENT || 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an expert children\'s reading tutor who creates helpful, encouraging hints for reading comprehension questions.'
        },
        {
          role: 'user',
          content: hintPrompt
        }
      ],
      max_tokens: 150,
      temperature: 0.7,
      top_p: 0.9
    });

    const hint = completion.choices[0]?.message?.content?.trim();

    if (!hint) {
      throw new Error('No hint generated');
    }

    // Child safety validation on generated hint
    if (childSafe !== false) {
      const hintSafety = validateChildContent(hint);
      if (!hintSafety.isAppropriate) {
        console.log('🚫 Generated hint failed child safety check:', hintSafety.reason);
        return res.status(500).json({
          error: 'Generated hint not appropriate for children'
        });
      }
    }

    console.log('✅ Quiz hint generated successfully');
    res.json({
      success: true,
      hint: hint,
      gradeLevel: gradeLevel || '4th',
      childSafe: true,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Quiz hint generation failed:', error);
    res.status(500).json({
      error: 'Hint generation failed',
      details: error.message
    });
  }
});

// Korean phonetics API endpoint for pronunciation assistance
app.post('/api/korean-phonetics', async (req, res) => {
  try {
    const { koreanText, displayType, childSafe } = req.body;

    // Validate required parameters
    if (!koreanText) {
      return res.status(400).json({ error: 'Korean text is required' });
    }

    // Child safety validation
    if (childSafe !== false) {
      const safetyCheck = validateChildContent(koreanText);
      if (!safetyCheck.isAppropriate) {
        console.log('🚫 Korean text failed child safety check:', safetyCheck.reason);
        return res.status(400).json({
          error: 'Korean text not appropriate for children',
          details: safetyCheck.reason
        });
      }
    }

    // Basic Korean phonetics mapping (simplified for children)
    const generatePhonetics = (text) => {
      // Simple phonetic mapping for common Korean syllables
      const phoneticMap = {
        // Basic vowels
        '아': { simplified: 'ah', ipa: 'a' },
        '어': { simplified: 'uh', ipa: 'ʌ' },
        '오': { simplified: 'oh', ipa: 'o' },
        '우': { simplified: 'oo', ipa: 'u' },
        '으': { simplified: 'eu', ipa: 'ɯ' },
        '이': { simplified: 'ee', ipa: 'i' },

        // Common syllables
        '안': { simplified: 'ahn', ipa: 'an' },
        '녕': { simplified: 'nyung', ipa: 'njʌŋ' },
        '하': { simplified: 'ha', ipa: 'ha' },
        '세': { simplified: 'se', ipa: 'se' },
        '요': { simplified: 'yo', ipa: 'jo' },
        '만': { simplified: 'man', ipa: 'man' },
        '나': { simplified: 'na', ipa: 'na' },
        '다': { simplified: 'da', ipa: 'da' },
        '라': { simplified: 'ra', ipa: 'ɾa' },
        '사': { simplified: 'sa', ipa: 'sa' },
        '가': { simplified: 'ga', ipa: 'ga' },
        '감': { simplified: 'gam', ipa: 'gam' },
        '사': { simplified: 'sa', ipa: 'sa' },
        '합': { simplified: 'hap', ipa: 'hap' },
        '니': { simplified: 'ni', ipa: 'ni' },
        '다': { simplified: 'da', ipa: 'da' },

        // Numbers
        '일': { simplified: 'eel', ipa: 'il' },
        '이': { simplified: 'ee', ipa: 'i' },
        '삼': { simplified: 'sam', ipa: 'sam' },
        '사': { simplified: 'sa', ipa: 'sa' },
        '오': { simplified: 'oh', ipa: 'o' },

        // Common words
        '안녕': { simplified: 'ahn-nyung', ipa: 'annjʌŋ' },
        '하세요': { simplified: 'ha-se-yo', ipa: 'hasejo' },
        '감사': { simplified: 'gam-sa', ipa: 'gamsa' },
        '합니다': { simplified: 'hap-ni-da', ipa: 'hamnida' }
      };

      // If we have an exact match for the phrase
      if (phoneticMap[text]) {
        return phoneticMap[text];
      }

      // Otherwise, try to break down character by character
      let simplified = '';
      let ipa = '';

      for (let char of text) {
        if (phoneticMap[char]) {
          simplified += phoneticMap[char].simplified + '-';
          ipa += phoneticMap[char].ipa;
        } else {
          // For unknown characters, use a generic approach
          simplified += 'unknown-';
          ipa += char;
        }
      }

      // Clean up trailing dashes
      simplified = simplified.replace(/-$/, '');

      return {
        simplified: simplified || 'pronunciation guide not available',
        ipa: ipa || text,
        confidence: 'basic' // Indicate this is a simple mapping
      };
    };

    const phoneticsData = generatePhonetics(koreanText);

    console.log('✅ Korean phonetics generated successfully for:', koreanText);
    res.json({
      success: true,
      koreanText: koreanText,
      simplified: phoneticsData.simplified,
      ipa: phoneticsData.ipa,
      confidence: phoneticsData.confidence || 'high',
      displayType: displayType || 'simplified',
      childSafe: true,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Korean phonetics generation failed:', error);
    res.status(500).json({
      error: 'Phonetics generation failed',
      details: error.message
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    azureOpenAI: azureClient ? 'connected' : 'not configured',
    langsmith: langsmithClient ? 'enabled' : 'disabled',
    langsmithProject: process.env.LANGCHAIN_PROJECT || 'default',
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📝 Story generation: POST http://localhost:${PORT}/api/generate-story`);
  console.log(`🎤 Text-to-speech: POST http://localhost:${PORT}/api/text-to-speech`);
  console.log(`🎙️ Voice management: GET http://localhost:${PORT}/api/voices`);
  console.log(`💡 Quiz hints: POST http://localhost:${PORT}/api/generate-quiz-hint`);
  console.log(`🔤 Korean phonetics: POST http://localhost:${PORT}/api/korean-phonetics`);
});