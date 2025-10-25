/**
 * Classroom Teacher Service
 * Handles teacher-side session management operations
 */

import type {
  ClassroomSession,
  ClassroomSessionMetadata,
} from '../types/classroom';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

/**
 * Classroom Teacher Service
 * Provides methods for teachers to manage classroom sessions
 */
class ClassroomTeacherService {
  /**
   * Create a new classroom session
   * @param classroomId - Classroom identifier
   * @param sessionId - Session identifier
   * @param metadata - Session metadata (teacher, story, students)
   */
  async createSession(
    classroomId: string,
    sessionId: string,
    metadata: ClassroomSessionMetadata
  ): Promise<ClassroomSession> {
    try {
      const response = await fetch(`${API_BASE_URL}/classroom/create-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          classroomId,
          sessionId,
          metadata,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to create session: ${response.statusText}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to create session');
      }

      console.log(`[ClassroomTeacher] Created session: ${sessionId}`);
      return data.data;
    } catch (error) {
      console.error('[ClassroomTeacher] Error creating session:', error);
      throw error;
    }
  }

  /**
   * Get session details
   * @param sessionId - Session identifier
   */
  async getSession(sessionId: string): Promise<ClassroomSession> {
    try {
      const response = await fetch(`${API_BASE_URL}/classroom/session/${sessionId}`);

      if (!response.ok) {
        throw new Error(`Failed to get session: ${response.statusText}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to get session');
      }

      return data.data;
    } catch (error) {
      console.error('[ClassroomTeacher] Error getting session:', error);
      throw error;
    }
  }

  /**
   * End a classroom session
   * @param sessionId - Session identifier
   */
  async endSession(sessionId: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/classroom/end-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionId }),
      });

      if (!response.ok) {
        throw new Error(`Failed to end session: ${response.statusText}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to end session');
      }

      console.log(`[ClassroomTeacher] Ended session: ${sessionId}`);
    } catch (error) {
      console.error('[ClassroomTeacher] Error ending session:', error);
      throw error;
    }
  }

  /**
   * Generate student reading URL with session parameters
   * @param sessionId - Session identifier
   * @param studentId - Student identifier
   * @param storyId - Optional story identifier
   */
  generateStudentURL(sessionId: string, studentId: string, storyId?: string): string {
    const baseURL = window.location.origin;
    const params = new URLSearchParams({
      sessionId,
      studentId,
    });

    if (storyId) {
      params.append('storyId', storyId);
    }

    return `${baseURL}/reading?${params.toString()}`;
  }
}

// Export singleton instance
export const classroomTeacherService = new ClassroomTeacherService();
export default classroomTeacherService;