/**
 * Voice Preference Service
 * Persists user's preferred voice selection to localStorage
 */

export class VoicePreferenceService {
  private static readonly STORAGE_KEY = 'readquest_voice_preference';

  /**
   * Get saved voice preference
   */
  static getPreference(): string | null {
    try {
      return localStorage.getItem(this.STORAGE_KEY);
    } catch (error) {
      console.warn('Failed to get voice preference:', error);
      return null;
    }
  }

  /**
   * Save voice preference
   */
  static setPreference(voiceName: string): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, voiceName);
      console.log('💾 Saved voice preference:', voiceName);
    } catch (error) {
      console.warn('Failed to save voice preference:', error);
    }
  }

  /**
   * Clear saved preference
   */
  static clearPreference(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
      console.log('🗑️ Cleared voice preference');
    } catch (error) {
      console.warn('Failed to clear voice preference:', error);
    }
  }
}
