# API Contract - Reading App V2

## Overview

This document specifies the REST API contract for future backend integration of the Reading App V2. While the **MVP uses localStorage** for all persistence, this contract ensures the frontend is designed with backend migration in mind.

**Version**: 1.0
**Last Updated**: 2025-10-11
**Status**: ⏳ Planning (for post-MVP implementation)

---

## Table of Contents

1. [Base URL & Authentication](#base-url--authentication)
2. [Common Patterns](#common-patterns)
3. [User Endpoints](#user-endpoints)
4. [Pet Endpoints](#pet-endpoints)
5. [Content Generation Endpoints](#content-generation-endpoints)
6. [Progress & Analytics Endpoints](#progress--analytics-endpoints)
7. [Shop & Inventory Endpoints](#shop--inventory-endpoints)
8. [Achievement & Quest Endpoints](#achievement--quest-endpoints)
9. [Error Handling](#error-handling)
10. [Migration Strategy](#migration-strategy)
11. [Data Synchronization](#data-synchronization)

---

## Base URL & Authentication

### Base URL (Production)
```
https://api.reading-app.com/v1
```

### Base URL (Development)
```
http://localhost:8080/api/v1
```

### Authentication

**MVP**: No authentication (localStorage only)

**Post-MVP**: JWT-based authentication

```http
Authorization: Bearer <jwt_token>
```

**Auth Flow**:
1. User logs in → receives JWT token
2. Frontend stores token (localStorage or httpOnly cookie)
3. All subsequent requests include `Authorization` header
4. Token refresh via `/auth/refresh` endpoint

---

## Common Patterns

### Standard Response Envelope

**Success Response**:
```json
{
  "success": true,
  "data": { ... },
  "timestamp": 1696284000000
}
```

**Error Response**:
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid grade level",
    "details": {
      "field": "gradeLevel",
      "expected": "3rd | 4th | 5th | 6th",
      "received": "7th"
    }
  },
  "timestamp": 1696284000000
}
```

### Pagination

For list endpoints:
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 145,
    "totalPages": 8
  },
  "timestamp": 1696284000000
}
```

### Common Query Parameters

- `page` (number): Page number for pagination (default: 1)
- `limit` (number): Items per page (default: 20, max: 100)
- `sort` (string): Sort field (e.g., `createdAt`, `level`)
- `order` (string): Sort order (`asc` | `desc`)

---

## User Endpoints

### `GET /users/me`

**Description**: Get current user profile and state

**Authentication**: Required (post-MVP)

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "user-renzo-001",
    "name": "Renzo",
    "avatar": "🎓",
    "gradeLevel": "4th",
    "level": 12,
    "xp": 2450,
    "xpToNextLevel": 3000,
    "coins": 1250,
    "gems": 15,
    "streak": 7,
    "longestStreak": 12,
    "lastLoginDate": 1696284000000,
    "totalPassagesRead": 45,
    "totalQuizzesCompleted": 45,
    "totalXPEarned": 12450,
    "settings": {
      "primaryLanguage": "English",
      "secondaryLanguages": ["Korean", "Mandarin"],
      "defaultBlendLevel": 3,
      "defaultPassageLength": 500,
      "defaultGradeLevel": "4th",
      "defaultHumorLevel": 2,
      "theme": "Space",
      "soundEnabled": true,
      "musicVolume": 70,
      "sfxVolume": 80,
      "ttsEnabled": false,
      "ttsVoice": "alloy",
      "ttsSpeed": 1.0,
      "autoReadAloud": false,
      "wordHighlighting": true,
      "hintsEnabled": true,
      "romanizationEnabled": true,
      "notificationsEnabled": true,
      "dailyReminder": true,
      "dailyReminderTime": "18:00",
      "questAlerts": true,
      "petAlerts": true,
      "achievementCelebrations": true
    },
    "createdAt": 1693584000000,
    "updatedAt": 1696284000000
  },
  "timestamp": 1696284000000
}
```

---

### `PATCH /users/me`

**Description**: Update user profile and settings

**Authentication**: Required (post-MVP)

**Request Body** (partial updates allowed):
```json
{
  "name": "Renzo",
  "avatar": "🎓",
  "gradeLevel": "5th",
  "settings": {
    "theme": "Jungle",
    "defaultBlendLevel": 5
  }
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "user-renzo-001",
    "name": "Renzo",
    "avatar": "🎓",
    "gradeLevel": "5th",
    "level": 12,
    "xp": 2450,
    "xpToNextLevel": 3000,
    "coins": 1250,
    "gems": 15,
    "streak": 7,
    "longestStreak": 12,
    "lastLoginDate": 1696284000000,
    "totalPassagesRead": 45,
    "totalQuizzesCompleted": 45,
    "totalXPEarned": 12450,
    "settings": {
      "primaryLanguage": "English",
      "secondaryLanguages": ["Korean", "Mandarin"],
      "defaultBlendLevel": 5,
      "defaultPassageLength": 500,
      "defaultGradeLevel": "5th",
      "defaultHumorLevel": 2,
      "theme": "Jungle",
      "soundEnabled": true,
      "musicVolume": 70,
      "sfxVolume": 80,
      "ttsEnabled": false,
      "ttsVoice": "alloy",
      "ttsSpeed": 1.0,
      "autoReadAloud": false,
      "wordHighlighting": true,
      "hintsEnabled": true,
      "romanizationEnabled": true,
      "notificationsEnabled": true,
      "dailyReminder": true,
      "dailyReminderTime": "18:00",
      "questAlerts": true,
      "petAlerts": true,
      "achievementCelebrations": true
    },
    "createdAt": 1693584000000,
    "updatedAt": 1696284120000
  },
  "timestamp": 1696284120000
}
```

---

### `POST /users/me/xp`

**Description**: Add XP to user (called after completing reading/quiz)

**Authentication**: Required (post-MVP)

**Request Body**:
```json
{
  "xpAmount": 150,
  "source": "quiz_completed",
  "metadata": {
    "passageId": "passage-123",
    "quizScore": 4,
    "totalQuestions": 5
  }
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "previousLevel": 12,
    "newLevel": 12,
    "previousXP": 2450,
    "newXP": 2600,
    "xpGained": 150,
    "xpToNextLevel": 3000,
    "leveledUp": false,
    "coins": 1250,
    "gems": 15
  },
  "timestamp": 1696284000000
}
```

**Level Up Response**:
```json
{
  "success": true,
  "data": {
    "previousLevel": 12,
    "newLevel": 13,
    "previousXP": 2950,
    "newXP": 100,
    "xpGained": 150,
    "xpToNextLevel": 3250,
    "leveledUp": true,
    "rewards": {
      "coins": 50,
      "gems": 5
    },
    "coins": 1300,
    "gems": 20
  },
  "timestamp": 1696284000000
}
```

---

### `POST /users/me/streak`

**Description**: Update daily streak (called on login)

**Authentication**: Required (post-MVP)

**Request Body**:
```json
{
  "loginDate": 1696284000000
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "streak": 8,
    "longestStreak": 12,
    "streakMaintained": true,
    "rewards": {
      "coins": 10
    },
    "coins": 1260
  },
  "timestamp": 1696284000000
}
```

**Streak Broken Response**:
```json
{
  "success": true,
  "data": {
    "streak": 0,
    "longestStreak": 12,
    "streakMaintained": false,
    "message": "Your streak has been reset. Start a new one today!"
  },
  "timestamp": 1696284000000
}
```

---

## Pet Endpoints

### `GET /users/me/pet`

**Description**: Get current pet state

**Authentication**: Required (post-MVP)

**Response**:
```json
{
  "success": true,
  "data": {
    "name": "Flutterpuff",
    "evolutionTrack": "knowledge",
    "evolutionStage": 2,
    "evolutionStageName": "Elementary",
    "happiness": 85,
    "hunger": 45,
    "energy": 70,
    "emotion": "happy",
    "lastFed": 1696280400000,
    "lastPlayed": 1696281300000,
    "lastInteraction": 1696283000000,
    "ownedAccessories": [
      "accessory-graduation-cap",
      "accessory-glasses",
      "accessory-scarf-red"
    ],
    "equippedAccessories": [
      "accessory-graduation-cap",
      "accessory-glasses"
    ],
    "favoriteFood": "food-korean-kimchi",
    "foodsTriedHistory": [
      "food-korean-kimchi",
      "food-korean-tteokbokki",
      "food-chinese-dumplings"
    ],
    "evolutionHistory": [
      {
        "stage": 0,
        "stageName": "Newbie",
        "evolvedAt": 1693584000000,
        "userLevel": 1
      },
      {
        "stage": 1,
        "stageName": "Kindergartener",
        "evolvedAt": 1694284000000,
        "userLevel": 4
      },
      {
        "stage": 2,
        "stageName": "Elementary",
        "evolvedAt": 1695384000000,
        "userLevel": 8
      }
    ]
  },
  "timestamp": 1696284000000
}
```

---

### `POST /users/me/pet/feed`

**Description**: Feed the pet

**Authentication**: Required (post-MVP)

**Request Body**:
```json
{
  "foodId": "food-korean-kimchi"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "hunger": 20,
    "happiness": 90,
    "emotion": "love",
    "coins": 1200,
    "message": "Flutterpuff loves Kimchi! 🍜",
    "isFavorite": true
  },
  "timestamp": 1696284000000
}
```

**Error Response** (insufficient funds):
```json
{
  "success": false,
  "error": {
    "code": "INSUFFICIENT_FUNDS",
    "message": "Not enough coins to purchase this food",
    "details": {
      "required": 50,
      "available": 25
    }
  },
  "timestamp": 1696284000000
}
```

---

### `POST /users/me/pet/play`

**Description**: Play with the pet

**Authentication**: Required (post-MVP)

**Request Body**:
```json
{
  "activityType": "mini_game"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "happiness": 95,
    "energy": 60,
    "emotion": "excited",
    "gems": 14,
    "message": "Flutterpuff had a great time playing! 🎉"
  },
  "timestamp": 1696284000000
}
```

---

### `POST /users/me/pet/boost`

**Description**: Boost pet stats to maximum (premium action)

**Authentication**: Required (post-MVP)

**Request Body**:
```json
{
  "boostType": "full_restore"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "happiness": 100,
    "hunger": 0,
    "energy": 100,
    "emotion": "love",
    "gems": 4,
    "message": "Flutterpuff feels amazing! ✨"
  },
  "timestamp": 1696284000000
}
```

---

### `PATCH /users/me/pet`

**Description**: Update pet name, accessories, or evolution track

**Authentication**: Required (post-MVP)

**Request Body**:
```json
{
  "name": "Bubbles",
  "equippedAccessories": [
    "accessory-graduation-cap",
    "accessory-scarf-blue"
  ]
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "name": "Bubbles",
    "evolutionTrack": "knowledge",
    "evolutionStage": 2,
    "evolutionStageName": "Elementary",
    "happiness": 85,
    "hunger": 45,
    "energy": 70,
    "emotion": "happy",
    "lastFed": 1696280400000,
    "lastPlayed": 1696281300000,
    "lastInteraction": 1696284000000,
    "ownedAccessories": [
      "accessory-graduation-cap",
      "accessory-glasses",
      "accessory-scarf-red",
      "accessory-scarf-blue"
    ],
    "equippedAccessories": [
      "accessory-graduation-cap",
      "accessory-scarf-blue"
    ],
    "favoriteFood": "food-korean-kimchi",
    "foodsTriedHistory": [
      "food-korean-kimchi",
      "food-korean-tteokbokki",
      "food-chinese-dumplings"
    ],
    "evolutionHistory": [
      {
        "stage": 0,
        "stageName": "Newbie",
        "evolvedAt": 1693584000000,
        "userLevel": 1
      },
      {
        "stage": 1,
        "stageName": "Kindergartener",
        "evolvedAt": 1694284000000,
        "userLevel": 4
      },
      {
        "stage": 2,
        "stageName": "Elementary",
        "evolvedAt": 1695384000000,
        "userLevel": 8
      }
    ]
  },
  "timestamp": 1696284000000
}
```

---

## Content Generation Endpoints

### `POST /content/generate`

**Description**: Generate story passage with language blending

**Authentication**: Required (post-MVP)

**Request Body**:
```json
{
  "prompt": "A fun adventure about Pikachu playing basketball",
  "gradeLevel": "4th",
  "length": 500,
  "primaryLanguage": "English",
  "secondaryLanguage": "Korean",
  "blendLevel": 3,
  "customVocabulary": ["dribble", "jump shot", "teamwork"],
  "humorLevel": 2,
  "theme": "Space"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "story-abc123",
    "title": "Pikachu's Space Basketball Challenge",
    "content": "Pikachu 피카츄 was excited to play basketball 농구 in the space station...",
    "blendedSections": [
      {
        "text": "Pikachu",
        "translation": "피카츄",
        "romanization": "Pikachu",
        "language": "English"
      },
      {
        "text": "basketball",
        "translation": "농구",
        "romanization": "nong-gu",
        "language": "Korean"
      }
    ],
    "wordCount": 487,
    "estimatedReadingTime": 3,
    "gradeLevel": "4th",
    "vocabularyUsed": ["dribble", "jump shot", "teamwork"],
    "image": {
      "url": "https://cdn.reading-app.com/images/story-abc123.png",
      "prompt": "Pikachu playing basketball in space station, colorful, child-friendly",
      "modelUsed": "FLUX-1.1-pro"
    },
    "metadata": {
      "generatedAt": 1696284000000,
      "modelUsed": "gpt-5-pro",
      "tokens": 850,
      "generationTime": 4.2
    }
  },
  "timestamp": 1696284000000
}
```

**Error Response** (content safety violation):
```json
{
  "success": false,
  "error": {
    "code": "CONTENT_SAFETY_VIOLATION",
    "message": "The generated content did not pass safety checks",
    "details": {
      "reason": "inappropriate_topic",
      "suggestion": "Try a different prompt with child-appropriate themes"
    }
  },
  "timestamp": 1696284000000
}
```

---

### `POST /content/audio`

**Description**: Generate audio reading with word timings (BONUS feature)

**Authentication**: Required (post-MVP)

**Request Body**:
```json
{
  "storyId": "story-abc123",
  "voice": "alloy",
  "speed": 1.0,
  "highlightWords": true
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "audioUrl": "https://cdn.reading-app.com/audio/story-abc123.mp3",
    "duration": 180,
    "wordTimings": [
      {
        "word": "Pikachu",
        "startTime": 0.5,
        "endTime": 1.2
      },
      {
        "word": "피카츄",
        "startTime": 1.3,
        "endTime": 1.9
      },
      {
        "word": "was",
        "startTime": 2.0,
        "endTime": 2.3
      }
    ],
    "metadata": {
      "generatedAt": 1696284000000,
      "modelUsed": "gpt-4o-transcribe",
      "generationTime": 12.5
    }
  },
  "timestamp": 1696284000000
}
```

---

### `POST /content/quiz`

**Description**: Generate quiz questions for a story

**Authentication**: Required (post-MVP)

**Request Body**:
```json
{
  "storyId": "story-abc123",
  "questionCount": 5,
  "difficulty": "medium",
  "questionTypes": ["multiple_choice", "fill_in_blank"],
  "customPrompt": "Focus on reading comprehension and vocabulary understanding"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "quiz-xyz789",
    "storyId": "story-abc123",
    "questions": [
      {
        "id": "q1",
        "type": "multiple_choice",
        "question": "What sport was Pikachu playing?",
        "options": ["Soccer", "Basketball", "Tennis", "Baseball"],
        "correctIndex": 1,
        "explanation": "Pikachu was playing basketball 농구 in the space station."
      },
      {
        "id": "q2",
        "type": "fill_in_blank",
        "question": "Pikachu was excited to play ___ in the space station.",
        "correctAnswers": ["basketball", "농구", "nong-gu"],
        "hints": ["It's a sport with a ball and hoop", "농구 in Korean"],
        "explanation": "The answer is basketball (농구 in Korean)."
      },
      {
        "id": "q3",
        "type": "multiple_choice",
        "question": "What does '농구' mean in English?",
        "options": ["Soccer", "Basketball", "Volleyball", "Swimming"],
        "correctIndex": 1,
        "explanation": "농구 (nong-gu) means basketball in Korean."
      },
      {
        "id": "q4",
        "type": "multiple_choice",
        "question": "Where was Pikachu playing basketball?",
        "options": ["School gym", "Park", "Space station", "Beach"],
        "correctIndex": 2,
        "explanation": "Pikachu was playing basketball in the space station."
      },
      {
        "id": "q5",
        "type": "fill_in_blank",
        "question": "One important skill in basketball is ___.",
        "correctAnswers": ["dribble", "jump shot", "teamwork"],
        "hints": ["It's a way to move with the ball", "Or a way to score points", "Or working together"],
        "explanation": "Important basketball skills include dribbling, jump shots, and teamwork."
      }
    ],
    "metadata": {
      "generatedAt": 1696284000000,
      "modelUsed": "gpt-5-pro",
      "tokens": 650,
      "generationTime": 3.8
    }
  },
  "timestamp": 1696284000000
}
```

---

### `POST /content/speech-to-text`

**Description**: Convert speech to text for story prompt input

**Authentication**: Required (post-MVP)

**Request Body** (multipart/form-data):
```
audio: <audio file blob>
language: "en-US"
```

**Response**:
```json
{
  "success": true,
  "data": {
    "transcript": "A fun adventure about Pikachu playing basketball",
    "confidence": 0.95,
    "language": "en-US",
    "metadata": {
      "duration": 3.2,
      "modelUsed": "gpt-4o-transcribe",
      "processingTime": 1.5
    }
  },
  "timestamp": 1696284000000
}
```

**Note**: For MVP, use browser Web Speech API. This endpoint is for future Azure integration fallback.

---

## Progress & Analytics Endpoints

### `GET /users/me/progress`

**Description**: Get comprehensive progress analytics

**Authentication**: Required (post-MVP)

**Query Parameters**:
- `period` (string): Time period (`week` | `month` | `all`) - default: `week`

**Response**:
```json
{
  "success": true,
  "data": {
    "period": "week",
    "summary": {
      "xpEarned": 850,
      "passagesRead": 12,
      "quizzesCompleted": 12,
      "averageQuizScore": 87,
      "streak": 7,
      "coinsEarned": 420,
      "gemsEarned": 8,
      "achievementsUnlocked": 2
    },
    "xpHistory": [
      { "date": "2025-10-05", "xp": 120 },
      { "date": "2025-10-06", "xp": 150 },
      { "date": "2025-10-07", "xp": 100 },
      { "date": "2025-10-08", "xp": 180 },
      { "date": "2025-10-09", "xp": 90 },
      { "date": "2025-10-10", "xp": 110 },
      { "date": "2025-10-11", "xp": 100 }
    ],
    "languageLearning": {
      "Korean": {
        "wordsLearned": 145,
        "recentWords": ["농구", "피카츄", "우주", "행복", "친구"],
        "masteredWords": 87
      },
      "Mandarin": {
        "wordsLearned": 23,
        "recentWords": ["篮球", "皮卡丘", "空间"],
        "masteredWords": 12
      }
    },
    "quizPerformance": {
      "totalQuestions": 60,
      "correctAnswers": 52,
      "accuracy": 87,
      "improvementTrend": 5,
      "strongTopics": ["Reading Comprehension", "Vocabulary"],
      "needsPractice": ["Grammar"]
    },
    "readingStats": {
      "totalWordsRead": 12450,
      "averageWordsPerDay": 1779,
      "favoriteTopics": ["Space", "Animals", "Sports"],
      "averageReadingTime": 4.5
    }
  },
  "timestamp": 1696284000000
}
```

---

### `GET /users/me/history`

**Description**: Get reading history with pagination

**Authentication**: Required (post-MVP)

**Query Parameters**:
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 20)
- `sort` (string): Sort field (`createdAt` | `wordCount`) - default: `createdAt`
- `order` (string): Sort order (`asc` | `desc`) - default: `desc`

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "history-001",
      "storyId": "story-abc123",
      "storyTitle": "Pikachu's Space Basketball Challenge",
      "wordCount": 487,
      "blendLevel": 3,
      "secondaryLanguage": "Korean",
      "readAt": 1696284000000,
      "quizCompleted": true,
      "quizScore": 4,
      "totalQuestions": 5,
      "xpEarned": 150
    },
    {
      "id": "history-002",
      "storyId": "story-def456",
      "storyTitle": "The Jungle Explorer's Discovery",
      "wordCount": 625,
      "blendLevel": 2,
      "secondaryLanguage": "Korean",
      "readAt": 1696197600000,
      "quizCompleted": true,
      "quizScore": 5,
      "totalQuestions": 5,
      "xpEarned": 200
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "totalPages": 3
  },
  "timestamp": 1696284000000
}
```

---

## Shop & Inventory Endpoints

### `GET /shop/items`

**Description**: Get all shop items with categories

**Authentication**: Required (post-MVP)

**Query Parameters**:
- `category` (string): Filter by category (`foods` | `cosmetics` | `powerups` | `chests` | `specials`)
- `cuisine` (string): Filter foods by cuisine (`korean` | `chinese`)

**Response**:
```json
{
  "success": true,
  "data": {
    "foods": [
      {
        "id": "food-korean-kimchi",
        "name": "Kimchi",
        "description": "Spicy fermented vegetables - a Korean staple!",
        "cuisine": "korean",
        "price": 50,
        "currency": "coins",
        "effects": {
          "hunger": -20,
          "happiness": 5
        },
        "icon": "🥬",
        "rarity": "common"
      },
      {
        "id": "food-korean-tteokbokki",
        "name": "Tteokbokki",
        "description": "Chewy rice cakes in spicy sauce",
        "cuisine": "korean",
        "price": 100,
        "currency": "coins",
        "effects": {
          "hunger": -35,
          "happiness": 10
        },
        "icon": "🍜",
        "rarity": "uncommon"
      }
    ],
    "cosmetics": [
      {
        "id": "accessory-graduation-cap",
        "name": "Graduation Cap",
        "description": "For the scholarly pet",
        "price": 200,
        "currency": "coins",
        "evolutionTrack": "knowledge",
        "icon": "🎓",
        "rarity": "uncommon"
      }
    ],
    "powerups": [
      {
        "id": "powerup-2x-xp",
        "name": "2x XP Boost",
        "description": "Double XP for 3 stories",
        "price": 5,
        "currency": "gems",
        "duration": 3,
        "effect": "2x XP multiplier",
        "icon": "⚡",
        "rarity": "rare"
      }
    ],
    "chests": [
      {
        "id": "chest-basic",
        "name": "Basic Treasure Chest",
        "description": "Contains random rewards",
        "price": 100,
        "currency": "coins",
        "rewards": {
          "coins": [10, 50],
          "gems": [0, 2],
          "items": ["common", "uncommon"]
        },
        "icon": "📦",
        "rarity": "common"
      }
    ]
  },
  "timestamp": 1696284000000
}
```

---

### `POST /shop/purchase`

**Description**: Purchase an item from the shop

**Authentication**: Required (post-MVP)

**Request Body**:
```json
{
  "itemId": "food-korean-kimchi",
  "quantity": 1
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "itemId": "food-korean-kimchi",
    "itemName": "Kimchi",
    "quantity": 1,
    "totalCost": 50,
    "currency": "coins",
    "remainingBalance": {
      "coins": 1200,
      "gems": 15
    },
    "addedToInventory": true
  },
  "timestamp": 1696284000000
}
```

**Error Response** (insufficient funds):
```json
{
  "success": false,
  "error": {
    "code": "INSUFFICIENT_FUNDS",
    "message": "Not enough coins to complete this purchase",
    "details": {
      "required": 50,
      "available": 25,
      "currency": "coins"
    }
  },
  "timestamp": 1696284000000
}
```

---

### `GET /users/me/inventory`

**Description**: Get user's inventory

**Authentication**: Required (post-MVP)

**Response**:
```json
{
  "success": true,
  "data": {
    "foods": [
      {
        "itemId": "food-korean-kimchi",
        "name": "Kimchi",
        "quantity": 3,
        "icon": "🥬"
      },
      {
        "itemId": "food-chinese-dumplings",
        "name": "Dumplings",
        "quantity": 1,
        "icon": "🥟"
      }
    ],
    "cosmetics": [
      {
        "itemId": "accessory-graduation-cap",
        "name": "Graduation Cap",
        "owned": true,
        "equipped": true,
        "icon": "🎓"
      },
      {
        "itemId": "accessory-glasses",
        "name": "Glasses",
        "owned": true,
        "equipped": true,
        "icon": "👓"
      }
    ],
    "powerups": [
      {
        "itemId": "powerup-2x-xp",
        "name": "2x XP Boost",
        "quantity": 2,
        "remaining": 0,
        "icon": "⚡"
      }
    ]
  },
  "timestamp": 1696284000000
}
```

---

## Achievement & Quest Endpoints

### `GET /achievements`

**Description**: Get all achievements with progress

**Authentication**: Required (post-MVP)

**Query Parameters**:
- `category` (string): Filter by category
- `unlocked` (boolean): Filter by unlock status

**Response**:
```json
{
  "success": true,
  "data": {
    "summary": {
      "total": 27,
      "unlocked": 8,
      "percentage": 30
    },
    "achievements": [
      {
        "id": "achievement-first-story",
        "title": "First Steps",
        "description": "Read your first story",
        "category": "reading",
        "icon": "📖",
        "rarity": "common",
        "requirement": {
          "type": "count",
          "target": 1,
          "metric": "passagesRead"
        },
        "rewards": {
          "xp": 50,
          "coins": 25
        },
        "unlocked": true,
        "progress": 1,
        "total": 1,
        "unlockedAt": 1693584000000
      },
      {
        "id": "achievement-bookworm",
        "title": "Bookworm",
        "description": "Read 50 stories",
        "category": "reading",
        "icon": "🐛",
        "rarity": "rare",
        "requirement": {
          "type": "count",
          "target": 50,
          "metric": "passagesRead"
        },
        "rewards": {
          "xp": 500,
          "coins": 200,
          "gems": 5
        },
        "unlocked": false,
        "progress": 45,
        "total": 50,
        "unlockedAt": null
      }
    ]
  },
  "timestamp": 1696284000000
}
```

---

### `GET /quests`

**Description**: Get daily and weekly quests

**Authentication**: Required (post-MVP)

**Response**:
```json
{
  "success": true,
  "data": {
    "daily": [
      {
        "id": "quest-daily-read-3",
        "title": "Daily Reader",
        "description": "Read 3 stories today",
        "type": "daily",
        "progress": 2,
        "total": 3,
        "completed": false,
        "claimed": false,
        "rewards": {
          "xp": 100,
          "coins": 50
        },
        "expiresAt": 1696320000000,
        "icon": "📚"
      },
      {
        "id": "quest-daily-quiz-5",
        "title": "Quiz Master",
        "description": "Complete 5 quizzes with 80%+ accuracy",
        "type": "daily",
        "progress": 3,
        "total": 5,
        "completed": false,
        "claimed": false,
        "rewards": {
          "xp": 150,
          "coins": 75
        },
        "expiresAt": 1696320000000,
        "icon": "🎯"
      },
      {
        "id": "quest-daily-pet-feed",
        "title": "Pet Care",
        "description": "Feed your pet 3 times",
        "type": "daily",
        "progress": 3,
        "total": 3,
        "completed": true,
        "claimed": false,
        "rewards": {
          "xp": 50,
          "coins": 25
        },
        "expiresAt": 1696320000000,
        "icon": "🍽️"
      }
    ],
    "weekly": [
      {
        "id": "quest-weekly-read-20",
        "title": "Weekly Marathon",
        "description": "Read 20 stories this week",
        "type": "weekly",
        "progress": 12,
        "total": 20,
        "completed": false,
        "claimed": false,
        "rewards": {
          "xp": 500,
          "coins": 300,
          "gems": 5
        },
        "expiresAt": 1696665600000,
        "icon": "🏆"
      },
      {
        "id": "quest-weekly-language-blend",
        "title": "Language Explorer",
        "description": "Use blend level 5+ for 10 stories",
        "type": "weekly",
        "progress": 7,
        "total": 10,
        "completed": false,
        "claimed": false,
        "rewards": {
          "xp": 400,
          "coins": 200,
          "gems": 3
        },
        "expiresAt": 1696665600000,
        "icon": "🌍"
      }
    ]
  },
  "timestamp": 1696284000000
}
```

---

### `POST /quests/:questId/claim`

**Description**: Claim quest rewards

**Authentication**: Required (post-MVP)

**Response**:
```json
{
  "success": true,
  "data": {
    "questId": "quest-daily-pet-feed",
    "questTitle": "Pet Care",
    "rewards": {
      "xp": 50,
      "coins": 25
    },
    "newBalances": {
      "xp": 2650,
      "level": 12,
      "coins": 1275,
      "gems": 15
    },
    "claimed": true
  },
  "timestamp": 1696284000000
}
```

---

## Error Handling

### Error Codes

| Code | Description | HTTP Status |
|------|-------------|-------------|
| `VALIDATION_ERROR` | Invalid request parameters | 400 |
| `UNAUTHORIZED` | Missing or invalid authentication | 401 |
| `FORBIDDEN` | User lacks permission | 403 |
| `NOT_FOUND` | Resource not found | 404 |
| `INSUFFICIENT_FUNDS` | Not enough coins/gems | 400 |
| `CONTENT_SAFETY_VIOLATION` | Generated content failed safety checks | 400 |
| `RATE_LIMIT_EXCEEDED` | Too many requests | 429 |
| `INTERNAL_ERROR` | Server error | 500 |
| `SERVICE_UNAVAILABLE` | External service (OpenAI, FLUX) unavailable | 503 |

### Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Human-readable error message",
    "details": {
      "field": "gradeLevel",
      "expected": "3rd | 4th | 5th | 6th",
      "received": "7th"
    }
  },
  "timestamp": 1696284000000
}
```

---

## Migration Strategy

### Phase 1: MVP (Pure Frontend - Current)
- All data stored in `localStorage`
- No backend API calls
- Mock data for development

### Phase 2: Backend Preparation
- Backend API implementation (Node.js + Express or equivalent)
- Database setup (PostgreSQL or MongoDB)
- Authentication system (JWT)
- OpenAI/FLUX integration on backend

### Phase 3: Gradual Migration
- Add API client layer to frontend
- Feature flag for localStorage vs. API
- Parallel writes (localStorage + API)
- Validate data consistency

### Phase 4: Full Backend
- Switch to API-only mode
- Remove localStorage writes (keep reads for offline fallback)
- Add offline queue for actions when disconnected
- Sync on reconnection

### Migration Code Pattern

```typescript
// services/dataService.ts

const USE_BACKEND_API = false; // Feature flag

export async function getUserState(): Promise<UserState> {
  if (USE_BACKEND_API) {
    const response = await fetch('/api/v1/users/me', {
      headers: { Authorization: `Bearer ${getToken()}` }
    });
    const { data } = await response.json();
    return data;
  } else {
    // MVP: localStorage
    const data = localStorage.getItem('userState');
    return data ? JSON.parse(data) : getDefaultUserState();
  }
}

export async function updateUserState(updates: Partial<UserState>): Promise<UserState> {
  if (USE_BACKEND_API) {
    const response = await fetch('/api/v1/users/me', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`
      },
      body: JSON.stringify(updates)
    });
    const { data } = await response.json();
    return data;
  } else {
    // MVP: localStorage
    const current = await getUserState();
    const updated = { ...current, ...updates, updatedAt: Date.now() };
    localStorage.setItem('userState', JSON.stringify(updated));
    return updated;
  }
}
```

---

## Data Synchronization

### Offline Support Strategy

**Requirement**: App should work offline and sync when reconnected

**Implementation**:
1. **Action Queue**: Store all user actions in IndexedDB when offline
2. **Background Sync**: Use Service Worker Background Sync API
3. **Conflict Resolution**: Server timestamp wins

**Action Queue Structure**:
```typescript
interface QueuedAction {
  id: string;
  type: 'USER_UPDATE' | 'PET_FEED' | 'QUEST_CLAIM' | 'SHOP_PURCHASE';
  payload: any;
  timestamp: number;
  retryCount: number;
  status: 'pending' | 'syncing' | 'completed' | 'failed';
}
```

**Sync Flow**:
```
1. User performs action while offline
   ↓
2. Action added to IndexedDB queue
   ↓
3. Action applied to localStorage (optimistic update)
   ↓
4. On reconnection, Service Worker triggers sync
   ↓
5. Queue processed sequentially
   ↓
6. Server response updates local state if conflict
   ↓
7. Completed actions removed from queue
```

---

## Rate Limiting

### Rate Limits (Post-MVP)

| Endpoint | Rate Limit | Window |
|----------|------------|--------|
| `POST /content/generate` | 20 requests | 1 hour |
| `POST /content/audio` | 10 requests | 1 hour |
| `POST /content/quiz` | 30 requests | 1 hour |
| `POST /shop/purchase` | 100 requests | 1 hour |
| `PATCH /users/me` | 50 requests | 1 hour |
| All other endpoints | 1000 requests | 1 hour |

**Rate Limit Headers**:
```
X-RateLimit-Limit: 20
X-RateLimit-Remaining: 15
X-RateLimit-Reset: 1696287600
```

**Rate Limit Error Response**:
```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests. Please try again later.",
    "details": {
      "limit": 20,
      "window": "1 hour",
      "resetAt": 1696287600000
    }
  },
  "timestamp": 1696284000000
}
```

---

## Security Considerations

### API Key Security
- **Never expose API keys in frontend code**
- All LLM API calls (OpenAI, FLUX) must go through backend
- Frontend sends generation requests → Backend calls OpenAI/FLUX → Backend returns results

### Content Safety
- Multi-layer validation:
  1. Frontend: Basic prompt filtering (block obvious inappropriate terms)
  2. Backend: OpenAI Moderation API before generation
  3. Backend: Post-generation safety check before returning to frontend
- Child safety is paramount - reject any borderline content

### Data Privacy
- User data encrypted at rest
- HTTPS for all API communication
- No tracking or analytics without parent consent
- COPPA compliance for children under 13

---

## Versioning Strategy

### API Versioning
- Base URL includes version: `/api/v1/`
- Breaking changes require new version: `/api/v2/`
- Non-breaking changes (new optional fields) don't require version bump

### Backward Compatibility
- Support previous version for 6 months after new version release
- Deprecation warnings in response headers:
  ```
  X-API-Deprecated: true
  X-API-Sunset: 2026-04-11T00:00:00Z
  X-API-Migration-Guide: https://docs.reading-app.com/api/v2-migration
  ```

---

## Testing Strategy

### API Testing Requirements
- Unit tests for all endpoint handlers
- Integration tests for full request/response cycles
- E2E tests for critical user flows
- Load testing for content generation endpoints (expensive operations)
- Security testing for authentication and authorization

### Mock API for Frontend Development
```typescript
// utils/mockAPI.ts

export const mockAPI = {
  async getUserState(): Promise<APIResponse<UserState>> {
    await delay(500); // Simulate network latency
    return {
      success: true,
      data: mockUser,
      timestamp: Date.now()
    };
  },

  async generateStory(request: GenerateStoryRequest): Promise<APIResponse<StoryContent>> {
    await delay(3000); // Simulate generation time
    return {
      success: true,
      data: mockStoryContent,
      timestamp: Date.now()
    };
  },

  // ... other endpoints
};
```

---

## Documentation & Developer Experience

### Interactive API Documentation
- **Swagger/OpenAPI**: Auto-generated interactive docs
- **Postman Collection**: Importable collection with example requests
- **Code Examples**: Client code examples in TypeScript

### Client SDK (Post-MVP)
```typescript
import { ReadingAppClient } from '@reading-app/sdk';

const client = new ReadingAppClient({
  apiKey: 'your-api-key',
  baseURL: 'https://api.reading-app.com/v1'
});

// Get user state
const user = await client.users.me();

// Generate story
const story = await client.content.generate({
  prompt: 'A fun adventure',
  gradeLevel: '4th',
  blendLevel: 3
});

// Feed pet
await client.pet.feed('food-korean-kimchi');
```

---

## Performance Considerations

### Caching Strategy
- **CDN**: Cache images, audio files (CloudFront, CloudFlare)
- **Browser Cache**: Static assets (1 year), API responses (5 minutes)
- **Server Cache**: Redis for frequently accessed data (user state, shop items)

### Response Time Targets
| Endpoint Type | Target Response Time |
|---------------|---------------------|
| Data retrieval (GET) | < 200ms |
| Data updates (POST/PATCH) | < 500ms |
| Content generation | < 10 seconds |
| Audio generation | < 20 seconds |

### Optimization Strategies
- Lazy load images (pagination, infinite scroll)
- Debounce user actions (autosave settings)
- Batch API calls where possible
- Use WebSockets for real-time updates (quest progress, pet state)

---

## Monitoring & Observability

### Metrics to Track (Post-MVP)
- **Performance**: Endpoint latency, error rates, throughput
- **Business**: Daily active users, stories generated, quizzes completed
- **Costs**: OpenAI API usage, FLUX API usage, storage costs
- **Quality**: Content safety violation rate, user-reported issues

### Logging Strategy
- Structured JSON logs
- Log levels: DEBUG, INFO, WARN, ERROR, CRITICAL
- Never log sensitive data (API keys, user PII)

---

## Next Steps

1. ✅ **API Contract Complete** - This document
2. ⏸️ **Component Specifications** - Detailed React component props/behavior
3. ⏸️ **Backend Implementation** - Node.js + Express API (post-MVP)
4. ⏸️ **Database Schema** - PostgreSQL tables for production
5. ⏸️ **Authentication System** - JWT-based auth with refresh tokens
6. ⏸️ **API Client Layer** - Frontend service abstraction for localStorage → API migration

---

## Appendix: Complete Endpoint Index

### User Endpoints
- `GET /users/me` - Get user profile
- `PATCH /users/me` - Update user profile
- `POST /users/me/xp` - Add XP
- `POST /users/me/streak` - Update streak

### Pet Endpoints
- `GET /users/me/pet` - Get pet state
- `POST /users/me/pet/feed` - Feed pet
- `POST /users/me/pet/play` - Play with pet
- `POST /users/me/pet/boost` - Boost pet stats
- `PATCH /users/me/pet` - Update pet name/accessories

### Content Generation Endpoints
- `POST /content/generate` - Generate story
- `POST /content/audio` - Generate audio (BONUS)
- `POST /content/quiz` - Generate quiz
- `POST /content/speech-to-text` - Speech to text

### Progress & Analytics Endpoints
- `GET /users/me/progress` - Get progress analytics
- `GET /users/me/history` - Get reading history

### Shop & Inventory Endpoints
- `GET /shop/items` - Get shop items
- `POST /shop/purchase` - Purchase item
- `GET /users/me/inventory` - Get inventory

### Achievement & Quest Endpoints
- `GET /achievements` - Get all achievements
- `GET /quests` - Get daily/weekly quests
- `POST /quests/:questId/claim` - Claim quest rewards

---

**Total Endpoints**: 17
**Authentication Required**: 17 (all endpoints post-MVP)
**MVP Implementation**: 0 (localStorage only for MVP)

---

**Document Status**: ✅ Complete
**Next Document**: Component Specifications (`docs/component-specifications.md`)
