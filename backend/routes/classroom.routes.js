const express = require('express');
const router = express.Router();
const classroomS2Service = require('../services/classroom-s2.service');

// In-memory session storage (replace with database in production)
const sessions = new Map();

// GET /api/classroom/sessions - List all active sessions
router.get('/sessions', (req, res) => {
  try {
    const activeSessions = Array.from(sessions.values()).map(session => ({
      sessionId: session.sessionId,
      teacherId: session.teacherId,
      storyId: session.storyId,
      mode: session.mode,
      studentCount: session.students.length,
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

    // Create session in S2 with correct parameters
    await classroomS2Service.createSession(
      sessionId,  // classroomId parameter
      sessionId,  // sessionId parameter  
      { teacherId, storyId, mode }  // metadata parameter
    );

    // Store session metadata in routes-level storage
    sessions.set(sessionId, {
      sessionId,
      teacherId,
      storyId,
      mode, // 'teacher_story' or 'free_time'
      students: [],
      createdAt: new Date().toISOString()
    });

    res.json({
      success: true,
      sessionId,
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
router.post('/join-session', async (req, res) => {
  try {
    const { sessionId, studentName } = req.body;

    console.log(`[JOIN] Student attempting to join session: ${sessionId}, name: ${studentName}`);

    if (!sessionId) {
      console.error('[JOIN] Missing sessionId');
      return res.status(400).json({
        success: false,
        error: 'Missing required field: sessionId'
      });
    }

    const session = sessions.get(sessionId);
    if (!session) {
      console.error(`[JOIN] Session not found: ${sessionId}`);
      return res.status(404).json({
        success: false,
        error: 'Session not found'
      });
    }

    // Check if student with this name already exists (prevent duplicates on refresh/reconnect)
    const existingStudent = session.students.find(s => s.studentName === studentName);

    if (existingStudent) {
      console.log(`[JOIN] Student "${studentName}" already exists as ${existingStudent.studentId}, returning existing ID`);
      return res.json({
        success: true,
        sessionId,
        studentId: existingStudent.studentId,
        mode: session.mode,
        reconnected: true
      });
    }

    // Auto-generate studentId for new student
    const studentId = `student${session.students.length + 1}`;

    console.log(`[JOIN] Generated studentId: ${studentId} for session: ${sessionId}`);

    // Add student to session
    session.students.push({
      studentId,
      studentName: studentName || studentId,
      joinedAt: new Date().toISOString()
    });

    console.log(`[JOIN] Student added to session. Total students: ${session.students.length}`);

    // Emit student_join event via S2 for real-time teacher dashboard updates
    console.log(`[JOIN] Emitting student_join event for student ${studentId} in session ${sessionId}`);
    await classroomS2Service.updateProgress(sessionId, {
      studentId,
      progress: 0,
      currentParagraph: 0,
      status: 'idle',
      eventType: 'student_join',
      studentName: studentName || studentId
    });

    console.log(`[JOIN] Successfully joined student ${studentId} to session ${sessionId}`);

    res.json({
      success: true,
      sessionId,
      studentId,
      mode: session.mode
    });
  } catch (error) {
    console.error('[JOIN] Error joining session:', error);
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

    // Get session to look up student name
    const session = sessions.get(sessionId);
    if (!session) {
      return res.status(404).json({
        success: false,
        error: 'Session not found'
      });
    }

    // Find student in session to get their name
    const student = session.students.find(s => s.studentId === studentId);
    const studentName = student?.studentName || studentId;

    // Calculate progress percentage
    const progress = totalParagraphs > 0
      ? Math.round(((currentParagraph + 1) / totalParagraphs) * 100)
      : 0;

    // Determine status based on progress
    let status = 'reading';
    if (progress >= 100) {
      status = 'completed';
    } else if (progress === 0) {
      status = 'idle';
    }

    // Update progress in S2 with studentName and calculated progress
    await classroomS2Service.updateProgress(sessionId, {
      studentId,
      studentName,
      currentParagraph,
      totalParagraphs,
      progress,
      status,
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

  console.log(`[SSE] Teacher subscribing to session: ${sessionId}`);

  // Set headers for SSE
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  try {
    // Check if session exists
    const session = sessions.get(sessionId);
    if (!session) {
      console.error(`[SSE] Session not found: ${sessionId}`);
      res.status(404).json({
        success: false,
        error: 'Session not found'
      });
      return;
    }

    console.log(`[SSE] Session found: ${sessionId}, students: ${session.students.length}`);

    // Send initial connection confirmation
    res.write(`data: ${JSON.stringify({ type: 'connected', sessionId })}\n\n`);

    // CRITICAL FIX: Broadcast current student list to teacher on connection
    // This fixes Issue #4 - teachers now see students who joined before SSE connection
    if (session.students.length > 0) {
      console.log(`[SSE] Broadcasting ${session.students.length} existing students to teacher`);
      
      for (const student of session.students) {
        const studentJoinEvent = {
          type: 'student_join',
          sessionId,
          studentId: student.studentId,
          studentName: student.studentName,
          progress: 0,
          currentParagraph: 0,
          status: 'idle',
          timestamp: Date.now()
        };
        res.write(`data: ${JSON.stringify(studentJoinEvent)}\n\n`);
      }
    }

    // Subscribe to S2 updates
    const unsubscribe = await classroomS2Service.subscribeToSession(sessionId, (update) => {
      console.log(`[SSE] Sending update to teacher for session ${sessionId}:`, update);
      res.write(`data: ${JSON.stringify(update)}\n\n`);
    });

    console.log(`[SSE] Teacher successfully subscribed to session: ${sessionId}`);

    // Handle client disconnect
    req.on('close', () => {
      console.log(`[SSE] Teacher disconnected from session: ${sessionId}`);
      unsubscribe();
      res.end();
    });
  } catch (error) {
    console.error('[SSE] Error subscribing to session:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to subscribe to session'
    });
  }
});

// POST /api/classroom/end-session - End a classroom session
router.post('/end-session', (req, res) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required field: sessionId'
      });
    }

    // Remove session from memory
    sessions.delete(sessionId);

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

// POST /api/classroom/set-story - Set teacher's story for a session
router.post('/set-story', async (req, res) => {
  try {
    const { sessionId, story, quiz } = req.body;

    if (!sessionId || !story) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: sessionId, story'
      });
    }

    const session = sessions.get(sessionId);
    if (!session) {
      return res.status(404).json({
        success: false,
        error: 'Session not found'
      });
    }

    // Store teacher's story in session
    session.teacherStory = story;
    session.teacherQuiz = quiz;

    // Emit teacher_story_ready event via S2
    await classroomS2Service.updateProgress(sessionId, {
      studentId: 'teacher',
      progress: 0,
      currentParagraph: 0,
      status: 'story_ready',
      eventType: 'teacher_story_ready',
      storyTitle: story.title
    });

    res.json({
      success: true,
      sessionId
    });
  } catch (error) {
    console.error('Error setting story:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to set story'
    });
  }
});

// GET /api/classroom/session/:sessionId/story - Get teacher's story for a session
router.get('/session/:sessionId/story', (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = sessions.get(sessionId);

    if (!session) {
      return res.status(404).json({
        success: false,
        error: 'Session not found'
      });
    }

    if (!session.teacherStory) {
      return res.status(404).json({
        success: false,
        error: 'No story set for this session'
      });
    }

    res.json({
      success: true,
      story: session.teacherStory,
      quiz: session.teacherQuiz
    });
  } catch (error) {
    console.error('Error getting story:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get story'
    });
  }
});

// GET /api/classroom/session/:sessionId - Get session details
router.get('/session/:sessionId', (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = sessions.get(sessionId);

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