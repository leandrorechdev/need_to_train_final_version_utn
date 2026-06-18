import RunnerForm from "@/components/forms/RunnerForm"
import ScreenWrapper from "@/components/ScreenWrapper"

export default function Runner() {
    return (
        <ScreenWrapper withScroll={true}>
            {/* 🚀 Contenedor limpio: Dejamos que RunnerForm administre su propia cabecera y layout */}
            <RunnerForm />
        </ScreenWrapper>
    );
}