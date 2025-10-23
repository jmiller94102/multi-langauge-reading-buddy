import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { PageLayout } from '@/components/layout/PageLayout';
import type { SidebarTab as SidebarTabType } from '@/components/layout/CollapsibleSidebar';
import { StorySettings } from '@/components/reading/StorySettings';
import { LanguageSettings } from '@/components/reading/LanguageSettings';
import { StoryPromptInput } from '@/components/reading/StoryPromptInput';
import { StoryDisplay } from '@/components/reading/StoryDisplay';
import { QuizComponent } from '@/components/reading/QuizComponent';
import { Button } from '@/components/common/Button';
import { generateStory, generateQuiz } from '@/services/azureOpenAI';
import type { StorySettings as StorySettingsType, LanguageSettings as LanguageSettingsType, Story } from '@/types/story';
import type { Quiz, QuizResult } from '@/types/quiz';
import { defaultStorySettings, defaultLanguageSettings } from '@/types/story';
import { defaultQuizSettings } from '@/types/quiz';
import { useUser } from '@/contexts/UserContext';
import { usePet } from '@/contexts/PetContext';
import { useQuests } from '@/contexts/QuestContext';
import { useAchievements } from '@/contexts/AchievementContext';
import { useStory } from '@/contexts/StoryContext';
import { calculateXPMultiplier, calculateCoinBonus } from '@/data/petEvolution';
import { NAV_ITEMS } from '@/types/navigation';
import { storyLibrary, type SavedStory } from '@/services/storyLibraryService';
import { useToast } from '@/contexts/ToastContext';

type ReadingState = 'input' | 'generating' | 'reading' | 'quiz' | 'complete';

export const Reading: React.FC = () => {
  // Navigation
  const navigate = useNavigate();
  const location = useLocation();

  // Context integration
  const { user, addXP, addCoins, updateStats } = useUser();
  const { pet } = usePet();
  const { updateQuestProgress, completeQuest } = useQuests();
  const { checkAchievements } = useAchievements();
  const { currentStory: story, currentQuiz: quiz, setCurrentStory: setStory, setCurrentQuiz: setQuiz, clearStory } = useStory();
  const { showToast } = useToast();

  // State management (excluding story/quiz which are now in context)
  const [currentState, setCurrentState] = useState<ReadingState>(story ? 'reading' : 'input');
  const [storySettings, setStorySettings] = useState<StorySettingsType>(defaultStorySettings);
  const [languageSettings, setLanguageSettings] = useState<LanguageSettingsType>(defaultLanguageSettings);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  // Library state
  const [savedStories, setSavedStories] = useState<SavedStory[]>([]);
  const [libraryFilter, setLibraryFilter] = useState<'all' | 'ko' | 'zh'>('all');

  // Load saved stories on mount
  useEffect(() => {
    loadSavedStories();
  }, [libraryFilter]);

  const loadSavedStories = async () => {
    try {
      const stories = libraryFilter === 'all'
        ? await storyLibrary.getAllStories()
        : await storyLibrary.getStoriesByLanguage(libraryFilter);
      setSavedStories(stories);
    } catch (error) {
      console.error('Failed to load stories:', error);
    }
  };

  const handleLoadSavedStory = (savedStory: SavedStory) => {
    setStory(savedStory.story);
    setQuiz(savedStory.quiz);
    setCurrentState('reading');
    showToast(`Loaded: ${savedStory.title}`, 'success');
  };

  const handleDeleteStory = async (id: string) => {
    try {
      await storyLibrary.deleteStory(id);
      showToast('Story deleted', 'success');
      loadSavedStories();
    } catch (error) {
      console.error('Failed to delete story:', error);
      showToast('Failed to delete story', 'error');
    }
  };

  // Create custom sidebar tabs for Reading page
  const settingsTabContent = (
    <div className="space-y-1.5">
      <StorySettings settings={storySettings} onChange={setStorySettings} />
      <LanguageSettings settings={languageSettings} onChange={setLanguageSettings} />
    </div>
  );

  const libraryTabContent = (
    <div className="space-y-2">
      {/* Filter Buttons */}
      <div className="flex gap-1">
        <button
          onClick={() => setLibraryFilter('all')}
          className={`flex-1 py-1 px-2 rounded text-[10px] font-semibold ${
            libraryFilter === 'all' ? 'bg-primary-500 text-white' : 'bg-gray-200 text-gray-700'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setLibraryFilter('ko')}
          className={`flex-1 py-1 px-2 rounded text-[10px] font-semibold ${
            libraryFilter === 'ko' ? 'bg-primary-500 text-white' : 'bg-gray-200 text-gray-700'
          }`}
        >
          🇰🇷
        </button>
        <button
          onClick={() => setLibraryFilter('zh')}
          className={`flex-1 py-1 px-2 rounded text-[10px] font-semibold ${
            libraryFilter === 'zh' ? 'bg-primary-500 text-white' : 'bg-gray-200 text-gray-700'
          }`}
        >
          🇨🇳
        </button>
      </div>

      {/* Saved Stories List */}
      <div className="space-y-1 max-h-96 overflow-y-auto">
        {savedStories.length === 0 ? (
          <p className="text-[11px] text-gray-600 text-center py-4">No saved stories yet</p>
        ) : (
          savedStories.map((savedStory) => (
            <div key={savedStory.id} className="bg-white rounded border border-gray-200 p-2 space-y-1">
              <p className="text-[11px] font-bold text-gray-900 truncate">{savedStory.title}</p>
              <p className="text-[10px] text-gray-600">
                {savedStory.language === 'ko' ? '🇰🇷' : '🇨🇳'} {savedStory.story.wordCount} words
              </p>
              <div className="flex gap-1">
                <button
                  onClick={() => handleLoadSavedStory(savedStory)}
                  className="flex-1 bg-primary-500 text-white text-[10px] font-semibold py-1 px-2 rounded hover:bg-primary-600"
                >
                  Load
                </button>
                <button
                  onClick={() => handleDeleteStory(savedStory.id)}
                  className="bg-gray-200 text-gray-700 text-[10px] font-semibold py-1 px-2 rounded hover:bg-red-100"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  const pagesTabContent = (
    <div className="space-y-1">
      {NAV_ITEMS.filter(item => item.id !== 'library').map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <button
            key={item.id}
            onClick={() => navigate(item.path)}
            className={`w-full text-left py-1.5 px-2 rounded-lg font-semibold text-[11px] transition-all flex items-center gap-1.5 ${
              isActive
                ? 'bg-primary-500 text-white shadow-md'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            aria-label={item.ariaLabel}
            aria-current={isActive ? 'page' : undefined}
          >
            <span className="text-base" aria-hidden="true">
              {item.icon}
            </span>
            <span>{item.label}</span>
          </button>
        );
      })}
    </div>
  );

  const customSidebarTabs: SidebarTabType[] = [
    {
      id: 'reading',
      label: 'Reading',
      icon: '📖',
      content: settingsTabContent,
    },
    {
      id: 'library',
      label: 'Library',
      icon: '📚',
      content: libraryTabContent,
    },
    {
      id: 'pages',
      label: 'Pages',
      icon: '🧭',
      content: pagesTabContent,
    },
  ];

  // Use customTabs approach to avoid double sidebar
  const shouldShowCustomTabs = currentState === 'input' || currentState === 'reading';

  const handlePromptChange = (prompt: string) => {
    setStorySettings({ ...storySettings, prompt });
  };

  const handleGenerate = async () => {
    setError(null);
    setCurrentState('generating');

    try {
      // Generate story
      const generatedStory = await generateStory(storySettings, languageSettings);
      setStory(generatedStory);

      // Generate quiz
      const generatedQuiz = await generateQuiz(generatedStory, defaultQuizSettings);
      setQuiz(generatedQuiz);

      setCurrentState('reading');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate story');
      setCurrentState('input');
    }
  };

  const handleFinishReading = () => {
    if (quiz) {
      setCurrentState('quiz');
    }
  };

  const handleQuizComplete = async (result: QuizResult) => {
    // Apply pet track bonuses
    const xpMultiplier = calculateXPMultiplier(pet.evolutionTrack, pet.evolutionStage);
    const coinBonus = calculateCoinBonus(pet.evolutionTrack, pet.evolutionStage);

    // Calculate language XP bonus for Culture track (when blend level is 7-10)
    const languageXPBonus =
      pet.evolutionTrack === 'culture' && languageSettings.blendLevel >= 7
        ? Math.floor((result.xpEarned + result.comboBonus) * (xpMultiplier - 1)) // Culture gets XP bonus too
        : 0;

    // Calculate final rewards with bonuses
    const baseXP = result.xpEarned + result.comboBonus;
    const bonusXP = Math.floor(baseXP * (xpMultiplier - 1)); // Additional XP from multiplier
    const totalXP = Math.floor(baseXP * xpMultiplier) + languageXPBonus;
    const totalCoins = result.coinsEarned + coinBonus;

    // Create enhanced result with bonus tracking
    const enhancedResult: QuizResult = {
      ...result,
      totalXP,
      totalCoins,
      petTrackBonus: {
        track: pet.evolutionTrack,
        stage: pet.evolutionStage,
        xpMultiplier,
        bonusXP,
        coinBonus,
        languageXPBonus,
      },
    };

    setQuizResult(enhancedResult);
    setCurrentState('complete');

    // Apply rewards to user
    await addXP(totalXP);
    await addCoins(totalCoins);

    // Update user stats
    const isPerfectScore = result.score === 100;
    await updateStats({
      totalReadings: user.stats.totalReadings + 1,
      totalQuizzes: user.stats.totalQuizzes + 1,
      totalCorrectAnswers: user.stats.totalCorrectAnswers + result.correctAnswers,
      averageQuizScore: Math.round(
        ((user.stats.averageQuizScore * user.stats.totalQuizzes) + result.score) / (user.stats.totalQuizzes + 1)
      ),
    });

    // Update quest progress
    await updateQuestProgress('daily-1', 1); // Reading quest
    if (result.score >= 80) {
      await completeQuest('daily-2'); // Quiz master quest (80%+)
    }
    if (languageSettings.blendLevel >= 3) {
      await completeQuest('daily-3'); // Language explorer quest
    }
    await updateQuestProgress('weekly-1', 1); // Weekly reading quest
    await updateQuestProgress('weekly-3', totalXP); // Weekly XP quest

    // Check for achievement unlocks
    await checkAchievements({
      totalReadings: user.stats.totalReadings + 1,
      totalQuizzes: user.stats.totalQuizzes + 1,
      perfectScores: isPerfectScore ? (user.stats as any).perfectScores + 1 : (user.stats as any).perfectScores,
      streak: user.streak,
    });
  };

  const handleNewStory = () => {
    clearStory(); // Clears both story and quiz from context and localStorage
    setQuizResult(null);
    setError(null);
    setCurrentState('input');
  };

  const handleBackToStory = () => {
    setCurrentState('reading');
  };

  const handleSaveStory = async () => {
    if (!story) return;

    try {
      await storyLibrary.saveStory(story, quiz);
      setIsSaved(true);
      showToast('Story saved to library!', 'success');
    } catch (error) {
      console.error('Failed to save story:', error);
      showToast('Failed to save story', 'error');
    }
  };

  return (
    <PageLayout
      customTabs={shouldShowCustomTabs ? customSidebarTabs : undefined}
      customDefaultTab={shouldShowCustomTabs ? 'reading' : undefined}
    >
      <div className="space-y-3">
        {/* State 1: Story Generation Input */}
        {currentState === 'input' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
            {/* Prompt Input Section (70%) */}
            <div className="lg:col-span-8 space-y-3">
              <StoryPromptInput
                prompt={storySettings.prompt}
                storySettings={storySettings}
                languageSettings={languageSettings}
                onPromptChange={handlePromptChange}
                onGenerate={handleGenerate}
                isGenerating={false}
              />

              {error && (
                <div className="card py-3 px-4 bg-red-50 border-2 border-red-300">
                  <p className="text-child-sm font-bold text-red-700">⚠️ Error</p>
                  <p className="text-child-xs text-red-600">{error}</p>
                </div>
              )}
            </div>

            {/* Right Panel: Pet & Tips (30%) */}
            <div className="lg:col-span-4 space-y-3">
              {/* Mini Pet Widget */}
              <div className="card py-3 px-4 text-center space-y-2">
                <h3 className="text-child-sm font-bold text-gray-900">🐾 Learning Buddy</h3>
                <div className="text-6xl animate-bounce-slow">😊</div>
                <p className="text-child-xs font-bold text-gray-900">{pet.name}</p>
                <div className="bg-blue-100 border border-blue-300 rounded-lg py-2 px-3">
                  <p className="text-[11px] text-blue-700 font-semibold">
                    💬 "What story should we read today?"
                  </p>
                </div>
              </div>

              {/* Story Generation Tips */}
              <div className="card py-3 px-4 space-y-2">
                <h3 className="text-child-sm font-bold text-gray-900">💡 Story Ideas</h3>
                <p className="text-child-xs text-gray-700">
                  Try describing an exciting adventure, a funny situation, or your favorite characters!
                </p>
                <p className="text-child-xs text-gray-700">
                  Use the microphone 🎤 to speak your story idea instead of typing.
                </p>
              </div>

              {/* Language Settings Info */}
              <div className="card py-3 px-4 space-y-2">
                <h3 className="text-child-sm font-bold text-gray-900">🌍 Current Settings</h3>
                <div className="space-y-1 text-child-xs text-gray-700">
                  <p>
                    Language: {languageSettings.secondaryLanguage === 'ko' ? '🇰🇷 Korean' : '🇨🇳 Mandarin'}
                  </p>
                  <p>Blend Level: {languageSettings.blendLevel}</p>
                  <p>Grade: {storySettings.gradeLevel}</p>
                  <p className="text-[10px] text-gray-500 italic mt-1">
                    Change settings in the Reading tab →
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* State 2: Generating Story */}
        {currentState === 'generating' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
            {/* Generating Animation (70%) */}
            <div className="lg:col-span-8">
              <div className="card py-12 px-8 text-center space-y-4">
                <div className="flex justify-center">
                  <div className="animate-spin text-6xl">⏳</div>
                </div>
                <h2 className="text-child-lg font-bold text-gray-900">
                  ✨ Generating Your Story
                </h2>
                <p className="text-child-base text-gray-700">
                  Creating a {storySettings.gradeLevel} grade story at Level {languageSettings.blendLevel}{' '}
                  ({languageSettings.secondaryLanguage === 'ko' ? 'Korean' : 'Mandarin'})
                </p>
                <p className="text-child-sm text-gray-600">
                  This may take 10-15 seconds...
                </p>
                <div className="text-7xl animate-bounce-slow">😊</div>
                <p className="text-child-xs text-gray-500 italic">
                  Your learning buddy is excited!
                </p>
              </div>
            </div>

            {/* Right Panel: Pet & Info (30%) */}
            <div className="lg:col-span-4 space-y-3">
              {/* Mini Pet Widget */}
              <div className="card py-3 px-4 text-center space-y-2">
                <h3 className="text-child-sm font-bold text-gray-900">🐾 Learning Buddy</h3>
                <div className="text-6xl animate-bounce-slow">😊</div>
                <p className="text-child-xs font-bold text-gray-900">{pet.name}</p>
                <div className="bg-purple-100 border border-purple-300 rounded-lg py-2 px-3">
                  <p className="text-[11px] text-purple-700 font-semibold">
                    💬 "This is going to be an amazing story!"
                  </p>
                </div>
              </div>

              {/* What's Happening */}
              <div className="card py-3 px-4 space-y-2">
                <h3 className="text-child-sm font-bold text-gray-900">🎨 Creating Your Story</h3>
                <p className="text-child-xs text-gray-700">
                  Our AI is writing a custom story just for you with the perfect mix of English and{' '}
                  {languageSettings.secondaryLanguage === 'ko' ? 'Korean' : 'Mandarin'}!
                </p>
                <p className="text-child-xs text-gray-700">
                  It's also preparing quiz questions to help you practice.
                </p>
              </div>

              {/* Fun Fact */}
              <div className="card py-3 px-4 space-y-2">
                <h3 className="text-child-sm font-bold text-gray-900">💡 Did You Know?</h3>
                <p className="text-child-xs text-gray-700">
                  {languageSettings.secondaryLanguage === 'ko'
                    ? 'Korean has 24 letters in its alphabet called Hangul, created in 1443!'
                    : 'Mandarin Chinese uses over 50,000 characters, but you only need about 3,000 to read a newspaper!'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* State 3: Reading Story */}
        {currentState === 'reading' && story && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
            {/* Story Display (70%) */}
            <div className="lg:col-span-8">
              <StoryDisplay
                story={story}
                onFinish={handleFinishReading}
                onGenerateNew={handleNewStory}
                onSaveStory={handleSaveStory}
                currentBlendLevel={languageSettings.blendLevel}
                showHints={languageSettings.showHints}
                showRomanization={languageSettings.showRomanization}
              />
            </div>

            {/* Right Panel: Pet & Progress (30%) */}
            <div className="lg:col-span-4 space-y-3">
              {/* Mini Pet Widget */}
              <div className="card py-3 px-4 text-center space-y-2">
                <h3 className="text-child-sm font-bold text-gray-900">🐾 Learning Buddy</h3>
                <div className="text-6xl animate-bounce-slow">😊</div>
                <p className="text-child-xs font-bold text-gray-900">Flutterpuff</p>
                <div className="bg-green-100 border border-green-300 rounded-lg py-2 px-3">
                  <p className="text-[11px] text-green-700 font-semibold">
                    💬 "Keep reading! You're doing great!"
                  </p>
                </div>
              </div>

              {/* Reading Progress */}
              <div className="card py-3 px-4 space-y-2">
                <h3 className="text-child-sm font-bold text-gray-900">📊 Reading Progress</h3>
                <div className="space-y-1 text-child-xs text-gray-700">
                  <p>
                    {languageSettings.secondaryLanguage === 'ko' ? 'Korean' : 'Mandarin'} Words: {story.koreanWordCount}
                  </p>
                  <p>Estimated Base XP: +50</p>
                  {pet.evolutionTrack === 'knowledge' && pet.evolutionStage > 0 && (
                    <p className="text-purple-600 font-semibold">
                      🐾 +{Math.round((calculateXPMultiplier(pet.evolutionTrack, pet.evolutionStage) - 1) * 100)}% Knowledge Bonus
                    </p>
                  )}
                  <p>Estimated Base Coins: +25</p>
                  {pet.evolutionTrack === 'coolness' && pet.evolutionStage > 0 && (
                    <p className="text-purple-600 font-semibold">
                      🐾 +{calculateCoinBonus(pet.evolutionTrack, pet.evolutionStage)} Coolness Bonus
                    </p>
                  )}
                  {pet.evolutionTrack === 'culture' && languageSettings.blendLevel >= 7 && pet.evolutionStage > 0 && (
                    <p className="text-purple-600 font-semibold">
                      🐾 +{Math.round((calculateXPMultiplier(pet.evolutionTrack, pet.evolutionStage) - 1) * 100)}% Culture Language Bonus
                    </p>
                  )}
                </div>
              </div>

              {/* Learning Tips */}
              <div className="card py-3 px-4 space-y-2">
                <h3 className="text-child-sm font-bold text-gray-900">💡 Learning Tips</h3>
                <p className="text-child-xs text-gray-700">
                  Try clicking on {languageSettings.secondaryLanguage === 'ko' ? 'Korean' : 'Chinese'} words to hear
                  pronunciation!
                </p>
                <p className="text-child-xs text-gray-700">
                  Toggle romanization to practice reading{' '}
                  {languageSettings.secondaryLanguage === 'ko' ? 'Hangul' : 'Chinese characters'}.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* State 4: Taking Quiz */}
        {currentState === 'quiz' && quiz && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
            {/* Quiz Component (70%) */}
            <div className="lg:col-span-8">
              <div className="card py-3 px-4 mb-3">
                <div className="flex items-center justify-between">
                  <h1 className="text-child-lg font-bold text-gray-900">
                    Quiz: {story?.title}
                  </h1>
                  <Button variant="outline" size="small" onClick={handleBackToStory} aria-label="Back to story">
                    ← Back to Story
                  </Button>
                </div>
              </div>
              <QuizComponent quiz={quiz} onComplete={handleQuizComplete} />
            </div>

            {/* Right Panel: Pet & Progress (30%) */}
            <div className="lg:col-span-4 space-y-3">
              <div className="card py-3 px-4 text-center space-y-2">
                <h3 className="text-child-sm font-bold text-gray-900">🐾 Learning Buddy</h3>
                <div className="text-6xl">😊</div>
                <p className="text-child-xs font-bold text-gray-900">Flutterpuff</p>
                <div className="bg-blue-100 border border-blue-300 rounded-lg py-2 px-3">
                  <p className="text-[11px] text-blue-700 font-semibold">💬 "You've got this!"</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* State 5: Quiz Complete */}
        {currentState === 'complete' && quizResult && (
          <div className="card py-12 px-8 text-center space-y-6">
            <div className="text-6xl mb-4">🎉</div>
            <h1 className="text-child-xl font-black text-gray-900">Great Job!</h1>
            <div className="space-y-3">
              <h2 className="text-child-lg font-bold text-gray-900">Quiz Complete!</h2>
              <p className="text-child-xl font-black text-primary-700">
                Score: {quizResult.correctAnswers} / {quizResult.totalQuestions} ({quizResult.score}%)
              </p>
              <div className="h-4 bg-gray-200 rounded-full overflow-hidden max-w-md mx-auto">
                <div
                  className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                  style={{ width: `${quizResult.score}%` }}
                />
              </div>
            </div>

            <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg py-4 px-6 max-w-md mx-auto">
              <p className="text-child-base font-bold text-yellow-900 mb-2">Rewards Earned:</p>
              <div className="space-y-1 text-child-sm text-yellow-800">
                <p>• +{quizResult.xpEarned} XP (questions)</p>
                <p>• +{quizResult.coinsEarned} coins</p>
                {quizResult.comboBonus > 0 && <p>• Combo bonus: +{quizResult.comboBonus} XP</p>}

                {/* Pet Track Bonuses */}
                {quizResult.petTrackBonus && (
                  <>
                    {quizResult.petTrackBonus.bonusXP > 0 && (
                      <p className="text-purple-700 font-semibold">
                        • 🐾 {quizResult.petTrackBonus.track === 'knowledge' && '📚 Knowledge'}{quizResult.petTrackBonus.track === 'coolness' && '😎 Coolness'}{quizResult.petTrackBonus.track === 'culture' && '🌍 Culture'} Bonus: +{quizResult.petTrackBonus.bonusXP} XP ({Math.round((quizResult.petTrackBonus.xpMultiplier - 1) * 100)}%)
                      </p>
                    )}
                    {quizResult.petTrackBonus.coinBonus > 0 && (
                      <p className="text-purple-700 font-semibold">
                        • 🐾 Coolness Bonus: +{quizResult.petTrackBonus.coinBonus} coins
                      </p>
                    )}
                    {quizResult.petTrackBonus.languageXPBonus > 0 && (
                      <p className="text-purple-700 font-semibold">
                        • 🐾 Culture Language Bonus: +{quizResult.petTrackBonus.languageXPBonus} XP
                      </p>
                    )}
                  </>
                )}

                <div className="border-t-2 border-yellow-400 my-2 pt-2">
                  <p className="font-bold">
                    Total: +{quizResult.totalXP} XP, +{quizResult.totalCoins} 🪙
                  </p>
                </div>
              </div>
            </div>

            <div className="text-7xl animate-bounce-slow">😊</div>
            <p className="text-child-base text-gray-700 italic">Pet happiness increased to 95%!</p>

            <div className="flex gap-3 justify-center pt-4">
              <Button
                variant="outline"
                size="large"
                onClick={() => setCurrentState('reading')}
                aria-label="Review story"
              >
                Review Story
              </Button>
              <Button variant="primary" size="large" onClick={handleNewStory} aria-label="Generate new story">
                Generate New Story
              </Button>
              <Button
                variant="outline"
                size="large"
                onClick={() => (window.location.href = '/dashboard')}
                aria-label="Back to dashboard"
              >
                Back to Dashboard
              </Button>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
};
