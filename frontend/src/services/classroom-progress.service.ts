/**
 * Classroom Progress Service
 * Handles student-side progress tracking and reporting for live classroom monitoring
 */

import type {
  ClassroomSession,
  StudentProgressUpdate,
  StudentStatus,
  ProgressTrackingConfig,
} from '../types/classroom';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

/**
 * Default progress tracking configuration
 */
const DEFAULT_CONFIG: ProgressTrackingConfig = {
  updateInterval: 5000, // Send progress every 5 seconds
  idleThreshold: 30000, // Consider idle after 30 seconds
  stuckThreshold: 120000, // Consider stuck after 2 minutes
};

/**
 * Classroom Progress Service
 * Manages student progress tracking and reporting for live classroom monitoring
 */
class ClassroomProgressService {
  private currentSession: ClassroomSession | null = null;
  private studentId: string | null = null;
  private config: ProgressTrackingConfig = DEFAULT_CONFIG;
  
  // Progress tracking state
  private currentParagraph: number = 0;
  private totalParagraphs: number = 0;
  private lastProgressUpdate: number = 0;
  private lastParagraphChange: number = 0;
  
  // Interval timers
  private progressTimer: NodeJS.Timeout | null = null;
  
  /**
   * Join a classroom session
   * @param sessionId - Session identifier
   * @param studentId - Student identifier
   * @param totalParagraphs - Total number of paragraphs in the story
   * @param config - Optional progress tracking configuration
   */
  async joinSession(
    sessionId: string,
    studentId: string,
    totalParagraphs: number,
    config?: Partial<ProgressTrackingConfig>
  ): Promise<void> {
    try {
      // Get session details from backend (if needed)
      // For now, create a minimal session object
      this.currentSession = {
        sessionId,
        teacherId: 'teacher', // Will be populated from backend
        storyId: '', // Will be populated from backend
        students: []
      };
      this.studentId = studentId;
      this.totalParagraphs = totalParagraphs;
      this.currentParagraph = 0;
      this.lastProgressUpdate = Date.now();
      this.lastParagraphChange = Date.now();
      
      // Merge config
      if (config) {
        this.config = { ...DEFAULT_CONFIG, ...config };
      }
      
      // Start progress tracking interval
      this.startProgressTracking();
      
      console.log(`[ClassroomProgress] Joined session: ${sessionId} as student: ${studentId}`);
    } catch (error) {
      console.error('[ClassroomProgress] Error joining session:', error);
      throw error;
    }
  }
  
  /**
   * Leave the current classroom session
   */
  async leaveSession(): Promise<void> {
    if (!this.currentSession) {
      return;
    }
    
    try {
      // Send final progress update before leaving
      await this.sendProgressUpdate('completed');
      
      // Stop progress tracking
      this.stopProgressTracking();
      
      console.log(`[ClassroomProgress] Left session: ${this.currentSession.sessionId}`);
      
      // Clear session state
      this.currentSession = null;
      this.studentId = null;
      this.currentParagraph = 0;
      this.totalParagraphs = 0;
    } catch (error) {
      console.error('[ClassroomProgress] Error leaving session:', error);
      throw error;
    }
  }
  
  /**
   * Update current paragraph position
   * @param paragraphIndex - Current paragraph index (0-based)
   */
  updatePosition(paragraphIndex: number): void {
    if (!this.currentSession || !this.studentId) {
      return;
    }

    // Update paragraph position
    const oldParagraph = this.currentParagraph;
    this.currentParagraph = paragraphIndex;

    // Track last paragraph change time (for idle/stuck detection)
    if (oldParagraph !== paragraphIndex) {
      this.lastParagraphChange = Date.now();

      // Send immediate progress update when paragraph changes
      console.log(`[ClassroomProgress] Position updated: paragraph ${paragraphIndex + 1}/${this.totalParagraphs} - sending update`);
      this.sendProgressUpdate();
    } else {
      console.log(`[ClassroomProgress] Position unchanged: paragraph ${paragraphIndex + 1}/${this.totalParagraphs}`);
    }
  }
  
  /**
   * Calculate current progress percentage
   */
  private calculateProgress(): number {
    if (this.totalParagraphs === 0) {
      return 0;
    }

    // currentParagraph is 0-indexed, so add 1 for progress calculation
    // e.g., paragraph 0 (first para) should be 1/14 = 7%, not 0/14 = 0%
    return Math.round(((this.currentParagraph + 1) / this.totalParagraphs) * 100);
  }
  
  /**
   * Detect current student status
   */
  private detectStatus(): StudentStatus {
    const now = Date.now();
    const timeSinceLastChange = now - this.lastParagraphChange;
    
    // Check if completed
    if (this.currentParagraph >= this.totalParagraphs - 1) {
      return 'completed';
    }
    
    // Check if stuck (no progress for 2 minutes)
    if (timeSinceLastChange > this.config.stuckThreshold) {
      return 'stuck';
    }
    
    // Check if idle (no progress for 30 seconds)
    if (timeSinceLastChange > this.config.idleThreshold) {
      return 'idle';
    }
    
    // Otherwise, reading
    return 'reading';
  }
  
  /**
   * Send progress update to backend
   */
  private async sendProgressUpdate(status?: StudentStatus): Promise<void> {
    if (!this.currentSession || !this.studentId) {
      console.warn('[ClassroomProgress] Skipping progress update - no active session');
      return;
    }

    try {
      const progressUpdate: StudentProgressUpdate = {
        sessionId: this.currentSession.sessionId,
        studentId: this.studentId,
        progress: this.calculateProgress(),
        currentParagraph: this.currentParagraph,
        status: status || this.detectStatus(),
        timestamp: Date.now(),
      };

      // Add totalParagraphs to the request
      const requestBody = {
        ...progressUpdate,
        totalParagraphs: this.totalParagraphs
      };

      console.log(`[ClassroomProgress] Sending update: paragraph ${this.currentParagraph + 1}/${this.totalParagraphs}, progress ${progressUpdate.progress}%, status ${progressUpdate.status}`);

      const response = await fetch(`${API_BASE_URL}/classroom/update-progress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`Failed to send progress update: ${response.statusText}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to send progress update');
      }

      this.lastProgressUpdate = Date.now();

      console.log(`[ClassroomProgress] Progress update sent successfully`);
    } catch (error) {
      console.error('[ClassroomProgress] Error sending progress update:', error);
      // Don't throw - allow the app to continue
    }
  }
  
  /**
   * Start progress tracking interval
   */
  private startProgressTracking(): void {
    // Clear existing timer
    this.stopProgressTracking();
    
    // Send initial progress update
    this.sendProgressUpdate();
    
    // Set up interval to send progress updates
    this.progressTimer = setInterval(() => {
      this.sendProgressUpdate();
    }, this.config.updateInterval);
    
    console.log(`[ClassroomProgress] Progress tracking started (interval: ${this.config.updateInterval}ms)`);
  }
  
  /**
   * Stop progress tracking interval
   */
  private stopProgressTracking(): void {
    if (this.progressTimer) {
      clearInterval(this.progressTimer);
      this.progressTimer = null;
      console.log('[ClassroomProgress] Progress tracking stopped');
    }
  }
  
  /**
   * Get current session
   */
  getCurrentSession(): ClassroomSession | null {
    return this.currentSession;
  }
  
  /**
   * Check if currently in a session
   */
  isInSession(): boolean {
    return this.currentSession !== null && this.studentId !== null;
  }
}

// Export singleton instance
export const classroomProgressService = new ClassroomProgressService();
export default classroomProgressService;