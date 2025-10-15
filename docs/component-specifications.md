# Component Specifications - Reading App V2

## Overview

This document provides detailed specifications for all React components in the Reading App V2. Each component includes TypeScript interfaces for props, state management patterns, event handlers, and usage examples.

**Version**: 1.0
**Last Updated**: 2025-10-11
**Status**: ✅ Complete

---

## Table of Contents

1. [Architecture Patterns](#architecture-patterns)
2. [Layout Components](#layout-components)
3. [Dashboard Components](#dashboard-components)
4. [Reading Components](#reading-components)
5. [Achievements Components](#achievements-components)
6. [Shop Components](#shop-components)
7. [Progress Components](#progress-components)
8. [Profile Components](#profile-components)
9. [Common/Shared Components](#commonshared-components)
10. [State Management](#state-management)
11. [Component Testing Guidelines](#component-testing-guidelines)

---

## Architecture Patterns

### Component Organization Strategy

**Structure**:
```
src/components/
├── layout/           # Header, Navigation, common layout
├── dashboard/        # Dashboard page components
├── reading/          # Reading page components
├── achievements/     # Achievements page components
├── shop/            # Shop page components
├── progress/        # Progress page components
├── profile/         # Profile page components
├── common/          # Reusable UI components
└── animations/      # Animation components (confetti, etc.)
```

### Component Types

1. **Page Components** (`pages/`)
   - Top-level route components
   - Compose feature components
   - Manage page-level state

2. **Feature Components** (`components/{feature}/`)
   - Specific to a feature area
   - Handle business logic
   - Connect to global state

3. **Common Components** (`components/common/`)
   - Reusable across features
   - No business logic
   - Props-driven only

### Naming Conventions

- **Components**: PascalCase (e.g., `VirtualPet.tsx`)
- **Props Interfaces**: `{ComponentName}Props` (e.g., `VirtualPetProps`)
- **Event Handlers**: `on{Event}` (e.g., `onFeed`, `onPlayClick`)
- **State Variables**: camelCase (e.g., `isLoading`, `selectedItem`)

---

## Layout Components

### 1. Header

**File**: `src/components/layout/Header.tsx`

**Description**: Top navigation bar with logo, currency display, and streak counter

**Props Interface**:
```typescript
interface HeaderProps {
  userName: string;
  coins: number;
  gems: number;
  streak: number;
  level: number;
  xp: number;
  xpToNextLevel: number;
  onLogoClick?: () => void;
  onCurrencyClick?: (type: 'coins' | 'gems') => void;
  onStreakClick?: () => void;
}
```

**State**:
- None (stateless component)

**Events**:
- `onLogoClick`: Navigate to Dashboard
- `onCurrencyClick`: Open Shop (future)
- `onStreakClick`: Open Achievements with streak filter

**Example Usage**:
```tsx
<Header
  userName="Renzo"
  coins={1250}
  gems={15}
  streak={7}
  level={12}
  xp={2450}
  xpToNextLevel={3000}
  onLogoClick={() => navigate('/dashboard')}
  onCurrencyClick={(type) => navigate('/shop', { state: { tab: type } })}
  onStreakClick={() => navigate('/achievements', { state: { filter: 'streak' } })}
/>
```

**Children**:
- `CurrencyDisplay` - Coins and gems counter
- `StreakIndicator` - Flame icon with streak number
- `ProgressBar` - XP progress to next level

---

### 2. Navigation

**File**: `src/components/layout/Navigation.tsx`

**Description**: Bottom navigation (mobile) or side navigation (desktop)

**Props Interface**:
```typescript
interface NavigationProps {
  currentPage: 'dashboard' | 'reading' | 'achievements' | 'shop' | 'progress' | 'profile';
  onNavigate: (page: string) => void;
  isMobile?: boolean;
}
```

**State**:
- None (stateless component)

**Events**:
- `onNavigate`: Page navigation handler

**Example Usage**:
```tsx
<Navigation
  currentPage="dashboard"
  onNavigate={(page) => navigate(`/${page}`)}
  isMobile={window.innerWidth < 768}
/>
```

**Responsive Behavior**:
- **Mobile (<768px)**: Bottom fixed navigation with icons
- **Desktop (>1024px)**: Left sidebar navigation with text labels

---

### 3. PageLayout

**File**: `src/components/layout/PageLayout.tsx`

**Description**: Wrapper component for consistent page structure

**Props Interface**:
```typescript
interface PageLayoutProps {
  title?: string;
  subtitle?: string;
  backButton?: boolean;
  onBack?: () => void;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}
```

**Example Usage**:
```tsx
<PageLayout
  title="Dashboard"
  subtitle="Welcome back, Renzo!"
  actions={
    <Button onClick={handleSettingsClick}>
      <SettingsIcon />
    </Button>
  }
>
  {/* Page content */}
</PageLayout>
```

---

## Dashboard Components

### 1. VirtualPet

**File**: `src/components/dashboard/VirtualPet.tsx`

**Description**: Interactive virtual pet widget (prominent on Dashboard)

**Props Interface**:
```typescript
interface VirtualPetProps {
  pet: PetState;
  coins: number;
  gems: number;
  size?: 'small' | 'large'; // 'small' for mini widget on other pages
  onFeed: (foodId: string) => void;
  onPlay: () => void;
  onBoost: () => void;
  onClick?: () => void; // Open full pet modal
}
```

**State**:
```typescript
const [showActions, setShowActions] = useState(false);
const [animation, setAnimation] = useState<string | null>(null);
```

**Events**:
- `onFeed`: Feed pet with selected food
- `onPlay`: Play mini-game with pet
- `onBoost`: Boost all stats to max (costs gems)
- `onClick`: Open detailed pet modal

**Example Usage**:
```tsx
<VirtualPet
  pet={petState}
  coins={userCoins}
  gems={userGems}
  size="large"
  onFeed={handleFeed}
  onPlay={handlePlay}
  onBoost={handleBoost}
  onClick={handleOpenPetModal}
/>
```

**Children**:
- `PetImage` - Displays pet art with current emotion
- `StatBar` - Shows happiness, hunger, energy bars
- `PetActions` - Feed, Play, Boost buttons
- `EvolutionBadge` - Shows current evolution stage

**Animations**:
- Idle: Subtle breathing/bobbing
- Fed: Happy bounce, hearts
- Played: Excited jump
- Boosted: Sparkle/glow effect
- Hungry: Sad drooping

---

### 2. QuestCard

**File**: `src/components/dashboard/QuestCard.tsx`

**Description**: Individual quest card showing progress and rewards

**Props Interface**:
```typescript
interface QuestCardProps {
  quest: Quest;
  onClaim: (questId: string) => void;
  onClick?: () => void; // Expand details
}
```

**State**:
```typescript
const [expanded, setExpanded] = useState(false);
```

**Events**:
- `onClaim`: Claim quest rewards when completed
- `onClick`: Toggle expanded view for details

**Example Usage**:
```tsx
<QuestCard
  quest={dailyQuest}
  onClaim={handleClaimQuest}
  onClick={() => setSelectedQuest(dailyQuest.id)}
/>
```

**Children**:
- `ProgressBar` - Quest progress indicator
- `RewardDisplay` - XP, coins, gems rewards
- `ClaimButton` - Available when quest completed

**States**:
- **In Progress**: Progress bar with current/total
- **Completed**: Green checkmark, "Claim" button enabled
- **Claimed**: Gray, "Completed" badge

---

### 3. QuestList

**File**: `src/components/dashboard/QuestList.tsx`

**Description**: Container for daily and weekly quests

**Props Interface**:
```typescript
interface QuestListProps {
  dailyQuests: Quest[];
  weeklyQuests: Quest[];
  onClaimQuest: (questId: string) => void;
}
```

**Example Usage**:
```tsx
<QuestList
  dailyQuests={dailyQuests}
  weeklyQuests={weeklyQuests}
  onClaimQuest={handleClaimQuest}
/>
```

**Children**:
- `QuestCard` (multiple)
- Section headers ("Daily Quests", "Weekly Quests")

---

### 4. StatsGrid

**File**: `src/components/dashboard/StatsGrid.tsx`

**Description**: Grid of user stats (XP, Level, Streak, Achievements)

**Props Interface**:
```typescript
interface StatsGridProps {
  level: number;
  xp: number;
  xpToNextLevel: number;
  streak: number;
  achievementsUnlocked: number;
  totalAchievements: number;
  coins: number;
  gems: number;
}
```

**Example Usage**:
```tsx
<StatsGrid
  level={12}
  xp={2450}
  xpToNextLevel={3000}
  streak={7}
  achievementsUnlocked={8}
  totalAchievements={27}
  coins={1250}
  gems={15}
/>
```

**Children**:
- `StatCard` (multiple) - Individual stat display

---

### 5. LanguageSettingsWidget

**File**: `src/components/dashboard/LanguageSettingsWidget.tsx`

**Description**: Quick access to language blend level slider

**Props Interface**:
```typescript
interface LanguageSettingsWidgetProps {
  primaryLanguage: string;
  secondaryLanguages: string[];
  currentBlendLevel: number;
  onBlendLevelChange: (level: number) => void;
  onSecondaryLanguageChange: (language: string) => void;
}
```

**State**:
```typescript
const [selectedSecondary, setSelectedSecondary] = useState<string>(secondaryLanguages[0]);
```

**Example Usage**:
```tsx
<LanguageSettingsWidget
  primaryLanguage="English"
  secondaryLanguages={['Korean', 'Mandarin']}
  currentBlendLevel={3}
  onBlendLevelChange={handleBlendChange}
  onSecondaryLanguageChange={handleLanguageChange}
/>
```

**Children**:
- `Slider` - 0-10 blend level control
- `LanguageSelector` - Dropdown for secondary language
- `BlendLevelIndicator` - Visual representation (100% English → 100% Secondary)

---

### 6. LeaderboardWidget

**File**: `src/components/dashboard/LeaderboardWidget.tsx`

**Description**: Top 5 users by XP (optional feature)

**Props Interface**:
```typescript
interface LeaderboardWidgetProps {
  topUsers: {
    id: string;
    name: string;
    level: number;
    xp: number;
    avatar: string;
  }[];
  currentUser: {
    rank: number;
    name: string;
    xp: number;
  };
}
```

**Example Usage**:
```tsx
<LeaderboardWidget
  topUsers={leaderboardData}
  currentUser={{ rank: 4, name: 'Renzo', xp: 2450 }}
/>
```

---

## Reading Components

### 1. StoryPromptInput

**File**: `src/components/reading/StoryPromptInput.tsx`

**Description**: Text input with speech-to-text microphone button

**Props Interface**:
```typescript
interface StoryPromptInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  maxLength?: number;
  placeholder?: string;
  disabled?: boolean;
  speechRecognitionEnabled?: boolean;
}
```

**State**:
```typescript
const [isListening, setIsListening] = useState(false);
const [speechError, setSpeechError] = useState<string | null>(null);
```

**Events**:
- `onChange`: Text input change
- `onSubmit`: Generate story button clicked
- Speech recognition start/stop

**Example Usage**:
```tsx
<StoryPromptInput
  value={storyPrompt}
  onChange={setStoryPrompt}
  onSubmit={handleGenerateStory}
  maxLength={200}
  placeholder="A fun adventure about..."
  speechRecognitionEnabled={true}
/>
```

**Children**:
- `TextArea` - Multi-line input
- `MicrophoneButton` - Speech-to-text trigger
- `CharacterCount` - Remaining characters display

**Speech Recognition**:
- Uses browser Web Speech API
- Visual feedback during listening (pulsing mic icon)
- Error handling for unsupported browsers

---

### 2. StorySettings

**File**: `src/components/reading/StorySettings.tsx`

**Description**: Story generation configuration (length, grade, humor, theme)

**Props Interface**:
```typescript
interface StorySettingsProps {
  length: number;
  gradeLevel: '3rd' | '4th' | '5th' | '6th';
  humorLevel: number;
  theme: string;
  customVocabulary: string[];
  onLengthChange: (length: number) => void;
  onGradeLevelChange: (grade: '3rd' | '4th' | '5th' | '6th') => void;
  onHumorLevelChange: (level: number) => void;
  onThemeChange: (theme: string) => void;
  onVocabularyChange: (words: string[]) => void;
}
```

**Example Usage**:
```tsx
<StorySettings
  length={500}
  gradeLevel="4th"
  humorLevel={2}
  theme="Space"
  customVocabulary={['dribble', 'teamwork']}
  onLengthChange={setLength}
  onGradeLevelChange={setGradeLevel}
  onHumorLevelChange={setHumorLevel}
  onThemeChange={setTheme}
  onVocabularyChange={setVocabulary}
/>
```

**Children**:
- `Slider` - Story length (250-2000 words)
- `Select` - Grade level dropdown
- `Slider` - Humor level (1-3)
- `ThemePicker` - Theme selection
- `VocabularyInput` - Custom words input

---

### 3. LanguageControls

**File**: `src/components/reading/LanguageControls.tsx`

**Description**: Language blending controls (slider, hints toggle, romanization)

**Props Interface**:
```typescript
interface LanguageControlsProps {
  primaryLanguage: string;
  secondaryLanguage: string;
  blendLevel: number;
  hintsEnabled: boolean;
  romanizationEnabled: boolean;
  onBlendLevelChange: (level: number) => void;
  onHintsToggle: () => void;
  onRomanizationToggle: () => void;
  onSecondaryLanguageChange: (language: string) => void;
}
```

**Example Usage**:
```tsx
<LanguageControls
  primaryLanguage="English"
  secondaryLanguage="Korean"
  blendLevel={3}
  hintsEnabled={true}
  romanizationEnabled={true}
  onBlendLevelChange={handleBlendChange}
  onHintsToggle={toggleHints}
  onRomanizationToggle={toggleRomanization}
  onSecondaryLanguageChange={setSecondaryLanguage}
/>
```

**Children**:
- `Slider` - Blend level (0-10)
- `Toggle` - Show/hide hints
- `Toggle` - Show/hide romanization
- `LanguageSelector` - Korean/Mandarin dropdown

---

### 4. StoryDisplay

**File**: `src/components/reading/StoryDisplay.tsx`

**Description**: Main reading passage with blended text and inline hints

**Props Interface**:
```typescript
interface StoryDisplayProps {
  story: StoryContent;
  hintsEnabled: boolean;
  romanizationEnabled: boolean;
  highlightedWordIndex?: number; // For audio sync (BONUS)
  onWordClick?: (word: string, translation: string) => void;
}
```

**State**:
```typescript
const [selectedWord, setSelectedWord] = useState<string | null>(null);
const [showTooltip, setShowTooltip] = useState(false);
```

**Example Usage**:
```tsx
<StoryDisplay
  story={generatedStory}
  hintsEnabled={hintsEnabled}
  romanizationEnabled={romanizationEnabled}
  highlightedWordIndex={currentWordIndex}
  onWordClick={handleWordClick}
/>
```

**Children**:
- `StoryTitle` - Story title display
- `BlendedText` - Text with inline translations
- `Tooltip` - Hover/click tooltip for word details

**Text Rendering**:
```tsx
// Example blended text rendering
<span className="blended-word">
  basketball
  {hintsEnabled && (
    <span className="inline-hint">
      {romanizationEnabled && <span className="romanization">nong-gu</span>}
      <span className="translation">농구</span>
    </span>
  )}
</span>
```

---

### 5. AudioPlayer (BONUS)

**File**: `src/components/reading/AudioPlayer.tsx`

**Description**: Audio playback with synchronized word highlighting

**Props Interface**:
```typescript
interface AudioPlayerProps {
  audioUrl: string;
  wordTimings: Array<{ word: string; startTime: number; endTime: number }>;
  onWordHighlight: (wordIndex: number) => void;
  autoPlay?: boolean;
}
```

**State**:
```typescript
const [isPlaying, setIsPlaying] = useState(false);
const [currentTime, setCurrentTime] = useState(0);
const [duration, setDuration] = useState(0);
const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
```

**Example Usage**:
```tsx
<AudioPlayer
  audioUrl={story.audio.url}
  wordTimings={story.audio.wordTimings}
  onWordHighlight={setHighlightedWord}
  autoPlay={false}
/>
```

**Children**:
- `PlayPauseButton`
- `ProgressBar` - Seekable timeline
- `SpeedControl` - 0.5x, 1.0x, 1.5x, 2.0x
- `VolumeControl`

---

### 6. QuizSection

**File**: `src/components/reading/QuizSection.tsx`

**Description**: Quiz questions container with multiple choice and fill-in-blank

**Props Interface**:
```typescript
interface QuizSectionProps {
  quiz: Quiz;
  onSubmit: (answers: QuizAnswer[]) => void;
  onQuestionAnswer: (questionId: string, answer: string | number) => void;
}
```

**State**:
```typescript
const [answers, setAnswers] = useState<Record<string, string | number>>({});
const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
const [showResults, setShowResults] = useState(false);
```

**Example Usage**:
```tsx
<QuizSection
  quiz={generatedQuiz}
  onSubmit={handleQuizSubmit}
  onQuestionAnswer={handleAnswer}
/>
```

**Children**:
- `QuizQuestion` (multiple)
- `QuizProgress` - Question counter
- `SubmitButton`

---

### 7. QuizQuestion

**File**: `src/components/reading/QuizQuestion.tsx`

**Description**: Individual quiz question (multiple choice or fill-in-blank)

**Props Interface**:
```typescript
interface QuizQuestionProps {
  question: QuizQuestion;
  answer?: string | number;
  onAnswer: (answer: string | number) => void;
  showResult?: boolean;
  isCorrect?: boolean;
}
```

**Example Usage**:
```tsx
<QuizQuestion
  question={quizQuestion}
  answer={userAnswer}
  onAnswer={handleAnswer}
  showResult={showResults}
  isCorrect={userAnswer === question.correctIndex}
/>
```

**Children**:
- `MultipleChoiceOptions` (if type === 'multiple_choice')
- `FillInBlankInput` (if type === 'fill_in_blank')
- `ExplanationCard` (shown after submission)

---

### 8. QuizResults

**File**: `src/components/reading/QuizResults.tsx`

**Description**: Quiz completion summary with score and rewards

**Props Interface**:
```typescript
interface QuizResultsProps {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  xpEarned: number;
  coinsEarned: number;
  onContinue: () => void;
  onReview: () => void;
}
```

**Example Usage**:
```tsx
<QuizResults
  score={4}
  totalQuestions={5}
  correctAnswers={4}
  xpEarned={150}
  coinsEarned={50}
  onContinue={handleContinue}
  onReview={handleReviewAnswers}
/>
```

**Children**:
- `ScoreDisplay` - Visual score representation
- `RewardDisplay` - XP and coins earned
- `PetCelebration` - Animated pet reaction
- `ContinueButton`

---

### 9. MiniPetWidget

**File**: `src/components/reading/MiniPetWidget.tsx`

**Description**: Small pet widget for encouragement on Reading page

**Props Interface**:
```typescript
interface MiniPetWidgetProps {
  pet: PetState;
  message?: string;
  onClick?: () => void;
}
```

**Example Usage**:
```tsx
<MiniPetWidget
  pet={petState}
  message="Great reading! Keep it up!"
  onClick={handleOpenPetModal}
/>
```

**Children**:
- `PetAvatar` - Small pet image with emotion
- `SpeechBubble` - Encouragement message

---

### 10. GenerateButton

**File**: `src/components/reading/GenerateButton.tsx`

**Description**: Story generation trigger button with loading state

**Props Interface**:
```typescript
interface GenerateButtonProps {
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  label?: string;
}
```

**State**:
```typescript
const [isGenerating, setIsGenerating] = useState(false);
```

**Example Usage**:
```tsx
<GenerateButton
  onClick={handleGenerate}
  disabled={!storyPrompt.trim()}
  loading={isGenerating}
  label="Generate Story"
/>
```

**Loading Animation**:
- Spinner icon
- "Generating..." text
- Disabled state during generation

---

## Achievements Components

### 1. AchievementGrid

**File**: `src/components/achievements/AchievementGrid.tsx`

**Description**: Grid of achievement cards with filtering/sorting

**Props Interface**:
```typescript
interface AchievementGridProps {
  achievements: Achievement[];
  filter?: 'all' | 'unlocked' | 'locked';
  category?: string;
  sortBy?: 'alphabetical' | 'progress' | 'rarity';
  onAchievementClick: (achievementId: string) => void;
}
```

**State**:
```typescript
const [currentFilter, setCurrentFilter] = useState<string>('all');
const [currentSort, setCurrentSort] = useState<string>('alphabetical');
const [searchQuery, setSearchQuery] = useState<string>('');
```

**Example Usage**:
```tsx
<AchievementGrid
  achievements={allAchievements}
  filter="all"
  category="reading"
  sortBy="progress"
  onAchievementClick={handleAchievementClick}
/>
```

**Children**:
- `FilterBar` - Filter and sort controls
- `SearchBar` - Achievement search
- `AchievementCard` (multiple)

---

### 2. AchievementCard

**File**: `src/components/achievements/AchievementCard.tsx`

**Description**: Individual achievement card with progress

**Props Interface**:
```typescript
interface AchievementCardProps {
  achievement: Achievement;
  onClick: () => void;
}
```

**Example Usage**:
```tsx
<AchievementCard
  achievement={achievementData}
  onClick={() => handleClick(achievementData.id)}
/>
```

**Children**:
- `AchievementIcon` - Icon with rarity border
- `ProgressBar` - Progress towards completion
- `RarityBadge` - Common, Uncommon, Rare, Epic, Legendary

**States**:
- **Locked**: Grayscale, progress bar
- **Unlocked**: Full color, completion date
- **Nearly Complete**: Glowing border animation

---

### 3. AchievementModal

**File**: `src/components/achievements/AchievementModal.tsx`

**Description**: Detailed view of a single achievement

**Props Interface**:
```typescript
interface AchievementModalProps {
  achievement: Achievement;
  isOpen: boolean;
  onClose: () => void;
}
```

**Example Usage**:
```tsx
<AchievementModal
  achievement={selectedAchievement}
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
/>
```

**Children**:
- `AchievementDetails` - Full description, requirements
- `ProgressStats` - Current progress with milestone breakdown
- `RewardDisplay` - XP, coins, gems rewards
- `TipSection` - Hints for unlocking (if locked)

---

### 4. AchievementSummary

**File**: `src/components/achievements/AchievementSummary.tsx`

**Description**: Overall achievement progress summary

**Props Interface**:
```typescript
interface AchievementSummaryProps {
  totalAchievements: number;
  unlockedAchievements: number;
  categories: Record<string, { total: number; unlocked: number }>;
}
```

**Example Usage**:
```tsx
<AchievementSummary
  totalAchievements={27}
  unlockedAchievements={8}
  categories={{
    reading: { total: 4, unlocked: 2 },
    quiz: { total: 4, unlocked: 1 },
    // ...
  }}
/>
```

**Children**:
- `ProgressCircle` - Overall completion percentage
- `CategoryBreakdown` - Progress per category

---

### 5. NextAchievementRecommendation

**File**: `src/components/achievements/NextAchievementRecommendation.tsx`

**Description**: Motivational widget suggesting next achievement to pursue

**Props Interface**:
```typescript
interface NextAchievementRecommendationProps {
  achievement: Achievement;
  onStartQuest: () => void;
}
```

**Example Usage**:
```tsx
<NextAchievementRecommendation
  achievement={closestAchievement}
  onStartQuest={() => navigate('/reading')}
/>
```

---

## Shop Components

### 1. ShopTabs

**File**: `src/components/shop/ShopTabs.tsx`

**Description**: Category tabs (Foods, Cosmetics, Power-Ups, Chests, Specials)

**Props Interface**:
```typescript
interface ShopTabsProps {
  currentTab: 'foods' | 'cosmetics' | 'powerups' | 'chests' | 'specials';
  onTabChange: (tab: string) => void;
}
```

**Example Usage**:
```tsx
<ShopTabs
  currentTab="foods"
  onTabChange={setCurrentTab}
/>
```

---

### 2. ShopItemGrid

**File**: `src/components/shop/ShopItemGrid.tsx`

**Description**: Grid of shop items with filtering

**Props Interface**:
```typescript
interface ShopItemGridProps {
  items: ShopItem[];
  category: string;
  onItemClick: (itemId: string) => void;
  userCoins: number;
  userGems: number;
}
```

**Example Usage**:
```tsx
<ShopItemGrid
  items={shopItems}
  category="foods"
  onItemClick={handleItemClick}
  userCoins={1250}
  userGems={15}
/>
```

**Children**:
- `ShopItemCard` (multiple)
- `CuisineFilter` (for foods category)

---

### 3. ShopItemCard

**File**: `src/components/shop/ShopItemCard.tsx`

**Description**: Individual shop item card with purchase button

**Props Interface**:
```typescript
interface ShopItemCardProps {
  item: ShopItem;
  onClick: () => void;
  canAfford: boolean;
  owned?: boolean;
}
```

**Example Usage**:
```tsx
<ShopItemCard
  item={shopItem}
  onClick={() => handlePurchase(shopItem.id)}
  canAfford={userCoins >= shopItem.price}
  owned={inventory.includes(shopItem.id)}
/>
```

**Children**:
- `ItemIcon` - Large item icon
- `PriceTag` - Coins or gems price
- `RarityBadge`
- `PurchaseButton` - Disabled if can't afford

**States**:
- **Can Afford**: Full color, enabled button
- **Can't Afford**: Grayscale, disabled button with tooltip
- **Owned**: "Owned" badge, purchase button hidden

---

### 4. PurchaseModal

**File**: `src/components/shop/PurchaseModal.tsx`

**Description**: Confirmation modal for shop purchases

**Props Interface**:
```typescript
interface PurchaseModalProps {
  item: ShopItem;
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  userCoins: number;
  userGems: number;
}
```

**Example Usage**:
```tsx
<PurchaseModal
  item={selectedItem}
  isOpen={isPurchaseModalOpen}
  onConfirm={handleConfirmPurchase}
  onCancel={() => setIsPurchaseModalOpen(false)}
  userCoins={userCoins}
  userGems={userGems}
/>
```

**Children**:
- `ItemDetails` - Name, description, effects
- `PriceDisplay` - Cost and remaining balance after purchase
- `ConfirmButton`
- `CancelButton`

---

### 5. PetFavoritesWidget

**File**: `src/components/shop/PetFavoritesWidget.tsx`

**Description**: Recommendation engine showing pet's favorite items

**Props Interface**:
```typescript
interface PetFavoritesWidgetProps {
  recommendedItems: ShopItem[];
  onItemClick: (itemId: string) => void;
}
```

**Example Usage**:
```tsx
<PetFavoritesWidget
  recommendedItems={petFavorites}
  onItemClick={handleItemClick}
/>
```

---

### 6. TreasureChestOpening

**File**: `src/components/shop/TreasureChestOpening.tsx`

**Description**: Animated chest opening with rewards reveal

**Props Interface**:
```typescript
interface TreasureChestOpeningProps {
  chest: ShopItem;
  rewards: {
    coins?: number;
    gems?: number;
    items?: ShopItem[];
  };
  onComplete: () => void;
}
```

**State**:
```typescript
const [isOpening, setIsOpening] = useState(true);
const [showRewards, setShowRewards] = useState(false);
```

**Example Usage**:
```tsx
<TreasureChestOpening
  chest={purchasedChest}
  rewards={chestContents}
  onComplete={handleChestComplete}
/>
```

**Animation Sequence**:
1. Chest idle animation (2 seconds)
2. Opening animation with particles (1.5 seconds)
3. Rewards reveal with stagger effect (3 seconds)
4. Confetti celebration

---

## Progress Components

### 1. XPChart

**File**: `src/components/progress/XPChart.tsx`

**Description**: Line chart showing XP earned over time

**Props Interface**:
```typescript
interface XPChartProps {
  data: Array<{ date: string; xp: number }>;
  period: 'week' | 'month' | 'all';
  onPeriodChange: (period: string) => void;
}
```

**Example Usage**:
```tsx
<XPChart
  data={xpHistory}
  period="week"
  onPeriodChange={setPeriod}
/>
```

**Library**: Use recharts or Chart.js

---

### 2. ActivityHeatmap

**File**: `src/components/progress/ActivityHeatmap.tsx`

**Description**: Calendar heatmap showing daily activity

**Props Interface**:
```typescript
interface ActivityHeatmapProps {
  data: Array<{ date: string; count: number }>;
}
```

**Example Usage**:
```tsx
<ActivityHeatmap
  data={dailyActivityData}
/>
```

**Visual**: GitHub-style contribution graph

---

### 3. PetEvolutionTimeline

**File**: `src/components/progress/PetEvolutionTimeline.tsx`

**Description**: Visual timeline of pet evolution history and future stages

**Props Interface**:
```typescript
interface PetEvolutionTimelineProps {
  evolutionHistory: EvolutionHistoryEntry[];
  currentStage: number;
  evolutionTrack: 'knowledge' | 'coolness' | 'culture';
  nextEvolutionLevel: number;
}
```

**Example Usage**:
```tsx
<PetEvolutionTimeline
  evolutionHistory={petEvolutionHistory}
  currentStage={2}
  evolutionTrack="knowledge"
  nextEvolutionLevel={12}
/>
```

**Children**:
- `EvolutionNode` - Each evolution stage with icon and date
- `ProgressLine` - Connecting line between stages
- `NextEvolutionCard` - Preview of next stage

---

### 4. LanguageLearningProgress

**File**: `src/components/progress/LanguageLearningProgress.tsx`

**Description**: Progress tracker for Korean and Mandarin vocabulary

**Props Interface**:
```typescript
interface LanguageLearningProgressProps {
  languages: Record<string, {
    wordsLearned: number;
    recentWords: string[];
    masteredWords: number;
  }>;
}
```

**Example Usage**:
```tsx
<LanguageLearningProgress
  languages={{
    Korean: {
      wordsLearned: 145,
      recentWords: ['농구', '피카츄', '우주'],
      masteredWords: 87
    },
    Mandarin: {
      wordsLearned: 23,
      recentWords: ['篮球', '皮卡丘'],
      masteredWords: 12
    }
  }}
/>
```

---

### 5. QuizPerformanceChart

**File**: `src/components/progress/QuizPerformanceChart.tsx`

**Description**: Bar chart showing quiz accuracy over time

**Props Interface**:
```typescript
interface QuizPerformanceChartProps {
  data: Array<{
    date: string;
    accuracy: number;
    questionsAnswered: number;
  }>;
  averageAccuracy: number;
}
```

**Example Usage**:
```tsx
<QuizPerformanceChart
  data={quizHistoryData}
  averageAccuracy={87}
/>
```

---

### 6. LearningGoals

**File**: `src/components/progress/LearningGoals.tsx`

**Description**: User-defined learning goals with progress tracking

**Props Interface**:
```typescript
interface LearningGoalsProps {
  goals: Array<{
    id: string;
    title: string;
    description: string;
    target: number;
    current: number;
    deadline?: number;
  }>;
  onAddGoal: () => void;
  onEditGoal: (goalId: string) => void;
  onDeleteGoal: (goalId: string) => void;
}
```

**Example Usage**:
```tsx
<LearningGoals
  goals={userGoals}
  onAddGoal={handleAddGoal}
  onEditGoal={handleEditGoal}
  onDeleteGoal={handleDeleteGoal}
/>
```

---

### 7. RecentAchievements

**File**: `src/components/progress/RecentAchievements.tsx`

**Description**: List of recently unlocked achievements

**Props Interface**:
```typescript
interface RecentAchievementsProps {
  achievements: Achievement[];
  limit?: number;
}
```

**Example Usage**:
```tsx
<RecentAchievements
  achievements={recentlyUnlocked}
  limit={5}
/>
```

---

## Profile Components

### 1. UserProfileCard

**File**: `src/components/profile/UserProfileCard.tsx`

**Description**: User profile display with avatar, name, grade level

**Props Interface**:
```typescript
interface UserProfileCardProps {
  user: {
    name: string;
    avatar: string;
    gradeLevel: string;
    level: number;
    xp: number;
  };
  onEditProfile: () => void;
}
```

**Example Usage**:
```tsx
<UserProfileCard
  user={userState}
  onEditProfile={handleEditProfile}
/>
```

---

### 2. PetCustomization

**File**: `src/components/profile/PetCustomization.tsx`

**Description**: Pet customization settings (name, track, accessories)

**Props Interface**:
```typescript
interface PetCustomizationProps {
  pet: PetState;
  ownedAccessories: string[];
  onPetNameChange: (name: string) => void;
  onEvolutionTrackChange: (track: string) => void;
  onAccessoryToggle: (accessoryId: string) => void;
}
```

**Example Usage**:
```tsx
<PetCustomization
  pet={petState}
  ownedAccessories={inventory.cosmetics}
  onPetNameChange={handlePetNameChange}
  onEvolutionTrackChange={handleTrackChange}
  onAccessoryToggle={handleAccessoryToggle}
/>
```

**Children**:
- `PetNameInput`
- `EvolutionTrackSelector`
- `AccessoryGrid`

---

### 3. LanguagePreferences

**File**: `src/components/profile/LanguagePreferences.tsx`

**Description**: Language learning preferences (secondary languages, default blend level)

**Props Interface**:
```typescript
interface LanguagePreferencesProps {
  settings: {
    primaryLanguage: string;
    secondaryLanguages: string[];
    defaultBlendLevel: number;
  };
  onPrimaryLanguageChange: (language: string) => void;
  onSecondaryLanguagesChange: (languages: string[]) => void;
  onDefaultBlendLevelChange: (level: number) => void;
}
```

**Example Usage**:
```tsx
<LanguagePreferences
  settings={userSettings}
  onPrimaryLanguageChange={handlePrimaryChange}
  onSecondaryLanguagesChange={handleSecondaryChange}
  onDefaultBlendLevelChange={handleBlendChange}
/>
```

---

### 4. LearningSettings

**File**: `src/components/profile/LearningSettings.tsx`

**Description**: Reading and quiz preferences

**Props Interface**:
```typescript
interface LearningSettingsProps {
  settings: {
    defaultPassageLength: number;
    defaultGradeLevel: string;
    defaultHumorLevel: number;
    hintsEnabled: boolean;
    romanizationEnabled: boolean;
  };
  onSettingChange: (key: string, value: any) => void;
}
```

**Example Usage**:
```tsx
<LearningSettings
  settings={userSettings}
  onSettingChange={handleSettingChange}
/>
```

---

### 5. ThemeSelector

**File**: `src/components/profile/ThemeSelector.tsx`

**Description**: Visual theme selection (Space, Jungle, Deep Sea, Minecraft, Tron)

**Props Interface**:
```typescript
interface ThemeSelectorProps {
  currentTheme: string;
  themes: string[];
  onThemeChange: (theme: string) => void;
}
```

**Example Usage**:
```tsx
<ThemeSelector
  currentTheme="Space"
  themes={['Space', 'Jungle', 'Deep Sea', 'Minecraft', 'Tron']}
  onThemeChange={handleThemeChange}
/>
```

**Children**:
- `ThemePreviewCard` (multiple) - Visual preview of each theme

---

### 6. SoundSettings

**File**: `src/components/profile/SoundSettings.tsx`

**Description**: Audio preferences (volume, TTS settings, highlighting)

**Props Interface**:
```typescript
interface SoundSettingsProps {
  settings: {
    soundEnabled: boolean;
    musicVolume: number;
    sfxVolume: number;
    ttsEnabled: boolean;
    ttsVoice: string;
    ttsSpeed: number;
    autoReadAloud: boolean;
    wordHighlighting: boolean;
  };
  onSettingChange: (key: string, value: any) => void;
}
```

**Example Usage**:
```tsx
<SoundSettings
  settings={userSettings}
  onSettingChange={handleSettingChange}
/>
```

---

### 7. NotificationSettings

**File**: `src/components/profile/NotificationSettings.tsx`

**Description**: Notification preferences (daily reminders, quest alerts, pet alerts)

**Props Interface**:
```typescript
interface NotificationSettingsProps {
  settings: {
    notificationsEnabled: boolean;
    dailyReminder: boolean;
    dailyReminderTime: string;
    questAlerts: boolean;
    petAlerts: boolean;
    achievementCelebrations: boolean;
  };
  onSettingChange: (key: string, value: any) => void;
}
```

**Example Usage**:
```tsx
<NotificationSettings
  settings={userSettings}
  onSettingChange={handleSettingChange}
/>
```

---

### 8. DataPrivacySettings

**File**: `src/components/profile/DataPrivacySettings.tsx`

**Description**: Data management (local storage, cache, export, delete)

**Props Interface**:
```typescript
interface DataPrivacySettingsProps {
  onExportData: () => void;
  onClearCache: () => void;
  onDeleteAccount: () => void;
}
```

**Example Usage**:
```tsx
<DataPrivacySettings
  onExportData={handleExportData}
  onClearCache={handleClearCache}
  onDeleteAccount={handleDeleteAccount}
/>
```

---

## Common/Shared Components

### 1. Button

**File**: `src/components/common/Button.tsx`

**Description**: Reusable button component with variants

**Props Interface**:
```typescript
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  className?: string;
}
```

**Example Usage**:
```tsx
<Button
  variant="primary"
  size="large"
  onClick={handleSubmit}
  disabled={isLoading}
  icon={<CheckIcon />}
>
  Confirm Purchase
</Button>
```

---

### 2. Card

**File**: `src/components/common/Card.tsx`

**Description**: Container card with hover effects

**Props Interface**:
```typescript
interface CardProps {
  children: React.ReactNode;
  onClick?: () => void;
  hoverable?: boolean;
  className?: string;
}
```

**Example Usage**:
```tsx
<Card hoverable onClick={handleClick}>
  <CardContent />
</Card>
```

---

### 3. ProgressBar

**File**: `src/components/common/ProgressBar.tsx`

**Description**: Animated progress bar

**Props Interface**:
```typescript
interface ProgressBarProps {
  current: number;
  total: number;
  color?: string;
  showLabel?: boolean;
  height?: number;
  animated?: boolean;
}
```

**Example Usage**:
```tsx
<ProgressBar
  current={2450}
  total={3000}
  color="blue"
  showLabel={true}
  animated={true}
/>
```

---

### 4. Modal

**File**: `src/components/common/Modal.tsx`

**Description**: Reusable modal dialog

**Props Interface**:
```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'small' | 'medium' | 'large' | 'fullscreen';
  showCloseButton?: boolean;
}
```

**Example Usage**:
```tsx
<Modal
  isOpen={isModalOpen}
  onClose={handleClose}
  title="Achievement Unlocked!"
  size="medium"
>
  <AchievementDetails />
</Modal>
```

---

### 5. Slider

**File**: `src/components/common/Slider.tsx`

**Description**: Range slider component

**Props Interface**:
```typescript
interface SliderProps {
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  label?: string;
  showValue?: boolean;
  marks?: Array<{ value: number; label: string }>;
}
```

**Example Usage**:
```tsx
<Slider
  value={blendLevel}
  min={0}
  max={10}
  step={1}
  onChange={setBlendLevel}
  label="Language Blend Level"
  showValue={true}
  marks={[
    { value: 0, label: '100% English' },
    { value: 5, label: '50/50' },
    { value: 10, label: '100% Korean' }
  ]}
/>
```

---

### 6. Toggle

**File**: `src/components/common/Toggle.tsx`

**Description**: Toggle switch component

**Props Interface**:
```typescript
interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
}
```

**Example Usage**:
```tsx
<Toggle
  checked={hintsEnabled}
  onChange={setHintsEnabled}
  label="Show Hints"
/>
```

---

### 7. Dropdown

**File**: `src/components/common/Dropdown.tsx`

**Description**: Dropdown select component

**Props Interface**:
```typescript
interface DropdownProps {
  value: string;
  options: Array<{ value: string; label: string }>;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}
```

**Example Usage**:
```tsx
<Dropdown
  value={selectedLanguage}
  options={[
    { value: 'korean', label: 'Korean' },
    { value: 'mandarin', label: 'Mandarin' }
  ]}
  onChange={setSelectedLanguage}
  placeholder="Select Language"
/>
```

---

### 8. Tooltip

**File**: `src/components/common/Tooltip.tsx`

**Description**: Hover tooltip component

**Props Interface**:
```typescript
interface TooltipProps {
  children: React.ReactNode;
  content: string | React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
}
```

**Example Usage**:
```tsx
<Tooltip content="This is Korean for 'basketball'" position="top">
  <span className="korean-word">농구</span>
</Tooltip>
```

---

### 9. Toast

**File**: `src/components/common/Toast.tsx`

**Description**: Toast notification component

**Props Interface**:
```typescript
interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  onClose: () => void;
}
```

**Example Usage**:
```tsx
<Toast
  message="+150 XP earned!"
  type="success"
  duration={3000}
  onClose={handleToastClose}
/>
```

**Usage Pattern** (with Context):
```tsx
const { showToast } = useToast();
showToast({ message: '+150 XP', type: 'success' });
```

---

### 10. Skeleton

**File**: `src/components/common/Skeleton.tsx`

**Description**: Loading skeleton placeholder

**Props Interface**:
```typescript
interface SkeletonProps {
  variant?: 'text' | 'circular' | 'rectangular';
  width?: number | string;
  height?: number | string;
  animation?: 'pulse' | 'wave';
}
```

**Example Usage**:
```tsx
<Skeleton variant="rectangular" width="100%" height={200} animation="wave" />
```

---

### 11. ConfettiAnimation

**File**: `src/components/animations/ConfettiAnimation.tsx`

**Description**: Celebratory confetti animation

**Props Interface**:
```typescript
interface ConfettiAnimationProps {
  trigger: boolean;
  duration?: number;
  onComplete?: () => void;
}
```

**Example Usage**:
```tsx
<ConfettiAnimation
  trigger={leveledUp}
  duration={3000}
  onComplete={handleConfettiComplete}
/>
```

**Library**: Use react-confetti

---

### 12. PetEmotionAnimation

**File**: `src/components/animations/PetEmotionAnimation.tsx`

**Description**: Pet emotion transition animations

**Props Interface**:
```typescript
interface PetEmotionAnimationProps {
  emotion: 'happy' | 'sad' | 'angry' | 'hungry' | 'excited' | 'bored' | 'love';
  petImage: string;
  onAnimationComplete?: () => void;
}
```

**Example Usage**:
```tsx
<PetEmotionAnimation
  emotion="excited"
  petImage={petImageUrl}
  onAnimationComplete={handleAnimationComplete}
/>
```

---

## State Management

### Global State (React Context)

**UserContext** - User profile, level, XP, coins, gems, streak
**File**: `src/contexts/UserContext.tsx`

```typescript
interface UserContextType {
  user: UserState;
  updateUser: (updates: Partial<UserState>) => void;
  addXP: (amount: number) => Promise<{ leveledUp: boolean; rewards?: any }>;
  addCoins: (amount: number) => void;
  addGems: (amount: number) => void;
  updateStreak: () => void;
}
```

---

**PetContext** - Pet state, emotions, evolution
**File**: `src/contexts/PetContext.tsx`

```typescript
interface PetContextType {
  pet: PetState;
  updatePet: (updates: Partial<PetState>) => void;
  feedPet: (foodId: string) => Promise<void>;
  playWithPet: () => Promise<void>;
  boostPet: () => Promise<void>;
  updatePetStats: () => void; // Called periodically (hunger increases)
}
```

---

**AchievementContext** - Achievement progress
**File**: `src/contexts/AchievementContext.tsx`

```typescript
interface AchievementContextType {
  achievements: Achievement[];
  updateAchievementProgress: (metric: string, value: number) => void;
  checkAchievementUnlocks: () => Achievement[];
}
```

---

**QuestContext** - Daily and weekly quests
**File**: `src/contexts/QuestContext.tsx`

```typescript
interface QuestContextType {
  dailyQuests: Quest[];
  weeklyQuests: Quest[];
  updateQuestProgress: (questId: string, progress: number) => void;
  claimQuestReward: (questId: string) => Promise<void>;
  refreshQuests: () => void;
}
```

---

**SettingsContext** - App settings and preferences
**File**: `src/contexts/SettingsContext.tsx`

```typescript
interface SettingsContextType {
  settings: UserSettings;
  updateSettings: (updates: Partial<UserSettings>) => void;
  resetSettings: () => void;
}
```

---

### Custom Hooks

**useLocalStorage** - localStorage abstraction
**File**: `src/hooks/useLocalStorage.ts`

```typescript
function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  // Implementation
}
```

---

**useAzureLLM** - Azure OpenAI integration
**File**: `src/hooks/useAzureLLM.ts`

```typescript
interface UseAzureLLMReturn {
  generateStory: (request: GenerateStoryRequest) => Promise<StoryContent>;
  generateQuiz: (storyId: string, config: QuizConfig) => Promise<Quiz>;
  generateAudio: (text: string, config: AudioConfig) => Promise<AudioData>;
  isGenerating: boolean;
  error: Error | null;
}
```

---

**useSpeechRecognition** - Browser Web Speech API
**File**: `src/hooks/useSpeechRecognition.ts`

```typescript
interface UseSpeechRecognitionReturn {
  transcript: string;
  isListening: boolean;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
  browserSupportsSpeechRecognition: boolean;
  error: string | null;
}
```

---

**useLanguageBlending** - Language blending logic
**File**: `src/hooks/useLanguageBlending.ts`

```typescript
interface UseLanguageBlendingReturn {
  blendText: (text: string, blendLevel: number, language: string) => BlendedText;
  extractVocabulary: (text: string, language: string) => string[];
}
```

---

**useDebounce** - Debounce helper
**File**: `src/hooks/useDebounce.ts`

```typescript
function useDebounce<T>(value: T, delay: number): T {
  // Implementation
}
```

---

**useToast** - Toast notification system
**File**: `src/hooks/useToast.ts`

```typescript
interface UseToastReturn {
  showToast: (toast: { message: string; type?: string; duration?: number }) => void;
}
```

---

## Component Testing Guidelines

### Testing Strategy

1. **Unit Tests**: All common components
2. **Integration Tests**: Feature components with context
3. **E2E Tests**: Critical user flows (generate story → read → quiz → rewards)

### Testing Libraries
- **Jest**: Test runner
- **React Testing Library**: Component testing
- **MSW (Mock Service Worker)**: API mocking

### Example Test Pattern

```typescript
// VirtualPet.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { VirtualPet } from './VirtualPet';
import { mockPetState, mockUserState } from '../test-utils/mockData';

describe('VirtualPet Component', () => {
  it('renders pet with correct emotion', () => {
    render(
      <VirtualPet
        pet={mockPetState}
        coins={1000}
        gems={10}
        size="large"
        onFeed={jest.fn()}
        onPlay={jest.fn()}
        onBoost={jest.fn()}
      />
    );

    expect(screen.getByAltText(/pet with happy emotion/i)).toBeInTheDocument();
  });

  it('calls onFeed when feed button clicked', () => {
    const onFeedMock = jest.fn();
    render(
      <VirtualPet
        pet={mockPetState}
        coins={1000}
        gems={10}
        size="large"
        onFeed={onFeedMock}
        onPlay={jest.fn()}
        onBoost={jest.fn()}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /feed/i }));
    expect(onFeedMock).toHaveBeenCalledTimes(1);
  });

  it('disables feed button when insufficient coins', () => {
    render(
      <VirtualPet
        pet={mockPetState}
        coins={10} // Not enough for food
        gems={10}
        size="large"
        onFeed={jest.fn()}
        onPlay={jest.fn()}
        onBoost={jest.fn()}
      />
    );

    expect(screen.getByRole('button', { name: /feed/i })).toBeDisabled();
  });
});
```

### Accessibility Testing

**Requirements**:
- All interactive elements must be keyboard accessible
- ARIA labels for screen readers
- Focus indicators visible
- Color contrast WCAG AA compliance

**Testing Pattern**:
```typescript
it('meets accessibility standards', async () => {
  const { container } = render(<VirtualPet {...props} />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

---

## Performance Optimization

### Memoization

**Use React.memo for expensive components**:
```typescript
export const VirtualPet = React.memo<VirtualPetProps>(({ pet, coins, gems, onFeed, onPlay, onBoost }) => {
  // Component implementation
});
```

**Use useMemo for expensive calculations**:
```typescript
const xpProgress = useMemo(() => {
  return (user.xp / user.xpToNextLevel) * 100;
}, [user.xp, user.xpToNextLevel]);
```

**Use useCallback for event handlers passed to children**:
```typescript
const handleFeed = useCallback((foodId: string) => {
  // Implementation
}, [dependencies]);
```

---

### Lazy Loading

**Code splitting by route**:
```typescript
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Reading = lazy(() => import('./pages/Reading'));
const Achievements = lazy(() => import('./pages/Achievements'));
```

**Image lazy loading**:
```tsx
<img src={petImage} alt="Pet" loading="lazy" />
```

---

### Virtual Scrolling

**For long lists (achievements, shop items)**:
```typescript
import { FixedSizeList } from 'react-window';

<FixedSizeList
  height={600}
  itemCount={achievements.length}
  itemSize={120}
  width="100%"
>
  {({ index, style }) => (
    <AchievementCard achievement={achievements[index]} style={style} />
  )}
</FixedSizeList>
```

---

## Next Steps

1. ✅ **Component Specifications Complete** - This document
2. ⏸️ **Audio Sync Architecture** - Detailed audio reading with highlighting
3. ⏸️ **Pet Evolution System Details** - Complete stage names and progression logic
4. ⏸️ **Component Implementation** - Start building React components
5. ⏸️ **Prototype Demo** - Build Virtual Pet standalone demo

---

**Document Status**: ✅ Complete
**Total Components Specified**: 60+ components
**Next Document**: Audio Sync Architecture (`docs/audio-sync-architecture.md`)
