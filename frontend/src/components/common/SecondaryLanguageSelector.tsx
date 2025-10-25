import React from 'react';
import { useTranslation } from 'react-i18next';
import { Book } from 'lucide-react';
import type { SecondaryLanguage } from '@/types/story';

interface SecondaryLanguageSelectorProps {
  selectedLanguage: SecondaryLanguage;
  onChange: (language: SecondaryLanguage) => void;
  className?: string;
}

interface SecondaryLanguageOption {
  code: SecondaryLanguage;
  name: string;
  nativeName: string;
  flag: string;
}

const SECONDARY_LANGUAGES: SecondaryLanguageOption[] = [
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
  { code: 'zh', name: 'Mandarin Chinese', nativeName: '中文', flag: '🇨🇳' },
];

export const SecondaryLanguageSelector: React.FC<SecondaryLanguageSelectorProps> = ({
  selectedLanguage,
  onChange,
  className = '',
}) => {
  const { t } = useTranslation();

  return (
    <div className={`space-y-2 ${className}`}>
      <label
        htmlFor="secondary-language-select"
        className="block text-child-xs font-semibold text-gray-700"
      >
        <Book className="inline w-4 h-4 mr-1" aria-hidden="true" />
        {t('languageSelector.secondaryLanguage')}
      </label>
      <select
        id="secondary-language-select"
        value={selectedLanguage}
        onChange={(e) => onChange(e.target.value as SecondaryLanguage)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 text-sm font-medium shadow-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors cursor-pointer"
        aria-label={t('reading.secondaryLanguage')}
      >
        {SECONDARY_LANGUAGES.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.flag} {lang.name} ({lang.nativeName})
          </option>
        ))}
      </select>
      <p className="text-[10px] text-gray-600 italic">
        {t('languageSelector.secondaryDescription', {
          defaultValue: 'Choose which language you want to learn in your stories',
        })}
      </p>
    </div>
  );
};
