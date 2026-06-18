import AccessibilityHeader from "@/components/AccessibilityHeader"
import { auth } from "@/config/firebase"
import { useModal } from "@/context/ModalContext"
import { useAppTheme } from "@/hooks/useAppTheme"
import { useTranslation } from "@/hooks/useTranslation"
import { Ionicons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { useState } from "react"
import {
    ActivityIndicator,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native"

import { getFormStyles } from "../constants/styles"

export default function RegisterScreen() {
    const colors = useAppTheme();
    const { t } = useTranslation();
    const router = useRouter();
    const { showModal } = useModal(); 

    const styles = getFormStyles(colors);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [secureText, setSecureText] = useState(true);
    const [loading, setLoading] = useState(false);

   const handleRegister = async () => {
        if (!email || !password) {
            showModal(
                t("auth.errorTitle"),
                t("auth.errorEmptyFields"),
                () => {},
                'error'
            );
            return;
        }

        setLoading(true);
        try {
            await createUserWithEmailAndPassword(auth, email.trim(), password);
            
            const userName = email.split('@')[0];
            showModal(
                t("auth.successTitle"), 
                t("auth.successRegister", {name: userName}), 
                () => router.replace("/login"),
                'success'
            );
        } catch (error: any) {
            showModal(
                t("auth.errorTitle"), 
                t(error.code), 
                () => {}, 
                'error'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <AccessibilityHeader />

            <Text style={styles.title}>{t("auth.registerTitle")}</Text>

            <TextInput
                style={styles.input}
                placeholder={t("auth.emailPlaceholder")}
                placeholderTextColor={colors.textMuted}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
            />

            <View style={styles.passwordContainer}>
                <TextInput
                    style={styles.passwordInput}
                    placeholder={t("auth.passwordPlaceholder")}
                    placeholderTextColor={colors.textMuted}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={secureText}
                    autoCapitalize="none"
                />
                <TouchableOpacity
                    onPress={() => setSecureText(!secureText)}
                    style={styles.eyeIcon}
                >
                    <Ionicons
                        name={secureText ? "eye-off" : "eye"}
                        size={22}
                        color={colors.textMuted}
                    />
                </TouchableOpacity>
            </View>

            <TouchableOpacity
                style={styles.button}
                onPress={handleRegister}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color={colors.buttonText} />
                ) : (
                    <Text style={styles.buttonText}>
                        {t("auth.registerBtn")}
                    </Text>
                )}
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => router.push("/login")}
                style={styles.linkContainer}
            >
                <Text style={styles.linkText}>{t("auth.toLoginLink")}</Text>
            </TouchableOpacity>
        </View>
    );
}