# Backend Development Guide - Reading App V2

This file provides backend-specific guidance for Claude Code when working on the backend API.

**Version**: 2.0
**Last Updated**: 2025-10-11
**Status**: POST-MVP - Backend integration starts in Phase 7

---

## ⚠️ IMPORTANT: Backend is POST-MVP

**Backend development starts AFTER frontend MVP is complete.**

The frontend uses localStorage for all persistence during MVP development. Backend integration happens in **Phase 7 (Weeks 13-15)**.

---

## 🚀 Quick Start for Development

### Context Recovery (After Session Reset)

**If starting a new backend session**:

```bash
# 1. Read root CLAUDE.md for project context
Read: /Users/joromini/Documents/pyprojects/crewai/gitclone/renzo/reading_app/CLAUDE.md

# 2. Read this backend CLAUDE.md
Read: /Users/joromini/Documents/pyprojects/crewai/gitclone/renzo/reading_app/backend/CLAUDE.md

# 3. Read API contract
Read: /Users/joromini/Documents/pyprojects/crewai/gitclone/renzo/reading_app/docs/api-contract.md

# 4. Identify current PRP
Read: /Users/joromini/Documents/pyprojects/crewai/gitclone/renzo/reading_app/PRPs/backend/README.md

# 5. Execute current PRP
/execute-prp PRPs/backend/<current-feature>.md
```

---

## 📁 Backend Directory Structure

```
backend/
├── CLAUDE.md                     # This file
├── src/
│   ├── routes/
│   │   ├── users.ts
│   │   ├── pets.ts
│   │   ├── content.ts
│   │   ├── achievements.ts
│   │   ├── quests.ts
│   │   └── shop.ts
│   ├── controllers/
│   │   ├── userController.ts
│   │   ├── petController.ts
│   │   ├── contentController.ts
│   │   ├── achievementController.ts
│   │   ├── questController.ts
│   │   └── shopController.ts
│   ├── services/
│   │   ├── azureOpenAI.ts
│   │   ├── userService.ts
│   │   ├── petService.ts
│   │   ├── contentService.ts
│   │   ├── achievementService.ts
│   │   └── questService.ts
│   ├── models/
│   │   ├── User.ts
│   │   ├── Pet.ts
│   │   ├── Achievement.ts
│   │   ├── Quest.ts
│   │   └── Story.ts
│   ├── middleware/
│   │   ├── auth.ts
│   │   ├── validation.ts
│   │   ├── errorHandler.ts
│   │   └── rateLimiter.ts
│   ├── utils/
│   │   ├── xpCalculations.ts
│   │   ├── petBehavior.ts
│   │   └── validators.ts
│   ├── types/
│   │   ├── user.ts
│   │   ├── pet.ts
│   │   ├── achievement.ts
│   │   └── api.ts
│   ├── app.ts
│   └── server.ts
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── package.json
├── tsconfig.json
└── .env.example
```

---

## ⚙️ Development Commands

### Core Development Tasks

```bash
# Start dev server (port 8080)
npm run dev

# Run tests
npm test

# Test coverage report
npm run test:coverage

# Type checking
npm run type-check

# Linting
npm run lint

# Database migrations
npm run migrate

# Seed database
npm run seed

# Build for production
npm run build

# Start production server
npm start
```

### Setup (First Time)

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Run database migrations
npm run migrate

# Seed initial data (optional)
npm run seed

# Start development server
npm run dev
```

### Quality Assurance Workflow

```bash
# Before committing - run full quality check
npm run lint && npm run type-check && npm test

# After API endpoint implementation - sub-agent review (MANDATORY)
/agents code-reviewer "Review {endpoint} API for security, error handling, and RESTful best practices"

# After security changes - comprehensive audit
/agents security-auditor "Security audit for backend API"
```

---

## 🏗️ Architecture Patterns

### API Structure

**Layered Architecture**:

1. **Routes** (`src/routes/`)
   - Define API endpoints
   - Map HTTP methods to controllers
   - Apply middleware (auth, validation)

2. **Controllers** (`src/controllers/`)
   - Handle HTTP requests/responses
   - Validate input
   - Call service layer

3. **Services** (`src/services/`)
   - Business logic
   - Database operations
   - External API calls

4. **Models** (`src/models/`)
   - Data structures
   - Database schema definitions

5. **Middleware** (`src/middleware/`)
   - Authentication
   - Validation
   - Error handling
   - Rate limiting

### Naming Conventions

- **Routes**: RESTful naming (`/api/v1/users`, `/api/v1/pets`)
- **Controllers**: `{resource}Controller.ts` (e.g., `userController.ts`)
- **Services**: `{resource}Service.ts` (e.g., `storyGenerationService.ts`)
- **Models**: `{Resource}.ts` (e.g., `User.ts`, `Pet.ts`)

---

## 🔄 PRP Execution Guidelines

**📖 See `.claude/SHARED-PATTERNS.md` for complete PRP workflow**

### Backend-Specific Guidelines

**Before**: Read API contract, verify database running, check environment vars, create branch
**During**: Update todos, test endpoints (Postman/curl), use sub-agents, write tests
**After**: Full test suite, sub-agent security review, update API docs, merge

---

## 🛡️ Mandatory Sub-Agent Validation

**📖 See `.claude/SHARED-PATTERNS.md` for complete validation patterns and commands**

### Backend-Specific Validation Points

**After API endpoint**: Security, error handling, RESTful practices, performance, docs
**After database changes**: SQL injection prevention, indexing, query optimization
**After security features**: Auth, authorization, data validation, rate limiting, COPPA
**After external integrations**: Error handling, cost management, retry logic, API key security

---

## 🧪 Testing Requirements

### Unit Tests (Required)

**Test all**:
- Service functions
- Utility functions
- Business logic

**Example**:
```typescript
// userService.test.ts
describe('UserService', () => {
  it('creates user with hashed password', async () => {
    const user = await userService.createUser({
      email: 'test@example.com',
      password: 'password123'
    });
    expect(user.password).not.toBe('password123');
    expect(await bcrypt.compare('password123', user.password)).toBe(true);
  });
});
```

### Integration Tests (Required)

**Test API endpoints**:
```typescript
// users.test.ts
describe('POST /api/v1/users', () => {
  it('creates new user successfully', async () => {
    const response = await request(app)
      .post('/api/v1/users')
      .send({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User'
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.email).toBe('test@example.com');
  });
});
```

### Load Tests (Optional)

For expensive endpoints (story generation, audio generation)

---

## 🛠️ Technology Stack

### Core

- **Node.js**: 20.x
- **TypeScript**: 5.7
- **Express**: 4.x

### Database

- **PostgreSQL**: 16 (production)
- **Prisma ORM**: Database abstraction layer

### Authentication

- **JWT** (jsonwebtoken): Token-based auth
- **bcrypt**: Password hashing

### AI Integration

- **Azure OpenAI SDK**: Story/quiz generation
- **FLUX-1.1-pro API**: Pet art generation

### Testing

- **Jest**: Test runner
- **Supertest**: API testing

---

## 🔒 API Design Principles

### RESTful Standards

- **GET**: Retrieve resources
- **POST**: Create resources
- **PATCH**: Partial update
- **DELETE**: Remove resources
- **PUT**: Full replacement (avoid for MVP)

### Response Format

**Success**:
```json
{
  "success": true,
  "data": { ... },
  "timestamp": 1696284000000
}
```

**Error**:
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Human-readable message",
    "details": { ... }
  },
  "timestamp": 1696284000000
}
```

### Pagination

```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 145,
    "totalPages": 8
  }
}
```

---

## 🔐 Security Guidelines

### Authentication

- JWT tokens with 1-hour expiration
- Refresh tokens with 7-day expiration
- Secure httpOnly cookies for tokens

### Authorization

- Role-based access control (RBAC)
- Resource ownership validation
- API rate limiting (per user, per IP)

### Data Validation

- Joi schema validation on all inputs
- SQL injection prevention (use ORM)
- XSS prevention (sanitize inputs)

### Secrets Management

- Environment variables for API keys
- Never commit secrets to git
- Use Azure Key Vault (production)

---

## 🗄️ Database Guidelines

### Schema Design

- Use migrations for all schema changes
- Foreign key constraints
- Indexes on frequently queried fields
- Timestamp fields (createdAt, updatedAt)

### Query Optimization

- Use Prisma query optimization
- Avoid N+1 queries (use `include`)
- Pagination for large result sets
- Database connection pooling

---

## 🚨 Error Handling

### Error Types

```typescript
class AppError extends Error {
  statusCode: number;
  code: string;
  details?: any;

  constructor(message: string, statusCode: number, code: string, details?: any) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}
```

### Common Error Codes

- `VALIDATION_ERROR` (400)
- `UNAUTHORIZED` (401)
- `FORBIDDEN` (403)
- `NOT_FOUND` (404)
- `RATE_LIMIT_EXCEEDED` (429)
- `INTERNAL_ERROR` (500)

---

## 📚 Available PRPs for Execution

### Phase 1: Foundation (POST-MVP)

- [ ] `project-setup.md` - Express + TypeScript setup
- [ ] `database-setup.md` - PostgreSQL + Prisma ORM
- [ ] `middleware.md` - Auth, validation, error handling

### Phase 2: Core APIs

- [ ] `user-endpoints.md` - User CRUD, profile, settings
- [ ] `pet-endpoints.md` - Pet state, feed, play, boost
- [ ] `content-generation.md` - Story/quiz generation

### Phase 3: Gamification APIs

- [ ] `achievement-endpoints.md` - Achievements, progress
- [ ] `quest-endpoints.md` - Daily/weekly quests, rewards
- [ ] `shop-endpoints.md` - Shop items, purchases, inventory

### Phase 4: Analytics & Progress

- [ ] `progress-endpoints.md` - Analytics, history
- [ ] `leaderboard.md` - User rankings (optional)

### Phase 5: Advanced Features

- [ ] `audio-generation.md` - TTS with word timings (BONUS)
- [ ] `caching.md` - Redis caching for performance

**See**: `PRPs/backend/README.md` for full list and status tracking

---

## 📊 Development Progress Tracking

**📖 See `.claude/SHARED-PATTERNS.md` for complete TodoWrite usage patterns**

### Quick Reference

- ✅ Create todos at start of PRP execution
- ✅ ONE task `in_progress` at a time
- ✅ Mark `completed` immediately after finishing
- ✅ Update at each PRP step

---

## 🔗 Related Documentation

**Root Project Guide**:
- `/reading_app/CLAUDE.md` - Root orchestration, project overview

**Planning Documents**:
- `docs/api-contract.md` - 17 REST endpoints specification
- `docs/mock-data-schema.md` - TypeScript interfaces
- `docs/implementation-strategy.md` - Full implementation approach

**Frontend Guide**:
- `frontend/CLAUDE.md` - Frontend development guide

---

## 🎯 Next Steps

### When Starting Backend Development (Phase 7)

1. **Frontend MVP must be complete** first
2. **Read root CLAUDE.md** for project context
3. **Read this backend CLAUDE.md** (done)
4. **Read API contract**: `docs/api-contract.md`
5. **Execute first PRP**: `/execute-prp PRPs/backend/project-setup.md`
6. **Follow PRP workflow**: Implement → Test → Validate → Complete

---

**Backend CLAUDE.md Status**: ✅ Complete
**Backend Status**: Not started - Waiting for frontend MVP completion
**Next Step**: Complete frontend MVP, then execute Phase 7 backend PRPs
