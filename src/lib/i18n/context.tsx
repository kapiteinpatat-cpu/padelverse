
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import en from './locales/en.json';
import nl from './locales/nl.json';

type Locale = 'en' | 'nl';
type Translations = typeof en;

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, variables?: Record<string, string | number>) => string;
  formatDate: (date: Date | string, options?: Intl.DateTimeFormatOptions) => string;
}

const translations: Record<Locale, any> = { en, nl };

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('padelverse_locale') as Locale;
    if (saved && (saved === 'en' || saved === 'nl')) {
      setLocaleState(saved);
    } else {
      const browserLocale = navigator.language.split('-')[0];
      if (browserLocale === 'nl') setLocaleState('nl');
    }
    setIsReady(true);
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('padelverse_locale', newLocale);
  };

  const t = (key: string, variables?: Record<string, string | number>): string => {
    const keys = key.split('.');
    let value = keys.reduce((obj, k) => obj?.[k], translations[locale]);

    // Fallback to English
    if (value === undefined && locale !== 'en') {
      value = keys.reduce((obj, k) => obj?.[k], translations['en']);
    }

    if (typeof value !== 'string') return key;

    if (variables) {
      Object.entries(variables).forEach(([k, v]) => {
        value = (value as string).replace(`{{${k}}}`, String(v));
      });
    }

    return value;
  };

  const formatDate = (date: Date | string, options: Intl.DateTimeFormatOptions = { dateStyle: 'medium' }) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat(locale, options).format(d);
  };

  if (!isReady) return null;

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t, formatDate }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useTranslation must be used within LanguageProvider');
  return context;
}
