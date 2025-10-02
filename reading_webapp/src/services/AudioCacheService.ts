/**
 * Smart Audio Caching Service
 * Manages localStorage caching with size limits, preloading, and analytics
 */

interface CacheEntry {
  audio: string;
  timestamp: number;
  size: number;
  language: string;
  accessCount: number;
  lastAccessed: number;
}

interface CacheStats {
  totalSize: number;
  entryCount: number;
  hitRate: number;
  totalRequests: number;
  cacheHits: number;
}

export class AudioCacheService {
  private static instance: AudioCacheService;
  private readonly CACHE_KEY = 'readquest_audio_cache';
  private readonly STATS_KEY = 'readquest_cache_stats';
  private readonly MAX_CACHE_SIZE = 50 * 1024 * 1024; // 50MB in bytes
  private readonly MAX_ENTRIES = 1000;
  
  private cache: Map<string, CacheEntry> = new Map();
  private stats: CacheStats = {
    totalSize: 0,
    entryCount: 0,
    hitRate: 0,
    totalRequests: 0,
    cacheHits: 0
  };

  private constructor() {
    this.loadFromStorage();
  }

  public static getInstance(): AudioCacheService {
    if (!AudioCacheService.instance) {
      AudioCacheService.instance = new AudioCacheService();
    }
    return AudioCacheService.instance;
  }

  /**
   * Generate cache key from text, language, and voice
   */
  private generateKey(text: string, language: string, voice?: string): string {
    const voicePart = voice ? `-${voice.toLowerCase()}` : '';
    return `${text.trim().toLowerCase()}-${language}${voicePart}`;
  }

  /**
   * Estimate size of audio data in bytes
   */
  private estimateSize(audioData: string): number {
    // Base64 audio data - rough estimate
    return audioData.length * 0.75; // Base64 is ~33% larger than binary
  }

  /**
   * Load cache from localStorage
   */
  private loadFromStorage(): void {
    try {
      const cached = localStorage.getItem(this.CACHE_KEY);
      const stats = localStorage.getItem(this.STATS_KEY);
      
      if (cached) {
        const data = JSON.parse(cached);
        this.cache = new Map(Object.entries(data));
      }
      
      if (stats) {
        this.stats = JSON.parse(stats);
      }
    } catch (error) {
      console.warn('Failed to load audio cache from storage:', error);
      this.clearCache();
    }
  }

  /**
   * Save cache to localStorage
   */
  private saveToStorage(skipCleanup = false): void {
    try {
      const cacheObject = Object.fromEntries(this.cache);
      localStorage.setItem(this.CACHE_KEY, JSON.stringify(cacheObject));
      localStorage.setItem(this.STATS_KEY, JSON.stringify(this.stats));
    } catch (error) {
      console.warn('Failed to save audio cache to storage:', error);
      // If storage is full and we haven't tried cleanup yet, try to clean up
      if (!skipCleanup && (error as Error)?.name === 'QuotaExceededError') {
        console.log('🗑️ Storage quota exceeded, cleaning up cache...');
        this.cleanup();
      } else {
        console.warn('🚨 Cache storage failed permanently, disabling cache');
        this.cache.clear();
      }
    }
  }

  /**
   * Clean up old entries to make space
   */
  private cleanup(): void {
    const entries = Array.from(this.cache.entries());
    
    // Sort by last accessed time (oldest first)
    entries.sort(([, a], [, b]) => a.lastAccessed - b.lastAccessed);
    
    // Remove oldest 25% of entries
    const toRemove = Math.floor(entries.length * 0.25);
    for (let i = 0; i < toRemove; i++) {
      const [key, entry] = entries[i];
      this.stats.totalSize -= entry.size;
      this.cache.delete(key);
    }
    
    this.stats.entryCount = this.cache.size;
    this.saveToStorage(true); // Skip cleanup to prevent infinite recursion
  }

  /**
   * Check if cache needs cleanup
   */
  private needsCleanup(): boolean {
    return (
      this.stats.totalSize > this.MAX_CACHE_SIZE ||
      this.stats.entryCount > this.MAX_ENTRIES
    );
  }

  /**
   * Get audio from cache
   */
  public get(text: string, language: string, voice?: string): string | null {
    const key = this.generateKey(text, language, voice);
    this.stats.totalRequests++;

    const entry = this.cache.get(key);
    if (entry) {
      // Update access stats
      entry.accessCount++;
      entry.lastAccessed = Date.now();
      this.stats.cacheHits++;
      this.stats.hitRate = (this.stats.cacheHits / this.stats.totalRequests) * 100;

      this.saveToStorage();
      return entry.audio;
    }

    this.stats.hitRate = (this.stats.cacheHits / this.stats.totalRequests) * 100;
    return null;
  }

  /**
   * Store audio in cache
   */
  public set(text: string, language: string, voice: string, audioData: string): void {
    const key = this.generateKey(text, language, voice);
    const size = this.estimateSize(audioData);

    // Don't cache if single item is too large
    if (size > this.MAX_CACHE_SIZE * 0.1) {
      console.warn('Audio data too large to cache:', text.substring(0, 50));
      return;
    }

    const entry: CacheEntry = {
      audio: audioData,
      timestamp: Date.now(),
      size,
      language,
      accessCount: 1,
      lastAccessed: Date.now()
    };

    // Remove existing entry if updating
    const existing = this.cache.get(key);
    if (existing) {
      this.stats.totalSize -= existing.size;
    } else {
      this.stats.entryCount++;
    }

    this.cache.set(key, entry);
    this.stats.totalSize += size;

    // Cleanup if needed
    if (this.needsCleanup()) {
      this.cleanup();
    }

    this.saveToStorage();
  }

  /**
   * Preload audio for given texts
   */
  public async preload(
    texts: string[],
    language: string,
    voice: string,
    onProgress?: (loaded: number, total: number) => void
  ): Promise<void> {
    const uncachedTexts = texts.filter(text => !this.get(text, language, voice));

    if (uncachedTexts.length === 0) {
      onProgress?.(texts.length, texts.length);
      return;
    }

    let loaded = texts.length - uncachedTexts.length;

    for (const text of uncachedTexts) {
      try {
        const response = await fetch('http://localhost:3001/api/text-to-speech', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text,
            voice: voice,
            speed: 1.0,
            childSafe: true
          })
        });

        if (response.ok) {
          const result = await response.json();
          if (result.success && result.audio) {
            this.set(text, language, voice, result.audio);
          }
        }
      } catch (error) {
        console.warn('Failed to preload audio for:', text.substring(0, 30), error);
      }

      loaded++;
      onProgress?.(loaded, texts.length);
    }
  }

  /**
   * Get cache statistics
   */
  public getStats(): CacheStats {
    return { ...this.stats };
  }

  /**
   * Clear all cached audio
   */
  clearCache(): void {
    this.cache.clear();
    this.stats = {
      entryCount: 0,
      totalSize: 0,
      hitRate: 0,
      totalRequests: 0,
      cacheHits: 0
    };
    try {
      localStorage.removeItem(this.CACHE_KEY);
      localStorage.removeItem(this.STATS_KEY);
      console.log('🗑️ Audio cache cleared completely');
    } catch (error) {
      console.warn('Failed to clear cache from storage:', error);
    }
  }

  /**
   * Get cache size in MB
   */
  public getCacheSizeMB(): number {
    return this.stats.totalSize / (1024 * 1024);
  }

  /**
   * Check if cache is near capacity
   */
  public isNearCapacity(): boolean {
    return this.stats.totalSize > this.MAX_CACHE_SIZE * 0.8;
  }

  /**
   * Get most accessed entries for analytics
   */
  public getTopEntries(limit: number = 10): Array<{key: string, accessCount: number, size: number}> {
    const entries = Array.from(this.cache.entries());
    return entries
      .map(([key, entry]) => ({
        key,
        accessCount: entry.accessCount,
        size: entry.size
      }))
      .sort((a, b) => b.accessCount - a.accessCount)
      .slice(0, limit);
  }
}
