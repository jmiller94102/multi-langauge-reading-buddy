# Shared Development Patterns - Reading App V2

This file contains common development patterns shared across all CLAUDE.md files to avoid duplication.

**Referenced by**: `CLAUDE.md`, `frontend/CLAUDE.md`, `backend/CLAUDE.md`

---

## 🛡️ Sub-Agent Validation Patterns

**EXPECTATION**: Claude Code MUST use `/agents` to verify and check code quality throughout development.

### Mandatory Validation Points

#### 1. After Component Implementation
```bash
/agents code-reviewer "Review {ComponentName} component:
- TypeScript type safety
- React best practices (hooks, memoization)
- Accessibility (ARIA, keyboard nav, screen reader)
- Child safety (content filtering, age-appropriate design)
- Performance (unnecessary re-renders, expensive operations)"
```

#### 2. After State Management Changes
```bash
/agents code-reviewer "Review state management for {Feature}:
- Memory leaks (useEffect cleanup, listener removal)
- Optimization opportunities (useMemo, useCallback, React.memo)
- State consistency (race conditions, stale closures)
- Performance (unnecessary re-renders)"
```

#### 3. After Security-Related Code
```bash
/agents security-auditor "Comprehensive security audit for {Feature}:
- Input validation (XSS, injection attacks)
- API key protection (never exposed in frontend)
- Data sanitization (user-generated content)
- Child safety compliance (COPPA, age-appropriate content)"
```

#### 4. After API Integration
```bash
/agents code-reviewer "Review API integration for {Service}:
- Error handling (network failures, timeout, rate limits)
- Cost management (caching, request batching)
- Retry logic (exponential backoff)
- API key security (backend-only, never in frontend)"
```

#### 5. After Performance Optimization
```bash
/agents performance-optimizer "Analyze performance for {Feature}:
- Bundle size impact
- Lazy loading effectiveness
- Memoization correctness
- Memory usage patterns"
```

#### 6. Before Every Commit (MANDATORY)
```bash
/agents code-reviewer "Final comprehensive review before commit:
- Code quality and maintainability
- Test coverage adequacy
- Documentation completeness
- No TODO/FIXME left unresolved (or documented as known issues)"
```

### Validation Workflow

```
Implement Feature
   ↓
Run Tests (npm test)
   ↓
Tests Pass? → No → Fix Issues → Loop
   ↓ Yes
Sub-Agent Validation (MANDATORY)
   ↓
Validation Pass? → No → Fix Issues Identified → Loop
   ↓ Yes
Mark Todo Complete
   ↓
Commit Code
   ↓
Move to Next Feature
```

**FAILURE TO USE AGENTS = INCOMPLETE DEVELOPMENT**

---

## 📊 TodoWrite Tool Usage

**Purpose**: Track development progress, maintain focus, provide visibility

**Required Usage**:
- ✅ Create todos at start of PRP execution
- ✅ Mark `in_progress` when starting a task
- ✅ Mark `completed` immediately after finishing
- ✅ ONE task `in_progress` at a time
- ✅ Update todos at each PRP step

**Example Todo Pattern**:
```json
[
  {
    "content": "Create Dashboard page component structure",
    "status": "completed",
    "activeForm": "Creating Dashboard page structure"
  },
  {
    "content": "Implement VirtualPet widget with emotion system",
    "status": "in_progress",
    "activeForm": "Implementing VirtualPet widget"
  },
  {
    "content": "Build QuestList with daily and weekly quests",
    "status": "pending",
    "activeForm": "Building QuestList component"
  }
]
```

### Best Practices

**DO**:
- ✅ Break PRPs into granular tasks (1-2 hour each)
- ✅ Use clear, action-oriented task names
- ✅ Include validation steps in todo list
- ✅ Mark completed immediately (don't batch)

**DON'T**:
- ❌ Create vague todos ("Work on frontend")
- ❌ Mark multiple tasks in_progress
- ❌ Skip updating todos
- ❌ Mark completed before validation passes

---

## 🔄 PRP Execution Guidelines

### Before Starting a PRP

1. **Read planning docs** referenced in PRP
2. **Verify dependencies** installed
3. **Check dev server** is running (if applicable)
4. **Create feature branch**: `git checkout -b feature/<prp-name>` or `git checkout -b backend/<prp-name>`

### During PRP Execution

1. **Update todo list** at each step
2. **Test incrementally** (don't batch)
3. **Use sub-agents** for validation (MANDATORY - see patterns above)
4. **Commit after** each major milestone

### After Completing PRP

1. **Run full test suite**
2. **Sub-agent code review** (MANDATORY - see pattern #6 above)
3. **Update progress tracking**
4. **Merge to main branch**

---

## 🚪 Quality Gates

All features must pass 5 quality gates before proceeding:

### Gate 1: Code Quality
```bash
npm run lint && npm run type-check
/agents code-reviewer "Comprehensive code quality review"
```
**Criteria**: No errors, sub-agent approval, follows conventions

### Gate 2: Testing
```bash
npm test && npm run test:coverage
```
**Criteria**: All tests pass, >80% coverage, critical paths tested

### Gate 3: Accessibility
```bash
npm run test:a11y  # If available
/agents accessibility-checker "WCAG AA compliance check"
```
**Criteria**: WCAG AA compliant, keyboard nav, screen reader compatible

### Gate 4: Performance
```bash
npm run build && npm run preview  # Check build size and load time
```
**Criteria**: Fast load time (<3s), optimized bundle, smooth interactions

### Gate 5: Child Safety
```bash
/agents security-auditor "Child safety compliance audit"
```
**Criteria**: No inappropriate content, content filtering active, age-appropriate design

---

## 🧠 Claude Code Efficiency Guidelines

### Avoid Re-Reading Files Unnecessarily

**Problem**: Re-reading files wastes context tokens

**Bad Pattern**:
```
Read file.ts
Edit file.ts (change 1)
Read file.ts  ❌ (unnecessary - you just edited it)
Edit file.ts (change 2)
Read file.ts  ❌ (unnecessary)
```

**Good Pattern**:
```
Read file.ts
Edit file.ts (change 1)
Edit file.ts (change 2)  ✅ (no re-read needed)
Edit file.ts (change 3)  ✅ (you know the content)
```

**When re-reading IS appropriate**:
- User modified the file externally
- Linter/formatter changed the file
- Multiple sessions later (memory may be stale)
- File is large and you need different sections

### Keep Responses Concise

**DO**:
- ✅ Use tables for structured data
- ✅ Show key findings, not exhaustive analysis
- ✅ Link to files instead of quoting full contents
- ✅ Use bullet points over paragraphs

**DON'T**:
- ❌ Quote entire file contents in responses
- ❌ Repeat information already in context
- ❌ Create verbose explanations when brief ones suffice

---

## 🎯 Common Testing Patterns

### ❌ Avoid Hardcoded Values

**Bad Pattern**:
```typescript
expect(passage.content).toBe("The space station orbits Earth..."); // Hardcoded
expect(passage.wordCount).toBe(347); // Exact number
```

### ✅ Use Range-Based Validation

**Good Pattern**:
```typescript
expect(passage.wordCount).toBeGreaterThanOrEqual(400);
expect(passage.wordCount).toBeLessThanOrEqual(600);
expect(passage.gradeLevel).toMatch(/^(3rd|4th|5th|6th)$/);
```

### ✅ Property-Based Testing

**Good Pattern**:
```typescript
expect(passage.content).toMatch(/^[A-Z]/); // Starts with capital
expect(passage.content).toMatch(/[.!?]$/); // Ends with punctuation
expect(passage.wordCount).toBeGreaterThan(0); // Has content
```

---

**SHARED-PATTERNS.md Status**: ✅ Complete
**Last Updated**: 2025-10-11
**Purpose**: Eliminate duplication across CLAUDE.md files (saves ~2,500 tokens)
