# Live Classroom Monitoring - 3-Week Sprint Plan

**Start Date**: TBD
**End Date**: TBD (3 weeks from start)
**Total Hours**: 120 hours (40 hours/week)

---

## 📅 Week 1: Backend Infrastructure

### **Monday - Day 1 (8 hours)**

**Goal**: S2.dev setup and connection test

**Morning (4 hours)**:
- [ ] Create S2.dev account
- [ ] Get API key
- [ ] Install @s2-dev/client in backend
- [ ] Configure environment variables
- [ ] Create `backend/src/services/classroom-s2.service.js`

**Afternoon (4 hours)**:
- [ ] Implement createSession() method
- [ ] Implement updateProgress() method
- [ ] Implement subscribeToSession() method
- [ ] Write connection test script
- [ ] Run test: `node test/test-s2-connection.js`

**Validation**:
```bash
✅ S2 connection successful
✅ Can create stream
✅ Can append events
✅ Can subscribe to stream
```

**Deliverable**: Working S2 service

---

### **Tuesday - Day 2 (8 hours)**

**Goal**: TypeScript type definitions

**Morning (4 hours)**:
- [ ] Create `frontend/src/types/classroom.ts`
- [ ] Define ClassroomSession interface
- [ ] Define StudentProgress interface
- [ ] Define ProgressUpdate interface
- [ ] Define ClassroomAlert interface
- [ ] Define ClassroomMetrics interface

**Afternoon (4 hours)**:
- [ ] Create `backend/src/types/classroom.js` (JSDoc)
- [ ] Add type definitions for all API endpoints
- [ ] Run `npm run type-check` in frontend
- [ ] Fix any type errors
- [ ] Document types in README

**Validation**:
```bash
✅ TypeScript compilation passes
✅ No type errors
✅ All interfaces documented
```

**Deliverable**: Complete type system

---

### **Wednesday - Day 3 (8 hours)**

**Goal**: Backend API endpoints (Part 1)

**Morning (4 hours)**:
- [ ] Create `backend/src/routes/classroom.routes.js`
- [ ] Implement POST /api/classroom/create-session
- [ ] Implement POST /api/classroom/update-progress
- [ ] Add routes to server.js
- [ ] Test with curl/Postman

**Afternoon (4 hours)**:
- [ ] Create in-memory session storage (Map)
- [ ] Add session validation
- [ ] Add error handling
- [ ] Write unit tests for endpoints
- [ ] Test session creation flow

**Validation**:
```bash
curl -X POST http://localhost:8080/api/classroom/create-session \
  -H "Content-Type: application/json" \
  -d '{"classroomId":"test","teacherId":"t1","storyId":"s1","studentIds":["s1","s2"]}'

✅ Returns session object
✅ S2 stream created
✅ Session stored in memory
```

**Deliverable**: Session creation working

---

### **Thursday - Day 4 (8 hours)**

**Goal**: Backend API endpoints (Part 2 - SSE)

**Morning (4 hours)**:
- [ ] Install express-sse
- [ ] Implement GET /api/classroom/subscribe/:sessionId
- [ ] Setup SSE headers
- [ ] Connect S2 subscription to SSE
- [ ] Test SSE connection in browser

**Afternoon (4 hours)**:
- [ ] Implement GET /api/classroom/session/:sessionId
- [ ] Implement POST /api/classroom/end-session
- [ ] Add SSE reconnection handling
- [ ] Test all endpoints together
- [ ] Write integration tests

**Validation**:
```bash
# Terminal 1: Subscribe to SSE
curl -N http://localhost:8080/api/classroom/subscribe/session_123

# Terminal 2: Send progress update
curl -X POST http://localhost:8080/api/classroom/update-progress \
  -d '{"sessionId":"session_123","studentId":"s1","progress":50}'

# Terminal 1 should receive:
data: {"type":"progress_update","studentId":"s1","progress":50}

✅ SSE connection established
✅ Events flow from S2 to SSE
✅ Multiple subscribers work
```

**Deliverable**: Real-time streaming working

---

### **Friday - Day 5 (8 hours)**

**Goal**: Backend testing and polish

**Morning (4 hours)**:
- [ ] Write comprehensive tests for all endpoints
- [ ] Test with 10 simulated students
- [ ] Test SSE reconnection
- [ ] Test error cases (invalid session, etc.)
- [ ] Fix any bugs found

**Afternoon (4 hours)**:
- [ ] Add logging (Winston or similar)
- [ ] Add request validation middleware
- [ ] Add rate limiting (if needed)
- [ ] Document all API endpoints
- [ ] Code review and cleanup

**Validation**:
```bash
✅ All tests passing
✅ 10 students can send updates simultaneously
✅ SSE reconnects automatically
✅ Error handling works
✅ API documented
```

**Deliverable**: Production-ready backend

**Week 1 Milestone**: ✅ Backend infrastructure complete

---

## 📅 Week 2: Student Progress Tracking

### **Monday - Day 6 (8 hours)**

**Goal**: Student progress service

**Morning (4 hours)**:
- [ ] Create `frontend/src/services/classroom-progress.service.ts`
- [ ] Implement joinSession() method
- [ ] Implement updatePosition() method
- [ ] Implement sendProgressUpdate() method
- [ ] Add 5-second interval timer

**Afternoon (4 hours)**:
- [ ] Implement status detection (reading/idle/stuck)
- [ ] Implement leaveSession() method
- [ ] Implement completeStory() method
- [ ] Add error handling
- [ ] Write unit tests

**Validation**:
```typescript
// Test in browser console
classroomProgressService.joinSession('test', 'student1', 10);
classroomProgressService.updatePosition(3);
// Check network tab: POST every 5 seconds
✅ Progress updates sent automatically
✅ Status detection working
✅ No memory leaks
```

**Deliverable**: Progress service working

---

### **Tuesday - Day 7 (8 hours)**

**Goal**: Intersection Observer setup

**Morning (4 hours)**:
- [ ] Research Intersection Observer API
- [ ] Create viewport tracking hook
- [ ] Test with sample paragraphs
- [ ] Tune threshold (50% visibility)
- [ ] Handle edge cases (fast scrolling)

**Afternoon (4 hours)**:
- [ ] Integrate observer into Reading page
- [ ] Add data-paragraph-index to paragraphs
- [ ] Connect observer to progress service
- [ ] Test with real story content
- [ ] Verify accuracy of tracking

**Validation**:
```bash
# Open reading page
# Scroll slowly through story
# Check console: "Paragraph 3 visible"
# Check network: Progress updates sent
✅ Paragraphs detected correctly
✅ Progress updates accurate
✅ No performance impact
```

**Deliverable**: Viewport tracking working

---

### **Wednesday - Day 8 (8 hours)**

**Goal**: Reading page integration

**Morning (4 hours)**:
- [ ] Update `frontend/src/pages/Reading.tsx`
- [ ] Add sessionId URL parameter handling
- [ ] Auto-join session on mount
- [ ] Add cleanup on unmount
- [ ] Test session join/leave

**Afternoon (4 hours)**:
- [ ] Add progress bar (optional, for student)
- [ ] Add "Reading for [Teacher Name]" indicator
- [ ] Handle quiz completion
- [ ] Test end-to-end flow
- [ ] Fix any bugs

**Validation**:
```bash
# Open: http://localhost:5173/reading?sessionId=abc&studentId=s1
✅ Session joined automatically
✅ Progress tracked as student scrolls
✅ Updates sent every 5 seconds
✅ Completion tracked
```

**Deliverable**: Student side complete

---

### **Thursday - Day 9 (8 hours)**

**Goal**: Multi-tab testing

**Morning (4 hours)**:
- [ ] Open 1 teacher tab (placeholder)
- [ ] Open 5 student tabs
- [ ] Verify all students send updates
- [ ] Check backend logs
- [ ] Monitor S2 stream

**Afternoon (4 hours)**:
- [ ] Test with 10 student tabs
- [ ] Test different scroll speeds
- [ ] Test idle/stuck detection
- [ ] Test completion flow
- [ ] Fix any race conditions

**Validation**:
```bash
✅ 10 students can read simultaneously
✅ All progress updates arrive at backend
✅ S2 stream receives all events
✅ No errors in console
✅ Performance acceptable
```

**Deliverable**: Multi-student support verified

---

### **Friday - Day 10 (8 hours)**

**Goal**: Student side polish

**Morning (4 hours)**:
- [ ] Add loading states
- [ ] Add error handling (network failures)
- [ ] Add reconnection logic
- [ ] Improve UX (subtle progress indicator)
- [ ] Test on mobile devices

**Afternoon (4 hours)**:
- [ ] Write student-side tests
- [ ] Performance optimization
- [ ] Code review and cleanup
- [ ] Update documentation
- [ ] Prepare demo

**Validation**:
```bash
✅ Graceful error handling
✅ Works on mobile
✅ No console errors
✅ Clean code
✅ Documented
```

**Deliverable**: Student side production-ready

**Week 2 Milestone**: ✅ Student progress tracking complete

---

## 📅 Week 3: Teacher Dashboard

### **Monday - Day 11 (8 hours)**

**Goal**: Teacher dashboard skeleton

**Morning (4 hours)**:
- [ ] Create `frontend/src/pages/TeacherDashboard.tsx`
- [ ] Setup basic layout (header, metrics, student grid)
- [ ] Add routing
- [ ] Create placeholder components
- [ ] Setup state management

**Afternoon (4 hours)**:
- [ ] Implement EventSource (SSE) connection
- [ ] Handle initial state loading
- [ ] Handle real-time updates
- [ ] Test SSE connection
- [ ] Add error handling

**Validation**:
```bash
# Open: http://localhost:5173/teacher/dashboard?sessionId=abc
✅ Dashboard loads
✅ SSE connection established
✅ Can receive events
```

**Deliverable**: Dashboard skeleton working

---

### **Tuesday - Day 12 (8 hours)**

**Goal**: Student card component

**Morning (4 hours)**:
- [ ] Create `StudentCard.tsx` component
- [ ] Add progress bar
- [ ] Add status indicator (color dot)
- [ ] Add student name/avatar
- [ ] Add styling (Tailwind)

**Afternoon (4 hours)**:
- [ ] Add animations (progress bar fills smoothly)
- [ ] Add status colors (green/yellow/red/blue)
- [ ] Add "Send Help" button
- [ ] Test with mock data
- [ ] Make responsive

**Validation**:
```bash
✅ Card displays student info
✅ Progress bar updates smoothly
✅ Status colors correct
✅ Responsive design
```

**Deliverable**: Student card component complete

---

### **Wednesday - Day 13 (8 hours)**

**Goal**: Metrics and alerts

**Morning (4 hours)**:
- [ ] Create metrics calculation logic
- [ ] Display average progress
- [ ] Display completion count
- [ ] Display stuck student count
- [ ] Add estimated time remaining

**Afternoon (4 hours)**:
- [ ] Create alert system
- [ ] Detect stuck students (>1 min no progress)
- [ ] Create AlertPanel component
- [ ] Add alert notifications
- [ ] Test alert triggers

**Validation**:
```bash
✅ Metrics calculate correctly
✅ Alerts trigger for stuck students
✅ Alert panel displays
✅ Real-time metric updates
```

**Deliverable**: Metrics and alerts working

---

### **Thursday - Day 14 (8 hours)**

**Goal**: End-to-end integration

**Morning (4 hours)**:
- [ ] Test full flow: create session → students read → teacher watches
- [ ] Open 1 teacher tab + 10 student tabs
- [ ] Verify all updates flow correctly
- [ ] Test edge cases (student closes tab, etc.)
- [ ] Fix any integration bugs

**Afternoon (4 hours)**:
- [ ] Add session creation UI (teacher creates assignment)
- [ ] Add session end UI (teacher ends session)
- [ ] Test complete teacher workflow
- [ ] Add loading states
- [ ] Polish UX

**Validation**:
```bash
✅ Teacher can create session
✅ Students can join
✅ Real-time updates work
✅ Teacher can end session
✅ No errors end-to-end
```

**Deliverable**: Full integration working

---

### **Friday - Day 15 (8 hours)**

**Goal**: Testing, polish, and launch prep

**Morning (4 hours)**:
- [ ] Performance testing (30+ students)
- [ ] Load testing backend
- [ ] Browser compatibility testing
- [ ] Mobile testing
- [ ] Fix performance issues

**Afternoon (4 hours)**:
- [ ] Final code review
- [ ] Update documentation
- [ ] Create demo video
- [ ] Write deployment guide
- [ ] Prepare for launch

**Validation**:
```bash
✅ Works with 30+ students
✅ <5 second latency
✅ Works on all browsers
✅ Works on mobile
✅ Documentation complete
```

**Deliverable**: Production-ready feature

**Week 3 Milestone**: ✅ Live Classroom Monitoring COMPLETE! 🎉

---

## 🎯 Daily Checklist Template

```
[ ] Morning standup (review yesterday, plan today)
[ ] Code implementation (4-6 hours)
[ ] Testing (1-2 hours)
[ ] Documentation (30 min)
[ ] Git commit with clear message
[ ] Update progress in this document
[ ] Evening review (what worked, what didn't)
```

---

## 📊 Progress Tracking

### Week 1: Backend Infrastructure
- [ ] Day 1: S2 setup ✅
- [ ] Day 2: Types ✅
- [ ] Day 3: API endpoints (Part 1) ✅
- [ ] Day 4: API endpoints (Part 2 - SSE) ✅
- [ ] Day 5: Testing & polish ✅

### Week 2: Student Progress Tracking
- [ ] Day 6: Progress service ✅
- [ ] Day 7: Intersection Observer ✅
- [ ] Day 8: Reading page integration ✅
- [ ] Day 9: Multi-tab testing ✅
- [ ] Day 10: Polish ✅

### Week 3: Teacher Dashboard
- [ ] Day 11: Dashboard skeleton ✅
- [ ] Day 12: Student cards ✅
- [ ] Day 13: Metrics & alerts ✅
- [ ] Day 14: End-to-end integration ✅
- [ ] Day 15: Testing & launch prep ✅

---

## 🚀 Launch Checklist

- [ ] All quality gates passed
- [ ] Documentation complete
- [ ] Demo video recorded
- [ ] Deployment guide written
- [ ] S2.dev production account setup
- [ ] Backend deployed
- [ ] Frontend deployed
- [ ] Teacher training materials created
- [ ] Beta testers identified
- [ ] Feedback collection plan

---

**Total Time**: 120 hours (15 days × 8 hours)
**Estimated Calendar Time**: 3 weeks (with weekends)
**Team Size**: 1-2 developers (can parallelize Week 1 backend + Week 2 frontend)

---

**Status**: ✅ Ready to Execute
**Last Updated**: 2025-10-23
