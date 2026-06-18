import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import YoutubeBrowserModal from "./YoutubeBrowserModal";
import { formatWorkoutDescription } from "@/utils/workoututils";

interface WorkoutItem {
    id: string;
    type: "gym" | "runner" | "youtube";
    day: string;
    text: string;
    subText?: string;
    youtubeUrl?: string;

    // Campos individuales por si acaso
    series?: string;
    reps?: string;
    distance?: string;
    duration?: string;
}

interface WorkoutCardProps {
    item: WorkoutItem;
    colors: any;
    onDelete: (id: string) => void;
    locale: string;
}

export default function WorkoutCard({
    item,
    colors,
    onDelete,
    locale,
}: WorkoutCardProps) {
    const router = useRouter();
    const [ytModalVisible, setYtModalVisible] = useState(false);
    const description = formatWorkoutDescription(item, locale);

    const handleEditNavigation = () => {
        if (item.type === "gym") {
            router.push({
                pathname: "./gym",
                params: { dayKey: item.day, workoutId: item.id },
            });
        } else if (item.type === "runner") {
            router.push({
                pathname: "./runner",
                params: { dayKey: item.day, workoutId: item.id },
            });
        }
    };

    const renderIcon = () => {
        switch (item.type) {
            case "gym":
                return (
                    <MaterialCommunityIcons
                        name="weight-lifter"
                        size={22}
                        color={colors.accent}
                        style={styles.cardIcon}
                    />
                );
            case "runner":
                return (
                    <MaterialCommunityIcons
                        name="run"
                        size={22}
                        color={colors.accent}
                        style={styles.cardIcon}
                    />
                );
            case "youtube":
                return (
                    <MaterialCommunityIcons
                        name="youtube"
                        size={22}
                        color="red"
                        style={styles.cardIcon}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <View style={styles.cardWrapper}>
            <TouchableOpacity
                style={[
                    styles.card,
                    {
                        backgroundColor: colors.cardItem,
                        borderColor: colors.border,
                    },
                ]}
                onPress={handleEditNavigation}
                disabled={item.type === "youtube"} // YouTube se controla con su propio botón interno
                activeOpacity={0.7}
            >
                <View style={styles.content}>
                    <View style={styles.titleRow}>
                        {renderIcon()}
                        <Text
                            style={[styles.title, { color: colors.text }]}
                            numberOfLines={2}
                        >
                            {item.text}
                        </Text>
                    </View>

                    {/* Renderiza la descripción recuperada */}
                    {description ? (
                        <Text
                            style={[
                                styles.subTitle,
                                { color: colors.textMuted },
                            ]}
                        >
                            {description}
                        </Text>
                    ) : null}

                    {/* 📺 ENLACE DE YOUTUBE MEJORADO: Abre el modal seguro dentro de la app */}
                    {item.type === "youtube" && item.youtubeUrl ? (
                        <TouchableOpacity
                            style={[
                                styles.trainingLinkButton,
                                { backgroundColor: colors.secondaryAccent },
                            ]}
                            onPress={() => setYtModalVisible(true)} // 👈 ACTIVA EL MODAL INTERNO CON BOTÓN DE CIERRE
                            activeOpacity={0.8}
                        >
                            <MaterialCommunityIcons
                                name="television-play"
                                size={16}
                                color="#fff"
                            />
                            <Text style={styles.trainingLinkText}>
                                TRAINING LINK
                            </Text>
                        </TouchableOpacity>
                    ) : null}
                </View>

                {/* Botón de borrado aislado */}
                <TouchableOpacity
                    onPress={() => onDelete(item.id)}
                    style={styles.deleteButton}
                    activeOpacity={0.6}
                >
                    <MaterialIcons
                        name="delete-outline"
                        size={22}
                        color="red"
                    />
                </TouchableOpacity>
            </TouchableOpacity>

            {/* ⚡ MODAL WEB SEGURO DENTRO DE LA TARJETA */}
            {item.type === "youtube" && (
                <YoutubeBrowserModal
                    visible={ytModalVisible}
                    onClose={() => setYtModalVisible(false)}
                    onSelectVideo={async (title, url) => {
                        // Si quieren re-seleccionar o usar este mismo entrenamiento desde la tarjeta
                        setYtModalVisible(false);
                    }}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    cardWrapper: {
        // 🎯 LE DA AIRE RESPECTO A LOS BORDES DE LA PANTALLA (Soluciona la captura 1)
        paddingHorizontal: 4,
        width: "100%",
    },
    card: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 14,
        borderRadius: 16,
        borderWidth: 1,
        marginBottom: 12,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    content: {
        flex: 1,
        alignItems: "flex-start",
    },
    titleRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 4,
        paddingRight: 10,
    },
    cardIcon: {
        marginRight: 8,
    },
    title: {
        fontWeight: "800",
        fontSize: 14,
        lineHeight: 20,
        flexShrink: 1,
    },
    subTitle: {
        fontSize: 12,
        fontWeight: "600",
        marginLeft: 30,
        marginTop: 2,
    },
    trainingLinkButton: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        paddingHorizontal: 12,
        paddingVertical: 7,
        borderRadius: 10,
        marginTop: 10,
        marginLeft: 30,
        elevation: 2,
    },
    trainingLinkText: {
        color: "#fff",
        fontWeight: "900",
        fontSize: 11,
        letterSpacing: 0.5,
    },
    deleteButton: {
        paddingLeft: 10,
        paddingVertical: 10,
        justifyContent: "center",
        alignItems: "center",
    },
});
