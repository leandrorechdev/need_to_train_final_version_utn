export interface WorkoutItem {
    id: string;
    text: string;
    youtubeUrl?: string;
}

export interface WeekPlan {
    [key: string]: WorkoutItem[];
}

// Usamos 'let' para poder simular mutaciones reales de datos en memoria
let MOCK_PLAN: WeekPlan = {
    Monday: [
        { id: "1", text: "Running: 5K a ritmo de pogo punk" },
        { id: "2", text: "Rutina de Piernas (Sentadillas pesadas)" },
    ],
    Tuesday: [
        {
            id: "3",
            text: "Técnica de Fútbol y pasadas",
            youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        },
    ],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: [],
    Sunday: [],
};

export const workoutService = {
    getWeekPlan: async (): Promise<WeekPlan> => {
        return MOCK_PLAN;
    },

    saveWeekPlan: async (plan: WeekPlan): Promise<void> => {
        MOCK_PLAN = plan; // Guarda el nuevo estado en la memoria simulada
        console.log("Mock: Plan guardado con éxito.");
    },

    addWorkout: async (
        day: string,
        text: string,
        youtubeUrl?: string,
    ): Promise<WeekPlan> => {
        const newWorkout: WorkoutItem = {
            id: Date.now().toString(), // Genera un ID único en base al tiempo, ideal Android
            text,
            youtubeUrl,
        };

        // Modificamos el objeto real creando una copia limpia para forzar el re-render en el celular
        MOCK_PLAN = {
            ...MOCK_PLAN,
            [day]: [...(MOCK_PLAN[day] || []), newWorkout],
        };

        console.log(`Mock: Agregado con éxito a ${day}`);
        return MOCK_PLAN;
    },

    deleteWorkout: async (day: string, id: string): Promise<WeekPlan> => {
        // Filtra el array eliminando el item seleccionado
        MOCK_PLAN = {
            ...MOCK_PLAN,
            [day]: MOCK_PLAN[day].filter((item) => item.id !== id),
        };

        console.log(`Mock: Borrado ítem ${id} de ${day}`);
        return MOCK_PLAN;
    },
};
