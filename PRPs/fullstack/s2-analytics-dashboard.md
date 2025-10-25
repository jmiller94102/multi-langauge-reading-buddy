# PRP: S2.dev Analytics Dashboard - Reading Session Tracking

**Feature**: Real-time reading analytics with session replay using S2.dev event streaming

**Domain**: Full-Stack (Frontend + Backend + S2.dev Integration)
**Phase**: 8 (Post-MVP Enhancement)
**Estimated Time**: 2 weeks (80 hours)
**Complexity**: Medium-High
**Priority**: HIGH (Monetization opportunity - $5/month parent subscription)

---

## 📋 Overview

Implement comprehensive analytics dashboard tracking every student interaction during reading sessions using S2.dev's durable event streaming. Enables parents/teachers to:
- View real-time reading progress
- Replay entire reading sessions
- Identify learning patterns and struggles
- Generate personalized recommendations

**Success Criteria**: 
- Every reading interaction appended to S2 stream
- Parent dashboard displays live session timeline
- Session replay works for historical sessions
- Analytics generate actionable insights
- No performance impact on reading experience

---

## 🎯 Prerequisites

### Knowledge Requirements
- S2.dev stream API (append, read, subscribe)
- Event sourcing patterns
- React Context API
- Express.js middleware
- Data visualization (Recharts)

### Environment Requirements
- S2.dev account and API key
- Node.js 20.x+
- Existing Reading Quest app (MVP complete)

### External Dependencies
```bash
# Backend
npm install @s2-dev/client

# Frontend
npm install recharts date-fns
```

---

## 🏗️ Architecture Overview

### Event Flow
```
Student Reading → Frontend EventTracker → Backend S2 Service → S2 Stream → Analytics Service → Parent Dashboard
```

### Key Event Types
- Session lifecycle (start/end)
- Reading interactions (word clicks, hovers, pauses)
- Language learning (blend level changes, translations)
- Audio usage (play/pause)
- Quiz performance (answers, completion)

---

## 🛠️ Implementation Steps

### Step 1: Install S2.dev Client (Backend)

**Create `backend/src/services/s2.service.js`**:
```javascript
const { S2Client } = require('@s2-dev/client');

class S2Service {
  constructor() {
    this.client = new S2Client({
      apiKey: process.env.S2_API_KEY,
      endpoint: process.env.S2_ENDPOINT,
    });
  }

  async appendEvent(userId, sessionId, event) {
    const streamId = `student_${userId}_session_${sessionId}`;
    return await this.client.append(streamId, {
      ...event,
      timestamp: Date.now(),
    });
  }

  async readSession(userId, sessionId, options = {}) {
    const streamId = `student_${userId}_session_${sessionId}`;
    return await this.client.read(streamId, options);
  }

  async subscribeToSession(userId, sessionId, callback) {
    const streamId = `student_${userId}_session_${sessionId}`;
    return await this.client.subscribe(streamId, { onMessage: callback });
  }
}

module.exports = new S2Service();
```

**Update `backend/.env`**:
```env
S2_API_KEY=your_s2_api_key
S2_ENDPOINT=https://api.s2.dev
```

---

### Step 2: Define TypeScript Event Types (Frontend)

**Create `frontend/src/types/analytics.ts`**:
```typescript
export interface BaseReadingEvent {
  type: string;
  timestamp: number;
  userId: string;
  sessionId: string;
  storyId: string;
}

export interface WordClickEvent extends BaseReadingEvent {
  type: 'word_click';
  word: string;
  translation: string;
  sentenceIndex: number;
  isSecondaryLanguage: boolean;
}

export interface PauseEvent extends BaseReadingEvent {
  type: 'pause';
  pauseDuration: number;
  sentenceIndex: number;
}

export interface QuizAnswerEvent extends BaseReadingEvent {
  type: 'quiz_answer';
  questionId: string;
  userAnswer: string;
  isCorrect: boolean;
  timeSpent: number;
}

export type ReadingEvent = WordClickEvent | PauseEvent | QuizAnswerEvent; // ... add all types
```

---

### Step 3: Create Frontend Event Tracker

**Create `frontend/src/services/analytics.service.ts`**:
```typescript
class AnalyticsService {
  private eventQueue: ReadingEvent[] = [];
  private batchInterval = 2000; // 2 seconds
  private currentSessionId: string | null = null;

  startSession(userId: string, storyId: string, storyTitle: string) {
    this.currentSessionId = `session_${Date.now()}`;
    this.trackEvent({
      type: 'session_start',
      userId,
      sessionId: this.currentSessionId,
      storyId,
      storyTitle,
      timestamp: Date.now(),
    });
    this.startBatchTimer();
    return this.currentSessionId;
  }

  trackWordClick(userId: string, storyId: string, word: string, translation: string) {
    this.trackEvent({
      type: 'word_click',
      userId,
      sessionId: this.currentSessionId!,
      storyId,
      word,
      translation,
      timestamp: Date.now(),
    });
  }

  private async flushEvents() {
    if (this.eventQueue.length === 0) return;
    const events = [...this.eventQueue];
    this.eventQueue = [];
    
    await fetch('/api/analytics/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ events }),
    });
  }

  private startBatchTimer() {
    setInterval(() => this.flushEvents(), this.batchInterval);
  }
}

export const analyticsService = new AnalyticsService();
```

---

### Step 4: Create Backend Analytics Endpoints

**Create `backend/src/routes/analytics.routes.js`**:
```javascript
const router = require('express').Router();
const s2Service = require('../services/s2.service');

// Receive batch of events
router.post('/events', async (req, res) => {
  const { events } = req.body;
  
  for (const event of events) {
    await s2Service.appendEvent(event.userId, event.sessionId, event);
  }
  
  res.json({ success: true, count: events.length });
});

// Get session events
router.get('/session/:userId/:sessionId', async (req, res) => {
  const { userId, sessionId } = req.params;
  const events = await s2Service.readSession(userId, sessionId);
  res.json({ success: true, events });
});

// Get session metrics
router.get('/metrics/:userId/:sessionId', async (req, res) => {
  const { userId, sessionId } = req.params;
  const events = await s2Service.readSession(userId, sessionId);
  const metrics = calculateMetrics(events);
  res.json({ success: true, metrics });
});

module.exports = router;
```

**Add to `backend/server.js`**:
```javascript
const analyticsRoutes = require('./src/routes/analytics.routes');
app.use('/api/analytics', analyticsRoutes);
```

---

### Step 5: Integrate Tracking into Reading Components

**Update `frontend/src/pages/Reading.tsx`**:
```typescript
import { analyticsService } from '@/services/analytics.service';

export const Reading = () => {
  const { user } = useUser();
  const [sessionId, setSessionId] = useState<string | null>(null);

  const handleStoryGenerated = (story: Story) => {
    const sid = analyticsService.startSession(
      user.id,
      story.id,
      story.title
    );
    setSessionId(sid);
  };

  const handleWordClick = (word: string, translation: string) => {
    analyticsService.trackWordClick(
      user.id,
      currentStory.id,
      word,
      translation
    );
  };

  const handleSessionEnd = () => {
    analyticsService.endSession(user.id, currentStory.id);
  };

  // ... rest of component
};
```

---

### Step 6: Create Analytics Dashboard Page

**Create `frontend/src/pages/Analytics.tsx`**:
```typescript
import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';

export const Analytics = () => {
  const { user } = useUser();
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    const res = await fetch(`/api/analytics/sessions/${user.id}`);
    const data = await res.json();
    setSessions(data.sessions);
  };

  const fetchMetrics = async (sessionId: string) => {
    const res = await fetch(`/api/analytics/metrics/${user.id}/${sessionId}`);
    const data = await res.json();
    setMetrics(data.metrics);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Reading Analytics</h1>
      
      {/* Session List */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {sessions.map(session => (
          <div 
            key={session.id}
            onClick={() => fetchMetrics(session.id)}
            className="card-hover"
          >
            <h3>{session.storyTitle}</h3>
            <p>{new Date(session.startTime).toLocaleDateString()}</p>
          </div>
        ))}
      </div>

      {/* Metrics Display */}
      {metrics && (
        <div className="grid grid-cols-2 gap-6">
          <div className="card">
            <h3 className="font-bold mb-4">Time Metrics</h3>
            <p>Duration: {Math.round(metrics.duration / 60000)} minutes</p>
            <p>Active Reading: {Math.round(metrics.activeReadingTime / 60000)} min</p>
            <p>Engagement Score: {metrics.engagementScore}/100</p>
          </div>

          <div className="card">
            <h3 className="font-bold mb-4">Learning Metrics</h3>
            <p>Words Looked Up: {metrics.wordsLookedUp}</p>
            <p>Blend Level: {metrics.blendLevel}</p>
            <p>Quiz Score: {metrics.quizScore}%</p>
          </div>

          {/* Timeline Chart */}
          <div className="card col-span-2">
            <h3 className="font-bold mb-4">Session Timeline</h3>
            <SessionTimeline sessionId={selectedSession} />
          </div>
        </div>
      )}
    </div>
  );
};
```

---

### Step 7: Create Session Replay Component

**Create `frontend/src/components/analytics/SessionReplay.tsx`**:
```typescript
export const SessionReplay = ({ userId, sessionId }) => {
  const [events, setEvents] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, [sessionId]);

  const fetchEvents = async () => {
    const res = await fetch(`/api/analytics/session/${userId}/${sessionId}`);
    const data = await res.json();
    setEvents(data.events);
  };

  const play = () => {
    setIsPlaying(true);
    // Replay events at 2x speed
    const interval = setInterval(() => {
      setCurrentIndex(i => {
        if (i >= events.length - 1) {
          clearInterval(interval);
          setIsPlaying(false);
          return i;
        }
        return i + 1;
      });
    }, 500); // 2x speed
  };

  const currentEvent = events[currentIndex];

  return (
    <div className="card">
      <h3 className="font-bold mb-4">Session Replay</h3>
      
      <div className="flex gap-4 mb-4">
        <button onClick={play} disabled={isPlaying} className="btn-primary">
          {isPlaying ? 'Playing...' : 'Play'}
        </button>
        <button onClick={() => setCurrentIndex(0)} className="btn-ghost">
          Reset
        </button>
      </div>

      {/* Event Display */}
      <div className="bg-gray-100 p-4 rounded-lg">
        <p className="font-mono text-sm">
          [{currentIndex + 1}/{events.length}] {currentEvent?.type}
        </p>
        {currentEvent?.type === 'word_click' && (
          <p>Clicked: {currentEvent.word} → {currentEvent.translation}</p>
        )}
        {currentEvent?.type === 'pause' && (
          <p>Paused for {Math.round(currentEvent.pauseDuration / 1000)}s</p>
        )}
      </div>

      {/* Progress Bar */}
      <div className="mt-4 bg-gray-200 h-2 rounded-full">
        <div 
          className="bg-primary-500 h-2 rounded-full transition-all"
          style={{ width: `${(currentIndex / events.length) * 100}%` }}
        />
      </div>
    </div>
  );
};
```

---

## 🎯 Quality Gates

### Gate 1: S2 Integration ✅
```bash
# Test S2 connection
node -e "const s2 = require('./src/services/s2.service'); s2.client.ping().then(console.log);"

# Expected: Connection successful
```

### Gate 2: Event Tracking ✅
```bash
# Start session, perform actions, check S2 stream
# Verify events appear in S2 dashboard
```

### Gate 3: Analytics Display ✅
```bash
# Navigate to /analytics
# Verify metrics display correctly
# Test session replay functionality
```

### Gate 4: Performance ✅
```bash
# Verify no lag during reading
# Check event batching (network tab)
# Confirm <100ms overhead
```

---

## ✅ Completion Checklist

- [ ] S2.dev client installed and configured
- [ ] Event types defined (TypeScript)
- [ ] AnalyticsService created (batching works)
- [ ] Backend endpoints implemented
- [ ] Reading components instrumented
- [ ] Analytics dashboard page created
- [ ] Session replay component works
- [ ] Metrics calculation accurate
- [ ] No performance impact on reading
- [ ] Parent/teacher views functional

---

## 📚 Next Steps

After completing this PRP:
1. **`PRPs/fullstack/s2-branching-stories.md`** - Branching story paths (reuses 80% of S2 infrastructure)
2. **Parent subscription monetization** - Stripe integration for $5/month analytics access
3. **AI recommendations** - ML model to analyze patterns and suggest personalized content

---

## 📊 Confidence Score: 8/10

**Strengths (+)**:
- ✅ S2.dev perfect fit for event sourcing
- ✅ 80% code reusable for branching stories
- ✅ Clear monetization path ($5/month)
- ✅ Non-critical feature (fails gracefully)

**Weaknesses (-2)**:
- ⚠️ S2.dev is newer technology (less community support)
- ⚠️ Requires learning S2 API patterns

**Risk Mitigation**:
- Start with simple append/read operations
- Add subscription features incrementally
- Fallback: Can switch to WebSockets if S2 doesn't work

---

**PRP Status**: ✅ Ready for Execution
**Last Updated**: 2025-10-23
**Author**: AI Agent (Cascade)
