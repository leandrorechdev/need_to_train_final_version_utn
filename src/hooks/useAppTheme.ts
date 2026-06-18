import { useThemeContext } from "@/context/ThemeContext";
import { AppTheme } from "@/constants/theme";

export function useAppTheme(): AppTheme {
  const { colors } = useThemeContext();
  return colors;
}
