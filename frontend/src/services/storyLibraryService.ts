import type { Story, Quiz } from '@/types/story';

/**
 * Story Library Service - IndexedDB storage for saved stories
 *
 * Uses IndexedDB for larger storage capacity (~100s of MB vs localStorage's ~5MB)
 * Stories are saved with quiz questions (but not results)
 */

const DB_NAME = 'ReadingAppStoryLibrary';
const DB_VERSION = 1;
const STORE_NAME = 'savedStories';

export interface SavedStory {
  id: string; // story.id
  story: Story;
  quiz: Quiz | null; // Include quiz questions, but not results
  savedAt: number; // Timestamp
  title: string; // For quick access
  language: 'ko' | 'zh'; // secondaryLanguage
}

class StoryLibraryService {
  private db: IDBDatabase | null = null;

  /**
   * Initialize IndexedDB database
   */
  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
        console.error('Failed to open IndexedDB:', request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Create object store if it doesn't exist
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const objectStore = db.createObjectStore(STORE_NAME, { keyPath: 'id' });

          // Create indexes for efficient querying
          objectStore.createIndex('savedAt', 'savedAt', { unique: false });
          objectStore.createIndex('language', 'language', { unique: false });
          objectStore.createIndex('title', 'title', { unique: false });
        }
      };
    });
  }

  /**
   * Ensure database is initialized
   */
  private async ensureDb(): Promise<IDBDatabase> {
    if (!this.db) {
      await this.init();
    }
    if (!this.db) {
      throw new Error('Failed to initialize IndexedDB');
    }
    return this.db;
  }

  /**
   * Save a story to the library
   */
  async saveStory(story: Story, quiz: Quiz | null): Promise<void> {
    const db = await this.ensureDb();

    const savedStory: SavedStory = {
      id: story.id,
      story,
      quiz,
      savedAt: Date.now(),
      title: story.title,
      language: story.languageSettings.secondaryLanguage,
    };

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const objectStore = transaction.objectStore(STORE_NAME);
      const request = objectStore.put(savedStory);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Get all saved stories (sorted by most recent first)
   */
  async getAllStories(): Promise<SavedStory[]> {
    const db = await this.ensureDb();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const objectStore = transaction.objectStore(STORE_NAME);
      const request = objectStore.getAll();

      request.onsuccess = () => {
        const stories = request.result as SavedStory[];
        // Sort by most recent first
        stories.sort((a, b) => b.savedAt - a.savedAt);
        resolve(stories);
      };

      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Get a specific saved story by ID
   */
  async getStory(id: string): Promise<SavedStory | null> {
    const db = await this.ensureDb();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const objectStore = transaction.objectStore(STORE_NAME);
      const request = objectStore.get(id);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Delete a saved story
   */
  async deleteStory(id: string): Promise<void> {
    const db = await this.ensureDb();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const objectStore = transaction.objectStore(STORE_NAME);
      const request = objectStore.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Get stories filtered by language
   */
  async getStoriesByLanguage(language: 'ko' | 'zh'): Promise<SavedStory[]> {
    const db = await this.ensureDb();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const objectStore = transaction.objectStore(STORE_NAME);
      const index = objectStore.index('language');
      const request = index.getAll(language);

      request.onsuccess = () => {
        const stories = request.result as SavedStory[];
        stories.sort((a, b) => b.savedAt - a.savedAt);
        resolve(stories);
      };

      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Download story as text file
   */
  downloadStoryAsText(savedStory: SavedStory): void {
    const { story, quiz } = savedStory;

    let content = `# ${story.title}\n\n`;
    content += `Language: ${story.languageSettings.secondaryLanguage === 'ko' ? 'Korean' : 'Mandarin'}\n`;
    content += `Grade Level: ${story.settings.gradeLevel}\n`;
    content += `Word Count: ${story.wordCount}\n`;
    content += `Created: ${new Date(story.createdAt).toLocaleDateString()}\n\n`;
    content += `---\n\n`;

    // Add story content
    if (story.secondarySentences && story.secondarySentences.length > 0) {
      content += `## Story (${story.languageSettings.secondaryLanguage === 'ko' ? 'Korean' : 'Chinese'})\n\n`;
      content += story.secondarySentences.filter(s => s !== '__PARAGRAPH_BREAK__').join(' ');
      content += `\n\n---\n\n`;
    }

    content += `## Story (English)\n\n`;
    if (story.primarySentences && story.primarySentences.length > 0) {
      content += story.primarySentences.filter(s => s !== '__PARAGRAPH_BREAK__').join(' ');
    } else {
      content += story.content || story.paragraphs?.map(p => p.content).join('\n\n') || '';
    }
    content += `\n\n---\n\n`;

    // Add vocabulary
    if (story.vocabulary) {
      content += `## Vocabulary\n\n`;

      if (story.vocabulary.nouns?.length > 0) {
        content += `### Nouns\n`;
        story.vocabulary.nouns.forEach(word => {
          content += `- ${word.english || word.word} → ${word.translation}\n`;
        });
        content += `\n`;
      }

      if (story.vocabulary.verbs?.length > 0) {
        content += `### Verbs\n`;
        story.vocabulary.verbs.forEach(word => {
          content += `- ${word.english || word.word} → ${word.translation}\n`;
        });
        content += `\n`;
      }

      if (story.vocabulary.adjectives?.length > 0) {
        content += `### Adjectives\n`;
        story.vocabulary.adjectives.forEach(word => {
          content += `- ${word.english || word.word} → ${word.translation}\n`;
        });
        content += `\n`;
      }

      if (story.vocabulary.adverbs?.length > 0) {
        content += `### Adverbs\n`;
        story.vocabulary.adverbs.forEach(word => {
          content += `- ${word.english || word.word} → ${word.translation}\n`;
        });
        content += `\n`;
      }

      content += `---\n\n`;
    }

    // Add quiz questions (not results)
    if (quiz && quiz.questions.length > 0) {
      content += `## Quiz Questions\n\n`;
      quiz.questions.forEach((q, index) => {
        content += `${index + 1}. ${q.text}\n`;
        if (q.type === 'multipleChoice' && q.options) {
          q.options.forEach(opt => {
            content += `   ${opt.id.toUpperCase()}. ${opt.text}\n`;
          });
        }
        content += `\n`;
      });
    }

    // Create download
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${story.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /**
   * Get library statistics
   */
  async getStats(): Promise<{ total: number; korean: number; mandarin: number }> {
    const allStories = await this.getAllStories();
    return {
      total: allStories.length,
      korean: allStories.filter(s => s.language === 'ko').length,
      mandarin: allStories.filter(s => s.language === 'zh').length,
    };
  }
}

// Export singleton instance
export const storyLibrary = new StoryLibraryService();
