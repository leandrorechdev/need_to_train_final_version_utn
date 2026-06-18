import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
    addDoc,
    collection,
    getDocs,
    serverTimestamp,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Linking,
    Platform,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import AccessibilityHeader from "@/components/AccessibilityHeader";
import ScreenWrapper from "@/components/ScreenWrapper";
import YoutubeBrowserModal from "@/components/YoutubeBrowserModal";
import { auth, db } from "@/config/firebase";
import { i18n } from "@/constants/i18n";
import { getFormStyles } from "@/constants/styles";
import { VIDEOS_REALES } from "@/constants/videos"; // fallback de videos
import { useLanguage } from "@/context/LanguageContext";
import { useModal } from "@/context/ModalContext";
import { useAppTheme } from "@/hooks/useAppTheme";

export interface Video {
    id: string;
    titleEs: string;
    titleEn: string;
    category: string;
    url: string;
    channel: string;
    type?: string;
    text?: string;
}

export default function YoutubeScreen() {
    const colors = useAppTheme();
    const styles = getFormStyles(colors);
    const { locale } = useLanguage();
    const router = useRouter();
    const { dayKey } = useLocalSearchParams<{ dayKey: string }>(); // día de la semana

    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false); // YoutubeBrowserModal
    const { showModal } = useModal(); // modal de alertas propio

    // 1. Inicializa vacío
    const [results, setResults] = useState<Video[]>([]);

    useEffect(() => {
        const fetchVideos = async () => {
            setIsLoading(true);
            try {
                const querySnapshot = await getDocs(collection(db, "videos"));
                const firebaseVideos = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                })) as Video[];

                // Si Firebase trajo datos, usamos esos.
                if (firebaseVideos.length > 0) {
                    setResults(firebaseVideos);
                } else {
                    // Si Firebase está vacío (o no pudo traer nada), usamos el respaldo.
                    setResults(VIDEOS_REALES);
                }
            } catch (error) {
                console.error(
                    "Error leyendo Firebase, usando respaldo:",
                    error,
                );
                setResults(VIDEOS_REALES); // Respaldo ante error
            } finally {
                setIsLoading(false);
            }
        };
        fetchVideos();
    }, []);

    const t = (key: string) => i18n.t(key, { locale });

    // lo vamos a tener de respaldo por si no carga Firebase
    const handleSearch = () => {
        if (!searchQuery.trim()) {
            setResults(VIDEOS_REALES);
            return;
        }
        const filtered = VIDEOS_REALES.filter((v) => {
            const currentTitle = locale === "es" ? v.titleEs : v.titleEn;
            return (
                currentTitle
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                v.category.toLowerCase().includes(searchQuery.toLowerCase())
            );
        });
        setResults(filtered);
    };

    // Abrimos el enlace con la aplicación que corresponda(youtube || navegador)
    const handleOpenInYouTube = (url: string) => {
        Linking.openURL(url).catch(() =>
            showModal(
                t("youtube.errorTitle"),
                t("youtube.errorVideoOpen"),
                () => {},
                "error",
            ),
        );
    };
    const handleSelectWorkout = async (title: string, videoUrl: string) => {
        const user = auth.currentUser;
        // Usamos el modal para el error de auth(si no existe usuario)
        if (!user)
            return showModal(
                t("youtube.errorTitle"),
                t("workout.errorAuth"),
                () => {},
                "error",
            );

        try {
            await addDoc(collection(db, "workouts"), {
                userId: user.uid,
                type: "youtube",
                day: dayKey || "monday", // sino viene el día, lunes por defecto
                text: title,
                youtubeUrl: videoUrl,
                createdAt: serverTimestamp(), // usamos reloj de Google
            });

            showModal(
                t("youtube.successTitle"),
                t("youtube.successSubtitle"),
                () => {
                    setModalVisible(false);
                    router.back(); // el usuario da ok al modal de éxito y lo devolvemmos al calendario
                },
                "success",
            );
        } catch (error) {
            // Usamos el modal para el error de guardado
            showModal(
                t("youtube.errorTitle"),
                t("workout.errorSave"),
                () => {},
                "error",
            );
        }
    };

    return (
        <ScreenWrapper withScroll={false}>
            <View style={styles.mainLayoutContainer}>
                <View style={localStyles.headerSpacingWrapper}>
                    <AccessibilityHeader showBackButton={true} />
                </View>

                <Text style={styles.title}>{t("youtube.title")}</Text>

                <TouchableOpacity
                    style={[
                        localStyles.btnFreeSearch,
                        { backgroundColor: colors.secondaryAccent },
                    ]}
                    onPress={() => setModalVisible(true)}
                    activeOpacity={0.8}
                >
                    <MaterialCommunityIcons
                        name="web"
                        size={22}
                        color={colors.buttonText}
                    />
                    <Text
                        style={[
                            localStyles.btnFreeSearchText,
                            { color: colors.buttonText },
                        ]}
                    >
                        {t("youtube.freeSearchBtn")}
                    </Text>
                </TouchableOpacity>

                <View
                    style={[
                        localStyles.searchContainer,
                        {
                            backgroundColor: colors.card,
                            borderColor: colors.border,
                        },
                    ]}
                >
                    <TextInput
                        style={[localStyles.inputField, { color: colors.text }]}
                        placeholder={t("youtube.filterPlaceholder")}
                        placeholderTextColor={colors.textMuted}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        onSubmitEditing={handleSearch}
                        returnKeyType="search"
                    />
                    <TouchableOpacity
                        onPress={handleSearch}
                        style={localStyles.searchIconInside}
                    >
                        <MaterialIcons
                            name="search"
                            size={24}
                            color={colors.accent}
                        />
                    </TouchableOpacity>
                </View>

                {isLoading ? (
                    <ActivityIndicator
                        size="large"
                        color={colors.accent}
                        style={{ marginTop: 50 }}
                    />
                ) : (
                    <FlatList
                        data={results} // videos de Firebase o nuestros (si falla)
                        keyExtractor={(item) => item.id}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 30 }}
                        renderItem={({ item }: { item: Video }) => (
                            <View style={styles.ytVideoCard}>
                                <View style={styles.ytCardHeader}>
                                    <MaterialCommunityIcons
                                        name="youtube"
                                        size={22}
                                        color="red"
                                    />
                                    <Text style={styles.ytChannelText}>
                                        {item.channel} {"\u00B7"}{" "}
                                        {/* nombre del canal- punto medio */}
                                        <Text style={{ color: colors.accent }}>
                                            {item.category}
                                        </Text>
                                    </Text>
                                </View>

                                <Text style={styles.ytVideoTitle} numberOfLines={2}>
                                    {/* 1. Si el video es capturado del modal, tendrá la propiedad 'text' */}
                                    {item.type === "youtube" && item.text
                                        ? item.text
                                        : locale === "es"
                                          ? item.titleEs
                                          : item.titleEn}
                                </Text>

                                <View style={styles.ytActionsRow}>
                                    <TouchableOpacity
                                        style={styles.ytBtnSecondary}
                                        onPress={() =>
                                            handleOpenInYouTube(item.url)
                                        } // botón para ver el video
                                    >
                                        <Text style={styles.ytBtnSecondaryText}>
                                            {t("youtube.btnWatch")}
                                        </Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={styles.ytBtnPrimary}
                                        onPress={() =>
                                            handleSelectWorkout(
                                                locale === "es"
                                                    ? item.titleEs
                                                    : item.titleEn,
                                                item.url,
                                            )
                                        } // botón para registrar la rutina
                                    >
                                        <Text style={styles.ytBtnPrimaryText}>
                                            {t("youtube.btnSelect")}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}
                    />
                )}
            </View>

            <YoutubeBrowserModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                onSelectVideo={handleSelectWorkout}
            />
        </ScreenWrapper>
    );
}

const localStyles = StyleSheet.create({
    headerSpacingWrapper: {
        paddingTop:
            Platform.OS === "android" ? (StatusBar.currentHeight ?? 24) : 10,
        marginBottom: 5,
    },
    btnFreeSearch: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        padding: 14,
        borderRadius: 14,
        marginBottom: 15,
        gap: 8,
        elevation: 3,
        marginTop: 10,
    },
    btnFreeSearchText: { fontWeight: "900", fontSize: 13, letterSpacing: 0.5 },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 12,
        borderWidth: 1,
        paddingHorizontal: 12,
        marginBottom: 15,
        height: 50,
    },
    inputField: { flex: 1, fontSize: 15, height: "100%" },
    searchIconInside: { padding: 6 },
});
