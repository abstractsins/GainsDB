import WorkoutHistoryCard from "./WorkoutHistoryCard";
import { WorkoutsObj } from "@/app/types/types";
import { useState, useEffect } from "react";

interface Props {
    workoutsObj: WorkoutsObj;
}

export default function WorkoutHistoryList({ workoutsObj }: Props) {
    const [workoutDetailsId, setWorkoutDetailsId] = useState<string | null>(null);




    useEffect(() => {
        console.log('Updated workoutDetailsId:', workoutDetailsId);
        // setWorkoutDetailsId(workoutDetailsId);
    }, [workoutDetailsId]);




    const clickHandler = (e: React.MouseEvent<HTMLElement>) => {
        const target = e.currentTarget.closest('li.workout');
        if (!target) return;

        // close if clicking an open one
        if (target.classList.contains('active')) {
            target.classList.remove('active');
            setWorkoutDetailsId(null);
            return;
        } else { // open the closed one and close the open one

            console.log('target id ' + target.id);

            setWorkoutDetailsId(target.id);

            document.querySelectorAll('li.workout').forEach(el => el.classList.remove('active'));
            target.classList.toggle('active');
        }
    };

    return (
        <ul className="history">
            {workoutsObj.dates.length ? workoutsObj.dates.map((date, i) => (
                <li
                    key={workoutsObj[date].id}
                    className="workout"
                    id={workoutsObj[date].id}
                    onClick={clickHandler}
                >
                    <WorkoutHistoryCard
                        id={workoutsObj[date].id}
                        date={date}
                        exercises={workoutsObj[date]}
                        index={i}
                        workoutDetailsId={workoutDetailsId}
                    />
                </li>
            )) : (
                <h2>No workouts found!</h2>
            )}
        </ul>
    );
}
