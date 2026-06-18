export const PALETTE = {
    punkYellow: "#E2B13C",
    punkRed: "#E63946",
    darkBg: "#121212",
    darkCard: "#1E1E1E",
    darkCardItem: "#262626",
    lightBg: "#F4F4F5",
    lightCard: "#FFFFFF",
    lightCardItem: "#E4E4E7",
    grayMuted: "#888888",
    grayLightMuted: "#666666",
    successDark: "#32D74B",
    successLight: "#34C759",
    errorDark: "#FF453A",
    errorLight: "#FF3B30",
};

// 1. Definimos la interfaz que todos los temas deben cumplir
export interface AppTheme {
    background: string;
    card: string;
    cardItem: string;
    text: string;
    textMuted: string;
    accent: string;
    secondaryAccent: string;
    border: string;
    inputBg: string;
    inputText: string;
    buttonText: string;
    success: string;
    error: string;
}

// 2. Creamos los temas usando la interfaz
export const darkTheme: AppTheme = {
    background: PALETTE.darkBg,
    card: PALETTE.darkCard,
    cardItem: PALETTE.darkCardItem,
    text: "#FFFFFF",
    textMuted: PALETTE.grayMuted,
    accent: PALETTE.punkYellow,
    secondaryAccent: PALETTE.punkRed,
    border: "#2A2A2A",
    inputBg: "#121212",
    inputText: "#FFFFFF",
    buttonText: "#121212",
    success: PALETTE.successDark,
    error: PALETTE.errorDark,
};

export const lightTheme: AppTheme = {
    background: PALETTE.lightBg,
    card: PALETTE.lightCard,
    cardItem: PALETTE.lightCardItem,
    text: "#121212",
    textMuted: PALETTE.grayLightMuted,
    accent: "#000000",
    secondaryAccent: PALETTE.punkRed,
    border: "#D4D4D8",
    inputBg: "#FFFFFF",
    inputText: "#121212",
    buttonText: "#FFFFFF",
    success: PALETTE.successLight,
    error: PALETTE.errorLight,
};