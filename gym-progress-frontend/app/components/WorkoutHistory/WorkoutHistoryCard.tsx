import { useState, useEffect } from "react";
import normalizeDate from "../normalizeDate";
import { DateObj, Workout } from "@/app/types/types";
import { toTitleCase } from "@/utils/utils";

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

    const editedDate = normalizeDate(date, false).replace(/,/g, '');


    return (
        <li className="workout-card">
            <div className="workout-card-header">
                <span className="day">{dayOfWeek(date)} {editedDate}</span>
                {/* <span className="date">{editedDate}</span> */}
            </div>
            {atGlance &&
                <div className="workout-card-glance-body">
                    <ul>
                        {exercises.exercises.map((exercise, index, a) => {
                            return <li key={`${exercise}`} className={`workout-card-exe-name`}>{`${toTitleCase(exercise)}${index === a.length-1 ? '' : ','}`}</li>;
                        })}
                    </ul>
                </div>
            }
            {workoutDetails && <WorkoutCardDetails exercises={exercises} />}
        </li>
    );
}