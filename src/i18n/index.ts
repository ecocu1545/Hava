import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Dil dosyalarını import et
import az from './locales/az.json';
import tr from './locales/tr.json';
import en from './locales/en.json';

// i18n yapılandırması
i18n
  // Tarayıcı dilini otomatik algıla
  .use(LanguageDetector)
  // React entegrasyonu
  .use(initReactI18next)
  // Init
  .init({
    resources: {
      az: {
        translation: az
      },
      tr: {
        translation: tr
      },
      en: {
        translation: en
      }
    },
    // Varsayılan dil
    fallbackLng: 'tr',
    // Algılama seçenekleri
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
    // Interpolasyon ayarları
    interpolation: {
      escapeValue: false, // React zaten XSS koruması sağlıyor
    },
  });

export default i18n;

// Desteklenen diller
export const supportedLanguages = [
  { code: 'az', name: 'Azərbaycan', flag: '🇦🇿' },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  { code: 'en', name: 'English', flag: '🇬🇧' }
];

// Dil değiştirme fonksiyonu
export const changeLanguage = (langCode: string) => {
  i18n.changeLanguage(langCode);
};
