import React from 'react';
import type { LanguageSettings as LanguageSettingsType, SecondaryLanguage } from '@/types/story';
import { SecondaryLanguageSelector } from '@/components/common/SecondaryLanguageSelector';

interface LanguageSettingsProps {
  settings: LanguageSettingsType;
  onChange: (settings: LanguageSettingsType) => void;
  collapsed?: boolean;
}

export const LanguageSettings: React.FC<LanguageSettingsProps> = ({ settings, onChange, collapsed = false }) => {
  const handleLanguageChange = (secondaryLanguage: SecondaryLanguage) => {
    onChange({ ...settings, secondaryLanguage });
  };

  const handleToggle = (key: keyof LanguageSettingsType, value: boolean) => {
    onChange({ ...settings, [key]: value });
  };

  const handleBlendLevelChange = (blendLevel: number) => {
    onChange({ ...settings, blendLevel });
  };

  if (collapsed) {
    return null; // Language settings typically not shown when collapsed
  }

  return (
    <div className="card py-2 px-3 space-y-1.5">
      <h3 className="text-child-sm font-bold text-gray-900 border-b border-gray-200 pb-1">
        🌍 Language Settings
      </h3>

      {/* Secondary Language Selection */}
      <SecondaryLanguageSelector
        selectedLanguage={settings.secondaryLanguage}
        onChange={handleLanguageChange}
      />

      {/* Blend Level Slider */}
      <div className="bg-primary-50 rounded-lg p-2 border border-primary-200">
        <label className="block text-child-xs font-semibold text-primary-900 mb-1">
          🎚️ Real-Time Blend Level
        </label>
        <p className="text-[10px] text-primary-700 mb-1.5">
          Adjust how you view the story:
        </p>
        <input
          type="range"
          min="0"
          max="4"
          value={settings.blendLevel}
          onChange={(e) => handleBlendLevelChange(parseInt(e.target.value))}
          className="w-full h-2 bg-primary-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
          aria-label="Blend level slider"
        />
        <div className="flex justify-between text-[10px] text-primary-700 mt-1">
          <span>More English</span>
          <span className="font-bold text-primary-900">Level {settings.blendLevel}</span>
          <span>More {settings.secondaryLanguage === 'ko' ? 'Korean' : 'Mandarin'}</span>
        </div>
        <p className="text-[10px] text-primary-600 italic mt-1.5">
          {settings.blendLevel === 0 && '💡 Vocabulary recognition - Learn nouns and verbs'}
          {settings.blendLevel === 1 && '📚 Vocabulary recognition - Learn nouns and verbs with inline hints'}
          {settings.blendLevel === 2 && '⚖️ Noun immersion + sentence mixing (2:1)'}
          {settings.blendLevel === 3 && '🔥 Balanced mix - Alternating sentences (1:1)'}
          {settings.blendLevel === 4 && `🏆 100% ${settings.secondaryLanguage === 'ko' ? 'Korean' : 'Mandarin'} - Full immersion!`}
        </p>
      </div>

      {/* Display Options */}
      <div>
        <label className="block text-child-xs font-semibold text-gray-700 mb-0.5">
          Display Options:
        </label>
        <div className="space-y-0.5">
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.showHints}
              onChange={(e) => handleToggle('showHints', e.target.checked)}
              className="w-3.5 h-3.5 accent-primary-500"
              aria-label="Show translation hints"
            />
            <span className="text-child-xs text-gray-700">Show translation hints</span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.showRomanization}
              onChange={(e) => handleToggle('showRomanization', e.target.checked)}
              className="w-3.5 h-3.5 accent-primary-500"
              aria-label="Show romanization"
            />
            <span className="text-child-xs text-gray-700">
              Show romanization {settings.secondaryLanguage === 'ko' ? '(u-ju-bi-haeng-sa)' : '(yǔ háng yuán)'}
            </span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.audioEnabled}
              onChange={(e) => handleToggle('audioEnabled', e.target.checked)}
              className="w-3.5 h-3.5 accent-primary-500"
              aria-label="Enable audio support"
            />
            <span className="text-child-xs text-gray-700">Audio support (read aloud)</span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.autoPlay}
              onChange={(e) => handleToggle('autoPlay', e.target.checked)}
              className="w-3.5 h-3.5 accent-primary-500"
              aria-label="Auto-play on generate"
            />
            <span className="text-child-xs text-gray-700">Auto-play on generate</span>
          </label>
        </div>
      </div>
    </div>
  );
};
