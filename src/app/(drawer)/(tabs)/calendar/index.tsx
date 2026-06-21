import { MaterialIcons } from "@expo/vector-icons"
import {
    collection,
    deleteDoc,
    doc,
    onSnapshot,
    query,
    where,
} from "firebase/firestore"
import { useEffect, useState } from "react"
import {
    Alert,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native"

import AccessibilityHeader from "@/components/AccessibilityHeader"
import WorkoutCard from "@/components/WorkoutCard"
import WorkoutOptionsPanel from "@/components/WorkoutOptionsPanel"
import { auth, db } from "@/config/firebase"
import { i18n } from "@/constants/i18n"
import { getFormStyles } from "@/constants/styles"
import { useLanguage } from "@/context/LanguageContext"
import { useAppTheme } from "@/hooks/useAppTheme"

export default function CalendarMainScreen() {
    const colors = useAppTheme();
    const globalStyles = getFormStyles(colors);
    const { locale } = useLanguage();

    const [workouts, setWorkouts] = useState<any[]>([]);
    const [selectedDayKey, setSelectedDayKey] = useState("");
    const [showOptionsPanel, setShowOptionsPanel] = useState(false);

    const t = (key: string) => i18n.t(key, { locale });

    const diasSemana = [
        { key: "monday", label: t("days.monday") },
        { key: "tuesday", label: t("days.tuesday") },
        { key: "wednesday", label: t("days.wednesday") },
        { key: "thursday", label: t("days.thursday") },
        { key: "friday", label: t("days.friday") },
        { key: "saturday", label: t("days.saturday") },
        { key: "sunday", label: t("days.sunday") },
    ];

    useEffect(() => {
        const user = auth.currentUser;
        if (!user) return;

        const q = query(
            collection(db, "workouts"),// traemos los workouts
            where("userId", "==", user.uid),// donde el userid coincide con el usuario logueado
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const list: any[] = [];
            snapshot.forEach((doc) => {
                list.push({ id: doc.id, ...doc.data() });
            });
            setWorkouts(list);
        });

        return () => unsubscribe();// si el user cierra o sale de la app esto corta la conexion con firebase
    }, []);

    const handleDelete = async (id: string) => {
        try {
            await deleteDoc(doc(db, "workouts", id));
        } catch {
            Alert.alert("Error", locale === "es" ? "No se pudo eliminar" : "Could not delete");
        }
    };

    return (
        <View style={[localStyles.mainContainer, { backgroundColor: colors.background }]}>
            <View style={localStyles.accessibilityWrapper}>
                <AccessibilityHeader showBackButton={false} />
            </View>

            <Text style={globalStyles.title}>
                {locale === "es" ? "MI PLANIFICACIÓN 📅" : "MY SCHEDULE 📅"}
            </Text>

            <ScrollView
                style={localStyles.scroll}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 40 }}
            >
                {diasSemana.map((dia) => {// crea una dayCard por cada día de la semana
                    const entrenamientosDelDia = workouts.filter((w) => w.day === dia.key);// filtramos los ejercicios de cada día

                    return (
                        <View
                            key={dia.key}
                            style={[localStyles.dayCard, { backgroundColor: colors.card, borderColor: colors.border }]}
                        >
                            <View style={localStyles.dayHeader}>
                                <Text style={[localStyles.dayText, { color: colors.text }]}>
                                    {dia.label}
                                </Text>
                                <TouchableOpacity
                                    style={[localStyles.addButton, { backgroundColor: colors.accent }]}
                                    onPress={() => {
                                        console.log("Botón presionado, día:", dia.key); 
                                        setSelectedDayKey(dia.key);// guardamos el día seleccionado
                                        setShowOptionsPanel(true);// abre WorkoutOptionsPanel
                                    }}
                                >
                                    <MaterialIcons name="add" size={20} color={colors.buttonText} />
                                </TouchableOpacity>
                            </View>

                            {entrenamientosDelDia.length > 0 ? (
                                entrenamientosDelDia.map((item) => (
                                    <WorkoutCard
                                        key={item.id}
                                        item={item}
                                        colors={colors}
                                        onDelete={handleDelete}
                                        locale={locale}
                                    />
                                ))
                            ) : (
                                <Text style={[localStyles.placeholderText, { color: colors.textMuted }]}>
                                    {t("calendar.noWorkouts")}
                                </Text>
                            )}
                        </View>
                    );
                })}
            </ScrollView>

            {/* Panel flotante (Modal) posicionado fuera del flujo del scroll */}
            <WorkoutOptionsPanel
                visible={showOptionsPanel}
                onClose={() => setShowOptionsPanel(false)}// esto en el botón pasa a true
                selectedDayKey={selectedDayKey}
                locale={locale}
                colors={colors}
            />
        </View>
    );
}

const localStyles = StyleSheet.create({
    mainContainer: { flex: 1, paddingHorizontal: 16, paddingTop: Platform.OS === "android" ? (StatusBar.currentHeight ?? 24) : 10 },
    accessibilityWrapper: { width: "100%", paddingVertical: 10 },
    scroll: { flex: 1 },
    dayCard: { paddingVertical: 16, paddingHorizontal: 14, borderRadius: 16, borderWidth: 1, marginBottom: 15, elevation: 1 },
    dayHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
    dayText: { fontSize: 16, fontWeight: "800" },
    addButton: { width: 32, height: 32, borderRadius: 16, alignItems: "center", justifyContent: "center", elevation: 2 },
    placeholderText: { fontSize: 13, fontStyle: "italic", marginTop: 5, paddingHorizontal: 4 },
});