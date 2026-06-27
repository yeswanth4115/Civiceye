import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import tamilTranslations from './locales/tamil.json';
import englishTranslations from './locales/english.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: englishTranslations },
      ta: { translation: tamilTranslations },
    },
    fallbackLng: 'ta', // Default local language is Tamil
    lng: typeof localStorage !== 'undefined' ? (localStorage.getItem('i18nextLng') || 'ta') : 'ta', // Read persisted language
    interpolation: {
      escapeValue: false, // React already safes from xss
    },
    detection: {
      order: ['queryString', 'cookie', 'localStorage', 'navigator'],
      caches: ['localStorage', 'cookie'],
    },
  });

export default i18n;
