import GymForm from "@/components/forms/GymForm"
import ScreenWrapper from "@/components/ScreenWrapper"

export default function Gym() {
    return (
        <ScreenWrapper withScroll={true}>
            {/* 🚀 Contenedor arquitectónico limpio: Dejamos que GymForm administre su propia cabecera y layout de forma segura */}
            <GymForm />
        </ScreenWrapper>
    );
}