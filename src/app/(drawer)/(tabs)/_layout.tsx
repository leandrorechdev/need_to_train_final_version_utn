import { useAppTheme } from '@/hooks/useAppTheme'
import { useTranslation } from '@/hooks/useTranslation';
import { MaterialIcons } from '@expo/vector-icons'
import { Tabs } from 'expo-router'

export default function TabLayout() {
  const colors = useAppTheme();
  
  const { t } = useTranslation();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.accent, 
        tabBarInactiveTintColor: colors.textMuted,
        
        tabBarStyle: {
          backgroundColor: colors.background, 
          borderTopWidth: 1,
          borderColor: colors.border,
          height: 64, 
          paddingBottom: 10,
          paddingTop: 8,
        },
        
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
          letterSpacing: 0.3,
        },
        
        headerShown: false,
      }}
    >
      {/* PESTAÑA 1: HOME (index.tsx) */}
      <Tabs.Screen
        name="index"
        options={{
          title: t('home.title'), 
          tabBarIcon: ({ color }) => (
            <MaterialIcons 
              name="home" 
              color={color} 
              size={24} 
            />
          ),
        }}
      />

      {/* PESTAÑA 2: CALENDARIO DE ENTRENAMIENTO (calendar.tsx) */}
      <Tabs.Screen
        name="calendar"
        options={{
          title: t('calendar.title'), 
          tabBarIcon: ({ color }) => (
            <MaterialIcons 
              name="calendar-today" 
              color={color} 
              size={24} 
            />
          ),
        }}
      />
    </Tabs>
  );
}