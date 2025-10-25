# PRP: S2.dev Live Classroom Monitoring - Real-Time Teacher Dashboard

**Feature**: Real-time classroom monitoring with live student progress tracking

**Domain**: Full-Stack (Frontend + Backend + S2.dev Integration)
**Phase**: 8 (Post-MVP Enhancement)
**Estimated Time**: 3 weeks (120 hours)
**Complexity**: Medium
**Priority**: CRITICAL (Killer feature - $90k/year revenue potential)
**Sprint Plan**: See `CLASSROOM_MONITORING_SPRINT_PLAN.md` for day-by-day breakdown

---

## 📋 Overview

Implement live classroom monitoring where teachers see all students' reading progress in real-time. When a teacher assigns a story, they get a dashboard showing which students are reading, how far they've progressed, who's stuck, and when the class is ready for the quiz.

**Success Criteria**: 
- Teacher sees real-time updates (<5 second delay)
- Works for 30+ students simultaneously
- Works even for silent readers (just tracks progress)
- Teacher can intervene when students are stuck
- No performance impact on student reading

---

## 🎯 Key Insight

**This solves the "silent reader" problem**: We don't need to track interactions, just track **viewport position** (what paragraph is visible). This works for ALL readers.

---

## 🛠️ Implementation Steps (Condensed)

### Step 1: S2 Setup (Backend) - 1 day

```javascript
// backend/src/services/classroom-s2.service.js
class ClassroomS2Service {
  async createSession(classroomId, sessionId, metadata) {
    const streamId = `classroom_${classroomId}_session_${sessionId}`;
    await this.client.createStream(streamId, { metadata });
  }

  async updateProgress(classroomId, sessionId, progressUpdate) {
    const streamId = `classroom_${classroomId}_session_${sessionId}`;
    await this.client.append(streamId, { type: 'progress_update', ...progressUpdate });
  }

  async subscribeToSession(classroomId, sessionId, callback) {
    const streamId = `classroom_${classroomId}_session_${sessionId}`;
    return await this.client.subscribe(streamId, { onMessage: callback });
  }
}
```

---

### Step 2: Backend API Endpoints - 2 days

```javascript
// POST /api/classroom/create-session - Teacher creates session
// POST /api/classroom/update-progress - Student sends progress (every 5s)
// GET /api/classroom/subscribe/:sessionId - Teacher subscribes (SSE)
// POST /api/classroom/end-session - Teacher ends session

router.get('/subscribe/:sessionId', async (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
  });

  const subscription = await classroomS2Service.subscribeToSession(
    classroomId,
    sessionId,
    (event) => {
      res.write(`data: ${JSON.stringify(event)}\n\n`);
    }
  );
});
```

---

### Step 3: Student Progress Tracker (Frontend) - 2 days

```typescript
// frontend/src/services/classroom-progress.service.ts
class ClassroomProgressService {
  joinSession(sessionId, studentId, totalParagraphs) {
    this.sessionId = sessionId;
    // Send progress every 5 seconds
    setInterval(() => this.sendProgressUpdate(), 5000);
  }

  updatePosition(paragraphIndex) {
    this.currentProgress = (paragraphIndex / totalParagraphs) * 100;
  }

  async sendProgressUpdate() {
    await fetch('/api/classroom/update-progress', {
      method: 'POST',
      body: JSON.stringify({
        sessionId,
        studentId,
        progress: this.currentProgress,
        currentParagraph: this.currentParagraph,
        status: this.getStatus(), // reading/idle/stuck
      }),
    });
  }
}
```

---

### Step 4: Integrate into Reading Page - 1 day

```typescript
// frontend/src/pages/Reading.tsx
export const Reading = () => {
  const sessionId = useSearchParams().get('sessionId');

  useEffect(() => {
    if (sessionId) {
      classroomProgressService.joinSession(sessionId, user.id, story.paragraphs.length);
    }
  }, [sessionId]);

  // Track visible paragraph with Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const paragraphIndex = entry.target.dataset.paragraphIndex;
          classroomProgressService.updatePosition(paragraphIndex);
        }
      });
    }, { threshold: 0.5 });

    document.querySelectorAll('.story-paragraph').forEach((p) => observer.observe(p));
  }, []);
};
```

---

### Step 5: Teacher Dashboard UI - 5 days

```typescript
// frontend/src/pages/TeacherDashboard.tsx
export const TeacherDashboard = () => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    // Subscribe to real-time updates via SSE
    const eventSource = new EventSource(`/api/classroom/subscribe/${sessionId}`);
    
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'progress_update') {
        setStudents((prev) =>
          prev.map((s) =>
            s.studentId === data.studentId
              ? { ...s, progress: data.progress, status: data.status }
              : s
          )
        );
      }
    };
  }, [sessionId]);

  return (
    <div className="teacher-dashboard">
      <h1>Live Classroom: {storyTitle}</h1>
      
      {/* Class Metrics */}
      <div className="metrics">
        <MetricCard label="Average Progress" value={`${avgProgress}%`} />
        <MetricCard label="Students Completed" value={`${completed}/${total}`} />
        <MetricCard label="Students Stuck" value={stuck} alert={stuck > 0} />
      </div>

      {/* Student Grid */}
      <div className="student-grid">
        {students.map((student) => (
          <StudentCard
            key={student.id}
            name={student.name}
            progress={student.progress}
            status={student.status}
            onHelp={() => sendHelpMessage(student.id)}
          />
        ))}
      </div>

      {/* Alerts */}
      <AlertPanel alerts={alerts} />
    </div>
  );
};
```

---

### Step 6: Student Card Component - 1 day

```typescript
const StudentCard = ({ name, progress, status }) => {
  const statusColor = {
    reading: 'bg-green-500',
    idle: 'bg-yellow-500',
    stuck: 'bg-red-500',
    completed: 'bg-blue-500',
  }[status];

  return (
    <div className="card p-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-bold">{name}</h3>
        <span className={`w-3 h-3 rounded-full ${statusColor}`} />
      </div>
      
      <div className="mb-2">
        <div className="text-2xl font-bold">{progress}%</div>
        <div className="text-sm text-gray-600">Progress</div>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full ${statusColor}`}
          style={{ width: `${progress}%` }}
        />
      </div>

      {status === 'stuck' && (
        <button className="btn-primary mt-2 w-full">
          Send Help 🆘
        </button>
      )}
    </div>
  );
};
```

---

### Step 7: Testing & Polish - 3 days

```bash
# Test with 10+ simulated students
# Verify real-time updates work
# Test SSE reconnection
# Performance testing (30+ students)
# Teacher user testing
```

---

## 🎯 Quality Gates

### Gate 1: S2 Integration ✅
```bash
# Test session creation
curl -X POST http://localhost:8080/api/classroom/create-session \
  -d '{"classroomId":"class_101","storyId":"story_1","studentIds":["s1","s2"]}'
```

### Gate 2: Real-Time Updates ✅
```bash
# Open teacher dashboard
# Open 2+ student reading pages
# Verify progress updates appear on dashboard within 5 seconds
```

### Gate 3: Performance ✅
```bash
# Test with 30 simulated students
# Verify <5 second update latency
# Check CPU/memory usage
```

### Gate 4: Teacher UX ✅
```bash
# Teacher can see all students
# Alerts work for stuck students
# Can end session cleanly
```

---

## ✅ Completion Checklist

- [ ] S2 service created and tested
- [ ] Backend endpoints working
- [ ] SSE streaming functional
- [ ] Student progress tracker integrated
- [ ] Teacher dashboard displays real-time updates
- [ ] Alerts trigger for stuck students
- [ ] Works for 30+ students
- [ ] No performance impact on students
- [ ] Teacher can create/end sessions
- [ ] Documentation complete

---

## 💰 Business Value

**Revenue**: $75/month × 100 classrooms = $90,000/year
**Development Cost**: 3 weeks × $100/hour × 40 hours = $12,000
**ROI**: 7.5x return, break even with 8 classrooms (2 months)

**Why Schools Pay**:
- ✅ Real-time visibility into student progress
- ✅ Early intervention for struggling students
- ✅ Better classroom management
- ✅ Data for administrators
- ✅ Unique differentiator

---

## 📊 Confidence Score: 9/10

**Strengths (+)**:
- ✅ Solves real teacher pain point
- ✅ Works for silent readers (viewport tracking)
- ✅ Natural S2 use case (multi-user real-time)
- ✅ Clear monetization path
- ✅ Simpler than full analytics

**Weaknesses (-1)**:
- ⚠️ SSE reconnection edge cases

**Risk Mitigation**:
- Test with 30+ students
- Add SSE reconnection logic
- Fallback to polling if SSE fails

---

**PRP Status**: ✅ Ready for Execution
**Last Updated**: 2025-10-23
**Author**: AI Agent (Cascade)
**Estimated Timeline**: 3 weeks (120 hours)
