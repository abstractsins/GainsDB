import { useState } from "react";
import { normalizeDate } from "@/utils/utils";
import { DateObj, SetArr } from "@/app/types/types";

import WorkoutCardGlance from "./WorkoutCardGlance";
import WorkoutCardDetails from "./WorkoutCardDetails";

interface Props {
    id: string;
    date: string;
    workout: DateObj;
    index: number;
}

export default function WorkoutHistoryCard({ id, date, workout }: Props) {
    const [atGlance, setAtGlance] = useState(true);
    const [workoutDetails, setWorkoutDetails] = useState(false);
    const [exerciseData, setExerciseData] = useState<SetArr | null>(null);
    const [selectedExercise, setSelectedExercise] = useState<string | null>(null);
    const [category, setCategory] = useState<string | null>(null);

    const dayOfWeek = (date: string) => {
        const newDate = new Date(date);
        const numDay = newDate.getDay();
        const daysArr = 'Sunday Monday Tuesday Wednesday Thursday Friday Saturday Sunday'.split(' ');
        const dayName = daysArr[numDay];
        return dayName;
    }

    const atGlanceClickHandler = (e: React.MouseEvent<HTMLLIElement>) => {
        const selectedExe = e.currentTarget.innerText.toLowerCase();
        setSelectedExercise(selectedExe);
        setExerciseData(workout.sets[selectedExe]);
        workout.exercises.forEach(exeEntry => {
            if (exeEntry[0] === selectedExe) setCategory(exeEntry[1]); 
        })
        setAtGlance(false);
        setWorkoutDetails(true);
    }

    const closeDetails = () => {
        setAtGlance(true);
        setWorkoutDetails(false);
        setExerciseData(null);
    }

    return (
        <li className="workout-card" id={id}>
            <div className="workout-card-header">
                <span className="day">{dayOfWeek(date)} {normalizeDate(date, false)}</span>
            </div>
            {atGlance && 
                <WorkoutCardGlance 
                    exercises={workout} 
                    clickHandler={atGlanceClickHandler} 
                />}
            {workoutDetails &&
                <WorkoutCardDetails
                    exerciseCategory={category}
                    exerciseName={selectedExercise}
                    exerciseData={exerciseData}
                    onClose={closeDetails}
                />
            }
        </li>
    );
}