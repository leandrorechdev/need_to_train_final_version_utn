import React, { createContext, useContext, useState } from 'react';
import { i18n } from '@/constants/i18n';

interface LanguageContextType {
  locale: 'es' | 'en';
  setLanguage: (lang: 'es' | 'en') => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Proveedor: Solo almacena el estado y actualiza i18n
export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Seteamos el idioma inicial (ej: inglés 'en' o castellano 'es')
  const [locale, setLocale] = useState<'es' | 'en'>('en');

  const setLanguage = (lang: 'es' | 'en') => {
    
    i18n.locale = lang;// cambio la variable global i18n
    setLocale(lang);// lanzo el estado para que trabaje useTrnslation
  };

  return (
    <LanguageContext.Provider value={{ locale, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

// Hook interno para que use nuestro hook de traducción
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage debe usarse dentro de un LanguageProvider');
  }
  return context;
}