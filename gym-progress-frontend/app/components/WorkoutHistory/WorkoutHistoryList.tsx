import WorkoutHistoryCard from "./WorkoutHistoryCard";
import { WorkoutsObj } from "@/app/types/types";
import { useState, useEffect } from "react";

interface Props {
    workoutsObj: WorkoutsObj | undefined;
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
            setWorkoutDetailsId(target.id);
            document.querySelectorAll('li.workout').forEach(el => el.classList.remove('active'));
            target.classList.toggle('active');
        }
    };



    return (
        <>
            {workoutsObj?.dates.length ? (
                <ul className="history">
                    {workoutsObj?.dates.map((date, i) => {
                        const workout = workoutsObj[date];
                        return (
                            <WorkoutHistoryCard
                                key={workout?.id}
                                id={workout?.id}
                                date={date}
                                exercises={workout}
                                index={i}
                                workoutDetailsId={workoutDetailsId}
                                onClick={clickHandler}
                            />
                        );
                    })}
                </ul>
            ) : (
                <p>No workouts found!</p>
            )}
        </>
    );    
}
