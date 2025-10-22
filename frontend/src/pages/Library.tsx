import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageLayout } from '@/components/layout/PageLayout';
import { Button } from '@/components/common/Button';
import { storyLibrary, type SavedStory } from '@/services/storyLibraryService';
import { useStory } from '@/contexts/StoryContext';
import { useToast } from '@/contexts/ToastContext';

export const Library: React.FC = () => {
  const navigate = useNavigate();
  const { setCurrentStory, setCurrentQuiz } = useStory();
  const { showToast } = useToast();

  const [savedStories, setSavedStories] = useState<SavedStory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'ko' | 'zh'>('all');

  // Load saved stories on mount
  useEffect(() => {
    loadStories();
  }, [filter]);

  const loadStories = async () => {
    setIsLoading(true);
    try {
      const stories = filter === 'all'
        ? await storyLibrary.getAllStories()
        : await storyLibrary.getStoriesByLanguage(filter);
      setSavedStories(stories);
    } catch (error) {
      console.error('Failed to load stories:', error);
      showToast('Failed to load library', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadStory = (savedStory: SavedStory) => {
    setCurrentStory(savedStory.story);
    setCurrentQuiz(savedStory.quiz);
    showToast('Story loaded!', 'success');
    navigate('/reading');
  };

  const handleDownload = (savedStory: SavedStory) => {
    storyLibrary.downloadStoryAsText(savedStory);
    showToast('Story downloaded!', 'success');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this story from your library?')) return;

    try {
      await storyLibrary.deleteStory(id);
      showToast('Story deleted', 'success');
      loadStories();
    } catch (error) {
      console.error('Failed to delete story:', error);
      showToast('Failed to delete story', 'error');
    }
  };

  return (
    <PageLayout>
      <div className="space-y-4">
        {/* Header */}
        <div className="card py-4 px-6">
          <h1 className="text-child-xl font-black text-gray-900 mb-2">📚 Story Library</h1>
          <p className="text-child-sm text-gray-700">Your saved stories and quizzes</p>

          {/* Filter Tabs */}
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg text-child-sm font-semibold transition-colors ${
                filter === 'all'
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              All Stories
            </button>
            <button
              onClick={() => setFilter('ko')}
              className={`px-4 py-2 rounded-lg text-child-sm font-semibold transition-colors ${
                filter === 'ko'
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Korean
            </button>
            <button
              onClick={() => setFilter('zh')}
              className={`px-4 py-2 rounded-lg text-child-sm font-semibold transition-colors ${
                filter === 'zh'
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Mandarin
            </button>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="card py-12 text-center">
            <div className="text-6xl animate-spin mb-4">⏳</div>
            <p className="text-child-base text-gray-700">Loading library...</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && savedStories.length === 0 && (
          <div className="card py-12 text-center space-y-4">
            <div className="text-7xl">📖</div>
            <h2 className="text-child-lg font-bold text-gray-900">No Saved Stories</h2>
            <p className="text-child-base text-gray-700">
              Save stories from the Reading page to build your library!
            </p>
            <Button
              variant="primary"
              size="large"
              onClick={() => navigate('/reading')}
              className="mt-4"
            >
              Go to Reading
            </Button>
          </div>
        )}

        {/* Story Grid */}
        {!isLoading && savedStories.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedStories.map((savedStory) => (
              <div key={savedStory.id} className="card py-4 px-4 space-y-3">
                {/* Story Info */}
                <div>
                  <h3 className="text-child-md font-bold text-gray-900 mb-1">
                    {savedStory.title}
                  </h3>
                  <div className="flex items-center gap-2 text-child-xs text-gray-600">
                    <span>
                      {savedStory.language === 'ko' ? '🇰🇷 Korean' : '🇨🇳 Mandarin'}
                    </span>
                    <span>•</span>
                    <span>{savedStory.story.wordCount} words</span>
                  </div>
                  <p className="text-child-xs text-gray-500 mt-1">
                    Saved: {new Date(savedStory.savedAt).toLocaleDateString()}
                  </p>
                </div>

                {/* Actions */}
                <div className="space-y-2">
                  <Button
                    variant="primary"
                    size="small"
                    onClick={() => handleLoadStory(savedStory)}
                    className="w-full"
                  >
                    <span className="flex items-center justify-center gap-2">
                      <span>📖</span>
                      <span>Load Story</span>
                    </span>
                  </Button>

                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="small"
                      onClick={() => handleDownload(savedStory)}
                    >
                      <span className="flex items-center justify-center gap-1">
                        <span>⬇️</span>
                        <span>Download</span>
                      </span>
                    </Button>
                    <Button
                      variant="outline"
                      size="small"
                      onClick={() => handleDelete(savedStory.id)}
                      className="hover:bg-red-50 hover:border-red-300"
                    >
                      <span className="flex items-center justify-center gap-1">
                        <span>🗑️</span>
                        <span>Delete</span>
                      </span>
                    </Button>
                  </div>
                </div>

                {/* Quiz Indicator */}
                {savedStory.quiz && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg py-2 px-3">
                    <p className="text-child-xs text-blue-700 font-semibold text-center">
                      ✅ Includes {savedStory.quiz.questions.length} quiz questions
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
};
