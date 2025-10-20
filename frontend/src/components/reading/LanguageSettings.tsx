import React from 'react';
import type { LanguageSettings as LanguageSettingsType, SecondaryLanguage } from '@/types/story';

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

  if (collapsed) {
    return null; // Language settings typically not shown when collapsed
  }

  return (
    <div className="card py-2 px-3 space-y-1.5">
      <h3 className="text-child-sm font-bold text-gray-900 border-b border-gray-200 pb-1">
        🌍 Language Settings
      </h3>

      {/* Secondary Language Selection */}
      <div>
        <label className="block text-child-xs font-semibold text-gray-700 mb-1">
          Secondary Language:
        </label>
        <div className="flex gap-2">
          <button
            onClick={() => handleLanguageChange('ko')}
            className={`flex-1 py-1.5 px-2 rounded-lg font-semibold text-child-xs transition-all flex items-center justify-center gap-1.5 ${
              settings.secondaryLanguage === 'ko'
                ? 'bg-primary-500 text-white shadow-md'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            aria-label="Select Korean as secondary language"
            aria-pressed={settings.secondaryLanguage === 'ko'}
          >
            <span className="text-base" aria-hidden="true">🇰🇷</span>
            <span>Korean</span>
          </button>
          <button
            onClick={() => handleLanguageChange('zh')}
            className={`flex-1 py-1.5 px-2 rounded-lg font-semibold text-child-xs transition-all flex items-center justify-center gap-1.5 ${
              settings.secondaryLanguage === 'zh'
                ? 'bg-primary-500 text-white shadow-md'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            aria-label="Select Mandarin as secondary language"
            aria-pressed={settings.secondaryLanguage === 'zh'}
          >
            <span className="text-base" aria-hidden="true">🇨🇳</span>
            <span>Mandarin</span>
          </button>
        </div>
      </div>

      {/* Info: Blend level now controlled by real-time slider while reading */}
      <div className="bg-primary-50 rounded-lg p-2 border border-primary-200">
        <p className="text-[11px] text-primary-800">
          💡 <strong>Tip:</strong> Use the blend level slider while reading to adjust difficulty in real-time!
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
