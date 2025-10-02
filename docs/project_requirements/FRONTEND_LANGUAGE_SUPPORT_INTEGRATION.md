# Language Support API Integration Guide for Frontend Team

## 📋 Overview

This document provides the frontend team with comprehensive information about the implemented Language Support APIs and how to integrate them into the reading webapp for enhanced educational functionality.

## 🎯 User Stories & Features

### **Primary User Story**
> As a child (ages 8-12) learning to read with Korean language support, I want interactive assistance features so that I can better understand the story content and improve my reading comprehension skills.

### **Feature Set Implemented**
1. **🎵 Audio Support**: Text-to-speech for story content with child-safe voices
2. **💡 Quiz Hints**: AI-generated contextual hints for reading comprehension questions
3. **🔤 Korean Phonetics**: Pronunciation guides for Korean text
4. **✏️ Answer Validation**: Semantic answer checking for quiz responses
5. **🛡️ Child Safety**: Content filtering across all features

## 🔗 API Endpoints Documentation

### **Base URL**: `http://localhost:8080/api`

---

## 1. 🎵 Text-to-Speech API

### **Endpoint**: `POST /api/text-to-speech`

**Purpose**: Generate child-safe audio for story content or individual words

**Request Body**:
```json
{
  "text": "Hello! This is a story about friendship.",
  "language": "english",        // "english", "korean", "en-US", "ko-KR"
  "voice": "english",          // "english" or "korean"
  "speed": 1.0,               // 0.5 - 2.0 (optional, default: 1.0)
  "childSafe": true           // boolean (optional, default: true)
}
```

**Response**:
```json
{
  "success": true,
  "audio": "data:audio/mp3;base64,UklGRnoGAABXQVZFZm10IBAAA...",
  "duration": 15420,
  "childSafe": true,
  "voice": "en-US-JennyNeural"
}
```

**Integration Example**:
```typescript
const playAudio = async (text: string, language: 'english' | 'korean') => {
  try {
    const response = await fetch('/api/text-to-speech', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text,
        language,
        speed: 1.0,
        childSafe: true
      })
    });

    const data = await response.json();

    if (data.success) {
      const audio = new Audio(data.audio);
      audio.play();
    }
  } catch (error) {
    console.error('Audio generation failed:', error);
    // Show child-friendly error message
  }
};
```

---

## 2. 💡 Quiz Hint Generation API

### **Endpoint**: `POST /api/generate-quiz-hint`

**Purpose**: Generate educational hints for reading comprehension questions

**Request Body**:
```json
{
  "questionText": "What was the main character feeling at the beginning of the story?",
  "storyContent": "Once upon a time, Sarah felt very nervous about her first day...",
  "gradeLevel": "4th Grade",     // "2nd Grade" - "6th Grade"
  "childSafe": true             // boolean (optional, default: true)
}
```

**Response**:
```json
{
  "success": true,
  "hint": "🔍 Look for clues in the first paragraph about how Sarah felt when she woke up that morning!",
  "gradeLevel": "4th Grade",
  "childSafe": true,
  "timestamp": "2023-12-07T10:30:00.000Z"
}
```

**Integration Example**:
```typescript
const getQuizHint = async (question: string, story: string, grade: string) => {
  try {
    const response = await fetch('/api/generate-quiz-hint', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        questionText: question,
        storyContent: story,
        gradeLevel: grade,
        childSafe: true
      })
    });

    const data = await response.json();

    if (data.success) {
      // Display hint to child
      showHint(data.hint);
    }
  } catch (error) {
    console.error('Hint generation failed:', error);
  }
};
```

---

## 3. 🔤 Korean Phonetics API

### **Endpoint**: `POST /api/korean-phonetics`

**Purpose**: Provide pronunciation guides for Korean text

**Request Body**:
```json
{
  "koreanText": "안녕하세요",
  "displayType": "simplified",    // "simplified", "IPA", "both"
  "childSafe": true              // boolean (optional, default: true)
}
```

**Response**:
```json
{
  "success": true,
  "koreanText": "안녕하세요",
  "simplified": "ahn-nyeong-ha-se-yo",
  "ipa": "annjʌŋhasejo",
  "confidence": "high",
  "displayType": "simplified",
  "childSafe": true,
  "timestamp": "2023-12-07T10:30:00.000Z"
}
```

**Integration Example**:
```typescript
const getPhonetics = async (koreanText: string) => {
  try {
    const response = await fetch('/api/korean-phonetics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        koreanText,
        displayType: 'simplified',
        childSafe: true
      })
    });

    const data = await response.json();

    if (data.success) {
      // Show pronunciation guide
      showPronunciation(data.simplified, data.ipa);
    }
  } catch (error) {
    console.error('Phonetics generation failed:', error);
  }
};
```

---

## 4. ✏️ Answer Validation API

### **Endpoint**: `POST /api/validate-answer`

**Purpose**: Semantically validate student answers with flexibility for typos and variations

**Request Body**:
```json
{
  "userAnswer": "happy and excited",
  "correctAnswer": "excited",
  "questionType": "fill_in_blank",    // "multiple_choice", "fill_in_blank"
  "gradeLevel": "4th Grade"
}
```

**Response**:
```json
{
  "success": true,
  "isCorrect": true,
  "similarity": 0.95,
  "threshold": 0.85,
  "feedback": "Correct! Great job!",
  "details": {
    "exactMatch": false,
    "closeMatch": true,
    "semanticMatch": true,
    "gradeLevel": "4th Grade",
    "questionType": "fill_in_blank"
  }
}
```

**Integration Example**:
```typescript
const validateAnswer = async (userAnswer: string, correctAnswer: string, questionType: string) => {
  try {
    const response = await fetch('/api/validate-answer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userAnswer,
        correctAnswer,
        questionType,
        gradeLevel: currentGrade
      })
    });

    const data = await response.json();

    if (data.success) {
      // Show appropriate feedback
      showFeedback(data.isCorrect, data.feedback);
    }
  } catch (error) {
    console.error('Answer validation failed:', error);
  }
};
```

---

## 5. 🏥 Health Check API

### **Endpoint**: `GET /api/health`

**Purpose**: Check backend service status and Azure integrations

**Response**:
```json
{
  "status": "ok",
  "azureOpenAI": "connected",
  "timestamp": "2023-12-07T10:30:00.000Z"
}
```

---

## 🎨 Frontend Component Integration

### **Language Support State Structure**

The existing `languageSupport` state in `App.tsx` should be used to control feature visibility:

```typescript
const [languageSupport, setLanguageSupport] = useState({
  phonetics: true,        // Enable Korean phonetics tooltips
  romanization: true,     // Enable romanization overlays
  audioSupport: false,    // Enable text-to-speech functionality
  visualContext: true,    // Enable quiz hint highlighting
  grammarHints: true      // Enable grammar explanation panels
});
```

### **Pre-built Components Available**

The following React components are already implemented and ready for integration:

1. **`AudioPlayer`** (`src/components/language-support/AudioPlayer.tsx`)
   - Child-safe audio controls with theme integration
   - Caching system for performance
   - Visual progress indicators

2. **`VisualHighlighter`** (`src/components/language-support/VisualHighlighter.tsx`)
   - Text highlighting for quiz hints
   - Interactive click handlers
   - Theme-based styling

3. **`PhoneticsDisplay`** (`src/components/language-support/PhoneticsDisplay.tsx`)
   - Korean pronunciation tooltips
   - Multiple notation systems (simplified/IPA)
   - Audio pronunciation integration

4. **`RomanizationOverlay`** (`src/components/language-support/RomanizationOverlay.tsx`)
   - Progressive romanization based on learning level
   - Hover/click interactions
   - Comprehensive Korean mapping

5. **`GrammarHintPanel`** (`src/components/language-support/GrammarHintPanel.tsx`)
   - Educational grammar explanations
   - Grade-level appropriate content
   - Interactive learning elements

---

## 🚀 Implementation Roadmap

### **Phase 1: Audio Support (Ready for Immediate Use)**
```typescript
// Already integrated in App.tsx
<AudioPlayer
  text={displayedContent || currentStory.blendedContent}
  language={languageBlendLevel > 5 ? 'korean' : 'english'}
  childSafe={true}
  theme={themeStyle}
  enabled={languageSupport.audioSupport}
/>
```

### **Phase 2: Quiz Hints Integration**
```typescript
// Add to quiz question display
const QuizQuestion = ({ question, story }) => {
  const [hint, setHint] = useState('');

  const requestHint = async () => {
    const response = await fetch('/api/generate-quiz-hint', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        questionText: question.text,
        storyContent: story,
        gradeLevel: userSettings.gradeLevel
      })
    });

    const data = await response.json();
    if (data.success) {
      setHint(data.hint);
    }
  };

  return (
    <div className="quiz-question">
      <p>{question.text}</p>
      {hint && <div className="hint-display">{hint}</div>}
      <button onClick={requestHint}>💡 Need a Hint?</button>
    </div>
  );
};
```

### **Phase 3: Phonetics & Romanization**
```typescript
// Wrap Korean text with phonetics support
const KoreanText = ({ children }) => {
  if (!languageSupport.phonetics) return children;

  return (
    <PhoneticsDisplay
      koreanText={children}
      displayType="simplified"
      trigger="hover"
      theme={currentTheme}
    />
  );
};
```

---

## 🛡️ Child Safety Features

### **Automatic Content Filtering**
All APIs include built-in child safety validation:
- Inappropriate content detection
- Grade-level appropriateness checking
- COPPA-compliant processing (no personal data storage)

### **Error Handling**
Implement child-friendly error messages:

```typescript
const handleAPIError = (error: any) => {
  // Show encouraging message instead of technical errors
  showMessage("Oops! Let's try that again. The computer is still learning too! 🤖");
};
```

### **Privacy Compliance**
- All processing happens locally or via Azure APIs
- No user data is stored permanently
- No tracking or analytics collection

---

## 🎯 User Experience Guidelines

### **Child-Friendly Design Principles**
1. **Large Touch Targets**: Minimum 44px for buttons
2. **High Contrast**: Easy-to-read text and controls
3. **Immediate Feedback**: Visual/audio responses to interactions
4. **Encouraging Language**: Positive, supportive messaging
5. **Simple Controls**: One-click actions wherever possible

### **Progressive Enhancement**
Features should degrade gracefully:
- Audio fails → Show visual text only
- Hints fail → Show generic encouragement
- Phonetics fail → Show Korean text without pronunciation

---

## 🧪 Testing Checklist

### **Functional Testing**
- [ ] Audio plays correctly for English and Korean content
- [ ] Quiz hints are relevant and grade-appropriate
- [ ] Phonetics display accurately for Korean text
- [ ] Answer validation accepts reasonable variations
- [ ] All features work with different themes

### **Child Safety Testing**
- [ ] Inappropriate content is filtered out
- [ ] Error messages are child-friendly
- [ ] No external data collection occurs
- [ ] Features work offline (except API calls)

### **Performance Testing**
- [ ] Audio generation under 2 seconds
- [ ] Hint generation under 1 second
- [ ] UI remains responsive during API calls
- [ ] Caching prevents duplicate requests

---

## 📞 Support & Integration Help

### **API Endpoint Monitoring**
Check backend status: `GET /api/health`

### **Common Integration Issues**
1. **CORS Issues**: Ensure frontend runs on localhost:5173
2. **API Timeouts**: Implement proper loading states
3. **Audio Playback**: Handle browser autoplay policies
4. **Theme Integration**: Use existing `themeStyle` objects

### **Contact for Questions**
- Technical issues: Check console logs and network tab
- Child safety concerns: Verify content filtering is working
- Performance issues: Monitor API response times

---

## 🎉 Quick Start Integration

### **Minimal Working Example**
```typescript
// Add to any reading component
const ReadingWithSupport = ({ content, language }) => {
  const [audioEnabled, setAudioEnabled] = useState(false);

  const playContent = async () => {
    const response = await fetch('/api/text-to-speech', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: content,
        language: language,
        childSafe: true
      })
    });

    const data = await response.json();
    if (data.success) {
      const audio = new Audio(data.audio);
      audio.play();
    }
  };

  return (
    <div className="reading-content">
      <p>{content}</p>
      <button onClick={playContent} className="audio-btn">
        🔊 Listen
      </button>
    </div>
  );
};
```

This comprehensive integration enables rich, educational language support features that will significantly enhance the children's reading experience!