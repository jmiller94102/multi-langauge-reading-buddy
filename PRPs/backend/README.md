# Backend PRPs

This directory contains Product Requirement Prompts (PRPs) for backend development tasks.

## What is a PRP?

A PRP is a detailed implementation guide for a specific feature, containing:
- Step-by-step implementation instructions
- Code examples and file paths
- Validation checkpoints with sub-agent commands
- Quality gates (testing, security, performance)

## How to Use PRPs

### Generate a PRP
```bash
/generate-prp docs/api-contract.md
```

### Execute a PRP
```bash
/execute-prp PRPs/backend/user-endpoints.md
```

## Available PRPs

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

## Important Notes

**Backend development starts AFTER frontend MVP is complete.**

The frontend will use localStorage for all persistence during MVP development. Backend integration happens in Phase 7 (Weeks 13-15).

## PRP Status Tracking

Mark PRPs as completed by checking the box in this README.

**Current PRP**: _None (backend not started - frontend MVP first)_
**Last Updated**: 2025-10-11
