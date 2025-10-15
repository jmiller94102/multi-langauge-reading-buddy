# Recover Project Context - Reading App V2

Use this command after `/clear`, context loss, power cycle, or returning to the project after time away.

## Smart Context Recovery

This command will:
1. Detect which domain you're working on (frontend/backend/fullstack)
2. Load appropriate CLAUDE.md files
3. Show current PRP progress and next actions

---

## Automatic Context Detection

### Step 1: Find Active PRP

```bash
# Check PRPs directory for in-progress work
ls -t PRPs/frontend/*.md 2>/dev/null | head -5
ls -t PRPs/backend/*.md 2>/dev/null | head -5
ls -t PRPs/fullstack/*.md 2>/dev/null | head -5

# Check for current-prp.txt tracker
cat PRPs/frontend/current-prp.txt 2>/dev/null
cat PRPs/backend/current-prp.txt 2>/dev/null
```

### Step 2: Determine Active Work Domain

```bash
# Check which domain has most recent activity
stat -f "%m %N" PRPs/frontend/*.md 2>/dev/null | sort -rn | head -1
stat -f "%m %N" PRPs/backend/*.md 2>/dev/null | sort -rn | head -1

# Check git for recent changes
git log --oneline --name-only -5 | grep -E "^(frontend|backend|PRPs)" | head -1
```

### Step 3: Load Appropriate Context

**If Frontend PRP is most recent:**
```bash
# Load in this order:
Read: /Users/joromini/Documents/pyprojects/crewai/gitclone/renzo/reading_app/CLAUDE.md
Read: /Users/joromini/Documents/pyprojects/crewai/gitclone/renzo/reading_app/frontend/CLAUDE.md
Read: /Users/joromini/Documents/pyprojects/crewai/gitclone/renzo/reading_app/PRPs/frontend/README.md
Read: /Users/joromini/Documents/pyprojects/crewai/gitclone/renzo/reading_app/PRPs/frontend/<current-prp>.md

# Check git activity
git log --oneline -10 frontend/
```

**If Backend PRP is most recent:**
```bash
# Load in this order:
Read: /Users/joromini/Documents/pyprojects/crewai/gitclone/renzo/reading_app/CLAUDE.md
Read: /Users/joromini/Documents/pyprojects/crewai/gitclone/renzo/reading_app/backend/CLAUDE.md
Read: /Users/joromini/Documents/pyprojects/crewai/gitclone/renzo/reading_app/PRPs/backend/README.md
Read: /Users/joromini/Documents/pyprojects/crewai/gitclone/renzo/reading_app/PRPs/backend/<current-prp>.md

# Check git activity
git log --oneline -10 backend/
```

**If Full-Stack PRP is most recent:**
```bash
# Load in this order:
Read: /Users/joromini/Documents/pyprojects/crewai/gitclone/renzo/reading_app/CLAUDE.md
Read: /Users/joromini/Documents/pyprojects/crewai/gitclone/renzo/reading_app/frontend/CLAUDE.md
Read: /Users/joromini/Documents/pyprojects/crewai/gitclone/renzo/reading_app/backend/CLAUDE.md
Read: /Users/joromini/Documents/pyprojects/crewai/gitclone/renzo/reading_app/PRPs/fullstack/README.md
Read: /Users/joromini/Documents/pyprojects/crewai/gitclone/renzo/reading_app/PRPs/fullstack/<current-prp>.md
```

---

## Manual Context Recovery

If automatic detection doesn't work or you want to manually recover:

### Frontend Development

```bash
# 1. Root project context
Read: /Users/joromini/Documents/pyprojects/crewai/gitclone/renzo/reading_app/CLAUDE.md

# 2. Frontend-specific guide
Read: /Users/joromini/Documents/pyprojects/crewai/gitclone/renzo/reading_app/frontend/CLAUDE.md

# 3. Check PRP progress
Read: /Users/joromini/Documents/pyprojects/crewai/gitclone/renzo/reading_app/PRPs/frontend/README.md

# 4. Load current PRP (if known)
Read: /Users/joromini/Documents/pyprojects/crewai/gitclone/renzo/reading_app/PRPs/frontend/<current-prp>.md

# 5. Check recent commits
git log --oneline -10 frontend/

# 6. Check current branch
git branch --show-current
```

**Next Actions:** Check PRPs/frontend/README.md for current PRP checkbox status

---

### Backend Development

```bash
# 1. Root project context
Read: /Users/joromini/Documents/pyprojects/crewai/gitclone/renzo/reading_app/CLAUDE.md

# 2. Backend-specific guide
Read: /Users/joromini/Documents/pyprojects/crewai/gitclone/renzo/reading_app/backend/CLAUDE.md

# 3. Check PRP progress
Read: /Users/joromini/Documents/pyprojects/crewai/gitclone/renzo/reading_app/PRPs/backend/README.md

# 4. Load current PRP (if known)
Read: /Users/joromini/Documents/pyprojects/crewai/gitclone/renzo/reading_app/PRPs/backend/<current-prp>.md

# 5. Check recent commits
git log --oneline -10 backend/
```

**Note:** Backend development starts in Phase 7 (POST-MVP, after frontend completion)

---

### Planning/Documentation Review

```bash
# 1. Root context
Read: /Users/joromini/Documents/pyprojects/crewai/gitclone/renzo/reading_app/CLAUDE.md

# 2. Architecture overview
Read: /Users/joromini/Documents/pyprojects/crewai/gitclone/renzo/reading_app/docs/v2-architecture.md

# 3. Implementation strategy
Read: /Users/joromini/Documents/pyprojects/crewai/gitclone/renzo/reading_app/docs/implementation-strategy.md

# 4. Check all planning docs
ls /Users/joromini/Documents/pyprojects/crewai/gitclone/renzo/reading_app/docs/
```

---

## Quick Context Summary

### From Root CLAUDE.md

**Project:** Reading App V2 - Gamified Multilingual Reading for Children
- **Frontend:** React 18 + TypeScript + Vite (port 5173)
- **Backend:** Node.js + Express + PostgreSQL (port 8080) - POST-MVP
- **Status:** Planning Complete - Ready for Phase 1 Implementation

**Critical Architecture:**
- **Priority Order:** Language features FIRST, then Pet system SECOND
- **MVP Approach:** Pure frontend with localStorage, no backend until Phase 7
- **Multi-language:** English (primary) + Korean/Mandarin (secondary)
- **Pet System:** 21 unique forms (7 stages × 3 tracks), 147 emotion variants

**Custom Commands:**
- `/generate-prp <planning-doc>` - Generate PRP from planning doc
- `/execute-prp <prp-path>` - Execute PRP with validation gates
- `/recover-context` - This command

**Mandatory Practices:**
- Sub-agent validation at 6 checkpoints (NEVER skip)
- Todo list discipline (one in_progress task only)
- Quality gates (all 5 must pass before proceeding)

---

## Context Recovery Workflow

### Scenario 1: Power Cycle Mid-Frontend Development

```bash
# 1. Start Claude Code from project root
cd /Users/joromini/Documents/pyprojects/crewai/gitclone/renzo/reading_app

# 2. Run this command
/recover-context

# Expected flow:
# ✅ Detects PRPs/frontend/ has recent activity
# ✅ Loads CLAUDE.md (root project context)
# ✅ Loads frontend/CLAUDE.md (frontend-specific guide)
# ✅ Loads PRPs/frontend/README.md (shows which PRPs completed)
# ✅ Loads current PRP (if current-prp.txt exists)
# ✅ Shows: "Working on: dashboard-implementation.md (Step 3 of 8)"
# ✅ Shows: "Next Actions: Implement QuestList component"
# ✅ Shows: "Blockers: None"

# 3. Continue work
# Resume from current step in PRP
```

### Scenario 2: Returning After Long Break

```bash
# 1. Start Claude Code from project root
cd /Users/joromini/Documents/pyprojects/crewai/gitclone/renzo/reading_app

# 2. Run this command
/recover-context

# 3. Review progress
Read: PRPs/frontend/README.md
# Check which PRPs are completed (✅ checked boxes)

# 4. Check git for what was done
git log --oneline -20
git status

# 5. Decide next action
# If mid-PRP: Continue current PRP
# If PRP complete: Start next PRP from README.md
# If starting fresh: Begin with PRPs/frontend/project-setup.md
```

---

## Context Recovery Checklist

After running this command, you should know:

**Project Context:**
- [ ] Which domain you're working on (frontend/backend/fullstack)
- [ ] Current development phase (1-8)
- [ ] Which PRPs are completed
- [ ] Current PRP and step number
- [ ] Next actions to take
- [ ] Any active blockers

**Technical Context:**
- [ ] Technology stack for active domain
- [ ] Critical constraints (what NOT to do)
- [ ] Architecture patterns to follow
- [ ] Commands to run (dev, test, build)
- [ ] Mandatory validation requirements (sub-agents, quality gates)

**Historical Context:**
- [ ] What was implemented recently (git log)
- [ ] Which files were modified
- [ ] Why certain decisions were made (check planning docs)

---

## If No Active PRP

If no PRP is currently active:

```bash
# You're starting fresh or between PRPs
# 1. Read root CLAUDE.md
Read: /Users/joromini/Documents/pyprojects/crewai/gitclone/renzo/reading_app/CLAUDE.md

# 2. Check PRP progress
Read: /Users/joromini/Documents/pyprojects/crewai/gitclone/renzo/reading_app/PRPs/frontend/README.md

# 3. Decide: Which PRP to start next?
# Phase 1 (Foundation):
#   - project-setup.md
#   - component-library.md
#   - theme-system.md
#   - navigation.md

# 4. Execute next PRP
/execute-prp PRPs/frontend/project-setup.md
```

---

## Multiple Domains - Which to Load?

**Priority Order (if multiple domains active):**

```bash
# 1. Check modification times across domains
stat -f "%m %N" PRPs/frontend/*.md 2>/dev/null | sort -rn | head -1
stat -f "%m %N" PRPs/backend/*.md 2>/dev/null | sort -rn | head -1
stat -f "%m %N" PRPs/fullstack/*.md 2>/dev/null | sort -rn | head -1

# 2. Load most recent automatically

# 3. Priority if same day:
#    - fullstack/ (highest priority - cross-cutting features)
#    - frontend/ (MVP focus)
#    - backend/ (POST-MVP)
```

**If multiple domains active:**
```markdown
Multiple domains detected:
- PRPs/frontend/dashboard-implementation.md (Modified: 2025-10-11 14:30) ← Most recent
- PRPs/fullstack/azure-openai-integration.md (Modified: 2025-10-09 10:15)

Loading: Frontend (most recent activity)
If you intended to work on Azure integration, run:
  /execute-prp PRPs/fullstack/azure-openai-integration.md
```

---

## Pro Tips

### 1. Always Start from Project Root

```bash
# ✅ CORRECT: Start from project root
cd /Users/joromini/Documents/pyprojects/crewai/gitclone/renzo/reading_app
# Claude Code reads root CLAUDE.md
# /recover-context loads appropriate domain CLAUDE.md

# ❌ INCORRECT: Start from subdirectory
cd /Users/joromini/Documents/pyprojects/crewai/gitclone/renzo/reading_app/frontend
# Claude Code might miss root CLAUDE.md
# Harder to navigate between PRPs
```

### 2. Use current-prp.txt Tracker

**Best Practice:** Create `PRPs/frontend/current-prp.txt` to track active PRP:

```bash
# When starting a PRP
echo "dashboard-implementation.md" > PRPs/frontend/current-prp.txt
echo "Step 3 of 8: Implementing QuestList component" >> PRPs/frontend/current-prp.txt

# When completing a PRP
rm PRPs/frontend/current-prp.txt
```

This allows `/recover-context` to immediately load the right PRP!

### 3. Check PRP README for Progress

**PRPs/frontend/README.md** tracks completion with checkboxes:

```markdown
### Phase 1: Foundation
- [x] project-setup.md ✅
- [x] component-library.md ✅
- [ ] theme-system.md ← Currently working on
- [ ] navigation.md
```

### 4. Use Git for Code-Level Context

```bash
# What did I change?
git status
git diff

# What did I commit recently?
git log --oneline -10

# What branch am I on?
git branch --show-current

# What files changed in frontend?
git log --oneline --name-only -10 frontend/
```

### 5. Check Planning Docs for Reference

```bash
# Architecture overview
Read: docs/v2-architecture.md

# Component specifications
Read: docs/component-specifications.md

# Wireframes for UI reference
Read: docs/wireframes/dashboard.md

# Mock data schema
Read: docs/mock-data-schema.md

# Implementation strategy (full details)
Read: docs/implementation-strategy.md
```

### 6. Verify Dev Environment

```bash
# Frontend dev server running?
lsof -i :5173

# Backend dev server running? (if Phase 7+)
lsof -i :8080

# Node modules installed?
ls frontend/node_modules/ 2>/dev/null
ls backend/node_modules/ 2>/dev/null
```

---

## Time Required

- **Ultra-Fast:** 30 seconds (read current-prp.txt + resume)
- **Fast:** 2 minutes (PRP README + git log)
- **Complete:** 5 minutes (all CLAUDE.md files + current PRP)
- **Deep Dive:** 15 minutes (all planning docs + git history)

---

## Example: Complete Recovery Session

```bash
# Power cycled during frontend development (Dashboard PRP)
# Starting fresh Claude Code session from project root

User: "/recover-context"

Claude Code:
"🔍 Detecting active work...

Found PRP activity:
- PRPs/frontend/dashboard-implementation.md (Modified: 2025-10-11 14:30) ✅ Most recent
- PRPs/frontend/current-prp.txt exists

📚 Loading context...

1. ✅ Loaded: CLAUDE.md (Root project context)
   - Project: Reading App V2 - Gamified Multilingual Reading
   - Frontend: React 18 + TypeScript + Vite
   - Backend: POST-MVP (Phase 7)
   - Priority: Language features FIRST, Pet system SECOND

2. ✅ Loaded: frontend/CLAUDE.md
   - Tech Stack: React 18, TypeScript 5.7, Vite 6.0, Tailwind CSS
   - State: React Context + localStorage (MVP)
   - Testing: Vitest + React Testing Library
   - Mandatory: Sub-agent validation, todo list discipline

3. ✅ Loaded: PRPs/frontend/README.md
   - Phase 1 (Foundation): 2 of 4 PRPs complete
   - Phase 2 (Core Pages): 0 of 4 PRPs complete
   - Current: dashboard-implementation.md

4. ✅ Loaded: PRPs/frontend/dashboard-implementation.md
   - PRP: Dashboard Page Implementation
   - Progress: Step 3 of 8
   - Current Task: Implement QuestList component

5. ✅ Checked: Recent commits (last 10)
   - feat: add VirtualPet component (1 hour ago)
   - test: add VirtualPet tests (2 hours ago)
   - feat: create Dashboard page structure (3 hours ago)

---

📍 CURRENT POSITION:
Phase 1: Foundation (50% complete)
PRP: dashboard-implementation.md (Step 3 of 8)

🔧 IN PROGRESS:
Implementing QuestList component with daily/weekly quests

📋 NEXT ACTIONS:
1. Create QuestList component in src/components/dashboard/
2. Connect to QuestContext for quest data
3. Implement quest claim functionality
4. Write unit tests for QuestList
5. Run sub-agent validation (MANDATORY)

⚠️ BLOCKERS:
None

🎯 CONFIDENCE: 90/100 ⭐⭐⭐⭐⭐

---

Ready to continue! Shall I proceed with implementing QuestList?"
```

---

## Emergency Recovery

If everything is lost (no current-prp.txt, no git history):

```bash
# 1. Start fresh
Read: /Users/joromini/Documents/pyprojects/crewai/gitclone/renzo/reading_app/CLAUDE.md

# 2. Check what exists
ls frontend/src/ 2>/dev/null
ls backend/src/ 2>/dev/null

# 3. Check PRP progress
Read: PRPs/frontend/README.md
Read: PRPs/backend/README.md

# 4. Check planning docs
ls docs/

# 5. Ask user
"I see planning is complete. Which phase are you working on?"
"Options: Phase 1 (Foundation), Phase 2 (Core Pages), etc."

# 6. Proceed based on answer
```

---

## Summary

**Context recovery is automatic and smart:**
1. Detects which domain (frontend/backend/fullstack) is active
2. Loads appropriate CLAUDE.md files in correct order
3. Shows current PRP progress and next actions
4. Provides clear path to continue work

**Key files for recovery:**
- `CLAUDE.md` (root) - Project overview and workflow
- `frontend/CLAUDE.md` or `backend/CLAUDE.md` - Domain-specific guide
- `PRPs/{domain}/README.md` - PRP completion status
- `PRPs/{domain}/current-prp.txt` - Active PRP tracker (optional)
- Git history - Recent changes

**Always start from project root, let `/recover-context` handle the rest!**

---

**Last Updated:** 2025-10-11
**Version:** 2.0.0 (Adapted for Reading App V2)
