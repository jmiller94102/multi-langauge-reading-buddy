# Live Classroom Monitoring - Accelerated MVP Development

**Timeline**: 5-7 days (40-56 hours)
**Approach**: MVP-first, iterate later
**Status**: In Progress

---

## Acceleration Strategy

Original PRP Estimate: 3 weeks (120 hours)
Accelerated MVP: 5-7 days (40-56 hours)

**How we accelerate**:
- Use existing Express server (no new backend setup)
- Use in-memory storage (skip database setup)
- Focus on core real-time functionality only
- Defer advanced features (alerts, analytics, mobile optimization)
- Integrate with existing Reading page (no new student UI)

---

## Day 1: Backend S2 Integration (8 hours)

**Morning (4 hours)**:
- [ ] Install @s2-dev/streamstore npm package
- [ ] Create backend/services/classroom-s2.service.js
- [ ] Implement createSession(), updateProgress(), subscribeToSession()
- [ ] Test S2 connection with simple script

**Afternoon (4 hours)**:
- [ ] Create backend/routes/classroom.routes.js
- [ ] Implement POST /api/classroom/create-session
- [ ] Implement POST /api/classroom/update-progress
- [ ] Add routes to server.js
- [ ] Test with curl

**Validation**:
```bash
curl -X POST http://localhost:8080/api/classroom/create-session \
  -H "Content-Type: application/json" \
  -d '{"classroomId":"test","teacherId":"t1","storyId":"s1"}'
# Expected: Session created, S2 stream exists
```

**Deliverable**: S2 integration + basic session management working

---

## Day 2: SSE Streaming + Progress Endpoint (8 hours)

**Morning (4 hours)**:
- [ ] Implement GET /api/classroom/subscribe/:sessionId (SSE)
- [ ] Setup SSE headers and EventSource connection
- [ ] Connect S2 subscription to SSE stream
- [ ] Test SSE in browser console

**Afternoon (4 hours)**:
- [ ] Implement GET /api/classroom/session/:sessionId
- [ ] Implement POST /api/classroom/end-session
- [ ] Add error handling for all endpoints
- [ ] Integration test (create session → update progress → receive via SSE)

**Validation**:
```bash
# Terminal 1: Subscribe
curl -N http://localhost:8080/api/classroom/subscribe/session_123

# Terminal 2: Send update
curl -X POST http://localhost:8080/api/classroom/update-progress \
  -d '{"sessionId":"session_123","studentId":"s1","progress":50}'

# Terminal 1 should receive: data: {"type":"progress_update",...}
```

**Deliverable**: Real-time streaming backend complete

---

## Day 3: Student Progress Service (8 hours)

**Morning (4 hours)**:
- [ ] Create frontend/src/services/classroom-progress.service.ts
- [ ] Implement joinSession(), updatePosition(), sendProgressUpdate()
- [ ] Add 5-second interval timer
- [ ] Implement status detection (reading/idle/stuck)

**Afternoon (4 hours)**:
- [ ] Create frontend/src/types/classroom.ts
- [ ] Define ClassroomSession, StudentProgress, ProgressUpdate interfaces
- [ ] Write unit tests for progress service
- [ ] Test service in browser console

**Validation**:
```typescript
// Browser console test
classroomProgressService.joinSession('test', 'student1', 10);
classroomProgressService.updatePosition(3);
// Check network tab: POST every 5 seconds
```

**Deliverable**: Student progress service working

---

## Day 4: Reading Page Integration (8 hours)

**Morning (4 hours)**:
- [ ] Add Intersection Observer to Reading page
- [ ] Add data-paragraph-index to story paragraphs
- [ ] Connect observer to progress service
- [ ] Test viewport tracking with real story

**Afternoon (4 hours)**:
- [ ] Add sessionId URL parameter handling
- [ ] Auto-join session on mount
- [ ] Add cleanup on unmount
- [ ] Test with multiple student tabs (5+)
- [ ] Fix any race conditions

**Validation**:
```bash
# Open: http://localhost:5173/reading?sessionId=abc&studentId=s1
# Scroll through story
# Check backend logs for progress updates
```

**Deliverable**: Student-side tracking complete

---

## Day 5: Teacher Dashboard Skeleton (8 hours)

**Morning (4 hours)**:
- [ ] Create frontend/src/pages/TeacherDashboard.tsx
- [ ] Setup basic layout (header, metrics area, student grid)
- [ ] Implement EventSource (SSE) connection
- [ ] Handle initial state loading

**Afternoon (4 hours)**:
- [ ] Handle real-time progress updates
- [ ] Update student state from SSE events
- [ ] Add error handling and reconnection
- [ ] Test with 1 teacher + 5 students

**Validation**:
```bash
# Open teacher dashboard
# Open 5 student reading tabs
# Verify progress updates appear on dashboard within 5 seconds
```

**Deliverable**: Basic dashboard receiving real-time updates

---

## Day 6: Student Card Component (8 hours)

**Morning (4 hours)**:
- [ ] Create StudentCard component
- [ ] Add progress bar
- [ ] Add status indicator (color dot: green/yellow/red/blue)
- [ ] Add student name display

**Afternoon (4 hours)**:
- [ ] Style with Tailwind CSS
- [ ] Add smooth progress animations
- [ ] Create student grid layout
- [ ] Make responsive (desktop focus)

**Validation**:
```bash
# Dashboard displays all students
# Progress bars update smoothly
# Status colors match student state
```

**Deliverable**: Student card component complete

---

## Day 7: Testing & Polish (8 hours)

**Morning (4 hours)**:
- [ ] Test with 10+ student tabs
- [ ] Verify <5 second update latency
- [ ] Test SSE reconnection scenarios
- [ ] Fix any performance issues

**Afternoon (4 hours)**:
- [ ] Add basic class metrics (avg progress, completion count)
- [ ] Add session creation UI (teacher assigns story)
- [ ] Add session end UI (teacher ends session)
- [ ] Final end-to-end testing

**Validation**:
```bash
# Complete flow: Teacher creates → Students read → Teacher watches → Teacher ends
# 10+ students simultaneously
# All progress updates arrive
# No console errors
```

**Deliverable**: MVP feature complete and functional

---

## Progress Tracking

### Day 1: Backend S2 Integration
- [ ] S2 client installed and configured
- [ ] S2 service created
- [ ] Session creation endpoint working
- [ ] Progress update endpoint working

### Day 2: SSE Streaming
- [ ] SSE endpoint implemented
- [ ] Real-time updates flowing
- [ ] Session management complete

### Day 3: Student Progress Service
- [ ] Progress service created
- [ ] Status detection working
- [ ] Unit tests passing

### Day 4: Reading Page Integration
- [ ] Viewport tracking working
- [ ] Session join/leave working
- [ ] Multi-student testing complete

### Day 5: Teacher Dashboard Skeleton
- [ ] Dashboard page created
- [ ] SSE connection working
- [ ] Real-time updates displaying

### Day 6: Student Card Component
- [ ] StudentCard component complete
- [ ] Grid layout working
- [ ] Animations smooth

### Day 7: Testing & Polish
- [ ] Performance validated (10+ students)
- [ ] Session creation/end UI complete
- [ ] End-to-end flow working

---

## Deferred Features (Post-MVP)

These features are in the original PRP but deferred for speed:

- Advanced alerts and notifications
- Detailed analytics and metrics
- Mobile optimization
- Teacher intervention tools ("Send Help" button)
- Performance testing with 30+ students
- Comprehensive error handling
- Production deployment setup

---

## MVP Scope

**IN SCOPE**:
- Teacher creates classroom session
- Students join automatically via URL parameter
- Viewport-based progress tracking (every 5 seconds)
- Real-time dashboard with student progress bars
- Session end functionality

**OUT OF SCOPE** (for MVP):
- Advanced alerts for stuck students
- Detailed metrics/analytics
- Mobile responsive design
- Teacher intervention features
- Production-grade error handling
- Load testing beyond 10 students

---

**Status**: Ready to Execute
**Next Step**: Begin Day 1 - Backend S2 Integration