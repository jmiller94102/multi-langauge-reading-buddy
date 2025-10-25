# Live Classroom Monitoring - Accelerated MVP Development Plan

**Timeline**: 5-7 days (40-56 hours)
**Current Status**: Day 1 COMPLETE ✅

---

## Day 1: Backend S2 Integration (COMPLETE ✅)

**Goal**: S2.dev setup and REST API integration

**Status**: Complete

**Tasks**:
- [x] Install S2.dev client package - switched to REST API (Option B)
- [x] Create classroom-s2.service.js with REST API integration
- [x] Create classroom.routes.js with API endpoints
- [x] Integrate routes with server.js
- [x] Test S2 connection with curl

**Completed Work**:
- ✅ S2 REST API service implemented (POST /v1/basins for creating basins)
- ✅ Correct endpoints configured: https://aws.s2.dev (account), https://{basin}.b.aws.s2.dev (basin)
- ✅ Classroom routes created: /create-session, /update-progress, /subscribe/:sessionId
- ✅ Test session created successfully: classroom-test-classroom-1-test-session-1-176127

**Key Learnings**:
- Switched from SDK to REST API due to ES module compatibility
- S2.dev uses two endpoint types: account-level and basin-level
- Basin creation: POST /v1/basins with JSON body {"basin": "name"}
- Basin names must be 8-48 chars, lowercase, numbers, hyphens, globally unique

---

## Day 2: SSE Streaming & Additional Endpoints (NEXT)

**Goal**: Implement real-time updates via Server-Sent Events

**Status**: Not Started

**Tasks**:
- [ ] Implement GET /subscribe/:sessionId (SSE streaming)
- [ ] Test SSE connection with curl
- [ ] Implement GET /session/:sessionId (session details)
- [ ] Implement POST /end-session
- [ ] Test all endpoints together
- [ ] Write integration tests

**Estimated Time**: 4-6 hours

**Validation**:
```bash
# Terminal 1: Subscribe to SSE
curl -N http://localhost:8080/api/classroom/subscribe/session_123

# Terminal 2: Send progress update
curl -X POST http://localhost:8080/api/classroom/update-progress \
  -d '{"sessionId":"session_123","studentId":"s1","progress":50}'

# Terminal 1 should receive:
data: {"type":"progress_update","studentId":"s1","progress":50}
```

---

## Day 3: Frontend Progress Service

**Goal**: Create student-side progress tracking service

**Status**: Not Started

**Tasks**:
- [ ] Create frontend/src/services/classroom-progress.service.ts
- [ ] Implement joinSession(), updatePosition(), sendProgressUpdate()
- [ ] Implement status detection (reading/idle/stuck)
- [ ] Add 5-second interval timer
- [ ] Write unit tests

**Estimated Time**: 4-6 hours

---

## Day 4: Reading Page Integration

**Goal**: Integrate progress tracking into reading experience

**Status**: Not Started

**Tasks**:
- [ ] Add Intersection Observer to Reading page
- [ ] Track visible paragraphs
- [ ] Connect observer to progress service
- [ ] Handle sessionId URL parameter
- [ ] Test with real story content

**Estimated Time**: 4-6 hours

---

## Day 5: Teacher Dashboard UI

**Goal**: Create real-time teacher dashboard

**Status**: Not Started

**Tasks**:
- [ ] Create TeacherDashboard.tsx skeleton
- [ ] Implement SSE connection (EventSource)
- [ ] Handle real-time updates
- [ ] Display metrics (avg progress, completion, stuck students)
- [ ] Create student grid layout

**Estimated Time**: 6-8 hours

---

## Day 6: Student Cards & Metrics

**Goal**: Build student card component and metrics

**Status**: Not Started

**Tasks**:
- [ ] Create StudentCard.tsx component
- [ ] Add progress bar and status indicators
- [ ] Implement alert system for stuck students
- [ ] Add animations
- [ ] Test with 10+ students

**Estimated Time**: 4-6 hours

---

## Day 7: Testing & Polish

**Goal**: End-to-end testing and final polish

**Status**: Not Started

**Tasks**:
- [ ] Test full flow: teacher creates → students read → dashboard updates
- [ ] Performance testing with 30+ students
- [ ] Add session creation/end UI
- [ ] Final code review
- [ ] Update documentation

**Estimated Time**: 4-6 hours

---

## Progress Summary

**Completed**: 1/7 days (Day 1)
**Remaining**: 6 days (estimated 24-42 hours)
**Total Estimated Time**: 40-56 hours

**Current Deliverables**:
- ✅ Backend S2 REST API integration
- ✅ Classroom routes (create, update, subscribe)
- ✅ Test session creation verified

**Next Steps**:
1. Implement SSE streaming endpoint (Day 2)
2. Create frontend progress service (Day 3)
3. Integrate into Reading page (Day 4)
4. Build Teacher Dashboard (Days 5-6)
5. Test and polish (Day 7)

---

**Status**: ✅ Day 1 Complete - Ready for Day 2
**Last Updated**: 2025-01-26