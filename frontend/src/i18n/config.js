import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translations
import translationEN from './locales/en.json';
import translationVI from './locales/vi.json';

const resources = {
  en: {
    translation: translationEN
  },
  vi: {
    translation: translationVI
  }
};

// Khởi tạo ngôn ngữ từ localStorage hoặc mặc định
const savedLanguage = localStorage.getItem('language') || 'vi';

// Khởi tạo i18n ĐỒNG BỘ
i18n
  .use(initReactI18next) // Pass i18n instance to react-i18next
  .use(LanguageDetector)
  .init({
    resources,
    fallbackLng: 'vi',
    lng: savedLanguage,
    debug: false, // Tắt debug để tránh warning
    interpolation: {
      escapeValue: false
    },
    react: {
      useSuspense: false // Tắt suspense để tránh lỗi timing
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    }
  });

export default i18n;
