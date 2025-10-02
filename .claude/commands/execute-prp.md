# Execute Children's Education Game PRP

## PRP file: $ARGUMENTS

Execute a comprehensive PRP for children's education game implementation with focus on safety, educational value, and engaging user experience. This command will implement the feature described in the PRP file through a systematic, validated approach.

## Execution Process

### 1. Context Loading & Validation
- Read the entire PRP file to understand requirements
- Validate all referenced documentation and examples are accessible
- Confirm understanding of child safety requirements
- Check educational objectives and age-appropriate design guidelines

### 2. Pre-Implementation Safety Check
- Verify content filtering requirements are understood
- Confirm parental control specifications
- Validate privacy compliance requirements (COPPA considerations)
- Check accessibility requirements for target age group

### 3. Implementation Strategy
- Create detailed task list using TodoWrite tool
- Follow the task order specified in the PRP
- Implement with continuous validation after each major component
- Ensure all child-specific considerations are addressed

### 4. Child-Specific Implementation Guidelines
- **Safety First**: Implement content filtering before content generation
- **Educational Value**: Ensure each component has clear learning objectives
- **Age Appropriateness**: Test all interactions for target age group usability
- **Performance**: Optimize for short attention spans (fast loading, immediate feedback)
- **Accessibility**: Large touch targets, high contrast, audio support

### 5. Validation Loop Execution
Execute each validation level as specified in the PRP:

#### Level 1: Technical Validation
```bash
npm run lint && npm run type-check
```

#### Level 2: Functional Testing
```bash
npm test -- --coverage
```

#### Level 3: Child-Specific Testing
- Load time validation (< 3 seconds)
- Touch target size validation (≥ 44px)
- Content safety verification
- Audio/visual feedback testing
- Parent dashboard functionality

### 6. Educational Content Validation
- Verify age-appropriate difficulty levels
- Test adaptive learning algorithms
- Confirm educational objective alignment
- Validate progress tracking accuracy

### 7. Safety & Privacy Validation
- Test content filtering system
- Verify no external data transmission during gameplay
- Confirm parental control access methods
- Validate data storage privacy compliance

## Success Criteria
Before marking complete, ensure:
- [ ] All PRP success criteria met
- [ ] Child safety measures implemented and tested
- [ ] Educational objectives clearly achieved
- [ ] Performance targets met (loading, responsiveness)
- [ ] Parent dashboard functional and informative
- [ ] All validation gates pass
- [ ] Age-appropriate design verified
- [ ] Accessibility requirements satisfied

## Error Handling Strategy
If implementation fails at any validation gate:
1. Read error messages carefully
2. Identify root cause (technical vs. child-specific requirement)
3. Fix implementation maintaining child safety priorities
4. Re-run validation
5. Continue only when validation passes

## Final Deliverables
Upon successful completion:
- [ ] Working children's education game prototype
- [ ] All tests passing with adequate coverage
- [ ] Performance benchmarks met
- [ ] Safety measures verified
- [ ] Documentation updated
- [ ] Parent guide created (if applicable)

## Post-Implementation Review
- Verify educational value through gameplay testing
- Confirm safety measures are working correctly
- Test parent dashboard provides meaningful insights
- Validate child engagement and learning outcomes

Remember: Children's applications require extra care for safety, privacy, and educational value. Never compromise on these priorities for faster implementation.