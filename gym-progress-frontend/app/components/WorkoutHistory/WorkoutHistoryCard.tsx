import { useState, useEffect } from "react";
import normalizeDate from "../normalizeDate";
import { DateObj, Workout } from "@/app/types/types";
import { toTitleCase } from "@/utils/utils";

interface Props {
    dateObj: DateObj;
    date: string;
    exercises: DateObj;
    index: number;
    workoutDetailsId: number;
}

export default function WorkoutHistoryCard({ exercises: dateObj, date, exercises, index, workoutDetailsId }: Props) {
    const [atGlance, setAtGlance] = useState(true);
    const [workoutDetails, setWorkoutDetails] = useState(false);

    useEffect(() => {
        if (Number(workoutDetailsId) === Number(dateObj.id)) {
            console.log('WE HAVE A MATCH');
            setAtGlance(false);
            setWorkoutDetails(true);
        } else {
            setAtGlance(true);
            setWorkoutDetails(false);
        }
    }, [workoutDetailsId, dateObj.id]);

    const dayOfWeek = (date: string) => {
        const newDate = new Date(date);
        const numDay = newDate.getDay();
        const daysArr = 'Sunday Monday Tuesday Wednesday Thursday Friday Saturday Sunday'.split(' ');
        const dayName = daysArr[numDay];
        return dayName;
    }

    const editedDate = normalizeDate(date, false).replace(/,/g, '');


    return (
        <div className="workout-card">
            <div className="workout-card-header">
                <h2>{dayOfWeek(date)}</h2>
                <span>{editedDate}</span>
            </div>
            {atGlance &&
                <div className="workout-card-glance-body">
                    <ul>
                        {
                            exercises.exercises.map(exercise => {
                                return <li key={`${exercise}`} className={`workout-card-exe-name`}>{toTitleCase(exercise)}</li>;
                            })
                        }
                    </ul>
                </div>
            }
            {workoutDetails &&
                <div className="workout-card-details-body">
                    <ul>
                        {
                            exercises.exercises.map(exercise => {
                                console.log(exercise)
                                return (
                                    <li className="exe-card-exe-container" key={exercise}>
                                        <span className="workout-card-exe-name workout-detail-exercise">{toTitleCase(exercise)}</span>
                                        <ul className="workout-detail-exercise-sets">
                                            {
                                                exercises[exercise].map(set => {
                                                    console.log(set);
                                                    const order = set[0] + (set[0] == 1 ? 'st' : (set[0] == 2 ? 'nd' : (set[0] == 3 ? 'rd' : 'th')));
                                                    const weight = set[1] + ' lbs';
                                                    const reps = set[2];
                                                    return <li key={set[0]} className="exe-card-set">
                                                        <span className="order">
                                                            {`${order}: `}
                                                        </span>
                                                        <span>{`${weight}`}</span>
                                                        <span>{` x ${reps} reps`}</span>
                                                    </li>
                                                })
                                            }
                                        </ul>
                                    </li>
                                );
                            })
                        }
                    </ul>
                </div>
            }
        </div>
    );
}