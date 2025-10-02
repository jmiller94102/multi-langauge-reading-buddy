#!/bin/bash

# Direct test of Azure OpenAI TTS multilingual capabilities
# Bypasses backend to test the raw Azure API

echo "🧪 Testing Azure OpenAI TTS Multilingual Support (Direct API)"
echo "=============================================================="
echo ""

# Load environment variables
source ../.env

if [ -z "$AZURE_OPENAI_API_KEY" ] || [ -z "$TTS_SERVICE_API_BASE" ]; then
  echo "❌ Error: Azure OpenAI credentials not found in .env"
  exit 1
fi

AZURE_ENDPOINT="${TTS_SERVICE_API_BASE}/openai/deployments/gpt-4o-mini-tts-2/audio/speech?api-version=2025-03-01-preview"

echo "🔑 Using Azure endpoint: ${TTS_SERVICE_API_BASE}"
echo ""

# Test 1: Pure English
echo "📋 Test 1: Pure English (Nova voice)"
echo "Text: 'Hello, this is a test of multilingual text to speech.'"
curl -s -X POST "$AZURE_ENDPOINT" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${AZURE_OPENAI_API_KEY}" \
  -d '{
    "model": "gpt-4o-mini-tts-2",
    "input": "Hello, this is a test of multilingual text to speech.",
    "voice": "nova",
    "speed": 1.0
  }' \
  --output /tmp/test1_english.mp3

if [ -f /tmp/test1_english.mp3 ]; then
  SIZE=$(wc -c < /tmp/test1_english.mp3)
  if [ $SIZE -gt 1000 ]; then
    echo "✅ English TTS succeeded (${SIZE} bytes)"
    echo "🎵 Play: afplay /tmp/test1_english.mp3"
  else
    echo "❌ English TTS failed (file too small: ${SIZE} bytes)"
    cat /tmp/test1_english.mp3
  fi
else
  echo "❌ English TTS failed (no file created)"
fi
echo ""

# Test 2: Pure Korean
echo "📋 Test 2: Pure Korean (Nova voice speaking Korean)"
echo "Text: '안녕하세요. 저는 한국어를 말할 수 있습니다.'"
curl -s -X POST "$AZURE_ENDPOINT" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${AZURE_OPENAI_API_KEY}" \
  -d '{
    "model": "gpt-4o-mini-tts-2",
    "input": "안녕하세요. 저는 한국어를 말할 수 있습니다.",
    "voice": "nova",
    "speed": 1.0
  }' \
  --output /tmp/test2_korean.mp3

if [ -f /tmp/test2_korean.mp3 ]; then
  SIZE=$(wc -c < /tmp/test2_korean.mp3)
  if [ $SIZE -gt 1000 ]; then
    echo "✅ Korean TTS succeeded (${SIZE} bytes)"
    echo "🎵 Play: afplay /tmp/test2_korean.mp3"
  else
    echo "❌ Korean TTS failed (file too small: ${SIZE} bytes)"
    cat /tmp/test2_korean.mp3
  fi
else
  echo "❌ Korean TTS failed (no file created)"
fi
echo ""

# Test 3: Mixed English + Korean (the critical test!)
echo "📋 Test 3: Mixed English+Korean (Nova voice switching languages)"
echo "Text: 'The brave 소년 went to the 공원 with his friend 친구. They played together.'"
curl -s -X POST "$AZURE_ENDPOINT" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${AZURE_OPENAI_API_KEY}" \
  -d '{
    "model": "gpt-4o-mini-tts-2",
    "input": "The brave 소년 went to the 공원 with his friend 친구. They played together.",
    "voice": "nova",
    "speed": 1.0
  }' \
  --output /tmp/test3_mixed.mp3

if [ -f /tmp/test3_mixed.mp3 ]; then
  SIZE=$(wc -c < /tmp/test3_mixed.mp3)
  if [ $SIZE -gt 1000 ]; then
    echo "✅ Mixed language TTS succeeded (${SIZE} bytes)"
    echo "🎵 Play: afplay /tmp/test3_mixed.mp3"
  else
    echo "❌ Mixed language TTS failed (file too small: ${SIZE} bytes)"
    cat /tmp/test3_mixed.mp3
  fi
else
  echo "❌ Mixed language TTS failed (no file created)"
fi
echo ""

# Test 4: Different voice (Shimmer) with Korean
echo "📋 Test 4: Korean with Shimmer voice (different voice personality)"
echo "Text: '안녕하세요. 이것은 시머 보이스 테스트입니다.'"
curl -s -X POST "$AZURE_ENDPOINT" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${AZURE_OPENAI_API_KEY}" \
  -d '{
    "model": "gpt-4o-mini-tts-2",
    "input": "안녕하세요. 이것은 시머 보이스 테스트입니다.",
    "voice": "shimmer",
    "speed": 1.0
  }' \
  --output /tmp/test4_korean_shimmer.mp3

if [ -f /tmp/test4_korean_shimmer.mp3 ]; then
  SIZE=$(wc -c < /tmp/test4_korean_shimmer.mp3)
  if [ $SIZE -gt 1000 ]; then
    echo "✅ Korean TTS with Shimmer voice succeeded (${SIZE} bytes)"
    echo "🎵 Play: afplay /tmp/test4_korean_shimmer.mp3"
  else
    echo "❌ Korean TTS with Shimmer failed (file too small: ${SIZE} bytes)"
    cat /tmp/test4_korean_shimmer.mp3
  fi
else
  echo "❌ Korean TTS with Shimmer failed (no file created)"
fi
echo ""

echo "=============================================================="
echo "🎧 QUALITY EVALUATION:"
echo ""
echo "Now listen to each audio file and rate the quality:"
echo ""
echo "1. English (baseline quality):"
echo "   afplay /tmp/test1_english.mp3"
echo ""
echo "2. Pure Korean (Nova voice):"
echo "   afplay /tmp/test2_korean.mp3"
echo ""
echo "3. Mixed English+Korean (Nova voice) - THE CRITICAL TEST:"
echo "   afplay /tmp/test3_mixed.mp3"
echo ""
echo "4. Pure Korean (Shimmer voice):"
echo "   afplay /tmp/test4_korean_shimmer.mp3"
echo ""
echo "❓ DECISION CRITERIA:"
echo ""
echo "✅ If Test 2 & 3 sound good → Use single voice (Azure OpenAI TTS only)"
echo "   - Pros: Simple architecture, no text splitting, voice changes work perfectly"
echo "   - Cons: Korean pronunciation may not be native-quality"
echo ""
echo "❌ If Test 2 & 3 sound poor → Keep dual-service architecture"
echo "   - Pros: Best quality for each language"
echo "   - Cons: Complex implementation, text splitting required"
echo ""
echo "Run this test and report back with your quality assessment!"
echo "=============================================================="
