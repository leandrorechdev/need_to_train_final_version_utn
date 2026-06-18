import { useLanguage } from "@/context/LanguageContext";
import { useAppTheme } from "@/hooks/useAppTheme";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function LanguagePicker() {
    const colors = useAppTheme();

    const { locale, setLanguage } = useLanguage();

    const styles = createStyles(colors);

    return (
        <View style={styles.container}>
            <Text style={styles.label}>LANG:</Text>

            {/* Botón Castellano */}
            <TouchableOpacity
                style={[
                    styles.flagWrapper,
                    locale === "es" && styles.activeFlag,
                ]}
                onPress={() => setLanguage("es")} //Muta i18n y fuerza el re-render en Android. locale cambia y dispara una actualización en todo el árbol de componentes
                accessibilityLabel={
                    // usuarios con discapacidad visual
                    locale === "es"
                        ? "Idioma actual: Español"
                        : "Switch to Spanish"
                }
                accessibilityRole="button"
                activeOpacity={0.7}
            >
                <Image
                    source={require("@/assets/images/argentina.png")}
                    style={styles.flagImage}
                />
            </TouchableOpacity>

            {/* Botón Inglés Británico */}
            <TouchableOpacity
                style={[
                    styles.flagWrapper,
                    locale === "en" && styles.activeFlag,
                ]}
                onPress={() => setLanguage("en")}
                // Accesibilidad para el botón de Inglés
                accessibilityLabel={
                    locale === "en"
                        ? "Current language: English"
                        : "Cambiar a inglés" 
                }
                accessibilityRole="button"
                activeOpacity={0.7}
            >
                <Image
                    source={require("@/assets/images/pirates.png")}
                    style={styles.flagImage}
                />
            </TouchableOpacity>
        </View>
    );
}

const createStyles = (colors: any) =>
    StyleSheet.create({
        container: {
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: colors.cardItem,
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 20,
            borderWidth: 1,
            borderColor: colors.border,
            alignSelf: "flex-start",
            marginBottom: 15,
        },
        label: {
            color: colors.textMuted,
            fontSize: 11,
            fontWeight: "900",
            marginRight: 8,
            letterSpacing: 1,
        },
        flagWrapper: {
            width: 28,
            height: 28,
            borderRadius: 14,
            overflow: "hidden",
            marginHorizontal: 4,
            borderWidth: 2,
            borderColor: "transparent",
            justifyContent: "center",
            alignItems: "center",
        },
        activeFlag: {
            borderColor: colors.accent,
        },
        flagImage: {
            width: "100%",
            height: "100%",
            resizeMode: "cover",
        },
    });
