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

  const handleBlendLevelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...settings, blendLevel: parseInt(e.target.value, 10) });
  };

  const handleToggle = (key: keyof LanguageSettingsType, value: boolean) => {
    onChange({ ...settings, [key]: value });
  };

  const getExampleText = () => {
    if (settings.blendLevel === 0) {
      return '"The brave astronaut flew through space."';
    } else if (settings.blendLevel <= 3) {
      return settings.secondaryLanguage === 'ko'
        ? '"The brave 우주비행사 (astronaut) flew through space."'
        : '"The brave 宇航员 (astronaut) flew through space."';
    } else if (settings.blendLevel <= 7) {
      return settings.secondaryLanguage === 'ko'
        ? '"The brave 우주비행사 (astronaut) flew through 우주 (space)."'
        : '"The brave 宇航员 (astronaut) flew through 太空 (space)."';
    } else {
      return settings.secondaryLanguage === 'ko'
        ? '"용감한 (brave) 우주비행사 (astronaut) flew through 우주 (space)."'
        : '"勇敢的 (brave) 宇航员 (astronaut) flew through 太空 (space)."';
    }
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

      {/* Blend Level Slider */}
      <div>
        <label htmlFor="blend-level" className="block text-child-xs font-semibold text-gray-700 mb-0.5">
          Blend Level: [{settings.blendLevel}]
        </label>
        <input
          id="blend-level"
          type="range"
          min="0"
          max="10"
          step="1"
          value={settings.blendLevel}
          onChange={handleBlendLevelChange}
          className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-500"
          aria-label="Language blend level slider"
          aria-valuemin={0}
          aria-valuemax={10}
          aria-valuenow={settings.blendLevel}
        />
        <div className="flex justify-between text-[10px] text-gray-600 mt-0.5">
          <span>0%<br/>English</span>
          <span>50%<br/>Mix</span>
          <span>100%<br/>{settings.secondaryLanguage === 'ko' ? 'Korean' : 'Mandarin'}</span>
        </div>
        <p className="text-[11px] text-gray-700 mt-0.5">
          Current: {settings.blendLevel * 10}% {settings.secondaryLanguage === 'ko' ? 'Korean' : 'Mandarin'} blending
        </p>
      </div>

      {/* Example Preview */}
      <div className="bg-gray-100 rounded-lg p-1.5 border border-gray-300">
        <p className="text-[9px] font-semibold text-gray-700 mb-0.5">Example:</p>
        <p className="text-[11px] text-gray-900 italic">
          {getExampleText()}
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
