"use client";

import { RiCloseLargeFill } from "react-icons/ri";
import { useSession } from "next-auth/react";
import { ReactHTMLElement, useState } from "react";
import NewWorkoutFormContainer from "@/components/NewWorkoutFormContainer";

interface Props {
    visible: boolean;
    exeId: string;
    onClose: () => void;
}

export default function NewExercisePopup({ visible, onClose, exeId }: Props) {
    if (!visible) return null;
    const { data: session, status } = useSession();
    const [error, setError] = useState();
    const [entryValue, setEntryValue] = useState<string>("");
    const userId = session?.user?.id || localStorage.getItem("userId");

    return (
        <div className="popup" id="new-workout-popup">
            <h2>Log a set</h2>
            <NewWorkoutFormContainer 
                onClose={onClose} 
                visible={visible} 
                isMobile={false} 
                isXXLarge={false} 
                exerciseName={exeId}
            />
            <button type="button" className="popup-button" id="cancel-button" onClick={onClose}><RiCloseLargeFill /></button>
        </div>
    )

}