#!/bin/bash

# Test GPT-4o-mini-TTS multilingual capabilities
# Tests: Pure English, Pure Korean, Mixed English+Korean

echo "🧪 Testing GPT-4o-mini-TTS Multilingual Capabilities"
echo "===================================================="
echo ""

# Test 1: Pure English
echo "📋 Test 1: Pure English Text"
curl -s -X POST "http://localhost:3001/api/text-to-speech" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Hello, this is a test of the Azure OpenAI text to speech system.",
    "voice": "nova",
    "speed": 1.0,
    "language": "english",
    "childSafe": true
  }' | jq '{success, voice, language, provider, duration}'
echo ""

# Test 2: Pure Korean
echo "📋 Test 2: Pure Korean Text (using Azure OpenAI TTS, not Azure Speech)"
curl -s -X POST "http://localhost:3001/api/text-to-speech" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "안녕하세요. 이것은 텍스트 음성 변환 시스템 테스트입니다.",
    "voice": "nova",
    "speed": 1.0,
    "language": "english",
    "childSafe": true
  }' > /tmp/korean_openai_tts.json

if cat /tmp/korean_openai_tts.json | jq -e '.success' > /dev/null 2>&1; then
  echo "✅ Korean TTS via OpenAI succeeded"
  cat /tmp/korean_openai_tts.json | jq '{success, voice, language, provider, duration}'

  # Save audio to file for manual listening
  cat /tmp/korean_openai_tts.json | jq -r '.audio' | sed 's/data:audio\/mp3;base64,//' | base64 -d > /tmp/korean_openai_test.mp3
  echo "📁 Saved audio to: /tmp/korean_openai_test.mp3"
  echo "🎵 Play with: afplay /tmp/korean_openai_test.mp3"
else
  echo "❌ Korean TTS via OpenAI failed"
  cat /tmp/korean_openai_tts.json | jq '.'
fi
echo ""

# Test 3: Mixed Language (English + Korean)
echo "📋 Test 3: Mixed English+Korean Text"
curl -s -X POST "http://localhost:3001/api/text-to-speech" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "The brave 소년 went to the 공원 with his friend. They had a wonderful adventure together.",
    "voice": "nova",
    "speed": 1.0,
    "language": "english",
    "childSafe": true
  }' > /tmp/mixed_openai_tts.json

if cat /tmp/mixed_openai_tts.json | jq -e '.success' > /dev/null 2>&1; then
  echo "✅ Mixed language TTS via OpenAI succeeded"
  cat /tmp/mixed_openai_tts.json | jq '{success, voice, language, provider, duration}'

  # Save audio to file for manual listening
  cat /tmp/mixed_openai_tts.json | jq -r '.audio' | sed 's/data:audio\/mp3;base64,//' | base64 -d > /tmp/mixed_openai_test.mp3
  echo "📁 Saved audio to: /tmp/mixed_openai_test.mp3"
  echo "🎵 Play with: afplay /tmp/mixed_openai_test.mp3"
else
  echo "❌ Mixed language TTS via OpenAI failed"
  cat /tmp/mixed_openai_tts.json | jq '.'
fi
echo ""

# Test 4: Korean via Azure Speech Services (for comparison)
echo "📋 Test 4: Pure Korean via Azure Speech Services (current implementation)"
curl -s -X POST "http://localhost:3001/api/text-to-speech" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "안녕하세요. 이것은 텍스트 음성 변환 시스템 테스트입니다.",
    "voice": "ko-KR-SunHiNeural",
    "speed": 1.0,
    "language": "korean",
    "childSafe": true
  }' > /tmp/korean_speech_tts.json

if cat /tmp/korean_speech_tts.json | jq -e '.success' > /dev/null 2>&1; then
  echo "✅ Korean TTS via Azure Speech succeeded"
  cat /tmp/korean_speech_tts.json | jq '{success, voice, language, provider, duration}'

  # Save audio to file for manual listening
  cat /tmp/korean_speech_tts.json | jq -r '.audio' | sed 's/data:audio\/mp3;base64,//' | base64 -d > /tmp/korean_speech_test.mp3
  echo "📁 Saved audio to: /tmp/korean_speech_test.mp3"
  echo "🎵 Play with: afplay /tmp/korean_speech_test.mp3"
else
  echo "❌ Korean TTS via Azure Speech failed"
  cat /tmp/korean_speech_tts.json | jq '.'
fi
echo ""

echo "===================================================="
echo "🎧 QUALITY COMPARISON INSTRUCTIONS:"
echo ""
echo "Listen to both Korean audio files and compare quality:"
echo ""
echo "1. Azure OpenAI TTS (Nova voice speaking Korean):"
echo "   afplay /tmp/korean_openai_test.mp3"
echo ""
echo "2. Azure Speech Services (ko-KR-SunHiNeural native Korean voice):"
echo "   afplay /tmp/korean_speech_test.mp3"
echo ""
echo "3. Mixed language (Nova voice switching between English and Korean):"
echo "   afplay /tmp/mixed_openai_test.mp3"
echo ""
echo "If OpenAI TTS Korean quality is acceptable, we can use a SINGLE voice"
echo "for all blend levels, eliminating the need for text segmentation!"
echo "===================================================="
