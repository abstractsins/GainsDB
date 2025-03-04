import { useState, useEffect } from "react";
import normalizeDate from "../normalizeDate";
import { DateObj, Workout } from "@/app/types/types";
import { toTitleCase } from "@/utils/utils";

import WorkoutCardGlance from "./WorkoutCardGlance";
import WorkoutCardDetails from "./WorkoutCardDetails";

interface Props {
    id: string;
    date: string;
    exercises: DateObj;
    index: number;
    workoutDetailsId: string | null;
    onClick: (e: React.MouseEvent<HTMLElement>) => void;
}

export default function WorkoutHistoryCard({ date, exercises, workoutDetailsId }: Props) {
    const [atGlance, setAtGlance] = useState(true);
    const [workoutDetails, setWorkoutDetails] = useState(false);

    useEffect(() => {
        if (Number(workoutDetailsId) === Number(exercises.id)) {
            setAtGlance(false);
            setWorkoutDetails(true);
        } else {
            setAtGlance(true);
            setWorkoutDetails(false);
        }
    }, [workoutDetailsId, exercises.id]);

    const dayOfWeek = (date: string) => {
        const newDate = new Date(date);
        const numDay = newDate.getDay();
        const daysArr = 'Sunday Monday Tuesday Wednesday Thursday Friday Saturday Sunday'.split(' ');
        const dayName = daysArr[numDay];
        return dayName;
    }

    // const editedDate = normalizeDate(date, false).replace(/,/g, '');


    return (
        <li className="workout-card">
            <div className="workout-card-header">
                <span className="day">{dayOfWeek(date)} {normalizeDate(date, false)}</span>
                {/* <span className="date">{editedDate}</span> */}
            </div>
            {atGlance && <WorkoutCardGlance exercises={exercises} />}
            {workoutDetails && <WorkoutCardDetails exercises={exercises} />}
        </li>
    );
}