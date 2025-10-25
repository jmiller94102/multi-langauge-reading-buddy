# PRP: S2.dev Branching Stories - Choose-Your-Own-Adventure

**Feature**: Interactive branching story paths with S2.dev stream branching

**Domain**: Full-Stack (Frontend + Backend + S2.dev Integration)
**Phase**: 9 (Post-Analytics Enhancement)
**Estimated Time**: 2 weeks (80 hours)
**Complexity**: High
**Priority**: MEDIUM (Innovation feature, high engagement)

---

## 📋 Overview

Implement choose-your-own-adventure style stories where students make decisions that branch the narrative. Uses S2.dev's branching capabilities to:
- Create non-destructive story branches
- Allow students to explore alternate paths
- Compare outcomes of different choices
- Replay from any decision point

**Success Criteria**: 
- Students can make story decisions
- Each choice creates a new branch
- Students can switch between branches
- All paths preserved for replay
- AI generates contextual continuations

---

## 🎯 Prerequisites

### Knowledge Requirements
- S2.dev branching API (branch, merge)
- **Analytics Dashboard PRP completed** (reuses 80% of code)
- React state management for branching UI
- Azure OpenAI for branch generation
- Graph visualization (for branch tree)

### Environment Requirements
- S2.dev account with branching enabled
- Analytics Dashboard fully functional
- Azure OpenAI API access

### External Dependencies
```bash
# Frontend (in addition to analytics deps)
npm install react-flow-renderer dagre

# Backend (already installed from analytics)
# @s2-dev/client includes branching features
```

---

## 🏗️ Architecture Overview

### Branch Flow
```
Main Story Stream
    │
    ├─ Decision Point 1
    │   ├─ Choice A → Branch A Stream
    │   └─ Choice B → Branch B Stream
    │
    └─ Decision Point 2
        ├─ Choice C → Branch C Stream
        └─ Choice D → Branch D Stream
```

### Key Differences from Analytics
- **Analytics**: Linear event stream (append-only)
- **Branching**: Tree structure with multiple paths
- **Reuse**: Same S2Service, same event tracking, same UI patterns

---

## 🛠️ Implementation Steps

### Step 1: Extend S2Service with Branching Methods

**Update `backend/src/services/s2.service.js`**:
```javascript
class S2Service {
  // ... existing methods from analytics PRP ...

  /**
   * Create a branch from a decision point
   * @param {string} userId - Student user ID
   * @param {string} parentSessionId - Parent session ID
   * @param {string} decisionPointId - Event ID where branch occurs
   * @param {string} choice - Choice made (e.g., 'mountain', 'village')
   */
  async createBranch(userId, parentSessionId, decisionPointId, choice) {
    const parentStreamId = `student_${userId}_session_${parentSessionId}`;
    const branchSessionId = `${parentSessionId}_branch_${choice}_${Date.now()}`;
    const branchStreamId = `student_${userId}_session_${branchSessionId}`;

    try {
      // Create branch from decision point
      await this.client.branch(parentStreamId, {
        from: decisionPointId,
        to: branchStreamId,
        metadata: {
          choice,
          parentSessionId,
          createdAt: Date.now(),
        },
      });

      return { 
        success: true, 
        branchSessionId,
        branchStreamId 
      };
    } catch (error) {
      console.error('Error creating branch:', error);
      throw error;
    }
  }

  /**
   * List all branches for a session
   * @param {string} userId - Student user ID
   * @param {string} sessionId - Session ID
   */
  async listBranches(userId, sessionId) {
    const streamId = `student_${userId}_session_${sessionId}`;

    try {
      const branches = await this.client.listBranches(streamId);
      return branches;
    } catch (error) {
      console.error('Error listing branches:', error);
      throw error;
    }
  }

  /**
   * Get branch tree structure
   * @param {string} userId - Student user ID
   * @param {string} rootSessionId - Root session ID
   */
  async getBranchTree(userId, rootSessionId) {
    const rootStreamId = `student_${userId}_session_${rootSessionId}`;

    try {
      const tree = await this.client.getBranchTree(rootStreamId);
      return tree;
    } catch (error) {
      console.error('Error getting branch tree:', error);
      throw error;
    }
  }

  /**
   * Compare two branches
   * @param {string} userId - Student user ID
   * @param {string} sessionIdA - First session ID
   * @param {string} sessionIdB - Second session ID
   */
  async compareBranches(userId, sessionIdA, sessionIdB) {
    try {
      const eventsA = await this.readSession(userId, sessionIdA);
      const eventsB = await this.readSession(userId, sessionIdB);

      // Find divergence point
      let divergenceIndex = 0;
      while (
        divergenceIndex < Math.min(eventsA.length, eventsB.length) &&
        eventsA[divergenceIndex].id === eventsB[divergenceIndex].id
      ) {
        divergenceIndex++;
      }

      return {
        divergenceIndex,
        commonEvents: eventsA.slice(0, divergenceIndex),
        branchAEvents: eventsA.slice(divergenceIndex),
        branchBEvents: eventsB.slice(divergenceIndex),
      };
    } catch (error) {
      console.error('Error comparing branches:', error);
      throw error;
    }
  }
}

module.exports = new S2Service();
```

---

### Step 2: Define Branching Story Types

**Create `frontend/src/types/branching.ts`**:
```typescript
export interface DecisionPoint {
  id: string;
  storyText: string;
  question: string;
  choices: Choice[];
  sentenceIndex: number;
}

export interface Choice {
  id: string;
  text: string;
  description: string;
  icon?: string;
  consequences?: string; // Preview of what happens
}

export interface StoryBranch {
  id: string;
  parentId: string | null;
  choice: string;
  events: ReadingEvent[];
  decisionPoints: DecisionPoint[];
  isActive: boolean;
}

export interface BranchTree {
  rootSessionId: string;
  branches: Map<string, StoryBranch>;
  currentBranchId: string;
}

export interface BranchingStory extends Story {
  isBranching: boolean;
  decisionPoints: DecisionPoint[];
  currentBranchId: string;
  branchTree: BranchTree;
}
```

---

### Step 3: Create Branching Story Context

**Create `frontend/src/contexts/BranchingStoryContext.tsx`**:
```typescript
import { createContext, useContext, useState, useCallback } from 'react';
import type { BranchingStory, DecisionPoint, Choice } from '@/types/branching';

interface BranchingStoryContextType {
  branchingStory: BranchingStory | null;
  currentBranch: string;
  makeChoice: (decisionPointId: string, choice: Choice) => Promise<void>;
  switchBranch: (branchId: string) => Promise<void>;
  compareBranches: (branchIdA: string, branchIdB: string) => Promise<any>;
  resetToDecisionPoint: (decisionPointId: string) => Promise<void>;
}

const BranchingStoryContext = createContext<BranchingStoryContextType | null>(null);

export const BranchingStoryProvider = ({ children }) => {
  const [branchingStory, setBranchingStory] = useState<BranchingStory | null>(null);
  const [currentBranch, setCurrentBranch] = useState<string>('main');

  const makeChoice = useCallback(async (decisionPointId: string, choice: Choice) => {
    if (!branchingStory) return;

    // Create new branch via backend
    const response = await fetch('/api/branching/create-branch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: branchingStory.userId,
        parentSessionId: currentBranch,
        decisionPointId,
        choice: choice.id,
      }),
    });

    const { branchSessionId } = await response.json();

    // Generate continuation for this branch
    const continuation = await generateBranchContinuation(
      branchingStory,
      choice
    );

    // Update branch tree
    setBranchingStory(prev => ({
      ...prev!,
      branchTree: {
        ...prev!.branchTree,
        branches: new Map([
          ...prev!.branchTree.branches,
          [branchSessionId, {
            id: branchSessionId,
            parentId: currentBranch,
            choice: choice.id,
            events: [],
            decisionPoints: continuation.decisionPoints,
            isActive: true,
          }],
        ]),
      },
    }));

    setCurrentBranch(branchSessionId);
  }, [branchingStory, currentBranch]);

  const switchBranch = useCallback(async (branchId: string) => {
    if (!branchingStory) return;

    // Fetch branch events
    const response = await fetch(
      `/api/analytics/session/${branchingStory.userId}/${branchId}`
    );
    const { events } = await response.json();

    // Update current branch
    setCurrentBranch(branchId);

    // Mark branch as active
    setBranchingStory(prev => ({
      ...prev!,
      currentBranchId: branchId,
    }));
  }, [branchingStory]);

  const compareBranches = useCallback(async (branchIdA: string, branchIdB: string) => {
    if (!branchingStory) return null;

    const response = await fetch('/api/branching/compare', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: branchingStory.userId,
        sessionIdA: branchIdA,
        sessionIdB: branchIdB,
      }),
    });

    return await response.json();
  }, [branchingStory]);

  const resetToDecisionPoint = useCallback(async (decisionPointId: string) => {
    // Find branch containing this decision point
    // Reset to that point
    // Implementation details...
  }, [branchingStory]);

  return (
    <BranchingStoryContext.Provider
      value={{
        branchingStory,
        currentBranch,
        makeChoice,
        switchBranch,
        compareBranches,
        resetToDecisionPoint,
      }}
    >
      {children}
    </BranchingStoryContext.Provider>
  );
};

export const useBranchingStory = () => {
  const context = useContext(BranchingStoryContext);
  if (!context) throw new Error('useBranchingStory must be used within BranchingStoryProvider');
  return context;
};
```

---

### Step 4: Create Backend Branching Endpoints

**Create `backend/src/routes/branching.routes.js`**:
```javascript
const router = require('express').Router();
const s2Service = require('../services/s2.service');
const { AzureOpenAI } = require('openai');

const client = new AzureOpenAI({
  endpoint: process.env.AZURE_OPENAI_ENDPOINT,
  apiKey: process.env.AZURE_OPENAI_API_KEY,
  apiVersion: process.env.AZURE_OPENAI_API_VERSION,
});

// Create a new branch
router.post('/create-branch', async (req, res) => {
  try {
    const { userId, parentSessionId, decisionPointId, choice } = req.body;

    const result = await s2Service.createBranch(
      userId,
      parentSessionId,
      decisionPointId,
      choice
    );

    res.json(result);
  } catch (error) {
    console.error('Error creating branch:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Generate story continuation for a branch
router.post('/generate-continuation', async (req, res) => {
  try {
    const { storyContext, choice, language } = req.body;

    const prompt = `Continue this story based on the choice: "${choice.text}"

Previous story context:
${storyContext}

The character chose: ${choice.text}

Generate the next 3-5 paragraphs continuing the story in this direction. Include 1-2 new decision points.

Response format:
{
  "continuation": "story text...",
  "decisionPoints": [
    {
      "question": "What should they do?",
      "choices": [
        { "text": "Option A", "description": "..." },
        { "text": "Option B", "description": "..." }
      ]
    }
  ]
}`;

    const response = await client.chat.completions.create({
      model: process.env.AZURE_OPENAI_DEPLOYMENT_NAME,
      messages: [
        { role: 'system', content: 'You are a creative storyteller for children.' },
        { role: 'user', content: prompt },
      ],
      response_format: { type: 'json_object' },
    });

    const result = JSON.parse(response.choices[0].message.content);
    res.json({ success: true, ...result });
  } catch (error) {
    console.error('Error generating continuation:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// List all branches for a session
router.get('/branches/:userId/:sessionId', async (req, res) => {
  try {
    const { userId, sessionId } = req.params;
    const branches = await s2Service.listBranches(userId, sessionId);
    res.json({ success: true, branches });
  } catch (error) {
    console.error('Error listing branches:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get branch tree
router.get('/tree/:userId/:sessionId', async (req, res) => {
  try {
    const { userId, sessionId } = req.params;
    const tree = await s2Service.getBranchTree(userId, sessionId);
    res.json({ success: true, tree });
  } catch (error) {
    console.error('Error getting branch tree:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Compare two branches
router.post('/compare', async (req, res) => {
  try {
    const { userId, sessionIdA, sessionIdB } = req.body;
    const comparison = await s2Service.compareBranches(userId, sessionIdA, sessionIdB);
    res.json({ success: true, comparison });
  } catch (error) {
    console.error('Error comparing branches:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
```

**Add to `backend/server.js`**:
```javascript
const branchingRoutes = require('./src/routes/branching.routes');
app.use('/api/branching', branchingRoutes);
```

---

### Step 5: Create Decision Point UI Component

**Create `frontend/src/components/branching/DecisionPoint.tsx`**:
```typescript
import { motion } from 'framer-motion';
import type { DecisionPoint, Choice } from '@/types/branching';

interface DecisionPointProps {
  decisionPoint: DecisionPoint;
  onChoose: (choice: Choice) => void;
}

export const DecisionPointComponent = ({ decisionPoint, onChoose }: DecisionPointProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card bg-gradient-to-br from-purple-100 to-pink-100 p-8 my-8"
    >
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-purple-900 mb-2">
          ⚡ Decision Time!
        </h3>
        <p className="text-lg text-gray-700">{decisionPoint.question}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {decisionPoint.choices.map((choice) => (
          <motion.button
            key={choice.id}
            onClick={() => onChoose(choice)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="card-hover p-6 text-left bg-white"
          >
            <div className="flex items-start gap-4">
              {choice.icon && (
                <span className="text-4xl">{choice.icon}</span>
              )}
              <div>
                <h4 className="font-bold text-lg mb-2">{choice.text}</h4>
                <p className="text-gray-600 text-sm">{choice.description}</p>
                {choice.consequences && (
                  <p className="text-purple-600 text-xs mt-2 italic">
                    → {choice.consequences}
                  </p>
                )}
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};
```

---

### Step 6: Create Branch Tree Visualization

**Create `frontend/src/components/branching/BranchTree.tsx`**:
```typescript
import ReactFlow, { Node, Edge } from 'react-flow-renderer';
import { useMemo } from 'react';
import type { BranchTree } from '@/types/branching';

interface BranchTreeProps {
  branchTree: BranchTree;
  onBranchClick: (branchId: string) => void;
}

export const BranchTreeVisualization = ({ branchTree, onBranchClick }: BranchTreeProps) => {
  const { nodes, edges } = useMemo(() => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];

    // Convert branch tree to React Flow format
    branchTree.branches.forEach((branch, branchId) => {
      nodes.push({
        id: branchId,
        data: {
          label: branch.choice || 'Main Story',
          isActive: branch.isActive,
        },
        position: calculateNodePosition(branch, branchTree),
        style: {
          background: branch.isActive ? '#8b5cf6' : '#e5e7eb',
          color: branch.isActive ? 'white' : 'black',
          border: branchTree.currentBranchId === branchId ? '3px solid #f59e0b' : 'none',
        },
      });

      if (branch.parentId) {
        edges.push({
          id: `${branch.parentId}-${branchId}`,
          source: branch.parentId,
          target: branchId,
          animated: branch.isActive,
        });
      }
    });

    return { nodes, edges };
  }, [branchTree]);

  return (
    <div className="card h-96">
      <h3 className="font-bold mb-4">Story Branches</h3>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodeClick={(_, node) => onBranchClick(node.id)}
        fitView
      />
    </div>
  );
};

function calculateNodePosition(branch: StoryBranch, tree: BranchTree) {
  // Calculate position based on depth and siblings
  // Implementation details...
  return { x: 0, y: 0 };
}
```

---

### Step 7: Integrate Branching into Reading Page

**Update `frontend/src/pages/Reading.tsx`**:
```typescript
import { DecisionPointComponent } from '@/components/branching/DecisionPoint';
import { useBranchingStory } from '@/contexts/BranchingStoryContext';

export const Reading = () => {
  const { branchingStory, makeChoice } = useBranchingStory();
  const [currentDecisionPoint, setCurrentDecisionPoint] = useState<DecisionPoint | null>(null);

  const handleChoice = async (choice: Choice) => {
    if (!currentDecisionPoint) return;

    await makeChoice(currentDecisionPoint.id, choice);
    setCurrentDecisionPoint(null);

    // Continue reading with new branch
  };

  return (
    <div className="reading-container">
      {/* Story text */}
      <div className="story-text">
        {/* ... existing story rendering ... */}
      </div>

      {/* Decision point */}
      {currentDecisionPoint && (
        <DecisionPointComponent
          decisionPoint={currentDecisionPoint}
          onChoose={handleChoice}
        />
      )}

      {/* Branch navigation */}
      {branchingStory && (
        <div className="fixed bottom-4 right-4">
          <button
            onClick={() => setShowBranchTree(true)}
            className="btn-primary"
          >
            🌳 View Branches
          </button>
        </div>
      )}
    </div>
  );
};
```

---

## 🎯 Quality Gates

### Gate 1: Branching Infrastructure ✅
```bash
# Test branch creation
curl -X POST http://localhost:8080/api/branching/create-branch \
  -H "Content-Type: application/json" \
  -d '{"userId":"user1","parentSessionId":"session1","decisionPointId":"dp1","choice":"mountain"}'

# Expected: { success: true, branchSessionId: "..." }
```

### Gate 2: Story Continuation ✅
```bash
# Test AI generation for branch
# Verify continuation makes sense
# Check decision points are relevant
```

### Gate 3: Branch Visualization ✅
```bash
# Navigate to reading page
# Make choices, create branches
# Verify tree visualization updates
# Test branch switching
```

### Gate 4: Branch Comparison ✅
```bash
# Create 2+ branches
# Compare outcomes
# Verify differences highlighted
```

---

## ✅ Completion Checklist

- [ ] S2Service extended with branching methods
- [ ] Branching types defined
- [ ] BranchingStoryContext created
- [ ] Backend branching endpoints implemented
- [ ] DecisionPoint UI component works
- [ ] Branch tree visualization displays
- [ ] Story continuation generation works
- [ ] Branch switching functional
- [ ] Branch comparison works
- [ ] All branches preserved in S2

---

## 📚 Code Reuse from Analytics PRP

**80% of infrastructure reused:**
- ✅ S2Service base class (append, read, subscribe)
- ✅ Event tracking patterns
- ✅ TypeScript event types
- ✅ Timeline visualization components
- ✅ Backend route structure
- ✅ Frontend service patterns

**New code (20%):**
- Branch creation/navigation
- Decision point UI
- Branch tree visualization
- Story continuation generation

---

## 📊 Confidence Score: 7/10

**Strengths (+)**:
- ✅ Reuses 80% of analytics infrastructure
- ✅ S2.dev branching is core feature
- ✅ Engaging user experience
- ✅ Non-destructive (all paths saved)

**Weaknesses (-3)**:
- ⚠️ Complex UI for branch visualization
- ⚠️ AI story continuation quality varies
- ⚠️ Higher cognitive load for students

**Risk Mitigation**:
- Start with simple 2-choice decisions
- Limit branch depth to 3 levels
- Provide "recommended path" guidance
- Test with target age group (grades 3-6)

---

**PRP Status**: ✅ Ready for Execution (After Analytics PRP)
**Last Updated**: 2025-10-23
**Author**: AI Agent (Cascade)
**Dependencies**: s2-analytics-dashboard.md (MUST complete first)
