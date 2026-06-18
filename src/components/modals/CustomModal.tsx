import { AppTheme } from "@/constants/theme";
import { useEffect } from "react";
import {
    AccessibilityInfo,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

interface CustomModalProps {
    visible: boolean;
    title: string;
    message: string;
    onClose: () => void;
    autoClose?: boolean;
    duration?: number;
    colors: AppTheme;
    type?: "success" | "error" | "info" | "warning";
}

export default function CustomModal({
    visible,
    title,
    message,
    onClose,
    autoClose = false,
    duration = 3000,
    colors,
    type = "info",
}: CustomModalProps) {
    console.log("Tipo de modal recibido:", type);
    // toma los colores directamente de theme

    // Optimizamos la obtención de colores para no recalcularlos innecesariamente
    const borderColor =
        type === "error"
            ? colors.error
            : type === "success"
              ? colors.success
              : type === "warning"
                ? colors.accent
                : colors.border;
    const buttonColor = type === "error" ? colors.error : colors.accent;

    // Accesibilidad: al abrirse, forzamos que el lector de pantalla lea el título
    useEffect(() => {
        if (visible) {
            AccessibilityInfo.announceForAccessibility(`${title}. ${message}`);
        } // el punto . actúa como pausa natural, para que suene menos robot
    }, [visible, title, message]);

    // Lógica de auto-cierre
    useEffect(() => {
        if (visible && autoClose) {
            const timer = setTimeout(onClose, duration);
            return () => clearTimeout(timer);
        }
    }, [visible, autoClose, duration, onClose]);

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
            statusBarTranslucent={true} // Evita que el contenido se corte
        >
            <View style={styles.overlay}>
                <View
                    style={[
                        styles.box,
                        { backgroundColor: colors.card, borderColor },
                    ]}
                >
                    <Text style={[styles.title, { color: colors.text }]}>
                        {title}
                    </Text>
                    <Text style={[styles.message, { color: colors.textMuted }]}>
                        {message}
                    </Text>

                    {!autoClose && (// NO es auto-cierre? dame el botón
                        <TouchableOpacity
                            onPress={onClose}
                            activeOpacity={0.7}
                            style={[
                                styles.button,
                                { backgroundColor: buttonColor },
                            ]}
                            accessibilityLabel="Cerrar ventana"
                            accessibilityRole="button"
                        >
                            <Text
                                style={[
                                    styles.buttonText,
                                    { color: colors.buttonText },
                                ]}
                            >
                                OK
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.7)", // Un poco más oscuro para mejor contraste
        padding: 20,
    },
    box: {
        width: "100%",
        maxWidth: 400, // Evita que se vea gigante en tablets
        padding: 32,
        borderRadius: 24,
        borderWidth: 4, 
        alignItems: "center",
    },
    title: {
        fontSize: 24,
        fontWeight: "900",
        marginBottom: 16,
        textTransform: "uppercase", 
    },
    message: {
        fontSize: 16,
        textAlign: "center",
        marginBottom: 32,
        lineHeight: 24,
    },
    button: {
        paddingVertical: 14,
        paddingHorizontal: 48,
        borderRadius: 14,
        alignItems: "center",
    },
    buttonText: {
        fontSize: 16,
        fontWeight: "900",
        letterSpacing: 1,
    },
});
