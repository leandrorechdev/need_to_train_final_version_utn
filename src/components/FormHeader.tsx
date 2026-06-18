import { i18n } from "@/constants/i18n"
import { getFormStyles } from "@/constants/styles"
import { useAppTheme } from "@/hooks/useAppTheme"
import { Platform, StatusBar, StyleSheet, Text, View } from "react-native"
import AccessibilityHeader from "./AccessibilityHeader"

interface FormHeaderProps {
    titleEs: string;
    titleEn: string;
    dayKey?: string;
    locale: string;
}

export default function FormHeader({
    titleEs,
    titleEn,
    dayKey,
    locale,
}: FormHeaderProps) {
    const colors = useAppTheme();
    const globalStyles = getFormStyles(colors);

    //Le pasamos { locale } de forma explícita para que reaccione al instante cuando tocas las banderas
    const rawTranslatedDay = dayKey 
        ? i18n.t(`days.${dayKey.toLowerCase()}`, { locale }) 
        : "";

    // Ponemos la primera letra en mayúscula de forma limpia (ej: "lunes" -> "Lunes")
    const translatedDay = rawTranslatedDay
        ? rawTranslatedDay.charAt(0).toUpperCase() + rawTranslatedDay.slice(1)
        : "";

    return (
        <View style={styles.container}>
            {/* Renderiza la barra con la flecha activa a la izquierda, banderas y modo oscuro */}
            <AccessibilityHeader showBackButton={true} />

            <View style={styles.titleBlock}>
                <Text style={globalStyles.title}>
                    {locale === "es" ? titleEs : titleEn}
                </Text>
                {dayKey && (// si dayKey es null, undefined o "" no muestra nada
                    <Text style={[styles.subLabel, { color: colors.textMuted }]}>
                        {locale === "es"
                            ? `Asignando al día: ${translatedDay}`
                            : `Assigning to: ${translatedDay}`}
                    </Text>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 5,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    },
    titleBlock: { marginTop: 10, paddingHorizontal: 5 },
    subLabel: {
        fontSize: 13,
        fontWeight: "700",
        textAlign: "center",
        marginBottom: 25,
        letterSpacing: 0.5,
    },
});