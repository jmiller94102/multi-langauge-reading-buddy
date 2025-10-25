import React from 'react';
import { useTranslation } from 'react-i18next';
import type { StorySettings as StorySettingsType, GradeLevel, HumorLevel, VisualTheme } from '@/types/story';

interface StorySettingsProps {
  settings: StorySettingsType;
  onChange: (settings: StorySettingsType) => void;
  collapsed?: boolean;
}

export const StorySettings: React.FC<StorySettingsProps> = ({ settings, onChange, collapsed = false }) => {
  const { t } = useTranslation();
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
        <h3 className="text-child-sm font-bold text-gray-900">⚙️ {t('reading.settings')}</h3>
        <p className="text-[11px] text-gray-600">{t('reading.clickToExpand')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      {/* Story Settings Card */}
      <div className="card py-1.5 px-2 space-y-1.5">
        <h3 className="text-child-xs font-bold text-gray-900 border-b border-gray-200 pb-1">
          📝 {t('reading.storySettings')}
        </h3>

        {/* Length Slider */}
        <div>
          <label htmlFor="story-length" className="block text-[11px] font-semibold text-gray-700 mb-1">
            {t('reading.storyLength', { length: settings.length })}
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
            aria-label={t('reading.storyLengthLabel')}
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
          <label className="block text-[11px] font-semibold text-gray-700 mb-1">
            {t('reading.gradeLevel')}
          </label>
          <div className="flex gap-1">
            {(['3rd', '4th', '5th', '6th'] as GradeLevel[]).map((grade) => (
              <button
                key={grade}
                onClick={() => handleGradeLevelChange(grade)}
                className={`flex-1 py-1 px-2 rounded-lg font-semibold text-[10px] transition-all ${
                  settings.gradeLevel === grade
                    ? 'bg-primary-500 text-white shadow-md'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                aria-label={t('reading.selectGradeLevel', { grade })}
                aria-pressed={settings.gradeLevel === grade}
              >
                {grade}
              </button>
            ))}
          </div>
        </div>

        {/* Humor Level */}
        <div>
          <label className="block text-[11px] font-semibold text-gray-700 mb-1">
            {t('reading.humorLevel')}
          </label>
          <div className="flex gap-1">
            {([
              { value: 'min', label: 'Min' },
              { value: 'max', label: 'Max' },
              { value: 'insane', label: 'Insane' },
            ] as { value: HumorLevel; label: string }[]).map(({ value, label }) => (
              <button
                key={value}
                onClick={() => handleHumorLevelChange(value)}
                className={`flex-1 py-1 px-2 rounded-lg font-semibold text-[10px] transition-all ${
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
          <label className="block text-[11px] font-semibold text-gray-700 mb-1">
            Visual Theme:
          </label>
          <div className="grid grid-cols-2 gap-1">
            {([
              { value: 'space', label: 'Space', emoji: '🚀' },
              { value: 'jungle', label: 'Jungle', emoji: '🌴' },
              { value: 'minecraft', label: 'Minecraft', emoji: '⛏️' },
              { value: 'tron', label: 'Tron', emoji: '💠' },
            ] as { value: VisualTheme; label: string; emoji: string }[]).map(({ value, label, emoji }) => (
              <button
                key={value}
                onClick={() => handleThemeChange(value)}
                className={`text-center py-1 px-1 rounded-lg font-semibold text-[10px] transition-all flex flex-col items-center gap-0.5 ${
                  settings.visualTheme === value
                    ? 'bg-purple-500 text-white shadow-md'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                aria-label={`Select ${label} theme`}
                aria-pressed={settings.visualTheme === value}
              >
                <span className="text-base" aria-hidden="true">{emoji}</span>
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Optional Vocabulary Card */}
      <div className="card py-1.5 px-2 space-y-1">
        <h3 className="text-child-xs font-bold text-gray-900 border-b border-gray-200 pb-1">
          📚 Optional Vocabulary
        </h3>
        <textarea
          value={settings.customVocabulary?.join(', ') || ''}
          onChange={handleCustomVocabularyChange}
          placeholder="basketball, teamwork, victory, strategy, champion"
          className="w-full p-1.5 border border-gray-300 rounded-lg text-[11px] resize-none focus:outline-none focus:ring-2 focus:ring-primary-500"
          rows={2}
          aria-label="Custom vocabulary words (comma-separated)"
        />
        <p className="text-[10px] text-gray-600 italic">
          Comma-separated words to include in the story
        </p>
      </div>
    </div>
  );
};
