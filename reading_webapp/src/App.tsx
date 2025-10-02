import { useState, useEffect } from 'react'
import { generateBlendedContent, getLevelInfo, BLEND_STYLES } from './utils/koreanBlendSystem'
import type { Quiz } from './types/content'
import { ProfessionalAudioPlayer } from './components/language-support/ProfessionalAudioPlayer'
import { QuizHintSystem } from './components/language-support/QuizHintSystem'
import { AnswerValidationFeedback } from './components/language-support/AnswerValidationFeedback'
import { LanguageSelector } from './components/settings/LanguageSelector'

// Types for backend API calls
interface StoryData {
  englishContent: string;
  koreanContent: string;
  englishSentences: string[];
  koreanSentences: string[];
  nounMappings: { [englishWord: string]: string };
  title: string;
  wordCount: number;
  gradeLevel: string;
  koreanLevel: number;
  blendedContent?: string;
  extractedNouns?: string[];
}

// Define ThemeName type directly to avoid import issues
type ThemeName = 'Space' | 'Jungle' | 'DeepSea' | 'Minecraft' | 'Tron'

// Comprehensive theme configurations based on backend
const THEME_STYLES = {
  Space: {
    background: 'radial-gradient(ellipse at center, #1e293b 0%, #0f172a 100%)',
    pattern: 'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(59, 130, 246, 0.1) 2px, rgba(59, 130, 246, 0.1) 4px)',
    primary: '#3b82f6',
    accent: '#06b6d4',
    text: '#f1f5f9',
    fontFamily: "'Comic Neue', 'Noto Sans KR', cursive, system-ui, sans-serif",
    celebration: ['⭐', '✨', '🌟', '🚀', '🌌'],
    displayName: 'Space Adventure'
  },
  Jungle: {
    background: 'linear-gradient(135deg, #14532d 0%, #166534 50%, #15803d 100%)',
    pattern: 'repeating-linear-gradient(30deg, transparent, transparent 3px, rgba(34, 197, 94, 0.1) 3px, rgba(34, 197, 94, 0.1) 6px)',
    primary: '#16a34a',
    accent: '#dc2626',
    text: '#f0fdf4',
    fontFamily: "'Comic Neue', 'Noto Sans KR', cursive, system-ui, sans-serif",
    celebration: ['🌿', '🦋', '🌺', '🐨', '🌴'],
    displayName: 'Jungle Explorer'
  },
  DeepSea: {
    background: 'radial-gradient(ellipse at bottom, #0c4a6e 0%, #075985 50%, #0369a1 100%)',
    pattern: 'repeating-linear-gradient(60deg, transparent, transparent 4px, rgba(14, 165, 233, 0.1) 4px, rgba(14, 165, 233, 0.1) 8px)',
    primary: '#0ea5e9',
    accent: '#8b5cf6',
    text: '#e0f7fa',
    fontFamily: "'Comic Neue', 'Noto Sans KR', cursive, system-ui, sans-serif",
    celebration: ['🐠', '🌊', '🐙', '🦈', '🏴‍☠️'],
    displayName: 'Deep Sea Discovery'
  },
  Minecraft: {
    background: 'linear-gradient(180deg, #87ceeb 0%, #90ee90 70%, #8fbc8f 100%)',
    pattern: 'repeating-conic-gradient(from 0deg, transparent 0deg 90deg, rgba(139, 90, 43, 0.1) 90deg 180deg)',
    primary: '#8b5a2b',
    accent: '#dc2626',
    text: '#2d1b00',
    fontFamily: "'Orbitron', 'Comic Neue', 'Noto Sans KR', monospace, system-ui",
    celebration: ['⬜', '🟫', '🟩', '⛏️', '🎯'],
    displayName: 'Blocky Builder'
  },
  Tron: {
    background: 'linear-gradient(135deg, #000510 0%, #0a0a23 50%, #1a1a2e 100%)',
    pattern: 'repeating-linear-gradient(90deg, transparent, transparent 20px, rgba(0, 217, 255, 0.1) 20px, rgba(0, 217, 255, 0.1) 22px)',
    primary: '#00d9ff',
    accent: '#ffb700',
    text: '#00d9ff',
    fontFamily: "'Orbitron', 'Comic Neue', 'Noto Sans KR', monospace, system-ui",
    celebration: ['▲', '■', '●', '⚡', '🎯'],
    displayName: 'Cyber Grid'
  },
}

function App() {
  const [currentTheme, setCurrentTheme] = useState<ThemeName>('Space')
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(true)
  const [rightSidebarOpen, setRightSidebarOpen] = useState(true)
  const [rightSidebarTab, setRightSidebarTab] = useState<'quiz' | 'vocabulary' | 'progress'>('quiz')
  const [leftSidebarTab, setLeftSidebarTab] = useState<'reading' | 'themes' | 'settings'>('reading')

  // Passage Settings
  const [passageLength, setPassageLength] = useState(500)
  const [passageTheme, setPassageTheme] = useState('A fun adventure story of Pokemon Pikachu playing basketball with a team of Pokemon versus Team Rocket.')
  const [humorLevel, setHumorLevel] = useState('Moderate Fun')
  const [gradeLevel, setGradeLevel] = useState('4th Grade')
  const [multipleChoice, setMultipleChoice] = useState(3)
  const [fillInBlank, setFillInBlank] = useState(2)
  const [quizDifficulty, setQuizDifficulty] = useState('Intermediate')
  const [customVocabulary, setCustomVocabulary] = useState('')

  // Multi-Language Settings
  const [selectedLanguage, setSelectedLanguage] = useState('Korean')
  const [languageBlendLevel, setLanguageBlendLevel] = useState(0)
  const [blendingStrategy, setBlendingStrategy] = useState('word-replacement')

  // Language name to code mapping for backend API
  const getLanguageCode = (languageName: string): string => {
    const mapping: Record<string, string> = {
      'Korean': 'ko',
      'Japanese': 'ja',
      'Mandarin': 'zh',
      'Italian': 'it',
      'Spanish': 'es',
      'Arabic': 'ar'
    }
    return mapping[languageName] || 'ko'
  }

  // Language name to emoji mapping for UI
  const getLanguageEmoji = (languageName: string): string => {
    const mapping: Record<string, string> = {
      'Korean': '🇰🇷',
      'Japanese': '🇯🇵',
      'Mandarin': '🇨🇳',
      'Italian': '🇮🇹',
      'Spanish': '🇪🇸',
      'Arabic': '🇸🇦'
    }
    return mapping[languageName] || '🌍'
  }
  const [languageSupport, setLanguageSupport] = useState({
    phonetics: true,
    romanization: true,
    audioSupport: true,  // ✅ Enable by default for better UX
    visualContext: true,
    grammarHints: true
  })

  // Language Progress State
  const [languageProgress, setLanguageProgress] = useState({
    wordsLearned: 0,
    readingSkills: {
      comprehension: 0,
      vocabulary: 0,
      fluency: 0
    },
    milestones: [
      { name: 'First Korean Word', level: 1, achieved: false, requirement: 'Learn 1 Korean word' },
      { name: 'Basic Vocabulary', level: 2, achieved: false, requirement: 'Learn 10 Korean words' },
      { name: 'Mixed Reading', level: 5, achieved: false, requirement: 'Complete passage at level 5' },
      { name: 'Korean Explorer', level: 7, achieved: false, requirement: 'Complete passage at level 7' },
      { name: 'Language Master', level: 10, achieved: false, requirement: 'Complete passage at level 10' }
    ]
  })

  // Sample vocabulary words for demo
  const [vocabularyWords, setVocabularyWords] = useState([
    { english: 'adventure', korean: '모험', romanized: 'moheom', difficulty: 1 },
    { english: 'friend', korean: '친구', romanized: 'chingu', difficulty: 1 },
    { english: 'exciting', korean: '신나는', romanized: 'sinnaneun', difficulty: 2 },
    { english: 'journey', korean: '여행', romanized: 'yeohaeng', difficulty: 2 },
    { english: 'discover', korean: '발견하다', romanized: 'balgyeonhada', difficulty: 3 }
  ])

  // Story and Quiz State
  const [currentStory, setCurrentStory] = useState<StoryData | null>(null)
  const [currentQuizGenerated, setCurrentQuizGenerated] = useState<Quiz | null>(null)
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false)
  const [quizError, setQuizError] = useState<string | null>(null)
  
  // Quiz Taking State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [userAnswers, setUserAnswers] = useState<Record<string, any>>({})
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [quizScore, setQuizScore] = useState(0)
  const [reviewMode, setReviewMode] = useState(false)
  const [semanticValidation, setSemanticValidation] = useState<Record<string, any>>({})
  const [hintUsage, setHintUsage] = useState<Record<string, { level: number; text: string; timestamp: number }[]>>({})

  // Debug Panel State
  const [debugPanelOpen, setDebugPanelOpen] = useState(false)
  const [debugData, setDebugData] = useState<any>(null)

  // Korean Blend System - Raw story data from backend (2-call LLM system)
  const [storyData, setStoryData] = useState<{
    englishContent: string;
    koreanContent: string;
    englishSentences: string[];
    koreanSentences: string[];
    nounMappings: { [key: string]: string };
    customVocabulary?: string[];
  } | null>(null)
  const [enhancedStoryPair, setEnhancedStoryPair] = useState<any>(null) // NLP enhanced story pair
  const [displayedContent, setDisplayedContent] = useState<string>('')
  const [currentQuiz, setCurrentQuiz] = useState<any[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationError, setGenerationError] = useState<string | null>(null)

  const themeStyle = THEME_STYLES[currentTheme]


  // Apply theme to body element using inline styles (safe approach)
  useEffect(() => {
    document.body.style.background = themeStyle.background
    document.body.style.color = themeStyle.text
    document.body.style.margin = '0'
    document.body.style.padding = '0'
    document.body.style.fontFamily = themeStyle.fontFamily

    // Add hint styling CSS
    if (!document.querySelector('#hint-styles')) {
      const style = document.createElement('style')
      style.id = 'hint-styles'
      style.textContent = `
        .hint-text {
          color: #fbbf24 !important;
          font-style: italic !important;
          font-weight: 400 !important;
          font-family: 'Noto Sans KR', sans-serif !important;
          font-size: 0.75em !important;
          display: inline !important;
          opacity: 0.9 !important;
        }
      `
      document.head.appendChild(style)
    }
    document.body.style.minHeight = '100vh'

    // Add theme pattern overlay
    if (themeStyle.pattern) {
      document.body.style.backgroundImage = `${themeStyle.pattern}, ${themeStyle.background}`
    }

    console.log(`🎨 Theme switched to: ${themeStyle.displayName}`)
  }, [themeStyle])

  // Add Korean Blend System CSS styles
  useEffect(() => {
    // Add CSS for Korean blend styling
    const styleElement = document.getElementById('korean-blend-styles') || document.createElement('style')
    styleElement.id = 'korean-blend-styles'
    styleElement.textContent = `
      .sentence {
        margin-bottom: 8px;
        line-height: 1.6;
        font-size: 15px;
      }

      .english-sentence {
        /* Standard English text styling */
      }

      .korean-sentence {
        font-family: 'Noto Sans KR', sans-serif;
        font-size: 16px;
        font-weight: 500;
      }

      .secondary-hint {
        color: #fbbf24 !important;
        font-style: italic;
        font-weight: 400;
        margin-left: 2px;
      }

      .paragraph-break {
        height: 12px;
      }

      .vocab-word {
        color: ${themeStyle.accent};
        font-weight: bold;
        text-shadow: 0 0 2px rgba(255,255,255,0.3);
      }
    `

    if (!document.getElementById('korean-blend-styles')) {
      document.head.appendChild(styleElement)
    }
  }, [])

  // 🚀 NEW 6-LEVEL KOREAN BLEND SYSTEM - Real-time blending when slider changes
  useEffect(() => {
    if (storyData) {
      console.log(`🎚️ Applying 6-level Korean blending to level ${languageBlendLevel}/5`)

      // Use new 6-level blending system with pre-generated English + Korean content
      const blendedResult = generateBlendedContent(storyData, languageBlendLevel)
      setDisplayedContent(blendedResult.html)

      console.log(`✅ Applied level ${languageBlendLevel}: ${blendedResult.description}`)
    } else if (enhancedStoryPair) {
      console.log(`🎚️ Fallback: Using simple Korean blending to level ${languageBlendLevel}/5 (legacy)`)

      // Fallback to simple word replacement for backward compatibility
      const simpleBlended = applySimpleKoreanReplacement(enhancedStoryPair.englishStory, languageBlendLevel)
      setDisplayedContent(simpleBlended)
    } else if (currentStory) {
      console.log(`🎚️ Fallback: Using original blending logic for level ${languageBlendLevel}/5`)

      // Fallback to original blending logic
      const blendedContent = applyRealTimeBlending(
        currentStory.englishContent,
        currentStory.koreanContent,
        currentStory.nounMappings || {},
        {},
        languageBlendLevel
      )

      setDisplayedContent(blendedContent)
    }
  }, [storyData, currentStory, enhancedStoryPair, languageBlendLevel])

  // Function to translate English text to Korean for Level 7 (100% immersion)
  const translateToKorean = (text: string): string => {
    // Enhanced Korean translation map for comprehensive word-by-word translation
    const koreanTranslations: Record<string, string> = {
      // Basic words
      'adventure': '모험', 'story': '이야기', 'friend': '친구', 'happy': '행복한',
      'journey': '여행', 'discovery': '발견', 'mysterious': '신비로운', 'beautiful': '아름다운',
      'exciting': '신나는', 'wonderful': '멋진', 'magical': '마법의', 'brave': '용감한',
      'Pokemon': '포켓몬', 'trainer': '트레이너', 'battle': '전투', 'world': '세계',
      'challenge': '도전', 'power': '힘', 'trust': '신뢰', 'courage': '용기',
      'team': '팀', 'bond': '유대', 'experience': '경험', 'wisdom': '지혜',
      'guidance': '안내', 'determination': '결단력', 'abilities': '능력', 'friendship': '우정',
      'memories': '추억', 'treasures': '보물', 'lessons': '교훈', 'challenges': '도전들',
      'companions': '동반자', 'landscape': '풍경', 'sights': '광경', 'sounds': '소리',
      'confidence': '자신감', 'growth': '성장', 'possibilities': '가능성',

      // Common verbs and phrases
      'the': '', 'and': '그리고', 'with': '와 함께', 'they': '그들은', 'their': '그들의',
      'this': '이것은', 'that': '그것은', 'have': '가지다', 'will': '할 것이다',
      'are': '이다', 'is': '이다', 'was': '였다', 'were': '였다',
      'discover': '발견하다', 'learn': '배우다', 'find': '찾다', 'become': '되다',
      'explore': '탐험하다', 'prepare': '준비하다', 'practice': '연습하다', 'train': '훈련하다',
      'compete': '경쟁하다', 'work': '일하다', 'help': '돕다', 'understand': '이해하다',

      // Places and objects
      'forest': '숲', 'mountain': '산', 'valley': '계곡', 'village': '마을',
      'city': '도시', 'home': '집', 'school': '학교', 'gym': '체육관',
      'championship': '챔피언십', 'tournament': '토너먼트', 'competition': '대회',
      'training': '훈련', 'session': '세션', 'strategy': '전략',

      // Descriptive words
      'young': '젊은', 'new': '새로운', 'special': '특별한', 'first': '첫 번째',
      'great': '위대한', 'true': '진정한', 'real': '실제', 'best': '최고의',
      'each': '각각의', 'every': '모든', 'all': '모든', 'together': '함께',

      // Additional common words for better translation
      'in': '에서', 'on': '위에', 'at': '에', 'for': '위해', 'to': '에게',
      'from': '에서부터', 'by': '에 의해', 'about': '에 대해', 'into': '안으로',
      'through': '통해', 'during': '동안', 'before': '전에', 'after': '후에',
      'above': '위에', 'below': '아래에', 'up': '위로', 'down': '아래로',
      'out': '밖으로', 'off': '떨어져', 'over': '위에', 'under': '아래에',
      'again': '다시', 'further': '더 멀리', 'then': '그때', 'once': '한번'
    }

    let result = text

    // Apply comprehensive word-by-word translation
    Object.entries(koreanTranslations).forEach(([english, korean]) => {
      if (korean) { // Skip empty translations
        const regex = new RegExp(`\\b${english}\\b`, 'gi')
        result = result.replace(regex, korean)
      }
    })

    return result
  }

  // Simple Korean word replacement (bypasses problematic NLP)
  const applySimpleKoreanReplacement = (text: string, level: number): string => {
    // Strip any HTML tags first
    let cleanText = text.replace(/<[^>]*>/g, '')

    // Level 7 = 100% Korean immersion - translate the actual content
    if (level === 7) {
      return translateToKorean(cleanText)
    }

    // Levels 0-6: Progressive Korean word mixing using same dictionary
    const koreanTranslations: Record<string, string> = {
      'adventure': '모험', 'story': '이야기', 'friend': '친구', 'happy': '행복한',
      'journey': '여행', 'discovery': '발견', 'mysterious': '신비로운', 'beautiful': '아름다운',
      'exciting': '신나는', 'wonderful': '멋진', 'magical': '마법의', 'brave': '용감한',
      'Pokemon': '포켓몬', 'trainer': '트레이너', 'battle': '전투', 'world': '세계',
      'challenge': '도전', 'power': '힘', 'trust': '신뢰', 'courage': '용기',
      'team': '팀', 'bond': '유대', 'experience': '경험', 'wisdom': '지혜',
      'guidance': '안내', 'determination': '결단력', 'abilities': '능력', 'friendship': '우정',
      'memories': '추억', 'treasures': '보물', 'lessons': '교훈', 'challenges': '도전들',
      'companions': '동반자', 'landscape': '풍경', 'sights': '광경', 'sounds': '소리',
      'confidence': '자신감', 'growth': '성장', 'possibilities': '가능성'
    }

    let result = cleanText
    const blendRatio = level / 7 // Level 0-7 mapped to 0-1

    // Levels 0-6: Progressive Korean word mixing
    Object.keys(koreanTranslations).forEach(englishWord => {
      const shouldTranslate = level >= 6 ? true : Math.random() < blendRatio
      if (shouldTranslate && result.includes(englishWord)) {
        const regex = new RegExp(`\\b${englishWord}\\b`, 'gi')
        result = result.replace(regex, `${englishWord} (${koreanTranslations[englishWord]})`)
      }
    })

    return result
  }

  // Custom vocabulary bolding function
  const applyCustomVocabularyBolding = (text: string): string => {
    if (!customVocabulary || customVocabulary.trim() === '') {
      return text;
    }

    let result = text;
    const vocabWords = customVocabulary.split(',').map(word => word.trim()).filter(word => word.length > 0);
    
    vocabWords.forEach(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      result = result.replace(regex, (match) => `<strong>${match}</strong>`);
    });

    return result;
  };

  // Real-time blending function (matches service logic)
  const applyRealTimeBlending = (
    englishStory: string,
    koreanStory: string,
    vocabularyMap: { [key: string]: string },
    sentenceHints: { [key: number]: string },
    level: number
  ): string => {
    switch (level) {
      case 0:
        // Apply custom vocabulary bolding even at Level 0
        return applyCustomVocabularyBolding(englishStory)

      case 1:
        return addVocabularyHints(englishStory, vocabularyMap, 0.5)

      case 2:
        return addVocabularyHints(englishStory, vocabularyMap, 1.0)

      case 3:
        return addSentenceHints(englishStory, sentenceHints)

      case 4:
        return addMoreSentenceHints(englishStory, koreanStory, 0.4)

      case 5:
        return blendSentences(englishStory, koreanStory, 0.5)

      case 6:
        return blendSentences(englishStory, koreanStory, 0.2)

      case 7:
        return koreanStory

      default:
        return englishStory
    }
  }

  // Helper functions for real-time blending
  const addVocabularyHints = (story: string, vocabularyMap: { [key: string]: string }, coverage: number): string => {
    let result = story
    const vocabularyEntries = Object.entries(vocabularyMap)
    const targetReplacements = Math.floor(vocabularyEntries.length * coverage)
    let replacementCount = 0

    for (const [english, korean] of vocabularyEntries) {
      if (replacementCount >= targetReplacements) break

      const regex = new RegExp(`\\b${english}\\b`, 'gi')
      const matches = story.match(regex)

      if (matches && matches.length > 0) {
        result = result.replace(regex, `${english} (${korean})`)
        replacementCount++
      }
    }

    return result
  }

  const addSentenceHints = (englishStory: string, sentenceHints: { [key: number]: string }): string => {
    const sentences = englishStory.split(/[.!?]+/).filter(s => s.trim().length > 0)
    let result = ''

    sentences.forEach((sentence, index) => {
      const trimmedSentence = sentence.trim()
      if (trimmedSentence.length > 0) {
        result += trimmedSentence + '.'

        if (sentenceHints[index]) {
          result += '\n  ' + `(${sentenceHints[index]})`
        }

        result += '\n\n'
      }
    })

    return result.trim()
  }

  const addMoreSentenceHints = (englishStory: string, koreanStory: string, ratio: number): string => {
    const englishSentences = englishStory.split(/[.!?]+/).filter(s => s.trim().length > 0)
    const koreanSentences = koreanStory.split(/[.!?]+/).filter(s => s.trim().length > 0)

    let result = ''
    const hintFrequency = Math.max(1, Math.floor(1 / ratio))

    englishSentences.forEach((sentence, index) => {
      const trimmedSentence = sentence.trim()
      if (trimmedSentence.length > 0) {
        result += trimmedSentence + '.'

        if (index % hintFrequency === 0 && koreanSentences[index]) {
          result += '\n  ' + `(${koreanSentences[index].trim()}.)`
        }

        result += '\n\n'
      }
    })

    return result.trim()
  }

  const blendSentences = (englishStory: string, koreanStory: string, englishRatio: number): string => {
    const englishSentences = englishStory.split(/[.!?]+/).filter(s => s.trim().length > 0)
    const koreanSentences = koreanStory.split(/[.!?]+/).filter(s => s.trim().length > 0)

    let result = ''

    englishSentences.forEach((sentence, index) => {
      const shouldBeEnglish = (index * 0.618) % 1 < englishRatio

      if (shouldBeEnglish || !koreanSentences[index]) {
        result += sentence.trim() + '.\n\n'
      } else {
        result += koreanSentences[index].trim() + '.\n\n'
      }
    })

    return result.trim()
  }

  const handleThemeChange = (theme: ThemeName) => {
    setCurrentTheme(theme)
  }

  // Content rendering with Korean text highlighting
  const renderContent = (content: string) => {
    if (!content) return ''

    // Preserve original LLM paragraph breaks and structure exactly
    console.log('🔍 Original content structure:')
    console.log('Raw content:', JSON.stringify(content.substring(0, 300)))

    // Split by double newlines to preserve LLM paragraph structure
    const paragraphs = content.split(/\n\n+/).filter(p => p.trim() !== '');
    console.log('🔍 Split into paragraphs:', paragraphs.length, paragraphs.map(p => p.substring(0, 50)))

    return paragraphs.map((paragraph, pIndex) => {
      const lines = paragraph.split('\n')
      const renderedLines = lines.map((line, lIndex) => {
      // Check if this is a Korean hint line (Level 3 formatting)
      if (line.trim().startsWith('(') && line.trim().endsWith(')')) {
        return (
          <div key={lIndex} style={{
            color: '#fbbf24',
            fontSize: '14px',
            fontStyle: 'italic',
            marginLeft: '20px',
            marginTop: '4px',
            marginBottom: '8px',
            opacity: 0.9,
            fontFamily: "'Noto Sans KR', sans-serif",
            borderLeft: '2px solid #fbbf24',
            paddingLeft: '12px'
          }}>
            {line}
          </div>
        )
      }

      // Enhanced text processing with educational best practices
      let processedLine = line

      // Remove any dash characters for better readability
      processedLine = processedLine.replace(/-/g, ' ').replace(/\s+/g, ' ').trim()

      // Make ONLY custom vocabulary words bold (user-specified words only)
      if (customVocabulary && customVocabulary.trim()) {
        const vocabWords = customVocabulary.split(',').map(word => word.trim()).filter(word => word.length > 0)
        vocabWords.forEach(word => {
          const regex = new RegExp(`\\b${word}\\b`, 'gi')
          processedLine = processedLine.replace(regex, `<strong class="vocab-word">${word}</strong>`)
        })
      }

      // Comprehensive hint processing - handles ALL hint patterns systematically
      // Process in order from most specific to most general to avoid conflicts

      // Step 1: Handle bold markdown hints: **word(s) (hint)**
      processedLine = processedLine.replace(
        /\*\*([^*()]+)\s*\(([^)]+)\)\*\*/g,
        (match, primaryText, hintText) => {
          console.log('🎯 Found bold hint pattern:', { match, primaryText, hintText })
          return `${primaryText.trim()} <span class="hint-text" style="color: #fbbf24 !important; font-style: italic !important; font-weight: 400 !important; font-family: 'Noto Sans KR', sans-serif !important; font-size: 0.75em !important; display: inline !important; opacity: 0.9 !important; margin-left: 2px;">(${hintText.trim()})</span>`
        }
      )

      // Step 2: Handle multi-word phrases with hints: "phrase words (hint)"
      processedLine = processedLine.replace(
        /([a-zA-Z][a-zA-Z\s]{1,}[a-zA-Z])\s*\(([^)]+)\)/g,
        (match, primaryText, hintText) => {
          console.log('🎯 Found multi-word hint pattern:', { match, primaryText, hintText })
          return `${primaryText.trim()} <span class="hint-text" style="color: #fbbf24 !important; font-style: italic !important; font-weight: 400 !important; font-family: 'Noto Sans KR', sans-serif !important; font-size: 0.75em !important; display: inline !important; opacity: 0.9 !important;">(${hintText.trim()})</span>`
        }
      )

      // Step 3: Handle single words with hints: "word (hint)"
      processedLine = processedLine.replace(
        /\b([a-zA-Z]+)\s*\(([^)]+)\)/g,
        (match, primaryWord, hintText) => {
          console.log('🎯 Found single word hint pattern:', { match, primaryWord, hintText })
          return `${primaryWord} <span class="hint-text" style="color: #fbbf24 !important; font-style: italic !important; font-weight: 400 !important; font-family: 'Noto Sans KR', sans-serif !important; font-size: 0.75em !important; display: inline !important; opacity: 0.9 !important;">(${hintText.trim()})</span>`
        }
      )

      // Korean text should use normal color with proper font (processed AFTER hints to avoid overriding)
      // Apply Korean font styling but don't override color (let it inherit properly)
      const koreanTextParts = processedLine.split(/(<[^>]*>)/g) // Split by HTML tags to avoid processing inside tags
      processedLine = koreanTextParts.map(part => {
        // Only process text parts (not HTML tags) and only if they contain Korean but aren't already styled
        if (!part.startsWith('<') && /[\u3131-\u3163\u3AC0-\u3D7F\uAC00-\uD7AF]/.test(part) && !part.includes('class="secondary-hint"')) {
          // Check if this Korean text is in parentheses (should be a hint)
          if (part.includes('(') && part.includes(')')) {
            return part.replace(
              /\(([^)]*[\u3131-\u3163\u3AC0-\u3D7F\uAC00-\uD7AF][^)]*)\)/g,
              (match, korean) => `<span class="hint-text" style="color: #fbbf24 !important; font-style: italic !important; font-weight: 400 !important; font-family: 'Noto Sans KR', sans-serif !important; font-size: 0.75em !important; display: inline !important; opacity: 0.9 !important;">(${korean})</span>`
            )
          } else {
            return part.replace(
              /[\u3131-\u3163\u3AC0-\u3D7F\uAC00-\uD7AF]+/g,
              (match) => `<span style="font-family: 'Noto Sans KR', sans-serif; font-weight: 500;">${match}</span>`
            )
          }
        }
        return part
      }).join('')

      // Korean-only sentences detection (improved)
      const hasKorean = /[\u3131-\u3163\u3AC0-\u3D7F\uAC00-\uD7AF]/.test(line)
      const hasEnglish = /[a-zA-Z]/.test(line.replace(/\([^)]*\)/g, '')) // Remove parenthetical content
      const isKoreanSentence = hasKorean && !hasEnglish

      return (
        <div key={`${pIndex}-${lIndex}`} style={{
          marginBottom: lIndex < lines.length - 1 ? '8px' : '0', // Space between lines within paragraph
          lineHeight: '1.7',
          fontFamily: isKoreanSentence ? "'Noto Sans KR', sans-serif" : "'Inter', 'Noto Sans KR', system-ui, sans-serif",
          fontSize: isKoreanSentence ? '16px' : '15px',
          fontWeight: isKoreanSentence ? '500' : '400',
          color: isKoreanSentence ? '#e0e7ff' : 'inherit',
          letterSpacing: isKoreanSentence ? '0.5px' : 'normal'
        }}>
          <span dangerouslySetInnerHTML={{ __html: processedLine }} />
        </div>
      )
      })

      // Wrap each paragraph in a div with proper spacing to match LLM structure
      return (
        <div key={pIndex} style={{
          marginBottom: pIndex < paragraphs.length - 1 ? '24px' : '0', // Proper paragraph separation
          paddingBottom: pIndex < paragraphs.length - 1 ? '16px' : '0',
          borderBottom: pIndex < paragraphs.length - 1 ? '1px solid rgba(255,255,255,0.1)' : 'none'
        }}>
          {renderedLines}
        </div>
      )
    })
  }

  const handleGenerateStory = async () => {
    console.log('🚀 Generate Story button clicked!')
    
    try {
      setIsGenerating(true)
      setGenerationError(null)
      
      console.log('📝 Building story generation parameters...')

      const params = {
        passageTheme,
        passageLength,
        humorLevel,
        gradeLevel,
        koreanLevel: languageBlendLevel,
        customVocabulary: customVocabulary || undefined,
        targetLanguage: getLanguageCode(selectedLanguage)
      }

      console.log('📋 Story generation params:', params)

      // Generate the story via backend API
      console.log('⏳ Calling backend API /api/generate-story...')
      const response = await fetch('http://localhost:3001/api/generate-story', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params)
      })

      if (!response.ok) {
        throw new Error(`Backend API error: ${response.status} ${response.statusText}`)
      }

      const result = await response.json()
      if (!result.success) {
        throw new Error(result.message || 'Story generation failed')
      }

      const story = result.story
      console.log('📖 Story generated successfully:', story)

      setCurrentStory(story)

      // Store debug data if available
      console.log('🔍 Full API result:', result)
      if (result.debug) {
        console.log('🔍 Debug data received:', result.debug)
        // Map wordMappings to extractedMappings for display
        const debugWithMappings = {
          ...result.debug,
          extractedMappings: result.debug.wordMappings || {}
        }
        setDebugData(debugWithMappings)
      } else {
        console.log('❌ No debug data in result, creating mock debug data')
        // Create mock debug data for demonstration
        const mockDebug = {
          llmCall1: {
            prompt: `Generate a ${passageLength}-word story for ${gradeLevel} students about ${passageTheme}...`,
            response: story.englishContent ? story.englishContent.substring(0, 200) + '...' : 'Story content'
          },
          llmCall2: {
            prompt: `Translate the English story to Korean and provide word mappings...`,
            response: story.koreanContent ? story.koreanContent.substring(0, 200) + '...' : 'Korean translation'
          },
          extractedMappings: story.nounMappings || {},
          mappingCount: Object.keys(story.nounMappings || {}).length
        }
        setDebugData(mockDebug)
      }

      // 🚀 NEW: Populate Korean Blend System data from backend 2-call LLM system
      if (story.englishSentences && story.koreanSentences && story.nounMappings) {
        console.log('🚀 Setting up 6-level Korean blend system with backend data...')
        setStoryData({
          englishContent: story.englishContent,
          koreanContent: story.koreanContent,
          englishSentences: story.englishSentences,
          koreanSentences: story.koreanSentences,
          nounMappings: story.nounMappings,
          customVocabulary: story.customVocabulary || []
        })
        console.log('✅ Korean blend system data set:', {
          englishSentences: story.englishSentences.length,
          koreanSentences: story.koreanSentences.length,
          nounMappings: Object.keys(story.nounMappings).length
        })
      } else {
        console.log('⚠️ Backend did not return new format, using legacy mode')
      }

      // Create simple story pair (NLP disabled to avoid CSS contamination)
      if (story.englishContent) {
        console.log('🧠 Creating simple story pair (NLP disabled)...')
        // Strip HTML from content and create simple pair
        const cleanContent = story.englishContent.replace(/<[^>]*>/g, '')
        setEnhancedStoryPair({
          englishStory: cleanContent,
          koreanStory: cleanContent, // Not used in simple mode
          extractedNouns: [],
          sentences: { english: [], korean: [] }
        })
        console.log('✅ Simple story pair created')
      }

      console.log('🎉 Story generation completed!')

    } catch (error) {
      console.error('❌ Error generating story:', error)
      setGenerationError(error instanceof Error ? error.message : 'Failed to generate story. Please try again.')
      
      // Reset states on error to prevent crashes
      setCurrentStory(null)
      setDisplayedContent('')
      
    } finally {
      setIsGenerating(false)
    }
  }

  // Generate quiz questions based on current story
  // Semantic answer validation function
  const validateAnswerSemantically = async (userAnswer: string, correctAnswer: string, questionType: string, questionId: string) => {
    try {
      const response = await fetch('http://localhost:3001/api/validate-answer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userAnswer,
          correctAnswer,
          questionType,
          gradeLevel: 3 // Default grade level for validation
        }),
      })

      if (response.ok) {
        const validation = await response.json()
        setSemanticValidation(prev => ({
          ...prev,
          [questionId]: validation
        }))
        return validation.isCorrect
      }
    } catch (error) {
      console.error('Semantic validation failed:', error)
    }
    
    // Fallback to exact match
    return userAnswer.toLowerCase().trim() === correctAnswer.toLowerCase().trim()
  }

  // Handle hint usage tracking
  const handleHintUsed = (questionId: string, hintLevel: number, hintText: string) => {
    setHintUsage(prev => ({
      ...prev,
      [questionId]: [
        ...(prev[questionId] || []),
        { level: hintLevel, text: hintText, timestamp: Date.now() }
      ]
    }));
  };

  // Handle validation result from AnswerValidationFeedback
  const handleValidationResult = (questionId: string, result: any) => {
    setSemanticValidation(prev => ({
      ...prev,
      [questionId]: result
    }));
  };

  const handleGenerateQuiz = async () => {
    if (!currentStory) {
      console.error('No story available for quiz generation')
      setQuizError('Please generate a story first before creating quiz questions.')
      return
    }

    setIsGeneratingQuiz(true)
    setQuizError(null)
    setCurrentQuizGenerated(null)
    setUserAnswers({})
    setQuizCompleted(false)
    setCurrentQuestionIndex(0)
    setReviewMode(false)
    
    try {
      console.log('🧠 Generating quiz questions...', {
        gradeLevel,
        multipleChoice,
        fillInBlank,
        quizDifficulty,
        koreanLevel: languageBlendLevel
      })

      const response = await fetch('http://localhost:3001/api/generate-quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          englishContent: currentStory.englishContent,
          koreanContent: currentStory.koreanContent || '',
          nounMappings: currentStory.nounMappings || {},
          gradeLevel,
          multipleChoice,
          fillInBlank,
          quizDifficulty,
          koreanLevel: languageBlendLevel
        })
      })

      if (!response.ok) {
        throw new Error(`Quiz generation failed: ${response.statusText}`)
      }

      const data = await response.json()
      
      if (data.success && data.quiz) {
        setCurrentQuizGenerated(data.quiz)
        console.log('🎉 Quiz generated successfully!', data.quiz)
      } else {
        throw new Error('Invalid quiz response format')
      }
      
    } catch (error) {
      console.error('Failed to generate quiz:', error)
      setQuizError(error instanceof Error ? error.message : 'Failed to generate quiz')
      
      // Fallback to basic quiz
      const fallbackQuiz: Quiz = {
        questions: [
          {
            id: 'q1',
            type: 'multiple-choice',
            question: 'What was the main theme of this story?',
            options: ['Adventure and discovery', 'Friendship and teamwork', 'Learning Korean', 'Overcoming challenges'],
            correct_answer: 'Adventure and discovery',
            explanation: 'The story focused on adventure and discovery themes.',
            skill_tested: 'main_idea',
            difficulty_level: quizDifficulty,
            korean_integration: languageBlendLevel > 0
          }
        ],
        metadata: {
          total_questions: 1,
          skills_covered: ['main_idea'],
          korean_vocabulary_count: 0,
          estimated_completion_time: 2
        }
      }
      setCurrentQuizGenerated(fallbackQuiz)
    } finally {
      setIsGeneratingQuiz(false)
    }
  }

  // Inject Korean blend system CSS
  useEffect(() => {
    const styleId = 'korean-blend-styles'
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style')
      style.id = styleId
      style.textContent = BLEND_STYLES
      document.head.appendChild(style)
    }
  }, [])

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: "'Inter', 'Noto Sans KR', system-ui, sans-serif",
      overflow: 'hidden'
    }}>
      {/* Top Bar */}
      <div style={{
        height: '64px',
        background: `rgba(255, 255, 255, 0.1)`,
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            background: themeStyle.accent,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px'
          }}>
            🏆
          </div>
          <div>
            <h1 style={{
              fontSize: '20px',
              fontWeight: 'bold',
              margin: 0,
              color: themeStyle.text
            }}>
              ReadQuest
            </h1>
            <div style={{ fontSize: '12px', opacity: 0.8 }}>Level 1 Explorer</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
            <span>⭐ 0</span>
            <span>🧠 0 completed</span>
            <span>🎯 0% accuracy</span>
          </div>
          <div style={{
            background: `rgba(255, 255, 255, 0.2)`,
            padding: '6px 16px',
            borderRadius: '20px',
            fontSize: '14px'
          }}>
            1000 points to Level 2
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{
        display: 'flex',
        paddingTop: '64px',
        minHeight: 'calc(100vh - 64px)',
        width: '100%',
        position: 'relative'
      }}>
        {/* Left Sidebar Collapse Button */}
        <button
          onClick={() => setLeftSidebarOpen(!leftSidebarOpen)}
          style={{
            position: 'fixed',
            left: leftSidebarOpen ? '484px' : '0px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '20px',
            height: '40px',
            background: `rgba(255, 255, 255, 0.2)`,
            border: 'none',
            borderRadius: '0 8px 8px 0',
            cursor: 'pointer',
            zIndex: 45,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            color: themeStyle.text,
            transition: 'left 0.3s ease'
          }}
        >
          {leftSidebarOpen ? '◀' : '▶'}
        </button>

        {/* Left Sidebar */}
        <div style={{
          width: leftSidebarOpen ? '504px' : '0px',
          background: `rgba(255, 255, 255, 0.1)`,
          backdropFilter: 'blur(10px)',
          borderRight: '1px solid rgba(255, 255, 255, 0.2)',
          padding: leftSidebarOpen ? '24px' : '0',
          position: 'fixed',
          left: 0,
          top: '64px',
          bottom: 0,
          zIndex: 40,
          overflowY: 'auto',
          overflowX: 'hidden',
          transition: 'width 0.3s ease'
        }}>
          {leftSidebarOpen && (
            <>
              {/* Tabs */}
              <div style={{ display: 'flex', marginBottom: '24px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '8px', padding: '4px' }}>
                <button
                  onClick={() => setLeftSidebarTab('reading')}
                  style={{
                    flex: 1,
                    padding: '8px',
                    background: leftSidebarTab === 'reading' ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                    border: 'none',
                    borderRadius: '6px',
                    color: themeStyle.text,
                    fontSize: '12px',
                    cursor: 'pointer',
                    opacity: leftSidebarTab === 'reading' ? 1 : 0.6
                  }}
                >📖 Reading</button>
                <button
                  onClick={() => setLeftSidebarTab('themes')}
                  style={{
                    flex: 1,
                    padding: '8px',
                    background: leftSidebarTab === 'themes' ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                    border: 'none',
                    borderRadius: '6px',
                    color: themeStyle.text,
                    fontSize: '12px',
                    cursor: 'pointer',
                    opacity: leftSidebarTab === 'themes' ? 1 : 0.6
                  }}
                >🎨 Themes</button>
                <button
                  onClick={() => setLeftSidebarTab('settings')}
                  style={{
                    flex: 1,
                    padding: '8px',
                    background: leftSidebarTab === 'settings' ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                    border: 'none',
                    borderRadius: '6px',
                    color: themeStyle.text,
                    fontSize: '12px',
                    cursor: 'pointer',
                    opacity: leftSidebarTab === 'settings' ? 1 : 0.6
                  }}
                >⚙️ Settings</button>
              </div>

              {leftSidebarTab === 'reading' ? (
                <>
                  <h2 style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: '600' }}>
                    Passage Settings
                  </h2>

              {/* Passage Length */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                  Passage Length: {passageLength} words
                </label>
                <input
                  type="range"
                  min="250"
                  max="2000"
                  step="50"
                  value={passageLength}
                  onChange={(e) => setPassageLength(Number(e.target.value))}
                  style={{
                    width: '100%',
                    height: '6px',
                    borderRadius: '3px',
                    background: 'rgba(255, 255, 255, 0.3)',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                />
              </div>

              {/* Passage Theme */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                  Passage Theme
                </label>
                <textarea
                  value={passageTheme}
                  onChange={(e) => setPassageTheme(e.target.value)}
                  placeholder="Describe your adventure theme..."
                  style={{
                    width: '100%',
                    height: '120px',
                    padding: '8px 12px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '6px',
                    color: themeStyle.text,
                    fontSize: '14px',
                    outline: 'none',
                    resize: 'vertical'
                  }}
                />
              </div>

              {/* Humor Level */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                  Humor Level
                </label>
                <select
                  value={humorLevel}
                  onChange={(e) => setHumorLevel(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '6px',
                    color: themeStyle.text,
                    fontSize: '14px',
                    outline: 'none'
                  }}
                >
                  <option value="Low Fun">Low Fun</option>
                  <option value="Moderate Fun">Moderate Fun</option>
                  <option value="High Fun">High Fun</option>
                </select>
              </div>

              {/* Grade Level */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                  Grade Level
                </label>
                <select
                  value={gradeLevel}
                  onChange={(e) => setGradeLevel(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '6px',
                    color: themeStyle.text,
                    fontSize: '14px',
                    outline: 'none'
                  }}
                >
                  <option value="3rd Grade">3rd Grade</option>
                  <option value="4th Grade">4th Grade</option>
                  <option value="5th Grade">5th Grade</option>
                  <option value="6th Grade">6th Grade</option>
                </select>
              </div>

              {/* Quiz Questions */}
              <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', marginBottom: '4px' }}>
                    Multiple Choice
                  </label>
                  <select
                    value={multipleChoice}
                    onChange={(e) => setMultipleChoice(Number(e.target.value))}
                    style={{
                      width: '100%',
                      padding: '6px 8px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '4px',
                      color: themeStyle.text,
                      fontSize: '12px',
                      outline: 'none'
                    }}
                  >
                    {[1, 2, 3, 4, 5].map(num => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', marginBottom: '4px' }}>
                    Fill in Blank
                  </label>
                  <select
                    value={fillInBlank}
                    onChange={(e) => setFillInBlank(Number(e.target.value))}
                    style={{
                      width: '100%',
                      padding: '6px 8px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '4px',
                      color: themeStyle.text,
                      fontSize: '12px',
                      outline: 'none'
                    }}
                  >
                    {[0, 1, 2, 3].map(num => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Quiz Difficulty */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                  Quiz Difficulty
                </label>
                <select
                  value={quizDifficulty}
                  onChange={(e) => setQuizDifficulty(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '6px',
                    color: themeStyle.text,
                    fontSize: '14px',
                    outline: 'none'
                  }}
                >
                  <option value="Easy">Easy</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>

              {/* Custom Vocabulary */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                  Custom Vocabulary (optional)
                </label>
                <textarea
                  value={customVocabulary}
                  onChange={(e) => setCustomVocabulary(e.target.value)}
                  placeholder="Enter words separated by commas..."
                  style={{
                    width: '100%',
                    height: '80px',
                    padding: '8px 12px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '6px',
                    color: themeStyle.text,
                    fontSize: '12px',
                    outline: 'none',
                    resize: 'vertical'
                  }}
                />
              </div>

              {/* Korean Language Features */}
              <div style={{
                marginTop: '24px',
                paddingTop: '20px',
                borderTop: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '15px', fontWeight: '600', color: themeStyle.accent }}>
                  {getLanguageEmoji(selectedLanguage)} {selectedLanguage} Language Learning
                </h3>

                {/* Language Selector */}
                <div style={{ marginBottom: '20px' }}>
                  <LanguageSelector
                    currentLanguage={selectedLanguage}
                    onChange={setSelectedLanguage}
                  />
                </div>

                {/* Language Blend Level */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                    Language Blend Level: {languageBlendLevel}/6
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="6"
                    value={languageBlendLevel}
                    onChange={(e) => setLanguageBlendLevel(Number(e.target.value))}
                    style={{
                      width: '100%',
                      height: '6px',
                      borderRadius: '3px',
                      background: 'rgba(255, 255, 255, 0.3)',
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginTop: '4px', opacity: 0.7 }}>
                    <span>Pure English</span>
                    <span>Mixed</span>
                    <span>Pure {selectedLanguage}</span>
                  </div>
                  <div style={{ fontSize: '12px', marginTop: '6px', opacity: 0.8 }}>
                    {getLevelInfo(languageBlendLevel).shortDesc}
                  </div>
                </div>

                {/* Blending Strategy */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                    Blending Strategy
                  </label>
                  <select
                    value={blendingStrategy}
                    onChange={(e) => setBlendingStrategy(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '6px',
                      color: themeStyle.text,
                      fontSize: '13px',
                      outline: 'none'
                    }}
                  >
                    <option value="word-replacement">Word Replacement</option>
                    <option value="sentence-alternation">Sentence Alternation</option>
                    <option value="phrase-mixing">Phrase Mixing</option>
                    <option value="full-translation">Full Translation</option>
                  </select>
                </div>

                {/* Language Support Options */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '12px' }}>
                    Language Support
                  </label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {Object.entries(languageSupport).map(([key, value]) => (
                      <label key={key} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '12px',
                        cursor: 'pointer'
                      }}>
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={(e) => setLanguageSupport(prev => ({
                            ...prev,
                            [key]: e.target.checked
                          }))}
                          style={{
                            cursor: 'pointer',
                            accentColor: themeStyle.accent
                          }}
                        />
                        <span style={{ textTransform: 'capitalize' }}>
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                          {key === 'phonetics' && ' 🔊'}
                          {key === 'romanization' && ' 📝'}
                          {key === 'audioSupport' && ' 🎵'}
                          {key === 'visualContext' && ' 👁️'}
                          {key === 'grammarHints' && ' 📚'}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              </>
              ) : leftSidebarTab === 'themes' ? (
                <>
                  <h2 style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: '600' }}>
                    Choose Your Adventure Theme
                  </h2>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {Object.entries(THEME_STYLES).map(([themeName, theme]) => (
                      <button
                        key={themeName}
                        onClick={() => handleThemeChange(themeName as ThemeName)}
                        style={{
                          padding: '16px',
                          background: currentTheme === themeName
                            ? `linear-gradient(135deg, ${theme.accent}22, ${theme.primary}33)`
                            : 'rgba(255, 255, 255, 0.1)',
                          border: currentTheme === themeName
                            ? `2px solid ${theme.accent}`
                            : '1px solid rgba(255, 255, 255, 0.2)',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          textAlign: 'left',
                          transition: 'all 0.3s ease',
                          color: themeStyle.text
                        }}
                        onMouseEnter={(e) => {
                          if (currentTheme !== themeName) {
                            (e.target as HTMLElement).style.background = 'rgba(255, 255, 255, 0.15)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (currentTheme !== themeName) {
                            (e.target as HTMLElement).style.background = 'rgba(255, 255, 255, 0.1)';
                          }
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                          <div style={{ fontSize: '20px' }}>
                            {theme.celebration[0]}
                          </div>
                          <div>
                            <div style={{ fontWeight: '600', fontSize: '14px' }}>
                              {theme.displayName}
                            </div>
                            <div style={{ fontSize: '12px', opacity: 0.7 }}>
                              {themeName === 'Space' && 'Explore the cosmos with rockets and stars'}
                              {themeName === 'Jungle' && 'Adventure through tropical rainforests'}
                              {themeName === 'DeepSea' && 'Dive into underwater mysteries'}
                              {themeName === 'Minecraft' && 'Build and craft in blocky worlds'}
                              {themeName === 'Tron' && 'Enter the digital cyber grid'}
                            </div>
                          </div>
                        </div>
                        <div style={{ fontSize: '10px', opacity: 0.6 }}>
                          Font: {theme.fontFamily.split(',')[0].replace(/'/g, '')}
                        </div>
                      </button>
                    ))}
                  </div>

                  <div style={{
                    marginTop: '20px',
                    padding: '12px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '8px',
                    fontSize: '12px',
                    opacity: 0.8
                  }}>
                    <strong>Current:</strong> {themeStyle.displayName}
                    <br />
                    Each theme has unique fonts, colors, and celebration effects!
                  </div>
                </>
              ) : (
                <>
                  <h2 style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: '600' }}>
                    App Settings
                  </h2>

                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                      Celebration Level
                    </label>
                    <select
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '6px',
                        color: themeStyle.text,
                        fontSize: '14px',
                        outline: 'none'
                      }}
                    >
                      <option value="minimal">Minimal</option>
                      <option value="moderate" selected>Moderate</option>
                      <option value="enthusiastic">Enthusiastic</option>
                    </select>
                  </div>

                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                      Auto-Generate Images
                    </label>
                    <label style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '14px',
                      cursor: 'pointer'
                    }}>
                      <input
                        type="checkbox"
                        defaultChecked
                        style={{
                          cursor: 'pointer',
                          accentColor: themeStyle.accent
                        }}
                      />
                      <span>Generate AI images for stories</span>
                    </label>
                  </div>

                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                      Sound Effects
                    </label>
                    <label style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '14px',
                      cursor: 'pointer'
                    }}>
                      <input
                        type="checkbox"
                        style={{
                          cursor: 'pointer',
                          accentColor: themeStyle.accent
                        }}
                      />
                      <span>Enable theme sounds</span>
                    </label>
                  </div>

                  <div style={{
                    marginTop: '20px',
                    padding: '12px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '8px',
                    fontSize: '12px',
                    opacity: 0.8
                  }}>
                    <strong>Theme Celebration Emojis:</strong>
                    <br />
                    {themeStyle.celebration.join(' ')}
                  </div>
                </>
              )}
            </>
          )}
        </div>

        {/* Center Reading Container */}
        <div style={{
          flex: 1,
          marginLeft: leftSidebarOpen ? '504px' : '0',
          marginRight: rightSidebarOpen ? '504px' : '0',
          padding: '24px',
          transition: 'margin 0.3s ease',
          overflowY: 'auto'
        }}>
          <div style={{
            maxWidth: '800px',
            margin: '0 auto'
          }}>
            {currentStory ? (
              // Story Display
              <div style={{
                background: `rgba(255, 255, 255, 0.05)`,
                borderRadius: '12px',
                padding: '32px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                marginBottom: '24px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <h1 style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    margin: 0,
                    color: themeStyle.accent
                  }}>
                    {currentStory.title}
                  </h1>
                  <div style={{ display: 'flex', gap: '12px', fontSize: '12px', opacity: 0.7 }}>
                    <span>📊 {currentStory.wordCount} words</span>
                    <span>🎓 {currentStory.gradeLevel}</span>
                    <span>🇰🇷 Level {currentStory.koreanLevel}/10</span>
                  </div>
                </div>

                <div style={{
                  fontSize: '16px',
                  lineHeight: '1.8',
                  fontFamily: "'Inter', 'Noto Sans KR', system-ui, sans-serif",
                  whiteSpace: 'pre-line',
                  marginBottom: '24px'
                }}>
<div dangerouslySetInnerHTML={{ __html: displayedContent || currentStory.blendedContent || currentStory.englishContent || '' }} />
                </div>

                {/* Professional Audio Player Component */}
                {(displayedContent || currentStory.blendedContent || currentStory.englishContent) && (
                  <ProfessionalAudioPlayer
                    text={displayedContent || currentStory.blendedContent || currentStory.englishContent || ''}
                    language={languageBlendLevel > 5 ? 'korean' : 'english'}
                    childSafe={true}
                    theme={themeStyle}
                    enabled={languageSupport.audioSupport}
                    onUsageTracked={(data) => {
                      console.log('🎵 Audio usage tracked:', data);
                    }}
                  />
                )}

                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                  <button
                    onClick={handleGenerateStory}
                    disabled={isGenerating}
                    style={{
                      background: isGenerating ? 'rgba(255, 255, 255, 0.3)' : themeStyle.accent,
                      color: themeStyle.text,
                      border: 'none',
                      borderRadius: '8px',
                      padding: '12px 24px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: isGenerating ? 'not-allowed' : 'pointer',
                      opacity: isGenerating ? 0.7 : 1,
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {isGenerating ? '⏳ Generating...' : '✨ Generate New Story'}
                  </button>

                  {currentQuiz.length > 0 && (
                    <button
                      onClick={() => setRightSidebarTab('quiz')}
                      style={{
                        background: 'rgba(255, 255, 255, 0.2)',
                        color: themeStyle.text,
                        border: 'none',
                        borderRadius: '8px',
                        padding: '12px 24px',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      🧠 Take Quiz ({currentQuiz.length} questions)
                    </button>
                  )}
                </div>

                {generationError && (
                  <div style={{
                    marginTop: '16px',
                    padding: '12px',
                    background: 'rgba(255, 0, 0, 0.2)',
                    border: '1px solid rgba(255, 0, 0, 0.3)',
                    borderRadius: '8px',
                    fontSize: '14px',
                    color: '#ffcccb'
                  }}>
                    ❌ Error: {generationError}
                  </div>
                )}
              </div>
            ) : (
              // Welcome Screen
              <div style={{
                background: `rgba(255, 255, 255, 0.05)`,
                borderRadius: '12px',
                padding: '48px 32px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                marginBottom: '24px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '24px' }}>📚</div>
                <h2 style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  marginBottom: '16px',
                  color: themeStyle.accent
                }}>
                  Ready for an Adventure?
                </h2>
                <p style={{
                  fontSize: '16px',
                  opacity: 0.8,
                  marginBottom: '32px',
                  lineHeight: '1.5'
                }}>
                  Configure your settings in the left sidebar, then click "Generate Reading Adventure" to begin your Korean learning journey!
                </p>
                <button
                  onClick={handleGenerateStory}
                  disabled={isGenerating}
                  style={{
                    background: isGenerating ? 'rgba(255, 255, 255, 0.3)' : themeStyle.accent,
                    color: themeStyle.text,
                    border: 'none',
                    borderRadius: '12px',
                    padding: '16px 32px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: isGenerating ? 'not-allowed' : 'pointer',
                    transition: 'transform 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    margin: '0 auto',
                    opacity: isGenerating ? 0.7 : 1
                  }}
                  onMouseEnter={(e) => {
                    if (!isGenerating) {
                      (e.target as HTMLElement).style.transform = 'translateY(-2px)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLElement).style.transform = 'translateY(0)';
                  }}
                >
                  {isGenerating ? '⏳ Generating Story...' : '✨ Generate Reading Adventure'}
                </button>

                {generationError && (
                  <div style={{
                    marginTop: '24px',
                    padding: '16px',
                    background: 'rgba(255, 0, 0, 0.2)',
                    border: '1px solid rgba(255, 0, 0, 0.3)',
                    borderRadius: '8px',
                    fontSize: '14px',
                    color: '#ffcccb'
                  }}>
                    ❌ Error: {generationError}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar Collapse Button */}
        <button
          onClick={() => setRightSidebarOpen(!rightSidebarOpen)}
          style={{
            position: 'fixed',
            right: rightSidebarOpen ? '484px' : '0px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '20px',
            height: '40px',
            background: `rgba(255, 255, 255, 0.2)`,
            border: 'none',
            borderRadius: '8px 0 0 8px',
            cursor: 'pointer',
            zIndex: 45,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            color: themeStyle.text,
            transition: 'right 0.3s ease'
          }}
        >
          {rightSidebarOpen ? '▶' : '◀'}
        </button>

        {/* Right Sidebar */}
        <div style={{
          width: rightSidebarOpen ? '504px' : '0px',
          background: `rgba(255, 255, 255, 0.1)`,
          backdropFilter: 'blur(10px)',
          borderLeft: '1px solid rgba(255, 255, 255, 0.2)',
          padding: rightSidebarOpen ? '24px' : '0',
          position: 'fixed',
          right: 0,
          top: '64px',
          bottom: 0,
          zIndex: 40,
          overflowY: 'auto',
          overflowX: 'hidden',
          transition: 'width 0.3s ease'
        }}>
          {rightSidebarOpen && (
            <>
              {/* Right Sidebar Tabs */}
              <div style={{ display: 'flex', marginBottom: '24px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '8px', padding: '4px' }}>
                <button
                  onClick={() => setRightSidebarTab('quiz')}
                  style={{
                    flex: 1,
                    padding: '6px',
                    background: rightSidebarTab === 'quiz' ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                    border: 'none',
                    borderRadius: '6px',
                    color: themeStyle.text,
                    fontSize: '11px',
                    cursor: 'pointer'
                  }}
                >
                  🧠 Quiz
                </button>
                <button
                  onClick={() => setRightSidebarTab('vocabulary')}
                  style={{
                    flex: 1,
                    padding: '6px',
                    background: rightSidebarTab === 'vocabulary' ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                    border: 'none',
                    borderRadius: '6px',
                    color: themeStyle.text,
                    fontSize: '11px',
                    cursor: 'pointer'
                  }}
                >
                  📚 Words
                </button>
                <button
                  onClick={() => setRightSidebarTab('progress')}
                  style={{
                    flex: 1,
                    padding: '6px',
                    background: rightSidebarTab === 'progress' ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                    border: 'none',
                    borderRadius: '6px',
                    color: themeStyle.text,
                    fontSize: '11px',
                    cursor: 'pointer'
                  }}
                >
                  📈 Progress
                </button>
              </div>

              {rightSidebarTab === 'quiz' ? (
                <>
                  {!currentStory ? (
                    <div style={{
                      background: `rgba(255, 255, 255, 0.1)`,
                      borderRadius: '12px',
                      padding: '60px 24px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                      height: 'calc(100vh - 200px)',
                      justifyContent: 'center'
                    }}>
                      <div style={{ fontSize: '64px', marginBottom: '24px', opacity: 0.6 }}>🧠</div>
                      <h3 style={{ 
                        fontSize: '18px', 
                        fontWeight: '600', 
                        marginBottom: '12px',
                        color: themeStyle.accent 
                      }}>
                        Ready for Quiz Time?
                      </h3>
                      <p style={{ 
                        fontSize: '14px', 
                        margin: '0', 
                        opacity: 0.8,
                        lineHeight: '1.5',
                        maxWidth: '300px'
                      }}>
                        Generate a reading passage first, and I'll create engaging quiz questions to test your comprehension!
                      </p>
                      <div style={{
                        marginTop: '20px',
                        fontSize: '12px',
                        opacity: 0.6,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                        <span>📝</span>
                        <span>Multiple choice & fill-in-the-blank questions</span>
                      </div>
                    </div>
                  ) : !currentQuizGenerated ? (
                    <div style={{
                      background: `rgba(255, 255, 255, 0.1)`,
                      borderRadius: '12px',
                      padding: '40px 24px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center'
                    }}>
                      <div style={{ fontSize: '48px', marginBottom: '20px', opacity: 0.8 }}>📝</div>
                      <h3 style={{ 
                        fontSize: '16px', 
                        fontWeight: '600', 
                        marginBottom: '12px',
                        color: themeStyle.accent 
                      }}>
                        Generate Quiz Questions
                      </h3>
                      <p style={{ 
                        fontSize: '13px', 
                        margin: '0 0 20px 0', 
                        opacity: 0.8,
                        lineHeight: '1.5',
                        maxWidth: '280px'
                      }}>
                        Test your understanding of "{currentStory.title}" with personalized questions!
                      </p>
                      
                      <div style={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        gap: '8px', 
                        marginBottom: '20px',
                        fontSize: '12px'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span>Questions:</span>
                          <span style={{ fontWeight: 'bold' }}>{multipleChoice + fillInBlank}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span>Difficulty:</span>
                          <span style={{ fontWeight: 'bold' }}>{quizDifficulty}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span>Korean Level:</span>
                          <span style={{ fontWeight: 'bold' }}>{languageBlendLevel}/10</span>
                        </div>
                      </div>

                      {quizError && (
                        <div style={{
                          background: 'rgba(255, 0, 0, 0.2)',
                          border: '1px solid rgba(255, 0, 0, 0.4)',
                          borderRadius: '8px',
                          padding: '12px',
                          marginBottom: '16px',
                          fontSize: '12px',
                          color: '#ffcccb'
                        }}>
                          {quizError}
                        </div>
                      )}
                      
                      <button
                        onClick={handleGenerateQuiz}
                        disabled={isGeneratingQuiz}
                        style={{
                          background: isGeneratingQuiz ? 'rgba(255, 255, 255, 0.3)' : themeStyle.accent,
                          color: isGeneratingQuiz ? themeStyle.text : 'white',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '12px 24px',
                          fontSize: '14px',
                          fontWeight: '600',
                          cursor: isGeneratingQuiz ? 'not-allowed' : 'pointer',
                          transition: 'all 0.2s ease',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}
                      >
                        <span>{isGeneratingQuiz ? '⏳' : '✨'}</span>
                        {isGeneratingQuiz ? 'Generating Questions...' : 'Generate Quiz Questions'}
                      </button>
                    </div>
                  ) : (
                    <div>
                      {/* Quiz Header */}
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center', 
                        marginBottom: '16px',
                        background: `rgba(255, 255, 255, 0.1)`,
                        padding: '12px',
                        borderRadius: '8px'
                      }}>
                        <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '600', color: themeStyle.accent }}>
                          Quiz: {currentStory.title}
                        </h3>
                        <div style={{ fontSize: '12px', opacity: 0.7 }}>
                          Question {currentQuestionIndex + 1} of {currentQuizGenerated.questions.length}
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div style={{ marginBottom: '20px' }}>
                        <div style={{
                          width: '100%',
                          height: '4px',
                          background: 'rgba(255, 255, 255, 0.2)',
                          borderRadius: '2px',
                          overflow: 'hidden'
                        }}>
                          <div style={{
                            width: `${((currentQuestionIndex + 1) / currentQuizGenerated.questions.length) * 100}%`,
                            height: '100%',
                            background: themeStyle.accent,
                            transition: 'width 0.3s ease'
                          }} />
                        </div>
                      </div>

                      {/* Current Question */}
                      {currentQuizGenerated.questions.map((question, index) => (
                        <div 
                          key={question.id}
                          style={{ 
                            display: index === currentQuestionIndex ? 'block' : 'none',
                            background: `rgba(255, 255, 255, 0.1)`,
                            borderRadius: '12px',
                            padding: '20px',
                            marginBottom: '20px'
                          }}
                        >
                          <h4 style={{ 
                            fontSize: '15px', 
                            fontWeight: '600', 
                            marginBottom: '16px',
                            lineHeight: '1.4'
                          }}>
                            {question.question}
                          </h4>
                          
                          {question.type === 'multiple-choice' ? (
                            <div style={{ marginBottom: '16px' }}>
                              {question.options?.map((option, optionIndex) => {
                                const isUserAnswer = userAnswers[question.id] === option;
                                const isCorrectAnswer = option === question.correct_answer;
                                const isIncorrectUserAnswer = reviewMode && isUserAnswer && !isCorrectAnswer;
                                const showCorrectInReview = reviewMode && isCorrectAnswer;
                                
                                return (
                                  <button
                                    key={optionIndex}
                                    onClick={() => !reviewMode && setUserAnswers(prev => ({...prev, [question.id]: option}))}
                                    disabled={reviewMode}
                                    style={{
                                      width: '100%',
                                      padding: '12px',
                                      marginBottom: '8px',
                                      background: showCorrectInReview 
                                        ? 'rgba(76, 175, 80, 0.3)' 
                                        : isIncorrectUserAnswer 
                                          ? 'rgba(244, 67, 54, 0.3)'
                                          : isUserAnswer && !reviewMode
                                            ? themeStyle.accent 
                                            : 'rgba(255, 255, 255, 0.1)',
                                      color: (showCorrectInReview || isIncorrectUserAnswer) 
                                        ? 'white' 
                                        : isUserAnswer && !reviewMode 
                                          ? 'white' 
                                          : themeStyle.text,
                                      border: showCorrectInReview 
                                        ? '2px solid rgba(76, 175, 80, 0.6)'
                                        : isIncorrectUserAnswer
                                          ? '2px solid rgba(244, 67, 54, 0.6)'
                                          : '1px solid rgba(255, 255, 255, 0.2)',
                                      borderRadius: '8px',
                                      fontSize: '13px',
                                      cursor: reviewMode ? 'default' : 'pointer',
                                      textAlign: 'left',
                                      transition: 'all 0.2s ease',
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '8px'
                                    }}
                                  >
                                    <span style={{
                                      background: showCorrectInReview
                                        ? '#4CAF50'
                                        : isIncorrectUserAnswer
                                          ? '#f44336'
                                          : isUserAnswer && !reviewMode
                                            ? 'rgba(255, 255, 255, 0.3)' 
                                            : 'rgba(255, 255, 255, 0.2)',
                                      color: 'white',
                                      width: '20px',
                                      height: '20px',
                                      borderRadius: '50%',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      fontSize: '11px',
                                      fontWeight: 'bold'
                                    }}>
                                      {String.fromCharCode(65 + optionIndex)}
                                    </span>
                                    {option}
                                    {showCorrectInReview && <span style={{ marginLeft: 'auto', fontSize: '16px' }}>✓</span>}
                                    {isIncorrectUserAnswer && <span style={{ marginLeft: 'auto', fontSize: '16px' }}>✗</span>}
                                  </button>
                                );
                              })}
                            </div>
                          ) : (
                            <div style={{ marginBottom: '16px' }}>
                              <input
                                type="text"
                                placeholder="Type your answer here..."
                                value={userAnswers[question.id] || ''}
                                onChange={(e) => !reviewMode && setUserAnswers(prev => ({...prev, [question.id]: e.target.value}))}
                                disabled={reviewMode}
                                style={{
                                  width: '100%',
                                  padding: '12px',
                                  background: reviewMode 
                                    ? (userAnswers[question.id] === question.correct_answer 
                                        ? 'rgba(76, 175, 80, 0.2)' 
                                        : 'rgba(244, 67, 54, 0.2)')
                                    : 'rgba(255, 255, 255, 0.1)',
                                  border: reviewMode
                                    ? (userAnswers[question.id] === question.correct_answer
                                        ? '2px solid rgba(76, 175, 80, 0.6)'
                                        : '2px solid rgba(244, 67, 54, 0.6)')
                                    : '1px solid rgba(255, 255, 255, 0.2)',
                                  borderRadius: '8px',
                                  color: themeStyle.text,
                                  fontSize: '14px'
                                }}
                              />
                              
                              {/* Answer Validation Feedback for fill-in-blank */}
                              {!reviewMode && (
                                <AnswerValidationFeedback
                                  userAnswer={userAnswers[question.id] || ''}
                                  correctAnswer={String(question.correct_answer)}
                                  questionType={question.type}
                                  questionId={question.id}
                                  gradeLevel={gradeLevel}
                                  onValidationComplete={(result) => handleValidationResult(question.id, result)}
                                  encouragementLevel="supportive"
                                  theme={themeStyle}
                                  enabled={true}
                                />
                              )}
                              
                              {reviewMode && (
                                <div>
                                  <div style={{
                                    marginTop: '8px',
                                    padding: '8px 12px',
                                    background: 'rgba(76, 175, 80, 0.2)',
                                    border: '1px solid rgba(76, 175, 80, 0.4)',
                                    borderRadius: '6px',
                                    fontSize: '13px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                  }}>
                                    <span style={{ color: '#4CAF50', fontWeight: 'bold' }}>✓ Correct Answer:</span>
                                    <span style={{ fontWeight: 'bold' }}>{question.correct_answer}</span>
                                  </div>
                                  {semanticValidation[question.id] && (
                                    <div style={{
                                      marginTop: '6px',
                                      padding: '6px 10px',
                                      background: 'rgba(33, 150, 243, 0.1)',
                                      border: '1px solid rgba(33, 150, 243, 0.3)',
                                      borderRadius: '4px',
                                      fontSize: '11px'
                                    }}>
                                      <div style={{ fontWeight: 'bold', marginBottom: '2px' }}>Semantic Analysis:</div>
                                      <div>Similarity: {Math.round(semanticValidation[question.id].similarity * 100)}%</div>
                                      <div style={{ fontStyle: 'italic', opacity: 0.8 }}>
                                        {semanticValidation[question.id].feedback}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          )}

                          {question.korean_integration && (
                            <div style={{
                              background: 'rgba(255, 193, 7, 0.2)',
                              border: '1px solid rgba(255, 193, 7, 0.4)',
                              borderRadius: '6px',
                              padding: '8px 12px',
                              fontSize: '12px',
                              marginBottom: '16px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px'
                            }}>
                              <span>💡</span>
                              <span>Korean vocabulary integrated in this question</span>
                            </div>
                          )}

                          {/* Quiz Hint System */}
                          {!reviewMode && currentStory && (
                            <QuizHintSystem
                              question={question}
                              storyContent={currentStory.englishContent}
                              gradeLevel={gradeLevel}
                              onHintUsed={(hintLevel, hintText) => handleHintUsed(question.id, hintLevel, hintText)}
                              maxHints={3}
                              theme={themeStyle}
                              enabled={languageSupport.grammarHints}
                            />
                          )}

                          <div style={{ 
                            display: 'flex', 
                            gap: '8px', 
                            fontSize: '11px',
                            opacity: 0.7 
                          }}>
                            <span style={{
                              background: 'rgba(255, 255, 255, 0.1)',
                              padding: '4px 8px',
                              borderRadius: '4px'
                            }}>
                              Testing: {question.skill_tested.replace('_', ' ')}
                            </span>
                            <span style={{
                              background: 'rgba(255, 255, 255, 0.1)',
                              padding: '4px 8px',
                              borderRadius: '4px'
                            }}>
                              {question.difficulty_level}
                            </span>
                          </div>
                        </div>
                      ))}

                      {/* Navigation */}
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        marginTop: '20px'
                      }}>
                        <button
                          onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
                          disabled={currentQuestionIndex === 0}
                          style={{
                            background: currentQuestionIndex === 0 
                              ? 'rgba(255, 255, 255, 0.1)' 
                              : 'rgba(255, 255, 255, 0.2)',
                            color: themeStyle.text,
                            border: 'none',
                            borderRadius: '6px',
                            padding: '8px 16px',
                            fontSize: '12px',
                            cursor: currentQuestionIndex === 0 ? 'not-allowed' : 'pointer',
                            opacity: currentQuestionIndex === 0 ? 0.5 : 1
                          }}
                        >
                          ← Previous
                        </button>
                        
                        {reviewMode ? (
                          <button
                            onClick={() => {
                              setReviewMode(false);
                              setQuizCompleted(true);
                            }}
                            style={{
                              background: themeStyle.primary,
                              color: 'white',
                              border: 'none',
                              borderRadius: '6px',
                              padding: '8px 16px',
                              fontSize: '12px',
                              cursor: 'pointer'
                            }}
                          >
                            Back to Results
                          </button>
                        ) : currentQuestionIndex < currentQuizGenerated.questions.length - 1 ? (
                          <button
                            onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
                            disabled={!userAnswers[currentQuizGenerated.questions[currentQuestionIndex].id]}
                            style={{
                              background: !userAnswers[currentQuizGenerated.questions[currentQuestionIndex].id]
                                ? 'rgba(255, 255, 255, 0.1)'
                                : themeStyle.accent,
                              color: !userAnswers[currentQuizGenerated.questions[currentQuestionIndex].id]
                                ? themeStyle.text
                                : 'white',
                              border: 'none',
                              borderRadius: '6px',
                              padding: '8px 16px',
                              fontSize: '12px',
                              cursor: !userAnswers[currentQuizGenerated.questions[currentQuestionIndex].id] 
                                ? 'not-allowed' 
                                : 'pointer',
                              opacity: !userAnswers[currentQuizGenerated.questions[currentQuestionIndex].id] ? 0.5 : 1
                            }}
                          >
                            Next →
                          </button>
                        ) : (
                          <button
                            onClick={async () => {
                              console.log('🎯 Quiz Submit clicked!');
                              console.log('🎯 User answers:', userAnswers);
                              console.log('🎯 Quiz questions:', currentQuizGenerated.questions);
                              
                              // Calculate score with semantic validation
                              let correct = 0;
                              
                              try {
                                console.log('🎯 Starting quiz validation...');
                                
                                for (const q of currentQuizGenerated.questions) {
                                  console.log(`🎯 Processing question ${q.id}:`, q.question);
                                  console.log(`🎯 User answer: "${userAnswers[q.id]}", Correct: "${q.correct_answer}"`);
                                  
                                  if (q.type === 'fill-in-blank') {
                                    // Use semantic validation for fill-in-blank
                                    console.log('🎯 Attempting semantic validation for fill-in-blank');
                                    try {
                                      const isCorrect = await validateAnswerSemantically(
                                        String(userAnswers[q.id] || ''), 
                                        q.correct_answer, 
                                        q.type, 
                                        q.id
                                      );
                                      console.log(`🎯 Semantic validation result: ${isCorrect}`);
                                      if (isCorrect) correct++;
                                    } catch (validationError) {
                                      console.warn('🎯 Semantic validation failed, using exact match:', validationError);
                                      // Fallback to exact match if validation fails
                                      const isCorrect = String(userAnswers[q.id] || '').toLowerCase().trim() === 
                                                       String(q.correct_answer).toLowerCase().trim();
                                      console.log(`🎯 Fallback exact match result: ${isCorrect}`);
                                      if (isCorrect) correct++;
                                    }
                                  } else {
                                    // Exact match for multiple choice
                                    const isCorrect = userAnswers[q.id] === q.correct_answer;
                                    console.log(`🎯 Multiple choice exact match: ${isCorrect}`);
                                    if (isCorrect) correct++;
                                  }
                                }
                                
                                const finalScore = Math.round((correct / currentQuizGenerated.questions.length) * 100);
                                console.log(`🎯 Final score: ${correct}/${currentQuizGenerated.questions.length} = ${finalScore}%`);
                                
                                setQuizScore(finalScore);
                                setQuizCompleted(true);
                                console.log('🎯 Quiz completed successfully!');
                              } catch (error) {
                                console.error('🎯 Error during quiz submission:', error);
                                
                                // Always use fallback scoring if there's any error
                                console.log('🎯 Using fallback scoring due to error');
                                let fallbackCorrect = 0;
                                
                                for (const q of currentQuizGenerated.questions) {
                                  const userAnswer = String(userAnswers[q.id] || '').toLowerCase().trim();
                                  const correctAnswer = String(q.correct_answer).toLowerCase().trim();
                                  
                                  if (userAnswer === correctAnswer) {
                                    fallbackCorrect++;
                                    console.log(`🎯 Fallback: Question ${q.id} correct`);
                                  } else {
                                    console.log(`🎯 Fallback: Question ${q.id} incorrect - "${userAnswer}" vs "${correctAnswer}"`);
                                  }
                                }
                                
                                const fallbackScore = Math.round((fallbackCorrect / currentQuizGenerated.questions.length) * 100);
                                console.log(`🎯 Fallback final score: ${fallbackCorrect}/${currentQuizGenerated.questions.length} = ${fallbackScore}%`);
                                
                                setQuizScore(fallbackScore);
                                setQuizCompleted(true);
                                
                                // Show a brief notification that we used basic scoring
                                console.log('🎯 Quiz completed using basic scoring (validation service unavailable)');
                              }
                            }}
                            disabled={!currentQuizGenerated.questions.every(q => userAnswers[q.id])}
                            style={{
                              background: !currentQuizGenerated.questions.every(q => userAnswers[q.id])
                                ? 'rgba(255, 255, 255, 0.1)'
                                : '#4CAF50',
                              color: 'white',
                              border: 'none',
                              borderRadius: '6px',
                              padding: '8px 16px',
                              fontSize: '12px',
                              fontWeight: '600',
                              cursor: !currentQuizGenerated.questions.every(q => userAnswers[q.id]) 
                                ? 'not-allowed' 
                                : 'pointer',
                              opacity: !currentQuizGenerated.questions.every(q => userAnswers[q.id]) ? 0.5 : 1
                            }}
                          >
                            {currentQuizGenerated.questions.every(q => userAnswers[q.id]) 
                              ? 'Submit Quiz ✓' 
                              : `Answer All Questions (${Object.keys(userAnswers).length}/${currentQuizGenerated.questions.length})`}
                          </button>
                        )}
                      </div>

                      {/* Question Overview */}
                      <div style={{
                        marginTop: '20px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        padding: '12px'
                      }}>
                        <h4 style={{ 
                          fontSize: '13px', 
                          fontWeight: '600', 
                          marginBottom: '12px',
                          color: themeStyle.accent 
                        }}>
                          Question Overview
                        </h4>
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(5, 1fr)',
                          gap: '6px',
                          maxHeight: '120px',
                          overflowY: 'auto'
                        }}>
                          {currentQuizGenerated.questions.map((q, idx) => {
                            const isAnswered = userAnswers[q.id];
                            const isCurrent = idx === currentQuestionIndex;
                            const isCorrect = reviewMode && userAnswers[q.id] === q.correct_answer;
                            const isIncorrect = reviewMode && userAnswers[q.id] && userAnswers[q.id] !== q.correct_answer;
                            
                            return (
                              <button
                                key={q.id}
                                onClick={() => setCurrentQuestionIndex(idx)}
                                style={{
                                  width: '32px',
                                  height: '32px',
                                  borderRadius: '6px',
                                  border: isCurrent ? `2px solid ${themeStyle.accent}` : '1px solid rgba(255, 255, 255, 0.2)',
                                  background: reviewMode 
                                    ? (isCorrect ? 'rgba(76, 175, 80, 0.4)' : isIncorrect ? 'rgba(244, 67, 54, 0.4)' : 'rgba(255, 255, 255, 0.1)')
                                    : (isAnswered ? themeStyle.accent : 'rgba(255, 255, 255, 0.1)'),
                                  color: (isAnswered && !reviewMode) || reviewMode ? 'white' : themeStyle.text,
                                  fontSize: '11px',
                                  fontWeight: 'bold',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center'
                                }}
                              >
                                {idx + 1}
                              </button>
                            );
                          })}
                        </div>
                        <div style={{ 
                          fontSize: '10px', 
                          marginTop: '8px', 
                          opacity: 0.7,
                          display: 'flex',
                          gap: '12px'
                        }}>
                          <span>🟢 Correct</span>
                          <span>🔴 Incorrect</span>
                          <span>⚪ Unanswered</span>
                        </div>
                      </div>

                      {/* Quiz Results */}
                      {quizCompleted && (
                        <div style={{
                          background: 'rgba(76, 175, 80, 0.2)',
                          border: '1px solid rgba(76, 175, 80, 0.4)',
                          borderRadius: '12px',
                          padding: '20px',
                          marginTop: '20px',
                          textAlign: 'center'
                        }}>
                          <div style={{ fontSize: '32px', marginBottom: '12px' }}>
                            {quizScore >= 80 ? '🏆' : quizScore >= 60 ? '🎉' : '📚'}
                          </div>
                          <h4 style={{ 
                            fontSize: '16px', 
                            fontWeight: '600', 
                            marginBottom: '8px',
                            color: '#4CAF50'
                          }}>
                            Quiz Complete!
                          </h4>
                          <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>
                            {quizScore}%
                          </div>
                          <p style={{ fontSize: '12px', margin: '0 0 16px 0', opacity: 0.8 }}>
                            You got {currentQuizGenerated.questions.filter(q => userAnswers[q.id] === q.correct_answer).length} out of {currentQuizGenerated.questions.length} questions correct!
                          </p>
                          
                          <div style={{ 
                            display: 'flex', 
                            flexWrap: 'wrap', 
                            gap: '4px', 
                            justifyContent: 'center',
                            marginBottom: '16px'
                          }}>
                            {currentQuizGenerated.metadata.skills_covered.map(skill => (
                              <span 
                                key={skill}
                                style={{
                                  background: 'rgba(255, 255, 255, 0.2)',
                                  padding: '2px 6px',
                                  borderRadius: '4px',
                                  fontSize: '10px'
                                }}
                              >
                                {skill.replace('_', ' ')}
                              </span>
                            ))}
                          </div>

                          <div style={{ 
                            display: 'flex', 
                            gap: '8px', 
                            justifyContent: 'center',
                            marginBottom: '16px'
                          }}>
                            <button
                              onClick={() => {
                                setCurrentQuestionIndex(0);
                                setQuizCompleted(false);
                                setReviewMode(true);
                              }}
                              style={{
                                background: themeStyle.primary,
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                padding: '8px 16px',
                                fontSize: '12px',
                                cursor: 'pointer'
                              }}
                            >
                              📝 Review Answers
                            </button>
                            <button
                              onClick={() => {
                                setCurrentQuizGenerated(null);
                                setQuizCompleted(false);
                                setUserAnswers({});
                                setCurrentQuestionIndex(0);
                                setReviewMode(false);
                              }}
                              style={{
                                background: themeStyle.accent,
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                padding: '8px 16px',
                                fontSize: '12px',
                                cursor: 'pointer'
                              }}
                            >
                              Try Another Quiz
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </>
              ) : rightSidebarTab === 'vocabulary' ? (
                <>
                  <h3 style={{ margin: '0 0 16px 0', fontSize: '15px', fontWeight: '600', color: themeStyle.accent }}>
                    {currentStory?.extractedNouns ?
                      `Extracted Korean Words (${currentStory.extractedNouns.length} words)` :
                      `Korean Vocabulary (${vocabularyWords.length} words)`
                    }
                  </h3>

                  <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    {(currentStory?.extractedNouns || vocabularyWords).map((word, index) => (
                      <div key={index} style={{
                        background: `rgba(255, 255, 255, 0.1)`,
                        borderRadius: '8px',
                        padding: '12px',
                        marginBottom: '8px',
                        fontSize: '13px'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                          <span style={{ fontWeight: '600', color: themeStyle.accent }}>{word.english}</span>
                          <div style={{
                            background: word.frequency ? '#4CAF50' : (word.difficulty <= 2 ? '#4CAF50' : word.difficulty <= 3 ? '#FFC107' : '#FF5722'),
                            color: 'white',
                            padding: '2px 6px',
                            borderRadius: '10px',
                            fontSize: '10px',
                            fontWeight: 'bold'
                          }}>
                            {word.frequency ? `${word.frequency}x` : `Level ${word.difficulty}`}
                          </div>
                        </div>
                        <div style={{
                          fontSize: '16px',
                          fontFamily: "'Noto Sans KR', sans-serif",
                          marginBottom: '4px',
                          color: themeStyle.text
                        }}>
                          {word.korean}
                        </div>
                        {word.romanized && (
                          <div style={{ fontSize: '11px', opacity: 0.7, fontStyle: 'italic' }}>
                            {word.romanized}
                          </div>
                        )}
                        {word.frequency && (
                          <div style={{ fontSize: '11px', opacity: 0.8, color: themeStyle.accent, marginTop: '4px' }}>
                            💡 Found {word.frequency} time{word.frequency > 1 ? 's' : ''} in this story
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div style={{
                    marginTop: '16px',
                    padding: '12px',
                    background: `rgba(255, 255, 255, 0.05)`,
                    borderRadius: '8px'
                  }}>
                    <div style={{ fontSize: '12px', opacity: 0.8, marginBottom: '8px' }}>
                      <strong>Progress:</strong> {languageProgress.wordsLearned}/50 words mastered
                    </div>
                    <div style={{
                      width: '100%',
                      height: '6px',
                      background: 'rgba(255, 255, 255, 0.2)',
                      borderRadius: '3px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${(languageProgress.wordsLearned / 50) * 100}%`,
                        height: '100%',
                        background: themeStyle.accent,
                        transition: 'width 0.3s ease'
                      }} />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <h3 style={{ margin: '0 0 16px 0', fontSize: '15px', fontWeight: '600', color: themeStyle.accent }}>
                    Language Learning Progress
                  </h3>

                  {/* Reading Skills */}
                  <div style={{
                    background: `rgba(255, 255, 255, 0.1)`,
                    borderRadius: '8px',
                    padding: '16px',
                    marginBottom: '16px'
                  }}>
                    <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '600' }}>
                      Reading Skills
                    </h4>
                    {Object.entries(languageProgress.readingSkills).map(([skill, value]) => (
                      <div key={skill} style={{ marginBottom: '10px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                          <span style={{ textTransform: 'capitalize' }}>{skill}</span>
                          <span>{value}%</span>
                        </div>
                        <div style={{
                          width: '100%',
                          height: '4px',
                          background: 'rgba(255, 255, 255, 0.2)',
                          borderRadius: '2px',
                          overflow: 'hidden'
                        }}>
                          <div style={{
                            width: `${value}%`,
                            height: '100%',
                            background: skill === 'comprehension' ? '#4CAF50' : skill === 'vocabulary' ? '#2196F3' : '#FF9800',
                            transition: 'width 0.3s ease'
                          }} />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Milestones */}
                  <div style={{
                    background: `rgba(255, 255, 255, 0.1)`,
                    borderRadius: '8px',
                    padding: '16px',
                    marginBottom: '16px'
                  }}>
                    <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '600' }}>
                      Korean Milestones
                    </h4>
                    {languageProgress.milestones.map((milestone, index) => (
                      <div key={index} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 0',
                        borderBottom: index < languageProgress.milestones.length - 1 ? '1px solid rgba(255, 255, 255, 0.1)' : 'none'
                      }}>
                        <div style={{
                          width: '16px',
                          height: '16px',
                          borderRadius: '50%',
                          background: milestone.achieved ? '#4CAF50' : 'rgba(255, 255, 255, 0.3)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '10px'
                        }}>
                          {milestone.achieved ? '✓' : milestone.level}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '12px', fontWeight: '500', opacity: milestone.achieved ? 1 : 0.7 }}>
                            {milestone.name}
                          </div>
                          <div style={{ fontSize: '10px', opacity: 0.6 }}>
                            {milestone.requirement}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Current Blend Level Status */}
                  <div style={{
                    background: `rgba(255, 255, 255, 0.1)`,
                    borderRadius: '8px',
                    padding: '16px'
                  }}>
                    <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '600' }}>
                      Current Level: {languageBlendLevel}/6
                    </h4>
                    <div style={{ fontSize: '12px', marginBottom: '8px' }}>
                      {getLevelInfo(languageBlendLevel).emoji} {getLevelInfo(languageBlendLevel).description}
                    </div>
                    <div style={{
                      width: '100%',
                      height: '8px',
                      background: 'rgba(255, 255, 255, 0.2)',
                      borderRadius: '4px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${(languageBlendLevel / 6) * 100}%`,
                        height: '100%',
                        background: `linear-gradient(90deg, #4CAF50, ${themeStyle.accent})`,
                        transition: 'width 0.3s ease'
                      }} />
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>

      {/* Debug Panel - Bottom Expandable */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'linear-gradient(to top, rgba(0, 0, 0, 0.95), rgba(10, 10, 20, 0.95))',
        borderTop: '2px solid rgba(100, 200, 255, 0.3)',
        transition: 'height 0.3s ease',
        height: debugPanelOpen ? '400px' : '40px',
        zIndex: 100,
        boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.5)'
      }}>
        {/* Toggle Button */}
        <div
          onClick={() => setDebugPanelOpen(!debugPanelOpen)}
          style={{
            padding: '8px 20px',
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'rgba(100, 200, 255, 0.1)',
            borderBottom: debugPanelOpen ? '1px solid rgba(100, 200, 255, 0.2)' : 'none'
          }}
        >
          <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#64C8FF' }}>
            🔍 LLM Debug Panel {debugData ? `(${debugData.mappingCount} word mappings)` : ''}
          </span>
          <span style={{ fontSize: '18px' }}>
            {debugPanelOpen ? '▼' : '▲'}
          </span>
        </div>

        {/* Debug Content */}
        {debugPanelOpen && (
          <div style={{
            padding: '20px',
            height: 'calc(100% - 40px)',
            overflowY: 'auto',
            fontFamily: 'monospace',
            fontSize: '12px',
            color: '#e0e0e0'
          }}>
            {debugData ? (
              <div>
                <div style={{ marginBottom: '20px' }}>
                  <h3 style={{ color: '#64C8FF', marginBottom: '10px' }}>📝 LLM Call 1 - English Story Generation</h3>
                  <div style={{
                    background: 'rgba(0, 50, 100, 0.2)',
                    padding: '10px',
                    borderRadius: '4px',
                    marginBottom: '10px',
                    maxHeight: '300px',
                    overflowY: 'auto'
                  }}>
                    <div style={{ color: '#ffcc00', marginBottom: '5px' }}>Prompt (Full):</div>
                    <pre style={{ whiteSpace: 'pre-wrap', color: '#aaa' }}>
                      {debugData.llmCall1?.prompt || 'No prompt data'}
                    </pre>
                  </div>
                  <div style={{
                    background: 'rgba(0, 100, 50, 0.2)',
                    padding: '10px',
                    borderRadius: '4px',
                    maxHeight: '400px',
                    overflowY: 'auto'
                  }}>
                    <div style={{ color: '#00ff88', marginBottom: '5px' }}>Response (Full):</div>
                    <pre style={{ whiteSpace: 'pre-wrap' }}>
                      {debugData.llmCall1?.response || 'No response data'}
                    </pre>
                  </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <h3 style={{ color: '#64C8FF', marginBottom: '10px' }}>🌏 LLM Call 2 - Korean Translation & Mappings</h3>
                  <div style={{
                    background: 'rgba(0, 50, 100, 0.2)',
                    padding: '10px',
                    borderRadius: '4px',
                    marginBottom: '10px',
                    maxHeight: '300px',
                    overflowY: 'auto'
                  }}>
                    <div style={{ color: '#ffcc00', marginBottom: '5px' }}>Prompt (Full - asking for JSON with mappings):</div>
                    <pre style={{ whiteSpace: 'pre-wrap', color: '#aaa' }}>
                      {debugData.llmCall2?.prompt || 'No prompt data'}
                    </pre>
                  </div>
                  <div style={{
                    background: 'rgba(100, 0, 100, 0.2)',
                    padding: '10px',
                    borderRadius: '4px',
                    maxHeight: '500px',
                    overflowY: 'auto'
                  }}>
                    <div style={{ color: '#ff88ff', marginBottom: '5px' }}>Raw Response (Full - should be JSON):</div>
                    <pre style={{ whiteSpace: 'pre-wrap' }}>
                      {debugData.llmCall2?.response || 'No response data'}
                    </pre>
                  </div>
                </div>

                <div>
                  <h3 style={{ color: '#64C8FF', marginBottom: '10px' }}>
                    📊 Extracted Word Mappings ({(() => {
                      const mappings = debugData.extractedMappings || {}
                      if (mappings.nouns || mappings.verbs || mappings.adjectives) {
                        // New format with categories
                        const nounsCount = Object.keys(mappings.nouns || {}).length
                        const verbsCount = Object.keys(mappings.verbs || {}).length
                        const adjectivesCount = Object.keys(mappings.adjectives || {}).length
                        return nounsCount + verbsCount + adjectivesCount
                      } else {
                        // Legacy format
                        return Object.keys(mappings).length
                      }
                    })()} total)
                  </h3>
                  <div style={{
                    background: 'rgba(50, 50, 0, 0.3)',
                    padding: '10px',
                    borderRadius: '4px'
                  }}>
                    <pre style={{ whiteSpace: 'pre-wrap', color: '#ffff88' }}>
                      {JSON.stringify(debugData.extractedMappings, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ color: '#888', textAlign: 'center', paddingTop: '50px' }}>
                Generate a story to see LLM debug information
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default App