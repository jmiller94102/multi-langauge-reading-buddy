# Audio Reading with Synchronized Highlighting Architecture

## Overview

This document specifies the architecture for audio reading with synchronized word highlighting - a BONUS feature designed early for implementation in **Phase 8**. The system reads story passages aloud while highlighting each word in real-time, supporting multilingual content (English, Korean, Mandarin).

**Version**: 1.0
**Last Updated**: 2025-10-11
**Status**: ⏳ Design Complete - Implementation Phase 8
**Priority**: BONUS (after core MVP features)

---

## Table of Contents

1. [Feature Requirements](#feature-requirements)
2. [Architecture Overview](#architecture-overview)
3. [Audio Generation](#audio-generation)
4. [Word Timing Extraction](#word-timing-extraction)
5. [Synchronization Engine](#synchronization-engine)
6. [Highlighting Implementation](#highlighting-implementation)
7. [Multilingual Support](#multilingual-support)
8. [Playback Controls](#playback-controls)
9. [Component Architecture](#component-architecture)
10. [Performance Optimization](#performance-optimization)
11. [Error Handling](#error-handling)
12. [Testing Strategy](#testing-strategy)
13. [Alternative Approaches](#alternative-approaches)

---

## Feature Requirements

### User Stories

**As a student, I want to:**
- Hear the story read aloud in a natural voice
- See each word highlighted as it's spoken
- Pause and resume audio playback
- Adjust reading speed (0.5x, 1.0x, 1.5x, 2.0x)
- Seek to specific parts of the story
- Control volume
- Toggle auto-read-aloud on story generation

**As a teacher, I want:**
- Students to improve pronunciation through listening
- Support for multilingual reading (English + Korean/Mandarin)
- Clear visual feedback synchronized with audio
- Settings to customize TTS voice and speed

### Functional Requirements

1. **Audio Generation**: Convert story text to natural-sounding speech
2. **Word Timings**: Extract precise start/end times for each word
3. **Synchronization**: Highlight words in perfect sync with audio
4. **Multilingual Support**: Handle English, Korean (Hangul), and Mandarin (Simplified Chinese)
5. **Playback Controls**: Play, pause, seek, speed adjustment, volume control
6. **Visual Highlighting**: Smooth highlighting without jarring jumps
7. **Accessibility**: Screen reader compatible, keyboard navigable

### Non-Functional Requirements

1. **Performance**: Highlighting updates within 50ms of audio playback
2. **Latency**: Audio generation < 20 seconds for 500-word passage
3. **Accuracy**: Word timing accuracy ±100ms
4. **Responsiveness**: Smooth scrolling to keep highlighted word visible
5. **Offline Support**: Cache generated audio for offline playback

---

## Architecture Overview

### High-Level Flow

```
┌─────────────────────────────────────────────────────────────┐
│                   Audio Reading Pipeline                     │
└─────────────────────────────────────────────────────────────┘

1. Story Text
   ↓
2. Text Preprocessing (split into chunks, clean formatting)
   ↓
3. Audio Generation (Azure TTS: gpt-4o-transcribe or similar)
   ↓
4. Word Timing Extraction (SRT/WebVTT format)
   ↓
5. Audio + Timings Storage (IndexedDB cache)
   ↓
6. Playback Engine (Web Audio API + AudioContext)
   ↓
7. Synchronization Engine (requestAnimationFrame loop)
   ↓
8. DOM Highlighting (classList manipulation)
   ↓
9. Visual Feedback (smooth scroll to highlighted word)
```

### System Components

```
┌──────────────────────────────────────────────────────────────┐
│                  Component Architecture                       │
└──────────────────────────────────────────────────────────────┘

┌─────────────────────┐
│   AudioPlayer       │  Main UI component
│   (React)           │  - Play/pause button
└──────────┬──────────┘  - Speed control
           │             - Volume slider
           │             - Progress bar
           ↓
┌─────────────────────┐
│  useSyncedAudio     │  Custom React hook
│  (Hook)             │  - State management
└──────────┬──────────┘  - Playback control
           │             - Timing sync
           ↓
┌─────────────────────┐
│  SyncEngine         │  Core synchronization logic
│  (Service)          │  - RAF loop
└──────────┬──────────┘  - Current word calculation
           │             - Highlight trigger
           ↓
┌─────────────────────┐
│  HighlightManager   │  DOM manipulation
│  (Service)          │  - Add/remove highlights
└──────────┬──────────┘  - Smooth scrolling
           │             - Visual transitions
           ↓
┌─────────────────────┐
│  AudioService       │  Audio generation & storage
│  (Service)          │  - TTS API calls
└──────────┬──────────┘  - IndexedDB caching
           │             - Audio preloading
           ↓
┌─────────────────────┐
│  Web Audio API      │  Browser audio playback
│  (Native)           │
└─────────────────────┘
```

---

## Audio Generation

### Option 1: Azure OpenAI TTS (Recommended)

**Model**: `gpt-4o-transcribe` or Azure TTS service

**Advantages**:
- High-quality, natural-sounding voices
- Multilingual support (English, Korean, Mandarin)
- Word-level timing data available
- Consistent with existing Azure infrastructure

**API Request**:
```typescript
interface GenerateAudioRequest {
  text: string;
  voice: 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer';
  speed: number; // 0.5 - 2.0
  format: 'mp3' | 'opus' | 'aac';
  includeTimings: boolean; // Request word-level timings
}

const response = await fetch('https://api.openai.com/v1/audio/speech', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    model: 'tts-1-hd',
    input: text,
    voice: 'alloy',
    speed: 1.0,
    response_format: 'mp3'
  })
});

const audioBlob = await response.blob();
const audioUrl = URL.createObjectURL(audioBlob);
```

**Limitations**:
- No native word timing data (need separate extraction)
- API costs per character
- Requires network connection

---

### Option 2: Browser Web Speech API (Fallback)

**API**: `speechSynthesis`

**Advantages**:
- No API costs
- Works offline
- Instant generation

**Disadvantages**:
- Lower quality voices
- No word timing data
- Inconsistent across browsers
- Limited multilingual support

**Implementation**:
```typescript
const utterance = new SpeechSynthesisUtterance(text);
utterance.voice = speechSynthesis.getVoices()[0];
utterance.rate = 1.0;
utterance.pitch = 1.0;
utterance.volume = 1.0;

utterance.onboundary = (event) => {
  // Approximate word timing (unreliable)
  if (event.name === 'word') {
    console.log(`Word: ${event.charIndex}, Time: ${event.elapsedTime}`);
  }
};

speechSynthesis.speak(utterance);
```

---

### Hybrid Approach (Recommended for MVP)

1. **Primary**: Azure TTS for high-quality audio
2. **Fallback**: Web Speech API when offline or API unavailable
3. **User Choice**: Setting to prefer online or offline TTS

---

## Word Timing Extraction

### Challenge

OpenAI TTS API does not return word-level timing data by default. We need a separate process to extract timings.

### Solution 1: Forced Alignment (Recommended)

**Tool**: `gentle` or `aeneas` for forced alignment

**Process**:
1. Generate audio with Azure TTS
2. Use forced alignment tool to align text to audio
3. Extract word-level timestamps

**Gentle Example** (Python backend):
```python
import gentle

# Align text to audio
aligner = gentle.ForcedAligner(resources, text, audio_file)
result = aligner.transcribe()

# Extract word timings
word_timings = []
for word in result.words:
    word_timings.append({
        'word': word.word,
        'start': word.start,
        'end': word.end
    })
```

**Aeneas Example** (Python backend):
```python
from aeneas.executetask import ExecuteTask
from aeneas.task import Task

task = Task(config_string="task_language=eng|is_text_type=plain|os_task_file_format=json")
task.audio_file_path_absolute = "audio.mp3"
task.text_file_path_absolute = "text.txt"
task.sync_map_file_path_absolute = "timings.json"

ExecuteTask(task).execute()
```

---

### Solution 2: Estimate Timings (Fallback)

If forced alignment is unavailable, estimate word timings based on:
- Audio duration
- Word count
- Average speaking rate (150 words/minute)

**Algorithm**:
```typescript
function estimateWordTimings(text: string, audioDuration: number): WordTiming[] {
  const words = text.split(/\s+/);
  const totalWords = words.length;
  const averageWordDuration = audioDuration / totalWords;

  return words.map((word, index) => ({
    word,
    start: index * averageWordDuration,
    end: (index + 1) * averageWordDuration
  }));
}
```

**Accuracy**: ±500ms (acceptable for MVP, not ideal)

---

### Solution 3: Real-Time STT (Alternative)

Use Speech-to-Text API on generated audio to extract timings:

**OpenAI Whisper API**:
```typescript
const formData = new FormData();
formData.append('file', audioFile);
formData.append('model', 'whisper-1');
formData.append('response_format', 'verbose_json');
formData.append('timestamp_granularities', ['word']);

const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${apiKey}` },
  body: formData
});

const result = await response.json();
const wordTimings = result.words; // Array of { word, start, end }
```

**Advantages**:
- Highly accurate
- Native support for multilingual content

**Disadvantages**:
- Additional API cost
- Requires transcription of our own audio (circular)

---

### Recommended Approach

**Phase 8 Implementation**:
1. **Primary**: Forced alignment with `aeneas` (Python backend service)
2. **Fallback**: Estimated timings based on word count
3. **Future Enhancement**: Real-time STT for dynamic adjustment

---

## Synchronization Engine

### Core Synchronization Loop

**Concept**: Use `requestAnimationFrame` to continuously check audio playback position and update highlighted word.

**Implementation**:
```typescript
class SyncEngine {
  private audioElement: HTMLAudioElement;
  private wordTimings: WordTiming[];
  private currentWordIndex: number = 0;
  private animationFrameId: number | null = null;
  private onWordChange: (index: number) => void;

  constructor(
    audioElement: HTMLAudioElement,
    wordTimings: WordTiming[],
    onWordChange: (index: number) => void
  ) {
    this.audioElement = audioElement;
    this.wordTimings = wordTimings;
    this.onWordChange = onWordChange;
  }

  start() {
    this.syncLoop();
  }

  stop() {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  private syncLoop = () => {
    const currentTime = this.audioElement.currentTime;

    // Find current word based on audio playback time
    const wordIndex = this.findWordIndexAtTime(currentTime);

    // If word changed, trigger callback
    if (wordIndex !== this.currentWordIndex) {
      this.currentWordIndex = wordIndex;
      this.onWordChange(wordIndex);
    }

    // Continue loop
    this.animationFrameId = requestAnimationFrame(this.syncLoop);
  };

  private findWordIndexAtTime(time: number): number {
    for (let i = 0; i < this.wordTimings.length; i++) {
      const timing = this.wordTimings[i];
      if (time >= timing.start && time < timing.end) {
        return i;
      }
    }
    return -1; // No word at this time
  }
}
```

**Usage**:
```typescript
const syncEngine = new SyncEngine(audioElement, wordTimings, (index) => {
  highlightWord(index);
});

audioElement.addEventListener('play', () => syncEngine.start());
audioElement.addEventListener('pause', () => syncEngine.stop());
audioElement.addEventListener('ended', () => syncEngine.stop());
```

---

### Optimization: Binary Search for Word Lookup

For long passages (1000+ words), linear search is inefficient. Use binary search:

```typescript
private findWordIndexAtTime(time: number): number {
  let left = 0;
  let right = this.wordTimings.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const timing = this.wordTimings[mid];

    if (time >= timing.start && time < timing.end) {
      return mid;
    } else if (time < timing.start) {
      right = mid - 1;
    } else {
      left = mid + 1;
    }
  }

  return -1;
}
```

**Performance**: O(log n) instead of O(n)

---

## Highlighting Implementation

### DOM Structure

**Story Text with Word IDs**:
```tsx
<div className="story-content">
  {words.map((word, index) => (
    <span
      key={index}
      id={`word-${index}`}
      className="story-word"
      data-word-index={index}
    >
      {word.text}
      {word.translation && (
        <span className="inline-hint">{word.translation}</span>
      )}
    </span>
  ))}
</div>
```

---

### Highlight Manager

**Service**:
```typescript
class HighlightManager {
  private currentHighlightedIndex: number = -1;
  private scrollContainer: HTMLElement;

  constructor(scrollContainer: HTMLElement) {
    this.scrollContainer = scrollContainer;
  }

  highlightWord(index: number) {
    // Remove previous highlight
    if (this.currentHighlightedIndex !== -1) {
      const prevElement = document.getElementById(`word-${this.currentHighlightedIndex}`);
      if (prevElement) {
        prevElement.classList.remove('highlighted');
      }
    }

    // Add new highlight
    const element = document.getElementById(`word-${index}`);
    if (element) {
      element.classList.add('highlighted');
      this.scrollToWord(element);
    }

    this.currentHighlightedIndex = index;
  }

  private scrollToWord(element: HTMLElement) {
    const containerRect = this.scrollContainer.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();

    // Check if element is out of view
    const isAboveView = elementRect.top < containerRect.top;
    const isBelowView = elementRect.bottom > containerRect.bottom;

    if (isAboveView || isBelowView) {
      // Smooth scroll to center element in view
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest'
      });
    }
  }

  clearHighlight() {
    if (this.currentHighlightedIndex !== -1) {
      const element = document.getElementById(`word-${this.currentHighlightedIndex}`);
      if (element) {
        element.classList.remove('highlighted');
      }
    }
    this.currentHighlightedIndex = -1;
  }
}
```

---

### CSS Styling

**Highlight Animation**:
```css
.story-word {
  transition: background-color 0.2s ease, color 0.2s ease;
  padding: 2px 4px;
  border-radius: 4px;
}

.story-word.highlighted {
  background-color: #fbbf24; /* Yellow highlight */
  color: #1f2937; /* Dark text for contrast */
  font-weight: 600;
  animation: pulse 0.3s ease;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}
```

---

## Multilingual Support

### Challenge

Multilingual text (English + Korean/Mandarin) requires:
1. Correct pronunciation for each language
2. Separate word timings for blended words
3. Visual distinction between languages

---

### Approach 1: Single Audio with Mixed Languages

**Pros**: Simple, one audio file
**Cons**: TTS may mispronounce non-primary language words

**Implementation**:
```typescript
const blendedText = "Pikachu 피카츄 was playing basketball 농구";
const audio = await generateAudio(blendedText, { voice: 'alloy' });
```

**Issue**: English TTS voice will mispronounce Korean words.

---

### Approach 2: Separate Audio Tracks per Language (Recommended)

**Pros**: Correct pronunciation for all languages
**Cons**: More complex, multiple audio files

**Implementation**:
1. Split text into language segments
2. Generate separate audio for each segment
3. Concatenate audio files
4. Adjust word timings based on concatenation

**Example**:
```typescript
const segments = [
  { text: 'Pikachu', language: 'en', voice: 'alloy' },
  { text: '피카츄', language: 'ko', voice: 'korean-voice' },
  { text: 'was playing basketball', language: 'en', voice: 'alloy' },
  { text: '농구', language: 'ko', voice: 'korean-voice' }
];

const audioSegments = await Promise.all(
  segments.map(seg => generateAudio(seg.text, { voice: seg.voice }))
);

const concatenatedAudio = await concatenateAudio(audioSegments);
const adjustedTimings = adjustTimingsForConcatenation(audioSegments);
```

---

### Approach 3: Real-Time Language Switching

**Pros**: Best pronunciation, smooth transitions
**Cons**: Most complex, requires Web Speech API support for multiple languages

**Implementation**:
```typescript
function speakMultilingual(segments: LanguageSegment[]) {
  let segmentIndex = 0;

  function speakNext() {
    if (segmentIndex >= segments.length) return;

    const segment = segments[segmentIndex];
    const utterance = new SpeechSynthesisUtterance(segment.text);
    utterance.lang = segment.language; // 'en-US', 'ko-KR', 'zh-CN'
    utterance.voice = getVoiceForLanguage(segment.language);

    utterance.onend = () => {
      segmentIndex++;
      speakNext();
    };

    speechSynthesis.speak(utterance);
  }

  speakNext();
}
```

---

### Recommended Approach for MVP

**Phase 8**: Use Approach 1 (single audio) for simplicity, with English TTS voice. Accept minor pronunciation issues for secondary language words.

**Future Enhancement**: Implement Approach 2 (separate tracks) for better quality.

---

## Playback Controls

### Audio Player Component

**UI Controls**:
- Play/Pause button
- Progress bar (seekable)
- Current time / Total duration
- Speed control (0.5x, 1.0x, 1.5x, 2.0x)
- Volume slider
- Mute/Unmute button

**State Management**:
```typescript
interface AudioPlayerState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  playbackSpeed: number;
  volume: number;
  isMuted: boolean;
  isLoading: boolean;
  error: string | null;
}
```

**Event Handlers**:
```typescript
const handlePlayPause = () => {
  if (audioRef.current) {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  }
};

const handleSeek = (time: number) => {
  if (audioRef.current) {
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  }
};

const handleSpeedChange = (speed: number) => {
  if (audioRef.current) {
    audioRef.current.playbackRate = speed;
    setPlaybackSpeed(speed);
  }
};

const handleVolumeChange = (volume: number) => {
  if (audioRef.current) {
    audioRef.current.volume = volume;
    setVolume(volume);
  }
};
```

---

## Component Architecture

### AudioPlayer Component

**File**: `src/components/reading/AudioPlayer.tsx`

```typescript
interface AudioPlayerProps {
  audioUrl: string;
  wordTimings: WordTiming[];
  onWordHighlight: (wordIndex: number) => void;
  autoPlay?: boolean;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  audioUrl,
  wordTimings,
  onWordHighlight,
  autoPlay = false
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const syncEngineRef = useRef<SyncEngine | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [volume, setVolume] = useState(0.8);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const syncEngine = new SyncEngine(audio, wordTimings, onWordHighlight);
    syncEngineRef.current = syncEngine;

    audio.addEventListener('play', () => {
      syncEngine.start();
      setIsPlaying(true);
    });

    audio.addEventListener('pause', () => {
      syncEngine.stop();
      setIsPlaying(false);
    });

    audio.addEventListener('ended', () => {
      syncEngine.stop();
      setIsPlaying(false);
    });

    audio.addEventListener('timeupdate', () => {
      setCurrentTime(audio.currentTime);
    });

    audio.addEventListener('loadedmetadata', () => {
      setDuration(audio.duration);
    });

    return () => {
      syncEngine.stop();
    };
  }, [audioUrl, wordTimings, onWordHighlight]);

  return (
    <div className="audio-player">
      <audio ref={audioRef} src={audioUrl} preload="auto" />

      <button onClick={handlePlayPause}>
        {isPlaying ? <PauseIcon /> : <PlayIcon />}
      </button>

      <ProgressBar
        current={currentTime}
        total={duration}
        onSeek={handleSeek}
      />

      <SpeedControl
        speed={playbackSpeed}
        onChange={handleSpeedChange}
      />

      <VolumeControl
        volume={volume}
        onChange={handleVolumeChange}
      />
    </div>
  );
};
```

---

### useSyncedAudio Hook

**File**: `src/hooks/useSyncedAudio.ts`

```typescript
interface UseSyncedAudioOptions {
  audioUrl: string;
  wordTimings: WordTiming[];
  autoPlay?: boolean;
}

export function useSyncedAudio({
  audioUrl,
  wordTimings,
  autoPlay = false
}: UseSyncedAudioOptions) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const syncEngineRef = useRef<SyncEngine | null>(null);

  useEffect(() => {
    const audio = new Audio(audioUrl);
    audioRef.current = audio;

    const syncEngine = new SyncEngine(audio, wordTimings, setCurrentWordIndex);
    syncEngineRef.current = syncEngine;

    audio.addEventListener('play', () => {
      syncEngine.start();
      setIsPlaying(true);
    });

    audio.addEventListener('pause', () => {
      syncEngine.stop();
      setIsPlaying(false);
    });

    audio.addEventListener('timeupdate', () => {
      setCurrentTime(audio.currentTime);
    });

    audio.addEventListener('loadedmetadata', () => {
      setDuration(audio.duration);
    });

    if (autoPlay) {
      audio.play();
    }

    return () => {
      audio.pause();
      syncEngine.stop();
    };
  }, [audioUrl, wordTimings, autoPlay]);

  const play = () => audioRef.current?.play();
  const pause = () => audioRef.current?.pause();
  const seek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  return {
    isPlaying,
    currentTime,
    duration,
    currentWordIndex,
    play,
    pause,
    seek
  };
}
```

---

## Performance Optimization

### 1. Audio Caching

**Strategy**: Cache generated audio in IndexedDB for offline playback

```typescript
class AudioCache {
  private dbName = 'audio-cache';
  private storeName = 'audio-files';

  async saveAudio(storyId: string, audioBlob: Blob, wordTimings: WordTiming[]) {
    const db = await this.openDB();
    const tx = db.transaction(this.storeName, 'readwrite');
    const store = tx.objectStore(this.storeName);

    await store.put({
      id: storyId,
      audio: audioBlob,
      timings: wordTimings,
      timestamp: Date.now()
    });
  }

  async getAudio(storyId: string): Promise<{ audio: Blob; timings: WordTiming[] } | null> {
    const db = await this.openDB();
    const tx = db.transaction(this.storeName, 'readonly');
    const store = tx.objectStore(this.storeName);
    const result = await store.get(storyId);

    return result ? { audio: result.audio, timings: result.timings } : null;
  }

  private async openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName, { keyPath: 'id' });
        }
      };
    });
  }
}
```

---

### 2. Preloading Audio

**Strategy**: Start loading audio as soon as story is generated

```typescript
useEffect(() => {
  if (storyGenerated) {
    // Preload audio in background
    const audio = new Audio(audioUrl);
    audio.preload = 'auto';
    audio.load();
  }
}, [storyGenerated, audioUrl]);
```

---

### 3. Throttle Scroll Updates

**Problem**: Scrolling on every word change can be jarring

**Solution**: Only scroll if word is out of view

```typescript
private scrollToWord(element: HTMLElement) {
  const containerRect = this.scrollContainer.getBoundingClientRect();
  const elementRect = element.getBoundingClientRect();

  const isOutOfView =
    elementRect.top < containerRect.top ||
    elementRect.bottom > containerRect.bottom;

  if (isOutOfView) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'nearest'
    });
  }
}
```

---

### 4. Web Audio API for Advanced Control

**Use Case**: Precise timing control, filters, effects

```typescript
const audioContext = new AudioContext();
const source = audioContext.createMediaElementSource(audioElement);
const gainNode = audioContext.createGain();

source.connect(gainNode);
gainNode.connect(audioContext.destination);

// Adjust volume
gainNode.gain.value = 0.8;

// Get precise time
const currentTime = audioContext.currentTime;
```

---

## Error Handling

### Audio Loading Errors

```typescript
audioElement.addEventListener('error', (e) => {
  const error = audioElement.error;
  let message = 'Failed to load audio';

  switch (error?.code) {
    case MediaError.MEDIA_ERR_ABORTED:
      message = 'Audio loading was aborted';
      break;
    case MediaError.MEDIA_ERR_NETWORK:
      message = 'Network error while loading audio';
      break;
    case MediaError.MEDIA_ERR_DECODE:
      message = 'Audio decoding failed';
      break;
    case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
      message = 'Audio format not supported';
      break;
  }

  console.error(message, error);
  setError(message);
});
```

---

### Timing Sync Errors

```typescript
if (currentWordIndex === -1) {
  // No word found at current time
  // Possible causes:
  // 1. Timings are incorrect
  // 2. Audio is in pause between words
  // 3. Audio is at beginning or end

  // Fallback: Clear highlight
  highlightManager.clearHighlight();
}
```

---

### API Errors

```typescript
try {
  const audio = await generateAudio(text, config);
} catch (error) {
  if (error.response?.status === 429) {
    setError('Rate limit exceeded. Please try again later.');
  } else if (error.response?.status === 401) {
    setError('Authentication failed. Please check API key.');
  } else {
    setError('Failed to generate audio. Please try again.');
  }

  // Fallback to Web Speech API
  useFallbackTTS(text);
}
```

---

## Testing Strategy

### Unit Tests

**Test Synchronization Logic**:
```typescript
describe('SyncEngine', () => {
  it('finds correct word at given time', () => {
    const timings = [
      { word: 'Hello', start: 0, end: 0.5 },
      { word: 'world', start: 0.5, end: 1.0 }
    ];

    const syncEngine = new SyncEngine(mockAudio, timings, jest.fn());
    expect(syncEngine.findWordIndexAtTime(0.3)).toBe(0);
    expect(syncEngine.findWordIndexAtTime(0.7)).toBe(1);
    expect(syncEngine.findWordIndexAtTime(1.5)).toBe(-1);
  });
});
```

---

### Integration Tests

**Test Full Audio Playback**:
```typescript
it('highlights words in sync with audio', async () => {
  render(<AudioPlayer audioUrl={testAudioUrl} wordTimings={testTimings} />);

  const playButton = screen.getByRole('button', { name: /play/i });
  fireEvent.click(playButton);

  // Wait for first word to highlight
  await waitFor(() => {
    expect(screen.getByText('Hello')).toHaveClass('highlighted');
  });

  // Simulate audio progress
  act(() => {
    audioElement.currentTime = 0.7;
    audioElement.dispatchEvent(new Event('timeupdate'));
  });

  // Verify second word is highlighted
  await waitFor(() => {
    expect(screen.getByText('world')).toHaveClass('highlighted');
  });
});
```

---

### E2E Tests

**Test Complete User Flow**:
```typescript
test('user can listen to story with highlighting', async () => {
  // Generate story
  await generateStory({ prompt: 'Test story' });

  // Click audio button
  await page.click('[data-testid="audio-play-button"]');

  // Wait for audio to start
  await page.waitForSelector('.story-word.highlighted');

  // Verify highlighting progresses
  const highlightedWords = await page.$$eval('.story-word.highlighted', els => els.length);
  expect(highlightedWords).toBeGreaterThan(0);

  // Pause audio
  await page.click('[data-testid="audio-pause-button"]');

  // Verify highlighting stops
  await page.waitForTimeout(1000);
  const finalHighlightedWords = await page.$$eval('.story-word.highlighted', els => els.length);
  expect(finalHighlightedWords).toBe(highlightedWords);
});
```

---

## Alternative Approaches

### Approach A: Pre-rendered Video with Subtitles

**Concept**: Generate video with burned-in subtitles and highlighted text

**Pros**:
- Perfect synchronization
- No browser compatibility issues
- Works offline (once downloaded)

**Cons**:
- Large file sizes
- No interactive controls (seek, speed adjust)
- Difficult to update

**Verdict**: Not recommended for this use case

---

### Approach B: CSS Animations with Precise Timing

**Concept**: Use CSS keyframe animations synced to audio duration

**Pros**:
- Smooth transitions
- GPU-accelerated

**Cons**:
- Difficult to pause/resume
- No dynamic adjustment
- Complex to generate keyframes

**Verdict**: Not recommended (too rigid)

---

### Approach C: WebVTT Subtitle Tracks

**Concept**: Use HTML5 `<track>` element with WebVTT subtitles

**Pros**:
- Native browser support
- Standard format
- Easy to implement

**Cons**:
- Subtitles below video (not inline)
- Limited styling options
- No word-level highlighting

**Example**:
```html
<audio controls>
  <source src="story.mp3" type="audio/mpeg">
  <track kind="subtitles" src="story.vtt" srclang="en" label="English">
</audio>
```

**WebVTT Format**:
```
WEBVTT

00:00:00.000 --> 00:00:00.500
Hello

00:00:00.500 --> 00:00:01.000
world
```

**Verdict**: Good for subtitles, not for inline word highlighting

---

## Implementation Timeline (Phase 8)

### Week 1: Audio Generation Setup
- Integrate Azure TTS API
- Implement audio caching (IndexedDB)
- Add fallback to Web Speech API

### Week 2: Word Timing Extraction
- Set up forced alignment tool (aeneas/gentle)
- Implement timing estimation fallback
- Test timing accuracy

### Week 3: Synchronization Engine
- Build SyncEngine class
- Implement RAF loop
- Add binary search optimization

### Week 4: Highlighting & UI
- Create HighlightManager service
- Build AudioPlayer component
- Add playback controls (play, pause, seek, speed, volume)

### Week 5: Testing & Polish
- Unit tests for sync logic
- Integration tests for audio playback
- E2E tests for full flow
- Performance optimization

---

## Next Steps

1. ✅ **Audio Sync Architecture Complete** - This document
2. ⏸️ **Pet Evolution System Details** - Complete stage names and progression
3. ⏸️ **Backend Service for Forced Alignment** - Python service with aeneas
4. ⏸️ **Component Implementation** - Build AudioPlayer and related components
5. ⏸️ **User Testing** - Validate synchronization accuracy with real users

---

**Document Status**: ✅ Complete
**Implementation Phase**: Phase 8 (BONUS Feature)
**Next Document**: Pet Evolution System Details (`docs/pet-evolution-system.md`)
