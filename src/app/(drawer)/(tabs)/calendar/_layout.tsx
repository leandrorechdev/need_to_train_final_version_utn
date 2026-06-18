import { Stack } from "expo-router";

export default function CalendarLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            {/* 1. Vista principal semanal */}
            <Stack.Screen name="index" />
            
            {/* 2. El Buscador Real mapeado de forma nativa */}
            <Stack.Screen name="youtube" />

            {/* 3. Formulario Gym */}
            <Stack.Screen name="gym" />

            {/* 4. Formulario Runner */}
            <Stack.Screen name="runner" />
        </Stack>
    );
}

