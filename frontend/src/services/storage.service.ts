import type { UserState } from '@/types/user';
import type { PetState } from '@/types/pet';
import type { Achievement, Quest } from '@/types/gamification';
import type { Story, Quiz } from '@/types/content';

/**
 * StorageService - MVP persistence layer using localStorage
 *
 * COPPA Compliance: localStorage only = no data sent to servers
 * Future: Replace with API calls in Phase 7 (Backend Integration)
 */

const STORAGE_KEYS = {
  USER: 'reading_app_user',
  PET: 'reading_app_pet',
  ACHIEVEMENTS: 'reading_app_achievements',
  QUESTS: 'reading_app_quests',
  STORIES: 'reading_app_stories',
  QUIZZES: 'reading_app_quizzes',
  SETTINGS: 'reading_app_settings',
} as const;

class StorageService {
  // ===== Generic Storage Methods =====

  private getItem<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error reading ${key} from localStorage:`, error);
      return null;
    }
  }

  private setItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error writing ${key} to localStorage:`, error);
      // Handle quota exceeded error (rare but possible)
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        console.error('localStorage quota exceeded. Consider cleaning old data.');
      }
    }
  }

  private removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing ${key} from localStorage:`, error);
    }
  }

  // ===== User Data =====

  getUser(): UserState | null {
    return this.getItem<UserState>(STORAGE_KEYS.USER);
  }

  saveUser(user: UserState): void {
    this.setItem(STORAGE_KEYS.USER, user);
  }

  // ===== Pet Data =====

  getPet(): PetState | null {
    return this.getItem<PetState>(STORAGE_KEYS.PET);
  }

  savePet(pet: PetState): void {
    this.setItem(STORAGE_KEYS.PET, pet);
  }

  // ===== Achievements =====

  getAchievements(): Achievement[] {
    return this.getItem<Achievement[]>(STORAGE_KEYS.ACHIEVEMENTS) || [];
  }

  saveAchievements(achievements: Achievement[]): void {
    this.setItem(STORAGE_KEYS.ACHIEVEMENTS, achievements);
  }

  // ===== Quests =====

  getQuests(): Quest[] {
    return this.getItem<Quest[]>(STORAGE_KEYS.QUESTS) || [];
  }

  saveQuests(quests: Quest[]): void {
    this.setItem(STORAGE_KEYS.QUESTS, quests);
  }

  // ===== Stories =====

  getStories(): Story[] {
    return this.getItem<Story[]>(STORAGE_KEYS.STORIES) || [];
  }

  saveStory(story: Story): void {
    const stories = this.getStories();
    stories.push(story);
    this.setItem(STORAGE_KEYS.STORIES, stories);
  }

  // ===== Quizzes =====

  getQuizzes(): Quiz[] {
    return this.getItem<Quiz[]>(STORAGE_KEYS.QUIZZES) || [];
  }

  saveQuiz(quiz: Quiz): void {
    const quizzes = this.getQuizzes();
    const existingIndex = quizzes.findIndex((q) => q.id === quiz.id);

    if (existingIndex >= 0) {
      // Update existing quiz
      quizzes[existingIndex] = quiz;
    } else {
      // Add new quiz
      quizzes.push(quiz);
    }

    this.setItem(STORAGE_KEYS.QUIZZES, quizzes);
  }

  // ===== Clear All Data (for debugging or reset) =====

  clearAll(): void {
    Object.values(STORAGE_KEYS).forEach((key) => {
      this.removeItem(key);
    });
  }
}

// Export singleton instance
export const storageService = new StorageService();
