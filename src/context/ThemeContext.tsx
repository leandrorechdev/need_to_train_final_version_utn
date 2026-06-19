import React, { createContext, useContext, useState, useEffect } from "react";
import { useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { darkTheme, lightTheme, AppTheme } from "@/constants/theme";

type ThemeMode = "light" | "dark";// definimos los temas posibles

interface ThemeContextType {
  themeMode: ThemeMode;
  colors: AppTheme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();// Detecta el tema del sistema operativo.
  const [themeMode, setThemeMode] = useState<ThemeMode>("dark");// Inicializamos en oscuro
  useEffect(() => {
    // Si hay algún tema previo lo cargamos y seteamos
    const loadTheme = async () => {
      const savedTheme = await AsyncStorage.getItem("@app_theme");
      if (savedTheme === "light" || savedTheme === "dark") {
        setThemeMode(savedTheme);
      } else {// sino hay nada usamos el valor del sistema operativo(systemScheme)
        setThemeMode(systemScheme === "light" ? "light" : "dark");
      }
    };
    loadTheme();
  }, [systemScheme]);// si el usuario cambia algo en los ajustes de su teléfono, se vuelve a ejecutar

  const toggleTheme = async () => {
    const nextTheme = themeMode === "dark" ? "light" : "dark";// alterna entre los dos temas
    setThemeMode(nextTheme);
    await AsyncStorage.setItem("@app_theme", nextTheme);// Guarda el nuevo valor en el teléfono para que la próxima vez que abramos la app, se recuerde.
  };

  // seleccionamos directamente entre darkTheme y lightTheme
  const colors = themeMode === "dark" ? darkTheme : lightTheme;

  // Cualquier hijo dentro de este Provider podrá acceder a estos 3 valores.
  return (
    <ThemeContext.Provider value={{ themeMode, colors, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeContext() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useThemeContext debe usarse dentro de ThemeProvider");
  return context;
}