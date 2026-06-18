import { i18n } from "@/constants/i18n";
import { useLanguage } from "@/context/LanguageContext";
import { useAppTheme } from "@/hooks/useAppTheme";
import { MaterialIcons } from "@expo/vector-icons";
import { Drawer } from "expo-router/drawer";

export default function DrawerLayout() {
    const colors = useAppTheme();
    const { locale } = useLanguage();

    const t = (key: string) => i18n.t(key, { locale });

    return (
        <Drawer
            screenOptions={{
                headerShown: true, // El Drawer maneja el botón de las 3 líneas arriba a la izquierda
                headerStyle: { backgroundColor: colors.card },
                headerTintColor: colors.text,
                headerTitleStyle: {
                    fontWeight: "900",
                    fontSize: 16,
                    letterSpacing: 0.5,
                },
                drawerStyle: { backgroundColor: colors.background, width: 260 },
                drawerActiveTintColor: colors.accent,
                drawerInactiveTintColor: colors.textMuted,
                drawerLabelStyle: {
                    fontWeight: "700",
                    fontSize: 14,
                    marginLeft: -10,
                },
            }}
        >
            {/* Opción 1 del Menú: Redirige al contenedor de Tabs (Home y Calendario) */}
            <Drawer.Screen
                name="(tabs)"
                options={{
                    title: t("drawer.dashboard"),
                    drawerIcon: ({ color }) => (
                        <MaterialIcons
                            name="fitness-center"
                            size={22}
                            color={color}
                        />
                    ),
                }}
            />

            {/* Opción 2 del Menú: Redirige a pantalla de perfil */}
            <Drawer.Screen
                name="profile"
                options={{
                    title: t("drawer.profile"),
                    drawerIcon: ({ color }) => (
                        <MaterialIcons name="person" size={22} color={color} />
                    ),
                }}
            />
        </Drawer>
    );
}
