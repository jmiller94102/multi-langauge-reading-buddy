const express = require('express');
const router = express.Router();
const classroomS2Service = require('../services/classroom-s2.service');

// GET /api/classroom/sessions - List all active sessions
router.get('/sessions', (req, res) => {
  try {
    // Get sessions from S2 service
    const activeSessions = Array.from(classroomS2Service.sessions.values()).map(session => ({
      sessionId: session.sessionId,
      classroomId: session.classroomId,
      streamId: session.streamId,
      metadata: session.metadata,
      studentCount: session.students.size,
      createdAt: session.createdAt
    }));

    res.json({
      success: true,
      sessions: activeSessions
    });
  } catch (error) {
    console.error('Error listing sessions:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to list sessions'
    });
  }
});

// POST /api/classroom/create-session - Create a new classroom session
router.post('/create-session', async (req, res) => {
  try {
    const { sessionId, teacherId, storyId, mode = 'free_time' } = req.body;

    if (!sessionId || !teacherId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: sessionId, teacherId'
      });
    }

    // Create session in S2 service (single source of truth)
    const result = await classroomS2Service.createSession(
      `classroom-${teacherId}`, // classroomId
      sessionId,
      { teacherId, storyId, mode } // metadata
    );

    res.json({
      success: true,
      sessionId: result.sessionId,
      streamId: result.streamId,
      mode
    });
  } catch (error) {
    console.error('Error creating session:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create session'
    });
  }
});

// POST /api/classroom/join-session - Student joins a session
router.post('/join-session', (req, res) => {
  try {
    const { sessionId, studentName } = req.body;

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required field: sessionId'
      });
    }

    // Get session from S2 service
    const session = classroomS2Service.getSession(sessionId);
    if (!session) {
      return res.status(404).json({
        success: false,
        error: 'Session not found'
      });
    }

    // Auto-generate studentId
    const studentId = `student${session.students.length + 1}`;
    
    res.json({
      success: true,
      sessionId,
      studentId,
      mode: session.metadata?.mode || 'free_time'
    });
  } catch (error) {
    console.error('Error joining session:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to join session'
    });
  }
});

// POST /api/classroom/update-progress - Update student progress
router.post('/update-progress', async (req, res) => {
  try {
    const { sessionId, studentId, currentParagraph, totalParagraphs, timestamp } = req.body;

    if (!sessionId || !studentId || currentParagraph === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    // Update progress in S2
    await classroomS2Service.updateProgress(sessionId, {
      studentId,
      currentParagraph,
      totalParagraphs,
      timestamp: timestamp || new Date().toISOString()
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Error updating progress:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update progress'
    });
  }
});

// GET /api/classroom/subscribe/:sessionId - SSE endpoint for real-time updates
router.get('/subscribe/:sessionId', async (req, res) => {
  const { sessionId } = req.params;

  // Set headers for SSE
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  try {
    // Send initial connection confirmation
    res.write(`data: ${JSON.stringify({ type: 'connected', sessionId })}\n\n`);

    // Subscribe to S2 updates
    const unsubscribe = await classroomS2Service.subscribeToSession(sessionId, (update) => {
      try {
        res.write(`data: ${JSON.stringify(update)}\n\n`);
      } catch (writeError) {
        console.error('[SSE] Error writing to response:', writeError);
      }
    });

    // Handle client disconnect
    req.on('close', () => {
      console.log(`[SSE] Client disconnected from session: ${sessionId}`);
      unsubscribe();
      res.end();
    });
  } catch (error) {
    console.error('Error subscribing to session:', error);
    // Cannot send JSON after SSE headers are set, send SSE error event instead
    try {
      res.write(`data: ${JSON.stringify({ type: 'error', error: 'Failed to subscribe to session' })}\n\n`);
    } catch (writeError) {
      console.error('[SSE] Error sending error event:', writeError);
    }
    res.end();
  }
});

// POST /api/classroom/end-session - End a classroom session
router.post('/end-session', async (req, res) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required field: sessionId'
      });
    }

    // End session via S2 service
    await classroomS2Service.endSession(sessionId);

    res.json({
      success: true,
      message: 'Session ended successfully'
    });
  } catch (error) {
    console.error('Error ending session:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to end session'
    });
  }
});

// GET /api/classroom/session/:sessionId - Get session details
router.get('/session/:sessionId', (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = classroomS2Service.getSession(sessionId);

    if (!session) {
      return res.status(404).json({
        success: false,
        error: 'Session not found'
      });
    }

    res.json({
      success: true,
      session
    });
  } catch (error) {
    console.error('Error getting session:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get session'
    });
  }
});

module.exports = router;