// IDIOMA Y TEMA

import { useLanguage } from "@/context/LanguageContext";
import { useThemeContext } from "@/context/ThemeContext";
import { useAppTheme } from "@/hooks/useAppTheme";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface AccessibilityHeaderProps {
    showBackButton?: boolean;
}

export default function AccessibilityHeader({
    showBackButton = false,
}: AccessibilityHeaderProps) {
    const colors = useAppTheme();
    const router = useRouter();
    const { themeMode, toggleTheme } = useThemeContext();
    const { locale, setLanguage } = useLanguage();

    return (
        <View style={styles.accessibilityRow}>
            {/* ⬅️ IZQUIERDA: Flecha Atrás (Si corresponde) o espacio simétrico */}
            <View style={styles.sideContainer}>
                {showBackButton ? (
                    <TouchableOpacity
                        style={[
                            styles.backButton,
                            {
                                backgroundColor: colors.card,
                                borderColor: colors.border,
                            },
                        ]}
                        onPress={() => router.back()}
                        activeOpacity={0.7}
                    >
                        <MaterialIcons
                            name="arrow-back"
                            size={22}
                            color={colors.text}
                        />
                    </TouchableOpacity>
                ) : null}
            </View>

            {/* Selector de Idiomas */}
            <View style={styles.centerContainer}>
                <TouchableOpacity
                    onPress={() => setLanguage("es")}
                    style={styles.flagButton}
                    accessibilityLabel={
                        locale === "es"
                            ? "Idioma actual: Español"
                            : "Cambiar a español"
                    }
                    accessibilityRole="button"
                    activeOpacity={0.7}
                >
                    <Text
                        style={[
                            styles.flagText,
                            locale === "es" && styles.activeFlag,
                        ]}
                    >
                        🇦🇷
                    </Text>
                </TouchableOpacity>

                <View
                    style={[styles.divider, { backgroundColor: colors.border }]}
                />

                <TouchableOpacity
                    onPress={() => setLanguage("en")}
                    style={styles.flagButton}
                    accessibilityLabel={
                        locale === "en"
                            ? "Current language: English"
                            : "Switch to English"
                    }
                    accessibilityRole="button"
                    activeOpacity={0.7}
                >
                    <Text
                        style={[
                            styles.flagText,
                            locale === "en" && styles.activeFlag,
                        ]}
                    >
                        🇬🇧
                    </Text>
                </TouchableOpacity>
            </View>

            {/* ☀️ DERECHA: Modo Claro / Oscuro opuesto a la flecha */}
            <View style={[styles.sideContainer, styles.alignRight]}>
                <TouchableOpacity
                    style={[
                        styles.themeButton,
                        {
                            backgroundColor: colors.card,
                            borderColor: colors.border,
                        },
                    ]}
                    onPress={toggleTheme}
                    activeOpacity={0.7}
                >
                    <MaterialCommunityIcons
                        name={
                            themeMode === "dark"
                                ? "weather-sunny"
                                : "weather-night"
                        }
                        size={22}
                        color={colors.text}
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    accessibilityRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        paddingVertical: 10,
    },
    sideContainer: {
        width: 45, // Ancho fijo idéntico en los extremos para garantizar el centrado real del medio
        justifyContent: "center",
    },
    alignRight: {
        alignItems: "flex-end",
    },
    centerContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
    },
    backButton: {
        padding: 8,
        borderRadius: 12,
        borderWidth: 1,
        alignItems: "center",
        justifyContent: "center",
        elevation: 2,
    },
    themeButton: {
        padding: 8,
        borderRadius: 12,
        borderWidth: 1,
        alignItems: "center",
        justifyContent: "center",
        elevation: 2,
    },
    flagButton: {
        padding: 4,
    },
    flagText: {
        fontSize: 22,
        opacity: 0.4,
    },
    activeFlag: {
        opacity: 1,
        transform: [{ scale: 1.1 }],
    },
    divider: {
        width: 1,
        height: 18,
    },
});
