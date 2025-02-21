"use client";

import { RiCloseLargeFill } from "react-icons/ri";
import { useSession } from "next-auth/react";
import { ReactHTMLElement, useState } from "react";

interface NewExercisePopupProps {
    visible: boolean;
    onClose: () => void;
}

export default function NewExercisePopup({ visible, onClose }: NewExercisePopupProps) {
    if (!visible) return null;
    const { data: session, status } = useSession();
    const [ error, setError ] = useState();
    const [ entryValue, setEntryValue ] = useState<string>("");
    const userId = session?.user?.id || localStorage.getItem("userId");

    const submitNewExercise = async() => {

        const token = session?.user?.authToken || localStorage.getItem("token");
    
        if (!token) {
            setError("No authentication session found. Please log in.");
            return;
        }
    
        try {
            const body = {
                "name": entryValue,
                "userId": userId
            }
            const response = await fetch(`http://localhost:5000/api/user/${userId}/exercises`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(body)
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to post exercise");
            }

            onClose();
    
        } catch (error: any) {
            console.error("Error fetching exercises:", error.message);
            setError(error.message);
        }

    }

    const inputHandler = (e: ReactHTMLElement<HTMLInputElement>) => {
        setEntryValue(e.target.value);
    }

    return (
        <div className="popup" id="new-exercise-popup">
            <div className="popup-header-container">
                <h2 className="popup-header">
                    Enter New Exercise
                </h2>
                <span>You will only see your own exercises</span>
            </div>
            <form action={submitNewExercise}>
                <input type="text" className="new-exercise-name" required autoFocus placeholder="exercise name..." onChange={inputHandler} />
            </form>
            <div className="popup-footer">
                <button className="popup-button" id="submit-button" onClick={submitNewExercise}>Submit</button>
            </div>
            <button className="popup-button" id="cancel-button" onClick={onClose}><RiCloseLargeFill /></button>
        </div>
    );
}