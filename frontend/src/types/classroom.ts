/**
 * Classroom Monitoring Types
 * TypeScript interfaces for live classroom monitoring feature
 */

/**
 * Student reading status
 */
export type StudentStatus = 'reading' | 'idle' | 'stuck' | 'completed';

/**
 * Classroom session metadata
 */
export interface ClassroomSessionMetadata {
  teacherId: string;
  storyId: string;
  studentIds: string[];
  classroomName?: string;
  createdAt?: number;
}

/**
 * Classroom session information
 */
export interface ClassroomSession {
  sessionId: string;
  classroomId: string;
  streamId: string;
  metadata: ClassroomSessionMetadata;
  createdAt: number;
}

/**
 * Student progress update
 */
export interface StudentProgressUpdate {
  sessionId: string;
  studentId: string;
  progress: number; // 0-100
  currentParagraph: number;
  status: StudentStatus;
  timestamp?: number;
}

/**
 * Student state in a session
 */
export interface StudentState {
  studentId: string;
  studentName?: string;
  progress: number;
  currentParagraph: number;
  status: StudentStatus;
  timestamp: number;
}

/**
 * Full session state with all students
 */
export interface SessionState {
  sessionId: string;
  classroomId: string;
  streamId: string;
  metadata: ClassroomSessionMetadata;
  createdAt: number;
  students: StudentState[];
}

/**
 * Progress tracking configuration
 */
export interface ProgressTrackingConfig {
  updateInterval: number; // milliseconds (default: 5000)
  idleThreshold: number; // milliseconds (default: 30000)
  stuckThreshold: number; // milliseconds (default: 120000)
}

/**
 * SSE event types
 */
export type SSEEventType = 'connected' | 'student_join' | 'teacher_story_ready' | 'progress_update' | 'session_end' | 'error';

/**
 * SSE event data
 */
export interface SSEEvent {
  type: SSEEventType;
  sessionId: string;
  data?: StudentProgressUpdate | SessionState | string;
  timestamp: number;
}