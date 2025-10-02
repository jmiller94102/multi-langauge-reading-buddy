# Frontend TTS Voice Implementation - Technical Documentation

## 🚨 **CRITICAL CORRECTION - Korean Voice Support**

**IMPORTANT**: This document was initially incomplete regarding Korean voice support. The system DOES support multiple Korean voices through browser TTS + Azure Speech Services.

## 📋 **Executive Summary**

The frontend team has implemented a **hybrid TTS system** that provides:
- **English**: 10 Azure OpenAI TTS voices (alloy, ash, ballad, coral, echo, fable, nova, onyx, sage, shimmer)
- **Korean**: 4+ browser-native Korean voices (Eddy, Flo, Grandma, Grandpa) + Azure Speech Services premium voice
- **Smart Routing**: Automatic language detection and optimal TTS service selection

## 🔧 **Implementation Overview**

### **Hybrid TTS Architecture**

```javascript
// Smart language detection and routing
const isKorean = language === 'korean' || language === 'ko-KR' || 
                 /[\u3131-\u3163\uac00-\ud7a3]/.test(text);

if (isKorean) {
  // Route to Azure Speech Services (existing implementation)
  return await generateKoreanTTS(text, speed, res);
} else {
  // Route to Azure OpenAI TTS (new implementation)
  return await generateEnglishTTS(text, voice, speed, res);
}
```

### **Voice Sources & Routing**

| Language | TTS Provider | Voice Options | Quality |
|----------|-------------|---------------|---------|
| **Korean** | Browser TTS + Azure Speech | 4+ Korean voices + Premium Neural | Native Korean |
| **English** | Azure OpenAI TTS | 10 built-in voices | Optimized for English |

## 🎙️ **Complete Voice Catalog - English AND Korean**

The frontend now utilizes **BOTH** Azure OpenAI TTS (English) AND browser-native voices (including Korean):

### **English Voice Specifications (Azure OpenAI)**
```javascript
const azureOpenAIVoices = [
  'alloy',    // Neutral and balanced
  'ash',      // Warm and expressive  
  'ballad',   // Calm and soothing
  'coral',    // Bright and friendly (child-friendly)
  'echo',     // Clear and articulate
  'fable',    // Storytelling voice (child-friendly)
  'nova',     // Energetic and engaging (DEFAULT, child-friendly)
  'onyx',     // Deep and authoritative
  'sage',     // Gentle and wise (child-friendly)
  'shimmer'   // Playful and animated (child-friendly)
];
```

### **Korean Voice Specifications (Browser + Azure Speech)**
```javascript
const koreanVoices = [
  'Eddy (Korean (South Korea))',     // ko-KR • Local
  'Flo (Korean (South Korea))',      // ko-KR • Local  
  'Grandma (Korean (South Korea))',  // ko-KR • Local
  'Grandpa (Korean (South Korea))',  // ko-KR • Local
  'ko-KR-SunHiNeural'               // Azure Speech Services (Premium)
];
```

### **CRITICAL CORRECTION: Korean Voice Support**
- **Korean Voices Available**: 4+ browser voices + 1 premium Azure voice
- **Korean Voice Quality**: Native Korean pronunciation with local system voices
- **Korean Voice Selection**: Full dropdown interface with voice switching
- **Korean TTS Routing**: Automatic detection and routing to appropriate TTS service

## 🔄 **Backend API Changes Made**

### **1. Enhanced `/api/text-to-speech` Endpoint**

**New Request Parameters**:
```javascript
{
  "text": "Hello world",
  "language": "english" | "korean",  // Language detection
  "voice": "nova",                   // Azure OpenAI voice ID
  "speed": 1.0,
  "childSafe": true
}
```

**Response Enhancement**:
```javascript
{
  "success": true,
  "audio": "data:audio/mp3;base64,..",
  "voice": "nova",
  "language": "english",
  "provider": "Azure OpenAI",        // NEW: Provider identification
  "availableVoices": ["alloy", "ash", ...] // NEW: Voice options
}
```

### **2. New `/api/voices` Endpoint**

**Purpose**: Provide frontend with available voice metadata
**Endpoint**: `GET /api/voices?language=english`

**Response**:
```javascript
{
  "success": true,
  "voices": [
    {
      "id": "nova",
      "name": "Nova",
      "description": "Energetic and engaging voice",
      "gender": "female",
      "recommended": true,
      "childFriendly": true,
      "default": true
    },
    // ... 9 more voices
  ],
  "defaultVoice": "nova",
  "provider": "Azure OpenAI",
  "count": 10
}
```

## 🏗️ **Technical Implementation Details**

### **Azure OpenAI TTS Integration**

**Endpoint**: `${TTS_SERVICE_API_BASE}/openai/deployments/gpt-4o-mini-tts-2/audio/speech`
**API Version**: `2025-03-01-preview`
**Authentication**: Bearer token using `AZURE_OPENAI_API_KEY`

**Request Format**:
```javascript
{
  "model": "gpt-4o-mini-tts-2",
  "input": "Text to synthesize",
  "voice": "nova",
  "speed": 1.0
}
```

### **Environment Variables Required**

```bash
# Azure OpenAI TTS (for English)
AZURE_OPENAI_API_KEY=your_azure_openai_key
TTS_SERVICE_API_BASE=https://your-resource.openai.azure.com

# Azure Speech Services (for Korean) - EXISTING
AZURE_SPEECH_KEY=your_speech_key
AZURE_SPEECH_REGION=your_region
```

## 🎯 **Language Detection Logic**

### **Automatic Language Routing**
```javascript
// 1. Explicit language parameter
if (language === 'korean' || language === 'ko-KR') → Korean TTS

// 2. Korean character detection (Unicode ranges)
if (/[\u3131-\u3163\uac00-\ud7a3]/.test(text)) → Korean TTS

// 3. Default fallback
else → English TTS (Azure OpenAI)
```

### **Frontend Language Mapping**
```javascript
// Based on Korean blend level in UI
language: languageBlendLevel > 5 ? 'korean' : 'english'
```

## 📊 **Performance & Quality Benefits**

### **English TTS (Azure OpenAI)**
- ✅ **10 voice options** vs 1 previous voice
- ✅ **Neural quality** optimized for English
- ✅ **Child-friendly voices** available
- ✅ **Faster response times** (optimized for English)

### **Korean TTS (Azure Speech Services)**
- ✅ **Native Korean pronunciation** maintained
- ✅ **Premium neural voice** (`ko-KR-SunHiNeural`)
- ✅ **Existing quality** preserved

## 🔧 **Backend Code Changes**

### **File**: `backend/server.js`

**Functions Added**:
- `generateEnglishTTS(text, voice, speed, res)` - Azure OpenAI integration
- `generateKoreanTTS(text, speed, res)` - Existing Azure Speech (preserved)

**Endpoints Modified**:
- `POST /api/text-to-speech` - Now routes to appropriate TTS service
- `GET /api/voices` - New endpoint for voice metadata

## 🚀 **Deployment Considerations**

### **Required Dependencies**
```json
{
  "node-fetch": "^3.0.0"  // For Azure OpenAI API calls
}
```

### **Error Handling**
- Graceful fallback between TTS services
- Detailed error logging for debugging
- User-friendly error messages

## 🎵 **Frontend Voice Selection UI**

### **Professional Voice Selector**
- Dropdown with all 10 Azure OpenAI voices
- Voice quality indicators (Premium, Enhanced, etc.)
- Real-time voice switching
- Automatic best-voice selection

### **Smart Caching**
- Voice-specific audio caching
- Cache invalidation on voice change
- Performance optimization

## 📋 **Testing & Validation**

### **Test Cases Implemented**
1. **English Content** → Azure OpenAI TTS with selected voice
2. **Korean Content** → Azure Speech Services with neural voice
3. **Mixed Content** → Automatic language detection
4. **Voice Switching** → Fresh audio generation per voice
5. **Error Handling** → Graceful fallbacks and user feedback

## 🔄 **Migration Path**

### **Backward Compatibility**
- ✅ Existing Korean TTS functionality **unchanged**
- ✅ All existing API contracts **preserved**
- ✅ No breaking changes to current implementations

### **Progressive Enhancement**
- English TTS now uses Azure OpenAI (better quality)
- Korean TTS continues using Azure Speech (optimal for Korean)
- Frontend gains voice selection capabilities

## 📞 **Support & Questions**

**Frontend Team Contact**: Available for technical questions about implementation
**Documentation**: This file serves as complete technical specification
**Testing**: All functionality tested and production-ready

---

**Summary**: The frontend team has successfully implemented a hybrid TTS system that provides 10 high-quality English voices via Azure OpenAI while preserving premium Korean TTS via Azure Speech Services. This enhancement significantly improves user experience with professional voice selection capabilities and maintains backward compatibility.
