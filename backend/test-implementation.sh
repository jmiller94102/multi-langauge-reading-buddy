#!/bin/bash

# Automated TTS Implementation Verification Tests
# Tests all fixes and verifies multilingual support

echo "🧪 TTS Implementation Verification Tests"
echo "=========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

PASSED=0
FAILED=0

# Test function
run_test() {
  local test_name="$1"
  local test_command="$2"
  local expected_pattern="$3"

  echo -n "Testing: $test_name... "

  result=$(eval "$test_command" 2>&1)

  if echo "$result" | grep -q "$expected_pattern"; then
    echo -e "${GREEN}✅ PASSED${NC}"
    ((PASSED++))
    return 0
  else
    echo -e "${RED}❌ FAILED${NC}"
    echo "   Expected pattern: $expected_pattern"
    echo "   Got: $result" | head -3
    ((FAILED++))
    return 1
  fi
}

echo "🔧 Backend API Tests"
echo "--------------------"

# Test 1: Health check
run_test "Backend health check" \
  "curl -s http://localhost:3001/api/health" \
  '"status":"ok"'

# Test 2: Voices endpoint
run_test "Get available voices" \
  "curl -s http://localhost:3001/api/voices" \
  '"success":true'

run_test "Voice list includes nova" \
  "curl -s http://localhost:3001/api/voices" \
  '"id":"nova"'

run_test "Voice list includes shimmer" \
  "curl -s http://localhost:3001/api/voices" \
  '"id":"shimmer"'

echo ""
echo "🌐 Multilingual TTS Tests"
echo "-------------------------"

# Test 3: Pure English
run_test "Pure English TTS" \
  "curl -s -X POST http://localhost:3001/api/text-to-speech -H 'Content-Type: application/json' -d '{\"text\":\"Hello world\",\"voice\":\"nova\"}'" \
  '"success":true'

# Test 4: Pure Korean
run_test "Pure Korean TTS" \
  "curl -s -X POST http://localhost:3001/api/text-to-speech -H 'Content-Type: application/json' -d '{\"text\":\"안녕하세요\",\"voice\":\"nova\"}'" \
  '"success":true'

# Test 5: Mixed language
run_test "Mixed English+Korean TTS" \
  "curl -s -X POST http://localhost:3001/api/text-to-speech -H 'Content-Type: application/json' -d '{\"text\":\"Hello 안녕 world 세계\",\"voice\":\"nova\"}'" \
  '"success":true'

echo ""
echo "🎤 Voice Selection Tests"
echo "------------------------"

# Test 6: Different voices
for voice in "nova" "shimmer" "fable" "coral"; do
  run_test "Voice: $voice" \
    "curl -s -X POST http://localhost:3001/api/text-to-speech -H 'Content-Type: application/json' -d '{\"text\":\"Testing voice\",\"voice\":\"$voice\"}'" \
    "\"voice\":\"$voice\""
done

echo ""
echo "🔀 Voice Mapping Tests"
echo "----------------------"

# Test 7: Browser voice names (smart matching)
run_test "Browser voice: samantha" \
  "curl -s -X POST http://localhost:3001/api/text-to-speech -H 'Content-Type: application/json' -d '{\"text\":\"Test\",\"voice\":\"samantha\"}'" \
  '"success":true'

run_test "Unknown voice fallback to nova" \
  "curl -s -X POST http://localhost:3001/api/text-to-speech -H 'Content-Type: application/json' -d '{\"text\":\"Test\",\"voice\":\"unknown123\"}'" \
  '"voice":"nova"'

echo ""
echo "🌍 Language Detection Tests"
echo "---------------------------"

# Test 8: Language detection in response
run_test "English detected as 'english'" \
  "curl -s -X POST http://localhost:3001/api/text-to-speech -H 'Content-Type: application/json' -d '{\"text\":\"Hello\",\"voice\":\"nova\"}'" \
  '"language":"english"'

run_test "Korean detected as 'korean'" \
  "curl -s -X POST http://localhost:3001/api/text-to-speech -H 'Content-Type: application/json' -d '{\"text\":\"안녕\",\"voice\":\"nova\"}'" \
  '"language":"korean"'

run_test "Mixed detected as 'mixed'" \
  "curl -s -X POST http://localhost:3001/api/text-to-speech -H 'Content-Type: application/json' -d '{\"text\":\"Hello 안녕\",\"voice\":\"nova\"}'" \
  '"language":"mixed"'

echo ""
echo "⚡ Performance Tests"
echo "--------------------"

# Test 9: Speed control
run_test "Speed 0.5x" \
  "curl -s -X POST http://localhost:3001/api/text-to-speech -H 'Content-Type: application/json' -d '{\"text\":\"Test\",\"voice\":\"nova\",\"speed\":0.5}'" \
  '"success":true'

run_test "Speed 1.5x" \
  "curl -s -X POST http://localhost:3001/api/text-to-speech -H 'Content-Type: application/json' -d '{\"text\":\"Test\",\"voice\":\"nova\",\"speed\":1.5}'" \
  '"success":true'

echo ""
echo "🛡️ Error Handling Tests"
echo "------------------------"

# Test 10: Missing text
run_test "Missing text parameter" \
  "curl -s -X POST http://localhost:3001/api/text-to-speech -H 'Content-Type: application/json' -d '{\"voice\":\"nova\"}'" \
  '"error":"Text is required"'

# Test 11: Empty text
run_test "Empty text handling" \
  "curl -s -X POST http://localhost:3001/api/text-to-speech -H 'Content-Type: application/json' -d '{\"text\":\"\",\"voice\":\"nova\"}'" \
  '"error":"Text is required"'

echo ""
echo "=========================================="
echo -e "📊 Test Results:"
echo -e "   ${GREEN}Passed: $PASSED${NC}"
echo -e "   ${RED}Failed: $FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
  echo -e "${GREEN}✅ All tests passed!${NC}"
  echo ""
  echo "🎯 Implementation verified successfully!"
  echo ""
  echo "📋 Manual Testing Checklist:"
  echo "1. Open http://localhost:5173 in browser"
  echo "2. Generate a story with blend level 0 (English)"
  echo "3. Click play → Verify audio plays"
  echo "4. Change voice to 'Shimmer'"
  echo "5. Click play → Verify different voice"
  echo "6. Move blend slider to level 5"
  echo "7. Verify audio auto-loads"
  echo "8. Refresh page → Verify voice still 'Shimmer'"
  echo ""
  exit 0
else
  echo -e "${RED}❌ Some tests failed. Review errors above.${NC}"
  exit 1
fi
