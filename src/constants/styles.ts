import { StyleSheet } from "react-native";
import { AppTheme } from "./theme";

export const getFormStyles = (colors: AppTheme) =>
    StyleSheet.create({
        // CONTENEDORES PRINCIPALES Y LOGIN

        container: {
            flex: 1,
            justifyContent: "center",
            padding: 24,
            backgroundColor: colors.background,
        },
        title: {
            fontSize: 28,
            fontWeight: "900",
            marginBottom: 30,
            textAlign: "center",
            letterSpacing: 0.5,
            color: colors.text,
            marginTop: 40,
        },
        input: {
            padding: 15,
            borderRadius: 12,
            marginBottom: 15,
            fontSize: 16,
            borderWidth: 1,
            backgroundColor: colors.card,
            borderColor: colors.border,
            color: colors.text,
        },
        passwordContainer: {
            flexDirection: "row",
            alignItems: "center",
            borderRadius: 12,
            marginBottom: 20,
            borderWidth: 1,
            height: 50,
            backgroundColor: colors.card,
            borderColor: colors.border,
            overflow: "hidden",
        },
        passwordInput: {
            flex: 1,
            padding: 15,
            fontSize: 16,
            color: colors.text,
            backgroundColor: "transparent",
        },
        eyeIcon: {
            paddingHorizontal: 15,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "transparent",
            height: "100%",
        },
        button: {
            padding: 15,
            borderRadius: 12,
            alignItems: "center",
            marginTop: 10,
            elevation: 3,
            backgroundColor: colors.accent,
        },
        buttonText: {
            color: colors.buttonText,
            fontSize: 16,
            fontWeight: "900",
            letterSpacing: 0.5,
        },
        linkContainer: {
            marginTop: 25,
            alignItems: "center",
        },
        linkText: {
            fontSize: 14,
            fontWeight: "700",
            color: colors.accent,
        },

        // PERFIL USUARIO
        profileImageContainer: {
            alignItems: "center",
            marginBottom: 20,
        },
        profileImageButton: {
            borderRadius: 75,
            overflow: "hidden",
            borderWidth: 2,
            borderColor: colors.border,
        },
        profileImage: {
            width: 150,
            height: 150,
        },
        profilePlaceholder: {
            width: 150,
            height: 150,
            borderRadius: 75,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: colors.card,
            borderWidth: 1,
            borderColor: colors.border,
        },

        // (GYM & RUNNER)

        formContainer: {
            gap: 20,
            marginTop: 15,
            paddingHorizontal: 4,
        },
        sectionCard: {
            backgroundColor: colors.card,
            borderColor: colors.border,
            borderRadius: 16,
            borderWidth: 1,
            padding: 16,
            gap: 14,
            elevation: 1,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 2,
            width: "100%",
        },
        sectionLabel: {
            fontSize: 11,
            fontWeight: "800",
            letterSpacing: 1,
            marginBottom: 2,
            color: colors.textMuted,
        },
        gridRow: {
            flexDirection: "row",
            justifyContent: "space-between",
            gap: 12,
        },
        gridColumn: {
            flex: 1,
            gap: 6,
        },
        inputLabel: {
            fontSize: 12,
            fontWeight: "700",
            marginLeft: 2,
            color: colors.text,
        },
        btnSave: {
            padding: 16,
            borderRadius: 14,
            alignItems: "center",
            marginTop: 10,
            elevation: 4,
            shadowColor: colors.text,
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
            backgroundColor: colors.text,
        },
        btnSaveText: {
            fontWeight: "900",
            fontSize: 14,
            letterSpacing: 1,
            color: colors.background,
        },

        // BUSCADOR Y TARJETAS DE YOUTUBE

        mainLayoutContainer: {
            flex: 1,
            paddingHorizontal: 16,
            backgroundColor: colors.background, // 🌟 Forzado dinámico de fondo
        },
        ytVideoCard: {
            borderRadius: 16,
            borderWidth: 1,
            padding: 16,
            marginBottom: 14,
            elevation: 2,
            backgroundColor: colors.card,
            borderColor: colors.border,
        },
        ytCardHeader: {
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 8,
        },
        ytChannelText: {
            fontSize: 12,
            fontWeight: "600",
            marginLeft: 6,
            color: colors.textMuted,
        },
        ytVideoTitle: {
            fontSize: 14,
            fontWeight: "800",
            lineHeight: 20,
            marginBottom: 14,
            color: colors.text,
        },
        ytActionsRow: {
            flexDirection: "row",
            justifyContent: "space-between",
            gap: 12,
        },
        ytBtnSecondary: {
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            borderWidth: 1.5,
            borderRadius: 10,
            paddingVertical: 10,
            borderColor: colors.secondaryAccent,
            backgroundColor: "transparent",
        },
        ytBtnSecondaryText: {
            fontSize: 11,
            fontWeight: "900",
            color: colors.secondaryAccent,
        },
        ytBtnPrimary: {
            flex: 1.2,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 10,
            paddingVertical: 10,
            elevation: 1,
            backgroundColor: colors.accent,
        },
        ytBtnPrimaryText: {
            fontSize: 11,
            fontWeight: "900",
            color: colors.buttonText, // 🌟 Blanco en modo oscuro / Color correcto en modo claro
        },

        // ACCIONES DESTRUCTORAS(borrado, etc)

        btnDelete: {
            padding: 16,
            borderRadius: 14,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#ff3b30",
            marginTop: 28,
            marginBottom: 30,
            elevation: 3,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 3,
        },
        btnDeleteText: {
            color: "#ffffff",
            fontWeight: "900",
            fontSize: 14,
            letterSpacing: 0.5,
        },
    });