import React, { useState } from 'react';
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
import { mockPet } from '@/utils/mockData';
import { calculateXPMultiplier, calculateCoinBonus } from '@/data/petEvolution';

type ReadingState = 'input' | 'generating' | 'reading' | 'quiz' | 'complete';

export const Reading: React.FC = () => {
  // State management
  const [currentState, setCurrentState] = useState<ReadingState>('input');
  const [storySettings, setStorySettings] = useState<StorySettingsType>(defaultStorySettings);
  const [languageSettings, setLanguageSettings] = useState<LanguageSettingsType>(defaultLanguageSettings);
  const [story, setStory] = useState<Story | null>(null);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true); // Collapsible sidebar state
  const [currentBlendLevel, setCurrentBlendLevel] = useState(languageSettings.blendLevel); // Real-time blend level
  const [showHints, setShowHints] = useState(true); // Real-time hint toggle
  const [showRomanization, setShowRomanization] = useState(true); // Real-time romanization toggle

  // TODO: Replace with actual pet state from PetContext in Phase 2+
  const pet = mockPet;

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

  const handleQuizComplete = (result: QuizResult) => {
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

    // TODO: Apply rewards to user state in Phase 2+
    // setUser((prev) => ({
    //   ...prev,
    //   xp: prev.xp + totalXP,
    //   coins: prev.coins + totalCoins,
    // }));
  };

  const handleNewStory = () => {
    setStory(null);
    setQuiz(null);
    setQuizResult(null);
    setError(null);
    setCurrentState('input');
  };

  const handleBackToStory = () => {
    setCurrentState('reading');
  };

  return (
    <div className="relative">
      {/* Sidebar Toggle Button (Fixed Position) */}
      {(currentState === 'input' || currentState === 'reading') && (
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="fixed left-0 top-24 z-50 bg-primary-600 hover:bg-primary-700 text-white px-2 py-4 rounded-r-lg shadow-lg transition-all duration-300 hover:px-3"
          style={{
            left: sidebarOpen ? '504px' : '0px',
            transition: 'left 0.3s ease',
          }}
          aria-label={sidebarOpen ? 'Close settings panel' : 'Open settings panel'}
        >
          <span className="text-xl font-bold">
            {sidebarOpen ? '◀' : '▶'}
          </span>
        </button>
      )}

      {/* Collapsible Settings Sidebar */}
      {(currentState === 'input' || currentState === 'reading') && (
        <div
          className="fixed left-0 top-16 h-[calc(100vh-4rem)] bg-gray-50 border-r-2 border-gray-200 overflow-y-auto transition-all duration-300 shadow-lg z-40"
          style={{
            width: sidebarOpen ? '504px' : '0px',
            padding: sidebarOpen ? '24px' : '0',
            opacity: sidebarOpen ? 1 : 0,
          }}
        >
          {sidebarOpen && (
            <div className="space-y-3">
              <h2 className="text-child-lg font-bold text-gray-900 mb-3 border-b-2 border-gray-300 pb-2">
                ⚙️ Settings
              </h2>
              <StorySettings settings={storySettings} onChange={setStorySettings} />
              <LanguageSettings settings={languageSettings} onChange={setLanguageSettings} />

              {/* Real-Time Blend Level Slider (when reading) */}
              {currentState === 'reading' && (
                <div className="card py-3 px-4 space-y-2 bg-primary-50 border-2 border-primary-300">
                  <h3 className="text-child-sm font-bold text-primary-900">
                    🎚️ Real-Time Blend Level
                  </h3>
                  <p className="text-[11px] text-primary-700">
                    Adjust how you view the story:
                  </p>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={currentBlendLevel}
                    onChange={(e) => setCurrentBlendLevel(parseInt(e.target.value))}
                    className="w-full h-2 bg-primary-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                    aria-label="Blend level slider"
                  />
                  <div className="flex justify-between text-[10px] text-primary-700">
                    <span>More Help</span>
                    <span className="font-bold text-primary-900">Level {currentBlendLevel}</span>
                    <span>Less Help</span>
                  </div>
                  <p className="text-[11px] text-primary-600 italic">
                    {currentBlendLevel === 0 && '💡 Full assistance - See all hints'}
                    {currentBlendLevel > 0 && currentBlendLevel <= 3 && '📚 Moderate help - Most hints visible'}
                    {currentBlendLevel > 3 && currentBlendLevel <= 6 && '⚖️ Balanced - Some hints hidden'}
                    {currentBlendLevel > 6 && currentBlendLevel < 10 && '🔥 Advanced - Minimal hints'}
                    {currentBlendLevel === 10 && '🏆 Expert - Challenge yourself!'}
                  </p>

                  {/* Hint and Romanization Toggles */}
                  <div className="space-y-2 pt-2 border-t border-primary-200">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={showHints}
                        onChange={(e) => setShowHints(e.target.checked)}
                        className="w-4 h-4 accent-primary-600"
                      />
                      <span className="text-[11px] text-primary-800">Show translations</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={showRomanization}
                        onChange={(e) => setShowRomanization(e.target.checked)}
                        className="w-4 h-4 accent-primary-600"
                      />
                      <span className="text-[11px] text-primary-800">Show romanization</span>
                    </label>
                  </div>

                  <p className="text-[10px] text-primary-600 pt-2 border-t border-primary-200">
                    💡 Tip: Try reading without hints for extra challenge!
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Main Content Area with Dynamic Margin */}
      <div
        className="space-y-3 transition-all duration-300 max-w-7xl mx-auto"
        style={{
          marginLeft: sidebarOpen && (currentState === 'input' || currentState === 'reading') ? '504px' : '0',
        }}
      >
        {/* State 1: Story Generation Input */}
        {currentState === 'input' && (
          <>
            <div className="grid grid-cols-1 gap-3">
              {/* Prompt Input Section (Full Width when sidebar open) */}
              <div className="space-y-3">
                <StoryPromptInput
                  prompt={storySettings.prompt}
                  storySettings={storySettings}
                  languageSettings={languageSettings}
                  onPromptChange={handlePromptChange}
                  onGenerate={handleGenerate}
                  isGenerating={false}
                />
              </div>
            </div>

            {error && (
              <div className="card py-3 px-4 bg-red-50 border-2 border-red-300">
                <p className="text-child-sm font-bold text-red-700">⚠️ Error</p>
                <p className="text-child-xs text-red-600">{error}</p>
              </div>
            )}
          </>
        )}

        {/* State 2: Generating Story */}
        {currentState === 'generating' && (
          <div className="card py-12 px-8 text-center space-y-4">
            <div className="flex justify-center">
              <div className="animate-spin text-6xl">⏳</div>
            </div>
            <h2 className="text-child-lg font-bold text-gray-900">
              ✨ Generating Your Story
            </h2>
            <p className="text-child-base text-gray-700">
              Creating a {storySettings.gradeLevel} grade story with {languageSettings.blendLevel * 10}%{' '}
              {languageSettings.secondaryLanguage === 'ko' ? 'Korean' : 'Mandarin'} blending
            </p>
            <p className="text-child-sm text-gray-600">
              This may take 10-15 seconds...
            </p>
            <div className="text-7xl animate-bounce-slow">😊</div>
            <p className="text-child-xs text-gray-500 italic">
              Your learning buddy is excited!
            </p>
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
                currentBlendLevel={currentBlendLevel}
                showHints={showHints}
                showRomanization={showRomanization}
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
    </div>
  );
};
