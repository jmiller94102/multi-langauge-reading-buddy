import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

const AVAILABLE_LANGUAGES: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'es-419', name: 'Spanish', nativeName: 'Español', flag: '🌎' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
  { code: 'zh-CN', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
];

export const PrimaryLanguageSelector: React.FC = () => {
  const { i18n, t } = useTranslation();

  const changeLanguage = (langCode: string) => {
    i18n.changeLanguage(langCode);
    localStorage.setItem('uiLanguage', langCode);
  };

  return (
    <div className="relative">
      <label htmlFor="primary-language-select" className="sr-only">
        {t('languageSelector.primaryLanguage')}
      </label>
      <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-3 py-1.5 shadow-sm hover:border-gray-400 transition-colors">
        <Globe className="w-4 h-4 text-gray-600" aria-hidden="true" />
        <select
          id="primary-language-select"
          value={i18n.language}
          onChange={(e) => changeLanguage(e.target.value)}
          className="bg-transparent border-none text-sm font-medium text-gray-900 cursor-pointer focus:outline-none focus:ring-0"
          aria-label={t('header.selectPrimaryLanguage')}
        >
          {AVAILABLE_LANGUAGES.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.flag} {lang.nativeName}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
