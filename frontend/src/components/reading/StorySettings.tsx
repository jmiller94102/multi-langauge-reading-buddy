import React from 'react';
import type { StorySettings as StorySettingsType, GradeLevel, HumorLevel, VisualTheme } from '@/types/story';

interface StorySettingsProps {
  settings: StorySettingsType;
  onChange: (settings: StorySettingsType) => void;
  collapsed?: boolean;
}

export const StorySettings: React.FC<StorySettingsProps> = ({ settings, onChange, collapsed = false }) => {
  const handleLengthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...settings, length: parseInt(e.target.value, 10) });
  };

  const handleGradeLevelChange = (gradeLevel: GradeLevel) => {
    onChange({ ...settings, gradeLevel });
  };

  const handleHumorLevelChange = (humorLevel: HumorLevel) => {
    onChange({ ...settings, humorLevel });
  };

  const handleThemeChange = (visualTheme: VisualTheme) => {
    onChange({ ...settings, visualTheme });
  };

  const handleCustomVocabularyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const vocab = e.target.value.split(',').map((v) => v.trim()).filter((v) => v.length > 0);
    onChange({ ...settings, customVocabulary: vocab });
  };

  if (collapsed) {
    return (
      <div className="card py-2 px-3">
        <h3 className="text-child-sm font-bold text-gray-900">⚙️ Settings</h3>
        <p className="text-[11px] text-gray-600">Click to expand</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Story Settings Card */}
      <div className="card py-3 px-4 space-y-3">
        <h3 className="text-child-base font-bold text-gray-900 border-b-2 border-gray-200 pb-2">
          📝 Story Settings
        </h3>

        {/* Length Slider */}
        <div>
          <label htmlFor="story-length" className="block text-child-sm font-semibold text-gray-700 mb-2">
            Story Length: {settings.length} words
          </label>
          <input
            id="story-length"
            type="range"
            min="250"
            max="2000"
            step="50"
            value={settings.length}
            onChange={handleLengthChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-500"
            aria-label="Story length slider"
            aria-valuemin={250}
            aria-valuemax={2000}
            aria-valuenow={settings.length}
          />
          <div className="flex justify-between text-[11px] text-gray-600 mt-1">
            <span>250</span>
            <span>1000</span>
            <span>2000</span>
          </div>
        </div>

        {/* Grade Level */}
        <div>
          <label className="block text-child-sm font-semibold text-gray-700 mb-2">
            Grade Level:
          </label>
          <div className="flex gap-2">
            {(['3rd', '4th', '5th', '6th'] as GradeLevel[]).map((grade) => (
              <button
                key={grade}
                onClick={() => handleGradeLevelChange(grade)}
                className={`flex-1 py-2 px-3 rounded-lg font-semibold text-child-xs transition-all ${
                  settings.gradeLevel === grade
                    ? 'bg-primary-500 text-white shadow-md'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                aria-label={`Select ${grade} grade level`}
                aria-pressed={settings.gradeLevel === grade}
              >
                {grade}
              </button>
            ))}
          </div>
        </div>

        {/* Humor Level */}
        <div>
          <label className="block text-child-sm font-semibold text-gray-700 mb-2">
            Humor Level:
          </label>
          <div className="grid grid-cols-2 gap-2">
            {([
              { value: 'none', label: 'None' },
              { value: 'light', label: 'Light' },
              { value: 'moderate', label: 'Moderate' },
              { value: 'heavy', label: 'Heavy' },
            ] as { value: HumorLevel; label: string }[]).map(({ value, label }) => (
              <button
                key={value}
                onClick={() => handleHumorLevelChange(value)}
                className={`py-2 px-3 rounded-lg font-semibold text-child-xs transition-all ${
                  settings.humorLevel === value
                    ? 'bg-accent-500 text-white shadow-md'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                aria-label={`Select ${label} humor level`}
                aria-pressed={settings.humorLevel === value}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Visual Theme */}
        <div>
          <label className="block text-child-sm font-semibold text-gray-700 mb-2">
            Visual Theme:
          </label>
          <div className="space-y-2">
            {([
              { value: 'space', label: 'Space', emoji: '🚀' },
              { value: 'jungle', label: 'Jungle', emoji: '🌴' },
              { value: 'deepSea', label: 'Deep Sea', emoji: '🌊' },
              { value: 'minecraft', label: 'Minecraft', emoji: '⛏️' },
              { value: 'tron', label: 'Tron', emoji: '💠' },
            ] as { value: VisualTheme; label: string; emoji: string }[]).map(({ value, label, emoji }) => (
              <button
                key={value}
                onClick={() => handleThemeChange(value)}
                className={`w-full text-left py-2 px-3 rounded-lg font-semibold text-child-xs transition-all flex items-center gap-2 ${
                  settings.visualTheme === value
                    ? 'bg-purple-500 text-white shadow-md'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                aria-label={`Select ${label} theme`}
                aria-pressed={settings.visualTheme === value}
              >
                <span className="text-lg" aria-hidden="true">{emoji}</span>
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Custom Vocabulary Card */}
      <div className="card py-3 px-4 space-y-2">
        <h3 className="text-child-base font-bold text-gray-900 border-b-2 border-gray-200 pb-2">
          📚 Custom Vocabulary (Optional)
        </h3>
        <textarea
          value={settings.customVocabulary?.join(', ') || ''}
          onChange={handleCustomVocabularyChange}
          placeholder="basketball, teamwork, victory, strategy, champion"
          className="w-full p-2 border border-gray-300 rounded-lg text-child-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary-500"
          rows={3}
          aria-label="Custom vocabulary words (comma-separated)"
        />
        <p className="text-[11px] text-gray-600 italic">
          Comma-separated words to include in the story
        </p>
      </div>
    </div>
  );
};
