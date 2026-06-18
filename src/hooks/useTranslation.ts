// import { useCallback } from 'react';
// import { i18n } from '@/constants/i18n';
// import { useLanguage } from '@/context/LanguageContext';

// export function useTranslation() {
//   // Consumimos el contexto global. Su mutación forzará el re-render en Android.
//   const { locale } = useLanguage();

//   // Encapsulamos la traducción nativa usando useCallback para optimizar memoria en Android
//   const t = useCallback(
//     (key: string, options?: object) => {
//       return i18n.t(key, { locale, ...options });
//     },
//     [locale]
//   );

//   return { t, locale };
// }

import { useCallback } from 'react';
import { getErrorMessageKey } from '@/utils/authErrors';
import  {i18n}  from '@/constants/i18n';
import { useLanguage } from '@/context/LanguageContext';

// Al ser un hook, cada vez que una pantalla lo llama, se asegura de tener acceso a los valores más recientes.
export function useTranslation() {
  const { locale } = useLanguage();// Gracias a useLanguage(), si el usuario cambia el idioma en la configuración, este hook detecta el cambio gracias a la reactividad de React.

  const t = useCallback(
    (key: string, options?: object) => {
      // Si la clave tiene un '/', es un código de error de Firebase (ej: 'auth/weak-password')
      if (key.includes('/')) {
        const errorKey = getErrorMessageKey(key);
        return i18n.t(errorKey, { locale, ...options });
      }
      
      // Si no, es una traducción normal
      return i18n.t(key, { locale, ...options });
    },
    [locale]
  );

  return { t, locale };
}