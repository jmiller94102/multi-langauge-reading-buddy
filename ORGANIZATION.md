# Reading App V2 - Project Organization

**Created**: 2025-10-14
**Purpose**: Clear organization guide to prevent v1/v2 confusion

---

## 📁 Directory Structure Overview

```
reading_app/                          # ROOT PROJECT DIRECTORY
│
├── 🎯 ACTIVE DEVELOPMENT (v2 - Tamagotchi/Gamified)
│   ├── frontend/                     # ✅ v2 Frontend (React + TypeScript + Vite)
│   │   ├── CLAUDE.md                 # Frontend development guide
│   │   ├── src/                      # Source code
│   │   │   ├── components/           # React components
│   │   │   ├── pages/                # Page components
│   │   │   ├── contexts/             # React Context providers
│   │   │   ├── hooks/                # Custom hooks
│   │   │   ├── services/             # API services
│   │   │   ├── types/                # TypeScript types
│   │   │   └── utils/                # Utility functions
│   │   ├── package.json              # v2.0.0
│   │   └── public/                   # Static assets
│   │
│   ├── backend/                      # ✅ v2 Backend (POST-MVP)
│   │   ├── CLAUDE.md                 # Backend development guide
│   │   └── src/                      # Backend source code
│   │
│   ├── PRPs/                         # ✅ Product Requirement Prompts
│   │   ├── frontend/                 # Frontend PRPs
│   │   │   ├── README.md
│   │   │   ├── phase1-project-setup.md
│   │   │   └── phase1-component-library.md
│   │   ├── backend/                  # Backend PRPs (POST-MVP)
│   │   └── fullstack/                # Cross-cutting PRPs
│   │
│   ├── docs/                         # ✅ v2 Planning Documentation
│   │   ├── v2-architecture.md        # Complete technical spec
│   │   ├── wireframes/               # 6 page wireframes
│   │   │   ├── dashboard.md
│   │   │   ├── reading.md
│   │   │   ├── achievements.md
│   │   │   ├── shop.md
│   │   │   ├── progress.md
│   │   │   └── profile.md
│   │   ├── api-contract.md           # API endpoints
│   │   ├── mock-data-schema.md       # TypeScript interfaces
│   │   ├── component-specifications.md
│   │   ├── pet-evolution-system.md   # Tamagotchi pet system
│   │   ├── audio-sync-architecture.md
│   │   └── implementation-strategy.md
│   │
│   ├── CLAUDE.md                     # ✅ Root orchestration guide
│   ├── ORGANIZATION.md               # ✅ This file
│   ├── README.md                     # Project README
│   └── .claude/                      # Claude Code commands
│       └── commands/
│           ├── generate-prp.md
│           ├── execute-prp.md
│           └── recover-context.md
│
└── 📦 ARCHIVED (OLD VERSIONS - DO NOT MODIFY)
    ├── reading_webapp_v1_ARCHIVED/   # ❌ v1 Frontend (archived on 2025-10-14)
    ├── children_game_ARCHIVED/       # ❌ Old version
    └── example_projects_ARCHIVED/    # ❌ Reference examples
```

---

## 🎯 Key Identification: v1 vs v2

### ✅ V2 (Tamagotchi/Gamified) - WHAT WE'RE BUILDING

**Identifiers:**
- Tamagotchi-style virtual pet companion
- Pet evolution system (Knowledge, Coolness, Culture tracks)
- 7 pet emotions (happy, excited, curious, sleepy, sad, hungry, sick)
- Language blending slider (0-10 scale)
- Gamification: Achievements, quests, shop, XP/level system
- 6 pages: Dashboard, Reading, Achievements, Shop, Progress, Profile
- React Router multi-page navigation
- Azure OpenAI integration (gpt-5-pro, FLUX-1.1-pro)

**Location:** `/frontend` (package.json shows v2.0.0)

**Documentation:** All files in `/docs/` and `/PRPs/` are for v2

### ❌ V1 (Simple) - ARCHIVED

**Identifiers:**
- Simple reading comprehension
- No pet system
- No gamification
- Single-page application

**Location:** `/reading_webapp_v1_ARCHIVED` (package.json shows v0.0.0)

**Status:** Archived on 2025-10-14 - DO NOT MODIFY

---

## 🚀 Development Workflow

### Step 1: Read Context Files

```bash
# Root project context
Read: /Users/joromini/Documents/pyprojects/crewai/gitclone/renzo/reading_app/CLAUDE.md

# Frontend development guide
Read: /Users/joromini/Documents/pyprojects/crewai/gitclone/renzo/reading_app/frontend/CLAUDE.md

# Organization overview (this file)
Read: /Users/joromini/Documents/pyprojects/crewai/gitclone/renzo/reading_app/ORGANIZATION.md
```

### Step 2: Choose a PRP

```bash
# View available PRPs
Read: /Users/joromini/Documents/pyprojects/crewai/gitclone/renzo/reading_app/PRPs/frontend/README.md

# View specific PRP
Read: /Users/joromini/Documents/pyprojects/crewai/gitclone/renzo/reading_app/PRPs/frontend/phase1-project-setup.md
```

### Step 3: Execute PRP

```bash
# Generate a new PRP from wireframe
/generate-prp docs/wireframes/dashboard.md

# Execute a PRP
/execute-prp PRPs/frontend/phase1-project-setup.md
```

### Step 4: Development Commands

```bash
# Navigate to frontend
cd /Users/joromini/Documents/pyprojects/crewai/gitclone/renzo/reading_app/frontend

# Install dependencies
npm install

# Start dev server (port 5173, or auto-increment if busy)
npm run dev

# Type checking
npm run type-check

# Linting
npm run lint

# Build
npm run build
```

---

## 🎨 Design References

### Wireframes (All v2)

- **Dashboard**: `/docs/wireframes/dashboard.md`
- **Reading Page**: `/docs/wireframes/reading.md`
- **Achievements**: `/docs/wireframes/achievements.md`
- **Shop**: `/docs/wireframes/shop.md`
- **Progress**: `/docs/wireframes/progress.md`
- **Profile**: `/docs/wireframes/profile.md`

### Architecture Documentation (All v2)

- **Complete Spec**: `/docs/v2-architecture.md`
- **API Contract**: `/docs/api-contract.md`
- **Pet Evolution**: `/docs/pet-evolution-system.md`
- **Component Specs**: `/docs/component-specifications.md`
- **Mock Data**: `/docs/mock-data-schema.md`

---

## 🚨 CRITICAL RULES

1. **NEVER modify archived directories**
   - `reading_webapp_v1_ARCHIVED/`
   - `children_game_ARCHIVED/`
   - `example_projects_ARCHIVED/`

2. **ALWAYS work in `/frontend` for frontend development**
   - This is v2.0.0 (the Tamagotchi/gamified version)

3. **ALWAYS reference `/docs/` for v2 specifications**
   - All wireframes are v2
   - All architecture docs are v2

4. **ALWAYS use PRPs for structured development**
   - Generate: `/generate-prp <wireframe-path>`
   - Execute: `/execute-prp <prp-path>`

5. **NEVER confuse v1 and v2**
   - v2 = Tamagotchi + Gamification + Multi-language
   - v1 = Simple reading (archived)

---

## 📊 Development Status

### Phase 1: Foundation
- [ ] Project setup (PRP available)
- [ ] Component library (PRP available)
- [ ] Theme system (not started)
- [ ] Navigation (not started)

### Phase 2: Core Pages
- [ ] Dashboard (wireframe available)
- [ ] Reading page (wireframe available)
- [ ] Language blending (not started)
- [ ] Speech-to-text (not started)

### Phase 3-8: Future Phases
- See `/docs/implementation-strategy.md` for full roadmap

---

## 🔗 Quick Links

| Resource | Path |
|----------|------|
| Root Guide | `/CLAUDE.md` |
| Frontend Guide | `/frontend/CLAUDE.md` |
| Backend Guide | `/backend/CLAUDE.md` |
| Frontend PRPs | `/PRPs/frontend/` |
| Wireframes | `/docs/wireframes/` |
| Architecture | `/docs/v2-architecture.md` |

---

## 🎯 Next Steps

1. ✅ Organization complete
2. ✅ v1 frontend archived
3. ✅ v2 frontend confirmed active
4. → Execute first PRP: `/execute-prp PRPs/frontend/phase1-project-setup.md`
5. → Follow PRP workflow: Implement → Test → Validate → Commit

---

**Status**: ✅ Organization Complete
**Active Version**: v2 (Tamagotchi/Gamified)
**Active Directory**: `/frontend`
**Last Updated**: 2025-10-14
