# Azure OpenAI TTS - Frontend Integration Guide

## Overview

The backend now provides Azure OpenAI Text-to-Speech (TTS) with **11 voice options**. The frontend can select voices and generate high-quality audio for both English and Korean content.

## API Endpoints

### 1. Get Available Voices

**Endpoint:** `GET /api/voices`

**Response:**
```json
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
    {
      "id": "shimmer",
      "name": "Shimmer",
      "description": "Playful and animated voice",
      "gender": "female",
      "recommended": true,
      "childFriendly": true
    },
    {
      "id": "fable",
      "name": "Fable",
      "description": "Storytelling voice",
      "gender": "neutral",
      "recommended": true,
      "childFriendly": true
    }
    // ... 8 more voices
  ],
  "defaultVoice": "nova",
  "provider": "Azure OpenAI",
  "count": 10
}
```

### 2. Generate Speech

**Endpoint:** `POST /api/text-to-speech`

**Request Body:**
```json
{
  "text": "Text to convert to speech",
  "voice": "nova",          // Optional, defaults to "nova"
  "speed": 1.0,             // Optional, range: 0.5-2.0, defaults to 1.0
  "childSafe": true         // Optional, defaults to true
}
```

**Response:**
```json
{
  "success": true,
  "audio": "data:audio/mp3;base64,<base64_encoded_audio>",
  "duration": 78720,
  "childSafe": true,
  "voice": "nova",
  "availableVoices": ["alloy", "ash", "ballad", "coral", "echo", "fable", "nova", "onyx", "sage", "shimmer"]
}
```

## Available Voices

### Child-Friendly Voices (Recommended)

| Voice ID | Name | Gender | Description | Use Case |
|----------|------|--------|-------------|----------|
| `nova` | Nova | Female | Energetic and engaging | **Default**, General reading |
| `shimmer` | Shimmer | Female | Playful and animated | Fun stories, younger kids |
| `coral` | Coral | Female | Bright and friendly | Cheerful content |
| `fable` | Fable | Neutral | Storytelling voice | Adventure stories |
| `sage` | Sage | Neutral | Gentle and wise | Educational content |

### Additional Voices

| Voice ID | Name | Gender | Description |
|----------|------|--------|-------------|
| `alloy` | Alloy | Neutral | Neutral and balanced |
| `ash` | Ash | Neutral | Warm and expressive |
| `ballad` | Ballad | Neutral | Calm and soothing |
| `echo` | Echo | Male | Clear and articulate |
| `onyx` | Onyx | Male | Deep and authoritative |

## Frontend Implementation Examples

### React Component Example

```typescript
import { useState, useEffect } from 'react';

interface Voice {
  id: string;
  name: string;
  description: string;
  gender: string;
  recommended?: boolean;
  childFriendly?: boolean;
  default?: boolean;
}

export function VoiceSelector() {
  const [voices, setVoices] = useState<Voice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>('nova');
  const [isPlaying, setIsPlaying] = useState(false);

  // Fetch available voices on component mount
  useEffect(() => {
    async function fetchVoices() {
      try {
        const response = await fetch('http://localhost:3001/api/voices');
        const data = await response.json();

        if (data.success) {
          setVoices(data.voices);
          setSelectedVoice(data.defaultVoice);
        }
      } catch (error) {
        console.error('Failed to fetch voices:', error);
      }
    }

    fetchVoices();
  }, []);

  // Generate and play speech
  async function playText(text: string) {
    try {
      setIsPlaying(true);

      const response = await fetch('http://localhost:3001/api/text-to-speech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: text,
          voice: selectedVoice,
          speed: 1.0,
          childSafe: true
        })
      });

      const data = await response.json();

      if (data.success) {
        // Create audio element and play
        const audio = new Audio(data.audio);
        audio.onended = () => setIsPlaying(false);
        await audio.play();

        console.log('✅ Playing audio:', {
          voice: data.voice,
          duration: data.duration,
          childSafe: data.childSafe
        });
      }
    } catch (error) {
      console.error('TTS playback failed:', error);
      setIsPlaying(false);
    }
  }

  return (
    <div className="voice-selector">
      <h3>Select Voice</h3>

      {/* Voice Selection */}
      <select
        value={selectedVoice}
        onChange={(e) => setSelectedVoice(e.target.value)}
        disabled={isPlaying}
      >
        <optgroup label="Child-Friendly Voices">
          {voices.filter(v => v.childFriendly).map(voice => (
            <option key={voice.id} value={voice.id}>
              {voice.name} - {voice.description}
            </option>
          ))}
        </optgroup>

        <optgroup label="Other Voices">
          {voices.filter(v => !v.childFriendly).map(voice => (
            <option key={voice.id} value={voice.id}>
              {voice.name} - {voice.description}
            </option>
          ))}
        </optgroup>
      </select>

      {/* Test Button */}
      <button
        onClick={() => playText('Hello! This is a test of the text to speech system.')}
        disabled={isPlaying}
      >
        {isPlaying ? 'Playing...' : 'Test Voice'}
      </button>
    </div>
  );
}
```

### Service Layer Example

```typescript
// services/TTSService.ts

interface TTSOptions {
  voice?: string;
  speed?: number;
  childSafe?: boolean;
}

interface Voice {
  id: string;
  name: string;
  description: string;
  gender: string;
  recommended?: boolean;
  childFriendly?: boolean;
}

class TTSService {
  private baseUrl = 'http://localhost:3001/api';
  private audioCache = new Map<string, string>();

  async getVoices(): Promise<Voice[]> {
    try {
      const response = await fetch(`${this.baseUrl}/voices`);
      const data = await response.json();
      return data.success ? data.voices : [];
    } catch (error) {
      console.error('Failed to fetch voices:', error);
      return [];
    }
  }

  async generateSpeech(text: string, options: TTSOptions = {}): Promise<string | null> {
    const cacheKey = `${text}_${options.voice || 'nova'}_${options.speed || 1.0}`;

    // Check cache first
    if (this.audioCache.has(cacheKey)) {
      console.log('🔁 Using cached audio');
      return this.audioCache.get(cacheKey)!;
    }

    try {
      console.log('🎤 Generating speech:', { text: text.substring(0, 50), ...options });

      const response = await fetch(`${this.baseUrl}/text-to-speech`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          voice: options.voice || 'nova',
          speed: options.speed || 1.0,
          childSafe: options.childSafe !== false
        })
      });

      const data = await response.json();

      if (data.success) {
        console.log('✅ Speech generated:', {
          voice: data.voice,
          duration: data.duration,
          cached: false
        });

        // Cache the audio
        this.audioCache.set(cacheKey, data.audio);

        return data.audio;
      } else {
        console.error('TTS generation failed:', data);
        return null;
      }
    } catch (error) {
      console.error('TTS request failed:', error);
      return null;
    }
  }

  async playText(text: string, options: TTSOptions = {}): Promise<void> {
    const audioData = await this.generateSpeech(text, options);

    if (audioData) {
      const audio = new Audio(audioData);
      await audio.play();
    }
  }

  clearCache(): void {
    this.audioCache.clear();
    console.log('🗑️ Audio cache cleared');
  }
}

export const ttsService = new TTSService();
```

### Usage in Your Reading App

```typescript
// components/reading/AudioPlayer.tsx
import { ttsService } from '../../services/TTSService';

export function AudioPlayer({ text, language }: { text: string; language: string }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState('nova');

  async function handlePlay() {
    setIsPlaying(true);
    try {
      await ttsService.playText(text, {
        voice: selectedVoice,
        speed: 1.0,
        childSafe: true
      });
    } catch (error) {
      console.error('Playback failed:', error);
    } finally {
      setIsPlaying(false);
    }
  }

  return (
    <div>
      <button onClick={handlePlay} disabled={isPlaying}>
        {isPlaying ? '🔊 Playing...' : '▶️ Play'}
      </button>
    </div>
  );
}
```

## Response to Frontend Team's Approach

### ❌ Issue: Azure Neural Voices vs Azure OpenAI TTS

**Frontend Team's Assumption:**
```javascript
// English: en-US-AvaNeural (Premium natural female voice)
// Korean: ko-KR-SunHiNeural (Premium neural Korean voice)
```

**Backend Reality:**
- The backend uses **Azure OpenAI TTS API**, not Azure Speech Services
- Azure OpenAI TTS provides **11 standardized voices** (alloy, ash, ballad, coral, echo, fable, nova, onyx, sage, shimmer)
- These voices work for **both English and Korean** text automatically
- No need to specify different voices for different languages

### ✅ What's Actually Available

**Backend provides:**
1. **11 Azure OpenAI voices** (voice selection via `voice` parameter)
2. **Automatic language detection** (same voice works for English and Korean)
3. **Child-friendly recommendations** (nova, shimmer, coral, fable, sage)
4. **Speed control** (0.5x to 2.0x)
5. **Child safety validation** (content filtering)

### 🎯 Corrected Frontend Implementation

```typescript
// ✅ CORRECT: Use Azure OpenAI voices
const voice = 'nova';  // Works for both English and Korean

// ❌ INCORRECT: Azure Neural voice names don't exist in OpenAI API
const voice = 'en-US-AvaNeural';  // Will fallback to 'nova'
const voice = 'ko-KR-SunHiNeural';  // Will fallback to 'nova'
```

### 📊 Voice Comparison

| Frontend Assumption | Backend Reality | Recommendation |
|---------------------|-----------------|----------------|
| `en-US-AvaNeural` | Not available | Use `nova` (default, energetic) |
| `ko-KR-SunHiNeural` | Not available | Use `nova` or `shimmer` (playful) |
| Manual language switching | Automatic detection | No need to specify language |
| Browser TTS fallback | Azure OpenAI primary | Backend handles all TTS |

### 🚀 Recommended Frontend Changes

1. **Remove Azure Neural voice references**
2. **Use the 11 available Azure OpenAI voices** from `/api/voices`
3. **Let backend handle language detection** (no need to specify English vs Korean)
4. **Focus on voice personality** (storytelling = fable, energetic = nova, playful = shimmer)

### Example Frontend Update

```typescript
// Before (Incorrect):
const getVoiceForLanguage = (language: string) => {
  return language === 'english'
    ? 'en-US-AvaNeural'  // ❌ Not available
    : 'ko-KR-SunHiNeural';  // ❌ Not available
};

// After (Correct):
const getVoiceForContent = (contentType: string) => {
  // Azure OpenAI handles both English and Korean automatically
  if (contentType === 'story') return 'fable';  // Storytelling voice
  if (contentType === 'fun') return 'shimmer';  // Playful voice
  return 'nova';  // Default energetic voice
};
```

## Debug & Monitoring

The backend logs TTS requests:

```
🎤 Using Azure OpenAI TTS voice: nova
🎵 Generating audio for text: Hello, this is a test...
✅ Child-safe audio generated successfully
📊 Audio size: 78720 bytes
```

Frontend should log voice selection:

```typescript
console.log('🎵 Selected voice:', selectedVoice);
console.log('🎵 Text length:', text.length);
console.log('🎵 Speed:', speed);
```

## Performance Notes

- **Audio caching recommended**: Cache base64 audio to avoid regenerating the same text
- **Typical audio sizes**:
  - 50 words ≈ 40-80 KB
  - 100 words ≈ 80-120 KB
  - 250 words ≈ 150-250 KB
- **Speed control**: 0.9x for clarity, 1.0x for normal, 1.1x for faster reading
- **Default voice (nova)**: Best balance of energy and clarity for kids

## Error Handling

```typescript
try {
  const response = await fetch('/api/text-to-speech', { /* ... */ });
  const data = await response.json();

  if (!data.success) {
    console.error('TTS failed:', data.error);
    // Fallback to browser TTS or show error message
  }
} catch (error) {
  console.error('TTS request failed:', error);
  // Fallback to browser TTS
}
```

## Child Safety

All TTS requests go through content validation:
- Blocks inappropriate words
- Validates child-appropriate content
- Filters sensitive topics

To bypass (for testing only):
```json
{
  "text": "Test content",
  "childSafe": false  // ⚠️ Use only for testing
}
```

## Testing

Use the provided test script:
```bash
cd backend
./test-tts.sh
```

Or test manually:
```bash
# Get voices
curl http://localhost:3001/api/voices

# Generate speech
curl -X POST http://localhost:3001/api/text-to-speech \
  -H "Content-Type: application/json" \
  -d '{"text": "Hello world", "voice": "nova"}'
```

## Summary for Frontend Team

✅ **What's Available:**
- 11 Azure OpenAI voices (not Azure Neural voices)
- Automatic language detection (same voice for English/Korean)
- Child-friendly recommendations (nova, shimmer, fable, sage, coral)
- Speed control and content safety

❌ **What's NOT Available:**
- Azure Neural voice names (en-US-AvaNeural, ko-KR-SunHiNeural)
- Language-specific voice selection
- Manual language switching for voices

🎯 **Action Items:**
1. Update voice selection to use Azure OpenAI voice IDs
2. Remove language-specific voice logic
3. Focus on voice personality instead of language
4. Test with the 11 available voices
5. Implement audio caching for better performance
