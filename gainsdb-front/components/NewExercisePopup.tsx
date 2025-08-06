"use client";

import { RiCloseLargeFill } from "react-icons/ri";
import { useSession } from "next-auth/react";
import { ChangeEvent, ReactEventHandler, ReactHTMLElement, useState } from "react";
import Loader from "@/components/Loader";

interface Props {
    visible: boolean;
    onClose: () => void;
}

export default function NewExercisePopup({ visible, onClose }: Props) {
    if (!visible) return null;
    const { data: session, status } = useSession();
    const [error, setError] = useState<unknown>();
    const [entryValue, setEntryValue] = useState<string>("");
    const [waiting, setWaiting] = useState(false);
    const userId = session?.user?.id || localStorage.getItem("userId");

    const server = process.env.NEXT_PUBLIC_BACKEND || `http://localhost:5000`;


    const submitNewExercise = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();       // ← stop native form submission
        if (!entryValue) return;
        setWaiting(true);
        const token = session?.user?.authToken || localStorage.getItem("token");
        if (!token) {
            setError("No authentication session found. Please log in.");
            setWaiting(false);
            return;
        }

        try {
            const body = {
                "name": entryValue,
                "userId": userId
            }
            const response = await fetch(`${server}/api/user/${userId}/exercises`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(body)
            });

            if (!response.ok) {
                const errorData = await response.json();
                setWaiting(false);
                throw new Error(errorData.message || "Failed to post exercise");
            }

            onClose();

        } catch (error: any) {
            console.error("Error fetching exercises:", error.message);
            setWaiting(false);
            setError(error.message);
        }

    }

    const inputHandler = (e: React.ChangeEvent<HTMLInputElement>) => setEntryValue(e.target.value.trim());

    return (
        <div className="popup" id="new-exercise-popup">

            {waiting &&
                <Loader msg={'Submitting'}></Loader>
            }

            <div className="popup-header-container">
                <h2 className="popup-header">
                    Enter New Exercise
                </h2>
                <span>You will only see your own exercises</span>
            </div>
            <form onSubmit={submitNewExercise}>
                <input type="text" className="new-exercise-name" required autoFocus placeholder="exercise name..." onChange={inputHandler} />
            </form>
            <div className="popup-footer">
                <button type="submit" className={`${entryValue && !waiting ? 'active' : ''} popup-button`} id="submit-button" disabled={waiting} onClick={submitNewExercise}>Submit</button>
            </div>
            <button type="button" className="popup-button" id="cancel-button" onClick={onClose}><RiCloseLargeFill /></button>
        </div>
    );
}