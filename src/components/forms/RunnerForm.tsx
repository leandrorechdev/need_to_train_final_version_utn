import FormHeader from "@/components/FormHeader"
import CustomModal from "@/components/modals/CustomModal"
import { auth, db } from "@/config/firebase"
import { i18n } from "@/constants/i18n"
import { getFormStyles } from "@/constants/styles"
import { useLanguage } from "@/context/LanguageContext"
import { useAppTheme } from "@/hooks/useAppTheme"
import { useLocalSearchParams, useRouter } from "expo-router"
import {
    addDoc,
    collection,
    doc,
    serverTimestamp,
    updateDoc,
} from "firebase/firestore"
import { useState } from "react"
import {
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native"
import FormWrapper from "../FormWrapper"

export default function RunnerForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [modalConfig, setModalConfig] = useState<{
        visible: boolean;
        title: string;
        message: string;
        type: "info" | "error" | "success";
    }>({
        visible: false,
        title: "",
        message: "",
        type: "info" ,
    });

    const colors = useAppTheme();
    const router = useRouter();
    const { locale } = useLanguage();
    const styles = getFormStyles(colors);

    const { workoutId, dayKey } = useLocalSearchParams<{
        workoutId?: string;
        dayKey: string;
    }>();

    const [tipoRunning, setTipoRunning] = useState("Pasadas");
    const [distancia, setDistancia] = useState("");
    const [repeticiones, setRepeticiones] = useState("");
    const [pausa, setPausa] = useState("");
    const [tiempoObjetivo, setTiempoObjetivo] = useState("");

    const normalizedDayKey = (dayKey || "monday").toLowerCase();

    const showMessage = (
        title: string,
        message: string,
        type: "info" | "error" | "success",
    ) => {
        setModalConfig({ visible: true, title, message, type });
    };

    const handleSave = async () => {
        if (!distancia.trim()) {
            // chequeamos si hay distancia, NO hay? -> error
            return showMessage(
                "Error",
                locale === "es"
                    ? "La distancia es requerida"
                    : "Distance is required",
                "error",
            );
        }

        setIsLoading(true); // bloquea el botón para evitar clicks duplicados
        const user = auth.currentUser; // petición a Firebase
        if (!user) {
            setIsLoading(false);
            return showMessage("Error", "Usuario no autenticado", "error");
        }

        try {
            // Lógica de etiquetas...
            const runningLabels: Record<string, { es: string; en: string }> = {
                // claves de tipo texto y cada clave tendrá un objeto con dos propiedades obligatorias: es y en
                Pasadas: { es: "PASADAS", en: "INTERVALS" },
                Fondo: { es: "FONDO", en: "LONG RUN" },
                Alargue: { es: "ALARGUE", en: "STRIDES" },
            };
            const currentLabel = // busca la modalidad en el useState
                runningLabels[tipoRunning]?.[locale as "es" | "en"] ||
                tipoRunning.toUpperCase(); // sino encuentra nada o falla algo esto garantiza que siempre tengamos un texto que mostrar

            // objeto con la info del usuario
            const workoutData = {
                userId: user.uid,
                type: "runner",
                day: normalizedDayKey,
                text: `Runner: ${currentLabel}`,
                subText: `${distancia}${repeticiones ? ` (${repeticiones} r)` : ""} ${pausa ? `| P: ${pausa}` : ""} ${tiempoObjetivo ? `| ⏱️ ${tiempoObjetivo}` : ""}`,
                tipoRunning,
                distancia,
                repeticiones,
                pausa,
                tiempoObjetivo,
                updatedAt: serverTimestamp(),
            };

            // Firestore
            if (workoutId) {
                // Si hay workoutId, usa updateDoc (para editar).
                await updateDoc(doc(db, "workouts", workoutId), workoutData);
            } else {
                // Si no hay, addDoc (para crear uno nuevo).
                await addDoc(collection(db, "workouts"), {
                    ...workoutData,
                    createdAt: serverTimestamp(),
                });
            }

            showMessage(
                locale === "es" ? "¡Excelente!" : "Success!",
                locale === "es" ? "Plan guardado" : "Workout saved",
                "success",
            );
            setTimeout(() => router.back(), 1500); // // espera 1.5 segundos antes de salir de la pantalla (router.back()).
        } catch (error) {
            showMessage("Error", "No se pudo procesar", "error");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <FormWrapper withScroll={true}>
            <FormHeader
                titleEs="PLAN RUNNING 🏃‍♂️"
                titleEn="RUNNING SCHEDULE 🏃‍♂️"
                dayKey={normalizedDayKey}
                locale={locale}
            />

            <View style={[styles.formContainer, { marginTop: 10 }]}>
                {/* MODALIDAD */}
                <View style={styles.sectionCard}>
                    <Text style={styles.sectionLabel}>
                        {locale === "es" ? "MODALIDAD" : "WORKOUT MODE"}
                    </Text>
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            gap: 8,
                        }}
                    >
                        {["Pasadas", "Fondo", "Alargue"].map((item) => (
                            <TouchableOpacity
                                key={item}
                                style={[
                                    {
                                        flex: 1,
                                        paddingVertical: 12,
                                        borderRadius: 12,
                                        borderWidth: 1,
                                        alignItems: "center",
                                    },
                                    {
                                        backgroundColor:
                                            tipoRunning === item
                                                ? colors.accent
                                                : colors.background,
                                        borderColor: colors.border,
                                    },
                                ]}
                                onPress={() => setTipoRunning(item)} // // Actualiza el estado al hacer clic
                                accessibilityRole="button"
                                accessibilityState={{
                                    selected: tipoRunning === item,
                                }} // Le dice al sistema operativo si el botón está seleccionado o no, permitiendo que el lector de pantalla sea preciso.
                            >
                                <Text
                                    style={{
                                        fontSize: 11,
                                        fontWeight: "800",
                                        color:
                                            tipoRunning === item
                                                ? colors.buttonText
                                                : colors.text,
                                    }}
                                >
                                    {i18n.t(`workout.${item.toLowerCase()}`)}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* MÉTRICAS */}
                <View style={styles.sectionCard}>
                    <TextInput
                        style={styles.input}
                        placeholder="8km"
                        value={distancia}
                        onChangeText={setDistancia}
                        accessibilityLabel={
                            locale === "es" ? "Distancia" : "Distance"
                        }
                    />
                </View>

                <TouchableOpacity
                    style={[styles.btnSave, isLoading && { opacity: 0.6 }]}
                    onPress={handleSave}
                    disabled={isLoading} // Bloquea la interacción mientras Firebase procesa la información.
                    accessibilityLabel={
                        locale === "es" ? "Guardar plan" : "Save plan"
                    }
                >
                    <Text style={styles.btnSaveText}>
                        {isLoading
                            ? "..."
                            : locale === "es"
                              ? "GUARDAR"
                              : "SAVE"}
                    </Text>
                </TouchableOpacity>
            </View>

            <CustomModal
                visible={modalConfig.visible}
                title={modalConfig.title}
                message={modalConfig.message}
                type={modalConfig.type}
                colors={colors}
                onClose={() =>
                    setModalConfig({ ...modalConfig, visible: false })
                }
                autoClose={modalConfig.type === "success"} // si se guardó, se cierra solo. Si hay un error, se queda para que el usuario lo vea
            />
        </FormWrapper>
    );
}
