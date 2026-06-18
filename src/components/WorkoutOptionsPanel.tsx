import { i18n } from "@/constants/i18n";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface WorkoutOptionsPanelProps {
    visible: boolean;
    onClose: () => void;
    selectedDayKey: string;
    locale: string;
    colors: any;
}

export default function WorkoutOptionsPanel({
    visible,
    onClose,
    selectedDayKey,
    locale,
    colors,
}: WorkoutOptionsPanelProps) {
    const router = useRouter();
    const t = (key: string) => i18n.t(key, { locale });

    const options = [
        {
            id: "gym",
            label: "GYM",
            icon: "weight-lifter",
            color: colors.accent,
        },
        { id: "runner", label: "RUNNER", icon: "run", color: colors.accent },
        {
            id: "youtube",
            label: "YOUTUBE",
            icon: "youtube",
            color: colors.secondaryAccent,
        }, // array para botones escalable(podemos agregar alguno más a futuro)
    ];

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <TouchableOpacity
                style={styles.overlay}
                activeOpacity={1}
                onPress={onClose}
            >
                <View
                    style={[
                        styles.modalContainer,
                        {
                            backgroundColor: colors.card,
                            borderColor: colors.border,
                        },
                    ]}
                >
                    <View style={styles.panelHeader}>
                        <Text
                            style={[styles.panelTitle, { color: colors.text }]}
                        >
                            {t("workout.modalTitle")}
                        </Text>
                        <TouchableOpacity onPress={onClose}>
                            <MaterialIcons
                                name="close"
                                size={24}
                                color={colors.text}
                            />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.optionsRow}>
                        {options.map((opt) => (
                            <TouchableOpacity
                                key={opt.id}
                                style={[
                                    styles.optionButton,
                                    {
                                        backgroundColor: colors.cardItem,
                                        borderColor: colors.border,
                                    },
                                ]}
                                onPress={() => {
                                    onClose();// cierra el modal primero
                                    router.push({// navega hacia la nueva ruta
                                        pathname:
                                            `/(drawer)/(tabs)/calendar/${opt.id}` as any,// construye la ruta
                                        params: { dayKey: selectedDayKey },// permite saber en qué día guardar la rutina
                                    });
                                }}
                            >
                                <MaterialCommunityIcons
                                    name={opt.icon as any}
                                    size={26}
                                    color={opt.color}
                                />
                                <Text
                                    style={[
                                        styles.optionText,
                                        { color: colors.text },
                                    ]}
                                >
                                    {opt.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </TouchableOpacity>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        padding: 20,
    },
    modalContainer: {
        padding: 20,
        borderRadius: 20,
        borderWidth: 1,
        elevation: 5,
    },
    panelHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
    },
    panelTitle: { fontWeight: "900", fontSize: 14, letterSpacing: 0.5 },
    optionsRow: { flexDirection: "row", justifyContent: "space-between" },
    optionButton: {
        flex: 1,
        paddingVertical: 15,
        marginHorizontal: 5,
        borderRadius: 12,
        borderWidth: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    optionText: {
        fontSize: 11,
        fontWeight: "900",
        marginTop: 6,
        letterSpacing: 0.5,
    },
});
