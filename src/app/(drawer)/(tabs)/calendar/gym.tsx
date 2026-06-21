import GymForm from "@/components/forms/GymForm"
import ScreenWrapper from "@/components/ScreenWrapper"

export default function Gym() {
    return (
        <ScreenWrapper withScroll={true}>
            <GymForm />
        </ScreenWrapper>
    );
}