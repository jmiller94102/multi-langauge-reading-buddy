/**
 * Privacy-First Analytics Service
 * Tracks usage patterns without storing personal data
 */

interface FeatureUsage {
  [action: string]: any;
  lastUsed?: number;
  totalUsage?: number;
  uniqueWords?: Set<string>;
  uniqueWordCount?: number;
}

interface LanguageSupportAnalytics {
  audioPlayer: FeatureUsage;
  quizHints: FeatureUsage;
  koreanPhonetics: FeatureUsage;
  romanization: FeatureUsage;
  answerValidation: FeatureUsage;
  wordAudio: FeatureUsage;
}

interface SessionMetrics {
  sessionStart: number;
  sessionEnd?: number;
  featuresUsed: string[];
  totalInteractions: number;
  koreanLevel: number;
  themeUsed: string;
}

interface PerformanceMetrics {
  apiResponseTimes: Record<string, number[]>;
  cacheHitRates: Record<string, { hits: number; misses: number }>;
  errorRates: Record<string, { successes: number; failures: number }>;
}

export class AnalyticsService {
  private static instance: AnalyticsService;
  private readonly STORAGE_KEY = 'readquest_analytics';
  private readonly SESSION_KEY = 'readquest_session';
  private readonly PERFORMANCE_KEY = 'readquest_performance';
  
  private currentSession: SessionMetrics | null = null;

  private constructor() {
    this.initializeSession();
  }

  public static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  /**
   * Initialize a new session
   */
  private initializeSession(): void {
    this.currentSession = {
      sessionStart: Date.now(),
      featuresUsed: [],
      totalInteractions: 0,
      koreanLevel: 0,
      themeUsed: 'Space'
    };
  }

  /**
   * Track language support feature usage
   */
  trackFeatureUsage(feature: keyof LanguageSupportAnalytics, action: string, metadata?: any): void {
    try {
      const analytics = this.getLocalAnalytics();
      
      if (!analytics[feature]) {
        analytics[feature] = {};
      }

      // Increment action counter
      analytics[feature][action] = (analytics[feature][action] || 0) + 1;
      analytics[feature].lastUsed = Date.now();
      analytics[feature].totalUsage = (analytics[feature].totalUsage || 0) + 1;

      // Update session data
      if (this.currentSession) {
        this.currentSession.totalInteractions++;
        if (!this.currentSession.featuresUsed.includes(feature)) {
          this.currentSession.featuresUsed.push(feature);
        }
      }

      // Store aggregated, non-personal data only
      this.setLocalAnalytics(analytics);

      // Track specific metrics based on feature
      this.trackFeatureSpecificMetrics(feature, action, metadata);

    } catch (error) {
      console.warn('Analytics tracking failed:', error);
    }
  }

  /**
   * Track feature-specific metrics
   */
  private trackFeatureSpecificMetrics(feature: string, action: string, metadata?: any): void {
    const analytics = this.getLocalAnalytics();

    switch (feature) {
      case 'audioPlayer':
        if (action === 'play' && metadata?.duration) {
          analytics.audioPlayer.totalPlayTime = (analytics.audioPlayer.totalPlayTime || 0) + metadata.duration;
        }
        break;

      case 'quizHints':
        if (action === 'hint_requested' && metadata?.hintLevel) {
          const levelKey = `level_${metadata.hintLevel}`;
          analytics.quizHints[levelKey] = (analytics.quizHints[levelKey] || 0) + 1;
        }
        break;

      case 'koreanPhonetics':
        if (action === 'phonetics_accessed' && metadata?.korean) {
          analytics.koreanPhonetics.uniqueWords = analytics.koreanPhonetics.uniqueWords || new Set();
          analytics.koreanPhonetics.uniqueWords.add(metadata.korean);
          analytics.koreanPhonetics.uniqueWordCount = analytics.koreanPhonetics.uniqueWords.size;
        }
        break;

      case 'answerValidation':
        if (action === 'validation_complete' && metadata?.isCorrect !== undefined) {
          const resultKey = metadata.isCorrect ? 'correct_answers' : 'incorrect_answers';
          analytics.answerValidation[resultKey] = (analytics.answerValidation[resultKey] || 0) + 1;
        }
        break;
    }

    this.setLocalAnalytics(analytics);
  }

  /**
   * Track API performance metrics
   */
  trackApiPerformance(endpoint: string, responseTime: number, success: boolean): void {
    try {
      const performance = this.getPerformanceMetrics();

      // Track response times
      if (!performance.apiResponseTimes[endpoint]) {
        performance.apiResponseTimes[endpoint] = [];
      }
      performance.apiResponseTimes[endpoint].push(responseTime);

      // Keep only last 100 response times per endpoint
      if (performance.apiResponseTimes[endpoint].length > 100) {
        performance.apiResponseTimes[endpoint] = performance.apiResponseTimes[endpoint].slice(-100);
      }

      // Track success/failure rates
      if (!performance.errorRates[endpoint]) {
        performance.errorRates[endpoint] = { successes: 0, failures: 0 };
      }

      if (success) {
        performance.errorRates[endpoint].successes++;
      } else {
        performance.errorRates[endpoint].failures++;
      }

      this.setPerformanceMetrics(performance);
    } catch (error) {
      console.warn('Performance tracking failed:', error);
    }
  }

  /**
   * Track cache performance
   */
  trackCachePerformance(cacheKey: string, hit: boolean): void {
    try {
      const performance = this.getPerformanceMetrics();

      if (!performance.cacheHitRates[cacheKey]) {
        performance.cacheHitRates[cacheKey] = { hits: 0, misses: 0 };
      }

      if (hit) {
        performance.cacheHitRates[cacheKey].hits++;
      } else {
        performance.cacheHitRates[cacheKey].misses++;
      }

      this.setPerformanceMetrics(performance);
    } catch (error) {
      console.warn('Cache performance tracking failed:', error);
    }
  }

  /**
   * Update session context
   */
  updateSessionContext(koreanLevel?: number, theme?: string): void {
    if (this.currentSession) {
      if (koreanLevel !== undefined) {
        this.currentSession.koreanLevel = koreanLevel;
      }
      if (theme) {
        this.currentSession.themeUsed = theme;
      }
      this.saveCurrentSession();
    }
  }

  /**
   * End current session
   */
  endSession(): void {
    if (this.currentSession) {
      this.currentSession.sessionEnd = Date.now();
      this.saveCurrentSession();
      this.currentSession = null;
    }
  }

  /**
   * Get usage summary for parental dashboard
   */
  getUsageSummary(): {
    totalSessions: number;
    averageSessionDuration: number;
    mostUsedFeatures: Array<{ feature: string; usage: number }>;
    koreanProgressIndicators: {
      phoneticsRequests: number;
      romanizationRequests: number;
      uniqueWordsEncountered: number;
    };
    performanceSummary: {
      averageApiResponseTime: number;
      cacheEfficiency: number;
      errorRate: number;
    };
  } {
    const analytics = this.getLocalAnalytics();
    const performance = this.getPerformanceMetrics();
    const sessions = this.getSessionHistory();

    // Calculate session metrics
    const completedSessions = sessions.filter(s => s.sessionEnd);
    const totalSessions = completedSessions.length;
    const averageSessionDuration = totalSessions > 0 
      ? completedSessions.reduce((sum, s) => sum + (s.sessionEnd! - s.sessionStart), 0) / totalSessions 
      : 0;

    // Most used features
    const featureUsage: Array<{ feature: string; usage: number }> = [];
    Object.entries(analytics).forEach(([feature, data]) => {
      if (data.totalUsage) {
        featureUsage.push({ feature, usage: data.totalUsage });
      }
    });
    featureUsage.sort((a, b) => b.usage - a.usage);

    // Korean progress indicators
    const koreanProgressIndicators = {
      phoneticsRequests: analytics.koreanPhonetics?.totalUsage || 0,
      romanizationRequests: analytics.romanization?.totalUsage || 0,
      uniqueWordsEncountered: analytics.koreanPhonetics?.uniqueWordCount || 0
    };

    // Performance summary
    const allResponseTimes = Object.values(performance.apiResponseTimes).flat();
    const averageApiResponseTime = allResponseTimes.length > 0 
      ? allResponseTimes.reduce((sum, time) => sum + time, 0) / allResponseTimes.length 
      : 0;

    const cacheStats = Object.values(performance.cacheHitRates);
    const totalCacheRequests = cacheStats.reduce((sum, stat) => sum + stat.hits + stat.misses, 0);
    const totalCacheHits = cacheStats.reduce((sum, stat) => sum + stat.hits, 0);
    const cacheEfficiency = totalCacheRequests > 0 ? (totalCacheHits / totalCacheRequests) * 100 : 0;

    const errorStats = Object.values(performance.errorRates);
    const totalRequests = errorStats.reduce((sum, stat) => sum + stat.successes + stat.failures, 0);
    const totalErrors = errorStats.reduce((sum, stat) => sum + stat.failures, 0);
    const errorRate = totalRequests > 0 ? (totalErrors / totalRequests) * 100 : 0;

    return {
      totalSessions,
      averageSessionDuration,
      mostUsedFeatures: featureUsage.slice(0, 5),
      koreanProgressIndicators,
      performanceSummary: {
        averageApiResponseTime,
        cacheEfficiency,
        errorRate
      }
    };
  }

  /**
   * Get local analytics data
   */
  private getLocalAnalytics(): LanguageSupportAnalytics {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : this.getDefaultAnalytics();
    } catch {
      return this.getDefaultAnalytics();
    }
  }

  /**
   * Set local analytics data
   */
  private setLocalAnalytics(analytics: LanguageSupportAnalytics): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(analytics));
    } catch (error) {
      console.warn('Failed to save analytics:', error);
    }
  }

  /**
   * Get performance metrics
   */
  private getPerformanceMetrics(): PerformanceMetrics {
    try {
      const stored = localStorage.getItem(this.PERFORMANCE_KEY);
      return stored ? JSON.parse(stored) : {
        apiResponseTimes: {},
        cacheHitRates: {},
        errorRates: {}
      };
    } catch {
      return {
        apiResponseTimes: {},
        cacheHitRates: {},
        errorRates: {}
      };
    }
  }

  /**
   * Set performance metrics
   */
  private setPerformanceMetrics(metrics: PerformanceMetrics): void {
    try {
      localStorage.setItem(this.PERFORMANCE_KEY, JSON.stringify(metrics));
    } catch (error) {
      console.warn('Failed to save performance metrics:', error);
    }
  }

  /**
   * Save current session
   */
  private saveCurrentSession(): void {
    if (!this.currentSession) return;

    try {
      const sessions = this.getSessionHistory();
      sessions.push({ ...this.currentSession });

      // Keep only last 50 sessions
      if (sessions.length > 50) {
        sessions.splice(0, sessions.length - 50);
      }

      localStorage.setItem(this.SESSION_KEY, JSON.stringify(sessions));
    } catch (error) {
      console.warn('Failed to save session:', error);
    }
  }

  /**
   * Get session history
   */
  private getSessionHistory(): SessionMetrics[] {
    try {
      const stored = localStorage.getItem(this.SESSION_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  /**
   * Get default analytics structure
   */
  private getDefaultAnalytics(): LanguageSupportAnalytics {
    return {
      audioPlayer: {},
      quizHints: {},
      koreanPhonetics: {},
      romanization: {},
      answerValidation: {},
      wordAudio: {}
    };
  }

  /**
   * Clear all analytics data (for privacy compliance)
   */
  clearAllData(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
      localStorage.removeItem(this.SESSION_KEY);
      localStorage.removeItem(this.PERFORMANCE_KEY);
      this.initializeSession();
    } catch (error) {
      console.warn('Failed to clear analytics data:', error);
    }
  }

  /**
   * Export analytics data (for parental review)
   */
  exportData(): string {
    const analytics = this.getLocalAnalytics();
    const performance = this.getPerformanceMetrics();
    const sessions = this.getSessionHistory();
    const summary = this.getUsageSummary();

    return JSON.stringify({
      summary,
      analytics,
      performance,
      sessions,
      exportedAt: new Date().toISOString()
    }, null, 2);
  }
}
