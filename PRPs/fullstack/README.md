# Full-Stack PRPs

This directory contains Product Requirement Prompts (PRPs) for features that span both frontend and backend.

## What is a PRP?

A PRP is a detailed implementation guide for a specific feature, containing:
- Step-by-step implementation instructions for both frontend and backend
- Integration points between frontend and backend
- Code examples and file paths
- Validation checkpoints with sub-agent commands
- Quality gates (testing, security, performance, integration)

## How to Use PRPs

### Generate a PRP
```bash
/generate-prp docs/audio-sync-architecture.md
```

### Execute a PRP
```bash
/execute-prp PRPs/fullstack/azure-openai-integration.md
```

## Available PRPs

### Phase 2: Core Features
- [ ] `azure-openai-integration.md` - Story/quiz generation with gpt-5-pro
- [ ] `pet-art-generation.md` - Pet image generation with FLUX-1.1-pro

### Phase 7: Backend Integration (POST-MVP)
- [ ] `authentication-system.md` - JWT auth, user registration/login
- [ ] `offline-sync-implementation.md` - Sync localStorage to backend API
- [ ] `migration-strategy.md` - Migrate from localStorage to API

### Phase 8: S2.dev Integration (Classroom & Branching)
- [ ] `s2-live-classroom-monitoring.md` - **KILLER FEATURE** Real-time teacher dashboard ($90k/year)
- [ ] `s2-branching-stories.md` - Choose-your-own-adventure with story branches
- [ ] `s2-analytics-dashboard.md` - Reading session tracking (OPTIONAL - only if needed)

### Phase 8: BONUS
- [ ] `audio-generation.md` - TTS with forced alignment for word timings

### DevOps & Deployment
- [ ] `deployment-pipeline.md` - CI/CD, hosting, monitoring
- [ ] `environment-setup.md` - Dev, staging, production environments

## Important Notes

**Full-stack PRPs involve coordination between frontend and backend.**

For MVP, only the Azure integration PRPs are needed (story generation, pet art generation). These will be called from the frontend only.

Backend integration PRPs are for Phase 7 (POST-MVP).

## PRP Status Tracking

Mark PRPs as completed by checking the box in this README.

**Current PRP**: _None (not started)_
**Last Updated**: 2025-10-23

## 🔗 PRP Dependencies

**S2.dev Integration PRPs** (Phase 8):
- `s2-live-classroom-monitoring.md` → **START HERE** (killer feature, $90k/year revenue)
- `s2-branching-stories.md` → Independent (can build in parallel or after classroom)
- `s2-analytics-dashboard.md` → OPTIONAL (only if classroom monitoring isn't enough)

**Recommended Order**: 
1. Classroom Monitoring (3 weeks) - Highest ROI
2. Branching Stories (2 weeks) - High engagement
3. Analytics Dashboard (skip unless needed) - Complex, uncertain value
