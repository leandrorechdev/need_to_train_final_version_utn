import AccessibilityHeader from "@/components/AccessibilityHeader"
import { i18n } from "@/constants/i18n"
import { useLanguage } from "@/context/LanguageContext"
import { useAppTheme } from "@/hooks/useAppTheme"
import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"

export default function HomeScreen() {
    const colors = useAppTheme();
    const { locale } = useLanguage();
    const router = useRouter();
    
    const t = (key: string) => i18n.t(key, { locale });

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <AccessibilityHeader />
            
            
            <View style={styles.content}>
                <Text style={[styles.title, { color: colors.text }]}>
                    {t("home.welcome")}
                </Text>

                
                <TouchableOpacity 
                    style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
                    onPress={() => router.push("/(drawer)/(tabs)/calendar")} // Redirección directa
                    activeOpacity={0.8}
                >
                    <Text style={[styles.cardTitle, { color: colors.text }]}>
                        {t("home.needToTrain")}
                    </Text>
                    <Text style={[styles.cardSubtitle, { color: colors.textMuted }]}>
                        {t("home.buildWeeklyPlan")}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    content: { 
        flex: 1, 
        padding: 20, 
        paddingTop: 100, 
        alignItems: 'center' 
    },
    title: { 
        fontSize: 32, 
        fontWeight: "900", 
        marginBottom: 40,
        textAlign: 'center'
    },
    card: { 
        width: '100%',
        padding: 30, 
        borderRadius: 20, 
        borderWidth: 1, 
        elevation: 4,
        alignItems: 'center'
    },
    cardTitle: { 
        fontSize: 22, 
        fontWeight: "900", 
        marginBottom: 10 
    },
    cardSubtitle: { 
        fontSize: 16, 
        fontWeight: "500",
        textAlign: 'center'
    }
});