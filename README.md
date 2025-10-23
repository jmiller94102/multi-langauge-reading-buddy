# Reading Quest - Multilingual Reading App for Children

A gamified progressive language learning application designed for children (grades 3-6) that helps them practice reading comprehension while learning Korean or Mandarin Chinese through AI-generated stories.

## 🚀 Project Structure

```
reading_app/
├── frontend/                  # 🟢 ACTIVE Frontend (React + TypeScript + Vite)
│   ├── src/                  # Source code
│   │   ├── components/       # React components
│   │   ├── pages/           # Page components (5 pages)
│   │   ├── contexts/        # React Context providers
│   │   ├── services/        # API and business logic services
│   │   ├── hooks/           # Custom React hooks
│   │   ├── types/           # TypeScript type definitions
│   │   └── utils/           # Utility functions
│   ├── public/              # Static assets
│   └── package.json         # Frontend dependencies
│
├── backend/                  # 🟢 ACTIVE Backend API (Node.js + Express)
│   ├── src/                 # Backend source code
│   ├── tests/               # Backend tests
│   └── package.json         # Backend dependencies
│
├── docs/                     # 📚 Documentation
│   ├── wireframes/          # Page wireframes and specifications
│   ├── requirements/        # Product requirements documents
│   ├── learnings/           # Important debugging lessons
│   └── PRPs/                # Project Requirement Plans
│
├── PRPs/                     # PRP execution guides
│   ├── frontend/            # Frontend PRPs
│   ├── backend/             # Backend PRPs
│   └── fullstack/           # Full-stack PRPs
│
├── .claude/                  # Claude Code AI configuration
│   ├── commands/            # Custom slash commands
│   └── SHARED-PATTERNS.md   # Development patterns
│
├── children_game_ARCHIVED/   # ⚠️ ARCHIVED - Old prototype (DO NOT USE)
├── reading_webapp_v1_ARCHIVED/# ⚠️ ARCHIVED - Previous version
├── example_projects_ARCHIVED/# ⚠️ ARCHIVED - Reference examples
│
├── CLAUDE.md                 # Root AI assistant orchestration file
├── .env                      # Environment variables (DO NOT COMMIT)
├── .env.example             # Example environment template
└── .gitignore               # Git ignore rules
```

## 🎯 Quick Start

### Prerequisites
- Node.js (v18+)
- npm or yarn
- Azure OpenAI API key (gpt-4o for stories/quizzes)
- Azure TTS API key (optional, for audio features)

### Frontend Development
```bash
cd frontend
npm install
npm run dev
# Opens at http://localhost:5173
```

### Backend Development
```bash
cd backend
npm install
npm start
# Runs at http://localhost:8080
```

## 🌟 Key Features

### Core Functionality
- **Progressive Language Learning**: 10-level slider from 100% English to 100% Korean/Mandarin
- **AI-Generated Stories**: Dynamic reading passages tailored to grade level and interests
- **Interactive Quizzes**: Multiple choice questions with combo bonuses
- **Audio Reading**: Text-to-speech with synchronized word highlighting
- **Story Library**: Save and load favorite stories with IndexedDB persistence
- **Voice Input**: Dictate story prompts using speech recognition

### Gamification System
- **Virtual Pet Companion**: Tamagotchi-style learning buddy with 7 emotions
- **Pet Evolution Tracks**: Knowledge, Coolness, or Culture paths (21 total forms)
- **XP & Level System**: Progress tracking with level-based rewards
- **Daily & Weekly Quests**: Structured learning goals
- **Achievement Badges**: 30+ unlockable achievements
- **Shop System**: Spend coins on pet food, boosts, and customization

### Language Features
- **Blend Level System**: Progressive sentence mixing (10 levels)
- **Translation Hints**: Inline tooltips with romanization
- **Word-by-Word Audio**: Click words to hear pronunciation
- **Romanization Toggle**: Hangul/Pinyin support for learners

### Pages (5 Total)
1. **Dashboard**: Quests, streak bonus, pet widget
2. **Reading**: Story generation, library, settings
3. **Achievements**: Badges, progress stats, pet evolution
4. **Shop**: Food items, boosts, pet customization
5. **Profile**: User settings, language preferences

## 📁 Important Directories

### Active Development
- `frontend/` - React application with TypeScript
- `backend/` - Express API server with Azure OpenAI integration

### Documentation
- `docs/v2-architecture.md` - Complete technical specification
- `docs/wireframes/` - All page designs and layouts
- `docs/api-contract.md` - Backend API endpoints
- `docs/learnings/` - Debugging guides and solutions
- `CLAUDE.md` - Root orchestration file for Claude Code

### Archived (DO NOT MODIFY)
- `*_ARCHIVED/` directories - Historical references only

## 🛠️ Development Commands

### Frontend
```bash
npm run dev         # Start dev server (http://localhost:5173)
npm run build       # Build for production
npm run preview     # Preview production build
npm run lint        # Run ESLint
npm run type-check  # TypeScript checking
npm test            # Run tests
```

### Backend
```bash
npm start           # Start server (http://localhost:8080)
npm run dev         # Start with hot reload
npm test            # Run tests
```

## 🔑 Environment Variables

Copy `.env.example` to `.env` and configure:

```env
# Azure OpenAI Configuration (Backend)
AZURE_OPENAI_API_KEY=your-api-key
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com
AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4o
AZURE_OPENAI_API_VERSION=2024-08-01-preview

# Azure Text-to-Speech (Backend)
AZURE_TTS_API_KEY=your-tts-key
AZURE_TTS_REGION=eastus

# Frontend (for direct Azure calls if needed)
VITE_AZURE_OPENAI_API_KEY=your-key
VITE_AZURE_OPENAI_ENDPOINT=your-endpoint
VITE_AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4o
```

## 🎮 Current Features Status

✅ **Completed**:
- Story generation with blend level system
- Quiz generation and completion flow
- Virtual pet system with emotions
- Pet evolution system (3 tracks, 7 stages each)
- Achievement system (30+ badges)
- Quest system (daily/weekly)
- Shop system (food, boosts)
- XP/level/coins/gems progression
- Audio reading with word highlighting
- Story library with save/load/delete
- Voice input for story prompts
- Dashboard, Reading, Achievements, Shop, Profile pages
- Backend API with full-stack integration
- React Context state management
- IndexedDB persistence

🚧 **In Progress**:
- Additional pet customization options
- More achievement types
- Expanded shop items

📋 **Planned**:
- Multi-user support with authentication
- Social features (leaderboards, sharing)
- Parent dashboard for progress monitoring
- Additional language support (Spanish, French)

## 🚨 Important Notes

1. **Active Projects**: Only modify files in `frontend/` and `backend/`
2. **Archived Folders**: Do not modify `*_ARCHIVED` directories
3. **Environment Files**: Never commit `.env` files with real API keys
4. **Claude Instructions**: See `CLAUDE.md` for AI assistant development guidelines
5. **Context Recovery**: Use `/recover-context` command after session resets

## 📚 Documentation Resources

### Architecture & Design
- [Complete Architecture Spec](docs/v2-architecture.md)
- [Component Specifications](docs/component-specifications.md)
- [Pet Evolution System](docs/pet-evolution-system.md)
- [Audio Sync Architecture](docs/audio-sync-architecture.md)

### Wireframes
- [Dashboard Wireframe](docs/wireframes/dashboard.md)
- [Reading Page Wireframe](docs/wireframes/reading.md)
- [Achievements Wireframe](docs/wireframes/achievements.md)
- [Shop Wireframe](docs/wireframes/shop.md)
- [Profile Wireframe](docs/wireframes/profile.md)

### Development Guides
- [Azure OpenAI Integration](docs/learnings/azure-openai-integration.md)
- [React White Screen Debugging](docs/learnings/react-white-screen-debugging.md)
- [TTS Implementation](docs/learnings/TTS_SIMPLIFIED_IMPLEMENTATION.md)

### AI Assistant Guides
- [Root CLAUDE.md](CLAUDE.md) - Project orchestration
- [Frontend CLAUDE.md](frontend/CLAUDE.md) - Frontend development
- [Backend CLAUDE.md](backend/CLAUDE.md) - Backend development
- [Shared Patterns](.claude/SHARED-PATTERNS.md) - Common workflows

## 🤝 Contributing

Please ensure all changes pass:
1. Linting: `npm run lint`
2. Type checking: `npm run type-check`
3. Tests: `npm test`
4. Build: `npm run build`

Use `/agents code-reviewer` for comprehensive code quality checks before committing.

## 📊 Project Stats

- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Node.js + Express + Azure OpenAI
- **Components**: 60+ React components
- **Pages**: 5 main pages (Dashboard, Reading, Achievements, Shop, Profile)
- **Pet Forms**: 21 evolution forms (3 tracks × 7 stages)
- **Achievements**: 30+ unlockable badges
- **Languages**: English, Korean, Mandarin Chinese

---

**Version**: 2.0
**Last Updated**: 2025-10-22
**Status**: Active Development

🤖 Built with [Claude Code](https://claude.com/claude-code)
