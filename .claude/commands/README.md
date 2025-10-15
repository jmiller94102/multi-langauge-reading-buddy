# Claude Code Commands - PRP Workflow

This directory contains custom Claude Code slash commands for the PRP (Product Requirement Prompt) workflow.

## Available Commands

### `/generate-prp <planning-doc-path>`

**Purpose**: Generate a PRP from a planning document

**Usage**:
```bash
/generate-prp docs/wireframes/dashboard.md
```

**Expected Behavior**:
1. Reads the specified planning document
2. Analyzes the feature requirements
3. Breaks down into implementation steps
4. Generates a complete PRP with:
   - Step-by-step instructions
   - Code examples
   - Validation checkpoints
   - Quality gates
5. Saves PRP to appropriate directory:
   - Frontend features → `PRPs/frontend/`
   - Backend features → `PRPs/backend/`
   - Full-stack features → `PRPs/fullstack/`

**Output Example**:
```
Generated PRP: PRPs/frontend/dashboard-implementation.md
```

---

### `/execute-prp <prp-path>`

**Purpose**: Execute a PRP step-by-step with validation

**Usage**:
```bash
/execute-prp PRPs/frontend/dashboard-implementation.md
```

**Expected Behavior**:
1. Reads the PRP file
2. Creates todo list from PRP steps
3. Executes steps sequentially:
   - Implements code
   - Runs tests
   - Executes sub-agent validation
   - Marks todo complete
4. Proceeds to next step only after passing validation
5. Marks PRP complete when all steps done

**Workflow**:
```
Read PRP
   ↓
Create Todo List
   ↓
For Each Step:
   ├─ Implement Feature
   ├─ Run Tests
   ├─ Sub-Agent Validation (MANDATORY)
   ├─ Pass Quality Gates
   └─ Mark Complete
   ↓
PRP Complete
```

---

## PRP Structure

A valid PRP file must contain:

### 1. Header
```markdown
# PRP: {Feature Name}

## Overview
- Feature description
- Dependencies
- Estimated time

## Prerequisites
- Required planning docs
- Required components/services
- Environment setup
```

### 2. Implementation Steps
```markdown
## Implementation Steps

### Step 1: {Task Name}
**What**: Description of what to build
**Why**: Reasoning behind approach
**How**: Detailed instructions

**Files to Create/Modify**:
- `path/to/file.ts`

**Code**:
```typescript
// Implementation code
```

**Validation**:
```bash
# Test command
npm test -- ComponentName.test.ts

# Sub-agent validation
/agents code-reviewer "Review ComponentName for {specific concerns}"
```
```

### 3. Quality Gates
```markdown
## Quality Gates

### Gate 1: Unit Tests
- [ ] All tests passing
- [ ] Coverage >80%

### Gate 2: Sub-Agent Review
- [ ] Code quality validated
- [ ] Security checked
- [ ] Performance acceptable

### Gate 3: Integration Test
- [ ] Feature works end-to-end
- [ ] No regressions
```

### 4. Completion Checklist
```markdown
## Completion Checklist
- [ ] All steps completed
- [ ] All quality gates passed
- [ ] Documentation updated
- [ ] PRP marked complete in todo list
```

---

## Implementation Notes

**Note**: These commands are conceptual descriptions of the expected workflow. Actual implementation may require:

1. **Custom Claude Code Extensions**: Integration with Claude Code's command system
2. **File System Operations**: Reading/writing PRPs, parsing markdown
3. **Todo List Integration**: Automatic todo creation and updates
4. **Sub-Agent Orchestration**: Calling sub-agents at validation points
5. **Progress Tracking**: Maintaining state across steps

**Alternative Approach** (if commands not available):
- Manually generate PRPs using planning docs as templates
- Execute PRPs by reading them and following steps manually
- Use todo list manually to track progress
- Call sub-agents explicitly at validation points

---

## Directory Structure

```
.claude/commands/
├── README.md                 # This file
├── generate-prp.md           # Command definition (future)
└── execute-prp.md            # Command definition (future)
```

---

## Example PRP

See `PRPs/frontend/README.md` for a full list of available PRPs.

**Example PRP Structure**:
```
PRPs/frontend/dashboard-implementation.md

# PRP: Dashboard Page Implementation

## Overview
Implement the Dashboard page with virtual pet, quests, and stats.

## Implementation Steps

### Step 1: Create Page Component
**What**: Create Dashboard page component structure
**How**: Use React.FC pattern with TypeScript
**Validation**: Test rendering, sub-agent review

### Step 2: Add VirtualPet Widget
**What**: Integrate VirtualPet component
**How**: Connect to PetContext, implement interactions
**Validation**: Test pet display, emotions, sub-agent review

### Step 3: Implement QuestList
**What**: Display daily and weekly quests
**How**: Connect to QuestContext, add claim functionality
**Validation**: Test quest progression, sub-agent review

## Quality Gates
- [ ] All components tested
- [ ] Sub-agent validation passed
- [ ] Accessibility checked

## Completion Checklist
- [ ] Dashboard page complete
- [ ] All tests passing
- [ ] Documentation updated
```

---

**Status**: Commands documented, awaiting implementation
**Next Step**: Use `/generate-prp` when ready to create first PRP
