#!/bin/bash

# Test script for Azure OpenAI TTS API

echo "🧪 Testing Azure OpenAI TTS Endpoint"
echo "===================================="
echo ""

# Test 1: Get available voices
echo "📋 Test 1: Fetching available voices..."
curl -s -X GET "http://localhost:3001/api/voices" | jq '.'
echo ""

# Test 2: Generate speech with Nova voice (default)
echo "🎤 Test 2: Generating speech with Nova voice..."
curl -s -X POST "http://localhost:3001/api/text-to-speech" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Hello, this is a test of the Azure text to speech system using the Nova voice.",
    "voice": "nova",
    "speed": 1.0,
    "childSafe": true
  }' | jq '{success, voice, duration, childSafe, availableVoices}'
echo ""

# Test 3: Generate speech with Shimmer voice (child-friendly)
echo "🎤 Test 3: Generating speech with Shimmer voice..."
curl -s -X POST "http://localhost:3001/api/text-to-speech" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "The quick brown fox jumps over the lazy dog.",
    "voice": "shimmer",
    "speed": 1.0,
    "childSafe": true
  }' | jq '{success, voice, duration, childSafe}'
echo ""

# Test 4: Generate speech with Fable voice (storytelling)
echo "🎤 Test 4: Generating speech with Fable voice..."
curl -s -X POST "http://localhost:3001/api/text-to-speech" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Once upon a time, in a land far away, there lived a brave little mouse.",
    "voice": "fable",
    "speed": 0.9,
    "childSafe": true
  }' | jq '{success, voice, duration, childSafe}'
echo ""

# Test 5: Test with invalid voice (should fallback to nova)
echo "🎤 Test 5: Testing fallback with invalid voice..."
curl -s -X POST "http://localhost:3001/api/text-to-speech" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "This should use the default Nova voice.",
    "voice": "invalid_voice",
    "speed": 1.0,
    "childSafe": true
  }' | jq '{success, voice, duration, childSafe}'
echo ""

echo "✅ All tests completed!"
