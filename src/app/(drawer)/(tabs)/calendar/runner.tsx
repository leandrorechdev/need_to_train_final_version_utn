import RunnerForm from "@/components/forms/RunnerForm"
import ScreenWrapper from "@/components/ScreenWrapper"

export default function Runner() {
    return (
        <ScreenWrapper withScroll={true}>
            <RunnerForm />
        </ScreenWrapper>
    );
}