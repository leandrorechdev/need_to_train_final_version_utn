import { MaterialIcons } from "@expo/vector-icons";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
    ActivityIndicator,
    Modal,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";

import { getFormStyles } from "@/constants/styles";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useTranslation } from "@/hooks/useTranslation";
import { AppTheme } from "@/constants/theme";

interface YoutubeBrowserModalProps {
    visible: boolean;
    onClose: () => void;
    onSelectVideo: (title: string, url: string) => void;
}

export default function YoutubeBrowserModal({
    visible,
    onClose,
    onSelectVideo,
}: YoutubeBrowserModalProps) {
    const colors = useAppTheme();
    const formStyles = getFormStyles(colors);
    const insets = useSafeAreaInsets();
    const { t } = useTranslation();
    const webViewRef = useRef<WebView>(null);

    const [currentUrl, setCurrentUrl] = useState("https://m.youtube.com");
    const [currentTitle, setCurrentTitle] = useState("");
    const [isVideo, setIsVideo] = useState(false);
    const [isCapturing, setIsCapturing] = useState(false);

    // Fábrica de estilos optimizada (sin recrear el objeto si no cambian los colores)
    const styles = useMemo(
        () => createStyles(colors, formStyles),
        [colors, formStyles],
    );

    useEffect(() => {
        if (!visible) {
            // cuando el modal se cierra
            setCurrentUrl("https://m.youtube.com"); // vuelve a la pag principal
            setCurrentTitle(""); // borra el título del video anterior
            setIsVideo(false); // oculta el botón de "elegir este"
        }
    }, [visible]); // disparador(cada vez que cambia)

    const handleNavigationStateChange = (navState: any) => {
        setCurrentUrl(navState.url);
        const isYouTubeVideo =
            navState.url.includes("watch?v=") ||
            navState.url.includes("youtu.be/");
        setIsVideo(isYouTubeVideo);
    };

    // handleCapture: El "Botón de Guardar"
    const handleCapture = useCallback(() => {
        if (isCapturing) return; // Si ya se está capturando, no hacer nada más
        setIsCapturing(true);

        const isValidUrl = /^(https?:\/\/)/i.test(currentUrl); // reg exp
        if (isValidUrl) {
            const finalTitle = t("calendar.defaultVideoName");

            onSelectVideo(finalTitle, currentUrl); // callback para darle título y url al padre
            onClose(); // cierre automático después de elegir
        } else {
            setIsCapturing(false); // Liberar si algo falla
            // Opcional: Feedback si la URL no es válida (ej: si está en la página de login de YT)
            console.warn("URL no válida para captura");
        }
    }, [currentUrl, currentTitle, onSelectVideo, onClose, t]); // se actualiza si cambia algo

    const androidUserAgent =
        "Mozilla/5.0 (Linux; Android 10; Mobile) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36";

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={onClose} // si va atrás, es lo mismo que cerrar
            hardwareAccelerated={true}
            statusBarTranslucent={true}
        >
            <View style={[styles.container, { paddingTop: insets.top }]}>
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={onClose}
                        style={styles.closeButton}
                    >
                        <MaterialIcons
                            name="arrow-back"
                            size={24}
                            color={colors.text}
                        />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle} numberOfLines={1}>
                        {t("calendar.youtubeTitle")}
                    </Text>
                    <View style={{ width: 24 }} />
                </View>

                {visible && (
                    <WebView
                        ref={webViewRef}
                        source={{ uri: "https://m.youtube.com" }}
                        onNavigationStateChange={handleNavigationStateChange} // detecta si el usuario está en un video
                        style={{ flex: 1 }}
                        userAgent={
                            Platform.OS === "android"
                                ? androidUserAgent
                                : undefined
                        } // navegador ante el servidor de YouTube
                        androidLayerType={
                            Platform.OS === "android" ? "hardware" : "none"
                        } // usa gpu para ser más liviano
                        domStorageEnabled={true}
                        javaScriptEnabled={true}
                        startInLoadingState={true}
                        allowsInlineMediaPlayback={true}
                        nestedScrollEnabled={true} // clave para scroll ordenado
                        renderLoading={() => (
                            <View style={styles.loaderContainer}>
                                <ActivityIndicator
                                    size="large"
                                    color={colors.accent}
                                />
                            </View>
                        )}
                    />
                )}

                {isVideo && (
                    <View
                        style={[
                            styles.footer,
                            { paddingBottom: insets.bottom + 12 },
                        ]}
                    >
                        <View style={styles.infoColumn}>
                            <Text style={styles.detectLabel}>
                                {t("calendar.detectedVideoLabel")}
                            </Text>
                            <Text style={styles.detectTitle} numberOfLines={1}>
                                {currentTitle || "YouTube Video"}
                            </Text>
                        </View>
                        {/* Botón de captura */}
                        <TouchableOpacity
                            style={styles.captureButton}
                            onPress={handleCapture}
                        >
                            <MaterialIcons
                                name="add-circle"
                                size={18}
                                color={colors.buttonText}
                            />
                            <Text style={styles.captureButtonText}>
                                {t("calendar.useWorkoutButton")}
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </Modal>
    );
}

const createStyles = (colors: AppTheme, formStyles: any) =>
    StyleSheet.create({
        container: { flex: 1, backgroundColor: colors.background },
        header: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: 16,
            paddingBottom: 15,
            backgroundColor: colors.card,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
        },
        headerTitle: {
            fontSize: 16,
            fontWeight: "900",
            color: colors.text,
            textAlign: "center",
            flex: 1,
        },
        closeButton: { padding: 4 },
        loaderContainer: {
            ...StyleSheet.absoluteFill,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: colors.background,
        },
        footer: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 16,
            paddingTop: 16,
            backgroundColor: colors.card,
            borderTopWidth: 1,
            borderTopColor: colors.border,
        },
        infoColumn: { flex: 1, marginRight: 12 },
        detectLabel: {
            fontSize: 11,
            fontWeight: "700",
            color: colors.textMuted,
        },
        detectTitle: {
            fontSize: 13,
            fontWeight: "800",
            marginTop: 2,
            color: colors.text,
        },
        captureButton: {
            ...formStyles.button,
            paddingHorizontal: 16,
            paddingVertical: 12,
            marginTop: 0,
            flexDirection: "row",
            gap: 6,
        },
        captureButtonText: { ...formStyles.buttonText, fontSize: 12 },
    });
