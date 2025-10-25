/**
 * useClassroomSSE Hook
 * Manages Server-Sent Events connection for real-time classroom monitoring
 */

import { useEffect, useState, useRef } from 'react';
import type { StudentState, SSEEvent } from '../types/classroom';

interface UseClassroomSSEOptions {
  sessionId?: string;
  enabled?: boolean;
  onUpdate?: (students: StudentState[]) => void;
  onError?: (error: Error) => void;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

/**
 * Custom hook to manage SSE connection for teacher dashboard
 * Provides real-time student progress updates
 */
export function useClassroomSSE({
  sessionId,
  enabled = true,
  onUpdate,
  onError,
}: UseClassroomSSEOptions) {
  const [students, setStudents] = useState<StudentState[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    // Only connect if sessionId is provided and enabled is true
    if (!sessionId || !enabled) {
      return;
    }

    try {
      // Create SSE connection
      const eventSource = new EventSource(
        `${API_BASE_URL}/classroom/subscribe/${sessionId}`
      );
      eventSourceRef.current = eventSource;

      // Handle connection open
      eventSource.onopen = () => {
        setIsConnected(true);
        setError(null);
        console.log(`[useClassroomSSE] Connected to session: ${sessionId}`);
      };

      // Handle incoming messages
      eventSource.onmessage = (event) => {
        try {
          const data: SSEEvent = JSON.parse(event.data);

          if (data.type === 'connected') {
            console.log(`[useClassroomSSE] Connection confirmed:`, data);
          } else if (data.type === 'student_join') {
            // Handle new student joining session - S2 sends data directly (not wrapped in data.data)
            const studentData = data as unknown as StudentState;
            console.log(`[useClassroomSSE] Student joined:`, studentData);
            
            setStudents((prev) => {
              // Check if student already exists
              const existing = prev.find((s) => s.studentId === studentData.studentId);
              if (existing) {
                return prev;
              }
              // Add new student to the list
              return [...prev, studentData];
            });

            if (onUpdate) {
              setStudents((current) => {
                onUpdate(current);
                return current;
              });
            }
          } else if (data.type === 'teacher_story_ready') {
            // Handle teacher story ready event
            console.log(`[useClassroomSSE] Teacher story ready:`, data);
            // This event is informational for the teacher dashboard
            // Students will load the story directly via API when they join
          } else if (data.type === 'progress_update') {
            // Update student list with new progress data - S2 sends data directly (not wrapped in data.data)
            const update = data as unknown as StudentState;

            setStudents((prev) => {
              const existing = prev.find((s) => s.studentId === update.studentId);

              if (existing) {
                // CRITICAL FIX: Only update if new progress is higher (handle out-of-order SSE delivery)
                // Compare both progress percentage AND paragraph number to handle all edge cases
                const shouldUpdate =
                  update.progress > existing.progress ||
                  (update.currentParagraph !== undefined && existing.currentParagraph !== undefined &&
                   update.currentParagraph > existing.currentParagraph);

                if (shouldUpdate) {
                  console.log(`[useClassroomSSE] Updating ${update.studentId}: ${existing.progress}% → ${update.progress}% (paragraph ${existing.currentParagraph} → ${update.currentParagraph})`);
                  // Update existing student with new progress
                  return prev.map((s) =>
                    s.studentId === update.studentId ? update : s
                  );
                } else {
                  // Ignore this update as it's stale/out-of-order
                  console.log(`[useClassroomSSE] ⚠️ Ignoring out-of-order update for ${update.studentId}: ${update.progress}% (current: ${existing.progress}%), paragraph ${update.currentParagraph} (current: ${existing.currentParagraph})`);
                  return prev; // Keep existing data
                }
              } else {
                // Add new student (shouldn't happen if student_join worked)
                console.log(`[useClassroomSSE] Adding new student from progress_update: ${update.studentId}`);
                return [...prev, update];
              }
            });

            // Call onUpdate callback if provided
            if (onUpdate) {
              setStudents((current) => {
                onUpdate(current);
                return current;
              });
            }
          } else if (data.type === 'session_end') {
            console.log(`[useClassroomSSE] Session ended:`, data);
            eventSource.close();
          }
        } catch (err) {
          console.error('[useClassroomSSE] Error parsing SSE message:', err);
        }
      };

      // Handle errors
      eventSource.onerror = (err) => {
        console.error('[useClassroomSSE] SSE connection error:', err);
        const error = new Error('SSE connection failed');
        setError(error);
        setIsConnected(false);
        
        if (onError) {
          onError(error);
        }
        
        eventSource.close();
      };
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to create SSE connection');
      setError(error);
      
      if (onError) {
        onError(error);
      }
    }

    // Clean up on unmount
    return () => {
      if (eventSourceRef.current) {
        console.log(`[useClassroomSSE] Closing SSE connection for session: ${sessionId}`);
        eventSourceRef.current.close();
        eventSourceRef.current = null;
        setIsConnected(false);
      }
    };
  }, [sessionId, enabled, onUpdate, onError]);

  return {
    students,
    isConnected,
    error,
  };
}