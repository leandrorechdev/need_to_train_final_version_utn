import * as WebBrowser from 'expo-web-browser';
import React, { useCallback } from 'react';
import { StyleProp, TouchableOpacity, ViewStyle } from 'react-native';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useLanguage } from '@/context/LanguageContext';

interface ExternalLinkProps {
  href: string;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function ExternalLink({ href, children, style }: ExternalLinkProps) {
  const colors = useAppTheme();
  const { locale } = useLanguage();

  const handlePress = useCallback(async () => {// mantenemos la función en memoria
    try {
      // Chrome Custom Tabs: Android
      await WebBrowser.openBrowserAsync(href, {
        showTitle: true,
        toolbarColor: colors.background, // Sincronizado con nuestro tema
        secondaryToolbarColor: colors.background,
        enableDefaultShareMenuItem: true,
        showInRecents: true, // Permite que el usuario vea el navegador en el selector de apps
      });
    } catch (error) {
      console.error("Error opening Browser:", error);
    }
  }, [href, colors.background]);// si cambian la función se recrea

  return (
    <TouchableOpacity 
      style={style} 
      onPress={handlePress} 
      activeOpacity={0.7}
      accessibilityLabel={
        locale === 'es' 
          ? "Abrir enlace externo" 
          : "Open external link"
      }
      accessibilityRole="button"
    >
      {children}
    </TouchableOpacity>
  );
}