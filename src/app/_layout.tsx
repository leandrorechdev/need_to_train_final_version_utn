import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { auth } from "@/config/firebase";
import { LanguageProvider } from "@/context/LanguageContext";
import { ThemeProvider, useThemeContext } from "@/context/ThemeContext";
import { ModalProvider, useModal } from "@/context/ModalContext";
import { useAppTheme } from "@/hooks/useAppTheme";
import { CustomModal } from "@/components/modals";

export default function RootLayout() {
    return (
        <LanguageProvider>
            <ThemeProvider>
                <ModalProvider>
                    <RootLayoutWithStatusBar />
                </ModalProvider>
            </ThemeProvider>
        </LanguageProvider>
    );
}

function RootLayoutWithStatusBar() {
    const { themeMode } = useThemeContext();
    return (
        <>
            <StatusBar style={themeMode === "dark" ? "light" : "dark"} />
            <RootLayoutNav />
        </>
    );
}

function RootLayoutNav() {
    const [initializing, setInitializing] = useState(true);
    const [user, setUser] = useState<any>(null);
    const router = useRouter();
    const segments = useSegments();
    const colors = useAppTheme();
    const { modalConfig, hideModal } = useModal();

    useEffect(() => {
        const subscriber = onAuthStateChanged(auth, (userState) => {
            setUser(userState);
            if (initializing) setInitializing(false);
        });
        return subscriber;
    }, []);

    useEffect(() => {
        if (initializing) return;

        // SEGURO DE NAVEGACIÓN: 
        // Si el modal está visible, no redireccionamos automáticamente para evitar el saltito.
        if (modalConfig.visible) return;

        const inAuthGroup = segments[0] === "login" || segments[0] === "register";
        
        if (!user && !inAuthGroup) {
            router.replace("/login");
        } else if (user && inAuthGroup) {
            router.replace("/(drawer)/(tabs)");
        }
    }, [user, segments, initializing, modalConfig.visible]); // Añadido modalConfig.visible

    if (initializing) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" color={colors.accent} />
            </View>
        );
    }

    return (
        <>
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(drawer)" />
                <Stack.Screen name="login" />
                <Stack.Screen name="register" />
            </Stack>
            
            <CustomModal
                visible={modalConfig.visible}
                title={modalConfig.title}
                message={modalConfig.message}
                type={modalConfig.type || 'info'}
                colors={colors}
                onClose={() => {
                    modalConfig.onClose();
                    hideModal();
                }}
            />
        </>
    );
}