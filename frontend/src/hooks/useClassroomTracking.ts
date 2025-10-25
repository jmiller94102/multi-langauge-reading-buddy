import { useEffect, useRef } from 'react';
import { classroomProgressService } from '../services/classroom-progress.service';

interface UseClassroomTrackingOptions {
  sessionId: string | null;
  studentId: string | null;
  totalParagraphs: number;
  enabled?: boolean;
}

/**
 * Custom hook to track student reading progress in a classroom session
 * Uses Intersection Observer to detect paragraph visibility and send progress updates
 */
export const useClassroomTracking = ({
  sessionId,
  studentId,
  totalParagraphs,
  enabled = true
}: UseClassroomTrackingOptions) => {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const currentParagraphRef = useRef<number>(0);

  useEffect(() => {
    // Don't start tracking if disabled or missing required data
    if (!enabled || !sessionId || !studentId || totalParagraphs === 0) {
      return;
    }

    console.log(`[useClassroomTracking] Starting tracking for session ${sessionId}, student ${studentId}`);

    // Count actual rendered paragraphs from the DOM (more reliable than prop)
    const paragraphs = document.querySelectorAll('[data-paragraph-index]');
    const actualTotalParagraphs = paragraphs.length;

    console.log(`[useClassroomTracking] Found ${actualTotalParagraphs} paragraphs in DOM`);

    // Join the classroom session with actual paragraph count
    classroomProgressService.joinSession(sessionId, studentId, actualTotalParagraphs);

    // Set up Intersection Observer to track paragraph visibility
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const paragraphIndex = parseInt(
              entry.target.getAttribute('data-paragraph-index') || '0',
              10
            );

            // Update current paragraph if it's higher than the last one
            if (paragraphIndex > currentParagraphRef.current) {
              currentParagraphRef.current = paragraphIndex;

              // Calculate progress percentage
              const progress = Math.round(((paragraphIndex + 1) / actualTotalParagraphs) * 100);

              console.log(`[useClassroomTracking] Student at paragraph ${paragraphIndex + 1}/${actualTotalParagraphs} (${progress}%)`);

              // Update position in the service (which will trigger progress updates)
              classroomProgressService.updatePosition(paragraphIndex, actualTotalParagraphs);
            }
          }
        });
      },
      {
        // Trigger when 50% of the paragraph is visible
        threshold: 0.5,
        // Add some margin to detect paragraphs slightly before they're fully visible
        rootMargin: '0px 0px -10% 0px'
      }
    );

    // Observe all paragraphs
    paragraphs.forEach((paragraph) => {
      observerRef.current?.observe(paragraph);
    });

    console.log(`[useClassroomTracking] Observing ${paragraphs.length} paragraphs`);

    // Cleanup function
    return () => {
      console.log(`[useClassroomTracking] Cleaning up tracking for session ${sessionId}`);
      
      // Disconnect observer
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }

      // Leave the classroom session
      classroomProgressService.leaveSession();
    };
  }, [sessionId, studentId, totalParagraphs, enabled]);

  return {
    currentParagraph: currentParagraphRef.current
  };
};