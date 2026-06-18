import FormHeader from "@/components/FormHeader";
import CustomModal from "@/components/modals/CustomModal";
import { auth, db } from "@/config/firebase";
import { getFormStyles } from "@/constants/styles";
import { useLanguage } from "@/context/LanguageContext";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
    addDoc,
    collection,
    doc,
    getDoc,
    serverTimestamp,
    updateDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import FormWrapper from "../FormWrapper";

export default function GymForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [modalConfig, setModalConfig] = useState({
        visible: false,
        title: "",
        message: "",
        type: "info" as "info" | "error" | "success",
    });

    const colors = useAppTheme();
    const router = useRouter();
    const { locale } = useLanguage();
    const styles = getFormStyles(colors);

    const { workoutId, dayKey } = useLocalSearchParams<{
        workoutId?: string;
        dayKey: string;
    }>();

    const [exerciseName, setExerciseName] = useState("");
    const [series, setSeries] = useState("");
    const [reps, setReps] = useState("");

    const normalizedDayKey = (dayKey || "monday").toLowerCase();

    const showMessage = (
        title: string,
        message: string,
        type: "info" | "error" | "success",
    ) => {
        setModalConfig({ visible: true, title, message, type });
    }; // mensaje de error o éxito

    useEffect(() => {
        if (workoutId) {
            // miramos si existe un workoutId
            const loadWorkout = async () => {
                try {
                    const docRef = doc(db, "workouts", workoutId); // // Si existe, crea una referencia docRef al documento en Firebase.
                    const docSnap = await getDoc(docRef); // // getDoc descarga los datos.
                    if (docSnap.exists()) {
                        // si el doc existe  actualiza los estados (setExerciseName, etc.) para rellenar los inputs con la información vieja.
                        const data = docSnap.data();
                        setExerciseName(data.text || "");
                        setSeries(data.series || "");
                        setReps(data.reps || "");
                    }
                } catch (error) {
                    console.error("Error loading gym workout:", error);
                }
            };
            loadWorkout();
        }
    }, [workoutId]);

    const handleSave = async () => {
        if (!exerciseName.trim()) {
            return showMessage(
                "Error",
                locale === "es"
                    ? "El nombre es obligatorio"
                    : "Name is required",
                "error",
            );
        }

        setIsLoading(true);
        const user = auth.currentUser;
        if (!user) {
            setIsLoading(false);
            return showMessage("Error", "Usuario no autenticado", "error");
        }

        const summaryText = exerciseName.toUpperCase();
        const subDetailsText = `${series || "0"} ${locale === "es" ? "Series" : "Sets"} x ${reps || "0"} ${locale === "es" ? "Reps" : "Reps"}`;

        try {
            const workoutData = {
                // // Crea el objeto workoutData con todos los campos necesarios.
                userId: user.uid,
                type: "gym",
                day: normalizedDayKey,
                text: summaryText,
                subDetailsText,
                series,
                reps,
                updatedAt: serverTimestamp(),
            };

            if (workoutId) {
                // // Si existe workoutId, usa updateDoc (actualizar).
                await updateDoc(doc(db, "workouts", workoutId), workoutData);
            } else {
                // // Si no, usa addDoc (crear nuevo).
                await addDoc(collection(db, "workouts"), {
                    ...workoutData,
                    createdAt: serverTimestamp(),
                });
            }

            showMessage(
                locale === "es" ? "¡Éxito!" : "Success!",
                workoutId
                    ? locale === "es"
                        ? "Ejercicio actualizado"
                        : "Exercise updated"
                    : locale === "es"
                      ? "Ejercicio guardado"
                      : "Exercise saved",
                "success",
            );

            // Esperamos un poco antes de salir para que el usuario lea el éxito
            setTimeout(() => router.back(), 1500);
        } catch (error) {
            showMessage("Error", "No se pudo guardar la rutina", "error");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <FormWrapper withScroll={true}>
            <FormHeader
                titleEs="NUEVO EJERCICIO GYM 🏋️‍♂️"
                titleEn="ADD GYM WORKOUT 🏋️‍♂️"
                dayKey={normalizedDayKey}
                locale={locale}
            />

            <View style={styles.formContainer}>
                <View style={styles.sectionCard}>
                    <Text style={styles.sectionLabel}>
                        {locale === "es"
                            ? "CONFIGURACIÓN DEL EJERCICIO"
                            : "EXERCISE DETAILED CONFIG"}
                    </Text>

                    <Text style={styles.inputLabel}>
                        {locale === "es" ? "Nombre" : "Name"}
                    </Text>
                    <TextInput
                        style={styles.input}
                        placeholder={
                            locale === "es"
                                ? "Ej: Press Banca"
                                : "e.g., Bench Press"
                        }
                        placeholderTextColor={colors.textMuted}
                        value={exerciseName}
                        onChangeText={setExerciseName}
                        accessibilityLabel={
                            locale === "es"
                                ? "Nombre del ejercicio"
                                : "Exercise name"
                        }
                    />

                    <View style={styles.gridRow}>
                        <View style={styles.gridColumn}>
                            <Text style={styles.inputLabel}>
                                {locale === "es" ? "Series" : "Sets"}
                            </Text>
                            <TextInput
                                style={styles.input}
                                keyboardType="numeric"
                                value={series}
                                onChangeText={setSeries}
                                accessibilityLabel={
                                    locale === "es"
                                        ? "Número de series"
                                        : "Number of sets"
                                }
                            />
                        </View>
                        <View style={styles.gridColumn}>
                            <Text style={styles.inputLabel}>
                                {locale === "es" ? "Reps" : "Reps"}
                            </Text>
                            <TextInput
                                style={styles.input}
                                keyboardType="numeric"
                                value={reps}
                                onChangeText={setReps}
                                accessibilityLabel={
                                    locale === "es"
                                        ? "Número de repeticiones"
                                        : "Number of reps"
                                }
                            />
                        </View>
                    </View>
                </View>

                <TouchableOpacity
                    style={[styles.btnSave, isLoading && { opacity: 0.6 }]}
                    onPress={handleSave}
                    disabled={isLoading} //impide que el usuario presione el botón mientras Firebase procesa la información.
                    activeOpacity={0.9}
                    accessibilityRole="button"
                    accessibilityLabel={
                        locale === "es" ? "Guardar ejercicio" : "Save exercise"
                    }
                >
                    <Text style={styles.btnSaveText}>
                        {isLoading
                            ? locale === "es"
                                ? "GUARDANDO..."
                                : "SAVING..."
                            : locale === "es"
                              ? "GUARDAR"
                              : "SAVE"}
                    </Text>
                </TouchableOpacity>
            </View>
            {/* Se hace visible solo cuando modalConfig.visible cambia a true. */}
            <CustomModal
                visible={modalConfig.visible}
                title={modalConfig.title}
                message={modalConfig.message}
                type={modalConfig.type}
                colors={colors}
                onClose={() =>
                    setModalConfig({ ...modalConfig, visible: false })
                }
                autoClose={modalConfig.type === "success"} // si el ejercicio se guardó bien, no obligamos al usuario a hacer clic en "OK", el modal se cierra solo
            />
        </FormWrapper>
    );
}
