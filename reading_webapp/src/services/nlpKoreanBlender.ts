import nlp from 'compromise'

interface NounTranslation {
  english: string
  korean: string
  frequency: number
}

interface EnhancedStoryPair {
  englishStory: string
  koreanStory: string
  extractedNouns: NounTranslation[]
  sentences: {
    english: string[]
    korean: string[]
  }
}

interface BlendingOptions {
  level: number // 0-7
  theme: string
}

class NLPKoreanBlender {
  // Common noun translations for educational content
  private commonNounTranslations: Record<string, string> = {
    // Family & People
    'family': '가족',
    'mother': '어머니',
    'father': '아버지',
    'sister': '자매',
    'brother': '형제',
    'friend': '친구',
    'teacher': '선생님',
    'student': '학생',
    'child': '아이',
    'children': '아이들',
    'boy': '소년',
    'girl': '소녀',
    'baby': '아기',

    // Animals
    'dog': '개',
    'cat': '고양이',
    'bird': '새',
    'fish': '물고기',
    'rabbit': '토끼',
    'bear': '곰',
    'elephant': '코끼리',
    'lion': '사자',
    'tiger': '호랑이',
    'horse': '말',
    'cow': '소',
    'pig': '돼지',

    // Nature & Places
    'tree': '나무',
    'flower': '꽃',
    'mountain': '산',
    'river': '강',
    'ocean': '바다',
    'forest': '숲',
    'park': '공원',
    'garden': '정원',
    'beach': '해변',
    'sky': '하늘',
    'sun': '태양',
    'moon': '달',
    'star': '별',
    'cloud': '구름',

    // Food
    'food': '음식',
    'rice': '밥',
    'bread': '빵',
    'water': '물',
    'milk': '우유',
    'apple': '사과',
    'banana': '바나나',
    'cake': '케이크',
    'cookie': '쿠키',
    'candy': '사탕',
    'chocolate': '초콜릿',

    // School & Learning
    'school': '학교',
    'book': '책',
    'pencil': '연필',
    'paper': '종이',
    'desk': '책상',
    'chair': '의자',
    'classroom': '교실',
    'homework': '숙제',
    'test': '시험',
    'lesson': '수업',

    // Home & Objects
    'house': '집',
    'room': '방',
    'door': '문',
    'window': '창문',
    'table': '테이블',
    'bed': '침대',
    'car': '자동차',
    'bicycle': '자전거',
    'ball': '공',
    'toy': '장난감',
    'game': '게임',
    'music': '음악',

    // Emotions & Abstract
    'love': '사랑',
    'happiness': '행복',
    'joy': '기쁨',
    'sadness': '슬픔',
    'anger': '화',
    'fear': '두려움',
    'surprise': '놀라움',
    'dream': '꿈',
    'hope': '희망',
    'peace': '평화',
    'story': '이야기',
    'adventure': '모험',
    'journey': '여행',
    'treasure': '보물',
    'magic': '마법',
    'hero': '영웅',
    'princess': '공주',
    'king': '왕',
    'queen': '여왕',

    // Colors
    'red': '빨간색',
    'blue': '파란색',
    'green': '초록색',
    'yellow': '노란색',
    'purple': '보라색',
    'orange': '주황색',
    'pink': '분홍색',
    'black': '검은색',
    'white': '흰색',
    'brown': '갈색',

    // Time
    'morning': '아침',
    'afternoon': '오후',
    'evening': '저녁',
    'night': '밤',
    'day': '낮',
    'week': '주',
    'month': '달',
    'year': '년',
    'time': '시간',
    'today': '오늘',
    'tomorrow': '내일',
    'yesterday': '어제'
  }

  // Extract nouns from English text using Compromise.js
  extractNouns(text: string): NounTranslation[] {
    const doc = nlp(text)
    const nouns = doc.nouns().out('array')

    // Count frequency and get Korean translations
    const nounFrequency: Record<string, number> = {}
    nouns.forEach(noun => {
      const normalized = noun.toLowerCase().replace(/[^a-z]/g, '')

      // Filter out technical terms, CSS values, and non-educational words
      if (normalized.length > 2 &&
          !normalized.includes('rgba') &&
          !normalized.includes('css') &&
          !normalized.includes('px') &&
          !normalized.match(/^\d+$/) &&
          !['div', 'span', 'src', 'img', 'href'].includes(normalized)) {
        nounFrequency[normalized] = (nounFrequency[normalized] || 0) + 1
      }
    })

    // Convert to NounTranslation array with Korean translations
    return Object.entries(nounFrequency)
      .map(([english, frequency]) => {
        const korean = this.commonNounTranslations[english] || this.generateKoreanTranslation(english)
        return { english, korean, frequency }
      })
      .filter(noun => noun.korean !== noun.english && this.commonNounTranslations[noun.english]) // Only include words we have translations for
      .sort((a, b) => b.frequency - a.frequency) // Sort by frequency
  }

  // Fallback Korean translation generation (basic)
  private generateKoreanTranslation(english: string): string {
    // Skip words that are clearly not nouns (CSS values, short words, etc.)
    if (english.length < 3 ||
        english.includes('rgba') ||
        english.includes('#') ||
        english.match(/^\d+$/)) {
      return english // Don't translate CSS values, numbers, etc.
    }

    // For now, return the English word if we don't have a translation
    // In a real implementation, this could call a translation API
    return english
  }

  // Split text into sentences
  private splitIntoSentences(text: string): string[] {
    return text
      .split(/[.!?]+/)
      .map(sentence => sentence.trim())
      .filter(sentence => sentence.length > 0)
  }

  // Apply noun translations to text based on percentage
  private applyNounTranslations(text: string, nouns: NounTranslation[], percentage: number): string {
    let result = text
    const nounsToUse = nouns.slice(0, Math.ceil(nouns.length * (percentage / 100)))

    nounsToUse.forEach(noun => {
      const regex = new RegExp(`\\b${noun.english}\\b`, 'gi')
      result = result.replace(regex, `**${noun.english} (${noun.korean})**`)
    })

    return result
  }

  // Enhanced story generation with dual-language support
  async generateEnhancedStoryPair(englishStory: string): Promise<EnhancedStoryPair> {
    // Extract nouns from English story
    const extractedNouns = this.extractNouns(englishStory)

    // Split into sentences
    const englishSentences = this.splitIntoSentences(englishStory)

    // Generate Korean version (simplified - in real implementation would use Azure Translation)
    const koreanSentences = await this.translateSentences(englishSentences)

    return {
      englishStory,
      koreanStory: koreanSentences.join(' '),
      extractedNouns,
      sentences: {
        english: englishSentences,
        korean: koreanSentences
      }
    }
  }

  // Mock Korean sentence translation (replace with real translation service)
  private async translateSentences(englishSentences: string[]): Promise<string[]> {
    // This is a simplified mock - in real implementation, use Azure Translator
    return englishSentences.map(sentence => {
      // Apply basic word replacements for demo
      let korean = sentence
      Object.entries(this.commonNounTranslations).forEach(([eng, kor]) => {
        const regex = new RegExp(`\\b${eng}\\b`, 'gi')
        korean = korean.replace(regex, kor)
      })
      return korean
    })
  }

  // Apply 7-level mirror progression blending
  applyMirrorProgression(storyPair: EnhancedStoryPair, level: number): string {
    const { sentences, extractedNouns } = storyPair

    switch (level) {
      case 0: // 100% English
        return sentences.english.join(' ')

      case 1: // English + 20% Korean noun hints
        return this.blendSentences(sentences.english, sentences.korean, {
          englishPercentage: 100,
          koreanPercentage: 0,
          nounTranslationPercentage: 20,
          nouns: extractedNouns
        })

      case 2: // English + 50% Korean noun hints
        return this.blendSentences(sentences.english, sentences.korean, {
          englishPercentage: 100,
          koreanPercentage: 0,
          nounTranslationPercentage: 50,
          nouns: extractedNouns
        })

      case 3: // English + 80% Korean noun hints + strategic sentence translation
        return this.blendSentences(sentences.english, sentences.korean, {
          englishPercentage: 80,
          koreanPercentage: 20,
          nounTranslationPercentage: 80,
          nouns: extractedNouns,
          alternateEvery: 3
        })

      case 4: // 50/50 sentence alternation + noun support
        return this.blendSentences(sentences.english, sentences.korean, {
          englishPercentage: 50,
          koreanPercentage: 50,
          nounTranslationPercentage: 70,
          nouns: extractedNouns,
          alternateEvery: 2
        })

      case 5: // Korean dominant + English noun hints (mirror of Level 1)
        return this.blendSentences(sentences.english, sentences.korean, {
          englishPercentage: 0,
          koreanPercentage: 100,
          englishNounHints: true,
          englishNounPercentage: 20,
          nouns: extractedNouns
        })

      case 6: // Korean sentences + English with noun translations (mirror of Level 4)
        return this.blendSentences(sentences.english, sentences.korean, {
          englishPercentage: 20,
          koreanPercentage: 80,
          nounTranslationPercentage: 50,
          nouns: extractedNouns,
          alternateEvery: 2
        })

      case 7: // 100% Korean
        return sentences.korean.join(' ')

      default:
        return sentences.english.join(' ')
    }
  }

  // Advanced sentence blending logic
  private blendSentences(
    englishSentences: string[],
    koreanSentences: string[],
    options: {
      englishPercentage: number
      koreanPercentage: number
      nounTranslationPercentage?: number
      englishNounHints?: boolean
      englishNounPercentage?: number
      nouns: NounTranslation[]
      alternateEvery?: number
    }
  ): string {
    const result: string[] = []

    for (let i = 0; i < englishSentences.length; i++) {
      let sentence: string

      // Determine if this sentence should be Korean or English
      if (options.alternateEvery) {
        const useKorean = (i % options.alternateEvery) < (options.alternateEvery * (options.koreanPercentage / 100))
        sentence = useKorean ? koreanSentences[i] : englishSentences[i]

        // Add noun translations to English sentences
        if (!useKorean && options.nounTranslationPercentage) {
          sentence = this.applyNounTranslations(sentence, options.nouns, options.nounTranslationPercentage)
        }

        // Add English noun hints to Korean sentences
        if (useKorean && options.englishNounHints && options.englishNounPercentage) {
          sentence = this.applyEnglishNounHints(sentence, options.nouns, options.englishNounPercentage)
        }
      } else {
        // Use percentage-based selection
        const useKorean = Math.random() < (options.koreanPercentage / 100)
        sentence = useKorean ? koreanSentences[i] : englishSentences[i]

        if (!useKorean && options.nounTranslationPercentage) {
          sentence = this.applyNounTranslations(sentence, options.nouns, options.nounTranslationPercentage)
        }
      }

      result.push(sentence)
    }

    return result.join(' ')
  }

  // Apply English noun hints to Korean sentences (for Level 5)
  private applyEnglishNounHints(koreanText: string, nouns: NounTranslation[], percentage: number): string {
    let result = koreanText
    const nounsToUse = nouns.slice(0, Math.ceil(nouns.length * (percentage / 100)))

    nounsToUse.forEach(noun => {
      const regex = new RegExp(`\\b${noun.korean}\\b`, 'gi')
      result = result.replace(regex, `**${noun.english} (${noun.korean})**`)
    })

    return result
  }

  // Get level description for UI
  getLevelDescription(level: number): string {
    const descriptions = [
      "Pure English (100% English)",
      "English + Korean vocabulary hints (20% nouns)",
      "English + Korean vocabulary hints (50% nouns)",
      "English + Korean vocabulary hints (80% nouns) + Strategic sentence translations",
      "Alternating sentences (50/50) + noun support",
      "Korean dominant + English noun hints (mirror of Level 1)",
      "Alternating Korean sentences + English with noun translations",
      "Full Korean immersion (100% Korean)"
    ]
    return descriptions[level] || descriptions[0]
  }
}

export const nlpKoreanBlender = new NLPKoreanBlender()
export type { EnhancedStoryPair, NounTranslation, BlendingOptions }