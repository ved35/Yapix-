import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translations
import en from '../translations/en/translation.json';
import guj from '../translations/guj/translation.json';

const resources = {
  en: {
    translation: en,
  },
  guj: {
    translation: guj,
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // Default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n; 