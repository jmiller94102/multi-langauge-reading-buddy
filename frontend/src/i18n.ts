import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import enTranslations from './locales/en.json';
import esTranslations from './locales/es-419.json';
import koTranslations from './locales/ko.json';
import zhTranslations from './locales/zh-CN.json';

i18n
  // Detect user language
  .use(LanguageDetector)
  // Pass i18n instance to react-i18next
  .use(initReactI18next)
  // Initialize i18next
  .init({
    resources: {
      en: {
        translation: enTranslations,
      },
      'es-419': {
        translation: esTranslations,
      },
      ko: {
        translation: koTranslations,
      },
      'zh-CN': {
        translation: zhTranslations,
      },
    },
    fallbackLng: 'en',
    debug: import.meta.env.DEV,

    interpolation: {
      escapeValue: false, // React already escapes values
    },

    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'uiLanguage',
    },
  });

export default i18n;
