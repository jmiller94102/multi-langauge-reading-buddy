# TTS System Improvement Plan
**Date:** 2025-10-01
**Reference:** `TTS_DESIGN_FLAWS_ANALYSIS.md`
**Status:** Ready for Implementation

---

## 🎯 **OBJECTIVES**

1. **Reliability:** TTS works consistently across voice changes, blend levels, and network conditions
2. **User Experience:** Smooth voice selection, automatic audio updates, persistent preferences
3. **API Limitations:** Understand and clearly document what's possible vs impossible with current APIs

---

## 🚧 **API LIMITATIONS ANALYSIS**

### **What IS Possible:**

✅ **Single-Language TTS per API call**
- Azure OpenAI TTS: Excellent English pronunciation
- Azure Speech Services: Excellent Korean pronunciation
- Browser TTS: Supports both languages with varying quality

✅ **Voice Selection**
- Azure OpenAI: 10 voices (alloy, ash, ballad, coral, echo, fable, nova, onyx, sage, shimmer)
- Browser TTS: Varies by OS/browser (Mac: Samantha, Alex, Yuna, etc.)

✅ **Speed Control**
- All TTS services support playback speed adjustment (0.5x - 2.0x)

✅ **Text Segmentation**
- Can split mixed-language text into segments
- Call separate TTS APIs per segment
- Concatenate or sequence audio playback

### **What is NOT Possible:**

❌ **Single API Call for Mixed-Language Text**
- Azure OpenAI TTS cannot handle Korean text well
- Azure Speech Services cannot handle English text well
- No unified API that handles both languages equally

❌ **Real-time Voice Morphing**
- Cannot change voice of already-generated audio
- Must re-generate audio with new voice

❌ **Offline TTS with Azure Voices**
- Azure requires network connection
- Only browser TTS works offline

---

## 📋 **IMPLEMENTATION PLAN**

### **Phase 1: Critical Architecture Fixes** ⚠️ Must Complete Before Other Work

#### **Fix 1.1: Cache Key Include Voice** (Flaw #1)
**File:** `reading_webapp/src/services/AudioCacheService.ts`

**Change:**
```typescript
// BEFORE
private generateKey(text: string, language: string): string {
  return `${text.trim().toLowerCase()}-${language}`;
}

// AFTER
private generateKey(text: string, language: string, voice?: string): string {
  const voicePart = voice ? `-${voice}` : '';
  return `${text.trim().toLowerCase()}-${language}${voicePart}`;
}
```

**Update all callers:**
```typescript
public get(text: string, language: string, voice: string): string | null {
  const key = this.generateKey(text, language, voice);
  // ... rest unchanged
}

public set(text: string, language: string, voice: string, audioData: string): void {
  const key = this.generateKey(text, language, voice);
  // ... rest unchanged
}
```

**Testing:**
```typescript
test('cache respects voice parameter', () => {
  const service = AudioCacheService.getInstance();
  service.set('hello', 'english', 'nova', 'audio_nova');
  service.set('hello', 'english', 'shimmer', 'audio_shimmer');

  expect(service.get('hello', 'english', 'nova')).toBe('audio_nova');
  expect(service.get('hello', 'english', 'shimmer')).toBe('audio_shimmer');
});
```

---

#### **Fix 1.2: Voice Mapping Service** (Flaw #3)

**Create new file:** `reading_webapp/src/services/VoiceMappingService.ts`

```typescript
/**
 * Maps browser voice names to Azure TTS voice IDs
 */

export interface VoiceMapping {
  browserVoice: string;
  azureVoiceId: string;
  language: 'english' | 'korean';
  quality: 'high' | 'medium' | 'low';
}

export class VoiceMappingService {
  private static readonly MAPPINGS: VoiceMapping[] = [
    // English browser voices → Azure OpenAI voices
    { browserVoice: 'Samantha', azureVoiceId: 'nova', language: 'english', quality: 'high' },
    { browserVoice: 'Alex', azureVoiceId: 'onyx', language: 'english', quality: 'high' },
    { browserVoice: 'Ava', azureVoiceId: 'coral', language: 'english', quality: 'high' },
    { browserVoice: 'Karen', azureVoiceId: 'shimmer', language: 'english', quality: 'high' },
    { browserVoice: 'Daniel', azureVoiceId: 'fable', language: 'english', quality: 'high' },

    // Korean browser voices → Azure Speech Services voice
    { browserVoice: 'Yuna', azureVoiceId: 'ko-KR-SunHiNeural', language: 'korean', quality: 'high' },
    { browserVoice: 'Eddy', azureVoiceId: 'ko-KR-SunHiNeural', language: 'korean', quality: 'high' },
    { browserVoice: 'Flo', azureVoiceId: 'ko-KR-SunHiNeural', language: 'korean', quality: 'high' },

    // Fallback mappings
    { browserVoice: 'default', azureVoiceId: 'nova', language: 'english', quality: 'medium' },
  ];

  /**
   * Get Azure voice ID from browser voice name
   */
  static getAzureVoice(browserVoiceName: string, language: 'english' | 'korean'): string {
    // Try exact match first
    const exactMatch = this.MAPPINGS.find(
      m => m.browserVoice.toLowerCase() === browserVoiceName.toLowerCase() && m.language === language
    );
    if (exactMatch) return exactMatch.azureVoiceId;

    // Try partial match (e.g., "Samantha (English)" → "Samantha")
    const partialMatch = this.MAPPINGS.find(
      m => browserVoiceName.toLowerCase().includes(m.browserVoice.toLowerCase()) && m.language === language
    );
    if (partialMatch) return partialMatch.azureVoiceId;

    // Fallback to default
    return language === 'korean' ? 'ko-KR-SunHiNeural' : 'nova';
  }

  /**
   * Check if backend TTS supports this voice
   */
  static isBackendSupported(voiceName: string, language: 'english' | 'korean'): boolean {
    return this.MAPPINGS.some(
      m => (m.browserVoice.toLowerCase() === voiceName.toLowerCase() ||
            voiceName.toLowerCase().includes(m.browserVoice.toLowerCase())) &&
           m.language === language &&
           m.quality === 'high'
    );
  }
}
```

**Update ProfessionalAudioPlayer.tsx:**
```typescript
import { VoiceMappingService } from '../../services/VoiceMappingService';

// In loadAudio function:
const azureVoice = selectedVoiceIndex >= 0 && availableVoices[selectedVoiceIndex]
  ? VoiceMappingService.getAzureVoice(availableVoices[selectedVoiceIndex].name, language)
  : (language === 'korean' ? 'ko-KR-SunHiNeural' : 'nova');

const response = await fetch('http://localhost:3001/api/text-to-speech', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    text: cleanTextForTTS(text),
    language: language === 'korean' ? 'korean' : 'english',
    voice: azureVoice,  // ✅ Now sends correct Azure voice ID
    speed: playbackSpeed,
    childSafe
  })
});
```

---

#### **Fix 1.3: Mixed-Language Text Splitting** (Flaw #5)

**Create new file:** `backend/utils/languageSplitter.js`

```javascript
/**
 * Split mixed-language text into segments
 * @param {string} text - Text containing English and/or Korean
 * @returns {Array<{text: string, language: 'english'|'korean'}>} - Segmented text
 */
function splitMixedLanguageText(text) {
  const segments = [];
  let currentSegment = '';
  let currentLanguage = null;

  // Korean unicode ranges: Hangul syllables (AC00-D7AF), Jamo (1100-11FF, 3130-318F, A960-A97F)
  const koreanRegex = /[\u1100-\u11FF\u3130-\u318F\uA960-\uA97F\uAC00-\uD7AF]/;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const isKorean = koreanRegex.test(char);
    const charLanguage = isKorean ? 'korean' : 'english';

    // Whitespace and punctuation - keep with previous segment
    if (/[\s.,!?;:]/.test(char)) {
      currentSegment += char;
      continue;
    }

    // Language change - start new segment
    if (currentLanguage !== null && currentLanguage !== charLanguage) {
      if (currentSegment.trim().length > 0) {
        segments.push({ text: currentSegment.trim(), language: currentLanguage });
      }
      currentSegment = char;
      currentLanguage = charLanguage;
    } else {
      // Same language - continue current segment
      currentSegment += char;
      currentLanguage = charLanguage;
    }
  }

  // Add final segment
  if (currentSegment.trim().length > 0) {
    segments.push({ text: currentSegment.trim(), language: currentLanguage });
  }

  return segments;
}

/**
 * Determine if text is primarily Korean (>30% Korean characters)
 */
function isPrimarilyKorean(text) {
  const koreanChars = (text.match(/[\u1100-\u11FF\u3130-\u318F\uA960-\uA97F\uAC00-\uD7AF]/g) || []).length;
  const totalChars = text.replace(/\s/g, '').length;
  return totalChars > 0 && (koreanChars / totalChars) > 0.3;
}

module.exports = { splitMixedLanguageText, isPrimarilyKorean };
```

**Update backend/server.js TTS endpoint:**
```javascript
const { splitMixedLanguageText, isPrimarilyKorean } = require('./utils/languageSplitter');

app.post('/api/text-to-speech', async (req, res) => {
  try {
    const { text, voice, speed, childSafe, language } = req.body;

    // Validate and sanitize
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    // Child safety check
    if (childSafe !== false) {
      const safetyCheck = validateChildContent(text);
      if (!safetyCheck.isAppropriate) {
        return res.status(400).json({ error: 'Content not appropriate for children' });
      }
    }

    // Determine language strategy
    const hasKorean = /[\u1100-\u11FF\u3130-\u318F\uA960-\uA97F\uAC00-\uD7AF]/.test(text);
    const hasEnglish = /[a-zA-Z]/.test(text);
    const isMixedLanguage = hasKorean && hasEnglish;

    // CASE 1: Pure Korean text
    if (hasKorean && !hasEnglish) {
      console.log('🇰🇷 Pure Korean text - using Azure Speech Services');
      return await generateKoreanTTS(text, speed, res);
    }

    // CASE 2: Pure English text
    if (hasEnglish && !hasKorean) {
      console.log('🇺🇸 Pure English text - using Azure OpenAI TTS');
      return await generateEnglishTTS(text, voice, speed, res);
    }

    // CASE 3: Mixed language text - split and sequence
    if (isMixedLanguage) {
      console.log('🌐 Mixed language text - splitting and sequencing');
      return await generateMixedLanguageTTS(text, voice, speed, res);
    }

    // Fallback
    return await generateEnglishTTS(text, voice, speed, res);

  } catch (error) {
    console.error('❌ TTS generation failed:', error);
    res.status(500).json({ error: 'Speech generation failed', details: error.message });
  }
});

/**
 * NEW FUNCTION: Generate TTS for mixed-language text
 */
async function generateMixedLanguageTTS(text, voice, speed, res) {
  try {
    const segments = splitMixedLanguageText(text);
    console.log(`🌐 Split into ${segments.length} segments:`, segments.map(s => `${s.language}: "${s.text}"`));

    const audioSegments = [];

    for (const segment of segments) {
      let audioBase64;

      if (segment.language === 'korean') {
        // Generate Korean audio using Azure Speech
        const koreanAudio = await generateKoreanAudio(segment.text, speed);
        audioBase64 = koreanAudio;
      } else {
        // Generate English audio using Azure OpenAI
        const englishAudio = await generateEnglishAudio(segment.text, voice, speed);
        audioBase64 = englishAudio;
      }

      audioSegments.push({
        text: segment.text,
        language: segment.language,
        audio: audioBase64
      });
    }

    console.log(`✅ Generated ${audioSegments.length} audio segments`);

    // Return segments for frontend to sequence playback
    res.json({
      success: true,
      mixed: true,
      segments: audioSegments,
      totalSegments: audioSegments.length,
      childSafe: true,
      provider: 'Mixed (Azure OpenAI + Azure Speech)'
    });

  } catch (error) {
    console.error('❌ Mixed language TTS failed:', error);
    res.status(500).json({ error: 'Mixed language TTS failed', details: error.message });
  }
}

/**
 * Helper: Generate Korean audio (returns base64)
 */
async function generateKoreanAudio(text, speed) {
  const speechKey = process.env.AZURE_SPEECH_KEY;
  const speechRegion = process.env.AZURE_SPEECH_REGION;

  const speechConfig = speechSdk.SpeechConfig.fromSubscription(speechKey, speechRegion);
  speechConfig.speechSynthesisVoiceName = 'ko-KR-SunHiNeural';
  speechConfig.speechSynthesisOutputFormat = speechSdk.SpeechSynthesisOutputFormat.Audio24Khz96KBitRateMonoMp3;

  const adjustedSpeed = speed || 1.0;
  const ssml = `
    <speak version="1.0" xml:lang="ko-KR">
      <prosody rate="${adjustedSpeed}" pitch="+3%">
        ${text}
      </prosody>
    </speak>
  `;

  const synthesizer = new speechSdk.SpeechSynthesizer(speechConfig);

  const result = await new Promise((resolve, reject) => {
    synthesizer.speakSsmlAsync(ssml,
      (result) => { synthesizer.close(); resolve(result); },
      (error) => { synthesizer.close(); reject(error); }
    );
  });

  if (result.reason === speechSdk.ResultReason.SynthesizingAudioCompleted) {
    return Buffer.from(result.audioData).toString('base64');
  } else {
    throw new Error('Korean speech synthesis failed');
  }
}

/**
 * Helper: Generate English audio (returns base64)
 */
async function generateEnglishAudio(text, voice, speed) {
  const apiKey = process.env.AZURE_OPENAI_API_KEY;
  const ttsServiceBase = process.env.TTS_SERVICE_API_BASE;
  const ttsDeployment = 'gpt-4o-mini-tts-2';

  const availableVoices = ['alloy', 'ash', 'ballad', 'coral', 'echo', 'fable', 'nova', 'onyx', 'sage', 'shimmer'];
  const selectedVoice = voice && availableVoices.includes(voice.toLowerCase()) ? voice.toLowerCase() : 'nova';

  const ttsUrl = `${ttsServiceBase}/openai/deployments/${ttsDeployment}/audio/speech?api-version=2025-03-01-preview`;
  const fetch = (await import('node-fetch')).default;

  const response = await fetch(ttsUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: ttsDeployment,
      input: text,
      voice: selectedVoice,
      speed: speed || 1.0
    })
  });

  if (!response.ok) {
    throw new Error(`Azure OpenAI TTS failed: ${response.status}`);
  }

  const audioBuffer = await response.buffer();
  return audioBuffer.toString('base64');
}
```

**Frontend Update:** `ProfessionalAudioPlayer.tsx`

```typescript
// Handle mixed-language response
const result = await response.json();

if (result.mixed && result.segments) {
  // Sequence playback of multiple segments
  await playAudioSegments(result.segments);
} else if (result.success && result.audio) {
  // Single audio playback
  cacheService.set(text, language, selectedVoice, result.audio);
  audioRef.current.src = result.audio;
}

/**
 * Play audio segments sequentially
 */
async function playAudioSegments(segments: Array<{text: string, language: string, audio: string}>) {
  for (const segment of segments) {
    await new Promise<void>((resolve, reject) => {
      if (!audioRef.current) {
        reject(new Error('Audio element not found'));
        return;
      }

      audioRef.current.src = `data:audio/mp3;base64,${segment.audio}`;
      audioRef.current.onended = () => resolve();
      audioRef.current.onerror = () => reject(new Error('Segment playback failed'));
      audioRef.current.play().catch(reject);
    });
  }
}
```

---

### **Phase 2: Reliability & UX Improvements**

#### **Fix 2.1: Promise-Based Voice Loading** (Flaw #2)

**Update ProfessionalAudioPlayer.tsx:**

```typescript
/**
 * Load voices with Promise-based retry logic
 */
const loadVoicesAsync = useCallback((): Promise<SpeechSynthesisVoice[]> => {
  return new Promise((resolve) => {
    const voices = window.speechSynthesis.getVoices();

    if (voices.length > 0) {
      console.log('🎵 Voices loaded immediately:', voices.length);
      resolve(voices);
      return;
    }

    console.log('🎵 Voices not loaded, waiting for onvoiceschanged event...');

    // Set up event listener
    const handleVoicesChanged = () => {
      const newVoices = window.speechSynthesis.getVoices();
      console.log('🎵 Voices loaded via event:', newVoices.length);
      window.speechSynthesis.onvoiceschanged = null; // Cleanup
      resolve(newVoices);
    };

    window.speechSynthesis.onvoiceschanged = handleVoicesChanged;

    // Timeout fallback (some browsers never fire event)
    setTimeout(() => {
      const fallbackVoices = window.speechSynthesis.getVoices();
      if (fallbackVoices.length > 0) {
        console.log('🎵 Voices loaded via timeout:', fallbackVoices.length);
        window.speechSynthesis.onvoiceschanged = null;
        resolve(fallbackVoices);
      }
    }, 2000);
  });
}, []);

// Initialize voices on mount
useEffect(() => {
  let mounted = true;

  async function initVoices() {
    setIsLoading(true);
    try {
      const voices = await loadVoicesAsync();

      if (!mounted) return;

      const filteredVoices = voices.filter(voice =>
        language === 'korean' ? voice.lang.startsWith('ko') : voice.lang.startsWith('en')
      );

      console.log(`🎵 Filtered ${language} voices:`, filteredVoices.length);
      setAvailableVoices(filteredVoices);

      if (selectedVoiceIndex === -1 && filteredVoices.length > 0) {
        const bestVoiceIndex = findBestVoiceIndex(filteredVoices, language);
        setSelectedVoiceIndex(bestVoiceIndex);
      }

      setIsLoading(false);
    } catch (error) {
      console.error('🎵 Voice loading failed:', error);
      setError('Voice loading failed');
      setIsLoading(false);
    }
  }

  initVoices();

  return () => {
    mounted = false;
  };
}, [language]); // Remove selectedVoiceIndex from dependencies
```

---

#### **Fix 2.2: Retry Logic with Exponential Backoff** (Flaw #6)

**Create utility:** `reading_webapp/src/utils/retryWithBackoff.ts`

```typescript
interface RetryOptions {
  maxRetries?: number;
  initialDelay?: number;
  maxDelay?: number;
  backoffFactor?: number;
  onRetry?: (attempt: number, error: Error) => void;
}

/**
 * Retry async function with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxRetries = 3,
    initialDelay = 100,
    maxDelay = 5000,
    backoffFactor = 2,
    onRetry
  } = options;

  let lastError: Error;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      if (attempt < maxRetries) {
        const delay = Math.min(initialDelay * Math.pow(backoffFactor, attempt), maxDelay);
        console.log(`🔄 Retry attempt ${attempt + 1}/${maxRetries} after ${delay}ms`);

        onRetry?.(attempt + 1, lastError);

        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError!;
}

/**
 * Fetch with timeout
 */
export async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeoutMs: number = 10000
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}
```

**Update loadAudio function:**

```typescript
import { retryWithBackoff, fetchWithTimeout } from '../../utils/retryWithBackoff';

const loadAudio = useCallback(async (forceRefresh = false) => {
  if (!enabled || !text.trim()) return;

  try {
    setIsLoading(true);
    setError(null);

    // Check cache first
    const selectedVoice = availableVoices[selectedVoiceIndex];
    const voiceId = selectedVoice ? VoiceMappingService.getAzureVoice(selectedVoice.name, language) : null;

    if (!forceRefresh && voiceId) {
      const cached = cacheService.get(text, language, voiceId);
      if (cached && audioRef.current) {
        audioRef.current.src = cached;
        setIsLoading(false);
        return;
      }
    }

    // Try backend TTS with retry
    try {
      const result = await retryWithBackoff(
        async () => {
          const response = await fetchWithTimeout(
            'http://localhost:3001/api/text-to-speech',
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                text: cleanTextForTTS(text),
                language: language === 'korean' ? 'korean' : 'english',
                voice: voiceId || (language === 'korean' ? 'ko-KR-SunHiNeural' : 'nova'),
                speed: playbackSpeed,
                childSafe
              })
            },
            10000 // 10 second timeout
          );

          if (!response.ok) {
            throw new Error(`TTS API error: ${response.status}`);
          }

          return response.json();
        },
        {
          maxRetries: 3,
          initialDelay: 100,
          onRetry: (attempt, error) => {
            console.log(`🔄 TTS retry ${attempt}/3:`, error.message);
            setError(`Retrying... (${attempt}/3)`);
          }
        }
      );

      if (result.success && result.audio && audioRef.current && voiceId) {
        cacheService.set(text, language, voiceId, result.audio);
        audioRef.current.src = result.audio;
        setIsLoading(false);
        setError(null);
        return;
      }
    } catch (backendError) {
      console.log('🎵 Backend TTS failed after retries, using browser TTS fallback');
      setError(null); // Clear retry messages
    }

    // Browser TTS fallback
    setIsLoading(false);

  } catch (error) {
    console.error('🎵 Audio loading failed:', error);
    setError('Audio loading failed');
    setIsLoading(false);
  }
}, [text, language, childSafe, enabled, playbackSpeed, availableVoices, selectedVoiceIndex]);
```

---

#### **Fix 2.3: Auto-Reload on Blend Level Change** (Flaw #8)

**Update ProfessionalAudioPlayer.tsx:**

```typescript
// Track previous text to detect changes
const prevTextRef = useRef<string>(text);

useEffect(() => {
  const textChanged = prevTextRef.current !== text;

  if (textChanged && enabled) {
    console.log('🎵 Text changed, reloading audio...');

    // Stop current playback
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (currentUtterance) {
      window.speechSynthesis.cancel();
      setCurrentUtterance(null);
    }

    // Reset state
    setIsPlaying(false);
    setPlaybackProgress(0);
    setStartTime(null);

    // Pre-load new audio
    loadAudio(true); // Force refresh for new text

    prevTextRef.current = text;
  }
}, [text, enabled, loadAudio, currentUtterance]);
```

---

### **Phase 3: UX Polish**

#### **Fix 3.1: Pre-Generate Audio on Voice Change** (Flaw #4)

```typescript
const handleVoiceChange = async (voiceIndex: number) => {
  console.log('🎵 Voice changed from', selectedVoiceIndex, 'to', voiceIndex);

  // FORCE STOP ALL AUDIO
  if (audioRef.current) {
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    audioRef.current.src = '';
    audioRef.current.load();
  }
  if (currentUtterance) {
    window.speechSynthesis.cancel();
    setCurrentUtterance(null);
  }
  window.speechSynthesis.cancel();

  // RESET STATE
  setIsPlaying(false);
  setPlaybackProgress(0);
  setStartTime(null);
  setError(null);

  // UPDATE VOICE
  setSelectedVoiceIndex(voiceIndex);
  setShowVoiceSelector(false);

  // PRE-GENERATE AUDIO WITH NEW VOICE
  setIsLoading(true);
  try {
    await loadAudio(true); // Force refresh with new voice
    setIsLoading(false);
    setError(`Voice changed to ${availableVoices[voiceIndex].name} - click play to hear`);
    // Clear success message after 3 seconds
    setTimeout(() => setError(null), 3000);
  } catch (error) {
    setIsLoading(false);
    setError('Failed to load audio with new voice');
  }

  if (onUsageTracked) {
    onUsageTracked({ action: 'voice_changed', success: true });
  }
};
```

---

#### **Fix 3.2: Persist Voice Preference** (Flaw #7)

**Create service:** `reading_webapp/src/services/VoicePreferenceService.ts`

```typescript
interface VoicePreference {
  english: string | null;  // Voice name, not index
  korean: string | null;
}

export class VoicePreferenceService {
  private static readonly STORAGE_KEY = 'readquest_voice_preferences';

  static getPreference(language: 'english' | 'korean'): string | null {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) return null;

      const prefs: VoicePreference = JSON.parse(stored);
      return prefs[language] || null;
    } catch {
      return null;
    }
  }

  static setPreference(language: 'english' | 'korean', voiceName: string): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      const prefs: VoicePreference = stored ? JSON.parse(stored) : { english: null, korean: null };

      prefs[language] = voiceName;
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(prefs));

      console.log(`💾 Saved ${language} voice preference:`, voiceName);
    } catch (error) {
      console.warn('Failed to save voice preference:', error);
    }
  }
}
```

**Update ProfessionalAudioPlayer.tsx:**

```typescript
import { VoicePreferenceService } from '../../services/VoicePreferenceService';

// When voices load, check for saved preference
useEffect(() => {
  if (availableVoices.length > 0 && selectedVoiceIndex === -1) {
    const savedVoiceName = VoicePreferenceService.getPreference(language);

    if (savedVoiceName) {
      const savedIndex = availableVoices.findIndex(v => v.name === savedVoiceName);
      if (savedIndex !== -1) {
        console.log('🎵 Restored saved voice preference:', savedVoiceName);
        setSelectedVoiceIndex(savedIndex);
        return;
      }
    }

    // No saved preference or voice not found - use best voice
    const bestVoiceIndex = findBestVoiceIndex(availableVoices, language);
    setSelectedVoiceIndex(bestVoiceIndex);
  }
}, [availableVoices, selectedVoiceIndex, language]);

// Save preference when voice changes
const handleVoiceChange = async (voiceIndex: number) => {
  // ... existing stop and reset code ...

  setSelectedVoiceIndex(voiceIndex);

  // Save preference
  VoicePreferenceService.setPreference(language, availableVoices[voiceIndex].name);

  // ... rest of existing code ...
};
```

---

#### **Fix 3.3: Clear Utterance Queue** (Flaw #10)

```typescript
const togglePlayback = useCallback(async () => {
  if (!enabled) return;

  if (isPlaying) {
    // AGGRESSIVE STOP - Clear all queues
    window.speechSynthesis.cancel();

    // Force multiple cancel calls (browser inconsistency workaround)
    for (let i = 0; i < 3; i++) {
      setTimeout(() => window.speechSynthesis.cancel(), i * 10);
    }

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    setCurrentUtterance(null);
    setIsPlaying(false);
    setPlaybackProgress(0);
    setStartTime(null);

  } else {
    // BEFORE PLAYING - Ensure queue is 100% clear
    window.speechSynthesis.cancel();
    await new Promise(resolve => setTimeout(resolve, 50)); // Wait for queue clear

    try {
      setIsLoading(true);

      // Try backend audio
      if (!audioRef.current?.src) {
        await loadAudio(true);
      }

      if (audioRef.current?.src) {
        // Backend TTS
        audioRef.current.playbackRate = playbackSpeed;
        await audioRef.current.play();
        setIsPlaying(true);
        setStartTime(Date.now());
      } else if ('speechSynthesis' in window && availableVoices.length > 0) {
        // Browser TTS - Create NEW utterance (don't reuse)
        const utterance = new SpeechSynthesisUtterance(cleanTextForTTS(text));
        utterance.rate = playbackSpeed * 0.9;
        utterance.pitch = 1.0;
        utterance.volume = 0.9;

        if (selectedVoiceIndex >= 0 && availableVoices[selectedVoiceIndex]) {
          utterance.voice = availableVoices[selectedVoiceIndex];
        }

        utterance.onstart = () => {
          setIsPlaying(true);
          setStartTime(Date.now());
          setIsLoading(false);
        };

        utterance.onend = () => {
          setIsPlaying(false);
          setPlaybackProgress(0);
          setCurrentUtterance(null);
          setStartTime(null);
        };

        utterance.onerror = (event) => {
          console.error('🎵 Speech synthesis error:', event);
          setIsPlaying(false);
          setError('Voice playback failed');
          setCurrentUtterance(null);
          setIsLoading(false);
        };

        setCurrentUtterance(utterance);

        // Final queue clear before speak
        window.speechSynthesis.cancel();

        window.speechSynthesis.speak(utterance);
        console.log('🎵 Speech synthesis started with voice:', utterance.voice?.name);
      } else {
        throw new Error('No TTS service available');
      }
    } catch (error) {
      console.error('🎵 Playback error:', error);
      setError('Audio playback failed');
      setIsLoading(false);
    }
  }
}, [isPlaying, enabled, loadAudio, playbackSpeed, text, availableVoices, selectedVoiceIndex]);
```

---

## 🧪 **TESTING STRATEGY**

### **Unit Tests:**

```typescript
// AudioCacheService.test.ts
describe('AudioCacheService', () => {
  it('generates unique keys for different voices', () => {
    const service = AudioCacheService.getInstance();
    service.clearCache();

    service.set('hello', 'english', 'nova', 'audio1');
    service.set('hello', 'english', 'shimmer', 'audio2');

    expect(service.get('hello', 'english', 'nova')).toBe('audio1');
    expect(service.get('hello', 'english', 'shimmer')).toBe('audio2');
  });
});

// VoiceMappingService.test.ts
describe('VoiceMappingService', () => {
  it('maps browser voices to Azure voices', () => {
    expect(VoiceMappingService.getAzureVoice('Samantha', 'english')).toBe('nova');
    expect(VoiceMappingService.getAzureVoice('Yuna', 'korean')).toBe('ko-KR-SunHiNeural');
  });

  it('handles partial matches', () => {
    expect(VoiceMappingService.getAzureVoice('Samantha (English)', 'english')).toBe('nova');
  });
});

// languageSplitter.test.js
describe('Language Splitter', () => {
  it('splits mixed language text', () => {
    const segments = splitMixedLanguageText('Hello 안녕 world 세계');
    expect(segments).toEqual([
      { text: 'Hello', language: 'english' },
      { text: '안녕', language: 'korean' },
      { text: 'world', language: 'english' },
      { text: '세계', language: 'korean' }
    ]);
  });

  it('handles pure English', () => {
    const segments = splitMixedLanguageText('Hello world');
    expect(segments).toEqual([{ text: 'Hello world', language: 'english' }]);
  });

  it('handles pure Korean', () => {
    const segments = splitMixedLanguageText('안녕하세요');
    expect(segments).toEqual([{ text: '안녕하세요', language: 'korean' }]);
  });
});
```

### **Integration Tests:**

```typescript
describe('TTS Integration', () => {
  it('changes voice and plays correct audio', async () => {
    const { getByRole, getByText } = render(<ProfessionalAudioPlayer {...props} />);

    // Select voice
    const voiceButton = getByText('🎙️ Voice');
    fireEvent.click(voiceButton);

    const shimmerVoice = getByText(/Shimmer/);
    fireEvent.click(shimmerVoice);

    // Play
    const playButton = getByRole('button', { name: /play/i });
    fireEvent.click(playButton);

    // Verify correct voice sent to backend
    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: expect.stringContaining('"voice":"shimmer"')
        })
      );
    });
  });
});
```

---

## 📊 **MONITORING & ROLLOUT**

### **Key Metrics to Track:**
1. **TTS Success Rate:** % of successful TTS generations vs failures
2. **Cache Hit Rate:** % of audio served from cache
3. **Voice Change Frequency:** How often users change voices
4. **Fallback Rate:** % of times browser TTS used vs backend
5. **Average Load Time:** Time from click to audio playback

### **Rollout Plan:**
1. **Phase 1 (Week 1):** Deploy critical fixes (#1, #3, #5) to staging
2. **Phase 2 (Week 2):** User testing with 10 beta users
3. **Phase 3 (Week 3):** Deploy to 50% of users (A/B test)
4. **Phase 4 (Week 4):** Full rollout if metrics good

---

## ❓ **OPEN QUESTIONS FOR USER**

1. **Mixed-Language Playback:** For blend level 5 (50% English / 50% Korean):
   - Should we play sequentially (English segment, then Korean segment)?
   - Should we attempt to use a single voice that handles both (lower quality)?

2. **Voice Preference Scope:**
   - Should voice preference be global (same voice for all stories)?
   - Or per-grade-level (different voice for 3rd grade vs 6th grade)?

3. **Auto-Play Behavior:**
   - When blend level changes, should audio auto-play with new text?
   - Or require manual play button click?

4. **Offline Support:**
   - Should we prioritize browser TTS (works offline) over backend (better quality)?
   - Or always try backend first?

---

**Status:** Ready for Review and Implementation
**Next Step:** Get answers to open questions, then begin Phase 1 implementation
