import { ChangeEvent, FormEvent, useState, useEffect, MouseEventHandler } from "react";
import { useSession } from "next-auth/react"; // Import NextAuth session
import { toTitleCase } from "@/utils/utils";
import ExercisesList from "@/app/components/ExercisesList";


interface Props {
    visible: boolean;
    isMobile: boolean;
    isXXLarge: boolean;
    exerciseName: string | null;
    onClose: null | (() => void);
}

interface FormData {
    date: string;
    exercise: string;
    weight: string;
    reps: string;
}

const getFormattedDate = () => {
    const today = new Date();
    today.setMinutes(today.getMinutes()); // Adjust for local timezone
    return today.toISOString().split("T")[0]; // Extract YYYY-MM-DD
};


export default function NewWorkoutFormContainer({ visible, isMobile, isXXLarge, onClose, exerciseName }: Props) {
    const { data: session, status } = useSession(); // Get authentication session
    const [validForm, setValidForm] = useState(false);
    const server = process.env.NEXT_PUBLIC_BACKEND;

    const [formData, setFormData] = useState({
        date: getFormattedDate(), // Sets the default date to today
        exercise: exerciseName?.replace(/-/g, ' ') || "",
        weight: "",
        reps: ""
    });

    const userId = session?.user?.id || localStorage.getItem("userId");

    if (typeof exerciseName === 'string') {
        exerciseName = exerciseName?.replace(/-/g, ' ');
        exerciseName = toTitleCase(exerciseName);
    }


    //* On Change
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData(prevFormData => ({
            ...prevFormData,
            [e.target.name]: e.target.value,
        }));
        console.log(e.target.name, e.target.value);
    };

    useEffect(() => {
        setValidForm(formComplete(formData));
    }, [formData]);


    //* SUBMIT
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const token = session?.user?.authToken || localStorage.getItem("token");
        
        if (!token) {
            alert("User not authenticated.");
            return;
        }

        if (Number(formData.weight) <= 0 || Number(formData.reps) <= 0) {
            alert("Weight and reps must be greater than zero!");
            return;
        }

        const payload = {
            workoutDate: formData.date,
            exercise: formData.exercise,
            weight: Number(formData.weight),
            reps: Number(formData.reps),
        };
        console.log("🟢 Final Payload:", payload);

        const res = await fetch(`${server}/api/user/${userId}/log-workout`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(payload),
        });

        const responseData = await res.json();
        console.log("🔵 API Response:", responseData);

        if (res.ok) {
            alert("Workout logged. Keep it going!");
            setFormData({ date: formData.date, exercise: formData.exercise, weight: "", reps: "" });
            if (visible && onClose !== null) {
                onClose();
            }
        } else {
            alert("Error logging workout.");
        }
    };


    const formComplete = (formData: FormData): boolean => {
        return (
            formData.date.trim() !== "" &&
            formData.exercise.trim() !== "" &&
            Number(formData.weight) > 0 &&  // Ensures weight is positive
            Number(formData.reps) > 0       // Ensures reps are positive
        );
    };
    


    return (
        <div className="new-workout-form-container">

            {isXXLarge &&

                <form onSubmit={handleSubmit} id="new-set-form" className="xxl">
                    <div className="form-xxl-row">

                        <input className="m-4 p-4 new-workout-field text-[14pt] lg:text-[20pt] w-[50px] xl:w-[250px]" type="date" name="date" value={formData.date} onChange={handleChange} required />

                        <ExercisesList
                            name="exercise"
                            value={`${exerciseName ? toTitleCase(exerciseName) : formData.exercise}`}
                            onChange={(value) => handleChange({ target: { name: "exercise", value } } as ChangeEvent<HTMLInputElement>)}
                        />

                        <input className="new-workout-field" type="number" name="weight" id="input-weight" placeholder="Weight (lb)" value={formData.weight} onChange={handleChange} required />
                        <input className="new-workout-field" type="number" name="reps" id="input-reps" placeholder="Reps" value={formData.reps} onChange={handleChange} required />

                    </div>

                    <div className="form-xxl-row">
                        <button
                            className={`new-workout-button ${validForm ? "active" : ""}`}
                            type="submit"
                            disabled={!validForm}
                        >
                            Log Workout
                        </button>
                    </div>

                </form>
            }

            {(!isXXLarge || isMobile )&&
                <form onSubmit={handleSubmit} id="new-set-form" className="flex flex-col items-center w-[100%] md:w-[80%] lg:w-[65%] p-8">

                    <div className="form-xl-row">
                        <input className="new-workout-field" type="date" name="date" value={formData.date} onChange={handleChange} required />
                    </div>

                    <div className="form-xl-row">
                        <ExercisesList
                            name="exercise"
                            value={exerciseName || formData.exercise}
                            onChange={(value) => handleChange({ target: { name: "exercise", value } } as ChangeEvent<HTMLInputElement>)}
                        />
                    </div>

                    <div className="form-xl-row" id="weight-reps">
                        <input className="new-workout-field" type="number" name="weight" id="input-weight" placeholder="Weight (lb)" min="1" value={formData.weight} onChange={handleChange} required />
                        <input className="new-workout-field" type="number" name="reps" id="input-reps" placeholder="Reps" min="1" value={formData.reps} onChange={handleChange} required />
                    </div>

                    <div className="form-xl-row" id="footer">
                        <button
                            className={`new-workout-button ${validForm ? "active" : ""}`}
                            type="submit"
                            disabled={!validForm}
                        >
                            Log Workout
                        </button>
                    </div>

                </form>

            }
        </div>
    )
}