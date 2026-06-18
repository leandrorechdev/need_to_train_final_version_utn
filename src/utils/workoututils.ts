export const formatWorkoutDescription = (item: any, locale: string) => {
    // Si hay subtexto manual, es la prioridad absoluta
    if (item.subText) return item.subText;

    // Lógica para Gimnasio
    if (item.type === "gym" && (item.series || item.reps)) {
        return `${item.series || "0"} Series x ${item.reps || "0"} Reps`;
    }

    // Lógica para Running
    if (item.type === "runner" && (item.distance || item.duration)) {
        return `${item.distance || ""} - ${item.duration || ""}`;
    }

    // Si no hay nada, devolvemos null
    return null;
};