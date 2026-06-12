'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '@/i18n/translations';

type Locale = 'vi' | 'en';

interface LanguageContextType {
  locale: Locale;
  setLanguage: (locale: Locale) => void;
  t: (keyPath: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocaleState] = useState<Locale>('vi');

  // Load language choice from localStorage on mount
  useEffect(() => {
    const savedLocale = localStorage.getItem('portfolio-locale') as Locale;
    if (savedLocale === 'vi' || savedLocale === 'en') {
      setLocaleState(savedLocale);
    }
  }, []);

  const setLanguage = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('portfolio-locale', newLocale);
  };

  // Translation helper function
  const t = (keyPath: string): string => {
    const keys = keyPath.split('.');
    let current: any = translations[locale];
    
    for (const key of keys) {
      if (current && current[key] !== undefined) {
        current = current[key];
      } else {
        // Fallback to English dictionary if key not found in current locale
        let englishFallback: any = translations['en'];
        for (const fKey of keys) {
          if (englishFallback && englishFallback[fKey] !== undefined) {
            englishFallback = englishFallback[fKey];
          } else {
            return keyPath; // Return raw path if completely missing
          }
        }
        return englishFallback;
      }
    }
    
    return current;
  };

  return (
    <LanguageContext.Provider value={{ locale, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
