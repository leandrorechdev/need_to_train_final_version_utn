export interface VideoWorkout {
    id: string;
    titleEs: string; 
    titleEn: string; 
    url: string;
    channel: string;
    category: string;
}

export const VIDEOS_REALES: VideoWorkout[] = [
    { 
        id: "r_1", 
        titleEs: "Rutina de Cardio HIIT 20 Minutos - Quemar Grasa", 
        titleEn: "20-Minute HIIT Cardio Workout - Fat Burn",
        url: "https://www.youtube.com/watch?v=y38HjS_p8Wk", 
        channel: "Gym Virtual", 
        category: "Cardio" 
    },
    { 
        id: "r_2", 
        titleEs: "Entrenamiento de Piernas Completo con Mancuernas", 
        titleEn: "Full Dumbbell Leg Workout",
        url: "https://www.youtube.com/watch?v=5_zY6mH2Yp0", 
        channel: "Powerexplosive", 
        category: "Fuerza" 
    },
    { 
        id: "r_3", 
        titleEs: "Rutina de Abdominales Intensos en Casa (10 Min)", 
        titleEn: "Intense 10-Minute Home Ab Workout",
        url: "https://www.youtube.com/watch?v=vVre_z8_uN0", 
        channel: "Fausto Murillo", 
        category: "Abdomen" 
    },
    { 
        id: "r_4", 
        titleEs: "Full Body Completo - Rutina de Fuerza Funcional", 
        titleEn: "Full Body Functional Strength Routine",
        url: "https://www.youtube.com/watch?v=X_9Z2Wn5m9g", 
        channel: "Buff Academy", 
        category: "Fuerza" 
    },
    { 
        id: "r_5", 
        titleEs: "Estiramientos Completos para Flexibilidad Post-Entreno", 
        titleEn: "Full Post-Workout Flexibility Stretching",
        url: "https://www.youtube.com/watch?v=G3wunEwVd94", 
        channel: "Dein Fit", 
        category: "Flexibilidad" 
    }
];