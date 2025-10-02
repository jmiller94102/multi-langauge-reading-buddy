/**
 * Centralized Language Support Service
 * Handles all API calls for language support features with caching, error handling, and retry logic
 */

interface TTSOptions {
  speed?: number;
  voice?: string;
  childSafe?: boolean;
}

interface CacheEntry {
  data: any;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

interface ApiCallOptions {
  retries?: number;
  timeout?: number;
  cacheTTL?: number;
}

export class LanguageSupportService {
  private static instance: LanguageSupportService;
  private cache = new Map<string, CacheEntry>();
  private readonly baseUrl = 'http://localhost:3001';
  private readonly defaultTimeout = 10000; // 10 seconds
  private readonly defaultRetries = 2;
  private readonly defaultCacheTTL = 300000; // 5 minutes

  private constructor() {}

  public static getInstance(): LanguageSupportService {
    if (!LanguageSupportService.instance) {
      LanguageSupportService.instance = new LanguageSupportService();
    }
    return LanguageSupportService.instance;
  }

  /**
   * Text-to-Speech API call
   */
  async getTextToSpeech(text: string, language: string, options: TTSOptions = {}): Promise<any> {
    return this.apiCall('/api/text-to-speech', {
      text,
      language: language === 'korean' ? 'ko-KR' : 'en-US',
      voice: language,
      speed: options.speed || 1.0,
      childSafe: options.childSafe !== false
    }, { cacheTTL: 600000 }); // Cache TTS for 10 minutes
  }

  /**
   * Quiz Hint Generation API call
   */
  async getQuizHint(question: string, story: string, level: number, hintLevel: number = 1): Promise<any> {
    return this.apiCall('/api/generate-quiz-hint', {
      questionText: question,
      storyContent: story,
      gradeLevel: this.mapLevelToGrade(level),
      hintLevel,
      childSafe: true
    });
  }

  /**
   * Korean Phonetics API call
   */
  async getKoreanPhonetics(text: string, displayType: 'simplified' | 'IPA' | 'both' = 'both'): Promise<any> {
    return this.apiCall('/api/korean-phonetics', {
      koreanText: text,
      displayType,
      childSafe: true
    }, { cacheTTL: 3600000 }); // Cache phonetics for 1 hour
  }

  /**
   * Korean Romanization API call
   */
  async getKoreanRomanization(text: string, system: 'revised' | 'mccune' | 'yale' = 'revised'): Promise<any> {
    return this.apiCall('/api/korean-romanization', {
      koreanText: text,
      system,
      childSafe: true
    }, { cacheTTL: 3600000 }); // Cache romanization for 1 hour
  }

  /**
   * Answer Validation API call
   */
  async validateAnswer(userAnswer: string, correctAnswer: string, type: string, gradeLevel?: string): Promise<any> {
    return this.apiCall('/api/validate-answer', {
      userAnswer,
      correctAnswer,
      questionType: type,
      gradeLevel: gradeLevel || '4th Grade',
      childSafe: true
    });
  }

  /**
   * Centralized API call with error handling, caching, and retry logic
   */
  private async apiCall(endpoint: string, data: any, options: ApiCallOptions = {}): Promise<any> {
    const cacheKey = this.generateCacheKey(endpoint, data);
    const cachedResponse = this.getCachedResponse(cacheKey);
    
    if (cachedResponse) {
      return cachedResponse;
    }

    const retries = options.retries ?? this.defaultRetries;
    const timeout = options.timeout ?? this.defaultTimeout;
    const cacheTTL = options.cacheTTL ?? this.defaultCacheTTL;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        const response = await fetch(`${this.baseUrl}${endpoint}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...data, childSafe: true }),
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`API call failed: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();

        // Cache successful responses
        if (result.success) {
          this.cacheResponse(cacheKey, result, cacheTTL);
        }

        return result;

      } catch (error) {
        console.warn(`Language support API attempt ${attempt + 1} failed:`, error);
        
        if (attempt === retries) {
          console.error(`Language support API failed after ${retries + 1} attempts:`, error);
          return this.getFallbackResponse(endpoint, data);
        }

        // Wait before retry with exponential backoff
        await this.delay(Math.pow(2, attempt) * 1000);
      }
    }

    return this.getFallbackResponse(endpoint, data);
  }

  /**
   * Generate cache key from endpoint and data
   */
  private generateCacheKey(endpoint: string, data: any): string {
    const dataString = JSON.stringify(data, Object.keys(data).sort());
    return `${endpoint}:${btoa(dataString)}`;
  }

  /**
   * Get cached response if valid
   */
  private getCachedResponse(cacheKey: string): any | null {
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < cached.ttl) {
      return cached.data;
    }
    
    if (cached) {
      this.cache.delete(cacheKey); // Remove expired cache
    }
    
    return null;
  }

  /**
   * Cache successful API response
   */
  private cacheResponse(cacheKey: string, data: any, ttl: number): void {
    this.cache.set(cacheKey, {
      data,
      timestamp: Date.now(),
      ttl
    });

    // Cleanup old cache entries periodically
    if (this.cache.size > 1000) {
      this.cleanupCache();
    }
  }

  /**
   * Clean up expired cache entries
   */
  private cleanupCache(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp >= entry.ttl) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Get fallback response for failed API calls
   */
  private getFallbackResponse(endpoint: string, data: any): any {
    const fallbacks: Record<string, any> = {
      '/api/text-to-speech': {
        success: false,
        error: 'Audio generation temporarily unavailable. Please try again later.',
        fallback: true
      },
      '/api/generate-quiz-hint': {
        success: true,
        hint: "Look for clues in the story that relate to this question! 🔍",
        fallback: true
      },
      '/api/korean-phonetics': {
        success: true,
        simplified: this.getBasicRomanization(data.koreanText),
        ipa: '[phonetics unavailable]',
        confidence: 0.5,
        fallback: true
      },
      '/api/korean-romanization': {
        success: true,
        romanization: this.getBasicRomanization(data.koreanText),
        fallback: true
      },
      '/api/validate-answer': {
        success: true,
        isCorrect: data.userAnswer?.toLowerCase().trim() === data.correctAnswer?.toLowerCase().trim(),
        similarity: 0.8,
        feedback: 'Great effort! Keep trying!',
        fallback: true
      }
    };

    return fallbacks[endpoint] || {
      success: false,
      error: 'Service temporarily unavailable',
      fallback: true
    };
  }

  /**
   * Basic romanization for common Korean words (fallback)
   */
  private getBasicRomanization(koreanText: string): string {
    const basicMap: Record<string, string> = {
      '안녕하세요': 'annyeong-haseyo',
      '감사합니다': 'gamsahamnida',
      '안녕': 'annyeong',
      '네': 'ne',
      '아니요': 'aniyo',
      '친구': 'chingu',
      '학교': 'hakgyo',
      '사랑': 'sarang'
    };

    return basicMap[koreanText] || koreanText;
  }

  /**
   * Map Korean blend level to grade level
   */
  private mapLevelToGrade(level: number): string {
    if (level <= 2) return '2nd Grade';
    if (level <= 4) return '3rd Grade';
    if (level <= 6) return '4th Grade';
    if (level <= 8) return '5th Grade';
    return '6th Grade';
  }

  /**
   * Delay utility for retry logic
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Clear all cached data
   */
  public clearCache(): void {
    this.cache.clear();
  }

  /**
   * Get cache statistics
   */
  public getCacheStats(): { size: number; entries: string[] } {
    return {
      size: this.cache.size,
      entries: Array.from(this.cache.keys())
    };
  }
  /**
   * Health check for the service
   */
  async healthCheck(): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(`${this.baseUrl}/health`, {
        method: 'GET',
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      return response.ok;
    } catch {
      return false;
    }
  }
}
