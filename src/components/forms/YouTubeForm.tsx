import CustomModal from "@/components/modals/CustomModal";
import { auth, db } from "@/config/firebase";
import { i18n } from "@/constants/i18n";
import { getFormStyles } from "@/constants/styles";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useTranslation } from "@/hooks/useTranslation";
import { useRouter } from "expo-router";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

// 1. Inyección de dependencias (Props)

interface YoutubeFormProps {
    daySelected: string;
    onSuccess?: () => void; 
}

type ModalConfig = {
    visible: boolean;
    title: string;
    message: string;
    type: "info" | "error" | "success";
}; 

export default function YouTubeForm({
    daySelected,
    onSuccess,
}: YoutubeFormProps) {
    const colors = useAppTheme();
    const { t, locale } = useTranslation();
    const router = useRouter();
    const styles = getFormStyles(colors);

    const [text, setText] = useState("");
    const [url, setUrl] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const normalizedDayKey = (daySelected || "monday").toLowerCase();
    const translatedDay = i18n.t(`days.${normalizedDayKey}`);
    const [modalConfig, setModalConfig] = useState<ModalConfig>({
        visible: false,
        title: "",
        message: "",
        type: "info",
    });

    const showMessage = (
        title: string,
        message: string,
        type: "info" | "error" | "success",
    ) => {
        setModalConfig({ visible: true, title, message, type });
    };

    const handleSave = async () => {
        if (!text.trim() || !url.trim()) {
            return showMessage(
                t("auth.errorTitle"),
                t("auth.errorEmptyFields"),
                "error",
            );
        }

        setIsLoading(true); 
        try {
            await addDoc(collection(db, "workouts"), {// Firebase
                userId: auth.currentUser?.uid,
                type: "youtube",
                text: text.trim(),
                youtubeUrl: url.trim(),
                day: normalizedDayKey,
                createdAt: serverTimestamp(),
            });

            showMessage(
                t("auth.successTitle"),
                t("workout.successSave"),
                "success",
            );
            setText("");
            setUrl("");

            setTimeout(() => {
                if (onSuccess) onSuccess();
                else router.back();
            }, 1500); // espera de 1500ms antes de llamar a onSuccess o router.back() 
        } catch (error) {
            showMessage(t("auth.errorTitle"), t("workout.errorSave"), "error");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
        >
            <View style={{ padding: 16 }}>
                <Text style={[styles.sectionLabel, { marginBottom: 15 }]}>
                    {locale === "es"
                        ? `ASIGNAR A: ${translatedDay.toUpperCase()}`
                        : `ASSIGN TO: ${translatedDay.toUpperCase()}`}
                </Text>

                <TextInput
                    style={styles.input}
                    placeholder={t("workout.exercisePlaceholder")}
                    placeholderTextColor={colors.textMuted}
                    value={text}
                    onChangeText={setText}
                    accessibilityLabel={
                        locale === "es"
                            ? "Nombre del ejercicio"
                            : "Exercise name"
                    }
                />

                <TextInput
                    style={styles.input}
                    placeholder="URL de YouTube"
                    placeholderTextColor={colors.textMuted}
                    value={url}
                    onChangeText={setUrl}
                    autoCapitalize="none"
                    keyboardType="url"
                    accessibilityLabel="URL de video de YouTube"
                />

                <TouchableOpacity
                    style={[styles.btnSave, isLoading && { opacity: 0.6 }]}// Si isLoading es true, reducimos la opacidad para dar feedback visual de que el botón está deshabilitado.
                    onPress={handleSave}
                    disabled={isLoading}// prevención de dobles clicks
                    activeOpacity={0.9}
                    accessibilityRole="button"
                    accessibilityLabel={t("workout.saveBtn")}
                >
                    <Text style={styles.btnSaveText}>
                        {isLoading ? "..." : t("workout.saveBtn")}
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
                }// Cuando el usuario cierra el modal, reiniciamos el estado para ocultarlo.
                autoClose={modalConfig.type === "success"}
            />
        </KeyboardAvoidingView>
    );
}
