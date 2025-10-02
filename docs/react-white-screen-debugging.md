# React White Screen Debugging Guide

**Date**: 2025-09-26  
**Project**: Korean Learning Game  
**Status**: ✅ RESOLVED with systematic approach  

## 🚨 **Problem Pattern**

React applications showing **white screen** despite code appearing syntactically correct and TypeScript compilation succeeding.

## 🔍 **Root Causes Identified**

### **1. Import/Module Resolution Errors** (Most Critical)
- **Symptoms**: Vite console errors: "Failed to reload... importing non-existent modules"
- **Causes**:
  - External service imports failing (e.g., `azureOpenAIService`)
  - Incorrect import paths
  - Missing dependencies
  - Circular import dependencies
- **Result**: Entire component fails to mount → white screen

### **2. CSS Loading Dependencies**
- **Symptoms**: UI elements render but are invisible
- **Causes**:
  - External CSS files not loading properly
  - CSS variables (`var(--theme-primary)`) becoming undefined
  - Theme classes not applying to body element
- **Result**: Invisible text on white background

### **3. Component Complexity Breaking Point**
- **Pattern**: Simple components work → Add complexity → White screen
- **Breaking Points**:
  - Adding external service imports
  - Complex state management
  - Large component files (>500 lines)
  - Multiple external dependencies
- **Result**: React fails silently and completely

### **4. Missing Error Boundaries**
- **Issue**: Unhandled errors in components cause entire app failure
- **Result**: React shows nothing instead of partial content
- **Solution**: Wrap complex components in error boundaries

## ✅ **Successful Solutions**

### **1. Incremental Development Pattern**
```typescript
// ✅ Step 1: Start minimal
const App = () => <div>Hello World</div>

// ✅ Step 2: Add basic styling
const App = () => <div style={{background: 'blue'}}>Hello</div>

// ✅ Step 3: Add state
const App = () => {
  const [theme, setTheme] = useState('space')
  return <div style={{background: getTheme(theme)}}>Hello</div>
}

// ✅ Step 4: Add external services (carefully)
// Test each addition separately
```

### **2. Inline Styles for Critical UI**
```typescript
// ✅ WORKS: Guaranteed styling
useEffect(() => {
  document.body.style.background = 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)'
  document.body.style.color = '#ffffff'
}, [theme])

// ❌ FAILS: Depends on CSS loading
useEffect(() => {
  document.body.className = `theme-${theme}` // Fails if CSS not loaded
}, [theme])
```

### **3. Safe Component Pattern**
```typescript
// ✅ SAFE: No external dependencies
const SafeApp = () => (
  <div style={{
    minHeight: '100vh',
    background: 'linear-gradient(...)',
    color: 'white'
  }}>
    <h1>Korean Learning Game</h1>
    <button onClick={() => setTheme('jungle')}>Switch Theme</button>
  </div>
)

// ❌ RISKY: External dependencies
import { azureOpenAIService } from './services/azureOpenAI'
import './WorkingStyles.css'

const RiskyApp = () => {
  // This can fail if imports don't resolve
}
```

### **4. Import Validation Strategy**
```typescript
// ✅ Test imports in isolation first
// Create separate test file:
// test-azure-import.ts
import { azureOpenAIService } from './services/azureOpenAI'
console.log('Import successful:', azureOpenAIService)

// Only add to main component after validation
```

## 📊 **Evidence from Debugging Session**

### **Failure Cases**
- **SimpleThemeApp**: Failed with "importing non-existent modules" error when Azure imports added
- **MinimalWorkingApp**: Worked initially, broke when complexity added
- **FullApp**: Failed due to too much complexity at once

### **Success Cases**
- **SafeThemeApp**: Works with inline styles, no external imports
- **Basic components**: Work when kept simple

## 🛡️ **Prevention Checklist**

### **Before Adding Complexity**
- [ ] Current version works and renders
- [ ] No console errors in browser
- [ ] TypeScript compilation successful
- [ ] Test new imports in isolation

### **When Adding External Services**
- [ ] Test import path separately
- [ ] Add error handling/fallbacks
- [ ] Keep component simple during integration
- [ ] Add features incrementally

### **For CSS/Styling**
- [ ] Use inline styles for critical theming
- [ ] Test CSS loading separately
- [ ] Provide fallback styles
- [ ] Avoid complex CSS dependencies initially

## 🎯 **Recommended Development Flow**

1. **Start with SafeApp pattern** (inline styles, no external deps)
2. **Verify basic functionality** (theme switching, state management)
3. **Add external imports one by one**
4. **Test after each addition**
5. **Use error boundaries for complex features**
6. **Keep working version as fallback**

## 🔧 **Debugging Commands**

```bash
# Check TypeScript compilation
npm run type-check

# Check for import errors
npm run build

# Monitor console for runtime errors
# Open browser dev tools → Console tab

# Test specific imports
npx tsx src/test-imports.ts
```

## 📁 **Reference Files**

### **Working Examples**
- `src/SafeThemeApp.tsx` - Guaranteed working pattern
- `src/SimpleThemeApp.tsx` - Failed example (for reference)

### **Test Files**
- `src/test-azure-foundry.ts` - Azure import validation
- `src/check-api-key.ts` - Environment variable validation

## 🎉 **Success Metrics**

- **SafeThemeApp**: 100% success rate with inline styles
- **Theme switching**: Works immediately with direct style application
- **Korean level control**: Functions without external dependencies
- **Incremental approach**: Prevents white screen failures

---

**Key Insight**: React fails silently and completely. The solution is incremental development with inline styles for critical UI, then gradual addition of external dependencies.

**Remember**: If it works, don't break it. Add complexity incrementally and test each step.
