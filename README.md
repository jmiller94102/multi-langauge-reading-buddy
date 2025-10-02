# Multilingual Reading Webapp for Children

A progressive language learning application designed for children (grades 3-6) that helps them practice reading comprehension while gradually learning Korean.

## 🚀 Project Structure

```
reading_app/
├── reading_webapp/           # 🟢 ACTIVE Frontend (React + TypeScript + Vite)
│   ├── src/                 # Source code
│   ├── public/              # Static assets
│   └── package.json         # Frontend dependencies
│
├── backend/                  # 🟢 ACTIVE Backend API (Node.js + Express)
│   ├── src/                 # Backend source code
│   ├── tests/               # Backend tests
│   └── package.json         # Backend dependencies
│
├── docs/                     # 📚 Documentation
│   ├── PRPs/                # Project Requirement Plans
│   ├── requirements/        # Requirements documents
│   │   ├── product_requirements_document.md
│   │   └── MODULE_TASKS.md
│   ├── learnings/           # Project learnings and debugging notes
│   └── project_requirements/
│
├── children_game_ARCHIVED/   # ⚠️ ARCHIVED - Old prototype (DO NOT USE)
├── example_projects_ARCHIVED/# ⚠️ ARCHIVED - Reference examples (DO NOT MODIFY)
│
├── CLAUDE.md                 # Claude Code AI assistant instructions
├── .env                      # Environment variables (DO NOT COMMIT)
├── .env.example             # Example environment template
└── .gitignore               # Git ignore rules
```

## 🎯 Quick Start

### Prerequisites
- Node.js (v18+)
- npm or yarn
- Azure OpenAI API key (or other LLM provider)

### Frontend Development
```bash
cd reading_webapp
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

- **Progressive Language Learning**: 10-level slider from 100% English to 100% Korean
- **AI-Generated Content**: Dynamic reading passages tailored to grade level
- **Interactive Quizzes**: Multiple choice and fill-in-the-blank questions
- **Custom Vocabulary Integration**: Prioritizes user-specified vocabulary words
- **Audio Support**: Text-to-speech for pronunciation practice
- **Romanization Overlay**: Shows Korean pronunciation for learners
- **Progress Tracking**: Points, achievements, and learning analytics

## 📁 Important Directories

### Active Development
- `reading_webapp/` - Main frontend application
- `backend/` - API server and content generation

### Documentation
- `docs/requirements/` - Product requirements and specifications
- `docs/PRPs/` - Detailed project requirement plans
- `docs/learnings/` - Important debugging lessons and solutions

### Archived (DO NOT MODIFY)
- `children_game_ARCHIVED/` - Old frontend prototype
- `example_projects_ARCHIVED/` - Reference implementations

## 🛠️ Development Commands

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run linter
- `npm run type-check` - TypeScript checking

### Backend
- `npm start` - Start server
- `npm run dev` - Start with hot reload
- `npm test` - Run tests

## 🔑 Environment Variables

Copy `.env.example` to `.env` and configure:

```env
# Azure OpenAI Configuration
VITE_AZURE_OPENAI_API_KEY=your-key
VITE_AZURE_OPENAI_ENDPOINT=your-endpoint
VITE_AZURE_OPENAI_DEPLOYMENT_NAME=your-deployment

# Backend
OPENAI_API_KEY=your-key
```

## 🚨 Important Notes

1. **Active Projects**: Only modify files in `reading_webapp/` and `backend/`
2. **Archived Folders**: Do not modify `*_ARCHIVED` directories
3. **Environment Files**: Never commit `.env` files
4. **Claude Instructions**: See `CLAUDE.md` for AI assistant guidelines

## 📚 Additional Resources

- [Product Requirements](docs/requirements/product_requirements_document.md)
- [Azure OpenAI Integration Guide](docs/learnings/azure-openai-integration.md)
- [React Debugging Guide](docs/learnings/react-white-screen-debugging.md)

## 🤝 Contributing

Please ensure all changes pass:
1. Linting: `npm run lint`
2. Type checking: `npm run type-check`
3. Tests: `npm test`

---

Last Updated: 2025-09-29