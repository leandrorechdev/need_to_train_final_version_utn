import { auth } from "@/config/firebase";
import { MaterialIcons } from "@expo/vector-icons";
import { signOut } from "firebase/auth";
import { useState } from "react";
import {
    Alert,
    Image,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

// Tus componentes y hooks personalizados
import AccessibilityHeader from "@/components/AccessibilityHeader";
import { getFormStyles } from "@/constants/styles";
import { useModal } from "@/context/ModalContext";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useTranslation } from "@/hooks/useTranslation";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";

export default function ProfileScreen() {
    const colors = useAppTheme();
    const styles = getFormStyles(colors);
    const { t } = useTranslation();
    const { showModal } = useModal();

    // Inicialización inteligente: displayName -> email -> vacío
    const [nombre, setNombre] = useState(
        auth.currentUser?.displayName ||
            auth.currentUser?.email?.split("@")[0] ||
            "",
    );
    const [objetivo, setObjetivo] = useState("");
    const [image, setImage] = useState<string | null>(null); // Creamos un estado que guarda la URI (la dirección local de la foto).

     // Lógica de Cámara
    const launchCamera = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== "granted") {
            showModal(
                t("profile.permissionDenied"),
                t("profile.permissionMessage"),
                () => {},
                "error",
            );
            return;
        }
        let result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
        });
        if (!result.canceled) setImage(result.assets[0].uri);
    };

    // Lógica de Galería
    const launchGallery = async () => {
        const { status } =
            await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
            showModal(
                t("profile.permissionDenied"),
                t("profile.permissionMessage"),
                () => {},
                "error",
            );
            return;
        }
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
        });
        if (!result.canceled) setImage(result.assets[0].uri);
    };

    // Selector principal(con alert nativo)
    const pickImage = () => {
        Alert.alert(
            t("profile.photoOptionsTitle"),
            t("profile.photoOptionsMessage"),
            [
                { text: t("common.cancel"), style: "cancel" },
                { text: t("profile.cameraOption"), onPress: launchCamera },
                { text: t("profile.galleryOption"), onPress: launchGallery },
            ],
        );
    };

    // dejamos Alert nativo
    const handleLogout = () => {
        Alert.alert(t("profile.logoutTitle"), t("profile.logoutConfirm"), [
            { text: t("common.cancel"), style: "cancel" },
            {
                text: t("common.exit"),
                style: "destructive",
                onPress: async () => await signOut(auth),
            },
        ]);
    };

    const handleSave = () => {
        showModal(
            t("profile.successTitle"),
            t("profile.successSave"),
            () => {},
            "success",
        );
    };

    return (
        <ScrollView
            style={{ flex: 1, backgroundColor: colors.background }}
            contentContainerStyle={{ paddingBottom: 30 }}
        >
            <AccessibilityHeader />
            <View style={{ padding: 20 }}>
                <View style={styles.profileImageContainer}>
                    <TouchableOpacity
                        onPress={pickImage}
                        style={styles.profileImageButton}
                    >
                        {image ? (
                            <Image
                                source={{ uri: image }}
                                style={styles.profileImage}
                            />
                        ) : (
                            <View
                                style={[
                                    styles.profilePlaceholder,
                                    { backgroundColor: colors.border },
                                ]}
                            >
                                <MaterialIcons
                                    name="camera-alt"
                                    size={40}
                                    color={colors.textMuted}
                                />
                            </View>
                        )}
                    </TouchableOpacity>
                    <Text style={{ marginTop: 10, color: colors.textMuted }}>
                        {t("profile.changePhoto")}
                    </Text>
                </View>

                <View style={styles.sectionCard}>
                    <Text style={styles.sectionLabel}>
                        {t("profile.athleteData")}
                    </Text>
                    <Text style={styles.inputLabel}>
                        {t("profile.username")}
                    </Text>
                    <TextInput
                        style={styles.input}
                        value={nombre}
                        onChangeText={setNombre}
                        placeholder={t("profile.placeholderName")}
                        placeholderTextColor={colors.textMuted}
                    />

                    <Text style={styles.inputLabel}>
                        {t("profile.fitnessGoal")}
                    </Text>
                    <TextInput
                        style={styles.input}
                        value={objetivo}
                        onChangeText={setObjetivo}
                        placeholder={t("profile.placeholderGoal")}
                        placeholderTextColor={colors.textMuted}
                    />

                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleSave}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.buttonText}>
                            {t("profile.saveBtn")}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={{
                            marginTop: 25,
                            padding: 12,
                            alignItems: "center",
                            borderWidth: 1,
                            borderColor: colors.border,
                            borderRadius: 12,
                        }}
                        onPress={() =>
                            router.push("/(drawer)/(tabs)/calendar" as any)
                        }
                    >
                        <Text
                            style={{
                                color: colors.textMuted,
                                fontWeight: "600",
                            }}
                        >
                            {t("profile.backToCalendar")}
                        </Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    style={styles.btnDelete}
                    onPress={handleLogout}
                    activeOpacity={0.8}
                >
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 6,
                            justifyContent: "center",
                        }}
                    >
                        <MaterialIcons
                            name="logout"
                            size={18}
                            color="#ffffff"
                        />
                        <Text style={styles.btnDeleteText}>
                            {t("profile.logoutBtn")}
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}