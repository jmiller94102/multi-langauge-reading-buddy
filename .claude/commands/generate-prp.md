# Create PRP for Children's Education Game

## Feature file: $ARGUMENTS

Generate a complete PRP for children's education game feature implementation with thorough research. Ensure context is passed to the AI agent to enable self-validation and iterative refinement. Read the feature file first to understand what needs to be created, how the examples provided help, and any other considerations.

The AI agent only gets the context you are appending to the PRP and training data. Assume the AI agent has access to the codebase and the same knowledge cutoff as you, so it's important that your research findings are included or referenced in the PRP. The Agent has Websearch capabilities, so pass URLs to documentation and examples.

## Research Process

1. **Codebase Analysis**
   - Search for similar features/patterns in the codebase and example_projects
   - Identify React/TypeScript patterns from loveable_example
   - Note SurfSense performance optimization patterns
   - Check children's app best practices and safety considerations
   - Analyze existing component structures and game state management

2. **External Research**
   - Search for children's education game patterns online
   - React/TypeScript documentation for modern patterns
   - Tailwind CSS for child-friendly UI design
   - Accessibility guidelines for children's applications (WCAG)
   - Child data privacy requirements (COPPA compliance)
   - Educational content generation and age-appropriate design

3. **Children's App Specific Research**
   - Child psychology and learning patterns for target age group
   - Safe content filtering and parental control implementations
   - Age-appropriate UI/UX design principles
   - Audio/visual feedback systems for engagement
   - Progress tracking and gamification for children

## PRP Generation

Using the established PRP template structure:

### Critical Context to Include for AI Agent
- **Documentation**: URLs with specific sections for React, children's app design
- **Code Examples**: Real snippets from example_projects showing patterns
- **Safety Requirements**: Content filtering, privacy, parental controls
- **Educational Guidelines**: Age-appropriate learning objectives
- **Technical Patterns**: Performance optimization from SurfSense analysis

### Implementation Blueprint
- Start with child safety and content filtering pseudocode
- Reference React patterns from loveable_example
- Include educational content generation strategy
- Detail parent dashboard and progress tracking
- Specify audio/visual feedback systems

### Validation Gates (Must be Executable)
```bash
# Syntax/Style
npm run lint && npm run type-check

# Unit Tests with children's app specific testing
npm test -- --coverage

# Performance validation for children's attention spans
npm run build && npm run preview
# Manual testing: Load time < 3 seconds, responsive touch targets

# Content safety validation
npm run test:content-filter
```

*** CRITICAL AFTER YOU ARE DONE RESEARCHING AND EXPLORING THE CODEBASE BEFORE YOU START WRITING THE PRP ***

*** ULTRA-THINK ABOUT THE CHILDREN'S EDUCATION GAME PRP AND PLAN YOUR APPROACH FOCUSING ON:
1. Child safety and age-appropriate content
2. Educational value and learning objectives
3. Engaging UI/UX for young children
4. Parent controls and progress monitoring
5. Performance optimized for shorter attention spans
THEN START WRITING THE PRP ***

## Output
Save as: `PRPs/{feature-name}-children-game.md`

## Quality Checklist for Children's App PRP
- [ ] All necessary context for child-safe development included
- [ ] Validation gates are executable by AI
- [ ] References existing React/TypeScript patterns from examples
- [ ] Clear implementation path with child-specific considerations
- [ ] Error handling documented with age-appropriate feedback
- [ ] Educational objectives clearly defined
- [ ] Parent/guardian controls and privacy measures included
- [ ] Accessibility requirements for children specified
- [ ] Performance requirements for short attention spans addressed

Score the PRP on a scale of 1-10 (confidence level to succeed in one-pass implementation focusing on child safety and educational value)

Remember: The goal is one-pass implementation success of a safe, educational, and engaging children's app through comprehensive context.