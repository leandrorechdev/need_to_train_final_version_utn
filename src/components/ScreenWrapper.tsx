import { useThemeContext } from "@/context/ThemeContext"
import { useAppTheme } from "@/hooks/useAppTheme"
import React from "react"
import {
    KeyboardAvoidingView,
    ScrollView,
    StatusBar,
    StyleSheet,
    View
} from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

interface ScreenWrapperProps {
    children: React.ReactNode;
    withScroll?: boolean;
}

export default function ScreenWrapper({
    children,
    withScroll = true,
}: ScreenWrapperProps) {
    const colors = useAppTheme();
    const { themeMode } = useThemeContext();
    const insets = useSafeAreaInsets();
    
    const Container = withScroll ? ScrollView : View;

    return (
        <View style={[styles.base, { backgroundColor: colors.background }]}>
            <StatusBar 
                barStyle={themeMode === "dark" ? "light-content" : "dark-content"} 
                backgroundColor={colors.background} // Hace juego con el fondo en Android
                translucent={false} // Android: asegura que el contenido no se meta debajo de la barra
            />
            
            <KeyboardAvoidingView
                behavior="height" // apunta solo a android
                style={styles.flex}
                keyboardVerticalOffset={0}// // se puede ajustar este valor si el teclado tapa algo
            >
                <Container
                    style={styles.flex}
                    contentContainerStyle={
                        withScroll
                            ? [
                                  styles.scrollContent,
                                  { 
                                      paddingTop: insets.top + 10,
                                      paddingBottom: insets.bottom + 20 
                                  }
                              ]
                            : { paddingTop: insets.top + 10, paddingBottom: insets.bottom + 20 }
                    }
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                    overScrollMode="never" // Elimina el efecto "glow" de Android(borde brillante)
                    nestedScrollEnabled={true}// jerarquías de scroll
                >
                    {children}
                </Container>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    base: {
        flex: 1,
    },
    flex: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
    },
});